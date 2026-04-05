'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Search,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Building2,
  Briefcase,
  Code,
  Wand2,
  MapPin,
} from 'lucide-react'

interface HotSearchItem {
  keyword: string
  count: number
  trend?: 'up' | 'down' | 'stable'
  category: 'position' | 'skill' | 'company' | 'location'
}

interface SearchHistoryItem {
  keyword: string
  timestamp: number
  filters?: Record<string, any>
}

interface PopularJob {
  id: string
  title: string
  company: string
  location: string
  salary: string
  tags: string[]
}

interface HotSearchesProps {
  lang?: string
  className?: string
  onSearch?: (keyword: string) => void
}

const STORAGE_KEY = 'jobsbor_search_history'
const MAX_HISTORY = 8

// 默认热门搜索数据
const DEFAULT_HOT_SEARCHES: HotSearchItem[] = [
  { keyword: '前端开发', count: 1240, trend: 'up', category: 'position' },
  { keyword: 'Python', count: 980, trend: 'up', category: 'skill' },
  { keyword: '产品经理', count: 856, trend: 'stable', category: 'position' },
  { keyword: '远程工作', count: 720, trend: 'up', category: 'position' },
  { keyword: '区块链', count: 650, trend: 'up', category: 'skill' },
  { keyword: 'Java', count: 620, trend: 'stable', category: 'skill' },
  { keyword: 'React', count: 580, trend: 'up', category: 'skill' },
  { keyword: 'UI设计', count: 520, trend: 'down', category: 'position' },
  { keyword: '量化交易', count: 480, trend: 'up', category: 'position' },
  { keyword: 'Go', count: 450, trend: 'up', category: 'skill' },
  { keyword: '字节跳动', count: 420, trend: 'stable', category: 'company' },
  { keyword: '阿里巴巴', count: 380, trend: 'stable', category: 'company' },
  { keyword: '深圳', count: 890, trend: 'up', category: 'location' },
  { keyword: '上海', count: 760, trend: 'stable', category: 'location' },
]

// 推荐职位
const RECOMMENDED_JOBS: PopularJob[] = [
  {
    id: '1',
    title: '高级前端工程师',
    company: '字节跳动',
    location: '北京/远程',
    salary: '40K-70K',
    tags: ['React', 'TypeScript', 'Web3'],
  },
  {
    id: '2',
    title: '区块链开发工程师',
    company: '某知名交易所',
    location: '新加坡/远程',
    salary: '50K-90K',
    tags: ['Solidity', 'DeFi', '智能合约'],
  },
  {
    id: '3',
    title: 'AI产品经理',
    company: '创新AI公司',
    location: '上海',
    salary: '35K-60K',
    tags: ['AI', '产品设计', '数据分析'],
  },
  {
    id: '4',
    title: '量化研究员',
    company: '顶级对冲基金',
    location: '香港/新加坡',
    salary: '80K-150K',
    tags: ['Python', '量化', '金融'],
  },
]

const categoryIcons: Record<HotSearchItem['category'], React.ElementType> = {
  position: Briefcase,
  skill: Code,
  company: Building2,
  location: MapPin,
}

const categoryLabels: Record<HotSearchItem['category'], string> = {
  position: '职位',
  skill: '技能',
  company: '公司',
  location: '地点',
}

const categoryColors: Record<HotSearchItem['category'], string> = {
  position: 'cyan',
  skill: 'purple',
  company: 'pink',
  location: 'green',
}

export function HotSearches({ lang = 'zh', className, onSearch }: HotSearchesProps) {
  const router = useRouter()
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([])
  const [hotSearches, setHotSearches] = useState<HotSearchItem[]>(DEFAULT_HOT_SEARCHES)
  const [activeCategory, setActiveCategory] = useState<HotSearchItem['category'] | 'all'>('all')

  // 从localStorage加载搜索历史
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const history = localStorage.getItem(STORAGE_KEY)
      if (history) {
        try {
          setSearchHistory(JSON.parse(history))
        } catch (e) {
          console.error('Failed to parse search history')
        }
      }
    }
  }, [])

  // 获取热门搜索（模拟API调用）
  useEffect(() => {
    const fetchHotSearches = async () => {
      try {
        const response = await fetch('/api/jobs/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'hot_keywords' }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.keywords?.length) {
            setHotSearches(
              data.keywords.map((k: string, i: number) => ({
                keyword: k,
                count: DEFAULT_HOT_SEARCHES[i]?.count || 100,
                trend: 'stable',
                category: detectCategory(k),
              }))
            )
          }
        }
      } catch (error) {
        console.error('Failed to fetch hot searches:', error)
      }
    }

    fetchHotSearches()
  }, [])

  // 检测关键词类别
  const detectCategory = (keyword: string): HotSearchItem['category'] => {
    const skillKeywords = ['python', 'java', 'react', 'vue', 'go', 'rust', '区块链', 'ai', '设计']
    const companyKeywords = ['字节', '阿里', '腾讯', '美团', '滴滴', '百度', '快手', '京东']
    const locationKeywords = ['北京', '上海', '深圳', '杭州', '广州', '成都', 'remote', '远程']

    const lowerKeyword = keyword.toLowerCase()
    if (skillKeywords.some((k) => lowerKeyword.includes(k))) return 'skill'
    if (companyKeywords.some((k) => lowerKeyword.includes(k))) return 'company'
    if (locationKeywords.some((k) => lowerKeyword.includes(k))) return 'location'
    return 'position'
  }

  // 保存到搜索历史
  const saveToHistory = useCallback((keyword: string) => {
    if (!keyword.trim()) return
    setSearchHistory((prev) => {
      const newHistory = [
        { keyword, timestamp: Date.now() },
        ...prev.filter((h) => h.keyword !== keyword),
      ].slice(0, MAX_HISTORY)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }, [])

  // 处理搜索
  const handleSearch = useCallback(
    (keyword: string) => {
      saveToHistory(keyword)
      if (onSearch) {
        onSearch(keyword)
      } else {
        router.push(`/${lang}/jobs/search?keyword=${encodeURIComponent(keyword)}`)
      }
    },
    [saveToHistory, onSearch, router, lang]
  )

  // 清除历史
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  // 过滤热门搜索
  const filteredHotSearches =
    activeCategory === 'all'
      ? hotSearches
      : hotSearches.filter((h) => h.category === activeCategory)

  return (
    <div className={cn('space-y-8', className)}>
      {/* 最近搜索 */}
      {searchHistory.length > 0 && (
        <Card className="border-white/10 bg-dark-200/50 backdrop-blur-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="font-semibold text-white">最近搜索</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={clearHistory}>
              清除
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item) => (
              <button
                key={item.keyword}
                onClick={() => handleSearch(item.keyword)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-300/50 text-sm text-gray-300 hover:bg-dark-300 hover:text-white transition-colors"
              >
                <Clock className="w-3 h-3 text-gray-500" />
                {item.keyword}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* 热门搜索 */}
      <Card className="border-white/10 bg-dark-200/50 backdrop-blur-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-400" />
            <h3 className="font-semibold text-white">热门搜索</h3>
          </div>
          <Badge variant="outline" size="sm">实时更新</Badge>
        </div>

        {/* 分类筛选 */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'px-3 py-1 rounded-full text-xs transition-all',
              activeCategory === 'all'
                ? 'bg-white/20 text-white'
                : 'bg-dark-300/50 text-gray-400 hover:text-white'
            )}
          >
            全部
          </button>
          {(Object.keys(categoryLabels) as HotSearchItem['category'][]).map((cat) => {
            const Icon = categoryIcons[cat]
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs transition-all flex items-center gap-1',
                  activeCategory === cat
                    ? `bg-${categoryColors[cat]}-500/20 text-${categoryColors[cat]}-400`
                    : 'bg-dark-300/50 text-gray-400 hover:text-white'
                )}
              >
                <Icon className="w-3 h-3" />
                {categoryLabels[cat]}
              </button>
            )
          })}
        </div>

        {/* 热门关键词 */}
        <div className="flex flex-wrap gap-2">
          {filteredHotSearches.slice(0, 12).map((item, index) => {
            const Icon = categoryIcons[item.category]
            return (
              <button
                key={item.keyword}
                onClick={() => handleSearch(item.keyword)}
                className={cn(
                  'group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all border',
                  'bg-dark-300/30 border-transparent hover:border-white/10 hover:bg-dark-300/50'
                )}
              >
                {index < 3 && (
                  <span
                    className={cn(
                      'absolute -top-2 -left-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold',
                      index === 0 && 'bg-yellow-500 text-yellow-950',
                      index === 1 && 'bg-gray-300 text-gray-800',
                      index === 2 && 'bg-orange-400 text-orange-950'
                    )}
                  >
                    {index + 1}
                  </span>
                )}
                <Icon className="w-4 h-4 text-gray-500 group-hover:text-cyan-400" />
                <span className="text-gray-300 group-hover:text-white">{item.keyword}</span>
                <span className="text-xs text-gray-500">{item.count}</span>
                {item.trend === 'up' && (
                  <TrendingUp className="w-3 h-3 text-green-400" />
                )}
              </button>
            )
          })}
        </div>
      </Card>

      {/* 推荐职位 */}
      <Card className="border-white/10 bg-dark-200/50 backdrop-blur-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-white">为你推荐</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/${lang}/jobs/search`)}
          >
            查看更多
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECOMMENDED_JOBS.map((job) => (
            <button
              key={job.id}
              onClick={() => router.push(`/${lang}/jobs/search?keyword=${encodeURIComponent(job.title)}`)}
              className="text-left p-4 rounded-lg bg-dark-300/30 hover:bg-dark-300/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                  {job.title}
                </h4>
                <span className="text-cyan-400 text-sm">{job.salary}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <Building2 className="w-3 h-3" />
                {job.company}
                <span className="text-gray-600">•</span>
                <MapPin className="w-3 h-3" />
                {job.location}
              </div>
              <div className="flex flex-wrap gap-1">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-full bg-dark-200 text-xs text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* 快速链接 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: '远程工作', icon: MapPin, color: 'green', query: 'remote' },
          { label: '高薪职位', icon: TrendingUp, color: 'yellow', query: 'salary_high' },
          { label: '最新发布', icon: Clock, color: 'cyan', query: 'newest' },
          { label: '热门公司', icon: Building2, color: 'purple', query: 'company' },
        ].map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.label}
              onClick={() => router.push(`/${lang}/jobs/search?sortBy=${item.query}`)}
              className={cn(
                'flex items-center justify-center gap-2 p-4 rounded-xl',
                'bg-dark-300/30 hover:bg-dark-300/50 transition-all',
                'border border-transparent hover:border-white/10'
              )}
            >
              <Icon className={`w-5 h-5 text-${item.color}-400`} />
              <span className="text-gray-300">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default HotSearches
