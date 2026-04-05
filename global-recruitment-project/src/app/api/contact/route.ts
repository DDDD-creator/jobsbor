import { NextRequest, NextResponse } from 'next/server'

// 验证请求体
interface ContactFormData {
  name: string
  email: string
  message: string
  csrfToken: string
}

// 简单的内存频率限制（生产环境应使用 Redis）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1小时
  const maxRequests = 5 // 每小时最多5次

  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  try {
    // 获取客户端 IP
    const ip = request.ip || 'unknown'
    
    // 频率限制检查
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      )
    }

    // 解析请求体
    const body: ContactFormData = await request.json()
    const { name, email, message, csrfToken } = body

    // 验证必填字段
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      )
    }

    // 验证邮箱格式
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      )
    }

    // 验证字段长度
    if (name.length > 100) {
      return NextResponse.json(
        { error: '姓名过长，最多100个字符' },
        { status: 400 }
      )
    }

    if (email.length > 200) {
      return NextResponse.json(
        { error: '邮箱过长，最多200个字符' },
        { status: 400 }
      )
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { error: '消息过长，最多5000个字符' },
        { status: 400 }
      )
    }

    // 清理输入（防止 XSS）
    const sanitizedName = name.trim().replace(/[<>]/g, '')
    const sanitizedEmail = email.trim().toLowerCase()
    const sanitizedMessage = message.trim()

    // 发送邮件
    const emailSent = await sendEmail({
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
    })

    if (!emailSent) {
      return NextResponse.json(
        { error: '邮件发送失败，请稍后重试' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: '消息发送成功，我们会尽快回复您' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: '发送失败，请稍后重试' },
      { status: 500 }
    )
  }
}

// 发送邮件函数
async function sendEmail({ name, email, message }: { 
  name: string
  email: string
  message: string 
}): Promise<boolean> {
  try {
    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const toEmail = 'support@jobsbor.com'

    // 如果没有配置 Resend，使用控制台日志（开发模式）
    if (!resendApiKey) {
      console.log('=================================')
      console.log('📧 联系表单提交（开发模式）')
      console.log('=================================')
      console.log(`来自: ${name} <${email}>`)
      console.log(`时间: ${new Date().toISOString()}`)
      console.log('内容:')
      console.log(message)
      console.log('=================================')
      
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 1000))
      return true
    }

    // 使用 Resend 发送邮件
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        subject: `联系表单: ${name}`,
        html: `
          <h2>新的联系表单提交</h2>
          <p><strong>姓名:</strong> ${name}</p>
          <p><strong>邮箱:</strong> ${email}</p>
          <p><strong>时间:</strong> ${new Date().toLocaleString('zh-CN')}</p>
          <hr>
          <p><strong>消息内容:</strong></p>
          <pre style="white-space: pre-wrap; font-family: sans-serif;">${message}</pre>
        `,
        text: `来自: ${name} <${email}>\n\n${message}`,
        reply_to: email,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Resend API error:', errorData)
      return false
    }

    const data = await response.json()
    console.log('Email sent successfully:', data.id)
    return true

  } catch (error) {
    console.error('Send email error:', error)
    return false
  }
}

// 处理 OPTIONS 请求（CORS 预检）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
