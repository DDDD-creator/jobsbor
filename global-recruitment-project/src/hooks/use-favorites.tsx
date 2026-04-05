'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface FavoriteJob {
  id: string
  title: string
  company: string
  location: string
  salary: string
  addedAt: string
}

interface FavoritesContextType {
  favorites: FavoriteJob[]
  addFavorite: (job: Omit<FavoriteJob, 'addedAt'>) => void
  removeFavorite: (jobId: string) => void
  isFavorite: (jobId: string) => boolean
  toggleFavorite: (job: Omit<FavoriteJob, 'addedAt'>) => void
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

const STORAGE_KEY = 'jobsbor_favorites'

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteJob[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 从localStorage加载收藏
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setFavorites(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
    setIsLoaded(true)
  }, [])

  // 保存到localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
      } catch (error) {
        console.error('Failed to save favorites:', error)
      }
    }
  }, [favorites, isLoaded])

  const addFavorite = (job: Omit<FavoriteJob, 'addedAt'>) => {
    setFavorites(prev => {
      if (prev.some(f => f.id === job.id)) return prev
      return [...prev, { ...job, addedAt: new Date().toISOString() }]
    })
  }

  const removeFavorite = (jobId: string) => {
    setFavorites(prev => prev.filter(f => f.id !== jobId))
  }

  const isFavorite = (jobId: string) => {
    return favorites.some(f => f.id === jobId)
  }

  const toggleFavorite = (job: Omit<FavoriteJob, 'addedAt'>) => {
    if (isFavorite(job.id)) {
      removeFavorite(job.id)
    } else {
      addFavorite(job)
    }
  }

  const clearFavorites = () => {
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  // 如果没有Provider，返回空实现（用于SSR）
  if (context === undefined) {
    return {
      favorites: [],
      addFavorite: () => {},
      removeFavorite: () => {},
      isFavorite: () => false,
      toggleFavorite: () => {},
      clearFavorites: () => {},
    }
  }
  return context
}
