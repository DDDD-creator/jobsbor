import json

article = {
    "id": "article-087",
    "title": "职业韧性与终身可雇佣性：不确定时代的人才个体价值觉醒与组织赋能策略",
    "description": "深入探讨VUCA时代职业韧性与终身可雇佣性的战略意义，解析从组织依附到个人品牌自主的职场范式转移，为企业提供构建人才赋能生态、提升组织抗脆弱性的系统方法论。",
    "content": open("article-087-content.md", "r", encoding="utf-8").read(),
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T04:30:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "职业韧性","终身可雇佣性","职业发展","个人品牌","组织赋能",
        "技能再培训","内部人才市场","职业导师","副业经济","回旋镖员工",
        "心理所有权","人才保留","动态可雇佣性","微学习","微认证",
        "AI职业辅导","技能图谱","人才共生","职业转型","HR战略"
    ],
    "tags": [
        "职业韧性","终身可雇佣性","人才赋能","职业发展","组织韧性",
        "个人品牌","技能再培训","内部人才市场","职业导师","HR科技"
    ],
    "metaDescription": "深度解析VUCA时代职业韧性与终身可雇佣性的战略构建路径，从个人品牌崛起到组织赋能生态系统，为企业提供不确定时代的人才管理新范式。"
}

with open("src/data/blog-posts.json", "r", encoding="utf-8") as f:
    posts = json.load(f)

posts.append(article)

with open("src/data/blog-posts.json", "w", encoding="utf-8") as f:
    json.dump(posts, f, ensure_ascii=False, indent=2)

print("Article-087 appended successfully.")
print("Total articles:", len(posts))
print("Content length:", len(article["content"]))
