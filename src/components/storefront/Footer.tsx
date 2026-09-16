import Link from 'next/link';
import Image from 'next/image';
import { Truck, Diamond, Leaf, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* Brand Promise Strip — Exact Match from Bottom of Mockup */}
      <section className="bg-promise-bg border-t border-b border-border-dark/40 py-7 lg:py-9">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x lg:divide-border-dark/50">
            {[
              { icon: Truck, line1: 'PAN INDIA', line2: 'DELIVERY' },
              { icon: Diamond, line1: 'PREMIUM', line2: 'QUALITY' },
              { icon: Leaf, line1: 'SUSTAINABLE', line2: 'FASHION' },
              { icon: Heart, line1: 'MADE FOR', line2: 'REAL WOMEN' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3.5 justify-center px-3 sm:px-6">
                <item.icon className="w-6 h-6 lg:w-7 lg:h-7 text-brown-light stroke-[1.4] flex-shrink-0" />
                <div className="text-left">
                  <p className="text-[11px] sm:text-xs lg:text-[13px] font-bold tracking-[0.12em] uppercase text-brown-dark leading-tight">
                    {item.line1}
                  </p>
                  <p className="text-[11px] sm:text-xs lg:text-[13px] font-bold tracking-[0.12em] uppercase text-brown-dark leading-tight mt-0.5">
                    {item.line2}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Luxury Editorial Footer */}
      <div className="bg-[#241913] text-cream/80 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div>
              <div className="mb-4">
                <Image
                  src="/Aizora-logo.png"
                  alt="AIZORA"
                  width={150}
                  height={50}
                  className="h-10 w-auto object-contain brightness-0 invert opacity-90"
                  unoptimized
                />
              </div>
              <p className="text-sm leading-relaxed text-cream/60 font-body">
                Curated premium women&apos;s fashion for every expression. Timeless elegance, modern confidence.
              </p>
              <p className="text-xs text-tan mt-4 tracking-wider uppercase font-medium">
                Pan India Delivery &nbsp;|&nbsp; Handcrafted Quality
              </p>
            </div>

            {/* Collections */}
            <div>
              <h4 className="text-xs tracking-[0.18em] uppercase font-semibold text-cream mb-4 font-body">
                Collections
              </h4>
              <ul className="space-y-2 font-body">
                {[
                  { name: 'New Arrivals', href: '/shop?filter=new' },
                  { name: 'Cotton Set', href: '/category/cotton' },
                  { name: 'Ethnic Wear', href: '/category/ethnic-wear' },
                  { name: 'Co-ord Set', href: '/category/co-ord-set' },
                  { name: 'Party Wear', href: '/category/party-wear' },
                  { name: 'Western Wear', href: '/category/western-wear' },
                  { name: 'Plus Size', href: '/category/plus-size' },
                  { name: 'Offer Items', href: '/offers' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-xs sm:text-sm text-cream/60 hover:text-tan transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Care */}
            <div>
              <h4 className="text-xs tracking-[0.18em] uppercase font-semibold text-cream mb-4 font-body">
                Customer Care
              </h4>
              <ul className="space-y-2 font-body text-xs sm:text-sm text-cream/60">
                <li>
                  <Link href="/account" className="hover:text-tan transition-colors">
                    Track Your Order
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-tan transition-colors">
                    Shopping Bag
                  </Link>
                </li>
                <li>
                  <Link href="/wishlist" className="hover:text-tan transition-colors">
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link href="/account" className="hover:text-tan transition-colors">
                    My Account
                  </Link>
                </li>
                <li className="pt-2 text-cream/50 text-xs">
                  Support: care@aizora.in
                </li>
              </ul>
            </div>

            {/* Newsletter & Promise */}
            <div>
              <h4 className="text-xs tracking-[0.18em] uppercase font-semibold text-cream mb-4 font-body">
                Wear Your Elegance
              </h4>
              <p className="text-xs text-cream/60 mb-4 leading-relaxed font-body">
                Subscribe to receive private previews, style edits, and exclusive invitations.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/5 border border-white/15 px-3 py-2 text-xs text-cream placeholder:text-cream/40 flex-1 focus:outline-none focus:border-tan"
                />
                <button
                  type="button"
                  className="bg-tan hover:bg-tan-dark text-white px-4 py-2 text-xs tracking-wider uppercase font-medium transition-colors"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/40 font-body">
            <p>&copy; {new Date().getFullYear()} AIZORA. All rights reserved.</p>
            <p className="tracking-widest uppercase text-[10px]">
              Wear Your Elegance &nbsp;|&nbsp; Crafted for Indian Women
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
