import type { Job } from '@/types'

interface JobPostingSchemaProps {
  job: Job
  lang: string
}

export function generateJobPostingSchema(job: Job, lang: string) {
  const salaryCurrency = job.salaryCurrency || 'CNY'
  const salaryMin = job.salaryMin || 0
  const salaryMax = job.salaryMax || 0
  const isRemote = job.type === 'remote' || job.location?.toLowerCase().includes('remote')
  
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.description.substring(0, 5000),
    datePosted: new Date(job.publishedAt).toISOString().split('T')[0],
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company?.name || 'Unknown',
      ...(job.company?.website && { sameAs: job.company.website }),
      ...(job.company?.logo && { logo: job.company.logo }),
    },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        ...(job.location && !isRemote && { addressLocality: job.location }),
        addressCountry: isRemote ? 'Remote' : (job.location || 'CN'),
      },
    },
    employmentType: getEmploymentType(job.type),
    industry: getIndustryName(job.industry, lang),
    ...(salaryMin > 0 && salaryMax > 0 && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: salaryCurrency,
        value: {
          '@type': 'QuantitativeValue',
          minValue: salaryMin,
          maxValue: salaryMax,
          unitText: 'MONTH',
        },
      },
    }),
    validThrough: getValidThrough(job.publishedAt),
    ...(isRemote && {
      applicantLocationRequirements: {
        '@type': 'AdministrativeArea',
        name: 'Global Remote',
      },
      jobLocationType: 'TELECOMMUTE',
    }),
    ...(job.tags && job.tags.length > 0 && {
      skills: job.tags.join(', '),
    }),
  }

  // 移除 undefined 值
  Object.keys(schema).forEach(key => {
    if (schema[key] === undefined) {
      delete schema[key]
    }
  })

  return schema
}

function getEmploymentType(type: string): string {
  const typeMap: Record<string, string> = {
    'full-time': 'FULL_TIME',
    'part-time': 'PART_TIME',
    'contract': 'CONTRACTOR',
    'remote': 'FULL_TIME',
  }
  return typeMap[type] || 'FULL_TIME'
}

function getIndustryName(industry: string, lang: string): string {
  const names: Record<string, Record<string, string>> = {
    zh: {
      finance: '金融服务',
      web3: 'Web3/区块链',
      internet: '互联网/科技',
    },
    en: {
      finance: 'Financial Services',
      web3: 'Web3/Blockchain',
      internet: 'Internet/Technology',
    },
  }
  return names[lang]?.[industry] || names.en[industry] || industry
}

function mapExperienceLevel(level: string): string {
  const map: Record<string, string> = {
    'junior': 'Entry Level',
    'mid': 'Mid Level',
    'senior': 'Senior Level',
    'lead': 'Director',
    'executive': 'Executive',
  }
  return map[level] || 'Mid Level'
}

function getValidThrough(publishedAt: Date): string {
  // 默认有效期30天
  const validThrough = new Date(publishedAt)
  validThrough.setDate(validThrough.getDate() + 30)
  return validThrough.toISOString()
}

export function JobPostingSchema({ job, lang }: JobPostingSchemaProps) {
  const schema = generateJobPostingSchema(job, lang)
  
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
