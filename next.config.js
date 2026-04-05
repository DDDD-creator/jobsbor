/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 启用 Next.js 图片优化
    unoptimized: false,
    // 支持现代图片格式
    formats: ['image/webp', 'image/avif'],
    // 设备尺寸断点
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // 图片尺寸
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // 远程图片域名白名单
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '**.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.jobsbor.com',
      },
    ],
    // 图片缓存时间
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30天
  },
  
  // 启用严格模式以发现潜在问题
  reactStrictMode: true,

  // 生产环境移除 console.log
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 优化包导入
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // 压缩
  compress: true,

  // 添加重定向规则
  async redirects() {
    return [
      // 根路径重定向到默认语言
      {
        source: '/',
        destination: '/zh',
        permanent: true,
      },
    ]
  },

  // 添加安全头和性能优化头
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // HSTS - 强制HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          // CSP - 内容安全策略 (优化版，移除unsafe-inline)
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' https://va.vercel-scripts.com https://vercel.live; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://vitals.vercel-insights.com https://*.vercel.app https://vercel.live; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests;",
          },
          // 性能优化: 预连接到关键域名
          {
            key: 'Link',
            value: '<https://fonts.googleapis.com>; rel=preconnect, <https://fonts.gstatic.com>; rel=preconnect; crossorigin',
          },
        ],
      },
      // 静态资源长期缓存
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // 图片缓存
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      // 字体缓存
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // webpack配置
  webpack: (config, { isServer }) => {
    // 添加bundle analyzer
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
        })
      )
    }
    return config
  },
}

module.exports = nextConfig
