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
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 获取时间范围
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const weekAgo = new Date(today)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date(today)
    monthAgo.setMonth(monthAgo.getMonth() - 1)

    // 获取核心统计数据
    const [
      totalUsers,
      totalJobs,
      totalCompanies,
      totalApplications,
      todayUsers,
      todayJobs,
      todayApplications,
      weekUsers,
      weekJobs,
      weekApplications,
      pendingJobs,
      pendingCompanies,
      activeJobs,
    ] = await Promise.all([
      // 总数
      prisma.user.count(),
      prisma.job.count(),
      prisma.company.count(),
      prisma.application.count(),
      // 今日新增
      prisma.user.count({ where: { createdAt: { gte: today } } }),
      prisma.job.count({ where: { createdAt: { gte: today } } }),
      prisma.application.count({ where: { appliedAt: { gte: today } } }),
      // 本周新增
      prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.job.count({ where: { createdAt: { gte: weekAgo } } }),
      prisma.application.count({ where: { appliedAt: { gte: weekAgo } } }),
      // 待审核
      prisma.job.count({ where: { status: 'PENDING' } }),
      prisma.company.count({ where: { verifyStatus: 'PENDING' } }),
      // 上架中职位
      prisma.job.count({ where: { status: 'ACTIVE' } }),
    ])

    // 获取最近注册用户
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    // 获取最近发布职位
    const recentJobs = await prisma.job.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: { name: true },
        },
      },
    })

    // 获取待审核内容
    const pendingReviewJobs = await prisma.job.findMany({
      where: { status: 'PENDING' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        company: {
          select: { name: true },
        },
      },
    })

    const pendingReviewCompanies = await prisma.company.findMany({
      where: { verifyStatus: 'PENDING' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        industry: true,
        createdAt: true,
      },
    })

    // 获取最近7天的增长趋势数据（用于图表）
    const last7Days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      last7Days.push(date)
    }

    const dailyStats = await Promise.all(
      last7Days.map(async (date) => {
        const nextDate = new Date(date)
        nextDate.setDate(nextDate.getDate() + 1)
        
        const [users, jobs, applications] = await Promise.all([
          prisma.user.count({
            where: { createdAt: { gte: date, lt: nextDate } },
          }),
          prisma.job.count({
            where: { createdAt: { gte: date, lt: nextDate } },
          }),
          prisma.application.count({
            where: { appliedAt: { gte: date, lt: nextDate } },
          }),
        ])

        return {
          date: date.toISOString().split('T')[0],
          users,
          jobs,
          applications,
        }
      })
    )

    // 获取角色分布
    const roleDistribution = await prisma.user.groupBy({
      by: ['role'],
      _count: { role: true },
    })

    // 获取职位状态分布
    const jobStatusDistribution = await prisma.job.groupBy({
      by: ['status'],
      _count: { status: true },
    })

    return NextResponse.json({
      stats: {
        totalUsers,
        totalJobs,
        totalCompanies,
        totalApplications,
        todayUsers,
        todayJobs,
        todayApplications,
        weekUsers,
        weekJobs,
        weekApplications,
        pendingJobs,
        pendingCompanies,
        activeJobs,
      },
      recentUsers,
      recentJobs,
      pendingReview: {
        jobs: pendingReviewJobs,
        companies: pendingReviewCompanies,
      },
      dailyStats,
      roleDistribution: roleDistribution.map(r => ({
        role: r.role,
        count: r._count.role,
      })),
      jobStatusDistribution: jobStatusDistribution.map(s => ({
        status: s.status,
        count: s._count.status,
      })),
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    )
  }
}
