'use client';

import { useState } from 'react';
import { ShoppingBag, Eye, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface OrderItemThumbnailProps {
  src?: string | null;
  alt: string;
  productSlug?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export default function OrderItemThumbnail({
  src,
  alt,
  productSlug,
  size = 'md',
}: OrderItemThumbnailProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Size configurations
  const sizeClasses = {
    sm: 'w-12 h-14 min-w-12',
    md: 'w-16 h-20 min-w-16 sm:w-18 sm:h-22 sm:min-w-18',
    lg: 'w-20 h-26 min-w-20 sm:w-24 sm:h-30 sm:min-w-24',
  }[size];

  const hasValidImage = !!src && !hasError;

  return (
    <>
      <div className={`relative ${sizeClasses} rounded-lg overflow-hidden flex-shrink-0 border border-admin-border/80 bg-[#FAF8F5] shadow-2xs group`}>
        {hasValidImage ? (
          <>
            <img
              src={src!}
              alt={alt}
              onError={() => setHasError(true)}
              onLoad={() => setIsLoaded(true)}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              } group-hover:scale-105`}
              loading="lazy"
            />
            {/* Overlay quick action to zoom */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              title="Click to view image"
              aria-label="View full image"
            >
              <Eye className="w-4 h-4 drop-shadow" />
            </button>
          </>
        ) : (
          /* Luxury Placeholder when image is missing or failed to fetch */
          <div className="w-full h-full flex flex-col items-center justify-center p-1 bg-gradient-to-b from-[#FAF8F5] to-[#F3EEE5] text-stone-400 select-none">
            <div className="w-7 h-7 rounded-full bg-white/80 border border-tan/30 flex items-center justify-center shadow-2xs mb-0.5">
              <ShoppingBag className="w-3.5 h-3.5 text-tan" />
            </div>
            <span className="text-[9px] font-serif font-medium text-stone-500 uppercase tracking-wider text-center line-clamp-1 px-0.5">
              AIZORA
            </span>
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {isModalOpen && hasValidImage && (
        <div
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-admin-border p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-admin-border">
              <p className="text-xs font-semibold text-stone-900 truncate pr-3">{alt}</p>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-800 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>
            <div className="relative aspect-[3/4] w-full max-h-[70vh] my-3 rounded-lg overflow-hidden bg-stone-100">
              <img
                src={src!}
                alt={alt}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              {productSlug ? (
                <Link
                  href={`/product/${productSlug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs text-tan font-semibold hover:underline"
                >
                  <span>Open Storefront Product</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <span />
              )}
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
