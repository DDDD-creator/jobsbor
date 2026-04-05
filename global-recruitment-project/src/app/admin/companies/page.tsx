'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Briefcase,
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

interface Company {
  id: string
  name: string
  slug: string
  logo: string | null
  location: string | null
  industry: string
  website: string | null
  isActive: boolean
  _count: {
    jobs: number
  }
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [industry, setIndustry] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  useEffect(() => {
    fetchCompanies()
  }, [pagination.page, industry])

  const fetchCompanies = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('admin_token')
      
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())
      if (industry !== 'all') params.set('industry', industry)
      if (keyword) params.set('keyword', keyword)

      const response = await fetch(`/api/admin/companies?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies)
        setPagination(prev => ({ ...prev, ...data.pagination }))
      }
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchCompanies()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这家公司吗？相关的所有职位也会被删除。')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/companies/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setCompanies(companies.filter(c => c.id !== id))
      }
    } catch (error) {
      console.error('Failed to delete company:', error)
    }
  }

  const getIndustryLabel = (industry: string) => {
    const labels: Record<string, string> = {
      finance: '金融',
      web3: 'Web3',
      internet: '互联网',
    }
    return labels[industry] || industry
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">公司管理</h1>
          <p className="text-gray-400 mt-1">管理所有公司信息</p>
        </div>
        <Link href="/admin/companies/new">
          <Button className="bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500">
            <Plus className="w-4 h-4 mr-2" />
            添加公司
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
                placeholder="搜索公司名称..."
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

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

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-neon-cyan" />
          </div>
        ) : companies.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-500">
            暂无公司数据
          </div>
        ) : (
          companies.map((company) => (
            <div key={company.id} className="glass-card rounded-2xl p-6 hover:border-white/10 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-xl font-bold text-white">
                    {company.logo ? (
                      <img src={company.logo} alt={company.name} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      company.name.charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{company.name}</h3>
                    <span className="text-xs text-gray-500">{company.slug}</span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-dark-200 border-white/10">
                    <DropdownMenuItem asChild>
                      <Link href={`/companies/${company.slug}`} target="_blank" className="text-gray-300">
                        <Eye className="w-4 h-4 mr-2" />
                        查看
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/companies/${company.id}`} className="text-gray-300">
                        <Pencil className="w-4 h-4 mr-2" />
                        编辑
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(company.id)}
                      className="text-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-400">
                  <span className="text-neon-cyan">{getIndustryLabel(company.industry)}</span>
                  {company.location && (
                    <>
                      <span className="mx-2">·</span>
                      <span>{company.location}</span>
                    </>
                  )}
                </div>

                {company.website && (
                  <a 
                    href={company.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:underline block truncate"
                  >
                    {company.website}
                  </a>
                )}

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center text-gray-400">
                    <Briefcase className="w-4 h-4 mr-1" />
                    <span>{company._count.jobs} 个职位</span>
                  </div>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs
                    ${company.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}
                  `}>
                    {company.isActive ? '正常' : '禁用'}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
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
  )
}
