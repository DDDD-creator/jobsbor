"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-dark-500 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Error Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
          <div className="relative h-24 w-24 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <AlertCircle className="h-12 w-12 text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-white mb-4">
          出错了
        </h1>
        <p className="text-gray-400 mb-8">
          抱歉，页面加载时发生错误。请尝试刷新页面或返回首页。
        </p>

        {/* Error Details (dev only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-left">
            <p className="text-sm text-red-400 font-mono break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-red-500/60 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            重试
          </Button>
          
          <LocalizedLink href="/">
            <Button className="bg-neon-cyan hover:bg-neon-cyan/80 text-dark-500">
              <Home className="mr-2 h-4 w-4" />
              返回首页
            </Button>
          </LocalizedLink>
        </div>
      </div>
    </div>
  )
}
