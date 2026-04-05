'use client'

import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CompanyCard } from '@/components/companies/CompanyCard'
import { Input, SearchInput } from '@/components/ui/input'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollReveal } from '@/lib/animations'
import { useClientTranslations, t } from '@/hooks/useClientTranslations'
import { 
  Search, 
  Building2, 
  TrendingUp, 
  Globe,
  MapPin,
  Sparkles,
  AlertCircle,
  Briefcase
} from 'lucide-react'

// 导入数据
import { crawledJobs } from '@/data/crawled-jobs'
import { jobs as seedJobs } from '@/data/jobs'

// 从职位数据中提取公司信息
interface CompanyData {
  id: string
  name: string
  slug: string
  description: string
  location: string
  industry: 'finance' | 'web3' | 'internet'
  website?: string
  logo?: string
  jobCount: number
  tags: string[]
}

// 提取并聚合公司数据
const extractCompanies = (): CompanyData[] => {
  const companyMap = new Map<string, CompanyData>()
  
  // 处理爬虫数据
  crawledJobs.forEach((job) => {
    if (companyMap.has(job.companySlug)) {
      const company = companyMap.get(job.companySlug)!
      company.jobCount += 1
      job.tags.forEach(tag => {
        if (!company.tags.includes(tag)) company.tags.push(tag)
      })
    } else {
      companyMap.set(job.companySlug, {
        id: job.companySlug,
        name: job.company,
        slug: job.companySlug,
        description: `${job.company}是${job.industry === 'finance' ? '金融行业' : job.industry === 'web3' ? 'Web3领域' : '互联网行业'}的领先企业，提供具有竞争力的职位机会。`,
        location: job.location,
        industry: job.industry,
        jobCount: 1,
        tags: [...job.tags],
      })
    }
  })
  
  // 处理种子数据
  seedJobs.forEach((job) => {
    if (companyMap.has(job.companySlug)) {
      const company = companyMap.get(job.companySlug)!
      company.jobCount += 1
      job.tags.forEach(tag => {
        if (!company.tags.includes(tag)) company.tags.push(tag)
      })
    } else {
      companyMap.set(job.companySlug, {
        id: job.companySlug,
        name: job.company,
        slug: job.companySlug,
        description: job.description.slice(0, 100) + '...',
        location: job.location,
        industry: job.industry,
        jobCount: 1,
        tags: [...job.tags],
      })
    }
  })
  
  return Array.from(companyMap.values())
}

const allCompanies = extractCompanies()

// 筛选选项 - 使用函数获取翻译
const getIndustries = () => [
  { value: '', label: t('jobList.allIndustries') },
  { value: 'finance', label: t('jobList.finance') },
  { value: 'web3', label: 'Web3' },
  { value: 'internet', label: t('jobList.internet') },
]

const getLocations = () => [
  { value: '', label: t('jobList.allLocations') || '全部地点' },
  { value: '北京', label: '北京' },
  { value: '上海', label: '上海' },
  { value: '深圳', label: '深圳' },
  { value: '杭州', label: '杭州' },
  { value: '远程', label: t('jobList.remoteWork') || '远程' },
]

/**
 * 公司列表页
 * - 公司卡片网格展示
 * - 公司logo + 名称 + 简介 + 在招职位数
 */
export default function CompaniesPage() {
  const { companyList } = useClientTranslations()
  
  // 筛选选项
  const industries = getIndustries()
  const locations = getLocations()
  
  const [filters, setFilters] = useState({
    industry: '',
    location: '',
    keyword: '',
  })

  // 使用useMemo优化筛选逻辑
  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((company) => {
      if (filters.industry && company.industry !== filters.industry) return false
      if (filters.location && !company.location.includes(filters.location)) return false
      if (filters.keyword &&
          !company.name.toLowerCase().includes(filters.keyword.toLowerCase()) &&
          !company.description.toLowerCase().includes(filters.keyword.toLowerCase())) return false
      return true
    })
  }, [filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({ industry: '', location: '', keyword: '' })
  }

  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length

  // 统计
  const stats = {
    total: allCompanies.length,
    totalJobs: allCompanies.reduce((sum, c) => sum + c.jobCount, 0),
    byIndustry: {
      finance: allCompanies.filter(c => c.industry === 'finance').length,
      web3: allCompanies.filter(c => c.industry === 'web3').length,
      internet: allCompanies.filter(c => c.industry === 'internet').length,
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1c]">
      <Header />

      <main className="flex-1 pt-16">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {/* 面包屑 */}
          <ScrollReveal>
            <Breadcrumb items={[{ label: t('companies') }]} />
          </ScrollReveal>

          {/* Page Header */}
          <div className="py-12">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="neon" color="cyan" size="sm">
                  <Building2 className="w-3 h-3 mr-1" />
                  {companyList.title}
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t('companyList.explore') || '探索'}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">{t('companyList.excellent') || '优秀企业'}</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl">
                {companyList.subtitle}
              </p>

              {/* 统计 */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm">
                  <Building2 className="w-4 h-4" />
                  {t('companyList.companyCount', { count: stats.total })}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm">
                  <Briefcase className="w-4 h-4" />
                  {t('jobList.totalJobs', { count: stats.totalJobs })}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-400 text-sm">
                  <TrendingUp className="w-4 h-4" />
                  {t('jobList.realTimeUpdate') || '实时更新'}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* 筛选栏 */}
          <ScrollReveal delay={100}>
            <Card variant="glass" className="p-4 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* 搜索框 */}
                <div className="relative flex-1">
                  <SearchInput
                    placeholder={t('nav.search') + '...'}
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                    variant="glass"
                    glowColor="cyan"
                  />
                </div>

                {/* 行业筛选 */}
                <div className="flex gap-2">
                  {industries.map((industry) => (
                    <button
                      key={industry.value}
                      onClick={() => handleFilterChange('industry', industry.value)}
                      className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                        filters.industry === industry.value
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                      }`}
                    >
                      {industry.label}
                    </button>
                  ))}
                </div>

                {/* 地点筛选 */}
                <select
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="rounded-lg bg-gray-900 border border-white/10 text-white px-3 py-2 text-sm focus:outline-none focus:border-cyan-500"
                >
                  {locations.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>

                {/* 清除筛选 */}
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearFilters}
                    className="text-orange-400 hover:text-orange-300"
                  >
                    {t('jobList.clearFilters')}
                  </Button>
                )}
              </div>
            </Card>
          </ScrollReveal>

          {/* 结果统计 */}
          <ScrollReveal delay={150}>
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-gray-400">
                {t('companyList.resultsFound', { count: filteredCompanies.length })}
              </div>
            </div>
          </ScrollReveal>

          {/* 公司网格 */}
          {filteredCompanies.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCompanies.map((company, index) => (
                <ScrollReveal key={company.id} delay={index * 50}>
                  <CompanyCardEnhanced company={company} />
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">{t('companyList.noResults')}</p>
              <Button variant="outline" onClick={clearFilters} className="mt-4">
                {t('jobList.clearFilters')}
              </Button>
            </div>
          )}

          {/* 加载更多 */}
          {filteredCompanies.length > 0 && filteredCompanies.length >= 12 && (
            <div className="mt-12 text-center">
              <Button variant="outline" className="border-white/20">
                <Sparkles className="mr-2 h-4 w-4" />
                {t('companyList.loadMore')}
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

// 增强版公司卡片组件
function CompanyCardEnhanced({ company }: { company: CompanyData }) {
  const industryColors = {
    finance: 'from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30',
    web3: 'from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
    internet: 'from-cyan-500/20 to-blue-500/20 text-cyan-400 border-cyan-500/30',
  }

  const industryLabels = {
    finance: '金融',
    web3: 'Web3',
    internet: '互联网',
  }

  return (
    <LocalizedLink href={`/companies/${company.slug}`}>
      <div className="glass-card rounded-2xl p-6 h-full cursor-pointer group hover:border-white/20 transition-all duration-300">
        {/* 头部：Logo和名称 */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${industryColors[company.industry].split(' ')[0]} ${industryColors[company.industry].split(' ')[1]} flex items-center justify-center border ${industryColors[company.industry].split(' ')[3]} group-hover:scale-110 transition-transform duration-300`}>
            <Building2 className={`w-7 h-7 ${industryColors[company.industry].split(' ')[2]}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
              {company.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge 
                variant="outline" 
                size="sm"
                className={`text-xs ${industryColors[company.industry].split(' ')[2]} border-current`}
              >
                {industryLabels[company.industry]}
              </Badge>
            </div>
          </div>
        </div>

        {/* 简介 */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {company.description}
        </p>

        {/* 地点 */}
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
          <MapPin className="w-4 h-4" />
          {company.location}
        </div>

        {/* 底部：职位数量 */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 font-medium">{company.jobCount}</span>
            <span className="text-gray-500 text-sm">在招职位</span>
          </div>
          
          <div className="text-gray-500 text-sm group-hover:text-cyan-400 transition-colors">
            查看 →
          </div>
        </div>
      </div>
    </LocalizedLink>
  )
}

import { LocalizedLink } from '@/components/i18n/localized-link'
