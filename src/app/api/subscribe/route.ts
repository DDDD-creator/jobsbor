import { NextRequest, NextResponse } from 'next/server'

// 内存存储（简单实现，重启后数据丢失）
// 生产环境应使用数据库
const subscribers = new Map<string, { email: string; createdAt: string }>()

// 验证邮箱格式
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // 验证邮箱
    if (!email || !validateEmail(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // 检查是否已存在
    if (subscribers.has(normalizedEmail)) {
      return NextResponse.json(
        { error: '该邮箱已订阅' },
        { status: 409 }
      )
    }

    // 创建订阅
    subscribers.set(normalizedEmail, {
      email: normalizedEmail,
      createdAt: new Date().toISOString(),
    })

    console.log('New subscriber:', normalizedEmail)

    return NextResponse.json(
      { 
        success: true, 
        message: '订阅成功！我们会将最新职位发送到您的邮箱',
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Subscribe error:', error)
    return NextResponse.json(
      { error: '订阅失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 获取订阅统计（管理后台用）
export async function GET(request: NextRequest) {
  try {
    // 简单的API密钥验证
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const total = subscribers.size
    
    const today = new Date().toISOString().split('T')[0]
    const newToday = Array.from(subscribers.values()).filter(
      s => s.createdAt.startsWith(today)
    ).length

    return NextResponse.json({
      total,
      newToday,
    })
  } catch (error) {
    console.error('Get subscribers error:', error)
    return NextResponse.json(
      { error: '获取数据失败' },
      { status: 500 }
    )
  }
}
