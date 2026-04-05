/**
 * Skeleton - 骨架屏组件
 * 
 * 提供多种预设的骨架屏样式，用于内容加载时的占位展示。
 * 
 * 预设组件：
 * - Skeleton.Text: 文本行骨架
 * - Skeleton.Title: 标题骨架
 * - Skeleton.Avatar: 头像骨架
 * - Skeleton.Card: 卡片骨架
 * - Skeleton.JobCard: 职位卡片骨架
 * - Skeleton.CompanyCard: 公司卡片骨架
 * - Skeleton.BlogCard: 博客卡片骨架
 * - Skeleton.List: 列表骨架
 * - Skeleton.Table: 表格骨架
 * - Skeleton.Hero: 英雄区骨架
 * 
 * @example
 * // 基础用法
 * <Skeleton.Text lines={3} />
 * 
 * // 职位卡片骨架
 * <Skeleton.JobCard />
 * 
 * // 组合使用
 * <div className="space-y-4">
 *   <Skeleton.Title />
 *   <Skeleton.Text lines={2} />
 *   <Skeleton.Avatar size="large" />
 * </div>
 */

import { cn } from '@/lib/utils';

// ============================================================================
// 基础骨架组件
// ============================================================================

interface SkeletonBaseProps {
  /** 自定义类名 */
  className?: string;
  /** 动画变体 */
  variant?: 'default' | 'pulse' | 'wave';
}

/**
 * 基础骨架元素
 */
function SkeletonBase({ className, variant = 'default' }: SkeletonBaseProps) {
  const variantClasses = {
    default: 'animate-pulse',
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
  };

  return (
    <div
      className={cn(
        'bg-gray-200 dark:bg-gray-700 rounded',
        variantClasses[variant],
        className
      )}
    />
  );
}

// ============================================================================
// 文本骨架
// ============================================================================

interface TextSkeletonProps extends SkeletonBaseProps {
  /** 行数 */
  lines?: number;
  /** 最后一行宽度百分比 */
  lastLineWidth?: string;
}

/**
 * 文本行骨架
 */
function TextSkeleton({
  lines = 1,
  lastLineWidth = '60%',
  className,
  variant,
}: TextSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonBase
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 && lines > 1 && `w-[${lastLineWidth}]`
          )}
          variant={variant}
        />
      ))}
    </div>
  );
}

// ============================================================================
// 标题骨架
// ============================================================================

interface TitleSkeletonProps extends SkeletonBaseProps {
  /** 标题级别 */
  level?: 1 | 2 | 3 | 4;
  /** 宽度 */
  width?: string;
}

/**
 * 标题骨架
 */
function TitleSkeleton({
  level = 1,
  width = '50%',
  className,
  variant,
}: TitleSkeletonProps) {
  const heights = {
    1: 'h-8',
    2: 'h-6',
    3: 'h-5',
    4: 'h-4',
  };

  return (
    <SkeletonBase
      className={cn(heights[level], className)}
      variant={variant}
    />
  );
}

// ============================================================================
// 头像骨架
// ============================================================================

interface AvatarSkeletonProps extends SkeletonBaseProps {
  /** 尺寸 */
  size?: 'small' | 'medium' | 'large' | number;
}

/**
 * 头像骨架
 */
function AvatarSkeleton({ size = 'medium', className, variant }: AvatarSkeletonProps) {
  const sizeMap = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const sizeClass = typeof size === 'number' ? `w-${size} h-${size}` : sizeMap[size];

  return (
    <SkeletonBase
      className={cn('rounded-full', sizeClass, className)}
      variant={variant}
    />
  );
}

// ============================================================================
// 图片骨架
// ============================================================================

interface ImageSkeletonProps extends SkeletonBaseProps {
  /** 宽高比 */
  aspectRatio?: string;
  /** 圆角 */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * 图片骨架
 */
function ImageSkeleton({
  aspectRatio = '16/9',
  rounded = 'md',
  className,
  variant,
}: ImageSkeletonProps) {
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  return (
    <SkeletonBase
      className={cn('w-full', roundedClasses[rounded], className)}
      variant={variant}
    />
  );
}

// ============================================================================
// 卡片骨架
// ============================================================================

interface CardSkeletonProps extends SkeletonBaseProps {
  /** 是否显示图片 */
  showImage?: boolean;
  /** 内容行数 */
  contentLines?: number;
  /** 是否显示操作按钮 */
  showActions?: boolean;
}

/**
 * 通用卡片骨架
 */
function CardSkeleton({
  showImage = true,
  contentLines = 2,
  showActions = true,
  className,
  variant,
}: CardSkeletonProps) {
  return (
    <div className={cn('p-4 border border-gray-200 dark:border-gray-700 rounded-lg', className)}>
      {showImage && (
        <ImageSkeleton aspectRatio="16/9" className="mb-4" variant={variant} />
      )}
      <TitleSkeleton level={3} width="70%" className="mb-2" variant={variant} />
      <TextSkeleton lines={contentLines} variant={variant} />
      
      {showActions && (
        <div className="flex gap-2 mt-4">
          <SkeletonBase className="h-9 w-24" variant={variant} />
          <SkeletonBase className="h-9 w-24" variant={variant} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 职位卡片骨架
// ============================================================================

interface JobCardSkeletonProps extends SkeletonBaseProps {
  /** 是否显示公司Logo */
  showLogo?: boolean;
}

/**
 * 职位卡片骨架
 */
function JobCardSkeleton({ showLogo = true, className, variant }: JobCardSkeletonProps) {
  return (
    <div
      className={cn(
        'p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {showLogo && <AvatarSkeleton size="large" variant={variant} />}
        
        <div className="flex-1 min-w-0">
          <TitleSkeleton level={3} width="60%" className="mb-2" variant={variant} />
          <div className="flex items-center gap-2 mb-3">
            <SkeletonBase className="h-4 w-24" variant={variant} />
            <span className="text-gray-300">·</span>
            <SkeletonBase className="h-4 w-16" variant={variant} />
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <SkeletonBase className="h-6 w-16 rounded-full" variant={variant} />
            <SkeletonBase className="h-6 w-20 rounded-full" variant={variant} />
            <SkeletonBase className="h-6 w-14 rounded-full" variant={variant} />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SkeletonBase className="h-5 w-16" variant={variant} />
              <SkeletonBase className="h-5 w-12" variant={variant} />
            </div>
            <SkeletonBase className="h-9 w-20 rounded-lg" variant={variant} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 公司卡片骨架
// ============================================================================

/**
 * 公司卡片骨架
 */
function CompanyCardSkeleton({ className, variant }: SkeletonBaseProps) {
  return (
    <div
      className={cn(
        'p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700',
        className
      )}
    >
      <div className="flex items-center gap-4 mb-4">
        <AvatarSkeleton size="large" variant={variant} />
        <div className="flex-1">
          <TitleSkeleton level={3} width="50%" className="mb-1" variant={variant} />
          <SkeletonBase className="h-4 w-32" variant={variant} />
        </div>
      </div>
      
      <TextSkeleton lines={2} className="mb-4" variant={variant} />
      
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="text-center">
            <SkeletonBase className="h-6 w-12 mb-1" variant={variant} />
            <SkeletonBase className="h-3 w-16" variant={variant} />
          </div>
          <div className="text-center">
            <SkeletonBase className="h-6 w-12 mb-1" variant={variant} />
            <SkeletonBase className="h-3 w-16" variant={variant} />
          </div>
        </div>
        
        <SkeletonBase className="h-9 w-24 rounded-lg" variant={variant} />
      </div>
    </div>
  );
}

// ============================================================================
// 博客卡片骨架
// ============================================================================

/**
 * 博客卡片骨架
 */
function BlogCardSkeleton({ className, variant }: SkeletonBaseProps) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700',
        className
      )}
    >
      <ImageSkeleton aspectRatio="16/9" rounded="none" variant={variant} />
      
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <SkeletonBase className="h-5 w-16 rounded-full" variant={variant} />
          <SkeletonBase className="h-4 w-20" variant={variant} />
        </div>
        
        <TitleSkeleton level={3} width="80%" className="mb-2" variant={variant} />
        <TextSkeleton lines={2} className="mb-4" variant={variant} />
        
        <div className="flex items-center gap-3">
          <AvatarSkeleton size="small" variant={variant} />
          <SkeletonBase className="h-4 w-24" variant={variant} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 列表骨架
// ============================================================================

interface ListSkeletonProps extends SkeletonBaseProps {
  /** 项目数量 */
  count?: number;
  /** 项目高度 */
  itemHeight?: number;
}

/**
 * 列表骨架
 */
function ListSkeleton({ count = 5, itemHeight = 60, className, variant }: ListSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonBase
          key={i}
          className="w-full"
          variant={variant}
        />
      ))}
    </div>
  );
}

// ============================================================================
// 表格骨架
// ============================================================================

interface TableSkeletonProps extends SkeletonBaseProps {
  /** 行数 */
  rows?: number;
  /** 列数 */
  columns?: number;
}

/**
 * 表格骨架
 */
function TableSkeleton({ rows = 5, columns = 4, className, variant }: TableSkeletonProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* 表头 */}
      <div className="flex gap-4 mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonBase
            key={i}
            className="h-6 flex-1"
            variant={variant}
          />
        ))}
      </div>
      
      {/* 表体 */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="flex gap-4 mb-3"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonBase
              key={colIndex}
              className="h-10 flex-1"
              variant={variant}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// 英雄区骨架
// ============================================================================

/**
 * 英雄区骨架
 */
function HeroSkeleton({ className, variant }: SkeletonBaseProps) {
  return (
    <div
      className={cn(
        'w-full min-h-[400px] flex items-center justify-center',
        className
      )}
    >
      <div className="text-center max-w-2xl mx-auto px-4">
        <TitleSkeleton level={1} width="70%" className="mx-auto mb-4" variant={variant} />
        <TextSkeleton lines={2} className="max-w-lg mx-auto mb-8" variant={variant} />
        
        <div className="flex gap-4 justify-center">
          <SkeletonBase className="h-12 w-32 rounded-lg" variant={variant} />
          <SkeletonBase className="h-12 w-32 rounded-lg" variant={variant} />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 导出复合组件
// ============================================================================

export const Skeleton = {
  /** 基础骨架 */
  Base: SkeletonBase,
  /** 文本行骨架 */
  Text: TextSkeleton,
  /** 标题骨架 */
  Title: TitleSkeleton,
  /** 头像骨架 */
  Avatar: AvatarSkeleton,
  /** 图片骨架 */
  Image: ImageSkeleton,
  /** 通用卡片骨架 */
  Card: CardSkeleton,
  /** 职位卡片骨架 */
  JobCard: JobCardSkeleton,
  /** 公司卡片骨架 */
  CompanyCard: CompanyCardSkeleton,
  /** 博客卡片骨架 */
  BlogCard: BlogCardSkeleton,
  /** 列表骨架 */
  List: ListSkeleton,
  /** 表格骨架 */
  Table: TableSkeleton,
  /** 英雄区骨架 */
  Hero: HeroSkeleton,
};

export default Skeleton;
