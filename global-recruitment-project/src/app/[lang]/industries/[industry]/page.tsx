import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JobList } from '@/components/jobs/JobList'
import { Button } from '@/components/ui/button'
import { TrendingUp, Globe, Briefcase } from 'lucide-react'
import type { Job, Company } from '@/types'

// 导入真实职位数据
import { jobs as seedJobs } from '@/data/jobs'
import { realJobs } from '@/data/real-jobs'
import { crawledJobs } from '@/data/crawled-jobs'

// 行业配置
const industryConfig: Record<string, {
  title: string
  description: string
  metaTitle: string
  metaDescription: string
  icon: typeof TrendingUp
  color: string
}> = {
  finance: {
    title: '金融招聘',
    description: '汇聚顶级金融机构职位，涵盖券商、基金、投行、保险等领域',
    metaTitle: '金融行业招聘 | 高薪职位等你来',
    metaDescription: '专业的金融行业招聘平台，汇聚华泰证券、中金公司、蚂蚁金服等顶级机构高薪职位，精准匹配金融人才需求。',
    icon: TrendingUp,
    color: 'from-blue-500 to-blue-600',
  },
  web3: {
    title: 'Web3招聘',
    description: '前沿Web3领域职位，区块链、DeFi、NFT、元宇宙等热门方向',
    metaTitle: 'Web3招聘 | 区块链职位专场',
    metaDescription: '专注Web3行业招聘，覆盖区块链、DeFi、NFT、智能合约等热门领域，连接优质项目与顶尖人才。',
    icon: Globe,
    color: 'from-purple-500 to-purple-600',
  },
  internet: {
    title: '互联网招聘',
    description: '互联网大厂、独角兽企业高薪职位，技术、产品、运营全覆盖',
    metaTitle: '互联网招聘 | 大厂高薪职位',
    metaDescription: '互联网招聘专场，汇聚字节跳动、腾讯、阿里巴巴等互联网大厂高薪职位，助力职场升级。',
    icon: Briefcase,
    color: 'from-orange-500 to-orange-600',
  },
}

// 转换真实数据为页面需要的格式
const allJobs: (Job & { company: Company })[] = [
  ...realJobs.map((job, index) => ({
    id: job.id || `real-${index}`,
    title: job.title,
    slug: `job-${index}`,
    companyId: job.company.toLowerCase().replace(/\s+/g, '-'),
    company: {
      id: job.company.toLowerCase().replace(/\s+/g, '-'),
      name: job.company,
      slug: job.company.toLowerCase().replace(/\s+/g, '-'),
      industry: job.remote ? 'web3' : 'internet' as 'finance' | 'web3' | 'internet',
      description: job.description?.substring(0, 100) || '',
      createdAt: new Date(job.postedAt || Date.now()),
    },
    description: job.description?.substring(0, 200) || '暂无描述',
    requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '详见职位链接',
    salaryMin: 0,
    salaryMax: 0,
    salaryCurrency: 'CNY' as const,
    location: job.location,
    type: (job.remote ? 'remote' : 'full-time') as 'remote' | 'full-time' | 'part-time' | 'contract',
    industry: (job.remote ? 'web3' : 'internet') as 'finance' | 'web3' | 'internet',
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
      description: job.description?.substring(0, 100) || '',
      createdAt: new Date(job.publishedAt || Date.now()),
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
  ...seedJobs.map((job, index) => ({
    id: job.id || `seed-${index}`,
    title: job.title,
    slug: job.slug || `seed-${index}`,
    companyId: job.companySlug,
    company: {
      id: job.companySlug,
      name: job.company,
      slug: job.companySlug,
      industry: job.industry,
      description: job.description?.substring(0, 100) || '',
      createdAt: new Date(job.publishedAt || Date.now()),
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

// 生成页面元数据
export async function generateMetadata({ params }: { params: { industry: string } }): Promise<Metadata> {
  const config = industryConfig[params.industry]
  if (!config) {
    return {
      title: '404 - 页面不存在',
    }
  }
  return {
    title: config.metaTitle,
    description: config.metaDescription,
  }
}

// 生成静态参数
export function generateStaticParams() {
  const locales = ['zh', 'en']
  const industries = ['finance', 'web3', 'internet']
  
  const params: { lang: string; industry: string }[] = []
  locales.forEach(lang => {
    industries.forEach(industry => {
      params.push({ lang, industry })
    })
  })
  
  return params
}

/**
 * 行业职位页
 * - 动态路由：finance, web3, internet
 * - 行业特定Hero（不同标题和描述）
 * - 该行业职位列表
 * - SEO友好的标题和meta
 */
export default async function IndustryPage({ params }: { params: Promise<{ industry: string }> }) {
  const { industry } = await params;
  const config = industryConfig[industry]
  
  if (!config) {
    notFound()
  }

  const Icon = config.icon

  // 筛选该行业的职位
  const industryJobs = allJobs.filter((job) => job.industry === industry)
  
  console.log(`[IndustryPage] ${industry}: ${industryJobs.length} jobs from ${allJobs.length} total`)
  console.log(`[IndustryPage] allJobs breakdown - realJobs: ${realJobs.length}, crawledJobs: ${crawledJobs.length}, seedJobs: ${seedJobs.length}`)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className={`relative overflow-hidden bg-gradient-to-br ${config.color} py-16 sm:py-24`}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white/5" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/5" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur mb-6">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                {config.title}
              </h1>
              <p className="mt-6 text-lg text-white/80">
                {config.description}
              </p>
              <div className="mt-8">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                  浏览全部{config.title}职位
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* 职位列表 */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-primary">
                {config.title}职位
              </h2>
              <span className="text-sm text-gray-500">共 {industryJobs.length} 个职位</span>
            </div>

            <JobList jobs={industryJobs} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
