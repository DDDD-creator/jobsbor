'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/**
 * Web3 风格动画工具函数
 * 提供霓虹发光、悬浮效果、滚动触发等动画
 */

// 进入动画钩子
export function useEnterAnimation(delay: number = 0) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [delay])

  return { ref, isVisible }
}

// 交错动画钩子
export function useStaggeredAnimation(itemCount: number, baseDelay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems((prev) => new Set([...prev, i]))
            }, i * baseDelay)
          }
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [itemCount, baseDelay])

  return { containerRef, visibleItems }
}

// 霓虹发光效果
export function useNeonGlow(color: string = 'rgba(0, 212, 255, 0.5)') {
  const [isHovered, setIsHovered] = useState(false)

  const glowStyle = {
    boxShadow: isHovered
      ? `0 0 20px ${color}, 0 0 40px ${color}, 0 0 60px ${color}`
      : '0 0 0px transparent',
    transition: 'box-shadow 0.3s ease',
  }

  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  }

  return { glowStyle, handlers, isHovered }
}

// 浮动动画
export function useFloatAnimation(amplitude: number = 10, duration: number = 3) {
  return {
    animation: `float ${duration}s ease-in-out infinite`,
  }
}

// 脉冲动画
export function usePulseAnimation() {
  return {
    animation: 'pulse-glow 2s ease-in-out infinite',
  }
}

// 获取渐变文字类名
export function getGradientTextClass(from: string = 'cyan', to: string = 'purple') {
  return `bg-gradient-to-r from-${from}-400 to-${to}-500 bg-clip-text text-transparent`
}

// 玻璃拟态类名生成器
export function getGlassmorphismClass(
  opacity: number = 0.1,
  blur: number = 16,
  borderOpacity: number = 0.2
) {
  return `bg-white/[${opacity}] backdrop-blur-[${blur}px] border border-white/[${borderOpacity}]`
}

// 霓虹边框类名
export function getNeonBorderClass(color: string = 'cyan', intensity: string = '500') {
  return `border-${color}-${intensity} shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-shadow duration-300`
}

// 入场动画类名
export function getEnterAnimationClass(
  isVisible: boolean,
  direction: 'up' | 'down' | 'left' | 'right' | 'scale' = 'up'
) {
  if (!isVisible) {
    const hiddenClasses = {
      up: 'opacity-0 translate-y-8',
      down: 'opacity-0 -translate-y-8',
      left: 'opacity-0 translate-x-8',
      right: 'opacity-0 -translate-x-8',
      scale: 'opacity-0 scale-95',
    }
    return hiddenClasses[direction]
  }

  return 'opacity-100 translate-x-0 translate-y-0 scale-100 transition-all duration-500 ease-out'
}

// 滚动触发动画组件
interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}: ScrollRevealProps) {
  const { ref, isVisible } = useEnterAnimation(delay)

  return (
    <div
      ref={ref}
      className={`${getEnterAnimationClass(isVisible, direction)} ${className}`}
    >
      {children}
    </div>
  )
}

// 霓虹发光组件
interface NeonGlowProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  glowIntensity?: 'sm' | 'md' | 'lg'
}

export function NeonGlow({
  children,
  className = '',
  glowColor = 'rgba(0, 212, 255, 0.5)',
  glowIntensity = 'md',
}: NeonGlowProps) {
  const intensityMap = {
    sm: '0 0 10px',
    md: '0 0 20px',
    lg: '0 0 40px',
  }

  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`transition-all duration-300 ${className}`}
      style={{
        boxShadow: isHovered
          ? `${intensityMap[glowIntensity]} ${glowColor}, ${intensityMap[glowIntensity]} ${glowColor.replace('0.5', '0.3')}`
          : '0 0 0px transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  )
}

// 浮动容器组件
interface FloatingContainerProps {
  children: React.ReactNode
  className?: string
  amplitude?: number
  duration?: number
}

export function FloatingContainer({
  children,
  className = '',
  amplitude = 10,
  duration = 3,
}: FloatingContainerProps) {
  return (
    <div
      className={`animate-float ${className}`}
      style={
        {
          '--float-amplitude': `${amplitude}px`,
          '--float-duration': `${duration}s`,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  )
}

// 自定义CSS动画注入组件
export function AnimationStyles() {
  return (
    <style jsx global>{`
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(var(--float-amplitude, 10px));
        }
      }

      @keyframes pulse-glow {
        0%, 100% {
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.5);
        }
        50% {
          box-shadow: 0 0 40px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.4);
        }
      }

      @keyframes neon-flicker {
        0%, 100% {
          opacity: 1;
        }
        50% {
          opacity: 0.8;
        }
      }

      @keyframes gradient-shift {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      @keyframes shimmer {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      @keyframes rotate-slow {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .animate-float {
        animation: float var(--float-duration, 3s) ease-in-out infinite;
      }

      .animate-pulse-glow {
        animation: pulse-glow 2s ease-in-out infinite;
      }

      .animate-neon-flicker {
        animation: neon-flicker 3s ease-in-out infinite;
      }

      .animate-gradient-shift {
        background-size: 200% 200%;
        animation: gradient-shift 3s ease infinite;
      }

      .animate-shimmer {
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.1) 50%,
          transparent 100%
        );
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }

      .animate-rotate-slow {
        animation: rotate-slow 20s linear infinite;
      }

      /* 玻璃拟态背景 */
      .glass {
        background: rgba(255, 255, 255, 0.05);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      .glass-dark {
        background: rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(255, 255, 255, 0.1);
      }

      /* 霓虹文字 */
      .neon-text {
        text-shadow: 
          0 0 10px currentColor,
          0 0 20px currentColor,
          0 0 40px currentColor;
      }

      .neon-text-cyan {
        text-shadow: 
          0 0 10px rgba(6, 182, 212, 0.8),
          0 0 20px rgba(6, 182, 212, 0.6),
          0 0 40px rgba(6, 182, 212, 0.4);
      }

      .neon-text-purple {
        text-shadow: 
          0 0 10px rgba(168, 85, 247, 0.8),
          0 0 20px rgba(168, 85, 247, 0.6),
          0 0 40px rgba(168, 85, 247, 0.4);
      }

      /* 霓虹边框 */
      .neon-border {
        box-shadow: 
          0 0 5px rgba(6, 182, 212, 0.5),
          0 0 10px rgba(6, 182, 212, 0.3),
          inset 0 0 5px rgba(6, 182, 212, 0.1);
      }

      .neon-border-purple {
        box-shadow: 
          0 0 5px rgba(168, 85, 247, 0.5),
          0 0 10px rgba(168, 85, 247, 0.3),
          inset 0 0 5px rgba(168, 85, 247, 0.1);
      }

      /* 渐变文字 */
      .gradient-text {
        background: linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #ec4899 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .gradient-text-cyan-purple {
        background: linear-gradient(135deg, #06b6d4 0%, #a855f7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      /* 悬浮发光效果 */
      .hover-glow {
        transition: all 0.3s ease;
      }

      .hover-glow:hover {
        transform: scale(1.02);
        box-shadow: 0 0 30px rgba(6, 182, 212, 0.3);
      }

      .hover-glow-purple:hover {
        box-shadow: 0 0 30px rgba(168, 85, 247, 0.3);
      }

      /* 暗色主题背景渐变 */
      .bg-dark-gradient {
        background: linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
      }

      .bg-dark-radial {
        background: radial-gradient(ellipse at top, #1e293b 0%, #0f172a 50%);
      }

      /* 网格背景 */
      .bg-grid {
        background-image: 
          linear-gradient(rgba(6, 182, 212, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(6, 182, 212, 0.03) 1px, transparent 1px);
        background-size: 50px 50px;
      }

      /* 点阵背景 */
      .bg-dots {
        background-image: radial-gradient(rgba(6, 182, 212, 0.15) 1px, transparent 1px);
        background-size: 20px 20px;
      }
    `}</style>
  )
}
