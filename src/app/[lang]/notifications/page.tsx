'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { CheckCheck, Loader2, Trash2, Bell } from 'lucide-react'
import { useNotifications } from '@/hooks/use-notifications'
import { NotificationItem } from '@/components/notifications/NotificationItem'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function NotificationsPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    pagination,
    fetchNotifications,
    loadMore,
    markAllAsRead,
    deleteNotifications
  } = useNotifications()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/notifications')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotifications(1)
    }
  }, [status, fetchNotifications])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const unreadNotifications = notifications.filter(n => !n.isRead)
  const readNotifications = notifications.filter(n => n.isRead)

  return (
    <div className="container max-w-4xl py-8 px-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>通知中心</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                共 {notifications.length} 条通知
                {unreadCount > 0 && (
                  <span className="ml-2 text-primary">({unreadCount} 条未读)</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
              >
                <CheckCheck className="h-4 w-4 mr-1" />
                全部已读
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => deleteNotifications()}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                清空
              </Button>
            )}
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="all">
                  全部
                  <span className="ml-1.5 text-xs text-muted-foreground">({notifications.length})</span>
                </TabsTrigger>
                <TabsTrigger value="unread">
                  未读
                  {unreadCount > 0 && (
                    <span className="ml-1.5 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="read">
                  已读
                  <span className="ml-1.5 text-xs text-muted-foreground">({readNotifications.length})</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0">
              <NotificationList
                notifications={notifications}
                isLoading={isLoading}
                isLoadingMore={isLoadingMore}
                pagination={pagination}
                loadMore={loadMore}
              />
            </TabsContent>

            <TabsContent value="unread" className="mt-0">
              <NotificationList
                notifications={unreadNotifications}
                isLoading={isLoading}
                emptyMessage="暂无未读通知"
              />
            </TabsContent>

            <TabsContent value="read" className="mt-0">
              <NotificationList
                notifications={readNotifications}
                isLoading={isLoading}
                emptyMessage="暂无已读通知"
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface NotificationListProps {
  notifications: ReturnType<typeof useNotifications>['notifications']
  isLoading: boolean
  isLoadingMore?: boolean
  pagination?: ReturnType<typeof useNotifications>['pagination']
  loadMore?: () => Promise<void>
  emptyMessage?: string
}

function NotificationList({
  notifications,
  isLoading,
  isLoadingMore,
  pagination,
  loadMore,
  emptyMessage = '暂无通知'
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <Bell className="h-12 w-12 mb-3 opacity-30" />
        <p>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      <div className="divide-y">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>

      {pagination?.hasMore && loadMore && (
        <div className="p-4 text-center">
          <Button
            variant="ghost"
            onClick={loadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                加载中...
              </>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      )}
    </>
  )
}
