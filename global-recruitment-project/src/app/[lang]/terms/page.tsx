import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card, CardContent } from '@/components/ui/card'
import { FileText, Scale, AlertCircle, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: '服务条款 | Jobsbor',
  description: '了解使用 Jobsbor 平台的服务条款和条件',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-transparent mb-4">
              服务条款
            </h1>
            <p className="text-gray-400 text-lg">
              使用 Jobsbor 平台前，请仔细阅读以下条款
            </p>
          </div>

          <div className="grid gap-6 mb-12">
            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-neon-cyan" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">服务说明</h2>
                    <p className="text-gray-400 leading-relaxed">
                      Jobsbor 是一个职位信息平台，为用户提供求职信息、公司信息和求职指导服务。
                      我们致力于连接求职者与优质雇主，但不直接参与招聘过程。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-purple/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-neon-purple" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">用户责任</h2>
                    <ul className="text-gray-400 leading-relaxed space-y-2">
                      <li>• 提供真实、准确的个人信息</li>
                      <li>• 遵守相关法律法规</li>
                      <li>• 尊重其他用户和雇主的权益</li>
                      <li>• 不发布虚假或误导性信息</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-pink/20 flex items-center justify-center flex-shrink-0">
                    <Scale className="h-6 w-6 text-neon-pink" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">责任限制</h2>
                    <p className="text-gray-400 leading-relaxed">
                      Jobsbor 尽力确保职位信息的准确性，但不保证所有信息完全无误。
                      求职过程中的具体事宜由求职者与雇主直接协商，本平台不承担相关责任。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neon-blue/20 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-6 w-6 text-neon-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">条款变更</h2>
                    <p className="text-gray-400 leading-relaxed">
                      我们保留随时修改这些条款的权利。重大变更将通过网站公告通知用户。
                      继续使用本平台即表示您接受修改后的条款。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center text-gray-500 text-sm">
            <p>最后更新日期：2024年4月3日</p>
            <p className="mt-2">如有疑问，请联系 support@jobsbor.com</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
