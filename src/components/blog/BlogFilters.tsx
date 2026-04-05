'use client'

import { useState } from 'react'

interface BlogFiltersProps {
  categories: { key: string; label: string; count: number }[]
}

export function BlogFilters({ categories }: BlogFiltersProps) {
  const [active, setActive] = useState('all')

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {categories.map(cat => (
        <button
          key={cat.key}
          onClick={() => setActive(cat.key)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
            active === cat.key
              ? 'bg-gradient-to-r from-neon-cyan to-neon-blue text-white shadow-[0_0_15px_rgba(0,224,255,0.3)]'
              : 'glass-card text-gray-400 hover:text-white hover:border-neon-cyan/30'
          }`}
        >
          {cat.label}
          <span className="ml-1.5 opacity-60">{cat.count}</span>
        </button>
      ))}
    </div>
  )
}
