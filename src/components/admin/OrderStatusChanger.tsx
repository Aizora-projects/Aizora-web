'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Send,
  Sparkles,
  Phone,
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const STATUS_CONFIG: Record<
  string,
  { label: string; badge: string; dot: string; icon: string }
> = {
  pending: {
    label: 'Pending',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: '⏳',
  },
  confirmed: {
    label: 'Confirmed',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: '🌸',
  },
  processing: {
    label: 'Processing / Packed',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    dot: 'bg-blue-500',
    icon: '📦',
  },
  shipped: {
    label: 'Shipped / In Transit',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    dot: 'bg-purple-500',
    icon: '🚚',
  },
  delivered: {
    label: 'Delivered',
    badge: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-600',
    icon: '✨',
  },
  cancelled: {
    label: 'Cancelled',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    dot: 'bg-rose-500',
    icon: '❌',
  },
};

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

interface OrderStatusChangerProps {
  orderId: string;
  currentStatus: string;
  customerName?: string;
  customerPhone?: string | null;
  total?: number;
  orderCode?: string;
  shippingCity?: string;
}

export default function OrderStatusChanger({
  orderId,
  currentStatus,
  customerName = 'Customer',
  customerPhone,
  total = 0,
  orderCode = `#AIZ-${orderId.slice(0, 8).toUpperCase()}`,
  shippingCity = '',
}: OrderStatusChangerProps) {
  const [status, setStatus] = useState(currentStatus);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [customPhone, setCustomPhone] = useState(customerPhone || '');
  const router = useRouter();

  // Generate intelligent pre-filled message based on status
  const generateMessage = (targetStatus: string): string => {
    const formattedTotal = total > 0 ? `₹${total.toLocaleString('en-IN')}` : '';

    switch (targetStatus) {
      case 'confirmed':
        return (
          `Hello ${customerName}! 🌸\n\n` +
          `Thank you for shopping with *AIZORA*.\n` +
          `Your order *${orderCode}* ${formattedTotal ? `amounting to *${formattedTotal}* ` : ''}has been *CONFIRMED*! ✨\n\n` +
          `Our team is now handcrafting and preparing your items with great care. We will share your dispatch tracking details as soon as it leaves our warehouse.\n\n` +
          `If you have any styling or sizing queries, feel free to reply to this message.`
        );

      case 'processing':
        return (
          `Hello ${customerName}! 📦\n\n` +
          `Update on your *AIZORA* order *${orderCode}*:\n` +
          `Your items have passed our quality check and are currently being safely packed for dispatch. We will notify you once your courier parcel is picked up.`
        );

      case 'shipped':
        return (
          `Hello ${customerName}! 🚚 Great news!\n\n` +
          `Your *AIZORA* order *${orderCode}* has been *DISPATCHED* and is on its way${shippingCity ? ` to ${shippingCity}` : ''}!\n\n` +
          `• Courier Partner: BlueDart / DTDC\n` +
          `• Tracking ID: [Add Tracking Number Here]\n` +
          `• Expected Delivery: 3 to 5 business days\n\n` +
          `Please ensure someone is available at your delivery address to receive the package. Thank you for choosing AIZORA! ✨`
        );

      case 'delivered':
        return (
          `Hello ${customerName}! 🎉\n\n` +
          `Your *AIZORA* order *${orderCode}* has been marked as *DELIVERED*!\n\n` +
          `We truly hope you adore your new pieces. We would be thrilled to see how you style them — feel free to tag us on Instagram *@aizorafashion* for a feature! 🌸\n\n` +
          `Thank you for being a valued part of our AIZORA family.`
        );

      case 'cancelled':
        return (
          `Hello ${customerName},\n\n` +
          `Your *AIZORA* order *${orderCode}* has been *CANCELLED* as requested.\n\n` +
          `If you have any questions or would like to re-order, please reply to this message and our support team will assist you immediately.`
        );

      case 'pending':
      default:
        return (
          `Hello ${customerName}! 🌸\n\n` +
          `Thank you for your order *${orderCode}* ${formattedTotal ? `for *${formattedTotal}* ` : ''}with *AIZORA*.\n` +
          `We have received your order details and our team will be confirming your delivery shortly.`
        );
    }
  };

  const [messageText, setMessageText] = useState(generateMessage(currentStatus));

  const handleChangeStatus = async (newStatus: string) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/orders/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
        // Automatically switch the prefill message to match the new status
        setMessageText(generateMessage(newStatus));
        router.refresh();
      } else {
        alert('Failed to update status. Please try again.');
      }
    } catch {
      alert('Failed to update status. Please try again.');
    }
    setIsSaving(false);
  };

  // Clean phone number for WhatsApp wa.me link
  const rawPhone = customPhone || customerPhone || '';
  const digitsOnly = rawPhone.replace(/[^0-9]/g, '');
  const cleanPhone =
    digitsOnly.length === 10
      ? `91${digitsOnly}`
      : digitsOnly.startsWith('91') && digitsOnly.length === 12
      ? digitsOnly
      : digitsOnly;

  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(messageText)}`
    : null;

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <div className="space-y-5">
      {/* 1. Status Dropdown & Visual Indicator */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider">
            Current Status
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${activeConfig.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${activeConfig.dot}`} />
            <span>{activeConfig.label}</span>
          </span>
        </div>

        <select
          value={status}
          onChange={(e) => handleChangeStatus(e.target.value)}
          disabled={isSaving}
          className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg px-3.5 py-2.5 text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all disabled:opacity-50"
        >
          {statuses.map((s) => {
            const config = STATUS_CONFIG[s];
            return (
              <option key={s} value={s}>
                {config?.icon || ''} {config?.label || s}
              </option>
            );
          })}
        </select>

        {isSaving && (
          <p className="text-xs text-stone-500 flex items-center gap-1.5 pt-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-tan" />
            <span>Updating order status...</span>
          </p>
        )}
      </div>

      {/* 2. WhatsApp Customer Notification Panel */}
      <div className="pt-4 border-t border-admin-border/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Notify Customer on WhatsApp
            </h3>
          </div>
          <span className="text-[10px] text-stone-500 font-mono">
            {cleanPhone ? `+${cleanPhone}` : 'No phone'}
          </span>
        </div>

        {/* Quick Message Template Pills */}
        <div>
          <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
            Quick Template Switch
          </label>
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setMessageText(generateMessage(s))}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 border border-admin-border transition-colors flex items-center gap-1"
                >
                  <span>{cfg.icon}</span>
                  <span>{cfg.label.split('/')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Customer Phone Input (in case admin wants to edit or add) */}
        {!customerPhone && (
          <div>
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              Customer Mobile Number (10 digits)
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF8F5] border border-admin-border rounded-lg text-stone-900 focus:bg-white focus:outline-none focus:border-tan font-mono"
              />
            </div>
          </div>
        )}

        {/* Editable Message Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              Pre-filled Message Preview (Editable)
            </label>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          <textarea
            rows={5}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-admin-border rounded-lg p-3 text-xs text-stone-800 leading-relaxed font-sans focus:bg-white focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan"
            placeholder="Type your WhatsApp notification message here..."
          />
          <p className="text-[10px] text-stone-400 mt-1">
            Tip: You can insert your courier tracking link or custom delivery notes directly in the box above.
          </p>
        </div>

        {/* WhatsApp Action Button */}
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow"
          >
            <MessageCircle className="w-4 h-4 fill-white" />
            <span>Send Message on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
            <span>No valid phone number for WhatsApp</span>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="px-2.5 py-1 bg-white border border-amber-300 rounded font-semibold text-[11px] text-amber-900"
            >
              Copy Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
