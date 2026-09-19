'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Minus, Plus, ShoppingBag, Check, Zap } from 'lucide-react';
import type { Product } from '@/types/database';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

interface ProductDetailClientProps {
  product: Product;
}

const COLOR_MAP: Record<string, string> = {
  black: '#1a1a1a',
  white: '#ffffff',
  ivory: '#FFFFF0',
  cream: '#FFFDD0',
  beige: '#F5F5DC',
  maroon: '#800000',
  red: '#dc2626',
  burgundy: '#6B1D2F',
  wine: '#722F37',
  pink: '#ec4899',
  'dusty rose': '#DCAE96',
  rose: '#f43f5e',
  blue: '#2563eb',
  'navy blue': '#000080',
  navy: '#000080',
  sky: '#0ea5e9',
  'royal blue': '#4169E1',
  green: '#16a34a',
  'sage green': '#9CAF88',
  olive: '#556B2F',
  emerald: '#046A38',
  mint: '#98FF98',
  yellow: '#eab308',
  mustard: '#E1AD01',
  'mustard gold': '#D4AF37',
  gold: '#FFD700',
  orange: '#f97316',
  rust: '#B7410E',
  peach: '#FFE5B4',
  purple: '#9333ea',
  lavender: '#E6E6FA',
  plum: '#8E4585',
  lilac: '#C8A2C8',
  brown: '#78350f',
  tan: '#D2B48C',
  camel: '#C19A6B',
  chocolate: '#3D1C02',
  grey: '#6b7280',
  gray: '#6b7280',
  silver: '#C0C0C0',
  charcoal: '#36454F',
};

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const images = product.images?.sort((a, b) => a.sort_order - b.sort_order) || [];
  const primaryImage = images.find((img) => img.is_primary) || images[0];
  const [selectedImage, setSelectedImage] = useState(primaryImage);

  const sizeVariants = (product.variants || []).filter((v) => v.name.toLowerCase() === 'size');
  const colorVariants = (product.variants || []).filter((v) => v.name.toLowerCase() === 'color');

  const firstInStockSize = sizeVariants.find((v) => v.stock > 0)?.value || sizeVariants[0]?.value || '';
  const firstInStockColor = colorVariants.find((v) => v.stock > 0)?.value || colorVariants[0]?.value || '';

  const [selectedSize, setSelectedSize] = useState<string>(firstInStockSize);
  const [selectedColor, setSelectedColor] = useState<string>(firstInStockColor);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const router = useRouter();

  const { addItem, isInCart } = useCart();

  const discount = product.compare_at_price
    ? calculateDiscount(product.price, product.compare_at_price)
    : 0;

  const inStock = product.stock > 0;

  const selectedSizeVariant = sizeVariants.find((v) => v.value === selectedSize);
  const selectedColorVariant = colorVariants.find((v) => v.value === selectedColor);

  const isCurrentSizeOutOfStock = sizeVariants.length > 0 && (selectedSizeVariant ? selectedSizeVariant.stock <= 0 : false);
  const isCurrentColorOutOfStock = colorVariants.length > 0 && (selectedColorVariant ? selectedColorVariant.stock <= 0 : false);

  const allSizesOutOfStock = sizeVariants.length > 0 && sizeVariants.every((v) => v.stock <= 0);
  const allColorsOutOfStock = colorVariants.length > 0 && colorVariants.every((v) => v.stock <= 0);

  const isProductOutOfStock = !inStock || allSizesOutOfStock || allColorsOutOfStock;
  const isSelectedVariantSoldOut = isCurrentSizeOutOfStock || isCurrentColorOutOfStock;
  const canPurchase = !isProductOutOfStock && !isSelectedVariantSoldOut;

  const maxAvailableStock = Math.max(
    0,
    Math.min(
      product.stock,
      selectedSizeVariant ? selectedSizeVariant.stock : product.stock,
      selectedColorVariant ? selectedColorVariant.stock : product.stock
    )
  );

  const imageToStore =
    primaryImage?.secure_url ||
    (primaryImage as any)?.url ||
    product.images?.[0]?.secure_url ||
    null;

  const handleAddToCart = () => {
    if (!canPurchase) return;
    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: imageToStore,
      price: product.price,
      stock: maxAvailableStock,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (!canPurchase) return;
    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      product_image: imageToStore,
      price: product.price,
      stock: maxAvailableStock,
      size: selectedSize || undefined,
      color: selectedColor || undefined,
    });
    router.push('/checkout');
  };

  const variantParts = [
    selectedSize ? `Size: ${selectedSize}` : '',
    selectedColor ? `Color: ${selectedColor}` : '',
  ].filter(Boolean);
  const variantInfo = variantParts.length > 0 ? variantParts.join(', ') : undefined;

  const isOffer = product.is_offer || product.variants?.some((v) => v.name.toLowerCase() === 'offer');
  const isBestSeller = product.is_bestseller || product.variants?.some((v) => v.name.toLowerCase() === 'bestseller');

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-cream rounded-sm overflow-hidden border border-border/60">
              {selectedImage ? (
                <Image
                  src={selectedImage.secure_url}
                  alt={selectedImage.alt_text || product.name}
                  fill
                  className={`object-cover ${!inStock ? 'opacity-85' : ''}`}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-brown-light font-body text-sm">No image available</span>
                </div>
              )}

              {/* Badges — Refined Minimalist Luxury Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5 max-w-[85%] z-10 pointer-events-none">
                {isProductOutOfStock ? (
                  <span className="px-3 py-1 rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-stone-900/90 text-white backdrop-blur-xs shadow-sm">
                    Out of Stock
                  </span>
                ) : (
                  <>
                    {isOffer ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-bronze/95 text-white backdrop-blur-xs shadow-sm">
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
                          <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-tan text-white backdrop-blur-xs shadow-2xs">
                            Best Seller
                          </span>
                        )}
                        {product.is_new && (
                          <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-white/95 text-stone-900 border border-stone-200/80 backdrop-blur-xs shadow-2xs">
                            New
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] uppercase font-bold tracking-wider bg-stone-900/85 text-white backdrop-blur-xs shadow-2xs">
                            {discount}% Off
                          </span>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-20 lg:w-20 lg:h-24 flex-shrink-0 rounded-xs overflow-hidden border-2 transition-colors ${
                      selectedImage?.id === img.id
                        ? 'border-bronze shadow-xs'
                        : 'border-border hover:border-bronze/50'
                    }`}
                  >
                    <Image
                      src={img.secure_url}
                      alt={img.alt_text || ''}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:py-4">
            {/* Category */}
            {product.category && (
              <p className="text-xs tracking-[0.2em] uppercase text-tan mb-3 font-medium">
                {product.category.name}
              </p>
            )}

            {/* Name */}
            <h1 className="font-heading text-2xl lg:text-3xl xl:text-4xl font-bold text-brown-dark leading-tight mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl lg:text-3xl font-semibold text-brown-dark">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <>
                  <span className="text-lg text-brown-muted line-through font-body">
                    {formatPrice(product.compare_at_price)}
                  </span>
                  <span className="text-xs text-tan font-semibold tracking-wider uppercase">
                    {discount}% off
                  </span>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-sm text-brown-light leading-relaxed mb-6 font-body">
                {product.short_description}
              </p>
            )}

            {/* Divider */}
            {(sizeVariants.length > 0 || colorVariants.length > 0) && (
              <div className="border-t border-border/80 my-6" />
            )}

            {/* Size Selector (Only if product has size variants) */}
            {sizeVariants.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs tracking-[0.12em] uppercase text-brown-dark font-medium">
                    Select Size
                  </span>
                  <span className="text-[11px] text-brown-light font-body">
                    Selected:{' '}
                    <strong className="text-brown-dark">
                      {selectedSize || 'None'}
                    </strong>
                    {isCurrentSizeOutOfStock && (
                      <span className="ml-1.5 text-rose-600 font-bold">(Sold Out)</span>
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizeVariants.map((variant) => {
                    const size = variant.value;
                    const isOutOfStock = variant.stock <= 0;
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => {
                          if (!isOutOfStock) setSelectedSize(size);
                        }}
                        aria-disabled={isOutOfStock}
                        title={isOutOfStock ? `${size} — Out of Stock` : size}
                        className={`relative min-w-[48px] h-11 px-3.5 flex items-center justify-center text-xs font-medium uppercase border transition-all rounded-xs select-none ${
                          isOutOfStock
                            ? 'bg-stone-100/90 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-brown-dark text-white border-brown-dark shadow-xs cursor-pointer'
                            : 'border-border text-brown-dark hover:border-bronze bg-white cursor-pointer'
                        }`}
                      >
                        <span className={isOutOfStock ? 'line-through decoration-rose-500 decoration-[1.5px] text-stone-400 font-semibold' : ''}>
                          {size}
                        </span>
                        {isOutOfStock && (
                          <span className="absolute -top-1.5 -right-1 px-1 py-0.2 bg-rose-500 text-white text-[7.5px] font-black uppercase rounded-xs leading-tight shadow-2xs">
                            Out
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Color Selector (Only if product has color variants) */}
            {colorVariants.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs tracking-[0.12em] uppercase text-brown-dark font-medium">
                    Select Color
                  </span>
                  <span className="text-[11px] text-brown-light font-body">
                    Selected:{' '}
                    <strong className="text-brown-dark">
                      {selectedColor || 'None'}
                    </strong>
                    {isCurrentColorOutOfStock && (
                      <span className="ml-1.5 text-rose-600 font-bold">(Sold Out)</span>
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {colorVariants.map((variant) => {
                    const color = variant.value;
                    const isOutOfStock = variant.stock <= 0;
                    const isSelected = selectedColor === color;
                    const hex = COLOR_MAP[color.toLowerCase()];

                    return (
                      <button
                        key={color}
                        type="button"
                        disabled={isOutOfStock}
                        onClick={() => {
                          if (!isOutOfStock) setSelectedColor(color);
                        }}
                        aria-disabled={isOutOfStock}
                        title={isOutOfStock ? `${color} — Out of Stock` : color}
                        className={`relative flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium uppercase border transition-all rounded-xs select-none ${
                          isOutOfStock
                            ? 'bg-stone-100/90 text-stone-400 border-stone-200 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'bg-brown-dark text-white border-brown-dark shadow-xs cursor-pointer'
                            : 'border-border text-brown-dark hover:border-bronze bg-white cursor-pointer'
                        }`}
                      >
                        {hex ? (
                          <span
                            className={`w-3.5 h-3.5 rounded-full border border-black/20 flex-shrink-0 ${
                              isOutOfStock ? 'opacity-30 grayscale' : ''
                            }`}
                            style={{ backgroundColor: hex }}
                          />
                        ) : (
                          <span
                            className={`w-2.5 h-2.5 rounded-full bg-bronze/40 flex-shrink-0 ${
                              isOutOfStock ? 'opacity-30 grayscale' : ''
                            }`}
                          />
                        )}
                        <span className={isOutOfStock ? 'line-through decoration-rose-500 decoration-[1.5px] text-stone-400 font-semibold' : ''}>
                          {color}
                        </span>
                        {isOutOfStock && (
                          <span className="text-[8.5px] text-rose-500 font-bold uppercase tracking-tight">
                            (Sold Out)
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-border/80 my-6" />

            {/* Stock Status */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  canPurchase ? 'bg-success animate-pulse' : 'bg-error'
                }`}
              />
              <span
                className={`text-xs tracking-wider uppercase font-semibold ${
                  canPurchase ? 'text-success' : 'text-error'
                }`}
              >
                {canPurchase
                  ? 'In Stock'
                  : isSelectedVariantSoldOut
                  ? 'Selected Option Sold Out'
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Quantity */}
            {canPurchase && maxAvailableStock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs tracking-[0.1em] uppercase text-brown-light font-medium">
                  Quantity
                </span>
                <div className="flex items-center border border-border bg-white rounded-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2.5 text-brown-dark hover:text-tan transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-brown-dark">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(maxAvailableStock, quantity + 1))}
                    className="p-2.5 text-brown-dark hover:text-tan transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons — BUY NOW & Add to Bag */}
            <div className="space-y-3 mb-8">
              {/* BUY NOW Button */}
              <button
                onClick={handleBuyNow}
                disabled={!canPurchase}
                className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 text-xs tracking-[0.15em] uppercase font-semibold transition-all duration-300 rounded-xs shadow-md ${
                  canPurchase
                    ? 'bg-bronze hover:bg-bronze-dark text-white cursor-pointer'
                    : 'bg-sand/70 text-brown-muted cursor-not-allowed border border-border'
                }`}
              >
                {canPurchase ? (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    <span>Buy Now</span>
                  </>
                ) : isSelectedVariantSoldOut ? (
                  <span>Selected Option Sold Out</span>
                ) : (
                  <span>Out of Stock</span>
                )}
              </button>

              {/* Add to Bag Secondary Button */}
              <button
                onClick={handleAddToCart}
                disabled={!canPurchase}
                className={`w-full flex items-center justify-center gap-2 py-3 text-xs tracking-[0.15em] uppercase font-medium border transition-all duration-300 rounded-xs ${
                  !canPurchase
                    ? 'border-border text-brown-muted/70 cursor-not-allowed bg-cream/40'
                    : addedToCart
                    ? 'bg-success text-white border-success'
                    : 'border-brown-dark text-brown-dark hover:bg-brown-dark hover:text-white'
                }`}
              >
                {!canPurchase ? (
                  isSelectedVariantSoldOut ? 'Option Sold Out' : 'Item Currently Unavailable'
                ) : addedToCart ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Bag
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    {isInCart(product.id, selectedSize || undefined, selectedColor || undefined)
                      ? 'Added — Add More'
                      : 'Add to Bag'}
                  </>
                )}
              </button>
            </div>

            {/* SKU */}
            {product.sku && (
              <p className="text-xs text-brown-light mb-2">
                <span className="font-medium">SKU:</span> {product.sku}
              </p>
            )}

            {/* Description */}
              {product.description && (
                <div className="border-t border-border pt-6 mt-6">
                  <h3 className="text-xs tracking-[0.15em] uppercase font-semibold text-brown-dark mb-3">
                    Description
                  </h3>
                  <div className="text-sm text-brown-light leading-relaxed whitespace-pre-line font-body">
                    {product.description}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
    </>
  );
}
