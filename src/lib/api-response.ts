import { NextResponse } from 'next/server'

// 统一API响应格式
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

// 成功响应
export function successResponse<T>(data: T, message?: string, meta?: ApiResponse['meta']) {
  return NextResponse.json({
    success: true,
    data,
    message,
    meta,
  })
}

// 错误响应
export function errorResponse(error: string, status: number = 400) {
  return NextResponse.json(
    {
      success: false,
      error,
    },
    { status }
  )
}

// 常用错误响应
export const errors = {
  unauthorized: () => errorResponse('请先登录', 401),
  forbidden: () => errorResponse('权限不足', 403),
  notFound: (resource = '资源') => errorResponse(`${resource}不存在`, 404),
  badRequest: (msg = '请求参数错误') => errorResponse(msg, 400),
  internalError: () => errorResponse('服务器内部错误', 500),
}
