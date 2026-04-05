'use client'

import { useState, useEffect } from 'react'
import { useFavorites } from '@/hooks/use-favorites'
import { useApplications } from '@/hooks/use-applications'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { Heart, FileText, Bell } from 'lucide-react'

export function FavoritesButton() {
  const { favorites } = useFavorites()
  const count = favorites.length

  return (
    <LocalizedLink
      href="/favorites"
      className="relative ml-2 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
      aria-label="我的收藏"
    >
      <Heart className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </LocalizedLink>
  )
}

export function FavoritesCount() {
  const { favorites } = useFavorites()
  const count = favorites.length
  
  if (count === 0) return null
  
  return (
    <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export function ApplicationsButton() {
  const { getStats } = useApplications()
  const stats = getStats()
  const count = stats.total

  return (
    <LocalizedLink
      href="/applications"
      className="relative ml-2 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
      aria-label="申请追踪"
    >
      <FileText className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-neon-cyan text-dark-500 text-xs font-bold rounded-full flex items-center justify-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </LocalizedLink>
  )
}

export function ApplicationsCount() {
  const { getStats } = useApplications()
  const count = getStats().total
  
  if (count === 0) return null
  
  return (
    <span className="bg-neon-cyan text-dark-500 text-xs font-bold px-2 py-0.5 rounded-full">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export function AlertsButton() {
  const [alertCount, setAlertCount] = useState(0)

  useEffect(() => {
    const alerts = JSON.parse(localStorage.getItem('jobsbor_job_alerts') || '[]')
    setAlertCount(alerts.filter((a: any) => a.isActive).length)
  }, [])

  return (
    <LocalizedLink
      href="/alerts"
      className="relative ml-2 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
      aria-label="职位提醒"
    >
      <Bell className="h-5 w-5" />
      {alertCount > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
          {alertCount > 99 ? '99+' : alertCount}
        </span>
      )}
    </LocalizedLink>
  )
}
