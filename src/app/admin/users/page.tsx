'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Users, 
  Plus, 
  Shield, 
  User,
  UserCircle,
  MoreHorizontal,
  Pencil,
  Lock,
  Loader2,
  Search,
  Filter,
  Ban,
  CheckCircle,
  Eye,
  Briefcase,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface UserData {
  id: string
  email: string
  name: string
  role: string
  status: string
  createdAt: string
  _count?: {
    applications: number
    jobs: number
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [keyword, setKeyword] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'JOBSEEKER',
  })

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, roleFilter, statusFilter])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const token = localStorage.getItem('admin_token')
      
      const params = new URLSearchParams()
      params.set('page', pagination.page.toString())
      params.set('limit', pagination.limit.toString())
      if (keyword) params.set('keyword', keyword)
      if (roleFilter !== 'all') params.set('role', roleFilter)
      if (statusFilter !== 'all') params.set('status', statusFilter)

      const response = await fetch(`/api/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setPagination(prev => ({ ...prev, ...data.pagination }))
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchUsers()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newUser = await response.json()
        setUsers([newUser, ...users])
        setIsDialogOpen(false)
        setFormData({ email: '', name: '', password: '', role: 'JOBSEEKER' })
      } else {
        const err = await response.json()
        setError(err.error || '创建失败')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    const confirmMessage = currentStatus === 'ACTIVE' 
      ? '确定要禁用该用户吗？' 
      : '确定要启用该用户吗？'

    if (!confirm(confirmMessage)) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setUsers(users.map(user => 
          user.id === userId ? { ...user, status: newStatus } : user
        ))
      }
    } catch (error) {
      console.error('Failed to toggle status:', error)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('确定要删除该用户吗？此操作不可恢复。')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        setUsers(users.filter(user => user.id !== userId))
      }
    } catch (error) {
      console.error('Failed to delete user:', error)
    }
  }

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      ADMIN: 'bg-red-500/20 text-red-400',
      RECRUITER: 'bg-blue-500/20 text-blue-400',
      JOBSEEKER: 'bg-green-500/20 text-green-400',
    }
    const labels: Record<string, string> = {
      ADMIN: '管理员',
      RECRUITER: '招聘方',
      JOBSEEKER: '求职者',
    }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${styles[role] || styles.JOBSEEKER}`}>
        {role === 'ADMIN' && <Shield className="w-3 h-3" />}
        {role === 'RECRUITER' && <Briefcase className="w-3 h-3" />}
        {role === 'JOBSEEKER' && <User className="w-3 h-3" />}
        {labels[role] || role}
      </span>
    )
  }

  const getStatusBadge = (status: string) => {
    return status === 'ACTIVE' ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400">
        <CheckCircle className="w-3 h-3" />
        正常
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-400">
        <Ban className="w-3 h-3" />
        禁用
      </span>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">用户管理</h1>
          <p className="text-gray-400 mt-1">管理系统用户和权限</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500">
              <Plus className="w-4 h-4 mr-2" />
              添加用户
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-dark-200 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle>添加新用户</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label>邮箱 *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>姓名 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>密码 *</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={8}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label>角色</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JOBSEEKER">求职者</SelectItem>
                    <SelectItem value="RECRUITER">招聘方</SelectItem>
                    <SelectItem value="ADMIN">管理员</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500"
              >
                {isSubmitting ? '创建中...' : '创建用户'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                placeholder="搜索用户姓名或邮箱..."
                className="pl-10 bg-white/5 border-white/10 text-white"
              />
            </div>
          </div>

          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              <SelectItem value="ADMIN">管理员</SelectItem>
              <SelectItem value="RECRUITER">招聘方</SelectItem>
              <SelectItem value="JOBSEEKER">求职者</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="ACTIVE">正常</SelectItem>
              <SelectItem value="SUSPENDED">禁用</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleSearch} className="border-white/10 text-white hover:bg-white/5">
            <Filter className="w-4 h-4 mr-2" />
            筛选
          </Button>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-white/5">
            <tr className="text-left">
              <th className="px-6 py-4 text-sm font-medium text-gray-400">用户</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400">角色</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400">状态</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400">申请/职位</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400">创建时间</th>
              <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-neon-cyan" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  暂无用户数据
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                        <span className="text-white font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.name}</p>
                        <p className="text-gray-500 text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 text-gray-400">
                    <div className="flex gap-3">
                      <span>{user._count?.applications || 0} 申请</span>
                      <span>{user._count?.jobs || 0} 职位</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
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
                          <Link href={`/admin/users/${user.id}`} className="text-gray-300 focus:text-white">
                            <Eye className="w-4 h-4 mr-2" />
                            查看详情
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={user.status === 'ACTIVE' ? 'text-red-400' : 'text-green-400'}
                        >
                          {user.status === 'ACTIVE' ? (
                            <>
                              <Ban className="w-4 h-4 mr-2" />
                              禁用用户
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              启用用户
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(user.id)}
                          className="text-red-400 focus:text-red-400"
                        >
                          <Lock className="w-4 h-4 mr-2" />
                          删除用户
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
