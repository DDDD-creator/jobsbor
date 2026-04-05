'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SearchBar } from '@/components/search/SearchBar'
import { SearchFilters, type SearchFiltersState } from '@/components/search/SearchFilters'
import { SortDropdown, type SortOption } from '@/components/search/SortDropdown'
import { JobCard } from '@/components/search/JobSearchCard'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { Skeleton } from '@/components/ui/Skeleton'
import { ScrollReveal } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { JobType, JobLevel, RemoteType } from '@prisma/client'
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  AlertCircle,
  Loader2,
  ChevronDown,
  X,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react'
import type { JobSearchResponse, JobSearchResult } from '@/app/api/jobs/search/route'

interface SearchPageProps {
  params: { lang: string }
}

const VIEW_MODES = [
  { value: 'list', icon: List, label: '列表' },
  { value: 'grid', icon: LayoutGrid, label: '网格' },
] as const

type ViewMode = (typeof VIEW_MODES)[number]['value']

export default function JobSearchPage({ params }: SearchPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { lang } = params

  // State
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [searchResults, setSearchResults] = useState<JobSearchResult[]>([])
  const [pagination, setPagination] = useState<JobSearchResponse['pagination'] | null>(null)
  const [facets, setFacets] = useState<JobSearchResponse['facets'] | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filters state
  const [filters, setFilters] = useState<SearchFiltersState>({
    keyword: searchParams.get('keyword') || undefined,
    industry: searchParams.get('industry') || undefined,
    type: (searchParams.get('type') as JobType) || undefined,
    level: (searchParams.get('level') as JobLevel) || undefined,
    remote: (searchParams.get('remote') as RemoteType) || undefined,
    location: searchParams.get('location') || undefined,
    salaryMin: searchParams.has('salaryMin') ? parseInt(searchParams.get('salaryMin')!) : undefined,
    salaryMax: searchParams.has('salaryMax') ? parseInt(searchParams.get('salaryMax')!) : undefined,
    skills: searchParams.get('skills')?.split(',').filter(Boolean) || undefined,
    postedWithin: searchParams.has('postedWithin') ? parseInt(searchParams.get('postedWithin')!) : undefined,
  })

  const [sortBy, setSortBy] = useState<SortOption>(
    (searchParams.get('sortBy') as SortOption) || 'newest'
  )

  const currentPage = parseInt(searchParams.get('page') || '1')

  // Build query string from filters
  const buildQueryString = useCallback(
    (overrideFilters?: Partial<typeof filters>, overridePage?: number) => {
      const params = new URLSearchParams()
      const mergedFilters = { ...filters, ...overrideFilters }
      const page = overridePage || currentPage

      if (mergedFilters.keyword) params.set('keyword', mergedFilters.keyword)
      if (mergedFilters.industry) params.set('industry', mergedFilters.industry)
      if (mergedFilters.type) params.set('type', mergedFilters.type)
      if (mergedFilters.level) params.set('level', mergedFilters.level)
      if (mergedFilters.remote) params.set('remote', mergedFilters.remote)
      if (mergedFilters.location) params.set('location', mergedFilters.location)
      if (mergedFilters.salaryMin) params.set('salaryMin', mergedFilters.salaryMin.toString())
      if (mergedFilters.salaryMax) params.set('salaryMax', mergedFilters.salaryMax.toString())
      if (mergedFilters.skills?.length) params.set('skills', mergedFilters.skills.join(','))
      if (mergedFilters.postedWithin) params.set('postedWithin', mergedFilters.postedWithin.toString())
      if (sortBy !== 'newest') params.set('sortBy', sortBy)
      if (page > 1) params.set('page', page.toString())

      return params.toString()
    },
    [filters, sortBy, currentPage]
  )

  // Update URL when filters change
  const updateUrl = useCallback(
    (newFilters?: Partial<typeof filters>, newPage?: number) => {
      const queryString = buildQueryString(newFilters, newPage)
      const newUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.push(newUrl, { scroll: false })
    },
    [buildQueryString, pathname, router]
  )

  // Fetch search results
  const fetchResults = useCallback(
    async (page = 1, append = false) => {
      if (page === 1) setIsLoading(true)
      else setIsLoadingMore(true)
      setError(null)

      try {
        const queryString = buildQueryString(undefined, page)
        const response = await fetch(`/api/jobs/search?${queryString}`)

        if (!response.ok) {
          throw new Error('搜索失败')
        }

        const data: JobSearchResponse = await response.json()

        if (append) {
          setSearchResults((prev) => [...prev, ...data.jobs])
        } else {
          setSearchResults(data.jobs)
        }
        setPagination(data.pagination)
        setFacets(data.facets)
      } catch (err) {
        setError(err instanceof Error ? err.message : '搜索失败，请稍后重试')
      } finally {
        setIsLoading(false)
        setIsLoadingMore(false)
      }
    },
    [buildQueryString]
  )

  // Initial load and when URL changes
  useEffect(() => {
    fetchResults(currentPage)
  }, [fetchResults, currentPage])

  // Handle search
  const handleSearch = useCallback(
    (keyword: string) => {
      const newFilters = { ...filters, keyword: keyword || undefined }
      setFilters(newFilters)
      updateUrl(newFilters, 1)
    },
    [filters, updateUrl]
  )

  // Handle filter apply
  const handleApplyFilters = useCallback(() => {
    updateUrl(filters, 1)
    setShowMobileFilters(false)
  }, [filters, updateUrl])

  // Handle filter reset
  const handleResetFilters = useCallback(() => {
    const emptyFilters: SearchFiltersState = {}
    setFilters(emptyFilters)
    updateUrl(emptyFilters, 1)
  }, [updateUrl])

  // Handle sort change
  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      setSortBy(newSort)
      const queryString = buildQueryString()
      const params = new URLSearchParams(queryString)
      params.set('sortBy', newSort)
      params.set('page', '1')
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [buildQueryString, pathname, router]
  )

  // Handle load more
  const handleLoadMore = useCallback(() => {
    if (pagination?.hasMore) {
      const nextPage = currentPage + 1
      updateUrl(filters, nextPage)
    }
  }, [pagination, currentPage, filters, updateUrl])

  // Count active filters
  const activeFiltersCount = [
    filters.industry,
    filters.type,
    filters.level,
    filters.remote,
    filters.location,
    filters.postedWithin,
    ...(filters.skills || []),
  ].filter(Boolean).length + (filters.salaryMin || filters.salaryMax ? 1 : 0) + (filters.keyword ? 1 : 0)

  // Render loading skeletons
  const renderSkeletons = () => {
    return Array.from({ length: 6 }).map((_, i) => (
      <Card key={i} className="border-white/10 bg-dark-200/50 p-5">
        <div className="flex gap-4">
          <Skeleton.Base className="w-16 h-16 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton.Base className="h-6 w-1/3" />
            <Skeleton.Base className="h-4 w-1/4" />
            <Skeleton.Base className="h-4 w-3/4" />
            <div className="flex gap-2 pt-2">
              <Skeleton.Base className="h-6 w-16" />
              <Skeleton.Base className="h-6 w-16" />
              <Skeleton.Base className="h-6 w-16" />
            </div>
          </div>
        </div>
      </Card>
    ))
  }

  // Render empty state
  const renderEmptyState = () => (
    <Card className="border-white/10 bg-dark-200/50 p-12 text-center">
      <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-white mb-2">没有找到符合条件的职位</h3>
      <p className="text-gray-400 mb-6">
        试试调整筛选条件，或者使用不同的关键词搜索
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" onClick={handleResetFilters}>
          <X className="w-4 h-4 mr-2" />
          清除所有筛选
        </Button>
        <Button
          onClick={() => {
            setFilters({ keyword: '前端' })
            updateUrl({ keyword: '前端' }, 1)
          }}
        >
          <Sparkles className="w-4 h-4 mr-2" />
          试试"前端开发"
        </Button>
      </div>
    </Card>
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0f1c]">
      <Header />

      <main className="flex-1 relative pt-16">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
          <div className="absolute inset-0 bg-grid" />
        </div>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4 relative">
          <Breadcrumb
            items={[
              { label: '首页', href: `/${lang}` },
              { label: '职位搜索', href: `/${lang}/jobs/search` },
            ]}
          />
        </div>

        {/* Search Header */}
        <div className="relative border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
            <ScrollReveal>
              <div className="max-w-3xl">
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  搜索
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400">
                    理想职位
                  </span>
                </h1>

                <SearchBar
                  initialValue={filters.keyword || ''}
                  onSearch={handleSearch}
                  placeholder="搜索职位名称、公司、技能关键词..."
                  size="lg"
                  className="w-full"
                  autoFocus
                />
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="flex gap-8">
            {/* Sidebar Filters - Desktop */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              <SearchFilters
                filters={filters}
                facets={facets || undefined}
                onFiltersChange={setFilters}
                onApply={handleApplyFilters}
                onReset={handleResetFilters}
                variant="sidebar"
              />
            </aside>

            {/* Results */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">
                    找到{' '}
                    <span className="text-cyan-400 font-semibold">
                      {pagination?.total || 0}
                    </span>{' '}
                    个职位
                  </span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="outline" size="sm">
                      {activeFiltersCount} 个筛选条件
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-dark-300/50 border border-white/10">
                    {VIEW_MODES.map((mode) => {
                      const Icon = mode.icon
                      return (
                        <button
                          key={mode.value}
                          onClick={() => setViewMode(mode.value)}
                          className={cn(
                            'p-2 rounded-md transition-all',
                            viewMode === mode.value
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'text-gray-400 hover:text-white'
                          )}
                          title={mode.label}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      )
                    })}
                  </div>

                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden border-white/10"
                    onClick={() => setShowMobileFilters(true)}
                  >
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    筛选
                    {activeFiltersCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs"
                      >
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>

                  {/* Sort Dropdown */}
                  <SortDropdown value={sortBy} onChange={handleSortChange} />
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {filters.keyword && (
                    <Badge variant="outline" className="gap-1">
                      关键词: {filters.keyword}
                      <button
                        onClick={() => {
                          const newFilters = { ...filters, keyword: undefined }
                          setFilters(newFilters)
                          updateUrl(newFilters, 1)
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.industry && (
                    <Badge variant="outline" className="gap-1">
                      行业: {filters.industry}
                      <button onClick={() => handleApplyFilters()}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  {filters.location && (
                    <Badge variant="outline" className="gap-1">
                      地点: {filters.location}
                      <button onClick={() => handleApplyFilters()}>
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleResetFilters}>
                    清除全部
                  </Button>
                </div>
              )}

              {/* Error State */}
              {error && (
                <Card className="border-red-500/20 bg-red-500/10 p-8 text-center mb-6">
                  <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <p className="text-red-400">{error}</p>
                  <Button variant="outline" className="mt-4" onClick={() => fetchResults(1)}>
                    重试
                  </Button>
                </Card>
              )}

              {/* Results List */}
              <div
                className={cn(
                  'space-y-4',
                  viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0'
                )}
              >
                {isLoading ? (
                  renderSkeletons()
                ) : searchResults.length === 0 ? (
                  renderEmptyState()
                ) : (
                  searchResults.map((job, index) => (
                    <ScrollReveal key={job.id} delay={index * 50}>
                      <JobCard job={job} view={viewMode} lang={lang} />
                    </ScrollReveal>
                  ))
                )}
              </div>

              {/* Load More */}
              {!isLoading && pagination?.hasMore && (
                <div className="mt-8 text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    className="border-white/10 hover:bg-white/5"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        加载中...
                      </>
                    ) : (
                      <>
                        加载更多
                        <ChevronDown className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Pagination Info */}
              {!isLoading && searchResults.length > 0 && (
                <div className="mt-6 text-center text-sm text-gray-500">
                  显示 {searchResults.length} 个结果，共 {pagination?.total} 个
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filters Drawer */}
        {showMobileFilters && (
          <>
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-[#0a0f1c] z-50 lg:hidden overflow-y-auto">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h2 className="font-semibold text-white">筛选条件</h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="p-4">
                <SearchFilters
                  filters={filters}
                  facets={facets || undefined}
                  onFiltersChange={setFilters}
                  onApply={handleApplyFilters}
                  onReset={handleResetFilters}
                  variant="compact"
                />
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
