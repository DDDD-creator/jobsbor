import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { Prisma } from '@prisma/client'

// 定义计划数据类型
type PlanData = Prisma.SubscriptionPlanCreateInput

// 获取订阅计划列表
export async function GET(req: NextRequest) {
  try {
    const plans = await prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
    })

    return NextResponse.json({ plans })
  } catch (error: any) {
    console.error('Get subscription plans error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get plans' },
      { status: 500 }
    )
  }
}

// 初始化订阅计划（仅供管理员使用）
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 检查是否已有计划
    const existingPlans = await prisma.subscriptionPlan.count()
    if (existingPlans > 0) {
      return NextResponse.json({ error: 'Plans already initialized' }, { status: 400 })
    }

    // 创建默认订阅计划
    const plans = [
      {
        name: 'Free',
        nameKey: 'plan_free',
        description: '适合个人求职者或初创企业',
        price: '0',
        currency: 'USD',
        interval: 'month',
        jobPostingLimit: 3,
        jobPromotionsCount: 0,
        featuredJobsCount: 0,
        prioritySupport: false,
        analyticsAccess: false,
        resumeAccess: false,
        customBranding: false,
        apiAccess: false,
        features: JSON.stringify([
          { key: 'job_postings', value: '3', unlimited: false },
          { key: 'active_jobs', value: '3', unlimited: false },
          { key: 'resume_views', value: '10', unlimited: false },
          { key: 'job_promotions', value: '0', unlimited: false },
          { key: 'priority_support', value: 'false', unlimited: false },
          { key: 'analytics', value: 'false', unlimited: false },
        ]),
        displayOrder: 0,
      },
      {
        name: 'Pro',
        nameKey: 'plan_pro',
        description: '适合成长型企业',
        price: '49',
        currency: 'USD',
        interval: 'month',
        jobPostingLimit: 20,
        jobPromotionsCount: 5,
        featuredJobsCount: 5,
        prioritySupport: true,
        analyticsAccess: true,
        resumeAccess: true,
        customBranding: false,
        apiAccess: false,
        features: JSON.stringify([
          { key: 'job_postings', value: '20', unlimited: false },
          { key: 'active_jobs', value: '20', unlimited: false },
          { key: 'resume_views', value: '100', unlimited: false },
          { key: 'job_promotions', value: '5', unlimited: false },
          { key: 'priority_support', value: 'true', unlimited: false },
          { key: 'analytics', value: 'true', unlimited: false },
        ]),
        displayOrder: 1,
      },
      {
        name: 'Enterprise',
        nameKey: 'plan_enterprise',
        description: '适合大型企业和招聘团队',
        price: '199',
        currency: 'USD',
        interval: 'month',
        jobPostingLimit: Number.MAX_SAFE_INTEGER, // 企业版实际无限制
        jobPromotionsCount: 20,
        featuredJobsCount: 20,
        prioritySupport: true,
        analyticsAccess: true,
        resumeAccess: true,
        customBranding: true,
        apiAccess: true,
        features: JSON.stringify([
          { key: 'job_postings', value: 'unlimited', unlimited: true },
          { key: 'active_jobs', value: 'unlimited', unlimited: true },
          { key: 'resume_views', value: 'unlimited', unlimited: true },
          { key: 'job_promotions', value: '20', unlimited: false },
          { key: 'priority_support', value: 'true', unlimited: false },
          { key: 'analytics', value: 'true', unlimited: false },
          { key: 'dedicated_manager', value: 'true', unlimited: false },
          { key: 'api_access', value: 'true', unlimited: false },
        ]),
        displayOrder: 2,
      },
    ]

    for (const plan of plans) {
      await prisma.subscriptionPlan.create({ data: plan as PlanData })
    }

    return NextResponse.json({ message: 'Plans initialized successfully' })
  } catch (error: any) {
    console.error('Initialize plans error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to initialize plans' },
      { status: 500 }
    )
  }
}
