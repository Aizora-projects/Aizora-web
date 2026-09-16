'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const { items, itemCount, subtotal, total, updateQuantity, removeItem, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="bg-ivory min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-sand mx-auto mb-4" />
          <h1 className="font-heading text-2xl text-brown-dark mb-2">Your bag is currently empty</h1>
          <p className="text-sm text-brown-light mb-8 font-body">
            Looks like you haven&apos;t added anything yet. Explore our collection!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-brown-dark text-cream px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-bronze transition-colors"
          >
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ivory min-h-screen">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <h1 className="font-heading text-2xl lg:text-3xl font-bold tracking-[0.1em] uppercase text-brown-dark mb-8">
            Shopping Bag ({itemCount})
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => {
                const itemKey = `${item.product_id}_${item.size || ''}_${item.color || ''}`;
                return (
                  <div
                    key={itemKey}
                    className="flex gap-4 bg-white p-4 border border-border rounded-sm"
                  >
                    {/* Image */}
                    <Link href={`/product/${item.product_slug}`} className="relative w-20 h-24 lg:w-24 lg:h-32 flex-shrink-0 bg-cream rounded-sm overflow-hidden">
                      {item.product_image ? (
                        <Image
                          src={item.product_image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sand text-xs">
                          No img
                        </div>
                      )}
                    </Link>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.product_slug}`}
                            className="font-medium text-sm text-brown-dark hover:text-bronze transition-colors line-clamp-1"
                          >
                            {item.product_name}
                          </Link>
                          <button
                            onClick={() => removeItem(item.product_id, item.size, item.color)}
                            className="text-brown-light hover:text-error transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-brown-dark mt-1">
                          {formatPrice(item.price)}
                        </p>
                        {/* Variant Badges */}
                        {(item.size || item.color) && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {item.size && (
                              <span className="inline-flex items-center text-[10px] uppercase font-medium tracking-wider bg-cream text-brown-dark px-2 py-0.5 rounded-xs border border-border">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="inline-flex items-center text-[10px] uppercase font-medium tracking-wider bg-cream text-brown-dark px-2 py-0.5 rounded-xs border border-border">
                                Color: {item.color}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Subtotal */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-border rounded-xs">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.size, item.color)}
                            className="p-1.5 text-brown-dark hover:text-bronze transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-brown-dark">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.size, item.color)}
                            disabled={item.quantity >= item.stock}
                            className="p-1.5 text-brown-dark hover:text-bronze transition-colors disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-brown-dark">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={clearCart}
                className="text-xs text-brown-light hover:text-error transition-colors uppercase tracking-wider font-medium"
              >
                Clear Bag
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-cream/70 p-6 border border-border-dark/60 rounded-sm h-fit sticky top-24 space-y-4">
              <h2 className="text-xs tracking-[0.15em] uppercase font-semibold text-brown-dark border-b border-border/80 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brown-light font-body">Subtotal</span>
                  <span className="text-brown-dark font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-brown-light font-body">Delivery</span>
                  <span className="text-success font-medium text-xs uppercase tracking-wider">Free (Pan India)</span>
                </div>
              </div>

              <div className="border-t border-border/80 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-brown-dark">Total Amount</span>
                  <span className="text-lg font-bold text-bronze">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-bronze hover:bg-bronze-dark text-white py-4 text-xs tracking-[0.18em] uppercase font-bold transition-all shadow-md hover:shadow-lg rounded-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/shop"
                className="block text-center pt-2 text-xs text-brown-light hover:text-bronze transition-colors tracking-wider uppercase"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
  );
}
