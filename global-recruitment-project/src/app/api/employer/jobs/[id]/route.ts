import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { JobStatus } from "@prisma/client"
import { z } from "zod"

// 更新职位验证schema
const updateJobSchema = z.object({
  title: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  requirements: z.string().min(10).optional(),
  responsibilities: z.string().optional().nullable(),
  benefits: z.string().optional().nullable(),
  salaryMin: z.number().min(0).optional().nullable(),
  salaryMax: z.number().min(0).optional().nullable(),
  salaryNegotiable: z.boolean().optional(),
  location: z.string().min(2).optional(),
  remote: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),
  type: z.enum(["FULLTIME", "PARTTIME", "CONTRACT", "INTERNSHIP"]).optional(),
  level: z.enum(["JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"]).optional(),
  tags: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  isUrgent: z.boolean().optional(),
  status: z.enum(["DRAFT", "PENDING", "ACTIVE", "PAUSED", "CLOSED"]).optional(),
})

// 获取单个职位详情
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId: session.user.id },
      select: { companyId: true }
    })

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        company: true,
        _count: {
          select: { applications: true }
        }
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: "职位不存在" },
        { status: 404 }
      )
    }

    // 检查权限（只能查看自己企业的职位）
    if (session.user.role !== "ADMIN" && job.companyId !== recruiterProfile?.companyId) {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    return NextResponse.json({
      job: {
        ...job,
        applicationCount: job._count.applications,
      }
    })
  } catch (error) {
    console.error("[Get Job Detail Error]", error)
    return NextResponse.json(
      { error: "获取职位详情失败" },
      { status: 500 }
    )
  }
}

// 更新职位
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId: session.user.id },
      select: { companyId: true }
    })

    const existingJob = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: "职位不存在" },
        { status: 404 }
      )
    }

    // 检查权限
    if (session.user.role !== "ADMIN" && existingJob.companyId !== recruiterProfile?.companyId) {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = updateJobSchema.parse(body)

    // 如果状态变为ACTIVE，设置发布时间
    const updateData: any = { ...validatedData }
    if (validatedData.status === JobStatus.ACTIVE && existingJob.status !== JobStatus.ACTIVE) {
      updateData.publishedAt = new Date()
    }

    const job = await prisma.job.update({
      where: { id: params.id },
      data: updateData,
      include: {
        company: {
          select: { name: true, logo: true }
        }
      }
    })

    // 更新企业活跃职位计数
    if (validatedData.status) {
      const activeCount = await prisma.job.count({
        where: {
          companyId: job.companyId,
          status: JobStatus.ACTIVE,
        }
      })
      
      await prisma.company.update({
        where: { id: job.companyId },
        data: { activeJobCount: activeCount }
      })
    }

    return NextResponse.json({
      success: true,
      job,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "数据验证失败", details: error.issues },
        { status: 400 }
      )
    }
    console.error("[Update Job Error]", error)
    return NextResponse.json(
      { error: "更新职位失败" },
      { status: 500 }
    )
  }
}

// 删除职位
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId: session.user.id },
      select: { companyId: true }
    })

    const existingJob = await prisma.job.findUnique({
      where: { id: params.id }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: "职位不存在" },
        { status: 404 }
      )
    }

    // 检查权限
    if (session.user.role !== "ADMIN" && existingJob.companyId !== recruiterProfile?.companyId) {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    await prisma.job.delete({
      where: { id: params.id }
    })

    // 更新企业职位计数
    const [jobCount, activeJobCount] = await Promise.all([
      prisma.job.count({ where: { companyId: existingJob.companyId } }),
      prisma.job.count({ 
        where: { 
          companyId: existingJob.companyId,
          status: JobStatus.ACTIVE 
        } 
      }),
    ])

    await prisma.company.update({
      where: { id: existingJob.companyId },
      data: { jobCount, activeJobCount }
    })

    return NextResponse.json({
      success: true,
      message: "职位已删除",
    })
  } catch (error) {
    console.error("[Delete Job Error]", error)
    return NextResponse.json(
      { error: "删除职位失败" },
      { status: 500 }
    )
  }
}