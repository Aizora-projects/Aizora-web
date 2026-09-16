'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Grid3X3,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';
import { logoutAdmin } from '@/actions/auth';
import { useState, useEffect } from 'react';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Categories', href: '/admin/categories', icon: Grid3X3 },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile drawer when route changes or screen resizes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-admin-border z-40 px-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-2 -ml-1 text-stone-700 hover:text-tan transition-colors rounded-lg hover:bg-cream/60 focus:outline-none"
            aria-label="Open navigation drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link href="/admin/dashboard" className="flex items-center">
            <Image
              src="/Aizora-logo.png"
              alt="AIZORA"
              width={100}
              height={32}
              className="h-7 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs text-tan hover:text-tan-dark font-medium px-2.5 py-1.5 rounded-lg bg-cream/70 hover:bg-cream transition-colors"
        >
          <span>Store</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs z-50 lg:hidden transition-opacity"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop Permanent, Mobile Slide-Over) */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-admin-border z-50 transition-transform duration-300 ease-in-out flex flex-col shadow-xs ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 border-b border-admin-border px-5 bg-white">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Image
              src="/Aizora-logo.png"
              alt="AIZORA"
              width={125}
              height={38}
              className="h-8 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>

          {/* Mobile close button */}
          <button
            onClick={() => setIsMobileOpen(false)}
            className="p-2 text-stone-500 hover:text-stone-800 rounded-lg hover:bg-stone-100 transition-colors lg:hidden focus:outline-none"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section Header & Links */}
        <nav className="flex-1 py-5 px-3.5 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-stone-400 px-3 mb-2.5">
            Store Management
          </p>

          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/admin/dashboard' && pathname.startsWith(link.href));
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#FAF5EE] text-tan font-semibold shadow-2xs border border-admin-border/60'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-[#FAF8F5]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    isActive ? 'text-tan stroke-[2.2]' : 'text-stone-400 stroke-[1.8]'
                  }`}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3.5 border-t border-admin-border space-y-1.5 bg-[#FAF8F5]/80">
          {/* Live Storefront Link */}
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-stone-600 hover:text-tan hover:bg-white rounded-lg transition-colors"
          >
            <ExternalLink className="w-4 h-4 flex-shrink-0 text-stone-400" />
            <span>View Live Storefront</span>
          </Link>

          {/* Logout Action */}
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors text-left"
            >
              <LogOut className="w-4 h-4 flex-shrink-0 text-rose-500" />
              <span>Sign Out</span>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
