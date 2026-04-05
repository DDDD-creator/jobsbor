import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"

// 定义更新数据的类型
type ProfileUpdateData = Prisma.JobSeekerProfileUpdateInput & {
  experience?: Prisma.InputJsonValue
  education?: Prisma.InputJsonValue
  skills?: Prisma.InputJsonValue
  expectedSalary?: Prisma.InputJsonValue
}

// 定义创建数据的类型
type ProfileCreateData = Prisma.JobSeekerProfileCreateInput & {
  experience?: Prisma.InputJsonValue
  education?: Prisma.InputJsonValue
  skills?: Prisma.InputJsonValue
  expectedSalary?: Prisma.InputJsonValue
  userId: string
}

const profileSchema = z.object({
  phone: z.string().optional(),
  location: z.string().optional(),
  headline: z.string().max(100).optional(),
  summary: z.string().max(2000).optional(),
  skills: z.array(z.string()).optional(),
  experience: z.array(z.object({
    title: z.string(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
  })).optional(),
  education: z.array(z.object({
    school: z.string(),
    degree: z.string(),
    field: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
  })).optional(),
  expectedSalary: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    currency: z.string().default("CNY"),
  }).optional(),
  jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"]).optional(),
  jobLocation: z.enum(["ONSITE", "REMOTE", "HYBRID"]).optional(),
  openToWork: z.boolean().default(true),
})

// 获取当前用户的求职者资料
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "JOBSEEKER") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const profile = await prisma.jobSeekerProfile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          }
        }
      }
    })

    if (!profile) {
      // 自动创建空档案
      const newProfile = await prisma.jobSeekerProfile.create({
        data: { userId: session.user.id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              avatar: true,
            }
          }
        }
      })
      return NextResponse.json({ profile: newProfile })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("[Get Profile Error]", error)
    return NextResponse.json({ error: "获取失败" }, { status: 500 })
  }
}

// 更新求职者资料
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "JOBSEEKER") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const body = await req.json()
    const result = profileSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "参数错误", details: result.error.flatten() },
        { status: 400 }
      )
    }

    // 转换数组字段为JSON
    const updateData: ProfileUpdateData = {
      ...result.data,
      updatedAt: new Date(),
    }

    if (result.data.experience) {
      updateData.experience = result.data.experience as Prisma.InputJsonValue
    }
    if (result.data.education) {
      updateData.education = result.data.education as Prisma.InputJsonValue
    }
    if (result.data.skills) {
      updateData.skills = result.data.skills as Prisma.InputJsonValue
    }
    if (result.data.expectedSalary) {
      updateData.expectedSalary = result.data.expectedSalary as Prisma.InputJsonValue
    }

    const profile = await prisma.jobSeekerProfile.upsert({
      where: { userId: session.user.id },
      update: updateData as Prisma.JobSeekerProfileUpdateInput,
      create: {
        userId: session.user.id,
        ...updateData,
      } as Prisma.JobSeekerProfileCreateInput,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            avatar: true,
          }
        }
      }
    })

    // 更新session中的hasProfile状态
    if (!session.user.hasProfile) {
      // 这里可以通过某种方式触发session更新
    }

    return NextResponse.json({
      success: true,
      message: "资料已更新",
      profile,
    })
  } catch (error) {
    console.error("[Update Profile Error]", error)
    return NextResponse.json({ error: "更新失败" }, { status: 500 })
  }
}
