'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Briefcase, Loader2, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '登录失败')
      }

      // 保存token到localStorage
      localStorage.setItem('admin_token', data.token)
      
      // 跳转到管理后台
      router.push('/admin')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-500">
      <div className="w-full max-w-md p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple mb-4">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Jobsbor 管理后台</h1>
          <p className="text-gray-400 mt-2">请登录以继续</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card rounded-2xl p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">邮箱</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="admin@jobsbor.com"
                required
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">密码</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500 font-semibold h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </Button>
          </div>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 Jobsbor. All rights reserved.
        </p>
      </div>
    </div>
  )
}
