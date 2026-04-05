'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

interface ContactTranslations {
  name: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  message: string;
  messagePlaceholder: string;
  send: string;
  sending: string;
  sent: string;
  success: string;
  required: string;
  invalidEmail: string;
  csrfError: string;
  sendError: string;
  emailAlternative: string;
}

interface ContactFormProps {
  translations: ContactTranslations;
}

// 生成CSRF Token
function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  if (typeof window !== 'undefined' && window.crypto) {
    window.crypto.getRandomValues(array)
  }
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

export function ContactForm({ translations: t }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    csrfToken: '',
  })
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  // 组件挂载时生成CSRF Token
  useEffect(() => {
    const token = generateCSRFToken()
    setFormData(prev => ({ ...prev, csrfToken: token }))
    
    // 存储到sessionStorage用于验证
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('contact_csrf_token', token)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // 验证CSRF Token
    if (typeof window !== 'undefined') {
      const storedToken = sessionStorage.getItem('contact_csrf_token')
      if (formData.csrfToken !== storedToken) {
        setStatus('error')
        setErrorMessage(t.csrfError)
        return
      }
    }
    
    // 基本验证
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error')
      setErrorMessage(t.required)
      return
    }
    
    if (!formData.email.includes('@')) {
      setStatus('error')
      setErrorMessage(t.invalidEmail)
      return
    }
    
    setStatus('submitting')
    
    // 调用API发送消息
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          csrfToken: formData.csrfToken,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || t.sendError)
      }
      
      // 成功后清除CSRF Token
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('contact_csrf_token')
      }
      
      setStatus('success')
      setFormData({ name: '', email: '', message: '', csrfToken: '' })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : t.sendError)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // 清除错误状态当用户开始输入
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* CSRF Token 隐藏字段 */}
      <input type="hidden" name="csrfToken" value={formData.csrfToken} />
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">{t.name} *</label>
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={t.namePlaceholder}
          disabled={status === 'submitting'}
          className={cn(
            "bg-white/5 border-white/10 text-white placeholder:text-gray-500",
            status === 'error' && !formData.name && "border-red-500/50 focus:border-red-500"
          )}
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">{t.emailLabel} *</label>
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={t.emailPlaceholder}
          disabled={status === 'submitting'}
          className={cn(
            "bg-white/5 border-white/10 text-white placeholder:text-gray-500",
            status === 'error' && !formData.email && "border-red-500/50 focus:border-red-500"
          )}
        />
      </div>
      
      <div>
        <label className="block text-sm text-gray-400 mb-2">{t.message} *</label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder={t.messagePlaceholder}
          disabled={status === 'submitting'}
          className={cn(
            "w-full px-3 py-2 rounded-md bg-white/5 border text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 resize-none",
            status === 'error' && !formData.message 
              ? "border-red-500/50 focus:border-red-500" 
              : "border-white/10"
          )}
        />
      </div>
      
      {/* 状态反馈 */}
      {status === 'error' && (
        <div className="flex items-center gap-2 text-red-400 text-sm p-3 rounded-lg bg-red-500/10">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      {status === 'success' && (
        <div className="flex items-center gap-2 text-green-400 text-sm p-3 rounded-lg bg-green-500/10">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{t.success}</span>
        </div>
      )}
      
      <Button 
        type="submit"
        aria-label="提交联系表单"
        disabled={status === 'submitting' || status === 'success'}
        className={cn(
          "w-full font-semibold transition-all duration-300",
          status === 'success' 
            ? "bg-green-500 hover:bg-green-500 text-white" 
            : "bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500"
        )}
      >
        {status === 'submitting' ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>{t.sending}</span>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>{t.sent}</span>
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            <span>{t.send}</span>
          </>
        )}
      </Button>
      
      <p className="text-xs text-gray-500 text-center">
        {t.emailAlternative}{' '}
        <a href="mailto:support@jobsbor.com" className="text-neon-cyan hover:underline">
          support@jobsbor.com
        </a>
      </p>
    </form>
  )
}
