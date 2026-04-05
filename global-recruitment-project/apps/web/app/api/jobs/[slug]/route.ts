import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const job = await getJobBySlug(slug);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found', message: `No job found with slug: ${slug}` },
        { status: 404 }
      );
    }

    return NextResponse.json(job);
  } catch (error: any) {
    console.error('API /api/jobs/[slug] error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

async function getJobBySlug(slug: string) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const job = await prisma.job.findFirst({
      where: { slug, status: 'published' },
    });

    return job;
  } catch (dbError) {
    console.error('Database connection failed:', dbError);
    return null;
  }
}
