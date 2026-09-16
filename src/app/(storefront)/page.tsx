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
  const [categories, newArrivalsResult] = await Promise.all([
    getCategories(true),
    getProducts({ isActive: true, isNew: true, pageSize: 8, orderBy: 'created_at', orderDir: 'desc' }),
  ]);

  const newArrivals = newArrivalsResult.data;

  return (
    <>
      {/* Hero Section — Exact Typography & Editorial Layout */}
      <Hero />

      {/* Shop by Category — 6 Circular Cards from Database */}
      <CategoryGrid categories={categories} />

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

          {/* Mobile New Arrivals Banner Card from Reference Mockup */}
          <div className="lg:hidden mb-8 bg-cream/80 border border-border-dark/60 rounded-[3px] p-4 flex items-center justify-between shadow-2xs">
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-brown-light font-medium">Collection</p>
              <h3 className="font-heading text-base font-semibold tracking-[0.1em] uppercase text-brown-dark">
                New Arrivals
              </h3>
              <p className="text-xs text-brown-light italic font-body">
                Fresh Picks, Just for You
              </p>
            </div>
            <Link
              href="/shop?filter=new"
              className="w-9 h-9 rounded-full bg-bronze text-white flex items-center justify-center shadow-xs hover:bg-bronze-dark transition-colors"
              aria-label="View New Arrivals"
            >
              <ArrowRight className="w-4 h-4" />
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
