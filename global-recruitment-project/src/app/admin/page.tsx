'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { 
  Briefcase, 
  Building2, 
  Users, 
  FileText,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle2,
  UserPlus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface DashboardStats {
  stats: {
    totalUsers: number
    totalJobs: number
    totalCompanies: number
    totalApplications: number
    todayUsers: number
    todayJobs: number
    todayApplications: number
    weekUsers: number
    weekJobs: number
    weekApplications: number
    pendingJobs: number
    pendingCompanies: number
    activeJobs: number
  }
  recentUsers: any[]
  recentJobs: any[]
  pendingReview: {
    jobs: any[]
    companies: any[]
  }
  dailyStats: any[]
  roleDistribution: any[]
  jobStatusDistribution: any[]
}

const COLORS = ['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/admin/dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setData(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const mainStats = [
    { 
      title: '总用户数', 
      value: data?.stats.totalUsers || 0, 
      icon: Users, 
      color: 'from-neon-cyan to-neon-blue',
      href: '/admin/users',
      trend: data?.stats.todayUsers || 0,
      trendLabel: '今日新增'
    },
    { 
      title: '总职位数', 
      value: data?.stats.totalJobs || 0, 
      icon: Briefcase, 
      color: 'from-neon-purple to-neon-pink',
      href: '/admin/jobs',
      trend: data?.stats.todayJobs || 0,
      trendLabel: '今日新增'
    },
    { 
      title: '总公司数', 
      value: data?.stats.totalCompanies || 0, 
      icon: Building2, 
      color: 'from-neon-green to-neon-cyan',
      href: '/admin/companies',
      trend: data?.stats.activeJobs || 0,
      trendLabel: '上架中职位'
    },
    { 
      title: '总申请数', 
      value: data?.stats.totalApplications || 0, 
      icon: FileText, 
      color: 'from-neon-orange to-neon-yellow',
      href: '/admin/jobs',
      trend: data?.stats.todayApplications || 0,
      trendLabel: '今日申请'
    },
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">管理仪表盘</h1>
          <p className="text-gray-400 mt-1">欢迎回来，查看平台数据概况</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/jobs/new">
            <Button className="bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500">
              <Plus className="w-4 h-4 mr-2" />
              发布职位
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <div className="glass-card rounded-2xl p-6 hover:border-white/10 transition-all cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.title}</p>
                    <p className="text-3xl font-bold text-white mt-2">
                      {isLoading ? '-' : stat.value.toLocaleString()}
                    </p>
                    <div className="flex items-center mt-2 text-sm">
                      <span className="text-neon-cyan">+{stat.trend}</span>
                      <span className="text-gray-500 ml-1">{stat.trendLabel}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-neon-cyan text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  查看详情
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Daily Stats Chart */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">近7天增长趋势</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.dailyStats || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280"
                  tickFormatter={(value) => value.slice(5)}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="新用户"
                />
                <Line 
                  type="monotone" 
                  dataKey="jobs" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="新职位"
                />
                <Line 
                  type="monotone" 
                  dataKey="applications" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="新申请"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job Status Distribution */}
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">职位状态分布</h2>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.jobStatusDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="status"
                >
                  {(data?.jobStatusDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1f2937', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px'
                  }}
                  formatter={(value: any, name: any, props: any) => {
                    const statusLabels: Record<string, string> = {
                      ACTIVE: '上架中',
                      PENDING: '待审核',
                      DRAFT: '草稿',
                      CLOSED: '已关闭',
                      REJECTED: '已拒绝',
                    }
                    return [value, statusLabels[props.payload.status] || props.payload.status]
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {(data?.jobStatusDistribution || []).map((item, index) => {
              const statusLabels: Record<string, string> = {
                ACTIVE: '上架中',
                PENDING: '待审核',
                DRAFT: '草稿',
                CLOSED: '已关闭',
                REJECTED: '已拒绝',
              }
              return (
                <div key={item.status} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-400 text-sm">
                    {statusLabels[item.status] || item.status} ({item.count})
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pending Review Section */}
      {(data?.stats.pendingJobs || 0) > 0 || (data?.stats.pendingCompanies || 0) > 0 ? (
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-neon-orange" />
              <h2 className="text-lg font-semibold text-white">待审核内容</h2>
            </div>
            <div className="flex gap-4">
              {data?.stats?.pendingJobs && data.stats.pendingJobs > 0 && (
                <Link href="/admin/jobs?status=PENDING">
                  <span className="text-sm text-neon-orange">
                    {data.stats.pendingJobs} 个待审核职位 →
                  </span>
                </Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data?.pendingReview?.jobs?.slice(0, 3).map((job) => (
              <div key={job.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  <p className="text-white font-medium">{job.title}</p>
                  <p className="text-gray-400 text-sm">{job.company?.name}</p>
                </div>
                <Link href={`/admin/jobs/${job.id}`}>
                  <Button size="sm" variant="outline" className="border-white/10 text-white">
                    审核
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Recent Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-neon-cyan" />
              <h2 className="text-lg font-semibold text-white">最近注册用户</h2>
            </div>
            <Link href="/admin/users" className="text-neon-cyan text-sm hover:underline">
              查看全部
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">加载中...</div>
            ) : data?.recentUsers?.length ? (
              data.recentUsers.map((user) => (
                <div key={user.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                      <span className="text-white font-medium">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name}</p>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                  <span className={`
                    px-2 py-1 rounded-full text-xs
                    ${user.role === 'ADMIN' ? 'bg-red-500/20 text-red-400' : 
                      user.role === 'RECRUITER' ? 'bg-blue-500/20 text-blue-400' : 
                      'bg-green-500/20 text-green-400'}
                  `}>
                    {user.role === 'ADMIN' ? '管理员' : 
                     user.role === 'RECRUITER' ? '招聘方' : '求职者'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">暂无用户数据</div>
            )}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-neon-purple" />
              <h2 className="text-lg font-semibold text-white">最近发布的职位</h2>
            </div>
            <Link href="/admin/jobs" className="text-neon-cyan text-sm hover:underline">
              查看全部
            </Link>
          </div>
          <div className="divide-y divide-white/5">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">加载中...</div>
            ) : data?.recentJobs?.length ? (
              data.recentJobs.map((job) => (
                <div key={job.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-neon-cyan" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{job.title}</p>
                      <p className="text-gray-400 text-sm">{job.company?.name} · {job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`
                      px-2 py-1 rounded-full text-xs
                      ${job.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : ''}
                      ${job.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : ''}
                      ${job.status === 'CLOSED' ? 'bg-gray-500/20 text-gray-400' : ''}
                    `}>
                      {job.status === 'ACTIVE' && '上架中'}
                      {job.status === 'PENDING' && '待审核'}
                      {job.status === 'CLOSED' && '已关闭'}
                    </span>
                    <Link href={`/admin/jobs/${job.id}`}>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">暂无职位数据</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
