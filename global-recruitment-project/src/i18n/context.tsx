/**
 * i18n Context and Provider
 * React Context for managing internationalization state
 */

'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Locale } from './config';
import type { Translations } from './loader';

interface I18nContextType {
  locale: Locale;
  translations: Translations | null;
  isLoading: boolean;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
  initialLocale: Locale;
  initialTranslations: Translations;
}

export function I18nProvider({
  children,
  initialLocale,
  initialTranslations,
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [translations, setTranslations] = useState<Translations>(initialTranslations);
  const [isLoading, setIsLoading] = useState(false);

  const setLocale = useCallback(async (newLocale: Locale) => {
    if (newLocale === locale) return;
    
    setIsLoading(true);
    
    try {
      // Load new translations
      const newTranslations = await import(`./locales/${newLocale}.json`);
      setTranslations(newTranslations.default || newTranslations);
      setLocaleState(newLocale);
      
      // Update URL without page reload
      const currentPath = window.location.pathname;
      const newPath = currentPath.replace(/^\/[a-z]{2}(\/|$)/, `/${newLocale}$1`);
      window.history.pushState({}, '', newPath);
      
      // Update HTML lang attribute
      document.documentElement.lang = newLocale;
    } catch (error) {
      console.error('Failed to change locale:', error);
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    if (!translations) return key;
    
    const keys = key.split('.');
    let value: any = translations;
    
    for (const k of keys) {
      if (value === null || value === undefined) {
        return key;
      }
      value = value[k];
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Simple interpolation
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, paramKey) => {
        return String(params[paramKey] ?? match);
      });
    }
    
    return value;
  }, [translations]);

  const value = useMemo(() => ({
    locale,
    translations,
    isLoading,
    setLocale,
    t,
  }), [locale, translations, isLoading, setLocale, t]);

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export function useTranslation() {
  const { t, isLoading } = useI18n();
  return { t, isLoading };
}
