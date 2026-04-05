import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { notifyJobFavorited } from "@/lib/notifications"

const favoriteSchema = z.object({
  jobId: z.string(),
})

// 收藏/取消收藏职位
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "JOBSEEKER") {
      return NextResponse.json({ error: "只有求职者可以收藏职位" }, { status: 403 })
    }

    const body = await req.json()
    const result = favoriteSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "参数错误" },
        { status: 400 }
      )
    }

    const { jobId } = result.data

    // 检查职位是否存在
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    })

    if (!job) {
      return NextResponse.json({ error: "职位不存在" }, { status: 404 })
    }

    // 检查是否已经收藏
    const existingFavorite = await prisma.favoriteJob.findUnique({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId
        }
      }
    })

    if (existingFavorite) {
      // 取消收藏
      await prisma.favoriteJob.delete({
        where: { id: existingFavorite.id }
      })
      return NextResponse.json({
        success: true,
        isFavorited: false,
        message: "已取消收藏"
      })
    } else {
      // 添加收藏
      await prisma.favoriteJob.create({
        data: {
          userId: session.user.id,
          jobId
        }
      })

      // 可选：通知企业职位被收藏
      try {
        await notifyJobFavorited(job.postedBy, job.title, jobId)
      } catch (error) {
        // 通知失败不影响收藏功能
        console.error("[Favorite Notification Error]", error)
      }

      return NextResponse.json({
        success: true,
        isFavorited: true,
        message: "收藏成功"
      })
    }
  } catch (error) {
    console.error("[Favorite Job Error]", error)
    return NextResponse.json(
      { error: "操作失败，请稍后重试" },
      { status: 500 }
    )
  }
}

// 获取收藏列表
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get("jobId")

    if (jobId) {
      // 检查是否收藏了某个职位
      const favorite = await prisma.favoriteJob.findUnique({
        where: {
          userId_jobId: {
            userId: session.user.id,
            jobId
          }
        }
      })
      return NextResponse.json({ isFavorited: !!favorite })
    }

    // 获取收藏列表
    const favorites = await prisma.favoriteJob.findMany({
      where: { userId: session.user.id },
      include: {
        job: {
          include: { company: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    return NextResponse.json({
      favorites: favorites.map(f => ({
        id: f.id,
        createdAt: f.createdAt,
        job: {
          id: f.job.id,
          title: f.job.title,
          slug: f.job.slug,
          location: f.job.location,
          salaryMin: f.job.salaryMin,
          salaryMax: f.job.salaryMax,
          salaryCurrency: f.job.salaryCurrency,
          company: {
            id: f.job.company.id,
            name: f.job.company.name,
            slug: f.job.company.slug,
            logo: f.job.company.logo
          }
        }
      }))
    })
  } catch (error) {
    console.error("[Get Favorites Error]", error)
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    )
  }
}
