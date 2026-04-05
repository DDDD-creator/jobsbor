'use client'

import { AuthProvider } from '@/components/providers/auth-provider'
import { FavoritesProvider } from '@/hooks/use-favorites'
import { ApplicationsProvider } from '@/hooks/use-applications'
import { NotificationsProvider } from '@/hooks/use-notifications'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ApplicationsProvider>
          <NotificationsProvider>
            {children}
            <Toaster />
          </NotificationsProvider>
        </ApplicationsProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}
