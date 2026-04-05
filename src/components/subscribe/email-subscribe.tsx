'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type SubscribeStatus = 'idle' | 'submitting' | 'success' | 'error'

interface EmailSubscribeProps {
  className?: string
  variant?: 'default' | 'compact' | 'hero'
}

export function EmailSubscribe({ className, variant = 'default' }: EmailSubscribeProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<SubscribeStatus>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('请输入有效的邮箱地址')
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage(data.message || '订阅成功！')
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || '订阅失败，请稍后重试')
      }
    } catch (error) {
      setStatus('error')
      setMessage('网络错误，请稍后重试')
    }
  }

  if (variant === 'hero') {
    return (
      <div className={cn("w-full max-w-md mx-auto", className)}>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="email"
              placeholder="输入邮箱，获取最新职位"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              disabled={status === 'submitting' || status === 'success'}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 h-12"
            />
          </div>
          <Button
            type="submit"
            disabled={status === 'submitting' || status === 'success'}
            className={cn(
              "h-12 px-6 font-semibold whitespace-nowrap",
              status === 'success' 
                ? "bg-green-500 hover:bg-green-500" 
                : "bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90"
            )}
          >
            {status === 'submitting' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                订阅中...
              </>
            ) : status === 'success' ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                已订阅
              </>
            ) : (
              '立即订阅'
            )}
          </Button>
        </form>
        
        {status === 'error' && (
          <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            {message}
          </div>
        )}
        
        {status === 'success' && (
          <div className="flex items-center gap-2 mt-3 text-green-400 text-sm">
            <CheckCircle className="h-4 w-4" />
            {message}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn("p-6 rounded-xl bg-white/5 border border-white/10", className)}>
      <h3 className="text-lg font-semibold text-white mb-2">订阅职位更新</h3>
      <p className="text-sm text-gray-400 mb-4">每周精选金融/Web3/互联网职位，直接发送到您的邮箱</p>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status === 'error') setStatus('idle')
            }}
            disabled={status === 'submitting' || status === 'success'}
            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-gray-600"
          />
        </div>
        
        <Button
          type="submit"
          disabled={status === 'submitting' || status === 'success'}
          className={cn(
            "w-full",
            status === 'success' 
              ? "bg-green-500 hover:bg-green-500" 
              : "bg-gradient-to-r from-neon-cyan to-neon-purple"
          )}
        >
          {status === 'submitting' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              订阅中...
            </>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              订阅成功
            </>
          ) : (
            '订阅'
          )}
        </Button>
      </form>
      
      {status === 'error' && (
        <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
          <AlertCircle className="h-4 w-4" />
          {message}
        </div>
      )}
    </div>
  )
}
