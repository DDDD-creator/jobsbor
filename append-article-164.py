import json
import os

# Read the content
with open('article-164-content.md', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract title from first line
title = content.split('\n')[0].replace('# ', '').strip()

# Build article object
article = {
    "id": "article-164",
    "title": title,
    "description": "系统剖析卫星遥感与空天信息产业的全链条人才版图，深入解读遥感卫星设计、遥感数据解译、北斗导航、地理空间智能与空天大数据平台五大核心领域的人才需求格局与竞争态势，为企业构建空天信息时代的人才高地提供前瞻性战略指南。",
    "content": content,
    "source": "Jobsbor原创",
    "author": "Jobsbor编辑部",
    "pubDate": "2026-04-14T16:00:00.000Z",
    "image": "",
    "link": "",
    "sourceCategory": "original",
    "sourceLang": "zh",
    "keywords": [
        "卫星遥感",
        "空天信息",
        "北斗导航",
        "地理空间智能",
        "遥感解译",
        "数字孪生",
        "实景三维",
        "商业航天",
        "遥感AI",
        "位置服务",
        "GIS",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "未来工作"
    ],
    "tags": [
        "卫星遥感",
        "空天信息",
        "人才战略",
        "科技招聘",
        "前沿技术",
        "北斗导航",
        "遥感AI",
        "地理空间智能",
        "数字孪生",
        "HR战略"
    ],
    "metaDescription": "系统剖析卫星遥感与空天信息产业的全链条人才版图，深入解读遥感卫星设计、遥感数据解译、北斗导航、地理空间智能与空天大数据平台五大核心领域的人才需求格局与竞争态势，为企业构建空天信息时代的人才高地提供前瞻性战略指南。"
}

# Read existing blog posts
json_path = 'src/data/blog-posts.json'
with open(json_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Check if article-164 already exists
existing_ids = {a['id'] for a in data}
if article['id'] in existing_ids:
    print(f"Article {article['id']} already exists. Skipping.")
else:
    data.append(article)
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"Successfully appended {article['id']} to {json_path}")
    print(f"Total articles: {len(data)}")
