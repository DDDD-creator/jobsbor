/**
 * Root Page - Static redirect to default locale
 * For static export, redirects to default language
 */

import { redirect } from 'next/navigation'
import { defaultLocale } from '@/i18n/config'

/**
 * Root page - static redirect to default language
 */
export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
