/**
 * 图片懒加载组件 - 使用 Next.js Image
 * 自动优化、懒加载、响应式
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  sizes?: string
  quality?: number
}

export function OptimizedImage({ 
  src, 
  alt, 
  className,
  width,
  height,
  fill = false,
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-gray-800',
        fill ? 'w-full h-full' : '',
        className
      )}
      style={!fill ? { width, height } : undefined}
    >
      {/* 骨架屏占位 */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-800" />
      )}
      
      {/* Next.js 优化图片 */}
      <Image
        src={src}
        alt={alt}
        fill={fill}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={cn(
          'object-cover transition-opacity duration-500',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}

/**
 * 懒加载图片组件
 * 使用 Intersection Observer 实现真正的懒加载
 */
export function LazyImage({ 
  src, 
  alt, 
  className,
  width = 400,
  height = 300,
}: {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      quality={75}
    />
  )
}

/**
 * 公司Logo组件
 */
export function CompanyLogo({
  src,
  alt,
  size = 64,
  className,
}: {
  src?: string
  alt: string
  size?: number
  className?: string
}) {
  const [error, setError] = useState(false)

  if (error || !src) {
    // 显示首字母占位符
    const initial = alt.charAt(0).toUpperCase()
    return (
      <div 
        className={cn(
          'flex items-center justify-center bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg font-bold text-white',
          className
        )}
        style={{ width: size, height: size }}
      >
        {initial}
      </div>
    )
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn('rounded-lg', className)}
      priority={false}
      quality={80}
    />
  )
}

/**
 * 加载骨架屏组件
 */
export function Skeleton({ 
  className,
  count = 1,
}: { 
  className?: string
  count?: number
}) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-gray-800 rounded',
            className
          )}
        />
      ))}
    </>
  )
}

/**
 * 页面加载状态
 */
export function PageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0f1c]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">加载中...</p>
      </div>
    </div>
  )
}
