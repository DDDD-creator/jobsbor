import { prisma } from "@/lib/prisma"
import { sendNotification, sendUnreadCount } from "@/lib/sse-notifications"
import { NotificationType } from "@prisma/client"

interface CreateNotificationInput {
  userId: string
  type: NotificationType
  title: string
  content: string
  data?: Record<string, any>
}

/**
 * 创建通知并触发实时推送
 */
export async function createNotification(input: CreateNotificationInput) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        content: input.content,
        data: input.data || {}
      }
    })

    // 触发实时推送
    await Promise.all([
      sendNotification(input.userId, {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        content: notification.content,
        data: notification.data,
        isRead: notification.isRead,
        createdAt: notification.createdAt
      }),
      sendUnreadCount(input.userId)
    ])

    return notification
  } catch (error) {
    console.error("[Create Notification Error]", error)
    throw error
  }
}

/**
 * 批量创建通知
 */
export async function createNotifications(inputs: CreateNotificationInput[]) {
  try {
    const notifications = await prisma.$transaction(
      inputs.map(input =>
        prisma.notification.create({
          data: {
            userId: input.userId,
            type: input.type,
            title: input.title,
            content: input.content,
            data: input.data || {}
          }
        })
      )
    )

    // 触发实时推送
    await Promise.all(
      notifications.map(n =>
        Promise.all([
          sendNotification(n.userId, n),
          sendUnreadCount(n.userId)
        ])
      )
    )

    return notifications
  } catch (error) {
    console.error("[Create Notifications Error]", error)
    throw error
  }
}

/**
 * 通知企业有新申请
 */
export async function notifyNewApplication(
  employerId: string,
  applicantName: string,
  jobTitle: string,
  jobId: string,
  applicationId: string
) {
  return createNotification({
    userId: employerId,
    type: "NEW_APPLICATION",
    title: "收到新申请",
    content: `${applicantName} 申请了您的职位：${jobTitle}`,
    data: { jobId, applicationId, applicantName }
  })
}

/**
 * 通知求职者申请状态变更
 */
export async function notifyApplicationStatus(
  applicantId: string,
  jobTitle: string,
  companyName: string,
  status: string,
  jobId: string,
  applicationId: string,
  feedback?: string
) {
  const statusMap: Record<string, { title: string; content: string }> = {
    VIEWED: {
      title: "申请已被查看",
      content: `您在 ${companyName} 的 "${jobTitle}" 职位申请已被 HR 查看`
    },
    INTERVIEWING: {
      title: "进入面试环节",
      content: `恭喜！您在 ${companyName} 的 "${jobTitle}" 职位申请已通过初筛，请准备面试`
    },
    OFFERED: {
      title: "收到录用通知",
      content: `恭喜！${companyName} 已向您发出 "${jobTitle}" 职位的录用邀请`
    },
    REJECTED: {
      title: "申请未通过",
      content: `很遗憾，您在 ${companyName} 的 "${jobTitle}" 职位申请未通过筛选`
    },
    HIRED: {
      title: "入职成功",
      content: `恭喜！您已成功入职 ${companyName} 的 "${jobTitle}" 职位`
    }
  }

  const statusInfo = statusMap[status] || {
    title: "申请状态更新",
    content: `您在 ${companyName} 的 "${jobTitle}" 职位申请状态已更新为：${status}`
  }

  return createNotification({
    userId: applicantId,
    type: "APPLICATION_STATUS",
    title: statusInfo.title,
    content: statusInfo.content,
    data: { jobId, applicationId, status, feedback }
  })
}

/**
 * 通知企业职位被收藏
 */
export async function notifyJobFavorited(
  employerId: string,
  jobTitle: string,
  jobId: string
) {
  return createNotification({
    userId: employerId,
    type: "JOB_RECOMMENDATION",
    title: "职位被收藏",
    content: `您的职位 "${jobTitle}" 被一位求职者收藏`,
    data: { jobId, type: "favorited" }
  })
}

/**
 * 发送面试邀请通知
 */
export async function notifyInterviewInvite(
  applicantId: string,
  jobTitle: string,
  companyName: string,
  interviewTime: string,
  interviewLocation?: string,
  interviewLink?: string,
  jobId?: string,
  applicationId?: string
) {
  let content = `您有一场面谈邀请，职位：${jobTitle}，时间：${interviewTime}`
  
  if (interviewLocation) {
    content += `，地点：${interviewLocation}`
  }
  if (interviewLink) {
    content += `，线上面试链接已发送`
  }

  return createNotification({
    userId: applicantId,
    type: "INTERVIEW_INVITE",
    title: `面试邀请 - ${companyName}`,
    content,
    data: { jobId, applicationId, interviewTime, interviewLocation, interviewLink }
  })
}

/**
 * 发送系统通知
 */
export async function notifySystem(
  userId: string,
  title: string,
  content: string,
  data?: Record<string, any>
) {
  return createNotification({
    userId,
    type: "SYSTEM",
    title,
    content,
    data
  })
}
