import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createOutpostSandbox } from "./index.js";

describe("@emergence/demo-minimal — Cross-Domain Emergent Cascade & Semantic Recovery", () => {
  it("runs stable outpost cooling under [WATER IS COOL], then cascades across all 6 domains when [WATER IS HOT] is pushed", () => {
    const sandbox = createOutpostSandbox(20261014);
    const { kernel, entities } = sandbox;

    // 1. Run 2 ticks under [WATER IS COOL] -> outpost remains stable, 0 fires, 0 panicked agents
    kernel.stepMany(2);
    const stableMetrics = kernel.computeMetrics();
    assert.equal(stableMetrics.burningCount, 0);
    assert.equal(stableMetrics.panickedAgentCount, 0);
    assert.equal(stableMetrics.brokenPipeCount, 0);

    // 2. Push word block [HOT] to form [WATER IS HOT] (Logic Emergence)
    const shifted = sandbox.triggerLogicShiftWaterIsHot();
    assert.equal(shifted, true);

    // 3. Advance 5 ticks -> scalding water pumps into generator (Logistics) -> generator & oil ignite (Chemistry)
    //    -> generator explodes & ruptures pipe (Physics) -> Engineer Alpha panics & infects Engineer Beta (Social)
    kernel.stepMany(5);
    const crisisMetrics = kernel.computeMetrics();

    assert.equal(crisisMetrics.burningCount >= 2, true, "Expected generator and oil drums to be burning");
    assert.equal(crisisMetrics.brokenPipeCount >= 1, true, "Expected explosion shockwave to rupture adjacent coolant pipe");
    assert.equal(crisisMetrics.panickedAgentCount, 2, "Expected both engineers to panic via hazard perception and social contagion");

    // 4. Verify Causal DAG traces Engineer Beta's panic all the way back to pushing the [WORD:HOT] block!
    const lineage = sandbox.traceCrisisLineage(entities.agentBetaId);
    assert.equal(lineage.chain.length >= 4, true);
    const domainsInChain = new Set(lineage.chain.map((n) => n.domain));
    assert.equal(domainsInChain.has("user"), true);
    assert.equal(domainsInChain.has("logic"), true);
    assert.equal(domainsInChain.has("social"), true);

    // 5. Semantic Emergence: inject natural language rule "Make smoke calm"
    //    First previews in a parallel WorldFork, then injects `OVERRIDE smoke IS calm`
    const semanticResult = sandbox.injectSemanticRule("Make smoke calm", 4);
    assert.equal(semanticResult.compiledDsl, "OVERRIDE smoke IS calm");
    assert.equal(semanticResult.forkPreview.safeToApply, true);

    // Advance 3 ticks so calming smoke soothes the panicked engineers
    kernel.stepMany(3);
    assert.equal(
      kernel.ecs.getProp(entities.agentAlphaId, "panic") < 35,
      true,
      "Expected soothing smoke to calm Engineer Alpha"
    );
  });
});
