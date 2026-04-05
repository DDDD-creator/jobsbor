# 🚀 Jobsbor 生产环境配置指南

## 快速检查清单

- [ ] 设置 JWT_SECRET
- [ ] 注册 Resend 并设置邮件API
- [ ] 验证邮件发送功能
- [ ] 设置 Google Analytics（可选）

---

## 1. 设置 JWT_SECRET

### 生成密钥
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Vercel Dashboard 配置
1. 访问 https://vercel.com/dashboard
2. 进入 jobsbor 项目
3. 点击 "Settings" → "Environment Variables"
4. 添加变量：
   - Name: `JWT_SECRET`
   - Value: [上面生成的密钥]
5. 点击 Save
6. 重新部署项目

---

## 2. 配置 Resend 邮件服务

### 注册 Resend
1. 访问 https://resend.com
2. 使用 GitHub 或邮箱注册
3. 验证邮箱

### 获取 API Key
1. 进入 Resend Dashboard
2. 点击 "API Keys" → "Create API Key"
3. 选择 "Sending access"
4. 复制生成的 API Key

### 验证域名（可选但推荐）
1. 在 Resend Dashboard 点击 "Domains"
2. 点击 "Add Domain"
3. 输入你的域名（如 jobsbor.com）
4. 按照提示添加 DNS 记录
5. 等待验证通过

### Vercel 配置
添加两个环境变量：
- `RESEND_API_KEY`: [你的API Key]
- `RESEND_FROM_EMAIL`: 
  - 如果验证过域名: `noreply@jobsbor.com`
  - 如果没有: `onboarding@resend.dev`

---

## 3. 验证配置

### 测试邮件发送
1. 访问 https://jobsbor.vercel.app/contact
2. 填写联系表单
3. 检查是否收到邮件

### 检查环境变量
```bash
# 在 Vercel Dashboard 查看
Settings → Environment Variables
```

---

## 4. 可选配置

### Google Analytics
1. 访问 https://analytics.google.com
2. 创建新的数据流
3. 获取 Measurement ID (G-XXXXXXXXXX)
4. 在 Vercel 添加环境变量：
   - `NEXT_PUBLIC_GA_ID`: G-XXXXXXXXXX

### 百度统计
1. 访问 https://tongji.baidu.com
2. 添加网站获取统计代码
3. 在 Vercel 添加：
   - `NEXT_PUBLIC_BAIDU_ID`: 你的百度统计ID

---

## 5. 监控和日志

### Vercel Analytics
- 自动收集页面浏览数据
- 查看访问来源、设备分布
- 无需额外配置

### 查看日志
1. Vercel Dashboard → 项目 → Deployments
2. 点击最新部署的 "View Logs"
3. 查看 Runtime Logs

---

## 6. 常见问题

### Q: 邮件发送失败
A: 检查：
- RESEND_API_KEY 是否正确
- 是否超出免费额度（100封/天）
- 查看 Vercel Logs 获取详细错误

### Q: JWT 认证失败
A: 检查：
- JWT_SECRET 是否设置
- 是否重新部署（环境变量需要重新部署才生效）

### Q: 环境变量不生效
A: 必须重新部署项目！
1. Vercel Dashboard
2. Deployments
3. Redeploy

---

## 下一步

配置完成后，你就可以：
- ✅ 使用联系表单
- ✅ 使用管理后台
- ✅ 查看访问数据
- 🎯 专注增长运营！
