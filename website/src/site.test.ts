import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { DOC_CHAPTER_PAGES } from "./pages/docs-data.ts";

const distDir = fileURLToPath(new URL("../dist", import.meta.url));

describe("cyberpsychosis-website — Static Build, Unified Shell & Multi-Page Docs Contract", () => {
  it("generates landing page, all 8 docs subpages, about, terms, privacy, 404, and compiled design system CSS", () => {
    const requiredFiles = [
      "index.html",
      "style.css",
      "app.js",
      "404.html",
      "sitemap.xml",
      "robots.txt",
      "_headers",
      "about/index.html",
      "terms/index.html",
      "privacy/index.html",
      ...DOC_CHAPTER_PAGES.map((p) => (p.slug ? `docs/${p.slug}/index.html` : "docs/index.html")),
    ];

    for (const rel of requiredFiles) {
      const full = join(distDir, rel);
      assert.equal(existsSync(full), true, `Expected ${rel} to exist in website/dist`);
    }

    // Verify unified header & footer across Landing, Docs, About, Terms, and Privacy
    for (const checkRel of [
      "index.html",
      "docs/index.html",
      "docs/rule-as-entity/index.html",
      "about/index.html",
      "terms/index.html",
      "privacy/index.html",
    ]) {
      const html = readFileSync(join(distDir, checkRel), "utf8");
      assert.equal(html.includes('aria-label="Primary Navigation"'), true, `${checkRel} missing unified header`);
      assert.equal(html.includes('aria-label="Legal & Compliance"'), true, `${checkRel} missing unified footer`);
      assert.equal(html.includes('href="/about/"'), true);
      assert.equal(html.includes('href="/terms/"'), true);
      assert.equal(html.includes('href="/privacy/"'), true);
    }

    // Verify design system tokens are compiled into style.css
    const css = readFileSync(join(distDir, "style.css"), "utf8");
    assert.equal(css.includes("--ds-color-bg"), true);
    assert.equal(css.includes("--ds-color-accent"), true);
    assert.equal(css.includes(".clip-panel"), true);
  });
});
