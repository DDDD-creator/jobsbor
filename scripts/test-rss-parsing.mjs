// Test parsing of "failing" sources
import { readFileSync } from 'fs';

const testCases = [
  { name: 'Entrepreneur', check: 'empty items but 200' },
  { name: 'Forbes Tech', check: 'empty items but 200' },
];

// Check what's actually in the feed
for (const s of [
  { name: 'Entrepreneur', url: 'https://www.entrepreneur.com/latest.rss' },
  { name: 'Forbes Tech', url: 'https://www.forbes.com/technology/feed/' },
  { name: 'The Verge (Atom)', url: 'https://www.theverge.com/rss/index.xml' },
]) {
  try {
    const res = await fetch(s.url, { 
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(10000)
    });
    const text = await res.text();
    
    // Count items
    const itemCount = (text.match(/<item>/g) || []).length;
    const entryCount = (text.match(/<entry>/g) || []).length;
    
    // Check if it's atom
    const isAtom = text.includes('<feed') && text.includes('xmlns="http://www.w3.org/2005/Atom"');
    
    // Check for title tags
    const titleCount = (text.match(/<title>/g) || []).length;
    
    console.log(`\n${s.name}:`);
    console.log(`  Atom: ${isAtom}, items: ${itemCount}, entries: ${entryCount}, titles: ${titleCount}`);
    
    if (isAtom || entryCount > 0) {
      // Extract first entry title
      const entryMatch = text.match(/<title[^>]*>([^<]+)<\/title>/g);
      if (entryMatch) {
        console.log(`  First 3 titles:`);
        entryMatch.slice(1, 4).forEach(t => console.log(`    ${t.replace(/<\/?title[^>]*>/g, '')}`));
      }
    }
  } catch(e) {
    console.log(`${s.name}: ERR - ${e.message}`);
  }
}
