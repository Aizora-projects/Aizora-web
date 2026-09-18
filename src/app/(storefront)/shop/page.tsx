import { Metadata } from 'next';
import { getProducts } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import ProductCard from '@/components/storefront/ProductCard';
import ShopSort from '@/components/storefront/ShopSort';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Browse our entire collection of premium women\'s fashion at AIZORA.',
};

interface ShopPageProps {
  searchParams: Promise<{ page?: string; category?: string; sort?: string; filter?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { page: pageStr, category, sort, filter } = await searchParams;
  const page = parseInt(pageStr || '1', 10);

  const categories = await getCategories(true);

  const productsResult = await getProducts({
    isActive: true,
    categoryId: category,
    isNew: filter === 'new' ? true : undefined,
    isFeatured: filter === 'featured' ? true : undefined,
    isBestseller: filter === 'bestseller' ? true : undefined,
    page,
    pageSize: 12,
    orderBy: sort === 'price-low' || sort === 'price-high' ? 'price' : 'created_at',
    orderDir: sort === 'price-low' ? 'asc' : sort === 'price-high' ? 'asc' : 'desc',
  });

  return (
    <div className="bg-ivory min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-brown-light">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brown-dark font-medium">Shop</span>
        </nav>
      </div>

      {/* Header */}
      <div className="bg-cream py-10 lg:py-14 mb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <h1 className="font-heading text-3xl lg:text-4xl font-bold tracking-[0.1em] uppercase text-brown-dark mb-2">
            {filter === 'new' ? 'New Arrivals' : filter === 'bestseller' ? 'Best Sellers' : filter === 'featured' ? 'Featured' : 'Shop All'}
          </h1>
          <p className="text-sm text-brown-light">
            Discover our curated collection of premium women&apos;s fashion
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Link
            href="/shop"
            className={`px-4 py-2 text-xs tracking-wider uppercase border transition-colors ${
              !category && !filter
                ? 'bg-brown-dark text-cream border-brown-dark'
                : 'border-border text-brown-dark hover:border-gold'
            }`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className={`px-4 py-2 text-xs tracking-wider uppercase border transition-colors ${
                category === cat.id
                  ? 'bg-brown-dark text-cream border-brown-dark'
                  : 'border-border text-brown-dark hover:border-gold'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-brown-light tracking-wider uppercase">
            {productsResult.count} {productsResult.count === 1 ? 'product' : 'products'}
          </p>
          <div className="flex items-center gap-2">
            <ShopSort currentSort={sort} />
          </div>
        </div>

        {/* Product Grid */}
        {productsResult.data.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {productsResult.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {productsResult.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {Array.from({ length: productsResult.totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/shop?page=${p}${category ? `&category=${category}` : ''}${sort ? `&sort=${sort}` : ''}`}
                    className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${
                      p === page
                        ? 'bg-brown-dark text-cream border-brown-dark'
                        : 'border-border text-brown-dark hover:border-gold hover:text-gold'
                    }`}
                  >
                    {p}
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="font-heading text-xl text-brown-light mb-2">No products found</p>
            <p className="text-sm text-brown-light/70">
              Check back soon for new additions to our collection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
