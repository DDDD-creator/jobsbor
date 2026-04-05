#!/usr/bin/env node
/**
 * 404跳转点全面排查
 * 检查所有可能的跳转404问题
 */

const fs = require('fs')
const path = require('path')

console.log('🕵️ [404排查] 全面检查所有跳转点...\n')

const ISSUES = []

// 1. 检查职位详情页的所有链接
console.log('📄 [检查1] 职位详情页链接...')
const jobDetailContent = fs.readFileSync(
  path.join(__dirname, '../src/app/[lang]/jobs/[slug]/page.tsx'),
  'utf8'
)

// 检查返回链接
if (jobDetailContent.includes('href="/jobs"')) {
  console.log('   ✅ 返回职位列表链接: /jobs')
} else {
  console.log('   ❌ 返回职位列表链接异常')
  ISSUES.push('职位详情页返回链接可能有问题')
}

// 检查公司链接
if (jobDetailContent.includes('href={`/companies/${job.company?.slug}`}')) {
  console.log('   ✅ 公司详情链接: /companies/{slug}')
} else {
  console.log('   ❌ 公司详情链接异常')
  ISSUES.push('职位详情页公司链接可能有问题')
}

// 检查标签搜索链接
if (jobDetailContent.includes('/jobs?keyword=')) {
  console.log('   ✅ 标签搜索链接: /jobs?keyword={tag}')
} else {
  console.log('   ❌ 标签搜索链接异常')
  ISSUES.push('职位详情页标签搜索链接可能有问题')
}

// 2. 检查职位列表页
console.log('\n📄 [检查2] 职位列表页搜索处理...')
const jobListContent = fs.readFileSync(
  path.join(__dirname, '../src/app/[lang]/jobs/page.tsx'),
  'utf8'
)

if (jobListContent.includes('useSearchParams()')) {
  console.log('   ✅ 使用useSearchParams读取URL参数')
} else {
  console.log('   ❌ 未使用useSearchParams')
  ISSUES.push('职位列表页未使用useSearchParams')
}

if (jobListContent.includes("searchParams.get('keyword')")) {
  console.log('   ✅ 读取keyword参数')
} else {
  console.log('   ❌ 未读取keyword参数')
  ISSUES.push('职位列表页未读取keyword参数')
}

// 3. 检查公司列表页
console.log('\n📄 [检查3] 公司列表页...')
const companyListPath = path.join(__dirname, '../src/app/[lang]/companies/page.tsx')
if (fs.existsSync(companyListPath)) {
  const companyListContent = fs.readFileSync(companyListPath, 'utf8')
  if (companyListContent.includes('href={`/companies/${company.slug}`}')) {
    console.log('   ✅ 公司详情链接格式正确')
  } else if (companyListContent.includes('href={')) {
    console.log('   ⚠️ 公司详情链接使用变量，需手动检查')
  }
}

// 4. 检查公司详情页
console.log('\n📄 [检查4] 公司详情页...')
const companyDetailPath = path.join(__dirname, '../src/app/[lang]/companies/[slug]/page.tsx')
if (fs.existsSync(companyDetailPath)) {
  const companyDetailContent = fs.readFileSync(companyDetailPath, 'utf8')
  
  // 检查职位链接
  if (companyDetailContent.includes('/jobs?company=') || 
      companyDetailContent.includes('/jobs?keyword=')) {
    console.log('   ✅ 公司页职位链接存在')
  }
  
  // 检查返回链接
  if (companyDetailContent.includes('href="/companies"') ||
      companyDetailContent.includes('href="/companies/"')) {
    console.log('   ✅ 公司页返回链接存在')
  }
}

// 5. 检查Header导航
console.log('\n📄 [检查5] Header导航链接...')
const headerContent = fs.readFileSync(
  path.join(__dirname, '../src/components/layout/Header.tsx'),
  'utf8'
)

const navLinks = [
  { name: '首页', pattern: /href\s*=\s*["']\/["']/ },
  { name: '职位', pattern: /href\s*=\s*["']\/?jobs["']/ },
  { name: '公司', pattern: /href\s*=\s*["']\/?companies["']/ },
  { name: '指南', pattern: /href\s*=\s*["']\/?guide["']/ },
  { name: '关于', pattern: /href\s*=\s*["']\/?about["']/ },
]

navLinks.forEach(link => {
  if (link.pattern.test(headerContent)) {
    console.log(`   ✅ ${link.name}导航链接`)
  } else {
    console.log(`   ❌ ${link.name}导航链接异常`)
    ISSUES.push(`Header ${link.name}链接异常`)
  }
})

// 6. 检查Footer链接
console.log('\n📄 [检查6] Footer链接...')
const footerContent = fs.readFileSync(
  path.join(__dirname, '../src/components/layout/Footer.tsx'),
  'utf8'
)

const footerLinks = [
  { name: '关于我们', pattern: /href\s*=\s*["']\/?about["']/ },
  { name: '联系', pattern: /href\s*=\s*["']\/?contact["']/ },
  { name: '隐私', pattern: /href\s*=\s*["']\/?privacy["']/ },
  { name: '条款', pattern: /href\s*=\s*["']\/?terms["']/ },
]

footerLinks.forEach(link => {
  if (link.pattern.test(footerContent)) {
    console.log(`   ✅ ${link.name}链接`)
  } else {
    console.log(`   ⚠️ ${link.name}链接未找到(可能使用变量)`)
  }
})

// 7. 检查JobCard组件
console.log('\n📄 [检查7] JobCard组件...')
const jobCardPath = path.join(__dirname, '../src/components/jobs/JobCard.tsx')
if (fs.existsSync(jobCardPath)) {
  const jobCardContent = fs.readFileSync(jobCardPath, 'utf8')
  if (jobCardContent.includes('href={`/jobs/${job.slug}') ||
      jobCardContent.includes('href={`/${locale}/jobs/${job.slug}')) {
    console.log('   ✅ 职位卡片链接格式正确')
  } else {
    console.log('   ⚠️ 职位卡片链接需检查')
  }
}

// 8. 检查所有页面是否存在
console.log('\n📄 [检查8] 页面文件存在性...')
const pages = [
  'src/app/[lang]/page.tsx',
  'src/app/[lang]/jobs/page.tsx',
  'src/app/[lang]/jobs/[slug]/page.tsx',
  'src/app/[lang]/companies/page.tsx',
  'src/app/[lang]/companies/[slug]/page.tsx',
  'src/app/[lang]/about/page.tsx',
  'src/app/[lang]/contact/page.tsx',
  'src/app/[lang]/guide/page.tsx',
  'src/app/[lang]/blog/page.tsx',
  'src/app/[lang]/blog/[slug]/page.tsx',
  'src/app/[lang]/tools/page.tsx',
  'src/app/[lang]/privacy/page.tsx',
  'src/app/[lang]/terms/page.tsx',
]

pages.forEach(page => {
  const pagePath = path.join(__dirname, '..', page)
  if (fs.existsSync(pagePath)) {
    console.log(`   ✅ ${page}`)
  } else {
    console.log(`   ❌ ${page} - 缺失`)
    ISSUES.push(`页面缺失: ${page}`)
  }
})

// 9. 检查generateStaticParams
console.log('\n📄 [检查9] 静态参数生成...')
const dynamicPages = [
  { path: 'src/app/[lang]/jobs/[slug]/page.tsx', name: '职位详情' },
  { path: 'src/app/[lang]/companies/[slug]/page.tsx', name: '公司详情' },
  { path: 'src/app/[lang]/blog/[slug]/page.tsx', name: '博客详情' },
]

dynamicPages.forEach(page => {
  const pagePath = path.join(__dirname, '..', page.path)
  if (fs.existsSync(pagePath)) {
    const content = fs.readFileSync(pagePath, 'utf8')
    if (content.includes('generateStaticParams')) {
      console.log(`   ✅ ${page.name} - generateStaticParams存在`)
    } else {
      console.log(`   ❌ ${page.name} - 缺少generateStaticParams`)
      ISSUES.push(`${page.name}缺少静态参数生成`)
    }
  }
})

// 10. 检查面包屑导航
console.log('\n📄 [检查10] 面包屑导航...')
const breadcrumbPath = path.join(__dirname, '../src/components/seo/Breadcrumb.tsx')
if (fs.existsSync(breadcrumbPath)) {
  const breadcrumbContent = fs.readFileSync(breadcrumbPath, 'utf8')
  if (breadcrumbContent.includes('LocalizedLink')) {
    console.log('   ✅ 面包屑使用LocalizedLink')
  } else {
    console.log('   ⚠️ 面包屑可能未使用LocalizedLink')
  }
}

// 汇总
console.log('\n' + '='.repeat(60))
console.log('📊 排查结果汇总')
console.log('='.repeat(60))

if (ISSUES.length === 0) {
  console.log('\n✅ 未发现明显404问题')
  console.log('\n可能原因:')
  console.log('   1. Vercel部署尚未完成')
  console.log('   2. 浏览器缓存导致')
  console.log('   3. 特定数据导致的边界情况')
} else {
  console.log(`\n❌ 发现 ${ISSUES.length} 个问题:`)
  ISSUES.forEach((issue, i) => {
    console.log(`   ${i + 1}. ${issue}`)
  })
}

console.log('\n🔧 建议操作:')
console.log('   1. 确认Vercel部署已完成')
console.log('   2. 清除浏览器缓存测试')
console.log('   3. 测试具体404的URL')
console.log('   4. 检查生产环境日志')

process.exit(ISSUES.length > 0 ? 1 : 0)
