const fs = require('fs');

// 读取blog-posts.json
const postsPath = './src/data/blog-posts.json';
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

// 读取各文章的完整内容
const articleContents = {
  'article-001': fs.readFileSync('./article-001-full.md', 'utf8'),
  'article-002': fs.readFileSync('./article-002-full.md', 'utf8'),
  'article-003': fs.readFileSync('./article-003-full.md', 'utf8'),
  'article-004': fs.readFileSync('./article-004-full.md', 'utf8'),
  'article-005': fs.readFileSync('./article-005-full.md', 'utf8'),
  'article-006': fs.readFileSync('./article-006-full.md', 'utf8'),
  'article-007': fs.readFileSync('./article-007-full.md', 'utf8'),
  'article-008': fs.readFileSync('./article-008-full.md', 'utf8'),
  'article-009': fs.readFileSync('./article-009-full.md', 'utf8'),
  'article-010': fs.readFileSync('./article-010-full.md', 'utf8')
};

// 更新每篇文章的内容
let updatedCount = 0;
posts.forEach(post => {
  if (articleContents[post.id]) {
    post.content = articleContents[post.id];
    updatedCount++;
    console.log(`✅ 更新: ${post.id} - ${post.title.substring(0,40)}... (${post.content.length} 字符)`);
  }
});

// 写回文件
fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2));

console.log(`\n📁 已更新 ${postsPath}`);
console.log(`📊 更新了 ${updatedCount} 篇文章`);
console.log(`📊 当前共有 ${posts.length} 篇文章`);

// 统计信息
let totalChars = 0;
posts.forEach(p => {
  totalChars += p.content ? p.content.length : 0;
});
console.log(`📝 总内容长度: ${totalChars.toLocaleString()} 字符`);
console.log(`📖 平均每篇: ${Math.floor(totalChars / posts.length).toLocaleString()} 字符`);
