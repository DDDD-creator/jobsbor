'use client'

import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  MessageSquare, 
  Send, 
  User, 
  Building2, 
  ArrowRight,
  CheckCircle,
  MessageCircle,
  Sparkles
} from 'lucide-react'
import { LocalizedLink } from '@/components/i18n/localized-link'
import { useState } from 'react'

// 初始留言数据
const initialMessages = [
  {
    id: '1',
    name: '张先生',
    role: '求职者',
    content: '网站设计很赞！希望能增加更多量化金融相关的职位，特别是私募和公募基金的岗位。',
    time: '2小时前',
    reply: '感谢您的建议！我们正在积极拓展金融行业的职位资源，预计下周会新增20+量化相关岗位，敬请关注！',
  },
  {
    id: '2',
    name: '李HR',
    role: '企业HR',
    content: '我们是一家Web3初创公司，想在贵平台发布招聘信息，请问如何合作？',
    time: '5小时前',
    reply: '您好！欢迎联系我们的商务团队，您可以通过页面底部的邮箱或Telegram频道与我们取得联系，我们会尽快为您安排入驻。',
  },
  {
    id: '3',
    name: '王同学',
    role: '应届生',
    content: '求职指南页面很有用！特别是面试技巧部分，希望能多出一些针对校招的内容。',
    time: '1天前',
    reply: '谢谢反馈！我们计划下周发布「2025校招完全攻略」系列文章，涵盖简历制作、笔试准备、群面技巧等内容，敬请期待！',
  },
]

export default function GuestbookPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.role || !formData.content) return
    
    setIsSubmitting(true)
    
    // 模拟短暂延迟后发布
    setTimeout(() => {
      const newMessage = {
        id: Date.now().toString(),
        name: formData.name,
        role: formData.role,
        content: formData.content,
        time: '刚刚',
        reply: '',
      }
      
      // 立即添加到列表顶部
      setMessages([newMessage, ...messages])
      
      // 重置表单
      setFormData({ name: '', role: '', content: '' })
      setIsSubmitting(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header />

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-dark-500">
            <div className="absolute inset-0 bg-grid" />
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-neon-purple/15 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-neon-cyan/10 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-6 border-neon-cyan/30 text-neon-cyan">
                <MessageSquare className="w-3 h-3 mr-1" />
                用户留言
              </Badge>
              
              <h1 className="text-4xl font-bold text-white sm:text-5xl mb-6">
                留下你的<span className="text-gradient-neon">声音</span>
              </h1>
              
              <p className="text-lg text-gray-400 mb-8">
                无论是求职建议、合作洽谈，还是网站反馈<br />
                我们都期待听到你的声音
              </p>

              {/* Telegram CTA */}
              <a
                href="https://t.me/Web3Kairo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0088cc]/20 border border-[#0088cc]/50 text-[#00a8e6] hover:bg-[#0088cc]/30 transition-all"
              >
                <MessageCircle className="h-5 w-5" />
                <span>加入Telegram频道，实时交流</span>
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        {/* 留言列表 + 表单 */}
        <section className="py-16 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* 左侧：留言列表 */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-neon-cyan" />
                  留言墙 ({messages.length})
                </h2>
                
                <div className="space-y-6 max-h-[800px] overflow-y-auto pr-2">
                  {messages.map((message) => (
                    <div key={message.id} className="glass-card rounded-2xl p-6">
                      {/* 用户信息 */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center text-white font-medium">
                          {message.name[0]}
                        </div>
                        <div>
                          <div className="text-white font-medium">{message.name}</div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Badge variant="outline" className="text-xs border-white/10">
                              {message.role}
                            </Badge>
                            <span>{message.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 留言内容 */}
                      <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                        {message.content}
                      </p>
                      
                      {/* 官方回复 */}
                      {message.reply && (
                        <div className="bg-neon-cyan/10 rounded-xl p-4 border-l-2 border-neon-cyan">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="h-4 w-4 text-neon-cyan" />
                            <span className="text-neon-cyan text-sm font-medium">官方回复</span>
                          </div>
                          <p className="text-gray-400 text-sm">{message.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 右侧：留言表单 */}
              <div className="lg:sticky lg:top-24 lg:h-fit">
                <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                  <Send className="h-6 w-6 text-neon-purple" />
                  发表留言
                </h2>
                
                <div className="glass-card rounded-2xl p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          称呼 *
                        </label>
                        <Input
                          placeholder="怎么称呼您"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="bg-dark-200/50 border-white/10 text-white placeholder:text-gray-600 focus:border-neon-cyan/50"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm text-gray-400 flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          身份 *
                        </label>
                        <select
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                          className="w-full h-10 px-3 rounded-md bg-dark-200/50 border border-white/10 text-white focus:border-neon-cyan/50 focus:outline-none"
                          required
                        >
                          <option value="" className="bg-dark-200">请选择</option>
                          <option value="求职者" className="bg-dark-200">求职者</option>
                          <option value="企业HR" className="bg-dark-200">企业HR</option>
                          <option value="猎头顾问" className="bg-dark-200">猎头顾问</option>
                          <option value="其他" className="bg-dark-200">其他</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        留言内容 *
                      </label>
                      <Textarea
                        placeholder="写下您的建议、反馈或合作意向..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="bg-dark-200/50 border-white/10 text-white placeholder:text-gray-600 focus:border-neon-cyan/50 min-h-[120px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-500 font-semibold rounded-xl hover:shadow-neon-cyan hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <CheckCircle className="mr-2 h-5 w-5" />
                          发布中...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          立即发布
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-gray-500 text-center">
                      发布后留言将立即显示在列表中
                    </p>
                  </form>
                </div>

                {/* Telegram 快速入口 */}
                <a
                  href="https://t.me/Web3Kairo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 glass-card rounded-2xl p-6 flex items-center gap-4 hover:border-[#0088cc]/50 transition-all block"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#0088cc]/20 flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-[#0088cc]" />
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-medium">加入 Telegram 频道</div>
                    <div className="text-sm text-gray-400">@Web3Kairo · 实时获取最新职位</div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-500" />
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
