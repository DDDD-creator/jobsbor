import json

with open("src/data/blog-posts.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("article-129-content.md", "r", encoding="utf-8") as f:
    content = f.read()

new_article = {
    "id": "article-129",
    "title": "量子计算革命与后硅基时代的人才战略：当算力范式跃迁时的技能缺口、教育重构与顶级人才竞争",
    "description": "系统解析量子计算产业化浪潮下的人才缺口图景，深入探讨量子物理学家、量子软件工程师、硬件工程师与解决方案架构师等关键角色的能力要求，为企业提供获取、培养与保留量子顶级人才的系统性战略框架。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T22:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "量子计算", "量子人才", "后硅基时代", "算力范式", "量子软件工程",
        "量子物理学家", "量子硬件", "量子算法", "量子优越性", "量子实用性",
        "量子教育", "产教融合", "跨学科人才", "量子安全", "后量子密码学",
        "量子机器学习", "量子金融", "量子制药", "人才缺口", "科技招聘"
    ],
    "tags": [
        "量子计算", "科技招聘", "人才战略", "前沿技术", "技能培训",
        "产教融合", "人才缺口", "未来工作", "HR战略", "组织变革"
    ],
    "metaDescription": "系统解析量子计算产业化浪潮下的人才缺口图景与关键角色能力要求，为企业提供获取、培养与保留量子顶级人才的系统性战略框架。"
}

data.append(new_article)

with open("src/data/blog-posts.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Appended article-129 successfully")
