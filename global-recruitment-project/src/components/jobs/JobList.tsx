'use client'

import { JobCard, JobCardSkeleton } from './JobCard'
import { ScrollReveal } from '@/lib/animations'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { JobWithCompany } from '@/types'
import {
  Briefcase,
  Search,
  Sparkles,
  FilterX
} from 'lucide-react'

interface JobListProps {
  jobs: JobWithCompany[]
  emptyText?: string
  className?: string
  loading?: boolean
  onClearFilters?: () => void
}

/**
 * Web3风格职位列表容器组件
 * - 网格布局展示职位卡片
 * - 交错入场动画
 * - Web3风格空状态
 * - 骨架屏加载状态
 */
export function JobList({
  jobs,
  emptyText = '暂无职位',
  className,
  loading = false,
  onClearFilters
}: JobListProps) {
  // 加载状态 - 骨架屏
  if (loading) {
    return (
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <JobCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  // 空状态 - Web3风格
  if (jobs.length === 0) {
    return (
      <ScrollReveal>
        <Card variant="glass" className={`py-16 text-center ${className}`}>
          <CardContent className="flex flex-col items-center">
            {/* 发光图标 */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-cyan-400" />
              </div>
            </div>

            <Badge variant="neon" color="cyan" size="sm" className="mb-4">
              <Search className="w-3 h-3 mr-1" />
              搜索结果
            </Badge>

            <h3 className="text-xl font-semibold text-white mb-2">
              {emptyText}
            </h3>
            <p className="text-gray-400 max-w-md mb-6">
              没有找到符合条件的职位，尝试调整筛选条件或搜索其他关键词
            </p>

            {onClearFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                glowColor="cyan"
                aria-label="清除筛选条件"
              >
                <FilterX className="mr-2 h-4 w-4" />
                清除筛选条件
              </Button>
            )}
          </CardContent>
        </Card>
      </ScrollReveal>
    )
  }

  // 职位列表 - 带交错动画
  return (
    <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${className}`}>
      {jobs.map((job, index) => (
        <ScrollReveal
          key={job.id}
          delay={index * 100}
          direction="scale"
        >
          <JobCard
            job={job}
            index={index}
            variant={index < 2 ? 'featured' : 'default'}
          />
        </ScrollReveal>
      ))}
    </div>
  )
}

// 推荐职位列表
interface FeaturedJobsProps {
  jobs: JobWithCompany[]
  className?: string
}

export function FeaturedJobs({ jobs, className }: FeaturedJobsProps) {
  const featuredJobs = jobs.slice(0, 3)

  if (featuredJobs.length === 0) return null

  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-6">
        <Badge variant="gradient" size="sm">
          <Sparkles className="w-3 h-3 mr-1" />
          精选职位
        </Badge>
        <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {featuredJobs.map((job, index) => (
          <ScrollReveal key={job.id} delay={index * 150} direction="up">
            <JobCard
              job={job}
              variant="featured"
              index={index}
            />
          </ScrollReveal>
        ))}
      </div>
    </div>
  )
}

export default JobList
