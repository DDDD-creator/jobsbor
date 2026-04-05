/**
 * SEO Schema 结构化数据生成器
 * 用于生成 Google 富媒体搜索结果 (Rich Snippets)
 */

export interface JobPostingSchema {
  "@context": "https://schema.org";
  "@type": "JobPosting";
  title: string;
  description: string;
  hiringOrganization: {
    "@type": "Organization";
    name: string;
    sameAs?: string;
    logo?: string;
  };
  jobLocation: {
    "@type": "Place";
    address: {
      "@type": "PostalAddress";
      addressCountry: string;
      addressLocality?: string;
    };
  };
  baseSalary?: {
    "@type": "MonetaryAmount";
    currency: string;
    value: {
      "@type": "QuantitativeValue";
      minValue: number;
      maxValue: number;
      unitText: "YEAR";
    };
  };
  employmentType: string;
  datePosted: string;
  validThrough: string;
  applicantLocationRequirements?: {
    "@type": "AdministrativeArea";
    name: string;
  };
  skills?: string;
  industry?: string;
  occupationalCategory?: string;
}

/**
 * 生成 JobPosting 结构化数据 (JSON-LD)
 */
export function generateJobPostingSchema(job: {
  title: string;
  description: string;
  companyName: string;
  companyUrl?: string;
  companyLogo?: string;
  location: string;
  country?: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  jobType?: string;
  postedAt: string;
  validThrough?: string;
  skills?: string[];
  industry?: string;
}): string {
  const schema: JobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description.substring(0, 5000), // Google 限制 5000 字符
    hiringOrganization: {
      "@type": "Organization",
      name: job.companyName,
      sameAs: job.companyUrl,
      ...(job.companyLogo && { logo: job.companyLogo }),
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: job.country || "US",
        ...(job.location !== "Remote" && { addressLocality: job.location }),
      },
    },
    employmentType: mapJobType(job.jobType),
    datePosted: new Date(job.postedAt).toISOString().split("T")[0],
    validThrough: job.validThrough
      ? new Date(job.validThrough).toISOString().split("T")[0]
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  };

  // 薪资数据
  if (job.salaryMin && job.salaryMax) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: job.currency || "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salaryMin,
        maxValue: job.salaryMax,
        unitText: "YEAR",
      },
    };
  }

  // 技能标签
  if (job.skills && job.skills.length > 0) {
    schema.skills = job.skills.join(", ");
  }

  // 行业
  if (job.industry) {
    schema.industry = job.industry;
  }

  // 远程职位特殊处理
  if (job.location.toLowerCase().includes("remote")) {
    schema.jobLocation.address.addressCountry = "Remote";
    schema.applicantLocationRequirements = {
      "@type": "AdministrativeArea",
      name: "Global Remote",
    };
  }

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

/**
 * 映射职位类型到 Google 标准格式
 */
function mapJobType(type?: string): string {
  const typeMap: Record<string, string> = {
    full_time: "FULL_TIME",
    part_time: "PART_TIME",
    contract: "CONTRACTOR",
    internship: "INTERN",
    remote: "FULL_TIME",
  };
  return typeMap[type?.toLowerCase() || ""] || "FULL_TIME";
}

/**
 * 生成 BreadcrumbList 结构化数据
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

/**
 * 生成 Organization 结构化数据
 */
export function generateOrganizationSchema(company: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  industry?: string;
  foundingDate?: string;
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: company.url,
    ...(company.logo && { logo: company.logo }),
    ...(company.description && { description: company.description }),
    ...(company.industry && { industry: company.industry }),
    ...(company.foundingDate && { foundingDate: company.foundingDate }),
  };

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}

/**
 * 生成 Article 结构化数据（用于博客）
 */
export function generateArticleSchema(article: {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  publisher?: { name: string; logo: string };
}): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: new Date(article.datePublished).toISOString().split("T")[0],
    ...(article.dateModified && {
      dateModified: new Date(article.dateModified).toISOString().split("T")[0],
    }),
    ...(article.image && { image: article.image }),
    ...(article.publisher && {
      publisher: {
        "@type": "Organization",
        name: article.publisher.name,
        logo: {
          "@type": "ImageObject",
          url: article.publisher.logo,
        },
      },
    }),
  };

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`;
}
