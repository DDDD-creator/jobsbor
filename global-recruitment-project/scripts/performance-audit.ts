/**
 * 性能自动化检查脚本
 * 检查网站性能问题
 */

import { readdirSync, readFileSync, statSync, existsSync } from 'fs'
import { join } from 'path'

interface PerformanceResult {
  metric: string
  value: string
  status: 'good' | 'warning' | 'error'
  recommendation?: string
}

class PerformanceAuditor {
  private results: PerformanceResult[] = []
  private srcPath = join(process.cwd(), 'src')
  private totalSize = 0
  private fileCount = 0
  
  run(): { results: PerformanceResult[]; score: number } {
    console.log('🚀 开始性能审计...\n')
    
    this.checkBundleSize()
    this.checkImageOptimization()
    this.checkCodeSplitting()
    this.checkLazyLoading()
    this.checkUnusedDependencies()
    this.checkFontOptimization()
    
    const score = this.calculateScore()
    this.printResults(score)
    
    return { results: this.results, score }
  }
  
  private checkBundleSize(): void {
    // 检查源码总大小
    this.calculateDirectorySize(this.srcPath)
    
    const sizeInMB = (this.totalSize / 1024 / 1024).toFixed(2)
    const status = this.totalSize < 10 * 1024 * 1024 ? 'good' : 
                   this.totalSize < 20 * 1024 * 1024 ? 'warning' : 'error'
    
    this.results.push({
      metric: '源码总大小',
      value: `${sizeInMB} MB (${this.fileCount} 文件)`,
      status,
      recommendation: status !== 'good' ? '建议优化代码体积' : undefined,
    })
  }
  
  private checkImageOptimization(): void {
    const publicDir = join(process.cwd(), 'public')
    if (!existsSync(publicDir)) {
      this.results.push({
        metric: '图片优化',
        value: '未找到 public 目录',
        status: 'warning',
      })
      return
    }
    
    const imagesDir = join(publicDir, 'images')
    const hasImages = existsSync(imagesDir)
    
    this.results.push({
      metric: '图片目录',
      value: hasImages ? '已配置' : '未配置',
      status: hasImages ? 'good' : 'warning',
      recommendation: !hasImages ? '建议创建 public/images 目录' : undefined,
    })
  }
  
  private checkCodeSplitting(): void {
    const appDir = join(this.srcPath, 'app')
    if (!existsSync(appDir)) return
    
    // 检查是否有动态导入
    const hasDynamicImports = this.checkDirectoryForDynamicImports(appDir)
    
    this.results.push({
      metric: '代码分割',
      value: hasDynamicImports ? '已使用动态导入' : '未使用动态导入',
      status: hasDynamicImports ? 'good' : 'warning',
      recommendation: !hasDynamicImports ? '建议使用 dynamic import 优化首屏加载' : undefined,
    })
  }
  
  private checkLazyLoading(): void {
    // 检查是否有懒加载组件
    const componentsDir = join(this.srcPath, 'components')
    if (!existsSync(componentsDir)) return
    
    const hasLazyLoading = existsSync(join(componentsDir, 'ui', 'lazy-image.tsx'))
    
    this.results.push({
      metric: '懒加载组件',
      value: hasLazyLoading ? '已配置' : '未配置',
      status: hasLazyLoading ? 'good' : 'warning',
    })
  }
  
  private checkUnusedDependencies(): void {
    const packageJsonPath = join(process.cwd(), 'package.json')
    if (!existsSync(packageJsonPath)) return
    
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
    const deps = Object.keys(packageJson.dependencies || {})
    const devDeps = Object.keys(packageJson.devDependencies || {})
    
    this.results.push({
      metric: '依赖数量',
      value: `${deps.length} 生产依赖, ${devDeps.length} 开发依赖`,
      status: deps.length < 30 ? 'good' : 'warning',
      recommendation: deps.length > 30 ? '建议检查是否有未使用的依赖' : undefined,
    })
  }
  
  private checkFontOptimization(): void {
    const layoutFile = join(this.srcPath, 'app', 'layout.tsx')
    if (!existsSync(layoutFile)) return
    
    const content = readFileSync(layoutFile, 'utf-8')
    const hasFontOptimization = content.includes('next/font')
    
    this.results.push({
      metric: '字体优化',
      value: hasFontOptimization ? '已使用 next/font' : '未优化',
      status: hasFontOptimization ? 'good' : 'warning',
      recommendation: !hasFontOptimization ? '建议使用 next/font 优化字体加载' : undefined,
    })
  }
  
  private calculateDirectorySize(dir: string): void {
    try {
      const items = readdirSync(dir, { withFileTypes: true })
      
      for (const item of items) {
        const fullPath = join(dir, item.name)
        
        if (item.isDirectory() && item.name !== 'node_modules') {
          this.calculateDirectorySize(fullPath)
        } else if (item.isFile()) {
          const stats = statSync(fullPath)
          this.totalSize += stats.size
          this.fileCount++
        }
      }
    } catch {}
  }
  
  private checkDirectoryForDynamicImports(dir: string): boolean {
    try {
      const items = readdirSync(dir, { withFileTypes: true })
      
      for (const item of items) {
        const fullPath = join(dir, item.name)
        
        if (item.isDirectory()) {
          if (this.checkDirectoryForDynamicImports(fullPath)) return true
        } else if (item.isFile() && (item.name.endsWith('.tsx') || item.name.endsWith('.ts'))) {
          const content = readFileSync(fullPath, 'utf-8')
          if (content.includes('dynamic(') || content.includes('next/dynamic')) {
            return true
          }
        }
      }
    } catch {}
    
    return false
  }
  
  private calculateScore(): number {
    const weights = { good: 1, warning: 0.5, error: 0 }
    const total = this.results.reduce((sum, r) => sum + weights[r.status], 0)
    return Math.round((total / this.results.length) * 100)
  }
  
  private printResults(score: number): void {
    console.log('\n📊 性能审计结果:\n')
    
    for (const result of this.results) {
      const icon = result.status === 'good' ? '✅' : 
                   result.status === 'warning' ? '⚠️' : '❌'
      console.log(`${icon} ${result.metric}: ${result.value}`)
      if (result.recommendation) {
        console.log(`   💡 ${result.recommendation}`)
      }
    }
    
    console.log('\n' + '='.repeat(50))
    console.log(`🎯 性能评分: ${score}/100`)
    
    if (score >= 90) {
      console.log('🌟 优秀! 网站性能很好')
    } else if (score >= 70) {
      console.log('👍 良好，可以继续优化')
    } else {
      console.log('⚠️ 需要立即进行性能优化')
    }
  }
}

// 运行审计
const auditor = new PerformanceAuditor()
auditor.run()
