import json

with open('article-081-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

new_post = {
    "id": "article-081",
    "title": "认知科学与行为经济学驱动的人才决策革命：从直觉偏见到理性识人的系统升级",
    "description": "系统阐述认知科学与行为经济学在招聘决策中的应用价值，深度解析招聘中的认知偏见形成机制、行为助推策略、结构化面试革新与数据驱动决策架构，帮助企业构建去偏见、高效率的理性识人系统，让人才评估从依赖直觉的艺术转变为一门基于证据的科学。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T04:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "认知科学", "行为经济学", "招聘决策", "认知偏见", "结构化面试",
        "去偏见招聘", "行为事件面试", "工作样本测试", "人才评估", "决策疲劳",
        "确认偏误", "同质化偏见", "光环效应", "算法辅助招聘", "群体决策",
        "面试官培训", "偏见审计", "理性识人", "预测性分析", "Jobsbor"
    ],
    "tags": [
        "认知科学", "行为经济学", "招聘决策", "结构化面试", "去偏见招聘",
        "人才评估", "面试培训", "算法招聘", "HR科技", "招聘公平性"
    ],
    "metaDescription": "深度解析认知科学与行为经济学如何驱动招聘决策革命，帮助企业识别和控制面试偏见，构建结构化评估体系与数据驱动决策架构，实现从直觉到理性的人才识别人升级。"
}

with open('src/data/blog-posts.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

data.append(new_post)

with open('src/data/blog-posts.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"Appended article-081 successfully. Total posts: {len(data)}")
print(f"Content length: {len(content)} characters")
