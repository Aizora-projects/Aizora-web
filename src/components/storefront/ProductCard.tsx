'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types/database';
import { formatPrice, calculateDiscount } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const discount = product.compare_at_price
    ? calculateDiscount(product.price, product.compare_at_price)
    : 0;

  const sizeVariants = product.variants?.filter((v) => v.name.toLowerCase() === 'size') || [];
  const colorVariants = product.variants?.filter((v) => v.name.toLowerCase() === 'color') || [];
  const allSizesOutOfStock = sizeVariants.length > 0 && sizeVariants.every((v) => v.stock <= 0);
  const allColorsOutOfStock = colorVariants.length > 0 && colorVariants.every((v) => v.stock <= 0);
  const isOutOfStock = product.stock <= 0 || allSizesOutOfStock || allColorsOutOfStock;
  const isOffer = product.is_offer || product.variants?.some((v) => v.name.toLowerCase() === 'offer');
  const isBestSeller = product.is_bestseller || product.variants?.some((v) => v.name.toLowerCase() === 'bestseller');

  return (
    <div className="group relative">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden rounded-sm bg-cream mb-3">
        {primaryImage ? (
          <Image
            src={primaryImage.secure_url}
            alt={primaryImage.alt_text || product.name}
            fill
            className={`object-cover transition-transform duration-700 ${
              isOutOfStock ? 'opacity-85' : 'group-hover:scale-105'
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-cream">
            <span className="text-brown-light text-sm">No image</span>
          </div>
        )}

        {/* Badges — Positioned at Bottom Right of Image */}
        <div className="absolute bottom-2.5 right-2.5 flex flex-wrap items-center justify-end gap-1 max-w-[85%] z-10 pointer-events-none">
          {isOutOfStock ? (
            <span className="px-2.5 py-0.5 rounded-full text-[8.5px] uppercase font-bold tracking-wider bg-stone-900/90 text-white backdrop-blur-xs shadow-xs">
              Sold Out
            </span>
          ) : (
            <>
              {isOffer ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8.5px] uppercase font-bold tracking-wider bg-bronze/95 text-white backdrop-blur-xs shadow-xs">
                  <span>Offer</span>
                  {discount > 0 && (
                    <>
                      <span className="opacity-60">•</span>
                      <span>{discount}% Off</span>
                    </>
                  )}
                </span>
              ) : (
                <>
                  {isBestSeller && (
                    <span className="px-2 py-0.5 rounded-full text-[8.5px] uppercase font-bold tracking-wider bg-tan/95 text-white backdrop-blur-xs shadow-2xs">
                      Best Seller
                    </span>
                  )}
                  {product.is_new && (
                    <span className="px-2 py-0.5 rounded-full text-[8.5px] uppercase font-bold tracking-wider bg-white/95 text-stone-900 border border-stone-200/80 backdrop-blur-xs shadow-2xs">
                      New
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[8.5px] uppercase font-bold tracking-wider bg-stone-900/85 text-white backdrop-blur-xs shadow-2xs">
                      {discount}% Off
                    </span>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <Link href={`/product/${product.slug}`} className="block">
        <h3 className="text-xs md:text-sm font-medium text-brown-dark tracking-wide line-clamp-2 group-hover:text-bronze transition-colors mb-1 font-body">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-brown-dark font-body">
            {formatPrice(product.price)}
          </span>
          {product.compare_at_price && product.compare_at_price > product.price && (
            <span className="text-xs text-brown-muted line-through font-body">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
