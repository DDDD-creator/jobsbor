'use client'

import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { 
  Briefcase, 
  FileText, 
  Calendar, 
  Heart, 
  Bell,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  Star
} from 'lucide-react'
import { useNotifications, Notification, NotificationType } from '@/hooks/use-notifications'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: Notification
  compact?: boolean
  onClick?: () => void
}

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string; bgColor: string }> = {
  NEW_APPLICATION: {
    icon: FileText,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10'
  },
  APPLICATION_STATUS: {
    icon: Briefcase,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10'
  },
  INTERVIEW_INVITE: {
    icon: Calendar,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10'
  },
  JOB_RECOMMENDATION: {
    icon: Heart,
    color: 'text-pink-500',
    bgColor: 'bg-pink-500/10'
  },
  SYSTEM: {
    icon: Bell,
    color: 'text-gray-500',
    bgColor: 'bg-gray-500/10'
  }
}

function getStatusIcon(status?: string) {
  switch (status) {
    case 'VIEWED':
      return <Clock className="h-3.5 w-3.5 text-yellow-500" />
    case 'INTERVIEWING':
      return <Star className="h-3.5 w-3.5 text-purple-500" />
    case 'OFFERED':
      return <Mail className="h-3.5 w-3.5 text-green-500" />
    case 'REJECTED':
      return <XCircle className="h-3.5 w-3.5 text-red-500" />
    case 'HIRED':
      return <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />
    default:
      return null
  }
}

export function NotificationItem({ notification, compact, onClick }: NotificationItemProps) {
  const router = useRouter()
  const { markAsRead } = useNotifications()
  
  const config = typeConfig[notification.type]
  const Icon = config.icon

  const handleClick = async () => {
    // 标记为已读
    if (!notification.isRead) {
      await markAsRead([notification.id])
    }

    // 导航到相关页面
    if (notification.data?.jobId) {
      router.push(`/jobs/${notification.data.jobId}`)
    } else if (notification.data?.applicationId) {
      router.push('/dashboard/applications')
    }

    onClick?.()
  }

  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
    locale: zhCN
  })

  if (compact) {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-accent",
          !notification.isRead && "bg-accent/50"
        )}
      >
        <div className={cn("flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center", config.bgColor)}>
          <Icon className={cn("h-4 w-4", config.color)} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn("text-sm font-medium line-clamp-1", !notification.isRead && "text-foreground")}>
              {notification.title}
            </p>
            <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo}</span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
            {notification.content}
          </p>
        </div>

        {!notification.isRead && (
          <span className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-1.5" />
        )}
      </button>
    )
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-start gap-4 p-4 cursor-pointer transition-colors hover:bg-accent border-b last:border-b-0",
        !notification.isRead && "bg-accent/30"
      )}
    >
      <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center", config.bgColor)}>
        <Icon className={cn("h-5 w-5", config.color)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <h4 className={cn("text-sm font-medium", !notification.isRead && "text-foreground")}>
              {notification.title}
            </h4>
            {notification.data?.status && getStatusIcon(notification.data.status)}
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">{timeAgo}</span>
        </div>

        <p className="text-sm text-muted-foreground mt-1">
          {notification.content}
        </p>

        {notification.data?.interviewTime && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            面试时间: {new Date(notification.data.interviewTime).toLocaleString('zh-CN')}
          </p>
        )}

        {notification.data?.feedback && (
          <blockquote className="text-xs text-muted-foreground mt-2 pl-3 border-l-2 border-border italic">
            HR反馈: {notification.data.feedback}
          </blockquote>
        )}
      </div>

      {!notification.isRead && (
        <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-primary mt-2" />
      )}
    </div>
  )
}
