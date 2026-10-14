import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getDocHref, renderDocPage } from "../src/components/docs-layout.ts";
import { renderAboutPage } from "../src/pages/about.ts";
import { DOC_CHAPTER_PAGES } from "../src/pages/docs-data.ts";
import { renderLandingPage } from "../src/pages/landing.ts";
import { renderNotFoundPage } from "../src/pages/not-found.ts";
import { renderPrivacyPage } from "../src/pages/privacy.ts";
import { renderTermsPage } from "../src/pages/terms.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const dist = join(root, "dist");
const publicDir = join(root, "public");
const siteOrigin = process.env.SITE_ORIGIN ?? "https://cyberpsychosis.plutokeating.beer";

function writePage(relPath: string, html: string): void {
  const fullPath = join(dist, relPath);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, html, "utf8");
}

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

// 1. Copy public static assets (fonts, favicon)
if (existsSync(publicDir)) {
  cpSync(publicDir, dist, { recursive: true });
}

// 2. Render Landing Page
writePage("index.html", renderLandingPage());

// 3. Render Multi-Chapter, Multi-Page Docs Collection
for (const docPage of DOC_CHAPTER_PAGES) {
  const relDir = docPage.slug ? join("docs", docPage.slug, "index.html") : join("docs", "index.html");
  writePage(relDir, renderDocPage(docPage, DOC_CHAPTER_PAGES));
}

// 4. Render Legal & Info Pages (About Us, Terms & Conditions, Privacy Policy) & 404
writePage(join("about", "index.html"), renderAboutPage());
writePage(join("terms", "index.html"), renderTermsPage());
writePage(join("privacy", "index.html"), renderPrivacyPage());
writePage("404.html", renderNotFoundPage());

// 5. Write client-side progressive enhancement script (theme toggle & CLI copy button)
const clientAppJs = `(function () {
  var themeBtn = document.getElementById("theme-toggle-btn");
  var themeLabel = document.getElementById("theme-toggle-label");
  function syncLabel() {
    var current = document.documentElement.getAttribute("data-theme") || "dark";
    if (themeLabel) themeLabel.textContent = current.toUpperCase();
  }
  syncLabel();
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") || "dark";
      var next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem("cyberpsychosis.theme", next);
      } catch (e) {}
      syncLabel();
    });
  }
  var copyBtn = document.getElementById("copy-cli-btn");
  var cliCode = document.getElementById("cli-command-text");
  if (copyBtn && cliCode && navigator.clipboard) {
    copyBtn.addEventListener("click", function () {
      navigator.clipboard.writeText(cliCode.textContent || "").then(function () {
        copyBtn.textContent = "COPIED ✓";
        setTimeout(function () {
          copyBtn.textContent = "COPY ⧉";
        }, 1600);
      });
    });
  }
})();
`;
writeFileSync(join(dist, "app.js"), clientAppJs, "utf8");

// 6. Generate sitemap.xml, robots.txt, and Cloudflare _headers
const sitemapPaths = [
  "/",
  ...DOC_CHAPTER_PAGES.map((p) => getDocHref(p.slug)),
  "/about/",
  "/terms/",
  "/privacy/",
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapPaths.map((p) => `  <url><loc>${siteOrigin}${p}</loc></url>`).join("\n")}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemapXml, "utf8");

const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${siteOrigin}/sitemap.xml
`;
writeFileSync(join(dist, "robots.txt"), robotsTxt, "utf8");

const headersFile = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
`;
writeFileSync(join(dist, "_headers"), headersFile, "utf8");

console.log(`Built ${sitemapPaths.length} pages + 404.html into ${dist}`);
