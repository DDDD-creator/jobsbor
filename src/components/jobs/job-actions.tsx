'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'
import { Bookmark, Share2, Check, Send, Heart, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FAVORITES_KEY } from '@/lib/constants'

interface JobActionsProps {
  jobId: string
  jobTitle: string
  companyName: string
}

export function JobActions({ jobId, jobTitle, companyName }: JobActionsProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const [isFavorite, setIsFavorite] = useState(false)
  const [showShareToast, setShowShareToast] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 新增状态
  const [hasApplied, setHasApplied] = useState(false)
  const [isFavoritedServer, setIsFavoritedServer] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 从localStorage读取收藏状态（游客模式）
    const saved = localStorage.getItem(FAVORITES_KEY)
    if (saved) {
      const favorites = JSON.parse(saved)
      setIsFavorite(favorites.includes(jobId))
    }
  }, [jobId])

  // 单独处理服务端状态检查
  useEffect(() => {
    // 只有在客户端挂载后才检查服务端状态
    if (!mounted) return;

    if (status === "authenticated" && session?.user?.role === "JOBSEEKER") {
      checkServerStatus()
    } else {
      setIsChecking(false)
    }
  }, [mounted, status, session, jobId])

  // 清理timeout
  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current)
      }
    }
  }, [])

  const checkServerStatus = async () => {
    try {
      // 检查申请状态
      const applyRes = await fetch(`/api/jobs/apply?jobId=${jobId}`)
      if (applyRes.ok) {
        const applyData = await applyRes.json()
        setHasApplied(applyData.hasApplied)
      }

      // 检查收藏状态
      const favRes = await fetch(`/api/jobs/favorite?jobId=${jobId}`)
      if (favRes.ok) {
        const favData = await favRes.json()
        setIsFavoritedServer(favData.isFavorited)
      }
    } catch (error) {
      console.error("Failed to check status:", error)
    } finally {
      setIsChecking(false)
    }
  }

  // 本地收藏切换（游客模式）
  const toggleLocalFavorite = () => {
    const saved = localStorage.getItem(FAVORITES_KEY)
    const favorites = saved ? JSON.parse(saved) : []

    let newFavorites
    if (favorites.includes(jobId)) {
      newFavorites = favorites.filter((id: string) => id !== jobId)
      setIsFavorite(false)
    } else {
      newFavorites = [...favorites, jobId]
      setIsFavorite(true)
    }

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
  }

  // 服务器收藏切换（登录用户）
  const toggleServerFavorite = async () => {
    try {
      const res = await fetch("/api/jobs/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId })
      })

      if (res.ok) {
        const data = await res.json()
        setIsFavoritedServer(data.isFavorited)
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  // 统一收藏处理
  const handleFavorite = () => {
    if (status !== "authenticated") {
      // 游客模式，使用本地存储
      toggleLocalFavorite()
    } else if (session?.user?.role === "JOBSEEKER") {
      // 登录求职者，使用服务器
      toggleServerFavorite()
    }
  }

  // 申请职位
  const handleApply = () => {
    if (status !== "authenticated") {
      router.push(`/auth/login?callbackUrl=/jobs/${jobId}`)
      return
    }

    if (session?.user?.role !== "JOBSEEKER") {
      return
    }

    setIsApplyDialogOpen(true)
  }

  const submitApplication = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, coverLetter })
      })

      if (res.ok) {
        setHasApplied(true)
        setIsApplyDialogOpen(false)
      } else {
        const data = await res.json()
        alert(data.error || "申请失败")
      }
    } catch (error) {
      alert("申请失败，请稍后重试")
    } finally {
      setIsLoading(false)
    }
  }

  // 分享功能
  const handleShare = async () => {
    const shareData = {
      title: `${jobTitle} - ${companyName} | Jobsbor`,
      text: `查看职位：${jobTitle} @ ${companyName}`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setShowShareToast(true)
        // 清理之前的timeout
        if (toastTimeoutRef.current) {
          clearTimeout(toastTimeoutRef.current)
        }
        // 保存新的timeout引用
        toastTimeoutRef.current = setTimeout(() => setShowShareToast(false), 2000)
      }
    } catch (error) {
      console.log('Share cancelled or failed:', error)
    }
  }

  // 判断是否已收藏（本地或服务器）
  const isFavorited = session?.user?.role === "JOBSEEKER" ? isFavoritedServer : isFavorite

  if (!mounted || isChecking) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button disabled className="flex-1" aria-label="加载中">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {/* 投递按钮 */}
        {session?.user?.role === "JOBSEEKER" && (
          <>
            {hasApplied ? (
              <Button
                disabled
                className="bg-green-500 hover:bg-green-500 text-white"
                size="sm"
                aria-label="已申请该职位"
              >
                <Check className="mr-1 h-4 w-4" />
                已申请
              </Button>
            ) : (
              <Button
                onClick={handleApply}
                className="bg-neon-cyan hover:bg-neon-cyan/90 text-dark-500"
                size="sm"
                aria-label={`投递简历到 ${jobTitle || '该职位'}`}
              >
                <Send className="mr-1 h-4 w-4" />
                投递简历
              </Button>
            )}
          </>
        )}

        {/* 收藏按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleFavorite}
          aria-label={isFavorited ? '取消收藏该职位' : '收藏该职位'}
          aria-pressed={isFavorited}
          className={cn(
            "transition-all duration-200",
            isFavorited && "bg-pink-500/10 border-pink-500/30 text-pink-400 hover:bg-pink-500/20"
          )}
        >
          <Heart
            className={cn("mr-1 h-4 w-4 transition-all", isFavorited && "fill-current")}
          />
          {isFavorited ? '已收藏' : '收藏'}
        </Button>

        {/* 分享按钮 */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          aria-label="分享职位"
          className="relative"
        >
          <Share2 className="mr-1 h-4 w-4" />
          分享

          {showShareToast && (
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-neon-cyan text-dark-500 text-xs rounded whitespace-nowrap animate-in fade-in slide-in-from-bottom-2">
              链接已复制
            </span>
          )}
        </Button>
      </div>

      {/* 未登录提示 */}
      {!session && (
        <p className="text-xs text-gray-500 mt-2">
          请<button onClick={() => router.push("/auth/login")} className="text-neon-cyan hover:underline">登录</button>后投递简历
        </p>
      )}

      {/* 申请对话框 */}
      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="bg-dark-500 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>申请职位</DialogTitle>
            <DialogDescription className="text-gray-400">
              正在申请：{jobTitle} @ {companyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                求职信（选填）
              </label>
              <Textarea
                placeholder="简单介绍一下自己，为什么适合这个职位..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[120px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)} aria-label="取消申请">
              取消
            </Button>
            <Button
              onClick={submitApplication}
              disabled={isLoading}
              aria-label={isLoading ? '提交申请中' : '确认提交申请'}
              className="bg-neon-cyan hover:bg-neon-cyan/90 text-dark-500"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  提交中...
                </>
              ) : (
                "确认投递"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
