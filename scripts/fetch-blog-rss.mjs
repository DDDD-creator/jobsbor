/**
 * Blog RSS Fetcher v6 - Final version with optimized sources
 * Sequential fetch + retry + UA rotation
 * 15 verified working sources
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
  { name: 'Fast Company', url: 'https://www.fastcompany.com/rss', category: 'business' },
  { name: 'Harvard Business Review', url: 'https://hbr.org/feed', category: 'business' },
];

function stripCdata(s) {
  if (!s) return '';
  return s.replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').trim();
}

function extractTag(content, tag) {
  const regex = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i');
  const m = content.match(regex);
  if (!m) return '';
  return stripCdata(m[1]).replace(/<[^>]*>/g, '').trim();
}

function extractImage(content) {
  if (!content) return '';
  const patterns = [
    /<media:content[^>]*url="([^"]+)"/i,
    /<media:thumbnail[^>]*url="([^"]+)"/i,
    /<enclosure[^>]*url="([^"]+)"/i,
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
];

async function fetchWithRetry(url, maxRetries = 2) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const ua = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
      const res = await fetch(url, {
        headers: { 'User-Agent': ua, 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) {
        if (attempt < maxRetries) { await new Promise(r => setTimeout(r, (attempt + 1) * 3000)); continue; }
        return { ok: false, status: res.status, xml: null };
      }
      return { ok: true, status: res.status, xml: await res.text() };
    } catch (err) {
      if (attempt < maxRetries) { await new Promise(r => setTimeout(r, (attempt + 1) * 2000)); continue; }
      return { ok: false, error: err.message, xml: null };
    }
  }
  return { ok: false, error: 'max retries', xml: null };
}

async function fetchFeed(feed) {
  console.log(`  Fetching: ${feed.name}`);
  const result = await fetchWithRetry(feed.url);
  if (result.ok && result.xml) {
    const items = parseFeed(result.xml);
    console.log(`    ${items.length > 0 ? '✓' : '✗'} ${items.length} articles`);
    return items.map(item => ({
      ...item,
      id: Buffer.from(item.link).toString('base64url').substring(0, 16),
      source: feed.name, sourceCategory: feed.category, sourceLang: 'en',
      fetchedAt: new Date().toISOString(),
    }));
  }
  console.log(`    ✗ HTTP ${result.status || 'ERR'}: ${result.error || ''}`);
  return [];
}

async function main() {
  console.log('📡 Fetching blog RSS feeds\n');
  console.log(`Sources: ${RSS_FEEDS.length}\n`);

  const allResults = [];
  for (const feed of RSS_FEEDS) {
    allResults.push(...await fetchFeed(feed));
    if (RSS_FEEDS.indexOf(feed) < RSS_FEEDS.length - 1) await new Promise(r => setTimeout(r, 2000));
  }

  const seen = new Set();
  const unique = allResults.filter(p => { if (seen.has(p.link)) return false; seen.add(p.link); return true; });
  unique.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  const latest = unique.slice(0, 300);

  await fs.writeFile(join(__dirname, '..', 'src', 'data', 'blog-posts.json'), JSON.stringify(latest, null, 2), 'utf-8');

  console.log(`\n✅ ${latest.length} articles`);
  const sc = {}, cc = {};
  latest.forEach(p => { sc[p.source] = (sc[p.source] || 0) + 1; cc[p.sourceCategory] = (cc[p.sourceCategory] || 0) + 1; });
  console.log('\n📂 Sources:');
  Object.entries(sc).sort((a, b) => b[1] - a[1]).forEach(([s, c]) => console.log(`  ${s}: ${c}`));
  console.log('\n📁 Categories:');
  Object.entries(cc).sort((a, b) => b[1] - a[1]).forEach(([c, n]) => console.log(`  ${c}: ${n}`));
}

main().catch(console.error);
