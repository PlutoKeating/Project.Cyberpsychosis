import {
  DEFAULT_LOCALE,
  escapeHtml,
  type Locale,
  type LocalizedText,
  tr,
} from "../i18n/index.ts";
import { ARTICLE_I18N } from "./article.i18n.ts";
import { renderArticleHeroSvg } from "./diagrams.ts";
import { renderPageLayout } from "./shell.ts";

export interface ArticleHighlightItem {
  readonly badge: string;
  readonly title: LocalizedText;
  readonly detail: LocalizedText;
}

export interface ArticleSection {
  readonly index: string;
  readonly heading: LocalizedText;
  readonly paragraphs: ReadonlyArray<LocalizedText>;
  readonly bullets?: ReadonlyArray<LocalizedText>;
}

export interface ArticlePageSpec {
  readonly path: string;
  readonly heroKind: "about" | "terms" | "privacy";
  readonly title: LocalizedText;
  readonly description: LocalizedText;
  readonly eyebrow: LocalizedText;
  readonly heading: LocalizedText;
  readonly lead: LocalizedText;
  readonly updated: LocalizedText;
  readonly highlights: ReadonlyArray<ArticleHighlightItem>;
  readonly sections: ReadonlyArray<ArticleSection>;
}

export function renderArticlePage(
  spec: ArticlePageSpec,
  locale: Locale = DEFAULT_LOCALE
): string {
  const highlightsHtml = spec.highlights
    .map(
      (h) => `<div class="clip-panel border border-border bg-surface p-4">
        <span class="font-mono text-xs font-semibold text-accent">${escapeHtml(h.badge)}</span>
        <h2 class="mt-1 font-sans text-base font-semibold text-fg">${tr(h.title)}</h2>
        <p class="mt-1 text-xs text-fg-muted">${tr(h.detail)}</p>
      </div>`
    )
    .join("\n        ");

  const sectionsHtml = spec.sections
    .map((sec) => {
      const paragraphsHtml = sec.paragraphs
        .map((p) => `<p class="text-sm leading-relaxed text-fg-muted sm:text-base">${tr(p)}</p>`)
        .join("\n          ");
      const bulletsHtml =
        sec.bullets && sec.bullets.length > 0
          ? `<ul class="mt-2 flex flex-col gap-2 border-l border-accent pl-4 text-sm text-fg-muted">
              ${sec.bullets
                .map(
                  (b) =>
                    `<li class="flex items-start gap-2.5"><span class="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-accent"></span><span>${tr(b)}</span></li>`
                )
                .join("\n              ")}
            </ul>`
          : "";

      return `<section class="clip-panel border border-border bg-surface p-6 sm:p-8">
        <div class="font-mono text-xs tracking-widest text-accent">${tr(ARTICLE_I18N.sectionPrefix)} ${escapeHtml(sec.index)}</div>
        <h2 class="mt-2 font-sans text-xl font-semibold tracking-tight text-fg sm:text-2xl">${tr(sec.heading)}</h2>
        <div class="mt-3 flex flex-col gap-3">
          ${paragraphsHtml}
          ${bulletsHtml}
        </div>
      </section>`;
    })
    .join("\n      ");

  const bodyHtml = `<section class="border-b border-border bg-bg-elevated py-12 sm:py-16">
      <div class="mx-auto max-w-content px-5 sm:px-8">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest text-accent">${tr(spec.eyebrow)}</p>
        <h1 class="mt-3 font-sans text-3xl font-semibold tracking-tight text-fg sm:text-5xl">${tr(spec.heading)}</h1>
        <p class="mt-3 max-w-prose text-base leading-relaxed text-fg-muted sm:text-lg">${tr(spec.lead)}</p>
        <p class="mt-3 font-mono text-xs text-fg-subtle">${tr(spec.updated)}</p>
        <div class="mt-6">
          ${renderArticleHeroSvg(spec.heroKind)}
        </div>
        <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          ${highlightsHtml}
        </div>
      </div>
    </section>
    <div class="mx-auto flex max-w-content flex-col gap-5 px-5 py-10 sm:px-8 sm:py-14">
      ${sectionsHtml}
    </div>`;

  return renderPageLayout({
    title: spec.title,
    description: spec.description,
    activePath: spec.path,
    bodyHtml,
    locale,
  });
}
