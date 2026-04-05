import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { registerClient, removeClient, sendUnreadCount } from "@/lib/sse-notifications"

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const userId = session.user.id

    const stream = new ReadableStream({
      start(controller) {
        // 存储客户端连接
        registerClient(userId, controller)

        // 发送初始连接成功消息
        const encoder = new TextEncoder()
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected", userId })}\n\n`))

        // 立即发送当前未读数量
        sendUnreadCount(userId)

        // 心跳保持连接
        const heartbeat = setInterval(() => {
          try {
            controller.enqueue(encoder.encode(`: heartbeat\n\n`))
          } catch {
            clearInterval(heartbeat)
            removeClient(userId)
          }
        }, 30000)

        // 客户端断开时清理
        req.signal.addEventListener("abort", () => {
          clearInterval(heartbeat)
          removeClient(userId)
        })
      },
      cancel() {
        removeClient(userId)
      }
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    })
  } catch (error) {
    console.error("[SSE Stream Error]", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
