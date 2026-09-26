import Hero from '@/components/storefront/Hero';
import CategoryGrid from '@/components/storefront/CategoryGrid';
import ProductCard from '@/components/storefront/ProductCard';
import Link from 'next/link';
import { getCategories } from '@/actions/categories';
import { getProducts } from '@/actions/products';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aizorastyle.in';

export const metadata: Metadata = {
  title: 'AIZORA | Best Women\'s Clothing Brand & Luxury Ladies Fashion Online',
  description:
    'AIZORA (aizorastyle.in) — India\'s premier women\'s clothing brand. Shop handcrafted cotton sets, designer ethnic wear, co-ord sets, party wear & plus size collections. Free Pan-India Delivery.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AIZORA | Best Women\'s Clothing Brand & Luxury Ladies Fashion',
    description:
      'Premier Indian women\'s clothing brand. Handcrafted cotton sets, ethnic wear, co-ord sets & designer ladies fashion with Free Pan-India Delivery.',
    url: SITE_URL,
    siteName: 'AIZORA',
    type: 'website',
    locale: 'en_IN',
  },
};

export default async function HomePage() {
  // Fetch real data from Supabase
  const [categories, newArrivalsResult, bestSellersResult] = await Promise.all([
    getCategories(true),
    getProducts({ isActive: true, isNew: true, pageSize: 8, orderBy: 'created_at', orderDir: 'desc' }),
    getProducts({ isActive: true, isBestseller: true, pageSize: 8, orderBy: 'created_at', orderDir: 'desc' }),
  ]);

  const newArrivals = newArrivalsResult.data;
  const bestSellers = bestSellersResult.data;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is AIZORA?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AIZORA (aizorastyle.in) is India\'s premier women\'s clothing brand offering a curated range of handcrafted ethnic wear, designer co-ord sets, cotton kurti sets, party wear dresses, western wear, and plus size fashion. Every piece is crafted to celebrate feminine elegance with premium fabrics and contemporary designs.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does AIZORA offer free delivery in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! AIZORA offers Free Pan-India Delivery on all orders. We deliver reliably across all states and cities in India with secure prepaid checkout via our website aizorastyle.in.',
        },
      },
      {
        '@type': 'Question',
        name: 'What types of women\'s clothing does AIZORA sell?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AIZORA sells a wide variety of ladies fashion including cotton suit sets, ethnic kurtis, designer co-ord sets, festive and party wear dresses, casual western wear, and an inclusive plus size collection — all available online at aizorastyle.in.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is AIZORA a good clothing brand for ladies in India?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. AIZORA is rated as one of the best clothing brands for women in India, known for its premium fabric quality, elegant designs, inclusive sizing, and outstanding customer service via WhatsApp support. Shop at aizorastyle.in.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does AIZORA have plus size clothing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, AIZORA has a dedicated plus size collection featuring flattering silhouettes and premium fabrics designed for all body types. Browse the plus size range at aizorastyle.in/category/plus-size.',
        },
      },
    ],
  };

  return (
    <>
      {/* FAQ Rich Result Schema for Google Featured Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section — Exact Typography & Editorial Layout */}
      <Hero />

      {/* Shop by Category — 6 Circular Cards from Database */}
      <CategoryGrid categories={categories} />

      {/* Best Sellers Section — ONLY shown if at least one product has Best Seller toggle ON */}
      {bestSellers.length > 0 && (
        <section className="py-14 lg:py-20 bg-cream/40 border-b border-border/60">
          <div className="max-w-7xl mx-auto px-4 lg:px-8">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8 lg:mb-12">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-tan/15 text-tan text-[10px] tracking-[0.2em] uppercase font-bold mb-2">
                  <span>Customer Favorites</span>
                </div>
                <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl tracking-[0.18em] uppercase text-brown-dark font-medium">
                  Best Sellers
                </h2>
                <p className="text-xs sm:text-sm text-brown-light font-body mt-1">
                  Our Most Coveted & Highly Loved Pieces
                </p>
              </div>
              <Link
                href="/shop?filter=bestseller"
                className="flex items-center gap-1.5 text-xs tracking-[0.16em] uppercase text-brown-dark hover:text-tan transition-colors font-medium group"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* New Arrivals Section */}
      <section className="py-14 lg:py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8 lg:mb-12">
            <div>
              <h2 className="font-heading text-xl sm:text-2xl lg:text-3xl tracking-[0.18em] uppercase text-brown-dark font-medium">
                New Arrivals
              </h2>
              <p className="text-xs sm:text-sm text-brown-light font-body mt-1">
                Fresh Picks, Just for You
              </p>
            </div>
            <Link
              href="/shop?filter=new"
              className="flex items-center gap-1.5 text-xs tracking-[0.16em] uppercase text-brown-dark hover:text-tan transition-colors font-medium group"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Product Grid */}
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-cream/30 border border-border/50 rounded-sm">
              <p className="font-heading text-lg sm:text-xl text-brown-dark mb-2">
                New Arrivals Coming Soon
              </p>
              <p className="text-xs sm:text-sm text-brown-light max-w-md mx-auto font-body">
                Our curated collections are being prepared. Products added via the admin panel will instantly display here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Editorial Brand SEO Section — High Topical Authority for Google Search */}
      <section className="py-16 lg:py-20 bg-cream/30 border-t border-border/70">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
            <span className="text-[10px] tracking-[0.25em] uppercase text-tan font-bold">
              The AIZORA Story
            </span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-brown-dark font-medium leading-tight">
              AIZORA — The Best Clothing Brand for Modern Women & Ladies Fashion
            </h2>
            <div className="w-12 h-0.5 bg-tan/40 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-xs sm:text-sm text-brown-light leading-relaxed font-body">
            <div className="space-y-3 bg-white/70 p-6 rounded-sm border border-border/60">
              <h3 className="font-heading text-base text-brown-dark font-semibold tracking-wide uppercase">
                Handcrafted Women&apos;s Ethnic Wear
              </h3>
              <p>
                At <strong>AIZORA (aizorastyle.in)</strong>, we curate premium ladies fashion designed to celebrate feminine grace. From breathable daily-wear cotton suits and regal festive kurtis to intricately embellished celebratory ensembles, every creation reflects timeless Indian artistry blended with contemporary aesthetics.
              </p>
            </div>

            <div className="space-y-3 bg-white/70 p-6 rounded-sm border border-border/60">
              <h3 className="font-heading text-base text-brown-dark font-semibold tracking-wide uppercase">
                Contemporary Co-ord Sets & Western Styles
              </h3>
              <p>
                Experience effortless chic with our curated range of stylish women&apos;s co-ord sets, vacation wear, and smart western outfits. Designed for the modern woman on the move, our silhouettes offer unmatched comfort, flattering tailored cuts, and premium skin-friendly fabrics.
              </p>
            </div>

            <div className="space-y-3 bg-white/70 p-6 rounded-sm border border-border/60">
              <h3 className="font-heading text-base text-brown-dark font-semibold tracking-wide uppercase">
                Inclusive Sizing & Pan-India Free Delivery
              </h3>
              <p>
                We believe elegance knows no size. Our dedicated <strong>Plus Size collection</strong> and wide size spectrum ensure every woman finds her ideal fit. Enjoy safe prepaid checkout, personalized WhatsApp customer care, and reliable <strong>Free Pan-India Delivery</strong> directly to your doorstep.
              </p>
            </div>
          </div>

          {/* Keyword Discovery Pills for Crawlers & Shoppers */}
          <div className="mt-10 pt-8 border-t border-border/50 text-center">
            <p className="text-[11px] uppercase tracking-[0.16em] text-brown-dark font-semibold mb-3">
              Explore Popular Curations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <Link href="/shop" className="px-3 py-1.5 bg-white border border-border/80 rounded-full text-brown-dark hover:border-tan hover:text-tan transition-colors">
                All Women&apos;s Clothing
              </Link>
              <Link href="/category/cotton" className="px-3 py-1.5 bg-white border border-border/80 rounded-full text-brown-dark hover:border-tan hover:text-tan transition-colors">
                Cotton Kurti Sets
              </Link>
              <Link href="/category/ethnic-wear" className="px-3 py-1.5 bg-white border border-border/80 rounded-full text-brown-dark hover:border-tan hover:text-tan transition-colors">
                Ladies Ethnic Wear
              </Link>
              <Link href="/category/co-ord-set" className="px-3 py-1.5 bg-white border border-border/80 rounded-full text-brown-dark hover:border-tan hover:text-tan transition-colors">
                Designer Co-ord Sets
              </Link>
              <Link href="/category/party-wear" className="px-3 py-1.5 bg-white border border-border/80 rounded-full text-brown-dark hover:border-tan hover:text-tan transition-colors">
                Party Wear Dresses
              </Link>
              <Link href="/category/plus-size" className="px-3 py-1.5 bg-white border border-border/80 rounded-full text-brown-dark hover:border-tan hover:text-tan transition-colors">
                Plus Size Fashion
              </Link>
              <Link href="/offers" className="px-3 py-1.5 bg-white border border-border/80 rounded-full text-brown-dark hover:border-tan hover:text-tan transition-colors">
                Special Offer Items
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
