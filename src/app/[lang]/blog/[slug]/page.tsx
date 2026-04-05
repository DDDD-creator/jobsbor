/**
 * Blog Post Detail Page
 * With rich SEO metadata and structured data
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { isValidLocale, Locale, defaultLocale, locales } from '@/i18n/config'
import { loadTranslations } from '@/i18n/loader'
import blogPosts from '@/data/blog-posts.json'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ExternalLink, ArrowLeft, Clock, User, Rss, Calendar, Tag } from 'lucide-react'
import { LocalizedLink } from '@/components/i18n/localized-link'

export const revalidate = 21600

export function generateStaticParams() {
  return locales.flatMap(lang =>
    blogPosts.slice(0, 100).map(post => ({
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

  if (!post) return { title: 'Not Found | Jobsbor' }

  const isZh = locale === 'zh'
  return {
    title: `${post.title} | Jobsbor Blog`,
    description: post.description,
    keywords: [post.sourceCategory, post.source, isZh ? '科技资讯' : 'tech news'],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.pubDate,
      authors: [post.author],
      images: post.image ? [{ url: post.image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : [],
    },
    alternates: {
      canonical: `https://jobsbor.vercel.app/${locale}/blog/${slug}`,
    },
  }
}

// Generate Article schema
function generateArticleSchema(post: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image || undefined,
    datePublished: post.pubDate,
    dateModified: post.fetchedAt,
    author: { '@type': 'Organization', name: post.source },
    publisher: { '@type': 'Organization', name: 'Jobsbor', logo: { '@type': 'ImageObject', url: 'https://jobsbor.vercel.app/logo.png' } },
    mainEntityOfPage: `https://jobsbor.vercel.app/en/blog/${post.id}`,
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
  const isZh = locale === 'zh'

  const post = blogPosts.find(p => p.id === slug)
  if (!post) notFound()

  const date = new Date(post.pubDate).toLocaleDateString(isZh ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  // Find related posts
  const relatedPosts = blogPosts.filter(p => p.sourceCategory === post.sourceCategory && p.id !== post.id).slice(0, 3)

  return (
    <>
      <Header locale={locale} translations={translations} />

      <main className="min-h-screen bg-dark-500">
        {/* Hero Image */}
        {post.image && (
          <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-500 via-dark-500/50 to-transparent" />
          </div>
        )}

        <article className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-20 relative">
          {/* Back Link */}
          <LocalizedLink href="/blog" className="inline-flex items-center gap-2 text-gray-400 hover:text-neon-cyan transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" />
            {isZh ? '返回博客列表' : 'Back to Blog'}
          </LocalizedLink>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-neon-cyan to-neon-blue text-white">{post.source}</span>
            <span className="flex items-center gap-1 text-sm text-gray-500"><Calendar className="h-4 w-4" />{date}</span>
            <span className="flex items-center gap-1 text-sm text-gray-500"><User className="h-4 w-4" />{post.author}</span>
            <span className="flex items-center gap-1 text-sm text-gray-500"><Tag className="h-4 w-4" />{post.sourceCategory}</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">{post.title}</h1>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-8 max-w-3xl">{post.description}</p>

          {/* Read Full Article CTA */}
          <div className="mb-12 p-6 glass-card rounded-2xl border border-neon-cyan/20">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Rss className="h-6 w-6 text-neon-cyan" />
                <div>
                  <p className="text-white font-medium">{isZh ? '阅读完整文章' : 'Read Full Article'}</p>
                  <p className="text-sm text-gray-400">{isZh ? '来自' : 'From'} {post.source}</p>
                </div>
              </div>
              <a href={post.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-neon-cyan to-neon-blue text-white font-semibold hover:shadow-[0_0_30px_rgba(0,224,255,0.3)] transition-all">
                {isZh ? '前往阅读' : 'Read Now'}<ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/5">
              <h3 className="text-xl font-bold text-white mb-6">{isZh ? '相关阅读' : 'Related Articles'}</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedPosts.map(rp => (
                  <LocalizedLink key={rp.id} href={`/blog/${rp.id}`} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <p className="text-sm text-gray-300 group-hover:text-neon-cyan transition-colors line-clamp-2">{rp.title}</p>
                    <p className="text-xs text-gray-500 mt-2">{rp.source} · {new Date(rp.pubDate).toLocaleDateString()}</p>
                  </LocalizedLink>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleSchema(post)) }} />
      </main>

      <Footer locale={locale} translations={translations} />
    </>
  )
}
