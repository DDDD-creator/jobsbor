/**
 * IndexNow Protocol Submission
 * Submits URLs to Bing and Yandex for fast indexing
 * Usage: node scripts/submit-indexnow.mjs
 */

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = 'https://jobsbor.vercel.app';
const LOCALES = ['zh', 'en'];

// Core pages
const CORE_PAGES = ['', '/jobs', '/companies', '/guide', '/blog', '/about', '/contact', '/privacy', '/terms'];

async function getAllUrls() {
  const urls = [];
  
  // Core pages
  for (const locale of LOCALES) {
    for (const page of CORE_PAGES) {
      urls.push(`${SITE_URL}/${locale}${page}`);
    }
  }
  
  // Job pages
  try {
    const jobsModule = await import('../src/data/jobs.ts');
    const jobs = jobsModule.jobs || [];
    for (const locale of LOCALES) {
      for (const job of jobs) {
        urls.push(`${SITE_URL}/${locale}/jobs/${job.slug}`);
      }
    }
  } catch (e) {
    console.warn('Could not load jobs:', e.message);
  }
  
  // Blog posts
  try {
    const blogData = await fs.readFile(join(__dirname, '..', 'src', 'data', 'blog-posts.json'), 'utf-8');
    const posts = JSON.parse(blogData);
    for (const post of posts) {
      urls.push(`${SITE_URL}/${LOCALES[0]}/blog/${post.id}`);
    }
  } catch (e) {
    console.warn('Could not load blog posts:', e.message);
  }
  
  return [...new Set(urls)]; // Deduplicate
}

async function submitToIndexNow(urls, key) {
  const payload = {
    host: 'jobsbor.vercel.app',
    key,
    keyLocation: `${SITE_URL}/${key}.txt`,
    urlList: urls,
  };
  
  const engines = [
    { name: 'Bing', url: 'https://www.bing.com/indexnow' },
    { name: 'Yandex', url: 'https://yandex.com/indexnow' },
  ];
  
  for (const engine of engines) {
    try {
      const response = await fetch(engine.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log(`${engine.name}: ${response.status} ${response.statusText}`);
    } catch (err) {
      console.warn(`${engine.name}: Failed - ${err.message}`);
    }
  }
}

async function main() {
  console.log('🚀 IndexNow URL Submission\n');
  
  const urls = await getAllUrls();
  console.log(`Total URLs to submit: ${urls.length}`);
  
  // Sample URLs
  console.log('\nSample URLs:');
  urls.slice(0, 10).forEach(u => console.log(`  ${u}`));
  if (urls.length > 10) console.log(`  ... and ${urls.length - 10} more`);
  
  console.log('\n⚠️  To complete submission, you need an IndexNow API key.');
  console.log('\nSteps to get a key:');
  console.log('1. Generate a random hex key: node -e "console.log(require(\'crypto\').randomBytes(16).toString(\'hex\'))"');
  console.log('2. Create a text file at: public/{YOUR_KEY}.txt');
  console.log('3. File content should be just the key');
  console.log('4. Run this script again with the key');
  console.log('\nOr manually submit URLs at:');
  console.log('  https://www.bing.com/webmasters/url-submission-api');
  console.log('  https://yandex.com/support/webmaster/indexing-options/indexnow.html');
}

main().catch(console.error);
