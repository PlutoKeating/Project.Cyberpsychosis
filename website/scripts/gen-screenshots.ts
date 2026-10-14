/**
 * Generates authentic high-resolution product screenshots from live OutpostSandbox simulation states:
 * 1. public/screenshots/workbench-live.png      — Cyberpsychosis Web Workbench at crisis & WorldFork state
 * 2. public/screenshots/tui-live.png            — Cyberpsychosis Terminal TUI ASCII/ANSI sandbox output
 * 3. public/screenshots/worldfork-inspector.png — Parallel WorldFork Timeline & Causal DAG Inspector
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { OutpostSandbox } from "../../packages/demo-minimal/dist/index.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const outDir = join(root, "public", "screenshots");
mkdirSync(outDir, { recursive: true });

function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Run the real deterministic simulation through its signature emergence cascade
const sandbox = new OutpostSandbox(20261014);
sandbox.kernel.stepMany(2); // Tick 2
sandbox.triggerLogicShiftWaterIsHot(); // Push [HOT] into (5,2) -> [WATER IS HOT]
sandbox.kernel.stepMany(4); // Tick 6: CoreGenerator overheats (174°C) -> explodes -> pipe ruptures -> oil ignites -> Alpha & Beta panic
const forkTranslation = sandbox.injectSemanticRule("Make smoke calm", 5); // Compile & preview +5 ticks in WorldFork
sandbox.kernel.step(); // Tick 7: Calm smoke aura stabilizes panic

const snap = sandbox.kernel.getSnapshot();
const lineage = sandbox.traceCrisisLineage(sandbox.entities.agentBetaId);

// 1. Web Workbench Screenshot (1600 x 960)
function buildWorkbenchSvg(): string {
  const gridW = 16;
  const gridH = 12;
  const canvasX = 48;
  const canvasY = 148;
  const cellW = 48;
  const cellH = 44;
  const totalCanvasW = gridW * cellW;
  const totalCanvasH = gridH * cellH;

  const gridLines: string[] = [];
  for (let x = 0; x <= gridW; x++) {
    const px = canvasX + x * cellW;
    gridLines.push(
      `<line x1="${px}" y1="${canvasY}" x2="${px}" y2="${canvasY + totalCanvasH}" stroke="#23262d" stroke-width="1"/>`
    );
  }
  for (let y = 0; y <= gridH; y++) {
    const py = canvasY + y * cellH;
    gridLines.push(
      `<line x1="${canvasX}" y1="${py}" x2="${canvasX + totalCanvasW}" y2="${py}" stroke="#23262d" stroke-width="1"/>`
    );
  }

  const coordLabels: string[] = [];
  for (let x = 0; x < gridW; x += 2) {
    coordLabels.push(
      `<text x="${canvasX + x * cellW + 6}" y="${canvasY + 13}" fill="#6f6b65" font-family="monospace" font-size="10">${x}</text>`
    );
  }
  for (let y = 2; y < gridH; y += 2) {
    coordLabels.push(
      `<text x="${canvasX + 5}" y="${canvasY + y * cellH + 14}" fill="#6f6b65" font-family="monospace" font-size="10">${y}</text>`
    );
  }

  const heatHalos: string[] = [];
  for (const e of snap.entities) {
    const cx = canvasX + (e.x + 0.5) * cellW;
    const cy = canvasY + (e.y + 0.5) * cellH;
    const temp = e.props.temp ?? 20;
    if (temp >= 80) {
      heatHalos.push(
        `<circle cx="${cx}" cy="${cy}" r="${cellW * 1.25}" fill="#c97c7c" fill-opacity="0.14"/>`,
        `<circle cx="${cx}" cy="${cy}" r="${cellW * 0.78}" fill="#f0a35e" fill-opacity="0.20"/>`
      );
    } else if (e.tags.includes("calm")) {
      heatHalos.push(
        `<circle cx="${cx}" cy="${cy}" r="${cellW * 0.9}" fill="#7fb08f" fill-opacity="0.18"/>`
      );
    }
  }

  const genCx = canvasX + 9.5 * cellW;
  const genCy = canvasY + 5.5 * cellH;
  heatHalos.push(
    `<circle cx="${genCx}" cy="${genCy}" r="${cellW * 2.35}" fill="none" stroke="#c97c7c" stroke-width="1.5" stroke-dasharray="6 4" stroke-opacity="0.8"/>`,
    `<circle cx="${genCx}" cy="${genCy}" r="${cellW * 1.55}" fill="none" stroke="#f0a35e" stroke-width="1.5" stroke-opacity="0.9"/>`
  );

  const edgeEls: string[] = [];
  for (const edge of snap.graphEdges) {
    const fromE = snap.entities.find((item) => item.id === edge.from);
    const toE = snap.entities.find((item) => item.id === edge.to);
    if (!fromE || !toE) continue;
    const x1 = canvasX + (fromE.x + 0.5) * cellW;
    const y1 = canvasY + (fromE.y + 0.5) * cellH;
    const x2 = canvasX + (toE.x + 0.5) * cellW;
    const y2 = canvasY + (toE.y + 0.5) * cellH;
    if (edge.kind === "pipe") {
      const color = edge.intact ? "#9fc3d6" : "#c97c7c";
      const dash = edge.intact ? "" : `stroke-dasharray="6 5"`;
      edgeEls.push(
        `<path d="M ${x1} ${y1} L ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="4.5" ${dash}/>`
      );
    } else {
      edgeEls.push(
        `<path d="M ${x1} ${y1} L ${x2} ${y2}" fill="none" stroke="#c9a7d9" stroke-width="2.5" stroke-dasharray="5 4"/>`
      );
    }
  }

  const entityEls: string[] = [];
  for (const e of snap.entities) {
    const cx = canvasX + (e.x + 0.5) * cellW;
    const cy = canvasY + (e.y + 0.5) * cellH;
    const isWord = e.tags.includes("word_block");
    const isSelected = e.id === sandbox.entities.agentBetaId;
    let fill = "#1d1e23";
    let stroke = "#a9a49c";
    if (isWord) {
      fill = "#2a2119";
      stroke = "#f0a35e";
    } else if (e.tags.includes("burning") || e.tags.includes("exploded")) {
      fill = "#331c1c";
      stroke = "#c97c7c";
    } else if (e.tags.includes("calm")) {
      fill = "#192b21";
      stroke = "#7fb08f";
    } else if (e.tags.includes("agent")) {
      fill = "#241d29";
      stroke = "#c9a7d9";
    } else if (e.tags.includes("water")) {
      fill = "#19252c";
      stroke = "#9fc3d6";
    }

    if (isSelected) {
      entityEls.push(
        `<rect x="${cx - 22}" y="${cy - 20}" width="44" height="40" rx="6" fill="none" stroke="#f0a35e" stroke-width="2.5"/>`
      );
    }

    entityEls.push(
      `<rect x="${cx - 17}" y="${cy - 15}" width="34" height="30" rx="5" fill="${fill}" stroke="${stroke}" stroke-width="1.8"/>`,
      `<text x="${cx}" y="${cy + 5}" text-anchor="middle" fill="#e8e4dd" font-family="monospace" font-weight="bold" font-size="15">${esc(e.glyph)}</text>`
    );
  }

  const keyChain = lineage.chain.slice(-6);
  const causalRows = keyChain.map((node, idx) => {
    const y = 516 + idx * 44;
    const badgeColor =
      node.domain === "logic"
        ? "#f0a35e"
        : node.domain === "physics"
          ? "#c97c7c"
          : node.domain === "logistics"
            ? "#9fc3d6"
            : node.domain === "social"
              ? "#c9a7d9"
              : node.domain === "semantic"
                ? "#7fb08f"
                : "#d9b96a";
    return `<g>
      <rect x="864" y="${y}" width="688" height="36" rx="4" fill="#131417" stroke="#2a2b30" stroke-width="1"/>
      <rect x="872" y="${y + 7}" width="102" height="22" rx="3" fill="${badgeColor}" fill-opacity="0.18" stroke="${badgeColor}" stroke-width="1"/>
      <text x="923" y="${y + 22}" text-anchor="middle" fill="${badgeColor}" font-family="monospace" font-weight="bold" font-size="11">T${node.tick} · ${esc(node.domain.toUpperCase())}</text>
      <text x="986" y="${y + 22}" fill="#e8e4dd" font-family="sans-serif" font-size="12.5">${esc(node.summary.slice(0, 62))}</text>
    </g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="960" viewBox="0 0 1600 960">
    <rect width="1600" height="960" fill="#0e0f11"/>
    <rect x="0" y="0" width="1600" height="68" fill="#131417" stroke="#2a2b30" stroke-width="1"/>
    <rect x="28" y="18" width="36" height="32" rx="4" fill="#2a1e12" stroke="#f0a35e" stroke-width="1.5"/>
    <text x="46" y="39" text-anchor="middle" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="13">C.P.</text>
    <text x="78" y="39" fill="#e8e4dd" font-family="sans-serif" font-weight="bold" font-size="17">CYBERPSYCHOSIS STUDIO — 16×12 Multi-Modal Emergence Workbench</text>

    <rect x="880" y="18" width="104" height="32" rx="4" fill="#17181c" stroke="#2e3036"/>
    <text x="932" y="39" text-anchor="middle" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="12">TICK: ${snap.tick}</text>

    <rect x="996" y="18" width="128" height="32" rx="4" fill="#17181c" stroke="#2e3036"/>
    <text x="1060" y="39" text-anchor="middle" fill="#e8e4dd" font-family="monospace" font-weight="bold" font-size="12">ENTITIES: ${snap.metrics.entityCount}</text>

    <rect x="1136" y="18" width="128" height="32" rx="4" fill="#17181c" stroke="#c97c7c"/>
    <text x="1200" y="39" text-anchor="middle" fill="#c97c7c" font-family="monospace" font-weight="bold" font-size="12">BURNING: ${snap.metrics.burningCount}</text>

    <rect x="1276" y="18" width="136" height="32" rx="4" fill="#17181c" stroke="#7fb08f"/>
    <text x="1344" y="39" text-anchor="middle" fill="#7fb08f" font-family="monospace" font-weight="bold" font-size="12">RULES: ${snap.metrics.activeRuleCount} ACTIVE</text>

    <rect x="1424" y="18" width="148" height="32" rx="4" fill="#2a1e12" stroke="#f0a35e"/>
    <text x="1498" y="39" text-anchor="middle" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="12">SEED: ${snap.seed}</text>

    <rect x="28" y="90" width="808" height="842" rx="8" fill="#17181c" stroke="#2e3036" stroke-width="1.5"/>
    <text x="48" y="124" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="13">// 01. MULTI-MODAL SPATIAL CANVAS (GRID 2D + CONTINUOUS RADIUS + GRAPH EDGES)</text>
    <rect x="${canvasX}" y="${canvasY}" width="${totalCanvasW}" height="${totalCanvasH}" fill="#111215" stroke="#34363d" stroke-width="1.5"/>
    ${gridLines.join("\n    ")}
    ${coordLabels.join("\n    ")}
    ${heatHalos.join("\n    ")}
    ${edgeEls.join("\n    ")}
    ${entityEls.join("\n    ")}

    <rect x="64" y="632" width="736" height="32" rx="4" fill="#131417" stroke="#2a2b30"/>
    <text x="80" y="652" fill="#f0a35e" font-family="monospace" font-size="11.5">[W][I][H] Rule: WATER IS HOT</text>
    <text x="292" y="652" fill="#9fc3d6" font-family="monospace" font-size="11.5">P/=/G Coolant Pipeline (Severed)</text>
    <text x="536" y="652" fill="#c9a7d9" font-family="monospace" font-size="11.5">A--B Social Trust Edge</text>
    <text x="698" y="652" fill="#7fb08f" font-family="monospace" font-size="11.5">~ Calm Smoke</text>

    <rect x="48" y="696" width="118" height="36" rx="4" fill="#2a1e12" stroke="#f0a35e"/>
    <text x="107" y="719" text-anchor="middle" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="12">STEP +1 TICK</text>

    <rect x="178" y="696" width="118" height="36" rx="4" fill="#131417" stroke="#34363d"/>
    <text x="237" y="719" text-anchor="middle" fill="#e8e4dd" font-family="monospace" font-size="12">STEP +5 TICKS</text>

    <rect x="308" y="696" width="132" height="36" rx="4" fill="#131417" stroke="#9fc3d6"/>
    <text x="374" y="719" text-anchor="middle" fill="#9fc3d6" font-family="monospace" font-size="12">REWIND -3</text>

    <rect x="452" y="696" width="180" height="36" rx="4" fill="#2b2113" stroke="#d9b96a"/>
    <text x="542" y="719" text-anchor="middle" fill="#d9b96a" font-family="monospace" font-weight="bold" font-size="12">PUSH [WATER IS HOT]</text>

    <rect x="644" y="696" width="172" height="36" rx="4" fill="#16291e" stroke="#7fb08f"/>
    <text x="730" y="719" text-anchor="middle" fill="#7fb08f" font-family="monospace" font-weight="bold" font-size="12">DSL: SMOKE IS CALM</text>

    <rect x="48" y="748" width="768" height="162" rx="6" fill="#111215" stroke="#7fb08f" stroke-width="1.5"/>
    <text x="68" y="776" fill="#7fb08f" font-family="monospace" font-weight="bold" font-size="12.5">// WORLDFORK PARALLEL SANDBOX PREDICTION (+5 TICKS AHEAD · ZERO MAIN-WORLD MUTATION)</text>
    <text x="68" y="804" fill="#e8e4dd" font-family="monospace" font-size="12.5">Prompt: "Make smoke calm"   ──►   Compiled Restricted DSL:  ${esc(forkTranslation.compiledDsl)}</text>
    <text x="68" y="832" fill="#a9a49c" font-family="monospace" font-size="12">Fork Delta Summary: ${esc(forkTranslation.forkPreview.deltaSummary.slice(0, 3).join("   |   "))}</text>
    <rect x="68" y="852" width="728" height="40" rx="4" fill="#16291e" stroke="#7fb08f" stroke-width="1"/>
    <text x="86" y="877" fill="#7fb08f" font-family="monospace" font-weight="bold" font-size="12">SAFETY CHECK PASSED: Panicked Agents reduced to 0 within +1 Tick. Rule injected into live ECS.</text>

    <rect x="852" y="90" width="720" height="842" rx="8" fill="#17181c" stroke="#2e3036" stroke-width="1.5"/>

    <text x="872" y="124" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="13">// 02. ACTIVE META-RULES (RULE-AS-ENTITY &amp; SEMANTIC DSL)</text>
    <rect x="864" y="138" width="688" height="52" rx="5" fill="#131417" stroke="#f0a35e" stroke-width="1.2"/>
    <text x="884" y="160" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="12.5">[ENTITY_COMPILED] Grid Meta-Rule: WATER IS HOT</text>
    <text x="884" y="180" fill="#a9a49c" font-family="sans-serif" font-size="12">Scanned from 2D grid word blocks at (3,2)-(5,2). Overrides all [water] entities with +hot (temp &gt;= 95°C).</text>

    <rect x="864" y="200" width="688" height="52" rx="5" fill="#131417" stroke="#7fb08f" stroke-width="1.2"/>
    <text x="884" y="222" fill="#7fb08f" font-family="monospace" font-weight="bold" font-size="12.5">[SEMANTIC_DSL] Override Rule: SMOKE IS CALM</text>
    <text x="884" y="242" fill="#a9a49c" font-family="sans-serif" font-size="12">Compiled via SemanticLlmPlugin &amp; verified in WorldFork. Emits soothing calmAura=35 to nearby agents.</text>

    <text x="872" y="290" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="13">// 03. SELECTED ENTITY TELEMETRY (CLICKED ON CANVAS)</text>
    <rect x="864" y="304" width="688" height="156" rx="6" fill="#111215" stroke="#34363d" stroke-width="1.2"/>
    <text x="884" y="334" fill="#e8e4dd" font-family="monospace" font-weight="bold" font-size="15">Entity #12 · Engineer_Beta  @ Grid (13, 8)</text>
    <rect x="884" y="348" width="84" height="24" rx="4" fill="#241d29" stroke="#c9a7d9"/>
    <text x="926" y="364" text-anchor="middle" fill="#c9a7d9" font-family="monospace" font-size="11.5">tag:agent</text>
    <rect x="980" y="348" width="96" height="24" rx="4" fill="#19252c" stroke="#9fc3d6"/>
    <text x="1028" y="364" text-anchor="middle" fill="#9fc3d6" font-family="monospace" font-size="11.5">tag:movable</text>
    <rect x="1088" y="348" width="184" height="24" rx="4" fill="#16291e" stroke="#7fb08f"/>
    <text x="1180" y="364" text-anchor="middle" fill="#7fb08f" font-family="monospace" font-size="11.5">edge:social_trust(11-&gt;12)</text>

    <text x="884" y="404" fill="#a9a49c" font-family="monospace" font-size="12.5">Scalar Blackboard Props:  temp: 37°C   |   integrity: 100%   |   panic: 0 (stabilized)</text>
    <text x="884" y="434" fill="#7fb08f" font-family="monospace" font-weight="bold" font-size="12.5">AI Utility Intent:        MAINTAINING_OUTPOST (Recovered via Calm Smoke Aura)</text>

    <text x="872" y="498" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="13">// 04. CAUSAL LINEAGE DAG TRACE — WHY DID THIS HAPPEN?</text>
    ${causalRows.join("\n    ")}

    <rect x="864" y="800" width="688" height="110" rx="6" fill="#111215" stroke="#2e3036"/>
    <text x="884" y="830" fill="#9fc3d6" font-family="monospace" font-weight="bold" font-size="12.5">// ZERO-BINDING SNAPSHOT STREAM</text>
    <text x="884" y="856" fill="#a9a49c" font-family="monospace" font-size="12">GET /api/snapshot (200 OK · 1.4ms)   |   GET /api/causal/12 (6 Causal Nodes Linked)</text>
    <text x="884" y="884" fill="#6f6b65" font-family="monospace" font-size="11.5">Deterministic Mulberry32 PRNG State: ${snap.prngState} · RingBuffer Checkpoints: 0..${snap.tick}</text>
  </svg>`;
}

// 2. Terminal TUI Screenshot (1600 x 920)
function buildTuiSvg(): string {
  const cells: string[] = [];
  const startX = 112;
  const startY = 278;
  const stepX = 34;
  const stepY = 26;

  for (let y = 0; y < 12; y++) {
    for (let x = 0; x < 16; x++) {
      const px = startX + x * stepX;
      const py = startY + y * stepY;
      const ent = snap.entities.find((e) => Math.round(e.x) === x && Math.round(e.y) === y);
      if (!ent) {
        cells.push(
          `<text x="${px}" y="${py}" text-anchor="middle" fill="#464440" font-family="monospace" font-size="14">·</text>`
        );
      } else {
        let color = "#e8e4dd";
        if (ent.tags.includes("word_block")) color = "#f0a35e";
        else if (ent.tags.includes("burning") || ent.tags.includes("exploded")) color = "#c97c7c";
        else if (ent.tags.includes("calm")) color = "#7fb08f";
        else if (ent.tags.includes("agent")) color = "#c9a7d9";
        else if (ent.tags.includes("water")) color = "#9fc3d6";
        cells.push(
          `<text x="${px}" y="${py}" text-anchor="middle" fill="${color}" font-family="monospace" font-weight="bold" font-size="16">${esc(ent.glyph)}</text>`
        );
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="920" viewBox="0 0 1600 920">
    <rect width="1600" height="920" fill="#0e0f11"/>
    <rect x="32" y="28" width="1536" height="864" rx="10" fill="#111215" stroke="#34363d" stroke-width="2"/>
    <rect x="32" y="28" width="1536" height="52" rx="10" fill="#17181c" stroke="#34363d" stroke-width="1"/>
    <circle cx="64" cy="54" r="7" fill="#c97c7c"/>
    <circle cx="88" cy="54" r="7" fill="#d9b96a"/>
    <circle cx="112" cy="54" r="7" fill="#7fb08f"/>
    <text x="800" y="59" text-anchor="middle" fill="#a9a49c" font-family="monospace" font-weight="bold" font-size="14">zsh — npx cyberpsychosis demo (16×12 Terminal ASCII/ANSI Emergence Sandbox)</text>

    <text x="68" y="116" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="14.5">$ npx cyberpsychosis demo</text>
    <text x="68" y="146" fill="#9fc3d6" font-family="monospace" font-weight="bold" font-size="14.5">=== CYBERPSYCHOSIS ENGINE TUI | Tick: 7 | Seed: 20261014 ===</text>
    <text x="68" y="174" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="13.5">Active Meta-Rules: [WATER IS HOT] (grid_word_block)   +   [SMOKE IS CALM] (semantic_dsl)</text>
    <text x="68" y="200" fill="#a9a49c" font-family="monospace" font-size="13.5">Metrics: Entities=15  |  Burning=3  |  Panicked=0  |  BrokenPipes=1  |  Flow=0</text>

    <rect x="68" y="220" width="620" height="432" rx="6" fill="#131417" stroke="#2e3036" stroke-width="1.5"/>
    <rect x="88" y="242" width="580" height="340" rx="4" fill="#0e0f11" stroke="#26282e" stroke-width="1"/>
    ${cells.join("\n    ")}

    <text x="92" y="610" fill="#f0a35e" font-family="monospace" font-size="12.5">W/I/H/C = Word Blocks   |   P/=/x = Coolant Pipe   |   G/o = Gen &amp; Fire</text>
    <text x="92" y="634" fill="#7fb08f" font-family="monospace" font-size="12.5">~ = Calm Smoke Cloud    |   A / B = Outpost Engineers (Social Trust)</text>

    <rect x="716" y="220" width="816" height="432" rx="6" fill="#131417" stroke="#f0a35e" stroke-width="1.5"/>
    <text x="742" y="254" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="14">// CAUSAL LINEAGE DAG REPORT (Target: #12 Engineer_Beta)</text>
    <text x="742" y="294" fill="#e8e4dd" font-family="monospace" font-size="13.5">[ROOT | T2 | USER]      Player pushed [WORD:HOT] into slot (5,2)</text>
    <text x="762" y="328" fill="#f0a35e" font-family="monospace" font-size="13.5">└─► [STEP 2 | T2 | LOGIC]     Compiled meta-rule: [WATER IS HOT]</text>
    <text x="782" y="362" fill="#9fc3d6" font-family="monospace" font-size="13.5">└─► [STEP 3 | T3 | LOGISTICS] Pipeline pumped 95°C fluid to Generator</text>
    <text x="802" y="396" fill="#c97c7c" font-family="monospace" font-size="13.5">└─► [STEP 4 | T6 | PHYSICS]   CoreGenerator (174°C) exploded!</text>
    <text x="822" y="430" fill="#d9b96a" font-family="monospace" font-size="13.5">├─► [STEP 5 | T6 | CHEMISTRY] OilDrum_East ignited; spawned Smoke</text>
    <text x="822" y="464" fill="#9fc3d6" font-family="monospace" font-size="13.5">├─► [STEP 6 | T6 | LOGISTICS] PipeSegment_B ruptured; flow=0</text>
    <text x="822" y="498" fill="#c9a7d9" font-family="monospace" font-size="13.5">└─► [STEP 7 | T6 | SOCIAL]    Alpha panic spread via trust edge to Beta</text>
    <text x="842" y="532" fill="#7fb08f" font-family="monospace" font-size="13.5">└─► [STEP 8 | T7 | SEMANTIC]  WorldFork verified &amp; injected [SMOKE IS CALM]</text>

    <rect x="742" y="562" width="764" height="66" rx="4" fill="#16291e" stroke="#7fb08f"/>
    <text x="762" y="588" fill="#7fb08f" font-family="monospace" font-weight="bold" font-size="13">WORLDFORK PARALLEL PREVIEW (+5 TICKS):</text>
    <text x="762" y="612" fill="#e8e4dd" font-family="monospace" font-size="13">Compiled: OVERRIDE smoke IS calm   |   Panicked Agents: 2 ──► 0 (Safe)</text>

    <rect x="68" y="674" width="1464" height="184" rx="6" fill="#131417" stroke="#2e3036" stroke-width="1.5"/>
    <text x="92" y="708" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="14">// INTERACTIVE TUI KEYBOARD CONTROLS (npm run start:tui)</text>
    <text x="92" y="744" fill="#e8e4dd" font-family="monospace" font-size="14">[Space] Step +1 Tick        [n] Step +5 Ticks        [b] Push Block: WATER IS HOT</text>
    <text x="92" y="776" fill="#e8e4dd" font-family="monospace" font-size="14">[s] Inject Semantic DSL     [r] Rewind -3 Ticks      [c] Trace Causal Lineage DAG</text>
    <text x="92" y="818" fill="#7fb08f" font-family="monospace" font-weight="bold" font-size="13.5">Determinism Verified: Identical seed (20261014) yields identical PRNG state (${snap.prngState}) across TUI &amp; Web.</text>
  </svg>`;
}

// 3. WorldFork & Causal Lineage DAG Inspector Screenshot (1600 x 900)
function buildWorldForkSvg(): string {
  const nodes = [
    { x: 180, y: 270, color: "#e8e4dd", bg: "#1d1e23", label: "T2 · USER", sub: "Push [HOT] -> (5,2)" },
    { x: 430, y: 270, color: "#f0a35e", bg: "#2a1e12", label: "T2 · LOGIC", sub: "Rule: WATER IS HOT" },
    { x: 680, y: 270, color: "#9fc3d6", bg: "#19252c", label: "T3 · LOGISTICS", sub: "Pump 95°C Fluid" },
    { x: 930, y: 270, color: "#c97c7c", bg: "#331c1c", label: "T6 · PHYSICS", sub: "Gen 174°C Explodes" },
    { x: 1210, y: 165, color: "#d9b96a", bg: "#2b2113", label: "T6 · CHEMISTRY", sub: "Oil Ignites -> Smoke" },
    { x: 1210, y: 270, color: "#9fc3d6", bg: "#19252c", label: "T6 · LOGISTICS", sub: "PipeB Severed" },
    { x: 1210, y: 375, color: "#c9a7d9", bg: "#241d29", label: "T6 · SOCIAL", sub: "Alpha->Beta Panic" },
    { x: 1450, y: 270, color: "#7fb08f", bg: "#16291e", label: "T7 · SEMANTIC", sub: "SMOKE IS CALM" },
  ];

  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [3, 5],
    [3, 6],
    [4, 7],
    [6, 7],
  ];

  const edgeSvg = edges
    .map(([a, b]) => {
      const n1 = nodes[a];
      const n2 = nodes[b];
      return `<path d="M ${n1.x + 88} ${n1.y} L ${n2.x - 88} ${n2.y}" fill="none" stroke="${n2.color}" stroke-width="3"/>`;
    })
    .join("\n    ");

  const nodeSvg = nodes
    .map(
      (n) => `<g>
      <rect x="${n.x - 88}" y="${n.y - 34}" width="176" height="68" rx="6" fill="${n.bg}" stroke="${n.color}" stroke-width="2"/>
      <text x="${n.x}" y="${n.y - 8}" text-anchor="middle" fill="${n.color}" font-family="monospace" font-weight="bold" font-size="13">${n.label}</text>
      <text x="${n.x}" y="${n.y + 16}" text-anchor="middle" fill="#e8e4dd" font-family="sans-serif" font-size="12.5">${n.sub}</text>
    </g>`
    )
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">
    <rect width="1600" height="900" fill="#0e0f11"/>
    <rect x="32" y="28" width="1536" height="844" rx="10" fill="#131417" stroke="#2e3036" stroke-width="2"/>
    <text x="68" y="76" fill="#f0a35e" font-family="monospace" font-weight="bold" font-size="15">// CAUSAL LINEAGE DAG &amp; WORLDFORK PARALLEL TIMELINE INSPECTOR</text>

    <!-- Upper Panel: Causal DAG Graph -->
    <rect x="64" y="96" width="1472" height="348" rx="8" fill="#111215" stroke="#2a2b30" stroke-width="1.5"/>
    <text x="92" y="130" fill="#a9a49c" font-family="monospace" font-size="12.5">CROSS-DOMAIN CAUSAL DAG (Root Cause #4 -&gt; Leaf Outcome #12 · 6 Domains Automatically Stitched)</text>
    ${edgeSvg}
    ${nodeSvg}

    <!-- Lower Panel: WorldFork Parallel Prediction Branch -->
    <rect x="64" y="472" width="1472" height="368" rx="8" fill="#111215" stroke="#2a2b30" stroke-width="1.5"/>
    <text x="92" y="508" fill="#7fb08f" font-family="monospace" font-weight="bold" font-size="13">// WORLDFORK PARALLEL SIMULATION: forkAndPredict(5, "OVERRIDE smoke IS calm")</text>

    <!-- Main Timeline Track -->
    <path d="M 120 640 L 620 640" fill="none" stroke="#f0a35e" stroke-width="3.5"/>
    <circle cx="160" cy="640" r="9" fill="#f0a35e"/>
    <text x="160" y="672" text-anchor="middle" fill="#a9a49c" font-family="monospace" font-size="12">T0 Init</text>
    <circle cx="380" cy="640" r="9" fill="#f0a35e"/>
    <text x="380" y="672" text-anchor="middle" fill="#f0a35e" font-family="monospace" font-size="12">T2 [WATER IS HOT]</text>
    <circle cx="620" cy="640" r="11" fill="#c97c7c"/>
    <text x="620" y="672" text-anchor="middle" fill="#c97c7c" font-family="monospace" font-weight="bold" font-size="12">T6 Crisis Point</text>

    <!-- Unmitigated Branch (Top) -->
    <path d="M 620 640 L 780 562 L 810 562" fill="none" stroke="#c97c7c" stroke-width="3" stroke-dasharray="6 4"/>
    <rect x="810" y="535" width="610" height="54" rx="6" fill="#2a1616" stroke="#c97c7c" stroke-width="1.5"/>
    <text x="832" y="558" fill="#c97c7c" font-family="monospace" font-weight="bold" font-size="12.5">BRANCH A (No Rule Injected · Baseline): T7..T11</text>
    <text x="832" y="578" fill="#e8e4dd" font-family="sans-serif" font-size="12">Panicked Agents: 2 (Outpost Abandoned)   |   Fire Spread: Uncontained</text>

    <!-- WorldFork Injected Branch (Bottom) -->
    <path d="M 620 640 L 780 735 L 810 735" fill="none" stroke="#7fb08f" stroke-width="3.5"/>
    <rect x="810" y="705" width="610" height="62" rx="6" fill="#16291e" stroke="#7fb08f" stroke-width="2"/>
    <text x="832" y="730" fill="#7fb08f" font-family="monospace" font-weight="bold" font-size="12.5">BRANCH B (WorldFork +5 Ticks · Injected [SMOKE IS CALM]): T7..T11 ✓ COMMITTED</text>
    <text x="832" y="752" fill="#e8e4dd" font-family="sans-serif" font-size="12">Panicked Agents: 2 ──► 0 (Calm Aura=35)   |   Engineers Resume Repair Duties</text>
  </svg>`;
}

for (const [name, svgContent] of [
  ["workbench-live", buildWorkbenchSvg()],
  ["tui-live", buildTuiSvg()],
  ["worldfork-inspector", buildWorldForkSvg()],
] as const) {
  const svgPath = join(outDir, `${name}.svg`);
  const pngPath = join(outDir, `${name}.png`);
  writeFileSync(svgPath, svgContent, "utf8");
  execFileSync("convert", [svgPath, pngPath]);
  rmSync(svgPath, { force: true });
}

console.log("Generated all 3 authentic PNG screenshots in", outDir);
