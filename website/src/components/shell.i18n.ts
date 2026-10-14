import { definePageI18n, L, type LocalizedText } from "../i18n/index.ts";

export interface ShellNavItem {
  readonly id: string;
  readonly label: LocalizedText;
  readonly href: string;
  readonly matchPrefix: string;
}

export interface ShellFooterLink {
  readonly label: LocalizedText;
  readonly href: string;
  readonly external?: boolean;
}

export const SHELL_I18N = definePageI18n({
  brand: {
    badge: L("C.P.", "C.P."),
    prefix: L("CYBER", "CYBER"),
    accent: L("PSYCHOSIS", "PSYCHOSIS"),
    suffix: L("_", "_"),
    homeAria: L("Cyberpsychosis 首页", "Cyberpsychosis Home"),
  },
  a11y: {
    skipToMain: L("跳转至主要内容", "Skip to main content"),
    primaryNavAria: L("Primary Navigation", "Primary Navigation"),
    mobileNavAria: L("Mobile Navigation", "Mobile Navigation"),
    docsNavAria: L("Documentation Navigation", "Documentation Navigation"),
    ecoNavAria: L("Ecosystem Navigation", "Ecosystem Navigation"),
    legalNavAria: L("Legal & Compliance", "Legal & Compliance"),
    langToggleAria: L("切换语言 / Switch Language", "Switch Language / 切换语言"),
    themeToggleAria: L("切换主题 / Toggle Theme", "Toggle Theme / 切换主题"),
  },
  controls: {
    langBadge: L("中 / EN", "EN / 中"),
    themeLabel: L("DARK", "DARK"),
    githubLabel: L("GITHUB", "GITHUB"),
    externalArrow: L("↗", "↗"),
  },
  primaryNav: [
    {
      id: "overview",
      label: L("概览", "OVERVIEW"),
      href: "/",
      matchPrefix: "/exact",
    },
    {
      id: "sandbox",
      label: L("交互沙盒", "SANDBOX"),
      href: "/#sandbox",
      matchPrefix: "/#sandbox",
    },
    {
      id: "highlights",
      label: L("核心机制", "MECHANISMS"),
      href: "/#highlights",
      matchPrefix: "/#highlights",
    },
    {
      id: "docs",
      label: L("架构文档", "DOCS"),
      href: "/docs/",
      matchPrefix: "/docs",
    },
    {
      id: "packages",
      label: L("软件包", "PACKAGES"),
      href: "/docs/npm-packages/",
      matchPrefix: "/docs/npm-packages",
    },
    {
      id: "about",
      label: L("关于", "ABOUT"),
      href: "/about/",
      matchPrefix: "/about",
    },
  ] satisfies ReadonlyArray<ShellNavItem>,
  footer: {
    tagline: L(
      "确定性涌现游戏引擎内核与双端可视化实验室。",
      "Deterministic emergent gameplay engine kernel and dual visual studio."
    ),
    copyright: L(
      "Apache-2.0 开源许可 · © 2026 PlutoKeating",
      "Apache-2.0 License · © 2026 PlutoKeating"
    ),
    colDocsHeading: L("// DOCS", "// DOCS"),
    colEcoHeading: L("// ECOSYSTEM", "// ECOSYSTEM"),
    colLegalHeading: L("// LEGAL", "// LEGAL"),
    docsLinks: [
      { label: L("01 · 五维架构", "01 · 5D Architecture"), href: "/docs/" },
      { label: L("02 · 快速启动", "02 · Quick Start"), href: "/docs/quick-start/" },
      { label: L("03 · 涌现内核", "03 · Emergence Kernel"), href: "/docs/core-kernel/" },
      { label: L("04 · 规则即实体", "04 · Rule-as-Entity"), href: "/docs/rule-as-entity/" },
      { label: L("05 · 因果与分叉", "05 · Causal & WorldFork"), href: "/docs/causal-and-time/" },
    ] satisfies ReadonlyArray<ShellFooterLink>,
    ecoLinks: [
      { label: L("06 · 六大模拟器", "06 · 6 Simulator Plugins"), href: "/docs/runtime-plugins/" },
      { label: L("07 · 渲染与 API", "07 · Snapshot & REST API"), href: "/docs/renderers-and-api/" },
      { label: L("08 · NPM 包矩阵", "08 · NPM Package Matrix"), href: "/docs/npm-packages/" },
      {
        label: L("GitHub 仓库 ↗", "GitHub Repository ↗"),
        href: "https://github.com/PlutoKeating/Project.Cyberpsychosis",
        external: true,
      },
      {
        label: L("npmjs.com ↗", "npmjs.com ↗"),
        href: "https://www.npmjs.com/package/cyberpsychosis",
        external: true,
      },
    ] satisfies ReadonlyArray<ShellFooterLink>,
    legalLinks: [
      { label: L("关于我们", "About Us"), href: "/about/" },
      { label: L("服务条款", "Terms & Conditions"), href: "/terms/" },
      { label: L("隐私政策", "Privacy Policy"), href: "/privacy/" },
      {
        label: L("联系维护者 ↗", "Contact Maintainer ↗"),
        href: "mailto:PlutoKeating@outlook.com",
      },
    ] satisfies ReadonlyArray<ShellFooterLink>,
  },
});
