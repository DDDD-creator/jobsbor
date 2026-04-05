"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { EmployerLayout } from "@/components/employer/EmployerLayout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Briefcase, 
  Users, 
  Eye, 
  TrendingUp,
  Plus,
  ArrowRight,
  Loader2,
  Building2,
} from "lucide-react"
import { JobStatusBadge } from "@/components/employer/StatusBadge"
import Link from "next/link"
import { toast } from "sonner"

interface DashboardStats {
  jobs: {
    total: number
    active: number
    paused: number
    closed: number
  }
  applications: {
    total: number
    newThisWeek: number
    pending: number
    interviewing: number
  }
  views: number
}

interface RecentApplication {
  id: string
  status: string
  appliedAt: string
  job: { title: string; slug: string }
  applicant: { name: string; avatar?: string; headline?: string }
}

interface TopJob {
  id: string
  title: string
  slug: string
  applyCount: number
  viewCount: number
  status: string
}

interface CompanyInfo {
  name: string
  logo?: string
  verifyStatus: string
}

export default function EmployerDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([])
  const [topJobs, setTopJobs] = useState<TopJob[]>([])
  const [company, setCompany] = useState<CompanyInfo | null>(null)

  useEffect(() => {
    if (status === "loading") return
    
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }

    if (session?.user?.role !== "RECRUITER" && session?.user?.role !== "ADMIN") {
      // 检查是否已注册企业
      checkEmployerStatus()
      return
    }

    fetchDashboardData()
  }, [status, session, router])

  const checkEmployerStatus = async () => {
    try {
      const res = await fetch("/api/employer/register")
      if (res.ok) {
        const data = await res.json()
        if (!data.hasCompany) {
          router.push("/employer/register")
        } else {
          fetchDashboardData()
        }
      }
    } catch (error) {
      toast.error("获取状态失败")
    }
  }

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/employer/dashboard")
      if (!res.ok) throw new Error("获取数据失败")
      const data = await res.json()
      setStats(data.stats)
      setRecentApplications(data.recentApplications)
      setTopJobs(data.topJobs)
      setCompany(data.company)
    } catch (error) {
      toast.error("获取仪表盘数据失败")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <EmployerLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
        </div>
      </EmployerLayout>
    )
  }

  return (
    <EmployerLayout>
      <div className="space-y-8">
        {/* 头部 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">欢迎回来，{company?.name || "企业用户"}</h1>
            <p className="text-gray-400 mt-1">这里是您的招聘管理中心</p>
          </div>
          <Link href="/employer/jobs/new">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              发布新职位
            </Button>
          </Link>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">活跃职位</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.jobs.active || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">本周新申请</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.applications.newThisWeek || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">待处理申请</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.applications.pending || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">总浏览量</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats?.views?.toLocaleString() || 0}</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Eye className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 最近申请 */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">最近申请</CardTitle>
              <Link href="/employer/applications">
                <Button variant="ghost" size="sm" className="text-cyan-400">
                  查看全部
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentApplications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无申请
                </div>
              ) : (
                <div className="space-y-4">
                  {recentApplications.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-medium">
                          {app.applicant.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{app.applicant.name}</p>
                          <p className="text-sm text-gray-400">{app.job.title}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <JobStatusBadge status={app.status} />
                        <span className="text-sm text-gray-500">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 热门职位 */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-white">热门职位</CardTitle>
              <Link href="/employer/jobs">
                <Button variant="ghost" size="sm" className="text-cyan-400">
                  查看全部
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {topJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  暂无职位
                </div>
              ) : (
                <div className="space-y-4">
                  {topJobs.map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium truncate">{job.title}</p>
                          <JobStatusBadge status={job.status} />
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {job.viewCount} 浏览
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {job.applyCount} 申请
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </EmployerLayout>
  )
}