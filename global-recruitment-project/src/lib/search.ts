import { prisma } from './db'
import type { JobWithCompany } from './data'

/**
 * 搜索职位
 * 支持全文搜索：搜索title、description、tags、company.name字段
 * @param query 搜索关键词
 * @returns 匹配的职位列表（包含公司信息）
 */
export async function searchJobs(query: string): Promise<JobWithCompany[]> {
  if (!query || query.trim().length === 0) {
    return []
  }

  const searchTerm = query.trim()

  const jobs = await prisma.job.findMany({
    where: {
      status: 'ACTIVE',
      OR: [
        // 搜索职位标题
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        // 搜索职位描述
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        },
        // 搜索标签数组
        {
          tags: {
            has: searchTerm,
          },
        },
        // 搜索公司名称
        {
          company: {
            name: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
    },
    include: {
      company: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 50, // 搜索结果限制50条
  })

  return jobs as unknown as JobWithCompany[]
}

/**
 * 高级搜索职位
 * 支持更多筛选条件的组合搜索
 * @param query 搜索关键词
 * @param filters 筛选条件
 * @returns 匹配的职位列表
 */
export async function advancedSearchJobs(
  query: string,
  filters: {
    industry?: string
    type?: string
    location?: string
    minSalary?: number
    maxSalary?: number
  } = {}
): Promise<JobWithCompany[]> {
  const { industry, type, location, minSalary, maxSalary } = filters

  const where: any = {
    status: 'ACTIVE',
  }

  // 关键词搜索
  if (query && query.trim().length > 0) {
    where.OR = [
      {
        title: {
          contains: query.trim(),
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: query.trim(),
          mode: 'insensitive',
        },
      },
      {
        tags: {
          has: query.trim(),
        },
      },
      {
        company: {
          name: {
            contains: query.trim(),
            mode: 'insensitive',
          },
        },
      },
    ]
  }

  // 行业筛选
  if (industry) {
    where.industry = industry
  }

  // 工作类型筛选
  if (type) {
    where.type = type
  }

  // 地点筛选
  if (location) {
    where.location = {
      contains: location,
      mode: 'insensitive',
    }
  }

  // 薪资范围筛选
  if (minSalary !== undefined || maxSalary !== undefined) {
    where.AND = []
    
    if (minSalary !== undefined) {
      where.AND.push({
        OR: [
          { salaryMin: { gte: minSalary } },
          { salaryMax: { gte: minSalary } },
        ],
      })
    }
    
    if (maxSalary !== undefined) {
      where.AND.push({
        OR: [
          { salaryMin: { lte: maxSalary } },
          { salaryMax: { lte: maxSalary } },
        ],
      })
    }
  }

  const jobs = await prisma.job.findMany({
    where,
    include: {
      company: true,
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: 50,
  })

  return jobs as unknown as JobWithCompany[]
}
