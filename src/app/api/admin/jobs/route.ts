import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

// 获取职位列表
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

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const industry = searchParams.get('industry')
    const keyword = searchParams.get('keyword')
    const isFeatured = searchParams.get('isFeatured')
    const isUrgent = searchParams.get('isUrgent')
    const companyId = searchParams.get('companyId')

    // 构建查询条件
    const where: any = {}
    if (status && status !== 'all') where.status = status.toUpperCase()
    if (industry && industry !== 'all') where.industry = industry
    if (companyId) where.companyId = companyId
    if (isFeatured === 'true') where.isFeatured = true
    if (isUrgent === 'true') where.isUrgent = true
    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    // 获取数据
    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          company: {
            select: { id: true, name: true, logo: true },
          },
          poster: {
            select: { id: true, name: true },
          },
          _count: {
            select: { applications: true },
          },
        },
      }),
      prisma.job.count({ where }),
    ])

    return NextResponse.json({
      jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get jobs error:', error)
    return NextResponse.json(
      { error: '获取职位列表失败' },
      { status: 500 }
    )
  }
}

// 创建职位
export async function POST(request: NextRequest) {
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

    const body = await request.json()

    // 验证必填字段
    const requiredFields = ['title', 'companyId', 'description', 'requirements', 'location', 'type', 'industry', 'category']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `缺少必填字段: ${field}` },
          { status: 400 }
        )
      }
    }

    // 生成slug
    const slug = body.slug || `${body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}-${Date.now()}`

    // 创建职位
    const job = await prisma.job.create({
      data: {
        ...body,
        slug,
        postedBy: payload.userId,
        status: body.status || 'PENDING',
        publishedAt: body.status === 'ACTIVE' ? new Date() : null,
      },
      include: {
        company: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json(job)
  } catch (error) {
    console.error('Create job error:', error)
    return NextResponse.json(
      { error: '创建职位失败' },
      { status: 500 }
    )
  }
}
