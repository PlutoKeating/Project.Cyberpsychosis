/**
 * Shared Site Header, Site Footer, and Page Layout shell.
 * Strictly reads all user-facing copy from `shell.i18n.ts` and uses Design System tokens.
 */

import {
  DEFAULT_LOCALE,
  escapeHtml,
  type Locale,
  type LocalizedText,
  pickLocale,
  tr,
  trDataAttrs,
} from "../i18n/index.ts";
import { SHELL_I18N, type ShellFooterLink } from "./shell.i18n.ts";

export { escapeHtml };

export const GITHUB_REPO_URL = "https://github.com/PlutoKeating/Project.Cyberpsychosis";
export const NPM_PACKAGE_URL = "https://www.npmjs.com/package/cyberpsychosis";
export const AUTHOR_SITE_URL = "https://plutokeating.beer";

function renderFooterLink(link: ShellFooterLink): string {
  const extAttrs = link.external
    ? ` target="_blank" rel="noopener noreferrer"`
    : "";
  return `<a class="text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="${link.href}"${extAttrs}>${tr(link.label)}</a>`;
}

export function renderSiteHeader(activePath: string): string {
  const navLinks = SHELL_I18N.primaryNav
    .map((item) => {
      const isActive =
        item.href === "/"
          ? activePath === "/"
          : activePath.startsWith(item.matchPrefix);
      const stateClass = isActive
        ? "text-accent border-b border-accent pb-1"
        : "text-fg-muted hover:text-accent";
      return `<a class="font-mono text-xs tracking-widest transition-colors duration-(--ds-duration-fast) ${stateClass}" href="${item.href}">${tr(item.label)}</a>`;
    })
    .join("\n        ");

  const mobileLinks = SHELL_I18N.primaryNav
    .map(
      (item) =>
        `<a class="whitespace-nowrap font-mono text-xs text-fg-muted hover:text-accent" href="${item.href}">${tr(item.label)}</a>`
    )
    .join("");

  return `<header class="fixed inset-x-0 top-0 z-40 border-b border-border bg-surface-glass backdrop-blur-glass">
    <div class="mx-auto flex h-(--ds-header-height) max-w-wide items-center justify-between gap-4 px-5 sm:px-8 lg:px-14">
      <a class="group flex min-w-0 items-center gap-3.5" href="/" aria-label="${escapeHtml(pickLocale(SHELL_I18N.brand.homeAria))}">
        <span class="clip-small flex size-10 shrink-0 items-center justify-center border border-accent bg-accent-soft font-mono text-xs font-semibold tracking-wide text-accent transition-colors duration-(--ds-duration-fast) group-hover:bg-accent group-hover:text-accent-fg">${tr(SHELL_I18N.brand.badge)}</span>
        <span class="truncate font-sans text-sm font-semibold tracking-widest sm:text-base">${tr(SHELL_I18N.brand.prefix)}<span class="text-accent">${tr(SHELL_I18N.brand.accent)}</span></span>
      </a>
      <nav class="hidden items-center gap-7 lg:flex" aria-label="${escapeHtml(pickLocale(SHELL_I18N.a11y.primaryNavAria))}">
        ${navLinks}
      </nav>
      <div class="flex shrink-0 items-center gap-2">
        <button type="button" id="lang-toggle-btn" class="clip-small inline-flex items-center gap-1.5 border border-border-strong bg-surface px-3 py-2 font-mono text-xs font-semibold text-fg transition-colors duration-(--ds-duration-fast) hover:border-accent hover:text-accent" aria-label="${escapeHtml(pickLocale(SHELL_I18N.a11y.langToggleAria))}">
          <span id="lang-toggle-label">${tr(SHELL_I18N.controls.langBadge)}</span>
        </button>
        <button type="button" id="theme-toggle-btn" class="clip-small inline-flex items-center gap-1.5 border border-border-strong bg-surface px-3 py-2 font-mono text-xs text-fg-muted transition-colors duration-(--ds-duration-fast) hover:border-accent hover:text-accent" aria-label="${escapeHtml(pickLocale(SHELL_I18N.a11y.themeToggleAria))}">
          <span class="signal-dot inline-block size-2 rounded-full bg-accent"></span>
          <span id="theme-toggle-label">${escapeHtml(pickLocale(SHELL_I18N.controls.themeLabel))}</span>
        </button>
        <a class="clip-small inline-flex items-center gap-1.5 border border-accent bg-accent-soft px-3.5 py-2 font-mono text-xs font-semibold tracking-wide text-accent transition-colors duration-(--ds-duration-fast) hover:bg-accent hover:text-accent-fg" href="${GITHUB_REPO_URL}" target="_blank" rel="noopener noreferrer">${tr(SHELL_I18N.controls.githubLabel)} <span aria-hidden="true">${tr(SHELL_I18N.controls.externalArrow)}</span></a>
      </div>
    </div>
    <nav class="flex items-center gap-4 overflow-x-auto border-t border-border bg-bg-elevated px-5 py-2 lg:hidden" aria-label="${escapeHtml(pickLocale(SHELL_I18N.a11y.mobileNavAria))}">
      ${mobileLinks}
    </nav>
  </header>`;
}

export function renderSiteFooter(): string {
  return `<footer class="border-t border-border bg-bg-elevated">
    <div class="mx-auto grid max-w-wide gap-10 px-5 py-12 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-14">
      <div class="flex flex-col gap-3">
        <a class="inline-flex items-center gap-3 font-sans text-lg font-semibold tracking-wide text-fg hover:text-accent" href="/">
          <span class="clip-small flex size-8 items-center justify-center border border-accent bg-accent-soft font-mono text-xs text-accent">${tr(SHELL_I18N.brand.badge)}</span>
          <span>${tr(SHELL_I18N.brand.prefix)}<span class="text-accent">${tr(SHELL_I18N.brand.accent)}</span><span class="text-accent">${tr(SHELL_I18N.brand.suffix)}</span></span>
        </a>
        <p class="text-sm text-fg-muted">${tr(SHELL_I18N.footer.tagline)}</p>
        <p class="font-mono text-xs text-fg-subtle">${tr(SHELL_I18N.footer.copyright)}</p>
      </div>

      <nav class="flex flex-col gap-2 text-sm" aria-label="${escapeHtml(pickLocale(SHELL_I18N.a11y.docsNavAria))}">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest text-accent">${tr(SHELL_I18N.footer.colDocsHeading)}</p>
        ${SHELL_I18N.footer.docsLinks.map(renderFooterLink).join("\n        ")}
      </nav>

      <nav class="flex flex-col gap-2 text-sm" aria-label="${escapeHtml(pickLocale(SHELL_I18N.a11y.ecoNavAria))}">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest text-accent">${tr(SHELL_I18N.footer.colEcoHeading)}</p>
        ${SHELL_I18N.footer.ecoLinks.map(renderFooterLink).join("\n        ")}
      </nav>

      <nav class="flex flex-col gap-2 text-sm" aria-label="${escapeHtml(pickLocale(SHELL_I18N.a11y.legalNavAria))}">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest text-accent">${tr(SHELL_I18N.footer.colLegalHeading)}</p>
        ${SHELL_I18N.footer.legalLinks.map(renderFooterLink).join("\n        ")}
      </nav>
    </div>
  </footer>`;
}

export interface PageLayoutOptions {
  title: LocalizedText;
  description: LocalizedText;
  activePath: string;
  bodyHtml: string;
  locale?: Locale;
}

export function renderPageLayout(opts: PageLayoutOptions): string {
  const loc = opts.locale ?? DEFAULT_LOCALE;
  const resolvedTitle = pickLocale(opts.title, loc);
  const resolvedDesc = pickLocale(opts.description, loc);

  return `<!doctype html>
<html lang="zh-CN" data-theme="dark" data-lang="${loc}" ${trDataAttrs("page-title", opts.title)}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="${escapeHtml(resolvedDesc)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtml(resolvedTitle)}" />
  <meta property="og:description" content="${escapeHtml(resolvedDesc)}" />
  <title>${escapeHtml(resolvedTitle)}</title>
  <link rel="icon" type="image/x-icon" href="/favicon.ico" />
  <link rel="stylesheet" href="/style.css" />
  <script>
    (function() {
      try {
        var savedTheme = localStorage.getItem("cyberpsychosis.theme");
        if (savedTheme === "light" || savedTheme === "dark") {
          document.documentElement.setAttribute("data-theme", savedTheme);
        }
        var savedLang = localStorage.getItem("cyberpsychosis.lang");
        if (savedLang === "zh" || savedLang === "en") {
          document.documentElement.setAttribute("data-lang", savedLang);
        }
      } catch (e) {}
    })();
  </script>
</head>
<body class="flex min-h-dvh flex-col bg-bg font-sans text-fg antialiased overflow-x-hidden">
  <a class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-accent-fg" href="#main">${tr(SHELL_I18N.a11y.skipToMain)}</a>
  <div class="cyber-grid pointer-events-none fixed inset-x-0 top-0 -z-10 h-dvh" aria-hidden="true"></div>
  ${renderSiteHeader(opts.activePath)}
  <main id="main" class="flex-1 pt-24 lg:pt-18">
    ${opts.bodyHtml}
  </main>
  ${renderSiteFooter()}
  <script src="/app.js" type="module"></script>
</body>
</html>`;
}
