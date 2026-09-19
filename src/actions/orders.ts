'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export interface OrderItemInput {
  product_id?: string;
  product_name: string;
  product_image_url?: string | null;
  variant_info?: string | null;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  notes?: string;
  items: OrderItemInput[];
}

export async function createWhatsAppOrder(input: CreateOrderInput) {
  try {
    const {
      customer_name,
      customer_phone,
      customer_email,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_pincode,
      notes,
      items,
    } = input;

    if (!customer_name || !customer_phone || !shipping_address || !shipping_city || !shipping_pincode) {
      return { error: 'Please fill in all required delivery fields.' };
    }

    if (!items || items.length === 0) {
      return { error: 'No items in order.' };
    }

    const adminClient = createAdminClient();

    // 1. Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping_cost = 0; // Free Pan India Delivery
    const total = subtotal + shipping_cost;

    // 2. Fetch WhatsApp number from site_settings (or default)
    const { data: settingData } = await adminClient
      .from('site_settings')
      .select('value')
      .eq('key', 'whatsapp_number')
      .single();

    const rawNumber = settingData?.value || '919876543210';
    // Clean phone number (strip spaces, dashes, plus signs)
    const whatsappNumber = rawNumber.replace(/[^0-9]/g, '');

    // 3. Create order in Supabase
    const emailToSave = customer_email?.trim() || `${customer_phone.replace(/[^0-9]/g, '')}@guest.aizora.in`;

    const { data: order, error: orderError } = await adminClient
      .from('orders')
      .insert({
        customer_name: customer_name.trim(),
        customer_phone: customer_phone.trim(),
        customer_email: emailToSave,
        shipping_address: shipping_address.trim(),
        shipping_city: shipping_city.trim(),
        shipping_state: shipping_state.trim() || 'India',
        shipping_pincode: shipping_pincode.trim(),
        subtotal,
        shipping_cost,
        total,
        status: 'pending',
        notes: notes?.trim() || null,
      })
      .select('id, created_at')
      .single();

    if (orderError || !order) {
      console.error('Order creation error:', orderError);
      return { error: 'Failed to create order. Please try again.' };
    }

    // 4. Create order items (with auto-lookup of product image if missing)
    const missingImageProductIds = items
      .filter((i) => !i.product_image_url && i.product_id)
      .map((i) => i.product_id as string);

    const imageMap = new Map<string, string>();
    if (missingImageProductIds.length > 0) {
      try {
        const { data: foundImages } = await adminClient
          .from('product_images')
          .select('product_id, secure_url, is_primary, sort_order')
          .in('product_id', missingImageProductIds);

        if (foundImages && foundImages.length > 0) {
          // Sort to prioritize is_primary = true
          foundImages.sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0));
          for (const img of foundImages) {
            if (!imageMap.has(img.product_id) && img.secure_url) {
              imageMap.set(img.product_id, img.secure_url);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching fallback product images for order:', err);
      }
    }

    const orderItemsToInsert = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id || null,
      product_name: item.variant_info ? `${item.product_name} (${item.variant_info})` : item.product_name,
      product_image_url:
        item.product_image_url || (item.product_id ? imageMap.get(item.product_id) : null) || null,
      quantity: item.quantity,
      price_at_purchase: item.price,
      total: item.price * item.quantity,
    }));

    const { error: itemsError } = await adminClient
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error('Order items error:', itemsError);
    }

    // 5. Generate formatted Order ID (e.g. #AIZ-492182)
    const shortId = order.id.slice(0, 8).toUpperCase();
    const orderCode = `#AIZ-${shortId}`;

    // 6. Build the formatted WhatsApp message
    let message = `*NEW ORDER — AIZORA*\n`;
    message += `──────────────────\n`;
    message += `*Order Ref:* ${orderCode}\n\n`;

    message += `*🛍️ Items Ordered:*\n`;
    items.forEach((item, idx) => {
      const variant = item.variant_info ? ` [${item.variant_info}]` : '';
      message += `${idx + 1}. *${item.product_name}*${variant}\n`;
      message += `   Qty: ${item.quantity} × ₹${item.price.toLocaleString('en-IN')} = ₹${(item.quantity * item.price).toLocaleString('en-IN')}\n`;
    });

    message += `\n*💰 Order Total:* ₹${total.toLocaleString('en-IN')}\n`;
    message += `*🚚 Shipping:* Free Pan India Delivery\n`;
    message += `*💵 Payment:* Prepaid (UPI / WhatsApp Pay)\n`;
    message += `──────────────────\n`;
    message += `*👤 Delivery Details:*\n`;
    message += `*Name:* ${customer_name.trim()}\n`;
    message += `*Phone:* ${customer_phone.trim()}\n`;
    message += `*Address:* ${shipping_address.trim()}\n`;
    message += `*City/State:* ${shipping_city.trim()}, ${shipping_state.trim() || ''} - ${shipping_pincode.trim()}\n`;

    if (notes?.trim()) {
      message += `*Notes:* ${notes.trim()}\n`;
    }

    message += `──────────────────\n`;
    message += `Please confirm my order. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    revalidatePath('/admin/orders');

    return {
      success: true,
      orderId: order.id,
      orderCode,
      whatsappUrl,
    };
  } catch (error) {
    console.error('createWhatsAppOrder exception:', error);
    return { error: 'An unexpected error occurred while placing your order.' };
  }
}
