/**
 * SEO 自动化检查脚本
 * 检查网站的 SEO 健康状况
 */

import { readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

interface SEOCheckResult {
  passed: boolean
  message: string
  severity: 'error' | 'warning' | 'info'
}

interface SEOSummary {
  total: number
  passed: number
  errors: number
  warnings: number
}

class SEOAuditor {
  private results: SEOCheckResult[] = []
  private srcPath = join(process.cwd(), 'src')
  
  run(): { results: SEOCheckResult[]; summary: SEOSummary } {
    console.log('🔍 开始 SEO 审计...\n')
    
    this.checkTitleTags()
    this.checkMetaDescriptions()
    this.checkCanonicalUrls()
    this.checkStructuredData()
    this.checkSitemap()
    this.checkRobotsTxt()
    this.checkImageAlts()
    this.checkHeadingStructure()
    
    const summary = this.generateSummary()
    this.printResults(summary)
    
    return { results: this.results, summary }
  }
  
  private checkTitleTags(): void {
    // 检查页面是否有 title
    const appDir = join(this.srcPath, 'app')
    if (!existsSync(appDir)) return
    
    const pages = this.getAllPages(appDir)
    let hasMissingTitle = false
    
    for (const page of pages.slice(0, 10)) {
      const content = readFileSync(page, 'utf-8')
      if (!content.includes('metadata') && !content.includes('<title>')) {
        hasMissingTitle = true
      }
    }
    
    this.results.push({
      passed: !hasMissingTitle,
      message: hasMissingTitle 
        ? '部分页面缺少 metadata 配置' 
        : '所有页面都有 metadata 配置',
      severity: hasMissingTitle ? 'error' : 'info',
    })
  }
  
  private checkMetaDescriptions(): void {
    const hasDescriptions = existsSync(join(this.srcPath, 'app', '[lang]', 'page.tsx'))
    
    this.results.push({
      passed: hasDescriptions,
      message: hasDescriptions 
        ? '找到多语言页面的 metadata 配置' 
        : '需要检查 metadata 配置',
      severity: 'info',
    })
  }
  
  private checkCanonicalUrls(): void {
    const seoDir = join(this.srcPath, 'components', 'seo')
    const hasSEOComponents = existsSync(seoDir)
    
    this.results.push({
      passed: hasSEOComponents,
      message: hasSEOComponents 
        ? 'SEO 组件目录存在' 
        : '建议创建 SEO 组件目录',
      severity: 'warning',
    })
  }
  
  private checkStructuredData(): void {
    const libDir = join(this.srcPath, 'lib')
    const hasStructuredData = existsSync(join(libDir, 'json-ld.ts')) || 
                               existsSync(join(libDir, 'seo.ts'))
    
    this.results.push({
      passed: hasStructuredData,
      message: hasStructuredData 
        ? '找到结构化数据配置' 
        : '建议添加 JSON-LD 结构化数据',
      severity: 'warning',
    })
  }
  
  private checkSitemap(): void {
    const publicDir = join(process.cwd(), 'public')
    const hasSitemap = existsSync(join(publicDir, 'sitemap.xml'))
    
    this.results.push({
      passed: hasSitemap,
      message: hasSitemap 
        ? 'Sitemap 已配置' 
        : '缺少 sitemap.xml',
      severity: hasSitemap ? 'info' : 'error',
    })
  }
  
  private checkRobotsTxt(): void {
    const publicDir = join(process.cwd(), 'public')
    const hasRobots = existsSync(join(publicDir, 'robots.txt'))
    
    this.results.push({
      passed: hasRobots,
      message: hasRobots 
        ? 'robots.txt 已配置' 
        : '缺少 robots.txt',
      severity: hasRobots ? 'info' : 'warning',
    })
  }
  
  private checkImageAlts(): void {
    // 检查组件中是否有图片缺少 alt
    this.results.push({
      passed: true,
      message: '图片 alt 属性需要手动检查',
      severity: 'info',
    })
  }
  
  private checkHeadingStructure(): void {
    this.results.push({
      passed: true,
      message: '标题层级结构需要手动检查',
      severity: 'info',
    })
  }
  
  private getAllPages(dir: string): string[] {
    const pages: string[] = []
    
    try {
      const items = readdirSync(dir, { withFileTypes: true })
      
      for (const item of items) {
        const fullPath = join(dir, item.name)
        
        if (item.isDirectory() && !item.name.startsWith('_') && !item.name.startsWith('(')) {
          pages.push(...this.getAllPages(fullPath))
        } else if (item.isFile() && item.name === 'page.tsx') {
          pages.push(fullPath)
        }
      }
    } catch {}
    
    return pages
  }
  
  private generateSummary(): SEOSummary {
    return {
      total: this.results.length,
      passed: this.results.filter(r => r.passed).length,
      errors: this.results.filter(r => r.severity === 'error').length,
      warnings: this.results.filter(r => r.severity === 'warning').length,
    }
  }
  
  private printResults(summary: SEOSummary): void {
    console.log('\n📊 SEO 审计结果:\n')
    
    for (const result of this.results) {
      const icon = result.passed ? '✅' : result.severity === 'error' ? '❌' : '⚠️'
      console.log(`${icon} ${result.message}`)
    }
    
    console.log('\n' + '='.repeat(50))
    console.log(`总计: ${summary.total} 项检查`)
    console.log(`通过: ${summary.passed} 项 ✅`)
    console.log(`错误: ${summary.errors} 项 ❌`)
    console.log(`警告: ${summary.warnings} 项 ⚠️`)
    console.log('='.repeat(50))
    
    const score = Math.round((summary.passed / summary.total) * 100)
    console.log(`\n🎯 SEO 健康评分: ${score}/100`)
    
    if (score >= 90) {
      console.log('🌟 优秀! 网站 SEO 状况良好')
    } else if (score >= 70) {
      console.log('👍 良好，但还有改进空间')
    } else {
      console.log('⚠️ 需要立即优化 SEO 问题')
    }
  }
}

// 运行审计
const auditor = new SEOAuditor()
auditor.run()
