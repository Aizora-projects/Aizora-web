import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import MobileNav from '@/components/storefront/MobileNav';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <WishlistProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
        </div>
      </WishlistProvider>
    </CartProvider>
  );
}
