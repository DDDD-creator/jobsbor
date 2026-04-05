import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

/**
 * Multilingual Robots.txt Configuration
 * 
 * Generates robots.txt for SEO with multilingual sitemap references
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobsbor.com';

  return {
    rules: {
      // Allow all search engine crawlers
      userAgent: '*',
      // Allow access to all pages
      allow: '/',
      // Disallow access to these paths
      disallow: [
        '/api/',        // API routes
        '/admin/',      // Admin panel
        '/_next/',      // Next.js internal files
        '/private/',    // Private pages
        '/*.json$',     // JSON data files
        '/drafts/',     // Draft pages
      ],
    },
    // Main sitemap (contains all languages)
    sitemap: `${siteUrl}/sitemap.xml`,
    // Host for canonical domain
    host: siteUrl,
  };
}

/**
 * Generate language-specific sitemap references
 * Useful for submitting to search engines
 */
export function generateSitemapRefs(): string[] {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobsbor.com';
  
  // Return sitemap URLs for all languages
  return locales.map(locale => `${siteUrl}/${locale}/sitemap.xml`);
}
