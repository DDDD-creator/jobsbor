/**
 * Performance Optimization Utilities
 * 
 * Jobsbor招聘平台性能优化工具库
 * 
 * 包含功能：
 * - 图片优化配置
 * - 字体预加载
 * - 关键CSS内联
 * - Service Worker注册
 * - 性能监控
 * - 懒加载实现
 * - 资源预加载
 * - Core Web Vitals追踪
 */

import { useEffect, useRef, useCallback, useState } from 'react';

// 扩展 Window 类型
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
  
  interface Navigator {
    connection?: {
      effectiveType?: string;
      saveData?: boolean;
      addEventListener?: (event: string, callback: () => void) => void;
    };
  }
}

// 扩展 PerformanceObserver 类型
type PerformanceEntryType = 'navigation' | 'resource' | 'paint' | 'mark' | 'measure' | 'largest-contentful-paint' | 'first-input' | 'layout-shift';

interface PerformanceObserverInit {
  entryTypes: PerformanceEntryType[];
}

// ============================================================================
// 常量配置
// ============================================================================

/** 图片域名白名单 */
export const IMAGE_DOMAINS = [
  'jobsbor.com',
  'www.jobsbor.com',
  'cdn.jobsbor.com',
  'images.jobsbor.com',
  'logo.clearbit.com',
  'ui-avatars.com',
];

/** 支持的图片格式 */
export const SUPPORTED_IMAGE_FORMATS = ['webp', 'avif', 'jpeg', 'png'];

/** 默认图片尺寸 */
export const DEFAULT_IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  small: { width: 300, height: 200 },
  medium: { width: 600, height: 400 },
  large: { width: 1200, height: 630 },
  hero: { width: 1920, height: 1080 },
};

/** Web Vitals阈值 */
export const WEB_VITALS_THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

// ============================================================================
// 图片优化
// ============================================================================

/**
 * 生成优化后的图片URL
 * 
 * @param src - 原始图片URL
 * @param options - 优化选项
 * @returns 优化后的图片URL
 */
export function getOptimizedImageUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg' | 'png' | 'auto';
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  } = {}
): string {
  const { width, height, quality = 80, format = 'auto', fit = 'cover' } = options;

  // 如果是外部图片，直接返回
  if (src.startsWith('http') && !IMAGE_DOMAINS.some(domain => src.includes(domain))) {
    return src;
  }

  // 构建优化URL参数
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality) params.set('q', quality.toString());
  if (format !== 'auto') params.set('fm', format);
  if (fit) params.set('fit', fit);

  // 使用/_next/image优化
  const queryString = params.toString();
  return `/_next/image?url=${encodeURIComponent(src)}${queryString ? `&${queryString}` : ''}`;
}

/**
 * 生成响应式图片srcSet
 * 
 * @param src - 原始图片URL
 * @param widths - 需要的宽度数组
 * @returns srcSet字符串
 */
export function generateSrcSet(
  src: string,
  widths: number[] = [320, 640, 960, 1280, 1920]
): string {
  return widths
    .map(width => `${getOptimizedImageUrl(src, { width, quality: 80 })} ${width}w`)
    .join(', ');
}

/**
 * 图片尺寸配置
 */
export const imageSizes = {
  /** 公司Logo */
  companyLogo: {
    sizes: '(max-width: 768px) 80px, 120px',
    width: 120,
    height: 120,
  },
  /** 职位卡片缩略图 */
  jobCard: {
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    width: 400,
    height: 300,
  },
  /** 博客文章封面 */
  blogCover: {
    sizes: '(max-width: 768px) 100vw, 800px',
    width: 800,
    height: 450,
  },
  /** 英雄区大图 */
  hero: {
    sizes: '100vw',
    width: 1920,
    height: 1080,
  },
  /** OpenGraph图片 */
  ogImage: {
    width: 1200,
    height: 630,
  },
  /** 头像 */
  avatar: {
    sizes: '48px',
    width: 48,
    height: 48,
  },
};

// ============================================================================
// 字体预加载
// ============================================================================

/**
 * 字体配置
 */
export const FONT_CONFIG = {
  /** 主字体 */
  primary: {
    family: 'Inter',
    weights: [400, 500, 600, 700],
    display: 'swap',
  },
  /** 中文字体回退 */
  chinese: {
    family: '"PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif',
  },
};

/**
 * 生成字体预加载链接
 * 
 * @returns 字体预加载配置数组
 */
export function generateFontPreloadLinks(): Array<{
  href: string;
  type: string;
  crossOrigin: 'anonymous';
}> {
  const baseUrl = 'https://fonts.gstatic.com/s/inter/v13';
  const weights = FONT_CONFIG.primary.weights;

  return weights.map(weight => ({
    href: `${baseUrl}/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2`,
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  }));
}

/**
 * 字体加载优化CSS
 */
export const fontOptimizationCSS = `
  /* 字体显示策略 */
  @font-face {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    font-display: swap;
    src: url(https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  /* 系统字体回退 */
  :root {
    --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', 'Helvetica Neue', sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  }

  /* 防止字体加载时的布局偏移 */
  html {
    font-family: var(--font-sans);
  }

  /* 字体加载前的回退策略 */
  .font-loading {
    font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Microsoft YaHei', sans-serif;
  }
`;

// ============================================================================
// 关键CSS内联
// ============================================================================

/**
 * 首屏关键CSS
 * 用于内联到HTML中，避免渲染阻塞
 */
export const criticalCSS = `
  /* 基础重置 */
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  
  /* 防止FOUC */
  html{visibility:visible;opacity:1}
  
  /* 首屏关键样式 */
  body{
    font-family:var(--font-sans);
    line-height:1.5;
    color:#1f2937;
    background:#ffffff;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
  }
  
  /* Header关键样式 */
  .header{
    position:sticky;
    top:0;
    z-index:50;
    background:rgba(255,255,255,0.95);
    backdrop-filter:blur(8px);
    border-bottom:1px solid #e5e7eb;
  }
  
  /* Hero区关键样式 */
  .hero{
    min-height:60vh;
    display:flex;
    align-items:center;
    justify-content:center;
    background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);
  }
  
  /* 按钮基础样式 */
  .btn{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    padding:0.75rem 1.5rem;
    font-weight:500;
    border-radius:0.5rem;
    transition:all 0.2s;
    cursor:pointer;
  }
  
  .btn-primary{
    background:#2563eb;
    color:white;
    border:none;
  }
  
  /* 骨架屏基础样式 */
  .skeleton{
    background:linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%);
    background-size:200% 100%;
    animation:skeleton-loading 1.5s ease-in-out infinite;
  }
  
  @keyframes skeleton-loading{
    0%{background-position:200% 0}
    100%{background-position:-200% 0}
  }
  
  /* 容器 */
  .container{
    width:100%;
    max-width:1280px;
    margin:0 auto;
    padding:0 1rem;
  }
  
  /* 加载状态 */
  .loading-spinner{
    width:24px;
    height:24px;
    border:2px solid #e5e7eb;
    border-top-color:#2563eb;
    border-radius:50%;
    animation:spin 1s linear infinite;
  }
  
  @keyframes spin{
    to{transform:rotate(360deg)}
  }
`;

/**
 * 获取压缩后的关键CSS
 */
export function getMinifiedCriticalCSS(): string {
  return criticalCSS
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/;\s*}/g, '}')
    .replace(/\s*{\s*/g, '{')
    .replace(/;\s*/g, ';')
    .trim();
}

// ============================================================================
// Service Worker
// ============================================================================

/**
 * Service Worker配置
 */
export const SW_CONFIG = {
  /** SW文件路径 */
  path: '/sw.js',
  /** 缓存名称 */
  cacheName: 'jobsbor-v1',
  /** 预缓存资源 */
  precacheResources: [
    '/',
    '/jobs',
    '/companies',
    '/about',
    '/contact',
    '/offline.html',
  ],
  /** 运行时缓存策略 */
  runtimeCache: [
    {
      urlPattern: /^https:\/\/api\.jobsbor\.com\/api\//,
      strategy: 'NetworkFirst',
      cacheName: 'api-cache',
      expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
      strategy: 'CacheFirst',
      cacheName: 'image-cache',
      expiration: { maxEntries: 200, maxAgeSeconds: 2592000 },
    },
    {
      urlPattern: /\.(?:css|js)$/,
      strategy: 'StaleWhileRevalidate',
      cacheName: 'assets-cache',
      expiration: { maxEntries: 50, maxAgeSeconds: 604800 },
    },
  ],
};

/**
 * 注册Service Worker
 * 
 * @returns 取消注册的函数
 */
export function registerServiceWorker(): () => void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return () => {};
  }

  let registration: ServiceWorkerRegistration | null = null;

  const register = async () => {
    try {
      registration = await navigator.serviceWorker.register(SW_CONFIG.path);
      
      console.log('[SW] 注册成功:', registration.scope);

      // 监听更新
      registration.addEventListener('updatefound', () => {
        const newWorker = registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // 有新版本可用
              console.log('[SW] 新版本可用');
              // 可以在这里触发更新提示
              if (window.confirm('网站有新版本，是否立即更新？')) {
                newWorker.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        }
      });
    } catch (error) {
      console.error('[SW] 注册失败:', error);
    }
  };

  // 页面加载完成后注册
  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register);
  }

  // 返回取消注册函数
  return () => {
    if (registration) {
      registration.unregister();
    }
  };
}

/**
 * 注销Service Worker
 */
export async function unregisterServiceWorker(): Promise<void> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  await registration.unregister();
  console.log('[SW] 已注销');
}

/**
 * 检查Service Worker支持
 */
export function isServiceWorkerSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator;
}

// ============================================================================
// 性能监控
// ============================================================================

/**
 * Web Vitals指标类型
 */
export type WebVitalsMetric = 'LCP' | 'FID' | 'CLS' | 'FCP' | 'TTFB' | 'INP';

/**
 * Web Vitals数据接口
 */
export interface WebVitalsData {
  metric: WebVitalsMetric;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta?: number;
  id: string;
  navigationType?: string;
}

/**
 * 性能报告回调
 */
export type WebVitalsCallback = (data: WebVitalsData) => void;

/**
 * 获取指标评级
 */
function getMetricRating(metric: WebVitalsMetric, value: number): WebVitalsData['rating'] {
  const thresholds = WEB_VITALS_THRESHOLDS[metric as keyof typeof WEB_VITALS_THRESHOLDS];
  if (!thresholds) return 'good';

  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * 监测LCP (Largest Contentful Paint)
 */
export function observeLCP(callback: WebVitalsCallback): () => void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {};
  }

  let observer: PerformanceObserver | null = null;

  const handleEntries = (entries: PerformanceObserverEntryList) => {
    const lastEntry = entries.getEntries().pop() as PerformanceEntry & { startTime: number };
    if (lastEntry) {
      const value = lastEntry.startTime;
      callback({
        metric: 'LCP',
        value,
        rating: getMetricRating('LCP', value),
        id: lastEntry.name || 'lcp',
      });
    }
  };

  observer = new PerformanceObserver(handleEntries);
  observer.observe({ entryTypes: ['largest-contentful-paint'] } as PerformanceObserverInit);

  return () => observer?.disconnect();
}

/**
 * 监测FID (First Input Delay)
 */
export function observeFID(callback: WebVitalsCallback): () => void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {};
  }

  let observer: PerformanceObserver | null = null;

  const handleEntries = (entries: PerformanceObserverEntryList) => {
    entries.getEntries().forEach((entry: any) => {
      const value = entry.processingStart - entry.startTime;
      callback({
        metric: 'FID',
        value,
        rating: getMetricRating('FID', value),
        id: entry.name,
      });
    });
  };

  observer = new PerformanceObserver(handleEntries);
  observer.observe({ entryTypes: ['first-input'] } as PerformanceObserverInit);

  return () => observer?.disconnect();
}

/**
 * 监测CLS (Cumulative Layout Shift)
 */
export function observeCLS(callback: WebVitalsCallback): () => void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {};
  }

  let observer: PerformanceObserver | null = null;
  let clsValue = 0;
  let sessionEntries: any[] = [];

  const handleEntries = (entries: PerformanceObserverEntryList) => {
    entries.getEntries().forEach((entry: any) => {
      // 只计算没有最近用户输入的布局偏移
      if (!entry.hadRecentInput) {
        const firstSessionEntry = sessionEntries[0];
        const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

        // 如果与前一个偏移间隔超过1秒，或距离第一个偏移超过5秒，开始新会话
        if (
          sessionEntries.length &&
          (entry.startTime - lastSessionEntry.startTime > 1000 ||
            entry.startTime - firstSessionEntry.startTime > 5000)
        ) {
          // 开始新会话
          clsValue = 0;
          sessionEntries = [];
        }

        sessionEntries.push(entry);
        clsValue += entry.value;

        callback({
          metric: 'CLS',
          value: clsValue,
          rating: getMetricRating('CLS', clsValue),
          id: entry.name || 'cls',
          delta: entry.value,
        });
      }
    });
  };

  observer = new PerformanceObserver(handleEntries);
  observer.observe({ entryTypes: ['layout-shift'] } as PerformanceObserverInit);

  return () => observer?.disconnect();
}

/**
 * 监测FCP (First Contentful Paint)
 */
export function observeFCP(callback: WebVitalsCallback): () => void {
  if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
    return () => {};
  }

  let observer: PerformanceObserver | null = null;

  const handleEntries = (entries: PerformanceObserverEntryList) => {
    entries.getEntries().forEach((entry: any) => {
      if (entry.name === 'first-contentful-paint') {
        const value = entry.startTime;
        callback({
          metric: 'FCP',
          value,
          rating: getMetricRating('FCP', value),
          id: entry.name,
        });
      }
    });
  };

  observer = new PerformanceObserver(handleEntries);
  observer.observe({ entryTypes: ['paint'] } as PerformanceObserverInit);

  return () => observer?.disconnect();
}

/**
 * 监测TTFB (Time to First Byte)
 */
export function observeTTFB(callback: WebVitalsCallback): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigation) {
    const value = navigation.responseStart - navigation.startTime;
    callback({
      metric: 'TTFB',
      value,
      rating: getMetricRating('TTFB', value),
      id: 'ttfb',
    });
  }

  return () => {};
}

/**
 * 监测所有Core Web Vitals
 */
export function observeAllWebVitals(callback: WebVitalsCallback): () => void {
  const disposers: Array<() => void> = [];

  disposers.push(observeLCP(callback));
  disposers.push(observeFID(callback));
  disposers.push(observeCLS(callback));
  disposers.push(observeFCP(callback));
  disposers.push(observeTTFB(callback));

  return () => disposers.forEach(dispose => dispose());
}

/**
 * 发送性能数据到分析服务
 */
export function reportWebVitals(data: WebVitalsData): void {
  // 发送到Google Analytics 4 (仅当gtag存在且GA ID已配置)
  if (typeof window !== 'undefined' && window.gtag && process.env.NEXT_PUBLIC_GA_ID) {
    window.gtag('event', data.metric, {
      value: Math.round(data.value),
      metric_rating: data.rating,
      metric_id: data.id,
      metric_delta: data.delta,
    });
  }

  // 发送到自定义分析端点
  const analyticsEndpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  if (analyticsEndpoint && typeof navigator !== 'undefined' && navigator.sendBeacon) {
    navigator.sendBeacon(
      analyticsEndpoint,
      JSON.stringify({
        type: 'web-vitals',
        ...data,
        url: window.location.href,
        timestamp: Date.now(),
      })
    );
  }

  // 开发环境打印到控制台
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${data.metric}: ${data.value} (${data.rating})`);
  }
}

// ============================================================================
// 懒加载工具
// ============================================================================

/**
 * 使用Intersection Observer实现懒加载
 * 
 * @param callback - 元素进入视口时的回调
 * @param options - Intersection Observer选项
 * @returns Observer实例和解绑函数
 */
export function createLazyLoader(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
): {
  observer: IntersectionObserver;
  observe: (element: Element) => void;
  unobserve: (element: Element) => void;
  disconnect: () => void;
} {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px 0px',
    threshold: 0.01,
  };

  const observer = new IntersectionObserver(callback, { ...defaultOptions, ...options });

  return {
    observer,
    observe: (element: Element) => observer.observe(element),
    unobserve: (element: Element) => observer.unobserve(element),
    disconnect: () => observer.disconnect(),
  };
}

/**
 * React Hook: 懒加载图片
 * 
 * @param src - 图片源地址
 * @returns 图片ref和加载状态
 */
export function useLazyImage(src: string) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [isInView, src]);

  return { ref: imgRef, isLoaded, isInView };
}

// ============================================================================
// 资源预加载
// ============================================================================

/**
 * 预加载图片
 * 
 * @param src - 图片URL
 * @returns Promise<void>
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * 预加载关键资源
 * 
 * @param resources - 资源URL数组
 */
export function preloadCriticalResources(resources: string[]): void {
  if (typeof window === 'undefined') return;

  resources.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

/**
 * 预获取页面
 * 
 * @param href - 页面URL
 */
export function prefetchPage(href: string): void {
  if (typeof window === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = href;
  document.head.appendChild(link);
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * 测量函数执行时间
 */
export function measurePerformance<T>(
  fn: () => T,
  label: string
): T {
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
  return result;
}

/**
 * 批量测量性能
 */
export async function measureAsyncPerformance<T>(
  fn: () => Promise<T>,
  label: string
): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const end = performance.now();
  console.log(`[Performance] ${label}: ${(end - start).toFixed(2)}ms`);
  return result;
}

// ============================================================================
// Next.js Image配置导出
// ============================================================================

/**
 * Next.js Image组件优化配置
 * 用于next.config.js
 */
export const nextImageConfig = {
  images: {
    domains: IMAGE_DOMAINS,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天
  },
};

// ============================================================================
// React Hooks
// ============================================================================

/**
 * 使用Web Vitals监测
 */
export function useWebVitals(callback?: WebVitalsCallback) {
  useEffect(() => {
    const handleVitals = (data: WebVitalsData) => {
      reportWebVitals(data);
      callback?.(data);
    };

    return observeAllWebVitals(handleVitals);
  }, [callback]);
}

/**
 * 使用Service Worker
 */
export function useServiceWorker() {
  useEffect(() => {
    return registerServiceWorker();
  }, []);
}

/**
 * 使用网络状态
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [connectionType, setConnectionType] = useState<string | null>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 获取连接类型（如果支持）
    const connection = navigator.connection;
    if (connection) {
      setConnectionType(connection.effectiveType || null);
      connection.addEventListener?.('change', () => {
        setConnectionType(connection.effectiveType || null);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
}

export default {
  getOptimizedImageUrl,
  generateSrcSet,
  imageSizes,
  generateFontPreloadLinks,
  fontOptimizationCSS,
  criticalCSS,
  getMinifiedCriticalCSS,
  registerServiceWorker,
  unregisterServiceWorker,
  isServiceWorkerSupported,
  observeLCP,
  observeFID,
  observeCLS,
  observeFCP,
  observeTTFB,
  observeAllWebVitals,
  reportWebVitals,
  createLazyLoader,
  preloadImage,
  preloadCriticalResources,
  prefetchPage,
  debounce,
  throttle,
  measurePerformance,
  measureAsyncPerformance,
  nextImageConfig,
};
