import { cn } from '@/lib/utils'
import { Button } from './button'
import { Badge } from './badge'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange?: (page: number) => void
  className?: string
}

/**
 * Web3风格分页组件
 * - 霓虹发光效果
 * - 玻璃拟态按钮
 * - 渐变激活状态
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationProps) {
  // 生成页码数组
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
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

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page)
    }
  }

  if (totalPages <= 1) return null

  return (
    <nav className={cn('flex items-center justify-center gap-2', className)}>
      {/* 上一页按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        glowColor={currentPage > 1 ? 'cyan' : undefined}
        className="hidden sm:inline-flex"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        上一页
      </Button>

      {/* 移动端简化上一页 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        glowColor={currentPage > 1 ? 'cyan' : undefined}
        className="sm:hidden"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {/* 页码 */}
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="px-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => handlePageChange(page as number)}
                className={cn(
                  'inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium transition-all duration-200',
                  currentPage === page
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-110'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                )}
              >
                {page}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 下一页按钮 */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        glowColor={currentPage < totalPages ? 'cyan' : undefined}
        className="hidden sm:inline-flex"
      >
        下一页
        <ChevronRight className="ml-1 h-4 w-4" />
      </Button>

      {/* 移动端简化下一页 */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        glowColor={currentPage < totalPages ? 'cyan' : undefined}
        className="sm:hidden"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* 页码指示器 */}
      <Badge variant="outline" size="sm" className="hidden md:flex ml-2">
        {currentPage} / {totalPages}
      </Badge>
    </nav>
  )
}

export default Pagination
