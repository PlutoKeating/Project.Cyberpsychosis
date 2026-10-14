import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { SUPPORTED_LOCALES } from "./i18n/index.ts";
import { DOC_CHAPTER_PAGES } from "./pages/docs-data.ts";

const distDir = fileURLToPath(new URL("../dist", import.meta.url));
const srcDir = fileURLToPath(new URL(".", import.meta.url));

describe("cyberpsychosis-website — Static Build, Visual Journey, i18n Scaffold & Multi-Page Docs Contract", () => {
  it("generates landing page, all 8 docs subpages, legal pages, 404, screenshots, and compiled CSS", () => {
    const requiredFiles = [
      "index.html",
      "style.css",
      "app.js",
      "engine/core/index.js",
      "engine/core/kernel.js",
      "engine/core/lockstep.js",
      "engine/plugins/index.js",
      "engine/demo/index.js",
      "404.html",
      "sitemap.xml",
      "robots.txt",
      "_headers",
      "about/index.html",
      "terms/index.html",
      "privacy/index.html",
      "screenshots/workbench-live.png",
      "screenshots/tui-live.png",
      "screenshots/worldfork-inspector.png",
      ...DOC_CHAPTER_PAGES.map((p) => (p.slug ? `docs/${p.slug}/index.html` : "docs/index.html")),
    ];

    for (const rel of requiredFiles) {
      const full = join(distDir, rel);
      assert.equal(existsSync(full), true, `Expected ${rel} to exist in website/dist`);
    }

    // Verify unified header, footer, language toggle, and bilingual nodes across all page types
    for (const checkRel of [
      "index.html",
      "docs/index.html",
      "docs/rule-as-entity/index.html",
      "about/index.html",
      "terms/index.html",
      "privacy/index.html",
      "404.html",
    ]) {
      const html = readFileSync(join(distDir, checkRel), "utf8");
      assert.equal(html.includes('aria-label="Primary Navigation"'), true, `${checkRel} missing unified header`);
      assert.equal(
        html.includes('aria-label="Legal &amp; Compliance"') || html.includes('aria-label="Legal & Compliance"'),
        true,
        `${checkRel} missing unified footer`
      );
      assert.equal(html.includes('id="lang-toggle-btn"'), true, `${checkRel} missing i18n language toggle`);
      assert.equal(html.includes('href="/about/"'), true);
      assert.equal(html.includes('href="/terms/"'), true);
      assert.equal(html.includes('href="/privacy/"'), true);

      for (const loc of SUPPORTED_LOCALES) {
        assert.equal(
          html.includes(`data-lang-code="${loc}"`),
          true,
          `${checkRel} missing localized nodes for locale '${loc}'`
        );
      }
    }

    // Verify User Journey Map, H5 Live Canvas, Real Engine Module Binding, SVG Diagrams, and Screenshot Gallery on Landing Page
    const landingHtml = readFileSync(join(distDir, "index.html"), "utf8");
    assert.equal(landingHtml.includes('id="hero-sim-canvas"'), true, "Landing page missing H5 live simulation canvas");
    assert.equal(landingHtml.includes('id="sim-state-hash"'), true, "Landing page missing live FNV-1a stateHash badge");
    assert.equal(landingHtml.includes('id="sim-share-btn"'), true, "Landing page missing deterministic story share button");
    const appJs = readFileSync(join(distDir, "app.js"), "utf8");
    assert.equal(
      appJs.includes('from "/engine/demo/index.js"'),
      true,
      "Expected app.js to import real OutpostSandbox kernel in-browser"
    );
    assert.equal(landingHtml.includes("/screenshots/workbench-live.png"), true, "Landing page missing Web Studio screenshot");
    assert.equal(landingHtml.includes("/screenshots/tui-live.png"), true, "Landing page missing Terminal TUI screenshot");
    assert.equal(landingHtml.includes("/screenshots/worldfork-inspector.png"), true, "Landing page missing WorldFork screenshot");
    assert.equal(landingHtml.includes('id="cascade"'), true, "Landing page missing Stage 02 Causal Flow section");
    assert.equal(landingHtml.includes('id="screenshots"'), true, "Landing page missing Stage 03 Screenshots section");
    assert.equal(landingHtml.includes('id="highlights"'), true, "Landing page missing Stage 04 Highlights section");
    assert.equal(landingHtml.includes('id="architecture"'), true, "Landing page missing Stage 05 Architecture section");

    // Verify design system tokens & multi-language rules are compiled into style.css
    const css = readFileSync(join(distDir, "style.css"), "utf8");
    assert.equal(css.includes("--ds-color-bg"), true);
    assert.equal(css.includes("--ds-color-accent"), true);
    assert.equal(css.includes(".clip-panel"), true);
    assert.equal(css.includes("data-lang-code"), true);
  });

  it("enforces companion *.i18n.ts modules for every page and component in website/src/", () => {
    for (const folder of ["pages", "components"]) {
      const dir = join(srcDir, folder);
      for (const file of readdirSync(dir)) {
        if (!file.endsWith(".ts") || file.endsWith(".i18n.ts") || file.endsWith(".test.ts")) {
          continue;
        }
        const companion = join(dir, file.replace(/\.ts$/, ".i18n.ts"));
        assert.equal(
          existsSync(companion),
          true,
          `Expected ${folder}/${file} to have companion i18n module ${companion}`
        );
      }
    }
  });
});
