/**
 * Home Content Component (Client Component)
 * Displays the actual home page content with translations
 */

'use client'

export const dynamic = 'force-dynamic'

import React from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { JobCard } from '@/components/jobs/JobCard'
import { HomeSearch } from '@/components/search/home-search'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, TrendingUp, Globe, Briefcase, ArrowRight, Sparkles, Zap, Shield, Building2, Send, Star, Users, MessageCircle, CheckCircle } from 'lucide-react'
import { LocalizedLink } from '@/components/i18n/localized-link'
import type { Locale } from '@/i18n/config'
import type { Translations } from '@/i18n/loader'
import { EmailSubscribe } from '@/components/subscribe/email-subscribe'
import { LanguageSwitcher } from '@/components/i18n/LanguageSwitcher'
import { jobs } from '@/data/jobs'
import { companies } from '@/data/companies'
import type { Job, Company } from '@/types'

interface HomeContentProps {
  locale: Locale
  translations: Translations
}

export function HomeContent({ locale, translations: t }: HomeContentProps) {
  // Real stats
  const realStats = {
    totalJobs: jobs.length,
    totalCompanies: companies.length,
    industries: ['Finance', 'Web3', 'Internet'],
    monthlyUsers: '12K+',
    successRate: '96%',
  }

  // Latest jobs with company data - 转换为完整 Job 类型
  const latestJobs = jobs.slice(0, 6).map(job => {
    const company = companies.find(c => c.slug === job.companySlug) || {
      id: job.companySlug,
      name: job.company,
      slug: job.companySlug,
      industry: job.industry,
      createdAt: new Date(),
    }
    
    return {
      ...job,
      companyId: job.companySlug,
      salaryCurrency: 'CNY',
      isActive: true,
      createdAt: new Date(job.publishedAt),
      updatedAt: new Date(job.publishedAt),
      publishedAt: new Date(job.publishedAt),
      company,
      description: job.description?.slice(0, 100) + '...' || '',
    } as Job & { company: typeof company }
  })

  // Industries
  const industries = [
    {
      id: 'finance',
      title: t.industries.finance.title,
      description: t.industries.finance.description,
      icon: TrendingUp,
      gradient: 'from-neon-cyan to-neon-blue',
      glowColor: 'group-hover:shadow-neon-cyan',
      jobCount: jobs.filter(j => j.industry === 'finance').length,
    },
    {
      id: 'web3',
      title: t.industries.web3.title,
      description: t.industries.web3.description,
      icon: Globe,
      gradient: 'from-neon-purple to-neon-pink',
      glowColor: 'group-hover:shadow-neon-purple',
      jobCount: jobs.filter(j => j.industry === 'web3').length,
    },
    {
      id: 'internet',
      title: t.industries.internet.title,
      description: t.industries.internet.description,
      icon: Briefcase,
      gradient: 'from-neon-pink to-neon-orange',
      glowColor: 'group-hover:shadow-neon-pink',
      jobCount: jobs.filter(j => j.industry === 'internet').length,
    },
  ]

  // Hot companies
  const hotCompanies = companies.slice(0, 4).map(company => ({
    name: company.name,
    slug: company.slug,
    initial: company.name.charAt(0),
    color: ['from-neon-cyan to-neon-blue', 'from-neon-purple to-neon-pink', 'from-neon-pink to-neon-orange', 'from-neon-green to-neon-cyan'][Math.floor(Math.random() * 4)],
  }))

  // Stats
  const stats = [
    { label: t.hero.stats.activeJobs, value: `${realStats.totalJobs}+`, icon: Briefcase },
    { label: t.hero.stats.companies, value: `${realStats.totalCompanies}+`, icon: Building2 },
    { label: t.hero.stats.monthlyUsers, value: realStats.monthlyUsers, icon: Zap },
    { label: t.hero.stats.successRate, value: realStats.successRate, icon: Shield },
  ]

  // Testimonials
  const testimonials = [
    {
      id: '1',
      name: 'Alex Chen',
      role: 'Quant Researcher',
      company: 'Top Securities Firm',
      avatar: 'A',
      content: t.cta.subtitle,
      rating: 5,
    },
    {
      id: '2',
      name: 'Maria Kim',
      role: 'Smart Contract Dev',
      company: 'DeFi Protocol',
      avatar: 'M',
      rating: 5,
    },
    {
      id: '3',
      name: 'John Lee',
      role: 'Product Manager',
      company: 'Tech Giant',
      avatar: 'J',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-dark-500">
      <Header locale={locale} translations={t} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          {/* Background */}
          <div className="absolute inset-0 bg-dark-500">
            <div className="absolute inset-0 bg-grid" />
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-purple/20 rounded-full blur-[150px] animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-cyan/15 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000" />
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              {/* Language Switcher */}
              <div className="absolute top-0 right-0 hidden lg:block">
                <LanguageSwitcher currentLocale={locale} />
              </div>

              {/* Tagline */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8">
                <Sparkles className="h-4 w-4 text-neon-cyan" />
                <span className="text-sm text-gray-300">{t.hero.tagline}</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl">
                <span className="block">{t.hero.title}</span>
                <span className="block mt-2 text-gradient-neon">Jobsbor</span>
              </h1>
              
              <p className="mt-8 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                {t.hero.subtitle}
              </p>

              {/* Search Box */}
              <HomeSearch 
                placeholder={t.hero.searchPlaceholder}
                buttonText={t.hero.searchButton}
              />

              {/* Email Subscribe */}
              <div className="mt-8">
                <EmailSubscribe variant="hero" />
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass-card rounded-2xl p-4 text-center group hover:border-white/20 transition-all">
                    <stat.icon className="h-6 w-6 mx-auto mb-2 text-neon-cyan" />
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                {t.industries.title}
              </h2>
              <p className="mt-4 text-gray-400">{t.industries.subtitle}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {industries.map((industry) => (
                <LocalizedLink key={industry.id} href={`/industries/${industry.id}`}>
                  <div className={`group relative rounded-2xl p-8 glass-card-hover cursor-pointer ${industry.glowColor}`}>
                    <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${industry.gradient} mb-6 transition-transform duration-300 group-hover:scale-110`}>
                      <industry.icon className="h-7 w-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-2">{industry.title}</h3>
                    <p className="text-gray-400 mb-4">{industry.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-neon-cyan font-medium">
                        {industry.jobCount} {t.jobs.latest}
                      </span>
                      <ArrowRight className="h-5 w-5 text-gray-500 transition-all duration-300 group-hover:text-neon-cyan group-hover:translate-x-1" />
                    </div>
                  </div>
                </LocalizedLink>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Jobs Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.jobs.latest}</h2>
              </div>
              <LocalizedLink
                href="/jobs"
                className="hidden sm:inline-flex items-center px-5 py-2.5 rounded-xl glass-card text-neon-cyan hover:bg-neon-cyan/10 transition-all"
              >
                {t.jobs.viewAll}
                <ArrowRight className="ml-2 h-4 w-4" />
              </LocalizedLink>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20" />
              <div className="absolute inset-0 bg-dark-200/80 backdrop-blur-xl" />
              
              <div className="relative px-6 py-16 sm:px-12 sm:py-20">
                <div className="mx-auto max-w-2xl text-center">
                  <Sparkles className="h-10 w-10 mx-auto mb-6 text-neon-cyan" />
                  
                  <h2 className="text-3xl font-bold text-white sm:text-4xl">{t.cta.title}</h2>
                  
                  <p className="mt-4 text-lg text-gray-400">{t.cta.subtitle}</p>
                  
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="https://t.me/Web3Kairo"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-xl bg-[#0088cc] text-white font-semibold hover:bg-[#0099dd] transition-all shadow-[0_0_30px_rgba(0,136,204,0.4)]"
                    >
                      <Send className="h-5 w-5" />
                      <span>{t.cta.primaryButton}</span>
                      <ArrowRight className="h-5 w-5" />
                    </a>
                    <LocalizedLink href="/jobs">
                      <Button
                        size="lg"
                        variant="outline"
                        className="h-14 px-8 border-white/20 text-white hover:bg-white/10 rounded-xl"
                      >
                        {t.cta.secondaryButton}
                      </Button>
                    </LocalizedLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer locale={locale} translations={t} />
    </div>
  )
}
