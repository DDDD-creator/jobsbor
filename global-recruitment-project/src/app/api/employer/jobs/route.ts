import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { JobStatus, RemoteType, JobType, JobLevel } from "@prisma/client"
import { z } from "zod"

// 创建职位验证schema
const createJobSchema = z.object({
  title: z.string().min(2, "职位名称至少2个字符"),
  description: z.string().min(10, "职位描述至少10个字符"),
  requirements: z.string().min(10, "职位要求至少10个字符"),
  responsibilities: z.string().optional(),
  benefits: z.string().optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  salaryNegotiable: z.boolean().default(false),
  location: z.string().min(2, "工作地点不能为空"),
  remote: z.enum(["ONSITE", "REMOTE", "HYBRID"]),
  type: z.enum(["FULLTIME", "PARTTIME", "CONTRACT", "INTERNSHIP"]),
  level: z.enum(["JUNIOR", "MID", "SENIOR", "LEAD", "EXECUTIVE"]),
  industry: z.string(),
  category: z.string(),
  tags: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  isUrgent: z.boolean().default(false),
})

// 获取职位列表
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
    const status = searchParams.get("status") as JobStatus | null
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")

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

    const where: any = {}
    
    if (session.user.role !== "ADMIN") {
      where.companyId = recruiterProfile?.companyId
    }
    
    if (status) {
      where.status = status
    }
    
    if (search) {
      where.title = { contains: search, mode: "insensitive" }
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: {
            select: { name: true, logo: true, slug: true }
          },
          _count: {
            select: { applications: true }
          }
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.job.count({ where }),
    ])

    return NextResponse.json({
      jobs: jobs.map(job => ({
        id: job.id,
        title: job.title,
        slug: job.slug,
        status: job.status,
        location: job.location,
        remote: job.remote,
        type: job.type,
        level: job.level,
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
        salaryNegotiable: job.salaryNegotiable,
        isUrgent: job.isUrgent,
        isFeatured: job.isFeatured,
        publishedAt: job.publishedAt,
        expiresAt: job.expiresAt,
        createdAt: job.createdAt,
        viewCount: job.viewCount,
        applyCount: job.applyCount,
        applicationCount: job._count.applications,
        company: job.company,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
  } catch (error) {
    console.error("[Get Employer Jobs Error]", error)
    return NextResponse.json(
      { error: "获取职位列表失败" },
      { status: 500 }
    )
  }
}

// 创建新职位
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    // 获取招聘者所属企业
    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId: session.user.id },
      include: { company: true }
    })

    if (!recruiterProfile && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "未找到企业信息" },
        { status: 404 }
      )
    }

    const body = await req.json()
    const validatedData = createJobSchema.parse(body)

    // 生成slug
    const baseSlug = validatedData.title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "")
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`

    const job = await prisma.job.create({
      data: {
        ...validatedData,
        slug: uniqueSlug,
        companyId: recruiterProfile?.companyId || body.companyId,
        postedBy: session.user.id,
        status: JobStatus.ACTIVE,
        publishedAt: new Date(),
      },
      include: {
        company: {
          select: { name: true, logo: true }
        }
      }
    })

    // 更新企业职位计数
    await prisma.company.update({
      where: { id: job.companyId },
      data: {
        jobCount: { increment: 1 },
        activeJobCount: { increment: 1 },
      }
    })

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
    console.error("[Create Job Error]", error)
    return NextResponse.json(
      { error: "创建职位失败" },
      { status: 500 }
    )
  }
}