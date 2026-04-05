'use client'

import { useState, useMemo } from 'react'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { Filter, Rss, Search } from 'lucide-react'

const CATEGORIES = ['all', 'technology', 'web3', 'business', 'remote-work'] as const
type Category = typeof CATEGORIES[number]

interface BlogClientProps {
  posts: any[]
  locale: string
  labels: Record<string, string>
  categoryStats: Record<string, number>
  sourceCount: number
}

export function BlogClient({ posts, locale, labels, categoryStats, sourceCount }: BlogClientProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = useMemo(() => {
    let result = posts
    if (activeCategory !== 'all') {
      result = result.filter(p => p.sourceCategory === activeCategory)
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.source.toLowerCase().includes(q)
      )
    }
    return result
  }, [posts, activeCategory, searchQuery])

  return (
    <>
      {/* Filters + Search */}
      <section className="py-6 border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-500 flex-shrink-0" />
              {CATEGORIES.map(cat => {
                const count = cat === 'all' ? posts.length : (categoryStats[cat] || 0)
                const isActive = activeCategory === cat
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-gradient-to-r from-neon-cyan to-neon-blue text-white shadow-[0_0_15px_rgba(0,224,255,0.3)]'
                        : 'glass-card text-gray-400 hover:text-white hover:border-neon-cyan/30'
                    }`}
                  >
                    {labels[cat] || cat}
                    <span className="ml-1.5 opacity-60">{count}</span>
                  </button>
                )
              })}
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-600 flex-shrink-0">
              <span>{filteredPosts.length} / {posts.length} {labels.articles}</span>
              <span>{sourceCount} {labels.sources}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder={locale === 'zh' ? '搜索文章...' : 'Search articles...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-cyan/30 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredPosts.map((post) => (
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
                {locale === 'zh' ? '尝试其他分类或关键词' : 'Try a different category or keyword'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
