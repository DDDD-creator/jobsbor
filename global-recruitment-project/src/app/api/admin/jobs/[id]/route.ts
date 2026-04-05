import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

// 获取职位详情
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'))
    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        poster: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        applications: {
          take: 10,
          orderBy: { appliedAt: 'desc' },
          include: {
            applicant: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            applications: true,
            favorites: true,
          },
        },
      },
    })

    if (!job) {
      return NextResponse.json({ error: '职位不存在' }, { status: 404 })
    }

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Get job error:', error)
    return NextResponse.json({ error: '获取职位详情失败' }, { status: 500 })
  }
}

// 更新职位
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const {
      title,
      description,
      requirements,
      responsibilities,
      benefits,
      location,
      salaryMin,
      salaryMax,
      salaryNegotiable,
      type,
      level,
      remote,
      status,
      isFeatured,
      isUrgent,
      expiresAt,
    } = body

    // 构建更新数据
    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (requirements !== undefined) updateData.requirements = requirements
    if (responsibilities !== undefined) updateData.responsibilities = responsibilities
    if (benefits !== undefined) updateData.benefits = benefits
    if (location !== undefined) updateData.location = location
    if (salaryMin !== undefined) updateData.salaryMin = salaryMin
    if (salaryMax !== undefined) updateData.salaryMax = salaryMax
    if (salaryNegotiable !== undefined) updateData.salaryNegotiable = salaryNegotiable
    if (type !== undefined) updateData.type = type
    if (level !== undefined) updateData.level = level
    if (remote !== undefined) updateData.remote = remote
    if (status !== undefined) {
      updateData.status = status
      if (status === 'ACTIVE' && !body.publishedAt) {
        updateData.publishedAt = new Date()
      }
    }
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured
    if (isUrgent !== undefined) updateData.isUrgent = isUrgent
    if (expiresAt !== undefined) updateData.expiresAt = expiresAt ? new Date(expiresAt) : null

    const job = await prisma.job.update({
      where: { id: params.id },
      data: updateData,
      include: {
        company: {
          select: { name: true },
        },
      },
    })

    return NextResponse.json({ job })
  } catch (error) {
    console.error('Update job error:', error)
    return NextResponse.json({ error: '更新职位失败' }, { status: 500 })
  }
}

// 删除职位
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromHeader(request.headers.get('authorization'))
    if (!token) {
      return NextResponse.json({ error: '未授权' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    await prisma.job.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete job error:', error)
    return NextResponse.json({ error: '删除职位失败' }, { status: 500 })
  }
}
