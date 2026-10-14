# `website` — Cyberpsychosis 官方宣传与多章节文档站

本目录托管 **Cyberpsychosis** 项目的官方宣传与技术文档站点，部署于 Cloudflare Workers（Worker 名称：`cyberpsychosis`）。

## 五阶段用户旅程与页面结构

- `/`：极简视觉化 Landing Page（五阶段 User Journey Map）：
  1. **Stage 01 · 浏览器内真内核实时沙盒 (`#top` / `#sandbox`)**：极简核心宣言 + 浏览器内直接运行编译后的真实 `cyberpsychosis-core` + `cyberpsychosis-demo` ES 模块（支持点击推动词块、单帧步进 `STEP +1`、CoW 增量快照倒带 `REWIND -1`、点选实体实时执行 `kernel.causal.traceLineage(id)`、实时计算 32-bit FNV-1a `stateHash` 以及一键生成 `?replay=` 故事分享链接）。
  2. **Stage 02 · 因果推演 (`#cascade`)**：SVG 动态六维因果传导示意图与共享标量属性黑板。
  3. **Stage 03 · 双端实拍 (`#screenshots`)**：真实运行截图画廊（Web 多图层实验室、终端 ASCII/ANSI 沙盒、WorldFork 平行时间线检查器）与标注引线。
  4. **Stage 04 · 六大机制 (`#highlights`)**：6 张独立 SVG 动效示意图卡片（五维公式、规则即实体、因果 DAG、时间旅行与分叉、六大解耦插件、零绑定快照）。
  5. **Stage 05 · 四层架构 (`#architecture`)**：四层解耦架构 SVG 全景蓝图 + 6 个官方 npm 软件包矩阵。
- `/docs/`：8 章多页面技术文档（每章均内置专属 SVG 架构示意图、3 项核心规格指标、精炼说明与可复制代码块）。
- `/about/`：关于我们（含 SVG 架构演进横幅与 3 项核心摘要卡片）。
- `/terms/`：服务条款（含 Apache-2.0 授权摘要卡片与精炼条款）。
- `/privacy/`：隐私政策（含零追踪、零遥测、100% 本地内存运行摘要卡片）。
- `/404.html`：404 时间轴脱节示意图页面。

## 多语言 i18n 架构与零硬编码规范

1. **模块化 `*.i18n.ts` 体系**：
   - `src/i18n/index.ts` 定义可扩展语言注册表（默认内置 `zh` 简体中文与 `en` 英文，预留多语种扩展脚手架）。
   - 每个页面与组件均配有同级 `*.i18n.ts` 文件（`landing.i18n.ts`、`docs-data.i18n.ts`、`about.i18n.ts`、`terms.i18n.ts`、`privacy.i18n.ts`、`not-found.i18n.ts`、`shell.i18n.ts`、`docs-layout.i18n.ts`、`article.i18n.ts`、`diagrams.i18n.ts`）。
   - 页面模板文件严禁硬编码文案文本，由 `scripts/lint-tokens.ts` 在构建期强制静态拦截。
2. **设计系统零硬编码视觉参数**：
   - 全站复用 `src/design-system/designSystem.ts`，通过 `scripts/lint-tokens.ts` 拦截任何硬编码颜色、圆角、阴影、透明度与动效时长。
