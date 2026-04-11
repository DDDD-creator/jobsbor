const fs = require('fs');

// 文章配置 - 标题和描述
const articles = [
  {
    id: "article-001",
    title: "2026年科技招聘趋势：远程工作、Web3与AI驱动的人才市场",
    description: "深度解析2026年全球科技招聘市场的三大趋势：远程工作的常态化、Web3领域的人才需求爆发，以及AI技术在招聘流程中的深度应用。",
    keywords: ["科技招聘", "远程工作", "Web3", "人工智能", "人才市场", "2026年趋势", "全球化招聘", "异步工作", "智能合约", "区块链", "AI招聘", "技能优先"],
    tags: ["招聘趋势", "科技行业", "远程办公", "Web3", "人工智能", "人才管理"],
    metaDescription: "深度解析2026年全球科技招聘市场三大趋势：远程工作常态化、Web3人才需求爆发、AI深度赋能招聘流程。了解最新行业动态，把握人才市场脉搏。"
  },
  {
    id: "article-002",
    title: "持续绩效管理与OKR实践：从年度考核到实时反馈的管理革命",
    description: "系统阐述2026年持续绩效管理的完整方法论，深入解析OKR目标管理框架的设计与实施，涵盖从目标设定、过程跟踪到反馈优化的全周期，帮助企业构建敏捷高效的绩效管理体系。",
    keywords: ["持续绩效管理", "OKR", "目标管理", "绩效考核", "绩效反馈", "目标设定"],
    tags: ["持续绩效管理", "OKR", "目标管理", "绩效考核", "员工发展", "绩效管理"],
    metaDescription: "系统阐述2026年持续绩效管理的完整方法论，深入解析OKR目标管理框架的设计与实施。"
  },
  {
    id: "article-003",
    title: "AI招聘伦理与算法公平性：构建负责任的智能招聘体系",
    description: "深度探讨AI在招聘领域的伦理挑战与算法公平性问题，系统分析算法偏见、数据隐私、透明度等核心议题，提供构建负责任AI招聘体系的实践指南。",
    keywords: ["AI招聘", "算法公平性", "招聘伦理", "算法偏见", "数据隐私", "可解释AI"],
    tags: ["AI招聘", "算法伦理", "公平性", "数据隐私", "负责任AI"],
    metaDescription: "深度探讨AI在招聘领域的伦理挑战与算法公平性问题，提供构建负责任AI招聘体系的实践指南。"
  },
  {
    id: "article-004",
    title: "雇主品牌建设与人才吸引策略：打造令人向往的企业雇主品牌",
    description: "深度解析雇主品牌的战略价值与建设方法论，系统阐述员工价值主张（EVP）设计、雇主品牌传播策略、人才吸引渠道优化、候选人体验管理等核心议题，帮助企业构建差异化的人才竞争优势。",
    keywords: ["雇主品牌", "人才吸引", "招聘策略", "员工价值主张", "雇主品牌建设", "EVP", "候选人体验"],
    tags: ["雇主品牌", "人才吸引", "招聘策略", "员工价值主张", "EVP设计", "候选人体验"],
    metaDescription: "深度解析雇主品牌的战略价值与建设方法论，系统阐述员工价值主张（EVP）设计、雇主品牌传播策略、人才吸引渠道优化、候选人体验管理等核心议题。"
  },
  {
    id: "article-005",
    title: "AI如何改变招聘流程和人才筛选：从人工筛选到智能决策的范式革命",
    description: "深度解析人工智能技术如何重塑招聘全流程，涵盖简历智能解析、AI面试官、人才匹配算法、多模态评估等核心技术的应用场景与行业数据，揭示2026年AI招聘市场的最新趋势与实践经验。",
    keywords: ["AI招聘", "智能筛选", "人才匹配", "NLP简历解析", "机器学习", "算法公平性"],
    tags: ["AI招聘", "人才筛选", "招聘技术", "算法公平性", "人力资源数字化", "智能匹配"],
    metaDescription: "深度解析AI如何重塑招聘全流程：从NLP简历解析、智能人岗匹配到AI面试评估，探讨算法公平性挑战，为企业提供AI招聘实施指南。"
  },
  {
    id: "article-006",
    title: "数据驱动招聘决策：从直觉招聘到智能人才分析的转型之路",
    description: "系统阐述数据驱动招聘的完整方法论，深入解析招聘数据分析框架、人才预测模型、招聘漏斗优化等核心议题，帮助企业建立科学的招聘决策体系，实现从经验直觉到数据智能的转变。",
    keywords: ["数据驱动招聘", "人才分析", "招聘指标", "人才获取策略", "HR数字化", "预测性招聘"],
    tags: ["数据驱动招聘", "人才分析", "HR数字化", "招聘优化", "数据分析", "招聘指标"],
    metaDescription: "系统阐述数据驱动招聘的完整方法论，深入解析招聘数据分析框架、人才预测模型、招聘漏斗优化等核心议题，帮助企业建立科学的招聘决策体系。"
  },
  {
    id: "article-007",
    title: "员工体验与组织健康度：数字化时代的人才保留与组织效能提升策略",
    description: "系统阐述员工体验（EX）与组织健康度的战略价值，深入解析员工体验旅程设计、组织健康度诊断、数字化体验监测等核心议题，提供构建高韧性、高绩效组织的实践指南。",
    keywords: ["员工体验", "组织健康度", "人才保留", "员工敬业度", "eNPS", "员工旅程"],
    tags: ["员工体验", "组织健康度", "人才保留", "员工敬业度", "eNPS", "持续聆听"],
    metaDescription: "系统阐述员工体验与组织健康度的战略价值，深入解析员工体验旅程设计、组织健康度诊断、数字化体验监测等核心议题。"
  },
  {
    id: "article-008",
    title: "多元化与包容性招聘：构建创新驱动的差异化人才战略",
    description: "系统阐述多元化与包容性招聘的战略价值，深入解析消除招聘偏见、构建包容性文化、衡量多元化成效等核心议题，提供构建真正包容性组织的实践指南。",
    keywords: ["多元化招聘", "包容性招聘", "D&I", "消除偏见", "招聘偏见", "人才多元化"],
    tags: ["多元化招聘", "包容性招聘", "D&I", "消除偏见", "公平招聘", "结构化面试"],
    metaDescription: "系统阐述多元化与包容性招聘的战略价值，深入解析消除招聘偏见、构建包容性文化、衡量多元化成效等核心议题。"
  },
  {
    id: "article-009",
    title: "灵活用工与零工经济时代的人才战略转型：从全职雇佣到弹性协作",
    description: "深度解析灵活用工与零工经济的崛起对人才战略的深远影响，系统阐述弹性用工模式设计、零工人才管理、合规风险管控等核心议题，帮助企业构建适应未来工作形态的人才生态体系。",
    keywords: ["灵活用工", "零工经济", "弹性用工", "自由职业者", "零工平台", "远程工作"],
    tags: ["灵活用工", "零工经济", "弹性用工", "自由职业", "远程工作", "项目制"],
    metaDescription: "深度解析灵活用工与零工经济的崛起对人才战略的深远影响，系统阐述弹性用工模式设计、零工人才管理、合规风险管控等核心议题。"
  },
  {
    id: "article-010",
    title: "职场心理健康与员工福祉：后疫情时代的企业心理健康管理策略",
    description: "深度解析后疫情时代职场心理健康的重要性，系统阐述企业心理健康管理体系的构建方法，涵盖员工心理风险评估、心理健康支持项目、组织心理安全文化建设等核心议题，帮助企业打造健康可持续的工作环境。",
    keywords: ["职场心理健康", "员工福祉", "心理健康管理", "职业倦怠", "员工援助计划", "心理安全"],
    tags: ["职场心理健康", "员工福祉", "心理健康管理", "职业倦怠", "员工援助计划", "心理安全"],
    metaDescription: "深度解析后疫情时代职场心理健康的重要性，系统阐述企业心理健康管理体系的构建方法。"
  }
];

// 文章内容生成函数 - 基于文章ID返回完整内容
function generateArticleContent(article) {
  // 读取已有文件内容，如果没有则生成
  const filePath = `./article-${article.id.split('-')[1]}-full.md`;
  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf8');
  }
  
  // 从现有的blog-posts.json中读取内容
  const postsPath = './src/data/blog-posts.json';
  if (fs.existsSync(postsPath)) {
    const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
    const existingPost = posts.find(p => p.id === article.id);
    if (existingPost && existingPost.content && existingPost.content.length > 1000) {
      return existingPost.content;
    }
  }
  
  return null;
}

// 主函数
async function main() {
  console.log('📝 开始更新博客文章...\n');
  
  // 读取现有blog-posts.json
  const postsPath = './src/data/blog-posts.json';
  let posts = [];
  if (fs.existsSync(postsPath)) {
    posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
    console.log(`📊 当前共有 ${posts.length} 篇文章`);
  }
  
  // 更新或添加文章
  for (const article of articles) {
    const content = generateArticleContent(article);
    if (!content) {
      console.log(`⚠️  ${article.id}: 未找到完整内容，跳过`);
      continue;
    }
    
    const postData = {
      id: article.id,
      title: article.title,
      description: article.description,
      content: content,
      source: "Jobsbor原创",
      author: "Jobsbor编辑部",
      pubDate: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
      image: "",
      link: "",
      sourceCategory: "original",
      sourceLang: "zh",
      keywords: article.keywords,
      tags: article.tags,
      metaDescription: article.metaDescription
    };
    
    const existingIndex = posts.findIndex(p => p.id === article.id);
    if (existingIndex >= 0) {
      posts[existingIndex] = postData;
      console.log(`✅ 更新: ${article.id} - ${article.title.substring(0,40)}... (${content.length} 字符)`);
    } else {
      posts.push(postData);
      console.log(`✅ 新增: ${article.id} - ${article.title.substring(0,40)}... (${content.length} 字符)`);
    }
  }
  
  // 写回文件
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));
  console.log(`\n📁 已更新 ${postsPath}`);
  console.log(`📊 当前共有 ${posts.length} 篇文章`);
  
  // 统计信息
  let totalChars = 0;
  posts.forEach(p => {
    totalChars += p.content ? p.content.length : 0;
  });
  console.log(`📝 总内容长度: ${totalChars.toLocaleString()} 字符`);
  console.log(`📖 平均每篇: ${Math.floor(totalChars / posts.length).toLocaleString()} 字符`);
}

main().catch(console.error);
