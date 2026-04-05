import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'))

    if (!token) {
      return NextResponse.json(
        { error: '未提供认证信息' },
        { status: 401 }
      )
    }

    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: '认证已过期' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        status: true,
      },
    })

    if (!user || user.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: '用户不存在或已被禁用' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth me error:', error)
    return NextResponse.json(
      { error: '验证失败' },
      { status: 500 }
    )
  }
}
