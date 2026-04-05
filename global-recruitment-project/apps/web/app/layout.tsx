import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'GlobalRecruit | 全球金融&互联网招聘平台',
    template: '%s | GlobalRecruit',
  },
  description: '连接全球顶尖金融与互联网人才的机会。AI驱动的智能匹配，让您的职业生涯腾飞。',
  keywords: ['招聘', '金融', '互联网', '求职', '人才', 'global', 'finance', 'tech', 'jobs'],
  authors: [{ name: 'GlobalRecruit Team' }],
  creator: 'GlobalRecruit',
  publisher: 'GlobalRecruit',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://globalrecruit.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'GlobalRecruit | 全球金融&互联网招聘平台',
    description: '连接全球顶尖金融与互联网人才的机会',
    siteName: 'GlobalRecruit',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GlobalRecruit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GlobalRecruit | 全球金融&互联网招聘平台',
    description: '连接全球顶尖金融与互联网人才的机会',
    images: ['/og-image.jpg'],
    creator: '@globalrecruit',
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
