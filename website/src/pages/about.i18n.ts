import type { ArticlePageSpec } from "../components/article.ts";
import { definePageI18n, L } from "../i18n/index.ts";

export const ABOUT_I18N: Readonly<ArticlePageSpec> = definePageI18n({
  path: "/about/",
  heroKind: "about",
  title: L("关于我们 — Cyberpsychosis", "About Us — Cyberpsychosis"),
  description: L(
    "Cyberpsychosis 涌现式游戏引擎中间件架构定位与开源维护信息。",
    "Cyberpsychosis emergent gameplay engine middleware positioning and open-source maintainer info."
  ),
  eyebrow: L("// ABOUT US · 关于我们", "// ABOUT US"),
  heading: L("让确定性系统生长出故事。", "Systems That Grow Stories."),
  lead: L(
    "Cyberpsychosis 是由 PlutoKeating 构建并维护的开源涌现游戏引擎内核中间件（Apache-2.0）。",
    "Cyberpsychosis is an open-source emergent gameplay engine kernel middleware built and maintained by PlutoKeating (Apache-2.0)."
  ),
  updated: L("更新时间：2026-10-14", "Last Updated: 2026-10-14"),
  highlights: [
    {
      badge: "01 // FIVE-DIMENSION KERNEL",
      title: L("五维涌现原语", "5D Emergence Primitives"),
      detail: L("统一封装规则重编译、多模态空间与因果溯源图谱。", "Unifies dynamic rule recompilation, spatial indexing, and causal graphs."),
    },
    {
      badge: "02 // ZERO LOCK-IN",
      title: L("零外部运行时依赖", "Zero Runtime Dependencies"),
      detail: L("纯 TypeScript 实现，通过 JSON 快照驱动任意渲染层。", "Pure TypeScript kernel driving any renderer via JSON snapshots."),
    },
    {
      badge: "03 // OPEN ECOSYSTEM",
      title: L("Apache-2.0 开源发布", "Apache-2.0 Open Source"),
      detail: L("6 个官方 npm 软件包同步公开，开箱即用。", "Six official npm packages published for immediate integration."),
    },
  ],
  sections: [
    {
      index: "01 / POSITIONING",
      heading: L("工程定位", "Engineering Focus"),
      paragraphs: [
        L(
          "Cyberpsychosis 将规则即实体（Rule-as-Entity）、多模态空间索引、跨系统因果图谱（Causal DAG）与平行世界推演（WorldFork）沉淀为标准化的无头中间件。",
          "Cyberpsychosis packages Rule-as-Entity recompilation, tri-modal spatial indexing, cross-domain Causal DAG tracing, and WorldFork parallel simulation into a headless middleware."
        ),
      ],
    },
    {
      index: "02 / MAINTAINER",
      heading: L("作者与维护者", "Maintainer"),
      paragraphs: [
        L(
          "PlutoKeating（@PlutoKeating）负责涌现内核、六大模拟器插件、终端 TUI 与 Web 实验室工作台的设计与实现。",
          "PlutoKeating (@PlutoKeating) leads the architecture and engineering of the emergence kernel, simulator plugins, Terminal TUI, and Web Studio."
        ),
      ],
      bullets: [
        L("个人主页：https://plutokeating.beer", "Portfolio: https://plutokeating.beer"),
        L("代码仓库：https://github.com/PlutoKeating/Project.Cyberpsychosis", "Repository: https://github.com/PlutoKeating/Project.Cyberpsychosis"),
        L("联系邮箱：PlutoKeating@outlook.com", "Contact: PlutoKeating@outlook.com"),
      ],
    },
    {
      index: "03 / DESIGN SYSTEM",
      heading: L("设计系统规范", "Design System Specification"),
      paragraphs: [
        L(
          "全站复用继承自 plutokeating.beer 的设计系统变量，通过静态校验确保零硬编码视觉参数，原生支持深浅双主题与多语言实时切换。",
          "The website inherits the plutokeating.beer token system with build-time zero-hardcode verification, native dark/light themes, and instant multi-language switching."
        ),
      ],
    },
  ],
});
