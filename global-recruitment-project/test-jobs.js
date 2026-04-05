// 测试职位数据加载
import { jobs as seedJobs } from './src/data/jobs'
import { realJobs } from './src/data/real-jobs'
import { crawledJobs } from './src/data/crawled-jobs'

console.log('=== 职位数据统计 ===')
console.log('seedJobs (jobs.ts):', seedJobs.length)
console.log('realJobs (real-jobs/index.ts):', realJobs.length)
console.log('crawledJobs (crawled-jobs.ts):', crawledJobs.length)
console.log('总计:', seedJobs.length + realJobs.length + crawledJobs.length)

// 检查是否有重复的id
const allIds = [
  ...seedJobs.map(j => j.id),
  ...realJobs.map(j => j.id),
  ...crawledJobs.map(j => j.id)
]
const uniqueIds = new Set(allIds)
console.log('唯一ID数:', uniqueIds.size)
console.log('重复ID数:', allIds.length - uniqueIds.size)
