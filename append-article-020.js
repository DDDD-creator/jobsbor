const fs = require('fs');

// 读取现有文件
const filePath = './src/data/blog-posts.json';
let posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// 读取 article-020 的 markdown 内容
const articleContent = fs.readFileSync('./article-020.md', 'utf8');

// article-020 内容
const article020 = {
  "id": "article-020",
  "title": "数字化转型与HR科技生态系统：构建智能人力资源管理的数字底座",
  "description": "系统阐述HR数字化转型的战略框架与HR科技生态系统的构建方法论，深入解析核心技术选型、数据整合策略、变革管理要点及未来演进趋势，帮助企业打造智能化人才管理的数字基础设施。",
  "content": articleContent,
  "source": "Jobsbor原创",
  "author": "Jobsbor编辑部",
  "pubDate": "2026-04-12T01:45:00.000Z",
  "image": "",
  "link": "",
  "sourceCategory": "original",
  "sourceLang": "zh",
  "keywords": [
    "HR数字化转型",
    "人力资源科技",
    "HR科技生态",
    "智能人力资源管理",
    "HRIS",
    "人才管理系统",
    "数据驱动决策",
    "员工体验平台",
    "RPA自动化",
    "AI人力资源管理"
  ],
  "tags": [
    "HR数字化",
    "人力资源科技",
    "HR科技生态",
    "智能HR",
    "人才管理",
    "数据驱动"
  ],
  "metaDescription": "系统阐述HR数字化转型的战略框架与HR科技生态系统的构建方法论，深入解析核心技术选型、数据整合策略、变革管理要点及未来演进趋势。"
};

// 追加新文章
posts.push(article020);

// 写回文件
fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

console.log('✅ article-020 已成功追加到 blog-posts.json');
console.log(`📊 当前共有 ${posts.length} 篇文章`);
