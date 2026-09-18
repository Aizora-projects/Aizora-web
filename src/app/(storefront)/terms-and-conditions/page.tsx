import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, CheckCircle2, Truck, RefreshCw, AlertCircle, Mail, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | AIZORA Luxury Fashion',
  description: 'Understand the terms, guidelines, and conditions for shopping at AIZORA.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-ivory min-h-screen py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-brown-light mb-6">
          <Link href="/" className="hover:text-tan transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-brown-dark uppercase tracking-wider">Terms & Conditions</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-border/80 pb-8 mb-10 text-center sm:text-left">
          <span className="inline-block px-3 py-1 bg-bronze/10 text-bronze text-[10px] tracking-[0.2em] uppercase font-bold rounded-full mb-3">
            Store Policies
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl text-brown-dark tracking-[0.05em] uppercase font-bold mb-3">
            Terms & Conditions
          </h1>
          <p className="text-sm text-brown-light font-body max-w-2xl">
            Welcome to AIZORA. By visiting our storefront, browsing collections, or placing orders, you agree to comply with and be bound by the following terms.
          </p>
          <p className="text-xs text-brown-muted/80 mt-2 font-mono">
            Effective Date: September 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 font-body text-brown-dark leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white/80 border border-border/70 rounded-xs p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bronze flex-shrink-0">
                <FileText className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                1. General Overview & Acceptance
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80 mb-3">
              This website is operated by AIZORA. Throughout the site, the terms &ldquo;we&rdquo;, &ldquo;us&rdquo;, and &ldquo;our&rdquo; refer to AIZORA. We offer this website, including all products, tools, and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies, and notices stated here.
            </p>
            <p className="text-sm text-brown-dark/80">
              Please read these Terms &amp; Conditions carefully before accessing or using our website. By placing an order via our online checkout or WhatsApp channels, you confirm that you are at least 18 years old or visiting under parental supervision.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white/80 border border-border/70 rounded-xs p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bronze flex-shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                2. Products, Fabric Authenticity & Imagery
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80 mb-3">
              We make every endeavor to accurately display the true colors, delicate embroideries, weaves, and silhouettes of our garments.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-brown-light">
              <li>
                <strong className="text-brown-dark">Color Variation:</strong> Because screen calibrations, display technologies, and studio lighting vary, subtle variations in actual fabric tone may occur and are considered normal.
              </li>
              <li>
                <strong className="text-brown-dark">Handcrafted Artistry:</strong> Many of our ethnic, party, and festive pieces feature hand-embroidery, block prints, or manual detailing. Minor asymmetries celebrate the uniqueness of handmade Indian craftsmanship.
              </li>
              <li>
                <strong className="text-brown-dark">Sizing:</strong> Please consult our size guidance before ordering. Selected designs offer custom or plus size fits as marked.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white/80 border border-border/70 rounded-xs p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bronze flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                3. Order Placement & WhatsApp Confirmation
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80 mb-3">
              AIZORA provides an automated checkout workflow connected with WhatsApp. Once you complete your checkout details, your order summary is recorded in our system and forwarded to our WhatsApp concierge.
            </p>
            <p className="text-sm text-brown-dark/80">
              An order is considered confirmed once our team verifies availability, delivery address, and payment preferences. We reserve the right to decline or cancel orders in cases of stock exhaustion, typographical errors in pricing, or incomplete contact information.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white/80 border border-border/70 rounded-xs p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bronze flex-shrink-0">
                <Truck className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                4. Pan-India Shipping & Delivery Timelines
              </h2>
            </div>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-brown-light">
              <li>
                <strong className="text-brown-dark">Coverage:</strong> We ship Pan India across all serviceable pin codes via trusted logistics networks.
              </li>
              <li>
                <strong className="text-brown-dark">Dispatch Window:</strong> Standard orders are dispatched within 24 to 48 business hours following verification.
              </li>
              <li>
                <strong className="text-brown-dark">Delivery Estimates:</strong> Metros and Tier-1 cities typically receive deliveries within 3–5 working days. Rest of India generally delivers within 5–7 working days.
              </li>
              <li>
                <strong className="text-brown-dark">Tracking:</strong> Live tracking links and courier AWB numbers are shared directly on WhatsApp upon dispatch.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-white/80 border border-border/70 rounded-xs p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bronze flex-shrink-0">
                <RefreshCw className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                5. Returns, Exchanges & Cancellations
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80 mb-3">
              Your satisfaction is paramount. If you receive a piece with a sizing discrepancy or manufacturing defect:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-brown-light">
              <li>Notify our support team within 48 hours of delivery at <a href="mailto:aizorastyle@gmail.com" className="text-tan underline font-medium">aizorastyle@gmail.com</a> or via our WhatsApp channel with clear unboxing photos/videos.</li>
              <li>Items must remain unused, unwashed, with all original tags and luxury packaging intact.</li>
              <li>Size exchanges are accommodated subject to inventory availability.</li>
              <li>Order cancellations are accepted prior to warehouse dispatch. Once handed over to couriers, shipping charges become non-refundable.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="bg-white/80 border border-border/70 rounded-xs p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bronze flex-shrink-0">
                <AlertCircle className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                6. Intellectual Property
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80">
              All designs, visual assets, branding, logotypes, garment photography, and written content on this site are the intellectual property of AIZORA. Reproduction, duplication, or redistribution without express written consent is strictly prohibited.
            </p>
          </section>

          {/* Section 7 - Customer Inquiries */}
          <section className="bg-sand/20 border border-tan/30 rounded-xs p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-tan flex-shrink-0 shadow-2xs">
                <Mail className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                7. Official Customer Support
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80 mb-4">
              For any questions regarding these Terms, your orders, or custom requirements, please reach our dedicated support desk:
            </p>
            <div className="bg-white p-4 sm:p-5 rounded-xs border border-border inline-block min-w-[280px]">
              <p className="text-xs uppercase tracking-wider text-brown-light font-medium mb-1">
                Official Support Email
              </p>
              <a
                href="mailto:aizorastyle@gmail.com"
                className="text-base sm:text-lg font-bold text-tan hover:text-brown-dark transition-colors font-mono underline underline-offset-4"
              >
                aizorastyle@gmail.com
              </a>
              <p className="text-[11px] text-brown-muted mt-2">
                Available Monday to Saturday • 10:00 AM – 7:00 PM IST
              </p>
            </div>
          </section>
        </div>

        {/* Back to Shop */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center px-8 py-3 bg-brown-dark hover:bg-tan text-white text-xs uppercase tracking-[0.16em] font-semibold transition-colors rounded-xs shadow-sm"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
