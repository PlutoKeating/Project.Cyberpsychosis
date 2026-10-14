#!/usr/bin/env node
import readline from "node:readline";
import { createOutpostSandbox } from "@emergence/demo-minimal";
import { renderCausalLineageToAscii, renderSnapshotToAscii } from "./index.js";

function runAutoDemo(): void {
  const sandbox = createOutpostSandbox(20261014);
  console.log(">>> STAGE 1: Initial Stable Micro Outpost ([WATER IS COOL])");
  sandbox.kernel.stepMany(2);
  console.log(renderSnapshotToAscii(sandbox.kernel.getSnapshot(), { ansi: true }));
  console.log("");

  console.log(">>> STAGE 2: Triggering Baba-Style Logic Shift -> Pushing [WORD:HOT] to form [WATER IS HOT]");
  sandbox.triggerLogicShiftWaterIsHot();
  sandbox.kernel.stepMany(5);
  console.log(renderSnapshotToAscii(sandbox.kernel.getSnapshot(), { ansi: true }));
  console.log("");

  console.log(">>> STAGE 3: Tracing Cross-Domain Causal Lineage DAG for Panicked Engineer Beta");
  const lineage = sandbox.traceCrisisLineage(sandbox.entities.agentBetaId);
  console.log(renderCausalLineageToAscii(lineage));
  console.log("");

  console.log('>>> STAGE 4: Semantic Emergence Bridge -> Injecting Natural Language Rule "Make smoke calm"');
  const translation = sandbox.injectSemanticRule("Make smoke calm", 4);
  console.log(`  Compiled Restricted DSL : ${translation.compiledDsl}`);
  console.log(`  WorldFork Safety Preview: ${translation.forkPreview.deltaSummary.join(" | ")}`);
  sandbox.kernel.stepMany(3);
  console.log(renderSnapshotToAscii(sandbox.kernel.getSnapshot(), { ansi: true }));
}

function runInteractiveTui(): void {
  const sandbox = createOutpostSandbox(20261014);
  let lastMessage = "Ready. Press [SPACE/ENTER]=Step 1, [n]=Step 5, [b]=Push WATER IS HOT, [s]=Semantic 'Make smoke calm', [r]=Rewind, [c]=Causal DAG, [q]=Quit";

  const redraw = (showCausal = false) => {
    console.clear();
    console.log(renderSnapshotToAscii(sandbox.kernel.getSnapshot(), { ansi: true }));
    if (showCausal) {
      console.log("");
      console.log(renderCausalLineageToAscii(sandbox.traceCrisisLineage()));
    }
    console.log(`\nStatus: ${lastMessage}`);
  };

  redraw();

  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  process.stdin.on("keypress", (_str, key) => {
    if (!key) return;
    if (key.name === "q" || (key.ctrl && key.name === "c")) {
      if (process.stdin.isTTY) process.stdin.setRawMode(false);
      process.exit(0);
    } else if (key.name === "space" || key.name === "return") {
      sandbox.kernel.step();
      lastMessage = `Advanced to Tick ${sandbox.kernel.tick}`;
      redraw();
    } else if (key.name === "n") {
      sandbox.kernel.stepMany(5);
      lastMessage = `Advanced 5 ticks to Tick ${sandbox.kernel.tick}`;
      redraw();
    } else if (key.name === "b") {
      const ok = sandbox.triggerLogicShiftWaterIsHot();
      lastMessage = ok
        ? "Pushed [WORD:HOT] into slot (5,2) -> Active rule recompiled to [WATER IS HOT]!"
        : "Rule [WATER IS HOT] already active.";
      redraw();
    } else if (key.name === "s") {
      const res = sandbox.injectSemanticRule("Make smoke calm", 4);
      lastMessage = `Injected Semantic DSL [${res.compiledDsl}] (WorldFork verified safe)`;
      redraw();
    } else if (key.name === "r") {
      const targetTick = Math.max(0, sandbox.kernel.tick - 3);
      const ok = sandbox.kernel.rewindTo(targetTick);
      lastMessage = ok ? `Time-traveled back to Tick ${targetTick}` : `Cannot rewind to Tick ${targetTick}`;
      redraw();
    } else if (key.name === "c") {
      lastMessage = "Showing full Causal Lineage DAG for current outpost state";
      redraw(true);
    }
  });
}

const args = process.argv.slice(2);
if (args.includes("--auto") || !process.stdin.isTTY) {
  runAutoDemo();
} else {
  runInteractiveTui();
}
