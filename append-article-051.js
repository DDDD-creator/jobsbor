const fs = require('fs');

const filePath = './src/data/blog-posts.json';
let posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const article051 = {
  "id": "article-051",
  "title": "人力资源共享服务中心的智能化演进与产品化转型：从后台职能到前台体验的服务升维之路",
  "description": "系统阐述HRSSC从传统事务处理工厂向智能化、产品化服务平台转型的完整路径，涵盖战略重构、AI赋能、服务设计、运营模式升级和绩效衡量，为企业提供可落地的实践指南。",
  "content": fs.readFileSync('./article-051-content.md', 'utf8'),
  "source": "Jobsbor原创",
  "author": "Jobsbor编辑部",
  "pubDate": "2026-04-12T06:20:00.000Z",
  "image": "",
  "link": "",
  "sourceCategory": "original",
  "sourceLang": "zh",
  "keywords": [
    "HRSSC",
    "人力资源共享服务中心",
    "智能化转型",
    "产品化转型",
    "员工体验",
    "服务设计",
    "RPA",
    "AI客服",
    "人力资源数字化",
    "敏捷HR",
    "流程自动化",
    "预测性分析",
    "服务蓝图",
    "用户体验",
    "人力资本分析",
    "共享服务",
    "HR运营",
    "成本中心",
    "价值创造",
    "服务旅程"
  ],
  "tags": [
    "HRSSC",
    "人力资源共享服务",
    "智能化转型",
    "产品化转型",
    "员工体验",
    "服务设计",
    "流程自动化",
    "AI客服",
    "人力资源数字化",
    "敏捷运营"
  ],
  "metaDescription": "系统阐述HRSSC从传统事务处理工厂向智能化、产品化服务平台转型的完整路径，涵盖战略重构、AI赋能、服务设计、运营模式升级和绩效衡量，为企业提供可落地的实践指南。"
};

posts.push(article051);
fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
console.log('Article 051 appended. Total:', posts.length);
