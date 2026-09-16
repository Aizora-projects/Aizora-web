import { notFound } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft, User, MapPin, PackageCheck, MessageCircle } from 'lucide-react';
import OrderStatusChanger from '@/components/admin/OrderStatusChanger';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const adminClient = createAdminClient();

  const { data: order } = await adminClient
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('id', id)
    .single();

  if (!order) notFound();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-admin-border/60">
        <Link
          href="/admin/orders"
          className="p-2 -ml-2 text-stone-500 hover:text-stone-900 hover:bg-white rounded-lg border border-transparent hover:border-admin-border transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl sm:text-2xl font-heading font-bold text-stone-900 tracking-[0.05em] uppercase">
            Order #AIZ-{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Placed on{' '}
            {new Date(order.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Order Items List (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900 mb-4 flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-tan" />
              <span>Purchased Items</span>
            </h2>

            <div className="divide-y divide-admin-border/60">
              {order.items?.map(
                (item: {
                  id: string;
                  product_image_url: string | null;
                  product_name: string;
                  quantity: number;
                  price_at_purchase: number;
                  total: number;
                }) => (
                  <div key={item.id} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
                    {item.product_image_url ? (
                      <img
                        src={item.product_image_url}
                        alt={item.product_name}
                        className="w-14 h-16 object-cover rounded-md bg-stone-100 border border-admin-border/60 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-16 bg-[#FAF8F5] border border-admin-border/60 rounded-md flex items-center justify-center text-stone-400 text-[10px] flex-shrink-0">
                        No img
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-stone-900 truncate">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Qty: {item.quantity} × {formatPrice(Number(item.price_at_purchase))}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-stone-900">
                      {formatPrice(Number(item.total))}
                    </span>
                  </div>
                )
              )}
            </div>

            <div className="border-t border-admin-border/80 pt-4 mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>{order.shipping_cost > 0 ? formatPrice(order.shipping_cost) : 'FREE'}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-admin-border/60">
                <span>Total Amount</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info Cards (1 col) */}
        <div className="space-y-6">
          {/* Status Changer & WhatsApp Notifier */}
          <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-3">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900">
              Fulfillment & WhatsApp Update
            </h2>
            <OrderStatusChanger
              orderId={order.id}
              currentStatus={order.status}
              customerName={order.customer_name}
              customerPhone={order.customer_phone}
              total={Number(order.total)}
              orderCode={`#AIZ-${order.id.slice(0, 8).toUpperCase()}`}
              shippingCity={order.shipping_city}
            />
          </div>

          {/* Customer Details */}
          <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-3">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900 flex items-center gap-2">
              <User className="w-4 h-4 text-tan" />
              <span>Customer Details</span>
            </h2>
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-stone-900">{order.customer_name}</p>
              {order.customer_phone && (
                <div className="flex items-center justify-between pt-1">
                  <p className="text-stone-600 font-mono text-xs">{order.customer_phone}</p>
                  <a
                    href={`https://wa.me/${
                      order.customer_phone.replace(/[^0-9]/g, '').length === 10
                        ? '91' + order.customer_phone.replace(/[^0-9]/g, '')
                        : order.customer_phone.replace(/[^0-9]/g, '')
                    }?text=${encodeURIComponent(
                      `Hello ${order.customer_name}! 🌸 AIZORA Customer Care regarding order #AIZ-${order.id.slice(0, 8).toUpperCase()}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#25D366] hover:underline"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              )}
              {order.customer_email && (
                <p className="text-stone-500 text-xs">{order.customer_email}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border border-admin-border rounded-xl p-5 sm:p-6 shadow-2xs space-y-3">
            <h2 className="text-xs tracking-[0.15em] uppercase font-bold text-stone-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-tan" />
              <span>Delivery Address</span>
            </h2>
            <div className="text-xs text-stone-600 leading-relaxed bg-[#FAF8F5] p-3 rounded-lg border border-admin-border/60">
              <p className="font-medium text-stone-900 mb-1">{order.customer_name}</p>
              <p>{order.shipping_address}</p>
              <p>
                {order.shipping_city}, {order.shipping_state}
              </p>
              <p className="font-semibold text-stone-900 mt-1">Pincode: {order.shipping_pincode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
