'use client'

import { useState } from 'react'
import { useApplications, statusColors, type ApplicationStatus } from '@/hooks/use-applications'
import { Button } from '@/components/ui/button'
import { 
  Send, 
  CheckCircle, 
  Clock, 
  Trophy, 
  XCircle, 
  Bookmark,
  ChevronDown 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ApplyButtonProps {
  jobId: string
  jobTitle: string
  company: string
  location: string
  salary: string
  applyUrl?: string
  className?: string
}

export function ApplyButton({ 
  jobId, 
  jobTitle, 
  company, 
  location, 
  salary, 
  applyUrl,
  className 
}: ApplyButtonProps) {
  const { getStatus, apply, updateStatus } = useApplications()
  const currentStatus = getStatus(jobId)
  const [showConfirm, setShowConfirm] = useState(false)

  // 未申请状态
  if (!currentStatus) {
    return (
      <>
        <Button
          className={cn(
            "w-full gap-2 bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90",
            className
          )}
          onClick={() => setShowConfirm(true)}
        >
          <Send className="h-4 w-4" />
          申请职位
        </Button>

        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-[#1a1f2e] border border-white/10 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-semibold text-white mb-2">确认申请？</h3>
              <p className="text-gray-400 mb-6">
                点击确认将标记为"已申请"，方便后续追踪申请进度。
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/10"
                  onClick={() => setShowConfirm(false)}
                >
                  取消
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-neon-cyan to-neon-purple"
                  onClick={() => {
                    apply({ id: jobId, title: jobTitle, company, location, salary })
                    setShowConfirm(false)
                    // 如果有申请链接，打开新窗口
                    if (applyUrl) {
                      window.open(applyUrl, '_blank')
                    }
                  }}
                >
                  确认申请
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // 已申请状态 - 显示状态切换器
  const statusInfo = statusColors[currentStatus]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full gap-2 border-white/10",
            statusInfo.bg,
            statusInfo.color,
            className
          )}
        >
          {currentStatus === 'applied' && <CheckCircle className="h-4 w-4" />}
          {currentStatus === 'interview' && <Clock className="h-4 w-4" />}
          {currentStatus === 'offer' && <Trophy className="h-4 w-4" />}
          {currentStatus === 'rejected' && <XCircle className="h-4 w-4" />}
          {currentStatus === 'saved' && <Bookmark className="h-4 w-4" />}
          {statusInfo.label}
          <ChevronDown className="h-4 w-4 ml-auto" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48 bg-[#1a1f2e] border-white/10">
        {Object.entries(statusColors).map(([status, info]) => (
          <DropdownMenuItem
            key={status}
            onClick={() => updateStatus(jobId, status as ApplicationStatus)}
            className={cn(
              "cursor-pointer",
              currentStatus === status && "bg-white/10",
              info.color
            )}
          >
            {info.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
