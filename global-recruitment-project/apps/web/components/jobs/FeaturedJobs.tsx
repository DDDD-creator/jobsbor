'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const featuredJobs = [
  {
    id: 1,
    title: '量化交易研究员',
    company: 'Citadel Securities',
    logo: '/logos/citadel.svg',
    location: '上海 / 远程',
    type: '全职',
    salary: '¥80K-150K/月',
    tags: ['Python', 'C++', '机器学习'],
    postedAt: '2天前',
    isFeatured: true,
  },
  {
    id: 2,
    title: '高级前端工程师',
    company: '字节跳动',
    logo: '/logos/bytedance.svg',
    location: '北京',
    type: '全职',
    salary: '¥40K-70K/月',
    tags: ['React', 'TypeScript', 'Next.js'],
    postedAt: '1天前',
    isFeatured: true,
  },
  {
    id: 3,
    title: '投资银行分析师',
    company: 'Goldman Sachs',
    logo: '/logos/goldman.svg',
    location: '香港',
    type: '全职',
    salary: 'HK$50K-80K/月',
    tags: ['财务建模', '行业分析', 'PPT'],
    postedAt: '3天前',
    isFeatured: true,
  },
  {
    id: 4,
    title: '数据科学家',
    company: '蚂蚁集团',
    logo: '/logos/ant.svg',
    location: '杭州',
    type: '全职',
    salary: '¥45K-75K/月',
    tags: ['Python', 'TensorFlow', 'SQL'],
    postedAt: '4天前',
    isFeatured: true,
  },
];

export function FeaturedJobs() {
  return (
    <section className="py-20 bg-accent/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">热门职位</h2>
            <p className="text-foreground/60">来自全球顶级金融机构和互联网公司的最新机会</p>
          </div>
          <Link
            href="/jobs"
            className="btn-outline btn-md gap-2"
          >
            查看全部
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {featuredJobs.map((job, index) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="card p-6 hover:border-primary/30 transition-all group animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-primary">{job.company[0]}</span>
                </div>

                {/* Job Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {job.title}
                    </h3>
                    {job.isFeatured && (
                      <span className="badge-primary flex-shrink-0">热门</span>
                    )}
                  </div>
                  
                  <p className="text-sm text-foreground/60 mb-3">{job.company}</p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/50 mb-3">
                    <span>{job.location}</span>
                    <span>•</span>
                    <span>{job.type}</span>
                    <span>•</span>
                    <span className="text-success-600 font-medium">{job.salary}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {job.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md text-xs bg-accent text-foreground/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Posted Time */}
                <div className="flex-shrink-0 text-sm text-foreground/40">
                  {job.postedAt}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
