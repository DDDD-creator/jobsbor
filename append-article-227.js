const fs = require('fs');

const filePath = './src/data/blog-posts.json';
let posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const content = fs.readFileSync('./article-227-content.md', 'utf8');

const article227 = {
  "id": "article-227",
  "title": "动力电池回收与梯次利用产业人才战略：当新能源汽车迎来退役潮时，拆解分选、再生冶炼与梯次储能的人才竞赛与产业生态构建",
  "description": "系统解构动力电池回收与梯次利用产业的人才版图，聚焦退役电池检测评估、自动化拆解、湿法冶金再生、梯次利用集成与全生命周期溯源五大核心领域，揭示新能源产业链闭环时代的人才瓶颈与企业突围之道。",
  "content": content,
  "source": "Jobsbor研究院",
  "author": "Jobsbor研究院",
  "pubDate": "2026-04-13T05:00:00.000Z",
  "image": "",
  "link": "https://jobsbor.com/blog/article-227",
  "sourceCategory": "新能源",
  "sourceLang": "zh-CN",
  "keywords": [
    "动力电池回收",
    "梯次利用",
    "新能源汽车",
    "湿法冶金",
    "自动化拆解",
    "储能系统",
    "循环经济",
    "电池溯源",
    "碳足迹",
    "人才战略"
  ],
  "tags": [
    "动力电池回收",
    "梯次利用",
    "新能源汽车",
    "湿法冶金",
    "自动化拆解",
    "储能系统",
    "循环经济",
    "人才战略"
  ],
  "metaDescription": "系统解构动力电池回收与梯次利用产业的人才版图，聚焦检测评估、自动化拆解、湿法冶金、梯次利用与溯源管理五大核心领域，揭示新能源产业链闭环时代的人才瓶颈。"
};

posts.push(article227);

fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

console.log('✅ article-227 已成功追加到 blog-posts.json');
console.log(`📊 当前共有 ${posts.length} 篇文章`);
