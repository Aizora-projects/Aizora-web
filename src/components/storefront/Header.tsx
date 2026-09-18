'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Menu, X, ChevronDown, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

const collectionCategories = [
  { label: 'Cotton Set', href: '/category/cotton', description: 'Everyday Breathable Elegance' },
  { label: 'Ethnic Wear', href: '/category/ethnic-wear', description: 'Heritage Craft & Rich Prints' },
  { label: 'Co-ord Set', href: '/category/co-ord-set', description: 'Effortless Modern Coordinates' },
  { label: 'Party Wear', href: '/category/party-wear', description: 'Glamorous Evening Statements' },
  { label: 'Western Wear', href: '/category/western-wear', description: 'Contemporary Chic Silhouettes' },
  { label: 'Plus Size', href: '/category/plus-size', description: 'Flattering Fits For Real Women' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollectionsOpen, setIsCollectionsOpen] = useState(false);
  const [isMobileCollectionsOpen, setIsMobileCollectionsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { itemCount: cartCount } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Announcement Bar — Warm camel/tan matching reference photo */}
      <div className="bg-tan text-white text-[10px] md:text-[11px] tracking-[0.22em] py-2.5 text-center font-body uppercase font-medium">
        PAN INDIA DELIVERY &nbsp;&nbsp;|&nbsp;&nbsp; PREMIUM QUALITY
      </div>

      {/* Main Header */}
      <header className="bg-ivory border-b border-border/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile: Hamburger Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-1.5 text-brown-dark hover:text-tan transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>

            {/* Logo — Desktop Left, Mobile Center */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image
                src="/Aizora-logo.png"
                alt="AIZORA — Wear Your Elegance"
                width={170}
                height={56}
                className="h-9 md:h-11 lg:h-13 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>

            {/* Desktop Navigation — Standard Luxury Curated Links */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9">
              {/* 1. New Arrivals */}
              <Link
                href="/shop?filter=new"
                className="text-[12px] xl:text-[13px] tracking-[0.16em] uppercase text-brown-dark hover:text-tan transition-colors duration-300 font-semibold relative group py-2"
              >
                New Arrivals
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-tan transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* 2. Collections with Luxury Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setIsCollectionsOpen(true)}
                onMouseLeave={() => setIsCollectionsOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => setIsCollectionsOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 text-[12px] xl:text-[13px] tracking-[0.16em] uppercase text-brown-dark hover:text-tan transition-colors duration-300 font-semibold py-2 cursor-pointer"
                >
                  <span>Collections</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-300 ${
                      isCollectionsOpen ? 'rotate-180 text-tan' : 'text-brown-light'
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[460px] transition-all duration-300 z-50 ${
                    isCollectionsOpen
                      ? 'opacity-100 translate-y-0 pointer-events-auto visible'
                      : 'opacity-0 translate-y-1.5 pointer-events-none invisible'
                  }`}
                >
                  <div className="bg-[#FCFAF7] border border-[#E8DFC8] rounded-lg shadow-2xl p-4 backdrop-blur-md">
                    <div className="grid grid-cols-2 gap-1.5 mb-3">
                      {collectionCategories.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setIsCollectionsOpen(false)}
                          className="p-2.5 rounded-md hover:bg-cream transition-all group/item block"
                        >
                          <p className="text-xs font-bold tracking-[0.08em] uppercase text-brown-dark group-hover/item:text-tan transition-colors">
                            {cat.label}
                          </p>
                          <p className="text-[10px] text-brown-light font-body mt-0.5 line-clamp-1">
                            {cat.description}
                          </p>
                        </Link>
                      ))}
                    </div>

                    <div className="border-t border-border/80 pt-2.5 px-2 flex items-center justify-between">
                      <span className="text-[10px] tracking-wider uppercase text-brown-light">
                        Curated Styles
                      </span>
                      <Link
                        href="/shop"
                        onClick={() => setIsCollectionsOpen(false)}
                        className="text-[11px] tracking-[0.14em] uppercase font-semibold text-tan hover:text-brown-dark transition-colors flex items-center gap-1"
                      >
                        <span>View All Collections</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Shop All */}
              <Link
                href="/shop"
                className="text-[12px] xl:text-[13px] tracking-[0.16em] uppercase text-brown-dark hover:text-tan transition-colors duration-300 font-semibold relative group py-2"
              >
                Shop All
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-tan transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* 4. Offer Items */}
              <Link
                href="/offers"
                className="text-[12px] xl:text-[13px] tracking-[0.16em] uppercase text-bronze hover:text-brown-dark transition-colors duration-300 font-semibold relative group py-2 flex items-center gap-1.5"
              >
                <span>Offer Items</span>
                <span className="bg-bronze/12 text-bronze text-[9px] px-2 py-0.5 rounded-full font-bold tracking-widest uppercase">
                  Deals
                </span>
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-bronze transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-2.5 sm:gap-3 lg:gap-4">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-1.5 lg:p-2 text-brown-dark hover:text-tan transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.6]" />
              </button>



              <Link
                href="/cart"
                className="p-1.5 lg:p-2 text-brown-dark hover:text-tan transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-tan text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-medium">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Search Bar Dropdown */}
        {isSearchOpen && (
          <div className="border-t border-border animate-slide-down bg-ivory/95 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto px-4 py-4">
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search className="w-5 h-5 text-brown-light flex-shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by product, category, or style..."
                  className="flex-1 bg-transparent text-sm text-brown-dark placeholder:text-brown-light/60 focus:outline-none font-body"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-brown-light hover:text-brown-dark text-xs uppercase tracking-wider font-medium"
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Slide-out Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-ivory animate-slide-down shadow-2xl flex flex-col z-10 border-r border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <Image
                src="/Aizora-logo.png"
                alt="AIZORA"
                width={130}
                height={42}
                className="h-8 w-auto object-contain"
                unoptimized
              />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-brown-dark hover:text-tan transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-6 py-6 space-y-3 overflow-y-auto">
              <Link
                href="/shop?filter=new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm tracking-[0.14em] uppercase text-brown-dark hover:text-tan transition-colors font-bold py-2 border-b border-border/60"
              >
                New Arrivals
              </Link>

              {/* Collections Accordion */}
              <div className="py-1 border-b border-border/60">
                <button
                  type="button"
                  onClick={() => setIsMobileCollectionsOpen(!isMobileCollectionsOpen)}
                  className="w-full flex items-center justify-between text-sm tracking-[0.14em] uppercase text-brown-dark font-bold py-2 cursor-pointer"
                >
                  <span>Collections</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isMobileCollectionsOpen ? 'rotate-180 text-tan' : 'text-brown-light'
                    }`}
                  />
                </button>

                {isMobileCollectionsOpen && (
                  <div className="pl-3 pb-2 pt-1 space-y-2.5">
                    {collectionCategories.map((cat) => (
                      <Link
                        key={cat.href}
                        href={cat.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block text-xs tracking-[0.08em] uppercase text-brown-light hover:text-brown-dark transition-colors py-0.5 font-medium"
                      >
                        {cat.label}
                      </Link>
                    ))}
                    <Link
                      href="/shop"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-flex items-center gap-1.5 text-xs tracking-[0.1em] uppercase text-tan hover:text-brown-dark transition-colors pt-1 font-semibold"
                    >
                      <span>All Collections</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm tracking-[0.14em] uppercase text-brown-dark hover:text-tan transition-colors font-bold py-2 border-b border-border/60"
              >
                Shop All
              </Link>

              <Link
                href="/offers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-sm tracking-[0.14em] uppercase text-bronze hover:text-brown-dark transition-colors font-bold py-2 border-b border-border/60"
              >
                <span>Offer Items</span>
                <span className="bg-bronze/15 text-bronze text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Deals
                </span>
              </Link>

              <div className="pt-6 space-y-3">
                <p className="text-[10px] tracking-[0.25em] uppercase text-brown-light font-medium mb-2">
                  Account
                </p>
                <Link
                  href="/account"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-sm text-brown-light hover:text-brown-dark transition-colors"
                >
                  My Profile & Orders
                </Link>

              </div>
            </nav>

            <div className="p-5 border-t border-border bg-cream/40">
              <p className="text-[10px] tracking-[0.2em] text-brown-light text-center uppercase font-medium">
                PAN INDIA DELIVERY &nbsp;|&nbsp; PREMIUM QUALITY
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
