import { escapeHtml, renderPageLayout } from "./shell.ts";

export interface DocSection {
  id: string;
  heading: string;
  paragraphs: string[];
  codeBlock?: {
    lang: string;
    code: string;
  };
  bullets?: string[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface DocChapterPage {
  slug: string; // "" for /docs/, or "quick-start" for /docs/quick-start/
  chapterNumber: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  sections: DocSection[];
}

export function getDocHref(slug: string): string {
  return slug ? `/docs/${slug}/` : "/docs/";
}

export function renderDocPage(
  page: DocChapterPage,
  allPages: ReadonlyArray<DocChapterPage>
): string {
  const currentIndex = allPages.findIndex((p) => p.slug === page.slug);
  const prevPage = currentIndex > 0 ? allPages[currentIndex - 1] : undefined;
  const nextPage =
    currentIndex >= 0 && currentIndex < allPages.length - 1
      ? allPages[currentIndex + 1]
      : undefined;

  const sidebarItems = allPages
    .map((item) => {
      const isCurrent = item.slug === page.slug;
      const href = getDocHref(item.slug);
      const cls = isCurrent
        ? "border-l-2 border-accent bg-accent-soft text-accent font-semibold"
        : "border-l border-border text-fg-muted hover:border-accent hover:text-fg";
      return `<li>
        <a class="block px-3.5 py-2 text-xs transition-colors duration-(--ds-duration-fast) ${cls}" href="${href}">
          <span class="font-mono text-fg-subtle">${escapeHtml(item.chapterNumber)}</span> · ${escapeHtml(item.title)}
        </a>
      </li>`;
    })
    .join("\n            ");

  const tocItems = page.sections
    .map(
      (sec) =>
        `<li><a class="block py-1 font-mono text-xs text-fg-muted transition-colors duration-(--ds-duration-fast) hover:text-accent" href="#${escapeHtml(sec.id)}"># ${escapeHtml(sec.heading)}</a></li>`
    )
    .join("\n            ");

  const sectionsHtml = page.sections
    .map((sec) => {
      const paras = sec.paragraphs
        .map((p) => `<p class="text-base leading-relaxed text-fg-muted">${escapeHtml(p)}</p>`)
        .join("\n            ");

      const bullets =
        sec.bullets && sec.bullets.length > 0
          ? `<ul class="flex flex-col gap-2 border-l border-accent pl-4 text-sm text-fg-muted">
              ${sec.bullets
                .map(
                  (b) =>
                    `<li class="flex items-start gap-2"><span class="mt-2 inline-block size-1.5 shrink-0 rounded-full bg-accent"></span><span>${escapeHtml(b)}</span></li>`
                )
                .join("\n              ")}
            </ul>`
          : "";

      const table = sec.table
        ? `<div class="overflow-x-auto border border-border bg-bg-elevated">
            <table class="w-full text-left text-xs">
              <thead class="border-b border-border-strong bg-surface font-mono text-accent">
                <tr>${sec.table.headers.map((h) => `<th class="px-4 py-3">${escapeHtml(h)}</th>`).join("")}</tr>
              </thead>
              <tbody class="divide-y divide-border text-fg-muted">
                ${sec.table.rows
                  .map(
                    (row) =>
                      `<tr>${row.map((cell) => `<td class="px-4 py-3 font-mono">${escapeHtml(cell)}</td>`).join("")}</tr>`
                  )
                  .join("\n                ")}
              </tbody>
            </table>
          </div>`
        : "";

      const code = sec.codeBlock
        ? `<div class="cyber-terminal overflow-hidden border border-border-strong bg-code-bg">
            <div class="flex items-center justify-between border-b border-border px-4 py-2 font-mono text-xs text-fg-subtle">
              <span>// ${escapeHtml(sec.codeBlock.lang.toUpperCase())}</span>
              <span class="text-accent">CYBERPSYCHOSIS SDK</span>
            </div>
            <pre class="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-code-fg"><code>${escapeHtml(sec.codeBlock.code)}</code></pre>
          </div>`
        : "";

      return `<section id="${escapeHtml(sec.id)}" class="scroll-mt-24 border-b border-border pb-10">
          <h2 class="font-sans text-2xl font-semibold tracking-tight text-fg">${escapeHtml(sec.heading)}</h2>
          <div class="mt-4 flex flex-col gap-4">
            ${paras}
            ${bullets}
            ${table}
            ${code}
          </div>
        </section>`;
    })
    .join("\n        ");

  const pagerHtml = `<nav class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2" aria-label="Chapter Pagination">
    ${
      prevPage
        ? `<a class="clip-panel border border-border bg-surface p-4 transition-colors duration-(--ds-duration-fast) hover:border-accent" href="${getDocHref(prevPage.slug)}">
            <span class="font-mono text-xs text-fg-subtle">← PREVIOUS CHAPTER</span>
            <span class="mt-1 block font-sans text-base font-semibold text-accent">${escapeHtml(prevPage.chapterNumber)} · ${escapeHtml(prevPage.title)}</span>
          </a>`
        : `<div></div>`
    }
    ${
      nextPage
        ? `<a class="clip-panel border border-border bg-surface p-4 text-right transition-colors duration-(--ds-duration-fast) hover:border-accent" href="${getDocHref(nextPage.slug)}">
            <span class="font-mono text-xs text-fg-subtle">NEXT CHAPTER →</span>
            <span class="mt-1 block font-sans text-base font-semibold text-accent">${escapeHtml(nextPage.chapterNumber)} · ${escapeHtml(nextPage.title)}</span>
          </a>`
        : `<div></div>`
    }
  </nav>`;

  const bodyHtml = `<div class="mx-auto grid max-w-wide grid-cols-1 gap-8 px-5 py-10 sm:px-8 lg:grid-cols-4 lg:px-14">
    <aside class="lg:col-span-1">
      <div class="clip-panel sticky top-24 border border-border bg-surface p-5">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest text-accent">// DOCS CHAPTERS</p>
        <ul class="mt-4 flex flex-col gap-1">
          ${sidebarItems}
        </ul>
      </div>
    </aside>

    <article class="flex flex-col gap-8 lg:col-span-2">
      <header class="clip-panel border border-border bg-surface p-6 sm:p-8">
        <div class="flex items-center gap-2 font-mono text-xs tracking-widest text-accent">
          <span class="signal-dot inline-block size-2 rounded-full bg-accent"></span>
          <span>CHAPTER ${escapeHtml(page.chapterNumber)} // ${escapeHtml(page.category)}</span>
        </div>
        <h1 class="mt-3 font-sans text-3xl font-semibold tracking-tight text-fg sm:text-4xl">${escapeHtml(page.title)}</h1>
        <p class="mt-3 text-base leading-relaxed text-fg-muted">${escapeHtml(page.subtitle)}</p>
      </header>

      <div class="flex flex-col gap-10">
        ${sectionsHtml}
      </div>

      ${pagerHtml}
    </article>

    <aside class="hidden lg:col-span-1 lg:block">
      <div class="clip-panel sticky top-24 border border-border bg-surface p-5">
        <p class="font-mono text-xs font-semibold uppercase tracking-widest text-accent">// ON THIS PAGE</p>
        <ul class="mt-3 flex flex-col gap-1.5">
          ${tocItems}
        </ul>
      </div>
    </aside>
  </div>`;

  return renderPageLayout({
    title: `${page.title} — Cyberpsychosis Docs`,
    description: page.description,
    activePath: getDocHref(page.slug),
    bodyHtml,
  });
}
