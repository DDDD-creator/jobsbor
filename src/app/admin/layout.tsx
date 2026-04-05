'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Briefcase,
  Building2,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { href: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { href: '/admin/jobs', label: '职位管理', icon: Briefcase },
  { href: '/admin/companies', label: '公司管理', icon: Building2 },
  { href: '/admin/users', label: '用户管理', icon: Users },
  { href: '/admin/settings', label: '系统设置', icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    // 验证token并获取用户信息
    fetch('/api/admin/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Unauthorized')
        return res.json()
      })
      .then((data) => {
        setUser(data.user)
        setIsLoading(false)
      })
      .catch(() => {
        localStorage.removeItem('admin_token')
        router.push('/admin/login')
      })
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-500 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-500 flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 bottom-0 z-40 bg-dark-200/50 backdrop-blur-xl border-r border-white/5 transition-all duration-300',
          isSidebarOpen ? 'w-64' : 'w-16'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-white text-lg">Jobsbor</span>
            )}
          </Link>
        </div>

        {/* Menu */}
        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                  isSidebarOpen ? 'justify-start' : 'justify-center',
                  isActive
                    ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 text-neon-cyan border border-neon-cyan/20'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
                title={!isSidebarOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/5">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isSidebarOpen ? (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span className="ml-2 text-sm">收起</span>
              </>
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

          {isSidebarOpen && (
            <div className="mt-3 pt-3 border-t border-white/5">
              <div className="px-3 mb-3">
                <p className="text-sm text-white font-medium truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-gray-400 hover:text-red-400 hover:bg-red-500/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300',
          isSidebarOpen ? 'ml-64' : 'ml-16'
        )}
      >
        {children}
      </main>
    </div>
  )
}
