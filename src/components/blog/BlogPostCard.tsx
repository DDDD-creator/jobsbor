'use client'

import { ExternalLink, Clock, User } from 'lucide-react'
import { LocalizedLink } from '@/components/i18n/localized-link'

interface BlogPostCardProps {
  post: {
    id: string
    title: string
    description: string
    pubDate: string
    author: string
    image?: string
    source: string
    sourceCategory: string
    link: string
  }
  locale: string
}

const categoryColors: Record<string, string> = {
  'technology': 'from-blue-500 to-cyan-500',
  'web3': 'from-purple-500 to-pink-500',
  'remote-work': 'from-green-500 to-emerald-500',
}

const categoryLabels: Record<string, Record<string, string>> = {
  zh: {
    'technology': '科技',
    'web3': 'Web3',
    'remote-work': '远程工作',
  },
  en: {
    'technology': 'Technology',
    'web3': 'Web3',
    'remote-work': 'Remote Work',
  },
}

export function BlogPostCard({ post, locale = 'en' }: BlogPostCardProps) {
  const labels = categoryLabels[locale] || categoryLabels['en']
  const colorClass = categoryColors[post.sourceCategory] || 'from-gray-500 to-gray-600'
  const date = new Date(post.pubDate).toLocaleDateString(
    locale === 'zh' ? 'zh-CN' : 'en-US',
    { month: 'short', day: 'numeric', year: 'numeric' }
  )

  return (
    <LocalizedLink href={`/blog/${post.id}`} className="block group glass-card rounded-2xl overflow-hidden hover:border-neon-cyan/30 transition-all duration-300">
      {/* Image */}
      {post.image ? (
        <div className="relative h-48 overflow-hidden bg-dark-200">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      ) : (
        <div className={`h-48 bg-gradient-to-br ${colorClass} flex items-center justify-center`}>
          <span className="text-4xl font-bold text-white/80">
            {post.source.charAt(0)}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${colorClass} text-white`}>
            {labels[post.sourceCategory] || post.sourceCategory}
          </span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500">{post.source}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-neon-cyan transition-colors">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 line-clamp-3 mb-4">
          {post.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {post.author?.substring(0, 20) || 'Unknown'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {date}
            </span>
          </div>
          <a
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-neon-cyan hover:text-neon-purple transition-colors"
          >
            {locale === 'zh' ? '阅读全文' : 'Read More'}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </LocalizedLink>
  )
}
