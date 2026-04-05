"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  Settings,
  ChevronRight,
} from "lucide-react"

interface EmployerSidebarProps {
  className?: string
}

const navItems = [
  {
    title: "仪表盘",
    href: "/employer/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "企业资料",
    href: "/employer/profile",
    icon: Building2,
  },
  {
    title: "职位管理",
    href: "/employer/jobs",
    icon: Briefcase,
  },
  {
    title: "申请者管理",
    href: "/employer/applications",
    icon: Users,
  },
]

export function EmployerSidebar({ className }: EmployerSidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("w-64 min-h-screen bg-[#0d1429] border-r border-white/10", className)}>
      {/* Logo区域 */}
      <div className="p-6 border-b border-white/10">
        <Link href="/employer/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">企业后台</h2>
            <p className="text-xs text-gray-400">HR管理中心</p>
          </div>
        </Link>
      </div>

      {/* 导航菜单 */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`)
          const Icon = item.icon
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-white border border-cyan-500/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-cyan-400" : "text-gray-500 group-hover:text-gray-300"
              )} />
              <span className="font-medium">{item.title}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 ml-auto text-cyan-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* 底部信息 */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ChevronRight className="h-4 w-4 rotate-180" />
          返回首页
        </Link>
      </div>
    </div>
  )
}