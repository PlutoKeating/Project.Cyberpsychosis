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

// 1. Copy public static assets (fonts, favicon, authentic screenshots)
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

// 5. Write client-side progressive enhancement script:
// - Theme toggle (dark / light)
// - Multi-language i18n toggle (zh / en)
// - CLI copy button
// - Authentic screenshot gallery switcher
// - Interactive 60fps HTML5 Canvas Micro Outpost Emergence Simulator
const clientAppJs = `(function () {
  var rootEl = document.documentElement;
  var themeBtn = document.getElementById("theme-toggle-btn");
  var themeLabel = document.getElementById("theme-toggle-label");
  var langBtn = document.getElementById("lang-toggle-btn");

  function syncThemeLabel() {
    var current = rootEl.getAttribute("data-theme") || "dark";
    if (themeLabel) themeLabel.textContent = current.toUpperCase();
  }

  function syncLangDocument() {
    var lang = rootEl.getAttribute("data-lang") || "zh";
    rootEl.setAttribute("lang", lang === "en" ? "en" : "zh-CN");
    var nextTitle = rootEl.getAttribute("data-page-title-" + lang);
    if (nextTitle) document.title = nextTitle;
  }

  syncThemeLabel();
  syncLangDocument();

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var current = rootEl.getAttribute("data-theme") || "dark";
      var next = current === "dark" ? "light" : "dark";
      rootEl.setAttribute("data-theme", next);
      try {
        localStorage.setItem("cyberpsychosis.theme", next);
      } catch (e) {}
      syncThemeLabel();
    });
  }

  if (langBtn) {
    langBtn.addEventListener("click", function () {
      var current = rootEl.getAttribute("data-lang") || "zh";
      var next = current === "zh" ? "en" : "zh";
      rootEl.setAttribute("data-lang", next);
      try {
        localStorage.setItem("cyberpsychosis.lang", next);
      } catch (e) {}
      syncLangDocument();
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

  // Screenshot Gallery Tabs
  var galleryBtns = document.querySelectorAll("[data-gallery-btn]");
  var galleryPanels = document.querySelectorAll("[data-gallery-panel]");
  if (galleryBtns.length > 0) {
    galleryBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var target = btn.getAttribute("data-gallery-btn");
        galleryBtns.forEach(function (b) {
          var isMatch = b.getAttribute("data-gallery-btn") === target;
          b.classList.toggle("border-accent", isMatch);
          b.classList.toggle("bg-accent-soft", isMatch);
          b.classList.toggle("text-accent", isMatch);
          b.classList.toggle("border-border", !isMatch);
          b.classList.toggle("bg-surface", !isMatch);
          b.classList.toggle("text-fg-muted", !isMatch);
        });
        galleryPanels.forEach(function (panel) {
          if (panel.getAttribute("data-gallery-panel") === target) {
            panel.removeAttribute("hidden");
          } else {
            panel.setAttribute("hidden", "");
          }
        });
      });
    });
  }

  // Interactive HTML5 Canvas 16x12 Micro Outpost Simulator
  var simCanvas = document.getElementById("hero-sim-canvas");
  if (simCanvas && simCanvas.getContext) {
    var ctx = simCanvas.getContext("2d");
    var activeStep = 2;
    var autoLoop = true;
    var animTick = 0;

    var stepBtns = document.querySelectorAll("[data-sim-step]");
    var traceEls = document.querySelectorAll("[data-sim-trace]");
    var ruleBadge = document.getElementById("sim-active-rule");
    var tickBadge = document.getElementById("sim-active-tick");
    var playBtn = document.getElementById("sim-play-btn");

    function setSimStep(nextStep) {
      activeStep = nextStep % 4;
      stepBtns.forEach(function (btn) {
        var idx = Number(btn.getAttribute("data-sim-step"));
        var isCurrent = idx === activeStep;
        btn.classList.toggle("border-accent", isCurrent);
        btn.classList.toggle("bg-accent-soft", isCurrent);
        btn.classList.toggle("text-accent", isCurrent);
        btn.classList.toggle("border-border", !isCurrent);
        btn.classList.toggle("bg-bg-elevated", !isCurrent);
        btn.classList.toggle("text-fg-muted", !isCurrent);
        if (isCurrent) {
          if (ruleBadge) ruleBadge.textContent = btn.getAttribute("data-rule") || "";
          if (tickBadge) tickBadge.textContent = btn.getAttribute("data-tick") || "";
        }
      });
      traceEls.forEach(function (el) {
        if (Number(el.getAttribute("data-sim-trace")) === activeStep) {
          el.removeAttribute("hidden");
        } else {
          el.setAttribute("hidden", "");
        }
      });
    }

    stepBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        autoLoop = false;
        if (playBtn) playBtn.textContent = "PAUSED";
        setSimStep(Number(btn.getAttribute("data-sim-step")));
      });
    });

    simCanvas.addEventListener("click", function () {
      setSimStep((activeStep + 1) % 4);
    });

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        autoLoop = !autoLoop;
        playBtn.textContent = autoLoop ? "AUTO LOOP" : "PAUSED";
      });
    }

    setInterval(function () {
      if (autoLoop) {
        setSimStep((activeStep + 1) % 4);
      }
    }, 3600);

    function cssToken(name) {
      return getComputedStyle(rootEl).getPropertyValue(name).trim();
    }

    function drawFrame() {
      animTick += 1;
      var w = simCanvas.width;
      var h = simCanvas.height;
      var cols = 16;
      var rows = 12;
      var cw = w / cols;
      var ch = h / rows;

      var cBg = cssToken("--ds-color-code-bg");
      var cSurface = cssToken("--ds-color-surface");
      var cBorder = cssToken("--ds-color-border-strong");
      var cFg = cssToken("--ds-color-fg");
      var cSubtle = cssToken("--ds-color-fg-subtle");
      var cAccent = cssToken("--ds-color-accent");
      var cLogic = cssToken("--ds-color-cyber-logic");
      var cChem = cssToken("--ds-color-cyber-chemistry");
      var cPhys = cssToken("--ds-color-cyber-physics");
      var cPipe = cssToken("--ds-color-cyber-logistics");
      var cSoc = cssToken("--ds-color-cyber-social");
      var cSem = cssToken("--ds-color-cyber-semantic");

      ctx.fillStyle = cBg;
      ctx.fillRect(0, 0, w, h);

      // Grid lines
      ctx.strokeStyle = cSurface;
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= cols; gx++) {
        ctx.beginPath();
        ctx.moveTo(gx * cw, 0);
        ctx.lineTo(gx * cw, h);
        ctx.stroke();
      }
      for (var gy = 0; gy <= rows; gy++) {
        ctx.beginPath();
        ctx.moveTo(0, gy * ch);
        ctx.lineTo(w, gy * ch);
        ctx.stroke();
      }

      // Pipeline topology (3,5) -> (5,5) -> (7,5) -> (9,5)
      var pipeBroken = activeStep >= 2;
      ctx.save();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = activeStep === 0 ? cPipe : pipeBroken ? cPhys : cLogic;
      ctx.beginPath();
      ctx.moveTo(3.5 * cw, 5.5 * ch);
      ctx.lineTo(7.5 * cw, 5.5 * ch);
      ctx.stroke();

      ctx.beginPath();
      if (pipeBroken) ctx.setLineDash([5, 5]);
      ctx.moveTo(7.5 * cw, 5.5 * ch);
      ctx.lineTo(9.5 * cw, 5.5 * ch);
      ctx.stroke();
      ctx.restore();

      // Animated fluid particles on pipeline
      if (!pipeBroken) {
        var flowOffset = (animTick * 2.2) % (6 * cw);
        ctx.fillStyle = activeStep === 0 ? cPipe : cLogic;
        for (var p = 0; p < 3; p++) {
          var px = 3.5 * cw + ((flowOffset + p * 2 * cw) % (6 * cw));
          ctx.beginPath();
          ctx.arc(px, 5.5 * ch, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Social trust edge (10,6) -> (13,8)
      ctx.save();
      ctx.strokeStyle = activeStep === 2 ? cPhys : activeStep === 3 ? cSem : cSoc;
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = -(animTick * 0.6);
      ctx.beginPath();
      ctx.moveTo(10.5 * cw, 6.5 * ch);
      ctx.lineTo(13.5 * cw, 8.5 * ch);
      ctx.stroke();
      ctx.restore();

      // Shockwave & thermal halos on Step 2 / Step 3
      if (activeStep >= 2) {
        var waveR = 24 + ((animTick * 1.4) % 72);
        ctx.save();
        ctx.strokeStyle = cPhys;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(9.5 * cw, 5.5 * ch, waveR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (activeStep === 3) {
        var calmR = 22 + ((animTick * 0.9) % 44);
        ctx.save();
        ctx.strokeStyle = cSem;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(10.5 * cw, 4.5 * ch, calmR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Entities list for current step
      var entities = [
        { x: 3, y: 2, g: "W", c: cPipe },
        { x: 4, y: 2, g: "I", c: cFg },
        { x: activeStep === 0 ? 5 : 6, y: 2, g: "C", c: activeStep === 0 ? cPipe : cSubtle },
        { x: 5, y: activeStep === 0 ? 3 : 2, g: "H", c: cLogic },
        { x: 3, y: 5, g: "P", c: activeStep === 0 ? cPipe : cLogic },
        { x: 5, y: 5, g: "=", c: activeStep === 0 ? cPipe : cLogic },
        { x: 7, y: 5, g: pipeBroken ? "x" : "=", c: pipeBroken ? cPhys : cPipe },
        { x: 9, y: 5, g: "G", c: activeStep >= 2 ? cPhys : cChem },
        { x: 10, y: 5, g: activeStep >= 2 ? "*" : "o", c: activeStep >= 2 ? cPhys : cChem },
        { x: 9, y: 6, g: activeStep >= 2 ? "*" : "o", c: activeStep >= 2 ? cPhys : cChem },
        { x: 10, y: 6, g: "A", c: activeStep === 2 ? cPhys : activeStep === 3 ? cSem : cSoc },
        { x: 13, y: 8, g: "B", c: activeStep === 2 ? cPhys : activeStep === 3 ? cSem : cSoc }
      ];

      if (activeStep >= 2) {
        entities.push(
          { x: 10, y: 4, g: "~", c: activeStep === 3 ? cSem : cSubtle },
          { x: 11, y: 5, g: "~", c: activeStep === 3 ? cSem : cSubtle }
        );
      }

      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (var i = 0; i < entities.length; i++) {
        var e = entities[i];
        var cx = (e.x + 0.5) * cw;
        var cy = (e.y + 0.5) * ch;
        ctx.fillStyle = cSurface;
        ctx.strokeStyle = e.c || cBorder;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.roundRect(cx - 14, cy - 12, 28, 24, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = e.c || cFg;
        ctx.fillText(e.g, cx, cy + 1);
      }

      requestAnimationFrame(drawFrame);
    }

    requestAnimationFrame(drawFrame);
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
