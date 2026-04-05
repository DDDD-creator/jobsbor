/**
 * 职位列表优化组件
 * 支持：智能筛选、排序、分页、加载更多
 */

'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { OptimizedJobCard, JobCardSkeleton } from './optimized-job-card'
import { OptimizedSearch } from '@/components/search/optimized-search'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { 
  SlidersHorizontal, 
  Briefcase, 
  MapPin, 
  Building2,
  TrendingUp,
  Clock,
  DollarSign,
  ChevronDown,
  X,
  Filter,
  Sparkles,
  LayoutGrid,
  List
} from 'lucide-react'
import type { Job, Company } from '@/types'

type JobWithCompany = Job & {
  company?: Partial<Company> & { name: string; slug: string; industry: string }
}

interface OptimizedJobListProps {
  jobs: JobWithCompany[]
  showFilters?: boolean
  showSearch?: boolean
  defaultView?: 'grid' | 'list'
  itemsPerPage?: number
  className?: string
}

// 筛选选项配置
const FILTER_OPTIONS = {
  industry: [
    { value: '', label: '全部行业', icon: Building2 },
    { value: 'finance', label: '金融', icon: TrendingUp },
    { value: 'web3', label: 'Web3/区块链', icon: Sparkles },
    { value: 'internet', label: '互联网', icon: Briefcase },
  ],
  type: [
    { value: '', label: '全部类型' },
    { value: 'full-time', label: '全职' },
    { value: 'part-time', label: '兼职' },
    { value: 'contract', label: '合同' },
    { value: 'remote', label: '远程' },
  ],
  location: [
    { value: '', label: '全部地点' },
    { value: '北京', label: '北京' },
    { value: '上海', label: '上海' },
    { value: '深圳', label: '深圳' },
    { value: '杭州', label: '杭州' },
    { value: '广州', label: '广州' },
    { value: 'remote', label: '远程' },
    { value: '海外', label: '海外' },
  ],
  salary: [
    { value: '', label: '全部薪资' },
    { value: '0-20000', label: '20K以下' },
    { value: '20000-40000', label: '20K-40K' },
    { value: '40000-60000', label: '40K-60K' },
    { value: '60000+', label: '60K以上' },
  ],
  sort: [
    { value: 'newest', label: '最新发布' },
    { value: 'salary-desc', label: '薪资从高到低' },
    { value: 'salary-asc', label: '薪资从低到高' },
    { value: 'hot', label: '热门职位' },
  ],
}

export function OptimizedJobList({
  jobs,
  showFilters = true,
  showSearch = true,
  defaultView = 'grid',
  itemsPerPage = 12,
  className,
}: OptimizedJobListProps) {
  // 状态管理
  const [filters, setFilters] = useState({
    keyword: '',
    industry: '',
    type: '',
    location: '',
    salary: '',
  })
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // 筛选和排序逻辑
  const filteredJobs = useMemo(() => {
    let result = [...jobs]

    // 关键词筛选
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      result = result.filter(job => 
        job.title.toLowerCase().includes(keyword) ||
        job.company?.name.toLowerCase().includes(keyword) ||
        job.tags?.some(tag => tag.toLowerCase().includes(keyword))
      )
    }

    // 行业筛选
    if (filters.industry) {
      result = result.filter(job => job.industry === filters.industry)
    }

    // 类型筛选
    if (filters.type) {
      result = result.filter(job => job.type === filters.type)
    }

    // 地点筛选
    if (filters.location) {
      if (filters.location === 'remote') {
        result = result.filter(job => job.type === 'remote')
      } else if (filters.location === '海外') {
        result = result.filter(job => 
          !['北京', '上海', '深圳', '杭州', '广州'].some(city => 
            job.location.includes(city)
          )
        )
      } else {
        result = result.filter(job => 
          job.location.includes(filters.location)
        )
      }
    }

    // 薪资筛选
    if (filters.salary) {
      const [min, max] = filters.salary.split('-').map(v => 
        v.endsWith('+') ? parseInt(v) : parseInt(v)
      )
      result = result.filter(job => {
        if (!job.salaryMax) return false
        if (filters.salary.endsWith('+')) {
          return job.salaryMax >= min
        }
        return job.salaryMax >= min && job.salaryMax <= max
      })
    }

    // 排序
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => 
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
        )
        break
      case 'salary-desc':
        result.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0))
        break
      case 'salary-asc':
        result.sort((a, b) => (a.salaryMax || 0) - (b.salaryMax || 0))
        break
      case 'hot':
        result.sort((a, b) => {
          const aHot = a.tags?.some(t => ['急招', '热门'].includes(t)) ? 1 : 0
          const bHot = b.tags?.some(t => ['急招', '热门'].includes(t)) ? 1 : 0
          return bHot - aHot
        })
        break
    }

    return result
  }, [jobs, filters, sortBy])

  // 分页
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage)
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredJobs.slice(start, start + itemsPerPage)
  }, [filteredJobs, currentPage, itemsPerPage])

  // 重置页码当筛选变化
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, sortBy])

  // 处理筛选变化
  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // 清除所有筛选
  const clearFilters = useCallback(() => {
    setFilters({
      keyword: '',
      industry: '',
      type: '',
      location: '',
      salary: '',
    })
  }, [])

  // 活跃筛选数量
  const activeFiltersCount = Object.values(filters).filter(v => v !== '').length

  // 加载更多
  const handleLoadMore = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setCurrentPage(prev => prev + 1)
      setIsLoading(false)
    }, 500)
  }, [])

  return (
    <div className={cn('space-y-6', className)}>
      {/* 搜索栏 */}
      {showSearch && (
        <Card className="p-4 glass-card">
          <OptimizedSearch
            placeholder="搜索职位、公司或关键词..."
            onSearch={(keyword) => handleFilterChange('keyword', keyword)}
            size="lg"
          />
        </Card>
      )}

      {/* 工具栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            aria-label="打开筛选面板"
          >
            <Filter className="w-4 h-4 mr-2" />
            筛选
            {activeFiltersCount > 0 && (
              <Badge variant="neon" color="cyan" size="sm" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
          
          <span className="text-sm text-gray-400">
            共 <span className="text-neon-cyan font-semibold">{filteredJobs.length}</span> 个职位
          </span>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-neon-orange hover:text-neon-orange/80"
              onClick={clearFilters}
              aria-label="清除所有筛选条件"
            >
              <X className="w-3 h-3 mr-1" />
              清除
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* 排序 */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-dark-200 border border-gray-700 text-white text-sm rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-neon-cyan"
            >
              {FILTER_OPTIONS.sort.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* 视图切换 */}
          <div className="flex items-center border border-gray-700 rounded-lg overflow-hidden">
            <button
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-white'
              )}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list' ? 'bg-neon-cyan/20 text-neon-cyan' : 'text-gray-500 hover:text-white'
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 侧边筛选 - 桌面端 */}
        {showFilters && (
          <aside className={cn(
            'w-64 flex-shrink-0 space-y-6',
            'hidden lg:block',
            mobileFiltersOpen && 'fixed inset-0 z-50 bg-[#0a0f1c] p-4 block lg:hidden'
          )}>
            {mobileFiltersOpen && (
              <div className="flex items-center justify-between mb-4 lg:hidden">
                <h3 className="font-semibold text-white">筛选条件</h3>
                <Button variant="ghost" size="sm" onClick={() => setMobileFiltersOpen(false)} aria-label="关闭筛选面板">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}

            {/* 行业筛选 */}
            <FilterSection title="行业" icon={Building2}>
              <div className="space-y-1">
                {FILTER_OPTIONS.industry.map((option) => (
                  <FilterOption
                    key={option.value}
                    label={option.label}
                    icon={option.icon}
                    isActive={filters.industry === option.value}
                    onClick={() => handleFilterChange('industry', option.value)}
                  />
                ))}
              </div>
            </FilterSection>

            {/* 类型筛选 */}
            <FilterSection title="工作类型" icon={Briefcase}>
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.type.map((option) => (
                  <Badge
                    key={option.value}
                    variant={filters.type === option.value ? 'neon' : 'outline'}
                    color="cyan"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => handleFilterChange('type', option.value)}
                  >
                    {option.label}
                  </Badge>
                ))}
              </div>
            </FilterSection>

            {/* 地点筛选 */}
            <FilterSection title="地点" icon={MapPin}>
              <div className="grid grid-cols-2 gap-2">
                {FILTER_OPTIONS.location.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('location', option.value)}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm text-left transition-colors',
                      filters.location === option.value
                        ? 'bg-neon-purple/20 text-neon-purple border border-neon-purple/30'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </FilterSection>

            {/* 薪资筛选 */}
            <FilterSection title="薪资范围" icon={DollarSign}>
              <div className="space-y-1">
                {FILTER_OPTIONS.salary.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('salary', option.value)}
                    className={cn(
                      'w-full px-3 py-2 rounded-lg text-sm text-left transition-colors',
                      filters.salary === option.value
                        ? 'bg-neon-cyan/20 text-neon-cyan'
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </FilterSection>
          </aside>
        )}

        {/* 职位列表 */}
        <div className="flex-1">
          {filteredJobs.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <>
              <div className={cn(
                viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-4'
              )}>
                {paginatedJobs.map((job) => (
                  <OptimizedJobCard
                    key={job.id}
                    job={job}
                    variant={viewMode === 'list' ? 'compact' : 'default'}
                  />
                ))}
              </div>

              {/* 分页 */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// 筛选区块组件
function FilterSection({ 
  title, 
  icon: Icon, 
  children 
}: { 
  title: string
  icon: React.ComponentType<{ className?: string }>
  children: React.ReactNode
}) {
  return (
    <div>
      <h4 className="font-medium text-white mb-3 flex items-center gap-2">
        <Icon className="w-4 h-4 text-neon-cyan" />
        {title}
      </h4>
      {children}
    </div>
  )
}

// 筛选选项组件
function FilterOption({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all',
        isActive
          ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30'
          : 'text-gray-400 hover:bg-white/5 hover:text-white'
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      <span>{label}</span>
      {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-neon-cyan" />}
    </button>
  )
}

// 空状态组件
function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <Card className="p-12 text-center glass-card">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
        <Filter className="w-8 h-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">未找到符合条件的职位</h3>
      <p className="text-gray-400 mb-6">尝试调整筛选条件或搜索关键词</p>
      <Button variant="outline" onClick={onClear} aria-label="清除所有筛选条件">
        清除所有筛选
      </Button>
    </Card>
  )
}

// 分页组件
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  const getVisiblePages = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="上一页"
      >
        上一页
      </Button>

      {getVisiblePages().map((page, i) => (
        <div key={i}>
          {page === '...' ? (
            <span className="px-3 text-gray-500">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'neon' : 'outline'}
              size="sm"
              color={currentPage === page ? 'cyan' : undefined}
              onClick={() => onPageChange(page as number)}
              aria-label={`第 ${page} 页`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="下一页"
      >
        下一页
      </Button>
    </div>
  )
}
