#!/usr/bin/env node
import { createOutpostSandbox } from "cyberpsychosis-demo";
import { renderCausalLineageToAscii, renderSnapshotToAscii } from "cyberpsychosis-tui";
import { createWorkbenchServer } from "cyberpsychosis-web";

const args = process.argv.slice(2);
const cmd = args[0] ?? "demo";

if (cmd === "web") {
  const port = Number(process.env.CYBERPSYCHOSIS_WEB_PORT ?? 4173);
  const { server } = createWorkbenchServer();
  server.listen(port, () => {
    console.log(`Cyberpsychosis Engine Web Workbench listening on http://localhost:${port}`);
  });
} else {
  const sandbox = createOutpostSandbox(20261014);
  sandbox.kernel.stepMany(2);
  sandbox.triggerLogicShiftWaterIsHot();
  sandbox.kernel.stepMany(5);
  console.log(renderSnapshotToAscii(sandbox.kernel.getSnapshot(), { ansi: true }));
  console.log("");
  console.log(renderCausalLineageToAscii(sandbox.traceCrisisLineage(sandbox.entities.agentBetaId)));
}
