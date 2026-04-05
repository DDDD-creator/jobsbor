import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'neon' | 'glass'
  glowColor?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'default', glowColor = 'cyan', leftIcon, rightIcon, ...props }, ref) => {
    const glowColors = {
      cyan: {
        focus: 'focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
        icon: 'text-cyan-400/60',
      },
      purple: {
        focus: 'focus:border-purple-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.4)]',
        icon: 'text-purple-400/60',
      },
      pink: {
        focus: 'focus:border-pink-500 focus:shadow-[0_0_20px_rgba(236,72,153,0.4)]',
        icon: 'text-pink-400/60',
      },
      green: {
        focus: 'focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.4)]',
        icon: 'text-green-400/60',
      },
      orange: {
        focus: 'focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.4)]',
        icon: 'text-orange-400/60',
      },
    }

    const currentGlow = glowColors[glowColor]

    return (
      <div className="relative w-full">
        {/* 左侧图标 */}
        {leftIcon && (
          <div
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200',
              currentGlow.icon
            )}
          >
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          ref={ref}
          className={cn(
            // 基础样式
            'flex h-12 w-full rounded-lg px-4 py-2 text-sm',
            'placeholder:text-gray-500',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-300',
            {
              // 默认暗色主题
              'bg-gray-900/80 border border-white/10 text-white': variant === 'default',
              'hover:border-white/20': variant === 'default',
              [currentGlow.focus]: variant === 'default',

              // 霓虹边框样式
              'bg-gray-900/90 border-2 border-cyan-500/30 text-white': variant === 'neon',
              'hover:border-cyan-400/50': variant === 'neon',
              'focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(6,182,212,0.5)]': variant === 'neon' && glowColor === 'cyan',
              'focus:border-purple-400 focus:shadow-[0_0_25px_rgba(168,85,247,0.5)]': variant === 'neon' && glowColor === 'purple',
              'focus:border-pink-400 focus:shadow-[0_0_25px_rgba(236,72,153,0.5)]': variant === 'neon' && glowColor === 'pink',
              'focus:border-green-400 focus:shadow-[0_0_25px_rgba(34,197,94,0.5)]': variant === 'neon' && glowColor === 'green',
              'focus:border-orange-400 focus:shadow-[0_0_25px_rgba(249,115,22,0.5)]': variant === 'neon' && glowColor === 'orange',

              // 玻璃拟态样式
              'glass-dark text-white': variant === 'glass',
              'hover:bg-black/50 hover:border-white/20': variant === 'glass',
              [currentGlow.focus]: variant === 'glass',
            },
            // 通用focus样式
            'focus:outline-none',
            // 左侧图标时的内边距调整
            leftIcon && 'pl-10',
            // 右侧图标时的内边距调整
            rightIcon && 'pr-10',
            className
          )}
          {...props}
        />

        {/* 右侧图标 */}
        {rightIcon && (
          <div
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors duration-200',
              currentGlow.icon
            )}
          >
            {rightIcon}
          </div>
        )}

        {/* 底部发光线条 */}
        {variant === 'neon' && (
          <div
            className={cn(
              'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 transition-all duration-300 rounded-full',
              'group-focus-within:w-full',
              {
                'bg-gradient-to-r from-cyan-400 to-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]': glowColor === 'cyan',
                'bg-gradient-to-r from-purple-400 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.8)]': glowColor === 'purple',
                'bg-gradient-to-r from-pink-400 to-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.8)]': glowColor === 'pink',
                'bg-gradient-to-r from-green-400 to-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]': glowColor === 'green',
                'bg-gradient-to-r from-orange-400 to-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]': glowColor === 'orange',
              }
            )}
          />
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// 带标签的输入框组件
interface LabeledInputProps extends InputProps {
  label: string
  error?: string
  helperText?: string
}

const LabeledInput = forwardRef<HTMLInputElement, LabeledInputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className={cn('space-y-2', className)}>
        <label className="text-sm font-medium text-gray-300">
          {label}
        </label>
        <Input ref={ref} {...props} />
        {error && (
          <p className="text-sm text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)
LabeledInput.displayName = 'LabeledInput'

// 搜索输入框组件
interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'type'> {
  onSearch?: (value: string) => void
  placeholder?: string
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch((e.target as HTMLInputElement).value)
      }
    }

    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        }
        className={className}
        onKeyDown={handleKeyDown}
        {...props}
      />
    )
  }
)
SearchInput.displayName = 'SearchInput'

export { Input, LabeledInput, SearchInput }
