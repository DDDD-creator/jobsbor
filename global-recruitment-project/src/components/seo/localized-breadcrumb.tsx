import { Breadcrumb as BaseBreadcrumb, BreadcrumbProps, BreadcrumbItem } from './Breadcrumb'
import { getLocale } from '@/i18n/server'

interface LocalizedBreadcrumbProps extends Omit<BreadcrumbProps, 'homeLabel'> {
  items: BreadcrumbItem[]
}

/**
 * 本地化面包屑导航组件 (Server Component)
 * 根据当前语言自动显示"首页"或"Home"
 */
export async function LocalizedBreadcrumb({ 
  items, 
  showHome = true,
  ...props 
}: LocalizedBreadcrumbProps) {
  const locale = await getLocale()
  const homeLabel = locale === 'zh' ? '首页' : 'Home'

  return (
    <BaseBreadcrumb 
      items={items} 
      showHome={showHome}
      homeLabel={homeLabel}
      {...props} 
    />
  )
}

export { type BreadcrumbItem }
