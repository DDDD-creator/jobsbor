'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import type { JobSearchResponse, JobSearchResult, JobSearchParams } from '@/app/api/jobs/search/route'
import { JobType, JobLevel, RemoteType } from '@prisma/client'

interface UseJobSearchOptions {
  initialKeyword?: string
  autoSearch?: boolean
  debounceMs?: number
}

interface UseJobSearchReturn {
  // State
  jobs: JobSearchResult[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  pagination: JobSearchResponse['pagination'] | null
  facets: JobSearchResponse['facets'] | null
  hasMore: boolean

  // Filters
  filters: JobSearchParams
  setFilters: React.Dispatch<React.SetStateAction<JobSearchParams>>
  updateFilter: <K extends keyof JobSearchParams>(key: K, value: JobSearchParams[K]) => void
  resetFilters: () => void

  // Actions
  search: () => Promise<void>
  loadMore: () => Promise<void>
  refresh: () => Promise<void>
}

const DEFAULT_FILTERS: JobSearchParams = {
  page: 1,
  limit: 20,
  sortBy: 'newest',
}

export function useJobSearch(options: UseJobSearchOptions = {}): UseJobSearchReturn {
  const { initialKeyword = '', autoSearch = true, debounceMs = 300 } = options

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Parse URL params
  const parseUrlParams = useCallback((): JobSearchParams => {
    const params: JobSearchParams = {
      keyword: searchParams.get('keyword') || initialKeyword || undefined,
      industry: searchParams.get('industry') || undefined,
      type: (searchParams.get('type') as JobType) || undefined,
      level: (searchParams.get('level') as JobLevel) || undefined,
      remote: (searchParams.get('remote') as RemoteType) || undefined,
      location: searchParams.get('location') || undefined,
      salaryMin: searchParams.has('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined,
      salaryMax: searchParams.has('salaryMax') ? parseInt(searchParams.get('salaryMax')!) : undefined,
      skills: searchParams.get('skills')?.split(',').filter(Boolean),
      postedWithin: searchParams.has('postedWithin') ? parseInt(searchParams.get('postedWithin')!) : undefined,
      sortBy: (searchParams.get('sortBy') as JobSearchParams['sortBy']) || 'newest',
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '20'),
    }
    return params
  }, [searchParams, initialKeyword])

  // State
  const [jobs, setJobs] = useState<JobSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<JobSearchResponse['pagination'] | null>(null)
  const [facets, setFacets] = useState<JobSearchResponse['facets'] | null>(null)

  const [filters, setFilters] = useState<JobSearchParams>(parseUrlParams)

  // Update URL
  const updateUrl = useCallback(
    (newFilters: JobSearchParams) => {
      const params = new URLSearchParams()

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        if (key === 'skills' && Array.isArray(value)) {
          if (value.length > 0) params.set(key, value.join(','))
        } else if (key === 'page' && value === 1) {
          // Don't add page=1 to URL
        } else if (key === 'sortBy' && value === 'newest') {
          // Don't add default sort
        } else if (key === 'limit' && value === 20) {
          // Don't add default limit
        } else {
          params.set(key, String(value))
        }
      })

      const queryString = params.toString()
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.push(newUrl, { scroll: false })
    },
    [pathname, router]
  )

  // Build query string for API
  const buildQueryString = useCallback((searchFilters: JobSearchParams) => {
    const params = new URLSearchParams()

    Object.entries(searchFilters).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      if (key === 'skills' && Array.isArray(value)) {
        if (value.length > 0) params.set(key, value.join(','))
      } else {
        params.set(key, String(value))
      }
    })

    return params.toString()
  }, [])

  // Search function
  const search = useCallback(
    async (page = 1, append = false) => {
      if (page === 1) setIsLoading(true)
      else setIsLoadingMore(true)
      setError(null)

      try {
        const searchFilters = { ...filters, page }
        const queryString = buildQueryString(searchFilters)

        const response = await fetch(`/api/jobs/search?${queryString}`)

        if (!response.ok) {
          throw new Error('搜索失败')
        }

        const data: JobSearchResponse = await response.json()

        if (append) {
          setJobs((prev) => [...prev, ...data.jobs])
        } else {
          setJobs(data.jobs)
        }
        setPagination(data.pagination)
        setFacets(data.facets)
      } catch (err) {
        setError(err instanceof Error ? err.message : '搜索失败')
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [filters, buildQueryString]
  )

  // Load more
  const loadMore = useCallback(async () => {
    if (!pagination?.hasMore || isLoadingMore) return
    const nextPage = (filters.page || 1) + 1
    await search(nextPage, true)
    setFilters((prev) => ({ ...prev, page: nextPage }))
  }, [pagination, isLoadingMore, filters.page, search])

  // Refresh
  const refresh = useCallback(async () => {
    await search(1, false)
  }, [search])

  // Update single filter
  const updateFilter = useCallback(
    <K extends keyof JobSearchParams>(key: K, value: JobSearchParams[K]) => {
      const newFilters = { ...filters, [key]: value, page: 1 }
      setFilters(newFilters)
      updateUrl(newFilters)
    },
    [filters, updateUrl]
  )

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    updateUrl(DEFAULT_FILTERS)
  }, [updateUrl])

  // Sync URL params to filters
  useEffect(() => {
    setFilters(parseUrlParams())
  }, [parseUrlParams])

  // Auto search on filter change (debounced)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!autoSearch) return

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      search(1, false)
    }, debounceMs)

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [filters, autoSearch, debounceMs, search])

  return {
    jobs,
    isLoading,
    isLoadingMore,
    error,
    pagination,
    facets,
    hasMore: pagination?.hasMore ?? false,
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    search,
    loadMore,
    refresh,
  }
}

// Hook for search suggestions
export function useSearchSuggestions() {
  const [suggestions, setSuggestions] = useState<{
    titles: string[]
    companies: { name: string; slug: string }[]
    skills: string[]
  }>({ titles: [], companies: [], skills: [] })
  const [isLoading, setIsLoading] = useState(false)

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions({ titles: [], companies: [], skills: [] })
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'suggestions', query }),
      })

      if (response.ok) {
        const data = await response.json()
        setSuggestions(data)
      }
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { suggestions, isLoading, fetchSuggestions }
}

// Hook for search history
export function useSearchHistory(maxItems = 10) {
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('jobsbor_search_history')
      if (stored) {
        try {
          setHistory(JSON.parse(stored))
        } catch (e) {
          console.error('Failed to parse search history')
        }
      }
    }
  }, [])

  const addToHistory = useCallback(
    (keyword: string) => {
      if (!keyword.trim()) return

      setHistory((prev) => {
        const newHistory = [keyword, ...prev.filter((h) => h !== keyword)].slice(0, maxItems)
        localStorage.setItem('jobsbor_search_history', JSON.stringify(newHistory))
        return newHistory
      })
    },
    [maxItems]
  )

  const removeFromHistory = useCallback((keyword: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((h) => h !== keyword)
      localStorage.setItem('jobsbor_search_history', JSON.stringify(newHistory))
      return newHistory
    })
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
    localStorage.removeItem('jobsbor_search_history')
  }, [])

  return { history, addToHistory, removeFromHistory, clearHistory }
}

export default useJobSearch
