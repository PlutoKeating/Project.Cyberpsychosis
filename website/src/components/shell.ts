/**
 * Shared Site Header, Site Footer, and Design System UI primitives.
 * Reused across Landing, all Docs subpages, About Us, Terms & Conditions, Privacy Policy, and 404.
 * Strictly uses semantic Design System tokens — zero hardcoded visual parameters.
 */

export const GITHUB_REPO_URL = "https://github.com/PlutoKeating/Project.Cyberpsychosis";
export const NPM_PACKAGE_URL = "https://www.npmjs.com/package/cyberpsychosis";
export const AUTHOR_SITE_URL = "https://plutokeating.beer";

export function escapeHtml(value: string): string {
  return String(value).replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return ch;
    }
  });
}

export interface NavItem {
  label: string;
  href: string;
  matchPrefix: string;
}

const PRIMARY_NAV: ReadonlyArray<NavItem> = [
  { label: "OVERVIEW / 概览", href: "/", matchPrefix: "/exact" },
  { label: "HIGHLIGHTS / 核心亮点", href: "/#highlights", matchPrefix: "/#highlights" },
  { label: "DOCS / 文档中心", href: "/docs/", matchPrefix: "/docs" },
  { label: "PACKAGES / NPM包", href: "/docs/npm-packages/", matchPrefix: "/docs/npm-packages" },
  { label: "ABOUT / 关于我们", href: "/about/", matchPrefix: "/about" },
];

export function renderSiteHeader(activePath: string): string {
  const navLinks = PRIMARY_NAV.map((item) => {
    const isActive =
      item.href === "/"
        ? activePath === "/"
        : activePath.startsWith(item.matchPrefix);
    const stateClass = isActive
      ? "text-accent border-b border-accent pb-1"
      : "text-fg-muted hover:text-accent";
    return `<a class="font-mono text-xs tracking-widest transition-colors duration-(--ds-duration-fast) ${stateClass}" href="${item.href}">${escapeHtml(item.label)}</a>`;
  }).join("\n        ");

  return `<header class="fixed inset-x-0 top-0 z-40 border-b border-border bg-surface-glass backdrop-blur-glass">
    <div class="mx-auto flex h-(--ds-header-height) max-w-wide items-center justify-between gap-4 px-5 sm:px-8 lg:px-14">
      <a class="group flex min-w-0 items-center gap-3.5" href="/" aria-label="Cyberpsychosis Home">
        <span class="clip-small flex size-11 shrink-0 items-center justify-center border border-accent bg-accent-soft font-mono text-sm font-semibold tracking-wide text-accent transition-colors duration-(--ds-duration-fast) group-hover:bg-accent group-hover:text-accent-fg">C.P.</span>
        <span class="truncate font-sans text-sm font-semibold tracking-widest sm:text-base">CYBER<span class="text-accent">PSYCHOSIS</span></span>
      </a>
      <nav class="hidden items-center gap-7 lg:flex" aria-label="Primary Navigation">
        ${navLinks}
      </nav>
      <div class="flex shrink-0 items-center gap-2.5">
        <button type="button" id="theme-toggle-btn" class="clip-small inline-flex items-center gap-1.5 border border-border-strong bg-surface px-3 py-2 font-mono text-xs text-fg-muted transition-colors duration-(--ds-duration-fast) hover:border-accent hover:text-accent" aria-label="切换明暗主题 / Toggle Theme">
          <span class="signal-dot inline-block size-2 rounded-full bg-accent"></span>
          <span id="theme-toggle-label">THEME</span>
        </button>
        <a class="clip-small inline-flex items-center gap-2 border border-accent bg-accent-soft px-3.5 py-2 font-mono text-xs font-semibold tracking-wide text-accent transition-colors duration-(--ds-duration-fast) hover:bg-accent hover:text-accent-fg" href="${GITHUB_REPO_URL}" target="_blank" rel="noopener noreferrer">GITHUB <span aria-hidden="true">↗</span></a>
      </div>
    </div>
    <nav class="flex items-center gap-4 overflow-x-auto border-t border-border bg-bg-elevated px-5 py-2.5 lg:hidden" aria-label="Mobile Navigation">
      ${PRIMARY_NAV.map(
        (item) =>
          `<a class=" whitespace-nowrap font-mono text-xs text-fg-muted hover:text-accent" href="${item.href}">${escapeHtml(item.label)}</a>`
      ).join("")}
    </nav>
  </header>`;
}

export function renderSiteFooter(): string {
  return `<footer class="border-t border-border bg-bg-elevated">
    <div class="mx-auto grid max-w-wide gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-14">
      <div class="flex flex-col gap-3">
        <a class="inline-flex items-center gap-3 font-sans text-lg font-semibold tracking-wide text-fg hover:text-accent" href="/">
          <span class="clip-small flex size-8 items-center justify-center border border-accent bg-accent-soft font-mono text-xs text-accent">C.P.</span>
          <span>CYBER<span class="text-accent">PSYCHOSIS</span><span class="text-accent">_</span></span>
        </a>
        <p class="text-sm text-fg-muted">通用涌现式游戏引擎内核中间件与双端可视化实验工作台。<br/>General-Purpose Emergent Gameplay Engine Middleware.</p>
        <p class="font-mono text-xs text-fg-subtle">Apache-2.0 License · © 2026 PlutoKeating</p>
      </div>

      <nav class="flex flex-col gap-2.5 text-sm" aria-label="Documentation Navigation">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest text-accent">// DOCUMENTATION</p>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="/docs/">01. 概览与五维架构 (Overview)</a>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="/docs/quick-start/">02. 快速开始与 CLI (Quick Start)</a>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="/docs/core-kernel/">03. 确定性涌现内核 (Emergence Core)</a>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="/docs/rule-as-entity/">04. 规则即实体与受限 DSL (Rules &amp; DSL)</a>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="/docs/runtime-plugins/">06. 六大模拟器插件 (Runtime Plugins)</a>
      </nav>

      <nav class="flex flex-col gap-2.5 text-sm" aria-label="Ecosystem Navigation">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest text-accent">// ECOSYSTEM &amp; NPM</p>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="/docs/npm-packages/">npm 包矩阵 (cyberpsychosis*)</a>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="/docs/renderers-and-api/">渲染协议与 REST API 手册</a>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="${GITHUB_REPO_URL}" target="_blank" rel="noopener noreferrer">GitHub 源码仓库 ↗</a>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="${NPM_PACKAGE_URL}" target="_blank" rel="noopener noreferrer">npmjs.com/package/cyberpsychosis ↗</a>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="${AUTHOR_SITE_URL}" target="_blank" rel="noopener noreferrer">PlutoKeating Archive ↗</a>
      </nav>

      <nav class="flex flex-col gap-2.5 text-sm" aria-label="Legal & Compliance">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest text-accent">// LEGAL &amp; INFO</p>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="/about/">关于我们 / About Us</a>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="/terms/">服务条款 / Terms &amp; Conditions</a>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="/privacy/">隐私政策 / Privacy Policy</a>
        <a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="mailto:PlutoKeating@outlook.com">联系维护者 / Contact ↗</a>
      </nav>
    </div>
  </footer>`;
}

export interface PageLayoutOptions {
  title: string;
  description: string;
  activePath: string;
  bodyHtml: string;
}

export function renderPageLayout(opts: PageLayoutOptions): string {
  return `<!doctype html>
<html lang="zh-CN" data-theme="dark">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${escapeHtml(opts.description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(opts.title)}" />
  <meta property="og:description" content="${escapeHtml(opts.description)}" />
  <title>${escapeHtml(opts.title)}</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/style.css" />
  <script>
    (function() {
      try {
        var saved = localStorage.getItem("cyberpsychosis.theme");
        if (saved === "light" || saved === "dark") {
          document.documentElement.setAttribute("data-theme", saved);
        }
      } catch (e) {}
    })();
  </script>
</head>
<body class="flex min-h-dvh flex-col bg-bg font-sans text-fg antialiased overflow-x-hidden">
  <a class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-fg" href="#main">跳转到主要内容 / Skip to main content</a>
  <div class="cyber-grid pointer-events-none fixed inset-x-0 top-0 -z-10 h-dvh" aria-hidden="true"></div>
  ${renderSiteHeader(opts.activePath)}
  <main id="main" class="flex-1 pt-24 lg:pt-18">
    ${opts.bodyHtml}
  </main>
  ${renderSiteFooter()}
  <script src="/app.js" defer></script>
</body>
</html>`;
}
