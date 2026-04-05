/**
 * Blog RSS Fetcher
 * Fetches articles from global tech/Web3/career RSS feeds
 * and generates static JSON data for the blog section.
 *
 * Usage: node scripts/fetch-blog-rss.mjs
 */

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Global RSS feed sources - tech, Web3, remote work, career
const RSS_FEEDS = [
  {
    name: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
    category: 'technology',
    lang: 'en',
  },
  {
    name: 'Hacker News Best',
    url: 'https://hnrss.org/best',
    category: 'technology',
    lang: 'en',
  },
  {
    name: 'Web3 News',
    url: 'https://cointelegraph.com/rss',
    category: 'web3',
    lang: 'en',
  },
  {
    name: 'Remote Work',
    url: 'https://remoteok.com/rss',
    category: 'remote-work',
    lang: 'en',
  },
  {
    name: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'technology',
    lang: 'en',
  },
  {
    name: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
    category: 'technology',
    lang: 'en',
  },
  {
    name: 'MIT Tech Review',
    url: 'https://www.technologyreview.com/feed/',
    category: 'technology',
    lang: 'en',
  },
  {
    name: 'Coindesk',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: 'web3',
    lang: 'en',
  },
];

// Simple XML parser (no external dependencies)
function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const content = match[1];
    const extract = (tag) => {
      const m = content.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].replace(/<[^>]*>/g, '').trim() : '';
    };
    
    const title = extract('title');
    const link = extract('link');
    const description = extract('description');
    const pubDate = extract('pubDate');
    const creator = extract('dc:creator') || extract('author');
    const category = extract('category');
    
    // Get enclosure image
    const imgMatch = content.match(/<media:content[^>]*url="([^"]*)"/);
    const enclosureMatch = content.match(/<enclosure[^>]*url="([^"]*)"/);
    const imgInDesc = description.match(/<img[^>]*src="([^"]*)"/);
    const image = imgMatch?.[1] || enclosureMatch?.[1] || imgInDesc?.[1] || '';
    
    if (title && link) {
      items.push({
        title,
        link,
        description: description.replace(/<[^>]*>/g, '').substring(0, 300),
        pubDate: pubDate || new Date().toISOString(),
        author: creator || 'Unknown',
        category: category || 'general',
        image,
      });
    }
  }
  
  return items;
}

async function fetchFeed(feed) {
  console.log(`Fetching: ${feed.name} (${feed.url})`);
  try {
    const response = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobsborBot/1.0; +https://jobsbor.vercel.app)',
      },
      signal: AbortSignal.timeout(15000),
    });
    
    if (!response.ok) {
      console.warn(`  ✗ HTTP ${response.status}: ${feed.name}`);
      return [];
    }
    
    const xml = await response.text();
    const items = parseRSS(xml);
    console.log(`  ✓ ${items.length} articles from ${feed.name}`);
    
    return items.map(item => ({
      ...item,
      id: Buffer.from(item.link).toString('base64url').substring(0, 16),
      source: feed.name,
      sourceCategory: feed.category,
      sourceLang: feed.lang,
      fetchedAt: new Date().toISOString(),
    }));
  } catch (err) {
    console.warn(`  ✗ Failed: ${feed.name} - ${err.message}`);
    return [];
  }
}

async function main() {
  console.log('📡 Fetching blog RSS feeds...\n');
  
  const results = await Promise.allSettled(
    RSS_FEEDS.map(fetchFeed)
  );
  
  const allPosts = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value);
  
  // Deduplicate by link
  const seen = new Set();
  const unique = allPosts.filter(p => {
    if (seen.has(p.link)) return false;
    seen.add(p.link);
    return true;
  });
  
  // Sort by date
  unique.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  
  // Take latest 100
  const latest = unique.slice(0, 100);
  
  // Write to data file
  const outputPath = join(__dirname, '..', 'src', 'data', 'blog-posts.json');
  await fs.writeFile(outputPath, JSON.stringify(latest, null, 2), 'utf-8');
  
  console.log(`\n✅ Saved ${latest.length} blog posts to src/data/blog-posts.json`);
  console.log(`📅 Date range: ${latest[latest.length-1]?.pubDate} → ${latest[0]?.pubDate}`);
  console.log(`📂 Sources: ${[...new Set(latest.map(p => p.source))].join(', ')}`);
}

main().catch(console.error);
