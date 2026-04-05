'use client'

import { useRouter } from 'next/navigation'
import { Check, CheckCheck, Loader2, Trash2 } from 'lucide-react'
import { useNotifications } from '@/hooks/use-notifications'
import { NotificationItem } from './NotificationItem'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface NotificationDropdownProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const router = useRouter()
  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    pagination,
    markAllAsRead,
    loadMore
  } = useNotifications()

  const handleViewAll = () => {
    onClose()
    router.push('/notifications')
  }

  if (!isOpen) return null

  return (
    <>
      {/* 移动端遮罩 */}
      <div 
        className="fixed inset-0 bg-black/20 z-40 sm:hidden" 
        onClick={onClose}
      />
      
      <div className={cn(
        "fixed sm:absolute right-0 sm:right-0 top-16 sm:top-full sm:mt-2",
        "w-full sm:w-[400px] max-w-[100vw]",
        "bg-background border rounded-lg shadow-lg z-50",
        "animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
        "origin-top-right"
      )}>
        {/* 头部 */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">通知</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded-full">
                {unreadCount} 条未读
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1" />
                全部已读
              </Button>
            )}
          </div>
        </div>

        {/* 通知列表 */}
        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <Check className="h-10 w-10 mb-2 opacity-50" />
              <p>暂无通知</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.slice(0, 5).map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  compact
                  onClick={onClose}
                />
              ))}
              
              
              {/* 加载更多 */}
              {notifications.length > 5 && pagination.hasMore && (
                <div className="p-3 text-center">
                  {isLoadingMore ? (
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={loadMore}
                    >
                      加载更多
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* 底部 */}
        <Separator />
        <div className="p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-xs"
            onClick={handleViewAll}
          >
            查看全部通知
          </Button>
        </div>
      </div>
    </>
  )
}
