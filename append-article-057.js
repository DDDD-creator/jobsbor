const fs = require('fs');

const filePath = './src/data/blog-posts.json';
let posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const article057 = {
  "id": "article-057",
  "title": "人才可持续发展：构建全生命周期人才价值循环的闭环战略",
  "description": "系统阐述人才可持续发展的战略内涵，深入解析全生命周期闭环设计、数字化技术赋能路径与组织实施要点，帮助企业构建生生不息的人才生态系统，实现从线性消耗到循环增值的范式跃迁。",
  "content": fs.readFileSync('./article-057-content.md', 'utf8'),
  "source": "Jobsbor原创",
  "author": "Jobsbor编辑部",
  "pubDate": "2026-04-11T23:00:00.000Z",
  "image": "",
  "link": "",
  "sourceCategory": "original",
  "sourceLang": "zh",
  "keywords": [
    "人才可持续发展",
    "循环经济",
    "全生命周期管理",
    "人才闭环",
    "内部人才市场",
    "校友网络",
    "回旋镖员工",
    "离职管理",
    "人才生态系统",
    "员工终身价值",
    "人才保留",
    "数字化人才管理",
    "技能图谱",
    "人才流动",
    "ESG人才管理"
  ],
  "tags": [
    "人才可持续发展",
    "全生命周期管理",
    "循环经济",
    "人才生态系统",
    "内部人才市场",
    "校友网络",
    "员工终身价值",
    "人才保留",
    "数字化赋能",
    "闭环战略"
  ],
  "metaDescription": "系统阐述人才可持续发展的战略内涵，深入解析全生命周期闭环设计、数字化技术赋能路径与组织实施要点，帮助企业构建生生不息的人才生态系统。"
};

posts.push(article057);
fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
console.log('Article 057 appended. Total:', posts.length);
