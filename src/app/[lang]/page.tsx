/**
 * Multilingual Home Page
 * Displays localized content based on the current locale
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { isValidLocale, Locale, defaultLocale, localeToHtmlLang, locales } from '@/i18n/config'
import { loadTranslations } from '@/i18n/loader'
import { HomeContent } from './HomeContent'
import { generateHomeSEO } from '@/lib/seo'
import { Skeleton } from '@/components/ui/Skeleton'

/**
 * Generate static params for all locales
 */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

/**
 * Generate metadata for the home page
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : defaultLocale
  return generateHomeSEO(locale)
}

// Loading fallback for home content
function HomeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero skeleton */}
      <div className="container mx-auto px-4 py-20">
        <Skeleton.Title className="mx-auto max-w-3xl" />
        <Skeleton.Text lines={2} className="mx-auto mt-4 max-w-2xl" />
        <div className="mt-8 flex justify-center gap-4">
          <Skeleton.Card className="w-32 h-10" />
          <Skeleton.Card className="w-32 h-10" />
        </div>
      </div>
      {/* Jobs section skeleton */}
      <div className="container mx-auto px-4 py-12">
        <Skeleton.Title className="mb-8" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton.JobCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * Home page component
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  
  // Validate locale
  if (!isValidLocale(lang)) {
    notFound()
  }

  const locale = lang
  const translations = await loadTranslations(locale)

  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent locale={locale} translations={translations} />
    </Suspense>
  )
}
