import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// GET: 获取未读通知数量
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const [unreadCount, totalCount] = await Promise.all([
      prisma.notification.count({
        where: {
          userId: session.user.id,
          isRead: false
        }
      }),
      prisma.notification.count({
        where: {
          userId: session.user.id
        }
      })
    ])

    return NextResponse.json({
      unreadCount,
      totalCount
    })
  } catch (error) {
    console.error("[Get Unread Count Error]", error)
    return NextResponse.json(
      { error: "获取未读数量失败" },
      { status: 500 }
    )
  }
}
