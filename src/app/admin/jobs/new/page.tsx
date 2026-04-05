'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JobForm } from '@/components/admin/JobForm'

export default function NewJobPage() {
  const router = useRouter()
  const [companies, setCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/companies?limit=100', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies)
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    const token = localStorage.getItem('admin_token')
    const response = await fetch('/api/admin/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      router.push('/admin/jobs')
    } else {
      const error = await response.json()
      throw new Error(error.error || '创建失败')
    }
  }

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/jobs">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">发布新职位</h1>
          <p className="text-gray-400 mt-1">填写职位信息并发布</p>
        </div>
      </div>

      {/* Form */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6">
          <JobForm 
            companies={companies}
            onSubmit={handleSubmit}
            submitLabel="发布职位"
          />
        </div>
      )}
    </div>
  )
}
