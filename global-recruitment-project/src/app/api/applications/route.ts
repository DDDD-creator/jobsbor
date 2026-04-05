import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"

// 获取我的申请列表（求职者）
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "JOBSEEKER") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") // 可选：按状态筛选

    const where: any = {
      applicantId: session.user.id,
      isDeletedByUser: false
    }

    if (status) {
      where.status = status
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          include: { company: true }
        }
      },
      orderBy: { appliedAt: "desc" }
    })

    return NextResponse.json({
      applications: applications.map(app => ({
        id: app.id,
        status: app.status,
        appliedAt: app.appliedAt,
        viewedAt: app.viewedAt,
        respondedAt: app.respondedAt,
        feedback: app.feedback,
        nextStep: app.nextStep,
        job: {
          id: app.job.id,
          title: app.job.title,
          slug: app.job.slug,
          location: app.job.location,
          salaryMin: app.job.salaryMin,
          salaryMax: app.job.salaryMax,
          salaryCurrency: app.job.salaryCurrency,
          status: app.job.status,
          company: {
            id: app.job.company.id,
            name: app.job.company.name,
            slug: app.job.company.slug,
            logo: app.job.company.logo
          }
        }
      }))
    })
  } catch (error) {
    console.error("[Get Applications Error]", error)
    return NextResponse.json(
      { error: "获取失败" },
      { status: 500 }
    )
  }
}
