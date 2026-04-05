'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JobCard } from '@/components/jobs/JobCard'
import { Pagination } from '@/components/ui/pagination'
import { ScrollReveal } from '@/lib/animations'
import { Briefcase, MapPin, Sparkles } from 'lucide-react'

// 导入所有职位数据
import { realJobs } from '@/data/real-jobs'
import { crawledJobs } from '@/data/crawled-jobs'
import { jobs as seedJobs } from '@/data/jobs'

// 统一职位格式 - 转换为JobCard需要的格式
const allJobs = [
  ...realJobs.map((job, index) => ({
    id: job.id || `real-${index}`,
    title: job.title,
    slug: `job-${index}`,
    companyId: job.company.toLowerCase().replace(/\s+/g, '-'),
    company: {
      id: job.company.toLowerCase().replace(/\s+/g, '-'),
      name: job.company,
      slug: job.company.toLowerCase().replace(/\s+/g, '-'),
      industry: (job.remote ? 'web3' : 'internet') as 'web3' | 'internet' | 'finance',
      createdAt: new Date(),
    },
    description: job.description?.substring(0, 200) || '暂无描述',
    requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '详见职位链接',
    salaryMin: 0,
    salaryMax: 0,
    salaryCurrency: 'CNY' as const,
    location: job.location,
    type: (job.remote ? 'remote' : 'full-time') as 'remote' | 'full-time' | 'part-time' | 'contract',
    industry: (job.remote ? 'web3' : 'internet') as 'web3' | 'internet' | 'finance',
    category: 'engineer' as const,
    tags: [job.source],
    isActive: true,
    publishedAt: new Date(job.postedAt || Date.now()),
    createdAt: new Date(job.postedAt || Date.now()),
    updatedAt: new Date(job.postedAt || Date.now()),
  })),
  ...crawledJobs.map((job, index) => ({
    id: job.id || `crawled-${index}`,
    title: job.title,
    slug: `${job.companySlug}-${job.title.toLowerCase().replace(/\s+/g, '-')}-${index}`,
    companyId: job.companySlug,
    company: {
      id: job.companySlug,
      name: job.company,
      slug: job.companySlug,
      industry: job.industry,
      createdAt: new Date(),
    },
    description: job.description,
    requirements: job.requirements,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: 'CNY' as const,
    location: job.location,
    type: job.type as 'remote' | 'full-time' | 'part-time' | 'contract',
    industry: job.industry,
    category: job.category,
    tags: job.tags,
    isActive: true,
    publishedAt: new Date(job.publishedAt || Date.now()),
    createdAt: new Date(job.publishedAt || Date.now()),
    updatedAt: new Date(job.publishedAt || Date.now()),
  })),
  ...seedJobs.map((job, index) => ({
    id: job.id || `seed-${index}`,
    title: job.title,
    slug: job.slug || `seed-job-${index}`,
    companyId: job.companySlug,
    company: {
      id: job.companySlug,
      name: job.company,
      slug: job.companySlug,
      industry: job.industry,
      createdAt: new Date(),
    },
    description: job.description,
    requirements: job.requirements,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    salaryCurrency: 'CNY' as const,
    location: job.location,
    type: job.type,
    industry: job.industry,
    category: job.category,
    tags: job.tags,
    isActive: true,
    publishedAt: new Date(job.publishedAt || Date.now()),
    createdAt: new Date(job.publishedAt || Date.now()),
    updatedAt: new Date(job.publishedAt || Date.now()),
  })),
]

// 调试信息
console.log('Total jobs:', allJobs.length)
console.log('realJobs count:', realJobs.length)
console.log('crawledJobs count:', crawledJobs.length)
console.log('seedJobs count:', seedJobs.length)

export default function SimpleJobsPage() {
  const [currentPage, setCurrentPage] = useState(1)

  // 简单的分页
  const itemsPerPage = 12
  const totalPages = Math.ceil(allJobs.length / itemsPerPage)
  const paginatedJobs = allJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="min-h-screen bg-dark-500">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* 页面标题 */}
          <ScrollReveal>
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                所有职位
              </h1>
              <p className="text-gray-400">
                共 <span className="text-cyan-400 font-semibold">{allJobs.length}</span> 个职位
              </p>
            </div>
          </ScrollReveal>

          {/* 统计卡片 */}
          <ScrollReveal delay={100}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass-card rounded-xl p-4 text-center">
                <Briefcase className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{allJobs.length}</p>
                <p className="text-sm text-gray-400">总职位</p>
                {/* 调试信息 */}
                <p className="text-xs text-gray-500 mt-1">
                  R:{realJobs.length} C:{crawledJobs.length} S:{seedJobs.length}
                </p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <MapPin className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {allJobs.filter(j => j.type === 'remote').length}
                </p>
                <p className="text-sm text-gray-400">远程职位</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <Sparkles className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {allJobs.filter(j => j.salaryMax >= 50000).length}
                </p>
                <p className="text-sm text-gray-400">高薪职位</p>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <Briefcase className="w-6 h-6 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">
                  {new Set(allJobs.map(j => j.company?.name)).size}
                </p>
                <p className="text-sm text-gray-400">公司数</p>
              </div>
            </div>
          </ScrollReveal>

          {/* 职位列表 */}
          <ScrollReveal delay={200}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </ScrollReveal>

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
      </main>

      <Footer />
    </div>
  )
}
