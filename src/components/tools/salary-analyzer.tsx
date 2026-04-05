'use client'

import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  MapPin, 
  Briefcase,
  DollarSign,
  Clock,
  Filter,
  Download,
  Info
} from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { cn } from '@/lib/utils'

// 简化的职位数据接口
interface SimpleJob {
  id: string
  title: string
  company: string
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency?: string
  location: string
  type: string
  industry: string
  tags: string[]
}

interface SalaryAnalyzerProps {
  jobs: SimpleJob[]
  className?: string
}

const COLORS = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1']

export function SalaryAnalyzer({ jobs, className }: SalaryAnalyzerProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const [selectedLocation, setSelectedLocation] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('chart')

  // 过滤职位
  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      if (selectedIndustry !== 'all' && job.industry !== selectedIndustry) return false
      if (selectedLocation !== 'all' && !job.location.includes(selectedLocation)) return false
      return (job.salaryMax || 0) > 0 || (job.salaryMin || 0) > 0
    })
  }, [jobs, selectedIndustry, selectedLocation])

  // 统计数据
  const stats = useMemo(() => {
    if (filteredJobs.length === 0) return null

    const salaries = filteredJobs.map(job => ({
      min: job.salaryMin || 0,
      max: job.salaryMax || 0,
      avg: ((job.salaryMin || 0) + (job.salaryMax || 0)) / 2,
    }))

    const avgSalary = salaries.reduce((sum, s) => sum + s.avg, 0) / salaries.length
    const minSalary = Math.min(...salaries.map(s => s.min).filter(s => s > 0)) || 0
    const maxSalary = Math.max(...salaries.map(s => s.max))
    const medianSalary = salaries.map(s => s.avg).sort((a, b) => a - b)[Math.floor(salaries.length / 2)]

    return {
      count: filteredJobs.length,
      avgSalary: Math.round(avgSalary),
      minSalary,
      maxSalary,
      medianSalary: Math.round(medianSalary),
    }
  }, [filteredJobs])

  // 按行业统计
  const industryData = useMemo(() => {
    const data: Record<string, { count: number; totalSalary: number }> = {}
    
    filteredJobs.forEach(job => {
      const avg = ((job.salaryMin || 0) + (job.salaryMax || 0)) / 2
      if (!data[job.industry]) {
        data[job.industry] = { count: 0, totalSalary: 0 }
      }
      data[job.industry].count++
      data[job.industry].totalSalary += avg
    })

    return Object.entries(data).map(([industry, info]) => ({
      name: industry === 'finance' ? '金融' : industry === 'web3' ? 'Web3' : '互联网',
      value: Math.round(info.totalSalary / info.count / 1000),
      count: info.count,
    }))
  }, [filteredJobs])

  // 按地点统计
  const locationData = useMemo(() => {
    const data: Record<string, { count: number; totalSalary: number }> = {}
    
    filteredJobs.forEach(job => {
      const avg = ((job.salaryMin || 0) + (job.salaryMax || 0)) / 2
      const location = (job.location || '').split(/[,\/]/)[0].trim()
      if (!data[location]) {
        data[location] = { count: 0, totalSalary: 0 }
      }
      data[location].count++
      data[location].totalSalary += avg
    })

    return Object.entries(data)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8)
      .map(([location, info]) => ({
        name: location,
        value: Math.round(info.totalSalary / info.count / 1000),
        count: info.count,
      }))
  }, [filteredJobs])

  // 薪资分布
  const salaryDistribution = useMemo(() => {
    const ranges = [
      { label: '20K以下', min: 0, max: 20000, count: 0 },
      { label: '20-40K', min: 20000, max: 40000, count: 0 },
      { label: '40-60K', min: 40000, max: 60000, count: 0 },
      { label: '60-80K', min: 60000, max: 80000, count: 0 },
      { label: '80-100K', min: 80000, max: 100000, count: 0 },
      { label: '100K+', min: 100000, max: Infinity, count: 0 },
    ]

    filteredJobs.forEach(job => {
      const avg = ((job.salaryMin || 0) + (job.salaryMax || 0)) / 2
      const range = ranges.find(r => avg >= r.min && avg < r.max)
      if (range) range.count++
    })

    return ranges
  }, [filteredJobs])

  const formatSalary = (value: number) => {
    if (value >= 10000) return `${(value / 10000).toFixed(1)}万`
    return `${value}`
  }

  // 获取所有行业和地点
  const industries = ['all', 'finance', 'web3', 'internet']
  const locations = ['all', '北京', '上海', '深圳', '杭州', '广州', '远程']

  return (
    <div className={className}>
      {/* 头部筛选 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            薪资分析
          </h3>
          <p className="text-sm text-gray-400 mt-1">
            基于 {filteredJobs.length} 个有薪资数据的职位
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-2 rounded-lg bg-dark-300/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            <option value="all">全部行业</option>
            <option value="finance">金融</option>
            <option value="web3">Web3</option>
            <option value="internet">互联网</option>
          </select>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-2 rounded-lg bg-dark-300/50 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc === 'all' ? '全部地点' : loc}
              </option>
            ))}
          </select>

          <div className="flex rounded-lg overflow-hidden border border-white/10">
            <button
              onClick={() => setViewMode('chart')}
              className={cn(
                "px-3 py-2 text-sm transition-colors",
                viewMode === 'chart' 
                  ? "bg-cyan-500/20 text-cyan-400" 
                  : "bg-dark-300/50 text-gray-400 hover:text-white"
              )}
            >
              图表
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                "px-3 py-2 text-sm transition-colors",
                viewMode === 'table' 
                  ? "bg-cyan-500/20 text-cyan-400" 
                  : "bg-dark-300/50 text-gray-400 hover:text-white"
              )}
            >
              数据
            </button>
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="p-8 text-center border-white/10 bg-dark-200/50">
          <Info className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">暂无符合条件的薪资数据</p>
        </Card>
      ) : (
        <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 border-white/10 bg-dark-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">平均薪资</p>
                  <p className="text-xl font-bold text-white">
                    ¥{formatSalary(stats?.avgSalary || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-white/10 bg-dark-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">最高薪资</p>
                  <p className="text-xl font-bold text-white">
                    ¥{formatSalary(stats?.maxSalary || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-white/10 bg-dark-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">最低薪资</p>
                  <p className="text-xl font-bold text-white">
                    ¥{formatSalary(stats?.minSalary || 0)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 border-white/10 bg-dark-200/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">中位数</p>
                  <p className="text-xl font-bold text-white">
                    ¥{formatSalary(stats?.medianSalary || 0)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {viewMode === 'chart' ? (
            <>
              {/* 图表区域 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 行业薪资对比 */}
                <Card className="p-6 border-white/10 bg-dark-200/50">
                  <h4 className="text-lg font-semibold text-white mb-4">行业薪资对比</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={industryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1f2e', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [`${value}K`, '平均薪资']}
                        />
                        <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* 地点薪资对比 */}
                <Card className="p-6 border-white/10 bg-dark-200/50">
                  <h4 className="text-lg font-semibold text-white mb-4">城市薪资对比</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={locationData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1f2e', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [`${value}K`, '平均薪资']}
                        />
                        <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* 薪资分布 */}
                <Card className="p-6 border-white/10 bg-dark-200/50">
                  <h4 className="text-lg font-semibold text-white mb-4">薪资分布</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={salaryDistribution}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="label" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1f2e', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px'
                          }}
                          formatter={(value) => [`${value}个职位`, '数量']}
                        />
                        <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* 行业占比 */}
                <Card className="p-6 border-white/10 bg-dark-200/50">
                  <h4 className="text-lg font-semibold text-white mb-4">行业职位占比</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={industryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {industryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1a1f2e', 
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px'
                          }}
                          formatter={(value, name) => [`${value}个职位`, name]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </>
          ) : (
            /* 表格视图 */
            <Card className="border-white/10 bg-dark-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-dark-300/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">职位</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">公司</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">地点</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">行业</th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">薪资范围</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((job) => (
                      <tr key={job.id} className="border-t border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-white">{job.title}</td>
                        <td className="px-4 py-3 text-gray-400">{job.company}</td>
                        <td className="px-4 py-3 text-gray-400">{job.location}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" size="sm">
                            {job.industry === 'finance' && '金融'}
                            {job.industry === 'web3' && 'Web3'}
                            {job.industry === 'internet' && '互联网'}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-cyan-400 font-medium">
                            {job.salaryMin && job.salaryMax
                              ? `¥${(job.salaryMin / 1000).toFixed(0)}K-${(job.salaryMax / 1000).toFixed(0)}K`
                              : '薪资面议'
                            }
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
