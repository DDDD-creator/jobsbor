import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JobAlertsManager } from '@/components/alerts/job-alerts-manager'
import { ScrollReveal } from '@/lib/animations'
import { generateSEO } from '@/lib/seo'
import { Bell, Mail, Sparkles } from 'lucide-react'

export const metadata: Metadata = generateSEO({
  title: '职位提醒设置',
  description: '设置职位筛选条件，当有新职位符合你的要求时，我们会自动发送邮件通知你。支持每日、每周或实时提醒。',
  url: '/alerts',
  type: 'website',
})

export default function AlertsPage() {
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
                  <Bell className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                职位
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                  提醒设置
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl">
                设置筛选条件，当有新职位符合你的要求时，我们会自动发送邮件通知你。
                支持每日、每周或实时提醒。
              </p>
            </ScrollReveal>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧：提醒管理 */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <JobAlertsManager />
              </ScrollReveal>
            </div>

            {/* 右侧：使用说明 */}
            <div className="space-y-6">
              <ScrollReveal delay={100}>
                <div className="p-6 rounded-xl border border-white/10 bg-dark-200/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    使用说明
                  </h3>
                  
                  <div className="space-y-4 text-sm text-gray-400">
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 text-cyan-400 font-medium">1</div>
                      <div>
                        <p className="text-white font-medium">设置筛选条件</p>
                        <p>选择你感兴趣的行业、地点、工作类型等条件</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 text-purple-400 font-medium">2</div>
                      <div>
                        <p className="text-white font-medium">选择发送频率</p>
                        <p>实时、每日或每周，根据你的需求选择</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0 text-pink-400 font-medium">3</div>
                      <div>
                        <p className="text-white font-medium">接收邮件通知</p>
                        <p>当有新职位匹配时，邮件自动发送到你的邮箱</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={150}>
                <div className="p-6 rounded-xl border border-white/10 bg-dark-200/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    发送频率说明
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10">
                      <span className="text-green-400 font-medium">实时</span>
                      <span className="text-sm text-gray-400">新职位发布后立即通知</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10">
                      <span className="text-blue-400 font-medium">每日</span>
                      <span className="text-sm text-gray-400">每天早8点汇总发送</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 rounded-lg bg-purple-500/10">
                      <span className="text-purple-400 font-medium">每周</span>
                      <span className="text-sm text-gray-400">每周一早8点汇总发送</span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <div className="p-6 rounded-xl border border-yellow-500/20 bg-yellow-500/5">
                  <div className="flex gap-3">
                    <Bell className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-400">
                      <p className="text-yellow-400 font-medium mb-1">提示</p>
                      <p>邮件提醒功能需要配置RESEND_API_KEY环境变量才能正常工作。目前设置会保存在浏览器本地，邮件发送功能将在配置完成后启用。</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
