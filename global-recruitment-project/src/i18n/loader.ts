/**
 * Translation Loader
 * Dynamically loads translation files based on locale
 */

import type { Locale } from './config';

// Translation type definition
export interface Translations {
  metadata: {
    title: string;
    description: string;
    keywords: string;
  };
  nav: {
    home: string;
    jobs: string;
    companies: string;
    industries: string;
    blog: string;
    guide: string;
    about: string;
    search: string;
    postJob: string;
  };
  hero: {
    tagline: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    hotSearches: string;
    stats: {
      activeJobs: string;
      companies: string;
      monthlyUsers: string;
      successRate: string;
    };
  };
  industries: {
    title: string;
    subtitle: string;
    finance: {
      title: string;
      description: string;
    };
    web3: {
      title: string;
      description: string;
    };
    internet: {
      title: string;
      description: string;
    };
  };
  jobs: {
    latest: string;
    viewAll: string;
    remote: string;
    fullTime: string;
    partTime: string;
    contract: string;
    internship: string;
    salary: string;
    location: string;
    type: string;
    apply: string;
    save: string;
    saved: string;
    unsave: string;
    share: string;
    posted: string;
    expires: string;
  };
  jobList: {
    title: string;
    subtitle: string;
    hotJobs: string;
    totalJobs: string;
    updatedToday: string;
    remoteJobs: string;
    realTimeUpdate: string;
    allIndustries: string;
    finance: string;
    web3: string;
    internet: string;
    allLocations: string;
    allTypes: string;
    beijing: string;
    shanghai: string;
    shenzhen: string;
    hangzhou: string;
    guangzhou: string;
    singapore: string;
    remoteWork: string;
    filters: string;
    industry: string;
    jobType: string;
    clearFilters: string;
    noResults: string;
    tryAdjusting: string;
    postJob: string;
  };
  companies: {
    title: string;
    subtitle: string;
    viewAll: string;
    jobs: string;
    follow: string;
    website: string;
  };
  companyList: {
    explore: string;
    excellent: string;
    companyCount: string;
    realTimeUpdate: string;
    resultsFound: string;
    noResults: string;
    loadMore: string;
  };
  telegram: {
    join: string;
    description: string;
    benefits: string[];
  };
  testimonials: {
    title: string;
    subtitle: string;
  };
  cta: {
    title: string;
    subtitle: string;
    primaryButton: string;
    secondaryButton: string;
  };
  footer: {
    about: string;
    careers: string;
    contact: string;
    privacy: string;
    terms: string;
    copyright: string;
  };
  jobDetail: {
    backToJobs: string;
    skills: string;
    description: string;
    requirements: string;
    relatedJobs: string;
    sameCompanyJobs: string;
    companyInfo: string;
    visitWebsite: string;
    viewCompany: string;
    negotiable: string;
    applyNow: string;
    applySoon: string;
    applyDesc: string;
    applySoonDesc: string;
    applyRedirectDesc: string;
    applyEmailDesc: string;
    telegramTitle: string;
    telegramSubtitle: string;
    telegramDesc: string;
  };
  contact: {
    title: string;
    subtitle: string;
    email: string;
    emailValue: string;
    telegram: string;
    telegramValue: string;
    address: string;
    addressValue: string;
    formTitle: string;
    name: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    sent: string;
    success: string;
    required: string;
    invalidEmail: string;
    csrfError: string;
    sendError: string;
    emailAlternative: string;
  };
  common: {
    loading: string;
    error: string;
    retry: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    create: string;
    search: string;
    filter: string;
    sort: string;
    more: string;
    less: string;
    show: string;
    hide: string;
    all: string;
    none: string;
    or: string;
    and: string;
    yes: string;
    no: string;
    ok: string;
    close: string;
    open: string;
    closed: string;
    active: string;
    inactive: string;
    pending: string;
    approved: string;
    rejected: string;
  };
  language: {
    title: string;
    en: string;
    ja: string;
    de: string;
    fr: string;
    es: string;
    ko: string;
    th: string;
    vi: string;
    hi: string;
    zh: string;
  };
}

// Translation cache
const translationCache: Partial<Record<Locale, Translations>> = {};

/**
 * Load translations for a given locale
 * Uses dynamic import for code splitting
 */
export async function loadTranslations(locale: Locale): Promise<Translations> {
  // Return cached translation if available
  if (translationCache[locale]) {
    return translationCache[locale]!;
  }

  try {
    // Dynamic import of translation file
    const translations = await import(`./locales/${locale}.json`);
    const data = translations.default || translations;
    
    // Cache the translation
    translationCache[locale] = data;
    
    return data;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    
    // Fallback to default locale
    if (locale !== 'en') {
      return loadTranslations('en');
    }
    
    throw new Error(`Could not load translations for locale: ${locale}`);
  }
}

/**
 * Get translation value by key path
 * Example: getNestedValue(translations, 'hero.title')
 */
export function getNestedValue(obj: any, path: string): string | string[] | undefined {
  return path.split('.').reduce((current, key) => {
    if (current === null || current === undefined) {
      return undefined;
    }
    return current[key];
  }, obj);
}

/**
 * Simple translation function with interpolation
 */
export function t(
  translations: Translations,
  key: string,
  params?: Record<string, string | number>
): string {
  const value = getNestedValue(translations, key);
  
  if (typeof value !== 'string') {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  
  // Simple interpolation: {{variable}}
  if (params) {
    return value.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return String(params[key] ?? match);
    });
  }
  
  return value;
}
