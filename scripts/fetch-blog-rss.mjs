/**
 * Blog RSS Fetcher v4 - Anti-scraping bypass
 * Strategy: Sequential fetch with retry + backoff + RSSHub proxy fallback
 */
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const RSS_FEEDS = [
  // === Technology ===
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'technology' },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'technology' },
  { name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', category: 'technology' },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss', category: 'technology' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'technology' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/feed/', category: 'technology' },
  { name: 'Hacker News Best', url: 'https://hnrss.org/best', category: 'technology' },
  // === Web3 ===
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss', category: 'web3' },
  { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'web3' },
  { name: 'Decrypt', url: 'https://decrypt.co/feed', category: 'web3' },
  { name: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com/.rss/full/', category: 'web3' },
  // === Business ===
  { name: 'Inc', url: 'https://www.inc.com/rss/feed/', category: 'business' },
  { name: 'Business Insider', url: 'https://www.businessinsider.com/rss', category: 'business' },
  // === Remote Work ===
  { name: 'FlexJobs', url: 'https://www.flexjobs.com/blog/feed/', category: 'remote-work' },
];

// RSSHub public instances as fallback
const RSSHUB_INSTANCES = [
  'https://rsshub.app',
  'https://rsshub.rssforever.com',
];

function getRSSHubUrl(originalUrl) {
  // Extract domain and path for RSSHub routing
  try {
    const u = new URL(originalUrl);
    const domain = u.hostname.replace('www.', '');
    const path = u.pathname.replace(/^\//, '');
    return `https://rsshub.app/${domain}/${path}`;
  } catch {
    return null;
  }
}

function stripCdata(s) {
  if (!s) return '';
  return s.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').trim();
}

function extractTag(content, tag) {
  const regex = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i');
  const m = content.match(regex);
  if (!m) return '';
  // Strip CDATA first (before HTML tag removal), since CDATA content may contain '>' chars
  return stripCdata(m[1]).replace(/<[^>]*>/g, '').trim();
}

function extractImage(content) {
  if (!content) return '';
  const patterns = [
    /<media:content[^>]*url="([^"]+)"/i,
    /<media:thumbnail[^>]*url="([^"]+)"/i,
    /<enclosure[^>]*url="([^"]+)"/i,
    /<image[^>]*url="([^"]+)"/i,
  ];
  for (const p of patterns) {
    const m = content.match(p);
    if (m && m[1]) return m[1];
  }
  const desc = content.match(/<description[^>]*>([\s\S]*?)<\/description>/i);
  if (desc) {
    const imgMatch = desc[1].match(/<img[^>]*src="([^"]+)"/i);
    if (imgMatch) return imgMatch[1];
  }
  return '';
}

function parseRSS(xml) {
  const items = [];
  const itemRegex = /<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const title = extractTag(match[1], 'title');
    const link = extractTag(match[1], 'link');
    if (title && link) {
      items.push({
        title, link,
        description: extractTag(match[1], 'description').substring(0, 300),
        pubDate: extractTag(match[1], 'pubDate'),
        author: extractTag(match[1], 'dc:creator') || extractTag(match[1], 'author'),
        category: extractTag(match[1], 'category'),
        image: extractImage(match[1]),
      });
    }
  }
  return items;
}

function parseAtom(xml) {
  const items = [];
  const entryRegex = /<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const title = extractTag(match[1], 'title');
    const linkMatch = match[1].match(/<link[^>]*href="([^"]+)"/i);
    const link = linkMatch ? linkMatch[1] : extractTag(match[1], 'link');
    if (title && link) {
      items.push({
        title, link,
        description: (extractTag(match[1], 'summary') || extractTag(match[1], 'content')).replace(/<[^>]*>/g, '').substring(0, 300),
        pubDate: extractTag(match[1], 'published') || extractTag(match[1], 'updated'),
        author: (() => { const m = match[1].match(/<name>([^<]+)<\/name>/i); return m ? m[1].trim() : ''; })(),
        category: 'general',
        image: extractImage(match[1]),
      });
    }
  }
  return items;
}

function parseFeed(xml) {
  if (xml.includes('<feed') && xml.includes('Atom')) return parseAtom(xml);
  if (xml.includes('<entry>') && !xml.includes('<item>')) return parseAtom(xml);
  return parseRSS(xml);
}

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
];

async function fetchWithRetry(url, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
      const res = await fetch(url, {
        headers: {
          'User-Agent': ua,
          'Accept': 'application/rss+xml, application/xml, text/xml, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        },
        signal: AbortSignal.timeout(20000),
        redirect: 'follow',
      });

      if (!res.ok) {
        if (attempt < maxRetries) {
          const delay = (attempt + 1) * 3000;
          console.log(`    Retry ${attempt + 1}/${maxRetries} in ${delay}ms...`);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        return { ok: false, status: res.status, xml: null };
      }

      const xml = await res.text();
      return { ok: true, status: res.status, xml };
    } catch (err) {
      if (attempt < maxRetries) {
        const delay = (attempt + 1) * 2000;
        console.log(`    Retry ${attempt + 1}/${maxRetries} (${err.message}) in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      return { ok: false, error: err.message, xml: null };
    }
  }
  return { ok: false, error: 'max retries', xml: null };
}

async function fetchFeed(feed) {
  console.log(`  Fetching: ${feed.name}`);

  // Direct fetch with retry
  const result = await fetchWithRetry(feed.url);

  if (result.ok && result.xml) {
    const items = parseFeed(result.xml);
    if (items.length > 0) {
      console.log(`    ✓ ${items.length} articles`);
      return items.map(item => ({
        ...item,
        id: Buffer.from(item.link).toString('base64url').substring(0, 16),
        source: feed.name,
        sourceCategory: feed.category,
        sourceLang: 'en',
        fetchedAt: new Date().toISOString(),
      }));
    }
    console.log(`    ✗ 0 articles parsed (feed may have changed format)`);
  } else {
    console.log(`    ✗ HTTP ${result.status || 'ERR'}: ${result.error || ''}`);
  }

  // Fallback: try RSSHub
  const rsshubUrl = getRSSHubUrl(feed.url);
  if (rsshubUrl) {
    console.log(`    Trying RSSHub fallback...`);
    const hubResult = await fetchWithRetry(rsshubUrl);
    if (hubResult.ok && hubResult.xml) {
      const items = parseFeed(hubResult.xml);
      if (items.length > 0) {
        console.log(`    ✓ ${items.length} articles via RSSHub`);
        return items.map(item => ({
          ...item,
          id: Buffer.from(item.link).toString('base64url').substring(0, 16),
          source: `${feed.name} (via RSSHub)`,
          sourceCategory: feed.category,
          sourceLang: 'en',
          fetchedAt: new Date().toISOString(),
        }));
      }
    }
  }

  return [];
}

async function main() {
  console.log('📡 Fetching blog RSS feeds (sequential + retry + RSSHub fallback)\n');
  console.log(`Total sources: ${RSS_FEEDS.length}\n`);

  const allResults = [];

  // Sequential fetch to avoid rate limiting
  for (const feed of RSS_FEEDS) {
    const items = await fetchFeed(feed);
    allResults.push(...items);
    // Delay between feeds to avoid rate limiting
    if (RSS_FEEDS.indexOf(feed) < RSS_FEEDS.length - 1) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  // Deduplicate
  const seen = new Set();
  const unique = allResults.filter(p => {
    if (seen.has(p.link)) return false;
    seen.add(p.link);
    return true;
  });

  unique.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  const latest = unique.slice(0, 300);

  const outputPath = join(__dirname, '..', 'src', 'data', 'blog-posts.json');
  await fs.writeFile(outputPath, JSON.stringify(latest, null, 2), 'utf-8');

  console.log(`\n✅ Saved ${latest.length} blog posts`);
  console.log(`📅 ${latest[latest.length - 1]?.pubDate?.substring(0, 16) || 'N/A'} → ${latest[0]?.pubDate?.substring(0, 16) || 'N/A'}`);

  const sc = {}, cc = {};
  latest.forEach(p => {
    sc[p.source] = (sc[p.source] || 0) + 1;
    cc[p.sourceCategory] = (cc[p.sourceCategory] || 0) + 1;
  });

  console.log('\n📂 Sources:');
  Object.entries(sc).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => console.log(`  ${s}: ${c}`));
  console.log('\n📁 Categories:');
  Object.entries(cc).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${c}: ${n}`));
}

main().catch(console.error);
