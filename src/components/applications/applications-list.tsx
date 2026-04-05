'use client'

import { useApplications, statusColors, type ApplicationStatus } from '@/hooks/use-applications'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Briefcase, 
  ArrowRight, 
  FileText, 
  Trash2,
  Send,
  Clock,
  Trophy,
  XCircle,
  Bookmark
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Toaster, toast } from '@/components/ui/sonner'

const statusIcons = {
  saved: Bookmark,
  applied: Send,
  interview: Clock,
  offer: Trophy,
  rejected: XCircle,
  withdrawn: Trash2,
}

export function ApplicationsList() {
  const { applications, getStats, removeApplication, updateStatus } = useApplications()
  const stats = getStats()

  const handleRemove = (jobId: string) => {
    if (confirm('确定要删除这个申请记录吗？')) {
      removeApplication(jobId)
      toast.success('已删除申请记录')
    }
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
          <FileText className="h-10 w-10 text-gray-500" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4">暂无申请记录</h1>
        <p className="text-gray-400 mb-8">
          浏览职位并点击"申请职位"，您的申请进度将显示在这里
        </p>
        
        <LocalizedLink href="/jobs">
          <Button 
            className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90"
          >
            浏览职位
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </LocalizedLink>

        <Toaster />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="全部" 
          value={stats.total} 
          icon={FileText} 
          color="text-white" 
          bg="bg-white/5"
        />
        <StatCard 
          label="已申请" 
          value={stats.applied} 
          icon={Send} 
          color="text-blue-400" 
          bg="bg-blue-500/10"
        />
        <StatCard 
          label="面试中" 
          value={stats.interview} 
          icon={Clock} 
          color="text-yellow-400" 
          bg="bg-yellow-500/10"
        />
        <StatCard 
          label="已录用" 
          value={stats.offer} 
          icon={Trophy} 
          color="text-green-400" 
          bg="bg-green-500/10"
        />
      </div>

      {/* 申请列表 */}
      <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
        <Briefcase className="h-8 w-8 text-neon-cyan" />
        申请追踪
      </h1>

      <div className="space-y-4">
        {applications.map((app) => {
          const StatusIcon = statusIcons[app.status]
          const statusInfo = statusColors[app.status]

          return (
            <LocalizedLink key={app.id} href={`/jobs/${app.id}`}>
              <Card className="group border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-neon-cyan" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-neon-cyan transition-colors">
                            {app.title}
                          </h3>
                          <p className="text-sm text-gray-400">{app.company}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <Badge variant="outline" size="sm">{app.location}</Badge>
                        <Badge variant="neon" color="cyan" size="sm">{app.salary}</Badge>
                        
                        <Badge 
                          className={cn(statusInfo.bg, statusInfo.color, "border-0")}
                          size="sm"
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>

                        {app.appliedAt && (
                          <span className="text-xs text-gray-500">
                            申请于 {new Date(app.appliedAt).toLocaleDateString('zh-CN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* 快速状态切换 */}
                      <select
                        value={app.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          e.stopPropagation()
                          updateStatus(app.id, e.target.value as ApplicationStatus)
                          toast.success('状态已更新')
                        }}
                        className="bg-transparent text-sm text-gray-300 border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-neon-cyan"
                      >
                        {Object.entries(statusColors).map(([status, info]) => (
                          <option key={status} value={status} className="bg-[#1a1f2e]">
                            {info.label}
                          </option>
                        ))}
                      </select>

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleRemove(app.id)
                        }}
                        className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                        aria-label="删除"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </LocalizedLink>
          )
        })}
      </div>

      <Toaster />
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color, bg }: {
  label: string
  value: number
  icon: React.ComponentType<{ className?: string }>
  color: string
  bg: string
}) {
  return (
    <div className={cn("p-4 rounded-xl border border-white/10", bg)}>
      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-sm">{label}</span>
        <Icon className={cn("h-5 w-5", color)} />
      </div>
      <div className={cn("text-2xl font-bold mt-1", color)}>{value}</div>
    </div>
  )
}
