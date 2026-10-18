import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

const displayFont = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['500', '600', '700'],
  display: 'swap',
});

const bodyFont = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Adventure Hub | Escape the Ordinary',
  description: 'Discover extraordinary stays, outdoor adventures and unforgettable getaways with Adventure Hub.',
  openGraph: {
    title: 'Adventure Hub | Escape the Ordinary',
    description: 'Discover extraordinary stays, outdoor adventures and unforgettable getaways with Adventure Hub.',
    siteName: 'Adventure Hub',
    locale: 'en_KE',
    type: 'website',
    images: [{ url: '/images/hero-maasai-mara-balloon.jpg', alt: 'A hot-air balloon above a herd of zebras in the Maasai Mara, Kenya' }],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
