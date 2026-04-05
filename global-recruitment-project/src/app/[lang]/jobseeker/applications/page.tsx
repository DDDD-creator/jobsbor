"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Briefcase, Clock, CheckCircle, XCircle, Building2, Eye } from "lucide-react"

interface Application {
  id: string
  status: string
  appliedAt: string
  viewedAt: string | null
  respondedAt: string | null
  feedback: string | null
  nextStep: string | null
  job: {
    id: string
    title: string
    slug: string
    location: string
    salaryMin: number | null
    salaryMax: number | null
    salaryCurrency: string
    company: {
      id: string
      name: string
      slug: string
      logo: string | null
    }
  }
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING: { label: "已投递", color: "bg-yellow-500", icon: <Clock className="h-4 w-4" /> },
  VIEWED: { label: "已查看", color: "bg-blue-500", icon: <Eye className="h-4 w-4" /> },
  INTERVIEWING: { label: "面试中", color: "bg-purple-500", icon: <Briefcase className="h-4 w-4" /> },
  OFFERED: { label: "已发offer", color: "bg-green-500", icon: <CheckCircle className="h-4 w-4" /> },
  REJECTED: { label: "已拒绝", color: "bg-red-500", icon: <XCircle className="h-4 w-4" /> },
  HIRED: { label: "已录用", color: "bg-emerald-500", icon: <CheckCircle className="h-4 w-4" /> },
}

export default function ApplicationsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // 确保在客户端运行且状态已确定
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/jobseeker/applications")
      return
    }

    if (status === "authenticated") {
      if (session?.user?.role !== "JOBSEEKER") {
        router.push("/")
        return
      }
      fetchApplications()
    }
  }, [status, session, router])

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications")
      const data = await res.json()
      if (data.applications) {
        setApplications(data.applications)
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return ["PENDING", "VIEWED", "INTERVIEWING", "OFFERED"].includes(app.status)
    if (activeTab === "closed") return ["REJECTED", "HIRED"].includes(app.status)
    return true
  })

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    })
  }

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return "薪资面议"
    const symbol = currency === "CNY" ? "¥" : "$"
    if (min && max) return `${symbol}${min/1000}k-${max/1000}k`
    if (min) return `${symbol}${min/1000}k起`
    if (max) return `${symbol}${max/1000}k以下`
    return "薪资面议"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">我的申请</h1>
            <p className="text-gray-400">追踪您的职位申请状态</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white/5 mb-6">
              <TabsTrigger value="all" className="data-[state=active]:bg-blue-500">
                全部 ({applications.length})
              </TabsTrigger>
              <TabsTrigger value="active" className="data-[state=active]:bg-blue-500">
                进行中
              </TabsTrigger>
              <TabsTrigger value="closed" className="data-[state=active]:bg-blue-500">
                已结束
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredApplications.length === 0 ? (
                <Card className="bg-white/5 border-white/10">
                  <CardContent className="py-12 text-center">
                    <Briefcase className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">
                      {activeTab === "all" ? "您还没有申请任何职位" : "该分类下没有申请"}
                    </p>
                    <Button variant="outline" onClick={() => window.location.href = "/jobs"}>
                      浏览职位
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredApplications.map((app) => (
                  <Card key={app.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Link href={`/jobs/${app.job.slug}`} className="text-xl font-semibold text-white hover:text-blue-400 transition-colors">
                              {app.job.title}
                            </Link>
                            <Badge className={`${statusConfig[app.status]?.color || "bg-gray-500"} text-white`}>
                              <span className="flex items-center gap-1">
                                {statusConfig[app.status]?.icon}
                                {statusConfig[app.status]?.label || app.status}
                              </span>
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-400 mb-3">
                            <Building2 className="h-4 w-4" />
                            <Link href={`/companies/${app.job.company.slug}`} className="hover:text-white transition-colors">
                              {app.job.company.name}
                            </Link>
                            <span className="mx-2">•</span>
                            <span>{app.job.location}</span>
                            <span className="mx-2">•</span>
                            <span className="text-blue-400">{formatSalary(app.job.salaryMin, app.job.salaryMax, app.job.salaryCurrency)}</span>
                          </div>

                          <div className="text-sm text-gray-500">
                            申请时间：{formatDate(app.appliedAt)}
                            {app.viewedAt && ` · 已查看`}
                          </div>

                          {app.feedback && (
                            <div className="mt-4 p-4 bg-white/5 rounded-lg">
                              <p className="text-sm font-medium text-gray-300 mb-1">HR反馈：</p>
                              <p className="text-sm text-gray-400">{app.feedback}</p>
                            </div>
                          )}

                          {app.nextStep && (
                            <div className="mt-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                              <p className="text-sm text-blue-400">下一步：{app.nextStep}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Button variant="outline" size="sm" onClick={() => window.location.href = `/jobs/${app.job.slug}`}>
                            查看职位
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
