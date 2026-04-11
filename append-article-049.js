const fs = require('fs');

const filePath = './src/data/blog-posts.json';
let posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const article049 = {
  "id": "article-049",
  "title": "招聘团队能力建设与人才获取职能升级：从执行者到战略伙伴的专业化进化之路",
  "description": "系统阐述现代企业人才获取团队的能力升级路径，从职能定位、能力模型、运营体系、生态合作、数据科技和价值衡量六个维度，为企业提供构建世界级招聘职能的完整框架与实践指南。",
  "content": fs.readFileSync('./article-049-content.md', 'utf8'),
  "source": "Jobsbor原创",
  "author": "Jobsbor编辑部",
  "pubDate": "2026-04-12T05:50:00.000Z",
  "image": "",
  "link": "",
  "sourceCategory": "original",
  "sourceLang": "zh",
  "keywords": [
    "招聘团队",
    "人才获取",
    "招聘能力建设",
    "招聘职能升级",
    "战略招聘",
    "招聘运营",
    "猎头管理",
    "招聘科技",
    "招聘数据",
    "雇主品牌",
    "人才寻猎",
    "招聘流程",
    "招聘ROI",
    "面试官管理",
    "人才管道",
    "招聘外包"
  ],
  "tags": [
    "招聘团队",
    "人才获取",
    "招聘能力",
    "招聘运营",
    "猎头合作",
    "招聘科技",
    "数据驱动招聘",
    "雇主品牌",
    "招聘战略",
    "人才寻猎"
  ],
  "metaDescription": "系统阐述现代企业人才获取团队的能力升级路径，从职能定位、能力模型、运营体系、生态合作、数据科技和价值衡量六个维度，为企业提供构建世界级招聘职能的完整框架与实践指南。"
};

posts.push(article049);
fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));
console.log('Article 049 appended. Total:', posts.length);
