/**
 * Long-tail SEO Industry × Location Pages (200 pages)
 * Auto-generated for maximum Google indexing coverage
 * With dynamic job listings and rich content
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { isValidLocale, Locale, defaultLocale, locales } from '@/i18n/config'
import { loadTranslations } from '@/i18n/loader'
import longtailData from '@/data/longtail-pages.json'
import { jobs } from '@/data/jobs'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JobCard } from '@/components/jobs/JobCard'
import { LocalizedLink } from '@/components/i18n/localized-link'
import {
  Briefcase, MapPin, ArrowRight, Globe, Zap, Shield,
  Cpu, Heart, Gamepad2, ShoppingCart, GraduationCap, Bot,
  Coins, TrendingUp, Clock, Building2, Users, ExternalLink
} from 'lucide-react'

export const revalidate = 86400 // Revalidate daily

const INDUSTRY_ICONS: Record<string, any> = {
  web3: Coins, fintech: TrendingUp, ai: Cpu, cybersecurity: Shield,
  cloud: Globe, gaming: Gamepad2, ecommerce: ShoppingCart,
  healthtech: Heart, edtech: GraduationCap, robotics: Bot,
}

const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  web3: ['blockchain', 'smart contract', 'defi', 'nft', 'crypto', 'solana', 'ethereum', 'dao'],
  fintech: ['quantitative', 'trading', 'payment', 'banking', 'financial', 'risk', 'compliance'],
  ai: ['machine learning', 'deep learning', 'nlp', 'computer vision', 'llm', 'data science'],
  cybersecurity: ['security', 'penetration', 'soc', 'incident response', 'vulnerability', 'threat'],
  cloud: ['aws', 'gcp', 'azure', 'devops', 'kubernetes', 'terraform', 'sre', 'infrastructure'],
  gaming: ['unity', 'unreal', 'game developer', 'game design', 'gameplay', 'multiplayer'],
  ecommerce: ['shopify', 'woocommerce', 'marketplace', 'conversion', 'growth', 'retail'],
  healthtech: ['healthcare', 'medical', 'bioinformatics', 'clinical', 'diagnostics', 'telehealth'],
  edtech: ['education', 'learning', 'curriculum', 'elearning', 'student', 'assessment'],
  robotics: ['robotics', 'automation', 'computer vision', 'slam', 'motion planning', 'ros'],
}

const LOCATION_MODIFIERS: Record<string, string> = {
  remote: 'Remote', us: 'US', uk: 'UK', singapore: 'Singapore',
  china: 'China', europe: 'Europe', japan: 'Japan', india: 'India',
  canada: 'Canada', australia: 'Australia',
}

export function generateStaticParams() {
  const params: { lang: string; slug: string }[] = []
  for (const lang of locales) {
    for (const page of [...(longtailData as any).en, ...(longtailData as any).zh]) {
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
  const data = locale === 'zh' ? (longtailData as any).zh : (longtailData as any).en
  const page = data.find((p: any) => p.slug === slug)

  if (!page) return { title: 'Not Found | Jobsbor' }

  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: `https://jobsbor.vercel.app/${locale}/industry/${slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.description,
    },
  }
}

// Match jobs to industry
function matchJobsToIndustry(industryId: string) {
  const keywords = INDUSTRY_KEYWORDS[industryId] || []
  if (!keywords.length) return jobs.slice(0, 10)
  return jobs.filter(job => {
    const text = `${job.title} ${job.description} ${job.tags?.join(' ') || ''}`.toLowerCase()
    return keywords.some(kw => text.includes(kw.toLowerCase()))
  }).slice(0, 6)
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
  const data = locale === 'zh' ? (longtailData as any).zh : (longtailData as any).en
  const page = data.find((p: any) => p.slug === slug)

  if (!page) notFound()

  const Icon = INDUSTRY_ICONS[page.industry] || Briefcase
  const relatedJobs = matchJobsToIndustry(page.industry)
  const isZh = locale === 'zh'
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
                  <span>•</span>
                  <span>{relatedJobs.length}+ {isZh ? '相关职位' : 'related jobs'}</span>
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
              <div className="lg:col-span-2 space-y-8">
                {/* Intro Card */}
                <div className="glass-card rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {isZh ? `探索${page.industryName}机会` : `Explore ${page.industryName} Opportunities`}
                  </h2>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {page.content}
                  </p>

                  {/* Popular Job Titles */}
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {isZh ? '热门职位' : 'Popular Roles'}
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

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-cyan">{relatedJobs.length}+</div>
                      <div className="text-xs text-gray-500 mt-1">{isZh ? '开放职位' : 'Open Jobs'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-neon-purple">{page.jobTitles.length}</div>
                      <div className="text-xs text-gray-500 mt-1">{isZh ? '热门岗位' : 'Hot Roles'}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400">100%</div>
                      <div className="text-xs text-gray-500 mt-1">{isZh ? '远程友好' : 'Remote OK'}</div>
                    </div>
                  </div>
                </div>

                {/* Job Listings */}
                {relatedJobs.length > 0 && (
                  <div className="glass-card rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-neon-cyan" />
                        {isZh ? '最新职位' : 'Latest Jobs'}
                      </h3>
                      <LocalizedLink
                        href="/jobs"
                        className="text-sm text-neon-cyan hover:text-neon-purple transition-colors flex items-center gap-1"
                      >
                        {isZh ? '查看全部' : 'View All'}
                        <ArrowRight className="h-4 w-4" />
                      </LocalizedLink>
                    </div>
                    <div className="space-y-4">
                      {relatedJobs.slice(0, 4).map((job) => (
                        <LocalizedLink
                          key={job.id}
                          href={`/jobs/${job.slug}`}
                          className="block p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h4 className="font-semibold text-white mb-1">{job.title}</h4>
                              <div className="flex items-center gap-3 text-sm text-gray-400">
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3.5 w-3.5" />
                                  {job.company}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {job.location}
                                </span>
                                {job.salaryMin && (
                                  <span className="text-neon-cyan font-medium">
                                    ¥{(job.salaryMin/1000).toFixed(0)}K-{(job.salaryMax/1000).toFixed(0)}K
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 flex-shrink-0">
                              {job.tags?.slice(0, 2).map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-gray-300">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </LocalizedLink>
                      ))}
                    </div>
                  </div>
                )}

                {/* Industry Insights */}
                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {isZh ? `为什么选择${page.industryName}？` : `Why Choose ${page.industryName}?`}
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p>{isZh ? '行业增长迅速，人才需求持续上升，远程工作机会丰富' : 'Rapid industry growth with increasing demand for talent and abundant remote opportunities'}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <p>{isZh ? '灵活的工作时间和远程办公选项，适合全球人才' : 'Flexible working hours and remote options, perfect for global talent'}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <p>{isZh ? '加入顶尖团队，与行业专家一起推动创新' : 'Join top teams and drive innovation alongside industry experts'}</p>
                    </div>
                  </div>
                </div>

                {/* Related Locations */}
                <div className="glass-card rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {isZh ? '其他地区' : 'Other Locations'}
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
                    {isZh ? '浏览所有职位' : 'Browse All Jobs'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {isZh ? '查看我们所有的远程工作机会' : 'See all our remote job opportunities'}
                  </p>
                  <LocalizedLink
                    href="/jobs"
                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-white font-semibold hover:shadow-[0_0_30px_rgba(0,224,255,0.3)] transition-all"
                  >
                    {isZh ? '查看职位' : 'View Jobs'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </LocalizedLink>
                </div>

                {/* Related Industries */}
                <div className="glass-card rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                    {isZh ? '相关行业' : 'Related Industries'}
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

                {/* Newsletter */}
                <div className="glass-card rounded-2xl p-6 border border-neon-purple/20">
                  <ExternalLink className="h-8 w-8 text-neon-purple mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {isZh ? '获取最新职位' : 'Get Latest Jobs'}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {isZh ? '订阅我们的 Telegram 频道获取实时推送' : 'Subscribe to our Telegram channel for real-time updates'}
                  </p>
                  <a
                    href="https://t.me/Web3Kairo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-[#0088cc] text-white font-semibold hover:bg-[#0099dd] transition-all"
                  >
                    {isZh ? '加入 Telegram' : 'Join Telegram'}
                  </a>
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
