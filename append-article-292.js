const fs = require('fs');

// 读取现有博客数据
const blogData = JSON.parse(fs.readFileSync('src/data/blog-posts.json', 'utf8'));

// 读取新文章内容
const articleContent = fs.readFileSync('article-292-content.md', 'utf8');

// 创建新文章对象
const newArticle = {
  "id": "article-292",
  "title": "具身智能与物理AI产业人才战略：当AI走出数字世界，感知-决策-执行闭环中的具身智能体与物理世界交互的人才竞赛与产业生态构建",
  "description": "深度解析具身智能与物理AI产业的人才战略图景，系统阐述感知算法、决策规划、控制执行、仿真训练等核心技术领域的人才需求与培养路径，揭示AI从虚拟走向现实过程中的人才竞争格局。",
  "content": articleContent,
  "source": "Jobsbor原创",
  "author": "Jobsbor编辑部",
  "pubDate": new Date().toISOString(),
  "image": "",
  "link": "",
  "sourceCategory": "original",
  "sourceLang": "zh",
  "keywords": [
    "具身智能",
    "物理AI",
    "感知算法",
    "决策规划",
    "控制执行",
    "Sim2Real",
    "机器人学习",
    "人形机器人",
    "自动驾驶",
    "视觉语言模型",
    "强化学习",
    "多模态感知",
    "运动控制",
    "仿真训练",
    "端到端学习",
    "数字孪生",
    "具身智能体",
    "物理世界交互",
    "AI人才"
  ],
  "tags": [
    "具身智能",
    "物理AI",
    "机器人",
    "自动驾驶",
    "AI人才",
    "人才战略",
    "产业人才"
  ],
  "metaDescription": "深度解析具身智能与物理AI产业的人才战略图景，系统阐述感知算法、决策规划、控制执行等核心技术领域的人才需求与培养路径。"
};

// 添加新文章到数组
blogData.push(newArticle);

// 写回文件
fs.writeFileSync('src/data/blog-posts.json', JSON.stringify(blogData, null, 2));

console.log(`✅ 成功追加 article-292 到 blog-posts.json`);
console.log(`📊 当前文章总数: ${blogData.length}`);
console.log(`📝 文章标题: ${newArticle.title}`);
console.log(`📅 发布时间: ${newArticle.pubDate}`);
