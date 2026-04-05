import { cn } from '@/lib/utils'
import { HTMLAttributes, forwardRef } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'accent' | 'outline' | 'neon' | 'gradient' | 'glow'
  color?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange' | 'yellow' | 'red' | 'blue' | 'gray'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  dotColor?: string
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', color = 'cyan', size = 'md', dot = false, dotColor, ...props }, ref) => {
    // 颜色配置
    const colorConfig = {
      cyan: {
        neon: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
        glow: 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
        dot: 'bg-cyan-400',
      },
      purple: {
        neon: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
        glow: 'bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.3)]',
        dot: 'bg-purple-400',
      },
      pink: {
        neon: 'bg-pink-500/10 text-pink-400 border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.2)]',
        glow: 'bg-pink-500/20 text-pink-300 shadow-[0_0_15px_rgba(236,72,153,0.3)]',
        dot: 'bg-pink-400',
      },
      green: {
        neon: 'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]',
        glow: 'bg-green-500/20 text-green-300 shadow-[0_0_15px_rgba(34,197,94,0.3)]',
        dot: 'bg-green-400',
      },
      orange: {
        neon: 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]',
        glow: 'bg-orange-500/20 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.3)]',
        dot: 'bg-orange-400',
      },
      yellow: {
        neon: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
        glow: 'bg-yellow-500/20 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]',
        dot: 'bg-yellow-400',
      },
      red: {
        neon: 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]',
        glow: 'bg-red-500/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
        dot: 'bg-red-400',
      },
      blue: {
        neon: 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]',
        glow: 'bg-blue-500/20 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
        dot: 'bg-blue-400',
      },
      gray: {
        neon: 'bg-gray-500/10 text-gray-400 border-gray-500/30 shadow-[0_0_10px_rgba(156,163,175,0.2)]',
        glow: 'bg-gray-500/20 text-gray-300 shadow-[0_0_15px_rgba(156,163,175,0.3)]',
        dot: 'bg-gray-400',
      },
    }

    const currentColor = colorConfig[color]

    return (
      <span
        ref={ref}
        className={cn(
          // 基础样式
          'inline-flex items-center gap-1.5 font-medium transition-all duration-200',
          'hover:scale-105',
          // 大小变体
          {
            'px-2 py-0.5 text-[10px] rounded': size === 'sm',
            'px-2.5 py-1 text-xs rounded-md': size === 'md',
            'px-3 py-1.5 text-sm rounded-lg': size === 'lg',
          },
          // 变体样式
          {
            // 默认暗色主题
            'bg-gray-800 text-gray-300': variant === 'default',
            'hover:bg-gray-700': variant === 'default',

            // 主要按钮样式
            'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30': variant === 'primary',
            'hover:bg-cyan-500/30 hover:border-cyan-500/50': variant === 'primary',
            'shadow-[0_0_10px_rgba(6,182,212,0.15)]': variant === 'primary',

            // 强调样式 - 紫色
            'bg-purple-500/20 text-purple-400 border border-purple-500/30': variant === 'accent',
            'hover:bg-purple-500/30 hover:border-purple-500/50': variant === 'accent',
            'shadow-[0_0_10px_rgba(168,85,247,0.15)]': variant === 'accent',

            // 轮廓样式
            'bg-transparent border border-white/20 text-gray-300': variant === 'outline',
            'hover:border-white/40 hover:text-white': variant === 'outline',

            // 霓虹样式 - 带边框发光
            'border': variant === 'neon',
            [currentColor.neon]: variant === 'neon',
            'hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]': variant === 'neon' && color === 'cyan',
            'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]': variant === 'neon' && color === 'purple',
            'hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]': variant === 'neon' && color === 'pink',
            'hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]': variant === 'neon' && color === 'green',
            'hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]': variant === 'neon' && color === 'orange',
            'hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]': variant === 'neon' && color === 'yellow',
            'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]': variant === 'neon' && color === 'red',
            'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]': variant === 'neon' && color === 'blue',

            // 渐变样式
            'bg-gradient-to-r from-cyan-500 to-purple-500 text-white border-0': variant === 'gradient',
            'hover:from-cyan-400 hover:to-purple-400': variant === 'gradient',
            'shadow-[0_0_15px_rgba(168,85,247,0.3)]': variant === 'gradient',

            // 发光样式
            [currentColor.glow]: variant === 'glow',
          },
          className
        )}
        {...props}
      >
        {/* 状态指示点 */}
        {dot && (
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full animate-pulse',
              dotColor || currentColor.dot
            )}
          />
        )}
        <span>{props.children}</span>
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// 状态徽章组件
interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'dot'> {
  status: 'online' | 'offline' | 'busy' | 'away' | 'pending' | 'success' | 'error' | 'warning'
}

const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ status, ...props }, ref) => {
    const statusConfig = {
      online: { color: 'green' as const, label: '在线' },
      offline: { color: 'gray' as const, label: '离线' },
      busy: { color: 'red' as const, label: '忙碌' },
      away: { color: 'yellow' as const, label: '离开' },
      pending: { color: 'orange' as const, label: '待处理' },
      success: { color: 'green' as const, label: '成功' },
      error: { color: 'red' as const, label: '错误' },
      warning: { color: 'yellow' as const, label: '警告' },
    }

    const config = statusConfig[status]

    return (
      <Badge
        ref={ref}
        variant="neon"
        color={config.color}
        dot
        {...props}
      >
        {props.children || config.label}
      </Badge>
    )
  }
)
StatusBadge.displayName = 'StatusBadge'

// 技能标签组件
interface SkillBadgeProps extends Omit<BadgeProps, 'variant'> {
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
}

const SkillBadge = forwardRef<HTMLSpanElement, SkillBadgeProps>(
  ({ level, ...props }, ref) => {
    const levelColors = {
      beginner: 'blue' as const,
      intermediate: 'green' as const,
      advanced: 'purple' as const,
      expert: 'orange' as const,
    }

    return (
      <Badge
        ref={ref}
        variant="neon"
        color={level ? levelColors[level] : 'cyan'}
        {...props}
      />
    )
  }
)
SkillBadge.displayName = 'SkillBadge'

export { Badge, StatusBadge, SkillBadge }
