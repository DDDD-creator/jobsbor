import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { VerifyStatus, UserRole } from "@prisma/client"

// 企业注册 - 简化版：注册后即可发布职位，无需审核
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const body = await req.json()
    const {
      // 企业信息（简化必填项）
      companyName,
      companySlug,
      industry,
      companyLocation,
      // 可选信息
      companySize,
      companyDescription,
      companyWebsite,
      // 联系人
      contactName,
    } = body

    // 验证必填字段（极简）
    if (!companyName || !companySlug) {
      return NextResponse.json(
        { error: "请填写企业名称和链接" },
        { status: 400 }
      )
    }

    // 检查 slug 是否已存在
    const existingCompany = await prisma.company.findUnique({
      where: { slug: companySlug }
    })

    if (existingCompany) {
      return NextResponse.json(
        { error: "企业链接已被使用" },
        { status: 400 }
      )
    }

    // 开始事务
    const result = await prisma.$transaction(async (tx) => {
      // 1. 创建企业（直接通过，无需审核）
      const company = await tx.company.create({
        data: {
          name: companyName,
          slug: companySlug,
          industry: industry || "other",
          size: companySize,
          description: companyDescription,
          website: companyWebsite,
          location: companyLocation,
          contactName: contactName || session.user.name || "负责人",
          contactEmail: session.user.email || "",
          // 关键：直接设置为已通过，无需审核
          verifyStatus: VerifyStatus.VERIFIED,
        }
      })

      // 2. 更新用户角色为招聘者
      await tx.user.update({
        where: { id: session.user.id },
        data: { role: UserRole.RECRUITER }
      })

      // 3. 创建招聘者档案（直接已验证）
      const recruiterProfile = await tx.recruiterProfile.create({
        data: {
          userId: session.user.id,
          companyId: company.id,
          position: "招聘负责人",
          isVerified: true, // 直接通过
        }
      })

      return { company, recruiterProfile }
    })

    return NextResponse.json({
      success: true,
      message: "企业注册成功，立即可以发布职位",
      company: {
        id: result.company.id,
        name: result.company.name,
        slug: result.company.slug,
        verifyStatus: VerifyStatus.VERIFIED,
      }
    })
  } catch (error) {
    console.error("[Employer Register Error]", error)
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    )
  }
}

// 获取注册状态
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId: session.user.id },
      include: { company: true }
    })

    if (!recruiterProfile) {
      return NextResponse.json({
        hasCompany: false,
        role: session.user.role,
      })
    }

    return NextResponse.json({
      hasCompany: true,
      role: "RECRUITER",
      company: {
        id: recruiterProfile.company.id,
        name: recruiterProfile.company.name,
        slug: recruiterProfile.company.slug,
        verifyStatus: recruiterProfile.company.verifyStatus,
        logo: recruiterProfile.company.logo,
      },
      isVerified: recruiterProfile.isVerified,
    })
  } catch (error) {
    console.error("[Get Employer Status Error]", error)
    return NextResponse.json(
      { error: "获取状态失败" },
      { status: 500 }
    )
  }
}