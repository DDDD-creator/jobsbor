import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://jobsbor.vercel.app';
  
  // Static pages
  const staticPages = [
    { path: '/zh/', changefreq: 'daily', priority: 1.0 },
    { path: '/en/', changefreq: 'daily', priority: 1.0 },
    { path: '/zh/jobs', changefreq: 'daily', priority: 0.95 },
    { path: '/en/jobs', changefreq: 'daily', priority: 0.95 },
    { path: '/zh/companies', changefreq: 'weekly', priority: 0.9 },
    { path: '/en/companies', changefreq: 'weekly', priority: 0.9 },
    { path: '/zh/about', changefreq: 'monthly', priority: 0.7 },
    { path: '/en/about', changefreq: 'monthly', priority: 0.7 },
  ];

  // Get job slugs from database
  let jobPages: { path: string; changefreq: string; priority: number; lastmod?: string }[] = [];
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const jobs = await prisma.job.findMany({
      where: { status: 'published' },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });
    jobPages = jobs.map(job => ({
      path: `/zh/jobs/${job.slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: job.updatedAt?.toISOString(),
    }));
  } catch {
    // If database unavailable, use empty job list
    jobPages = [];
  }

  const allPages = [...staticPages, ...jobPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${baseUrl}${p.path}</loc>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
