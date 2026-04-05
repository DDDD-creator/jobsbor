#!/usr/bin/env node
/**
 * 特种战队深度检查脚本
 * 全面的网站健康检查
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🔥 [特种战队] 启动5小时深度检查...\n')
console.log('=' .repeat(60))

const REPORT = {
  timestamp: new Date().toISOString(),
  checks: {},
  errors: [],
  warnings: [],
  summary: {}
}

// ========== 1. 构建检查 ==========
console.log('\n📦 [检查 1/10] 构建测试...')
try {
  execSync('npm run build 2>&1', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    timeout: 300000
  })
  REPORT.checks.build = '✅ PASS'
  console.log('   ✅ 构建成功')
} catch (error) {
  REPORT.checks.build = '❌ FAIL'
  REPORT.errors.push('构建失败: ' + error.message)
  console.log('   ❌ 构建失败')
}

// ========== 2. TypeScript检查 ==========
console.log('\n🔷 [检查 2/10] TypeScript类型检查...')
try {
  execSync('npx tsc --noEmit 2>&1', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    timeout: 60000
  })
  REPORT.checks.typescript = '✅ PASS'
  console.log('   ✅ 类型检查通过')
} catch (error) {
  REPORT.checks.typescript = '❌ FAIL'
  REPORT.errors.push('TypeScript错误: ' + error.message.substring(0, 200))
  console.log('   ❌ 类型检查失败')
}

// ========== 3. ESLint检查 ==========
console.log('\n📋 [检查 3/10] ESLint代码规范...')
try {
  execSync('npm run lint 2>&1', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    timeout: 60000
  })
  REPORT.checks.eslint = '✅ PASS'
  console.log('   ✅ 代码规范通过')
} catch (error) {
  REPORT.checks.eslint = '⚠️ WARN'
  REPORT.warnings.push('ESLint警告: ' + error.message.substring(0, 200))
  console.log('   ⚠️ 代码规范有警告')
}

// ========== 4. 检查generateStaticParams ==========
console.log('\n📄 [检查 4/10] 静态参数生成...')
const staticParamsFiles = [
  'src/app/[lang]/jobs/[slug]/page.tsx',
  'src/app/[lang]/companies/[slug]/page.tsx',
  'src/app/[lang]/blog/[slug]/page.tsx',
  'src/app/[lang]/industries/[industry]/page.tsx',
]

let staticParamsOk = true
staticParamsFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file)
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8')
    if (content.includes('generateStaticParams')) {
      console.log(`   ✅ ${file}`)
    } else {
      console.log(`   ⚠️  ${file} - 缺少generateStaticParams`)
      REPORT.warnings.push(`${file} 可能缺少静态参数生成`)
      staticParamsOk = false
    }
  } else {
    console.log(`   ❌ ${file} - 文件不存在`)
    staticParamsOk = false
  }
})
REPORT.checks.staticParams = staticParamsOk ? '✅ PASS' : '⚠️ WARN'

// ========== 5. 检查Link使用 ==========
console.log('\n🔗 [检查 5/10] 链接组件检查...')
const linkFiles = execSync(
  "grep -rn \"from 'next/link'\" src/ --include='*.tsx' -l 2>/dev/null || echo ''",
  { cwd: path.join(__dirname, '..'), encoding: 'utf8' }
).trim().split('\n').filter(f => f && !f.includes('localized-link') && !f.includes('LanguageSwitcher'))

if (linkFiles.length === 0) {
  REPORT.checks.links = '✅ PASS'
  console.log('   ✅ 所有链接使用LocalizedLink')
} else {
  REPORT.checks.links = '⚠️ WARN'
  console.log(`   ⚠️  发现 ${linkFiles.length} 个文件使用next/link:`)
  linkFiles.forEach(f => console.log(`      - ${f}`))
}

// ========== 6. 检查环境变量 ==========
console.log('\n🔐 [检查 6/10] 环境变量检查...')
const envFiles = ['.env.local', '.env.production', '.env.monitor']
const envStatus = {}
envFiles.forEach(envFile => {
  const envPath = path.join(__dirname, '..', envFile)
  if (fs.existsSync(envPath)) {
    console.log(`   ✅ ${envFile}`)
    envStatus[envFile] = true
  } else {
    console.log(`   ⚠️  ${envFile} - 不存在`)
    envStatus[envFile] = false
  }
})
REPORT.checks.envFiles = envStatus['.env.local'] ? '✅ PASS' : '⚠️ WARN'

// ========== 7. 检查关键页面 ==========
console.log('\n📑 [检查 7/10] 关键页面存在性...')
const criticalPages = [
  'src/app/[lang]/page.tsx',
  'src/app/[lang]/jobs/page.tsx',
  'src/app/[lang]/jobs/[slug]/page.tsx',
  'src/app/[lang]/companies/page.tsx',
  'src/app/[lang]/about/page.tsx',
  'src/app/[lang]/contact/page.tsx',
  'src/app/[lang]/privacy/page.tsx',
  'src/app/[lang]/terms/page.tsx',
  'src/app/not-found.tsx',
  'src/app/error.tsx',
]

let allPagesExist = true
criticalPages.forEach(page => {
  const pagePath = path.join(__dirname, '..', page)
  if (fs.existsSync(pagePath)) {
    console.log(`   ✅ ${page}`)
  } else {
    console.log(`   ❌ ${page} - 缺失`)
    REPORT.errors.push(`关键页面缺失: ${page}`)
    allPagesExist = false
  }
})
REPORT.checks.criticalPages = allPagesExist ? '✅ PASS' : '❌ FAIL'

// ========== 8. 检查组件 ==========
console.log('\n🧩 [检查 8/10] 关键组件检查...')
const criticalComponents = [
  'src/components/layout/Header.tsx',
  'src/components/layout/Footer.tsx',
  'src/components/i18n/localized-link.tsx',
  'src/components/i18n/LanguageSwitcher.tsx',
  'src/components/ui/card.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/button.tsx',
]

let allComponentsExist = true
criticalComponents.forEach(comp => {
  const compPath = path.join(__dirname, '..', comp)
  if (fs.existsSync(compPath)) {
    console.log(`   ✅ ${comp}`)
  } else {
    console.log(`   ❌ ${comp} - 缺失`)
    REPORT.errors.push(`关键组件缺失: ${comp}`)
    allComponentsExist = false
  }
})
REPORT.checks.components = allComponentsExist ? '✅ PASS' : '❌ FAIL'

// ========== 9. 检查数据文件 ==========
console.log('\n💾 [检查 9/10] 数据文件检查...')
const dataFiles = [
  { path: 'src/data/jobs.ts', isDir: false },
  { path: 'src/data/real-jobs', isDir: true },
  { path: 'src/data/companies.ts', isDir: false },
  { path: 'src/data/crawled-jobs.ts', isDir: false },
]

let allDataExist = true
dataFiles.forEach(({ path: dataFile, isDir }) => {
  const dataPath = path.join(__dirname, '..', dataFile)
  if (fs.existsSync(dataPath)) {
    console.log(`   ✅ ${dataFile}`)
  } else {
    console.log(`   ❌ ${dataFile} - 缺失`)
    REPORT.errors.push(`数据文件缺失: ${dataFile}`)
    allDataExist = false
  }
})
REPORT.checks.dataFiles = allDataExist ? '✅ PASS' : '❌ FAIL'

// ========== 10. 检查配置文件 ==========
console.log('\n⚙️  [检查 10/10] 配置文件检查...')
const configFiles = [
  'next.config.js',
  'tailwind.config.ts',
  'tsconfig.json',
  'package.json',
  'src/i18n/config.ts',
]

let allConfigExist = true
configFiles.forEach(configFile => {
  const configPath = path.join(__dirname, '..', configFile)
  if (fs.existsSync(configPath)) {
    console.log(`   ✅ ${configFile}`)
  } else {
    console.log(`   ❌ ${configFile} - 缺失`)
    REPORT.errors.push(`配置文件缺失: ${configFile}`)
    allConfigExist = false
  }
})
REPORT.checks.configFiles = allConfigExist ? '✅ PASS' : '❌ FAIL'

// ========== 生成报告 ==========
console.log('\n' + '='.repeat(60))
console.log('\n📊 [特种战队] 深度检查报告')
console.log('='.repeat(60))

const passCount = Object.values(REPORT.checks).filter(v => v === '✅ PASS').length
const warnCount = Object.values(REPORT.checks).filter(v => v === '⚠️ WARN').length
const failCount = Object.values(REPORT.checks).filter(v => v === '❌ FAIL').length

console.log(`\n检查项目: 10项`)
console.log(`✅ 通过: ${passCount}`)
console.log(`⚠️  警告: ${warnCount}`)
console.log(`❌ 失败: ${failCount}`)

console.log('\n📋 详细结果:')
Object.entries(REPORT.checks).forEach(([check, result]) => {
  console.log(`   ${result} ${check}`)
})

if (REPORT.errors.length > 0) {
  console.log('\n❌ 错误列表:')
  REPORT.errors.forEach(err => console.log(`   - ${err}`))
}

if (REPORT.warnings.length > 0) {
  console.log('\n⚠️  警告列表:')
  REPORT.warnings.forEach(warn => console.log(`   - ${warn}`))
}

// 保存报告
const reportPath = path.join(__dirname, '..', 'reports', `deep-check-${Date.now()}.json`)
const reportsDir = path.dirname(reportPath)
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true })
}
fs.writeFileSync(reportPath, JSON.stringify(REPORT, null, 2))

console.log(`\n📁 报告已保存: ${reportPath}`)

// 最终评分
const score = Math.round((passCount / 10) * 100)
console.log(`\n🎯 健康评分: ${score}/100`)

if (score >= 90) {
  console.log('   🟢 优秀 - 网站状态良好')
} else if (score >= 70) {
  console.log('   🟡 良好 - 有小问题需要修复')
} else {
  console.log('   🔴 警告 - 需要立即修复')
}

console.log('\n🔥 [特种战队] 检查完成')

process.exit(failCount > 0 ? 1 : 0)
