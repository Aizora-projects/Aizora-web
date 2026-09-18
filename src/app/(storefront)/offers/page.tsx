import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Tag } from 'lucide-react';
import { getProducts } from '@/actions/products';
import ProductCard from '@/components/storefront/ProductCard';
import ShopSort from '@/components/storefront/ShopSort';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Offer Items | Special Deals & Exclusive Discounts — AIZORA',
  description: 'Explore exclusive limited-time offers and special pricing on premium women\'s fashion at AIZORA.',
};

interface OffersPageProps {
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export default async function OffersPage({ searchParams }: OffersPageProps) {
  const { page: pageStr, sort } = await searchParams;
  const page = parseInt(pageStr || '1', 10);

  const productsResult = await getProducts({
    isActive: true,
    isOffer: true,
    page,
    pageSize: 16,
    orderBy: sort === 'price-low' || sort === 'price-high' ? 'price' : 'created_at',
    orderDir: sort === 'price-low' ? 'asc' : sort === 'price-high' ? 'desc' : 'desc',
  });

  return (
    <div className="bg-ivory min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-brown-light font-body">
          <Link href="/" className="hover:text-tan transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
          <span className="text-brown-dark font-medium">Offer Items</span>
        </nav>
      </div>

      {/* Editorial Luxury Header Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF4ED] via-[#F4EDE2] to-[#EAE0D2] border-b border-[#E3D7C7] py-12 sm:py-16 lg:py-20 mb-8">
        {/* Subtle Decorative Floral Background Element */}
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-tan/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-bronze/10 blur-2xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-tan/30 text-tan text-[11px] font-semibold tracking-[0.2em] uppercase mb-4 shadow-2xs">
            <Tag className="w-3.5 h-3.5" />
            <span>Limited Time Curation</span>
          </div>

          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-[0.14em] uppercase text-brown-dark mb-3">
            Offer Items
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-brown-light font-body max-w-xl mx-auto leading-relaxed">
            Exclusive handpicked styles at special pricing. Elevate your wardrobe with timeless luxury for less.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-20">
        {/* Count & Sort Bar */}
        <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-8">
          <p className="text-xs text-brown-light tracking-wider uppercase font-medium">
            Showing {productsResult.count} {productsResult.count === 1 ? 'Special Offer' : 'Special Offers'}
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

            {/* Pagination Controls */}
            {productsResult.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12 pt-8 border-t border-border/80">
                {page > 1 && (
                  <Link
                    href={`/offers?page=${page - 1}${sort ? `&sort=${sort}` : ''}`}
                    className="px-4 py-2 text-xs tracking-wider uppercase border border-border text-brown-dark hover:border-tan hover:text-tan transition-colors rounded-xs"
                  >
                    Previous
                  </Link>
                )}

                <span className="text-xs text-brown-light px-4 py-2 font-medium">
                  Page {page} of {productsResult.totalPages}
                </span>

                {page < productsResult.totalPages && (
                  <Link
                    href={`/offers?page=${page + 1}${sort ? `&sort=${sort}` : ''}`}
                    className="px-4 py-2 text-xs tracking-wider uppercase border border-border text-brown-dark hover:border-tan hover:text-tan transition-colors rounded-xs"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16 sm:py-24 bg-white/60 border border-border/70 rounded-md p-8 sm:p-12">
            <div className="w-16 h-16 rounded-full bg-cream border border-border flex items-center justify-center mx-auto mb-5 text-tan">
              <Tag className="w-7 h-7" />
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-semibold uppercase tracking-wider text-brown-dark mb-2">
              No Offers Currently Active
            </h2>
            <p className="text-sm text-brown-light max-w-md mx-auto mb-8 font-body leading-relaxed">
              Our curated special deals are refreshed regularly. Check back soon or explore our complete catalog of signature collections.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brown-dark text-white px-8 py-3.5 text-xs tracking-[0.18em] uppercase font-semibold hover:bg-bronze transition-colors shadow-sm rounded-xs"
            >
              <span>Explore All Collections</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
