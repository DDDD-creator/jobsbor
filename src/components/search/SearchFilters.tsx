'use client'

import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { JobType, JobLevel, RemoteType } from '@prisma/client'
import {
  X,
  Filter,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Tag,
  GraduationCap,
  Globe,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react'

export interface SearchFiltersState {
  keyword?: string
  industry?: string
  type?: JobType
  level?: JobLevel
  remote?: RemoteType
  location?: string
  salaryMin?: number
  salaryMax?: number
  skills?: string[]
  postedWithin?: number
}

interface FacetOption {
  value: string
  count: number
}

interface SearchFacets {
  industries: FacetOption[]
  types: { value: JobType; count: number }[]
  levels: { value: JobLevel; count: number }[]
  remoteTypes: { value: RemoteType; count: number }[]
  locations: FacetOption[]
  salaryRanges: { min: number; max: number; label: string; count: number }[]
}

interface SearchFiltersProps {
  filters: SearchFiltersState
  facets?: SearchFacets
  onFiltersChange: (filters: SearchFiltersState) => void
  onApply: () => void
  onReset: () => void
  className?: string
  variant?: 'sidebar' | 'drawer' | 'compact'
}

const industries = [
  { value: '互联网', label: '互联网', color: 'blue' },
  { value: '金融', label: '金融', color: 'cyan' },
  { value: 'Web3/区块链', label: 'Web3/区块链', color: 'purple' },
  { value: '人工智能', label: '人工智能', color: 'pink' },
  { value: '电子商务', label: '电子商务', color: 'orange' },
  { value: '企业服务', label: '企业服务', color: 'green' },
  { value: '游戏', label: '游戏', color: 'red' },
  { value: '教育', label: '教育', color: 'yellow' },
  { value: '医疗健康', label: '医疗健康', color: 'teal' },
]

const jobTypeLabels: Record<JobType, string> = {
  [JobType.FULLTIME]: '全职',
  [JobType.PARTTIME]: '兼职',
  [JobType.CONTRACT]: '合同',
  [JobType.INTERNSHIP]: '实习',
}

const jobLevelLabels: Record<JobLevel, string> = {
  [JobLevel.JUNIOR]: '初级',
  [JobLevel.MID]: '中级',
  [JobLevel.SENIOR]: '高级',
  [JobLevel.LEAD]: '主管/Lead',
  [JobLevel.EXECUTIVE]: '高管',
}

const remoteTypeLabels: Record<RemoteType, string> = {
  [RemoteType.ONSITE]: '办公室',
  [RemoteType.REMOTE]: '远程',
  [RemoteType.HYBRID]: '混合',
}

const experienceLevels = [
  { value: JobLevel.JUNIOR, label: '应届生/初级', years: '0-2年' },
  { value: JobLevel.MID, label: '中级', years: '3-5年' },
  { value: JobLevel.SENIOR, label: '高级', years: '5-10年' },
  { value: JobLevel.LEAD, label: '主管/Lead', years: '8-15年' },
  { value: JobLevel.EXECUTIVE, label: '高管', years: '15年+' },
]

const postedWithinOptions = [
  { value: 1, label: '24小时内' },
  { value: 3, label: '3天内' },
  { value: 7, label: '7天内' },
  { value: 14, label: '两周内' },
  { value: 30, label: '一个月内' },
]

const popularLocations = [
  '北京', '上海', '深圳', '杭州', '广州', '成都', ' remote', '新加坡', '香港',
]

const popularSkills = [
  'JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'Python',
  'Go', 'Rust', 'Java', 'C++', 'Solidity', '智能合约',
  '产品经理', 'UI设计', 'UX设计', '数据分析', '机器学习',
  '区块链', 'DeFi', 'NFT', '量化交易', '金融科技',
]

export function SearchFilters({
  filters,
  facets,
  onFiltersChange,
  onApply,
  onReset,
  className,
  variant = 'sidebar',
}: SearchFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['type', 'level', 'salary', 'location'])
  )
  const [localSalaryRange, setLocalSalaryRange] = useState<[number, number]>([
    filters.salaryMin || 0,
    filters.salaryMax || 1000000,
  ])

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }, [])

  const handleFilterChange = useCallback(
    <K extends keyof SearchFiltersState>(key: K, value: SearchFiltersState[K]) => {
      onFiltersChange({ ...filters, [key]: value })
    },
    [filters, onFiltersChange]
  )

  const handleSkillToggle = useCallback(
    (skill: string) => {
      const currentSkills = filters.skills || []
      const newSkills = currentSkills.includes(skill)
        ? currentSkills.filter((s) => s !== skill)
        : [...currentSkills, skill]
      handleFilterChange('skills', newSkills.length > 0 ? newSkills : undefined)
    },
    [filters.skills, handleFilterChange]
  )

  const handleSalaryChange = useCallback(
    (value: number[]) => {
      setLocalSalaryRange([value[0], value[1]])
    },
    []
  )

  const handleSalaryChangeComplete = useCallback(
    (value: number[]) => {
      handleFilterChange('salaryMin', value[0] > 0 ? value[0] : undefined)
      handleFilterChange('salaryMax', value[1] < 1000000 ? value[1] : undefined)
    },
    [handleFilterChange]
  )

  const formatSalary = (value: number) => {
    if (value >= 10000) return `${(value / 10000).toFixed(0)}万`
    return `${(value / 1000).toFixed(0)}K`
  }

  const activeFiltersCount = [
    filters.industry,
    filters.type,
    filters.level,
    filters.remote,
    filters.location,
    filters.postedWithin,
    ...(filters.skills || []),
  ].filter(Boolean).length + (filters.salaryMin || filters.salaryMax ? 1 : 0)

  const SectionHeader = ({
    title,
    icon: Icon,
    section,
    count,
  }: {
    title: string
    icon: React.ElementType
    section: string
    count?: number
  }) => (
    <button
      onClick={() => toggleSection(section)}
      className="flex items-center justify-between w-full py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-cyan-400" />
        {title}
        {count !== undefined && count > 0 && (
          <span className="text-xs text-gray-500">({count})</span>
        )}
      </div>
      {expandedSections.has(section) ? (
        <ChevronUp className="w-4 h-4 text-gray-500" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-500" />
      )}
    </button>
  )

  const FilterContent = (
    <>
      {/* 行业筛选 */}
      <div>
        <SectionHeader title="行业" icon={Briefcase} section="industry" count={facets?.industries.length} />
        {expandedSections.has('industry') && (
          <div className="flex flex-wrap gap-2 pb-4 animate-in slide-in-from-top-1">
            {facets?.industries.map((item) => (
              <button
                key={item.value}
                onClick={() =>
                  handleFilterChange('industry', filters.industry === item.value ? undefined : item.value)
                }
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs transition-all border',
                  filters.industry === item.value
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                    : 'bg-dark-300/50 text-gray-400 border-transparent hover:border-white/10 hover:text-white'
                )}
              >
                {item.value}
                <span className="ml-1 text-gray-500">({item.count})</span>
              </button>
            )) ||
              industries.map((industry) => (
                <button
                  key={industry.value}
                  onClick={() =>
                    handleFilterChange(
                      'industry',
                      filters.industry === industry.value ? undefined : industry.value
                    )
                  }
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs transition-all border',
                    filters.industry === industry.value
                      ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                      : 'bg-dark-300/50 text-gray-400 border-transparent hover:border-white/10 hover:text-white'
                  )}
                >
                  {industry.label}
                </button>
              ))}
          </div>
        )}
      </div>

      <Separator className="bg-white/5" />

      {/* 工作类型 */}
      <div>
        <SectionHeader title="工作类型" icon={Briefcase} section="type" count={facets?.types.length} />
        {expandedSections.has('type') && (
          <div className="flex flex-wrap gap-2 pb-4 animate-in slide-in-from-top-1">
            {facets?.types.map((item) => (
              <button
                key={item.value}
                onClick={() =>
                  handleFilterChange('type', filters.type === item.value ? undefined : item.value)
                }
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs transition-all border',
                  filters.type === item.value
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                    : 'bg-dark-300/50 text-gray-400 border-transparent hover:border-white/10 hover:text-white'
                )}
              >
                {jobTypeLabels[item.value]}
                <span className="ml-1 text-gray-500">({item.count})</span>
              </button>
            )) ||
              Object.entries(jobTypeLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() =>
                    handleFilterChange('type', filters.type === (value as JobType) ? undefined : (value as JobType))
                  }
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs transition-all border',
                    filters.type === value
                      ? 'bg-purple-500/20 text-purple-400 border-purple-500/50'
                      : 'bg-dark-300/50 text-gray-400 border-transparent hover:border-white/10 hover:text-white'
                  )}
                >
                  {label}
                </button>
              ))}
          </div>
        )}
      </div>

      <Separator className="bg-white/5" />

      {/* 经验级别 */}
      <div>
        <SectionHeader title="经验要求" icon={GraduationCap} section="level" count={facets?.levels.length} />
        {expandedSections.has('level') && (
          <div className="space-y-2 pb-4 animate-in slide-in-from-top-1">
            {experienceLevels.map((exp) => (
              <button
                key={exp.value}
                onClick={() =>
                  handleFilterChange('level', filters.level === exp.value ? undefined : exp.value)
                }
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all border',
                  filters.level === exp.value
                    ? 'bg-pink-500/20 text-pink-400 border-pink-500/50'
                    : 'bg-dark-300/50 text-gray-400 border-transparent hover:border-white/10 hover:text-white'
                )}
              >
                <span>{exp.label}</span>
                <span className="text-gray-500">{exp.years}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Separator className="bg-white/5" />

      {/* 工作地点 */}
      <div>
        <SectionHeader title="工作地点" icon={MapPin} section="location" count={facets?.locations.length} />
        {expandedSections.has('location') && (
          <div className="pb-4 animate-in slide-in-from-top-1">
            <div className="flex flex-wrap gap-2 mb-3">
              {facets?.locations.slice(0, 10).map((item) => (
                <button
                  key={item.value}
                  onClick={() =>
                    handleFilterChange(
                      'location',
                      filters.location === item.value ? undefined : item.value
                    )
                  }
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs transition-all border',
                    filters.location === item.value
                      ? 'bg-green-500/20 text-green-400 border-green-500/50'
                      : 'bg-dark-300/50 text-gray-400 border-transparent hover:border-white/10 hover:text-white'
                  )}
                >
                  {item.value}
                  <span className="ml-1 text-gray-500">({item.count})</span>
                </button>
              )) ||
                popularLocations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() =>
                      handleFilterChange('location', filters.location === loc ? undefined : loc)
                    }
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs transition-all border',
                      filters.location === loc
                        ? 'bg-green-500/20 text-green-400 border-green-500/50'
                        : 'bg-dark-300/50 text-gray-400 border-transparent hover:border-white/10 hover:text-white'
                    )}
                  >
                    {loc}
                  </button>
                ))}
            </div>
            {/* 远程类型 */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(remoteTypeLabels).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() =>
                    handleFilterChange(
                      'remote',
                      filters.remote === (value as RemoteType) ? undefined : (value as RemoteType)
                    )
                  }
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs transition-all border flex items-center gap-1',
                    filters.remote === value
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                      : 'bg-dark-300/50 text-gray-400 border-transparent hover:border-white/10 hover:text-white'
                  )}
                >
                  <Globe className="w-3 h-3" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator className="bg-white/5" />

      {/* 薪资范围 */}
      <div>
        <SectionHeader title="薪资范围" icon={DollarSign} section="salary" />
        {expandedSections.has('salary') && (
          <div className="pb-4 animate-in slide-in-from-top-1">
            <div className="px-2 mb-4">
              <Slider
                value={localSalaryRange}
                onValueChange={handleSalaryChange}
                onValueCommit={handleSalaryChangeComplete}
                min={0}
                max={1000000}
                step={5000}
                className="w-full"
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-4">
              <span>{formatSalary(localSalaryRange[0])}</span>
              <span className="text-cyan-400">
                {localSalaryRange[0] === 0 && localSalaryRange[1] === 1000000
                  ? '不限'
                  : `${formatSalary(localSalaryRange[0])} - ${formatSalary(localSalaryRange[1])}`}
              </span>
              <span>{formatSalary(localSalaryRange[1])}+</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {facets?.salaryRanges.map((range) => (
                <button
                  key={range.label}
                  onClick={() => {
                    const newRange: [number, number] = [range.min, range.max]
                    setLocalSalaryRange(newRange)
                    handleFilterChange('salaryMin', range.min > 0 ? range.min : undefined)
                    handleFilterChange('salaryMax', range.max < 1000000 ? range.max : undefined)
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs transition-all border',
                    localSalaryRange[0] === range.min && localSalaryRange[1] === range.max
                      ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                      : 'bg-dark-300/50 text-gray-400 border-transparent hover:border-white/10 hover:text-white'
                  )}
                >
                  {range.label}
                  <span className="ml-1 text-gray-500">({range.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator className="bg-white/5" />

      {/* 发布时间 */}
      <div>
        <SectionHeader title="发布时间" icon={Clock} section="posted" />
        {expandedSections.has('posted') && (
          <div className="flex flex-wrap gap-2 pb-4 animate-in slide-in-from-top-1">
            {postedWithinOptions.map((option) => (
              <button
                key={option.value}
                onClick={() =>
                  handleFilterChange(
                    'postedWithin',
                    filters.postedWithin === option.value ? undefined : option.value
                  )
                }
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs transition-all border',
                  filters.postedWithin === option.value
                    ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                    : 'bg-dark-300/50 text-gray-400 border-transparent hover:border-white/10 hover:text-white'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <Separator className="bg-white/5" />

      {/* 技能标签 */}
      <div>
        <SectionHeader title="技能标签" icon={Tag} section="skills" />
        {expandedSections.has('skills') && (
          <div className="flex flex-wrap gap-2 pb-4 animate-in slide-in-from-top-1">
            {popularSkills.map((skill) => (
              <button
                key={skill}
                onClick={() => handleSkillToggle(skill)}
                className={cn(
                  'px-2.5 py-1 rounded-md text-xs transition-all border',
                  filters.skills?.includes(skill)
                    ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
                    : 'bg-dark-300/50 text-gray-400 border-transparent hover:border-white/10 hover:text-white'
                )}
              >
                {skill}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 底部操作按钮 */}
      <div className="pt-4 flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={activeFiltersCount === 0}
          className="flex-1"
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          重置
        </Button>
        <Button size="sm" onClick={onApply} className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500">
          <Filter className="w-4 h-4 mr-1" />
          应用筛选
          {activeFiltersCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-xs">{activeFiltersCount}</span>
          )}
        </Button>
      </div>
    </>
  )

  if (variant === 'compact') {
    return (
      <Card className={cn('border-white/10 bg-dark-200/50 backdrop-blur-xl p-4', className)}>
        {FilterContent}
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        'border-white/10 bg-dark-200/50 backdrop-blur-xl',
        variant === 'sidebar' && 'sticky top-20',
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            筛选条件
          </h3>
          {activeFiltersCount > 0 && (
            <Badge variant="neon" color="cyan" size="sm">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
      </div>
      <ScrollArea className={variant === 'sidebar' ? 'h-[calc(100vh-280px)]' : undefined}>
        <div className="px-4 pb-4">{FilterContent}</div>
      </ScrollArea>
    </Card>
  )
}

export default SearchFilters
