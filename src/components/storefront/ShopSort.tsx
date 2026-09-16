'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function ShopSort({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-brown-light">Sort:</span>
      <select
        defaultValue={currentSort || 'newest'}
        onChange={handleSortChange}
        className="text-xs bg-transparent border border-border px-3 py-1.5 text-brown-dark focus:outline-none focus:border-gold cursor-pointer"
      >
        <option value="newest">Newest</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  );
}
