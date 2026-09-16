'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Truck,
  ShieldCheck,
  MessageCircle,
  Loader2,
  CreditCard,
  Banknote,
  Package,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createWhatsAppOrder } from '@/actions/orders';
import { formatPrice } from '@/lib/utils';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Chandigarh',
  'Jammu and Kashmir',
  'Ladakh',
];

export default function CheckoutClient() {
  const router = useRouter();
  const { items, itemCount, subtotal, total, clearCart } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    notes: '',
    paymentMethod: 'cod', // 'cod' | 'whatsapp_pay'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<{
    orderId: string;
    orderCode: string;
    whatsappUrl: string;
    placedItems: typeof items;
    placedTotal: number;
    placedData: typeof formData;
  } | null>(null);

  // If order was successfully placed, render Order Confirmation view
  if (orderResult) {
    return (
      <div className="bg-ivory min-h-screen py-10 lg:py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Success Card */}
          <div className="bg-white border border-border rounded-sm shadow-xl p-6 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto animate-bounce-short">
              <CheckCircle2 className="w-9 h-9 sm:w-11 sm:h-11" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-cream text-brown-dark rounded-full text-[11px] font-semibold tracking-widest uppercase mb-2 border border-border">
                Order Placed Successfully
              </span>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-brown-dark tracking-wide">
                Thank You for Your Order!
              </h1>
              <p className="text-sm font-mono text-bronze mt-2 font-bold">
                Order Reference: {orderResult.orderCode}
              </p>
              <p className="text-xs sm:text-sm text-brown-light mt-2 max-w-lg mx-auto leading-relaxed">
                Your order has been registered in our system. You can connect with our team on WhatsApp for instant dispatch tracking and order updates.
              </p>
            </div>

            {/* WhatsApp Call to Action */}
            <div className="p-4 sm:p-5 bg-[#FAF8F5] border border-[#25D366]/30 rounded-lg max-w-md mx-auto space-y-3">
              <div className="flex items-center justify-center gap-2 text-[#25D366] font-bold text-xs tracking-wider uppercase">
                <MessageCircle className="w-4 h-4 fill-[#25D366]" />
                <span>Instant WhatsApp Confirmation</span>
              </div>
              <p className="text-xs text-brown-light">
                Click below to send your order receipt to our WhatsApp support and confirm delivery scheduling.
              </p>
              <a
                href={orderResult.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 px-6 rounded-sm text-xs uppercase tracking-widest font-bold shadow-md transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Open WhatsApp to Confirm</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Order Details Summary */}
            <div className="border-t border-border/80 pt-6 text-left space-y-4">
              <h2 className="text-xs font-bold tracking-[0.15em] uppercase text-brown-dark">
                Order Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600 bg-cream/50 p-4 rounded-sm border border-border/60">
                <div>
                  <p className="font-semibold text-brown-dark mb-1">Delivery Address</p>
                  <p>{orderResult.placedData.name}</p>
                  <p>{orderResult.placedData.address}</p>
                  <p>
                    {orderResult.placedData.city}, {orderResult.placedData.state} -{' '}
                    {orderResult.placedData.pincode}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-brown-dark">
                    Phone: {orderResult.placedData.phone}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-brown-dark mb-1">Payment & Shipping</p>
                  <p>
                    Payment Mode:{' '}
                    <strong>
                      {orderResult.placedData.paymentMethod === 'cod'
                        ? 'Cash on Delivery (COD)'
                        : 'WhatsApp Pay / UPI'}
                    </strong>
                  </p>
                  <p>Shipping: Complimentary Pan-India Delivery</p>
                  <p className="mt-2 text-sm font-bold text-brown-dark">
                    Total: {formatPrice(orderResult.placedTotal)}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-border/60">
                {orderResult.placedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 py-3">
                    <div className="relative w-12 h-16 bg-cream rounded-xs overflow-hidden flex-shrink-0 border border-border/60">
                      {item.product_image ? (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-sand">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-brown-dark truncate">
                        {item.product_name}
                      </p>
                      <p className="text-[11px] text-brown-light">
                        Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}{' '}
                        {item.color ? `| Color: ${item.color}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-brown-dark">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Return / Shopping Links */}
            <div className="border-t border-border/80 pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/shop"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brown-dark hover:bg-bronze text-white px-8 py-3 text-xs tracking-widest uppercase font-semibold transition-colors rounded-xs"
              >
                <span>Continue Shopping</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (items.length === 0) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-cream text-sand flex items-center justify-center mx-auto mb-4 border border-border">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-2xl text-brown-dark font-bold mb-2">
            Your Shopping Bag is Empty
          </h1>
          <p className="text-xs sm:text-sm text-brown-light mb-8 font-body leading-relaxed">
            Please add items to your shopping bag before proceeding to checkout.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-brown-dark text-cream px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-bronze transition-colors rounded-xs shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shop</span>
          </Link>
        </div>
      </div>
    );
  }

  const orderItemsForAction = items.map((item) => {
    const variantParts = [
      item.size ? `Size: ${item.size}` : '',
      item.color ? `Color: ${item.color}` : '',
    ].filter(Boolean);
    return {
      product_id: item.product_id,
      product_name: item.product_name,
      product_image_url: item.product_image || null,
      variant_info: variantParts.join(', ') || undefined,
      quantity: item.quantity,
      price: item.price,
    };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim() ||
      !formData.pincode.trim()
    ) {
      setError('Please fill in all required delivery fields.');
      return;
    }

    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    const cleanPincode = formData.pincode.replace(/[^0-9]/g, '');
    if (cleanPincode.length !== 6) {
      setError('Please enter a valid 6-digit Indian pincode.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createWhatsAppOrder({
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email || undefined,
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_state: formData.state || 'India',
        shipping_pincode: formData.pincode,
        notes: `[Payment Method: ${formData.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'WhatsApp Pay / UPI'}] ${formData.notes || ''}`.trim(),
        items: orderItemsForAction,
      });

      setIsSubmitting(false);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success && result.whatsappUrl) {
        const savedItems = [...items];
        const savedTotal = total;
        const savedData = { ...formData };

        // Clear shopping bag
        clearCart();

        setOrderResult({
          orderId: result.orderId,
          orderCode: result.orderCode,
          whatsappUrl: result.whatsappUrl,
          placedItems: savedItems,
          placedTotal: savedTotal,
          placedData: savedData,
        });

        // Open WhatsApp in new tab
        window.open(result.whatsappUrl, '_blank');
      }
    } catch (err) {
      setIsSubmitting(false);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Top Header / Breadcrumb */}
      <div className="border-b border-border/80 bg-white/70 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-xs tracking-wider uppercase text-brown-light hover:text-brown-dark transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Shopping Bag</span>
          </Link>

          {/* Stepper Indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold uppercase tracking-wider">
            <span className="text-brown-light">1. Bag</span>
            <span className="text-brown-light">/</span>
            <span className="text-bronze font-bold">2. Checkout</span>
            <span className="text-brown-light">/</span>
            <span className="text-brown-light">3. Confirmation</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold tracking-[0.08em] uppercase text-brown-dark mb-2">
          Express Checkout
        </h1>
        <p className="text-xs sm:text-sm text-brown-light mb-8">
          Complete your delivery details below to place your order with Free Pan-India Delivery.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-sm flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Delivery & Payment Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Information Card */}
              <div className="bg-white border border-border rounded-sm p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-border/80">
                  <div className="w-7 h-7 rounded-full bg-bronze/10 text-bronze flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h2 className="font-heading text-sm tracking-[0.12em] uppercase font-bold text-brown-dark">
                    Delivery Address
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brown-dark mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-[#FAF8F5] border border-border rounded-xs px-3.5 py-2.5 text-sm text-brown-dark focus:bg-white focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brown-dark mb-1.5">
                      Mobile / WhatsApp Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value.replace(/[^0-9]/g, ''),
                          })
                        }
                        placeholder="9876543210"
                        className="w-full bg-[#FAF8F5] border border-border rounded-xs pl-12 pr-3.5 py-2.5 text-sm text-brown-dark font-mono focus:bg-white focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brown-dark mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="priya@example.com"
                      className="w-full bg-[#FAF8F5] border border-border rounded-xs px-3.5 py-2.5 text-sm text-brown-dark focus:bg-white focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze"
                    />
                  </div>

                  {/* Shipping Address */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-brown-dark mb-1.5">
                      Street Address / House No. / Building *
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Flat / House No., Floor, Building Name, Street / Locality"
                      className="w-full bg-[#FAF8F5] border border-border rounded-xs px-3.5 py-2.5 text-sm text-brown-dark focus:bg-white focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze"
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brown-dark mb-1.5">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Mumbai, Bengaluru"
                      className="w-full bg-[#FAF8F5] border border-border rounded-xs px-3.5 py-2.5 text-sm text-brown-dark focus:bg-white focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brown-dark mb-1.5">
                      State *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full bg-[#FAF8F5] border border-border rounded-xs px-3.5 py-2.5 text-sm text-brown-dark focus:bg-white focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brown-dark mb-1.5">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          pincode: e.target.value.replace(/[^0-9]/g, ''),
                        })
                      }
                      placeholder="e.g. 400001"
                      className="w-full bg-[#FAF8F5] border border-border rounded-xs px-3.5 py-2.5 text-sm text-brown-dark font-mono focus:bg-white focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze"
                    />
                  </div>

                  {/* Landmark / Notes */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-brown-dark mb-1.5">
                      Landmark / Instructions
                    </label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="e.g. Near Metro Station / Ring bell"
                      className="w-full bg-[#FAF8F5] border border-border rounded-xs px-3.5 py-2.5 text-sm text-brown-dark focus:bg-white focus:outline-none focus:border-bronze focus:ring-1 focus:ring-bronze"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white border border-border rounded-sm p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-border/80">
                  <div className="w-7 h-7 rounded-full bg-bronze/10 text-bronze flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h2 className="font-heading text-sm tracking-[0.12em] uppercase font-bold text-brown-dark">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-3">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-all ${
                      formData.paymentMethod === 'cod'
                        ? 'border-brown-dark bg-cream/40 shadow-2xs'
                        : 'border-border bg-white hover:border-bronze'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className="mt-0.5 text-brown-dark focus:ring-bronze"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-brown-dark flex items-center gap-1.5">
                          <Banknote className="w-4 h-4 text-emerald-600" />
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                          Popular
                        </span>
                      </div>
                      <p className="text-xs text-brown-light mt-1">
                        Pay with cash or UPI QR code at your doorstep upon package arrival.
                      </p>
                    </div>
                  </label>

                  {/* WhatsApp Pay / UPI */}
                  <label
                    className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-all ${
                      formData.paymentMethod === 'whatsapp_pay'
                        ? 'border-brown-dark bg-cream/40 shadow-2xs'
                        : 'border-border bg-white hover:border-bronze'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="whatsapp_pay"
                      checked={formData.paymentMethod === 'whatsapp_pay'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'whatsapp_pay' })}
                      className="mt-0.5 text-brown-dark focus:ring-bronze"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-brown-dark flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4 text-[#25D366] fill-[#25D366]" />
                          WhatsApp Pay / UPI Quick Pay
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                          Instant
                        </span>
                      </div>
                      <p className="text-xs text-brown-light mt-1">
                        Receive instant UPI payment details directly on WhatsApp for 1-click confirmation.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="flex items-center gap-2 p-3 bg-white border border-border/80 rounded-sm">
                  <Truck className="w-4 h-4 text-bronze flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-brown-dark">Free Pan-India Delivery</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white border border-border/80 rounded-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-brown-dark">100% Quality Inspected</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-white border border-border/80 rounded-sm">
                  <Package className="w-4 h-4 text-bronze flex-shrink-0" />
                  <span className="text-[11px] font-semibold text-brown-dark">Secure Luxury Box</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Order Summary (5 cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div className="bg-white border border-border rounded-sm p-6 shadow-sm space-y-4">
                <h2 className="font-heading text-xs tracking-[0.15em] uppercase font-bold text-brown-dark pb-3 border-b border-border/80">
                  Order Summary ({itemCount} {itemCount === 1 ? 'Item' : 'Items'})
                </h2>

                {/* Items List */}
                <div className="divide-y divide-border/60 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const itemKey = `${item.product_id}_${item.size || ''}_${item.color || ''}`;
                    return (
                      <div key={itemKey} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                        <div className="relative w-14 h-18 bg-cream rounded-xs overflow-hidden flex-shrink-0 border border-border/60">
                          {item.product_image ? (
                            <Image
                              src={item.product_image}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-sand">
                              No img
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-brown-dark truncate">
                            {item.product_name}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[10px] text-brown-light font-medium uppercase">
                            <span>Qty: {item.quantity}</span>
                            {item.size && (
                              <span className="bg-cream px-1.5 py-0.5 rounded-xs border border-border">
                                {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="bg-cream px-1.5 py-0.5 rounded-xs border border-border">
                                {item.color}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-brown-dark mt-1.5">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price Breakdown */}
                <div className="border-t border-border/80 pt-4 space-y-2 text-xs text-brown-light">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-brown-dark">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pan-India Shipping</span>
                    <span className="font-bold text-emerald-700 uppercase tracking-wider text-[11px]">
                      FREE
                    </span>
                  </div>
                  <div className="border-t border-border/80 pt-3 flex justify-between text-sm font-bold text-brown-dark">
                    <span>Total Amount</span>
                    <span className="text-base text-bronze">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Place Order CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-bronze hover:bg-bronze-dark text-white py-4 px-6 text-xs tracking-[0.18em] uppercase font-bold transition-all shadow-md hover:shadow-lg rounded-xs disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Placing Order...</span>
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4 fill-white" />
                      <span>Place Order ({formatPrice(total)})</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-brown-light/80 leading-tight">
                  By clicking Place Order, your order will be registered and a WhatsApp confirmation will open.
                </p>
              </div>

              {/* Concierge Help Card */}
              <div className="p-4 bg-cream/70 border border-border rounded-sm text-xs text-brown-dark flex items-center justify-between">
                <div>
                  <p className="font-bold uppercase tracking-wider text-[11px]">Need styling or sizing help?</p>
                  <p className="text-brown-light text-[11px] mt-0.5">Chat directly with an AIZORA stylist.</p>
                </div>
                <a
                  href="https://wa.me/919876543210?text=Hello%20AIZORA%2C%20I%20have%20a%20question%20regarding%20checkout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white border border-border hover:border-bronze rounded-xs font-semibold text-[11px] text-brown-dark flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366] fill-[#25D366]" />
                  <span>Chat</span>
                </a>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
