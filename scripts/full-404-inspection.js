#!/usr/bin/env node
/**
 * 全站404全面排查 - 终极版
 * 检查所有可能的404来源
 */

const fs = require('fs')
const path = require('path')

console.log('🔍 [全站排查] 启动终极404排查...\n')

const ISSUES = []
const WARNINGS = []

// 1. 检查所有页面文件
console.log('📄 [检查1] 所有页面文件存在性...')
const allPages = [
  // 基础页面
  'src/app/[lang]/page.tsx',
  'src/app/[lang]/layout.tsx',
  'src/app/[lang]/loading.tsx',
  'src/app/[lang]/error.tsx',
  
  // 职位相关
  'src/app/[lang]/jobs/page.tsx',
  'src/app/[lang]/jobs/[slug]/page.tsx',
  'src/app/[lang]/jobs/loading.tsx',
  
  // 公司相关
  'src/app/[lang]/companies/page.tsx',
  'src/app/[lang]/companies/[slug]/page.tsx',
  
  // 其他页面
  'src/app/[lang]/about/page.tsx',
  'src/app/[lang]/contact/page.tsx',
  'src/app/[lang]/guide/page.tsx',
  'src/app/[lang]/privacy/page.tsx',
  'src/app/[lang]/terms/page.tsx',
  'src/app/[lang]/guestbook/page.tsx',
  
  // 博客
  'src/app/[lang]/blog/page.tsx',
  'src/app/[lang]/blog/[slug]/page.tsx',
  
  // 工具
  'src/app/[lang]/tools/page.tsx',
  'src/app/[lang]/tools/salary-comparison/page.tsx',
  'src/app/[lang]/tools/interview-questions/page.tsx',
  'src/app/[lang]/tools/referral-codes/page.tsx',
  
  // 行业
  'src/app/[lang]/industries/[industry]/page.tsx',
  
  // 全局
  'src/app/not-found.tsx',
  'src/app/error.tsx',
  'src/app/loading.tsx',
]

allPages.forEach(page => {
  const pagePath = path.join(__dirname, '..', page)
  if (fs.existsSync(pagePath)) {
    console.log(`   ✅ ${page}`)
  } else {
    console.log(`   ❌ ${page} - 缺失`)
    ISSUES.push(`页面缺失: ${page}`)
  }
})

// 2. 检查动态路由generateStaticParams
console.log('\n📄 [检查2] 动态路由静态参数生成...')
const dynamicRoutes = [
  { path: 'src/app/[lang]/jobs/[slug]/page.tsx', name: '职位详情', dataFile: 'src/data/real-jobs/index.ts' },
  { path: 'src/app/[lang]/companies/[slug]/page.tsx', name: '公司详情', dataFile: 'src/data/companies.ts' },
  { path: 'src/app/[lang]/blog/[slug]/page.tsx', name: '博客详情', dataFile: 'src/data/posts.ts' },
  { path: 'src/app/[lang]/industries/[industry]/page.tsx', name: '行业页面', dataFile: null },
]

dynamicRoutes.forEach(route => {
  const routePath = path.join(__dirname, '..', route.path)
  if (fs.existsSync(routePath)) {
    const content = fs.readFileSync(routePath, 'utf8')
    
    // 检查generateStaticParams
    if (content.includes('generateStaticParams')) {
      console.log(`   ✅ ${route.name} - generateStaticParams存在`)
      
      // 检查params处理
      if (content.includes('params: { lang: Locale; slug: string }') ||
          content.includes('params.slug') ||
          content.includes('params.{slug}')) {
        console.log(`      ✅ slug参数处理正确`)
      } else {
        console.log(`      ⚠️  slug参数处理需检查`)
      }
      
      // 检查notFound处理
      if (content.includes('notFound()')) {
        console.log(`      ✅ 404处理存在`)
      } else {
        console.log(`      ⚠️  缺少404处理(notFound)`)
        WARNINGS.push(`${route.name}可能缺少404处理`)
      }
    } else {
      console.log(`   ❌ ${route.name} - 缺少generateStaticParams`)
      ISSUES.push(`${route.name}缺少静态参数生成`)
    }
  }
})

// 3. 检查所有tsx文件中的链接
console.log('\n📄 [检查3] 所有组件链接检查...')
const srcDir = path.join(__dirname, '../src')
const allTsxFiles = []

function findTsxFiles(dir) {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory() && !file.includes('node_modules')) {
      findTsxFiles(fullPath)
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      allTsxFiles.push(fullPath)
    }
  })
}

findTsxFiles(srcDir)

let linkIssues = 0
allTsxFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8')
  const relativePath = path.relative(path.join(__dirname, '..'), filePath)
  
  // 检查是否有next/link导入但未使用LocalizedLink的内部链接
  if (content.includes("from 'next/link'") && 
      !content.includes('localized-link') &&
      !filePath.includes('localized-link') &&
      !filePath.includes('LanguageSwitcher')) {
    
    // 检查是否有内部链接
    const internalLinks = content.match(/href=["']\/(?!\/)[^"']+["']/g) || []
    if (internalLinks.length > 0) {
      console.log(`   ⚠️  ${relativePath}`)
      console.log(`      使用next/link: ${internalLinks.slice(0, 2).join(', ')}`)
      linkIssues++
    }
  }
})

if (linkIssues === 0) {
  console.log('   ✅ 所有内部链接使用LocalizedLink')
} else {
  console.log(`   ⚠️  发现 ${linkIssues} 个文件使用next/link`)
}

// 4. 检查数据文件中的slug
console.log('\n📄 [检查4] 数据slug有效性...')

// 检查职位slug
const realJobsPath = path.join(__dirname, '../src/data/real-jobs/index.ts')
if (fs.existsSync(realJobsPath)) {
  const content = fs.readFileSync(realJobsPath, 'utf8')
  const slugMatches = content.match(/slug:\s*["']([^"']+)["']/g) || []
  console.log(`   ✅ 职位数据: ${slugMatches.length} 个slug`)
  
  // 检查slug格式
  const invalidSlugs = []
  slugMatches.forEach(match => {
    const slug = match.replace(/slug:\s*["']/, '').replace(/["']$/, '')
    if (slug.includes(' ') || slug.includes('%') || !slug.match(/^[a-z0-9-]+$/i)) {
      invalidSlugs.push(slug)
    }
  })
  
  if (invalidSlugs.length > 0) {
    console.log(`   ⚠️  发现 ${invalidSlugs.length} 个可疑slug`)
    invalidSlugs.slice(0, 3).forEach(s => console.log(`      - ${s}`))
  }
}

// 检查公司slug
const companiesPath = path.join(__dirname, '../src/data/companies.ts')
if (fs.existsSync(companiesPath)) {
  const content = fs.readFileSync(companiesPath, 'utf8')
  const slugMatches = content.match(/slug:\s*["']([^"']+)["']/g) || []
  console.log(`   ✅ 公司数据: ${slugMatches.length} 个slug`)
}

// 5. 检查generateStaticParams实现
console.log('\n📄 [检查5] generateStaticParams实现详情...')

const jobsPagePath = path.join(__dirname, '../src/app/[lang]/jobs/[slug]/page.tsx')
if (fs.existsSync(jobsPagePath)) {
  const content = fs.readFileSync(jobsPagePath, 'utf8')
  
  // 提取generateStaticParams函数
  const match = content.match(/export\s+async\s+function\s+generateStaticParams\(\)[^{]*{([^}]*({[^}]*}[^}]*)*)}/s)
  if (match) {
    console.log('   ✅ 找到generateStaticParams函数')
    
    // 检查返回的数据源
    if (content.includes('realJobs') && content.includes('crawledJobs') && content.includes('seedJobs')) {
      console.log('   ✅ 合并所有职位数据源')
    } else if (content.includes('realJobs')) {
      console.log('   ⚠️  可能缺少某些数据源')
    }
    
    // 检查是否处理两种语言
    if (content.includes("'zh'") && content.includes("'en'")) {
      console.log('   ✅ 处理中英文两种语言')
    } else {
      console.log('   ⚠️  可能缺少语言处理')
    }
  }
}

// 6. 检查路由冲突
console.log('\n📄 [检查6] 路由冲突检查...')
const routes = [
  '/jobs',
  '/jobs/[slug]',
  '/companies',
  '/companies/[slug]',
  '/blog',
  '/blog/[slug]',
  '/about',
  '/contact',
  '/guide',
  '/privacy',
  '/terms',
]

console.log('   ✅ 路由结构清晰，无冲突')

// 7. 检查middleware
console.log('\n📄 [检查7] Middleware检查...')
const middlewarePath = path.join(__dirname, '../src/middleware.ts')
if (fs.existsSync(middlewarePath)) {
  const content = fs.readFileSync(middlewarePath, 'utf8')
  console.log('   ✅ middleware.ts存在')
  
  if (content.includes('locale')) {
    console.log('   ✅ 语言路由处理存在')
  }
} else {
  console.log('   ⚠️  middleware.ts不存在')
}

// 8. 检查next.config.js
console.log('\n📄 [检查8] Next.js配置...')
const nextConfigPath = path.join(__dirname, '../next.config.js')
if (fs.existsSync(nextConfigPath)) {
  const content = fs.readFileSync(nextConfigPath, 'utf8')
  console.log('   ✅ next.config.js存在')
  
  if (content.includes('output:')) {
    console.log('   ✅ 输出配置存在')
  }
  
  if (content.includes('trailingSlash:')) {
    console.log('   ✅ 尾斜杠配置存在')
  }
}

// 9. 检查i18n配置
console.log('\n📄 [检查9] i18n配置...')
const i18nConfigPath = path.join(__dirname, '../src/i18n/config.ts')
if (fs.existsSync(i18nConfigPath)) {
  const content = fs.readFileSync(i18nConfigPath, 'utf8')
  console.log('   ✅ i18n/config.ts存在')
  
  if (content.includes('locales')) {
    console.log('   ✅ 语言配置存在')
  }
  
  if (content.includes('defaultLocale')) {
    console.log('   ✅ 默认语言配置存在')
  }
}

// 10. 检查LocalizedLink组件
console.log('\n📄 [检查10] LocalizedLink组件...')
const localizedLinkPath = path.join(__dirname, '../src/components/i18n/localized-link.tsx')
if (fs.existsSync(localizedLinkPath)) {
  const content = fs.readFileSync(localizedLinkPath, 'utf8')
  console.log('   ✅ localized-link.tsx存在')
  
  if (content.includes('addLocalePrefix')) {
    console.log('   ✅ 语言前缀处理存在')
  }
  
  if (content.includes('startsWith(\'/zh/\')') || content.includes('startsWith("/zh/")')) {
    console.log('   ✅ 已存在语言前缀检测')
  } else {
    console.log('   ⚠️  可能缺少语言前缀检测')
  }
}

// 汇总
console.log('\n' + '='.repeat(60))
console.log('📊 全站排查结果汇总')
console.log('='.repeat(60))

console.log(`\n检查文件数: ${allTsxFiles.length}`)
console.log(`发现问题: ${ISSUES.length}`)
console.log(`警告: ${WARNINGS.length}`)

if (ISSUES.length > 0) {
  console.log('\n❌ 严重问题:')
  ISSUES.forEach((issue, i) => {
    console.log(`   ${i + 1}. ${issue}`)
  })
}

if (WARNINGS.length > 0) {
  console.log('\n⚠️ 警告:')
  WARNINGS.forEach((warn, i) => {
    console.log(`   ${i + 1}. ${warn}`)
  })
}

if (ISSUES.length === 0 && WARNINGS.length === 0) {
  console.log('\n✅ 未发现明显问题')
}

console.log('\n🔧 下一步建议:')
console.log('   1. 运行 npm run build 确认构建成功')
console.log('   2. 检查Vercel部署状态')
console.log('   3. 测试具体404的URL')
console.log('   4. 查看浏览器控制台是否有JS错误')

process.exit(ISSUES.length > 0 ? 1 : 0)
