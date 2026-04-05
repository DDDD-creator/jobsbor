import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { ScrollReveal } from '@/lib/animations'
import { ArrowLeft, Calendar, Tag, Share2, Bookmark, Clock, User } from 'lucide-react'
import { posts, getRecentPosts } from '@/data/posts'
import { formatDate } from '@/lib/utils'

// 生成页面元数据
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = posts.find((p) => p.slug === params.slug)
  if (!post) {
    return {
      title: '404 - 文章不存在',
    }
  }
  return {
    title: `${post.title} | JobHub求职博客`,
    description: post.excerpt,
    keywords: post.tags.join(', '),
  }
}

// 生成静态参数
export function generateStaticParams() {
  const locales = ['zh', 'en']
  const slugs = posts.map((post) => post.slug)
  
  const params: { lang: string; slug: string }[] = []
  locales.forEach(lang => {
    slugs.forEach(slug => {
      params.push({ lang, slug })
    })
  })
  
  return params
}

/**
 * 博客详情页
 * - 文章标题
 * - 发布日期
 * - 正文内容（Markdown渲染）
 * - 标签
 * - 返回按钮
 */
export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  // 获取相关文章（同标签或最新文章）
  const relatedPosts = getRecentPosts(4)
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3)

  // 估算阅读时间
  const readingTime = Math.ceil(post.content.length / 500)

  // Markdown渲染
  const renderMarkdown = (content: string) => {
    const lines = content.split('\n')
    const elements: JSX.Element[] = []
    let key = 0
    let inList = false
    let listItems: JSX.Element[] = []
    let isOrderedList = false

    const flushList = () => {
      if (listItems.length > 0) {
        if (isOrderedList) {
          elements.push(
            <ol key={key++} className="ml-6 mb-4 space-y-2 text-gray-300 list-decimal">{listItems}</ol>
          )
        } else {
          elements.push(
            <ul key={key++} className="ml-6 mb-4 space-y-2 text-gray-300 list-disc">{listItems}</ul>
          )
        }
        listItems = []
        inList = false
        isOrderedList = false
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const trimmedLine = line.trim()
      
      // 标题处理
      if (trimmedLine.startsWith('# ')) {
        flushList()
        elements.push(
          <h1 key={key++} className="text-3xl font-bold text-white mt-10 mb-6">
            {trimmedLine.replace('# ', '')}
          </h1>
        )
      } else if (trimmedLine.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={key++} className="text-2xl font-bold text-white mt-8 mb-4">
            {trimmedLine.replace('## ', '')}
          </h2>
        )
      } else if (trimmedLine.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={key++} className="text-xl font-semibold text-white mt-6 mb-3">
            {trimmedLine.replace('### ', '')}
          </h3>
        )
      } else if (trimmedLine.startsWith('#### ')) {
        flushList()
        elements.push(
          <h4 key={key++} className="text-lg font-semibold text-gray-200 mt-4 mb-2">
            {trimmedLine.replace('#### ', '')}
          </h4>
        )
      }
      // 表格处理
      else if (trimmedLine.startsWith('|')) {
        flushList()
        // 跳过表格分隔线
        if (trimmedLine.includes('---') || trimmedLine.match(/^\|[-:]+\|$/)) continue
        
        // 解析表格行
        const cells = trimmedLine.split('|').filter(cell => cell.trim() !== '')
        if (cells.length > 0 && !elements.find(e => e.key === `table-${key}`)) {
          // 简化为段落展示
          elements.push(
            <div key={key++} className="my-4 p-4 bg-white/5 rounded-lg border border-white/10">
              {cells.map((cell, idx) => (
                <span key={idx} className="text-gray-300">{cell.trim()} {idx < cells.length - 1 && '• '}</span>
              ))}
            </div>
          )
        }
      }
      // 列表处理
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        if (inList && isOrderedList) flushList()
        inList = true
        isOrderedList = false
        listItems.push(
          <li key={key++} className="text-gray-300">{trimmedLine.substring(2)}</li>
        )
      } else if (trimmedLine.match(/^\d+\.\s/)) {
        if (inList && !isOrderedList) flushList()
        inList = true
        isOrderedList = true
        listItems.push(
          <li key={key++} className="text-gray-300">{trimmedLine.replace(/^\d+\.\s/, '')}</li>
        )
      }
      // 空行
      else if (trimmedLine === '') {
        flushList()
      }
      // 普通段落
      else {
        flushList()
        if (trimmedLine.length > 0) {
          elements.push(
            <p key={key++} className="text-gray-300 leading-relaxed mb-4">
              {trimmedLine}
            </p>
          )
        }
      }
    }
    
    flushList()
    return elements
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1c]">
      <Header />

      <main className="flex-1 pt-16">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {/* 面包屑 */}
          <ScrollReveal>
            <Breadcrumb 
              items={[
                { label: '博客', href: '/blog' },
                { label: post.title }
              ]} 
            />
          </ScrollReveal>

          <div className="grid gap-8 lg:grid-cols-3 mt-6">
            {/* 文章主体 */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="glass-card rounded-2xl overflow-hidden">
                  {/* 封面图占位 */}
                  <div className="h-48 sm:h-64 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 mb-4">
                        <Tag className="h-8 w-8 text-cyan-400" />
                      </div>
                      <p className="text-gray-400 text-sm">{post.tags[0]}</p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-8">
                    {/* 标题 */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                      {post.title}
                    </h1>

                    {/* 元信息 */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                      <span className="flex items-center">
                        <User className="mr-1 h-4 w-4" />
                        {post.author || 'JobHub内容团队'}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        {formatDate(new Date(post.publishedAt))}
                      </span>
                      <span className="flex items-center">
                        <Clock className="mr-1 h-4 w-4" />
                        {readingTime} 分钟阅读
                      </span>
                    </div>

                    {/* 标签 */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {post.tags.map((tag) => (
                        <Badge key={tag} variant="neon" color="cyan" size="sm">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* 分隔线 */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />

                    {/* 文章内容 */}
                    <article className="prose prose-invert max-w-none">
                      {renderMarkdown(post.content)}
                    </article>

                    {/* 文章底部 */}
                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-white/20">
                          <Share2 className="mr-1 h-4 w-4" />
                          分享
                        </Button>
                        <Button variant="outline" size="sm" className="border-white/20">
                          <Bookmark className="mr-1 h-4 w-4" />
                          收藏
                        </Button>
                      </div>
                      
                      <LocalizedLink href="/blog">
                        <Button variant="ghost" size="sm">
                          <ArrowLeft className="mr-1 h-4 w-4" />
                          返回列表
                        </Button>
                      </LocalizedLink>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* 右侧边栏 */}
            <div className="space-y-6">
              {/* 作者信息 */}
              <ScrollReveal delay={100}>
                <div className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {post.author ? post.author.charAt(0) : 'J'}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{post.author || 'JobHub内容团队'}</p>
                      <p className="text-sm text-gray-400">职业资讯作者</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    专注分享行业洞察、求职技巧和职场发展建议，帮助求职者找到理想工作。
                  </p>
                </div>
              </ScrollReveal>

              {/* 相关文章 */}
              <ScrollReveal delay={200}>
                <div className="glass-card rounded-2xl p-6 sticky top-24">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-cyan-400" />
                    相关文章
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <LocalizedLink
                        key={relatedPost.id}
                        href={`/blog/${relatedPost.slug}`}
                        className="block group"
                      >
                        <h4 className="text-sm font-medium text-gray-300 group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {relatedPost.title}
                        </h4>
                        <p className="mt-1 text-xs text-gray-500">
                          {formatDate(new Date(relatedPost.publishedAt))}
                        </p>
                      </LocalizedLink>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
