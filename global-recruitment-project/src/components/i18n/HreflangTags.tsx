/**
 * Hreflang Tags Component
 * Generates hreflang tags for SEO
 */

import React from 'react';
import { locales, localeToHreflang, defaultLocale, removeLocalePrefix, addLocalePrefix } from '@/i18n/config';
import type { Locale } from '@/i18n/config';

interface HreflangTagsProps {
  currentLocale: Locale;
  pathname: string;
  siteUrl: string;
}

export function HreflangTags({ currentLocale, pathname, siteUrl }: HreflangTagsProps) {
  const cleanPath = removeLocalePrefix(pathname);
  
  // Generate hreflang links for all locales
  const hreflangLinks = locales.map((locale) => {
    const localizedPath = addLocalePrefix(cleanPath, locale);
    const url = `${siteUrl}${localizedPath}`;
    
    return {
      locale: localeToHreflang[locale],
      url,
      isDefault: locale === defaultLocale,
    };
  });

  return (
    <>
      {/* x-default hreflang - points to default locale */}
      <link 
        rel="alternate" 
        hrefLang="x-default" 
        href={`${siteUrl}${addLocalePrefix(cleanPath, defaultLocale)}`} 
      />
      
      {/* Language-specific hreflang tags */}
      {hreflangLinks.map(({ locale, url }) => (
        <link 
          key={locale}
          rel="alternate" 
          hrefLang={locale} 
          href={url} 
        />
      ))}
    </>
  );
}

/**
 * Generate hreflang metadata for Next.js generateMetadata
 */
export function generateHreflangMetadata(
  currentLocale: Locale, 
  pathname: string, 
  siteUrl: string
) {
  const cleanPath = removeLocalePrefix(pathname);
  
  const languages: Record<string, string> = {};
  
  locales.forEach((locale) => {
    const localizedPath = addLocalePrefix(cleanPath, locale);
    languages[localeToHreflang[locale]] = `${siteUrl}${localizedPath}`;
  });
  
  // Add x-default
  languages['x-default'] = `${siteUrl}${addLocalePrefix(cleanPath, defaultLocale)}`;
  
  return {
    languages,
    canonical: `${siteUrl}${addLocalePrefix(cleanPath, currentLocale)}`,
  };
}
