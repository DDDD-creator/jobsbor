'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb } from '@/components/seo/Breadcrumb'
import { 
  Sparkles, 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Globe, 
  TrendingUp, 
  Shield,
  ArrowRight,
  Send,
  CheckCircle,
  MessageCircle,
  Briefcase
} from 'lucide-react'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { jobs } from '@/data/jobs'
import { companies } from '@/data/companies'

// 统计数据
const stats = [
  { label: '活跃职位', value: jobs.length.toString(), suffix: '+', icon: Briefcase },
  { label: '入驻企业', value: companies.length.toString(), suffix: '+', icon: Users },
  { label: '覆盖行业', value: '3', suffix: '', icon: Globe },
  { label: '日均浏览', value: '50', suffix: 'K+', icon: TrendingUp },
]

// 核心价值
const values = [
  {
    icon: Target,
    title: '精准匹配',
    description: '基于AI算法的智能推荐系统，帮助求职者快速找到最适合的职位，让企业高效触达目标人才。',
    color: 'from-neon-cyan to-neon-blue',
  },
  {
    icon: Shield,
    title: '品质保障',
    description: '严格审核入驻企业和职位信息，确保每一个岗位都真实可靠，保护求职者的权益。',
    color: 'from-neon-purple to-neon-pink',
  },
  {
    icon: Heart,
    title: '用户至上',
    description: '以用户需求为核心，提供个性化的求职服务，从简历优化到面试辅导全程陪伴。',
    color: 'from-neon-pink to-neon-orange',
  },
]

// 服务特色
const features = [
  { title: '金融行业专注', desc: '深耕券商、基金、投行等金融细分领域', icon: TrendingUp },
  { title: 'Web3前沿阵地', desc: '汇聚区块链、DeFi、NFT等新兴领域机会', icon: Globe },
  { title: '大厂内推通道', desc: '直通字节、腾讯、阿里等互联网大厂', icon: Users },
  { title: '薪资透明公开', desc: '所有职位标注明确薪资范围，不玩套路', icon: Shield },
]

// 发展历程
const milestones = [
  { year: '2023', title: '平台创立', desc: 'Jobsbor正式成立，专注金融与科技招聘' },
  { year: '2024', title: '业务扩展', desc: '新增Web3板块，成为行业领先的Web3招聘平台' },
  { year: '2024', title: '用户增长', desc: '月活用户突破12K，成功匹配率超过96%' },
  { year: '2025', title: '持续创新', desc: '推出AI智能匹配系统，服务体验全面升级' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />

      <main className="flex-1 pt-16">
        {/* 面包屑导航 */}
        <div className="bg-dark-500 border-b border-white/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Breadcrumb 
              items={[{ label: '关于我们' }]} 
              className="text-gray-400"
              homeLabel="首页"
            />
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden">
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-dark-500">
            <div className="absolute inset-0 bg-grid" />
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-neon-purple/15 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[120px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="outline" className="mb-6 border-neon-cyan/30 text-neon-cyan">
                <Sparkles className="w-3 h-3 mr-1" />
                关于 Jobsbor
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                连接顶尖人才与
                <span className="text-gradient-neon">未来企业</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                Jobsbor 是专注于金融、Web3和互联网领域的专业招聘平台。
                我们致力于通过技术驱动，为求职者和企业搭建高效、精准的连接桥梁。
              </p>
            </div>
          </div>
        </section>

        {/* 统计数据 */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="glass-card rounded-2xl p-6 text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-neon-cyan" />
                  <div className="text-3xl font-bold text-white">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 我们的使命 */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-glow-purple" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  我们的<span className="text-gradient-cyan-purple">使命</span>
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-6">
                  在快速变化的数字经济时代，人才是企业最宝贵的资产。Jobsbor 的诞生源于一个简单而坚定的信念：
                  <span className="text-neon-cyan">每个人都值得找到理想的工作，每个企业都值得拥有优秀的人才</span>。
                </p>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  我们深耕金融、Web3和互联网三大热门领域，通过AI技术和专业团队的双重加持，
                  为求职者和招聘方提供高效、精准、透明的招聘服务。
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {['高效匹配', '真实职位', '专业服务', '隐私保护'].map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-neon-cyan/10 text-neon-cyan text-sm">
                      <CheckCircle className="h-3.5 w-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="glass-card rounded-3xl p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center">
                      <Eye className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">我们的愿景</div>
                      <div className="text-gray-500 text-sm">Vision</div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    成为中国领先的金融科技招聘平台，让每一个有才华的人都能找到施展才华的舞台，
                    让每一个有梦想的企业都能找到志同道合的伙伴，共同推动数字经济的发展。
                  </p>
                </div>
                
                <div className="glass-card rounded-3xl p-8 mt-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center">
                      <Target className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">我们的目标</div>
                      <div className="text-gray-500 text-sm">Mission</div>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    通过技术创新和服务升级，在2025年底前服务超过1000家企业，
                    帮助10000+求职者成功入职，成为金融和科技领域求职者的首选平台。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 核心价值 */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                我们的<span className="text-gradient-cyan-purple">核心价值</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                这些价值观指引着我们每一个决策，驱动我们不断前行
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {values.map((value) => (
                <div key={value.title} className="glass-card rounded-2xl p-8 hover:border-white/20 transition-all group">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${value.color} mb-6 transition-transform group-hover:scale-110`}>
                    <value.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 服务特色 */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-glow-cyan opacity-50" />
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                为什么选择<span className="text-gradient-purple-pink">Jobsbor</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                专业的服务，优质的体验，让求职和招聘变得更简单
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <div key={feature.title} className="glass-card rounded-2xl p-6 text-center group hover:border-neon-cyan/30 transition-all">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-neon-cyan/10 text-neon-cyan mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 发展历程 */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                发展<span className="text-gradient-cyan-purple">历程</span>
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                每一步都坚定前行，记录我们的成长轨迹
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex gap-6 mb-8 last:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                    {index !== milestones.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gradient-to-b from-neon-cyan to-transparent mt-2" />
                    )}
                  </div>
                  <div className="glass-card rounded-xl p-6 flex-1 -mt-2">
                    <div className="text-neon-cyan font-bold text-lg mb-1">{milestone.year}</div>
                    <h3 className="text-white font-semibold text-lg mb-2">{milestone.title}</h3>
                    <p className="text-gray-400">{milestone.desc}</p>
                  </div>
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
                    加入社区，共同成长
                  </h2>
                  
                  <p className="text-lg text-gray-400 mb-8">
                    关注我们的Telegram频道，获取最新行业动态、职位推荐和求职攻略<br />
                    与志同道合的朋友一起交流成长
                  </p>
                  
                  <a
                    href="https://t.me/Web3Kairo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0088cc] text-white font-semibold hover:bg-[#0099dd] transition-all duration-300 group shadow-[0_0_30px_rgba(0,136,204,0.4)] hover:shadow-[0_0_40px_rgba(0,136,204,0.6)] hover:scale-105"
                  >
                    <MessageCircle className="h-5 w-5" />
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
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                准备好开始了吗？
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                无论你是求职者还是招聘方，Jobsbor 都能为你提供专业的服务
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500 font-semibold rounded-xl hover:shadow-neon-cyan transition-all">
                  <Briefcase className="mr-2 h-5 w-5" />
                  浏览职位
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/10 rounded-xl">
                  <Users className="mr-2 h-5 w-5" />
                  联系我们
                </Button>
              </div>
              
              {/* 底部TG链接 */}
              <div className="mt-6 text-sm text-gray-500">
                有问题？加入 
                <a href="https://t.me/Web3Kairo" target="_blank" rel="noopener noreferrer" className="text-[#0088cc] hover:underline mx-1">
                  Telegram频道
                </a>
                获取帮助
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
