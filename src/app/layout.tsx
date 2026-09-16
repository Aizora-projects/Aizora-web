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

export const metadata: Metadata = {
  title: {
    default: 'AIZORA | Premium Women\'s Fashion',
    template: '%s | AIZORA',
  },
  description: 'Curated premium women\'s fashion — Cotton Set, Ethnic Wear, Co-ord Sets, Party Wear, Western Wear & Plus Size. Wear Your Elegance.',
  keywords: ['women fashion', 'ethnic wear', 'cotton kurti', 'party wear', 'plus size', 'western wear', 'Indian fashion', 'AIZORA'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'AIZORA',
    title: 'AIZORA | Premium Women\'s Fashion',
    description: 'Curated premium women\'s fashion. Wear Your Elegance.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIZORA | Premium Women\'s Fashion',
    description: 'Curated premium women\'s fashion. Wear Your Elegance.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${plusJakartaSans.variable} ${alexBrush.variable} h-full`} suppressHydrationWarning>
      <body
        className="min-h-full flex flex-col bg-ivory text-brown-dark font-body antialiased selection:bg-tan selection:text-white"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}

