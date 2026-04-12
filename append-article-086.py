import json

with open('article-086-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_post = {
    "id": "article-086",
    "title": "组织记忆管理与知识传承体系：构建关键人才流失防护与代际智慧延续的战略基础设施",
    "description": "系统阐述组织记忆管理与知识传承的战略价值，深入解析隐性知识显性化路径、代际交替挑战、数字化赋能工具与全周期传承体系设计，帮助企业构建不可摧毁的智力资产防线，实现组织智慧超越个体生命周期的可持续发展目标。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T04:30:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "组织记忆", "知识传承", "隐性知识", "关键人才流失", "代际交替",
        "知识管理", "师徒制", "离职交接", "知识图谱", "组织韧性",
        "SECI模型", "实践社群", "校友网络", "反向导师制", "知识审计",
        "数字化学习", "人才保留", "智力资产", "组织学习", "企业大学"
    ],
    "tags": [
        "组织记忆", "知识传承", "隐性知识", "人才流失防护", "师徒制",
        "知识管理", "组织韧性", "数字化学习", "人才保留", "HR战略"
    ],
    "metaDescription": "深度解析组织记忆管理与知识传承体系的战略构建路径，从隐性知识显性化、代际智慧延续到数字化赋能，帮助企业打造穿越周期的智力资产防线。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data.append(new_post)

with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"Appended article-086 successfully. Total posts: {len(data)}")
print(f"Content length: {len(content)} characters")
