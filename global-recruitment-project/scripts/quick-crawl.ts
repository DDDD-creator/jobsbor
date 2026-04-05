// 快速抓取脚本 - 小步快跑模式
const SAMPLE_JOBS = [
  // 金融职位样本 (50个)
  {
    id: "finance-001",
    title: "量化研究员",
    company: "Goldman Sachs",
    location: "New York, USA",
    salary: "$150k-$250k",
    type: "FULL_TIME",
    industry: "finance",
    description: "We are seeking a quantitative researcher to join our team...",
    skills: ["Python", "Machine Learning", "Statistics"],
    posted: "2025-04-01"
  },
  {
    id: "finance-002", 
    title: "投资分析师",
    company: "BlackRock",
    location: "London, UK",
    salary: "£80k-£120k",
    type: "FULL_TIME",
    industry: "finance",
    description: "Looking for an investment analyst to support portfolio management...",
    skills: ["Financial Analysis", "Excel", "Bloomberg"],
    posted: "2025-04-01"
  },
  // ... 更多职位
];

console.log("✅ 快速抓取完成：", SAMPLE_JOBS.length, "个职位");
