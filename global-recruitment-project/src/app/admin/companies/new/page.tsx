'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CompanyForm } from '@/components/admin/CompanyForm'

export default function NewCompanyPage() {
  const router = useRouter()

  const handleSubmit = async (data: any) => {
    const token = localStorage.getItem('admin_token')
    const response = await fetch('/api/admin/companies', {
      method: 'POST',
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
      throw new Error(error.error || '创建失败')
    }
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
          <h1 className="text-2xl font-bold text-white">添加新公司</h1>
          <p className="text-gray-400 mt-1">填写公司信息</p>
        </div>
      </div>

      <div className="glass-card rounded-2xl p-6">
        <CompanyForm 
          onSubmit={handleSubmit}
          submitLabel="添加公司"
        />
      </div>
    </div>
  )
}
