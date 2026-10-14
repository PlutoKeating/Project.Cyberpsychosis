import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createOutpostSandbox } from "cyberpsychosis-demo";
import { renderCausalLineageToAscii, renderSnapshotToAscii } from "./index.js";

describe("cyberpsychosis-tui — Zero-Binding ASCII Snapshot & Causal DAG Renderer", () => {
  it("renders WorldSnapshot and CausalLineageReport into readable ASCII frames", () => {
    const sandbox = createOutpostSandbox(20261014);
    sandbox.triggerLogicShiftWaterIsHot();
    sandbox.kernel.stepMany(5);

    const frame = renderSnapshotToAscii(sandbox.kernel.getSnapshot(), { ansi: false });
    assert.equal(frame.includes("CYBERPSYCHOSIS ENGINE TUI"), true);
    assert.equal(frame.includes("WATER IS HOT"), true);
    assert.equal(frame.includes("CoreGenerator"), true);

    const lineageReport = sandbox.traceCrisisLineage(sandbox.entities.agentBetaId);
    const causalText = renderCausalLineageToAscii(lineageReport);
    assert.equal(causalText.includes("CAUSAL LINEAGE DAG TRACE"), true);
    assert.equal(causalText.includes("[ROOT]"), true);
  });
});
