'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * PageLoadingProgress - 页面加载进度条组件
 * 
 * 提供Next.js页面切换时的加载进度指示，改善用户体验。
 * 
 * 特性：
 * - 自动监听路由变化
 * - 平滑的进度动画
 * - 完成时的淡出效果
 * - 可配置的颜色和速度
 * 
 * @example
 * // 在layout.tsx中使用
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <PageLoadingProgress color="#2563eb" height={3} />
 *         {children}
 *       </body>
 *     </html>
 *   );
 * }
 */

interface PageLoadingProgressProps {
  /** 进度条颜色 */
  color?: string;
  /** 进度条高度（像素） */
  height?: number;
  /** 初始延迟（毫秒） */
  startDelay?: number;
  /** 最小显示时间（毫秒） */
  minimumTime?: number;
  /** 是否显示Spinner */
  showSpinner?: boolean;
  /** 自定义类名 */
  className?: string;
}

export function PageLoadingProgress({
  color = '#2563eb',
  height = 3,
  startDelay = 100,
  minimumTime = 300,
  showSpinner = true,
  className = '',
}: PageLoadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    let startTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;
    let completeTimer: NodeJS.Timeout;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);
      setIsVisible(true);

      // 模拟进度增长
      let currentProgress = 0;
      const updateProgress = () => {
        if (currentProgress < 90) {
          // 随机增量，前快后慢
          const increment = Math.random() * 15 * (1 - currentProgress / 100);
          currentProgress = Math.min(currentProgress + increment, 90);
          setProgress(currentProgress);
          progressTimer = setTimeout(updateProgress, 200);
        }
      };
      progressTimer = setTimeout(updateProgress, startDelay);
    };

    const completeLoading = () => {
      // 确保最小显示时间
      completeTimer = setTimeout(() => {
        setProgress(100);
        setTimeout(() => {
          setIsVisible(false);
          setTimeout(() => {
            setIsLoading(false);
            setProgress(0);
          }, 300);
        }, 200);
      }, minimumTime);
    };

    // 开始加载
    startTimer = setTimeout(startLoading, startDelay);

    // 路由完成时结束加载
    return () => {
      clearTimeout(startTimer);
      clearTimeout(progressTimer);
      clearTimeout(completeTimer);
      completeLoading();
    };
  }, [pathname, searchParams, startDelay, minimumTime]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[9999] ${className}`}
      style={{ height }}
    >
      {/* 进度条背景 */}
      <div
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      
      {/* 光泽效果 */}
      <div
        className="absolute top-0 h-full w-20 -translate-x-full animate-shimmer"
        style={{
          background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)`,
        }}
      />

      {/* 右侧Spinner */}
      {showSpinner && (
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2"
          style={{ marginTop: height / 2 }}
        >
          <div
            className="w-4 h-4 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: color,
              borderRightColor: color,
            }}
          />
        </div>
      )}

      {/* 全局样式 */}
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(calc(100vw + 100%));
          }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

/**
 * 简化的加载进度Hook
 */
export function useLoadingProgress() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const start = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const update = (value: number) => {
    setProgress(Math.min(value, 100));
  };

  const complete = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 300);
  };

  return { progress, isLoading, start, update, complete };
}

export default PageLoadingProgress;
