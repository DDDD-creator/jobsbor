'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CompanyForm } from '@/components/admin/CompanyForm'

export default function EditCompanyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [company, setCompany] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchCompany()
  }, [params.id])

  const fetchCompany = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/companies/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setCompany(data)
      } else {
        router.push('/admin/companies')
      }
    } catch (error) {
      console.error('Failed to fetch company:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`/api/admin/companies/${params.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (response.ok) {
      router.push('/admin/companies')
    } else {
      const error = await response.json()
      throw new Error(error.error || '更新失败')
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neon-cyan" />
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/companies">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">编辑公司</h1>
          <p className="text-gray-400 mt-1">{company?.name}</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <CompanyForm
          initialData={company}
          onSubmit={handleSubmit}
          submitLabel="保存修改"
        />
      </div>
    </div>
  )
}
