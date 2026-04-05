import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SalaryAnalyzer } from '@/components/tools/salary-analyzer'
import { ScrollReveal } from '@/lib/animations'
import { generateSEO } from '@/lib/seo'
import { BarChart3, TrendingUp, Info } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { crawledJobs } from '@/data/crawled-jobs'
import { jobs as seedJobs } from '@/data/jobs'

export const metadata: Metadata = generateSEO({
  title: '薪资分析工具',
  description: '分析金融、Web3、互联网行业的薪资数据。按行业、地点、职位类型查看薪资分布、平均值、中位数等统计信息。',
  url: '/tools/salary-comparison',
  type: 'website',
})

export default function SalaryAnalysisPage() {
  // 合并所有有薪资数据的职位
  const jobsWithSalary = [
    ...crawledJobs.filter(job => job.salaryMax > 0 || job.salaryMin > 0),
    ...seedJobs.filter(job => job.salaryMax > 0 || job.salaryMin > 0),
  ].map(job => ({
    ...job,
    company: job.company,
    // publishedAt, createdAt, updatedAt 已经是字符串格式
  }))

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1c]">
      <Header />
      
      <main className="flex-1 relative pt-16">
        {/* 背景装饰 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
        </div>

        {/* Page Header */}
        <div className="relative border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                薪资
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  分析工具
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl">
                基于真实职位数据分析金融、Web3、互联网行业的薪资水平。
                支持按行业、地点筛选，查看薪资分布、平均值、中位数等统计信息。
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* 主内容区 */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                <SalaryAnalyzer jobs={jobsWithSalary} />
              </ScrollReveal>
            </div>

            {/* 侧边栏 */}
            <div className="space-y-6">
              <ScrollReveal delay={100}>
                <Card className="p-6 border-white/10 bg-dark-200/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-cyan-400" />
                    数据说明
                  </h3>
                  
                  <div className="space-y-4 text-sm text-gray-400">
                    <p>
                      薪资数据来源于 Jobsbor 平台的真实职位信息，包括用户提交的爬虫数据和平台录入的职位。
                    </p>
                    
                    <p>
                      <span className="text-white font-medium">统计范围：</span>
                      <br />
                      • 金融、Web3、互联网行业<br />
                      • 全职、远程、合同等职位<br />
                      • 北京、上海、深圳等主要城市
                    </p>
                    
                    <p>
                      <span className="text-white font-medium">更新频率：</span>
                      <br />
                      数据每日自动更新
                    </p>
                  </div>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <Card className="p-6 border-white/10 bg-dark-200/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    热门趋势
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-purple-500/10">
                      <p className="text-purple-400 font-medium text-sm">Web3/区块链</p>
                      <p className="text-xs text-gray-400 mt-1">平均薪资增长最快，远程职位占比高</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-cyan-500/10">
                      <p className="text-cyan-400 font-medium text-sm">金融行业</p>
                      <p className="text-xs text-gray-400 mt-1">量化、风控岗位薪资领先</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-pink-500/10">
                      <p className="text-pink-400 font-medium text-sm">互联网</p>
                      <p className="text-xs text-gray-400 mt-1">产品经理、技术岗位需求稳定</p>
                    </div>
                  </div>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
