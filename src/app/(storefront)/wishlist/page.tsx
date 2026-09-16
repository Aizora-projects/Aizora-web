import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import ProductCard from '@/components/storefront/ProductCard';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import type { Product } from '@/types/database';

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'Your saved favorites at AIZORA',
};

export default async function WishlistPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let products: Product[] = [];

  if (user) {
    const adminClient = createAdminClient();
    const { data: wishlistItems } = await supabase
      .from('wishlists')
      .select('product_id')
      .eq('user_id', user.id);

    if (wishlistItems && wishlistItems.length > 0) {
      const productIds = wishlistItems.map((w) => w.product_id);
      const { data } = await adminClient
        .from('products')
        .select('*, category:categories(*), images:product_images(*)')
        .in('id', productIds)
        .eq('is_active', true);

      products = (data as unknown as Product[]) || [];
    }
  }

  return (
    <div className="bg-ivory min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <h1 className="font-heading text-2xl lg:text-3xl font-bold tracking-[0.1em] uppercase text-brown-dark mb-8">
          Wishlist
        </h1>

        {!user ? (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-sand mx-auto mb-4" />
            <h2 className="font-heading text-xl text-brown-dark mb-2">
              Sign in to view your wishlist
            </h2>
            <p className="text-sm text-brown-light mb-6">
              Save your favorite pieces and access them anytime.
            </p>
            <Link
              href="/account"
              className="inline-flex items-center gap-2 bg-brown-dark text-cream px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold transition-colors"
            >
              Sign In
            </Link>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 text-sand mx-auto mb-4" />
            <h2 className="font-heading text-xl text-brown-dark mb-2">
              Your wishlist is waiting for something beautiful
            </h2>
            <p className="text-sm text-brown-light mb-6">
              Browse our collection and save pieces you love.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-brown-dark text-cream px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold transition-colors"
            >
              Explore Collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
