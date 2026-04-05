// SSE 通知推送模块
import { prisma } from "@/lib/prisma"

// SSE 连接管理
const clients = new Map<string, ReadableStreamDefaultController>()

// 注册客户端连接
export function registerClient(userId: string, controller: ReadableStreamDefaultController) {
  clients.set(userId, controller)
}

// 移除客户端连接
export function removeClient(userId: string) {
  clients.delete(userId)
}

// 发送未读数量给指定用户
export async function sendUnreadCount(userId: string) {
  const controller = clients.get(userId)
  if (!controller) return

  try {
    const unreadCount = await prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    })

    const encoder = new TextEncoder()
    controller.enqueue(encoder.encode(
      `data: ${JSON.stringify({ type: "unread_count", count: unreadCount })}\n\n`
    ))
  } catch (error) {
    console.error("[Send Unread Count Error]", error)
    clients.delete(userId)
  }
}

// 发送新通知给指定用户
export async function sendNotification(userId: string, notification: any) {
  const controller = clients.get(userId)
  if (!controller) return

  try {
    const encoder = new TextEncoder()
    controller.enqueue(encoder.encode(
      `data: ${JSON.stringify({ type: "new_notification", notification })}\n\n`
    ))
  } catch (error) {
    console.error("[Send Notification Error]", error)
    clients.delete(userId)
  }
}
