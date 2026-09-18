'use client';

import { useState } from 'react';
import { Copy, Check, MessageCircle, ExternalLink, MapPin, Phone } from 'lucide-react';

interface OrderQuickActionsProps {
  orderId: string;
  orderCode: string;
  customerPhone?: string | null;
  customerName: string;
  total: number;
  status: string;
  fullAddress: string;
}

export function CopyOrderRefButton({ orderCode }: { orderCode: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(orderCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors border border-stone-200/60"
      title="Copy Order Reference"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-600 font-sans text-[11px] font-bold">Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-[11px] font-sans">Copy</span>
        </>
      )}
    </button>
  );
}

export function CopyAddressButton({ addressText }: { addressText: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(addressText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="w-full mt-2.5 inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-stone-700 bg-white hover:bg-stone-50 rounded-lg border border-admin-border transition-colors shadow-2xs min-h-[38px]"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-emerald-600">Address Copied!</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5 text-stone-500" />
          <span>Copy Address for Courier</span>
        </>
      )}
    </button>
  );
}

export function CustomerContactActions({
  phone,
  name,
  orderCode,
}: {
  phone: string;
  name: string;
  orderCode: string;
}) {
  const cleanDigits = phone.replace(/[^0-9]/g, '');
  const waPhone =
    cleanDigits.length === 10
      ? `91${cleanDigits}`
      : cleanDigits.startsWith('91') && cleanDigits.length === 12
      ? cleanDigits
      : cleanDigits;

  const defaultMsg = encodeURIComponent(
    `Hello ${name}! 🌸 AIZORA Customer Care regarding your order ${orderCode}.`
  );

  return (
    <div className="grid grid-cols-2 gap-2 pt-2">
      {/* 1. Call Customer */}
      <a
        href={`tel:${cleanDigits}`}
        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-stone-700 bg-[#FAF8F5] hover:bg-stone-100 rounded-lg border border-admin-border transition-colors min-h-[40px]"
      >
        <Phone className="w-3.5 h-3.5 text-stone-500" />
        <span>Call</span>
      </a>

      {/* 2. Direct WhatsApp Chat */}
      <a
        href={`https://wa.me/${waPhone}?text=${defaultMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#1EBE5D] bg-emerald-50 hover:bg-emerald-100/70 rounded-lg border border-emerald-200 transition-colors min-h-[40px]"
      >
        <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}

export function StickyMobileOrderBar({
  customerPhone,
  customerName,
  orderCode,
  total,
  status,
}: {
  customerPhone?: string | null;
  customerName: string;
  orderCode: string;
  total: number;
  status: string;
}) {
  const cleanDigits = (customerPhone || '').replace(/[^0-9]/g, '');
  const waPhone =
    cleanDigits.length === 10
      ? `91${cleanDigits}`
      : cleanDigits.startsWith('91') && cleanDigits.length === 12
      ? cleanDigits
      : cleanDigits;

  const defaultMsg = encodeURIComponent(
    `Hello ${customerName}! 🌸 AIZORA Customer Care regarding your order ${orderCode}.`
  );

  const formattedTotal = total > 0 ? `₹${total.toLocaleString('en-IN')}` : '';

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-admin-border p-3 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
          Order Total
        </p>
        <p className="text-base font-bold text-stone-900 font-heading">
          {formattedTotal}
        </p>
      </div>

      {waPhone ? (
        <a
          href={`https://wa.me/${waPhone}?text=${defaultMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] active:scale-[0.98] text-white py-2.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md min-h-[44px] flex-shrink-0"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>WhatsApp Chat</span>
        </a>
      ) : (
        <span className="text-xs text-stone-400">No phone</span>
      )}
    </div>
  );
}
