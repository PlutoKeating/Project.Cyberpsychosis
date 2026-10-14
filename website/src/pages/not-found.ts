import { renderNotFoundSvg } from "../components/diagrams.ts";
import { renderPageLayout } from "../components/shell.ts";
import { DEFAULT_LOCALE, type Locale, tr } from "../i18n/index.ts";
import { NOT_FOUND_I18N } from "./not-found.i18n.ts";

export function renderNotFoundPage(locale: Locale = DEFAULT_LOCALE): string {
  const n = NOT_FOUND_I18N;
  const bodyHtml = `<section class="mx-auto flex max-w-prose flex-col items-center px-5 py-20 text-center sm:px-8">
    <p class="font-mono text-xs tracking-widest text-accent">${tr(n.eyebrow)}</p>
    <h1 class="mt-3 font-sans text-5xl font-semibold tracking-tight text-fg sm:text-6xl">${tr(n.headingNumber)}<span class="text-accent">${tr(n.headingCursor)}</span></h1>
    <p class="mt-3 text-sm leading-relaxed text-fg-muted sm:text-base">
      ${tr(n.message)}
    </p>
    <div class="mt-6 w-full">
      ${renderNotFoundSvg()}
    </div>
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <a class="clip-button bg-accent px-6 py-3 font-mono text-xs font-semibold tracking-widest text-accent-fg shadow-glow hover:bg-accent-hover" href="/">${tr(n.homeBtn)}</a>
      <a class="clip-button border border-border-strong bg-surface px-6 py-3 font-mono text-xs font-semibold tracking-widest text-fg hover:border-accent hover:text-accent" href="/docs/">${tr(n.docsBtn)}</a>
    </div>
  </section>`;

  return renderPageLayout({
    title: n.title,
    description: n.description,
    activePath: "/404",
    bodyHtml,
    locale,
  });
}
