'use client'

import { cn } from '@/lib/utils'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { FavoriteButton } from '@/components/favorites/favorite-button'
import type { JobWithCompany } from '@/types'
import { MapPin, DollarSign, Building2, Clock, Sparkles } from 'lucide-react'

interface JobCardProps {
  job: JobWithCompany
  className?: string
  variant?: 'default' | 'featured' | 'compact'
  index?: number
}

/**
 * Web3风格职位卡片组件
 * - 玻璃拟态背景
 * - 霓虹边框发光效果
 * - 悬浮缩放动画
 * - 渐变文字和图标
 */
export function JobCard({ job, className, variant = 'default', index = 0 }: JobCardProps) {
  const formatSalary = (min?: number | null, max?: number | null, currency: string = 'CNY') => {
    if (!min && !max) return '薪资面议'
    const symbol = currency === 'CNY' ? '¥' : currency
    if (min && max) {
      return `${symbol}${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K`
    }
    if (min) return `${symbol}${(min / 1000).toFixed(0)}K+`
    if (max) return `最高${symbol}${(max / 1000).toFixed(0)}K`
    return '薪资面议'
  }

  const formatJobType = (type: string) => {
    const typeMap: Record<string, string> = {
      'full-time': '全职',
      'part-time': '兼职',
      'contract': '合同',
      'remote': '远程',
    }
    return typeMap[type] || type
  }

  const formatIndustry = (industry: string) => {
    const industryMap: Record<string, { label: string; color: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' }> = {
      'finance': { label: '金融', color: 'green' },
      'web3': { label: 'Web3', color: 'purple' },
      'internet': { label: '互联网', color: 'cyan' },
    }
    return industryMap[industry] || { label: industry, color: 'cyan' }
  }

  const industryInfo = formatIndustry(job.industry)
  const isWeb3 = job.industry === 'web3'
  const isRemote = job.type === 'remote'

  // 交错动画延迟
  const animationDelay = index * 100

  if (variant === 'compact') {
    return (
      <LocalizedLink href={`/jobs/${job.slug}`}>
        <Card
          variant="glass"
          className={cn(
            'group relative p-4 cursor-pointer',
            'transform transition-all duration-300',
            'hover:scale-[1.02]',
            className
          )}
          style={{ animationDelay: `${animationDelay}ms` }}
        >
          <div className="flex items-center gap-4">
            {/* 公司Logo占位 */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/30 transition-colors">
              <Building2 className="w-6 h-6 text-cyan-400" />
            </div>

            {/* 职位信息 */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate group-hover:text-cyan-400 transition-colors">
                {job.title}
              </h3>
              <p className="text-sm text-gray-400 truncate">
                {job.company?.name || '未知公司'}
              </p>
            </div>

            {/* 薪资 */}
            <div className="text-right">
              <span className="text-cyan-400 font-semibold">
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
              </span>
            </div>
          </div>
        </Card>
      </LocalizedLink>
    )
  }

  return (
    <LocalizedLink href={`/jobs/${job.slug}`}>
      <Card
        variant={variant === 'featured' ? 'neon' : 'glass'}
        glowColor={isWeb3 ? 'purple' : 'cyan'}
        className={cn(
          'group relative cursor-pointer overflow-hidden',
          'transform transition-all duration-300',
          variant === 'featured' && 'border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]',
          className
        )}
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* 推荐标签 */}
        {variant === 'featured' && (
          <div className="absolute top-0 right-0">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              精选
            </div>
          </div>
        )}

        <CardContent className="p-5 relative z-10">
          {/* 头部：公司和标题 */}
          <div className="flex items-start gap-4 mb-4">
            {/* 公司Logo */}
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center shrink-0',
              'bg-gradient-to-br border transition-all duration-300',
              isWeb3 
                ? 'from-purple-500/20 to-pink-500/20 border-purple-500/20 group-hover:border-purple-500/40 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.2)]'
                : 'from-cyan-500/20 to-blue-500/20 border-cyan-500/20 group-hover:border-cyan-500/40 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            )}>
              <Building2 className={cn(
                'w-7 h-7 transition-colors',
                isWeb3 ? 'text-purple-400' : 'text-cyan-400'
              )} />
            </div>

            {/* 标题和公司名 */}
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                'text-lg font-semibold truncate transition-colors duration-200',
                'group-hover:text-transparent group-hover:bg-clip-text',
                isWeb3 
                  ? 'text-white group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400'
                  : 'text-white group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-400'
              )}>
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-400 text-sm truncate">
                  {job.company?.name || '未知公司'}
                </span>
                {isWeb3 && (
                  <Badge variant="neon" color="purple" size="sm">Web3</Badge>
                )}
              </div>
            </div>

            {/* 收藏按钮 */}
            <FavoriteButton
              jobId={job.slug}
              jobTitle={job.title}
              company={job.company?.name || '未知公司'}
              location={job.location}
              salary={formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
              variant="icon-only"
            />
          </div>

          {/* 薪资和地点 */}
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 font-semibold">
                {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{job.location}</span>
            </div>

            {isRemote && (
              <Badge variant="neon" color="green" size="sm">
                <Clock className="w-3 h-3 mr-1" />
                远程
              </Badge>
            )}
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant="neon" 
              color={industryInfo.color}
              size="sm"
            >
              {industryInfo.label}
            </Badge>

            <Badge variant="outline" size="sm">
              {formatJobType(job.type)}
            </Badge>

            {job.tags?.slice(0, 3).map((tag, i) => (
              <Badge
                key={tag}
                variant="glow"
                color={['cyan', 'purple', 'pink', 'green'][i % 4] as 'cyan' | 'purple' | 'pink' | 'green'}
                size="sm"
              >
                {tag}
              </Badge>
            ))}

            {job.tags && job.tags.length > 3 && (
              <Badge variant="default" size="sm">
                +{job.tags.length - 3}
              </Badge>
            )}
          </div>

          {/* 底部装饰线 */}
          <div className={cn(
            'absolute bottom-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500',
            isWeb3 
              ? 'bg-gradient-to-r from-purple-500 to-pink-500'
              : 'bg-gradient-to-r from-cyan-500 to-purple-500'
          )} />
        </CardContent>
      </Card>
    </LocalizedLink>
  )
}

// 职位卡片骨架屏
export function JobCardSkeleton({ className }: { className?: string }) {
  return (
    <Card variant="glass" className={cn('animate-pulse', className)}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gray-800" />
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-800 rounded w-2/3" />
            <div className="h-4 bg-gray-800 rounded w-1/3" />
          </div>
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-800 rounded w-20" />
          <div className="h-6 bg-gray-800 rounded w-24" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 bg-gray-800 rounded w-16" />
          <div className="h-5 bg-gray-800 rounded w-16" />
          <div className="h-5 bg-gray-800 rounded w-16" />
        </div>
      </CardContent>
    </Card>
  )
}

export default JobCard
