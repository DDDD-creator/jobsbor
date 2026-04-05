import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JobCard } from '@/components/jobs/JobCard'
import { JobActions } from '@/components/jobs/job-actions'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { JobPostingSchema } from '@/components/seo/job-posting-schema'
import { EmailSubscribe } from '@/components/subscribe/email-subscribe'
import { ApplyButton } from '@/components/applications/apply-button'
import { MapPin, Briefcase, Clock, DollarSign, Building2, ArrowLeft, Send, MessageCircle, ArrowRight } from 'lucide-react'
import type { Job, Company } from '@/types'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { loadTranslations } from '@/i18n/loader'
import type { Locale } from '@/i18n/config'
import { generateJobSEO } from '@/lib/seo'
// 导入完整职位数据
import { jobs as seedJobs } from '@/data/jobs'
import { realJobs, type RealJob } from '@/data/real-jobs'
import { crawledJobs } from '@/data/crawled-jobs'

// 职位类型包含公司信息
interface JobWithCompany extends Job {
  company?: Company
}

// 模拟职位数据
const mockJobs: JobWithCompany[] = [
  {
    id: '1',
    title: '量化研究员',
    slug: 'quantitative-researcher',
    companyId: '1',
    company: {
      id: '1',
      name: '华泰证券',
      slug: 'huatai',
      industry: 'finance',
      description: '华泰证券股份有限公司是一家领先的科技驱动型综合证券集团，总部位于南京，综合实力位居国内证券业第一方阵。',
      website: 'https://www.htsc.com.cn',
      location: '上海',
      createdAt: new Date()
    },
    description: `岗位职责：
1. 负责量化策略的研究与开发，包括选股、择时、套利等策略
2. 利用机器学习、深度学习等技术进行因子挖掘和模型优化
3. 参与量化交易系统的设计与实现
4. 跟踪市场动态，持续优化策略表现

我们提供：
- 行业领先的薪酬待遇
- 完善的培训体系和晋升通道
- 先进的量化研究平台和数据资源
- 与顶尖人才共事的机会`,
    requirements: `任职要求：
1. 硕士及以上学历，金融工程、数学、统计、物理、计算机等相关专业
2. 熟练掌握Python，熟悉C++者优先
3. 扎实的数理基础，熟悉机器学习算法
4. 对金融市场有深刻理解，有量化研究经验者优先
5. 良好的沟通能力和团队合作精神`,
    salaryMin: 30000,
    salaryMax: 50000,
    salaryCurrency: 'CNY',
    location: '上海',
    type: 'full-time',
    industry: 'finance',
    category: 'finance',
    tags: ['量化', 'Python', '金融工程'],
    isActive: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Web3产品经理',
    slug: 'web3-product-manager',
    companyId: '2',
    company: {
      id: '2',
      name: 'MetaVerse Labs',
      slug: 'metaverse',
      industry: 'web3',
      description: 'MetaVerse Labs是领先的Web3创新实验室，专注于构建下一代去中心化应用。',
      website: 'https://metaverse.labs',
      location: '北京',
      createdAt: new Date()
    },
    description: '负责Web3产品的规划和设计',
    requirements: '3年以上产品经理经验，熟悉Web3生态',
    salaryMin: 25000,
    salaryMax: 40000,
    salaryCurrency: 'CNY',
    location: '北京',
    type: 'full-time',
    industry: 'web3',
    category: 'product',
    tags: ['Web3', 'DeFi', 'NFT'],
    isActive: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: '高级前端工程师',
    slug: 'senior-frontend-engineer',
    companyId: '3',
    company: {
      id: '3',
      name: '字节跳动',
      slug: 'bytedance',
      industry: 'internet',
      description: '字节跳动是全球化的内容平台，旗下拥有抖音、今日头条等产品。',
      website: 'https://www.bytedance.com',
      location: '深圳',
      createdAt: new Date()
    },
    description: '负责前端架构设计',
    requirements: '5年以上前端开发经验',
    salaryMin: 35000,
    salaryMax: 60000,
    salaryCurrency: 'CNY',
    location: '深圳',
    type: 'full-time',
    industry: 'internet',
    category: 'engineer',
    tags: ['React', 'TypeScript', 'Node.js'],
    isActive: true,
    publishedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

// 生成页面元数据
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;

  let job: JobWithCompany | null = null
  // Skip DB - use static data only (prevents Vercel serverless timeout)
  // Database queries will fail on Vercel serverless, so we use fallback data only

  // 如果数据库找不到，尝试其他数据源（用于SEO预渲染）
  if (!job) {
    const mockJob = mockJobs.find((j) => j.slug === slug)
    if (mockJob) job = mockJob as JobWithCompany
  }

  if (!job) {
    const seedJob = seedJobs.find((j) => j.slug === slug)
    if (seedJob) {
      job = {
        id: seedJob.id,
        title: seedJob.title,
        slug: seedJob.slug,
        companyId: seedJob.companySlug,
        company: {
          id: seedJob.companySlug,
          name: seedJob.company,
          slug: seedJob.companySlug,
          industry: seedJob.industry,
          description: '',
          location: seedJob.location,
          website: seedJob.companyWebsite,
          createdAt: new Date(seedJob.publishedAt),
        },
        description: seedJob.description,
        requirements: seedJob.requirements,
        salaryMin: seedJob.salaryMin,
        salaryMax: seedJob.salaryMax,
        salaryCurrency: 'CNY',
        location: seedJob.location,
        type: seedJob.type,
        industry: seedJob.industry,
        category: seedJob.category,
        tags: seedJob.tags,
        isActive: true,
        publishedAt: new Date(seedJob.publishedAt),
        createdAt: new Date(seedJob.publishedAt),
        updatedAt: new Date(seedJob.publishedAt),
        applyUrl: seedJob.applyUrl,
      } as JobWithCompany
    }
  }

  if (!job) {
    const realJobIndex = realJobs.findIndex((j, index) => {
      const expectedSlug = `${j.company.toLowerCase().replace(/\s+/g, '-')}-${j.title.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}-${index}`
      return expectedSlug === slug
    })
    if (realJobIndex !== -1) {
      const j = realJobs[realJobIndex]
      job = {
        id: j.id,
        title: j.title,
        slug: slug,
        companyId: j.company.toLowerCase().replace(/\s+/g, '-'),
        company: {
          id: j.company.toLowerCase().replace(/\s+/g, '-'),
          name: j.company,
          slug: j.company.toLowerCase().replace(/\s+/g, '-'),
          industry: j.remote ? 'web3' : 'internet',
          description: '',
          location: j.location,
          createdAt: new Date(j.postedAt),
        },
        description: j.description,
        requirements: j.requirements?.join('\n') || '',
        salaryMin: 0,
        salaryMax: 0,
        salaryCurrency: 'CNY',
        location: j.location,
        type: j.remote ? 'remote' : 'full-time',
        industry: j.remote ? 'web3' : 'internet',
        category: 'engineer',
        tags: j.requirements || ['Remote', j.source],
        isActive: true,
        publishedAt: new Date(j.postedAt),
        createdAt: new Date(j.postedAt),
        updatedAt: new Date(j.postedAt),
      } as JobWithCompany
    }
  }

  if (!job) {
    const crawledJobIndex = crawledJobs.findIndex((j, index) => {
      const expectedSlug = `${j.companySlug}-${j.title.toLowerCase().replace(/\s+/g, '-')}-${index}`
      return expectedSlug === slug
    })
    if (crawledJobIndex !== -1) {
      const j = crawledJobs[crawledJobIndex]
      job = {
        id: j.id,
        title: j.title,
        slug: slug,
        companyId: j.companySlug,
        company: {
          id: j.companySlug,
          name: j.company,
          slug: j.companySlug,
          industry: j.industry,
          description: '',
          location: j.location,
          createdAt: new Date(j.publishedAt),
        },
        description: j.description,
        requirements: j.requirements,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        salaryCurrency: 'CNY',
        location: j.location,
        type: j.type,
        industry: j.industry,
        category: j.category,
        tags: j.tags,
        isActive: true,
        publishedAt: new Date(j.publishedAt),
        createdAt: new Date(j.publishedAt),
        updatedAt: new Date(j.publishedAt),
      } as JobWithCompany
    }
  }

  if (!job) {
    return {
      title: lang === 'zh' ? '404 - 职位不存在 | Jobsbor' : '404 - Job Not Found | Jobsbor',
    }
  }

  const formatSalary = (min?: number | null, max?: number | null, currency: string = 'CNY') => {
    if (!min && !max) return '薪资面议'
    const symbol = currency === 'CNY' ? '¥' : currency
    if (min && max) {
      return `${symbol}${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K`
    }
    if (min) return `${symbol}${(min / 1000).toFixed(0)}K+`
    if (max) return `最高${symbol}${(max / 1000).toFixed(0)}K`
    return '薪资面议'
  }

  return generateJobSEO({
    title: job.title,
    description: job.description || '',
    company: job.company?.name || '',
    location: job.location,
    salary: formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency),
    slug: job.slug,
    publishedAt: job.publishedAt.toISOString(),
    industry: job.industry,
  })
}

// Dynamic rendering - no static pre-generation (prevents Vercel build timeout)
export const dynamic = 'force-dynamic'
export const dynamicParams = true

/**
 * 职位详情页
 * 职位详情页
 * - 面包屑导航
 * - 职位标题 + 公司名
 * - 薪资、地点、类型等元信息
 * - 职位描述和岗位要求
 * - 申请按钮
 * - 公司信息卡片
 * - 相关推荐职位
 * - TG频道引流
 */
export default async function JobDetailPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
  const { lang, slug } = await params;

  // 加载翻译
  const t = await loadTranslations(lang);

  let job: JobWithCompany | null = null
  // Skip DB - use static data only (prevents Vercel serverless timeout)

  // 1. 先尝试从mockJobs查找（模拟数据）
  if (!job) {
    const mockJob = mockJobs.find((j) => j.slug === slug)
    if (mockJob) job = mockJob
  }

  // 2. 尝试从seedJobs查找
  if (!job) {
    const jobData = seedJobs.find((j) => j.slug === slug)
    if (jobData) {
      job = {
        ...jobData,
        id: jobData.id,
        companyId: jobData.companySlug,
        company: {
          id: jobData.companySlug,
          name: jobData.company,
          slug: jobData.companySlug,
          industry: jobData.industry,
          description: '',
          location: jobData.location,
          website: jobData.companyWebsite,
          createdAt: new Date(jobData.publishedAt),
        },
        salaryCurrency: 'CNY',
        isActive: true,
        publishedAt: new Date(jobData.publishedAt),
        createdAt: new Date(jobData.publishedAt),
        updatedAt: new Date(jobData.publishedAt),
        applyUrl: jobData.applyUrl,
      } as JobWithCompany
    }
  }

  // 如果在seedJobs中也找不到，尝试从realJobs查找（485个真实职位）
  if (!job) {
    const realJobIndex = realJobs.findIndex((j, index) => {
      const expectedSlug = `${j.company.toLowerCase().replace(/\s+/g, '-')}-${j.title.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}-${index}`
      return expectedSlug === slug
    })

    if (realJobIndex !== -1) {
      const j = realJobs[realJobIndex]
      job = {
        id: j.id,
        title: j.title,
        slug: slug,
        companyId: j.company.toLowerCase().replace(/\s+/g, '-'),
        company: {
          id: j.company.toLowerCase().replace(/\s+/g, '-'),
          name: j.company,
          slug: j.company.toLowerCase().replace(/\s+/g, '-'),
          industry: j.remote ? 'web3' : 'internet' as 'finance' | 'web3' | 'internet',
          description: '',
          location: j.location,
          createdAt: new Date(j.postedAt),
        },
        description: j.description,
        requirements: j.requirements?.join('\n') || '详见职位链接',
        salaryMin: 0,
        salaryMax: 0,
        salaryCurrency: 'CNY' as const,
        location: j.location,
        type: j.remote ? 'remote' as const : 'full-time' as const,
        industry: j.remote ? 'web3' as const : 'internet' as const,
        category: 'engineer' as const,
        tags: j.requirements && j.requirements.length > 0 ? j.requirements : ['Remote', j.source],
        isActive: true,
        publishedAt: new Date(j.postedAt),
        createdAt: new Date(j.postedAt),
        updatedAt: new Date(j.postedAt),
      } as JobWithCompany
    }
  }

  // 如果在realJobs中也找不到，尝试从crawledJobs查找
  if (!job) {
    const crawledJobIndex = crawledJobs.findIndex((j, index) => {
      const expectedSlug = `${j.companySlug}-${j.title.toLowerCase().replace(/\s+/g, '-')}-${index}`
      return expectedSlug === slug
    })

    if (crawledJobIndex !== -1) {
      const j = crawledJobs[crawledJobIndex]
      job = {
        id: j.id,
        title: j.title,
        slug: slug,
        companyId: j.companySlug,
        company: {
          id: j.companySlug,
          name: j.company,
          slug: j.companySlug,
          industry: j.industry,
          description: '',
          location: j.location,
          createdAt: new Date(j.publishedAt),
        },
        description: j.description,
        requirements: j.requirements,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        salaryCurrency: 'CNY' as const,
        location: j.location,
        type: j.type,
        industry: j.industry,
        category: j.category,
        tags: j.tags,
        isActive: true,
        publishedAt: new Date(j.publishedAt),
        createdAt: new Date(j.publishedAt),
        updatedAt: new Date(j.publishedAt),
      } as JobWithCompany
    }
  }

  if (!job) {
    notFound()
  }

  // 获取相关推荐职位（同行业其他职位）
  const relatedJobs = mockJobs
    .filter((j) => j.industry === job!.industry && j.id !== job!.id)
    .slice(0, 3)

  // 获取同公司其他职位
  const sameCompanyJobs = mockJobs
    .filter((j) => j.companyId === job!.companyId && j.id !== job!.id)
    .slice(0, 2)

  // 格式化薪资
  const formatSalary = (min?: number | null, max?: number | null, currency: string = 'CNY') => {
    if (!min && !max) return t.jobDetail.negotiable
    const symbol = currency === 'CNY' ? '¥' : '$'
    if (min && max) {
      return `${symbol}${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K`
    }
    if (min) return `${symbol}${(min / 1000).toFixed(0)}K+`
    if (max) return `${t.common.more}${symbol}${(max / 1000).toFixed(0)}K`
    return t.jobDetail.negotiable
  }

  // 格式化工作类型
  const formatJobType = (type: string) => {
    const typeMap: Record<string, string> = {
      'full-time': t.jobs.fullTime,
      'part-time': t.jobs.partTime,
      'contract': t.jobs.contract,
      'remote': t.jobs.remote,
    }
    return typeMap[type] || type
  }

  // 格式化行业
  const formatIndustry = (industry: string) => {
    const industryMap: Record<string, string> = {
      'finance': t.jobList.finance,
      'web3': t.jobList.web3,
      'internet': t.jobList.internet,
    }
    return industryMap[industry] || industry
  }

  // 构建面包屑数据
  const breadcrumbItems = [
    { label: t.nav.jobs, href: '/jobs' },
    { label: formatIndustry(job.industry), href: `/industries/${job.industry}` },
    { label: job.title },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <JobPostingSchema job={job} lang={lang} />
      <Header />

      <main className="flex-1">
        {/* 面包屑导航 */}
        <div className="bg-dark-500/80 border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>

        {/* 返回导航 */}
        <div className="bg-dark-500/80 border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <LocalizedLink
              href="/jobs"
              className="inline-flex items-center text-sm text-gray-400 hover:text-neon-cyan transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t.jobDetail.backToJobs}
            </LocalizedLink>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* 左侧主要内容 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 职位标题卡片 */}
              <Card>
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                      <LocalizedLink
                        href={`/companies/${job.company?.slug}`}
                        className="mt-2 inline-flex items-center text-lg text-gray-400 hover:text-neon-cyan"
                      >
                        <Building2 className="mr-1 h-5 w-5" />
                        {job.company?.name}
                      </LocalizedLink>
                    </div>
                    <div className="flex gap-2">
                      <JobActions
                        jobId={job.id}
                        jobTitle={job.title}
                        companyName={job.company?.name || ''}
                      />
                    </div>
                  </div>

                  {/* 元信息标签 */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Badge variant="accent" className="text-base px-3 py-1">
                      {formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {formatJobType(job.type)}
                    </Badge>
                    <Badge variant="primary" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatIndustry(job.industry)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* 技能标签 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">{t.jobDetail.skills}</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.tags.map((tag) => (
                        <LocalizedLink key={tag} href={`/jobs?keyword=${encodeURIComponent(tag)}`}>
                          <Badge variant="default" className="cursor-pointer hover:bg-neon-cyan/20 transition-colors">{tag}</Badge>
                        </LocalizedLink>
                      ))}
                    </div>
                  </div>

                  {/* 职位描述 */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">{t.jobDetail.description}</h3>
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
                      {job.description}
                    </div>
                  </div>

                  {/* 岗位要求 */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">{t.jobDetail.requirements}</h3>
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-line">
                      {job.requirements}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 相关推荐职位 */}
              {relatedJobs.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-white mb-4">{t.jobDetail.relatedJobs}</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {relatedJobs.map((relatedJob) => (
                      <JobCard key={relatedJob.id} job={relatedJob} />
                    ))}
                  </div>
                </div>
              )}

              {/* 同公司其他职位 */}
              {sameCompanyJobs.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-xl font-bold text-white mb-4">{t.jobDetail.sameCompanyJobs}</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {sameCompanyJobs.map((companyJob) => (
                      <JobCard key={companyJob.id} job={companyJob} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 右侧边栏 */}
            <div className="space-y-6">
              {/* 申请按钮卡片 */}
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  {job.applyUrl ? (
                    <ApplyButton
                      jobId={job.slug}
                      jobTitle={job.title}
                      company={job.company?.name || ''}
                      location={job.location}
                      salary={formatSalary(job.salaryMin, job.salaryMax)}
                      applyUrl={job.applyUrl || job.company?.website || undefined}
                      className="mt-4"
                    />
                  ) : job.company?.website ? (
                    <ApplyButton
                      jobId={job.slug}
                      jobTitle={job.title}
                      company={job.company?.name || ''}
                      location={job.location}
                      salary={formatSalary(job.salaryMin, job.salaryMax)}
                      applyUrl={job.company?.website}
                      className="mt-4"
                    />
                  ) : (
                    <ApplyButton
                      jobId={job.slug}
                      jobTitle={job.title}
                      company={job.company?.name || ''}
                      location={job.location}
                      salary={formatSalary(job.salaryMin, job.salaryMax)}
                      applyUrl={`mailto:support@jobsbor.com?subject=申请职位：${encodeURIComponent(job.title)} - ${encodeURIComponent(job.company?.name || '')}`}
                      className="mt-4"
                    />
                  )}
                  <p className="mt-3 text-center text-sm text-gray-400">
                    {job.applyUrl
                      ? t.jobDetail.applyDesc
                      : job.company?.website
                        ? t.jobDetail.applyRedirectDesc
                        : t.jobDetail.applyEmailDesc}
                  </p>
                </CardContent>
              </Card>

              {/* Telegram频道卡片 - 引流 */}
              <Card className="border-[#0088cc]/30 bg-gradient-to-br from-[#0088cc]/5 to-transparent">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#0088cc]/20 flex items-center justify-center">
                      <Send className="h-5 w-5 text-[#0088cc]" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{t.jobDetail.telegramTitle}</p>
                      <p className="text-xs text-gray-400">{t.jobDetail.telegramSubtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-4">
                    {t.jobDetail.telegramDesc}
                  </p>
                  <a
                    href="https://t.me/Web3Kairo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-lg bg-[#0088cc]/10 border border-[#0088cc]/30 text-[#0088cc] hover:bg-[#0088cc]/20 transition-all group text-sm font-medium"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>@Web3Kairo</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </CardContent>
              </Card>

              {/* 邮件订阅卡片 */}
              <EmailSubscribe />

              {/* 公司信息卡片 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t.jobDetail.companyInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-cyan flex items-center justify-center text-white font-bold">
                      {job.company?.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{job.company?.name}</p>
                      <p className="text-sm text-gray-400">{formatIndustry(job.company?.industry || '')}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300">
                    {job.company?.description}
                  </p>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center text-sm text-gray-300">
                      <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                      {job.company?.location}
                    </div>
                    {job.company?.website && (
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-neon-cyan hover:text-neon-cyan/80"
                      >
                        <DollarSign className="mr-2 h-4 w-4" />
                        {t.jobDetail.visitWebsite}
                      </a>
                    )}
                  </div>

                  <LocalizedLink href={`/companies/${job.company?.slug}`}>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      {t.jobDetail.viewCompany}
                    </Button>
                  </LocalizedLink>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
