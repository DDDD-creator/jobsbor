'use client'

import { Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/use-notifications'
import { cn } from '@/lib/utils'

interface NotificationBellProps {
  className?: string
  onClick?: () => void
}

export function NotificationBell({ className, onClick }: NotificationBellProps) {
  const { unreadCount } = useNotifications()

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 rounded-full transition-colors hover:bg-accent",
        className
      )}
      aria-label={`通知 ${unreadCount > 0 ? `(${unreadCount} 条未读)` : ''}`}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white animate-in zoom-in-50">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}
