import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { EnhancedCompanyProfile } from '@/components/companies/enhanced-company-profile'
import { ScrollReveal } from '@/lib/animations'
import { generateSEO } from '@/lib/seo'
import { extractCompanies, getCompanyBySlug, getAllCompanySlugs, type CompanyData } from '@/lib/company-data'
import { realJobs } from '@/data/real-jobs'
import { crawledJobs } from '@/data/crawled-jobs'
import { jobs as seedJobs } from '@/data/jobs'

// 生成页面元数据
export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params
  const company = getCompanyBySlug(slug)
  
  if (!company) {
    return {
      title: lang === 'zh' ? '404 - 公司不存在 | Jobsbor' : '404 - Company Not Found | Jobsbor',
    }
  }
  
  return generateSEO({
    title: `${company.name} - 公司详情`,
    description: company.description?.slice(0, 150) || `${company.name}是一家${company.industry}公司`,
    url: `/companies/${slug}`,
    type: 'website',
    locale: lang === 'zh' ? 'zh_CN' : 'en_US',
  })
}

// 生成静态参数
export function generateStaticParams() {
  const locales = ['zh', 'en']
  const slugs = getAllCompanySlugs()
  
  const params: { lang: string; slug: string }[] = []
  locales.forEach(lang => {
    slugs.forEach(slug => {
      params.push({ lang, slug })
    })
  })
  
  console.log(`[CompanyDetail] 生成 ${params.length} 个公司详情页 (${slugs.length} 公司 x 2 语言)`)
  return params
}

// 获取公司的所有职位
function getCompanyJobs(companyName: string): any[] {
  const allJobs = [
    ...realJobs.map((job, index) => ({
      id: job.id,
      title: job.title,
      slug: `${job.company.toLowerCase().replace(/\s+/g, '-')}-${job.title.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}-${index}`,
      company: job.company,
      companySlug: job.company.toLowerCase().replace(/\s+/g, '-'),
      description: job.description,
      requirements: job.requirements?.join('\n') || '',
      salaryMin: 0,
      salaryMax: 0,
      salaryCurrency: 'CNY',
      location: job.location,
      type: job.remote ? 'remote' : 'full-time',
      industry: job.remote ? 'web3' : 'internet',
      category: 'engineer',
      tags: job.requirements || ['Remote', job.source],
      isActive: true,
      publishedAt: new Date(job.postedAt),
    })),
    ...crawledJobs.map((job) => ({
      ...job,
    })),
    ...seedJobs.map((job) => ({
      ...job,
    })),
  ]
  
  return allJobs.filter(job => 
    job.company.toLowerCase() === companyName.toLowerCase() ||
    job.companySlug?.toLowerCase() === companyName.toLowerCase()
  )
}

// 转换Company数据格式
function transformCompanyData(company: CompanyData) {
  const jobs = getCompanyJobs(company.name)
  
  return {
    ...company,
    stats: {
      totalJobs: jobs.length,
      avgSalary: jobs.length > 0 
        ? `¥${Math.round(jobs.reduce((sum, j) => sum + (j.salaryMax || j.salaryMin || 0), 0) / jobs.length / 1000)}K`
        : '薪资面议',
      responseRate: '95%',
      avgProcessTime: '3-5天',
    },
    benefits: company.benefits || [
      '远程工作',
      '弹性工作',
      '带薪年假',
      '股票期权',
      '免费午餐',
      '健身补贴',
    ],
    values: company.values || [
      '用户至上',
      '追求卓越',
      '开放透明',
      '持续学习',
    ],
    techStack: company.techStack || [
      'React',
      'TypeScript',
      'Node.js',
      'Python',
      'AWS',
    ],
    socialLinks: company.socialLinks || {
      linkedin: company.website,
      twitter: company.website,
    },
  }
}

// 公司详情页面
export default async function CompanyPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>
}) {
  const { lang, slug } = await params
  const company = getCompanyBySlug(slug)
  
  if (!company) {
    notFound()
  }

  const enhancedCompany = transformCompanyData(company)
  const jobs = getCompanyJobs(company.name)

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1c]">
      <Header />
      
      <main className="flex-1 relative pt-16">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <ScrollReveal>
            <EnhancedCompanyProfile 
              company={enhancedCompany} 
              jobs={jobs}
            />
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  )
}
