/**
 * Blog Post Detail Page
 * Redirects to the original article source
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { isValidLocale, Locale, defaultLocale, locales } from '@/i18n/config'
import { loadTranslations } from '@/i18n/loader'
import blogPosts from '@/data/blog-posts.json'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ExternalLink, ArrowLeft, Clock, User, Rss } from 'lucide-react'
import { LocalizedLink } from '@/components/i18n/localized-link'

export const revalidate = 21600

export function generateStaticParams() {
  return locales.flatMap(lang => 
    blogPosts.map(post => ({
      lang,
      slug: post.id,
    }))
  )
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}): Promise<Metadata> {
  const { lang, slug } = await params
  const locale = isValidLocale(lang) ? lang : defaultLocale
  const post = blogPosts.find(p => p.id === slug)
  
  if (!post) {
    return { title: 'Not Found | Jobsbor' }
  }

  return {
    title: `${post.title} | Jobsbor Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  if (!isValidLocale(lang)) notFound()

  const locale = lang as Locale
  const translations = await loadTranslations(locale)
  
  const post = blogPosts.find(p => p.id === slug)
  if (!post) notFound()

  const date = new Date(post.pubDate).toLocaleDateString(
    locale === 'zh' ? 'zh-CN' : 'en-US',
    { month: 'long', day: 'numeric', year: 'numeric' }
  )

  return (
    <>
      <Header locale={locale} translations={translations} />

      <main className="min-h-screen bg-dark-500">
        {/* Hero Image */}
        {post.image && (
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-dark-500/50 to-transparent" />
          </div>
        )}

        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative">
          {/* Back Link */}
          <LocalizedLink
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === 'zh' ? '返回博客列表' : 'Back to Blog'}
          </LocalizedLink>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-neon-cyan to-neon-blue text-white">
              {post.source}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {date}
            </span>
            <span className="flex items-center gap-1 text-sm text-gray-500">
              <User className="h-4 w-4" />
              {post.author}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            {post.title}
          </h1>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-8 max-w-3xl">
            {post.description}
          </p>

          {/* Read Full Article CTA */}
          <div className="mb-12 p-6 glass-card rounded-2xl border border-neon-cyan/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Rss className="h-6 w-6 text-neon-cyan" />
                <div>
                  <p className="text-white font-medium">
                    {locale === 'zh' ? '阅读完整文章' : 'Read Full Article'}
                  </p>
                  <p className="text-sm text-gray-400">
                    {locale === 'zh' ? '来自' : 'From'} {post.source}
                  </p>
                </div>
              </div>
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-white font-semibold hover:shadow-[0_0_30px_rgba(0,224,255,0.3)] transition-all"
              >
                {locale === 'zh' ? '前往阅读' : 'Read Now'}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Related - link back to blog listing */}
          <div className="text-center pt-8 border-t border-white/5">
            <p className="text-gray-400 mb-4">
              {locale === 'zh' ? '发现更多文章' : 'Discover more articles'}
            </p>
            <LocalizedLink
              href="/blog"
              className="inline-flex items-center gap-2 text-neon-cyan hover:text-neon-purple transition-colors"
            >
              {locale === 'zh' ? '浏览全部博客' : 'Browse all blog posts'}
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </LocalizedLink>
          </div>
        </article>
      </main>

      <Footer locale={locale} translations={translations} />
    </>
  )
}
