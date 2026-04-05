'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Sparkles, 
  FileText, 
  Search, 
  MessageSquare, 
  Award,
  ArrowRight,
  Send,
  CheckCircle,
  Lightbulb,
  Target,
  BookOpen,
  Users,
  Briefcase,
  TrendingUp,
  Globe,
  Wallet
} from 'lucide-react'
import { LocalizedLink } from '@/components/i18n/localized-link'

// 求职步骤
const jobSearchSteps = [
  {
    step: 1,
    title: '明确求职目标',
    description: '确定你想要的行业、职位类型、薪资期望和工作地点。做好自我评估，了解自己的优势和不足。',
    tips: ['列出你的核心技能', '研究目标行业趋势', '设定合理的薪资期望'],
    icon: Target,
    color: 'from-neon-cyan to-neon-blue',
  },
  {
    step: 2,
    title: '优化简历',
    description: '一份优秀的简历是成功求职的第一步。突出你的核心竞争力和相关经验，让HR一眼看到你的价值。',
    tips: ['使用STAR法则描述经历', '量化你的成就', '针对不同职位调整简历'],
    icon: FileText,
    color: 'from-neon-blue to-neon-purple',
  },
  {
    step: 3,
    title: '高效投递',
    description: '利用Jobsbor平台的筛选功能，精准定位目标职位。不要盲目海投，有针对性地投递简历。',
    tips: ['每天投递3-5个精准职位', '关注职位发布时间', '利用内推渠道'],
    icon: Search,
    color: 'from-neon-purple to-neon-pink',
  },
  {
    step: 4,
    title: '面试准备',
    description: '深入了解目标公司和职位要求，准备常见的面试问题。技术岗位还需要准备算法和系统设计。',
    tips: ['研究公司背景和业务', '准备项目介绍', '模拟面试练习'],
    icon: MessageSquare,
    color: 'from-neon-pink to-neon-orange',
  },
  {
    step: 5,
    title: '薪资谈判',
    description: '收到Offer后，合理评估并进行薪资谈判。了解市场行情，提出合理的期望。',
    tips: ['了解行业薪资水平', '准备谈判话术', '考虑整体福利待遇'],
    icon: Award,
    color: 'from-neon-orange to-neon-cyan',
  },
]

// 行业求职攻略
const industryGuides = [
  {
    title: '金融行业求职指南',
    icon: TrendingUp,
    description: '券商、基金、投行等金融机构求职攻略',
    topics: [
      '金融从业资格证书准备',
      '投行/行研面试技巧',
      '量化岗位技能要求',
      '实习转正路径',
    ],
    color: 'cyan',
  },
  {
    title: 'Web3行业求职指南',
    icon: Globe,
    description: '区块链、DeFi、NFT等Web3领域求职攻略',
    topics: [
      '智能合约开发入门',
      'Web3产品经理技能树',
      'DeFi协议分析能力',
      'DAO治理参与经验',
    ],
    color: 'purple',
  },
  {
    title: '互联网行业求职指南',
    icon: Briefcase,
    description: '互联网大厂求职攻略',
    topics: [
      '算法面试准备',
      '系统设计能力',
      '项目经历包装',
      '大厂面试流程',
    ],
    color: 'pink',
  },
]

// 简历优化建议
const resumeTips = [
  {
    title: '简历结构',
    content: '采用清晰的结构：个人信息 → 求职意向 → 工作经历 → 项目经验 → 教育背景 → 技能证书',
    do: '使用倒序排列，最近的经历放在最前面',
    dont: '不要包含无关的个人信息，如婚姻状况、宗教信仰等',
  },
  {
    title: 'STAR法则',
    content: '描述经历时使用STAR法则：Situation（背景）→ Task（任务）→ Action（行动）→ Result（结果）',
    do: '量化你的成果，如"提升转化率30%"',
    dont: '避免使用模糊的描述，如"负责相关工作"',
  },
  {
    title: '关键词优化',
    content: '在简历中适当使用目标职位的关键词，提高通过ATS系统的概率',
    do: '研究JD中的关键词，如Python、React、量化分析等',
    dont: '不要堆砌关键词，保持自然流畅',
  },
  {
    title: '项目经验',
    content: '项目经验是技术岗位的核心，要详细描述你的贡献和技术选型',
    do: '说明你在项目中的具体角色和贡献度',
    dont: '不要只罗列技术栈，要有业务价值的说明',
  },
]

// 面试常见问题
const interviewQuestions = [
  {
    category: '行为面试题',
    questions: [
      '请介绍一下你自己',
      '你为什么离开上一家公司？',
      '你最大的优点和缺点是什么？',
      '描述一次你解决困难的经历',
    ],
  },
  {
    category: '技术面试题',
    questions: [
      '你做过最有挑战性的项目是什么？',
      '如何优化一个慢查询？',
      '谈谈你对微服务的理解',
      '如何设计一个高并发系统？',
    ],
  },
  {
    category: '行业认知题',
    questions: [
      '你对我们公司/产品了解多少？',
      '如何看待当前行业发展趋势？',
      '你为什么选择这个行业？',
      '你的职业规划是什么？',
    ],
  },
]

// 工具推荐
const tools = [
  { name: '简历模板', desc: '专业的简历模板', icon: FileText },
  { name: '面试题库', desc: '各行业面试真题', icon: BookOpen },
  { name: '薪资查询', desc: '了解市场行情', icon: Wallet },
  { name: '人脉拓展', desc: '连接行业人士', icon: Users },
]

export default function GuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-dark-500">
            <div className="absolute inset-0 bg-grid" />
            <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-neon-purple/15 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-6 border-neon-cyan/30 text-neon-cyan">
                <BookOpen className="w-3 h-3 mr-1" />
                求职指南
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                从求职到入职的
                <span className="text-gradient-neon">完整攻略</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                无论你是应届生还是职场老手，这里都有你需要的求职技巧和行业洞察。
                跟着我们的指南，让你的求职之路更加顺畅。
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="https://t.me/Web3Kairo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/50 text-[#00a8e6] hover:bg-[#0088cc]/30 transition-all"
                >
                  <Send className="h-4 w-4" />
                  加入求职交流群
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 求职五步法 */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-glow-purple" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                求职<span className="text-gradient-cyan-purple">五步法</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                从目标设定到成功入职，系统化的求职方法论
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {jobSearchSteps.map((item, index) => (
                <div key={item.step} className="relative mb-8 last:mb-0">
                  <div className="glass-card rounded-2xl p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* 步骤图标 */}
                      <div className="flex-shrink-0">
                        <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg`}>
                          <item.icon className="h-8 w-8 text-white" />
                        </div>
                        <div className="mt-4 text-center">
                          <span className="text-3xl font-bold text-gradient-neon">0{item.step}</span>
                        </div>
                      </div>

                      {/* 内容 */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                        <p className="text-gray-400 mb-4 leading-relaxed">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {item.tips.map((tip) => (
                            <span key={tip} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-cyan/10 text-neon-cyan text-sm">
                              <Lightbulb className="h-3 w-3" />
                              {tip}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 连接线 */}
                  {index !== jobSearchSteps.length - 1 && (
                    <div className="hidden sm:block absolute left-8 top-full h-8 w-0.5 bg-gradient-to-b from-neon-cyan to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 行业求职指南 */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                行业<span className="text-gradient-cyan-purple">求职指南</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                针对不同行业的专业求职建议
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {industryGuides.map((guide) => (
                <div key={guide.title} className="glass-card rounded-2xl p-6 hover:border-white/20 transition-all group">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neon-${guide.color}/10 text-neon-${guide.color} mb-4 group-hover:scale-110 transition-transform`}>
                    <guide.icon className="h-6 w-6" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-white mb-2">{guide.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{guide.description}</p>
                  
                  <ul className="space-y-2">
                    {guide.topics.map((topic) => (
                      <li key={topic} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className={`h-4 w-4 text-neon-${guide.color} flex-shrink-0`} />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 简历优化建议 */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-glow-cyan opacity-50" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                简历<span className="text-gradient-purple-pink">优化秘籍</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                一份好简历是求职成功的敲门砖
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {resumeTips.map((tip) => (
                <div key={tip.title} className="glass-card rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="h-5 w-5 text-neon-cyan" />
                    <h3 className="text-lg font-semibold text-white">{tip.title}</h3>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{tip.content}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-neon-cyan text-xs font-medium px-2 py-0.5 rounded bg-neon-cyan/10">✓ 建议</span>
                      <span className="text-gray-300 text-sm">{tip.do}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-400 text-xs font-medium px-2 py-0.5 rounded bg-red-400/10">✗ 避免</span>
                      <span className="text-gray-300 text-sm">{tip.dont}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 面试常见问题 */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                面试<span className="text-gradient-cyan-purple">常见问题</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                提前准备，从容应对各类面试问题
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {interviewQuestions.map((category) => (
                <div key={category.category} className="glass-card rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-neon-cyan" />
                    {category.category}
                  </h3>
                  
                  <ul className="space-y-3">
                    {category.questions.map((question, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-neon-purple font-medium">{idx + 1}.</span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 工具推荐 */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-glow-purple" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                求职<span className="text-gradient-cyan-purple">工具箱</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                这些工具会让你的求职更加高效
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <div key={tool.name} className="glass-card rounded-2xl p-6 text-center hover:border-neon-cyan/30 transition-all group cursor-pointer">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neon-cyan/10 text-neon-cyan mb-3 group-hover:scale-110 transition-transform">
                    <tool.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-white font-medium mb-1">{tool.name}</h3>
                  <p className="text-gray-500 text-sm">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Telegram CTA */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#0088cc]/10 to-neon-purple/10 border border-[#0088cc]/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#0088cc]/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/20 rounded-full blur-[100px]" />
              
              <div className="relative px-6 py-16 sm:px-12 sm:py-20">
                <div className="mx-auto max-w-3xl text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#0088cc]/20 mb-6">
                    <Send className="h-8 w-8 text-[#0088cc]" />
                  </div>
                  
                  <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
                    获取更多求职干货
                  </h2>
                  
                  <p className="text-lg text-gray-400 mb-8">
                    加入我们的Telegram频道，获取独家求职资料、内推信息和行业资讯<br />
                    与其他求职者交流经验，共同进步
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {['每日职位推荐', '面试经验分享', '简历修改建议', '行业动态解读'].map((benefit) => (
                      <div key={benefit} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="h-4 w-4 text-neon-cyan" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                  
                  <a
                    href="https://t.me/Web3Kairo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0088cc] text-white font-semibold hover:bg-[#0099dd] transition-all duration-300 group shadow-[0_0_30px_rgba(0,136,204,0.4)] hover:shadow-[0_0_40px_rgba(0,136,204,0.6)] hover:scale-105"
                  >
                    <Send className="h-5 w-5" />
                    <span>加入 @Web3Kairo</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass-card rounded-3xl p-8 sm:p-12 text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                准备好开始求职了吗？
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                理论要结合实践，浏览Jobsbor上的优质职位，开始你的求职之旅
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <LocalizedLink href="/jobs">
                  <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500 font-semibold rounded-xl hover:shadow-neon-cyan transition-all">
                    <Search className="mr-2 h-5 w-5" />
                    浏览职位
                  </Button>
                </LocalizedLink>
                <a href="https://t.me/Web3Kairo" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/10 rounded-xl">
                    <Send className="mr-2 h-5 w-5" />
                    加入交流群
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
