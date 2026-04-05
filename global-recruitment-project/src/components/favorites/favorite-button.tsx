'use client'

import { useFavorites } from '@/hooks/use-favorites'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  jobId: string
  jobTitle: string
  company: string
  location: string
  salary: string
  className?: string
  variant?: 'default' | 'icon-only'
}

export function FavoriteButton({
  jobId,
  jobTitle,
  company,
  location,
  salary,
  className,
  variant = 'default',
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(jobId)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite({
      id: jobId,
      title: jobTitle,
      company,
      location,
      salary,
    })
  }

  if (variant === 'icon-only') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "p-2 rounded-full transition-all duration-200",
          favorited 
            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
            : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-red-400",
          className
        )}
        aria-label={favorited ? '取消收藏' : '收藏职位'}
      >
        <Heart 
          className={cn(
            "h-5 w-5 transition-all duration-200",
            favorited && "fill-current"
          )} 
        />
      </button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleClick}
      className={cn(
        "gap-2",
        favorited 
          ? "border-red-500/50 text-red-400 hover:bg-red-500/10" 
          : "border-white/10 text-gray-400 hover:text-red-400",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-all duration-200",
          favorited && "fill-current"
        )} 
      />
      {favorited ? '已收藏' : '收藏'}
    </Button>
  )
}
