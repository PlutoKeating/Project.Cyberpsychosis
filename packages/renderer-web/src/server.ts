#!/usr/bin/env node
import http from "node:http";
import { fileURLToPath } from "node:url";
import { createOutpostSandbox, OutpostSandbox } from "cyberpsychosis-demo";
import { getWorkbenchHtml } from "./workbench-html.js";

function readJsonBody(req: http.IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8").trim();
      if (!raw) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(raw) as Record<string, unknown>);
      } catch (err) {
        reject(err);
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: http.ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

export function createWorkbenchServer(initialSeed = 20261014): {
  server: http.Server;
  getSandbox: () => OutpostSandbox;
} {
  let sandbox = createOutpostSandbox(initialSeed);

  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? "/", "http://localhost");

      if (req.method === "GET" && url.pathname === "/") {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(getWorkbenchHtml());
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/snapshot") {
        sendJson(res, 200, {
          snapshot: sandbox.kernel.getSnapshot(),
          checkpoints: sandbox.kernel.getAvailableCheckpointTicks(),
          memoryStats: sandbox.kernel.getSnapshotMemoryStats(),
          prefabs: sandbox.kernel.vocabulary.getAllPrefabs(),
        });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/step") {
        const body = await readJsonBody(req);
        const count = Math.max(1, Math.min(50, Number(body.count ?? 1)));
        sandbox.kernel.stepMany(count);
        sendJson(res, 200, {
          snapshot: sandbox.kernel.getSnapshot(),
          memoryStats: sandbox.kernel.getSnapshotMemoryStats(),
        });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/rewind") {
        const body = await readJsonBody(req);
        const tick = Number(body.tick ?? 0);
        const ok = sandbox.kernel.rewindTo(tick);
        sendJson(res, 200, {
          ok,
          snapshot: sandbox.kernel.getSnapshot(),
          memoryStats: sandbox.kernel.getSnapshotMemoryStats(),
        });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/push-word") {
        const body = await readJsonBody(req);
        let ok = false;
        if (body.preset === "WATER_IS_HOT") {
          ok = sandbox.triggerLogicShiftWaterIsHot();
        } else if (typeof body.entityId === "number") {
          ok = sandbox.kernel.pushEntity(
            body.entityId,
            Number(body.dx ?? 0),
            Number(body.dy ?? 0)
          );
        }
        sendJson(res, 200, {
          ok,
          snapshot: sandbox.kernel.getSnapshot(),
          memoryStats: sandbox.kernel.getSnapshotMemoryStats(),
        });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/inject-dsl") {
        const body = await readJsonBody(req);
        const input = String(body.input ?? "");
        const previewTicks = Number(body.previewTicks ?? 5);
        const translation = sandbox.injectSemanticRule(input, previewTicks);
        sendJson(res, 200, {
          translation,
          snapshot: sandbox.kernel.getSnapshot(),
          memoryStats: sandbox.kernel.getSnapshotMemoryStats(),
        });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/spawn") {
        const body = await readJsonBody(req);
        const prefabId = String(body.prefabId ?? "");
        const x = Number(body.x ?? 0);
        const y = Number(body.y ?? 0);
        const name = body.name ? String(body.name) : undefined;
        sandbox.kernel.applyReplayCommand({
          tick: sandbox.kernel.tick,
          type: "spawn",
          prefabId,
          x,
          y,
          name,
        });
        sendJson(res, 200, {
          ok: true,
          snapshot: sandbox.kernel.getSnapshot(),
        });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/edit-entity") {
        const body = await readJsonBody(req);
        const entityId = Number(body.entityId);
        if (typeof body.prop === "string" && typeof body.value === "number") {
          sandbox.kernel.applyReplayCommand({
            tick: sandbox.kernel.tick,
            type: "set_prop",
            entityId,
            prop: body.prop,
            value: body.value,
          });
        }
        if (typeof body.addTag === "string" && body.addTag.trim()) {
          sandbox.kernel.applyReplayCommand({
            tick: sandbox.kernel.tick,
            type: "add_tag",
            entityId,
            tag: body.addTag.trim(),
          });
        }
        if (typeof body.removeTag === "string" && body.removeTag.trim()) {
          sandbox.kernel.applyReplayCommand({
            tick: sandbox.kernel.tick,
            type: "remove_tag",
            entityId,
            tag: body.removeTag.trim(),
          });
        }
        sendJson(res, 200, {
          ok: true,
          snapshot: sandbox.kernel.getSnapshot(),
        });
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/replay-tape") {
        const { encodeReplayTapeToBase64Url } = await import("cyberpsychosis-core");
        const tape = sandbox.kernel.exportReplayTape();
        sendJson(res, 200, {
          tape,
          encoded: encodeReplayTapeToBase64Url(tape),
        });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/replay-tape") {
        const { decodeReplayTapeFromBase64Url } = await import("cyberpsychosis-core");
        const body = await readJsonBody(req);
        const tape =
          typeof body.encoded === "string"
            ? decodeReplayTapeFromBase64Url(body.encoded)
            : (body.tape as ReturnType<typeof sandbox.kernel.exportReplayTape>);
        const verification = sandbox.kernel.replayFromTape(tape, () => {
          sandbox = createOutpostSandbox(tape.seed);
        });
        sendJson(res, 200, {
          verification,
          snapshot: sandbox.kernel.getSnapshot(),
        });
        return;
      }

      if (req.method === "GET" && url.pathname === "/api/world-bundle") {
        sendJson(res, 200, {
          bundle: sandbox.kernel.exportWorldBundle("MicroOutpostBundle", "Live exported world bundle"),
        });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/world-bundle") {
        const body = await readJsonBody(req);
        const bundle = body.bundle as Parameters<typeof sandbox.kernel.loadWorldBundle>[0];
        sandbox.kernel.loadWorldBundle(bundle);
        sendJson(res, 200, {
          ok: true,
          snapshot: sandbox.kernel.getSnapshot(),
        });
        return;
      }

      if (req.method === "GET" && url.pathname.startsWith("/api/causal/")) {
        const targetRaw = decodeURIComponent(url.pathname.slice("/api/causal/".length));
        const report = sandbox.traceCrisisLineage(targetRaw);
        sendJson(res, 200, { report });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/reset") {
        sandbox = createOutpostSandbox(initialSeed);
        sendJson(res, 200, {
          snapshot: sandbox.kernel.getSnapshot(),
        });
        return;
      }

      sendJson(res, 404, { error: "Not found" });
    } catch (err) {
      sendJson(res, 400, {
        error: err instanceof Error ? err.message : String(err),
      });
    }
  });

  return {
    server,
    getSandbox: () => sandbox,
  };
}

// Start HTTP server if invoked directly via CLI
const currentFile = fileURLToPath(import.meta.url);
if (process.argv[1] && process.argv[1] === currentFile) {
  const port = Number(process.env.CYBERPSYCHOSIS_WEB_PORT ?? process.env.EMERGENCE_WEB_PORT ?? 4173);
  const { server } = createWorkbenchServer();
  server.listen(port, () => {
    console.log(`Cyberpsychosis Engine Web Workbench listening on http://localhost:${port}`);
  });
}
