'use client';

import { Briefcase, Building2, TrendingUp, Users, Globe2 } from 'lucide-react';

const stats = [
  { icon: Briefcase, value: '50,000+', label: '活跃职位', change: '+12%' },
  { icon: Building2, value: '8,500+', label: '合作企业', change: '+8%' },
  { icon: Users, value: '2,000,000+', label: '注册人才', change: '+25%' },
  { icon: Globe2, value: '50+', label: '覆盖国家', change: '+5' },
];

export function StatsSection() {
  return (
    <section className="py-16 bg-background border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-foreground/60 mb-2">{stat.label}</div>
              <div className="inline-flex items-center gap-1 text-xs font-medium text-success-600 bg-success/10 px-2 py-1 rounded-full">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
