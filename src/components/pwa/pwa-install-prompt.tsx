'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Download, X, Smartphone } from 'lucide-react'
import { isPWAInstalled, canInstallPWA } from './service-worker-registration'

/**
 * PWA 安装提示组件
 * 当用户访问网站时，提示安装 PWA
 */
export function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // 检查是否已安装
    if (isPWAInstalled()) {
      setIsInstalled(true)
      return
    }

    // 检查用户是否之前关闭过提示
    const dismissed = localStorage.getItem('jobsbor_pwa_dismissed')
    if (dismissed) {
      const dismissedDate = new Date(dismissed)
      const now = new Date()
      const daysSinceDismissed = (now.getTime() - dismissedDate.getTime()) / (1000 * 3600 * 24)
      
      // 7天内不再显示
      if (daysSinceDismissed < 7) {
        return
      }
    }

    // 监听 beforeinstallprompt 事件
    const handleBeforeInstallPrompt = (e: Event) => {
      // 阻止默认提示
      e.preventDefault()
      // 保存事件，以便稍后触发
      setDeferredPrompt(e)
      // 显示自定义提示
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // 监听 appinstalled 事件
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      console.log('PWA was installed')
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    // 显示安装提示
    deferredPrompt.prompt()

    // 等待用户响应
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt')
    } else {
      console.log('User dismissed the install prompt')
    }

    // 清除保存的提示
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // 记录关闭时间
    localStorage.setItem('jobsbor_pwa_dismissed', new Date().toISOString())
  }

  // 如果已安装或不显示提示，返回 null
  if (isInstalled || !showPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50 animate-in slide-in-from-bottom-4">
      <Card className="p-4 border-white/10 bg-dark-200/95 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-5 h-5 text-cyan-400" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-white">安装 Jobsbor App</h4>
            <p className="text-sm text-gray-400 mt-1">
              添加到主屏幕，随时随地查看最新职位
            </p>
            
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleInstall}
                className="bg-gradient-to-r from-cyan-500 to-purple-500"
              >
                <Download className="w-4 h-4 mr-2" />
                安装
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
              >
                稍后再说
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </Card>
    </div>
  )
}
