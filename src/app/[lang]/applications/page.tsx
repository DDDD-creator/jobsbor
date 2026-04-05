import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ApplicationsList } from '@/components/applications/applications-list'

export const metadata: Metadata = {
  title: '申请追踪 | Jobsbor',
  description: '追踪您的职位申请状态，管理求职进度',
}

export default function ApplicationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1c] via-[#0d1429] to-[#0a0f1c]">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32">
        <ApplicationsList />
      </main>

      <Footer />
    </div>
  )
}
