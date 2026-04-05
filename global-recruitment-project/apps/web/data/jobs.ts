export interface Job {
  id: number;
  slug: string;
  title: string;
  titleEn: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  tags: string[];
  postedAt: string;
  postedDate: string;
  isFeatured: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  department: string;
  experienceLevel: string;
  workMode: 'onsite' | 'remote' | 'hybrid';
  about: string;
}

export const jobs: Job[] = [
  {
    id: 1,
    slug: 'quantitative-trading-researcher',
    title: '量化交易研究员',
    titleEn: 'Quantitative Trading Researcher',
    company: 'Citadel Securities',
    location: '上海 / 远程',
    type: '全职',
    salary: '¥80K-150K/月',
    salaryMin: 80000,
    salaryMax: 150000,
    salaryCurrency: 'CNY',
    tags: ['Python', 'C++', '机器学习'],
    postedAt: '2天前',
    postedDate: '2026-04-03',
    isFeatured: true,
    department: '量化研究',
    experienceLevel: '高级',
    workMode: 'hybrid',
    description: `Citadel Securities 正在寻找一位经验丰富的量化交易研究员加入上海团队。您将参与开发和维护高频交易策略，利用统计学和机器学习方法分析市场数据，发现alpha信号。

这是一个极具挑战性的职位，需要扎实的数学/统计基础、优秀的编程能力，以及对金融市场的深刻理解。您将直接与投资组合经理和工程师团队合作，推动交易策略的创新。`,
    requirements: [
      '数学、统计、计算机或相关专业硕士及以上学历',
      '3年以上量化交易或相关领域研究经验',
      '精通Python和C++编程',
      '深入理解统计学、概率论和机器学习算法',
      '有实际alpha因子开发经验优先',
      '良好的团队协作和沟通能力',
    ],
    benefits: [
      '极具竞争力的薪酬（底薪+绩效奖金）',
      '弹性工作制，支持混合办公',
      '高端硬件配置（多屏工作站）',
      '完善的医疗和保险福利',
      '持续学习和培训预算',
      '年度团建和假期',
    ],
    about: 'Citadel Securities 是全球最大的做市商之一，每日处理全球市场约25%的交易量。我们致力于通过技术创新推动金融市场效率。',
  },
  {
    id: 2,
    slug: 'senior-frontend-engineer',
    title: '高级前端工程师',
    titleEn: 'Senior Frontend Engineer',
    company: '字节跳动',
    location: '北京',
    type: '全职',
    salary: '¥40K-70K/月',
    salaryMin: 40000,
    salaryMax: 70000,
    salaryCurrency: 'CNY',
    tags: ['React', 'TypeScript', 'Next.js'],
    postedAt: '1天前',
    postedDate: '2026-04-04',
    isFeatured: true,
    department: '前端技术',
    experienceLevel: '高级',
    workMode: 'onsite',
    description: `字节跳动核心业务线正在招聘高级前端工程师。你将负责公司核心产品的前端架构设计和开发，参与百万级用户产品的性能优化和用户体验提升。

我们希望你对前端技术有深入理解，能够独立设计和实现复杂的交互界面，同时具备良好的工程实践能力和团队协作精神。`,
    requirements: [
      '计算机或相关专业本科及以上学历',
      '5年以上前端开发经验',
      '精通React/Next.js框架和TypeScript',
      '深入理解浏览器渲染原理和性能优化',
      '有大型项目架构设计经验',
      '具备良好的代码质量和工程实践',
    ],
    benefits: [
      '有竞争力的薪酬和期权',
      '免费三餐和零食',
      '完善的健身设施',
      '灵活的工作时间',
      '技术大会和培训支持',
      '清晰的晋升通道',
    ],
    about: '字节跳动是全球领先的科技公司，旗下产品覆盖全球150多个国家和地区，拥有超过10亿月活用户。',
  },
  {
    id: 3,
    slug: 'investment-banking-analyst',
    title: '投资银行分析师',
    titleEn: 'Investment Banking Analyst',
    company: 'Goldman Sachs',
    location: '香港',
    type: '全职',
    salary: 'HK$50K-80K/月',
    salaryMin: 50000,
    salaryMax: 80000,
    salaryCurrency: 'HKD',
    tags: ['财务建模', '行业分析', 'PPT'],
    postedAt: '3天前',
    postedDate: '2026-04-02',
    isFeatured: true,
    department: '投资银行',
    experienceLevel: '初级',
    workMode: 'onsite',
    description: `Goldman Sachs 亚洲区投资银行部正在招聘分析师。你将参与IPO、并购、债务融资等项目的执行，为客户提供专业的财务建议。

这是进入顶级投行的绝佳机会，你将获得全面的培训和广阔的职业发展空间。`,
    requirements: [
      '金融、经济、会计或相关专业本科及以上学历',
      '优秀的学术成绩（GPA 3.5+）',
      '扎实的财务分析和建模能力',
      '精通Excel和PowerPoint',
      '出色的中英文沟通能力',
      '能够在高压环境下工作',
      '有投行或相关实习经验者优先',
    ],
    benefits: [
      '行业领先的薪酬和奖金',
      '系统性的培训计划',
      '全球化的职业发展机会',
      '完善的福利体系',
      '高端办公环境',
    ],
    about: '高盛是全球领先的投资银行、证券和投资管理公司，为全球各地的企业、金融机构、政府和富裕个人提供广泛的金融服务。',
  },
  {
    id: 4,
    slug: 'data-scientist',
    title: '数据科学家',
    titleEn: 'Data Scientist',
    company: '蚂蚁集团',
    location: '杭州',
    type: '全职',
    salary: '¥45K-75K/月',
    salaryMin: 45000,
    salaryMax: 75000,
    salaryCurrency: 'CNY',
    tags: ['Python', 'TensorFlow', 'SQL'],
    postedAt: '4天前',
    postedDate: '2026-04-01',
    isFeatured: true,
    department: '数据智能',
    experienceLevel: '中级',
    workMode: 'hybrid',
    description: `蚂蚁集团数据智能团队正在招聘数据科学家。你将利用大数据和机器学习技术，为风控、营销、产品优化等业务场景提供数据驱动的解决方案。

我们需要你既有扎实的算法功底，又有强烈的业务sense，能够将数据洞察转化为实际的业务价值。`,
    requirements: [
      '统计学、计算机、数学或相关专业硕士及以上学历',
      '3年以上数据分析或机器学习相关工作经验',
      '精通Python和SQL',
      '熟悉TensorFlow/PyTorch等深度学习框架',
      '有大规模数据处理经验（Hadoop/Spark）',
      '优秀的业务分析和逻辑思维能力',
    ],
    benefits: [
      '有竞争力的薪酬体系',
      '弹性工作制',
      '完善的五险一金和补充医疗',
      '丰富的团建活动',
      '学习和发展基金',
      '杭州人才补贴',
    ],
    about: '蚂蚁集团是全球领先的金融科技开放平台，致力于用科技创新为世界带来微小而美好的改变。',
  },
  {
    id: 5,
    slug: 'product-manager-web3',
    title: 'Web3 产品经理',
    titleEn: 'Web3 Product Manager',
    company: 'Binance',
    location: '迪拜 / 远程',
    type: '全职',
    salary: '$8K-15K/月',
    salaryMin: 8000,
    salaryMax: 15000,
    salaryCurrency: 'USD',
    tags: ['Web3', 'DeFi', '产品策略'],
    postedAt: '5天前',
    postedDate: '2026-03-31',
    isFeatured: false,
    department: '产品',
    experienceLevel: '高级',
    workMode: 'remote',
    description: `Binance 正在寻找一位理解 Web3 生态的产品经理，负责 DeFi 产品线的设计和优化。你将深入了解用户行为，分析市场趋势，推动产品迭代和创新。`,
    requirements: [
      '3年以上互联网产品管理经验',
      '深入了解区块链和DeFi生态',
      '优秀的用户研究和数据分析能力',
      '出色的跨部门沟通和协调能力',
      '流利的中英文能力',
    ],
    benefits: [
      '全球远程工作机会',
      '加密货币薪酬选项',
      '年度团队 retreat',
      '设备自选预算',
      '全球医疗保险',
    ],
    about: 'Binance 是全球领先的区块链生态系统，致力于加速全球加密货币的大规模采用。',
  },
  {
    id: 6,
    slug: 'risk-management-specialist',
    title: '风险管理专家',
    titleEn: 'Risk Management Specialist',
    company: '摩根士丹利',
    location: '新加坡',
    type: '全职',
    salary: 'SGD 10K-18K/月',
    salaryMin: 10000,
    salaryMax: 18000,
    salaryCurrency: 'SGD',
    tags: ['风控模型', 'VaR', '监管合规'],
    postedAt: '6天前',
    postedDate: '2026-03-30',
    isFeatured: false,
    department: '风险管理',
    experienceLevel: '高级',
    workMode: 'onsite',
    description: `摩根士丹利亚太区风险管理团队正在招聘风险管理专家。您将负责开发和维护风险模型，确保交易组合在可接受的风险范围内运行，并满足监管要求。`,
    requirements: [
      '金融工程、数学或相关专业硕士及以上学历',
      '5年以上金融机构风险管理经验',
      '精通VaR、压力测试等风险模型',
      '熟悉巴塞尔协议III等监管框架',
      '熟练使用Python/R进行量化分析',
      'FRM或CFA持证者优先',
    ],
    benefits: [
      '新加坡顶级薪酬水平',
      '全球轮岗机会',
      '专业认证支持',
      '全面的家庭福利',
      '新加坡EP签证支持',
    ],
    about: '摩根士丹利是一家全球领先的金融服务公司，为企业、机构和个人提供投资银行、证券、财富管理和投资管理服务。',
  },
];

export function getJobBySlug(slug: string): Job | undefined {
  return jobs.find(j => j.slug === slug);
}

export function getAllJobSlugs(): string[] {
  return jobs.map(j => j.slug);
}

export function getFeaturedJobs(): Job[] {
  return jobs.filter(j => j.isFeatured);
}

export function getJobsByTag(tag: string): Job[] {
  return jobs.filter(j => j.tags.includes(tag));
}
