import json

with open("src/data/blog-posts.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("article-127-content.md", "r", encoding="utf-8") as f:
    content = f.read()

new_article = {
    "id": "article-127",
    "title": "工作场所精力管理与恢复性体验：构建可持续高绩效组织的能量生态系统",
    "description": "系统阐述工作场所精力管理的四维模型与恢复性体验的科学机制，从组织系统设计到个人实践方法，为企业提供构建能量再生生态、提升人才韧性、实现可持续高绩效的完整战略框架与 actionable 指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T20:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "精力管理", "恢复性体验", "工作场所健康", "可持续绩效",
        "心理脱离", "情绪精力", "认知精力", "意志精力", "JD-R模型",
        "微恢复", "工作重塑", "数字宵禁", "精力生态系统", "人才韧性",
        "正念冥想", "组织健康", "高绩效团队", "精力曲线", "恢复空间"
    ],
    "tags": [
        "精力管理", "恢复性体验", "组织健康", "可持续绩效",
        "人才韧性", "工作场所设计", "正念冥想", "HR战略",
        "员工福祉", "高绩效团队"
    ],
    "metaDescription": "系统阐述工作场所精力管理的四维模型与恢复性体验机制，提供从组织系统设计到个人实践的完整框架，助力企业构建可持续高绩效的能量生态系统。"
}

data.append(new_article)

with open("src/data/blog-posts.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Appended article-127 successfully")
