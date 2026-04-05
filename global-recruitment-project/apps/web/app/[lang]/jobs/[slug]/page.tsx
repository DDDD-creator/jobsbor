import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';

// --- Data fetching (same as deployed site) ---
async function getJobBySlug(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jobsbor.vercel.app';
    const res = await fetch(`${baseUrl}/api/jobs/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getSimilarJobs(job: any, lang: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jobsbor.vercel.app';
    const res = await fetch(
      `${baseUrl}/api/jobs?similar=${job.slug}&lang=${lang}&limit=4`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

// --- Metadata ---
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {
      title: '职位未找到 | Jobsbor',
      description: '该职位已不存在或已被移除。',
    };
  }

  const title = `${job.title} - ${job.company} | Jobsbor`;
  const description = `${job.company}招聘${job.title}，工作地点：${job.location}，薪资待遇：${job.salary}。${(job.description || '').substring(0, 100)}...`;

  return {
    title,
    description,
    keywords: `招聘,求职,工作,金融,Web3,互联网,高薪职位,${job.company},${job.location},${job.industry},招聘,${job.title}`,
    creator: 'Jobsbor',
    publisher: 'Jobsbor',
    robots: { index: true, follow: true },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `https://jobsbor.vercel.app/${lang}/jobs/${job.slug}`,
      siteName: 'Jobsbor - 金融/Web3/互联网招聘平台',
      locale: lang === 'zh' ? 'zh_CN' : lang === 'ja' ? 'ja_JP' : lang === 'ko' ? 'ko_KR' : 'en_US',
      images: [
        { url: '/og-image.jpg', width: 1200, height: 630, alt: title },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@jobsbor',
      creator: '@jobsbor',
      images: ['/og-image.jpg'],
    },
  };
}

// --- Page Component ---
export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const similarJobs = await getSimilarJobs(job, lang);

  const workModeLabels: Record<string, string> = {
    onsite: '坐班',
    remote: '远程',
    hybrid: '混合办公',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <nav className="max-w-7xl mx-auto px-4 py-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2">
          <li><Link href={`/${lang}`} className="hover:text-foreground">首页</Link></li>
          <li>/</li>
          <li><Link href={`/${lang}/jobs`} className="hover:text-foreground">职位</Link></li>
          <li>/</li>
          <li className="text-foreground">{job.title}</li>
        </ol>
      </nav>

      {/* Job Detail */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-card rounded-2xl border p-6 md:p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl font-bold text-primary">{job.company?.[0] || 'J'}</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{job.title}</h1>
                  <p className="text-lg text-muted-foreground">{job.company}</p>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {job.tags?.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 rounded-full text-sm bg-primary/10 text-primary">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Apply Button */}
              <button className="w-full md:w-auto px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors">
                立即申请
              </button>
            </div>

            {/* Job Description */}
            <div className="bg-card rounded-2xl border p-6 md:p-8">
              <h2 className="text-xl font-bold text-foreground mb-4">职位描述</h2>
              <div className="prose prose-sm md:prose-base max-w-none text-muted-foreground whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-card rounded-2xl border p-6 md:p-8">
                <h2 className="text-xl font-bold text-foreground mb-4">职位要求</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-1">✓</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <div className="bg-card rounded-2xl border p-6 md:p-8">
                <h2 className="text-xl font-bold text-foreground mb-4">福利待遇</h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <span className="text-primary mt-1">★</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* About Company */}
            {job.about && (
              <div className="bg-card rounded-2xl border p-6 md:p-8">
                <h2 className="text-xl font-bold text-foreground mb-4">关于公司</h2>
                <p className="text-muted-foreground whitespace-pre-line">{job.about}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Job Info Card */}
            <div className="bg-card rounded-2xl border p-6 space-y-4">
              <h3 className="font-semibold text-foreground">职位信息</h3>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">工作地点</span>
                  <p className="font-medium text-foreground">{job.location}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">职位类型</span>
                  <p className="font-medium text-foreground">{job.type}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">薪资范围</span>
                  <p className="font-medium text-success-600">{job.salary}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">部门</span>
                  <p className="font-medium text-foreground">{job.department}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">经验要求</span>
                  <p className="font-medium text-foreground">{job.experienceLevel}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">工作模式</span>
                  <p className="font-medium text-foreground">
                    {workModeLabels[job.workMode] || job.workMode}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">发布时间</span>
                  <p className="font-medium text-foreground">{job.postedAt}</p>
                </div>
              </div>
            </div>

            {/* Company Card */}
            <div className="bg-card rounded-2xl border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{job.company?.[0] || 'J'}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{job.company}</h4>
                  <p className="text-sm text-muted-foreground">{job.industry}</p>
                </div>
              </div>
              <Link href={`/${lang}/companies`} className="text-primary text-sm hover:underline">
                查看更多职位 →
              </Link>
            </div>

            {/* Share */}
            <div className="bg-card rounded-2xl border p-6">
              <h4 className="font-semibold text-foreground mb-3">分享职位</h4>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-accent text-sm font-medium hover:bg-accent/80 transition-colors">
                  复制链接
                </button>
                <button className="flex-1 py-2 rounded-lg bg-accent text-sm font-medium hover:bg-accent/80 transition-colors">
                  微信
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Jobs */}
        {similarJobs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">相似职位</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarJobs.map((similar: any) => (
                <Link
                  key={similar.slug}
                  href={`/${lang}/jobs/${similar.slug}`}
                  className="bg-card rounded-xl border p-4 hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{similar.company?.[0] || 'J'}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                        {similar.title}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">{similar.company}</p>
                      <p className="text-sm text-success-600 mt-1">{similar.salary}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            title: job.title,
            description: job.description,
            datePosted: job.postedDate || new Date().toISOString(),
            hiringOrganization: {
              '@type': 'Organization',
              name: job.company,
              sameAs: job.companyUrl || '',
            },
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: job.location,
                addressCountry: job.country || 'CN',
              },
            },
            employmentType: job.type === '全职' ? 'FULL_TIME' : job.type === '兼职' ? 'PART_TIME' : 'CONTRACTOR',
            industry: job.industry,
            baseSalary: {
              '@type': 'MonetaryAmount',
              currency: job.currency || 'CNY',
              value: {
                '@type': 'QuantitativeValue',
                minValue: job.salaryMin,
                maxValue: job.salaryMax,
                unitText: 'MONTH',
              },
            },
            validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            skills: job.tags?.join(', '),
          }),
        }}
      />
    </div>
  );
}
