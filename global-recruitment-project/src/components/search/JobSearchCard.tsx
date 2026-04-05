'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { JobType, JobLevel, RemoteType } from '@prisma/client'
import {
  MapPin,
  DollarSign,
  Clock,
  Building2,
  ExternalLink,
  Heart,
  TrendingUp,
  Zap,
  Briefcase,
  GraduationCap,
  Globe,
} from 'lucide-react'
import { useState } from 'react'

interface JobCardProps {
  job: {
    id: string
    title: string
    slug: string
    company: {
      id: string
      name: string
      slug: string
      logo: string | null
      industry: string
    }
    description: string
    salaryMin: number | null
    salaryMax: number | null
    salaryCurrency: string
    salaryNegotiable: boolean
    location: string
    remote: RemoteType
    type: JobType
    level: JobLevel
    industry: string
    category: string
    tags: string[]
    skills: string[]
    isUrgent: boolean
    isFeatured: boolean
    publishedAt: Date | null
    viewCount: number
    applyCount: number
    _highlight?: {
      title?: string
      description?: string
      companyName?: string
    }
  }
  view?: 'list' | 'grid'
  showActions?: boolean
  className?: string
  lang?: string
}

const jobTypeLabels: Record<JobType, string> = {
  [JobType.FULLTIME]: '全职',
  [JobType.PARTTIME]: '兼职',
  [JobType.CONTRACT]: '合同',
  [JobType.INTERNSHIP]: '实习',
}

const jobLevelLabels: Record<JobLevel, string> = {
  [JobLevel.JUNIOR]: '初级',
  [JobLevel.MID]: '中级',
  [JobLevel.SENIOR]: '高级',
  [JobLevel.LEAD]: '主管',
  [JobLevel.EXECUTIVE]: '高管',
}

const remoteTypeLabels: Record<RemoteType, { label: string; color: string; icon: React.ElementType }> = {
  [RemoteType.ONSITE]: { label: '办公室', color: 'blue', icon: Building2 },
  [RemoteType.REMOTE]: { label: '远程', color: 'green', icon: Globe },
  [RemoteType.HYBRID]: { label: '混合', color: 'purple', icon: MapPin },
}

// 格式化薪资显示
function formatSalary(
  min: number | null,
  max: number | null,
  currency: string,
  negotiable: boolean
): string {
  if (negotiable && !min && !max) return '薪资面议'
  
  const formatNumber = (n: number) => {
    if (n >= 10000) return `${(n / 10000).toFixed(0)}万`
    return `${(n / 1000).toFixed(0)}K`
  }

  if (min && max) {
    return `${formatNumber(min)}-${formatNumber(max)}`
  } else if (max) {
    return `最高${formatNumber(max)}`
  } else if (min) {
    return `最低${formatNumber(min)}`
  }
  
  return '薪资面议'
}

// 格式化发布时间
function formatPublishedAt(date: Date | null): string {
  if (!date) return ''
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  if (days < 30) return `${Math.floor(days / 7)}周前`
  return `${Math.floor(days / 30)}月前`
}

export function JobCard({
  job,
  view = 'list',
  showActions = true,
  className,
  lang = 'zh',
}: JobCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const remoteInfo = remoteTypeLabels[job.remote]
  const RemoteIcon = remoteInfo.icon

  // 解析高亮内容
  const displayTitle = job._highlight?.title || job.title
  const displayCompany = job._highlight?.companyName || job.company.name
  const displayDescription = job._highlight?.description || job.description.slice(0, 120)

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      const response = await fetch('/api/jobs/favorite', {
        method: isFavorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: job.id }),
      })
      
      if (response.ok) {
        setIsFavorited(!isFavorited)
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  if (view === 'grid') {
    return (
      <Link href={`/${lang}/jobs/${job.slug}`}>
        <Card
          className={cn(
            'group relative overflow-hidden border-white/10 bg-dark-200/50 backdrop-blur-sm',
            'hover:border-cyan-500/30 hover:bg-dark-200/80 transition-all duration-300',
            job.isFeatured && 'ring-1 ring-cyan-500/20',
            className
          )}
        >
          {/* Featured Badge */}
          {job.isFeatured && (
            <div className="absolute top-0 right-0">
              <div className="bg-gradient-to-l from-cyan-500 to-purple-500 text-white text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1">
                <Zap className="w-3 h-3" />
                精选
              </div>
            </div>
          )}

          {/* Urgent Badge */}
          {job.isUrgent && !job.isFeatured && (
            <div className="absolute top-0 right-0">
              <div className="bg-red-500/80 text-white text-xs px-3 py-1 rounded-bl-lg flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                急聘
              </div>
            </div>
          )}

          <div className="p-5">
            {/* Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                {job.company.logo ? (
                  <img
                    src={job.company.logo}
                    alt={job.company.name}
                    className="w-10 h-10 rounded object-contain"
                  />
                ) : (
                  <Building2 className="w-6 h-6 text-cyan-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {job._highlight?.title ? (
                  <h3
                    className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1"
                    dangerouslySetInnerHTML={{ __html: displayTitle }}
                  />
                ) : (
                  <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
                    {displayTitle}
                  </h3>
                )}
                <p className="text-sm text-gray-400 line-clamp-1">
                  {displayCompany}
                </p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" size="sm" className="text-xs">
                {jobTypeLabels[job.type]}
              </Badge>
              <Badge variant="outline" size="sm" className="text-xs">
                {jobLevelLabels[job.level]}
              </Badge>
              <Badge
                variant="neon"
                color={remoteInfo.color as 'green' | 'blue' | 'purple'}
                size="sm"
                className="text-xs"
              >
                <RemoteIcon className="w-3 h-3 mr-1" />
                {remoteInfo.label}
              </Badge>
            </div>

            {/* Info */}
            <div className="space-y-2 text-sm text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="line-clamp-1">{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <span className="text-cyan-400 font-medium">
                  {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryNegotiable)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span>{formatPublishedAt(job.publishedAt)}</span>
              </div>
            </div>

            {/* Skills */}
            {job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {job.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded bg-dark-300 text-xs text-gray-400"
                  >
                    {skill}
                  </span>
                ))}
                {job.skills.length > 4 && (
                  <span className="px-2 py-0.5 rounded bg-dark-300 text-xs text-gray-500">
                    +{job.skills.length - 4}
                  </span>
                )}
              </div>
            )}

            {/* Actions */}
            {showActions && (
              <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-white/10 hover:bg-white/5"
                  onClick={handleFavorite}
                >
                  <Heart
                    className={cn(
                      'w-4 h-4 mr-1',
                      isFavorited && 'fill-red-500 text-red-500'
                    )}
                  />
                  {isFavorited ? '已收藏' : '收藏'}
                </Button>
                <Button size="sm" className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500">
                  查看详情
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </Card>
      </Link>
    )
  }

  // List view (default)
  return (
    <Link href={`/${lang}/jobs/${job.slug}`}>
      <Card
        className={cn(
          'group relative overflow-hidden border-white/10 bg-dark-200/50 backdrop-blur-sm',
          'hover:border-cyan-500/30 hover:bg-dark-200/80 transition-all duration-300',
          job.isFeatured && 'ring-1 ring-cyan-500/20',
          className
        )}
      >
        <div className="p-5">
          <div className="flex gap-4">
            {/* Company Logo */}
            <div className="hidden sm:flex w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 items-center justify-center flex-shrink-0">
              {job.company.logo ? (
                <img
                  src={job.company.logo}
                  alt={job.company.name}
                  className="w-12 h-12 rounded object-contain"
                />
              ) : (
                <Building2 className="w-8 h-8 text-cyan-400" />
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {job._highlight?.title ? (
                      <h3
                        className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors"
                        dangerouslySetInnerHTML={{ __html: displayTitle }}
                      />
                    ) : (
                      <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
                        {displayTitle}
                      </h3>
                    )}
                    {job.isFeatured && (
                      <Badge variant="neon" color="cyan" size="sm">
                        <Zap className="w-3 h-3 mr-1" />
                        精选
                      </Badge>
                    )}
                    {job.isUrgent && (
                      <Badge variant="neon" color="red" size="sm">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        急聘
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-300">{displayCompany}</span>
                    <span className="text-gray-600">•</span>
                    <span className="text-gray-400">{job.company.industry}</span>
                  </div>
                </div>

                {/* Salary */}
                <div className="hidden sm:block text-right">
                  <div className="text-lg font-semibold text-cyan-400">
                    {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryNegotiable)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {job.applyCount > 0 && `${job.applyCount}人申请`}
                  </div>
                </div>
              </div>

              {/* Description */}
              {job._highlight?.description ? (
                <p
                  className="mt-2 text-sm text-gray-400 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: displayDescription + '...' }}
                />
              ) : (
                <p className="mt-2 text-sm text-gray-400 line-clamp-2">
                  {displayDescription}...
                </p>
              )}

              {/* Tags & Info */}
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <Badge variant="outline" size="sm">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {jobTypeLabels[job.type]}
                </Badge>
                <Badge variant="outline" size="sm">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {jobLevelLabels[job.level]}
                </Badge>
                <Badge
                  variant="neon"
                  color={remoteInfo.color as 'green' | 'blue' | 'purple'}
                  size="sm"
                >
                  <RemoteIcon className="w-3 h-3 mr-1" />
                  {remoteInfo.label}
                </Badge>
                <span className="flex items-center gap-1 text-sm text-gray-400">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  {formatPublishedAt(job.publishedAt)}
                </span>
              </div>

              {/* Skills */}
              {job.skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 rounded-full bg-dark-300 text-xs text-gray-400 border border-white/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {showActions && (
              <div className="hidden md:flex flex-col gap-2 justify-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-red-400"
                  onClick={handleFavorite}
                >
                  <Heart
                    className={cn(
                      'w-5 h-5',
                      isFavorited && 'fill-red-500 text-red-500'
                    )}
                  />
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-500">
                  申请
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Salary */}
          <div className="sm:hidden mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
            <span className="text-cyan-400 font-semibold">
              {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency, job.salaryNegotiable)}
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400"
                onClick={handleFavorite}
              >
                <Heart
                  className={cn(
                    'w-4 h-4',
                    isFavorited && 'fill-red-500 text-red-500'
                  )}
                />
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-purple-500">
                申请
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default JobCard
