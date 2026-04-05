#!/usr/bin/env python3
"""
Web3Kairo Bot - 全球Web3华人求职自动发布系统
频道: @Web3Kairo
"""

import os, json, time, logging, asyncio, requests, feedparser
from datetime import datetime
from telegram import Bot
from telegram.ext import Application, CommandHandler, ContextTypes

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "8627748476:AAH0WTDbfcSN9MLzLw9hxnleQPwrWP27DEY")
CHANNEL_ID = "@Web3Kairo"

logging.basicConfig(format='%(asctime)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

# ---- 职位抓取 ----
class JobFetcher:
    @staticmethod
    def fetch_cryptojobs():
        try:
            r = requests.get("https://cryptojobslist.com/api/jobs",
                             headers={"User-Agent":"Web3KairoBot/1.0"}, timeout=15)
            if r.status_code != 200: return []
            data = r.json()
            jobs = data.get("jobs", data.get("data", []))
            out = []
            for j in jobs[:15]:
                out.append({
                    "title": j.get("job",""), "company": j.get("company",""),
                    "location": j.get("location","远程"),
                    "salary": j.get("salary","薪资面议"),
                    "tags": j.get("tags",""),
                    "url": f"https://cryptojobslist.com{j.get('url','')}",
                    "date": j.get("date",""), "source": "CryptoJobsList"
                })
            return out
        except Exception as e:
            logger.error(f"CryptoJobsList error: {e}")
            return []

    @staticmethod
    def fetch_remoteok():
        try:
            r = requests.get("https://remoteok.com/api?tag=web3",
                             headers={"User-Agent":"Web3KairoBot/1.0"}, timeout=15)
            if r.status_code != 200: return []
            data = r.json()
            if isinstance(data, list) and len(data) > 0:
                data = data[1:]  # skip label row
            out = []
            for j in data[:15]:
                tags = j.get("tags", [])
                if isinstance(tags, list):
                    tags = ", ".join(tags[:3])
                out.append({
                    "title": j.get("position",""), "company": j.get("company",""),
                    "location": j.get("location","远程"),
                    "salary": j.get("salary","薪资面议") if j.get("salary") else "薪资面议",
                    "tags": tags,
                    "url": j.get("url",""), "date": str(j.get("date","")),
                    "source": "RemoteOK"
                })
            return out
        except Exception as e:
            logger.error(f"RemoteOK error: {e}")
            return []

    @staticmethod
    def fetch_web3career():
        try:
            feed = feedparser.parse("https://web3.career/rss")
            out = []
            for e in feed.entries[:15]:
                out.append({
                    "title": e.get("title",""), "company": e.get("author","Web3.career"),
                    "location": "远程", "salary": "薪资面议",
                    "tags": "Web3", "url": e.get("link",""),
                    "date": e.get("published",""), "source": "Web3Career"
                })
            return out
        except Exception as e:
            logger.error(f"Web3Career error: {e}")
            return []

    @classmethod
    def fetch_all(cls):
        all_jobs = []
        for fn in [cls.fetch_cryptojobs, cls.fetch_remoteok, cls.fetch_web3career]:
            all_jobs.extend(fn())
        # dedup
        seen, unique = set(), []
        for j in all_jobs:
            key = f"{j['title']}-{j['company']}"
            if key not in seen:
                seen.add(key)
                unique.append(j)
        return unique

# ---- 消息格式化 ----
def fmt_job(job):
    tags = job.get("tags","")
    if isinstance(tags, list):
        tags = " ".join(f"#{t}" for t in tags[:3])
    elif tags:
        tags = f"#{tags}"
    else:
        tags = "#Web3"

    date_str = job.get("date","")
    if date_str and date_str.isdigit():
        date_str = datetime.fromtimestamp(int(date_str)).strftime("%Y-%m-%d")

    return (
        f"🔥 {job['title']} — {job['company']}\n"
        f"━━━━━━━━━━━━━━━━━━\n"
        f"📍 地点：{job.get('location','全球远程')} 🌍\n"
        f"💰 薪资：{job.get('salary','薪资面议')}\n"
        f"🏷️ 标签：{tags}\n"
        f"📅 发布：{date_str or datetime.now().strftime('%Y-%m-%d')}\n"
        f"🔗 申请：{job.get('url','')}\n\n"
        f"✨ 华人友好 | 远程办公\n\n"
        f"#Web3招聘 #远程工作 #华人求职"
    )

def fmt_summary(jobs):
    today = datetime.now().strftime("%Y.%m.%d")
    lines = [
        f"📊 【日报】{today} 全球Web3远程职位精选",
        f"━━━━━━━━━━━━━━━━━━",
        f"📈 今日新增：{len(jobs)}个Web3职位",
        f"",
        f"🏆 今日TOP3:",
    ]
    for i, j in enumerate(jobs[:3], 1):
        lines.append(f"{i}️⃣ {j['company']} — {j['title']}")
    lines.append("")
    lines.append("📌 详细职位请查看频道历史")
    lines.append("#每日职位 #Web3招聘 #远程工作 #华人求职")
    return "\n".join(lines)

# ---- Bot 命令 ----
async def cmd_start(update, ctx):
    await update.message.reply_text(
        "👋 欢迎来到 Web3Kairo！\n\n"
        "🌍 全球Web3华人求职内推平台\n"
        "💼 每日自动更新Web3远程职位\n\n"
        "/jobs — 今日最新职位\n"
        "/search <关键词> — 搜索职位\n"
        "/help — 帮助"
    )

async def cmd_help(update, ctx):
    await update.message.reply_text(
        "📖 使用指南：\n\n"
        "/jobs — 查看最新3个Web3职位\n"
        "/search <关键词> — 如 /search solidity\n\n"
        "频道每日09:00/13:00/19:00自动发布"
    )

async def cmd_jobs(update, ctx):
    await update.message.reply_text("📊 正在获取...")
    jobs = JobFetcher.fetch_all()
    if jobs:
        bot = ctx.bot
        for j in jobs[:3]:
            await bot.send_message(update.message.chat_id, fmt_job(j))
            await asyncio.sleep(2)
    else:
        await update.message.reply_text("😔 暂无新职位")

async def cmd_search(update, ctx):
    if not ctx.args:
        await update.message.reply_text("用法: /search <关键词>\n示例: /search solidity")
        return
    kw = " ".join(ctx.args).lower()
    jobs = JobFetcher.fetch_all()
    matched = [j for j in jobs if kw in j["title"].lower() or kw in str(j.get("tags","")).lower()]
    if matched:
        await update.message.reply_text(f"🔍 找到 {len(matched)} 个结果：")
        for j in matched[:3]:
            await ctx.bot.send_message(update.message.chat_id, fmt_job(j))
            await asyncio.sleep(2)
    else:
        await update.message.reply_text(f"未找到 '{kw}' 相关职位")

# ---- 定时发布 ----
async def scheduled_publish(ctx: ContextTypes.DEFAULT_TYPE):
    logger.info("⏰ 定时发布任务开始...")
    jobs = JobFetcher.fetch_all()
    if not jobs:
        logger.warning("无职位数据，跳过")
        return

    bot = ctx.bot
    # 先发日报
    try:
        await bot.send_message(CHANNEL_ID, fmt_summary(jobs), parse_mode="HTML")
        await asyncio.sleep(30)
    except Exception as e:
        logger.error(f"日报发送失败: {e}")

    # 逐个发职位
    for j in jobs[:5]:
        try:
            await bot.send_message(CHANNEL_ID, fmt_job(j), parse_mode="HTML")
            await asyncio.sleep(120)  # 2分钟间隔，避免刷屏
        except Exception as e:
            logger.error(f"发送失败: {e}")

    logger.info(f"✅ 发布完成，共 {min(5, len(jobs))} 条")

# ---- 启动 ----
def main():
    logger.info("Web3Kairo Bot 启动中...")
    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start", cmd_start))
    app.add_handler(CommandHandler("help", cmd_help))
    app.add_handler(CommandHandler("jobs", cmd_jobs))
    app.add_handler(CommandHandler("search", cmd_search))

    jq = app.job_queue
    for h in ["09:00", "13:00", "19:00"]:
        t = datetime.strptime(h, "%H:%M").time()
        jq.run_daily(scheduled_publish, t, days=(0,1,2,3,4,5,6))
        logger.info(f"⏰ 已设置定时任务 {h}")

    logger.info("Bot 开始运行...")
    app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()
