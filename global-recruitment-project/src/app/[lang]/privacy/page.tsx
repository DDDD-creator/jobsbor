import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Lock, Eye, Database, UserCheck, Share2, Clock, Mail, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: '隐私政策 | Jobsbor',
  description: '了解 Jobsbor 如何保护您的隐私和数据安全。我们重视您的个人信息，仅收集必要的数据为您提供服务。',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent mb-4">
              隐私政策
            </h1>
            <p className="text-gray-400 text-lg">
              我们重视您的隐私，致力于保护您的个人信息安全
            </p>
            <p className="text-gray-500 text-sm mt-2">
              本政策最后更新于 2024年4月3日
            </p>
          </div>

          {/* Beta版本提示 */}
          <div className="mb-8 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-200 font-medium">Beta版本说明</p>
                <p className="text-yellow-200/70 text-sm mt-1">
                  当前网站处于Beta测试阶段，部分功能尚未完善。我们仅收集运行网站所必需的最少数据。
                  随着功能完善，本隐私政策将相应更新。
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 mb-12">
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-neon-cyan" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-3">1. 信息收集</h2>
                    <div className="text-gray-400 leading-relaxed space-y-2">
                      <p><strong className="text-gray-300">当前阶段（Beta版本）</strong>，我们收集：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong className="text-gray-300">联系表单信息</strong>：当您通过联系表单联系我们时，我们会收集您的姓名、邮箱和消息内容，用于回复您的咨询。</li>
                        <li><strong className="text-gray-300">访问日志</strong>：IP地址、浏览器类型、访问时间，用于网站运行分析和安全防护。</li>
                      </ul>
                      <p className="mt-2 text-sm text-gray-500">
                        <strong>注意：</strong>当前Beta版本暂不支持用户注册、简历上传等高级功能，因此不会收集简历、工作经历等敏感个人信息。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
                    <Lock className="h-6 w-6 text-neon-purple" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-3">2. 信息保护</h2>
                    <div className="text-gray-400 leading-relaxed space-y-2">
                      <p>我们采取以下措施保护您的数据：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong className="text-gray-300">加密传输</strong>：全站使用HTTPS加密传输</li>
                        <li><strong className="text-gray-300">数据最小化</strong>：仅收集必要数据，不存储敏感信息</li>
                        <li><strong className="text-gray-300">访问限制</strong>：数据仅限必要人员访问</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center flex-shrink-0">
                    <Eye className="h-6 w-6 text-neon-pink" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-3">3. Cookie 使用</h2>
                    <div className="text-gray-400 leading-relaxed space-y-2">
                      <p>我们使用以下Cookie：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong className="text-gray-300">必要Cookie</strong>：用于网站基本功能和语言偏好</li>
                        <li><strong className="text-gray-300">分析Cookie</strong>：用于了解网站使用情况（可禁用）</li>
                      </ul>
                      <p className="mt-2">继续使用本网站即表示您同意我们使用Cookie。</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Database className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-3">4. 第三方服务</h2>
                    <div className="text-gray-400 leading-relaxed space-y-2">
                      <p>我们可能使用以下第三方服务：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong className="text-gray-300">Vercel</strong>：网站托管和Analytics分析</li>
                        <li><strong className="text-gray-300">Resend</strong>：邮件发送服务（联系表单）</li>
                        <li><strong className="text-gray-300">Google Analytics</strong>：访问数据分析（可选）</li>
                      </ul>
                      <p className="mt-2">这些服务可能有各自的隐私政策，请查阅了解。</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0">
                    <UserCheck className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-3">5. 您的权利</h2>
                    <div className="text-gray-400 leading-relaxed space-y-2">
                      <p>根据适用法律，您享有以下权利：</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li><strong className="text-gray-300">知情权</strong>：了解我们如何处理您的数据</li>
                        <li><strong className="text-gray-300">访问权</strong>：查看我们持有的关于您的数据</li>
                        <li><strong className="text-gray-300">删除权</strong>：要求删除您的个人数据</li>
                      </ul>
                      <p className="mt-2">如需行使这些权利，请通过底部联系方式与我们联系。</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-white mb-3">6. 政策更新</h2>
                    <div className="text-gray-400 leading-relaxed">
                      <p>
                        随着网站功能完善，本隐私政策可能会更新。重大变更时，我们将在网站显著位置通知您。
                        建议您定期查看本页面了解最新政策。
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 联系信息 */}
          <Card className="border-neon-cyan/30 bg-gradient-to-br from-neon-cyan/5 to-transparent">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-neon-cyan" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white mb-3">联系我们</h2>
                  <p className="text-gray-400 mb-4">
                    如果您对本隐私政策有任何疑问，或希望行使您的数据权利，请通过以下方式联系我们：
                  </p>
                  <div className="space-y-2 text-gray-300">
                    <p><strong>邮箱：</strong> support@jobsbor.com</p>
                    <p><strong>Telegram：</strong> @Web3Kairo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
