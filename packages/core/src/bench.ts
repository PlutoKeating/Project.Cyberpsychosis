import { EmergenceKernel } from "./kernel.js";

const nowMs = (): number =>
  typeof performance !== "undefined" ? performance.now() : Date.now();

export interface BenchmarkTierResult {
  tier: string;
  gridSize: string;
  entityCount: number;
  ticksSimulated: number;
  avgStepMs: number;
  ticksPerSecond: number;
  fork20TicksMs: number;
  deltaCompressionRatio: number;
  stateHash: string;
}

/**
 * Runs deterministic scaling benchmarks across Micro, Standard, Large, and Stress entity counts.
 */
export function runScalingBenchmarks(): BenchmarkTierResult[] {
  const tiers = [
    { name: "Micro (Sandbox)", w: 16, h: 12, entities: 32, ticks: 50 },
    { name: "Standard (Indie Game)", w: 48, h: 48, entities: 500, ticks: 30 },
    { name: "Large (Colony Sim)", w: 96, h: 96, entities: 2000, ticks: 15 },
    { name: "Stress (High-Density)", w: 128, h: 128, entities: 5000, ticks: 8 },
  ];

  const results: BenchmarkTierResult[] = [];

  for (const t of tiers) {
    const kernel = new EmergenceKernel({
      seed: 20261014,
      gridWidth: t.w,
      gridHeight: t.h,
      snapshotHistoryLimit: 64,
      keyframeInterval: 16,
    });

    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "temp",
      defaultValue: 22,
      min: -40,
      max: 600,
    });
    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "panic",
      defaultValue: 0,
      min: 0,
      max: 100,
    });

    // Register a declarative adjacency rule to exercise spatial bucket indexing & semantics
    kernel.rules.registerRule({
      id: "bench_heat_spread",
      name: "Heat source warms adjacent cool entities",
      priority: 10,
      enabled: true,
      source: "static",
      grammar: {
        kind: "grid_adjacent",
        subjectTag: "heater",
        targetTag: "coolant",
        eightWay: false,
      },
      semantics: [{ kind: "add_prop", target: "target", prop: "temp", delta: 5 }],
    });

    // Spawn entities deterministically across the grid
    for (let i = 0; i < t.entities; i++) {
      const x = kernel.prng.nextInt(0, t.w - 1);
      const y = kernel.prng.nextInt(0, t.h - 1);
      const isHeater = i % 10 === 0;
      const isMover = i % 8 === 0;
      kernel.ecs.createEntity({
        name: `Ent_${i}`,
        x,
        y,
        tags: isHeater ? ["heater", "hot"] : isMover ? ["coolant", "movable"] : ["coolant"],
        props: { temp: isHeater ? 120 : 20, panic: 0 },
      });
    }

    // Add a lightweight mover plugin that moves 5% of entities per tick to exercise CoW delta tracking
    kernel.usePlugin({
      id: "bench-mover",
      name: "Benchmark Mover",
      onTick(k, tickNum) {
        const movers = k.ecs.queryByTags(["movable"]);
        const limit = Math.min(30, movers.length);
        for (let i = 0; i < limit; i++) {
          const eid = movers[(i + tickNum) % movers.length];
          const ent = k.ecs.getEntity(eid);
          if (!ent) continue;
          const nx = (ent.x + 1) % k.spatial.width;
          k.ecs.setPosition(eid, nx, ent.y);
        }
      },
    });

    kernel.saveCheckpoint();

    const t0 = nowMs();
    kernel.stepMany(t.ticks);
    const elapsedMs = nowMs() - t0;
    const avgStepMs = Math.round((elapsedMs / t.ticks) * 1000) / 1000;
    const ticksPerSecond = Math.round(1000 / Math.max(0.001, avgStepMs));

    const f0 = nowMs();
    kernel.forkAndPredict(10);
    const fork10Ms = Math.round((nowMs() - f0) * 100) / 100;

    const memStats = kernel.getSnapshotMemoryStats();

    results.push({
      tier: t.name,
      gridSize: `${t.w}x${t.h}`,
      entityCount: t.entities,
      ticksSimulated: t.ticks,
      avgStepMs,
      ticksPerSecond,
      fork20TicksMs: fork10Ms,
      deltaCompressionRatio: memStats.compressionRatio,
      stateHash: kernel.getStateHash(),
    });
  }

  return results;
}

// Run and print table when executed directly via CLI
if (typeof process !== "undefined" && process.argv[1]?.endsWith("bench.js")) {
  console.log("=== CYBERPSYCHOSIS DETERMINISTIC KERNEL SCALING BENCHMARK ===");
  const table = runScalingBenchmarks();
  console.table(table);
}
