'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, Diamond, Leaf, Heart, ChevronDown } from 'lucide-react';

export default function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const collections = [
    { name: 'New Arrivals', href: '/shop?filter=new' },
    { name: 'Cotton Set', href: '/category/cotton' },
    { name: 'Ethnic Wear', href: '/category/ethnic-wear' },
    { name: 'Co-ord Set', href: '/category/co-ord-set' },
    { name: 'Party Wear', href: '/category/party-wear' },
    { name: 'Western Wear', href: '/category/western-wear' },
    { name: 'Plus Size', href: '/category/plus-size' },
    { name: 'Offer Items', href: '/offers' },
  ];

  const customerCare = [
    { name: 'Track Your Order', href: '/account' },
    { name: 'Shopping Bag', href: '/cart' },
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms & Conditions', href: '/terms-and-conditions' },
    { name: 'My Account', href: '/account' },
  ];

  return (
    <footer className="mt-auto">
      {/* Brand Promise Strip */}
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
          {/* Brand Column — Always Visible */}
          <div className="mb-8 md:mb-12">
            <div className="mb-4">
              <Link
                href="/"
                className="inline-block group cursor-pointer"
                aria-label="AIZORA Home"
                onClick={() => {
                  if (typeof window !== 'undefined' && window.location.pathname === '/') {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
              >
                <Image
                  src="/Aizora-logo.png"
                  alt="AIZORA"
                  width={150}
                  height={50}
                  className="h-10 w-auto object-contain brightness-0 invert opacity-90 transition-opacity group-hover:opacity-100"
                  unoptimized
                />
              </Link>
            </div>
            <p className="text-sm leading-relaxed text-cream/60 font-body max-w-md">
              Curated premium women&apos;s fashion for every expression. Timeless elegance, modern confidence.
            </p>
            <p className="text-xs text-tan mt-3 tracking-wider uppercase font-medium">
              Pan India Delivery &nbsp;|&nbsp; Handcrafted Quality
            </p>
          </div>

          {/* ========================================================= */}
          {/* MOBILE VIEW: Accordion Style (< md)                       */}
          {/* ========================================================= */}
          <div className="md:hidden divide-y divide-white/10 border-t border-b border-white/10 mb-8">
            {/* 1. Collections Accordion */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleSection('collections')}
                className="w-full flex items-center justify-between text-xs tracking-[0.18em] uppercase font-semibold text-cream text-left py-1"
                aria-expanded={openSection === 'collections'}
              >
                <span>Collections</span>
                <ChevronDown
                  className={`w-4 h-4 text-tan transition-transform duration-300 ${
                    openSection === 'collections' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'collections' && (
                <ul className="pt-3 pb-2 space-y-2.5 font-body">
                  {collections.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className="text-xs text-cream/70 hover:text-tan transition-colors block py-0.5"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 2. Customer Care Accordion */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleSection('care')}
                className="w-full flex items-center justify-between text-xs tracking-[0.18em] uppercase font-semibold text-cream text-left py-1"
                aria-expanded={openSection === 'care'}
              >
                <span>Customer Care</span>
                <ChevronDown
                  className={`w-4 h-4 text-tan transition-transform duration-300 ${
                    openSection === 'care' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'care' && (
                <ul className="pt-3 pb-2 space-y-2.5 font-body text-xs text-cream/70">
                  {customerCare.map((item) => (
                    <li key={item.name}>
                      <Link href={item.href} className="hover:text-tan transition-colors block py-0.5">
                        {item.name}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-2 text-cream/70 text-[11px]">
                    Support:{' '}
                    <a
                      href="mailto:aizorastyle@gmail.com"
                      className="text-tan hover:text-white transition-colors underline underline-offset-2"
                    >
                      aizorastyle@gmail.com
                    </a>
                  </li>
                </ul>
              )}
            </div>

            {/* 3. Newsletter & Promise Accordion */}
            <div className="py-3.5">
              <button
                type="button"
                onClick={() => toggleSection('newsletter')}
                className="w-full flex items-center justify-between text-xs tracking-[0.18em] uppercase font-semibold text-cream text-left py-1"
                aria-expanded={openSection === 'newsletter'}
              >
                <span>Wear Your Elegance</span>
                <ChevronDown
                  className={`w-4 h-4 text-tan transition-transform duration-300 ${
                    openSection === 'newsletter' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openSection === 'newsletter' && (
                <div className="pt-3 pb-2 space-y-3 font-body">
                  <p className="text-xs text-cream/60 leading-relaxed">
                    Subscribe to receive private previews, style edits, and exclusive invitations.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="bg-white/5 border border-white/15 px-3 py-2 text-xs text-cream placeholder:text-cream/40 flex-1 focus:outline-none focus:border-tan rounded-xs"
                    />
                    <button
                      type="button"
                      className="bg-tan hover:bg-tan-dark text-white px-4 py-2 text-xs tracking-wider uppercase font-semibold transition-colors rounded-xs"
                    >
                      Join
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* DESKTOP VIEW: Multi-Column Grid (md and up)              */}
          {/* ========================================================= */}
          <div className="hidden md:grid md:grid-cols-3 gap-8 lg:gap-12 mb-8">
            {/* Collections */}
            <div>
              <h4 className="text-xs tracking-[0.18em] uppercase font-semibold text-cream mb-4 font-body">
                Collections
              </h4>
              <ul className="space-y-2 font-body">
                {collections.map((item) => (
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
                {customerCare.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="hover:text-tan transition-colors">
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-2 text-cream/70 text-xs">
                  Support:{' '}
                  <a
                    href="mailto:aizorastyle@gmail.com"
                    className="text-tan hover:text-white transition-colors underline underline-offset-2"
                  >
                    aizorastyle@gmail.com
                  </a>
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
                  className="bg-white/5 border border-white/15 px-3 py-2 text-xs text-cream placeholder:text-cream/40 flex-1 focus:outline-none focus:border-tan rounded-xs"
                />
                <button
                  type="button"
                  className="bg-tan hover:bg-tan-dark text-white px-4 py-2 text-xs tracking-wider uppercase font-semibold transition-colors rounded-xs"
                >
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar — With Legal Links and Crafted by ekodrix */}
          <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50 font-body text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1">
              <p>&copy; {new Date().getFullYear()} AIZORA. All rights reserved.</p>
              <span className="hidden sm:inline text-white/20">|</span>
              <Link href="/privacy-policy" className="hover:text-tan transition-colors">
                Privacy Policy
              </Link>
              <span className="text-white/20">•</span>
              <Link href="/terms-and-conditions" className="hover:text-tan transition-colors">
                Terms & Conditions
              </Link>
            </div>

            {/* Crafted by ekodrix link */}
            <p className="flex items-center justify-center gap-1.5 text-xs text-cream/70">
              <span>Crafted by</span>
              <a
                href="https://ekodrix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-tan hover:text-white font-medium underline underline-offset-4 transition-colors"
              >
                ekodrix
              </a>
            </p>

            <p className="tracking-widest uppercase text-[10px] text-cream/40">
              Wear Your Elegance &nbsp;|&nbsp; Crafted for Indian Women
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
