import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { PROMOTION_PRICES, getPromotionPrice } from '@/lib/stripe'
import { PromotionType } from '@prisma/client'

// 获取推广价格配置
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')

    if (!jobId) {
      return NextResponse.json({
        prices: PROMOTION_PRICES,
        types: [
          { id: 'featured', name: 'Featured', description: '首页/列表页置顶展示', icon: 'Star' },
          { id: 'highlight', name: 'Highlight', description: '高亮显示，更醒目', icon: 'Sparkles' },
          { id: 'urgent', name: 'Urgent', description: '急聘标记，吸引更多关注', icon: 'Zap' },
          { id: 'homepage', name: 'Homepage', description: '首页横幅广告位', icon: 'Monitor' },
        ],
      })
    }

    // 获取职位的推广状态
    const promotions = await prisma.jobPromotion.findMany({
      where: {
        jobId,
        status: 'ACTIVE',
        endAt: { gt: new Date() },
      },
      orderBy: { endAt: 'desc' },
    })

    return NextResponse.json({
      prices: PROMOTION_PRICES,
      activePromotions: promotions,
    })
  } catch (error: any) {
    console.error('Get promotion prices error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get promotion prices' },
      { status: 500 }
    )
  }
}

// 创建推广记录（支付成功后调用）
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await req.json()
    const { jobId, type, durationDays, paymentIntentId } = body

    if (!jobId || !type || !durationDays || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // 验证价格
    const price = getPromotionPrice(type as keyof typeof PROMOTION_PRICES, durationDays)
    if (!price) {
      return NextResponse.json(
        { error: 'Invalid promotion type or duration' },
        { status: 400 }
      )
    }

    // 验证职位归属
    const job = await prisma.job.findFirst({
      where: {
        id: jobId,
        postedBy: payload.userId,
      },
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found or not authorized' },
        { status: 404 }
      )
    }

    // 检查是否已有同类型的有效推广
    const existingPromotion = await prisma.jobPromotion.findFirst({
      where: {
        jobId,
        type: type.toUpperCase(),
        status: 'ACTIVE',
        endAt: { gt: new Date() },
      },
    })

    if (existingPromotion) {
      return NextResponse.json(
        { error: 'Active promotion of this type already exists' },
        { status: 400 }
      )
    }

    // 创建推广记录
    const startAt = new Date()
    const endAt = new Date()
    endAt.setDate(endAt.getDate() + parseInt(durationDays))

    const promotion = await prisma.jobPromotion.create({
      data: {
        jobId,
        userId: payload.userId,
        type: type.toUpperCase() as PromotionType,
        durationDays: parseInt(durationDays),
        status: 'PENDING',
        startAt,
        endAt,
        amount: (price / 100).toString(),
        currency: 'USD',
        paymentId: paymentIntentId,
      },
    })

    return NextResponse.json({ promotion })
  } catch (error: any) {
    console.error('Create promotion error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create promotion' },
      { status: 500 }
    )
  }
}
