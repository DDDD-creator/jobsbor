import json

with open("src/data/blog-posts.json", "r", encoding="utf-8") as f:
    data = json.load(f)

with open("article-125-content.md", "r", encoding="utf-8") as f:
    content = f.read()

new_article = {
    "id": "article-125",
    "title": "再就业人才战略与职业重启生态：构建支持职业生涯中断者重返职场的包容性人才系统",
    "description": "系统剖析职业中断群体的隐藏价值与再就业障碍，阐述Returnship等职业重启计划的设计框架，提供从招聘流程改造、能力刷新支持到文化融入的全链路解决方案，助力企业将再就业人才转化为战略竞争优势。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-12T10:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "再就业人才战略", "职业重启", "Returnship", "职业中断", "重返职场",
        "包容性招聘", "职业空白期", "女性重返职场", "人才激活", "再就业障碍",
        "职业重启生态", "照护型中断", "能力刷新", "雇主品牌", "人才多样性"
    ],
    "tags": [
        "再就业战略", "职业重启", "Returnship", "包容性招聘",
        "人才多样性", "雇主品牌", "重返职场", "职业中断"
    ],
    "metaDescription": "全面解析职业中断群体的人才价值与再就业路径，提供Returnship计划设计、招聘流程改造、能力刷新与文化融入的系统方案，构建支持人才职业重启的包容性组织。"
}

data.append(new_article)

with open("src/data/blog-posts.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print("Appended article-125 successfully")
