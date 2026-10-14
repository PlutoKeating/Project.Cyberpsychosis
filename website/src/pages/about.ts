import { renderArticlePage } from "../components/article.ts";

export function renderAboutPage(): string {
  return renderArticlePage({
    path: "/about/",
    title: "关于我们 / About Us — Cyberpsychosis",
    description:
      "关于 Cyberpsychosis 涌现式游戏引擎中间件项目、设计初衷与开源维护团队。",
    eyebrow: "// ABOUT US · 关于我们",
    heading: "构建能够自己生长出故事的确定性系统。",
    lead: "Cyberpsychosis 是由 PlutoKeating 发起并维护的开源涌现式游戏引擎内核中间件项目，以 Apache-2.0 协议公开发布。",
    updated: "Last Updated: 2026-10-14",
    sections: [
      {
        index: "01 / MISSION",
        heading: "项目初衷与使命",
        paragraphs: [
          "在游戏工业中，物理引擎（Box2D、Rapier）与渲染引擎早已高度商品化，但“跨系统的涌现式玩法（Emergent Gameplay）”却始终停留在各个独立游戏的私有黑盒代码里——每一个想做化学连锁、Baba 式规则重编译或 Dwarf Fortress 式社会模拟的开发者，都不得不从零手写整套交互与调试管线。",
          "Cyberpsychosis 的诞生正是为了填补这一空白：我们用“瘦 Vocabulary × 极简 Grammar × 瘦 Semantics × 胖 Runtime × 清晰 Renderer”的五维框架，把规则即实体（Rule-as-Entity）、多模态空间查询、跨系统因果图谱（Causal DAG）与平行世界推演（WorldFork）沉淀为一个轻量、确定性、零渲染绑定的通用中间件。"
        ]
      },
      {
        index: "02 / MAINTAINER",
        heading: "作者与维护者",
        paragraphs: [
          "PlutoKeating（GitHub: @PlutoKeating）：项目架构师与唯一维护者，负责 Cyberpsychosis 涌现内核、六大模拟器插件、终端 TUI 与 Web 实验室工作台的设计与工程实现。",
          "我们在代码、系统工程与 AI 的交界处持续探索，致力于创造清晰、可验证、对开发者真正有用的开源工具。"
        ],
        bullets: [
          "个人作品档案：https://plutokeating.beer",
          "GitHub 仓库：https://github.com/PlutoKeating/Project.Cyberpsychosis",
          "联系邮箱：PlutoKeating@outlook.com"
        ]
      },
      {
        index: "03 / OPEN SOURCE & DESIGN SYSTEM",
        heading: "开源精神与设计致谢",
        paragraphs: [
          "本项目全部核心代码、插件、验证场景与文档均采用 Apache License 2.0 开源许可协议发布于 GitHub 与 npmjs。",
          "本站点的视觉系统沿用 PlutoKeating 统一的「暗夜琥珀与战术切角」设计系统（Design System Tokens），全站零硬编码视觉参数，支持深色与浅色主题自适应切换。"
        ]
      }
    ]
  });
}
