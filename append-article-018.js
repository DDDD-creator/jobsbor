const fs = require('fs');
const path = require('path');

// 读取现有文章
const blogPostsPath = path.join(__dirname, 'src', 'data', 'blog-posts.json');
const blogPosts = JSON.parse(fs.readFileSync(blogPostsPath, 'utf8'));

// 读取新文章
const newArticlePath = path.join(__dirname, 'article-018.json');
const newArticle = JSON.parse(fs.readFileSync(newArticlePath, 'utf8'));

// 检查是否已存在该文章
const exists = blogPosts.some(post => post.id === newArticle.id);
if (exists) {
  console.log('Article 018 already exists, skipping...');
  process.exit(0);
}

// 追加新文章
blogPosts.push(newArticle);

// 写回文件
fs.writeFileSync(blogPostsPath, JSON.stringify(blogPosts, null, 2), 'utf8');
console.log('Successfully appended article-018 to blog-posts.json');
console.log(`Total articles: ${blogPosts.length}`);