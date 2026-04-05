'use client';

const industries = [
  {
    name: '投资银行',
    icon: '🏦',
    jobs: '5,200+',
    color: 'from-blue-600 to-blue-800',
  },
  {
    name: '量化交易',
    icon: '📈',
    jobs: '3,800+',
    color: 'from-green-600 to-emerald-800',
  },
  {
    name: '私募股权',
    icon: '💼',
    jobs: '2,500+',
    color: 'from-purple-600 to-purple-800',
  },
  {
    name: '风险管理',
    icon: '🛡️',
    jobs: '4,100+',
    color: 'from-red-600 to-red-800',
  },
  {
    name: '前端开发',
    icon: '💻',
    jobs: '8,900+',
    color: 'from-cyan-600 to-cyan-800',
  },
  {
    name: '后端开发',
    icon: '⚙️',
    jobs: '7,600+',
    color: 'from-orange-600 to-orange-800',
  },
  {
    name: '数据科学',
    icon: '🧠',
    jobs: '6,200+',
    color: 'from-indigo-600 to-indigo-800',
  },
  {
    name: '产品经理',
    icon: '📱',
    jobs: '4,800+',
    color: 'from-pink-600 to-pink-800',
  },
];

export function IndustriesSection() {
  return (
    <section className="py-20 bg-accent/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            热门行业
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-foreground/60">
            覆盖金融与互联网核心领域，精准对接行业人才需求
          </p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {industries.map((industry, index) => (
            <a
              key={industry.name}
              href={`/jobs?industry=${industry.name}`}
              className="group relative overflow-hidden rounded-xl p-6 bg-card border hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-medium animate-scale-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative z-10">
                <div className="text-4xl mb-3">{industry.icon}</div>
                <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {industry.name}
                </h3>
                <p className="text-sm text-foreground/50">{industry.jobs} 职位</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
