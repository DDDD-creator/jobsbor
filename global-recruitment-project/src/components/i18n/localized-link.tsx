/**
 * 多语言链接组件
 * 自动处理语言前缀
 */

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { addLocalePrefix, defaultLocale, type Locale } from '@/i18n/config'

interface LocalizedLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  locale?: Locale
  onClick?: () => void
  itemProp?: string
}

export function LocalizedLink({ 
  href, 
  children, 
  className,
  locale,
  onClick,
  itemProp
}: LocalizedLinkProps) {
  const pathname = usePathname()
  
  // 从当前路径获取语言
  const currentLocale = pathname?.split('/')[1] as Locale
  const targetLocale = locale || (currentLocale || defaultLocale)
  
  // 如果 href 已经是完整路径（带语言前缀），直接使用
  if (href.startsWith('/zh/') || href.startsWith('/en/')) {
    return (
      <Link href={href} className={className} onClick={onClick} itemProp={itemProp}>
        {children}
      </Link>
    )
  }
  
  // 添加语言前缀
  const localizedHref = addLocalePrefix(href, targetLocale)
  
  return (
    <Link href={localizedHref} className={className} onClick={onClick} itemProp={itemProp}>
      {children}
    </Link>
  )
}

/**
 * 获取当前语言的辅助函数
 */
export function useCurrentLocale(): Locale {
  const pathname = usePathname()
  const locale = pathname.split('/')[1] as Locale
  return locale || defaultLocale
}

/**
 * 生成带语言前缀的 href
 */
export function useLocalizedHref(href: string): string {
  const locale = useCurrentLocale()
  return addLocalePrefix(href, locale)
}
