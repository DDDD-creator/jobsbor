'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Job {
  id: string
  title: string
  slug: string
  location: string
  type: string
  industry: string
  status: string
  createdAt: string
  company: {
    name: string
    logo: string | null
  }
}

export default function JobsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState(searchParams.get('status') || 'all')
  const [industry, setIndustry] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchJobs()
  }, [pagination.page, status, industry])

  const fetchJobs = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('admin_token')
      
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())
      if (status !== 'all') params.set('status', status)
      if (industry !== 'all') params.set('industry', industry)
      if (keyword) params.set('keyword', keyword)

      const response = await fetch(`/api/admin/jobs?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setJobs(data.jobs)
        setPagination(prev => ({ ...prev, ...data.pagination }))
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchJobs()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个职位吗？')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setJobs(jobs.filter(job => job.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete job:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ACTIVE: 'bg-green-500/20 text-green-400',
      INACTIVE: 'bg-gray-500/20 text-gray-400',
      PENDING: 'bg-yellow-500/20 text-yellow-400',
      EXPIRED: 'bg-red-500/20 text-red-400',
    }
    const labels: Record<string, string> = {
      ACTIVE: '上架中',
      INACTIVE: '已下架',
      PENDING: '待审核',
      EXPIRED: '已过期',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${styles[status] || styles.INACTIVE}`}>
        {labels[status] || status}
      </span>
    )
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'full-time': '全职',
      'part-time': '兼职',
      'contract': '合同',
      'remote': '远程',
    }
    return labels[type] || type
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">职位管理</h1>
          <p className="text-gray-400 mt-1">管理所有职位信息</p>
        </div>
        <Link href="/admin/jobs/new">
          <Button className="bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500">
            <Plus className="w-4 h-4 mr-2" />
            发布职位
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="搜索职位标题..."
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="ACTIVE">上架中</SelectItem>
              <SelectItem value="PENDING">待审核</SelectItem>
              <SelectItem value="INACTIVE">已下架</SelectItem>
            </SelectContent>
          </Select>

          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="行业" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部行业</SelectItem>
              <SelectItem value="finance">金融</SelectItem>
              <SelectItem value="web3">Web3</SelectItem>
              <SelectItem value="internet">互联网</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleSearch} className="border-white/10 text-white hover:bg-white/5">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </Button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/5">
            <tr className="text-left">
              <th className="px-6 py-4 text-sm font-medium text-gray-400">职位</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400">公司</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400">工作地点</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400">类型</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400">状态</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  暂无职位数据
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <tr key={job.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                        <Briefcase className="w-5 h-5 text-neon-cyan" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{job.title}</p>
                        <p className="text-gray-500 text-sm">{job.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{job.company?.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{job.location}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300">{getTypeLabel(job.type)}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(job.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-dark-200 border-white/10">
                        <DropdownMenuItem asChild>
                          <Link href={`/jobs/${job.slug}`} target="_blank" className="text-gray-300 focus:text-white">
                            <Eye className="w-4 h-4 mr-2" />
                            查看
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/jobs/${job.id}`} className="text-gray-300 focus:text-white">
                            <Pencil className="w-4 h-4 mr-2" />
                            编辑
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(job.id)}
                          className="text-red-400 focus:text-red-400"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              共 {pagination.total} 条记录，第 {pagination.page}/{pagination.totalPages} 页
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                className="border-white/10 text-white hover:bg-white/5"
              >
                上一页
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                className="border-white/10 text-white hover:bg-white/5"
              >
                下一页
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
