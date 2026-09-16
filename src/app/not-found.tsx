import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="font-heading text-6xl md:text-8xl font-bold text-sand mb-4">404</h1>
        <h2 className="font-heading text-xl md:text-2xl text-brown-dark mb-2">
          Page Not Found
        </h2>
        <p className="text-sm text-brown-light mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brown-dark text-cream px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
