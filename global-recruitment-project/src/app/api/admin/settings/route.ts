import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import type { SystemSettings } from "@prisma/client"

// 系统设置验证 schema
const settingsSchema = z.object({
  // 基础设置
  siteName: z.string().min(1).optional(),
  siteUrl: z.string().url().optional(),
  siteDescription: z.string().optional(),
  logoUrl: z.string().url().optional().nullable(),
  faviconUrl: z.string().url().optional().nullable(),
  
  // SEO 设置
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
  googleAnalyticsId: z.string().optional().nullable(),
  baiduAnalyticsId: z.string().optional().nullable(),
  
  // 联系方式
  contactEmail: z.string().email().optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  telegram: z.string().optional().nullable(),
  wechat: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  
  // 安全设置
  loginRetryLimit: z.number().int().min(1).max(10).optional(),
  sessionExpiryHours: z.number().int().min(1).max(720).optional(),
})

// 获取系统设置
export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
    }

    // 获取或创建设置记录
    let settings = await prisma.systemSettings.findFirst()
    
    if (!settings) {
      // 返回默认设置
      settings = {
        id: 'default',
        siteName: 'Jobsbor',
        siteUrl: 'https://jobsbor.com',
        siteDescription: '专注于金融、Web3、互联网行业的高端招聘平台',
        logoUrl: null,
        faviconUrl: null,
        seoTitle: 'Jobsbor - 金融/Web3/互联网招聘平台',
        seoDescription: 'Jobsbor是专注于金融、Web3、互联网行业的高端招聘平台，连接顶尖人才与优质企业。',
        seoKeywords: '招聘,金融,Web3,互联网,求职,找工作',
        googleAnalyticsId: null,
        baiduAnalyticsId: null,
        contactEmail: 'support@jobsbor.com',
        contactPhone: null,
        telegram: '@Web3Kairo',
        wechat: null,
        address: null,
        loginRetryLimit: 5,
        sessionExpiryHours: 168,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as SystemSettings
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error("[Get Settings Error]", error)
    return NextResponse.json(
      { error: "获取设置失败" },
      { status: 500 }
    )
  }
}

// 更新系统设置
export async function PUT(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "需要管理员权限" }, { status: 403 })
    }

    const body = await req.json()
    const validatedData = settingsSchema.parse(body)

    // 使用 upsert 创建或更新设置
    const settings = await prisma.systemSettings.upsert({
      where: { id: 'default' },
      update: validatedData,
      create: {
        id: 'default',
        ...validatedData,
      },
    })

    return NextResponse.json({
      success: true,
      settings,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "数据验证失败", details: error.issues },
        { status: 400 }
      )
    }
    console.error("[Update Settings Error]", error)
    return NextResponse.json(
      { error: "保存设置失败" },
      { status: 500 }
    )
  }
}
