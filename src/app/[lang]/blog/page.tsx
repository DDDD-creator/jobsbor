/**
 * Blog Listing Page
 * Aggregated articles from global tech/Web3/career RSS feeds
 * With client-side category filtering
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { isValidLocale, Locale, defaultLocale, locales } from '@/i18n/config'
import { loadTranslations } from '@/i18n/loader'
import blogPosts from '@/data/blog-posts.json'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogFilters } from '@/components/blog/BlogFilters'
import { Rss } from 'lucide-react'

export const revalidate = 21600 // Revalidate every 6 hours

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  const locale = isValidLocale(lang) ? lang : defaultLocale
  const title = locale === 'zh'
    ? '博客 - 全球科技与职业洞察 | Jobsbor'
    : 'Blog - Global Tech & Career Insights | Jobsbor'
  const description = locale === 'zh'
    ? '聚合全球顶级科技博客、Web3资讯和远程工作趋势'
    : 'Aggregating top global tech blogs, Web3 news, and remote work trends'

  return {
    title,
    description,
    alternates: {
      canonical: `https://jobsbor.vercel.app/${locale}/blog`,
    },
  }
}

const CATEGORY_FILTERS = ['all', 'technology', 'web3', 'business', 'remote-work']

const categoryLabels: Record<string, Record<string, string>> = {
  zh: { all: '全部', technology: '科技', web3: 'Web3', business: '商业', 'remote-work': '远程工作' },
  en: { all: 'All', technology: 'Technology', web3: 'Web3', business: 'Business', 'remote-work': 'Remote Work' },
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const translations = await loadTranslations(locale)
  const labels = categoryLabels[locale] || categoryLabels['en']

  const posts = blogPosts || []

  // Source stats
  const sourceList = [...new Set(posts.map(p => p.source))]
  const categoryStats: Record<string, number> = {}
  posts.forEach(p => {
    categoryStats[p.sourceCategory] = (categoryStats[p.sourceCategory] || 0) + 1
  })

  return (
    <>
      <Header locale={locale} translations={translations} />

      <main className="min-h-screen bg-dark-500">
        {/* Hero */}
        <section className="relative py-16 border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 to-transparent" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Rss className="h-5 w-5 text-neon-cyan" />
                <span className="text-sm font-medium text-neon-cyan">
                  {locale === 'zh' ? 'RSS 实时聚合' : 'Live RSS Aggregation'}
                </span>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                {locale === 'zh' ? '博客' : 'Blog'}
              </h1>
              <p className="text-lg text-gray-400">
                {locale === 'zh'
                  ? '全球科技与职业资讯实时聚合，每 6 小时自动更新'
                  : 'Real-time global tech & career news aggregation, auto-updated every 6 hours'}
              </p>
            </div>
          </div>
        </section>

        {/* Filters + Stats */}
        <section className="py-6 border-b border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <BlogFilters
                categories={CATEGORY_FILTERS.map(cat => ({
                  key: cat,
                  label: labels[cat] || cat,
                  count: cat === 'all' ? posts.length : (categoryStats[cat] || 0),
                }))}
              />
              <div className="flex items-center gap-4 text-xs text-gray-600">
                <span>{posts.length} {locale === 'zh' ? '篇文章' : 'articles'}</span>
                <span>{sourceList.length} {locale === 'zh' ? '个来源' : 'sources'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24">
                <Rss className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">
                  {locale === 'zh' ? '暂无文章' : 'No posts yet'}
                </h3>
                <p className="text-gray-500">
                  {locale === 'zh' ? '文章正在更新中...' : 'Posts are being updated...'}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer locale={locale} translations={translations} />
    </>
  )
}
