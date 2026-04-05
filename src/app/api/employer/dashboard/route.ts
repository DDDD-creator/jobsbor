import { NextRequest } from "next/server"
import { auth } from "@/lib/auth-config"
import { prisma } from "@/lib/prisma"
import { successResponse, errors } from "@/lib/api-response"

// 获取仪表盘统计数据
export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user) {
      return errors.unauthorized()
    }

    if (session.user.role !== "RECRUITER" && session.user.role !== "ADMIN") {
      return errors.forbidden()
    }

    // 获取招聘者所属企业
    const recruiterProfile = await prisma.recruiterProfile.findUnique({
      where: { userId: session.user.id },
      include: { company: true }
    })

    if (!recruiterProfile && session.user.role !== "ADMIN") {
      return errors.notFound("企业信息")
    }

    const companyId = recruiterProfile?.companyId

    // 获取统计数据
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

    const [
      // 职位统计
      totalJobs,
      activeJobs,
      pausedJobs,
      closedJobs,
      
      // 申请统计
      totalApplications,
      newApplications,
      pendingApplications,
      interviewingApplications,
      
      // 最近30天的申请趋势
      applicationsTrend,
      
      // 最近7天的职位浏览量
      recentViews,
      
      // 最近5条申请
      recentApplications,
      
      // 热门职位
      topJobs,
    ] = await Promise.all([
      // 职位统计
      prisma.job.count({ where: { companyId } }),
      prisma.job.count({ where: { companyId, status: "ACTIVE" } }),
      prisma.job.count({ where: { companyId, status: "PAUSED" } }),
      prisma.job.count({ where: { companyId, status: "CLOSED" } }),
      
      // 申请统计
      prisma.application.count({
        where: {
          job: { companyId }
        }
      }),
      prisma.application.count({
        where: {
          job: { companyId },
          appliedAt: { gte: sevenDaysAgo }
        }
      }),
      prisma.application.count({
        where: {
          job: { companyId },
          status: { in: ["PENDING", "VIEWED"] }
        }
      }),
      prisma.application.count({
        where: {
          job: { companyId },
          status: "INTERVIEWING"
        }
      }),
      
      // 最近30天申请趋势（按天分组）
      prisma.application.groupBy({
        by: ['appliedAt'],
        where: {
          job: { companyId },
          appliedAt: { gte: thirtyDaysAgo }
        },
        _count: { id: true },
      }),
      
      // 最近7天职位浏览量
      prisma.job.aggregate({
        where: { companyId },
        _sum: { viewCount: true },
      }),
      
      // 最近5条申请
      prisma.application.findMany({
        where: { job: { companyId } },
        include: {
          job: { select: { title: true, slug: true } },
          applicant: {
            select: { name: true, avatar: true, jobSeekerProfile: true }
          }
        },
        orderBy: { appliedAt: "desc" },
        take: 5,
      }),
      
      // 热门职位（按申请数）
      prisma.job.findMany({
        where: { companyId },
        orderBy: { applyCount: "desc" },
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          applyCount: true,
          viewCount: true,
          status: true,
        }
      }),
    ])

    // 格式化趋势数据
    const trendMap = new Map()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      const dateStr = date.toISOString().split('T')[0]
      trendMap.set(dateStr, 0)
    }
    
    applicationsTrend.forEach(item => {
      const dateStr = item.appliedAt.toISOString().split('T')[0]
      if (trendMap.has(dateStr)) {
        trendMap.set(dateStr, item._count.id)
      }
    })

    const trendData = Array.from(trendMap.entries()).map(([date, count]) => ({
      date,
      count,
    }))

    return successResponse({
      stats: {
        jobs: {
          total: totalJobs,
          active: activeJobs,
          paused: pausedJobs,
          closed: closedJobs,
        },
        applications: {
          total: totalApplications,
          newThisWeek: newApplications,
          pending: pendingApplications,
          interviewing: interviewingApplications,
        },
        views: recentViews._sum.viewCount || 0,
      },
      trend: trendData,
      recentApplications: recentApplications.map(app => ({
        id: app.id,
        status: app.status,
        appliedAt: app.appliedAt,
        job: app.job,
        applicant: {
          name: app.applicant.name,
          avatar: app.applicant.avatar,
          headline: app.applicant.jobSeekerProfile?.headline,
        }
      })),
      topJobs,
      company: recruiterProfile?.company ? {
        name: recruiterProfile.company.name,
        logo: recruiterProfile.company.logo,
        verifyStatus: recruiterProfile.company.verifyStatus,
      } : null,
    })
  } catch (error) {
    console.error("[Get Dashboard Stats Error]", error)
    return errors.internalError()
  }
}