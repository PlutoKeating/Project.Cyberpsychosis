import assert from "node:assert/strict";
import { AddressInfo } from "node:net";
import { describe, it } from "node:test";
import { createWorkbenchServer } from "./server.js";

describe("cyberpsychosis-web — Workbench HTTP Server & REST Protocol", () => {
  it("serves workbench HTML, steps simulation, pushes word blocks, injects DSL with WorldFork preview, and traces Causal DAG", async () => {
    const { server } = createWorkbenchServer(20261014);
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
    const { port } = server.address() as AddressInfo;
    const baseUrl = `http://127.0.0.1:${port}`;

    try {
      // 1. Verify HTML Workbench page
      const htmlRes = await fetch(`${baseUrl}/`);
      assert.equal(htmlRes.status, 200);
      const html = await htmlRes.text();
      assert.equal(html.includes("CYBERPSYCHOSIS WORKBENCH"), true);

      // 2. Push word block [WATER IS HOT] and step 5 ticks
      const pushRes = await fetch(`${baseUrl}/api/push-word`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preset: "WATER_IS_HOT" }),
      });
      const pushJson = (await pushRes.json()) as { ok: boolean };
      assert.equal(pushJson.ok, true);

      const stepRes = await fetch(`${baseUrl}/api/step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 5 }),
      });
      const stepJson = (await stepRes.json()) as {
        snapshot: { tick: number; metrics: { panickedAgentCount: number } };
      };
      assert.equal(stepJson.snapshot.tick, 5);
      assert.equal(stepJson.snapshot.metrics.panickedAgentCount, 2);

      // 3. Query Causal DAG for Engineer Beta (#12)
      const causalRes = await fetch(`${baseUrl}/api/causal/12`);
      const causalJson = (await causalRes.json()) as {
        report: { chain: Array<{ domain: string }> };
      };
      assert.equal(causalJson.report.chain.length >= 4, true);

      // 4. Inject Semantic DSL ("Make smoke calm") & verify WorldFork preview
      const dslRes = await fetch(`${baseUrl}/api/inject-dsl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "Make smoke calm", previewTicks: 4 }),
      });
      const dslJson = (await dslRes.json()) as {
        translation: { compiledDsl: string; forkPreview: { safeToApply: boolean } };
      };
      assert.equal(dslJson.translation.compiledDsl, "OVERRIDE smoke IS calm");
      assert.equal(dslJson.translation.forkPreview.safeToApply, true);

      // 5. Rewind back to Tick 2
      const rewindRes = await fetch(`${baseUrl}/api/rewind`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tick: 2 }),
      });
      const rewindJson = (await rewindRes.json()) as {
        ok: boolean;
        snapshot: { tick: number };
      };
      assert.equal(rewindJson.ok, true);
      assert.equal(rewindJson.snapshot.tick, 2);
    } finally {
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });
});
