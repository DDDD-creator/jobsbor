const fs = require('fs');

const filePath = './src/data/blog-posts.json';
let posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const content = fs.readFileSync('./article-223-content.md', 'utf8');

const article223 = {
  "id": "article-223",
  "title": "先进计算与智能算力产业人才战略：当算力成为新质生产力核心引擎时，超级计算、智算中心与算力互联网的人才竞赛与产业生态构建",
  "description": "系统解构先进计算与智能算力产业的人才版图，聚焦超级计算、人工智能智算中心与算力互联网三大核心领域，揭示算力觉醒时代下人才争夺的深层瓶颈与企业应对之道。",
  "content": content,
  "source": "Jobsbor研究院",
  "author": "Jobsbor研究院",
  "pubDate": "2026-04-13T03:15:00.000Z",
  "image": "",
  "link": "https://jobsbor.com/blog/article-223",
  "sourceCategory": "先进计算",
  "sourceLang": "zh-CN",
  "keywords": [
    "先进计算",
    "智能算力",
    "超级计算",
    "智算中心",
    "算力互联网",
    "东数西算",
    "高性能计算",
    "AI基础设施",
    "算力网络",
    "异构计算",
    "并行计算",
    "国产算力",
    "人才战略",
    "新质生产力"
  ],
  "tags": [
    "先进计算",
    "智能算力",
    "超级计算",
    "智算中心",
    "算力互联网",
    "人才战略",
    "AI基础设施",
    "东数西算"
  ],
  "metaDescription": "系统解构先进计算与智能算力产业的人才版图，聚焦超级计算、智算中心与算力互联网三大核心领域，揭示算力觉醒时代下人才争夺的深层瓶颈与企业应对之道。"
};

posts.push(article223);

fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

console.log('✅ article-223 已成功追加到 blog-posts.json');
console.log(`📊 当前共有 ${posts.length} 篇文章`);
