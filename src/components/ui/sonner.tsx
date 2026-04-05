'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastType = 'default' | 'success' | 'error'

interface Toast {
  id: string
  message: string
  type: ToastType
}

// 全局toast状态（简单的实现）
let listeners: ((toasts: Toast[]) => void)[] = []
let toasts: Toast[] = []

function notifyListeners() {
  listeners.forEach(listener => listener([...toasts]))
}

export function toast(message: string, type: ToastType = 'default') {
  const id = Math.random().toString(36).substr(2, 9)
  toasts = [...toasts, { id, message, type }]
  notifyListeners()
  
  // 3秒后自动移除
  setTimeout(() => {
    toasts = toasts.filter(t => t.id !== id)
    notifyListeners()
  }, 3000)
}

toast.success = (message: string) => toast(message, 'success')
toast.error = (message: string) => toast(message, 'error')

export function Toaster() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    listeners.push(setCurrentToasts)
    return () => {
      listeners = listeners.filter(l => l !== setCurrentToasts)
    }
  }, [])

  // 也监听自定义事件
  useEffect(() => {
    const handleToast = (e: Event) => {
      const { message, type = 'default' } = (e as CustomEvent).detail
      toast(message, type)
    }
    window.addEventListener('toast', handleToast)
    return () => window.removeEventListener('toast', handleToast)
  }, [])

  if (currentToasts.length === 0) return null

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] space-y-2">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border",
            "animate-in slide-in-from-top-2 fade-in duration-200",
            t.type === 'success' && "bg-green-500/10 border-green-500/30 text-green-400",
            t.type === 'error' && "bg-red-500/10 border-red-500/30 text-red-400",
            t.type === 'default' && "bg-[#1a1f2e] border-white/10 text-white"
          )}
        >
          {t.type === 'success' && <CheckCircle className="h-4 w-4" />}
          {t.type === 'error' && <XCircle className="h-4 w-4" />}
          <span>{t.message}</span>
          
          <button
            onClick={() => {
              toasts = toasts.filter(toast => toast.id !== t.id)
              notifyListeners()
            }}
            className="ml-2 p-1 rounded hover:bg-white/10"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
