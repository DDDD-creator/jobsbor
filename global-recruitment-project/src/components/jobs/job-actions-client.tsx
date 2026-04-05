"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, Heart, CheckCircle } from "lucide-react"

interface JobActionsProps {
  jobId: string
  jobTitle: string
}

export function JobActionsClient({ jobId, jobTitle }: JobActionsProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [hasApplied, setHasApplied] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return;
    
    if (status === "authenticated" && session?.user?.role === "JOBSEEKER") {
      checkStatus()
    } else {
      setIsChecking(false)
    }
  }, [mounted, status, session, jobId])

  const checkStatus = async () => {
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
        setIsFavorited(favData.isFavorited)
      }
    } catch (error) {
      console.error("Failed to check status:", error)
    } finally {
      setIsChecking(false)
    }
  }

  const handleApply = async () => {
    if (status !== "authenticated" || !session) {
      router.push(`/auth/login?callbackUrl=/jobs/${jobId}`)
      return
    }

    if (session.user?.role !== "JOBSEEKER") {
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

  const handleFavorite = async () => {
    if (status !== "authenticated" || !session) {
      router.push(`/auth/login?callbackUrl=/jobs/${jobId}`)
      return
    }

    if (session.user?.role !== "JOBSEEKER") {
      return
    }

    try {
      const res = await fetch("/api/jobs/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId })
      })

      if (res.ok) {
        const data = await res.json()
        setIsFavorited(data.isFavorited)
      }
    } catch (error) {
      console.error("Failed to toggle favorite:", error)
    }
  }

  if (isChecking) {
    return (
      <div className="flex gap-2">
        <Button disabled className="flex-1">
          <Loader2 className="h-4 w-4 animate-spin" />
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex gap-2">
        {hasApplied ? (
          <Button disabled className="flex-1 bg-green-500 hover:bg-green-500">
            <CheckCircle className="h-4 w-4 mr-2" />
            已申请
          </Button>
        ) : (
          <Button 
            onClick={handleApply} 
            className="flex-1 bg-blue-500 hover:bg-blue-600"
            disabled={status !== "authenticated" || session?.user?.role !== "JOBSEEKER"}
          >
            <Send className="h-4 w-4 mr-2" />
            立即投递
          </Button>
        )}

        {session?.user?.role === "JOBSEEKER" && (
          <Button
            variant="outline"
            onClick={handleFavorite}
            className={isFavorited ? "border-red-500 text-red-500" : ""}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
          </Button>
        )}
      </div>

      {status !== "authenticated" && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          请<button onClick={() => router.push("/auth/login")} className="text-blue-400 hover:underline">登录</button>后投递简历
        </p>
      )}

      <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
        <DialogContent className="bg-gray-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>申请职位</DialogTitle>
            <DialogDescription className="text-gray-400">
              正在申请：{jobTitle}
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
            <Button variant="outline" onClick={() => setIsApplyDialogOpen(false)}>
              取消
            </Button>
            <Button 
              onClick={submitApplication}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600"
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
