'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JobForm } from '@/components/admin/JobForm'

export default function EditJobPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [job, setJob] = useState<any>(null)
  const [companies, setCompanies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [params.id])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      
      const [jobRes, companiesRes] = await Promise.all([
        fetch(`/api/admin/jobs/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/admin/companies?limit=100', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (jobRes.ok) {
        const jobData = await jobRes.json()
        setJob(jobData)
      } else {
        router.push('/admin/jobs')
        return
      }

      if (companiesRes.ok) {
        const companiesData = await companiesRes.json()
        setCompanies(companiesData.companies)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (data: any) => {
    const token = localStorage.getItem('admin_token')
    const response = await fetch(`/api/admin/jobs/${params.id}`, {
      method: 'PATCH',
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
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/jobs">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">编辑职位</h1>
          <p className="text-gray-400 mt-1">{job?.title}</p>
        </div>
      </div>

      {/* Form */}
      <div className="glass-card rounded-2xl p-6">
        <JobForm
          initialData={job}
          companies={companies}
          onSubmit={handleSubmit}
          submitLabel="保存修改"
        />
      </div>
    </div>
  )
}
