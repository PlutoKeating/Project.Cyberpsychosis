import {
  CausalLineageReport,
  SerializedEntity,
  WorldSnapshot,
} from "cyberpsychosis-core";

export interface AsciiRenderOptions {
  ansi?: boolean;
}

const ANSI = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function colorize(glyph: string, entity: SerializedEntity, ansi: boolean): string {
  if (!ansi) return glyph;
  if (entity.tags.includes("burning") || entity.tags.includes("exploded")) {
    return `${ANSI.bold}${ANSI.red}${glyph}${ANSI.reset}`;
  }
  if (entity.tags.includes("panicked")) {
    return `${ANSI.bold}${ANSI.magenta}${glyph}${ANSI.reset}`;
  }
  if (entity.tags.includes("word_block")) {
    return `${ANSI.bold}${ANSI.yellow}${glyph}${ANSI.reset}`;
  }
  if (entity.tags.includes("water") || entity.tags.includes("cool")) {
    return `${ANSI.cyan}${glyph}${ANSI.reset}`;
  }
  if (entity.tags.includes("agent")) {
    return `${ANSI.bold}${ANSI.green}${glyph}${ANSI.reset}`;
  }
  return glyph;
}

/**
 * Pure zero-binding function that renders a WorldSnapshot into an ASCII / ANSI frame.
 */
export function renderSnapshotToAscii(
  snapshot: WorldSnapshot,
  options?: AsciiRenderOptions
): string {
  const ansi = options?.ansi ?? false;
  const { width, height } = snapshot.grid;

  const cells: string[][] = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => "·")
  );

  // Sort entities so agents, burning items, and word blocks render on top of background pipes/smoke
  const priorityOrder = [...snapshot.entities].sort((a, b) => {
    const score = (e: SerializedEntity) => {
      if (e.tags.includes("agent")) return 40;
      if (e.tags.includes("word_block")) return 30;
      if (e.tags.includes("generator") || e.tags.includes("pump")) return 25;
      if (e.tags.includes("burning")) return 20;
      if (e.tags.includes("pipe_node")) return 15;
      return 10;
    };
    return score(a) - score(b);
  });

  for (const ent of priorityOrder) {
    const gx = Math.round(ent.x);
    const gy = Math.round(ent.y);
    if (gx >= 0 && gx < width && gy >= 0 && gy < height) {
      const displayGlyph = ent.tags.includes("burning") && !ent.tags.includes("generator")
        ? "*"
        : ent.glyph[0] ?? "?";
      cells[gy][gx] = colorize(displayGlyph, ent, ansi);
    }
  }

  const lines: string[] = [];
  const border = "+" + "-".repeat(width * 2 + 1) + "+";
  lines.push(
    `=== CYBERPSYCHOSIS ENGINE TUI | Tick: ${snapshot.tick} | Seed: ${snapshot.seed} ===`
  );
  lines.push(
    `Metrics: Entities=${snapshot.metrics.entityCount} | Burning=${snapshot.metrics.burningCount} | Panicked=${snapshot.metrics.panickedAgentCount} | BrokenPipes=${snapshot.metrics.brokenPipeCount} | Flow=${snapshot.metrics.logisticsThroughput}`
  );
  lines.push(
    `Active Meta-Rules: ${
      snapshot.activeRules.map((r) => `[${r.name}]`).join(", ") || "(None)"
    }`
  );
  lines.push(border);
  for (let y = 0; y < height; y++) {
    lines.push(`| ${cells[y].join(" ")} | ${String(y).padStart(2, " ")}`);
  }
  lines.push(border);
  lines.push(
    "Legend: [W/I/C/H]=WordBlocks  [P]=Pump  [=]=Pipe  [G]=Generator  [o/*]=Oil/Fire  [~]=Smoke  [A/B]=Engineers"
  );

  // Key entity telemetry summary
  const keyEntities = snapshot.entities.filter(
    (e) =>
      e.tags.includes("generator") ||
      e.tags.includes("agent") ||
      e.tags.includes("pipe_node")
  );
  lines.push("--- Key Entity Telemetry ---");
  for (const e of keyEntities) {
    const temp = Math.round(e.props.temp ?? 0);
    const integrity = Math.round(e.props.integrity ?? 100);
    const panic = e.props.panic !== undefined ? ` | panic=${Math.round(e.props.panic)}` : "";
    const statusTags = e.tags
      .filter((t) => ["burning", "exploded", "broken", "panicked", "hot", "cool", "calm"].includes(t))
      .join(",");
    lines.push(
      `  #${e.id} ${e.name.padEnd(15, " ")} @(${e.x},${e.y}) temp=${String(temp).padStart(3, " ")}°C | int=${String(integrity).padStart(3, " ")}%${panic} [${statusTags}]`
    );
  }

  lines.push("--- Recent Causal Events ---");
  const recent = snapshot.recentEvents.slice(-5);
  if (recent.length === 0) {
    lines.push("  (No events yet)");
  } else {
    for (const ev of recent) {
      lines.push(
        `  [Tick ${ev.tick} | ${ev.domain.toUpperCase()}] ${ev.summary} (parents: ${
          ev.parentCauseIds.join(",") || "root"
        })`
      );
    }
  }

  return lines.join("\n");
}

/**
 * Renders a CausalLineageReport into a structured ASCII causal tree.
 */
export function renderCausalLineageToAscii(report: CausalLineageReport): string {
  const lines: string[] = [];
  lines.push(`=== CAUSAL LINEAGE DAG TRACE (Target: ${report.targetId}) ===`);
  if (report.chain.length === 0) {
    lines.push("  (No causal history recorded for target)");
    return lines.join("\n");
  }
  for (let i = 0; i < report.chain.length; i++) {
    const node = report.chain[i];
    const prefix = i === 0 ? "  [ROOT] " : `  ${"  ".repeat(Math.min(i, 6))}└─> `;
    lines.push(
      `${prefix}[Tick ${node.tick} | ${node.domain.toUpperCase()} | ${node.type}] ${node.summary}`
    );
  }
  return lines.join("\n");
}
