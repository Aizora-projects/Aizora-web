import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, ArrowRight, Tag } from 'lucide-react';
import { getProducts } from '@/actions/products';
import ProductCard from '@/components/storefront/ProductCard';
import ShopSort from '@/components/storefront/ShopSort';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aizorastyle.in';

export const metadata: Metadata = {
  title: 'Exclusive Offers & Discounts on Women\'s Clothing | AIZORA',
  description:
    'Discover exclusive limited-time deals on premium ladies ethnic wear, cotton sets, and designer fashion at AIZORA (aizorastyle.in). Luxury styles at special prices with Free Pan-India Delivery.',
  keywords: [
    'Aizora Offers',
    'women clothing sale India',
    'ethnic wear discounts',
    'kurtis on sale',
    'cotton sets offers',
    'best clothing brand for ladies',
  ],
  alternates: {
    canonical: '/offers',
  },
  openGraph: {
    title: 'Offer Items | Special Deals & Discounts — AIZORA',
    description:
      'Explore exclusive limited-time offers and special pricing on premium women\'s fashion at AIZORA.',
    url: `${SITE_URL}/offers`,
    siteName: 'AIZORA',
    type: 'website',
    locale: 'en_IN',
  },
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

  const offersJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Special Offers & Exclusive Discounts on Women\'s Fashion',
    description: 'Exclusive handpicked styles at special pricing from AIZORA',
    url: `${SITE_URL}/offers`,
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Offer Items',
        item: `${SITE_URL}/offers`,
      },
    ],
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brown-light font-body">
          <Link href="/" className="hover:text-tan transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 stroke-[1.5]" />
          <span className="text-brown-dark font-medium" aria-current="page">Offer Items</span>
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

      {/* Offers Products Grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        {/* Control Bar: Items Count + Sort */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
          <span className="text-xs tracking-[0.1em] uppercase text-brown-light font-medium">
            {productsResult.count} {productsResult.count === 1 ? 'Special Offer Item' : 'Special Offer Items'}
          </span>
          <ShopSort />
        </div>

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
                {Array.from({ length: productsResult.totalPages }, (_, i) => i + 1).map((p) => {
                  const params = new URLSearchParams();
                  if (sort) params.set('sort', sort);
                  params.set('page', String(p));
                  return (
                    <Link
                      key={p}
                      href={`/offers?${params.toString()}`}
                      className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${
                        p === page
                          ? 'bg-brown-dark text-cream border-brown-dark font-semibold'
                          : 'border-border text-brown-dark hover:border-tan hover:text-tan'
                      }`}
                    >
                      {p}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 px-4">
            <div className="w-14 h-14 rounded-full bg-tan/15 text-tan flex items-center justify-center mx-auto mb-4">
              <Tag className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h2 className="font-heading text-xl sm:text-2xl text-brown-dark mb-2">
              No Active Offers Right Now
            </h2>
            <p className="text-sm text-brown-light/80 max-w-md mx-auto mb-8 font-body leading-relaxed">
              New limited-time collections and exclusive festival offers are added frequently. Check back soon or explore our complete catalog.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2.5 bg-brown-dark hover:bg-black text-white px-7 py-3 text-xs tracking-[0.16em] uppercase font-bold rounded-xs transition-colors shadow-sm"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
