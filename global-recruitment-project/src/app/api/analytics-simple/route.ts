import { NextRequest, NextResponse } from 'next/server'

// 内存存储（简单实现，重启后数据丢失）
// 生产环境应使用数据库
const stats = {
  totalVisits: 0,
  uniqueIPs: new Set<string>(),
  dailyStats: new Map<string, { uv: number; pv: number }>(),
  pageViews: new Map<string, number>(),
}

export async function POST(request: NextRequest) {
  try {
    const { pathname } = await request.json()
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const today = new Date().toISOString().split('T')[0]

    // 总访问量
    stats.totalVisits++

    // 独立IP
    stats.uniqueIPs.add(ip)

    // 每日统计
    const daily = stats.dailyStats.get(today) || { uv: 0, pv: 0 }
    daily.pv++
    // 简单UV计算（实际应该用更复杂的逻辑）
    if (!stats.pageViews.has(`${today}-${ip}-${pathname}`)) {
      daily.uv++
      stats.pageViews.set(`${today}-${ip}-${pathname}`, 1)
    }
    stats.dailyStats.set(today, daily)

    // 页面统计
    const pageCount = stats.pageViews.get(pathname) || 0
    stats.pageViews.set(pathname, pageCount + 1)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const todayStats = stats.dailyStats.get(today) || { uv: 0, pv: 0 }

    // 获取热门页面
    const topPages: { path: string; views: number }[] = []
    stats.pageViews.forEach((views, path) => {
      if (!path.includes('-')) { // 过滤掉组合键
        topPages.push({ path, views })
      }
    })
    topPages.sort((a, b) => b.views - a.views)
    topPages.splice(10) // 只保留前10

    return NextResponse.json({
      today: todayStats,
      total: {
        visits: stats.totalVisits,
        uniqueIPs: stats.uniqueIPs.size,
      },
      topPages,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 })
  }
}
