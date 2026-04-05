/**
 * 监控系统 - 错误报告模块
 * 用于向监督API发送错误报告
 */

const API_KEY = process.env.MONITOR_API_KEY || ''
const API_URL = process.env.MONITOR_API_URL || 'https://api.monitor.jobsbor.com/report'

interface MonitorReport {
  type: 'build_fail' | 'deploy_fail' | '404_error' | 'link_error' | 'general'
  severity: 'critical' | 'high' | 'medium' | 'low'
  message: string
  details?: Record<string, unknown>
  timestamp: string
  url?: string
}

/**
 * 发送错误报告到监控系统
 */
export async function sendMonitorReport(report: Omit<MonitorReport, 'timestamp'>): Promise<boolean> {
  if (!API_KEY) {
    console.warn('[Monitor] API key not configured')
    return false
  }

  const payload: MonitorReport = {
    ...report,
    timestamp: new Date().toISOString(),
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      console.log('[Monitor] Report sent successfully:', report.type)
      return true
    } else {
      console.error('[Monitor] Failed to send report:', response.statusText)
      return false
    }
  } catch (error) {
    console.error('[Monitor] Error sending report:', error)
    return false
  }
}

/**
 * 构建失败报告
 */
export async function reportBuildFail(error: Error, details?: Record<string, unknown>) {
  return sendMonitorReport({
    type: 'build_fail',
    severity: 'critical',
    message: `构建失败: ${error.message}`,
    details: {
      stack: error.stack,
      ...details,
    },
  })
}

/**
 * 部署失败报告
 */
export async function reportDeployFail(error: Error, details?: Record<string, unknown>) {
  return sendMonitorReport({
    type: 'deploy_fail',
    severity: 'critical',
    message: `部署失败: ${error.message}`,
    details: {
      stack: error.stack,
      ...details,
    },
  })
}

/**
 * 404错误报告
 */
export async function report404Error(url: string, referrer?: string) {
  return sendMonitorReport({
    type: '404_error',
    severity: 'high',
    message: `404错误: ${url}`,
    url,
    details: {
      referrer,
      url,
    },
  })
}

/**
 * 链接错误报告
 */
export async function reportLinkError(from: string, to: string, status: number) {
  return sendMonitorReport({
    type: 'link_error',
    severity: status >= 500 ? 'critical' : 'medium',
    message: `链接异常: ${from} -> ${to} (${status})`,
    url: from,
    details: {
      from,
      to,
      status,
    },
  })
}
