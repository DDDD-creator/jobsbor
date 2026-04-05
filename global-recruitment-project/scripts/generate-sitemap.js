const fs = require('fs');
const path = require('path');

const jobs = JSON.parse(fs.readFileSync('./src/data/real-jobs/all-jobs-final.json', 'utf8'));

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jobsbor.vercel.app</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jobsbor.vercel.app/jobs</loc>
    <changefreq>hourly</changefreq>
    <priority>0.9</priority>
  </url>
`;

// 添加职位页面
jobs.forEach(job => {
  const slug = `${job.company.toLowerCase().replace(/\s+/g, '-')}-${job.title.toLowerCase().replace(/\s+/g, '-').substring(0, 30)}`;
  sitemap += `  <url>
    <loc>https://jobsbor.vercel.app/jobs/${slug}</loc>
    <lastmod>${new Date(job.postedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>\n`;
});

sitemap += '</urlset>';

fs.writeFileSync('./public/sitemap.xml', sitemap);
console.log(`✅ Sitemap生成完成: ${jobs.length} 个职位`);
