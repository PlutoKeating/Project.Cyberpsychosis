# `website` 快速启动与部署指南

```bash
# 1. 生成设计系统 CSS 变量并执行零硬编码视觉参数 & i18n 静态检查
npm --workspace=website run tokens
npm --workspace=website run lint:tokens

# 2. 基于真实 OutpostSandbox 模拟状态重新生成高分辩率产品实拍截图
npm --workspace=website run screenshots

# 3. 构建全站静态产物到 website/dist
npm --workspace=website run build

# 4. 运行网站结构、截图、i18n 配对与设计系统契约测试
npm --workspace=website run test

# 5. 本地通过 Wrangler 预览 Worker 站点
npm --workspace=website run preview

# 6. 部署至 Cloudflare Worker (cyberpsychosis)
npm --workspace=website run deploy
```
