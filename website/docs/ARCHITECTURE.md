# `website` 架构与部署说明

## 1. 构建流水线

```text
src/design-system/designSystem.ts
  ──(scripts/gen-tokens.ts)──► src/design-system/tokens.generated.css
  ──(scripts/lint-tokens.ts)─► 零硬编码视觉参数静态检查
  ──(scripts/build-site.ts)──► 预渲染全站 HTML + sitemap.xml + _headers 到 dist/
  ──(@tailwindcss/cli)───────► 编译压缩 dist/style.css
  ──(wrangler deploy)────────► Cloudflare Worker "cyberpsychosis"
```

## 2. Cloudflare Worker 与 GitHub 仓库绑定

- **Worker 名称**：`cyberpsychosis`（定义于 `website/wrangler.jsonc`）
- **绑定 GitHub 仓库**：`PlutoKeating/Project.Cyberpsychosis`（根目录 `/website`）
- **静态资源目录**：`./dist`（由 `ASSETS` 绑定托管，`/api/*` 由 `worker/index.ts` 响应健康检查与元数据）
