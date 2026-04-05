/**
 * Next.js Middleware
 * 处理语言检测、重定向和安全头部
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales } from '@/i18n/config'

// 公开路径
const PUBLIC_PATHS = [
  '/_next',
  '/api',
  '/static',
  '/favicon.ico',
  '/robots.txt',
  '/sitemap',
  '/images',
  '/assets',
  '/sitemap.xml',
  '/baidu_verify',
]

// 安全头部配置
const securityHeaders = {
  // 内容安全策略
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: *.jobsbor.com logo.clearbit.com ui-avatars.com",
    "font-src 'self'",
    "connect-src 'self' *.google-analytics.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; '),
  // 防止 MIME 类型嗅探
  'X-Content-Type-Options': 'nosniff',
  // 启用 XSS 过滤
  'X-XSS-Protection': '1; mode=block',
  // 防止点击劫持
  'X-Frame-Options': 'DENY',
  //  referrer 策略
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  // 权限策略
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 跳过公开路径
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    const response = NextResponse.next()
    // 添加安全头部
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // 跳过文件
  if (/\.(.*)$/.test(pathname)) {
    const response = NextResponse.next()
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    return response
  }

  // 检查是否已有语言前缀
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  let response: NextResponse

  if (pathnameHasLocale) {
    response = NextResponse.next()
  } else {
    // 默认使用中文
    const newUrl = new URL(
      `/zh${pathname === '/' ? '' : pathname}`,
      request.url
    )
    newUrl.search = request.nextUrl.search
    response = NextResponse.redirect(newUrl)
  }

  // 添加安全头部
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: ['/', '/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
