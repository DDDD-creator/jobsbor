"use client"

export const dynamic = "force-dynamic"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { EmployerLayout } from "@/components/employer/EmployerLayout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Pause, 
  Play,
  Eye,
  Loader2,
} from "lucide-react"
import { JobStatusBadge } from "@/components/employer/StatusBadge"
import Link from "next/link"
import { toast } from "sonner"
import { Pagination } from "@/components/ui/pagination"

interface Job {
  id: string
  title: string
  slug: string
  status: string
  location: string
  remote: string
  type: string
  level: string
  salaryMin?: number
  salaryMax?: number
  salaryNegotiable: boolean
  isUrgent: boolean
  isFeatured: boolean
  publishedAt?: string
  expiresAt?: string
  createdAt: string
  viewCount: number
  applyCount: number
  applicationCount: number
  company: {
    name: string
    logo?: string
  }
}

const statusOptions = [
  { value: "all", label: "全部状态" },
  { value: "ACTIVE", label: "招聘中" },
  { value: "PAUSED", label: "已暂停" },
  { value: "CLOSED", label: "已关闭" },
  { value: "DRAFT", label: "草稿" },
]

export default function EmployerJobsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all")

  useEffect(() => {
    if (status === "loading") return
    
    if (status === "unauthenticated") {
      router.push("/auth/login")
      return
    }

    if (session?.user?.role !== "RECRUITER" && session?.user?.role !== "ADMIN") {
      router.push("/employer/register")
      return
    }

    fetchJobs()
  }, [status, session, router, currentPage, statusFilter])

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams()
      params.set("page", currentPage.toString())
      params.set("limit", "10")
      if (statusFilter !== "all") params.set("status", statusFilter)
      if (searchQuery) params.set("search", searchQuery)

      const res = await fetch(`/api/employer/jobs?${params}`)
      if (!res.ok) throw new Error("获取职位列表失败")
      const data = await res.json()
      setJobs(data.jobs)
      setTotalPages(data.pagination.totalPages)
    } catch (error) {
      toast.error("获取职位列表失败")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCurrentPage(1)
    fetchJobs()
  }

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/employer/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!res.ok) throw new Error("更新失败")
      toast.success("状态已更新")
      fetchJobs()
    } catch (error) {
      toast.error("更新失败")
    }
  }

  const handleDelete = async (jobId: string) => {
    if (!confirm("确定要删除这个职位吗？此操作不可恢复。")) return
    
    try {
      const res = await fetch(`/api/employer/jobs/${jobId}`, {
        method: "DELETE",
      })
      
      if (!res.ok) throw new Error("删除失败")
      toast.success("职位已删除")
      fetchJobs()
    } catch (error) {
      toast.error("删除失败")
    }
  }

  const getRemoteText = (remote: string) => {
    const map: Record<string, string> = {
      ONSITE: "办公室",
      REMOTE: "远程",
      HYBRID: "混合",
    }
    return map[remote] || remote
  }

  const getTypeText = (type: string) => {
    const map: Record<string, string> = {
      FULLTIME: "全职",
      PARTTIME: "兼职",
      CONTRACT: "合同",
      INTERNSHIP: "实习",
    }
    return map[type] || type
  }

  const formatSalary = (job: Job) => {
    if (job.salaryNegotiable) return "薪资面议"
    if (!job.salaryMin && !job.salaryMax) return "薪资面议"
    if (job.salaryMin && job.salaryMax) {
      return `${job.salaryMin}-${job.salaryMax}K`
    }
    return job.salaryMin ? `${job.salaryMin}K+` : `-${job.salaryMax}K`
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
      <div className="space-y-6">
        {/* 头部 */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">职位管理</h1>
            <p className="text-gray-400 mt-1">管理您发布的所有职位</p>
          </div>
          <Link href="/employer/jobs/new">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              发布新职位
            </Button>
          </Link>
        </div>

        {/* 筛选栏 */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="搜索职位名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button variant="outline" onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 职位列表 */}
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-gray-400">职位信息</TableHead>
                  <TableHead className="text-gray-400">工作地点</TableHead>
                  <TableHead className="text-gray-400">薪资</TableHead>
                  <TableHead className="text-gray-400">状态</TableHead>
                  <TableHead className="text-gray-400">数据</TableHead>
                  <TableHead className="text-gray-400 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                      暂无职位，<Link href="/employer/jobs/new" className="text-cyan-400 hover:underline">立即发布</Link>
                    </TableCell>
                  </TableRow>
                ) : (
                  jobs.map((job) => (
                    <TableRow key={job.id} className="border-white/10">
                      <TableCell>
                        <div>
                          <Link 
                            href={`/jobs/${job.slug}`}
                            className="font-medium text-white hover:text-cyan-400 transition-colors"
                          >
                            {job.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                            <span>{getTypeText(job.type)}</span>
                            <span>•</span>
                            <span>{getRemoteText(job.remote)}</span>
                            {job.isUrgent && (
                              <>
                                <span>•</span>
                                <span className="text-red-400">急招</span>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{job.location}</TableCell>
                      <TableCell className="text-gray-300">{formatSalary(job)}</TableCell>
                      <TableCell>
                        <JobStatusBadge status={job.status} />
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-400">
                          <div>{job.viewCount} 浏览</div>
                          <div className="text-cyan-400">{job.applicationCount} 申请</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-[#1a2332] border-white/10">
                            <DropdownMenuItem asChild>
                              <Link href={`/jobs/${job.slug}`} className="flex items-center">
                                <Eye className="h-4 w-4 mr-2" />
                                查看
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/employer/jobs/${job.id}/edit`} className="flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                编辑
                              </Link>
                            </DropdownMenuItem>
                            {job.status === "ACTIVE" ? (
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(job.id, "PAUSED")}
                                className="flex items-center"
                              >
                                <Pause className="h-4 w-4 mr-2" />
                                暂停招聘
                              </DropdownMenuItem>
                            ) : job.status === "PAUSED" ? (
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(job.id, "ACTIVE")}
                                className="flex items-center"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                恢复招聘
                              </DropdownMenuItem>
                            ) : null}
                            <DropdownMenuItem 
                              onClick={() => handleDelete(job.id)}
                              className="flex items-center text-red-400 focus:text-red-400"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </EmployerLayout>
  )
}