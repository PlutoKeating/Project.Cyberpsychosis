# `website` 快速启动与部署指南

```bash
# 1. 生成设计系统 CSS 变量并执行零硬编码静态检查
npm --workspace=website run tokens
npm --workspace=website run lint:tokens

# 2. 构建全站静态产物到 website/dist
npm --workspace=website run build

# 3. 运行网站结构与设计系统契约测试
npm --workspace=website run test

# 4. 本地通过 Wrangler 预览 Worker 站点
npm --workspace=website run preview

# 5. 部署至 Cloudflare Worker (cyberpsychosis)
npm --workspace=website run deploy
```
