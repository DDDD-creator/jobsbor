/**
 * Submit sitemaps to search engines
 * Run after deployment to request indexing
 */

const SITE_URL = 'https://jobsbor.vercel.app'
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`

async function submitToGoogle() {
  console.log('📤 Google Search Console...')
  console.log('  Manual step required:')
  console.log(`  1. Go to https://search.google.com/search-console`)
  console.log(`  2. Add property: ${SITE_URL}`)
  console.log(`  3. Submit sitemap: ${SITEMAP_URL}`)
  console.log(`  4. Use URL Inspection to request indexing for key pages`)
}

async function submitToBing() {
  console.log('\n📤 Bing Webmaster Tools...')
  console.log('  Manual step required:')
  console.log(`  1. Go to https://www.bing.com/webmasters`)
  console.log(`  2. Add site: ${SITE_URL}`)
  console.log(`  3. Import from Google Search Console (recommended)`)
  console.log(`  4. Or manually submit: ${SITEMAP_URL}`)
}

async function submitViaIndexNow() {
  console.log('\n📤 IndexNow (Bing + Yandex)...')
  console.log('  Requires API key setup:')
  console.log('  1. Generate key: node -e "console.log(require(\'crypto\').randomBytes(16).toString(\'hex\'))"')
  console.log('  2. Create public/{key}.txt with the key')
  console.log('  3. Run: node scripts/submit-indexnow.mjs')
}

async function main() {
  console.log('🔍 Search Engine Submission Guide\n')
  console.log(`Site: ${SITE_URL}`)
  console.log(`Sitemap: ${SITEMAP_URL}\n`)
  
  await submitToGoogle()
  await submitToBing()
  await submitViaIndexNow()
  
  console.log('\n📊 Verify indexing after 3-7 days:')
  console.log(`  Google: search "site:${SITE_URL}"`)
  console.log(`  Bing: search "site:${SITE_URL}"`)
}

main().catch(console.error)
