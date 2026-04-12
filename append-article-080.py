import json

with open('article-080-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_post = {
    "id": "article-080",
    "title": "招聘营销革命与内容化人才获取：从职位发布到品牌叙事的候选人触达范式重构",
    "description": "系统阐述招聘营销的战略框架、内容化人才获取方法论与品牌叙事价值，深度解析如何通过社群运营、员工代言和数据洞察构建从被动发布职位到主动吸引人才的全新范式，为企业提供候选人触达的系统性升级指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T03:35:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "招聘营销", "内容化人才获取", "品牌叙事", "候选人触达", "雇主品牌",
        "招聘内容矩阵", "员工代言人计划", "社交媒体招聘", "被动候选人", "人才池运营",
        "招聘转化率", "数字化招聘", "候选人体验", "招聘成本优化", "Jobsbor"
    ],
    "tags": [
        "招聘营销", "内容化招聘", "雇主品牌", "候选人关系管理",
        "社交媒体招聘", "员工代言人", "数字化招聘", "人才获取",
        "招聘转化率", "HR战略"
    ],
    "metaDescription": "系统阐述招聘营销与内容化人才获取方法论，帮助企业从被动职位发布转向主动品牌叙事，重构候选人触达范式，提升人才获取效率与雇主品牌影响力。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data.append(new_post)

with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"Appended article-080 successfully. Total posts: {len(data)}")
print(f"Content length: {len(content)} characters")
