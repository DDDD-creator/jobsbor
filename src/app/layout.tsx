import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import { AnalyticsTracker } from '@/components/analytics/tracker'
import { ServiceWorkerRegistration } from '@/components/pwa/service-worker-registration'
import { PWAInstallPrompt } from '@/components/pwa/pwa-install-prompt'

const inter = Inter({ subsets: ['latin'] })

// Google Analytics 4 配置
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a0f1c',
}

export const metadata: Metadata = {
  title: 'Jobsbor - 金融/Web3/互联网招聘平台',
  description: '专注于金融、Web3、互联网行业的高端招聘平台',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Jobsbor',
  },
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="dark">
      <head>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body className={`${inter.className} bg-[#0a0f1c] text-white antialiased`}>
        {children}
        <Analytics />
        <AnalyticsTracker />
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
      </body>
    </html>
  )
}
