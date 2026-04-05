import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getTokenFromHeader, verifyToken } from '@/lib/auth'

// 获取公司详情
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

    const company = await prisma.company.findUnique({
      where: { id: params.id },
      include: {
        jobs: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            status: true,
            createdAt: true,
            viewCount: true,
            applyCount: true,
          },
        },
        recruiters: {
          include: {
            user: {
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
            jobs: true,
            recruiters: true,
          },
        },
      },
    })

    if (!company) {
      return NextResponse.json({ error: '公司不存在' }, { status: 404 })
    }

    return NextResponse.json({ company })
  } catch (error) {
    console.error('Get company error:', error)
    return NextResponse.json({ error: '获取公司详情失败' }, { status: 500 })
  }
}

// 更新公司信息
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
      name,
      description,
      website,
      location,
      size,
      industry,
      logo,
      coverImage,
      verifyStatus,
      contactName,
      contactEmail,
      contactPhone,
    } = body

    // 构建更新数据
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (website !== undefined) updateData.website = website
    if (location !== undefined) updateData.location = location
    if (size !== undefined) updateData.size = size
    if (industry !== undefined) updateData.industry = industry
    if (logo !== undefined) updateData.logo = logo
    if (coverImage !== undefined) updateData.coverImage = coverImage
    if (verifyStatus !== undefined) updateData.verifyStatus = verifyStatus
    if (contactName !== undefined) updateData.contactName = contactName
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone

    const company = await prisma.company.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({ company })
  } catch (error) {
    console.error('Update company error:', error)
    return NextResponse.json({ error: '更新公司失败' }, { status: 500 })
  }
}

// 删除公司
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

    await prisma.company.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete company error:', error)
    return NextResponse.json({ error: '删除公司失败' }, { status: 500 })
  }
}
