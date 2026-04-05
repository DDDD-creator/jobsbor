import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { ApplicationStatus } from "@prisma/client"
import { z } from "zod"
import { notifyApplicationStatus } from "@/lib/notifications"

// 更新申请状态验证schema
const updateStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "VIEWED", 
    "INTERVIEWING",
    "OFFERED",
    "REJECTED",
    "HIRED"
  ]),
  feedback: z.string().optional(),
  nextStep: z.string().optional(),
})

// 获取申请者列表
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status") as ApplicationStatus | null
    const jobId = searchParams.get("jobId")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")

    // 获取招聘者所属企业
    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId: session.user.id },
      select: { companyId: true }
    })

    if (!recruiterProfile && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "未找到企业信息" },
        { status: 404 }
      )
    }

    // 获取企业下的所有职位ID
    const companyJobs = await prisma.job.findMany({
      where: { 
        companyId: recruiterProfile?.companyId 
      },
      select: { id: true }
    })
    const jobIds = companyJobs.map(j => j.id)

    const where: any = {
      jobId: { in: jobIds }
    }

    if (status) {
      where.status = status
    }

    if (jobId) {
      where.jobId = jobId
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where,
        include: {
          job: {
            select: {
              id: true,
              title: true,
              slug: true,
            }
          },
          applicant: {
            include: {
              jobSeekerProfile: true,
            }
          }
        },
        orderBy: { appliedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.application.count({ where }),
    ])

    return NextResponse.json({
      applications: applications.map(app => ({
        id: app.id,
        status: app.status,
        appliedAt: app.appliedAt,
        viewedAt: app.viewedAt,
        respondedAt: app.respondedAt,
        coverLetter: app.coverLetter,
        feedback: app.feedback,
        nextStep: app.nextStep,
        resumeSnapshot: app.resumeSnapshot,
        job: app.job,
        applicant: {
          id: app.applicant.id,
          name: app.applicant.name,
          email: app.applicant.email,
          avatar: app.applicant.avatar,
          profile: app.applicant.jobSeekerProfile,
        }
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error("[Get Applications Error]", error)
    return NextResponse.json(
      { error: "获取申请者列表失败" },
      { status: 500 }
    )
  }
}

// 批量更新申请状态
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const body = await req.json()
    const { ids, status, feedback, nextStep } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "请选择要更新的申请" },
        { status: 400 }
      )
    }

    // 验证状态
    const validatedData = updateStatusSchema.parse({ status, feedback, nextStep })

    // 获取招聘者所属企业
    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId: session.user.id },
      select: { companyId: true }
    })

    // 验证这些申请是否属于该企业的职位
    if (session.user.role !== "ADMIN") {
      const companyJobs = await prisma.job.findMany({
        where: { companyId: recruiterProfile?.companyId },
        select: { id: true }
      })
      const jobIds = companyJobs.map(j => j.id)

      const applications = await prisma.application.findMany({
        where: { id: { in: ids } },
        select: { jobId: true }
      })

      const hasInvalid = applications.some(app => !jobIds.includes(app.jobId))
      if (hasInvalid) {
        return NextResponse.json(
          { error: "权限不足" },
          { status: 403 }
        )
      }
    }

    const updateData: any = {
      status: validatedData.status,
      respondedAt: new Date(),
    }
    if (feedback !== undefined) updateData.feedback = feedback
    if (nextStep !== undefined) updateData.nextStep = nextStep
    if (status === "VIEWED" && !feedback) {
      updateData.viewedAt = new Date()
    }

    await prisma.application.updateMany({
      where: { id: { in: ids } },
      data: updateData,
    })

    // 创建通知 - 使用新的通知系统
    const applications = await prisma.application.findMany({
      where: { id: { in: ids } },
      include: { job: { include: { company: true } } }
    })

    await Promise.all(
      applications.map(app =>
        notifyApplicationStatus(
          app.applicantId,
          app.job.title,
          app.job.company.name,
          validatedData.status,
          app.jobId,
          app.id,
          validatedData.feedback
        )
      )
    )

    return NextResponse.json({
      success: true,
      message: `已更新 ${ids.length} 个申请`,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "数据验证失败", details: error.issues },
        { status: 400 }
      )
    }
    console.error("[Update Applications Error]", error)
    return NextResponse.json(
      { error: "更新失败" },
      { status: 500 }
    )
  }
}

// 获取单个申请详情
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "申请ID不能为空" },
        { status: 400 }
      )
    }

    const application = await prisma.application.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            company: true,
          }
        },
        applicant: {
          include: {
            jobSeekerProfile: true,
          }
        }
      }
    })

    if (!application) {
      return NextResponse.json(
        { error: "申请不存在" },
        { status: 404 }
      )
    }

    // 检查权限
    if (session.user.role !== "ADMIN") {
      const recruiterProfile = await prisma.recruiterProfile.findUnique({
        where: { userId: session.user.id },
        select: { companyId: true }
      })

      if (application.job.companyId !== recruiterProfile?.companyId) {
        return NextResponse.json({ error: "权限不足" }, { status: 403 })
      }
    }

    // 标记为已查看
    if (!application.viewedAt && application.status === "PENDING") {
      await prisma.application.update({
        where: { id },
        data: { 
          viewedAt: new Date(),
          status: "VIEWED"
        }
      })
    }

    return NextResponse.json({
      application: {
        id: application.id,
        status: application.status,
        appliedAt: application.appliedAt,
        viewedAt: application.viewedAt,
        respondedAt: application.respondedAt,
        coverLetter: application.coverLetter,
        feedback: application.feedback,
        nextStep: application.nextStep,
        resumeSnapshot: application.resumeSnapshot,
        job: application.job,
        applicant: {
          id: application.applicant.id,
          name: application.applicant.name,
          email: application.applicant.email,
          avatar: application.applicant.avatar,
          profile: application.applicant.jobSeekerProfile,
        }
      }
    })
  } catch (error) {
    console.error("[Get Application Detail Error]", error)
    return NextResponse.json(
      { error: "获取申请详情失败" },
      { status: 500 }
    )
  }
}

function getStatusText(status: ApplicationStatus): string {
  const statusMap: Record<string, string> = {
    PENDING: "待处理",
    VIEWED: "已查看",
    INTERVIEWING: "面试中",
    OFFERED: "已发offer",
    REJECTED: "已拒绝",
    HIRED: "已录用",
  }
  return statusMap[status] || status
}