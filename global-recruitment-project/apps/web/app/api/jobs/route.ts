import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const lang = searchParams.get('lang') || 'zh';
    const search = searchParams.get('search') || '';
    const similar = searchParams.get('similar') || '';

    // Get jobs from database or fallback
    const jobs = await getJobsFromDatabase({ page, limit, lang, search, similar });

    return NextResponse.json({
      jobs: jobs.data || [],
      total: jobs.total || 0,
      page,
      totalPages: jobs.totalPages || 1,
    });
  } catch (error: any) {
    console.error('API /api/jobs error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

async function getJobsFromDatabase(params: {
  page: number;
  limit: number;
  lang: string;
  search: string;
  similar: string;
}) {
  try {
    // Try to connect to database
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const skip = (params.page - 1) * params.limit;

    const where: any = {
      status: 'published',
      ...(params.search && {
        OR: [
          { title: { contains: params.search, mode: 'insensitive' } },
          { company: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: params.limit,
        orderBy: { postedAt: 'desc' },
      }),
      prisma.job.count({ where }),
    ]);

    return {
      data: jobs,
      total,
      totalPages: Math.ceil(total / params.limit),
    };
  } catch (dbError) {
    console.error('Database connection failed:', dbError);
    // Return empty result instead of crashing
    return { data: [], total: 0, totalPages: 1 };
  }
}
