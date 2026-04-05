import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'
import { JobStatus, RemoteType, JobType, JobLevel } from '@prisma/client'

export const dynamic = 'force-dynamic'

// 搜索参数接口
export interface JobSearchParams {
  keyword?: string
  industry?: string
  type?: JobType
  level?: JobLevel
  remote?: RemoteType
  location?: string
  salaryMin?: number
  salaryMax?: number
  tags?: string[]
  skills?: string[]
  postedWithin?: number // days
  sortBy?: 'newest' | 'salary_high' | 'salary_low' | 'most_applied' | 'relevance'
  page?: number
  limit?: number
}

// 搜索结果接口
export interface JobSearchResult {
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
  _score?: number // 搜索相关度分数
  _highlight?: {
    title?: string
    description?: string
    companyName?: string
  }
}

export interface JobSearchResponse {
  jobs: JobSearchResult[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
  facets: {
    industries: { value: string; count: number }[]
    types: { value: JobType; count: number }[]
    levels: { value: JobLevel; count: number }[]
    remoteTypes: { value: RemoteType; count: number }[]
    locations: { value: string; count: number }[]
    salaryRanges: { min: number; max: number; label: string; count: number }[]
  }
  searchMeta: {
    keyword?: string
    appliedFilters: string[]
    sortBy: string
    responseTime: number
  }
}

// 构建搜索查询
function buildSearchWhereClause(params: JobSearchParams) {
  const where: any = {
    status: JobStatus.ACTIVE,
    publishedAt: { not: null },
  }

  // 全文搜索（标题、描述、公司名）
  if (params.keyword) {
    const keyword = params.keyword.trim()
    where.OR = [
      { title: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
      { requirements: { contains: keyword, mode: 'insensitive' } },
      { responsibilities: { contains: keyword, mode: 'insensitive' } },
      { company: { name: { contains: keyword, mode: 'insensitive' } } },
      { tags: { hasSome: [keyword] } },
      { skills: { hasSome: [keyword] } },
    ]
  }

  // 行业筛选
  if (params.industry) {
    where.industry = params.industry
  }

  // 工作类型筛选
  if (params.type) {
    where.type = params.type
  }

  // 经验级别筛选
  if (params.level) {
    where.level = params.level
  }

  // 远程类型筛选
  if (params.remote) {
    where.remote = params.remote
  }

  // 地点筛选
  if (params.location) {
    where.location = { contains: params.location, mode: 'insensitive' }
  }

  // 薪资范围筛选
  if (params.salaryMin !== undefined || params.salaryMax !== undefined) {
    where.AND = where.AND || []
    
    if (params.salaryMin !== undefined && params.salaryMax !== undefined) {
      // 职位薪资范围与搜索范围有交集
      where.AND.push({
        OR: [
          { salaryNegotiable: true },
          {
            AND: [
              { salaryMax: { gte: params.salaryMin } },
              { salaryMin: { lte: params.salaryMax } },
            ],
          },
        ],
      })
    } else if (params.salaryMin !== undefined) {
      where.AND.push({
        OR: [
          { salaryNegotiable: true },
          { salaryMax: { gte: params.salaryMin } },
        ],
      })
    } else if (params.salaryMax !== undefined) {
      where.AND.push({
        OR: [
          { salaryNegotiable: true },
          { salaryMin: { lte: params.salaryMax } },
        ],
      })
    }
  }

  // 技能标签筛选
  if (params.skills && params.skills.length > 0) {
    where.skills = { hasEvery: params.skills }
  }

  // 发布时间筛选
  if (params.postedWithin) {
    const daysAgo = new Date()
    daysAgo.setDate(daysAgo.getDate() - params.postedWithin)
    where.publishedAt = { gte: daysAgo }
  }

  return where
}

// 构建排序条件
function buildOrderBy(params: JobSearchParams) {
  switch (params.sortBy) {
    case 'salary_high':
      return [{ salaryMax: 'desc' as const }, { salaryMin: 'desc' as const }]
    case 'salary_low':
      return [{ salaryMin: 'asc' as const }, { salaryMax: 'asc' as const }]
    case 'most_applied':
      return [{ applyCount: 'desc' as const }]
    case 'relevance':
      // 相关度排序：关键词匹配度 +  Featured/Urgent 加权
      return [
        { isFeatured: 'desc' as const },
        { isUrgent: 'desc' as const },
        { publishedAt: 'desc' as const },
      ]
    case 'newest':
    default:
      return [{ publishedAt: 'desc' as const }]
  }
}

// 获取搜索结果的面板数据（带缓存）
const getCachedFacets = unstable_cache(
  async () => {
    const where = { status: JobStatus.ACTIVE, publishedAt: { not: null } }
    
    const [
      industries,
      types,
      levels,
      remoteTypes,
      locations,
      salaryStats,
    ] = await Promise.all([
      prisma.job.groupBy({
        by: ['industry'],
        where,
        _count: { industry: true },
        orderBy: { _count: { industry: 'desc' } },
        take: 10,
      }),
      prisma.job.groupBy({
        by: ['type'],
        where,
        _count: { type: true },
        orderBy: { _count: { type: 'desc' } },
      }),
      prisma.job.groupBy({
        by: ['level'],
        where,
        _count: { level: true },
        orderBy: { _count: { level: 'desc' } },
      }),
      prisma.job.groupBy({
        by: ['remote'],
        where,
        _count: { remote: true },
        orderBy: { _count: { remote: 'desc' } },
      }),
      prisma.job.groupBy({
        by: ['location'],
        where,
        _count: { location: true },
        orderBy: { _count: { location: 'desc' } },
        take: 15,
      }),
      prisma.job.aggregate({
        where,
        _min: { salaryMin: true },
        _max: { salaryMax: true },
        _avg: { salaryMax: true },
      }),
    ])

    return {
      industries: industries.map((i) => ({ value: i.industry, count: i._count.industry })),
      types: types.map((t) => ({ value: t.type, count: t._count.type })),
      levels: levels.map((l) => ({ value: l.level, count: l._count.level })),
      remoteTypes: remoteTypes.map((r) => ({ value: r.remote, count: r._count.remote })),
      locations: locations.map((l) => ({ value: l.location, count: l._count.location })),
      salaryRanges: [
        { min: 0, max: 10000, label: '10K以下', count: 0 },
        { min: 10000, max: 20000, label: '10K-20K', count: 0 },
        { min: 20000, max: 35000, label: '20K-35K', count: 0 },
        { min: 35000, max: 50000, label: '35K-50K', count: 0 },
        { min: 50000, max: 80000, label: '50K-80K', count: 0 },
        { min: 80000, max: 1000000, label: '80K以上', count: 0 },
      ],
    }
  },
  ['job-facets'],
  { revalidate: 300, tags: ['jobs', 'facets'] } // 5分钟缓存
)

// 高亮匹配的关键词（安全版本）
function highlightText(text: string, keyword?: string): string | undefined {
  if (!keyword || !text) return undefined  // 不高亮时返回undefined，让前端使用原始文本
  const escapedText = escapeHtml(text)
  const escapedKeyword = escapeRegExp(keyword)
  const regex = new RegExp(`(${escapedKeyword})`, 'gi')
  return escapedText.replace(regex, '<mark>$1</mark>')
}

// 转义HTML特殊字符
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// 转义正则表达式特殊字符
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    const { searchParams } = new URL(request.url)
    
    // 解析搜索参数
    const params: JobSearchParams = {
      keyword: searchParams.get('keyword') || undefined,
      industry: searchParams.get('industry') || undefined,
      type: searchParams.get('type') as JobType || undefined,
      level: searchParams.get('level') as JobLevel || undefined,
      remote: searchParams.get('remote') as RemoteType || undefined,
      location: searchParams.get('location') || undefined,
      salaryMin: searchParams.has('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined,
      salaryMax: searchParams.has('salaryMax') ? parseInt(searchParams.get('salaryMax')!) : undefined,
      skills: searchParams.get('skills')?.split(',').filter(Boolean),
      postedWithin: searchParams.has('postedWithin') ? parseInt(searchParams.get('postedWithin')!) : undefined,
      sortBy: (searchParams.get('sortBy') as JobSearchParams['sortBy']) || 'newest',
      page: parseInt(searchParams.get('page') || '1'),
      limit: Math.min(parseInt(searchParams.get('limit') || '20'), 50), // 最大50条
    }

    const where = buildSearchWhereClause(params)
    const orderBy = buildOrderBy(params)
    const skip = (params.page! - 1) * params.limit!

    // 并行执行查询
    const [jobs, total, facets] = await Promise.all([
      prisma.job.findMany({
        where,
        orderBy,
        skip,
        take: params.limit,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              slug: true,
              logo: true,
              industry: true,
            },
          },
        },
      }),
      prisma.job.count({ where }),
      getCachedFacets(),
    ])

    // 格式化结果
    const formattedJobs: JobSearchResult[] = jobs.map((job) => ({
      ...job,
      _highlight: params.keyword
        ? {
            title: highlightText(job.title, params.keyword),
            description: highlightText(job.description.substring(0, 200), params.keyword),
            companyName: highlightText(job.company.name, params.keyword),
          }
        : undefined,
    }))

    // 构建响应
    const response: JobSearchResponse = {
      jobs: formattedJobs,
      pagination: {
        page: params.page!,
        limit: params.limit!,
        total,
        totalPages: Math.ceil(total / params.limit!),
        hasMore: skip + jobs.length < total,
      },
      facets,
      searchMeta: {
        keyword: params.keyword,
        appliedFilters: Object.entries(params)
          .filter(([key, value]) => 
            value !== undefined && 
            key !== 'page' && 
            key !== 'limit' && 
            key !== 'sortBy' &&
            key !== 'keyword'
          )
          .map(([key, value]) => `${key}:${value}`),
        sortBy: params.sortBy || 'newest',
        responseTime: Date.now() - startTime,
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Job search error:', error)
    return NextResponse.json(
      { error: '搜索失败，请稍后重试', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// 获取搜索建议
export async function POST(request: NextRequest) {
  try {
    const { type, query } = await request.json()

    if (type === 'suggestions') {
      // 职位标题建议
      const titleSuggestions = await prisma.job.findMany({
        where: {
          status: JobStatus.ACTIVE,
          title: { contains: query, mode: 'insensitive' },
        },
        select: { title: true },
        distinct: ['title'],
        take: 5,
      })

      // 公司名建议
      const companySuggestions = await prisma.company.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
        },
        select: { name: true, slug: true },
        take: 5,
      })

      // 热门技能建议
      const skillSuggestions = await prisma.job.findMany({
        where: {
          status: JobStatus.ACTIVE,
          skills: { hasSome: [query] },
        },
        select: { skills: true },
        take: 10,
      })

      const allSkills = skillSuggestions.flatMap((j) => j.skills)
      const uniqueSkills = [...new Set(allSkills)]
        .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 5)

      return NextResponse.json({
        titles: titleSuggestions.map((t) => t.title),
        companies: companySuggestions.map((c) => ({ name: c.name, slug: c.slug })),
        skills: uniqueSkills,
      })
    }

    if (type === 'hot_keywords') {
      // 获取热门搜索关键词（基于实际职位数据）
      const hotTitles = await prisma.job.groupBy({
        by: ['title'],
        where: { status: JobStatus.ACTIVE },
        _count: { title: true },
        orderBy: { _count: { title: 'desc' } },
        take: 10,
      })

      const hotSkills = await prisma.job.findMany({
        where: { status: JobStatus.ACTIVE },
        select: { skills: true },
        take: 100,
      })

      const skillCounts: Record<string, number> = {}
      hotSkills.forEach((job) => {
        job.skills.forEach((skill) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1
        })
      })

      const topSkills = Object.entries(skillCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([skill]) => skill)

      return NextResponse.json({
        keywords: [
          '前端开发',
          '后端开发',
          '产品经理',
          'UI设计师',
          '数据分析师',
          'Java',
          'Python',
          'React',
          'Node.js',
          '区块链',
        ],
        titles: hotTitles.map((t) => t.title),
        skills: topSkills,
      })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Search suggestions error:', error)
    return NextResponse.json(
      { error: '获取建议失败' },
      { status: 500 }
    )
  }
}
