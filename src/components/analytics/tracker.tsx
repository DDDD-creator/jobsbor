'use client'

import { useEffect } from 'react'

// 扩展 Window 类型
declare global {
  interface Window {
    __analyticsTracked?: boolean
  }
}

export function AnalyticsTracker() {
  useEffect(() => {
    // 避免重复追踪
    if (typeof window === 'undefined') return
    if (window.__analyticsTracked) return
    
    const trackPageView = async () => {
      try {
        // 使用简单统计API（不依赖数据库）
        await fetch('/api/analytics-simple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pathname: window.location.pathname,
          }),
        })
        window.__analyticsTracked = true
      } catch (error) {
        // 静默失败
      }
    }

    trackPageView()
  }, [])

  return null
}
