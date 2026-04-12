import json

with open("src/data/blog-posts.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("article-118-content.md", "r", encoding="utf-8") as f:
    content = f.read()

new_article = {
    "id": "article-118",
    "title": "2026年及未来五年全球招聘科技趋势展望：从自动化到智能化，再到自主化的HR技术演进路线图",
    "description": "站在2026年的关键节点，系统回顾招聘科技的自动化与智能化时代成果，深度解析自主招聘代理、LLM与多代理系统驱动的自主化时代特征，展望未来五年五大核心趋势，并为企业提供分阶段数字化升级与HR团队能力重塑的行动框架。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T09:30:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "招聘科技", "HR Tech", "自主招聘代理", "人工智能招聘", "LLM",
        "人才智能平台", "技能本位招聘", "内部人才市场", "候选人体验",
        "算法合规", "招聘自动化", "招聘数字化转型", "未来工作",
        "HR团队重塑", "招聘趋势展望"
    ],
    "tags": [
        "招聘科技", "HR Tech", "人工智能", "自主化招聘", "数字化转型",
        "人才管理", "招聘趋势", "技术演进", "HR创新", "未来五年"
    ],
    "metaDescription": "全面展望2026-2031年全球招聘科技演进路线，从自动化、智能化到自主化，解析自主招聘代理、技能本位、内部人才市场与候选人体验的五大趋势，提供企业数字化行动框架。"
}

data.append(new_article)

with open("src/data/blog-posts.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Appended article-118 successfully")
