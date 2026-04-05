/**
 * i18n Configuration - 简化版
 * 专注中文求职招聘
 */

// 只保留中文和英文
export const locales = ['zh', 'en'] as const;
export type Locale = typeof locales[number];

// 默认中文
export const defaultLocale: Locale = 'zh';

// 语言显示
export const languageMetadata: Record<Locale, { name: string; nativeName: string; flag: string; dir?: string }> = {
  zh: { name: 'Chinese', nativeName: '简体中文', flag: '🇨🇳', dir: 'ltr' },
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', dir: 'ltr' },
};

// HTML lang 属性映射
export const localeToHtmlLang: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en-US',
  ja: 'ja-JP',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  ko: 'ko-KR',
  th: 'th-TH',
  vi: 'vi-VN',
  hi: 'hi-IN',
};

// Hreflang 属性映射
export const localeToHreflang: Record<string, string> = {
  zh: 'zh-CN',
  en: 'en',
};

// 检查语言
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

// 从路径获取语言
export function getLocaleFromPathname(pathname: string): Locale {
  const pathnameLocale = pathname.split('/')[1];
  if (isValidLocale(pathnameLocale)) {
    return pathnameLocale;
  }
  return defaultLocale;
}

// 从路径中移除语言前缀
export function removeLocalePrefix(pathname: string): string {
  const segments = pathname.split('/');
  if (segments.length > 1 && isValidLocale(segments[1])) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}

// 添加语言前缀到路径
export function addLocalePrefix(pathname: string, locale: Locale): string {
  const cleanPath = removeLocalePrefix(pathname);
  if (cleanPath === '/' || cleanPath === '') {
    return `/${locale}`;
  }
  return `/${locale}${cleanPath}`;
}
