"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Heart, MapPin, Building2, Trash2 } from "lucide-react"

interface FavoriteJob {
  id: string
  createdAt: string
  job: {
    id: string
    title: string
    slug: string
    location: string
    salaryMin: number | null
    salaryMax: number | null
    salaryCurrency: string
    company: {
      id: string
      name: string
      slug: string
      logo: string | null
    }
  }
}

export default function FavoritesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [favorites, setFavorites] = useState<FavoriteJob[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // 确保在客户端运行且状态已确定
    if (status === "loading") return;
    
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/jobseeker/favorites")
      return
    }

    if (status === "authenticated") {
      if (session?.user?.role !== "JOBSEEKER") {
        router.push("/")
        return
      }
      fetchFavorites()
    }
  }, [status, session, router])

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/jobs/favorite")
      const data = await res.json()
      if (data.favorites) {
        setFavorites(data.favorites)
      }
    } catch (error) {
      console.error("Failed to fetch favorites:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const removeFavorite = async (jobId: string) => {
    try {
      const res = await fetch("/api/jobs/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId })
      })
      
      if (res.ok) {
        setFavorites(favorites.filter(f => f.job.id !== jobId))
      }
    } catch (error) {
      console.error("Failed to remove favorite:", error)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  const formatSalary = (min: number | null, max: number | null, currency: string) => {
    if (!min && !max) return "薪资面议"
    const symbol = currency === "CNY" ? "¥" : "$"
    if (min && max) return `${symbol}${min/1000}k-${max/1000}k`
    if (min) return `${symbol}${min/1000}k起`
    if (max) return `${symbol}${max/1000}k以下`
    return "薪资面议"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">我的收藏</h1>
            <p className="text-gray-400">您收藏了 {favorites.length} 个职位</p>
          </div>

          {favorites.length === 0 ? (
            <Card className="bg-white/5 border-white/10">
              <CardContent className="py-12 text-center">
                <Heart className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">您还没有收藏任何职位</p>
                <Button variant="outline" onClick={() => window.location.href = "/jobs"}>
                  浏览职位
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {favorites.map((favorite) => (
                <Card key={favorite.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <Link href={`/jobs/${favorite.job.slug}`} className="text-xl font-semibold text-white hover:text-blue-400 transition-colors block mb-2">
                          {favorite.job.title}
                        </Link>
                        
                        <div className="flex flex-wrap items-center gap-4 text-gray-400">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            <Link href={`/companies/${favorite.job.company.slug}`} className="hover:text-white transition-colors">
                              {favorite.job.company.name}
                            </Link>
                          </span>
                          
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {favorite.job.location}
                          </span>
                          
                          <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                            {formatSalary(favorite.job.salaryMin, favorite.job.salaryMax, favorite.job.salaryCurrency)}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => window.location.href = `/jobs/${favorite.job.slug}`}>
                          查看详情
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFavorite(favorite.job.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
