import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// 获取用户的推广记录
export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1]
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    const where: any = {
      userId: payload.userId,
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    const promotions = await prisma.jobPromotion.findMany({
      where,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            slug: true,
            company: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ promotions })
  } catch (error: any) {
    console.error('Get promotions error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get promotions' },
      { status: 500 }
    )
  }
}
