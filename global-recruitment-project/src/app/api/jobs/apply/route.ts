import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { notifyNewApplication } from "@/lib/notifications"

const applySchema = z.object({
  jobId: z.string(),
  coverLetter: z.string().optional(),
})

// 申请职位
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "JOBSEEKER") {
      return NextResponse.json({ error: "只有求职者可以申请职位" }, { status: 403 })
    }

    const body = await req.json()
    const result = applySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "参数错误", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { jobId, coverLetter } = result.data

    // 检查职位是否存在且处于活跃状态
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true }
    })

    if (!job) {
      return NextResponse.json({ error: "职位不存在" }, { status: 404 })
    }

    if (job.status !== "ACTIVE") {
      return NextResponse.json({ error: "该职位已停止招聘" }, { status: 400 })
    }

    // 获取求职者信息
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { jobSeekerProfile: true }
    })

    if (!user?.jobSeekerProfile) {
      return NextResponse.json({ error: "请先完善个人资料" }, { status: 400 })
    }

    // 检查是否已经申请过
    const existingApplication = await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId: session.user.id
        }
      }
    })

    if (existingApplication) {
      return NextResponse.json({ error: "您已经申请过该职位" }, { status: 409 })
    }

    // 创建申请
    const application = await prisma.application.create({
      data: {
        jobId,
        applicantId: session.user.id,
        coverLetter,
        resumeSnapshot: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          resumeUrl: user.jobSeekerProfile.resumeUrl,
          resumeText: user.jobSeekerProfile.resumeText,
          experience: user.jobSeekerProfile.experience,
          education: user.jobSeekerProfile.education,
        }
      }
    })

    // 更新职位申请数
    await prisma.job.update({
      where: { id: jobId },
      data: { applyCount: { increment: 1 } }
    })

    // 创建通知给HR
    await notifyNewApplication(
      job.postedBy,
      user.name,
      job.title,
      jobId,
      application.id
    )

    return NextResponse.json({
      success: true,
      message: "申请成功",
      application: {
        id: application.id,
        status: application.status,
        appliedAt: application.appliedAt
      }
    })
  } catch (error) {
    console.error("[Apply Job Error]", error)
    return NextResponse.json(
      { error: "申请失败，请稍后重试" },
      { status: 500 }
    )
  }
}

// 检查申请状态
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get("jobId")

    if (!jobId) {
      return NextResponse.json({ error: "缺少jobId参数" }, { status: 400 })
    }

    const application = await prisma.application.findUnique({
      where: {
        jobId_applicantId: {
          jobId,
          applicantId: session.user.id
        }
      }
    })

    return NextResponse.json({
      hasApplied: !!application,
      application: application ? {
        id: application.id,
        status: application.status,
        appliedAt: application.appliedAt
      } : null
    })
  } catch (error) {
    console.error("[Check Application Error]", error)
    return NextResponse.json(
      { error: "查询失败" },
      { status: 500 }
    )
  }
}
