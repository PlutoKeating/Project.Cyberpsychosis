#!/usr/bin/env node
import http from "node:http";
import { fileURLToPath } from "node:url";
import { createOutpostSandbox, OutpostSandbox } from "@emergence/demo-minimal";
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
        });
        return;
      }

      if (req.method === "POST" && url.pathname === "/api/step") {
        const body = await readJsonBody(req);
        const count = Math.max(1, Math.min(50, Number(body.count ?? 1)));
        sandbox.kernel.stepMany(count);
        sendJson(res, 200, {
          snapshot: sandbox.kernel.getSnapshot(),
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
  const port = Number(process.env.EMERGENCE_WEB_PORT ?? 4173);
  const { server } = createWorkbenchServer();
  server.listen(port, () => {
    console.log(`Emergence Engine Web Workbench listening on http://localhost:${port}`);
  });
}
