// 测试职位数据
const realJobs = require('./src/data/real-jobs').realJobs;
const crawledJobs = require('./src/data/crawled-jobs').crawledJobs;
const seedJobs = require('./src/data/jobs').jobs;

console.log('=== 职位数据统计 ===');
console.log('realJobs count:', realJobs?.length || 0);
console.log('crawledJobs count:', crawledJobs?.length || 0);
console.log('seedJobs count:', seedJobs?.length || 0);

// 检查 realJobs 前几个
if (realJobs && realJobs.length > 0) {
  console.log('\n=== realJobs 前3个 ===');
  realJobs.slice(0, 3).forEach((job, i) => {
    console.log(`${i + 1}. ${job.title} @ ${job.company}`);
  });
}

// 检查是否有 id
console.log('\n=== 检查 ID ===');
if (realJobs && realJobs.length > 0) {
  console.log('realJobs[0].id:', realJobs[0].id);
  console.log('realJobs[1].id:', realJobs[1]?.id);
}
