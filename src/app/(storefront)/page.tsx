import Hero from '@/components/storefront/Hero';
import CategoryGrid from '@/components/storefront/CategoryGrid';
import ProductCard from '@/components/storefront/ProductCard';
import Link from 'next/link';
import { getCategories } from '@/actions/categories';
import { getProducts } from '@/actions/products';
import { ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch real data from Supabase
  const [categories, newArrivalsResult, bestSellersResult] = await Promise.all([
    getCategories(true),
    getProducts({ isActive: true, isNew: true, pageSize: 8, orderBy: 'created_at', orderDir: 'desc' }),
    getProducts({ isActive: true, isBestseller: true, pageSize: 8, orderBy: 'created_at', orderDir: 'desc' }),
  ]);

  const newArrivals = newArrivalsResult.data;
  const bestSellers = bestSellersResult.data;

  return (
    <>
      {/* Hero Section — Exact Typography & Editorial Layout */}
      <Hero />

      {/* Shop by Category — 6 Circular Cards from Database */}
      <CategoryGrid categories={categories} />

      {/* Best Sellers Section — ONLY shown if at least one product has Best Seller toggle ON */}
      {bestSellers.length > 0 && (
        <section className="py-14 lg:py-20 bg-cream/40 border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8 lg:mb-12">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-tan/15 text-tan text-[10px] tracking-[0.2em] uppercase font-bold mb-2">
                  <span>Customer Favorites</span>
                </div>
                <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl tracking-[0.18em] uppercase text-brown-dark font-medium">
                  Best Sellers
                </h2>
                <p className="text-xs sm:text-sm text-brown-light font-body mt-1">
                  Our Most Coveted & Highly Loved Pieces
                </p>
              </div>
              <Link
                href="/shop?filter=bestseller"
                className="flex items-center gap-1.5 text-xs tracking-[0.16em] uppercase text-brown-dark hover:text-tan transition-colors font-medium group"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      <section className="py-14 lg:py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl tracking-[0.18em] uppercase text-brown-dark font-medium">
                New Arrivals
              </h2>
              <p className="text-xs sm:text-sm text-brown-light font-body mt-1">
                Fresh Picks, Just for You
              </p>
            </div>
            <Link
              href="/shop?filter=new"
              className="flex items-center gap-1.5 text-xs tracking-[0.16em] uppercase text-brown-dark hover:text-tan transition-colors font-medium group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Product Grid */}
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-cream/30 border border-border/50 rounded-sm">
              <p className="font-heading text-lg sm:text-xl text-brown-dark mb-2">
                New Arrivals Coming Soon
              </p>
              <p className="text-xs sm:text-sm text-brown-light max-w-md mx-auto font-body">
                Our curated collections are being prepared. Products added via the admin panel will instantly display here.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
