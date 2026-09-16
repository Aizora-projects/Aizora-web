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

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];

  return {
    title: product.name,
    description: product.short_description || product.description || `Shop ${product.name} at AIZORA`,
    openGraph: {
      title: `${product.name} | AIZORA`,
      description: product.short_description || `Shop ${product.name} at AIZORA`,
      images: primaryImage ? [{ url: primaryImage.secure_url }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} | AIZORA`,
      description: product.short_description || `Shop ${product.name} at AIZORA`,
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

  return (
    <div className="bg-ivory min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-brown-light flex-wrap">
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
          <span className="text-brown-dark font-medium truncate max-w-[200px]">{product.name}</span>
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
