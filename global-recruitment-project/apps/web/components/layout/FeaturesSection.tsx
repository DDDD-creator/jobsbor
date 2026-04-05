'use client';

import { Zap, Shield, Globe2, Brain, Users, TrendingUp } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI智能匹配',
    description: '基于深度学习的智能算法，精准匹配职位与人才，匹配准确率高达95%',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Globe2,
    title: '全球覆盖',
    description: '覆盖全球50+国家和地区，支持多语言界面，打破地域限制',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: '信任体系',
    description: '严格的企业认证和背景调查，确保每一条职位信息真实可靠',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    title: '薪资洞察',
    description: '实时更新的行业薪资数据，助您做出更明智的职业决策',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Users,
    title: '专业社区',
    description: '汇聚行业精英，分享经验、交流见解、拓展人脉',
    color: 'from-indigo-500 to-violet-500',
  },
  {
    icon: Zap,
    title: '极速反馈',
    description: '平均48小时内获得反馈，让求职不再漫长等待',
    color: 'from-yellow-500 to-amber-500',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            为什么选择 <span className="text-gradient">GlobalRecruit</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-foreground/60">
            我们不只是招聘平台，更是您职业发展的伙伴
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="card p-6 hover-lift group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-foreground/60 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
