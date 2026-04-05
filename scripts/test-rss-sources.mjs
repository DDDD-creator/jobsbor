// Test individual failing RSS sources
const sources = [
  { name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss' },
  { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { name: 'Engadget', url: 'https://www.engadget.com/rss.xml' },
  { name: 'VentureBeat', url: 'https://venturebeat.com/feed/' },
  { name: 'Hacker News Best', url: 'https://hnrss.org/best' },
  { name: 'RemoteOK', url: 'https://remoteok.com/rss' },
  { name: 'WeWorkRemotely', url: 'https://weworkremotely.com/feed' },
  { name: 'Ethereum Blog', url: 'https://blog.ethereum.org/feed' },
  { name: 'Entrepreneur', url: 'https://www.entrepreneur.com/latest.rss' },
  { name: 'Forbes Tech', url: 'https://www.forbes.com/technology/feed/' },
  { name: 'FlexJobs', url: 'https://www.flexjobs.com/blog/feed/' },
];

for (const s of sources) {
  try {
    const res = await fetch(s.url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(10000)
    });
    const text = await res.text();
    const hasItems = text.includes('<item>') || text.includes('<entry>');
    const itemCount = (text.match(/<item>/g) || []).length + (text.match(/<entry>/g) || []).length;
    console.log(`${res.status} | ${s.name} | items: ${itemCount} | first 100: ${text.substring(0, 100).replace(/\n/g, ' ')}`);
  } catch(e) {
    console.log(`ERR | ${s.name} | ${e.message}`);
  }
}
