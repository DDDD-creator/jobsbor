#!/usr/bin/env node
/**
 * Jobsbor 自动优化脚本
 * 专家团队自动化工具 - 一键优化网站
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔥 Jobsbor 专家团队自动优化脚本')
console.log('=' .repeat(50))

const steps = [
  {
    name: '代码质量检查',
    run: () => {
      console.log('\n📦 1. 检查 TypeScript 类型...')
      try {
        execSync('npx tsc --noEmit', { stdio: 'inherit' })
        return { success: true, message: '类型检查通过' }
      } catch {
        return { success: false, message: '类型错误需要修复' }
      }
    }
  },
  {
    name: 'SEO 审计',
    run: () => {
      console.log('\n🔍 2. 运行 SEO 审计...')
      try {
        execSync('npm run audit:seo', { stdio: 'inherit' })
        return { success: true, message: 'SEO 审计完成' }
      } catch {
        return { success: false, message: 'SEO 审计发现问题' }
      }
    }
  },
  {
    name: '性能审计',
    run: () => {
      console.log('\n🚀 3. 运行性能审计...')
      try {
        execSync('npm run audit:perf', { stdio: 'inherit' })
        return { success: true, message: '性能审计完成' }
      } catch {
        return { success: false, message: '性能审计发现问题' }
      }
    }
  },
  {
    name: '构建检查',
    run: () => {
      console.log('\n🏗️  4. 构建项目...')
      try {
        execSync('npm run build', { stdio: 'inherit' })
        return { success: true, message: '构建成功' }
      } catch {
        return { success: false, message: '构建失败' }
      }
    }
  },
  {
    name: '组件导出检查',
    run: () => {
      console.log('\n📋 5. 检查组件导出...')
      const components = [
        'src/components/jobs/optimized-job-card.tsx',
        'src/components/jobs/optimized-job-list.tsx',
        'src/components/search/optimized-search.tsx',
        'src/components/ui/lazy-image.tsx',
      ]
      
      const missing = components.filter(c => !fs.existsSync(c))
      
      if (missing.length > 0) {
        return { success: false, message: `缺少组件: ${missing.join(', ')}` }
      }
      
      return { success: true, message: '所有优化组件已创建' }
    }
  },
  {
    name: '更新索引导出',
    run: () => {
      console.log('\n📤 6. 更新组件索引...')
      
      // 更新 jobs/index.ts
      const jobsIndexPath = 'src/components/jobs/index.ts'
      const jobsExports = `
export { OptimizedJobCard, JobCardSkeleton } from './optimized-job-card'
export { OptimizedJobList } from './optimized-job-list'
`
      fs.writeFileSync(jobsIndexPath, jobsExports)
      
      // 更新 search/index.ts
      const searchIndexPath = 'src/components/search/index.ts'
      const searchExports = `
export { OptimizedSearch } from './optimized-search'
`
      if (!fs.existsSync(path.dirname(searchIndexPath))) {
        fs.mkdirSync(path.dirname(searchIndexPath), { recursive: true })
      }
      fs.writeFileSync(searchIndexPath, searchExports)
      
      return { success: true, message: '组件索引已更新' }
    }
  },
]

// 运行所有步骤
const results = []

for (const step of steps) {
  console.log(`\n${'─'.repeat(50)}`)
  console.log(`▶️  ${step.name}`)
  console.log('─'.repeat(50))
  
  const result = step.run()
  results.push({ name: step.name, ...result })
}

// 打印总结
console.log('\n' + '='.repeat(50))
console.log('📊 优化结果总结')
console.log('='.repeat(50))

let successCount = 0
let failCount = 0

for (const result of results) {
  const icon = result.success ? '✅' : '❌'
  console.log(`${icon} ${result.name}: ${result.message}`)
  
  if (result.success) successCount++
  else failCount++
}

console.log('\n' + '='.repeat(50))
console.log(`总计: ${results.length} 项检查`)
console.log(`通过: ${successCount} ✅`)
console.log(`失败: ${failCount} ❌`)
console.log('='.repeat(50))

// 如果全部通过，提示推送代码
if (failCount === 0) {
  console.log('\n🎉 所有优化检查通过！')
  console.log('\n💡 接下来可以执行:')
  console.log('   git add -A')
  console.log('   git commit -m "优化：增强职位卡片和列表组件"')
  console.log('   git push')
} else {
  console.log('\n⚠️  部分检查未通过，请修复后重试')
  process.exit(1)
}
