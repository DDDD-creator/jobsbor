/**
 * 职位卡片优化组件
 * 修复版：解决链接嵌套和点击问题
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Clock, 
  Heart,
  ExternalLink,
  TrendingUp,
  Building2
} from 'lucide-react'
import type { JobWithCompany } from '@/types'
import { FAVORITES_KEY } from '@/lib/constants'

interface OptimizedJobCardProps {
  job: JobWithCompany
  variant?: 'default' | 'compact' | 'featured'
  className?: string
}

// 公司信息部分类型（用于展示）
type CompanyDisplayInfo = {
  name: string
  slug: string
  industry: string
}

function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === 'undefined') return []
    const saved = localStorage.getItem(FAVORITES_KEY)
    return saved ? JSON.parse(saved) : []
  })

  const toggleFavorite = (jobId: string) => {
    const newFavorites = favorites.includes(jobId)
      ? favorites.filter(id => id !== jobId)
      : [...favorites, jobId]
    
    setFavorites(newFavorites)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
  }

  const isFavorite = (jobId: string) => favorites.includes(jobId)

  return { favorites, toggleFavorite, isFavorite }
}

// 格式化薪资显示
function formatSalary(min?: number | null, max?: number | null, currency: string = 'CNY'): string {
  if (!min && !max) return '薪资面议'
  
  const format = (n: number) => {
    if (n >= 10000) return `${(n / 10000).toFixed(0)}万`
    return n.toString()
  }
  
  const symbol = currency === 'CNY' ? '¥' : currency === 'USD' ? '$' : currency
  
  if (min && max) return `${symbol}${format(min)}-${format(max)}/月`
  if (min) return `${symbol}${format(min)}+/月`
  if (max) return ` upto ${symbol}${format(max)}/月`
  
  return '薪资面议'
}

// 计算发布时间显示
function getTimeAgo(date: Date | string): string {
  const now = new Date()
  const posted = new Date(date)
  const diffMs = now.getTime() - posted.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    if (diffHours === 0) return '刚刚'
    return `${diffHours}小时前`
  }
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  return `${Math.floor(diffDays / 30)}月前`
}

export function OptimizedJobCard({ 
  job, 
  variant = 'default',
  className 
}: OptimizedJobCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [isHovered, setIsHovered] = useState(false)
  const router = useRouter()
  
  const isHot = job.tags?.some(tag => 
    ['急招', '热门', '高薪', '远程'].includes(tag)
  )
  
  const isNew = new Date(job.publishedAt).getTime() > Date.now() - 3 * 24 * 60 * 60 * 1000

  // 处理卡片点击 - 跳转到职位详情
  const handleCardClick = () => {
    router.push(`/jobs/${job.slug}`)
  }

  // 处理公司点击 - 阻止冒泡并跳转
  const handleCompanyClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/companies/${job.company?.slug}`)
  }

  // 处理收藏点击 - 阻止冒泡
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(job.id)
  }

  if (variant === 'compact') {
    return (
      <Card 
        onClick={handleCardClick}
        className={cn(
          'p-4 hover:shadow-lg transition-all duration-300 cursor-pointer',
          'border border-gray-800 bg-dark-200/50',
          'hover:border-neon-cyan/30',
          className
        )}
        role="link"
        aria-label={`${job.title} at ${job.company?.name}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{job.title}</h3>
            <p className="text-sm text-gray-400 mt-1">{job.company?.name}</p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
              <span className="text-neon-cyan">
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
              </span>
            </div>
          </div>
          {isHot && (
            <Badge variant="neon" color="orange" size="sm">热</Badge>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'group relative overflow-hidden transition-all duration-300 cursor-pointer',
        'border border-gray-800 bg-dark-200/50 backdrop-blur-sm',
        'hover:border-neon-cyan/30 hover:shadow-lg hover:shadow-neon-cyan/5',
        variant === 'featured' && 'ring-1 ring-neon-cyan/20',
        className
      )}
      role="link"
      aria-label={`${job.title} at ${job.company?.name}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleCardClick()
        }
      }}
    >
      {/* 特色标签 */}
      {variant === 'featured' && (
        <div className="absolute top-0 right-0">
          <Badge variant="neon" color="purple" className="rounded-tl-none rounded-br-none">
            <TrendingUp className="w-3 h-3 mr-1" />
            精选
          </Badge>
        </div>
      )}

      <div className="p-5">
        {/* 头部：公司 + 收藏 */}
        <div className="flex items-start justify-between mb-3">
          {/* 公司信息 - 点击跳转公司页 */}
          <button
            onClick={handleCompanyClick}
            className="flex items-center gap-3 group/company text-left hover:opacity-80 transition-opacity"
            aria-label={`查看 ${job.company?.name} 公司详情`}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-lg shrink-0">
              {job.company?.name?.[0] || 'J'}
            </div>
            <div>
              <p className="font-medium text-white group-hover/company:text-neon-cyan transition-colors">
                {job.company?.name}
              </p>
              <p className="text-xs text-gray-500">{job.company?.industry}</p>
            </div>
          </button>
          
          {/* 收藏按钮 */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'p-2 h-auto relative z-10 min-w-[44px] min-h-[44px]',
              isFavorite(job.id) ? 'text-red-500' : 'text-gray-500 hover:text-red-400'
            )}
            onClick={handleFavoriteClick}
            aria-label={isFavorite(job.id) ? '取消收藏' : '添加收藏'}
            aria-pressed={isFavorite(job.id)}
          >
            <Heart 
              className={cn(
                'w-5 h-5 transition-all',
                isFavorite(job.id) && 'fill-current'
              )} 
            />
          </Button>
        </div>

        {/* 职位标题 */}
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-neon-cyan transition-colors line-clamp-2">
          {job.title}
        </h3>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mb-3">
          {isNew && (
            <Badge variant="neon" color="green" size="sm">新</Badge>
          )}
          {isHot && (
            <Badge variant="neon" color="orange" size="sm">热招</Badge>
          )}
          {job.type === 'remote' && (
            <Badge variant="outline" color="cyan" size="sm">远程</Badge>
          )}
          {job.tags?.slice(0, 3).map((tag, i) => (
            <Badge key={i} variant="outline" size="sm">{tag}</Badge>
          ))}
        </div>

        {/* 信息行 */}
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-500 shrink-0" aria-hidden="true" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-gray-500 shrink-0" aria-hidden="true" />
            <span className="capitalize">{job.type}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2">
            <DollarSign className="w-4 h-4 text-neon-cyan shrink-0" aria-hidden="true" />
            <span className="text-neon-cyan font-medium">
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
            </span>
          </div>
        </div>

        {/* 底部：时间 + 操作 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-800">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" aria-hidden="true" />
            <time dateTime={new Date(job.publishedAt).toISOString()}>
              {getTimeAgo(job.publishedAt)}
            </time>
          </div>
          
          <span 
            className={cn(
              'text-sm text-neon-cyan flex items-center gap-1',
              'transition-all duration-300',
              isHovered && 'translate-x-1'
            )}
          >
            查看详情
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Card>
  )
}

// 职位卡片骨架屏
export function JobCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-5 border border-gray-800 bg-dark-200/30" aria-hidden="true">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-gray-800 animate-pulse" />
            <div className="flex-1">
              <div className="h-4 bg-gray-800 rounded animate-pulse w-24 mb-1" />
              <div className="h-3 bg-gray-800 rounded animate-pulse w-16" />
            </div>
          </div>
          <div className="h-5 bg-gray-800 rounded animate-pulse w-3/4 mb-2" />
          <div className="flex gap-2 mb-3">
            <div className="h-5 bg-gray-800 rounded animate-pulse w-12" />
            <div className="h-5 bg-gray-800 rounded animate-pulse w-12" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-800 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-800 rounded animate-pulse w-2/3" />
          </div>
        </Card>
      ))}
    </>
  )
}
