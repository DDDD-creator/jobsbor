import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatSalary(min?: number | null, max?: number | null, currency: string = 'CNY') {
  if (!min && !max) return '薪资面议'
  const symbol = currency === 'CNY' ? '¥' : currency
  if (min && max) {
    return `${symbol}${(min / 1000).toFixed(0)}K-${(max / 1000).toFixed(0)}K`
  }
  if (min) return `${symbol}${(min / 1000).toFixed(0)}K+`
  if (max) return `最高${symbol}${(max / 1000).toFixed(0)}K`
  return '薪资面议'
}

export function formatDate(date: Date | string) {
  const d = new Date(date)
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50)
}