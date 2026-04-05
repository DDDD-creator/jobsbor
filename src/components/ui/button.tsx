import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'neon' | 'gradient' | 'glow'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  glowColor?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', glowColor, ...props }, ref) => {
    // 霓虹发光颜色映射
    const neonColors: Record<string, string> = {
      cyan: 'rgba(6, 182, 212, 0.6)',
      purple: 'rgba(168, 85, 247, 0.6)',
      pink: 'rgba(236, 72, 153, 0.6)',
      green: 'rgba(34, 197, 94, 0.6)',
      orange: 'rgba(249, 115, 22, 0.6)',
    }

    const shadowColor = glowColor ? neonColors[glowColor] || glowColor : neonColors.cyan

    return (
      <button
        ref={ref}
        className={cn(
          // 基础样式
          'relative inline-flex items-center justify-center font-medium',
          'transition-all duration-300 ease-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          'overflow-hidden',
          // 大小变体
          {
            'h-8 px-4 text-xs': size === 'sm',
            'h-10 px-6 text-sm': size === 'md',
            'h-12 px-8 text-base': size === 'lg',
            'h-10 w-10 p-2': size === 'icon',
          },
          // 按钮变体
          {
            // 主要按钮 - Web3深色主题
            'bg-gradient-to-r from-cyan-600 to-cyan-500 text-white': variant === 'primary',
            'hover:from-cyan-500 hover:to-cyan-400': variant === 'primary',
            'shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]': variant === 'primary',

            // 次要按钮 - 紫色渐变
            'bg-gradient-to-r from-purple-600 to-purple-500 text-white': variant === 'secondary',
            'hover:from-purple-500 hover:to-purple-400': variant === 'secondary',
            'shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]': variant === 'secondary',

            // 轮廓按钮 - 霓虹边框
            'bg-transparent border-2 border-cyan-500 text-cyan-400': variant === 'outline',
            'hover:bg-cyan-500/10 hover:text-cyan-300': variant === 'outline',
            'shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]': variant === 'outline',

            // 幽灵按钮 - 玻璃拟态
            'bg-white/5 text-gray-300 hover:text-white': variant === 'ghost',
            'backdrop-blur-sm border border-white/10': variant === 'ghost',
            'hover:bg-white/10 hover:border-white/20': variant === 'ghost',

            // 霓虹按钮 - 强烈发光效果
            'bg-cyan-500 text-black font-semibold': variant === 'neon',
            'hover:bg-cyan-400': variant === 'neon',
            'shadow-[0_0_20px_rgba(6,182,212,0.6),0_0_40px_rgba(6,182,212,0.3)]': variant === 'neon',
            'hover:shadow-[0_0_30px_rgba(6,182,212,0.8),0_0_60px_rgba(6,182,212,0.5)]': variant === 'neon',

            // 渐变按钮 - 多彩渐变
            'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white': variant === 'gradient',
            'hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400': variant === 'gradient',
            'shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]': variant === 'gradient',
            'animate-gradient-shift bg-[length:200%_auto]': variant === 'gradient',

            // 发光按钮 - 自定义发光颜色
            'bg-gray-900 text-white border border-white/20': variant === 'glow',
            'hover:bg-gray-800': variant === 'glow',
          },
          // 通用active效果
          'active:scale-[0.98]',
          className
        )}
        style={
          variant === 'glow'
            ? {
                boxShadow: `0 0 20px ${shadowColor}`,
              }
            : undefined
        }
        {...props}
      >
        {/* 按钮内部发光层 */}
        {(variant === 'neon' || variant === 'gradient') && (
          <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
        )}
        
        {/* 按钮内容 */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {props.children}
        </span>

        {/* 霓虹闪烁效果 */}
        {variant === 'neon' && (
          <span className="absolute inset-0 rounded-lg animate-neon-flicker opacity-50 bg-gradient-to-r from-cyan-400/0 via-cyan-400/30 to-cyan-400/0" />
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
