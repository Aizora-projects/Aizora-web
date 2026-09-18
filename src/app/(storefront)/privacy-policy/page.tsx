import { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Mail, Eye, Bell, RefreshCw } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | AIZORA Luxury Fashion',
  description: 'Learn how AIZORA protects your personal information and respects your privacy.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-ivory min-h-screen py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-medium text-brown-light mb-6">
          <Link href="/" className="hover:text-tan transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-brown-dark uppercase tracking-wider">Privacy Policy</span>
        </nav>

        {/* Page Header */}
        <div className="border-b border-border/80 pb-8 mb-10 text-center sm:text-left">
          <span className="inline-block px-3 py-1 bg-bronze/10 text-bronze text-[10px] tracking-[0.2em] uppercase font-bold rounded-full mb-3">
            Legal & Security
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl text-brown-dark tracking-[0.05em] uppercase font-bold mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-brown-light font-body max-w-2xl">
            At AIZORA, we are committed to safeguarding your personal data and ensuring a secure, transparent shopping experience.
          </p>
          <p className="text-xs text-brown-muted/80 mt-2 font-mono">
            Last Updated: September 2026
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-10 font-body text-brown-dark leading-relaxed">
          {/* Section 1 */}
          <section className="bg-white/80 border border-border/70 rounded-xs p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bronze flex-shrink-0">
                <ShieldCheck className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80 mb-4">
              When you interact with AIZORA, browse our collections, or place an order, we may collect the following information:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-brown-light">
              <li>
                <strong className="text-brown-dark">Contact Information:</strong> Your full name, delivery address, city, state, postal code, mobile phone number, and email address.
              </li>
              <li>
                <strong className="text-brown-dark">Order & Purchase Details:</strong> Products selected, chosen sizes/colors, order history, timestamps, and order status updates.
              </li>
              <li>
                <strong className="text-brown-dark">Communication Records:</strong> WhatsApp messages, support tickets, inquiries, or feedback sent to our official customer care.
              </li>
              <li>
                <strong className="text-brown-dark">Technical & Device Data:</strong> IP address, device type, browser identifiers, and shopping session details to enhance website performance.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-white/80 border border-border/70 rounded-xs p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bronze flex-shrink-0">
                <Eye className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                2. How We Use Your Information
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80 mb-4">
              The details you provide are utilized exclusively to deliver a seamless luxury shopping experience:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-brown-light">
              <li>Processing, verifying, and dispatching your couture orders to your doorstep across India.</li>
              <li>Sending instant WhatsApp order receipts, delivery dispatch alerts, and live tracking links.</li>
              <li>Providing responsive customer support and addressing sizing, fabric, or order queries.</li>
              <li>Maintaining fraud prevention, order authentication, and platform security.</li>
              <li>Sending curated styling previews, festive lookbooks, and private sale invitations (which you may opt out of at any time).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-white/80 border border-border/70 rounded-xs p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bronze flex-shrink-0">
                <Lock className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                3. WhatsApp Ordering & Data Security
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80 mb-3">
              AIZORA integrates WhatsApp order transmission for personalised verification and customer convenience. When initiating checkout, your order receipt details are structured for direct communication with our dedicated support desk.
            </p>
            <p className="text-sm text-brown-dark/80">
              We employ strict encryption and industry-standard security protocols to protect your personal details from unauthorised access, alteration, or disclosure. We never sell, rent, or trade your personal data to third parties.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-white/80 border border-border/70 rounded-xs p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bronze flex-shrink-0">
                <RefreshCw className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                4. Third-Party Services & Couriers
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80">
              To fulfill your orders, your shipping name, delivery address, and phone number are securely shared with vetted Pan-India courier partners (such as Delhivery, Bluedart, or India Post) strictly for delivery execution. These logistics providers are prohibited from using your information for any secondary purpose.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-white/80 border border-border/70 rounded-xs p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-cream flex items-center justify-center text-bronze flex-shrink-0">
                <Bell className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                5. Your Rights & Data Access
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80 mb-3">
              You retain full control over your personal information. At any point, you may:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-brown-light">
              <li>Request a review or update of your stored personal contact information.</li>
              <li>Request the deletion of your account records or past order communication history.</li>
              <li>Opt out of promotional broadcasts or marketing updates with a single click or reply.</li>
            </ul>
          </section>

          {/* Section 6 - Support & Inquiries */}
          <section className="bg-sand/20 border border-tan/30 rounded-xs p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-tan flex-shrink-0 shadow-2xs">
                <Mail className="w-5 h-5 stroke-[1.8]" />
              </div>
              <h2 className="font-heading text-lg sm:text-xl font-bold tracking-wide uppercase text-brown-dark">
                6. Contact Our Privacy & Support Desk
              </h2>
            </div>
            <p className="text-sm text-brown-dark/80 mb-4">
              If you have any questions, clarifications, or requests concerning this Privacy Policy, please reach out directly to our official support desk:
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
                Pan-India Inquiries • Quick Resolution • 10:00 AM – 7:00 PM IST
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
