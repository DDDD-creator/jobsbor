import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // 验证权限
    const token = getTokenFromHeader(request.headers.get('authorization'))
    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: '认证已过期' }, { status: 401 })
    }

    // 获取统计数据
    const [
      totalJobs,
      totalCompanies,
      activeJobs,
      pendingJobs,
    ] = await Promise.all([
      prisma.job.count(),
      prisma.company.count(),
      prisma.job.count({ where: { status: 'ACTIVE' } }),
      prisma.job.count({ where: { status: 'PENDING' } }),
    ])

    // 获取最近发布的职位
    const recentJobs = await prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json({
      totalJobs,
      totalCompanies,
      activeJobs,
      pendingJobs,
      recentJobs,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}
