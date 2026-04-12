import json

with open('article-077-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_post = {
    "id": "article-077",
    "title": "候选人关系管理与人才池运营：构建长期主义视角的可持续人才供应链",
    "description": "系统阐述候选人关系管理（CRM）的战略价值与实践框架，深度解析人才池的分层运营、生命周期管理、数字化赋能和价值衡量方法，为企业提供从交易型招聘转向关系型人才经营的系统性指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T03:25:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "候选人关系管理", "CRM", "人才池", "人才供应链", "被动候选人",
        "银牌候选人", "雇主品牌", "招聘营销", "人才获取", "数字化招聘",
        "人才再发现", "候选人体验", "招聘效率", "长期主义招聘", "Jobsbor"
    ],
    "tags": [
        "候选人关系管理", "人才池", "招聘营销", "被动候选人",
        "人才供应链", "雇主品牌", "银牌候选人", "招聘效率",
        "数字化招聘", "HR战略"
    ],
    "metaDescription": "系统阐述候选人关系管理（CRM）与人才池运营方法论，帮助企业构建长期主义视角的可持续人才供应链，提升招聘效率与候选人体验。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data.append(new_post)

with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"Appended article-077 successfully. Total posts: {len(data)}")
