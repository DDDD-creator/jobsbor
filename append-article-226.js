const fs = require('fs');

const filePath = './src/data/blog-posts.json';
let posts = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const content = fs.readFileSync('./article-226-content.md', 'utf8');

const article226 = {
  "id": "article-226",
  "title": "基因测序与生物信息学产业人才战略：当生命密码被批量破译时，高通量测序、生物信息分析与精准医学应用的人才竞赛与产业生态构建",
  "description": "系统解构基因测序与生物信息学产业的人才版图，聚焦高通量测序技术、生物信息学分析、临床基因组解读与生物大数据AI应用四大核心领域，揭示基因组时代从数据生产到临床转化的人才瓶颈与企业突围之道。",
  "content": content,
  "source": "Jobsbor研究院",
  "author": "Jobsbor研究院",
  "pubDate": "2026-04-13T04:00:00.000Z",
  "image": "",
  "link": "https://jobsbor.com/blog/article-226",
  "sourceCategory": "生物科技",
  "sourceLang": "zh-CN",
  "keywords": [
    "基因测序",
    "生物信息学",
    "高通量测序",
    "精准医学",
    "临床医学",
    "人工智能",
    "生物大数据",
    "遗传咨询",
    "医学遗传学",
    "NGS",
    "基因组学",
    "人才战略"
  ],
  "tags": [
    "基因测序",
    "生物信息学",
    "高通量测序",
    "精准医学",
    "人工智能",
    "生物大数据",
    "遗传咨询",
    "基因组学",
    "人才战略"
  ],
  "metaDescription": "系统解构基因测序与生物信息学产业的人才版图，聚焦测序技术、生物信息分析、临床解读与AI应用四大核心领域，揭示基因组时代的人才瓶颈。"
};

posts.push(article226);

fs.writeFileSync(filePath, JSON.stringify(posts, null, 2));

console.log('✅ article-226 已成功追加到 blog-posts.json');
console.log(`📊 当前共有 ${posts.length} 篇文章`);
