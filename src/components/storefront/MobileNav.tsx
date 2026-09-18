'use client';

import Link from 'next/link';
import { Home, Grid3X3, Search, Sparkles, ShoppingBag } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';

const navItems = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/shop', icon: Grid3X3 },
  { label: 'Offers', href: '/offers', icon: Sparkles },
  { label: 'Search', href: '/search', icon: Search },
  { label: 'Bag', href: '/cart', icon: ShoppingBag },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { itemCount: cartCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const count = item.label === 'Bag' ? cartCount : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 relative transition-colors ${
                isActive ? 'text-tan' : 'text-brown-light hover:text-brown-dark'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[1.5]" />
              <span className="text-[9px] tracking-wider uppercase font-medium">{item.label}</span>
              {count > 0 && (
                <span className="absolute top-0 right-1 bg-tan text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium">
                  {count}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
