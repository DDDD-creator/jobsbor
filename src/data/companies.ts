export interface CompanySeed {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  website: string;
  location: string;
  industry: 'finance' | 'web3' | 'internet';
  foundedYear?: number;
  size?: string;
  tags?: string[];
}

export const companies: CompanySeed[] = [
  // ===== 金融公司（4家）=====
  {
    id: "c1",
    name: "中信证券",
    slug: "citic-securities",
    logo: "",
    description: "中信证券是中国最大的综合性证券公司之一，成立于1995年，总部位于北京。公司业务涵盖投资银行、资产管理、证券经纪、研究咨询等多个领域，在国内外资本市场具有重要影响力。中信证券连续多年在A股IPO承销、债券承销等业务中位居行业前列，是众多优质企业首选的资本市场合作伙伴。",
    website: "https://www.cs.ecitic.com",
    location: "北京",
    industry: "finance",
    foundedYear: 1995,
    size: "10000+",
    tags: ["投行", "券商", "资产管理", "行业龙头"]
  },
  {
    id: "c2",
    name: "高毅资产",
    slug: "gaoyi-asset",
    logo: "",
    description: "高毅资产是中国领先的私募基金管理公司，专注于二级市场股票投资。公司汇聚了多位业内知名的基金经理，管理规模超过千亿元人民币。高毅以价值投资为核心理念，通过深度研究和长期持有优质企业，为投资者创造持续稳定的回报。",
    website: "https://www.gyasset.com",
    location: "上海",
    industry: "finance",
    foundedYear: 2013,
    size: "100-500",
    tags: ["私募基金", "价值投资", "资产管理", "头部机构"]
  },
  {
    id: "c3",
    name: "中金公司",
    slug: "cicc",
    logo: "",
    description: "中国国际金融股份有限公司（中金公司）成立于1995年，是中国首家中外合资投资银行。中金公司凭借深厚的专业知识和国际化视野，在境内外资本市场屡创先河，完成了众多具有里程碑意义的交易。公司业务涵盖投资银行、股票业务、固定收益、私募股权、资产管理、财富管理等多个领域。",
    website: "https://www.cicc.com",
    location: "北京",
    industry: "finance",
    foundedYear: 1995,
    size: "5000-10000",
    tags: ["投行", "综合性金融", "国际化", "行业标杆"]
  },
  {
    id: "c4",
    name: "招商基金",
    slug: "cmb-fund",
    logo: "",
    description: "招商基金成立于2002年，是中国首批中外合资基金管理公司之一。公司由招商银行和招商证券共同持股，依托股东强大的资源优势和专业的投资管理能力，为投资者提供全面的资产管理服务。招商基金在固定收益、权益投资、量化投资等领域均有出色表现，管理规模长期位居行业前列。",
    website: "https://www.cmfchina.com",
    location: "深圳",
    industry: "finance",
    foundedYear: 2002,
    size: "500-1000",
    tags: ["公募基金", "资产管理", "招商银行系", "稳健投资"]
  },

  // ===== Web3公司（3家）=====
  {
    id: "c5",
    name: "Uniswap Labs",
    slug: "uniswap-labs",
    logo: "",
    description: "Uniswap Labs是去中心化交易所Uniswap的开发团队，总部位于美国纽约。Uniswap是基于以太坊的自动做市商（AMM）协议，是DeFi领域最重要的基础设施之一，累计交易量超过1万亿美元。Uniswap Labs致力于构建开放、透明、高效的金融基础设施，推动去中心化金融的发展。",
    website: "https://uniswap.org",
    location: "纽约（远程友好）",
    industry: "web3",
    foundedYear: 2018,
    size: "50-200",
    tags: ["DeFi", "DEX", "以太坊", "自动做市商", "顶级协议"]
  },
  {
    id: "c6",
    name: "OpenSea",
    slug: "opensea",
    logo: "",
    description: "OpenSea是全球最大的NFT市场，成立于2017年，总部位于美国纽约。平台支持以太坊、Polygon、Solana等多条区块链的NFT交易，累计交易量超过300亿美元。OpenSea为数百万用户提供了创建、购买、出售和发现NFT的便捷渠道，是NFT生态的重要基础设施。",
    website: "https://opensea.io",
    location: "纽约（远程友好）",
    industry: "web3",
    foundedYear: 2017,
    size: "200-500",
    tags: ["NFT", "市场平台", "以太坊", "多链", "行业龙头"]
  },
  {
    id: "c7",
    name: "Aave",
    slug: "aave",
    logo: "",
    description: "Aave是去中心化借贷协议的先驱，由Stani Kulechov于2017年创立，总部位于瑞士。Aave允许用户存入加密资产赚取利息，或抵押资产借出其他加密资产。协议已部署在以太坊、Polygon、Avalanche等多条区块链，总锁仓价值（TVL）长期位居DeFi协议前列。",
    website: "https://aave.com",
    location: "瑞士（完全分布式）",
    industry: "web3",
    foundedYear: 2017,
    size: "50-200",
    tags: ["DeFi", "借贷协议", "流动性挖矿", "DAO治理", "多链部署"]
  },

  // ===== 互联网公司（3家）=====
  {
    id: "c8",
    name: "字节跳动",
    slug: "bytedance",
    logo: "",
    description: "字节跳动成立于2012年，总部位于北京，是全球领先的互联网科技公司。公司以「今日头条」起家，随后推出抖音（TikTok）、西瓜视频等多款现象级产品。字节跳动的产品覆盖全球150多个国家和地区，月活跃用户数超过20亿。公司以推荐算法技术为核心竞争力，致力于通过技术丰富全球用户的数字生活。",
    website: "https://www.bytedance.com",
    location: "北京",
    industry: "internet",
    foundedYear: 2012,
    size: "100000+",
    tags: ["短视频", "内容推荐", "全球化", "技术驱动", "互联网巨头"]
  },
  {
    id: "c9",
    name: "阿里巴巴",
    slug: "alibaba",
    logo: "",
    description: "阿里巴巴集团成立于1999年，总部位于杭州，是全球最大的电子商务公司之一。公司业务涵盖电商平台（淘宝、天猫）、云计算（阿里云）、数字媒体、物流（菜鸟网络）、金融科技（蚂蚁集团）等多个领域。阿里巴巴致力于构建未来的商业基础设施，其生态系统已服务全球数亿消费者和数千万商家。",
    website: "https://www.alibaba.com",
    location: "杭州",
    industry: "internet",
    foundedYear: 1999,
    size: "100000+",
    tags: ["电商", "云计算", "金融科技", "生态系统", "互联网巨头"]
  },
  {
    id: "c10",
    name: "腾讯",
    slug: "tencent",
    logo: "",
    description: "腾讯成立于1998年，总部位于深圳，是中国领先的互联网增值服务提供商。公司以QQ和微信两大社交平台为核心，业务涵盖社交网络、数字内容、游戏、金融科技、云服务等领域。腾讯的使命是「用户为本，科技向善」，致力于通过互联网服务提升人类生活品质。",
    website: "https://www.tencent.com",
    location: "深圳",
    industry: "internet",
    foundedYear: 1998,
    size: "100000+",
    tags: ["社交网络", "游戏", "微信", "数字内容", "互联网巨头"]
  }
];

// 辅助函数
export function getCompanyBySlug(slug: string): CompanySeed | undefined {
  return companies.find(company => company.slug === slug);
}

export function getCompaniesByIndustry(industry: CompanySeed['industry']): CompanySeed[] {
  return companies.filter(company => company.industry === industry);
}

export function getCompaniesByTag(tag: string): CompanySeed[] {
  return companies.filter(company => company.tags?.includes(tag) ?? false);
}

export function searchCompanies(query: string): CompanySeed[] {
  const lowercaseQuery = query.toLowerCase();
  return companies.filter(company =>
    company.name.toLowerCase().includes(lowercaseQuery) ||
    company.description.toLowerCase().includes(lowercaseQuery) ||
    (company.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ?? false)
  );
}

// 统计信息
export const companyStats = {
  total: companies.length,
  byIndustry: {
    finance: companies.filter(c => c.industry === 'finance').length,
    web3: companies.filter(c => c.industry === 'web3').length,
    internet: companies.filter(c => c.industry === 'internet').length,
  },
  byLocation: companies.reduce((acc, company) => {
    acc[company.location] = (acc[company.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
};

// 行业标签映射
export const industryLabels: Record<CompanySeed['industry'], string> = {
  finance: '金融',
  web3: 'Web3',
  internet: '互联网',
};
