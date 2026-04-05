'use client'

import { useEffect } from 'react'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Home, RefreshCw, MessageCircle, ArrowRight } from 'lucide-react'

/**
 * 全局错误处理页面
 * - 捕获React组件错误
 * - 友好的错误提示
 * - 提供刷新和返回选项
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 记录错误到控制台
    console.error('Page Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />
      
      <main className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            {/* 错误图标 */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                <svg 
                  className="w-12 h-12 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                  />
                </svg>
              </div>
            </div>
            
            {/* 错误信息 */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              页面出错了
            </h1>
            <p className="text-gray-400 text-lg mb-4 max-w-md mx-auto">
              抱歉，页面加载时遇到了问题。这可能是临时的网络问题或系统错误。
            </p>
            
            {/* 错误详情 (开发环境显示) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-left">
                <p className="text-red-400 text-sm font-mono break-all">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-red-500/60 text-xs mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
            
            {/* 快捷操作 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button 
                size="lg" 
                onClick={reset}
                className="h-14 px-8 bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500 font-semibold rounded-xl hover:shadow-neon-cyan transition-all"
              >
                <RefreshCw className="mr-2 h-5 w-5" />
                重新加载
              </Button>
              <LocalizedLink href="/">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="h-14 px-8 border-white/20 text-white hover:bg-white/10 rounded-xl"
                >
                  <Home className="mr-2 h-5 w-5" />
                  返回首页
                </Button>
              </LocalizedLink>
            </div>
            
            {/* TG频道引流 */}
            <div className="glass-card rounded-2xl p-6 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <MessageCircle className="h-6 w-6 text-[#0088cc]" />
                <span className="text-white font-medium">问题反馈</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                如果问题持续存在，请通过Telegram频道联系我们
              </p>
              <a
                href="https://t.me/Web3Kairo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/50 text-[#00a8e6] hover:bg-[#0088cc]/30 transition-all group"
              >
                <span>联系 @Web3Kairo</span>
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
