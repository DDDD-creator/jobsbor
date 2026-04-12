import json

with open("src/data/blog-posts.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("article-126-content.md", "r", encoding="utf-8") as f:
    content = f.read()

new_article = {
    "id": "article-126",
    "title": "安静招聘革命与隐形人才激活：经济紧缩时代的组织能力重构与内部人才市场崛起",
    "description": "深度解析安静招聘（Quiet Hiring）的战略本质与四大实施路径，探讨内部人才市场、技能图谱与动态匹配如何成为组织能力获取的新基础设施，并提供风险边界管理与最佳实践参考，助力企业构建韧性人才生态系统。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T14:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "安静招聘", "Quiet Hiring", "内部人才市场", "人才再配置", "技能再分配",
        "项目制抽调", "内部晋升", "技能图谱", "组织能力重构", "人才流动",
        "招聘冻结", "内部零工经济", "共享文化", "人才经纪人", "组织韧性"
    ],
    "tags": [
        "安静招聘", "人才战略", "内部人才市场", "组织韧性",
        "技能图谱", "人才流动", "Quiet Hiring", "HR趋势"
    ],
    "metaDescription": "系统解读安静招聘革命四大战略路径与内部人才市场建设，帮助企业在外部招聘受限时激活隐形人才、重构组织能力，打造韧性人才生态系统。"
}

data.append(new_article)

with open("src/data/blog-posts.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Appended article-126 successfully")
