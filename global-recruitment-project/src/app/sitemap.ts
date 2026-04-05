/**
 * Multilingual Sitemap Generator
 * Generates sitemap.xml with hreflang support for all languages
 */

import { MetadataRoute } from 'next';
import { locales, defaultLocale } from '@/i18n/config';
import { jobs } from '@/data/jobs';
import { companies } from '@/data/companies';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jobsbor.com';

/**
 * Generate multilingual sitemap with hreflang annotations
 * Each URL includes links to all language versions
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Helper to generate localized URLs
  const getLocalizedUrls = (path: string) => {
    return locales.map(locale => ({
      locale,
      url: `${SITE_URL}/${locale}${path}`,
    }));
  };

  // Core pages that exist in all languages
  const corePages = [
    { path: '/', priority: 1.0, changefreq: 'daily' as const },
    { path: '/jobs', priority: 0.95, changefreq: 'daily' as const },
    { path: '/companies', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/industries/finance', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/industries/web3', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/industries/internet', priority: 0.9, changefreq: 'weekly' as const },
    { path: '/blog', priority: 0.8, changefreq: 'weekly' as const },
    { path: '/guide', priority: 0.7, changefreq: 'weekly' as const },
    { path: '/about', priority: 0.6, changefreq: 'monthly' as const },
  ];

  // Generate sitemap entries for core pages
  const coreSitemapEntries: MetadataRoute.Sitemap = corePages.flatMap(page => {
    const localizedUrls = getLocalizedUrls(page.path);
    
    return localizedUrls.map(({ locale, url }) => ({
      url,
      lastModified: currentDate,
      changeFrequency: page.changefreq,
      priority: page.priority,
      // Add alternates for hreflang
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [
            l,
            `${SITE_URL}/${l}${page.path}`,
          ])
        ),
      },
    }));
  });

  // Generate job pages for all languages
  const jobSitemapEntries: MetadataRoute.Sitemap = jobs.flatMap(job => {
    return locales.map(locale => ({
      url: `${SITE_URL}/${locale}/jobs/${job.slug}`,
      lastModified: new Date(job.publishedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [
            l,
            `${SITE_URL}/${l}/jobs/${job.slug}`,
          ])
        ),
      },
    }));
  });

  // Generate company pages for all languages
  const companySitemapEntries: MetadataRoute.Sitemap = companies.flatMap(company => {
    return locales.map(locale => ({
      url: `${SITE_URL}/${locale}/companies/${company.slug}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [
            l,
            `${SITE_URL}/${l}/companies/${company.slug}`,
          ])
        ),
      },
    }));
  });

  // Combine all entries
  const allEntries = [
    ...coreSitemapEntries,
    ...jobSitemapEntries,
    ...companySitemapEntries,
  ];

  // Sort by priority (descending)
  return allEntries.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

/**
 * Generate individual sitemap index for large sites
 * This can be used if the sitemap exceeds 50,000 URLs
 */
export async function generateSitemapIndex(): Promise<MetadataRoute.Sitemap> {
  const sitemaps = [
    { url: `${SITE_URL}/sitemap-core.xml`, name: 'Core Pages' },
    { url: `${SITE_URL}/sitemap-jobs.xml`, name: 'Job Pages' },
    { url: `${SITE_URL}/sitemap-companies.xml`, name: 'Company Pages' },
  ];

  return sitemaps.map(({ url }) => ({
    url,
    lastModified: new Date(),
  }));
}
