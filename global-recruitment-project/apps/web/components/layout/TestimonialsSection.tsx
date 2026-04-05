'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: '张明',
    role: '量化研究员',
    company: 'Citadel Securities',
    avatar: '👨‍💼',
    content: '通过 GlobalRecruit，我找到了理想的量化交易职位。AI匹配系统非常精准，推荐的职位都与我的技能和兴趣高度吻合。',
    rating: 5,
  },
  {
    name: 'Sarah Chen',
    role: 'HR Director',
    company: 'ByteDance',
    avatar: '👩‍💼',
    content: '作为招聘方，GlobalRecruit 帮我们大幅缩短了招聘周期。候选人的质量非常高，匹配度远超其他平台。',
    rating: 5,
  },
  {
    name: '李峰',
    role: '前端技术专家',
    company: 'Alibaba',
    avatar: '👨‍💻',
    content: '平台的薪资洞察功能非常实用，帮助我了解了市场行情，在薪资谈判中占据了主动。',
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            用户评价
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-foreground/60">
            听听他们怎么说
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="card p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="w-8 h-8 text-primary/20 mb-4" />
              
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>

              <p className="text-foreground/70 mb-6 leading-relaxed">
                {testimonial.content}
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-foreground/50">
                    {testimonial.role} @ {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
