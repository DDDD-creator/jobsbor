'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JobList } from '@/components/jobs/JobList'
import { Pagination } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { ScrollReveal } from '@/lib/animations'
import { useClientTranslations, t } from '@/hooks/useClientTranslations'
import { AdvancedSearch, type AdvancedFilters } from '@/components/jobs/advanced-search'
import { 
  SlidersHorizontal, 
  Briefcase, 
  MapPin, 
  Sparkles,
  TrendingUp,
  Globe,
  AlertCircle,
  Bell
} from 'lucide-react'
import { realJobs, jobsCount as totalJobsCount } from '@/data/real-jobs'
import { crawledJobs } from '@/data/crawled-jobs'
import { jobs as seedJobs } from '@/data/jobs'

interface JobWithCompany {
  id: string
  title: string
  slug: string
  companyId: string
  company?: {
    id: string
    name: string
    slug: string
    industry: string
    createdAt: Date
  }
  description: string
  requirements: string
  salaryMin: number
  salaryMax: number
  salaryCurrency: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  industry: 'finance' | 'web3' | 'internet'
  category: 'engineer' | 'product' | 'design' | 'marketing' | 'finance' | 'operations' | 'research'
  tags: string[]
  isActive: boolean
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

const allJobs: JobWithCompany[] = [
  ...realJobs.map((job, index) => ({
    id: job.id,
    title: job.title,
    slug: `${job.company.toLowerCase().replace(/\s+/g, '-')}-${job.title.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}-${index}`,
    companyId: job.company.toLowerCase().replace(/\s+/g, '-'),
    company: {
      id: job.company.toLowerCase().replace(/\s+/g, '-'),
      name: job.company,
      slug: job.company.toLowerCase().replace(/\s+/g, '-'),
      industry: job.remote ? 'web3' : 'internet' as 'finance' | 'web3' | 'internet',
      createdAt: new Date(job.postedAt),
    },
    description: job.description,
    requirements: job.requirements?.join('\n') || '详见职位链接',
    salaryMin: 0,
    salaryMax: 0,
    salaryCurrency: 'CNY',
    location: job.location,
    type: job.remote ? 'remote' as const : 'full-time' as const,
    industry: job.remote ? 'web3' as const : 'internet' as const,
    category: 'engineer' as const,
    tags: job.requirements && job.requirements.length > 0 ? job.requirements : ['Remote', job.source],
    isActive: true,
    publishedAt: new Date(job.postedAt),
    createdAt: new Date(job.postedAt),
    updatedAt: new Date(job.postedAt),
  })),
  ...crawledJobs.map((job, index) => ({
    id: job.id,
    title: job.title,
    slug: `${job.companySlug}-${job.title.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    companyId: job.companySlug,
    company: {
      id: job.companySlug,
      name: job.company,
      slug: job.companySlug,
      industry: job.industry,
      createdAt: new Date(job.publishedAt),
    },
    description: job.description,
    requirements: job.requirements,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: 'CNY',
    location: job.location,
    type: job.type,
    industry: job.industry,
    category: job.category,
    tags: job.tags,
    isActive: true,
    publishedAt: new Date(job.publishedAt),
    createdAt: new Date(job.publishedAt),
    updatedAt: new Date(job.publishedAt),
  })),
  ...seedJobs.map((job) => ({
    id: job.id,
    title: job.title,
    slug: job.slug,
    companyId: job.companySlug,
    company: {
      id: job.companySlug,
      name: job.company,
      slug: job.companySlug,
      industry: job.industry,
      createdAt: new Date(job.publishedAt),
    },
    description: job.description,
    requirements: job.requirements,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: 'CNY',
    location: job.location,
    type: job.type,
    industry: job.industry,
    category: job.category,
    tags: job.tags,
    isActive: true,
    publishedAt: new Date(job.publishedAt),
    createdAt: new Date(job.publishedAt),
    updatedAt: new Date(job.publishedAt),
  })),
]

// 经验关键词匹配
const experienceKeywords: Record<string, string[]> = {
  entry: ['应届', '初级', '1年', '2年', 'entry', 'junior', 'fresh'],
  mid: ['3年', '4年', '5年', '中级', 'mid', 'intermediate'],
  senior: ['5年', '6年', '7年', '8年', '9年', '10年', '高级', '资深', 'senior', 'lead'],
  expert: ['10年', '15年', '20年', '专家', '总监', 'VP', 'CTO', 'CEO', 'expert', 'principal', 'staff'],
}

export default function JobsPage() {
  const searchParams = useSearchParams()
  const { jobList } = useClientTranslations()
  
  const [filters, setFilters] = useState<AdvancedFilters>({
    keyword: '',
    industry: '',
    type: '',
    location: '',
    salaryMin: 0,
    salaryMax: 1000000,
    experience: '',
    tags: [],
    postedWithin: '',
    hasSalary: false,
    remoteOnly: false,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [showAlertModal, setShowAlertModal] = useState(false)
  const [alertEmail, setAlertEmail] = useState('')

  // 从URL参数读取筛选条件
  useEffect(() => {
    const keyword = searchParams.get('keyword') || ''
    const industry = searchParams.get('industry') || ''
    const location = searchParams.get('location') || ''
    const type = searchParams.get('type') || ''
    
    setFilters(prev => ({
      ...prev,
      keyword,
      industry,
      location,
      type,
    }))
  }, [searchParams])

  // 高级筛选逻辑
  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      // 关键词搜索
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase()
        const matchTitle = job.title.toLowerCase().includes(keyword)
        const matchCompany = job.company?.name.toLowerCase().includes(keyword)
        const matchDesc = job.description.toLowerCase().includes(keyword)
        const matchTags = job.tags.some(tag => tag.toLowerCase().includes(keyword))
        if (!matchTitle && !matchCompany && !matchDesc && !matchTags) return false
      }
      
      // 行业筛选
      if (filters.industry && job.industry !== filters.industry) return false
      
      // 工作类型
      if (filters.type && job.type !== filters.type) return false
      
      // 远程工作
      if (filters.remoteOnly && job.type !== 'remote') return false
      
      // 地点筛选
      if (filters.location && !job.location.includes(filters.location)) return false
      
      // 薪资范围
      if (filters.hasSalary && job.salaryMax === 0 && job.salaryMin === 0) return false
      if (job.salaryMax > 0 && job.salaryMin > 0) {
        if (job.salaryMax < filters.salaryMin || job.salaryMin > filters.salaryMax) return false
      }
      
      // 经验要求（通过关键词匹配描述和要求）
      if (filters.experience) {
        const keywords = experienceKeywords[filters.experience] || []
        const textToSearch = `${job.description} ${job.requirements}`.toLowerCase()
        const hasExperience = keywords.some(kw => textToSearch.includes(kw.toLowerCase()))
        if (!hasExperience) return false
      }
      
      // 技能标签
      if (filters.tags.length > 0) {
        const jobTags = job.tags.map(t => t.toLowerCase())
        const hasTag = filters.tags.some(tag => 
          jobTags.some(jt => jt.includes(tag.toLowerCase()))
        )
        if (!hasTag) return false
      }
      
      // 发布时间
      if (filters.postedWithin) {
        const days = parseInt(filters.postedWithin)
        const jobDate = new Date(job.publishedAt)
        const daysDiff = (Date.now() - jobDate.getTime()) / (1000 * 3600 * 24)
        if (daysDiff > days) return false
      }
      
      return true
    })
  }, [filters])

  // 分页
  const itemsPerPage = 12
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSearch = () => {
    setCurrentPage(1)
    // 可以在这里添加URL更新逻辑
  }

  const clearFilters = () => {
    setFilters({
      keyword: '',
      industry: '',
      type: '',
      location: '',
      salaryMin: 0,
      salaryMax: 1000000,
      experience: '',
      tags: [],
      postedWithin: '',
      hasSalary: false,
      remoteOnly: false,
    })
    setCurrentPage(1)
  }

  const activeFiltersCount = [
    filters.industry,
    filters.type,
    filters.location,
    filters.experience,
    filters.postedWithin,
    filters.hasSalary,
    filters.remoteOnly,
    ...filters.tags,
  ].filter(Boolean).length + (filters.keyword ? 1 : 0)

  // 统计信息
  const stats = {
    total: totalJobsCount,
    remote: realJobs.filter(j => j.remote).length,
    highSalary: allJobs.filter(j => j.salaryMax >= 50000).length,
    today: realJobs.filter(j => {
      const daysDiff = (new Date().getTime() - new Date(j.postedAt).getTime()) / (1000 * 3600 * 24)
      return daysDiff <= 3
    }).length,
  }

  // 保存搜索提醒
  const saveJobAlert = () => {
    if (!alertEmail) return
    
    // 保存到localStorage
    const alerts = JSON.parse(localStorage.getItem('jobsbor_job_alerts') || '[]')
    alerts.push({
      id: Date.now().toString(),
      email: alertEmail,
      filters: { ...filters },
      createdAt: new Date().toISOString(),
      active: true,
    })
    localStorage.setItem('jobsbor_job_alerts', JSON.stringify(alerts))
    
    setShowAlertModal(false)
    setAlertEmail('')
    alert('职位提醒已设置！有新职位时会邮件通知你。')
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1c]">
      <Header />

      <main className="flex-1 relative pt-16">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
          <div className="absolute inset-0 bg-grid" />
        </div>

        {/* 面包屑导航 */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <Breadcrumb items={[{ label: t('jobs') }]} />
        </div>

        {/* Page Header */}
        <div className="relative border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="neon" color="purple" size="sm">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {jobList.hotJobs}
                </Badge>
                <span className="text-gray-400 text-sm">{t('jobList.totalJobs', { count: stats.total })}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                {jobList.title.split('你的')[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  {jobList.title.includes('Dream') ? 'Dream ' : '理想'}
                </span>
                {jobList.title.includes('Dream') ? 'Job' : '工作'}
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl">
                {jobList.subtitle}
              </p>

              {/* 统计信息 */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 text-sm">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  {t('jobList.updatedToday', { count: stats.today })}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-sm">
                  <Globe className="w-3 h-3" />
                  {t('jobList.remoteJobs', { count: stats.remote })}
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-400 text-sm">
                  <TrendingUp className="w-3 h-3" />
                  {t('jobList.highSalary', { count: stats.highSalary })}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          {/* 高级搜索组件 */}
          <ScrollReveal delay={100}>
            <AdvancedSearch
              filters={filters}
              onFiltersChange={setFilters}
              onSearch={handleSearch}
              totalResults={filteredJobs.length}
              className="mb-8"
            />
          </ScrollReveal>

          {/* 结果统计和排序 */}
          <ScrollReveal delay={150}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  找到 <span className="text-cyan-400 font-semibold">{filteredJobs.length}</span> 个职位
                </span>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-orange-400 hover:text-orange-300"
                  >
                    清除筛选
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAlertModal(true)}
                  className="hidden sm:flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  设置职位提醒
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* 职位列表 */}
          {paginatedJobs.length > 0 ? (
            <JobList jobs={paginatedJobs} />
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">没有找到符合条件的职位</p>
              <p className="text-sm text-gray-500 mb-4">试试调整筛选条件，或设置职位提醒</p>
              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={clearFilters}>
                  清除筛选
                </Button>
                <Button onClick={() => setShowAlertModal(true)}>
                  <Bell className="w-4 h-4 mr-2" />
                  设置提醒
                </Button>
              </div>
            </div>
          )}

          {/* 分页 */}
          {totalPages > 1 && (
            <ScrollReveal delay={300}>
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </ScrollReveal>
          )}
        </div>

        {/* 职位提醒弹窗 */}
        {showAlertModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md p-6 border-white/10 bg-dark-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyan-400" />
                  设置职位提醒
                </h3>
                <button 
                  onClick={() => setShowAlertModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 mb-4">
                当有新职位符合你的筛选条件时，我们会发送邮件通知你。
              </p>
              <input
                type="email"
                value={alertEmail}
                onChange={(e) => setAlertEmail(e.target.value)}
                placeholder="输入你的邮箱地址"
                className="w-full px-4 py-3 rounded-lg bg-dark-300 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-cyan-500 mb-4"
              />
              {activeFiltersCount > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-dark-300/50">
                  <p className="text-sm text-gray-400 mb-2">当前筛选条件：</p>
                  <div className="flex flex-wrap gap-2">
                    {filters.keyword && <Badge size="sm" variant="outline">{filters.keyword}</Badge>}
                    {filters.industry && <Badge size="sm" variant="outline">{filters.industry}</Badge>}
                    {filters.location && <Badge size="sm" variant="outline">{filters.location}</Badge>}
                    {filters.type && <Badge size="sm" variant="outline">{filters.type}</Badge>}
                    {filters.experience && <Badge size="sm" variant="outline">{filters.experience}</Badge>}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  className="flex-1"
                  onClick={() => setShowAlertModal(false)}
                >
                  取消
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500"
                  onClick={saveJobAlert}
                  disabled={!alertEmail}
                >
                  设置提醒
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
