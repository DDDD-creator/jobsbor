'use client'

import { useState, useRef, useEffect } from 'react'
import { useNotifications } from '@/hooks/use-notifications'
import { NotificationBell } from './NotificationBell'
import { NotificationDropdown } from './NotificationDropdown'
import { cn } from '@/lib/utils'

interface NotificationBellWithDropdownProps {
  className?: string
}

export function NotificationBellWithDropdown({ className }: NotificationBellWithDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { unreadCount, fetchNotifications } = useNotifications()

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 打开下拉框时刷新通知列表
  const handleOpen = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)
    if (newIsOpen) {
      fetchNotifications(1)
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <NotificationBell onClick={handleOpen} />
      <NotificationDropdown isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  )
}
