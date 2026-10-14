import { renderPageLayout } from "../components/shell.ts";

export function renderNotFoundPage(): string {
  const bodyHtml = `<section class="mx-auto flex max-w-prose flex-col items-center px-5 py-24 text-center sm:px-8">
    <p class="font-mono text-xs tracking-widest text-accent">// ERROR 404 · ENTITY NOT FOUND IN ECS</p>
    <h1 class="mt-4 font-sans text-5xl font-semibold tracking-tight text-fg sm:text-6xl">404<span class="text-accent">_</span></h1>
    <p class="mt-4 text-base leading-relaxed text-fg-muted">
      你访问的页面路径不存在于当前时间线的世界快照中。可以通过下方按钮回滚至首页或查阅技术文档。
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-4">
      <a class="clip-button bg-accent px-6 py-3 font-mono text-xs font-semibold tracking-widest text-accent-fg shadow-glow hover:bg-accent-hover" href="/">返回首页 / HOME</a>
      <a class="clip-button border border-border-strong bg-surface px-6 py-3 font-mono text-xs font-semibold tracking-widest text-fg hover:border-accent hover:text-accent" href="/docs/">文档中心 / DOCS</a>
    </div>
  </section>`;

  return renderPageLayout({
    title: "404 Not Found — Cyberpsychosis",
    description: "Page not found in Cyberpsychosis documentation.",
    activePath: "/404",
    bodyHtml,
  });
}
