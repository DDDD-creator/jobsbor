import type { Metadata } from 'next';
import Link from 'next/link';

async function getJobs(lang: string, page = 1) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://jobsbor.vercel.app';
    const res = await fetch(`${baseUrl}/api/jobs?lang=${lang}&page=${page}&limit=20`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return { jobs: [], total: 0, page: 1, totalPages: 1 };
    return res.json();
  } catch {
    return { jobs: [], total: 0, page: 1, totalPages: 1 };
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const titles: Record<string, string> = {
    zh: '全部职位 | Jobsbor',
    en: 'All Jobs | Jobsbor',
    ja: '求人一覧 | Jobsbor',
    ko: '전체 채용 | Jobsbor',
  };
  return {
    title: titles[lang] || titles.zh,
    description: '发现全球金融与互联网行业的职业机会',
  };
}

export default async function JobsPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { lang } = await params;
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr || '1', 10);
  const { jobs, total, totalPages } = await getJobs(lang, page);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {lang === 'zh' ? '全部职位' : lang === 'en' ? 'All Jobs' : lang === 'ja' ? '求人一覧' : '전체 채용'}
          </h1>
          <p className="text-muted-foreground">
            {total > 0 ? `${total} 个职位` : '暂无职位'}
          </p>
        </div>

        {/* Jobs List */}
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job: any) => (
              <Link
                key={job.slug}
                href={`/${lang}/jobs/${job.slug}`}
                className="block bg-card rounded-xl border p-5 hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-primary">{job.company?.[0] || 'J'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {job.title}
                      </h2>
                      {job.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary flex-shrink-0">
                          {lang === 'zh' ? '热门' : 'Featured'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{job.company}</p>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.type}</span>
                      <span className="text-success-600 font-medium">💰 {job.salary}</span>
                      <span>🕒 {job.postedAt}</span>
                    </div>
                    {job.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {job.tags.slice(0, 4).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 rounded-md text-xs bg-accent text-muted-foreground">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-4">
              {lang === 'zh' ? '暂无职位' : 'No jobs available'}
            </p>
            <Link href={`/${lang}`} className="text-primary hover:underline">
              {lang === 'zh' ? '返回首页' : 'Back to home'}
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            {page > 1 && (
              <Link href={`/${lang}/jobs?page=${page - 1}`} className="px-4 py-2 rounded-lg border hover:bg-accent transition-colors">
                ← {lang === 'zh' ? '上一页' : 'Previous'}
              </Link>
            )}
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const p = i + 1;
              return (
                <Link
                  key={p}
                  href={`/${lang}/jobs?page=${p}`}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    p === page ? 'bg-primary text-primary-foreground' : 'border hover:bg-accent'
                  }`}
                >
                  {p}
                </Link>
              );
            })}
            {page < totalPages && (
              <Link href={`/${lang}/jobs?page=${page + 1}`} className="px-4 py-2 rounded-lg border hover:bg-accent transition-colors">
                {lang === 'zh' ? '下一页' : 'Next'} →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
