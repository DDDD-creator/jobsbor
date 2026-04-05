'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // 当滚动超过300px时显示按钮
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      className={cn(
        'fixed bottom-8 right-8 z-50',
        'w-12 h-12 rounded-full',
        'bg-dark-200/80 backdrop-blur-sm border-white/10',
        'text-white hover:text-neon-cyan hover:border-neon-cyan/30',
        'shadow-lg hover:shadow-neon-cyan/20',
        'transition-all duration-300',
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4 pointer-events-none'
      )}
      aria-label="返回顶部"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  )
}
