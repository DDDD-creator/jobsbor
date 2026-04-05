/**
 * 搜索优化组件
 * 提供智能搜索建议和自动完成
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Search, X, TrendingUp, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchSuggestion {
  id: string
  text: string
  type: 'keyword' | 'company' | 'location' | 'history'
  count?: number
}

interface OptimizedSearchProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

// 热门搜索词
const HOT_KEYWORDS = [
  '量化研究员',
  'Web3开发',
  '产品经理',
  '区块链工程师',
  '远程工作',
  '前端开发',
  '智能合约',
  '数据分析',
]

// 搜索历史 (localStorage)
const SEARCH_HISTORY_KEY = 'jobsbor-search-history'

export function OptimizedSearch({
  placeholder = '搜索职位、公司或关键词...',
  onSearch,
  className,
  size = 'md',
}: OptimizedSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [history, setHistory] = useState<string[]>([])

  // 加载搜索历史
  useEffect(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY)
    if (saved) {
      try {
        setHistory(JSON.parse(saved).slice(0, 5))
      } catch (error) {
        console.error('Failed to parse search history:', error)
        localStorage.removeItem(SEARCH_HISTORY_KEY)
      }
    }
  }, [])

  // 保存搜索历史
  const saveToHistory = useCallback((term: string) => {
    if (!term.trim()) return
    const newHistory = [term, ...history.filter(h => h !== term)].slice(0, 5)
    setHistory(newHistory)
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
  }, [history])

  // 生成建议
  useEffect(() => {
    if (!query.trim()) {
      // 显示历史和热门
      const historySuggestions: SearchSuggestion[] = history.map((h, i) => ({
        id: `history-${i}`,
        text: h,
        type: 'history',
      }))
      
      const hotSuggestions: SearchSuggestion[] = HOT_KEYWORDS.map((k, i) => ({
        id: `hot-${i}`,
        text: k,
        type: 'keyword',
      }))
      
      setSuggestions([...historySuggestions, ...hotSuggestions.slice(0, 4)])
      return
    }

    // 根据输入过滤
    const filtered = HOT_KEYWORDS
      .filter(k => k.toLowerCase().includes(query.toLowerCase()))
      .map((k, i) => ({
        id: `suggest-${i}`,
        text: k,
        type: 'keyword' as const,
      }))
    
    setSuggestions(filtered)
  }, [query, history])

  const handleSearch = () => {
    if (!query.trim()) return
    saveToHistory(query)
    onSearch?.(query)
    setIsFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const clearSearch = () => {
    setQuery('')
    setIsFocused(false)
  }

  const sizeClasses = {
    sm: 'h-10 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg',
  }

  return (
    <div className={cn('relative', className)}>
      <div className={cn('relative flex items-center', sizeClasses[size])}>
        <Search className="absolute left-4 h-5 w-5 text-gray-500" />
        
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full pl-12 pr-10 bg-dark-200/50 backdrop-blur-xl border-white/10',
            'text-white placeholder:text-gray-500 rounded-xl',
            'focus:border-neon-cyan/50 focus:ring-neon-cyan/20',
            sizeClasses[size]
          )}
        />
        
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* 搜索建议下拉 */}
      {isFocused && (
        <>
          {/* 遮罩层 */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsFocused(false)}
          />
          
          <div className="absolute top-full left-0 right-0 mt-2 p-2 rounded-xl glass-card z-50">
            {suggestions.length > 0 ? (
              <div className="space-y-1">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setQuery(s.text)
                      handleSearch()
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-white/5 transition-colors"
                  >
                    {s.type === 'history' && <Clock className="h-4 w-4 text-gray-500" />}
                    {s.type === 'keyword' && <TrendingUp className="h-4 w-4 text-neon-cyan" />}
                    <span className="text-gray-300 text-sm">{s.text}</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm px-3 py-2">暂无建议</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
