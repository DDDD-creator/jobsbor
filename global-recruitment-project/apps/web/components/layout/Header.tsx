'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  Globe,
  Moon,
  Sun,
  User,
  Briefcase,
  Building2,
  Search,
  ChevronDown,
} from 'lucide-react';

const navigation = [
  { name: '找工作', href: '/jobs', icon: Briefcase },
  { name: '招人才', href: '/employers', icon: Building2 },
  { name: '薪资洞察', href: '/salary', icon: Search },
  { name: '行业洞察', href: '/insights', icon: Globe },
];

const languages = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: 'English' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'glass shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
              <span className="text-lg font-bold text-white">G</span>
            </div>
            <span className="text-xl font-bold text-gradient">GlobalRecruit</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-sm text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>中文</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              
              {isLanguageOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsLanguageOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-40 rounded-lg border bg-card shadow-medium z-50 py-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setIsLanguageOpen(false)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-accent transition-colors"
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                href="/auth/signin"
                className="px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                登录
              </Link>
              <Link
                href="/auth/signup"
                className="btn-primary btn-sm"
              >
                免费注册
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-accent transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass border-t">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-border space-y-2">
              <Link
                href="/auth/signin"
                className="block w-full text-center px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
              >
                登录
              </Link>
              <Link
                href="/auth/signup"
                className="block w-full text-center btn-primary btn-sm"
              >
                免费注册
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
