import { LocalizedLink } from '@/components/i18n/localized-link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Home, Search, MessageCircle, ArrowRight } from 'lucide-react'

/**
 * 404 错误页面
 * - 友好的错误提示
 * - 返回首页链接
 * - 推荐职位链接
 * - TG频道引流
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />
      
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* 404 数字 */}
            <div className="relative mb-8">
              <h1 className="text-8xl sm:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink">
                404
              </h1>
              <div className="absolute inset-0 text-8xl sm:text-9xl font-bold text-neon-cyan/20 blur-sm">
                404
              </div>
            </div>
            
            {/* 错误信息 */}
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              页面找不到了
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              抱歉，您访问的页面可能已经移动、删除或暂时不可用。
            </p>
            
            {/* 快捷链接 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <LocalizedLink href="/">
                <Button 
                  size="lg" 
                  className="h-14 px-8 bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500 font-semibold rounded-xl hover:shadow-neon-cyan transition-all"
                >
                  <Home className="mr-2 h-5 w-5" />
                  返回首页
                </Button>
              </LocalizedLink>
              <LocalizedLink href="/jobs">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-8 border-white/20 text-white hover:bg-white/10 rounded-xl"
                >
                  <Search className="mr-2 h-5 w-5" />
                  浏览职位
                </Button>
              </LocalizedLink>
            </div>
            
            {/* TG频道引流 */}
            <div className="glass-card rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <MessageCircle className="h-6 w-6 text-[#0088cc]" />
                <span className="text-white font-medium">获取帮助</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                加入我们的Telegram频道，获取最新职位信息和技术支持
              </p>
              <a
                href="https://t.me/Web3Kairo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/50 text-[#00a8e6] hover:bg-[#0088cc]/30 transition-all group"
              >
                <span>加入 @Web3Kairo</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            
            {/* 推荐链接 */}
            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-gray-500 text-sm mb-4">您可能想找：</p>
              <div className="flex flex-wrap justify-center gap-3">
                <LocalizedLink href="/jobs" className="text-neon-cyan hover:underline text-sm">
                  热门职位
                </LocalizedLink>
                <LocalizedLink href="/companies" className="text-neon-cyan hover:underline text-sm">
                  热门公司
                </LocalizedLink>
                <LocalizedLink href="/blog" className="text-neon-cyan hover:underline text-sm">
                  职场资讯
                </LocalizedLink>
                <LocalizedLink href="/guide" className="text-neon-cyan hover:underline text-sm">
                  求职指南
                </LocalizedLink>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}