import { headers } from 'next/headers'
import { locales, defaultLocale } from './config'

/**
 * 服务端获取当前语言
 * 从请求头或URL路径中解析
 */
export async function getLocale(): Promise<'zh' | 'en'> {
  const headersList = headers()
  
  // 尝试从referer获取语言
  const referer = headersList.get('referer') || ''
  const pathname = headersList.get('x-invoke-path') || referer
  
  // 从路径中提取语言
  const pathLocale = pathname.split('/')[1]
  if (pathLocale === 'zh' || pathLocale === 'en') {
    return pathLocale
  }
  
  // 尝试从accept-language头获取
  const acceptLang = headersList.get('accept-language')
  if (acceptLang) {
    const preferred = acceptLang.split(',')[0].split('-')[0]
    if (preferred === 'zh') return 'zh'
    if (preferred === 'en') return 'en'
  }
  
  return defaultLocale
}

/**
 * 服务端加载翻译
 */
export async function loadTranslationsServer(locale: 'zh' | 'en') {
  const { loadTranslations } = await import('./loader')
  return loadTranslations(locale)
}
