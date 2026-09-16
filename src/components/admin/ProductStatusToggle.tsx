'use client';

import { useState } from 'react';
import { toggleProductStatus } from '@/actions/products';

interface ProductStatusToggleProps {
  productId: string;
  isActive: boolean;
}

export default function ProductStatusToggle({ productId, isActive }: ProductStatusToggleProps) {
  const [active, setActive] = useState(isActive);
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggle() {
    setIsLoading(true);
    const result = await toggleProductStatus(productId, !active);
    if (!result.error) {
      setActive(!active);
    }
    setIsLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={active ? 'Deactivate product' : 'Activate product'}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-tan/30 ${
        active ? 'bg-emerald-600' : 'bg-stone-300'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform shadow-xs ${
          active ? 'translate-x-4.5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}
