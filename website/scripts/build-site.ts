import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
const repoRoot = fileURLToPath(new URL("../..", import.meta.url));
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

// 1b. Copy compiled real engine ES modules (core, plugins, demo-minimal) into dist/engine/
// and rewrite bare workspace specifiers so the browser natively executes the REAL EmergenceKernel!
const enginePackages: Array<{ pkgDir: string; targetSubdir: string }> = [
  { pkgDir: join(repoRoot, "packages/core/dist"), targetSubdir: "core" },
  { pkgDir: join(repoRoot, "packages/plugins/dist"), targetSubdir: "plugins" },
  { pkgDir: join(repoRoot, "packages/demo-minimal/dist"), targetSubdir: "demo" },
];

for (const { pkgDir, targetSubdir } of enginePackages) {
  if (!existsSync(pkgDir)) continue;
  const outSubdir = join(dist, "engine", targetSubdir);
  mkdirSync(outSubdir, { recursive: true });
  for (const fname of readdirSync(pkgDir)) {
    if (!fname.endsWith(".js") || fname.endsWith(".test.js")) continue;
    let code = readFileSync(join(pkgDir, fname), "utf8");
    code = code
      .replace(/from\s+["']cyberpsychosis-core["']/g, 'from "../core/index.js"')
      .replace(/from\s+["']cyberpsychosis-plugins["']/g, 'from "../plugins/index.js"')
      .replace(/\/\/# sourceMappingURL=.*$/gm, "");
    writeFileSync(join(outSubdir, fname), code, "utf8");
  }
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

// 5. Write client-side progressive enhancement ES module:
// - Theme toggle (dark / light)
// - Multi-language i18n toggle (zh / en)
// - CLI copy button
// - Authentic screenshot gallery switcher
// - IN-BROWSER REAL EMERGENCE KERNEL (imports /engine/demo/index.js & /engine/core/index.js)
const clientAppJs = `import { createOutpostSandbox } from "/engine/demo/index.js";
import { encodeReplayTapeToBase64Url, decodeReplayTapeFromBase64Url } from "/engine/core/index.js";

(function () {
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

  // Live In-Browser EmergenceKernel 16x12 Micro Outpost Simulator
  var simCanvas = document.getElementById("hero-sim-canvas");
  if (simCanvas && simCanvas.getContext) {
    var ctx = simCanvas.getContext("2d");
    var sandbox = createOutpostSandbox(20261014);
    var currentSnap = sandbox.kernel.getSnapshot();
    var selectedEntityId = sandbox.entities.agentBetaId;
    var activeStep = 2;
    var autoLoop = true;
    var animTick = 0;

    var stepBtns = document.querySelectorAll("[data-sim-step]");
    var traceEls = document.querySelectorAll("[data-sim-trace]");
    var presetTracesBox = document.getElementById("sim-preset-traces");
    var liveCausalBox = document.getElementById("sim-live-causal-output");
    var ruleBadge = document.getElementById("sim-active-rule");
    var tickBadge = document.getElementById("sim-active-tick");
    var hashBadge = document.getElementById("sim-state-hash");
    var playBtn = document.getElementById("sim-play-btn");
    var stepOneBtn = document.getElementById("sim-step-one-btn");
    var rewindBtn = document.getElementById("sim-rewind-btn");
    var shareBtn = document.getElementById("sim-share-btn");

    function updateTelemetryBar(customLiveTraceText) {
      currentSnap = sandbox.kernel.getSnapshot();
      var genEnt = currentSnap.entities.find(function (e) { return e.id === sandbox.entities.generatorId; });
      var genTemp = genEnt && genEnt.props && typeof genEnt.props.temp === "number" ? Math.round(genEnt.props.temp) : 58;
      var topRule = currentSnap.activeRules.length > 0 ? "[" + currentSnap.activeRules[0].name + "]" : "[NO OVERRIDE]";
      if (ruleBadge) ruleBadge.textContent = topRule;
      if (tickBadge) tickBadge.textContent = "TICK " + String(currentSnap.tick).padStart(2, "0") + " · " + genTemp + "°C";
      if (hashBadge) hashBadge.textContent = currentSnap.stateHash;

      if (customLiveTraceText && liveCausalBox && presetTracesBox) {
        presetTracesBox.setAttribute("hidden", "");
        liveCausalBox.removeAttribute("hidden");
        liveCausalBox.textContent = customLiveTraceText;
      }
    }

    function runRealScenarioStage(stageIdx) {
      activeStep = stageIdx % 4;
      sandbox = createOutpostSandbox(20261014);

      if (activeStep === 0) {
        sandbox.kernel.stepMany(1);
      } else if (activeStep === 1) {
        sandbox.kernel.stepMany(1);
        sandbox.triggerLogicShiftWaterIsHot();
        sandbox.kernel.stepMany(1);
      } else if (activeStep === 2) {
        sandbox.kernel.stepMany(1);
        sandbox.triggerLogicShiftWaterIsHot();
        sandbox.kernel.stepMany(5);
      } else if (activeStep === 3) {
        sandbox.kernel.stepMany(1);
        sandbox.triggerLogicShiftWaterIsHot();
        sandbox.kernel.stepMany(5);
        sandbox.injectSemanticRule("Make smoke calm", 4);
        sandbox.kernel.stepMany(2);
      }

      stepBtns.forEach(function (btn) {
        var idx = Number(btn.getAttribute("data-sim-step"));
        var isCurrent = idx === activeStep;
        btn.classList.toggle("border-accent", isCurrent);
        btn.classList.toggle("bg-accent-soft", isCurrent);
        btn.classList.toggle("text-accent", isCurrent);
        btn.classList.toggle("border-border", !isCurrent);
        btn.classList.toggle("bg-bg-elevated", !isCurrent);
        btn.classList.toggle("text-fg-muted", !isCurrent);
      });

      if (liveCausalBox && presetTracesBox) {
        liveCausalBox.setAttribute("hidden", "");
        presetTracesBox.removeAttribute("hidden");
      }

      traceEls.forEach(function (el) {
        if (Number(el.getAttribute("data-sim-trace")) === activeStep) {
          el.removeAttribute("hidden");
        } else {
          el.setAttribute("hidden", "");
        }
      });

      updateTelemetryBar();
    }

    // Check if URL contains a deterministic story replay tape (?replay=...)
    try {
      var urlParams = new URLSearchParams(window.location.search);
      var replayEncoded = urlParams.get("replay");
      if (replayEncoded) {
        autoLoop = false;
        if (playBtn) playBtn.textContent = "PAUSED";
        var tape = decodeReplayTapeFromBase64Url(replayEncoded);
        var verify = sandbox.kernel.replayFromTape(tape, function () {
          sandbox = createOutpostSandbox(tape.seed);
        });
        var lineage = sandbox.traceCrisisLineage();
        var latestNarrative = lineage.narrative.length > 0
          ? lineage.narrative[lineage.narrative.length - 1]
          : "Replayed deterministic story tape (" + tape.commands.length + " commands)";
        updateTelemetryBar("[REPLAY VERIFIED: " + verify.actualStateHash + "] " + latestNarrative);
      } else {
        runRealScenarioStage(2);
      }
    } catch (e) {
      runRealScenarioStage(2);
    }

    stepBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        autoLoop = false;
        if (playBtn) playBtn.textContent = "PAUSED";
        runRealScenarioStage(Number(btn.getAttribute("data-sim-step")));
      });
    });

    if (stepOneBtn) {
      stepOneBtn.addEventListener("click", function () {
        autoLoop = false;
        if (playBtn) playBtn.textContent = "PAUSED";
        var res = sandbox.kernel.step();
        var lastEvt = res.emittedEvents.length > 0
          ? res.emittedEvents[res.emittedEvents.length - 1]
          : null;
        var msg = lastEvt
          ? "[T" + res.tick + " | " + lastEvt.domain.toUpperCase() + "] " + lastEvt.summary
          : "[T" + res.tick + " | KERNEL] Stepped +1 deterministic tick (StateHash=" + res.snapshot.stateHash + ")";
        updateTelemetryBar(msg);
      });
    }

    if (rewindBtn) {
      rewindBtn.addEventListener("click", function () {
        autoLoop = false;
        if (playBtn) playBtn.textContent = "PAUSED";
        var targetTick = Math.max(0, sandbox.kernel.tick - 1);
        sandbox.kernel.rewindTo(targetTick);
        var mem = sandbox.kernel.getSnapshotMemoryStats();
        updateTelemetryBar(
          "[REWIND -> T" + targetTick + "] Restored via CoW Delta Snapshot (" +
            mem.compressionRatio + "x compression, Hash=" + sandbox.kernel.getStateHash() + ")"
        );
      });
    }

    if (shareBtn) {
      shareBtn.addEventListener("click", function () {
        var tape = sandbox.kernel.exportReplayTape();
        var encoded = encodeReplayTapeToBase64Url(tape);
        var shareUrl = window.location.origin + "/?replay=" + encoded;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareUrl);
        }
        updateTelemetryBar(
          "[STORY URL COPIED ✓] Hash=" + tape.expectedStateHash + " · " + shareUrl
        );
      });
    }

    simCanvas.addEventListener("click", function (ev) {
      autoLoop = false;
      if (playBtn) playBtn.textContent = "PAUSED";
      var rect = simCanvas.getBoundingClientRect();
      var gx = Math.floor(((ev.clientX - rect.left) / rect.width) * currentSnap.grid.width);
      var gy = Math.floor(((ev.clientY - rect.top) / rect.height) * currentSnap.grid.height);
      var hit = currentSnap.entities.find(function (e) {
        return Math.round(e.x) === gx && Math.round(e.y) === gy;
      });
      if (hit) {
        selectedEntityId = hit.id;
        if (hit.tags.indexOf("pushable") !== -1) {
          // If user clicks [HOT] at (5,3), push it up into the rule slot; otherwise push right
          if (hit.id === sandbox.entities.wordHotId && Math.round(hit.y) === 3) {
            sandbox.triggerLogicShiftWaterIsHot();
          } else {
            sandbox.kernel.pushEntity(hit.id, 1, 0, "User clicked word block on live canvas");
          }
        }
        var report = sandbox.kernel.causal.traceLineage(hit.id);
        var traceLine = report.narrative.length > 0
          ? report.narrative[report.narrative.length - 1]
          : "[ENTITY #" + hit.id + " " + hit.name + "] tags=[" + hit.tags.join(",") + "] props=" + JSON.stringify(hit.props);
        updateTelemetryBar(traceLine);
      } else {
        sandbox.kernel.step();
        updateTelemetryBar();
      }
    });

    if (playBtn) {
      playBtn.addEventListener("click", function () {
        autoLoop = !autoLoop;
        playBtn.textContent = autoLoop ? "AUTO LOOP" : "PAUSED";
      });
    }

    setInterval(function () {
      if (autoLoop) {
        runRealScenarioStage((activeStep + 1) % 4);
      }
    }, 3600);

    function cssToken(name) {
      return getComputedStyle(rootEl).getPropertyValue(name).trim();
    }

    function pickEntityColor(ent, cPipe, cFg, cSubtle, cLogic, cPhys, cChem, cSoc, cSem) {
      if (ent.tags.indexOf("burning") !== -1 || ent.tags.indexOf("exploded") !== -1 || ent.tags.indexOf("broken") !== -1) {
        return cPhys;
      }
      if (ent.tags.indexOf("panicked") !== -1) return cPhys;
      if (ent.tags.indexOf("calm") !== -1) return cSem;
      if (ent.tags.indexOf("agent") !== -1) return cSoc;
      if (ent.tags.indexOf("hot") !== -1) return cLogic;
      if (ent.tags.indexOf("water") !== -1) return cPipe;
      if (ent.tags.indexOf("generator") !== -1 || ent.tags.indexOf("oil") !== -1) return cChem;
      if (ent.tags.indexOf("word_verb") !== -1) return cFg;
      if (ent.tags.indexOf("smoke") !== -1) return cSubtle;
      return cAccent || cFg;
    }

    var cAccent = "";

    function drawFrame() {
      animTick += 1;
      var w = simCanvas.width;
      var h = simCanvas.height;
      var cols = currentSnap.grid.width;
      var rows = currentSnap.grid.height;
      var cw = w / cols;
      var ch = h / rows;

      var cBg = cssToken("--ds-color-code-bg");
      var cSurface = cssToken("--ds-color-surface");
      var cBorder = cssToken("--ds-color-border-strong");
      var cFg = cssToken("--ds-color-fg");
      var cSubtle = cssToken("--ds-color-fg-subtle");
      cAccent = cssToken("--ds-color-accent");
      var cLogic = cssToken("--ds-color-cyber-logic");
      var cChem = cssToken("--ds-color-cyber-chemistry");
      var cPhys = cssToken("--ds-color-cyber-physics");
      var cPipe = cssToken("--ds-color-cyber-logistics");
      var cSoc = cssToken("--ds-color-cyber-social");
      var cSem = cssToken("--ds-color-cyber-semantic");

      ctx.fillStyle = cBg;
      ctx.fillRect(0, 0, w, h);

      // 1. Grid lines
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

      // 2. Render Real GraphEdges (pipes, social_trust, breakable rigid-body joints) from currentSnap.graphEdges
      for (var ei = 0; ei < currentSnap.graphEdges.length; ei++) {
        var edge = currentSnap.graphEdges[ei];
        var fromE = currentSnap.entities.find(function (x) { return x.id === edge.from; });
        var toE = currentSnap.entities.find(function (x) { return x.id === edge.to; });
        if (!fromE || !toE) continue;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo((fromE.x + 0.5) * cw, (fromE.y + 0.5) * ch);
        ctx.lineTo((toE.x + 0.5) * cw, (toE.y + 0.5) * ch);
        if (edge.kind === "pipe") {
          var isHotFlow = fromE.tags.indexOf("hot") !== -1;
          ctx.strokeStyle = !edge.intact ? cPhys : isHotFlow ? cLogic : cPipe;
          ctx.lineWidth = 3.5;
          if (!edge.intact) ctx.setLineDash([5, 5]);
        } else if (edge.kind === "joint") {
          ctx.strokeStyle = edge.intact ? cSubtle : cPhys;
          ctx.lineWidth = 2.2;
          if (!edge.intact) ctx.setLineDash([3, 3]);
        } else {
          ctx.strokeStyle = toE.tags.indexOf("panicked") !== -1 ? cPhys : cSoc;
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.lineDashOffset = -(animTick * 0.6);
        }
        ctx.stroke();
        ctx.restore();
      }

      // 3. Shockwave & calming aura halos driven by real entity tags
      for (var hi = 0; hi < currentSnap.entities.length; hi++) {
        var hent = currentSnap.entities[hi];
        if (hent.tags.indexOf("exploded") !== -1) {
          var waveR = 24 + ((animTick * 1.4) % 72);
          ctx.save();
          ctx.strokeStyle = cPhys;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc((hent.x + 0.5) * cw, (hent.y + 0.5) * ch, waveR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
        if (hent.tags.indexOf("calm") !== -1) {
          var calmR = 18 + ((animTick * 0.9) % 38);
          ctx.save();
          ctx.strokeStyle = cSem;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc((hent.x + 0.5) * cw, (hent.y + 0.5) * ch, calmR, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 4. Render Real Entities from currentSnap.entities
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (var i = 0; i < currentSnap.entities.length; i++) {
        var e = currentSnap.entities[i];
        var cx = (e.x + 0.5) * cw;
        var cy = (e.y + 0.5) * ch;
        var col = pickEntityColor(e, cPipe, cFg, cSubtle, cLogic, cPhys, cChem, cSoc, cSem);

        ctx.fillStyle = cSurface;
        ctx.strokeStyle = e.id === selectedEntityId ? cAccent : col || cBorder;
        ctx.lineWidth = e.id === selectedEntityId ? 2.4 : 1.8;
        ctx.beginPath();
        ctx.roundRect(cx - 14, cy - 12, 28, 24, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = col || cFg;
        var glyph = e.tags.indexOf("burning") !== -1 && e.tags.indexOf("oil") !== -1 ? "*" : e.glyph;
        ctx.fillText(glyph, cx, cy + 1);
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

console.log(`Built ${sitemapPaths.length} pages + 404.html + live browser kernel modules into ${dist}`);
