'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Calculator, 
  BookOpen, 
  Gift, 
  TrendingUp,
  ArrowRight,
  Sparkles,
  Target,
  Briefcase
} from 'lucide-react'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { ScrollReveal } from '@/lib/animations'

// 工具列表
const tools = [
  {
    id: 'salary-comparison',
    title: '薪资对比器',
    description: '查询不同城市和职位的市场薪资水平，了解你的市场价值。支持金融、Web3、互联网等多个行业。',
    icon: Calculator,
    color: 'cyan',
    features: ['行业薪资分析', '城市薪资对比', '薪资趋势预测', '薪资谈判建议'],
    href: '/tools/salary-comparison',
    popular: true,
  },
  {
    id: 'interview-questions',
    title: '面试题库',
    description: '各大科技公司面试真题汇总，包含算法题、系统设计、行为面试等多种类型题目。',
    icon: BookOpen,
    color: 'purple',
    features: ['算法题库', '系统设计', '行为面试', '面试经验分享'],
    href: '/tools/interview-questions',
    popular: true,
  },
  {
    id: 'referral-codes',
    title: '内推码',
    description: '使用内推码让简历优先被看到，提高面试机会。汇集各大厂内推资源。',
    icon: Gift,
    color: 'pink',
    features: ['大厂内推码', '内推攻略', '内推人对接', '内推成功率分析'],
    href: '/tools/referral-codes',
    popular: false,
  },
]

// 更多即将上线的工具
const comingSoonTools = [
  {
    title: '简历诊断',
    description: 'AI驱动的简历分析和优化建议',
    icon: Briefcase,
    color: 'green',
  },
  {
    title: '职业规划',
    description: '基于市场数据的职业发展路径建议',
    icon: Target,
    color: 'orange',
  },
  {
    title: '薪资预测',
    description: '基于技能和市场趋势的薪资增长预测',
    icon: TrendingUp,
    color: 'cyan',
  },
]

export default function ToolsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1c]">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid opacity-30" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[150px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <ScrollReveal>
                <Badge variant="neon" color="cyan" size="sm" className="mb-6">
                  <Sparkles className="w-3 h-3 mr-1" />
                  实用工具
                </Badge>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                  求职<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">工具箱</span>
                </h1>
                
                <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                  专业的求职辅助工具，帮助你更好地了解市场行情、准备面试、获取内推资源
                </p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* 主要工具 */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <ScrollReveal key={tool.id} delay={index * 100}>
                  <LocalizedLink href={tool.href}>
                    <Card 
                      variant="glass" 
                      glowColor={tool.color as 'cyan' | 'purple' | 'pink'}
                      className="group h-full cursor-pointer hover:border-opacity-50 transition-all duration-300"
                    >
                      <CardContent className="p-6">
                        {/* 头部 */}
                        <div className="flex items-start justify-between mb-4">
                          <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-${tool.color}-500/10 text-${tool.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                            <tool.icon className="h-6 w-6" />
                          </div>
                          {tool.popular && (
                            <Badge variant="neon" color={tool.color as 'cyan' | 'purple' | 'pink'} size="sm">
                              热门
                            </Badge>
                          )}
                        </div>

                        {/* 内容 */}
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                          {tool.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                          {tool.description}
                        </p>

                        {/* 功能列表 */}
                        <div className="space-y-2 mb-6">
                          {tool.features.map((feature) => (
                            <div key={feature} className="flex items-center gap-2 text-sm text-gray-500">
                              <div className={`w-1 h-1 rounded-full bg-${tool.color}-400`} />
                              {feature}
                            </div>
                          ))}
                        </div>

                        {/* 按钮 */}
                        <div className={`flex items-center text-${tool.color}-400 text-sm font-medium group-hover:gap-3 transition-all`}>
                          <span>立即使用</span>
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </LocalizedLink>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* 即将上线 */}
        <section className="py-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <Badge variant="outline" className="mb-4 border-white/20 text-gray-400">
                敬请期待
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                更多工具即将上线
              </h2>
              <p className="text-gray-400">我们正在开发更多实用的求职辅助工具</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {comingSoonTools.map((tool, index) => (
                <ScrollReveal key={tool.title} delay={index * 100}>
                  <div className="glass-card rounded-2xl p-6 opacity-60 hover:opacity-80 transition-opacity">
                    <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-${tool.color}-500/10 text-${tool.color}-400 mb-4`}>
                      <tool.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{tool.title}</h3>
                    <p className="text-gray-400 text-sm">{tool.description}</p>
                    <div className="mt-4 inline-flex items-center gap-1 text-xs text-gray-500">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                      开发中
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                需要更多帮助？
              </h2>
              <p className="text-gray-400 mb-6">
                加入我们的Telegram频道，获取更多求职资源和专业建议
              </p>
              <a
                href="https://t.me/Web3Kairo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/50 text-[#00a8e6] hover:bg-[#0088cc]/30 transition-all"
              >
                加入 @Web3Kairo
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
