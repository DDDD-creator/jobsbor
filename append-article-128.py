import json

with open("src/data/blog-posts.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("article-128-content.md", "r", encoding="utf-8") as f:
    content = f.read()

new_article = {
    "id": "article-128",
    "title": "数字游民与远程人才主权：全球化劳动力市场重构下的新人才地理与组织应对策略",
    "description": "深入剖析数字游民经济的崛起、人才主权解耦趋势及其对企业人才战略的深远影响，从法律合规、跨时区协作、组织文化到福利政策，为企业提供数字游民时代构建竞争优势的系统性框架与可操作建议。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T20:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "数字游民", "远程工作", "人才主权", "全球化招聘", "分布式团队",
        "地理套利", "数字游民签证", "异步工作", "跨境合规", "远程薪酬",
        "EOR服务", "跨时区协作", "数字游民友好政策", "远程团队文化",
        "全球医疗保险", "共享办公空间", "人才地理重构", "24小时运营",
        "远程工作政策", "Z世代人才"
    ],
    "tags": [
        "数字游民", "远程工作", "全球化人才", "分布式团队", "跨境合规",
        "异步协作", "雇主品牌", "Z世代职场", "HR战略", "未来工作"
    ],
    "metaDescription": "深入剖析数字游民经济的崛起与人才主权解耦趋势，从法律合规、跨时区协作、组织文化到福利政策，为企业提供数字游民时代构建竞争优势的系统性框架。"
}

data.append(new_article)

with open("src/data/blog-posts.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Appended article-128 successfully")
