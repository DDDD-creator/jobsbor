const fs = require('fs');
const path = require('path');

// 读取现有博客数据
const blogPostsPath = path.join(__dirname, 'src', 'data', 'blog-posts.json');
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

// 读取 article-008 内容
const contentPath = path.join(__dirname, 'article-008-content.md');
const content = fs.readFileSync(contentPath, 'utf8');

// 创建新的文章对象
const newArticle = {
  "id": "article-008",
  "title": "多元化与包容性招聘：构建创新驱动的差异化人才战略",
  "description": "系统阐述多元化与包容性招聘的战略价值，深入解析消除招聘偏见、构建包容性文化、衡量多元化成效等核心议题，提供构建真正包容性组织的实践指南。",
  "content": content,
  "source": "Jobsbor原创",
  "author": "Jobsbor编辑部",
  "pubDate": "2026-04-11T12:00:00.000Z",
  "image": "",
  "link": "",
  "sourceCategory": "original",
  "sourceLang": "zh",
  "keywords": [
    "多元化招聘",
    "包容性招聘",
    "D&I",
    "多元化与包容性",
    "消除偏见",
    "招聘偏见",
    "人才多元化",
    "认知多元化",
    "员工体验",
    "公平招聘",
    "DEI战略",
    "无意识偏见",
    "结构化面试",
    "包容性文化",
    "心理安全",
    "员工资源小组",
    "代际多元化",
    "神经多样性",
    "多元化指标",
    "招聘公平性"
  ],
  "tags": [
    "多元化招聘",
    "包容性招聘",
    "D&I",
    "消除偏见",
    "公平招聘",
    "结构化面试",
    "包容性文化",
    "心理安全",
    "员工资源小组",
    "DEI战略",
    "人才多元化",
    "招聘创新"
  ],
  "metaDescription": "系统阐述多元化与包容性招聘的战略价值，深入解析消除招聘偏见、构建包容性文化、衡量多元化成效等核心议题，提供构建真正包容性组织的实践指南。"
};

// 追加到数组
blogPosts.push(newArticle);

// 写回文件
fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2));

console.log('✅ Article-008 has been successfully added to blog-posts.json');
console.log(`📊 Total articles: ${blogPosts.length}`);
console.log(`📝 New article: ${newArticle.title}`);
