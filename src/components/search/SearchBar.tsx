'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Building2,
  Briefcase,
  Wand2,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

interface SearchSuggestion {
  type: 'history' | 'hot' | 'title' | 'company' | 'skill'
  value: string
  count?: number
  metadata?: any
}

interface SearchBarProps {
  initialValue?: string
  onSearch: (keyword: string) => void
  placeholder?: string
  size?: 'sm' | 'md' | 'lg'
  showHotSearches?: boolean
  showHistory?: boolean
  className?: string
  autoFocus?: boolean
}

const STORAGE_KEY = 'jobsbor_search_history'
const MAX_HISTORY = 10

// 默认热门搜索
const DEFAULT_HOT_SEARCHES = [
  { value: '前端开发', count: 1240 },
  { value: 'Python', count: 980 },
  { value: '产品经理', count: 856 },
  { value: '远程工作', count: 720 },
  { value: '区块链', count: 650 },
  { value: 'Java', count: 620 },
  { value: 'React', count: 580 },
  { value: 'UI设计', count: 520 },
  { value: '量化交易', count: 480 },
  { value: 'Go', count: 450 },
]

export function SearchBar({
  initialValue = '',
  onSearch,
  placeholder = '搜索职位、公司、技能...',
  size = 'md',
  showHotSearches = true,
  showHistory = true,
  className,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [keyword, setKeyword] = useState(initialValue)
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [hotSearches, setHotSearches] = useState(DEFAULT_HOT_SEARCHES)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // 同步初始值
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword')
    if (urlKeyword) {
      setKeyword(urlKeyword)
    }
  }, [searchParams])

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 键盘导航
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSelectSuggestion(suggestions[selectedIndex])
          } else {
            handleSearch()
          }
          break
        case 'Escape':
          setIsOpen(false)
          inputRef.current?.blur()
          break
      }
    },
    [isOpen, suggestions, selectedIndex]
  )

  // 获取搜索建议
  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        // 显示历史和热门搜索
        const historySuggestions: SearchSuggestion[] = showHistory
          ? searchHistory.map((h) => ({ type: 'history', value: h }))
          : []
        const hotSuggestions: SearchSuggestion[] = showHotSearches
          ? hotSearches.map((h) => ({ type: 'hot', value: h.value, count: h.count }))
          : []
        setSuggestions([...historySuggestions, ...hotSuggestions])
        return
      }

      try {
        const response = await fetch('/api/jobs/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'suggestions', query }),
        })

        if (response.ok) {
          const data = await response.json()
          const newSuggestions: SearchSuggestion[] = [
            ...data.titles.map((t: string) => ({ type: 'title' as const, value: t })),
            ...data.companies.map((c: any) => ({
              type: 'company' as const,
              value: c.name,
              metadata: c,
            })),
            ...data.skills.map((s: string) => ({ type: 'skill' as const, value: s })),
          ]
          setSuggestions(newSuggestions.slice(0, 8))
        }
      } catch (error) {
        console.error('Failed to fetch suggestions:', error)
      }
    },
    [searchHistory, hotSearches, showHistory, showHotSearches]
  )

  // 防抖获取建议
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(keyword)
    }, 200)
    return () => clearTimeout(timer)
  }, [keyword, fetchSuggestions])

  // 保存搜索历史
  const saveToHistory = useCallback((term: string) => {
    if (!term.trim()) return
    setSearchHistory((prev) => {
      const newHistory = [term, ...prev.filter((h) => h !== term)].slice(0, MAX_HISTORY)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
      return newHistory
    })
  }, [])

  // 删除历史记录
  const removeFromHistory = useCallback(
    (term: string, e: React.MouseEvent) => {
      e.stopPropagation()
      setSearchHistory((prev) => {
        const newHistory = prev.filter((h) => h !== term)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory))
        return newHistory
      })
      // 刷新建议列表
      fetchSuggestions(keyword)
    },
    [fetchSuggestions, keyword]
  )

  // 清空历史
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    localStorage.removeItem(STORAGE_KEY)
    fetchSuggestions(keyword)
  }, [fetchSuggestions, keyword])

  // 执行搜索
  const handleSearch = useCallback(() => {
    if (!keyword.trim()) return
    saveToHistory(keyword)
    onSearch(keyword)
    setIsOpen(false)
  }, [keyword, onSearch, saveToHistory])

  // 选择建议
  const handleSelectSuggestion = useCallback(
    (suggestion: SearchSuggestion) => {
      setKeyword(suggestion.value)
      saveToHistory(suggestion.value)
      onSearch(suggestion.value)
      setIsOpen(false)
    },
    [onSearch, saveToHistory]
  )

  // 获取建议图标
  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'history':
        return <Clock className="w-4 h-4 text-gray-400" />
      case 'hot':
        return <TrendingUp className="w-4 h-4 text-orange-400" />
      case 'title':
        return <Briefcase className="w-4 h-4 text-cyan-400" />
      case 'company':
        return <Building2 className="w-4 h-4 text-purple-400" />
      case 'skill':
        return <Wand2 className="w-4 h-4 text-green-400" />
      default:
        return <Search className="w-4 h-4 text-gray-400" />
    }
  }

  // 获取建议标签
  const getSuggestionLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'history':
        return '历史'
      case 'hot':
        return '热门'
      case 'title':
        return '职位'
      case 'company':
        return '公司'
      case 'skill':
        return '技能'
      default:
        return ''
    }
  }

  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg',
  }

  const inputPadding = {
    sm: 'pl-9 pr-20',
    md: 'pl-12 pr-24',
    lg: 'pl-14 pr-28',
  }

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* 搜索输入框 */}
      <div className="relative">
        <Search
          className={cn(
            'absolute left-4 top-1/2 -translate-y-1/2 text-gray-400',
            size === 'sm' && 'w-4 h-4 left-3',
            size === 'md' && 'w-5 h-5',
            size === 'lg' && 'w-6 h-6 left-5'
          )}
        />
        <Input
          ref={inputRef}
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value)
            setIsOpen(true)
            setSelectedIndex(-1)
          }}
          onFocus={() => {
            setIsOpen(true)
            fetchSuggestions(keyword)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'bg-dark-300/50 border-white/10 focus:border-cyan-500/50 text-white placeholder:text-gray-500 transition-all',
            sizeClasses[size],
            inputPadding[size]
          )}
        />
        
        {/* 清除按钮 */}
        {keyword && (
          <button
            onClick={() => {
              setKeyword('')
              inputRef.current?.focus()
            }}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors',
              size === 'sm' && 'right-16',
              size === 'md' && 'right-20',
              size === 'lg' && 'right-24'
            )}
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        
        {/* 搜索按钮 */}
        <Button
          onClick={handleSearch}
          disabled={!keyword.trim()}
          className={cn(
            'absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 disabled:opacity-50',
            size === 'sm' && 'h-7 px-3 text-xs',
            size === 'md' && 'h-9 px-4',
            size === 'lg' && 'h-10 px-5'
          )}
        >
          搜索
        </Button>
      </div>

      {/* 下拉建议面板 */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 border-white/10 bg-dark-200/95 backdrop-blur-xl z-50 overflow-hidden">
          <ScrollArea className="max-h-[400px]">
            {suggestions.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>开始输入以获取搜索建议</p>
              </div>
            ) : (
              <div className="py-2">
                {/* 分组显示建议 */}
                {(['history', 'hot', 'title', 'company', 'skill'] as const).map(
                  (type) => {
                    const typeSuggestions = suggestions.filter((s) => s.type === type)
                    if (typeSuggestions.length === 0) return null

                    return (
                      <div key={type}>
                        <div className="px-4 py-2 text-xs font-medium text-gray-500 flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            {type === 'history' && <Clock className="w-3 h-3" />}
                            {type === 'hot' && <TrendingUp className="w-3 h-3" />}
                            {getSuggestionLabel(type)}
                          </span>
                          {type === 'history' && searchHistory.length > 0 && (
                            <button
                              onClick={clearHistory}
                              className="text-xs text-cyan-400 hover:text-cyan-300"
                            >
                              清空
                            </button>
                          )}
                        </div>
                        {typeSuggestions.map((suggestion, index) => {
                          const globalIndex = suggestions.findIndex(
                            (s) => s === suggestion
                          )
                          return (
                            <button
                              key={`${suggestion.type}-${suggestion.value}`}
                              onClick={() => handleSelectSuggestion(suggestion)}
                              className={cn(
                                'w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/5 transition-colors text-left',
                                selectedIndex === globalIndex && 'bg-white/10'
                              )}
                            >
                              {getSuggestionIcon(suggestion.type)}
                              <span className="flex-1 text-sm text-gray-200 truncate">
                                {suggestion.value}
                              </span>
                              {suggestion.count && (
                                <span className="text-xs text-gray-500">
                                  {suggestion.count}
                                </span>
                              )}
                              {suggestion.type === 'history' && (
                                <button
                                  onClick={(e) => removeFromHistory(suggestion.value, e)}
                                  className="p-1 rounded hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3 text-gray-500" />
                                </button>
                              )}
                              <ArrowRight
                                className={cn(
                                  'w-4 h-4 text-gray-600',
                                  selectedIndex === globalIndex && 'text-cyan-400'
                                )}
                              />
                            </button>
                          )
                        })}
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </ScrollArea>
          
          {/* 底部提示 */}
          <div className="px-4 py-2 border-t border-white/5 text-xs text-gray-500 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-white/10">↑↓</span>
                选择
              </span>
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-white/10">↵</span>
                确认
              </span>
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-white/10">Esc</span>
                关闭
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default SearchBar
