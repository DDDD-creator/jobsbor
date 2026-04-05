import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PostCard } from '@/components/blog/PostCard'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { Badge } from '@/components/ui/badge'
import { ScrollReveal } from '@/lib/animations'
import { posts } from '@/data/posts'
import { BookOpen, TrendingUp, Sparkles } from 'lucide-react'

// 获取文章数据
const allPosts = posts.map(post => ({
  id: post.id,
  title: post.title,
  slug: post.slug,
  excerpt: post.excerpt,
  content: post.content,
  coverImage: post.coverImage || '',
  published: true,
  publishedAt: new Date(post.publishedAt),
  createdAt: new Date(post.createdAt),
  updatedAt: new Date(post.publishedAt),
  author: post.author,
  tags: post.tags,
}))

/**
 * 博客列表页
 * - 博客文章卡片网格展示
 * - 封面图 + 标题 + 摘要 + 发布日期
 */
export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1c]">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <ScrollReveal>
                <Badge variant="neon" color="purple" size="sm" className="mb-6">
                  <BookOpen className="w-3 h-3 mr-1" />
                  职场资讯
                </Badge>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                  求职<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">博客</span>
                </h1>
                
                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  行业洞察、求职技巧、职业发展，助你职场进阶
                </p>

                {/* 统计 */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 text-sm">
                    <BookOpen className="w-4 h-4" />
                    {allPosts.length} 篇精选文章
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 text-purple-400 text-sm">
                    <TrendingUp className="w-4 h-4" />
                    每周更新
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 文章列表 */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* 文章网格 */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allPosts.map((post, index) => (
                <ScrollReveal key={post.id} delay={index * 100}>
                  <PostCard post={post} />
                </ScrollReveal>
              ))}
            </div>

            {/* 加载更多 - 当文章数量超过9篇时显示 */}
            {allPosts.length > 9 && (
              <div className="mt-12 text-center">
                <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition-all hover:bg-white/10 hover:text-white">
                  <Sparkles className="w-4 h-4" />
                  加载更多文章
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
