'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, Briefcase, ArrowRight, TrendingUp, Users, Building2 } from 'lucide-react';

const popularSearches = [
  '投资银行', '量化交易', '前端工程师', '产品经理', '数据科学家', '风险管理'
];

const stats = [
  { icon: Briefcase, value: '50K+', label: '活跃职位' },
  { icon: Building2, value: '8K+', label: '合作企业' },
  { icon: Users, value: '2M+', label: '注册人才' },
  { icon: TrendingUp, value: '95%', label: '匹配成功率' },
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-hero pt-16">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <TrendingUp className="w-4 h-4" />
            <span>2026年金融行业薪资报告已发布</span>
            <ArrowRight className="w-4 h-4" />
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            <span className="text-foreground">连接全球</span>
            <span className="text-gradient"> 顶尖人才 </span>
            <br />
            <span className="text-foreground">成就非凡职业</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-foreground/70 mb-12 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            专注金融与互联网行业，AI驱动的智能匹配系统
            <br className="hidden sm:block" />
            让您的职业生涯腾飞，让企业找到最合适的人才
          </p>

          {/* Search Box */}
          <div className="max-w-3xl mx-auto mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-2xl bg-card border shadow-soft">
              <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/50">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="职位名称、技能或公司..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>
              
              <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-xl bg-accent/50">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="城市或远程..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Link
                href={`/jobs?search=${searchQuery}&location=${location}`}
                className="btn-primary btn-lg whitespace-nowrap"
              >
                搜索职位
              </Link>
            </div>
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <span className="text-sm text-foreground/50">热门搜索:</span>
            {popularSearches.map((term) => (
              <Link
                key={term}
                href={`/jobs?search=${term}`}
                className="px-3 py-1 rounded-full text-sm bg-accent/50 text-foreground/70 hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {term}
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-4 rounded-xl bg-card/50 border backdrop-blur-sm"
              >
                <stat.icon className="w-6 h-6 text-primary mb-2" />
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Link
              href="/auth/signup?type=candidate"
              className="btn-primary btn-xl gap-2"
            >
              <Briefcase className="w-5 h-5" />
              我是求职者
            </Link>
            <Link
              href="/auth/signup?type=employer"
              className="btn-outline btn-xl gap-2"
            >
              <Building2 className="w-5 h-5" />
              我是企业HR
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-1">
          <div className="w-1.5 h-3 rounded-full bg-foreground/50 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
