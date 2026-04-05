#!/usr/bin/env node
/**
 * 链接健康检查器
 * 检查所有内部链接是否为LocalizedLink
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// 排除的文件（这些文件使用next/link是合理的）
const EXCLUDED_FILES = [
  'localized-link.tsx',  // 包装器组件
  'LanguageSwitcher.tsx', // 语言切换组件
]

console.log('🔗 [Link Checker] Checking all internal links...\n')

// 查找所有使用next/link的文件
const files = execSync(
  "grep -rn \"from 'next/link'\" src/ --include='*.tsx' --include='*.ts' -l",
  { cwd: path.join(__dirname, '..'), encoding: 'utf8' }
).trim().split('\n').filter(Boolean)

console.log(`Found ${files.length} files using next/link:\n`)

let issues = []

files.forEach(file => {
  // 检查是否是排除的文件
  if (EXCLUDED_FILES.some(excluded => file.includes(excluded))) {
    console.log(`✅ ${file} - Excluded (intentional use)`)
    return
  }
  
  const filePath = path.join(__dirname, '..', file)
  const content = fs.readFileSync(filePath, 'utf8')
  
  // 检查是否同时使用了next/link和LocalizedLink
  const hasNextLink = content.includes("from 'next/link'")
  const hasLocalizedLink = content.includes("from '@/components/i18n/localized-link'") || 
                           content.includes('from "@/components/i18n/localized-link"')
  
  // 检查是否有未使用LocalizedLink的内部链接
  const linkMatches = content.match(/href=["']\/(?!\/)[^"']+["']/g) || []
  
  if (hasNextLink && !hasLocalizedLink) {
    issues.push({
      file,
      issue: 'Using next/link without LocalizedLink',
      links: linkMatches.slice(0, 5), // 最多显示5个
    })
    console.log(`❌ ${file}`)
    console.log(`   Issue: Using next/link without LocalizedLink`)
    console.log(`   Links: ${linkMatches.slice(0, 3).join(', ')}${linkMatches.length > 3 ? '...' : ''}`)
  } else if (hasNextLink && hasLocalizedLink) {
    console.log(`🟡 ${file} - Has both (check manually)`)
  } else {
    console.log(`✅ ${file} - Using LocalizedLink`)
  }
})

console.log(`\n📊 [Link Checker] Summary:`)
console.log(`   Total files: ${files.length}`)
console.log(`   Issues found: ${issues.length}`)

if (issues.length > 0) {
  console.log(`\n⚠️  Fix these files:`)
  issues.forEach(issue => {
    console.log(`   - ${issue.file}`)
  })
  process.exit(1)
} else {
  console.log(`\n✅ All links look good!`)
}
