import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://joeyconnects.world'),
  title: {
    default: 'Joey — Problem-Solving Architect',
    template: '%s | Joey Connects',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
  description: "I find problems. I build solutions. Product architect who builds products, writes about ideas, and believes every problem has a solution.",
  keywords: ['Joey', 'Product Development', 'GEO', 'AI Search Optimization', 'AEO', 'Product Architect'],
  authors: [{ name: 'Joey' }],
  creator: 'Joey',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://joeyconnects.world',
    siteName: 'Joey Connects',
    title: 'Joey — Problem-Solving Architect',
    description: "I find problems. I build solutions.",
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Joey Connects',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Joey — Problem-Solving Architect',
    description: "I find problems. I build solutions.",
    images: ['/og-image.png'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper relative overflow-x-hidden">
        {/* Background Grid */}
        <div className="fixed inset-0 bg-grid opacity-50 z-0"></div>

        <Header />
        <main className="relative z-10 pt-20 md:pt-24 pb-0 lg:pb-2">
          {children}
        </main>
        <Footer />

        {/* Paper Texture Overlay */}
        <div className="paper-overlay"></div>
      </body>
    </html>
  );
}
