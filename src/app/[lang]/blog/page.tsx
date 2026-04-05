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
import { BlogClient } from '@/components/blog/BlogClient'
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
    ? '聚合全球顶级科技博客、Web3资讯和远程工作趋势，每6小时自动更新'
    : 'Aggregating top global tech blogs, Web3 news, and remote work trends, auto-updated every 6 hours'

  return {
    title,
    description,
    alternates: {
      canonical: `https://jobsbor.vercel.app/${locale}/blog`,
    },
  }
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

  const posts = blogPosts || []

  // Category stats
  const categoryStats: Record<string, number> = {}
  posts.forEach(p => { categoryStats[p.sourceCategory] = (categoryStats[p.sourceCategory] || 0) + 1 })

  // Source list
  const sourceList = [...new Set(posts.map(p => p.source))]

  const labels: Record<string, string> = locale === 'zh'
    ? { all: '全部', technology: '科技', web3: 'Web3', business: '商业', 'remote-work': '远程工作', title: '博客', subtitle: '全球科技与职业资讯实时聚合，每6小时自动更新', noPosts: '暂无文章', articles: '篇文章', sources: '个来源' }
    : { all: 'All', technology: 'Technology', web3: 'Web3', business: 'Business', 'remote-work': 'Remote Work', title: 'Blog', subtitle: 'Real-time global tech & career news aggregation, auto-updated every 6 hours', noPosts: 'No posts yet', articles: 'articles', sources: 'sources' }

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

        {/* Client-side blog with filtering */}
        <BlogClient
          posts={posts}
          locale={locale}
          labels={labels}
          categoryStats={categoryStats}
          sourceCount={sourceList.length}
        />
      </main>

      <Footer locale={locale} translations={translations} />
    </>
  )
}
