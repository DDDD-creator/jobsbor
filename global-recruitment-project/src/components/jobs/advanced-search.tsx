import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { 
  Search, 
  X, 
  SlidersHorizontal,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Tag,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

export interface AdvancedFilters {
  keyword: string
  industry: string
  type: string
  location: string
  salaryMin: number
  salaryMax: number
  experience: string
  tags: string[]
  postedWithin: string
  hasSalary: boolean
  remoteOnly: boolean
}

interface AdvancedSearchProps {
  filters: AdvancedFilters
  onFiltersChange: (filters: AdvancedFilters) => void
  onSearch: () => void
  totalResults: number
  className?: string
}

const industries = [
  { value: '', label: '全部行业' },
  { value: 'finance', label: '金融', color: 'cyan' },
  { value: 'web3', label: 'Web3/区块链', color: 'purple' },
  { value: 'internet', label: '互联网', color: 'pink' },
]

const jobTypes = [
  { value: '', label: '全部' },
  { value: 'full-time', label: '全职' },
  { value: 'part-time', label: '兼职' },
  { value: 'contract', label: '合同' },
  { value: 'remote', label: '远程' },
]

const locations = [
  { value: '', label: '全部地点' },
  { value: '北京', label: '北京' },
  { value: '上海', label: '上海' },
  { value: '深圳', label: '深圳' },
  { value: '杭州', label: '杭州' },
  { value: '广州', label: '广州' },
  { value: '新加坡', label: '新加坡' },
  { value: '香港', label: '香港' },
  { value: '远程', label: '远程' },
]

const experienceLevels = [
  { value: '', label: '全部经验' },
  { value: 'entry', label: '应届生/初级' },
  { value: 'mid', label: '3-5年' },
  { value: 'senior', label: '5-10年' },
  { value: 'expert', label: '10年+' },
]

const postedWithinOptions = [
  { value: '', label: '全部时间' },
  { value: '1', label: '24小时内' },
  { value: '3', label: '3天内' },
  { value: '7', label: '一周内' },
  { value: '30', label: '一月内' },
]

const popularTags = [
  'Python', 'JavaScript', 'React', 'Node.js', 'Go', 'Rust',
  '产品经理', 'UI设计', '数据分析', '量化', '区块链', 'DeFi',
  '远程', '高薪', '大厂', '外企', 'startup',
]

export function AdvancedSearch({ 
  filters, 
  onFiltersChange, 
  onSearch,
  totalResults,
  className 
}: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [localKeyword, setLocalKeyword] = useState(filters.keyword)

  // Debounce keyword search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localKeyword !== filters.keyword) {
        onFiltersChange({ ...filters, keyword: localKeyword })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [localKeyword])

  const handleFilterChange = useCallback((key: keyof AdvancedFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }, [filters, onFiltersChange])

  const handleTagToggle = useCallback((tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    handleFilterChange('tags', newTags)
  }, [filters.tags, handleFilterChange])

  const clearFilters = useCallback(() => {
    setLocalKeyword('')
    onFiltersChange({
      keyword: '',
      industry: '',
      type: '',
      location: '',
      salaryMin: 0,
      salaryMax: 1000000,
      experience: '',
      tags: [],
      postedWithin: '',
      hasSalary: false,
      remoteOnly: false,
    })
  }, [onFiltersChange])

  const activeFiltersCount = [
    filters.industry,
    filters.type,
    filters.location,
    filters.experience,
    filters.postedWithin,
    filters.hasSalary,
    filters.remoteOnly,
    ...filters.tags,
  ].filter(Boolean).length + (filters.keyword ? 1 : 0)

  const formatSalary = (value: number) => {
    if (value >= 10000) return `${(value / 10000).toFixed(0)}万`
    return `${value}`
  }

  return (
    <Card className={cn("border-white/10 bg-dark-200/50 backdrop-blur-xl", className)}>
      <div className="p-6">
        {/* 搜索框 */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={localKeyword}
            onChange={(e) => setLocalKeyword(e.target.value)}
            placeholder="搜索职位、公司、关键词..."
            className="pl-12 pr-24 py-6 text-lg bg-dark-300/50 border-white/10 focus:border-cyan-500/50 text-white placeholder:text-gray-500"
          />
          {localKeyword && (
            <button
              onClick={() => setLocalKeyword('')}
              className="absolute right-20 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
          <Button
            onClick={onSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90"
            aria-label="搜索职位"
          >
            搜索
          </Button>
        </div>

        {/* 快速筛选标签 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {industries.filter(i => i.value).map((industry) => (
            <Badge
              key={industry.value}
              variant={filters.industry === industry.value ? 'neon' : 'outline'}
              color={industry.color as 'cyan' | 'purple' | 'pink'}
              size="sm"
              className="cursor-pointer transition-all"
              onClick={() => handleFilterChange('industry', 
                filters.industry === industry.value ? '' : industry.value
              )}
            >
              {industry.label}
            </Badge>
          ))}
          
          <Badge
            variant={filters.remoteOnly ? 'neon' : 'outline'}
            color="green"
            size="sm"
            className="cursor-pointer transition-all"
            onClick={() => handleFilterChange('remoteOnly', !filters.remoteOnly)}
          >
            🌏 仅远程
          </Badge>
          
          <Badge
            variant={filters.hasSalary ? 'neon' : 'outline'}
            color="yellow"
            size="sm"
            className="cursor-pointer transition-all"
            onClick={() => handleFilterChange('hasSalary', !filters.hasSalary)}
          >
            💰 有薪资
          </Badge>

          {postedWithinOptions.filter(o => o.value).slice(0, 2).map((option) => (
            <Badge
              key={option.value}
              variant={filters.postedWithin === option.value ? 'neon' : 'outline'}
              color="orange"
              size="sm"
              className="cursor-pointer transition-all"
              onClick={() => handleFilterChange('postedWithin', 
                filters.postedWithin === option.value ? '' : option.value
              )}
            >
              <Clock className="w-3 h-3 mr-1" />
              {option.label}
            </Badge>
          ))}
        </div>

        {/* 展开/收起高级筛选 */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          {isExpanded ? '收起高级筛选' : '更多筛选条件'}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* 高级筛选面板 */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-white/10 space-y-6 animate-in slide-in-from-top-2">
            
            {/* 工作类型 & 经验 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  工作类型
                </label>
                <div className="flex flex-wrap gap-2">
                  {jobTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => handleFilterChange('type', type.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        filters.type === type.value
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-dark-300/50 text-gray-400 hover:bg-dark-300 hover:text-white"
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                  <Clock className="w-4 h-4 text-purple-400" />
                  经验要求
                </label>
                <div className="flex flex-wrap gap-2">
                  {experienceLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => handleFilterChange('experience', level.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        filters.experience === level.value
                          ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                          : "bg-dark-300/50 text-gray-400 hover:bg-dark-300 hover:text-white"
                      )}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 地点 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                <MapPin className="w-4 h-4 text-pink-400" />
                工作地点
              </label>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <button
                    key={location.value}
                    onClick={() => handleFilterChange('location', location.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-all",
                      filters.location === location.value
                        ? "bg-pink-500/20 text-pink-400 border border-pink-500/30"
                        : "bg-dark-300/50 text-gray-400 hover:bg-dark-300 hover:text-white"
                    )}
                  >
                    {location.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 薪资范围 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-4">
                <DollarSign className="w-4 h-4 text-yellow-400" />
                薪资范围
                <span className="text-xs text-gray-500 ml-auto">
                  {formatSalary(filters.salaryMin)} - {formatSalary(filters.salaryMax)}
                </span>
              </label>
              <Slider
                value={[filters.salaryMin, filters.salaryMax]}
                onValueChange={([min, max]) => {
                  handleFilterChange('salaryMin', min)
                  handleFilterChange('salaryMax', max)
                }}
                min={0}
                max={1000000}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>不限</span>
                <span>10万</span>
                <span>50万</span>
                <span>100万+</span>
              </div>
            </div>

            {/* 发布时间 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                <Sparkles className="w-4 h-4 text-orange-400" />
                发布时间
              </label>
              <div className="flex flex-wrap gap-2">
                {postedWithinOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('postedWithin', option.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm transition-all",
                      filters.postedWithin === option.value
                        ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                        : "bg-dark-300/50 text-gray-400 hover:bg-dark-300 hover:text-white"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 技能标签 */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                <Tag className="w-4 h-4 text-green-400" />
                技能标签
              </label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs transition-all",
                      filters.tags.includes(tag)
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-dark-300/50 text-gray-400 hover:bg-dark-300 hover:text-white"
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 底部操作 */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-sm text-gray-400">
                找到 <span className="text-cyan-400 font-semibold">{totalResults}</span> 个职位
              </span>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  disabled={activeFiltersCount === 0}
                >
                  清除筛选
                </Button>
                <Button
                  size="sm"
                  onClick={() => { onSearch(); setIsExpanded(false); }}
                  className="bg-gradient-to-r from-cyan-500 to-purple-500"
                >
                  应用筛选
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
