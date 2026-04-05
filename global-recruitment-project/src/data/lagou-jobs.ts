export interface JobSeed {
  id: string;
  title: string;
  slug: string;
  company: string;
  companySlug: string;
  companyLogo: string;
  description: string;
  requirements: string;
  salaryMin: number;
  salaryMax: number;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  industry: 'finance' | 'web3' | 'internet';
  category: 'engineer' | 'product' | 'design' | 'marketing' | 'finance' | 'operations' | 'research';
  tags: string[];
  publishedAt: string;
  applyUrl?: string;
}

// 拉勾网技术岗位数据 - 20个职位
export const jobs: JobSeed[] = [
  // ===== Java后端开发（4个）=====
  {
    id: "lagou-java-001",
    title: "高级Java开发工程师",
    slug: "senior-java-engineer",
    company: "蚂蚁集团",
    companySlug: "ant-group",
    companyLogo: "",
    description: "负责蚂蚁集团支付核心系统的架构设计与开发，参与高并发分布式系统的设计与实现。你将面对亿级交易的挑战，需要保证系统的高可用、高性能和高扩展性。工作内容包括微服务架构设计、分布式事务处理、性能优化等。",
    requirements: "• 5年以上Java开发经验，精通Spring Boot、Spring Cloud\n• 深入理解微服务架构，有大规模分布式系统开发经验\n• 熟悉MySQL、Redis、Kafka、RocketMQ等中间件\n• 精通分布式事务解决方案（Seata、TCC等）\n• 熟悉Kubernetes、Docker等云原生技术\n• 有高并发、高可用系统设计和优化经验",
    salaryMin: 35000,
    salaryMax: 60000,
    location: "杭州/上海",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["Java", "微服务", "分布式", "云原生", "高并发", "Kubernetes"],
    publishedAt: "2025-03-15"
  },
  {
    id: "lagou-java-002",
    title: "Java后端架构师",
    slug: "java-architect",
    company: "美团",
    companySlug: "meituan",
    companyLogo: "",
    description: "负责美团外卖业务后端架构设计与技术规划，带领团队完成核心系统重构和性能优化。需要深入理解业务，将业务需求转化为技术架构方案，并指导团队落地实施。",
    requirements: "• 8年以上Java开发经验，3年以上架构设计经验\n• 精通Spring Cloud Alibaba微服务生态\n• 深入理解DDD领域驱动设计，有实际项目经验\n• 熟悉分布式系统常见问题的解决方案\n• 具备技术团队管理经验，能够指导初中级工程师\n• 有电商或O2O行业经验者优先",
    salaryMin: 50000,
    salaryMax: 80000,
    location: "北京",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["Java", "架构师", "微服务", "DDD", "分布式", "Spring Cloud"],
    publishedAt: "2025-03-18"
  },
  {
    id: "lagou-java-003",
    title: "Java开发工程师（金融科技方向）",
    slug: "java-fintech-engineer",
    company: "平安科技",
    companySlug: "pingan-tech",
    companyLogo: "",
    description: "参与平安集团金融科技产品的后端开发，包括支付系统、风控系统、核心账务系统等。需要保证金融级系统的高可用性和数据一致性。",
    requirements: "• 3年以上Java开发经验\n• 熟悉Spring Boot、MyBatis等主流框架\n• 熟悉Oracle、MySQL数据库设计与优化\n• 了解分布式缓存、消息队列等技术\n• 有金融行业经验者优先\n• 具备良好的沟通能力和团队协作精神",
    salaryMin: 25000,
    salaryMax: 45000,
    location: "深圳/上海",
    type: "full-time",
    industry: "finance",
    category: "engineer",
    tags: ["Java", "金融科技", "微服务", "Oracle", "支付系统"],
    publishedAt: "2025-03-20"
  },
  {
    id: "lagou-java-004",
    title: "资深Java工程师（供应链方向）",
    slug: "senior-java-supply-chain",
    company: "京东",
    companySlug: "jd",
    companyLogo: "",
    description: "负责京东供应链系统的后端开发，包括库存管理、订单履约、仓储管理等核心模块。需要处理海量数据，保证系统的稳定性和扩展性。",
    requirements: "• 5年以上Java开发经验\n• 精通Spring Cloud、Dubbo等微服务框架\n• 熟悉MySQL分库分表、Redis集群等方案\n• 了解大数据技术栈（Hadoop、Spark、Flink）\n• 有供应链或电商系统开发经验者优先\n• 具备良好的问题分析和解决能力",
    salaryMin: 30000,
    salaryMax: 50000,
    location: "北京",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["Java", "供应链", "微服务", "大数据", "分布式缓存"],
    publishedAt: "2025-03-22"
  },

  // ===== Python开发（3个）=====
  {
    id: "lagou-python-001",
    title: "Python后端工程师",
    slug: "python-backend-engineer",
    company: "字节跳动",
    companySlug: "bytedance",
    companyLogo: "",
    description: "负责抖音电商业务的后端开发，使用Python构建高性能的API服务和数据处理系统。需要与算法团队紧密合作，支持推荐系统和广告系统的业务需求。",
    requirements: "• 3年以上Python开发经验\n• 精通FastAPI、Django或Flask等Web框架\n• 熟悉异步编程，了解asyncio机制\n• 熟悉MySQL、Redis、MongoDB等数据库\n• 了解消息队列（Kafka、RabbitMQ）的使用\n• 有大规模数据处理经验者优先",
    salaryMin: 30000,
    salaryMax: 50000,
    location: "北京/上海",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["Python", "FastAPI", "异步编程", "微服务", "推荐系统"],
    publishedAt: "2025-03-16"
  },
  {
    id: "lagou-python-002",
    title: "Python算法工程师",
    slug: "python-algorithm-engineer",
    company: "小红书",
    companySlug: "xiaohongshu",
    companyLogo: "",
    description: "负责小红书内容推荐算法的工程实现，使用Python构建算法服务和数据处理pipeline。需要将算法模型转化为高性能的线上服务，支持亿级用户的个性化推荐。",
    requirements: "• 硕士及以上学历，计算机相关专业\n• 精通Python，熟悉NumPy、Pandas、Scikit-learn等库\n• 熟悉机器学习算法原理和工程实现\n• 了解深度学习框架（PyTorch/TensorFlow）\n• 有推荐系统或NLP项目经验者优先\n• 具备良好的工程能力和代码规范意识",
    salaryMin: 35000,
    salaryMax: 60000,
    location: "上海",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["Python", "机器学习", "推荐算法", "深度学习", "大数据"],
    publishedAt: "2025-03-19"
  },
  {
    id: "lagou-python-003",
    title: "Python运维开发工程师（SRE方向）",
    slug: "python-sre-engineer",
    company: "网易",
    companySlug: "netease",
    companyLogo: "",
    description: "负责网易游戏业务的SRE体系建设，使用Python开发自动化运维工具和平台。需要构建监控告警、自动化部署、容量管理等系统，提升运维效率和系统稳定性。",
    requirements: "• 3年以上Python开发经验\n• 熟悉Django/Flask等Web框架，有运维平台开发经验\n• 精通Linux系统和Shell脚本\n• 熟悉Docker、Kubernetes等容器技术\n• 了解Prometheus、Grafana等监控工具\n• 有游戏行业运维经验者优先",
    salaryMin: 28000,
    salaryMax: 48000,
    location: "杭州/广州",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["Python", "SRE", "DevOps", "Kubernetes", "自动化运维", "监控"],
    publishedAt: "2025-03-21"
  },

  // ===== Go开发（3个）=====
  {
    id: "lagou-go-001",
    title: "Go语言后端工程师",
    slug: "go-backend-engineer",
    company: "腾讯",
    companySlug: "tencent",
    companyLogo: "",
    description: "负责腾讯视频业务的后端服务开发，使用Go语言构建高性能、高可用的微服务。需要处理海量用户请求，保证视频播放的流畅性和稳定性。",
    requirements: "• 3年以上Go语言开发经验\n• 精通Go语言特性，熟悉Gin、Echo等Web框架\n• 熟悉gRPC、Protocol Buffers等RPC技术\n• 了解微服务架构和服务治理方案\n• 熟悉Redis、Kafka、etcd等中间件\n• 有高并发系统开发经验者优先",
    salaryMin: 30000,
    salaryMax: 50000,
    location: "深圳/北京",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["Go", "微服务", "gRPC", "高并发", "云原生", "分布式"],
    publishedAt: "2025-03-17"
  },
  {
    id: "lagou-go-002",
    title: "资深Go工程师（云原生方向）",
    slug: "senior-go-cloud-native",
    company: "阿里云",
    companySlug: "aliyun",
    companyLogo: "",
    description: "负责阿里云容器服务（ACK）的核心组件开发，使用Go语言构建Kubernetes生态相关的云原生产品。需要深入理解Kubernetes架构，参与开源社区贡献。",
    requirements: "• 5年以上Go开发经验，有Kubernetes相关项目经验\n• 深入理解Kubernetes架构原理和核心组件\n• 熟悉容器技术（Docker、containerd）\n• 了解Linux内核、网络、存储等底层知识\n• 有开源项目贡献经验者优先\n• 具备技术热情和持续学习能力",
    salaryMin: 40000,
    salaryMax: 70000,
    location: "杭州/北京",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["Go", "Kubernetes", "云原生", "容器", "Docker", "开源"],
    publishedAt: "2025-03-23"
  },
  {
    id: "lagou-go-003",
    title: "Go后端开发工程师（区块链方向）",
    slug: "go-blockchain-engineer",
    company: "欧科云链",
    companySlug: "oklink",
    companyLogo: "",
    description: "负责区块链浏览器和数据分析平台的后端开发，使用Go语言构建高性能的区块链数据同步和分析服务。需要处理海量区块链数据，提供实时数据分析能力。",
    requirements: "• 3年以上Go开发经验\n• 熟悉区块链基本原理，了解以太坊、比特币等主流公链\n• 熟悉Redis、PostgreSQL、ClickHouse等数据库\n• 了解消息队列和流处理技术\n• 有区块链项目开发经验者优先\n• 对Web3和区块链技术有浓厚兴趣",
    salaryMin: 35000,
    salaryMax: 60000,
    location: "北京/ remote",
    type: "full-time",
    industry: "web3",
    category: "engineer",
    tags: ["Go", "区块链", "Web3", "分布式", "大数据", "以太坊"],
    publishedAt: "2025-03-25"
  },

  // ===== 前端开发（4个）=====
  {
    id: "lagou-fe-001",
    title: "高级前端工程师（React方向）",
    slug: "senior-frontend-react",
    company: "滴滴出行",
    companySlug: "didi",
    companyLogo: "",
    description: "负责滴滴出行司乘端H5和小程序的前端开发，使用React技术栈构建高性能的用户界面。需要解决复杂业务场景下的性能优化和体验提升问题。",
    requirements: "• 5年以上前端开发经验\n• 精通React，熟悉Hooks、Redux等状态管理方案\n• 熟悉TypeScript，有大型项目实践经验\n• 了解前端工程化（Webpack、Vite等）\n• 熟悉移动端适配和性能优化\n• 有小程序开发经验者优先",
    salaryMin: 30000,
    salaryMax: 50000,
    location: "北京/杭州",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["React", "TypeScript", "前端工程化", "移动端", "性能优化"],
    publishedAt: "2025-03-18"
  },
  {
    id: "lagou-fe-002",
    title: "前端架构师",
    slug: "frontend-architect",
    company: "拼多多",
    companySlug: "pinduoduo",
    companyLogo: "",
    description: "负责拼多多前端技术架构设计和团队建设，主导前端工程化体系、组件库、低代码平台等基础设施建设。需要带领团队攻克技术难题，提升整体研发效率。",
    requirements: "• 8年以上前端开发经验，3年以上架构设计经验\n• 精通React/Vue至少一种框架，理解其底层原理\n• 熟悉前端工程化、模块化、组件化开发\n• 了解Node.js，有BFF层开发经验\n• 具备技术团队管理和培养经验\n• 有大型电商前端架构经验者优先",
    salaryMin: 45000,
    salaryMax: 75000,
    location: "上海",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["前端架构", "React", "工程化", "Node.js", "低代码", "团队管理"],
    publishedAt: "2025-03-20"
  },
  {
    id: "lagou-fe-003",
    title: "前端开发工程师（Vue方向）",
    slug: "frontend-vue-engineer",
    company: "哔哩哔哩",
    companySlug: "bilibili",
    companyLogo: "",
    description: "负责哔哩哔哩创作中心的前端开发，使用Vue技术栈构建创作者工具和数据可视化平台。需要与产品、设计紧密配合，提供优秀的用户体验。",
    requirements: "• 3年以上前端开发经验\n• 精通Vue2/Vue3，熟悉Composition API\n• 熟悉Element Plus、Ant Design Vue等UI框架\n• 了解前端可视化技术（ECharts、D3.js等）\n• 熟悉前端性能优化和代码规范\n• 有内容创作平台开发经验者优先",
    salaryMin: 25000,
    salaryMax: 42000,
    location: "上海",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["Vue", "TypeScript", "可视化", "创作工具", "前端工程化"],
    publishedAt: "2025-03-22"
  },
  {
    id: "lagou-fe-004",
    title: "Web3前端工程师",
    slug: "web3-frontend-engineer",
    company: "币安",
    companySlug: "binance",
    companyLogo: "",
    description: "负责币安Web3钱包和DApp的前端开发，使用React和Web3技术栈构建去中心化应用。需要与智能合约团队配合，提供安全、易用的Web3产品体验。",
    requirements: "• 3年以上前端开发经验\n• 精通React，熟悉Next.js框架\n• 熟悉Web3.js、Ethers.js等区块链交互库\n• 了解智能合约基本原理和交互方式\n• 熟悉DeFi协议和NFT生态\n• 有DApp开发经验者优先",
    salaryMin: 40000,
    salaryMax: 70000,
    location: "远程（全球）",
    type: "remote",
    industry: "web3",
    category: "engineer",
    tags: ["Web3", "React", "DApp", "以太坊", "DeFi", "Ethers.js"],
    publishedAt: "2025-03-24"
  },

  // ===== 架构师/SRE/DevOps/技术负责人（6个）=====
  {
    id: "lagou-arch-001",
    title: "云原生架构师",
    slug: "cloud-native-architect",
    company: "华为云",
    companySlug: "huaweicloud",
    companyLogo: "",
    description: "负责华为云容器和微服务产品的架构设计，为客户提供云原生转型解决方案。需要深入理解企业客户需求，设计可落地的技术架构方案。",
    requirements: "• 8年以上IT行业经验，3年以上云原生架构经验\n• 精通Kubernetes、Istio、Knative等云原生技术\n• 熟悉微服务架构设计模式和最佳实践\n• 了解主流公有云（AWS、Azure、阿里云等）\n• 具备客户沟通和方案宣讲能力\n• 有云厂商或大型企业架构经验者优先",
    salaryMin: 50000,
    salaryMax: 90000,
    location: "深圳/北京/杭州",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["架构师", "云原生", "Kubernetes", "微服务", "Service Mesh", "Istio"],
    publishedAt: "2025-03-19"
  },
  {
    id: "lagou-sre-001",
    title: "SRE高级工程师",
    slug: "senior-sre-engineer",
    company: "米哈游",
    companySlug: "mihoyo",
    companyLogo: "",
    description: "负责米哈游全球游戏服务的SRE体系建设，保障游戏服务的高可用性和稳定性。需要建立完善的监控、告警、应急响应机制，推动运维自动化。",
    requirements: "• 5年以上SRE或运维开发经验\n• 精通Linux系统和网络原理\n• 熟悉Kubernetes，有大规模集群运维经验\n• 精通Prometheus、Grafana等监控工具\n• 熟悉Terraform、Ansible等IaC工具\n• 有游戏行业或全球化服务运维经验者优先",
    salaryMin: 40000,
    salaryMax: 70000,
    location: "上海",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["SRE", "DevOps", "Kubernetes", "监控", "高可用", "IaC"],
    publishedAt: "2025-03-21"
  },
  {
    id: "lagou-devops-001",
    title: "DevOps工程师",
    slug: "devops-engineer",
    company: "蔚来汽车",
    companySlug: "nio",
    companyLogo: "",
    description: "负责蔚来汽车研发效能平台的建设和维护，构建CI/CD流水线、自动化测试平台和容器化部署方案。需要推动DevOps文化落地，提升研发团队效率。",
    requirements: "• 3年以上DevOps或运维开发经验\n• 精通Jenkins、GitLab CI等CI/CD工具\n• 熟悉Docker、Kubernetes容器技术\n• 熟悉Ansible、Terraform等自动化工具\n• 了解Python/Go至少一种脚本语言\n• 有汽车行业或IoT项目经验者优先",
    salaryMin: 30000,
    salaryMax: 50000,
    location: "上海/合肥",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["DevOps", "CI/CD", "Kubernetes", "Jenkins", "自动化", "容器"],
    publishedAt: "2025-03-23"
  },
  {
    id: "lagou-techlead-001",
    title: "技术负责人（后端方向）",
    slug: "tech-lead-backend",
    company: "快手",
    companySlug: "kuaishou",
    companyLogo: "",
    description: "负责快手短视频业务后端团队的技术管理和架构设计，带领20+人团队支撑亿级用户的业务需求。需要平衡技术债务和新功能开发，保证系统的长期健康发展。",
    requirements: "• 8年以上后端开发经验，2年以上团队管理经验\n• 精通Java/Go至少一种后端语言\n• 熟悉分布式系统设计和微服务架构\n• 具备技术选型和架构决策能力\n• 优秀的沟通能力和跨团队协作能力\n• 有短视频或社交产品后端经验者优先",
    salaryMin: 60000,
    salaryMax: 100000,
    location: "北京",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["技术负责人", "团队管理", "微服务", "分布式", "架构设计", "高并发"],
    publishedAt: "2025-03-25"
  },
  {
    id: "lagou-platform-001",
    title: "平台工程师（Platform Engineering）",
    slug: "platform-engineer",
    company: "Shopee",
    companySlug: "shopee",
    companyLogo: "",
    description: "负责Shopee内部开发者平台的建设，提供标准化的基础设施服务和开发工具链。需要打造内部PaaS平台，提升全公司研发效率和工程标准。",
    requirements: "• 5年以上平台开发或SRE经验\n• 精通Kubernetes和云原生技术栈\n• 熟悉平台工程（Platform Engineering）理念\n• 了解GitOps、IaC等现代运维实践\n• 具备产品思维，能够设计开发者友好的平台\n• 有内部开发者平台建设经验者优先",
    salaryMin: 45000,
    salaryMax: 75000,
    location: "深圳/新加坡",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["Platform Engineering", "云原生", "Kubernetes", "开发者平台", "GitOps", "IaC"],
    publishedAt: "2025-03-26"
  },
  {
    id: "lagou-infra-001",
    title: "基础架构工程师",
    slug: "infrastructure-engineer",
    company: "百度",
    companySlug: "baidu",
    companyLogo: "",
    description: "负责百度AI中台的基础架构建设，包括分布式存储、计算调度、网络等基础设施。需要解决大规模集群的资源调度、故障自愈、成本优化等挑战。",
    requirements: "• 5年以上基础架构或分布式系统开发经验\n• 精通Go/C++至少一种系统编程语言\n• 熟悉分布式系统原理和一致性协议\n• 了解Linux内核、网络协议栈\n• 有大规模集群调度和管理经验\n• 有开源项目贡献者优先",
    salaryMin: 40000,
    salaryMax: 70000,
    location: "北京",
    type: "full-time",
    industry: "internet",
    category: "engineer",
    tags: ["基础架构", "分布式系统", "调度系统", "Linux内核", "高可用", "分布式存储"],
    publishedAt: "2025-03-27"
  }
];

// 辅助函数
export function getJobBySlug(slug: string): JobSeed | undefined {
  return jobs.find(job => job.slug === slug);
}

export function getJobsByIndustry(industry: JobSeed['industry']): JobSeed[] {
  return jobs.filter(job => job.industry === industry);
}

export function getJobsByCategory(category: JobSeed['category']): JobSeed[] {
  return jobs.filter(job => job.category === category);
}

export function getJobsByTag(tag: string): JobSeed[] {
  return jobs.filter(job => job.tags.includes(tag));
}

export function getRemoteJobs(): JobSeed[] {
  return jobs.filter(job => job.type === 'remote');
}

export function getRecentJobs(limit: number = 10): JobSeed[] {
  return jobs
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}

export function searchJobs(query: string): JobSeed[] {
  const lowercaseQuery = query.toLowerCase();
  return jobs.filter(job =>
    job.title.toLowerCase().includes(lowercaseQuery) ||
    job.company.toLowerCase().includes(lowercaseQuery) ||
    job.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    job.location.toLowerCase().includes(lowercaseQuery)
  );
}

export const industries = [
  { value: 'finance', label: '金融', count: jobs.filter(j => j.industry === 'finance').length },
  { value: 'web3', label: 'Web3', count: jobs.filter(j => j.industry === 'web3').length },
  { value: 'internet', label: '互联网', count: jobs.filter(j => j.industry === 'internet').length },
] as const;

export const categories = [
  { value: 'engineer', label: '技术', count: jobs.filter(j => j.category === 'engineer').length },
  { value: 'product', label: '产品', count: jobs.filter(j => j.category === 'product').length },
  { value: 'design', label: '设计', count: jobs.filter(j => j.category === 'design').length },
  { value: 'marketing', label: '市场', count: jobs.filter(j => j.category === 'marketing').length },
  { value: 'finance', label: '金融', count: jobs.filter(j => j.category === 'finance').length },
  { value: 'operations', label: '运营', count: jobs.filter(j => j.category === 'operations').length },
  { value: 'research', label: '研究', count: jobs.filter(j => j.category === 'research').length },
] as const;

export const jobTypes = [
  { value: 'full-time', label: '全职' },
  { value: 'part-time', label: '兼职' },
  { value: 'contract', label: '合同' },
  { value: 'remote', label: '远程' },
] as const;

// 技术栈标签统计
export const techTags = [
  "Java", "Python", "Go", "微服务", "分布式", "云原生", "Kubernetes",
  "Docker", "容器", "架构师", "SRE", "DevOps", "React", "Vue",
  "TypeScript", "前端工程化", "机器学习", "深度学习", "推荐系统",
  "区块链", "Web3", "以太坊", "高并发", "高可用", "监控",
  "自动化运维", "CI/CD", "Service Mesh", "Istio", "DDD",
  "大数据", "Flink", "Spark", "平台工程", "基础架构"
];
