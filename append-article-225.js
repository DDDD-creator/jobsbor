const fs = require('fs');

const filePath = './src/data/blog-posts.json';
let posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const content = fs.readFileSync('./article-225-content.md', 'utf8');

const article225 = {
  "id": "article-225",
  "title": "人形机器人整机集成与量产工程人才战略：当具身智能从实验室走向产线时，本体设计、系统集成与规模化制造的人才竞赛与产业生态构建",
  "description": "系统解构人形机器人整机集成与量产工程产业的人才版图，聚焦本体设计、机电一体化系统集成、制造工艺与产线设计、质量管理与可靠性工程四大核心领域，揭示具身智能从实验室样机跨越到工业化量产的人才瓶颈与企业突围之道。",
  "content": content,
  "source": "Jobsbor研究院",
  "author": "Jobsbor研究院",
  "pubDate": "2026-04-13T03:40:00.000Z",
  "image": "",
  "link": "https://jobsbor.com/blog/article-225",
  "sourceCategory": "具身智能",
  "sourceLang": "zh-CN",
  "keywords": [
    "人形机器人",
    "整机集成",
    "量产工程",
    "本体设计",
    "机电一体化",
    "系统集成",
    "制造工艺",
    "质量管理",
    "可靠性工程",
    "具身智能",
    "大规模制造",
    "供应链管理",
    "人才战略"
  ],
  "tags": [
    "人形机器人",
    "整机集成",
    "量产工程",
    "本体设计",
    "系统集成",
    "制造工艺",
    "质量管理",
    "人才战略",
    "具身智能"
  ],
  "metaDescription": "系统解构人形机器人整机集成与量产工程产业的人才版图，聚焦本体设计、系统集成、制造工艺、质量管理四大核心领域，揭示具身智能量产时代的人才瓶颈。"
};

posts.push(article225);

fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

console.log('✅ article-225 已成功追加到 blog-posts.json');
console.log(`📊 当前共有 ${posts.length} 篇文章`);
