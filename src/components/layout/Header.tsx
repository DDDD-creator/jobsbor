'use client'

import { cn } from '@/lib/utils'
import { LocalizedLink, useCurrentLocale } from '@/components/i18n/localized-link'
import { useState, useEffect } from 'react'
import { Heart, Menu, X, Sparkles, FileText } from 'lucide-react'
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher'
import { loadTranslations } from '@/i18n/loader'
import type { Locale } from '@/i18n/config'
import type { Translations } from '@/i18n/loader'
import { FavoritesButton, FavoritesCount, ApplicationsButton, ApplicationsCount, AlertsButton } from '@/components/favorites/favorites-nav'
import { NotificationBellWithDropdown } from '@/components/notifications/NotificationBellWithDropdown'

interface HeaderProps {
  locale?: Locale
  translations?: Translations
}

/**
 * Web3风格头部导航组件 (多语言版本)
 * - 玻璃拟态导航栏
 * - 霓虹发光Logo
 * - 深色主题
 * - 语言切换器
 */
export function Header({ locale: propLocale, translations: propTranslations }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [translations, setTranslations] = useState<Translations | null>(propTranslations || null)

  // 从pathname获取当前语言，或使用props传入的语言
  const pathnameLocale = useCurrentLocale()
  const locale = propLocale || pathnameLocale

  // 如果没有传入translations，异步加载
  useEffect(() => {
    if (!propTranslations) {
      loadTranslations(locale).then(setTranslations).catch(console.error)
    }
  }, [locale, propTranslations])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // 检测滚动方向
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        // 向下滚动且超过80px，隐藏导航栏
        setHidden(true)
      } else {
        // 向上滚动，显示导航栏
        setHidden(false)
      }

      setScrolled(currentScrollY > 20)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // 使用加载的translations或fallback
  const t = translations?.nav || {
    home: locale === 'zh' ? '首页' : 'Home',
    jobs: locale === 'zh' ? '职位' : 'Jobs',
    companies: locale === 'zh' ? '公司' : 'Companies',
    guide: locale === 'zh' ? '指南' : 'Guide',
    about: locale === 'zh' ? '关于我们' : 'About',
    blog: locale === 'zh' ? '博客' : 'Blog',
    search: locale === 'zh' ? '搜索' : 'Search',
  }

  const navLinks = [
    { href: '/', label: t.home },
    { href: '/jobs', label: t.jobs },
    { href: '/companies', label: t.companies },
    { href: '/guide', label: t.guide },
    { href: '/blog', label: t.blog },
    { href: '/about', label: t.about },
  ]

  const searchButtonText = translations?.hero?.searchButton || (locale === 'zh' ? '搜索职位' : 'Find Jobs')

  return (
    <>
      {/* Beta提示条 */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-1.5 text-center">
          <p className="text-xs sm:text-sm text-gray-300">
            <span className="inline-flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />
              <span className="text-neon-cyan font-medium">Beta</span>
            </span>
            <span className="mx-2 text-gray-500">|</span>
            <span>
              {locale === 'zh'
                ? '职位数据实时更新中，申请功能即将上线'
                : 'Live job updates, application feature coming soon'}
            </span>
            <a
              href="https://t.me/Web3Kairo"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-neon-cyan hover:underline"
            >
              {locale === 'zh' ? '加入Telegram获取最新职位 →' : 'Join Telegram for latest jobs →'}
            </a>
          </p>
        </div>
      </div>

      <header
        className={cn(
          'fixed top-8 left-0 right-0 z-50 w-full transition-all duration-300',
          scrolled
            ? 'glass-nav shadow-lg'
            : 'bg-transparent',
          hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - 霓虹风格 */}
            <LocalizedLink href="/" className="flex items-center space-x-2 group">
              <span className="text-xl font-bold text-white group-hover:text-neon-cyan transition-colors">
                Jobs<span className="text-neon-purple">bor</span>
              </span>
              <Sparkles className="h-4 w-4 text-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
            </LocalizedLink>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <LocalizedLink
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-gray-300 transition-colors hover:text-white group min-h-[44px] flex items-center"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-neon-cyan to-neon-purple group-hover:w-3/4 transition-all duration-300" />
                </LocalizedLink>
              ))}

              {/* Language Switcher */}
              <div className="ml-4">
                <LanguageSwitcher currentLocale={locale} variant="minimal" showFlags={true} />
              </div>

              {/* 收藏按钮 */}
              <FavoritesButton />

              {/* 申请追踪按钮 */}
              <ApplicationsButton />

              {/* 职位提醒按钮 */}
              <AlertsButton />

              {/* 通知铃铛 */}
              <NotificationBellWithDropdown />

              <LocalizedLink
                href="/jobs"
                className="ml-4 inline-flex items-center justify-center rounded-lg px-5 py-2 text-sm font-semibold text-dark-500 bg-gradient-to-r from-neon-cyan to-neon-blue transition-all duration-300 hover:shadow-neon-cyan hover:scale-105"
              >
                {searchButtonText}
              </LocalizedLink>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-300 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={locale === 'zh' ? '切换菜单' : 'Toggle menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden glass-card rounded-xl mt-2 p-4 border border-white/10">
              <nav className="flex flex-col space-y-2">
                {navLinks.map((link) => (
                  <LocalizedLink
                    key={link.href}
                    href={link.href}
                    className="px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:text-white hover:bg-white/5 transition-colors min-h-[44px] flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </LocalizedLink>
                ))}

                {/* 移动端申请追踪入口 */}
                <LocalizedLink
                  href="/applications"
                  className="px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:text-white hover:bg-white/5 transition-colors min-h-[44px] flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    申请追踪
                  </span>
                  <ApplicationsCount />
                </LocalizedLink>

                {/* 移动端收藏入口 */}
                <LocalizedLink
                  href="/favorites"
                  className="px-4 py-3 text-sm font-medium text-gray-300 rounded-lg hover:text-white hover:bg-white/5 transition-colors min-h-[44px] flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    我的收藏
                  </span>
                  <FavoritesCount />
                </LocalizedLink>

                {/* Mobile Language Switcher */}
                <div className="pt-2 border-t border-white/5">
                  <p className="px-4 py-2 text-xs text-gray-500 uppercase">
                    {locale === 'zh' ? '语言' : 'Language'}
                  </p>
                  <LanguageSwitcher currentLocale={locale} variant="inline" showFlags={true} />
                </div>

                <LocalizedLink
                  href="/jobs"
                  className="mt-2 inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-dark-500 bg-gradient-to-r from-neon-cyan to-neon-blue min-h-[44px]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {searchButtonText}
                </LocalizedLink>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}
