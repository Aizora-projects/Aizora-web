'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Loader2,
  MessageCircle,
  Copy,
  Check,
  ExternalLink,
  Phone,
} from 'lucide-react';

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
  const [activeTemplate, setActiveTemplate] = useState(currentStatus);
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
        setActiveTemplate(newStatus);
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

  const handleTemplateSwitch = (targetStatus: string) => {
    setActiveTemplate(targetStatus);
    setMessageText(generateMessage(targetStatus));
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
          <span className="text-[11px] font-bold text-stone-600 uppercase tracking-wider">
            Current Status
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${activeConfig.badge}`}
          >
            <span className={`w-2 h-2 rounded-full ${activeConfig.dot} ${status === 'pending' || status === 'processing' ? 'animate-pulse' : ''}`} />
            <span>{activeConfig.label}</span>
          </span>
        </div>

        {/* 16px font on mobile prevents iOS Safari auto-zoom */}
        <select
          value={status}
          onChange={(e) => handleChangeStatus(e.target.value)}
          disabled={isSaving}
          className="w-full bg-[#FAF8F5] border border-admin-border rounded-xl px-4 py-3 sm:py-2.5 text-base sm:text-sm font-semibold text-stone-900 focus:bg-white focus:outline-none focus:border-tan focus:ring-2 focus:ring-tan/20 transition-all disabled:opacity-50 min-h-[46px]"
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
          <p className="text-xs text-tan font-medium flex items-center gap-1.5 pt-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-tan" />
            <span>Updating status...</span>
          </p>
        )}
      </div>

      {/* 2. WhatsApp Customer Notification Panel */}
      <div className="pt-4 border-t border-admin-border/70 space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#25D366]/15 text-[#25D366] flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Notify Customer on WhatsApp
            </h3>
          </div>
          <span className="text-[11px] text-stone-500 font-mono bg-stone-100 px-2 py-0.5 rounded">
            {cleanPhone ? `+${cleanPhone}` : 'No phone'}
          </span>
        </div>

        {/* Quick Message Template Pills */}
        <div>
          <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">
            Quick Template Switch
          </label>
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-1.5">
            {statuses.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const isSelected = activeTemplate === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleTemplateSwitch(s)}
                  className={`px-3 py-2 sm:py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center sm:justify-start gap-1.5 min-h-[38px] ${
                    isSelected
                      ? 'bg-tan text-white shadow-xs border border-tan'
                      : 'bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 border border-admin-border'
                  }`}
                >
                  <span className="text-sm sm:text-xs">{cfg.icon}</span>
                  <span className="truncate">{cfg.label.split('/')[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Customer Phone Input (in case missing or needs edit) */}
        {!customerPhone && (
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
              Customer Mobile Number (10 digits)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                value={customPhone}
                onChange={(e) => setCustomPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full pl-10 pr-3 py-2.5 text-base sm:text-xs bg-[#FAF8F5] border border-admin-border rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:border-tan font-mono min-h-[44px]"
              />
            </div>
          </div>
        )}

        {/* Editable Message Textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Pre-filled Message Preview (Editable)
            </label>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1 px-2 py-1 rounded bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Text</span>
                </>
              )}
            </button>
          </div>
          <textarea
            rows={5}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="w-full bg-[#FAF8F5] border border-admin-border rounded-xl p-3.5 text-base sm:text-xs text-stone-800 leading-relaxed font-sans focus:bg-white focus:outline-none focus:border-tan focus:ring-1 focus:ring-tan shadow-2xs"
            placeholder="Type your WhatsApp notification message here..."
          />
          <p className="text-[10.5px] text-stone-400 mt-1.5 leading-normal">
            Tip: You can insert your courier tracking link or custom delivery notes directly in the box above before sending.
          </p>
        </div>

        {/* Primary WhatsApp Action Button — Highly optimized for iPhone touch */}
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white py-3.5 px-5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg min-h-[50px]"
          >
            <MessageCircle className="w-5 h-5 fill-white flex-shrink-0" />
            <span>Send Message on WhatsApp</span>
            <ExternalLink className="w-4 h-4 flex-shrink-0" />
          </a>
        ) : (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
            <span>No phone number provided</span>
            <button
              type="button"
              onClick={handleCopyMessage}
              className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg font-semibold text-xs text-amber-900 shadow-2xs"
            >
              Copy Text
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
