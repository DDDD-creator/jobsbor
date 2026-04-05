"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronDown } from "lucide-react"

interface JobStatusBadgeProps {
  status: string
  className?: string
  onChange?: (status: string) => void
  editable?: boolean
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  DRAFT: { label: "草稿", color: "text-gray-400", bgColor: "bg-gray-500/20" },
  PENDING: { label: "审核中", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  ACTIVE: { label: "招聘中", color: "text-green-400", bgColor: "bg-green-500/20" },
  PAUSED: { label: "已暂停", color: "text-orange-400", bgColor: "bg-orange-500/20" },
  CLOSED: { label: "已关闭", color: "text-red-400", bgColor: "bg-red-500/20" },
  REJECTED: { label: "已拒绝", color: "text-red-500", bgColor: "bg-red-500/20" },
}

const applicationStatusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  PENDING: { label: "待处理", color: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  VIEWED: { label: "已查看", color: "text-blue-400", bgColor: "bg-blue-500/20" },
  INTERVIEWING: { label: "面试中", color: "text-purple-400", bgColor: "bg-purple-500/20" },
  OFFERED: { label: "已发offer", color: "text-cyan-400", bgColor: "bg-cyan-500/20" },
  REJECTED: { label: "已拒绝", color: "text-red-400", bgColor: "bg-red-500/20" },
  HIRED: { label: "已录用", color: "text-green-400", bgColor: "bg-green-500/20" },
  WITHDRAWN: { label: "已撤回", color: "text-gray-400", bgColor: "bg-gray-500/20" },
}

export function JobStatusBadge({ status, className, onChange, editable = false }: JobStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const config = statusConfig[status] || { label: status, color: "text-gray-400", bgColor: "bg-gray-500/20" }

  if (!editable) {
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.color,
        config.bgColor,
        "border-current/20",
        className
      )}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
          config.color,
          config.bgColor,
          "border-current/20 hover:opacity-80",
          className
        )}
      >
        {config.label}
        <ChevronDown className="h-3 w-3" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 w-32 bg-[#1a2332] border border-white/10 rounded-lg shadow-xl overflow-hidden">
            {Object.entries(statusConfig).map(([key, value]) => (
              <button
                key={key}
                onClick={() => {
                  onChange?.(key)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-white/5 transition-colors",
                  value.color
                )}
              >
                {value.label}
                {status === key && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export function ApplicationStatusBadge({ status, className, onChange, editable = false }: JobStatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const config = applicationStatusConfig[status] || { label: status, color: "text-gray-400", bgColor: "bg-gray-500/20" }

  if (!editable) {
    return (
      <span className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        config.color,
        config.bgColor,
        "border-current/20",
        className
      )}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors",
          config.color,
          config.bgColor,
          "border-current/20 hover:opacity-80",
          className
        )}
      >
        {config.label}
        <ChevronDown className="h-3 w-3" />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 mt-1 w-32 bg-[#1a2332] border border-white/10 rounded-lg shadow-xl overflow-hidden">
            {Object.entries(applicationStatusConfig).map(([key, value]) => (
              <button
                key={key}
                onClick={() => {
                  onChange?.(key)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-white/5 transition-colors",
                  value.color
                )}
              >
                {value.label}
                {status === key && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}