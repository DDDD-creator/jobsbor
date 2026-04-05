'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ArrowRight } from 'lucide-react'

interface HomeSearchProps {
  placeholder?: string
  buttonText?: string
}

export function HomeSearch({ placeholder = '搜索职位、公司或关键词...', buttonText = '搜索职位' }: HomeSearchProps) {
  const [keyword, setKeyword] = useState('')
  const router = useRouter()

  const handleSearch = () => {
    if (keyword.trim()) {
      router.push(`/jobs?keyword=${encodeURIComponent(keyword.trim())}`)
    } else {
      router.push('/jobs')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="mt-12 flex max-w-2xl mx-auto flex-col gap-4 sm:flex-row">
      <div className="relative flex-1 group">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 group-focus-within:text-neon-cyan transition-colors" />
        <Input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-14 pl-12 pr-4 bg-dark-200/50 backdrop-blur-xl border-white/10 text-white placeholder:text-gray-500 rounded-xl focus:border-neon-cyan/50 focus:ring-neon-cyan/20 transition-all"
        />
      </div>
      <Button
        size="lg"
        onClick={handleSearch}
        className="h-14 px-8 bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500 font-semibold rounded-xl hover:shadow-neon-cyan hover:scale-105 transition-all duration-300 w-full sm:w-auto"
      >
        {buttonText}
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </div>
  )
}
