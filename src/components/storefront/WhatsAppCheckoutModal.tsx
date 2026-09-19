'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, MessageCircle, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { createWhatsAppOrder, type OrderItemInput } from '@/actions/orders';
import { formatPrice } from '@/lib/utils';

interface WhatsAppCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItemInput[];
  onSuccess?: () => void;
}

export default function WhatsAppCheckoutModal({
  isOpen,
  onClose,
  items,
  onSuccess,
}: WhatsAppCheckoutModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderResult, setOrderResult] = useState<{
    orderId: string;
    orderCode: string;
    whatsappUrl: string;
  } | null>(null);

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      setError('Please fill in all required delivery fields.');
      return;
    }

    // Validate 10-digit Indian phone
    const cleanPhone = formData.phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    setIsSubmitting(true);

    const result = await createWhatsAppOrder({
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email || undefined,
      shipping_address: formData.address,
      shipping_city: formData.city,
      shipping_state: formData.state || 'India',
      shipping_pincode: formData.pincode,
      notes: formData.notes,
      items,
    });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.success && result.whatsappUrl) {
      setOrderResult({
        orderId: result.orderId,
        orderCode: result.orderCode,
        whatsappUrl: result.whatsappUrl,
      });

      if (onSuccess) {
        onSuccess();
      }

      // Automatically open WhatsApp in new tab/window
      window.open(result.whatsappUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-ivory border border-border-dark/60 rounded-md shadow-2xl overflow-hidden my-8 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-cream/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-4 h-4 fill-[#25D366]" />
            </div>
            <div>
              <h3 className="font-heading text-base sm:text-lg font-bold tracking-[0.05em] uppercase text-brown-dark">
                Express Checkout
              </h3>
              <p className="text-[11px] text-brown-light font-body">
                Prepaid Order via WhatsApp (UPI / GPay / PhonePe)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-brown-light hover:text-brown-dark transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {orderResult ? (
            /* Success State */
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="font-heading text-2xl font-bold text-brown-dark">
                  Order Registered!
                </h4>
                <p className="text-sm font-medium text-bronze mt-1">
                  Order ID: {orderResult.orderCode}
                </p>
                <p className="text-xs text-brown-light mt-2 max-w-md mx-auto leading-relaxed">
                  Your order has been recorded in our system. WhatsApp should have opened with your order message. If not, tap the button below to send your order.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={orderResult.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white px-6 py-3.5 text-xs font-semibold tracking-wider uppercase rounded-sm shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  Open WhatsApp Chat
                </a>
                <button
                  onClick={onClose}
                  className="px-6 py-3.5 text-xs tracking-wider uppercase border border-border text-brown-dark hover:bg-cream transition-colors rounded-sm"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Order Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Order Items Preview */}
              <div className="bg-cream/60 border border-border/80 rounded-sm p-3.5 space-y-2.5">
                <p className="text-[10px] tracking-[0.2em] uppercase text-brown-light font-medium">
                  Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
                </p>
                <div className="space-y-2 divide-y divide-border/60 max-h-40 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.product_image_url ? (
                          <div className="relative w-10 h-12 flex-shrink-0 bg-cream rounded-xs overflow-hidden">
                            <Image
                              src={item.product_image_url}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                        ) : null}
                        <div className="min-w-0">
                          <p className="font-medium text-brown-dark truncate">{item.product_name}</p>
                          <p className="text-[11px] text-brown-light">
                            {item.variant_info ? `${item.variant_info} • ` : ''}Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-semibold text-brown-dark flex-shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/80 pt-2.5 flex items-center justify-between text-xs font-semibold text-brown-dark">
                  <span>Total Payable:</span>
                  <span className="text-sm font-bold text-bronze">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Delivery Details Form */}
              <div className="space-y-3.5">
                <p className="text-[11px] tracking-[0.18em] uppercase text-brown-dark font-semibold">
                  Delivery Address
                </p>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-sm">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-brown-light font-medium uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Priya Sharma"
                      className="w-full bg-white border border-border px-3 py-2 text-xs text-brown-dark rounded-sm focus:outline-none focus:border-bronze"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-brown-light font-medium uppercase tracking-wider mb-1">
                      WhatsApp Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full bg-white border border-border px-3 py-2 text-xs text-brown-dark rounded-sm focus:outline-none focus:border-bronze"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-brown-light font-medium uppercase tracking-wider mb-1">
                    Street Address / Flat / Building *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House/Flat No, Building Name, Street, Landmark"
                    className="w-full bg-white border border-border px-3 py-2 text-xs text-brown-dark rounded-sm focus:outline-none focus:border-bronze resize-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <div>
                    <label className="block text-[11px] text-brown-light font-medium uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="City"
                      className="w-full bg-white border border-border px-3 py-2 text-xs text-brown-dark rounded-sm focus:outline-none focus:border-bronze"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-brown-light font-medium uppercase tracking-wider mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="State"
                      className="w-full bg-white border border-border px-3 py-2 text-xs text-brown-dark rounded-sm focus:outline-none focus:border-bronze"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-brown-light font-medium uppercase tracking-wider mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      placeholder="6 Digits"
                      className="w-full bg-white border border-border px-3 py-2 text-xs text-brown-dark rounded-sm focus:outline-none focus:border-bronze"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-brown-light font-medium uppercase tracking-wider mb-1">
                    Special Notes / Sizing (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="e.g. Please deliver between 2-6 PM"
                    className="w-full bg-white border border-border px-3 py-2 text-xs text-brown-dark rounded-sm focus:outline-none focus:border-bronze"
                  />
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-between text-[11px] text-brown-muted bg-cream/40 p-2.5 rounded-sm border border-border/50">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-bronze" />
                  Free Pan India Delivery
                </span>
                <span>•</span>
                <span>Prepaid via UPI / WhatsApp</span>
                <span>•</span>
                <span>Instant Confirmation</span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3.5 text-xs font-semibold tracking-[0.15em] uppercase rounded-sm shadow-md transition-all duration-300 disabled:opacity-50 group"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Recording Order...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Confirm Order on WhatsApp</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
