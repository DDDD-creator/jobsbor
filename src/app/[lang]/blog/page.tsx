/**
 * Blog Listing Page
 * Aggregated articles from global tech/Web3/career RSS feeds
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { isValidLocale, Locale, defaultLocale, locales } from '@/i18n/config'
import { loadTranslations } from '@/i18n/loader'
import blogPosts from '@/data/blog-posts.json'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { Filter, Rss } from 'lucide-react'

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

const CATEGORY_FILTERS = ['all', 'technology', 'web3', 'remote-work']

export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const translations = await loadTranslations(locale)

  const labels: Record<string, string> = locale === 'zh'
    ? { all: '全部', technology: '科技', web3: 'Web3', 'remote-work': '远程工作', title: '博客', subtitle: '全球科技与职业资讯实时聚合', noPosts: '暂无文章', source: '来源' }
    : { all: 'All', technology: 'Technology', web3: 'Web3', 'remote-work': 'Remote Work', title: 'Blog', subtitle: 'Real-time global tech & career news aggregation', noPosts: 'No posts yet', source: 'Source' }

  // For SSG, we show all posts (filtering can be done client-side)
  const posts = blogPosts || []

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
              <h1 className="text-4xl font-bold text-white mb-4">{labels.title}</h1>
              <p className="text-lg text-gray-400">{labels.subtitle}</p>
            </div>
          </div>
        </section>

        {/* Category Filters */}
        <section className="py-6 border-b border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
              {CATEGORY_FILTERS.map((cat) => (
                <button
                  key={cat}
                  className="px-4 py-1.5 rounded-full text-sm font-medium glass-card text-gray-400 hover:text-white hover:border-neon-cyan/30 transition-all whitespace-nowrap"
                >
                  {labels[cat] || cat}
                </button>
              ))}
              <span className="text-xs text-gray-600 ml-auto flex-shrink-0">
                {posts.length} {locale === 'zh' ? '篇文章' : 'articles'}
              </span>
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
                  {labels.noPosts}
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
