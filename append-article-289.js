const fs = require('fs');
const path = require('path');

// Read the blog-posts.json file
const blogPostsPath = path.join(__dirname, 'src', 'data', 'blog-posts.json');
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

// Read the article content
const articleContent = fs.readFileSync(path.join(__dirname, 'article-289-content.md'), 'utf8');

// Create new article entry
const newArticle = {
  "id": "article-289",
  "title": "智能传感网络与边缘智能产业人才战略：当万物智联遇上分布式智能时，MEMS传感、无线感知与边缘AI的人才竞赛与产业生态构建",
  "description": "系统解构智能传感网络与边缘智能产业的人才版图，聚焦MEMS传感器、无线传感网络与边缘AI推理三大核心技术领域，揭示万物智联时代下人才争夺的深层瓶颈与企业应对之道。",
  "content": articleContent,
  "source": "Jobsbor研究院",
  "author": "Jobsbor研究院",
  "pubDate": new Date().toISOString(),
  "image": "",
  "link": "https://jobsbor.com/blog/article-289",
  "sourceCategory": "边缘智能",
  "sourceLang": "zh-CN",
  "keywords": [
    "智能传感",
    "边缘智能",
    "MEMS传感器",
    "无线传感网络",
    "边缘AI",
    "物联网",
    "TinyML",
    "万物智联",
    "人才战略",
    "感知网络"
  ],
  "tags": [
    "智能传感",
    "边缘智能",
    "MEMS",
    "物联网",
    "边缘AI",
    "人才战略",
    "无线感知"
  ],
  "metaDescription": "系统解构智能传感网络与边缘智能产业的人才版图，聚焦MEMS传感器、无线传感网络与边缘AI推理三大核心技术领域的人才需求与竞争态势。"
};

// Add the new article to the array
blogPosts.push(newArticle);

// Write the updated blog-posts.json back
fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2));

console.log('Article-289 has been successfully appended to blog-posts.json');
console.log(`Total articles: ${blogPosts.length}`);
