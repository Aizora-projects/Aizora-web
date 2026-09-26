import type { Metadata } from 'next';
import { Playfair_Display, Plus_Jakarta_Sans, Alex_Brush } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const alexBrush = Alex_Brush({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://aizorastyle.in';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'AIZORA | Best Women\'s Clothing Brand & Luxury Ladies Fashion Online',
    template: '%s | AIZORA',
  },
  description:
    'AIZORA (aizorastyle.in) — India\'s premier women\'s clothing brand. Discover handcrafted cotton sets, designer ethnic wear, stylish co-ord sets, party wear dresses, western wear & plus size collections. Wear Your Elegance with Free Pan-India Delivery.',
  keywords: [
    'Aizora',
    'Aizora Style',
    'aizorastyle.in',
    'aizora clothing',
    'aizora fashion',
    'best clothing brand',
    'best clothing brand for ladies',
    'best women clothing brand India',
    'women clothing brand',
    'ladies clothing online',
    'ethnic wear for women',
    'cotton kurti sets',
    'cotton suit sets',
    'designer co-ord sets',
    'ladies party wear',
    'women western wear',
    'plus size ethnic wear',
    'plus size ladies clothing',
    'traditional wear women',
    'luxury women fashion India',
    'designer dresses for women',
  ],
  authors: [{ name: 'AIZORA', url: SITE_URL }],
  creator: 'AIZORA',
  publisher: 'AIZORA',
  applicationName: 'AIZORA',
  category: 'Fashion & Apparel',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'AIZORA',
    title: 'AIZORA | Best Women\'s Clothing Brand & Luxury Ladies Fashion Online',
    description:
      'AIZORA — Premier Indian women\'s clothing brand. Discover handcrafted cotton sets, designer ethnic wear, co-ord sets & elegant party wear with Free Delivery Pan India.',
    images: [
      {
        url: '/icon.png',
        width: 1200,
        height: 630,
        alt: 'AIZORA — Best Clothing Brand for Women',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIZORA | Best Women\'s Clothing Brand & Luxury Ladies Fashion',
    description:
      'Premier Indian women\'s clothing brand. Handcrafted cotton sets, ethnic wear, co-ord sets & designer ladies fashion.',
    images: ['/icon.png'],
    creator: '@aizorastyle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '3RICnFHQV5D66ooFq1fdhXgQAr_4z7UMYXLJ7hROmjw',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgAndWebsiteSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'AIZORA',
        alternateName: ['Aizora Style', 'Aizora Clothing', 'Aizora Fashion', 'AIZORA Brand'],
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          url: `${SITE_URL}/icon.png`,
          caption: 'AIZORA Logo',
        },
        image: `${SITE_URL}/icon.png`,
        description:
          'AIZORA is a premier Indian women\'s clothing brand offering luxury ethnic wear, handcrafted cotton sets, designer kurtis, co-ord sets, party wear, and plus size fashion.',
        email: 'care@aizorastyle.in',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'IN',
        },
        sameAs: [
          'https://www.instagram.com/aizorastyle',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'AIZORA',
        alternateName: 'Aizora Style',
        description: 'Best Women\'s Clothing Brand & Luxury Ladies Fashion Online',
        publisher: {
          '@id': `${SITE_URL}/#organization`,
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        ],
        inLanguage: 'en-IN',
      },
    ],
  };

  return (
    <html lang="en" className={`${playfair.variable} ${plusJakartaSans.variable} ${alexBrush.variable} h-full`} suppressHydrationWarning>
      <head>
        <meta name="google-site-verification" content="3RICnFHQV5D66ooFq1fdhXgQAr_4z7UMYXLJ7hROmjw" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgAndWebsiteSchema) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col bg-ivory text-brown-dark font-body antialiased selection:bg-tan selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
