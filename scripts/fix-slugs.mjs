import { promises as fs } from 'fs';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dataPath = join(__dirname, '..', 'src', 'data', 'blog-posts.json');
const posts = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

// Replace base64 URLs with short hashes
posts.forEach(post => {
  // Old ID is base64url of the link
  // New ID is first 12 chars of MD5 hash
  const hash = createHash('md5').update(post.link).digest('hex').substring(0, 12);
  post.id = hash;
});

// Deduplicate by new ID
const seen = new Set();
const unique = posts.filter(p => {
  if (seen.has(p.id)) return false;
  seen.add(p.id);
  return true;
});

await fs.writeFile(dataPath, JSON.stringify(unique, null, 2), 'utf-8');
console.log(`Fixed slugs: ${unique.length} posts with URL-safe IDs`);
console.log('Sample:', unique.slice(0, 3).map(p => `${p.id} - ${p.title.substring(0, 50)}`));
