const fs = require('fs');

const filePath = './src/data/blog-posts.json';
let posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const article056 = {
  "id": "article-056",
  "title": "职业信用体系与数字化背景调查：构建可信人才供应链的智能验证战略",
  "description": "系统阐述职业信用在人才管理中的战略价值，深入解析数字化背景调查的技术演进、职业信用体系构建、合规边界与最佳实践，为企业提供构建可信人才供应链的完整指南。",
  "content": fs.readFileSync('./article-056-content.md', 'utf8'),
  "source": "Jobsbor原创",
  "author": "Jobsbor编辑部",
  "pubDate": "2026-04-11T22:50:00.000Z",
  "image": "",
  "link": "",
  "sourceCategory": "original",
  "sourceLang": "zh",
  "keywords": [
    "职业信用",
    "背景调查",
    "数字化背调",
    "简历造假",
    "学历验证",
    "区块链学历",
    "AI背调",
    "社交媒体筛查",
    "职业信用评分",
    "人才验证",
    "错误招聘",
    "合规背调",
    "个人信息保护",
    "第三方背调",
    "黑名单共享",
    "职场诚信",
    "招聘风险"
  ],
  "tags": [
    "职业信用",
    "背景调查",
    "数字化背调",
    "人才验证",
    "招聘风险",
    "简历造假",
    "区块链学历",
    "AI背调",
    "合规与隐私",
    "职场诚信"
  ],
  "metaDescription": "系统阐述职业信用在人才管理中的战略价值，深入解析数字化背景调查的技术演进、职业信用体系构建、合规边界与最佳实践，为企业提供构建可信人才供应链的完整指南。"
};

posts.push(article056);
fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
console.log('Article 056 appended. Total:', posts.length);
