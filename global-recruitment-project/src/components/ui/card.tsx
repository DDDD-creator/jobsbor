import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'neon' | 'glow'
  glowColor?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', glowColor = 'cyan', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-xl transition-all duration-300',
        {
          // 默认卡片 - 暗色主题
          'bg-gray-900 border border-white/10': variant === 'default',
          'hover:border-white/20 hover:shadow-lg': variant === 'default',

          // 玻璃拟态卡片
          'glass-dark': variant === 'glass',
          'hover:bg-black/40': variant === 'glass',
          'hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]': variant === 'glass',

          // 霓虹边框卡片
          'bg-gray-900/80': variant === 'neon',
          
          // 发光卡片
          'bg-gradient-to-br from-gray-900 to-gray-800': variant === 'glow',
        },
        // 通用悬浮效果
        variant !== 'default' && 'hover:scale-[1.01]',
        // 霓虹边框颜色
        variant === 'neon' && {
          'border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:border-cyan-400/70': glowColor === 'cyan',
          'border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:border-purple-400/70': glowColor === 'purple',
          'border border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.2)] hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:border-pink-400/70': glowColor === 'pink',
          'border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)] hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:border-green-400/70': glowColor === 'green',
          'border border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)] hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:border-orange-400/70': glowColor === 'orange',
        },
        // 发光卡片颜色
        variant === 'glow' && {
          'shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.35)]': glowColor === 'cyan',
          'shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_40px_rgba(168,85,247,0.35)]': glowColor === 'purple',
          'shadow-[0_0_20px_rgba(236,72,153,0.2)] hover:shadow-[0_0_40px_rgba(236,72,153,0.35)]': glowColor === 'pink',
          'shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_40px_rgba(34,197,94,0.35)]': glowColor === 'green',
          'shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_40px_rgba(249,115,22,0.35)]': glowColor === 'orange',
        },
        className
      )}
      {...props}
    />
  )
)
Card.displayName = 'Card'

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-col space-y-1.5 p-6', className)}
      {...props}
    />
  )
)
CardHeader.displayName = 'CardHeader'

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-white',
        className
      )}
      {...props}
    />
  )
)
CardTitle.displayName = 'CardTitle'

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-gray-400', className)}
      {...props}
    />
  )
)
CardDescription.displayName = 'CardDescription'

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
)
CardContent.displayName = 'CardContent'

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    />
  )
)
CardFooter.displayName = 'CardFooter'

// Web3风格的卡片装饰组件
const CardGlow = forwardRef<HTMLDivElement, { color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' } & HTMLAttributes<HTMLDivElement>>(
  ({ className, color = 'cyan', ...props }, ref) => {
    const colorMap = {
      cyan: 'from-cyan-500/20 to-transparent',
      purple: 'from-purple-500/20 to-transparent',
      pink: 'from-pink-500/20 to-transparent',
      green: 'from-green-500/20 to-transparent',
      orange: 'from-orange-500/20 to-transparent',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'absolute -inset-px rounded-xl bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm',
          colorMap[color],
          className
        )}
        {...props}
      />
    )
  }
)
CardGlow.displayName = 'CardGlow'

// 卡片装饰边框
const CardBorder = forwardRef<HTMLDivElement, { animated?: boolean } & HTMLAttributes<HTMLDivElement>>(
  ({ className, animated = true, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'absolute inset-0 rounded-xl border border-white/10 pointer-events-none',
        animated && 'group-hover:border-white/20 transition-colors duration-300',
        className
      )}
      {...props}
    />
  )
)
CardBorder.displayName = 'CardBorder'

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardGlow, CardBorder }
