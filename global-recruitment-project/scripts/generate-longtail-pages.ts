/**
 * 长尾关键词落地页生成器
 * 自动生成 SEO 友好的长尾词页面，覆盖更多搜索流量
 * 
 * 使用: npx tsx scripts/generate-longtail-pages.ts
 */

import fs from 'fs'
import path from 'path'

const BASE_DIR = path.join(process.cwd(), 'src/app/[lang]')

// 长尾词模板库
const longTailTemplates = [
  // 按行业 + 远程
  { category: 'remote-jobs', keywords: ['web3', 'finance', 'internet'], label: '远程工作' },
  // 按薪资范围
  { category: 'high-paying-jobs', keywords: ['over-150k', 'over-200k', 'over-300k'], label: '高薪职位' },
  // 按人群
  { category: 'chinese-friendly-jobs', keywords: ['web3', 'tech', 'quant'], label: '华人友好' },
  // 按技能
  { category: 'skill-based-jobs', keywords: ['react', 'python', 'solidity', 'quantitative'], label: '技能导向' },
]

// 页面元数据模板
function generateMeta(category: string, keyword: string, label: string): { title: string; description: string; h1: string } {
  const titles: Record<string, Record<string, { title: string; desc: string; h1: string }>> = {
    'remote-jobs': {
      'web3': { title: '2026 Web3 远程工作 | 区块链远程职位 - JobsBor', desc: '最新 Web3/区块链行业远程工作机会。Solidity、Rust 工程师，智能合约审计等高薪远程岗位，华人友好。', h1: '🌐 Web3 远程工作机会' },
      'finance': { title: '2026 金融远程工作 | 量化/投行远程职位 - JobsBor', desc: '金融行业远程工作机会。量化研究员、数据分析师、风控工程师等高薪远程岗位。', h1: '💰 金融远程工作机会' },
      'internet': { title: '2026 互联网远程工作 | 科技远程职位 - JobsBor', desc: '互联网/科技行业远程工作机会。前端、后端、全栈工程师等远程岗位，支持全球远程。', h1: '💻 互联网远程工作机会' },
    },
    'high-paying-jobs': {
      'over-150k': { title: '年薪 $150K+ 远程工作 | 高薪远程职位 - JobsBor', desc: '年薪超过 15 万美元的全球远程工作机会。Web3、量化、AI 等高薪行业，华人友好。', h1: '💎 年薪 $150K+ 远程工作' },
      'over-200k': { title: '年薪 $200K+ 远程工作 | 顶级高薪职位 - JobsBor', desc: '年薪超过 20 万美元的顶级远程工作机会。量化交易员、AI 研究员、区块链架构师等。', h1: '🚀 年薪 $200K+ 顶级远程工作' },
      'over-300k': { title: '年薪 $300K+ 远程工作 | 超高薪职位 - JobsBor', desc: '年薪超过 30 万美元的超高薪远程工作。量化基金经理、首席架构师等顶级岗位。', h1: '⭐ 年薪 $300K+ 超高薪远程工作' },
    },
    'chinese-friendly-jobs': {
      'web3': { title: '华人友好 Web3 远程工作 | 中文团队招聘 - JobsBor', desc: '华人友好的 Web3 远程工作机会。中文团队、华人社区、支持中国时区的区块链公司招聘。', h1: '🇨🇳 华人友好 Web3 远程工作' },
      'tech': { title: '华人友好科技远程工作 | 中国程序员招聘 - JobsBor', desc: '华人友好的科技行业远程工作。中国团队出海、华人创办的科技公司招聘。', h1: '🇨🇳 华人友好科技远程工作' },
      'quant': { title: '华人友好量化远程工作 | 金融工程招聘 - JobsBor', desc: '华人友好的量化金融远程工作。量化研究员、金融工程师、数据科学家等高薪岗位。', h1: '🇨🇳 华人友好量化远程工作' },
    },
    'skill-based-jobs': {
      'react': { title: 'React 远程工作 | 前端工程师远程职位 - JobsBor', desc: 'React 前端工程师远程工作机会。React Native、Next.js、TypeScript 等技术栈，全球远程。', h1: '⚛️ React 远程工作机会' },
      'python': { title: 'Python 远程工作 | 后端/AI 远程职位 - JobsBor', desc: 'Python 开发远程工作机会。后端、AI/ML、数据分析、自动化等方向，全球远程。', h1: '🐍 Python 远程工作机会' },
      'solidity': { title: 'Solidity 远程工作 | 智能合约工程师招聘 - JobsBor', desc: 'Solidity 智能合约工程师远程工作。以太坊、DeFi、NFT 等 Web3 领域高薪岗位。', h1: '📝 Solidity 智能合约远程工作' },
      'quantitative': { title: '量化远程工作 | 量化研究员/工程师招聘 - JobsBor', desc: '量化金融远程工作机会。量化研究员、量化工程师、策略开发等高薪岗位，华人友好。', h1: '📊 量化金融远程工作机会' },
    },
  }

  const result = titles[category]?.[keyword]
  if (result) {
    return {
      title: result.title,
      description: result.desc,
      h1: result.h1,
    }
  }

  return {
    title: `${label} - ${keyword} | JobsBor 远程工作`,
    description: `${label} - ${keyword} 相关远程工作机会，华人友好，全球远程。`,
    h1: `${label} - ${keyword}`,
  }
}

// 生成页面内容
function generatePageContent(category: string, keyword: string, label: string): string {
  const meta = generateMeta(category, keyword, label)
  const slug = `${category}/${keyword}`

  return `/**
 * ${meta.h1}
 * 自动生成的长尾关键词落地页
 * Slug: /[lang]/${slug}
 */

import { Metadata } from 'next'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JobList } from '@/components/jobs/JobList'
import { EmailSubscribe } from '@/components/subscribe/email-subscribe'
import { loadTranslations } from '@/i18n/loader'
import type { Locale } from '@/i18n/config'

export async function generateMetadata({ params }: { params: { lang: Locale } }): Promise<Metadata> {
  return {
    title: '${meta.title}',
    description: '${meta.description}',
    openGraph: {
      title: '${meta.title}',
      description: '${meta.description}',
      type: 'website',
    },
  }
}

export default async function LongTailPage({ params }: { params: { lang: Locale } }) {
  const t = await loadTranslations(params.lang)
  
  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      <Header locale={params.lang} translations={t} />
      <main className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">${meta.h1}</h1>
        
        <div className="mb-12 p-6 bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-800/30">
          <p className="text-gray-300 mb-4">
            我们正在为你精选全球最优质的远程工作机会。所有岗位都经过严格筛选，确保：
          </p>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <li className="flex items-center gap-2">✅ <span>真实招聘岗位</span></li>
            <li className="flex items-center gap-2">✅ <span>薪资透明</span></li>
            <li className="flex items-center gap-2">✅ <span>华人友好团队</span></li>
            <li className="flex items-center gap-2">✅ <span>支持全球远程</span></li>
            <li className="flex items-center gap-2">✅ <span>顶级项目经验</span></li>
            <li className="flex items-center gap-2">✅ <span>免费内推服务</span></li>
          </ul>
        </div>

        <JobList locale={params.lang} translations={t} />
        
        <div className="mt-16">
          <EmailSubscribe locale={params.lang} translations={t} />
        </div>
      </main>
      <Footer lang={params.lang} t={t} />
    </div>
  )
}
`
}

// 主函数：生成所有长尾页面
async function main() {
  console.log('🚀 开始生成长尾关键词落地页...')

  for (const template of longTailTemplates) {
    for (const keyword of template.keywords) {
      const pageDir = path.join(BASE_DIR, template.category, keyword)
      fs.mkdirSync(pageDir, { recursive: true })

      const content = generatePageContent(template.category, keyword, template.label)
      const filePath = path.join(pageDir, 'page.tsx')

      if (fs.existsSync(filePath)) {
        console.log(`⚠️  已存在，跳过: ${template.category}/${keyword}`)
        continue
      }

      fs.writeFileSync(filePath, content, 'utf-8')
      console.log(`✅ 已生成: ${template.category}/${keyword}`)
    }
  }

  console.log(`\n🎉 长尾页面生成完成！`)
}

main().catch(console.error)
