# `website` — Cyberpsychosis 官方宣传与多章节文档站

本目录托管 **Cyberpsychosis** 项目的官方宣传与技术文档站点，部署于 Cloudflare Workers（Worker 名称：`cyberpsychosis`）。

## 页面结构

- `/`：Landing Page（Hero 区 + 终端因果树实时演示 + 六大核心亮点 + npm 软件包矩阵）
- `/docs/`：多章节多页面技术文档集合（共 8 章：概览与五维架构、快速开始与 CLI、确定性涌现内核、规则即实体与受限 DSL、因果溯源图谱与平行推演、六大模拟器插件、零绑定渲染协议与 API 手册、npm 软件包矩阵）
- `/about/`：关于我们（About Us）
- `/terms/`：服务条款（Terms & Conditions）
- `/privacy/`：隐私政策（Privacy Policy）
- `/404.html`：404 兜底页面

## 设计系统规范

全站复用继承自 `plutokeating.beer` 的设计系统（`src/design-system/designSystem.ts`），并在 `scripts/lint-tokens.ts` 中强制拦截任何硬编码颜色、阴影、圆角、透明度与动效参数。
