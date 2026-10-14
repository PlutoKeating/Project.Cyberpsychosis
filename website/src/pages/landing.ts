import {
  renderArchitectureBlueprintSvg,
  renderCausalCascadeSchematic,
  renderHighlightSvg,
} from "../components/diagrams.ts";
import {
  escapeHtml,
  GITHUB_REPO_URL,
  NPM_PACKAGE_URL,
  renderPageLayout,
} from "../components/shell.ts";
import { DEFAULT_LOCALE, type Locale, pickLocale, tr } from "../i18n/index.ts";
import { LANDING_I18N } from "./landing.i18n.ts";

export function renderLandingPage(locale: Locale = DEFAULT_LOCALE): string {
  const t = LANDING_I18N;

  // User Journey Sticky Strip
  const journeyStepsHtml = t.journeyMap.steps
    .map(
      (s) =>
        `<a class="clip-small inline-flex items-center gap-2 border border-border bg-surface px-3 py-1.5 font-mono text-xs text-fg-muted transition-colors duration-(--ds-duration-fast) hover:border-accent hover:text-accent" href="${s.href}">
          <span class="font-semibold text-accent">${escapeHtml(s.step)}</span>
          <span>${tr(s.label)}</span>
        </a>`
    )
    .join("\n          ");

  // Interactive H5 Sandbox Step Buttons
  const simStepBtnsHtml = t.sandbox.steps
    .map((s, idx) => {
      const activeCls =
        idx === 2
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-bg-elevated text-fg-muted hover:border-accent hover:text-fg";
      return `<button type="button" data-sim-step="${idx}" data-rule="${escapeHtml(s.ruleText)}" data-tick="${escapeHtml(s.tickText)}" class="sim-step-btn clip-small flex flex-col items-start gap-0.5 border p-2.5 text-left transition-all duration-(--ds-duration-fast) ${activeCls}">
        <span class="font-mono text-xs font-semibold tracking-wider text-accent">${tr(s.badge)}</span>
        <span class="font-sans text-xs font-semibold text-fg">${tr(s.title)}</span>
      </button>`;
    })
    .join("\n            ");

  // Synchronized Causal Trace Messages (toggled by data-sim-trace)
  const simTracesHtml = t.sandbox.steps
    .map(
      (s, idx) =>
        `<div data-sim-trace="${idx}" class="font-mono text-xs leading-relaxed text-code-fg"${idx === 2 ? "" : " hidden"}>${tr(s.traceText)}</div>`
    )
    .join("\n            ");

  // KPI Counters
  const kpiHtml = t.kpis
    .map(
      (k) => `<div class="border-l ${k.accent ? "border-accent" : "border-border-strong"} pl-4">
        <strong class="font-sans text-3xl font-semibold ${k.accent ? "text-accent" : "text-fg"} sm:text-4xl">${tr(k.value)}</strong>
        <p class="mt-1 font-mono text-xs font-semibold text-fg">${tr(k.label)}</p>
        <p class="mt-0.5 font-mono text-xs text-fg-subtle">${tr(k.sub)}</p>
      </div>`
    )
    .join("\n        ");

  // Authentic Screenshot Gallery Tabs & Panels
  const galleryTabBtnsHtml = t.gallerySection.tabs
    .map((tab, idx) => {
      const activeCls =
        idx === 0
          ? "border-accent bg-accent-soft text-accent"
          : "border-border bg-surface text-fg-muted hover:border-accent hover:text-fg";
      return `<button type="button" data-gallery-btn="${tab.id}" class="clip-small flex flex-col items-start gap-1 border px-4 py-3 text-left transition-all duration-(--ds-duration-fast) ${activeCls}">
        <span class="font-mono text-xs text-accent">${escapeHtml(tab.badge)}</span>
        <span class="font-sans text-sm font-semibold text-fg">${tr(tab.title)}</span>
      </button>`;
    })
    .join("\n          ");

  const galleryPanelsHtml = t.gallerySection.tabs
    .map(
      (tab, idx) => `<div data-gallery-panel="${tab.id}" class="clip-panel border border-border-strong bg-surface p-4 shadow-lg sm:p-6"${idx === 0 ? "" : " hidden"}>
        <div class="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 font-mono text-xs">
          <span class="text-accent"><span class="signal-dot mr-2 inline-block size-2 rounded-full bg-accent"></span>${escapeHtml(tab.badge)}</span>
          <code class="border border-border bg-code-bg px-3 py-1 text-code-fg">${escapeHtml(tab.command)}</code>
        </div>
        <div class="overflow-hidden border border-border bg-code-bg">
          <img src="${tab.imgSrc}" alt="${escapeHtml(pickLocale(tab.imgAlt, locale))}" width="1600" height="960" loading="${idx === 0 ? "eager" : "lazy"}" class="w-full h-auto block" />
        </div>
        <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          ${tab.callouts
            .map(
              (c) => `<div class="border-l-2 border-accent bg-bg-elevated px-3 py-2 text-xs">
                <span class="mr-1.5 font-mono font-semibold text-accent">${escapeHtml(c.num)}</span>
                <span class="text-fg-muted">${tr(c.label)}</span>
              </div>`
            )
            .join("\n          ")}
        </div>
      </div>`
    )
    .join("\n        ");

  // Six Core Mechanisms Visual Bento Grid
  const highlightCardsHtml = t.highlightsSection.items
    .map(
      (item) => `<article class="project-card clip-panel group relative flex flex-col justify-between border border-border bg-surface p-5 transition-all duration-(--ds-duration-slow) hover:-translate-y-1 hover:border-accent hover:shadow-glow ${
        item.featured ? "project-card--featured" : ""
      }">
        <div>
          <div class="flex items-center justify-between gap-3 font-mono text-xs tracking-widest">
            <span class="text-fg-subtle">${escapeHtml(item.index)} // ${escapeHtml(item.domain)}</span>
            <a class="text-accent transition-colors duration-(--ds-duration-fast) hover:text-accent-hover" href="${item.docHref}">${tr(t.highlightsSection.readMore)}</a>
          </div>
          <div class="mt-4 overflow-hidden border border-border bg-code-bg">
            ${renderHighlightSvg(item.index)}
          </div>
          <h3 class="mt-4 font-sans text-lg font-semibold tracking-tight text-fg">${tr(item.title)}</h3>
          <p class="mt-0.5 font-mono text-xs text-accent">${tr(item.subtitle)}</p>
          <p class="mt-2 text-sm text-fg-muted">${tr(item.caption)}</p>
        </div>
      </article>`
    )
    .join("\n        ");

  // Six NPM Packages Matrix
  const packageCardsHtml = t.architectureSection.packages
    .map(
      (pkg) => `<div class="clip-panel flex flex-col justify-between border border-border bg-surface p-5 transition-colors duration-(--ds-duration-fast) hover:border-accent">
        <div>
          <p class="font-mono text-xs text-accent">${escapeHtml(pkg.layer)}</p>
          <h3 class="mt-1.5 font-mono text-base font-semibold text-fg">${escapeHtml(pkg.name)}</h3>
          <p class="mt-1.5 text-xs text-fg-muted">${tr(pkg.role)}</p>
        </div>
        <div class="mt-4 border-t border-border pt-3">
          <code class="block bg-code-bg px-3 py-1.5 font-mono text-xs text-accent">${escapeHtml(pkg.cmd)}</code>
        </div>
      </div>`
    )
    .join("\n          ");

  const bodyHtml = `<div class="border-b border-border bg-bg-elevated">
      <div class="mx-auto flex max-w-wide items-center gap-2 overflow-x-auto px-5 py-2.5 sm:px-8 lg:px-14">
        <span class="shrink-0 font-mono text-xs text-fg-subtle">${tr(t.journeyMap.label)}</span>
        <div class="flex items-center gap-2">
          ${journeyStepsHtml}
        </div>
      </div>
    </div>

    <section class="relative mx-auto grid max-w-wide grid-cols-1 gap-10 px-5 pt-8 pb-14 sm:px-8 lg:grid-cols-12 lg:items-center lg:px-14 lg:pt-14 lg:pb-20" id="top">
      <div class="flex flex-col gap-5 lg:col-span-5">
        <div class="inline-flex items-center gap-2.5 font-mono text-xs tracking-widest text-accent">
          <span class="signal-dot inline-block size-2 rounded-full bg-accent"></span>
          <span>${tr(t.hero.eyebrow)}</span>
        </div>
        <h1 class="font-sans text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
          ${tr(t.hero.titleLine1)}<br/>
          <span class="text-accent">${tr(t.hero.titleLine2)}</span><span class="cursor-blink font-normal text-fg">${tr(t.hero.titleCursor)}</span>
        </h1>
        <p class="font-mono text-xs tracking-wide text-fg-muted sm:text-sm">
          ${tr(t.hero.formulaPrefix)}<span class="font-semibold text-accent">${tr(t.hero.formulaAccent)}</span>${tr(t.hero.formulaSuffix)}
        </p>
        <p class="max-w-prose text-sm leading-relaxed text-fg-muted sm:text-base">
          ${tr(t.hero.summary)}
        </p>

        <div class="cyber-terminal border border-border-strong bg-code-bg p-4">
          <div class="flex items-center justify-between font-mono text-xs text-fg-subtle">
            <span>${tr(t.hero.cliHeader)}</span>
            <button type="button" id="copy-cli-btn" class="text-accent hover:text-accent-hover">${tr(t.hero.copyBtn)}</button>
          </div>
          <pre class="mt-2 overflow-x-auto font-mono text-xs text-code-fg"><code id="cli-command-text">${escapeHtml(t.hero.cliCode)}</code></pre>
        </div>

        <div class="flex flex-wrap gap-3">
          <a class="clip-button inline-flex items-center gap-3 bg-accent px-6 py-3 font-mono text-xs font-semibold tracking-widest text-accent-fg shadow-glow transition-all duration-(--ds-duration-base) hover:-translate-y-1 hover:bg-accent-hover" href="/docs/">
            <span>${tr(t.hero.ctaDocs)}</span>
            <span aria-hidden="true">${tr(t.hero.arrowRight)}</span>
          </a>
          <a class="clip-button inline-flex items-center gap-3 border border-border-strong bg-surface px-5 py-3 font-mono text-xs font-semibold tracking-widest text-fg transition-all duration-(--ds-duration-base) hover:-translate-y-1 hover:border-accent hover:text-accent" href="/docs/quick-start/">
            <span>${tr(t.hero.ctaQuickStart)}</span>
            <span aria-hidden="true">${tr(t.hero.arrowDownRight)}</span>
          </a>
          <a class="clip-button inline-flex items-center gap-2 border border-border bg-bg-elevated px-4 py-3 font-mono text-xs text-fg-muted transition-all duration-(--ds-duration-base) hover:border-accent hover:text-accent" href="${NPM_PACKAGE_URL}" target="_blank" rel="noopener noreferrer">
            <span>${tr(t.hero.ctaNpm)}</span>
            <span aria-hidden="true">${tr(t.hero.arrowUpRight)}</span>
          </a>
        </div>
      </div>

      <div class="cyber-terminal border border-border-strong bg-surface p-4 shadow-lg sm:p-6 lg:col-span-7" id="sandbox">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 font-mono text-xs">
          <span class="text-accent"><span class="signal-dot mr-2 inline-block size-2 rounded-full bg-accent"></span>${tr(t.sandbox.headerTitle)}</span>
          <div class="flex flex-wrap items-center gap-2">
            <span id="sim-active-rule" class="border border-accent bg-accent-soft px-2 py-0.5 font-semibold text-accent">${escapeHtml(t.sandbox.steps[2].ruleText)}</span>
            <span id="sim-active-tick" class="text-fg-subtle">${escapeHtml(t.sandbox.steps[2].tickText)}</span>
            <code id="sim-state-hash" class="border border-border bg-code-bg px-2 py-0.5 text-code-fg">0x811c9dc5</code>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          ${simStepBtnsHtml}
        </div>

        <div class="mt-2.5 flex flex-wrap items-center justify-between gap-2 border-y border-border py-2 font-mono text-xs">
          <div class="flex flex-wrap items-center gap-1.5">
            <button type="button" id="sim-step-one-btn" class="border border-accent bg-accent-soft px-2.5 py-1 font-semibold text-accent hover:bg-accent hover:text-accent-fg">${tr(t.sandbox.stepOneBtn)}</button>
            <button type="button" id="sim-rewind-btn" class="border border-border-strong bg-bg-elevated px-2.5 py-1 text-fg hover:border-accent hover:text-accent">${tr(t.sandbox.rewindBtn)}</button>
            <button type="button" id="sim-play-btn" class="border border-border-strong bg-bg-elevated px-2.5 py-1 text-fg hover:border-accent hover:text-accent">${tr(t.sandbox.autoPlayBtn)}</button>
          </div>
          <button type="button" id="sim-share-btn" class="border border-accent bg-surface px-2.5 py-1 font-semibold text-accent hover:bg-accent hover:text-accent-fg">${tr(t.sandbox.shareBtn)}</button>
        </div>

        <div class="relative mt-2.5 overflow-hidden border border-border bg-code-bg">
          <canvas id="hero-sim-canvas" width="704" height="396" class="w-full h-auto block cursor-pointer" aria-label="${escapeHtml(pickLocale(t.sandbox.canvasAria, locale))}"></canvas>
        </div>

        <div class="mt-2 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-fg-subtle">
          <span>${tr(t.sandbox.legendWord)}</span>
          <span>${tr(t.sandbox.legendPipe)}</span>
          <span>${tr(t.sandbox.legendSocial)}</span>
          <span>${tr(t.sandbox.legendSmoke)}</span>
        </div>

        <div class="mt-2.5 border-t border-border bg-code-bg p-3">
          <div class="mb-1 flex items-center justify-between font-mono text-xs text-fg-subtle">
            <span>${tr(t.sandbox.canvasHint)}</span>
          </div>
          <div id="sim-live-causal-output" class="font-mono text-xs leading-relaxed text-code-fg" hidden></div>
          <div id="sim-preset-traces">
            ${simTracesHtml}
          </div>
        </div>
      </div>
    </section>

    <section class="border-y border-border bg-bg-elevated py-8">
      <div class="mx-auto grid max-w-wide grid-cols-2 gap-6 px-5 sm:px-8 lg:grid-cols-4 lg:px-14">
        ${kpiHtml}
      </div>
    </section>

    <section class="mx-auto max-w-wide px-5 py-14 sm:px-8 sm:py-20 lg:px-14" id="cascade">
      <div class="flex flex-col justify-between gap-4 pb-8 lg:flex-row lg:items-end">
        <div>
          <div class="font-mono text-xs tracking-widest text-accent">${tr(t.cascadeSection.eyebrow)}</div>
          <h2 class="mt-2 font-sans text-3xl font-semibold tracking-tight text-fg sm:text-5xl">${tr(t.cascadeSection.heading)}</h2>
        </div>
        <div class="flex flex-col items-start gap-2 lg:items-end">
          <p class="max-w-prose text-sm text-fg-muted">${tr(t.cascadeSection.subtitle)}</p>
          <a class="font-mono text-xs text-accent hover:text-accent-hover" href="/docs/causal-and-time/">${tr(t.cascadeSection.exploreLink)}</a>
        </div>
      </div>
      ${renderCausalCascadeSchematic()}
    </section>

    <section class="border-t border-border bg-bg-elevated py-14 sm:py-20" id="screenshots">
      <div class="mx-auto max-w-wide px-5 sm:px-8 lg:px-14">
        <div class="flex flex-col justify-between gap-4 pb-8 lg:flex-row lg:items-end">
          <div>
            <div class="font-mono text-xs tracking-widest text-accent">${tr(t.gallerySection.eyebrow)}</div>
            <h2 class="mt-2 font-sans text-3xl font-semibold tracking-tight text-fg sm:text-5xl">${tr(t.gallerySection.heading)}</h2>
          </div>
          <p class="max-w-prose text-sm text-fg-muted">${tr(t.gallerySection.subtitle)}</p>
        </div>

        <div class="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          ${galleryTabBtnsHtml}
        </div>

        ${galleryPanelsHtml}
      </div>
    </section>

    <section class="mx-auto max-w-wide px-5 py-14 sm:px-8 sm:py-20 lg:px-14" id="highlights">
      <div class="flex flex-col justify-between gap-4 border-b border-border-strong pb-6 lg:flex-row lg:items-end">
        <div>
          <div class="font-mono text-xs tracking-widest text-accent">${tr(t.highlightsSection.eyebrow)}</div>
          <h2 class="mt-2 font-sans text-3xl font-semibold tracking-tight text-fg sm:text-5xl">${tr(t.highlightsSection.heading)}</h2>
        </div>
        <p class="max-w-prose text-sm text-fg-muted">${tr(t.highlightsSection.subtitle)}</p>
      </div>

      <div class="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        ${highlightCardsHtml}
      </div>
    </section>

    <section class="border-t border-border bg-bg-elevated py-14 sm:py-20" id="architecture">
      <div class="mx-auto max-w-wide px-5 sm:px-8 lg:px-14">
        <div class="flex flex-col justify-between gap-4 pb-8 lg:flex-row lg:items-end">
          <div>
            <div class="font-mono text-xs tracking-widest text-accent">${tr(t.architectureSection.eyebrow)}</div>
            <h2 class="mt-2 font-sans text-3xl font-semibold tracking-tight text-fg sm:text-5xl">${tr(t.architectureSection.heading)}</h2>
          </div>
          <p class="max-w-prose text-sm text-fg-muted">${tr(t.architectureSection.subtitle)}</p>
        </div>

        ${renderArchitectureBlueprintSvg()}

        <div class="mt-10">
          <p class="font-mono text-xs font-semibold tracking-widest text-accent">${tr(t.architectureSection.packagesTitle)}</p>
          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            ${packageCardsHtml}
          </div>
        </div>

        <div class="mt-10 flex flex-wrap gap-4">
          <a class="clip-button inline-flex items-center gap-3 bg-accent px-6 py-3 font-mono text-xs font-semibold tracking-widest text-accent-fg shadow-glow hover:bg-accent-hover" href="/docs/">
            ${tr(t.architectureSection.ctaDocs)}
          </a>
          <a class="clip-button inline-flex items-center gap-3 border border-border-strong bg-surface px-6 py-3 font-mono text-xs font-semibold tracking-widest text-fg hover:border-accent hover:text-accent" href="${GITHUB_REPO_URL}" target="_blank" rel="noopener noreferrer">
            ${tr(t.architectureSection.ctaGithub)}
          </a>
        </div>
      </div>
    </section>`;

  return renderPageLayout({
    title: t.meta.title,
    description: t.meta.description,
    activePath: "/",
    bodyHtml,
    locale,
  });
}
