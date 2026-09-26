import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCategoryBySlug } from '@/actions/categories';
import { getProducts } from '@/actions/products';
import ProductCard from '@/components/storefront/ProductCard';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aizorastyle.in';

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const title = `${category.name} Collection for Women | AIZORA`;
  const description =
    category.description ||
    `Explore the ${category.name} collection at AIZORA (aizorastyle.in). Premium handcrafted ladies fashion, pure fabrics, and contemporary elegance with Free Pan-India Delivery.`;

  return {
    title,
    description,
    keywords: [
      category.name,
      `${category.name} women`,
      `${category.name} online`,
      'Aizora',
      'Aizora Style',
      'best clothing brand for ladies',
      'women clothing brand India',
    ],
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/category/${category.slug}`,
      siteName: 'AIZORA',
      images: category.image_url ? [{ url: category.image_url, alt: category.name }] : [],
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: category.image_url ? [category.image_url] : [],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || '1', 10);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const productsResult = await getProducts({
    categoryId: category.id,
    isActive: true,
    page,
    pageSize: 12,
  });

  const categoryUrl = `${SITE_URL}/category/${category.slug}`;

  // Structured Data for Google Collection & Breadcrumbs
  const categoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Collection`,
    description: category.description || `Shop ${category.name} at AIZORA`,
    url: categoryUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: productsResult.data.map((p, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        url: `${SITE_URL}/product/${p.slug}`,
        name: p.name,
      })),
    },
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
        name: category.name,
        item: categoryUrl,
      },
    ],
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
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
          <span className="text-brown-dark font-medium" aria-current="page">{category.name}</span>
        </nav>
      </div>

      {/* Category Header */}
      <div className="relative bg-cream py-12 lg:py-16 mb-8">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center">
          {category.image_url && (
            <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-2 border-gold mx-auto mb-4 relative">
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
          )}
          <h1 className="font-heading text-3xl lg:text-4xl font-bold tracking-[0.1em] uppercase text-brown-dark mb-2">
            {category.name}
          </h1>
          {category.tagline && (
            <p className="text-sm text-brown-light italic">{category.tagline}</p>
          )}
          {category.description && (
            <p className="text-sm text-brown-light mt-2 max-w-md mx-auto">{category.description}</p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        {productsResult.data.length > 0 ? (
          <>
            <p className="text-xs text-brown-light mb-6 tracking-wider uppercase">
              {productsResult.count} {productsResult.count === 1 ? 'product' : 'products'}
            </p>
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
                    href={`/category/${slug}?page=${p}`}
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
            <p className="font-heading text-xl text-brown-light mb-2">No products yet</p>
            <p className="text-sm text-brown-light/70 mb-6">
              Products for {category.name} will appear here once added from the admin panel.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brown-dark text-cream px-6 py-3 text-xs tracking-[0.15em] uppercase hover:bg-gold transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
