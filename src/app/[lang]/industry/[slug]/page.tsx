/**
 * Long-tail SEO Industry × Location Pages
 * Generates 200 pages (10 industries × 10 locations × 2 languages)
 * for maximum Google indexing coverage
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { isValidLocale, Locale, defaultLocale, locales } from '@/i18n/config'
import { loadTranslations } from '@/i18n/loader'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import longtailData from '@/data/longtail-pages.json'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { Briefcase, MapPin, ArrowRight, Globe, Zap, Shield, Cpu, Heart, Gamepad2, ShoppingCart, GraduationCap, Bot, Coins, TrendingUp } from 'lucide-react'

export const revalidate = 86400 // Revalidate daily

const INDUSTRY_ICONS: Record<string, any> = {
  web3: Coins,
  fintech: TrendingUp,
  ai: Cpu,
  cybersecurity: Shield,
  cloud: Globe,
  gaming: Gamepad2,
  ecommerce: ShoppingCart,
  healthtech: Heart,
  edtech: GraduationCap,
  robotics: Bot,
}

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = []
  for (const lang of locales) {
    for (const page of [...longtailData.en, ...longtailData.zh]) {
      params.push({ lang, slug: page.slug })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const locale = isValidLocale(lang) ? lang : defaultLocale
  const data = locale === 'zh' ? longtailData.zh : longtailData.en
  const page = data.find((p: any) => p.slug === slug)
  
  if (!page) {
    return { title: 'Not Found | Jobsbor' }
  }

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: `https://jobsbor.vercel.app/${locale}/industry/${slug}`,
    },
  }
}

export default async function IndustryLocationPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const translations = await loadTranslations(locale)
  const data = locale === 'zh' ? longtailData.zh : longtailData.en
  const page = data.find((p: any) => p.slug === slug)

  if (!page) notFound()

  const Icon = INDUSTRY_ICONS[page.industry] || Briefcase
  const t = translations?.jobs || {}

  return (
    <>
      <Header locale={locale} translations={translations} />

      <main className="min-h-screen bg-dark-500">
        {/* Hero */}
        <section className="relative py-20 border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20">
                <Icon className="h-8 w-8 text-neon-cyan" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <MapPin className="h-4 w-4" />
                  <span>{page.locationName}</span>
                </div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              {page.title}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              {page.description}
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="glass-card rounded-2xl p-8 mb-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {locale === 'zh' ? `探索${page.industryName}机会` : `Explore ${page.industryName} Opportunities`}
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {page.content}
                  </p>

                  {/* Popular Job Titles */}
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {locale === 'zh' ? '热门职位' : 'Popular Roles'}
                  </h3>
                  <div className="flex flex-wrap gap-3 mb-6">
                    {page.jobTitles.map((title: string) => (
                      <LocalizedLink
                        key={title}
                        href={`/jobs`}
                        className="px-4 py-2 rounded-full glass-card text-sm text-gray-300 hover:text-neon-cyan hover:border-neon-cyan/30 transition-all"
                      >
                        {title}
                      </LocalizedLink>
                    ))}
                  </div>
                </div>

                {/* Related Locations */}
                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {locale === 'zh' ? '其他地区' : 'Other Locations'}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {data
                      .filter((p: any) => p.industry === page.industry && p.slug !== slug)
                      .slice(0, 6)
                      .map((related: any) => (
                        <LocalizedLink
                          key={related.slug}
                          href={`/industry/${related.slug}`}
                          className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors"
                        >
                          <span className="text-sm text-gray-300">{related.locationName}</span>
                          <ArrowRight className="h-4 w-4 text-gray-600" />
                        </LocalizedLink>
                      ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* CTA */}
                <div className="glass-card rounded-2xl p-6 border border-neon-cyan/20">
                  <Zap className="h-8 w-8 text-neon-cyan mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {locale === 'zh' ? '浏览所有职位' : 'Browse All Jobs'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {locale === 'zh' ? '查看我们所有的远程工作机会' : 'See all our remote job opportunities'}
                  </p>
                  <LocalizedLink
                    href="/jobs"
                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-white font-semibold hover:shadow-[0_0_30px_rgba(0,224,255,0.3)] transition-all"
                  >
                    {locale === 'zh' ? '查看职位' : 'View Jobs'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </LocalizedLink>
                </div>

                {/* Related Industries */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                    {locale === 'zh' ? '相关行业' : 'Related Industries'}
                  </h3>
                  <div className="space-y-2">
                    {data
                      .filter((p: any) => p.location === page.location && p.industry !== page.industry)
                      .slice(0, 5)
                      .map((related: any) => {
                        const RIcon = INDUSTRY_ICONS[related.industry] || Briefcase
                        return (
                          <LocalizedLink
                            key={related.slug}
                            href={`/industry/${related.slug}`}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
                          >
                            <RIcon className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-300">{related.industryName}</span>
                          </LocalizedLink>
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} translations={translations} />
    </>
  )
}
