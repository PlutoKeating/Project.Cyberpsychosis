import { escapeHtml, renderPageLayout } from "./shell.ts";

export interface ArticleSection {
  index: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface ArticlePageSpec {
  path: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lead: string;
  updated: string;
  sections: ArticleSection[];
}

export function renderArticlePage(spec: ArticlePageSpec): string {
  const sectionsHtml = spec.sections
    .map((sec) => {
      const paragraphsHtml = sec.paragraphs
        .map((p) => `<p class="text-base leading-relaxed text-fg-muted">${escapeHtml(p)}</p>`)
        .join("\n          ");
      const bulletsHtml =
        sec.bullets && sec.bullets.length > 0
          ? `<ul class="mt-2 flex flex-col gap-2.5 border-l border-accent pl-5 text-sm text-fg-muted">
              ${sec.bullets
                .map(
                  (b) =>
                    `<li class="flex items-start gap-2.5"><span class="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-accent"></span><span>${escapeHtml(b)}</span></li>`
                )
                .join("\n              ")}
            </ul>`
          : "";

      return `<section class="clip-panel border border-border bg-surface p-6 sm:p-8">
        <div class="font-mono text-xs tracking-widest text-accent">// ${escapeHtml(sec.index)}</div>
        <h2 class="mt-2 font-sans text-xl font-semibold tracking-tight text-fg sm:text-2xl">${escapeHtml(sec.heading)}</h2>
        <div class="mt-4 flex flex-col gap-3.5">
          ${paragraphsHtml}
          ${bulletsHtml}
        </div>
      </section>`;
    })
    .join("\n      ");

  const bodyHtml = `<section class="border-b border-border bg-bg-elevated py-14 sm:py-20">
      <div class="mx-auto max-w-prose px-5 sm:px-8">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest text-accent">${escapeHtml(spec.eyebrow)}</p>
        <h1 class="mt-3 font-sans text-3xl font-semibold tracking-tight text-fg sm:text-5xl">${escapeHtml(spec.heading)}</h1>
        <p class="mt-4 text-lg leading-relaxed text-fg-muted">${escapeHtml(spec.lead)}</p>
        <p class="mt-4 font-mono text-xs text-fg-subtle">${escapeHtml(spec.updated)}</p>
      </div>
    </section>
    <div class="mx-auto flex max-w-prose flex-col gap-6 px-5 py-12 sm:px-8 sm:py-16">
      ${sectionsHtml}
    </div>`;

  return renderPageLayout({
    title: spec.title,
    description: spec.description,
    activePath: spec.path,
    bodyHtml,
  });
}
