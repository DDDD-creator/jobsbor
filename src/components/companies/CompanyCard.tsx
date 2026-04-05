import { LocalizedLink } from '@/components/i18n/localized-link'
import type { Company } from '@/types'
import { cn } from '@/lib/utils'

interface CompanyCardProps {
  company: Company
  className?: string
}

/**
 * 公司卡片组件
 * - 展示公司logo、名称、简介和在招职位数
 * - 点击跳转到公司详情页
 */
export function CompanyCard({ company, className }: CompanyCardProps) {
  // 获取公司名称首字母作为logo占位
  const initial = company.name.charAt(0).toUpperCase()
  
  // 生成背景渐变颜色
  const gradients = [
    'from-blue-500 to-blue-600',
    'from-purple-500 to-purple-600',
    'from-green-500 to-green-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600',
  ]
  const gradient = gradients[(company?.name?.length || 0) % gradients.length]

  return (
    <LocalizedLink href={`/companies/${company.slug}`}>
      <div
        className={cn(
          'group rounded-xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-primary-300 hover:shadow-lg',
          className
        )}
      >
        {/* Logo和名称 */}
        <div className="flex items-start gap-4">
          {/* Logo占位 */}
          <div
            className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-xl font-bold text-white shadow-sm`}
          >
            {initial}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-primary group-hover:text-primary-600 transition-colors truncate">
              {company.name}
            </h3>
            <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700 mt-1">
              {company.industry === 'finance' ? '金融' : company.industry === 'web3' ? 'Web3' : '互联网'}
            </span>
          </div>
        </div>

        {/* 公司简介 */}
        <p className="mt-4 text-sm text-gray-600 line-clamp-2">
          {company.description || '暂无简介'}
        </p>

        {/* 底部信息 */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            {company.location || '地点未知'}
          </span>
          <span className="inline-flex items-center text-sm font-medium text-accent">
            {company.jobs?.length || 0} 个职位
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </LocalizedLink>
  )
}
