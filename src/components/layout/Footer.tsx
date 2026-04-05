'use client'

import { LocalizedLink, useCurrentLocale } from '@/components/i18n/localized-link'
import { Send, Github, Twitter, Linkedin, MessageCircle, Briefcase, Sparkles } from 'lucide-react'
import { LanguageSwitcher, FooterLanguageSelector } from '@/components/i18n/LanguageSwitcher'
import { loadTranslations } from '@/i18n/loader'
import { useState, useEffect } from 'react'
import type { Locale } from '@/i18n/config'
import type { Translations } from '@/i18n/loader'

interface FooterProps {
  locale?: Locale
  translations?: Translations
}

/**
 * Web3风格底部组件 (多语言版本)
 * - 深色玻璃背景
 * - 霓虹发光效果
 * - 网格装饰背景
 * - 语言选择器
 */
export function Footer({ locale: propLocale, translations: propTranslations }: FooterProps) {
  const [translations, setTranslations] = useState<Translations | null>(propTranslations || null)
  
  // 从pathname获取当前语言
  const pathnameLocale = useCurrentLocale()
  const locale = propLocale || pathnameLocale

  // 如果没有传入translations，异步加载
  useEffect(() => {
    if (!propTranslations) {
      loadTranslations(locale).then(setTranslations).catch(console.error)
    }
  }, [locale, propTranslations])

  // 使用加载的translations或fallback
  const t = translations?.footer || {
    about: locale === 'zh' ? '关于我们' : 'About Us',
    careers: locale === 'zh' ? '加入我们' : 'Careers',
    contact: locale === 'zh' ? '联系我们' : 'Contact',
    privacy: locale === 'zh' ? '隐私政策' : 'Privacy Policy',
    terms: locale === 'zh' ? '服务条款' : 'Terms of Service',
    copyright: locale === 'zh' ? '© 2024 Jobsbor. 保留所有权利。' : '© 2024 Jobsbor. All rights reserved.',
  }

  const nav = translations?.nav || {
    home: locale === 'zh' ? '首页' : 'Home',
    jobs: locale === 'zh' ? '职位' : 'Jobs',
    companies: locale === 'zh' ? '公司' : 'Companies',
    guide: locale === 'zh' ? '指南' : 'Guide',
    blog: locale === 'zh' ? '博客' : 'Blog',
  }

  const footerLinks = [
    {
      title: t.about,
      links: [
        { label: t.about, href: '/about' },
        { label: t.contact, href: '/contact' },
        { label: t.careers, href: '#' },
      ],
    },
    {
      title: nav.jobs,
      links: [
        { label: nav.jobs, href: '/jobs' },
        { label: nav.companies, href: '/companies' },
        { label: nav.guide, href: '/guide' },
        { label: nav.blog, href: '/blog' },
      ],
    },
  ]

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
    { name: 'Telegram', icon: Send, href: 'https://t.me/Web3Kairo' },
  ]

  const description = translations?.metadata?.description || 
    (locale === 'zh' ? '连接顶尖人才与未来企业' : 'Connecting top talent with future enterprises')

  return (
    <footer className="relative w-full bg-dark-300 border-t border-white/5 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-[120px]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <LocalizedLink href="/" className="flex items-center space-x-2 group">
              <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-white" />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple blur-lg opacity-50" />
              </div>
              <span className="text-xl font-bold text-white">
                Jobs<span className="text-neon-purple">bor</span>
              </span>
              <Sparkles className="h-4 w-4 text-neon-cyan" />
            </LocalizedLink>
            <p className="mt-4 text-sm text-gray-400 max-w-xs leading-relaxed">
              {description}
            </p>
            
            {/* Social Links */}
            <div className="mt-6 flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-gray-400 transition-all duration-300 hover:bg-neon-purple/20 hover:text-neon-purple hover:shadow-neon-purple"
                  title={social.name}
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <LocalizedLink
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-neon-cyan transition-colors"
                    >
                      {link.label}
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Language Selector */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {locale === 'zh' ? '语言' : 'Language'}
            </h3>
            <FooterLanguageSelector currentLocale={locale} />
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">{t.copyright}</p>
          <div className="flex items-center space-x-6">
            <LocalizedLink href="/privacy" className="text-sm text-gray-500 hover:text-neon-cyan transition-colors">
              {t.privacy}
            </LocalizedLink>
            <LocalizedLink href="/terms" className="text-sm text-gray-500 hover:text-neon-cyan transition-colors">
              {t.terms}
            </LocalizedLink>
          </div>
        </div>
      </div>
    </footer>
  )
}
