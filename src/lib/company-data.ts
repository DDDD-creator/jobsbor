// 从职位数据中提取公司信息 - 共享给公司列表和详情页
import { crawledJobs } from '@/data/crawled-jobs'
import { jobs as seedJobs } from '@/data/jobs'
import type { Job } from '@/types'

// 定义扩展职位类型，包含爬虫数据和种子数据的所有字段
type JobData = {
  id: string
  title: string
  slug: string
  companyId?: string
  company: string
  companySlug: string
  description: string
  requirements?: string
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string
  location: string
  type: string
  industry: 'finance' | 'web3' | 'internet'
  category?: string
  tags: string[]
  isActive?: boolean
  publishedAt?: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface CompanyData {
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
  jobs: JobData[]
  // 增强字段（可选）
  size?: string
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
}

// 提取并聚合公司数据
export function extractCompanies(): CompanyData[] {
  const companyMap = new Map<string, CompanyData>()
  
  // 处理爬虫数据
  crawledJobs.forEach((job) => {
    // 为爬虫数据生成slug
    const jobSlug = `${job.companySlug}-${job.title}-${job.id}`.toLowerCase().replace(/\s+/g, '-')
    
    const jobData: JobData = {
      id: job.id,
      title: job.title,
      slug: jobSlug,
      company: job.company,
      companySlug: job.companySlug,
      description: job.description,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: 'CNY', // 爬虫数据默认人民币
      location: job.location,
      type: job.type,
      industry: job.industry,
      category: job.category,
      tags: job.tags,
    }
    
    if (companyMap.has(job.companySlug)) {
      const company = companyMap.get(job.companySlug)!
      company.jobCount += 1
      company.jobs.push(jobData)
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
        jobs: [jobData],
      })
    }
  })
  
  // 处理种子数据
  seedJobs.forEach((job) => {
    const jobData: JobData = {
      id: job.id,
      title: job.title,
      slug: job.slug,
      company: job.company,
      companySlug: job.companySlug,
      description: job.description,
      requirements: job.requirements,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryCurrency: 'CNY', // 种子数据默认人民币
      location: job.location,
      type: job.type,
      industry: job.industry as 'finance' | 'web3' | 'internet',
      category: job.category,
      tags: job.tags,
    }
    
    if (companyMap.has(job.companySlug)) {
      const company = companyMap.get(job.companySlug)!
      company.jobCount += 1
      company.jobs.push(jobData)
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
        industry: job.industry as 'finance' | 'web3' | 'internet',
        jobCount: 1,
        tags: [...job.tags],
        jobs: [jobData],
      })
    }
  })
  
  return Array.from(companyMap.values())
}

// 获取单个公司数据
export function getCompanyBySlug(slug: string): CompanyData | undefined {
  return extractCompanies().find(c => c.slug === slug)
}

// 获取所有公司slug（用于generateStaticParams）
export function getAllCompanySlugs(): string[] {
  return extractCompanies().map(c => c.slug)
}
