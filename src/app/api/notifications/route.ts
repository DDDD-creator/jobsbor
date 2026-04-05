import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// GET: 获取用户通知列表
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const unreadOnly = searchParams.get("unreadOnly") === "true"

    const skip = (page - 1) * limit

    // 构建查询条件
    const where: any = {
      userId: session.user.id
    }
    
    if (unreadOnly) {
      where.isRead = false
    }

    // 获取通知列表和总数
    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.notification.count({ where })
    ])

    return NextResponse.json({
      notifications: notifications.map(n => ({
        id: n.id,
        type: n.type,
        title: n.title,
        content: n.content,
        data: n.data,
        isRead: n.isRead,
        readAt: n.readAt,
        createdAt: n.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + notifications.length < total
      }
    })
  } catch (error) {
    console.error("[Get Notifications Error]", error)
    return NextResponse.json(
      { error: "获取通知失败" },
      { status: 500 }
    )
  }
}

// PATCH: 标记通知为已读（批量/单个）
const markReadSchema = z.object({
  ids: z.array(z.string()).optional(), // 指定ID列表，不传则标记所有
  all: z.boolean().optional() // 标记所有未读
})

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const body = await req.json()
    const result = markReadSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "参数错误", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { ids, all } = result.data

    // 构建更新条件
    const where: any = {
      userId: session.user.id,
      isRead: false
    }

    if (ids && ids.length > 0) {
      where.id = { in: ids }
    } else if (!all) {
      return NextResponse.json(
        { error: "请指定通知ID或设置 all: true" },
        { status: 400 }
      )
    }

    // 更新通知为已读
    const { count } = await prisma.notification.updateMany({
      where,
      data: {
        isRead: true,
        readAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      message: `已标记 ${count} 条通知为已读`,
      count
    })
  } catch (error) {
    console.error("[Mark Read Notifications Error]", error)
    return NextResponse.json(
      { error: "标记已读失败" },
      { status: 500 }
    )
  }
}

// DELETE: 删除通知
const deleteSchema = z.object({
  ids: z.array(z.string()).optional(),
  all: z.boolean().optional()
})

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const body = await req.json()
    const result = deleteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "参数错误" },
        { status: 400 }
      )
    }

    const { ids, all } = result.data

    const where: any = {
      userId: session.user.id
    }

    if (ids && ids.length > 0) {
      where.id = { in: ids }
    } else if (!all) {
      return NextResponse.json(
        { error: "请指定通知ID或设置 all: true" },
        { status: 400 }
      )
    }

    const { count } = await prisma.notification.deleteMany({ where })

    return NextResponse.json({
      success: true,
      message: `已删除 ${count} 条通知`,
      count
    })
  } catch (error) {
    console.error("[Delete Notifications Error]", error)
    return NextResponse.json(
      { error: "删除通知失败" },
      { status: 500 }
    )
  }
}
