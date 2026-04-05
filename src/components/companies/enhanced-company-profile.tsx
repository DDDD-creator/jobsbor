'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Building2, 
  Globe, 
  Users, 
  MapPin, 
  Heart,
  Briefcase,
  Star,
  TrendingUp,
  Award,
  Coffee,
  Clock,
  Laptop,
  Plane,
  Gift,
  Sparkles
} from 'lucide-react'
import { LocalizedLink } from '@/components/i18n/localized-link'
import type { Job } from '@/types'

interface Company {
  id: string
  name: string
  slug: string
  description: string
  industry: string
  size?: string
  location?: string
  website?: string
  logo?: string
  founded?: string
  funding?: string
  benefits?: string[]
  culture?: string
  values?: string[]
  techStack?: string[]
  socialLinks?: {
    linkedin?: string
    twitter?: string
    github?: string
  }
  stats?: {
    totalJobs: number
    avgSalary: string
    responseRate: string
    avgProcessTime: string
  }
}

interface EnhancedCompanyProfileProps {
  company: Company
  jobs: Job[]
  className?: string
}

const benefitIcons: Record<string, any> = {
  '远程工作': Laptop,
  '弹性工作': Clock,
  '带薪年假': Plane,
  '股票期权': TrendingUp,
  '免费午餐': Coffee,
  '健身补贴': Heart,
  '培训预算': Award,
  '节日福利': Gift,
  '团队旅游': Globe,
  '医疗保险': Heart,
}

export function EnhancedCompanyProfile({ company, jobs, className }: EnhancedCompanyProfileProps) {
  type TabId = 'overview' | 'jobs' | 'culture' | 'benefits'
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const formatSalary = (min?: number, max?: number, currency: string = 'CNY') => {
    if (!min && !max) return '薪资面议'
    const symbol = currency === 'CNY' ? '¥' : currency
    if (min && max) {
      return `${symbol}${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K`
    }
    if (min) return `${symbol}${(min / 1000).toFixed(0)}K+`
    if (max) return `最高${symbol}${(max / 1000).toFixed(0)}K`
    return '薪资面议'
  }

  return (
    <div className={className}>
      {/* 公司头部信息 */}
      <Card className="overflow-hidden border-white/10 bg-dark-200/50">
        {/* 封面背景 */}
        <div className="h-32 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20" />
        
        <div className="px-6 pb-6">
          {/* Logo和基本信息 */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end -mt-12 mb-6 gap-4">
            <div className="w-24 h-24 rounded-xl bg-dark-300 border-2 border-white/10 flex items-center justify-center shadow-xl">
              {company.logo ? (
                <img src={company.logo} alt={company.name} className="w-16 h-16 object-contain" />
              ) : (
                <Building2 className="w-10 h-10 text-gray-400" />
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">{company.name}</h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                <Badge variant="outline" size="sm">
                  {company.industry === 'finance' && '金融'}
                  {company.industry === 'web3' && 'Web3/区块链'}
                  {company.industry === 'internet' && '互联网'}
                </Badge>
                {company.size && (
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {company.size}
                  </span>
                )}
                {company.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {company.location}
                  </span>
                )}
                {company.founded && (
                  <span>成立于 {company.founded}</span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex"
                >
                  <Button variant="outline" size="sm" aria-label="访问公司官网">
                    <Globe className="w-4 h-4 mr-2" />
                    官网
                  </Button>
                </a>
              )}
            </div>
          </div>

          {/* 统计信息 */}
          {company.stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 rounded-lg bg-dark-300/30">
                <div className="text-2xl font-bold text-cyan-400">{company.stats.totalJobs}</div>
                <div className="text-xs text-gray-400">在招职位</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-dark-300/30">
                <div className="text-2xl font-bold text-purple-400">{company.stats.avgSalary}</div>
                <div className="text-xs text-gray-400">平均薪资</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-dark-300/30">
                <div className="text-2xl font-bold text-green-400">{company.stats.responseRate}</div>
                <div className="text-xs text-gray-400">回复率</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-dark-300/30">
                <div className="text-2xl font-bold text-pink-400">{company.stats.avgProcessTime}</div>
                <div className="text-xs text-gray-400">平均处理时间</div>
              </div>
            </div>
          )}

          {/* 标签页导航 */}
          <div className="flex gap-1 border-b border-white/10">
            {[
              { id: 'overview', label: '公司介绍', icon: Building2 },
              { id: 'jobs', label: `在招职位 (${jobs.length})`, icon: Briefcase },
              { id: 'culture', label: '公司文化', icon: Heart },
              { id: 'benefits', label: '福利待遇', icon: Gift },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-cyan-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500" />
                )}
              </button>
            ))}
          </div>

          {/* 标签页内容 */}
          <div className="pt-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* 公司简介 */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">公司简介</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {company.description || '暂无公司介绍'}
                  </p>
                </div>

                {/* 融资信息 */}
                {company.funding && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">融资情况</h3>
                    <Badge variant="neon" color="green" size="sm">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {company.funding}
                    </Badge>
                  </div>
                )}

                {/* 技术栈 */}
                {company.techStack && company.techStack.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">技术栈</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.techStack.map((tech) => (
                        <Badge key={tech} variant="outline" size="sm">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 社交媒体 */}
                {company.socialLinks && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">关注我们</h3>
                    <div className="flex gap-3">
                      {company.socialLinks.linkedin && (
                        <a
                          href={company.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                          LinkedIn
                        </a>
                      )}
                      {company.socialLinks.twitter && (
                        <a
                          href={company.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                          Twitter
                        </a>
                      )}
                      {company.socialLinks.github && (
                        <a
                          href={company.socialLinks.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-cyan-400 transition-colors"
                        >
                          GitHub
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-4">
                {jobs.length === 0 ? (
                  <p className="text-gray-400 text-center py-8">暂无在招职位</p>
                ) : (
                  jobs.map((job) => (
                    <LocalizedLink key={job.id} href={`/jobs/${job.slug}`}>
                      <Card className="p-4 border-white/10 bg-dark-300/30 hover:bg-dark-300/50 transition-all cursor-pointer group">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                              {job.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location}
                              </span>
                              <Badge variant="outline" size="sm">
                                {job.type === 'full-time' && '全职'}
                                {job.type === 'part-time' && '兼职'}
                                {job.type === 'contract' && '合同'}
                                {job.type === 'remote' && '远程'}
                              </Badge>
                              <span className="text-cyan-400 font-medium">
                                {formatSalary(job.salaryMin || undefined, job.salaryMax || undefined, job.salaryCurrency || 'CNY')}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {job.tags.slice(0, 5).map((tag) => (
                                <Badge key={tag} variant="outline" size="sm" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button size="sm" variant="outline" aria-label={`查看职位 ${job.title} 详情`}>
                            查看详情
                          </Button>
                        </div>
                      </Card>
                    </LocalizedLink>
                  ))
                )}
              </div>
            )}

            {activeTab === 'culture' && (
              <div className="space-y-6">
                {/* 公司文化 */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">企业文化</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {company.culture || '暂无公司文化介绍'}
                  </p>
                </div>

                {/* 价值观 */}
                {company.values && company.values.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">核心价值观</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {company.values.map((value, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-3 p-4 rounded-lg bg-dark-300/30"
                        >
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                            <Star className="w-4 h-4 text-cyan-400" />
                          </div>
                          <span className="text-gray-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'benefits' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-3">福利待遇</h3>
                
                {company.benefits && company.benefits.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {company.benefits.map((benefit) => {
                      const Icon = benefitIcons[benefit] || Gift
                      return (
                        <div
                          key={benefit}
                          className="flex items-center gap-3 p-4 rounded-lg bg-dark-300/30 hover:bg-dark-300/50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center"
                          >
                            <Icon className="w-5 h-5 text-cyan-400" />
                          </div>
                          <span className="text-gray-300">{benefit}</span>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-gray-400">暂无福利信息</p>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}
