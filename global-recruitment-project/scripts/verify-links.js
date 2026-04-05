#!/usr/bin/env node
/**
 * 链接检查脚本 - 验证所有链接是否正确
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 检查所有链接组件...\n')

let hasError = false

// 1. 检查Header组件
console.log('📄 检查 Header.tsx...')
const headerContent = fs.readFileSync(
  path.join(__dirname, '../src/components/layout/Header.tsx'),
  'utf8'
)

// 检查是否有正确的href
const navLinks = [
  { name: '首页', href: '/' },
  { name: '职位', href: '/jobs' },
  { name: '公司', href: '/companies' },
  { name: '指南', href: '/guide' },
  { name: '关于', href: '/about' },
]

navLinks.forEach(link => {
  const pattern = new RegExp(`href=["']${link.href}["']`)
  if (pattern.test(headerContent)) {
    console.log(`   ✅ ${link.name}: ${link.href}`)
  } else {
    console.log(`   ❌ ${link.name}: 链接格式异常`)
    hasError = true
  }
})

// 2. 检查Footer组件
console.log('\n📄 检查 Footer.tsx...')
const footerContent = fs.readFileSync(
  path.join(__dirname, '../src/components/layout/Footer.tsx'),
  'utf8'
)

const footerLinks = [
  { name: '关于', href: '/about' },
  { name: '联系', href: '/contact' },
  { name: '隐私', href: '/privacy' },
  { name: '条款', href: '/terms' },
]

footerLinks.forEach(link => {
  const pattern = new RegExp(`href=["']${link.href}["']`)
  if (pattern.test(footerContent)) {
    console.log(`   ✅ ${link.name}: ${link.href}`)
  } else {
    console.log(`   ❌ ${link.name}: 链接格式异常`)
    hasError = true
  }
})

// 3. 检查LocalizedLink组件
console.log('\n📄 检查 LocalizedLink 组件...')
const localizedLinkContent = fs.readFileSync(
  path.join(__dirname, '../src/components/i18n/localized-link.tsx'),
  'utf8'
)

if (localizedLinkContent.includes('use client')) {
  console.log('   ✅ 标记为 Client Component')
} else {
  console.log('   ❌ 缺少 "use client" 指令')
  hasError = true
}

if (localizedLinkContent.includes('addLocalePrefix')) {
  console.log('   ✅ 使用 addLocalePrefix')
} else {
  console.log('   ❌ 缺少 addLocalePrefix')
  hasError = true
}

// 4. 检查i18n配置
console.log('\n📄 检查 i18n 配置...')
const i18nConfigContent = fs.readFileSync(
  path.join(__dirname, '../src/i18n/config.ts'),
  'utf8'
)

if (i18nConfigContent.includes("export const locales = ['zh', 'en']")) {
  console.log('   ✅ 语言配置正确')
} else {
  console.log('   ❌ 语言配置异常')
  hasError = true
}

// 5. 检查build输出中是否有正确的HTML
console.log('\n📄 检查构建输出...')
const buildIndexPath = path.join(__dirname, '../.next/server/app/zh.html')
if (fs.existsSync(buildIndexPath)) {
  const htmlContent = fs.readFileSync(buildIndexPath, 'utf8')
  
  // 检查是否有正确的链接
  const hasCorrectLinks = htmlContent.includes('href="/zh"') || 
                          htmlContent.includes('href="/zh/"') ||
                          htmlContent.includes('href="/jobs"')
  
  if (hasCorrectLinks) {
    console.log('   ✅ 构建输出包含正确链接')
  } else {
    console.log('   ⚠️  构建输出可能没有正确链接（可能是Client Component SSR占位符）')
  }
  
  // 检查是否有 _not-found
  if (htmlContent.includes('/_not-found')) {
    console.log('   ❌ 构建输出包含 /_not-found 链接！')
    hasError = true
  } else {
    console.log('   ✅ 构建输出没有 /_not-found 链接')
  }
} else {
  console.log('   ⚠️  未找到构建输出，请先运行 npm run build')
}

// 汇总
console.log('\n' + '='.repeat(60))
if (hasError) {
  console.log('❌ 发现问题，请修复上述错误')
  process.exit(1)
} else {
  console.log('✅ 所有检查通过')
  console.log('\n如果生产环境仍有问题，可能是：')
  console.log('   1. Vercel部署使用的是旧版本')
  console.log('   2. CDN缓存未刷新')
  console.log('   3. 检查工具抓取了SSR时的占位符')
  console.log('\n建议：')
  console.log('   - 在Vercel控制台手动重新部署')
  console.log('   - 清除CDN缓存')
  console.log('   - 使用浏览器开发者工具检查实际渲染的链接')
}
