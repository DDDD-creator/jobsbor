'use client'

import { useEffect } from 'react'

/**
 * PWA Service Worker 注册组件
 * 在客户端注册 Service Worker，实现离线访问和缓存功能
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // 注册 Service Worker
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
          
          // 监听 Service Worker 更新
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // 有新版本可用
                  console.log('New content is available; please refresh.')
                  // 可以在这里触发提示用户刷新
                  if (confirm('网站有新版本，是否刷新页面？')) {
                    window.location.reload()
                  }
                }
              })
            }
          })
        })
        .catch((error) => {
          console.log('SW registration failed: ', error)
        })

      // 监听来自 Service Worker 的消息
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SKIP_WAITING') {
          window.location.reload()
        }
      })
    }
  }, [])

  return null
}

/**
 * 检查 PWA 是否已安装
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false
  // iOS Safari specific property
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || 
         nav.standalone === true
}

/**
 * 检查是否支持 PWA 安装
 */
export function canInstallPWA(): boolean {
  if (typeof window === 'undefined') return false
  return 'BeforeInstallPromptEvent' in window
}
