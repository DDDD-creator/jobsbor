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
  // === 科技类 ===
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'technology', lang: 'en' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'technology', lang: 'en' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', category: 'technology', lang: 'en' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'technology', lang: 'en' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'technology', lang: 'en' },
  { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', category: 'technology', lang: 'en' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/feed/', category: 'technology', lang: 'en' },
  { name: 'Hacker News Best', url: 'https://hnrss.org/best', category: 'technology', lang: 'en' },

  // === Web3/区块链 ===
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss', category: 'web3', lang: 'en' },
  { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'web3', lang: 'en' },
  { name: 'Decrypt', url: 'https://decrypt.co/feed', category: 'web3', lang: 'en' },
  { name: 'The Block', url: 'https://www.theblock.co/rss.xml', category: 'web3', lang: 'en' },
  { name: 'Ethereum Blog', url: 'https://blog.ethereum.org/feed', category: 'web3', lang: 'en' },
  { name: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com/.rss/full/', category: 'web3', lang: 'en' },

  // === 远程工作/职业 ===
  { name: 'RemoteOK', url: 'https://remoteok.com/rss', category: 'remote-work', lang: 'en' },
  { name: 'WeWorkRemotely', url: 'https://weworkremotely.com/feed', category: 'remote-work', lang: 'en' },
  { name: 'FlexJobs', url: 'https://www.flexjobs.com/blog/feed/', category: 'remote-work', lang: 'en' },

  // === 创业/商业 ===
  { name: 'Entrepreneur', url: 'https://www.entrepreneur.com/latest.rss', category: 'business', lang: 'en' },
  { name: 'Inc', url: 'https://www.inc.com/rss/feed/', category: 'business', lang: 'en' },
  { name: 'Forbes Tech', url: 'https://www.forbes.com/technology/feed/', category: 'business', lang: 'en' },
  { name: 'Business Insider', url: 'https://www.businessinsider.com/rss', category: 'business', lang: 'en' },
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
    const creator = extract('dc:creator') || extract('author') || extract('name');
    const category = extract('category');
    
    // Get image from various sources
    const imgMatch = content.match(/<media:content[^>]*url="([^"]*)"/);
    const enclosureMatch = content.match(/<enclosure[^>]*url="([^"]*)"/);
    const imgInDesc = description?.match(/<img[^>]*src="([^"]*)"/);
    const imageUrl = imgMatch?.[1] || enclosureMatch?.[1] || imgInDesc?.[1] || '';
    
    if (title && link) {
      items.push({
        title,
        link,
        description: description?.replace(/<[^>]*>/g, '').substring(0, 300) || '',
        pubDate: pubDate || new Date().toISOString(),
        author: creator || 'Unknown',
        category: category || 'general',
        image: imageUrl,
      });
    }
  }
  
  return items;
}

// Try alternate parsing for feeds that don't use <item> tags
function parseRSSAlt(xml) {
  const items = [];
  
  // Try Atom format
  const entryRegex = /<entry[^>]*>([\s\S]*?)<\/entry>/g;
  let match;
  
  while ((match = entryRegex.exec(xml)) !== null) {
    const content = match[1];
    const extract = (tag) => {
      const m = content.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].replace(/<[^>]*>/g, '').trim() : '';
    };
    
    const title = extract('title');
    const linkMatch = content.match(/<link[^>]*href="([^"]*)"/);
    const link = linkMatch?.[1] || extract('link');
    const summary = extract('summary') || extract('content');
    const published = extract('published') || extract('updated');
    const author = extract('name');
    
    if (title && link) {
      items.push({
        title,
        link,
        description: summary?.replace(/<[^>]*>/g, '').substring(0, 300) || '',
        pubDate: published || new Date().toISOString(),
        author: author || 'Unknown',
        category: 'general',
        image: '',
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
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(15000),
    });
    
    if (!response.ok) {
      console.warn(`  ✗ HTTP ${response.status}: ${feed.name}`);
      return [];
    }
    
    const xml = await response.text();
    
    // Try standard RSS parsing first, then Atom
    let items = parseRSS(xml);
    if (items.length === 0) {
      items = parseRSSAlt(xml);
    }
    
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
  console.log(`Total sources: ${RSS_FEEDS.length}`);
  
  // Fetch in batches to avoid overwhelming
  const results = [];
  const batchSize = 5;
  
  for (let i = 0; i < RSS_FEEDS.length; i += batchSize) {
    const batch = RSS_FEEDS.slice(i, i + batchSize);
    console.log(`\n--- Batch ${Math.floor(i/batchSize) + 1} ---`);
    const batchResults = await Promise.allSettled(batch.map(fetchFeed));
    results.push(...batchResults);
    if (i + batchSize < RSS_FEEDS.length) {
      await new Promise(r => setTimeout(r, 1000)); // Rate limit
    }
  }
  
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
  
  // Take latest 200
  const latest = unique.slice(0, 200);
  
  // Write to data file
  const outputPath = join(__dirname, '..', 'src', 'data', 'blog-posts.json');
  await fs.writeFile(outputPath, JSON.stringify(latest, null, 2), 'utf-8');
  
  console.log(`\n✅ Saved ${latest.length} blog posts to src/data/blog-posts.json`);
  console.log(`📅 Date range: ${latest[latest.length-1]?.pubDate || 'N/A'} → ${latest[0]?.pubDate || 'N/A'}`);
  
  // Source breakdown
  const sourceCount = {};
  const categoryCount = {};
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
