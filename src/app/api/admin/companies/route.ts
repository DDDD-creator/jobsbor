import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

// 获取公司列表
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'))
    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const industry = searchParams.get('industry')
    const keyword = searchParams.get('keyword')
    const verifyStatus = searchParams.get('verifyStatus')

    const where: any = {}
    
    if (industry && industry !== 'all') {
      where.industry = industry
    }
    
    if (verifyStatus && verifyStatus !== 'all') {
      where.verifyStatus = verifyStatus.toUpperCase()
    }
    
    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { description: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { 
              jobs: true,
              recruiters: true,
            },
          },
        },
      }),
      prisma.company.count({ where }),
    ])

    return NextResponse.json({
      companies,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get companies error:', error)
    return NextResponse.json({ error: '获取公司列表失败' }, { status: 500 })
  }
}

// 创建公司
export async function POST(request: NextRequest) {
  try {
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
    if (!body.name || !body.slug || !body.industry) {
      return NextResponse.json(
        { error: '缺少必填字段: name, slug, industry' },
        { status: 400 }
      )
    }

    // 检查slug是否已存在
    const existing = await prisma.company.findUnique({
      where: { slug: body.slug },
    })

    if (existing) {
      return NextResponse.json(
        { error: '公司标识已存在' },
        { status: 400 }
      )
    }

    const company = await prisma.company.create({
      data: body,
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('Create company error:', error)
    return NextResponse.json({ error: '创建公司失败' }, { status: 500 })
  }
}
