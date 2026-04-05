import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// 获取用户的支付历史
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
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {
      userId: payload.userId,
    }

    if (type) {
      where.type = type.toUpperCase()
    }

    const payments = await prisma.payment.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    return NextResponse.json({ payments })
  } catch (error: any) {
    console.error('Get payment history error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get payment history' },
      { status: 500 }
    )
  }
}
