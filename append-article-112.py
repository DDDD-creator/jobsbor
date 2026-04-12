import json

with open("src/data/blog-posts.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("article-112-content.md", "r", encoding="utf-8") as f:
    content = f.read()

new_article = {
    "id": "article-112",
    "title": "人机协作时代的领导力升维：当AI Agent成为团队成员时，管理者的角色重构与智能团队动力学演进",
    "description": "深入解析AI Agent从工具到队友的跃迁，系统阐述人机协作团队中管理者的四大新角色、智能团队动力学的新规则，以及人机协作领导力的培养路径，为企业迎接人机共生时代提供战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T08:30:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "人机协作", "AI Agent", "领导力重构", "智能团队", "管理者转型",
        "人机团队动力学", "功能性信任", "AI素养", "数字同事", "未来管理",
        "人机边界", "团队绩效管理", "AI伦理", "协作领导力", "组织变革"
    ],
    "tags": [
        "人机协作", "AI Agent", "领导力升维", "智能团队", "管理者重构",
        "未来管理", "团队动力学", "AI伦理", "协作领导力"
    ],
    "metaDescription": "系统解析当AI Agent成为团队正式成员时，管理者如何从指挥官转型为人机协奏的指挥家，探讨智能团队动力学、绩效管理和领导力培养的前沿实践。"
}

data.append(new_article)

with open("src/data/blog-posts.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Appended article-112 successfully")
