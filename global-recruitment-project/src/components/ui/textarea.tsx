import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes, forwardRef } from 'react'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'neon' | 'glass'
  glowColor?: 'cyan' | 'purple' | 'pink' | 'green' | 'orange'
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', glowColor = 'cyan', ...props }, ref) => {
    const glowColors = {
      cyan: 'focus:border-cyan-500 focus:shadow-[0_0_20px_rgba(6,182,212,0.4)]',
      purple: 'focus:border-purple-500 focus:shadow-[0_0_20px_rgba(168,85,247,0.4)]',
      pink: 'focus:border-pink-500 focus:shadow-[0_0_20px_rgba(236,72,153,0.4)]',
      green: 'focus:border-green-500 focus:shadow-[0_0_20px_rgba(34,197,94,0.4)]',
      orange: 'focus:border-orange-500 focus:shadow-[0_0_20px_rgba(249,115,22,0.4)]',
    }

    const variants = {
      default: cn(
        'flex min-h-[80px] w-full rounded-md border border-white/10 bg-dark-200/50 px-3 py-2 text-sm text-white placeholder:text-gray-600',
        'focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50',
        'transition-all duration-300',
        glowColors[glowColor],
        className
      ),
      neon: cn(
        'flex min-h-[80px] w-full rounded-xl border border-neon-cyan/30 bg-dark-200/50 px-4 py-3 text-sm text-white placeholder:text-gray-600',
        'focus:outline-none focus:border-neon-cyan focus:shadow-neon-cyan disabled:cursor-not-allowed disabled:opacity-50',
        'transition-all duration-300',
        className
      ),
      glass: cn(
        'flex min-h-[80px] w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-gray-600',
        'focus:outline-none focus:border-white/30 focus:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50',
        'transition-all duration-300',
        className
      ),
    }

    return (
      <textarea
        className={variants[variant]}
        ref={ref}
        {...props}
      />
    )
  }
)

Textarea.displayName = 'Textarea'

export { Textarea }
