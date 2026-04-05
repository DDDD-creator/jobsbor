import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  password: z.string().min(6, "密码至少需要6位"),
  name: z.string().min(2, "姓名至少需要2个字符"),
  role: z.enum(["JOBSEEKER", "RECRUITER"]),
  // 企业信息（仅HR需要）
  companyName: z.string().optional(),
  companyIndustry: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const result = registerSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { error: "参数错误", details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { email, password, name, role, companyName, companyIndustry } = result.data

    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 409 }
      )
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 12)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: role as UserRole,
      },
    })

    // 如果是HR，创建企业和招聘者档案
    if (role === "RECRUITER" && companyName) {
      const company = await prisma.company.create({
        data: {
          name: companyName,
          slug: `${companyName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
          industry: companyIndustry || "互联网",
          verifyStatus: "PENDING",
        },
      })

      await prisma.recruiterProfile.create({
        data: {
          userId: user.id,
          companyId: company.id,
          isVerified: false,
        },
      })
    }

    // 如果是求职者，创建空档案
    if (role === "JOBSEEKER") {
      await prisma.jobSeekerProfile.create({
        data: {
          userId: user.id,
        },
      })
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "注册成功",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("[Register Error]", error)
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    )
  }
}
