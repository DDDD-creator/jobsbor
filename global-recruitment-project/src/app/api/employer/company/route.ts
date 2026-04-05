import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// 更新企业信息验证schema
const updateCompanySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  website: z.string().url().optional().nullable(),
  location: z.string().optional(),
  size: z.string().optional(),
  industry: z.string().optional(),
  logo: z.string().url().optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
})

// 获取企业信息
export async function GET(req: NextRequest) {
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
      include: { company: true }
    })

    if (!recruiterProfile) {
      return NextResponse.json(
        { error: "未找到企业信息" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      company: recruiterProfile.company,
      isVerified: recruiterProfile.isVerified,
      position: recruiterProfile.position,
    })
  } catch (error) {
    console.error("[Get Company Error]", error)
    return NextResponse.json(
      { error: "获取企业信息失败" },
      { status: 500 }
    )
  }
}

// 更新企业信息
export async function PATCH(req: NextRequest) {
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
      include: { company: true }
    })

    if (!recruiterProfile) {
      return NextResponse.json(
        { error: "未找到企业信息" },
        { status: 404 }
      )
    }

    const body = await req.json()
    const validatedData = updateCompanySchema.parse(body)

    const updatedCompany = await prisma.company.update({
      where: { id: recruiterProfile.companyId },
      data: validatedData,
    })

    return NextResponse.json({
      success: true,
      company: updatedCompany,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "数据验证失败", details: error.issues },
        { status: 400 }
      )
    }
    console.error("[Update Company Error]", error)
    return NextResponse.json(
      { error: "更新企业信息失败" },
      { status: 500 }
    )
  }
}

// 上传企业Logo
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get("logo") as File

    if (!file) {
      return NextResponse.json(
        { error: "请选择文件" },
        { status: 400 }
      )
    }

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "只能上传图片文件" },
        { status: 400 }
      )
    }

    // 验证文件大小 (最大 2MB for Data URL)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: "文件大小不能超过 2MB" },
        { status: 400 }
      )
    }

    // 转换为 Base64 Data URL (临时方案)
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`

    return NextResponse.json({
      success: true,
      fileUrl: dataUrl,
    })
  } catch (error) {
    console.error("[Upload Logo Error]", error)
    return NextResponse.json(
      { error: "上传失败" },
      { status: 500 }
    )
  }
}