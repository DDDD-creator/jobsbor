import { LocalizedLink } from '@/components/i18n/localized-link'
import type { Post } from '@/types'
import { cn, formatDate } from '@/lib/utils'

interface PostCardProps {
  post: Post
  className?: string
}

/**
 * 博客文章卡片组件
 * - 展示封面图、标题、摘要和发布日期
 * - 点击跳转到文章详情页
 */
export function PostCard({ post, className }: PostCardProps) {
  return (
    <LocalizedLink href={`/blog/${post.slug}`}>
      <article
        className={cn(
          'group rounded-xl border border-gray-200 bg-white overflow-hidden transition-all duration-200 hover:border-primary-300 hover:shadow-lg',
          className
        )}
      >
        {/* 封面图 */}
        <div className="aspect-video w-full bg-gray-100 overflow-hidden">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50">
              <svg
                className="h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* 内容 */}
        <div className="p-5">
          {/* 发布日期 */}
          <time className="text-xs text-gray-500">
            {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
          </time>

          {/* 标题 */}
          <h3 className="mt-2 text-lg font-semibold text-primary group-hover:text-primary-600 transition-colors line-clamp-2">
            {post.title}
          </h3>

          {/* 摘要 */}
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {post.excerpt}
          </p>

          {/* 阅读更多 */}
          <div className="mt-4 flex items-center text-sm font-medium text-accent">
            阅读更多
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </article>
    </LocalizedLink>
  )
}
