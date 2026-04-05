# 数据库Schema设计

## 核心表结构

### 用户系统

#### users
```sql
id              UUID PRIMARY KEY
email           VARCHAR(255) UNIQUE NOT NULL
password_hash   VARCHAR(255)
phone           VARCHAR(50)
user_type       ENUM('candidate', 'employer', 'recruiter', 'admin')
status          ENUM('active', 'pending', 'suspended')
created_at      TIMESTAMP
updated_at      TIMESTAMP
last_login      TIMESTAMP
email_verified  BOOLEAN DEFAULT FALSE
phone_verified  BOOLEAN DEFAULT FALSE
language        VARCHAR(10) DEFAULT 'en'
timezone        VARCHAR(50) DEFAULT 'UTC'
```

#### profiles (求职者档案)
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
first_name      VARCHAR(100)
last_name       VARCHAR(100)
headline        VARCHAR(255)
summary         TEXT
location        VARCHAR(255)
country         VARCHAR(100)
city            VARCHAR(100)
avatar_url      VARCHAR(500)
resume_url      VARCHAR(500)
portfolio_url   VARCHAR(500)
linkedin_url    VARCHAR(500)
github_url      VARCHAR(500)
website_url     VARCHAR(500)
open_to_work    BOOLEAN DEFAULT FALSE
current_salary  DECIMAL(12,2)
expected_salary DECIMAL(12,2)
salary_currency VARCHAR(10)
years_of_experience INT
education_level ENUM('high_school', 'bachelor', 'master', 'phd', 'other')
availability    ENUM('immediately', '2_weeks', '1_month', 'negotiable')
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### company_profiles (企业档案)
```sql
id                  UUID PRIMARY KEY
user_id             UUID REFERENCES users(id)
company_name        VARCHAR(255) NOT NULL
company_slug        VARCHAR(255) UNIQUE
industry            VARCHAR(100)
company_size        ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+')
founded_year        INT
headquarters        VARCHAR(255)
website             VARCHAR(500)
description         TEXT
logo_url            VARCHAR(500)
cover_image_url     VARCHAR(500)
company_type        ENUM('startup', 'private', 'public', 'government', 'nonprofit')
verified            BOOLEAN DEFAULT FALSE
verification_date   TIMESTAMP
social_links        JSONB
benefits            JSONB
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### 职位系统

#### jobs
```sql
id                  UUID PRIMARY KEY
company_id          UUID REFERENCES company_profiles(id)
title               VARCHAR(255) NOT NULL
slug                VARCHAR(255) UNIQUE
department          VARCHAR(100)
location            VARCHAR(255)
work_type           ENUM('remote', 'hybrid', 'onsite')
employment_type     ENUM('full_time', 'part_time', 'contract', 'internship', 'freelance')
experience_level    ENUM('entry', 'mid', 'senior', 'lead', 'executive')
min_salary          DECIMAL(12,2)
max_salary          DECIMAL(12,2)
salary_currency     VARCHAR(10)
salary_period       ENUM('hourly', 'monthly', 'yearly')
description         TEXT
requirements        TEXT[]
benefits            TEXT[]
skills_required     JSONB
status              ENUM('draft', 'published', 'closed', 'expired')
expires_at          TIMESTAMP
views_count         INT DEFAULT 0
applications_count  INT DEFAULT 0
is_featured         BOOLEAN DEFAULT FALSE
created_at          TIMESTAMP
updated_at          TIMESTAMP
published_at        TIMESTAMP
```

#### job_applications
```sql
id                  UUID PRIMARY KEY
job_id              UUID REFERENCES jobs(id)
candidate_id        UUID REFERENCES profiles(id)
status              ENUM('applied', 'reviewed', 'shortlisted', 'interview', 'offer', 'rejected', 'withdrawn')
cover_letter        TEXT
resume_url          VARCHAR(500)
applied_at          TIMESTAMP
updated_at          TIMESTAMP
interview_date      TIMESTAMP
offer_amount        DECIMAL(12,2)
notes               TEXT
```

### 匹配系统

#### skills
```sql
id          UUID PRIMARY KEY
name        VARCHAR(100) UNIQUE NOT NULL
category    VARCHAR(100)
type        ENUM('technical', 'soft', 'language', 'certification')
parent_id   UUID REFERENCES skills(id)
created_at  TIMESTAMP
```

#### candidate_skills
```sql
id              UUID PRIMARY KEY
candidate_id    UUID REFERENCES profiles(id)
skill_id        UUID REFERENCES skills(id)
proficiency     ENUM('beginner', 'intermediate', 'advanced', 'expert')
years_used      INT
verified        BOOLEAN DEFAULT FALSE
verification_source VARCHAR(100)
created_at      TIMESTAMP
```

#### matches
```sql
id                  UUID PRIMARY KEY
job_id              UUID REFERENCES jobs(id)
candidate_id        UUID REFERENCES profiles(id)
match_score         DECIMAL(5,2)
skill_match_score   DECIMAL(5,2)
experience_score    DECIMAL(5,2)
salary_match_score  DECIMAL(5,2)
location_score      DECIMAL(5,2)
algorithm_version   VARCHAR(50)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

### 消息系统

#### messages
```sql
id              UUID PRIMARY KEY
sender_id       UUID REFERENCES users(id)
receiver_id     UUID REFERENCES users(id)
job_id          UUID REFERENCES jobs(id)
subject         VARCHAR(255)
body            TEXT
status          ENUM('sent', 'delivered', 'read', 'archived')
created_at      TIMESTAMP
read_at         TIMESTAMP
```

#### conversations
```sql
id              UUID PRIMARY KEY
participant_1   UUID REFERENCES users(id)
participant_2   UUID REFERENCES users(id)
job_id          UUID REFERENCES jobs(id)
last_message    TEXT
last_message_at TIMESTAMP
created_at      TIMESTAMP
updated_at      TIMESTAMP
is_archived     BOOLEAN DEFAULT FALSE
```

### 内容与社区

#### articles
```sql
id              UUID PRIMARY KEY
author_id       UUID REFERENCES users(id)
title           VARCHAR(255)
slug            VARCHAR(255) UNIQUE
content         TEXT
excerpt         VARCHAR(500)
featured_image  VARCHAR(500)
category        VARCHAR(100)
tags            VARCHAR(100)[]
status          ENUM('draft', 'published', 'archived')
views_count     INT DEFAULT 0
likes_count     INT DEFAULT 0
comments_count  INT DEFAULT 0
published_at    TIMESTAMP
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

#### comments
```sql
id              UUID PRIMARY KEY
article_id      UUID REFERENCES articles(id)
user_id         UUID REFERENCES users(id)
parent_id       UUID REFERENCES comments(id)
content         TEXT
status          ENUM('pending', 'approved', 'rejected')
created_at      TIMESTAMP
updated_at      TIMESTAMP
```

### 系统管理

#### subscriptions
```sql
id                  UUID PRIMARY KEY
company_id          UUID REFERENCES company_profiles(id)
plan                ENUM('free', 'professional', 'enterprise', 'custom')
status              ENUM('active', 'cancelled', 'expired', 'trial')
start_date          DATE
end_date            DATE
trial_end_date      DATE
max_jobs            INT
max_applicants      INT
features            JSONB
amount              DECIMAL(10,2)
currency            VARCHAR(10)
created_at          TIMESTAMP
updated_at          TIMESTAMP
```

#### analytics_events
```sql
id          UUID PRIMARY KEY
user_id     UUID REFERENCES users(id)
event_type  VARCHAR(100)
event_data  JSONB
ip_address  VARCHAR(45)
user_agent  TEXT
created_at  TIMESTAMP
```

#### notifications
```sql
id              UUID PRIMARY KEY
user_id         UUID REFERENCES users(id)
type            VARCHAR(100)
title           VARCHAR(255)
message         TEXT
link            VARCHAR(500)
is_read         BOOLEAN DEFAULT FALSE
created_at      TIMESTAMP
```

## 索引策略

### 高频查询索引
```sql
-- 职位搜索
CREATE INDEX idx_jobs_status_published ON jobs(status, published_at DESC);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_work_type ON jobs(work_type);
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX idx_jobs_salary_range ON jobs(min_salary, max_salary);

-- 用户搜索
CREATE INDEX idx_profiles_location ON profiles(country, city);
CREATE INDEX idx_profiles_open_to_work ON profiles(open_to_work);
CREATE INDEX idx_profiles_experience ON profiles(years_of_experience);

-- 申请状态
CREATE INDEX idx_applications_job_status ON job_applications(job_id, status);
CREATE INDEX idx_applications_candidate ON job_applications(candidate_id);

-- 匹配分数
CREATE INDEX idx_matches_job_score ON matches(job_id, match_score DESC);
CREATE INDEX idx_matches_candidate_score ON matches(candidate_id, match_score DESC);

-- 全文搜索
CREATE INDEX idx_jobs_search ON jobs USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_profiles_search ON profiles USING gin(to_tsvector('english', headline || ' ' || summary));
```

## 数据迁移策略
1. 使用 Prisma Migrate 管理数据库变更
2. 每次变更创建迁移文件
3. 生产环境迁移前备份
4. 支持回滚机制

## 扩展考虑
- 分库分表策略（用户量>1000万时）
- 读写分离
- 缓存层（Redis）
- 搜索引擎（Elasticsearch）
