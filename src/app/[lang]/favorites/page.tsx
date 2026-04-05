import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FavoritesList } from '@/components/favorites/favorites-list'

export const metadata: Metadata = {
  title: '我的收藏 | Jobsbor',
  description: '查看您收藏的职位，方便后续申请',
}

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <FavoritesList />
      </main>

      <Footer />
    </div>
  )
}
