/**
 * Language Switcher Component
 * Dropdown for switching between supported languages
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { locales, languageMetadata, type Locale, defaultLocale, removeLocalePrefix, addLocalePrefix } from '@/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  variant?: 'dropdown' | 'inline' | 'minimal';
  showFlags?: boolean;
  className?: string;
}

export function LanguageSwitcher({
  currentLocale,
  variant = 'dropdown',
  showFlags = true,
  className = '',
}: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get the path without locale prefix for creating links
  const getLocalizedPath = (locale: Locale): string => {
    const cleanPath = removeLocalePrefix(pathname);
    return addLocalePrefix(cleanPath, locale);
  };

  const currentLang = languageMetadata[currentLocale];

  // Minimal variant - just a simple link to switch languages
  if (variant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {locales.map((locale) => (
          locale !== currentLocale && (
            <Link
              key={locale}
              href={getLocalizedPath(locale)}
              className="text-sm text-gray-400 hover:text-neon-cyan transition-colors"
              aria-label={`Switch to ${languageMetadata[locale].name}`}
            >
              {showFlags && <span className="mr-1">{languageMetadata[locale].flag}</span>}
              {languageMetadata[locale].nativeName}
            </Link>
          )
        ))}
      </div>
    );
  }

  // Inline variant - horizontal list
  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-3 ${className}`}>
        {locales.map((locale) => {
          const isActive = locale === currentLocale;
          const lang = languageMetadata[locale];
          
          return (
            <Link
              key={locale}
              href={getLocalizedPath(locale)}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                transition-all duration-200
                ${isActive 
                  ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/50' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}
              `}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Switch to ${lang.name}`}
            >
              {showFlags && <span>{lang.flag}</span>}
              <span>{lang.nativeName}</span>
              {isActive && <Check className="w-3 h-3 ml-1" />}
            </Link>
          );
        })}
      </div>
    );
  }

  // Dropdown variant (default)
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card hover:border-white/20 transition-all"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-neon-cyan" />
        {showFlags && <span className="text-base">{currentLang.flag}</span>}
        <span className="text-sm text-gray-300 hidden sm:inline">{currentLang.nativeName}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 py-2 rounded-xl glass-card border border-white/10 shadow-xl z-50">
          <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider border-b border-white/5 mb-2">
            Select Language
          </div>
          <div role="listbox" aria-label="Languages">
            {locales.map((locale) => {
              const isActive = locale === currentLocale;
              const lang = languageMetadata[locale];
              
              return (
                <Link
                  key={locale}
                  href={getLocalizedPath(locale)}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-2.5 text-sm
                    transition-colors
                    ${isActive 
                      ? 'text-neon-cyan bg-neon-cyan/10' 
                      : 'text-gray-300 hover:text-white hover:bg-white/5'}
                  `}
                  role="option"
                  aria-selected={isActive}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{lang.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-xs text-gray-500">{lang.name}</span>
                    </div>
                  </div>
                  {isActive && <Check className="w-4 h-4 text-neon-cyan" />}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Language Selector for Footer
 * Compact horizontal list for footer area
 */
export function FooterLanguageSelector({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();
  
  const getLocalizedPath = (locale: Locale): string => {
    const cleanPath = removeLocalePrefix(pathname);
    return addLocalePrefix(cleanPath, locale);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;
        const lang = languageMetadata[locale];
        
        return (
          <Link
            key={locale}
            href={getLocalizedPath(locale)}
            className={`
              px-2 py-1 text-xs rounded transition-colors
              ${isActive 
                ? 'text-neon-cyan font-medium' 
                : 'text-gray-500 hover:text-gray-300'}
            `}
            aria-current={isActive ? 'page' : undefined}
          >
            {lang.flag} {lang.nativeName}
          </Link>
        );
      })}
    </div>
  );
}
