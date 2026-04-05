'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

export type NotificationType = 
  | 'APPLICATION_STATUS'
  | 'NEW_APPLICATION'
  | 'INTERVIEW_INVITE'
  | 'JOB_RECOMMENDATION'
  | 'SYSTEM'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  content: string
  data?: Record<string, any>
  isRead: boolean
  readAt?: string
  createdAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  totalCount: number
  pagination: Pagination
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  fetchNotifications: (page?: number, unreadOnly?: boolean) => Promise<void>
  loadMore: () => Promise<void>
  markAsRead: (ids?: string[]) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotifications: (ids?: string[]) => Promise<void>
  refreshUnreadCount: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasMore: false
  })

  // 获取通知列表
  const fetchNotifications = useCallback(async (page = 1, unreadOnly = false) => {
    if (status !== 'authenticated') return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/notifications?page=${page}&limit=${pagination.limit}${unreadOnly ? '&unreadOnly=true' : ''}`
      )

      if (!response.ok) {
        throw new Error('获取通知失败')
      }

      const data = await response.json()

      if (page === 1) {
        setNotifications(data.notifications)
      } else {
        setNotifications(prev => [...prev, ...data.notifications])
      }

      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取通知失败')
    } finally {
      setIsLoading(false)
    }
  }, [status, pagination.limit])

  // 加载更多
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !pagination.hasMore) return

    setIsLoadingMore(true)
    await fetchNotifications(pagination.page + 1)
    setIsLoadingMore(false)
  }, [fetchNotifications, pagination.page, pagination.hasMore, isLoadingMore])

  // 获取未读数量
  const refreshUnreadCount = useCallback(async () => {
    if (status !== 'authenticated') return

    try {
      const response = await fetch('/api/notifications/unread-count')
      if (response.ok) {
        const data = await response.json()
        setUnreadCount(data.unreadCount)
        setTotalCount(data.totalCount)
      }
    } catch (error) {
      console.error('[Refresh Unread Count Error]', error)
    }
  }, [status])

  // 标记为已读
  const markAsRead = useCallback(async (ids?: string[]) => {
    if (status !== 'authenticated') return

    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids ? { ids } : { all: true })
      })

      if (!response.ok) {
        throw new Error('标记已读失败')
      }

      // 更新本地状态
      setNotifications(prev =>
        prev.map(n =>
          ids ? (ids.includes(n.id) ? { ...n, isRead: true, readAt: new Date().toISOString() } : n)
              : { ...n, isRead: true, readAt: new Date().toISOString() }
        )
      )

      // 刷新未读数量
      await refreshUnreadCount()
    } catch (error) {
      console.error('[Mark As Read Error]', error)
    }
  }, [status, refreshUnreadCount])

  // 标记所有为已读
  const markAllAsRead = useCallback(async () => {
    await markAsRead()
  }, [markAsRead])

  // 删除通知
  const deleteNotifications = useCallback(async (ids?: string[]) => {
    if (status !== 'authenticated') return

    try {
      const response = await fetch('/api/notifications', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ids ? { ids } : { all: true })
      })

      if (!response.ok) {
        throw new Error('删除通知失败')
      }

      // 更新本地状态
      if (ids) {
        setNotifications(prev => prev.filter(n => !ids.includes(n.id)))
      } else {
        setNotifications([])
      }

      // 刷新未读数量
      await refreshUnreadCount()
    } catch (error) {
      console.error('[Delete Notifications Error]', error)
    }
  }, [status, refreshUnreadCount])

  // SSE 实时连接
  useEffect(() => {
    if (status !== 'authenticated') return

    let eventSource: EventSource | null = null

    const connectSSE = () => {
      eventSource = new EventSource('/api/notifications/stream')

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          if (data.type === 'unread_count') {
            setUnreadCount(data.count)
          } else if (data.type === 'new_notification') {
            // 新通知到达，添加到列表开头
            setNotifications(prev => [data.notification, ...prev])
            setUnreadCount(prev => prev + 1)
          }
        } catch (error) {
          console.error('[SSE Message Error]', error)
        }
      }

      eventSource.onerror = () => {
        // 连接错误时重连
        eventSource?.close()
        setTimeout(connectSSE, 5000)
      }
    }

    connectSSE()

    // 初始化加载
    refreshUnreadCount()
    fetchNotifications(1)

    return () => {
      eventSource?.close()
    }
  }, [status, refreshUnreadCount, fetchNotifications])

  const value: NotificationsContextType = {
    notifications,
    unreadCount,
    totalCount,
    pagination,
    isLoading,
    isLoadingMore,
    error,
    fetchNotifications,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotifications,
    refreshUnreadCount
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    // 返回默认值而不是抛出错误，允许在 Provider 外使用
    return {
      notifications: [],
      unreadCount: 0,
      totalCount: 0,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasMore: false
      },
      isLoading: false,
      isLoadingMore: false,
      error: null,
      fetchNotifications: async () => {},
      loadMore: async () => {},
      markAsRead: async () => {},
      markAllAsRead: async () => {},
      deleteNotifications: async () => {},
      refreshUnreadCount: async () => {}
    } as NotificationsContextType
  }
  return context
}
