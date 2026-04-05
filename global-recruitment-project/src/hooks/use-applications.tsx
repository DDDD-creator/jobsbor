'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type ApplicationStatus = 
  | 'saved'      // 已保存（未申请）
  | 'applied'    // 已申请
  | 'interview'  // 面试中
  | 'offer'      // 收到Offer
  | 'rejected'   // 被拒
  | 'withdrawn'  // 已撤回

interface JobApplication {
  id: string                    // 职位slug
  title: string
  company: string
  location: string
  salary: string
  status: ApplicationStatus
  appliedAt?: string            // 申请时间
  notes?: string                // 备注
  updatedAt: string
}

interface ApplicationsContextType {
  applications: JobApplication[]
  apply: (job: Omit<JobApplication, 'status' | 'updatedAt'>) => void
  updateStatus: (jobId: string, status: ApplicationStatus, notes?: string) => void
  removeApplication: (jobId: string) => void
  getStatus: (jobId: string) => ApplicationStatus | null
  getStats: () => {
    total: number
    saved: number
    applied: number
    interview: number
    offer: number
    rejected: number
  }
}

const ApplicationsContext = createContext<ApplicationsContextType | undefined>(undefined)

const STORAGE_KEY = 'jobsbor_applications'

// 状态颜色映射
export const statusColors: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  saved: { label: '已保存', color: 'text-gray-400', bg: 'bg-gray-500/20' },
  applied: { label: '已申请', color: 'text-blue-400', bg: 'bg-blue-500/20' },
  interview: { label: '面试中', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  offer: { label: '已录用', color: 'text-green-400', bg: 'bg-green-500/20' },
  rejected: { label: '未通过', color: 'text-red-400', bg: 'bg-red-500/20' },
  withdrawn: { label: '已撤回', color: 'text-gray-500', bg: 'bg-gray-600/20' },
}

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<JobApplication[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // 从localStorage加载
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setApplications(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load applications:', error)
    }
    setIsLoaded(true)
  }, [])

  // 保存到localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(applications))
      } catch (error) {
        console.error('Failed to save applications:', error)
      }
    }
  }, [applications, isLoaded])

  const apply = (job: Omit<JobApplication, 'status' | 'updatedAt'>) => {
    setApplications(prev => {
      const existing = prev.find(a => a.id === job.id)
      if (existing) {
        // 更新现有记录
        return prev.map(a => 
          a.id === job.id 
            ? { ...a, ...job, status: 'applied' as ApplicationStatus, appliedAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
            : a
        )
      }
      // 新建记录
      return [...prev, {
        ...job,
        status: 'applied',
        appliedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }]
    })
  }

  const updateStatus = (jobId: string, status: ApplicationStatus, notes?: string) => {
    setApplications(prev => 
      prev.map(a => 
        a.id === jobId 
          ? { ...a, status, notes: notes || a.notes, updatedAt: new Date().toISOString() }
          : a
      )
    )
  }

  const removeApplication = (jobId: string) => {
    setApplications(prev => prev.filter(a => a.id !== jobId))
  }

  const getStatus = (jobId: string): ApplicationStatus | null => {
    const app = applications.find(a => a.id === jobId)
    return app?.status || null
  }

  const getStats = () => {
    return {
      total: applications.length,
      saved: applications.filter(a => a.status === 'saved').length,
      applied: applications.filter(a => a.status === 'applied').length,
      interview: applications.filter(a => a.status === 'interview').length,
      offer: applications.filter(a => a.status === 'offer').length,
      rejected: applications.filter(a => a.status === 'rejected').length,
    }
  }

  return (
    <ApplicationsContext.Provider
      value={{
        applications,
        apply,
        updateStatus,
        removeApplication,
        getStatus,
        getStats,
      }}
    >
      {children}
    </ApplicationsContext.Provider>
  )
}

export function useApplications() {
  const context = useContext(ApplicationsContext)
  // SSR安全：无Provider时返回空实现
  if (context === undefined) {
    return {
      applications: [],
      apply: () => {},
      updateStatus: () => {},
      removeApplication: () => {},
      getStatus: () => null,
      getStats: () => ({ total: 0, saved: 0, applied: 0, interview: 0, offer: 0, rejected: 0 }),
    }
  }
  return context
}

export type { ApplicationStatus, JobApplication }
