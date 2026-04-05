import { prisma } from './db'
import type { Job, Company, Post } from '@/types'

// 扩展类型：包含关联数据的类型
export type JobWithCompany = Job & { company: Company }
export type CompanyWithJobCount = Company & { jobCount: number }
export type CompanyWithJobs = Company & { jobs: Job[] }

// ==================== 职位相关 ====================

export interface GetJobsParams {
  industry?: string
  type?: string
  location?: string
  keyword?: string
  page?: number
  limit?: number
}

/**
 * 获取职位列表
 * @param params 筛选参数
 * @returns 职位列表（包含公司信息）
 */
export async function getJobs(params: GetJobsParams = {}): Promise<JobWithCompany[]> {
  const { industry, type, location, keyword, page = 1, limit = 10 } = params
  const skip = (page - 1) * limit

  const where: any = {
    status: 'ACTIVE',
  }

  if (industry) {
    where.industry = industry
  }

  if (type) {
    where.type = type
  }

  if (location) {
    where.location = {
      contains: location,
      mode: 'insensitive',
    }
  }

  if (keyword) {
    where.OR = [
      {
        title: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: keyword,
          mode: 'insensitive',
        },
      },
    ]
  }

  const jobs = await prisma.job.findMany({
    where,
    include: {
      company: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    skip,
    take: limit,
  })

  return jobs as unknown as JobWithCompany[]
}

/**
 * 根据slug获取职位详情
 * @param slug 职位slug
 * @returns 职位详情（包含公司信息）
 */
export async function getJobBySlug(slug: string): Promise<JobWithCompany | null> {
  const job = await prisma.job.findUnique({
    where: {
      slug,
    },
    include: {
      company: true,
    },
  })

  if (!job || job.status !== 'ACTIVE') return null
  
  return job as unknown as JobWithCompany | null
}

/**
 * 根据行业获取职位列表
 * @param industry 行业名称
 * @param limit 限制数量
 * @returns 职位列表（包含公司信息）
 */
export async function getJobsByIndustry(
  industry: string,
  limit: number = 10
): Promise<JobWithCompany[]> {
  const jobs = await prisma.job.findMany({
    where: {
      industry,
      status: 'ACTIVE',
    },
    include: {
      company: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  })

  return jobs as unknown as JobWithCompany[]
}

/**
 * 获取最新职位列表
 * @param limit 限制数量
 * @returns 职位列表（包含公司信息）
 */
export async function getLatestJobs(limit: number = 10): Promise<JobWithCompany[]> {
  const jobs = await prisma.job.findMany({
    where: {
      status: 'ACTIVE',
    },
    include: {
      company: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  })

  return jobs as unknown as JobWithCompany[]
}

/**
 * 获取相关职位
 * 根据相同行业或相同公司推荐相关职位
 * @param jobId 当前职位ID
 * @param limit 限制数量
 * @returns 相关职位列表
 */
export async function getRelatedJobs(
  jobId: string,
  limit: number = 5
): Promise<JobWithCompany[]> {
  // 首先获取当前职位信息
  const currentJob = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  })

  if (!currentJob) {
    return []
  }

  // 查找相关职位：同行业或同公司，排除当前职位
  const jobs = await prisma.job.findMany({
    where: {
      id: {
        not: jobId,
      },
      status: 'ACTIVE',
      OR: [
        {
          industry: currentJob.industry,
        },
        {
          companyId: currentJob.companyId,
        },
      ],
    },
    include: {
      company: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  })

  return jobs as unknown as JobWithCompany[]
}

// ==================== 公司相关 ====================

export interface GetCompaniesParams {
  industry?: string
  page?: number
  limit?: number
}

/**
 * 获取公司列表
 * @param params 筛选参数
 * @returns 公司列表（包含在招职位数）
 */
export async function getCompanies(
  params: GetCompaniesParams = {}
): Promise<CompanyWithJobCount[]> {
  const { industry, page = 1, limit = 10 } = params
  const skip = (page - 1) * limit

  const where: any = {}

  if (industry) {
    where.industry = industry
  }

  const companies = await prisma.company.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    skip,
    take: limit,
    include: {
      _count: {
        select: {
          jobs: {
            where: {
              status: 'ACTIVE',
            },
          },
        },
      },
    },
  })

  // 使用 _count 聚合，避免 N+1 查询
  const companiesWithJobCount = companies.map((company) => ({
    ...company,
    jobCount: company._count.jobs,
  }))

  return companiesWithJobCount as CompanyWithJobCount[]
}

/**
 * 根据slug获取公司详情
 * @param slug 公司slug
 * @returns 公司详情（包含所有在招职位）
 */
export async function getCompanyBySlug(slug: string): Promise<CompanyWithJobs | null> {
  const company = await prisma.company.findUnique({
    where: {
      slug,
    },
  })

  if (!company) {
    return null
  }

  const jobs = await prisma.job.findMany({
    where: {
      companyId: company.id,
      status: 'ACTIVE',
    },
    orderBy: {
      publishedAt: 'desc',
    },
  })

  return {
    ...company,
    jobs,
  } as unknown as CompanyWithJobs
}

/**
 * 根据行业获取公司列表
 * @param industry 行业名称
 * @returns 公司列表
 */
export async function getCompaniesByIndustry(industry: string): Promise<Company[]> {
  const companies = await prisma.company.findMany({
    where: {
      industry,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return companies as Company[]
}

// ==================== 统计相关 ====================

/**
 * 获取统计数据
 * @returns 职位总数和公司总数
 */
export async function getStats(): Promise<{ jobs: number; companies: number }> {
  const [jobs, companies] = await Promise.all([
    prisma.job.count({
      where: {
        status: 'ACTIVE',
      },
    }),
    prisma.company.count(),
  ])

  return { jobs, companies }
}
