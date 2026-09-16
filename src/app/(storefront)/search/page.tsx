import { Metadata } from 'next';
import { getProducts } from '@/actions/products';
import ProductCard from '@/components/storefront/ProductCard';
import { Search as SearchIcon } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search our collection of premium women\'s fashion at AIZORA',
};

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q: query } = await searchParams;

  let products = null;

  if (query && query.trim()) {
    const result = await getProducts({
      isActive: true,
      search: query.trim(),
      pageSize: 20,
    });
    products = result.data;
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        {/* Search Form */}
        <form action="/search" method="GET" className="max-w-xl mx-auto mb-12">
          <div className="relative">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-light" />
            <input
              type="text"
              name="q"
              defaultValue={query || ''}
              placeholder="Search for products..."
              className="w-full pl-12 pr-4 py-4 border border-border bg-white text-brown-dark placeholder-brown-light text-sm focus:outline-none focus:border-gold transition-colors font-body"
              autoFocus
            />
          </div>
        </form>

        {/* Results */}
        {query ? (
          <>
            <p className="text-xs text-brown-light tracking-wider uppercase mb-6">
              {products?.length || 0} results for &quot;{query}&quot;
            </p>

            {products && products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="font-heading text-lg text-brown-light mb-2">No products found</p>
                <p className="text-sm text-brown-light/70">
                  Try different keywords or browse our categories.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <SearchIcon className="w-12 h-12 text-sand mx-auto mb-4" />
            <p className="font-heading text-lg text-brown-light">
              Search our collection
            </p>
            <p className="text-sm text-brown-light/70 mt-1">
              Find the perfect piece from our curated selection
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
