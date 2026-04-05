import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { writeFile } from "fs/promises"
import { join } from "path"
import { mkdir } from "fs/promises"

// 上传简历文件
export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "JOBSEEKER") {
      return NextResponse.json({ error: "权限不足" }, { status: 403 })
    }

    const formData = await req.formData()
    const file = formData.get("resume") as File

    if (!file) {
      return NextResponse.json({ error: "请选择文件" }, { status: 400 })
    }

    // 验证文件类型
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "仅支持 PDF 或 Word 格式" },
        { status: 400 }
      )
    }

    // 验证文件大小 (10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "文件大小不能超过 10MB" },
        { status: 400 }
      )
    }

    // 生成文件名
    const bytes = new Uint8Array(8)
    crypto.getRandomValues(bytes)
    const randomStr = Array.from(bytes).map(b => b.toString(16).padStart(2, "0")).join("")
    const fileExt = file.name.split(".").pop()
    const fileName = `${session.user.id}_${randomStr}.${fileExt}`

    // 确保上传目录存在
    const uploadDir = join(process.cwd(), "public", "uploads", "resumes")
    await mkdir(uploadDir, { recursive: true })

    // 保存文件
    const filePath = join(uploadDir, fileName)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // 生成访问URL
    const fileUrl = `/uploads/resumes/${fileName}`

    // 更新用户档案
    await prisma.jobSeekerProfile.upsert({
      where: { userId: session.user.id },
      update: {
        resumeUrl: fileUrl,
        resumeName: file.name,
        updatedAt: new Date(),
      },
      create: {
        userId: session.user.id,
        resumeUrl: fileUrl,
        resumeName: file.name,
      },
    })

    return NextResponse.json({
      success: true,
      message: "上传成功",
      fileUrl,
      fileName: file.name,
    })
  } catch (error) {
    console.error("[Upload Resume Error]", error)
    return NextResponse.json({ error: "上传失败" }, { status: 500 })
  }
}

// 删除简历
export async function DELETE() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    const profile = await prisma.jobSeekerProfile.findUnique({
      where: { userId: session.user.id },
    })

    if (!profile?.resumeUrl) {
      return NextResponse.json({ error: "没有简历可删除" }, { status: 404 })
    }

    // 删除数据库记录
    await prisma.jobSeekerProfile.update({
      where: { userId: session.user.id },
      data: {
        resumeUrl: null,
        resumeName: null,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "简历已删除",
    })
  } catch (error) {
    console.error("[Delete Resume Error]", error)
    return NextResponse.json({ error: "删除失败" }, { status: 500 })
  }
}
