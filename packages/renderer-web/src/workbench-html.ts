export function getWorkbenchHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cyberpsychosis Engine — Visual Workbench & Causal Inspector</title>
  <style>
    :root {
      --bg: #0f172a;
      --panel: #1e293b;
      --border: #334155;
      --text: #f8fafc;
      --muted: #94a3b8;
      --accent: #38bdf8;
      --danger: #ef4444;
      --success: #22c55e;
      --warn: #f59e0b;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      background: var(--bg);
      color: var(--text);
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    header {
      padding: 12px 20px;
      background: #020617;
      border-bottom: 1px solid var(--border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    header h1 {
      margin: 0;
      font-size: 16px;
      color: var(--accent);
    }
    .metrics-bar {
      display: flex;
      gap: 16px;
      font-size: 13px;
    }
    .metric-pill {
      background: var(--panel);
      padding: 4px 10px;
      border-radius: 6px;
      border: 1px solid var(--border);
    }
    main {
      display: grid;
      grid-template-columns: 600px 1fr;
      gap: 16px;
      padding: 16px;
      flex: 1;
    }
    .card {
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .card h2 {
      margin: 0;
      font-size: 14px;
      color: var(--accent);
      border-bottom: 1px solid var(--border);
      padding-bottom: 6px;
    }
    canvas {
      background: #090d16;
      border: 1px solid var(--border);
      border-radius: 6px;
      cursor: pointer;
      width: 568px;
      height: 426px;
    }
    .controls-row {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
    }
    button {
      background: #0f172a;
      color: var(--text);
      border: 1px solid var(--accent);
      border-radius: 5px;
      padding: 6px 12px;
      font-family: inherit;
      font-size: 12px;
      cursor: pointer;
    }
    button:hover {
      background: var(--accent);
      color: #020617;
    }
    button.warn { border-color: var(--warn); color: var(--warn); }
    button.warn:hover { background: var(--warn); color: #020617; }
    button.success { border-color: var(--success); color: var(--success); }
    button.success:hover { background: var(--success); color: #020617; }
    input[type="text"] {
      flex: 1;
      background: #090d16;
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 5px;
      padding: 6px 10px;
      font-family: inherit;
      font-size: 12px;
    }
    .rules-list, .causal-list, .entity-detail {
      font-size: 12px;
      line-height: 1.5;
      max-height: 210px;
      overflow-y: auto;
      background: #090d16;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid var(--border);
    }
    .badge {
      display: inline-block;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 11px;
      margin-right: 6px;
      background: #334155;
    }
    .right-col {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
  </style>
</head>
<body>
  <header>
    <h1>CYBERPSYCHOSIS WORKBENCH — Micro Outpost (16x12 Multi-Modal Sandbox)</h1>
    <div class="metrics-bar" id="metricsBar"></div>
  </header>
  <main>
    <div class="card">
      <h2>2D Multi-Layer Canvas (Click any entity to inspect & trace Causal DAG)</h2>
      <canvas id="worldCanvas" width="568" height="426"></canvas>
      <div class="controls-row">
        <button onclick="stepSim(1)">Step +1 Tick</button>
        <button onclick="stepSim(5)">Step +5 Ticks</button>
        <button id="playBtn" onclick="togglePlay()">Auto-Play</button>
        <button onclick="rewindDelta(-1)">Rewind -1</button>
        <button onclick="rewindDelta(-3)">Rewind -3</button>
        <button onclick="resetSim()">Reset World</button>
      </div>
      <div class="controls-row">
        <button class="warn" onclick="triggerWaterIsHot()">Push Baba Block: [WATER IS HOT]</button>
        <button class="success" onclick="quickSemantic('Make smoke calm')">Semantic DSL: "Make smoke calm"</button>
        <button onclick="quickSemantic('Make water cool')">Semantic DSL: "Make water cool"</button>
        <button onclick="shareReplayUrl()">Share Story Link (?replay=...)</button>
        <button onclick="exportBundleJson()">Export WorldBundle JSON</button>
      </div>
      <div class="controls-row">
        <select id="prefabBrush" style="background:#090d16;color:var(--text);border:1px solid var(--border);border-radius:5px;padding:6px;font-family:inherit;font-size:12px;">
          <option value="">[Select Mode: Click Entity to Inspect]</option>
          <option value="oil_barrel">Brush: Spawn OilDrum (o)</option>
          <option value="cargo_crate">Brush: Spawn Rigid Crate (#)</option>
          <option value="water_pump">Brush: Spawn CoolantPump (P)</option>
          <option value="smoke">Brush: Spawn SmokeCloud (~)</option>
          <option value="agent">Brush: Spawn Engineer (@)</option>
        </select>
        <input id="dslInput" type="text" placeholder="Enter Natural Language or Restricted DSL (e.g. 'Make smoke calm' or 'OVERRIDE water IS cool')" />
        <button class="success" onclick="submitCustomDsl()">WorldFork Preview & Inject</button>
      </div>
      <div class="controls-row" style="font-size:11px;color:var(--muted);">
        <span>Visual Rule Builder:</span>
        <select id="rbSub" style="background:#090d16;color:var(--text);border:1px solid var(--border);padding:3px;"><option>smoke</option><option>water</option><option>agent</option><option>oil</option></select>
        <span>WHEN adjacent TO</span>
        <select id="rbTarget" style="background:#090d16;color:var(--text);border:1px solid var(--border);padding:3px;"><option>agent</option><option>broken</option><option>burning</option><option>generator</option></select>
        <span>DO</span>
        <select id="rbAct" style="background:#090d16;color:var(--text);border:1px solid var(--border);padding:3px;">
          <option value="add_prop(target.panic, -40)">add_prop(target.panic, -40)</option>
          <option value="set_prop(target.integrity, 100); remove_tag(target, broken)">repair target structure</option>
          <option value="set_prop(target.temp, 18); remove_tag(target, burning)">cool & extinguish target</option>
        </select>
        <button onclick="buildAndInjectVisualRule()">Compile & Fork-Verify</button>
      </div>
      <div id="forkPreviewBox" class="rules-list" style="display:none;"></div>
    </div>

    <div class="right-col">
      <div class="card">
        <h2>Active Meta-Rules (Rule-as-Entity & Semantic DSL)</h2>
        <div id="activeRulesBox" class="rules-list"></div>
      </div>

      <div class="card">
        <h2>Selected Entity Telemetry</h2>
        <div id="entityDetailBox" class="entity-detail">Click an entity on the canvas to inspect its tags, properties, and causal history.</div>
      </div>

      <div class="card">
        <h2>Causal Lineage DAG Trace (Why did this happen?)</h2>
        <div id="causalLineageBox" class="causal-list"></div>
      </div>

      <div class="card">
        <h2>Recent Cross-Domain Event Bus Stream</h2>
        <div id="recentEventsBox" class="causal-list"></div>
      </div>
    </div>
  </main>

  <script>
    let currentSnapshot = null;
    let selectedEntityId = 12; // Default to Engineer_Beta
    let autoPlayTimer = null;

    const canvas = document.getElementById("worldCanvas");
    const ctx = canvas.getContext("2d");

    async function api(path, method = "GET", body = null) {
      const res = await fetch(path, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      return res.json();
    }

    async function refresh() {
      const data = await api("/api/snapshot");
      currentSnapshot = data.snapshot;
      renderAll();
      if (selectedEntityId) {
        await loadCausalTrace(selectedEntityId);
      }
    }

    async function stepSim(count) {
      const data = await api("/api/step", "POST", { count });
      currentSnapshot = data.snapshot;
      renderAll();
      await loadCausalTrace(selectedEntityId);
    }

    async function rewindDelta(delta) {
      if (!currentSnapshot) return;
      const targetTick = Math.max(0, currentSnapshot.tick + delta);
      const data = await api("/api/rewind", "POST", { tick: targetTick });
      currentSnapshot = data.snapshot;
      renderAll();
      await loadCausalTrace(selectedEntityId);
    }

    async function resetSim() {
      const data = await api("/api/reset", "POST", {});
      currentSnapshot = data.snapshot;
      document.getElementById("forkPreviewBox").style.display = "none";
      renderAll();
      await loadCausalTrace(selectedEntityId);
    }

    async function triggerWaterIsHot() {
      const data = await api("/api/push-word", "POST", { preset: "WATER_IS_HOT" });
      currentSnapshot = data.snapshot;
      renderAll();
      await loadCausalTrace(selectedEntityId);
    }

    async function quickSemantic(prompt) {
      document.getElementById("dslInput").value = prompt;
      await submitCustomDsl();
    }

    async function buildAndInjectVisualRule() {
      const sub = document.getElementById("rbSub").value;
      const target = document.getElementById("rbTarget").value;
      const act = document.getElementById("rbAct").value;
      const dsl = "RULE visual_" + sub + "_" + target + " WHEN adjacent(" + sub + ", " + target + ") DO " + act;
      document.getElementById("dslInput").value = dsl;
      await submitCustomDsl();
    }

    async function shareReplayUrl() {
      const data = await api("/api/replay-tape");
      const url = window.location.origin + "/?replay=" + data.encoded;
      const box = document.getElementById("forkPreviewBox");
      box.style.display = "block";
      box.innerHTML = "<strong>Deterministic Story Replay Tape Ready:</strong><br/>" +
        "StateHash: <code>" + data.tape.expectedStateHash + "</code> | Commands: " + data.tape.commands.length + "<br/>" +
        "Share URL: <code>" + url + "</code>";
      if (navigator.clipboard) navigator.clipboard.writeText(url);
    }

    async function exportBundleJson() {
      const data = await api("/api/world-bundle");
      const box = document.getElementById("forkPreviewBox");
      box.style.display = "block";
      box.innerHTML = "<strong>Declarative WorldBundle JSON (Hot-Reloadable):</strong><br/>" +
        "<code>" + JSON.stringify(data.bundle).slice(0, 360) + "...</code>";
    }

    async function submitCustomDsl() {
      const input = document.getElementById("dslInput").value.trim();
      if (!input) return;
      const data = await api("/api/inject-dsl", "POST", { input, previewTicks: 5 });
      if (data.error) {
        alert(data.error);
        return;
      }
      currentSnapshot = data.snapshot;
      const box = document.getElementById("forkPreviewBox");
      box.style.display = "block";
      box.innerHTML = "<strong>WorldFork Parallel Prediction (5 Ticks Ahead):</strong><br/>" +
        "Compiled DSL: <code>" + data.translation.compiledDsl + "</code><br/>" +
        data.translation.forkPreview.deltaSummary.join(" | ");
      renderAll();
      await loadCausalTrace(selectedEntityId);
    }

    function togglePlay() {
      const btn = document.getElementById("playBtn");
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        btn.textContent = "Auto-Play";
      } else {
        autoPlayTimer = setInterval(() => stepSim(1), 650);
        btn.textContent = "Pause";
      }
    }

    async function loadCausalTrace(targetId) {
      const data = await api("/api/causal/" + encodeURIComponent(targetId));
      const box = document.getElementById("causalLineageBox");
      if (!data.report || !data.report.chain || data.report.chain.length === 0) {
        box.innerHTML = "<em>No causal events recorded for #" + targetId + " yet.</em>";
        return;
      }
      box.innerHTML = data.report.chain.map((node, idx) =>
        "<div><span class='badge'>" + (idx === 0 ? "ROOT" : "STEP " + (idx + 1)) +
        " | T" + node.tick + " | " + node.domain.toUpperCase() + "</span> " +
        node.summary + "</div>"
      ).join("");
    }

    function renderAll() {
      if (!currentSnapshot) return;
      const m = currentSnapshot.metrics;
      document.getElementById("metricsBar").innerHTML =
        "<span class='metric-pill'>Tick: <b>" + currentSnapshot.tick + "</b></span>" +
        "<span class='metric-pill'>Hash: <code>" + (currentSnapshot.stateHash || "") + "</code></span>" +
        "<span class='metric-pill'>Entities: <b>" + m.entityCount + "</b></span>" +
        "<span class='metric-pill'>Burning: <b style='color:#ef4444'>" + m.burningCount + "</b></span>" +
        "<span class='metric-pill'>Panicked NPCs: <b style='color:#f43f5e'>" + m.panickedAgentCount + "</b></span>" +
        "<span class='metric-pill'>Broken Pipes: <b style='color:#f59e0b'>" + m.brokenPipeCount + "</b></span>" +
        "<span class='metric-pill'>Flow: <b style='color:#38bdf8'>" + m.logisticsThroughput + "</b></span>";

      document.getElementById("activeRulesBox").innerHTML =
        currentSnapshot.activeRules.map(r =>
          "<div><span class='badge'>" + r.source + "</span><b>" + r.name + "</b> — " + r.description + "</div>"
        ).join("") || "<em>No active rules</em>";

      document.getElementById("recentEventsBox").innerHTML =
        currentSnapshot.recentEvents.slice().reverse().map(ev =>
          "<div><span class='badge'>T" + ev.tick + " " + ev.domain.toUpperCase() + "</span>" + ev.summary + "</div>"
        ).join("") || "<em>No events</em>";

      const sel = currentSnapshot.entities.find(e => e.id === selectedEntityId);
      if (sel) {
        document.getElementById("entityDetailBox").innerHTML =
          "<b>#" + sel.id + " " + sel.name + "</b> @ (" + sel.x + ", " + sel.y + ")<br/>" +
          "Tags: " + sel.tags.map(t => "<span class='badge'>" + t + "</span>").join("") + "<br/>" +
          "Props: <code>" + JSON.stringify(sel.props) + "</code>";
      }

      drawCanvas();
    }

    function drawCanvas() {
      const { width, height } = currentSnapshot.grid;
      const cellW = canvas.width / width;
      const cellH = canvas.height / height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Grid lines
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      for (let x = 0; x <= width; x++) {
        ctx.beginPath();
        ctx.moveTo(x * cellW, 0);
        ctx.lineTo(x * cellW, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * cellH);
        ctx.lineTo(canvas.width, y * cellH);
        ctx.stroke();
      }

      // 2. Graph topology edges (logistics pipes & social bonds)
      for (const edge of currentSnapshot.graphEdges) {
        const fromE = currentSnapshot.entities.find(e => e.id === edge.from);
        const toE = currentSnapshot.entities.find(e => e.id === edge.to);
        if (!fromE || !toE) continue;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo((fromE.x + 0.5) * cellW, (fromE.y + 0.5) * cellH);
        ctx.lineTo((toE.x + 0.5) * cellW, (toE.y + 0.5) * cellH);
        if (edge.kind === "pipe") {
          ctx.strokeStyle = edge.intact ? "#0284c7" : "#ef4444";
          ctx.lineWidth = 4;
          if (!edge.intact) ctx.setLineDash([4, 4]);
        } else {
          ctx.strokeStyle = "#a855f7";
          ctx.lineWidth = 2;
          ctx.setLineDash([3, 5]);
        }
        ctx.stroke();
        ctx.restore();
      }

      // 3. Entities
      for (const ent of currentSnapshot.entities) {
        const cx = (ent.x + 0.5) * cellW;
        const cy = (ent.y + 0.5) * cellH;

        // Thermal / status halo
        if (ent.tags.includes("burning")) {
          ctx.fillStyle = "rgba(239, 68, 68, 0.32)";
          ctx.fillRect(ent.x * cellW, ent.y * cellH, cellW, cellH);
        } else if (ent.tags.includes("calm")) {
          ctx.fillStyle = "rgba(34, 197, 94, 0.25)";
          ctx.fillRect(ent.x * cellW, ent.y * cellH, cellW, cellH);
        }

        ctx.fillStyle = ent.color || "#ffffff";
        ctx.beginPath();
        ctx.arc(cx, cy, Math.min(cellW, cellH) * 0.34, 0, Math.PI * 2);
        ctx.fill();

        if (ent.id === selectedEntityId) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 2;
          ctx.strokeRect(ent.x * cellW + 2, ent.y * cellH + 2, cellW - 4, cellH - 4);
        }

        ctx.fillStyle = "#020617";
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ent.glyph, cx, cy);
      }
    }

    canvas.addEventListener("click", async (ev) => {
      if (!currentSnapshot) return;
      const rect = canvas.getBoundingClientRect();
      const gx = Math.floor(((ev.clientX - rect.left) / canvas.width) * currentSnapshot.grid.width);
      const gy = Math.floor(((ev.clientY - rect.top) / canvas.height) * currentSnapshot.grid.height);
      const brush = document.getElementById("prefabBrush").value;
      if (brush) {
        const res = await api("/api/spawn", "POST", { prefabId: brush, x: gx, y: gy });
        currentSnapshot = res.snapshot;
        renderAll();
        return;
      }
      const hit = currentSnapshot.entities.find(e => Math.round(e.x) === gx && Math.round(e.y) === gy);
      if (hit) {
        selectedEntityId = hit.id;
        renderAll();
        await loadCausalTrace(selectedEntityId);
      }
    });

    (async function initWorkbench() {
      const params = new URLSearchParams(window.location.search);
      const replayParam = params.get("replay");
      if (replayParam) {
        const res = await api("/api/replay-tape", "POST", { encoded: replayParam });
        if (res.snapshot) {
          currentSnapshot = res.snapshot;
          renderAll();
          return;
        }
      }
      await refresh();
    })();
  </script>
</body>
</html>`;
}
