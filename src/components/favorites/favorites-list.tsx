'use client'

import { useFavorites } from '@/hooks/use-favorites'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Trash2, Briefcase, ArrowRight, BookmarkX } from 'lucide-react'
import { Toaster, toast } from '@/components/ui/sonner'

export function FavoritesList() {
  const { favorites, removeFavorite, clearFavorites } = useFavorites()

  const handleClearAll = () => {
    if (confirm('确定要清空所有收藏吗？')) {
      clearFavorites()
      toast.success('已清空所有收藏')
    }
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
          <BookmarkX className="h-10 w-10 text-gray-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">暂无收藏职位</h1>
        <p className="text-gray-400 mb-8">
          浏览职位时点击心形图标，将感兴趣的职位收藏到这里
        </p>
        
        <LocalizedLink href="/jobs">
          <Button 
            className="bg-gradient-to-r from-neon-cyan to-neon-purple hover:opacity-90"
          >
            浏览职位
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </LocalizedLink>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Heart className="h-8 w-8 text-red-400 fill-current" />
            我的收藏
          </h1>
          <p className="text-gray-400 mt-2">
            共收藏 <span className="text-neon-cyan font-semibold">{favorites.length}</span> 个职位
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearAll}
          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          清空收藏
        </Button>
      </div>

      <div className="space-y-4">
        {favorites.map((job) => (
          <LocalizedLink key={job.id} href={`/jobs/${job.id}`}>
            <Card className="group border-white/10 bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-neon-cyan" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-neon-cyan transition-colors">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-400">{job.company}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <Badge variant="outline" size="sm">{job.location}</Badge>
                      <Badge variant="neon" color="cyan" size="sm">{job.salary}</Badge>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removeFavorite(job.id)
                      toast.success('已取消收藏')
                    }}
                    className="p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    aria-label="取消收藏"
                  >
                    <Heart className="h-5 w-5 fill-current" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </LocalizedLink>
        ))}
      </div>

      <Toaster />
    </div>
  )
}
