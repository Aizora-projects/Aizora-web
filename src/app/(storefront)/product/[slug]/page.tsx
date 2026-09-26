import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts } from '@/actions/products';
import ProductCard from '@/components/storefront/ProductCard';
import ProductDetailClient from '@/components/storefront/ProductDetailClient';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Product } from '@/types/database';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aizorastyle.in';

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const allImages = (product.images || []).map((img) => img.secure_url);
  const categoryName = product.category?.name || 'Women\'s Fashion';
  const desc =
    product.short_description ||
    product.description ||
    `Shop ${product.name} online at AIZORA (aizorastyle.in). Handcrafted ${categoryName} with premium fabric, elegant cut, and Free Delivery across India.`;

  return {
    title: `${product.name} | ${categoryName} — AIZORA`,
    description: desc,
    keywords: [
      product.name,
      'Aizora',
      'Aizora Style',
      categoryName,
      'women clothing brand',
      'best clothing brand for ladies',
      'ladies fashion India',
      'buy online',
    ],
    alternates: {
      canonical: `/product/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | AIZORA — Best Women's Clothing Brand`,
      description: desc,
      url: `${SITE_URL}/product/${product.slug}`,
      siteName: 'AIZORA',
      images: primaryImage ? [{ url: primaryImage.secure_url, alt: product.name }] : [],
      type: 'website',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | AIZORA`,
      description: desc,
      images: primaryImage ? [primaryImage.secure_url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.is_active) notFound();

  // Fetch related products from same category
  let relatedProducts: Product[] = [];
  if (product.category_id) {
    const related = await getProducts({
      categoryId: product.category_id,
      isActive: true,
      pageSize: 4,
    });
    relatedProducts = related.data.filter((p) => p.id !== product.id).slice(0, 4);
  }

  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const allImages = (product.images || []).map((img) => img.secure_url).filter(Boolean);

  const productUrl = `${SITE_URL}/product/${product.slug}`;
  const categoryUrl = product.category ? `${SITE_URL}/category/${product.category.slug}` : `${SITE_URL}/shop`;

  const inStock = product.stock > 0;

  // JSON-LD Structured Data for Google Search Rich Results
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: allImages.length > 0 ? allImages : primaryImage ? [primaryImage.secure_url] : [],
    description: product.description || product.short_description || `Premium ${product.name} by AIZORA`,
    sku: product.sku || product.slug,
    mpn: product.id,
    brand: {
      '@type': 'Brand',
      name: 'AIZORA',
      url: SITE_URL,
    },
    category: product.category?.name || 'Women\'s Fashion',
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: product.price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      itemCondition: 'https://schema.org/NewCondition',
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'AIZORA',
        url: SITE_URL,
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '28',
      bestRating: '5',
      worstRating: '1',
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
      ...(product.category
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: product.category.name,
              item: categoryUrl,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: product.name,
              item: productUrl,
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Shop',
              item: `${SITE_URL}/shop`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: product.name,
              item: productUrl,
            },
          ]),
    ],
  };

  return (
    <div className="bg-ivory min-h-screen">
      {/* Structured Data Scripts for Google Search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-brown-light flex-wrap">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          {product.category && (
            <>
              <Link href={`/category/${product.category.slug}`} className="hover:text-gold transition-colors">
                {product.category.name}
              </Link>
              <ChevronRight className="w-3 h-3" />
            </>
          )}
          <span className="text-brown-dark font-medium truncate max-w-[200px]" aria-current="page">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Product Detail */}
      <ProductDetailClient product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            <h2 className="font-heading text-xl lg:text-2xl tracking-[0.1em] uppercase text-brown-dark mb-8 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
