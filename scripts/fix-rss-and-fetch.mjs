/**
 * Blog RSS Fetcher with format auto-detection
 */

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const RSS_FEEDS = [
  // === 科技类 ===
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'technology', lang: 'en' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'technology', lang: 'en' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', category: 'technology', lang: 'en' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'technology', lang: 'en' },
  { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', category: 'technology', lang: 'en' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/feed/', category: 'technology', lang: 'en' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'technology', lang: 'en' },
  { name: 'Hacker News Best', url: 'https://hnrss.org/best', category: 'technology', lang: 'en' },

  // === Web3/区块链 ===
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss', category: 'web3', lang: 'en' },
  { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'web3', lang: 'en' },
  { name: 'Decrypt', url: 'https://decrypt.co/feed', category: 'web3', lang: 'en' },
  { name: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com/.rss/full/', category: 'web3', lang: 'en' },

  // === 远程工作 ===
  { name: 'FlexJobs', url: 'https://www.flexjobs.com/blog/feed/', category: 'remote-work', lang: 'en' },

  // === 商业 ===
  { name: 'Inc', url: 'https://www.inc.com/rss/feed/', category: 'business', lang: 'en' },
  { name: 'Business Insider', url: 'https://www.businessinsider.com/rss', category: 'business', lang: 'en' },
];

function extractText(content, tag) {
  if (!content) return '';
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`);
  const m = content.match(regex);
  return m ? m[1].replace(/<[^>]*>/g, '').trim() : '';
}

function extractImage(content) {
  if (!content) return '';
  const patterns = [
    /<media:content[^>]*url="([^"]*)"/,
    /<enclosure[^>]*url="([^"]*)"/,
    /<media:thumbnail[^>]*url="([^"]*)"/,
    /<image[^>]*url="([^"]*)"/,
    /<img[^>]*src="([^"]*)"/,
    /<content[^>]*type="image"[^>]*src="([^"]*)"/,
  ];
  for (const p of patterns) {
    const m = content.match(p);
    if (m) return m[1];
  }
  return '';
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const c = match[1];
    const title = extractText(c, 'title');
    const link = extractText(c, 'link');
    const description = extractText(c, 'description');
    const pubDate = extractText(c, 'pubDate');
    const creator = extractText(c, 'dc:creator') || extractText(c, 'author') || extractText(c, 'name');
    const category = extractText(c, 'category');
    const image = extractImage(c);
    if (title && link) {
      items.push({ title, link, description: description.substring(0, 300), pubDate: pubDate || new Date().toISOString(), author: creator || 'Unknown', category: category || 'general', image });
    }
  }
  return items;
}

function parseAtom(xml) {
  const items = [];
  const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const c = match[1];
    const title = extractText(c, 'title');
    const linkMatch = c.match(/<link[^>]*href="([^"]*)"/);
    const link = linkMatch ? linkMatch[1] : extractText(c, 'link');
    const summary = extractText(c, 'summary') || extractText(c, 'content') || '';
    const published = extractText(c, 'published') || extractText(c, 'updated');
    const nameMatch = c.match(/<name>([^<]+)<\/name>/);
    const author = nameMatch ? nameMatch[1] : '';
    const image = extractImage(c);
    if (title && link) {
      items.push({ title, link, description: summary.replace(/<[^>]*>/g, '').substring(0, 300), pubDate: published || new Date().toISOString(), author: author || 'Unknown', category: 'general', image });
    }
  }
  return items;
}

function parseFeed(xml) {
  // Auto-detect format
  if (xml.includes('<feed') && xml.includes('xmlns="http://www.w3.org/2005/Atom"')) {
    return parseAtom(xml);
  }
  if (xml.includes('<entry>') && !xml.includes('<item>')) {
    return parseAtom(xml);
  }
  return parseRSS(xml);
}

async function fetchFeed(feed) {
  console.log(`  Fetching: ${feed.name}`);
  try {
    const response = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobsborBot/1.0; +https://jobsbor.vercel.app)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(15000),
    });
    
    if (!response.ok) {
      console.warn(`    ✗ HTTP ${response.status}`);
      return [];
    }
    
    const xml = await response.text();
    const items = parseFeed(xml);
    console.log(`    ✓ ${items.length} articles`);
    
    return items.map(item => ({
      ...item,
      id: Buffer.from(item.link).toString('base64url').substring(0, 16),
      source: feed.name,
      sourceCategory: feed.category,
      sourceLang: feed.lang,
      fetchedAt: new Date().toISOString(),
    }));
  } catch (err) {
    console.warn(`    ✗ ${err.message}`);
    return [];
  }
}

async function main() {
  console.log('📡 Fetching blog RSS feeds...\n');
  
  const results = [];
  const batchSize = 4;
  
  for (let i = 0; i < RSS_FEEDS.length; i += batchSize) {
    const batch = RSS_FEEDS.slice(i, i + batchSize);
    console.log(`\n--- Batch ${Math.floor(i/batchSize) + 1} ---`);
    const batchResults = await Promise.allSettled(batch.map(fetchFeed));
    results.push(...batchResults);
    if (i + batchSize < RSS_FEEDS.length) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  
  const allPosts = results.filter(r => r.status === 'fulfilled').flatMap(r => r.value);
  
  // Deduplicate by link
  const seen = new Set();
  const unique = allPosts.filter(p => {
    if (seen.has(p.link)) return false;
    seen.add(p.link);
    return true;
  });
  
  unique.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  const latest = unique.slice(0, 300);
  
  const outputPath = join(__dirname, '..', 'src', 'data', 'blog-posts.json');
  await fs.writeFile(outputPath, JSON.stringify(latest, null, 2), 'utf-8');
  
  console.log(`\n✅ Saved ${latest.length} blog posts`);
  console.log(`📅 ${latest[latest.length-1]?.pubDate?.substring(0, 16) || 'N/A'} → ${latest[0]?.pubDate?.substring(0, 16) || 'N/A'}`);
  
  const sourceCount = {}, categoryCount = {};
  latest.forEach(p => {
    sourceCount[p.source] = (sourceCount[p.source] || 0) + 1;
    categoryCount[p.sourceCategory] = (categoryCount[p.sourceCategory] || 0) + 1;
  });
  
  console.log('\n📂 Sources:');
  Object.entries(sourceCount).sort((a,b) => b[1]-a[1]).forEach(([s, c]) => console.log(`  ${s}: ${c}`));
  console.log('\n📁 Categories:');
  Object.entries(categoryCount).sort((a,b) => b[1]-a[1]).forEach(([c, n]) => console.log(`  ${c}: ${n}`));
}

main().catch(console.error);
