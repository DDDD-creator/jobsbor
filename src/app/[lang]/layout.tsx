import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { notFound } from 'next/navigation'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import { locales, defaultLocale, localeToHtmlLang, isValidLocale, languageMetadata } from '@/i18n/config'
import { loadTranslations } from '@/i18n/loader'
import { HreflangTags } from '@/components/i18n/HreflangTags'
import { ScrollToTop } from '@/components/ui/scroll-to-top'
import { Providers } from '@/components/providers'
import { validateEnv } from '@/config/env'
import '../globals.css'

// 验证环境变量
validateEnv()

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
})

// Site URL
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobsbor.com'

/**
 * Generate static params for all supported locales
 */
export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

/**
 * Generate metadata for each locale
 */
export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: string }
}): Promise<Metadata> {
  const locale = isValidLocale(lang) ? lang : defaultLocale
  const translations = await loadTranslations(locale)
  const langMeta = languageMetadata[locale]
  
  return {
    title: {
      default: translations.metadata.title,
      template: '%s | Jobsbor',
    },
    description: translations.metadata.description,
    keywords: translations.metadata.keywords,
    
    metadataBase: new URL(siteUrl),
    
    // Open Graph
    openGraph: {
      title: translations.metadata.title,
      description: translations.metadata.description,
      url: `${siteUrl}/${locale}`,
      siteName: 'Jobsbor',
      locale: localeToHtmlLang[locale].replace('-', '_'),
      type: 'website',
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: translations.metadata.title,
      description: translations.metadata.description,
    },
    
    // Robots
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
    
    // Icons
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    
    // Alternates (hreflang)
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [
          localeToHtmlLang[l],
          `${siteUrl}/${l}`,
        ])
      ),
    },
  }
}

/**
 * Viewport configuration
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0f1c',
}

/**
 * Root layout for language-specific routes
 */
export default async function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  // Validate locale
  if (!isValidLocale(lang)) {
    notFound()
  }

  const locale = lang
  const translations = await loadTranslations(locale)

  return (
    <html 
      lang={localeToHtmlLang[locale]} 
      className="dark"
      dir={languageMetadata[locale].dir}
    >
      <head>
        <HreflangTags 
          currentLocale={locale} 
          pathname={`/${locale}`}
          siteUrl={siteUrl}
        />
      </head>
      <body className={`${inter.className} bg-[#0a0f1c] text-white antialiased`}>
        <Providers>
          {children}
          <SpeedInsights />
          <Analytics />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  )
}
