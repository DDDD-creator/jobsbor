'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Loader2, 
  AlertCircle,
  RefreshCw
} from 'lucide-react'

/**
 * 全局加载状态页面
 * - 优雅的加载动画
 * - 加载超时提示
 * - 刷新按钮
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />
      
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {/* 加载动画 */}
          <div className="relative mb-8">
            <div className="w-16 h-16 mx-auto rounded-full border-4 border-neon-cyan/20 border-t-neon-cyan animate-spin" />
            <div className="absolute inset-0 w-16 h-16 mx-auto rounded-full border-4 border-transparent border-t-neon-purple animate-spin" 
              style={{ animationDuration: '1.5s' }} 
            />
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">
            加载中...
          </h2>
          
          <p className="text-gray-400 text-sm mb-6">
            正在获取最新职位数据
          </p>

          {/* 加载提示卡片 */}
          <Card className="glass-card p-6 max-w-md mx-auto">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-neon-cyan flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-white text-sm font-medium mb-1">
                  首次加载可能需要较长时间
                </p>
                <p className="text-gray-400 text-xs">
                  我们正在从全球500+企业官网实时获取职位数据，请耐心等待...
                </p>
              </div>
            </div>
          </Card>

          {/* 刷新按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="mt-6 border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重新加载
          </Button>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
