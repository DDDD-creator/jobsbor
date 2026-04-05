'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import {
  ArrowUpDown,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Check,
} from 'lucide-react'

export type SortOption = 'newest' | 'salary_high' | 'salary_low' | 'most_applied' | 'relevance'

interface SortOptionConfig {
  value: SortOption
  label: string
  icon: React.ElementType
  description?: string
}

const sortOptions: SortOptionConfig[] = [
  {
    value: 'newest',
    label: '最新发布',
    icon: Clock,
    description: '按发布时间从新到旧排序',
  },
  {
    value: 'salary_high',
    label: '薪资最高',
    icon: TrendingUp,
    description: '按薪资从高到低排序',
  },
  {
    value: 'salary_low',
    label: '薪资最低',
    icon: TrendingDown,
    description: '按薪资从低到高排序',
  },
  {
    value: 'most_applied',
    label: '最多申请',
    icon: Users,
    description: '按申请人数排序',
  },
  {
    value: 'relevance',
    label: '相关度',
    icon: ArrowUpDown,
    description: '按搜索匹配度排序',
  },
]

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function SortDropdown({
  value,
  onChange,
  className,
  size = 'md',
}: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentOption = sortOptions.find((o) => o.value === value) || sortOptions[0]
  const Icon = currentOption.icon

  const sizeClasses = {
    sm: 'h-8 text-xs px-2',
    md: 'h-10 text-sm px-3',
    lg: 'h-12 text-base px-4',
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'border-white/10 bg-dark-300/50 hover:bg-dark-300 hover:border-white/20 text-gray-300 hover:text-white gap-2',
            sizeClasses[size],
            className
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{currentOption.label}</span>
          <span className="sm:hidden">排序</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 border-white/10 bg-dark-200"
      >
        {sortOptions.map((option) => {
          const OptionIcon = option.icon
          const isSelected = value === option.value
          
          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => {
                onChange(option.value)
                setIsOpen(false)
              }}
              className={cn(
                'flex items-center gap-3 cursor-pointer focus:bg-white/5',
                isSelected && 'bg-cyan-500/10 focus:bg-cyan-500/20'
              )}
            >
              <OptionIcon
                className={cn(
                  'w-4 h-4',
                  isSelected ? 'text-cyan-400' : 'text-gray-400'
                )}
              />
              <div className="flex-1">
                <p
                  className={cn(
                    'text-sm',
                    isSelected ? 'text-cyan-400 font-medium' : 'text-gray-200'
                  )}
                >
                  {option.label}
                </p>
                {option.description && (
                  <p className="text-xs text-gray-500">{option.description}</p>
                )}
              </div>
              {isSelected && (
                <Check className="w-4 h-4 text-cyan-400" />
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SortDropdown
