import { Metadata } from 'next';
import { getProducts } from '@/actions/products';
import { getCategories } from '@/actions/categories';
import ProductCard from '@/components/storefront/ProductCard';
import ShopSort from '@/components/storefront/ShopSort';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aizorastyle.in';

export const metadata: Metadata = {
  title: 'Shop All Women\'s Fashion & Designer Collections | AIZORA',
  description:
    'Browse the full AIZORA catalogue (aizorastyle.in) — the best clothing brand for ladies. Shop handcrafted cotton sets, designer kurtis, ethnic wear, co-ord sets, party wear & plus size fashion with Free Pan-India Delivery.',
  keywords: [
    'Aizora Shop',
    'Aizora Style',
    'shop women clothing online India',
    'best clothing brand for ladies',
    'designer kurtis online',
    'cotton suits online',
    'ladies party wear dresses',
    'women co-ord sets',
  ],
  alternates: {
    canonical: '/shop',
  },
  openGraph: {
    title: 'Shop All Women\'s Fashion | AIZORA — Best Clothing Brand',
    description:
      'Browse our curated collection of premium women\'s fashion at AIZORA. Handcrafted ethnic wear, cotton sets, and designer ladies fashion.',
    url: `${SITE_URL}/shop`,
    siteName: 'AIZORA',
    type: 'website',
    locale: 'en_IN',
  },
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

  const shopJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Shop All Women\'s Fashion',
    description: 'Browse our complete collection of premium ladies fashion at AIZORA',
    url: `${SITE_URL}/shop`,
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
        name: 'Shop',
        item: `${SITE_URL}/shop`,
      },
    ],
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shopJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brown-light">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brown-dark font-medium" aria-current="page">Shop</span>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-border">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <Link
              href="/shop"
              className={`px-3 py-1.5 text-xs tracking-wider uppercase rounded-xs whitespace-nowrap transition-colors ${
                !category
                  ? 'bg-brown-dark text-cream'
                  : 'bg-cream text-brown-dark hover:bg-gold/10'
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.id}`}
                className={`px-3 py-1.5 text-xs tracking-wider uppercase rounded-xs whitespace-nowrap transition-colors ${
                  category === cat.id
                    ? 'bg-brown-dark text-cream'
                    : 'bg-cream text-brown-dark hover:bg-gold/10'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="text-xs text-brown-light whitespace-nowrap">
              {productsResult.count} {productsResult.count === 1 ? 'item' : 'items'}
            </span>
            <ShopSort />
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
                {Array.from({ length: productsResult.totalPages }, (_, i) => i + 1).map((p) => {
                  const params = new URLSearchParams();
                  if (category) params.set('category', category);
                  if (sort) params.set('sort', sort);
                  if (filter) params.set('filter', filter);
                  params.set('page', String(p));
                  return (
                    <Link
                      key={p}
                      href={`/shop?${params.toString()}`}
                      className={`w-10 h-10 flex items-center justify-center text-sm border transition-colors ${
                        p === page
                          ? 'bg-brown-dark text-cream border-brown-dark'
                          : 'border-border text-brown-dark hover:border-gold hover:text-gold'
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
          <div className="text-center py-20">
            <p className="font-heading text-xl text-brown-light mb-2">No products found</p>
            <p className="text-sm text-brown-light/70 mb-6">
              Try adjusting your filters or browse all categories.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brown-dark text-cream px-6 py-3 text-xs tracking-[0.15em] uppercase hover:bg-gold transition-colors"
            >
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
