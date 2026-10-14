# `website` 架构与部署说明

## 1. 模块结构与构建流水线

```text
src/i18n/index.ts + src/**/*.i18n.ts (中英双语与可扩展多语言字典)
src/design-system/designSystem.ts
  ──(scripts/gen-tokens.ts)──────► src/design-system/tokens.generated.css
  ──(scripts/gen-screenshots.ts)─► 运行真实 OutpostSandbox 生成 public/screenshots/*.png
  ──(scripts/lint-tokens.ts)─────► 零硬编码视觉参数 + 零硬编码页面文案 + *.i18n.ts 配对静态检查
  ──(scripts/build-site.ts)──────► 预渲染全站双语 HTML + H5/SVG 交互脚本 + sitemap.xml 到 dist/
  ──(@tailwindcss/cli)───────────► 编译压缩 dist/style.css
  ──(wrangler deploy)────────────► Cloudflare Worker "cyberpsychosis"
```

## 2. 源码目录说明

- `src/i18n/`：多语言类型定义、语言注册表（`SUPPORTED_LOCALES`）与零闪烁切换辅助函数（`tr`、`trSvg`）。
- `src/components/`：全站共享头部/底部外壳（`shell.ts` + `shell.i18n.ts`）、SVG 架构与机制动效图集（`diagrams.ts` + `diagrams.i18n.ts`）、文档布局（`docs-layout.ts` + `docs-layout.i18n.ts`）与合规文章布局（`article.ts` + `article.i18n.ts`）。
- `src/pages/`：Landing（`landing.ts` + `landing.i18n.ts`）、8 章技术文档（`docs-data.ts` + `docs-data.i18n.ts`）、About（`about.ts` + `about.i18n.ts`）、Terms（`terms.ts` + `terms.i18n.ts`）、Privacy（`privacy.ts` + `privacy.i18n.ts`）与 404（`not-found.ts` + `not-found.i18n.ts`）。
- `public/screenshots/`：由 `scripts/gen-screenshots.ts` 调用真实内核推演生成的 `workbench-live.png`、`tui-live.png` 与 `worldfork-inspector.png`。

## 3. Cloudflare Worker 与 GitHub 仓库绑定

- **Worker 名称**：`cyberpsychosis`（定义于 `website/wrangler.jsonc`）
- **绑定 GitHub 仓库**：`PlutoKeating/Project.Cyberpsychosis`（根目录 `/website`）
- **静态资源目录**：`./dist`（由 `ASSETS` 绑定托管，`/api/*` 由 `worker/index.ts` 响应健康检查与元数据）
