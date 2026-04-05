'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Eye, MousePointer, TrendingUp } from 'lucide-react'

interface Stats {
  today: { uv: number; pv: number }
  total: { visits: number; uniqueIPs: number }
  topPages: { path: string; views: number }[]
  lastUpdated: string
}

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics-simple')
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    // 每30秒刷新一次
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-6">访问统计</h1>
        <div className="text-gray-400">加载中...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-white mb-6">访问统计</h1>
        <div className="text-red-400">获取统计数据失败</div>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">访问统计</h1>
        <div className="text-sm text-gray-400">
          最后更新: {new Date(stats.lastUpdated).toLocaleString('zh-CN')}
        </div>
      </div>

      {/* 今日数据 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              今日 UV
            </CardTitle>
            <Users className="h-4 w-4 text-neon-cyan" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.today.uv}</div>
            <p className="text-xs text-gray-500">独立访客</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              今日 PV
            </CardTitle>
            <Eye className="h-4 w-4 text-neon-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.today.pv}</div>
            <p className="text-xs text-gray-500">页面浏览</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              总访问量
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total.visits}</div>
            <p className="text-xs text-gray-500">累计访问</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              独立IP
            </CardTitle>
            <MousePointer className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.total.uniqueIPs}</div>
            <p className="text-xs text-gray-500">去重后</p>
          </CardContent>
        </Card>
      </div>

      {/* 热门页面 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-white">热门页面</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.topPages.length === 0 ? (
            <div className="text-gray-400 text-center py-8">暂无数据</div>
          ) : (
            <div className="space-y-2">
              {stats.topPages.map((page, index) => (
                <div
                  key={page.path}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-neon-cyan font-mono w-6">#{index + 1}</span>
                    <span className="text-white truncate max-w-md">{page.path}</span>
                  </div>
                  <span className="text-gray-400">{page.views} 次</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
