import { CausalTracker, InternalCausalState } from "./causal.js";
import { DeterministicECS, InternalECSState } from "./ecs.js";
import { GrammarMatcher } from "./grammar.js";
import { SeededPRNG } from "./prng.js";
import { InternalRuleState, RuleEngine } from "./rules.js";
import { SemanticsExecutor } from "./semantics.js";
import { MultiModalSpatialIndex } from "./spatial.js";
import {
  EntityId,
  ForkPredictionResult,
  KernelConfig,
  SerializedGraphEdge,
  SimulatorPlugin,
  TickResult,
  WorldMetrics,
  WorldSnapshot,
} from "./types.js";
import { VocabularyRegistry } from "./vocabulary.js";

interface FullKernelCheckpoint {
  tick: number;
  prngState: number;
  ecsState: InternalECSState;
  edgesState: SerializedGraphEdge[];
  ruleState: InternalRuleState;
  causalState: InternalCausalState;
}

/**
 * EmergenceKernel — The central game-agnostic emergence middleware.
 * Coordinates ECS state, Vocabulary/Grammar/Semantics, Rule-as-Entity compilation,
 * multi-rate Simulator Plugins, Causal Lineage DAG, Time-Travel Rewind, and World Forking.
 */
export class EmergenceKernel {
  readonly ecs: DeterministicECS;
  readonly vocabulary: VocabularyRegistry;
  readonly grammar: GrammarMatcher;
  readonly semantics: SemanticsExecutor;
  readonly rules: RuleEngine;
  readonly spatial: MultiModalSpatialIndex;
  readonly causal: CausalTracker;
  readonly prng: SeededPRNG;

  private currentTick = 0;
  private readonly snapshotLimit: number;
  private checkpoints = new Map<number, FullKernelCheckpoint>();
  private plugins: SimulatorPlugin<EmergenceKernel>[] = [];

  constructor(config?: KernelConfig) {
    this.prng = new SeededPRNG(config?.seed ?? 20261014);
    this.ecs = new DeterministicECS();
    this.vocabulary = new VocabularyRegistry();
    this.grammar = new GrammarMatcher();
    this.semantics = new SemanticsExecutor();
    this.rules = new RuleEngine();
    this.spatial = new MultiModalSpatialIndex(config?.gridWidth ?? 16, config?.gridHeight ?? 12);
    this.causal = new CausalTracker();
    this.snapshotLimit = config?.snapshotHistoryLimit ?? 128;
  }

  get tick(): number {
    return this.currentTick;
  }

  usePlugin(plugin: SimulatorPlugin<EmergenceKernel>): this {
    this.plugins.push(plugin);
    if (plugin.setup) {
      plugin.setup(this);
    }
    return this;
  }

  getPlugins(): ReadonlyArray<SimulatorPlugin<EmergenceKernel>> {
    return this.plugins;
  }

  /** Saves initial or current state as a checkpoint in the ring buffer */
  saveCheckpoint(): void {
    this.checkpoints.set(this.currentTick, this.createCheckpoint());
    if (this.checkpoints.size > this.snapshotLimit) {
      const oldestTick = Math.min(...this.checkpoints.keys());
      this.checkpoints.delete(oldestTick);
    }
  }

  /**
   * Moves an entity (or pushes a Baba-style word block) and records the user/system causal root.
   */
  pushEntity(entityId: EntityId, dx: number, dy: number, reason = "User pushed block"): boolean {
    const entity = this.ecs.getEntity(entityId);
    if (!entity) return false;
    const targetX = Math.round(entity.x + dx);
    const targetY = Math.round(entity.y + dy);
    if (!this.spatial.inBounds(targetX, targetY)) return false;

    // If there is another pushable word block at the destination, cascade push if possible
    const occupants = this.spatial.getEntitiesAtGrid(this.ecs, targetX, targetY);
    for (const occId of occupants) {
      if (this.ecs.hasTag(occId, "solid") && !this.ecs.hasTag(occId, "pushable")) {
        return false;
      }
      if (this.ecs.hasTag(occId, "pushable")) {
        const nextX = targetX + dx;
        const nextY = targetY + dy;
        if (!this.spatial.inBounds(nextX, nextY)) return false;
        this.ecs.setPosition(occId, nextX, nextY);
      }
    }

    this.ecs.setPosition(entityId, targetX, targetY);
    this.causal.recordEvent({
      tick: this.currentTick,
      domain: "user",
      type: "entity_pushed",
      summary: `${reason}: moved [${entity.name}#${entityId}] to (${targetX},${targetY})`,
      subjectIds: [entityId, ...occupants],
    });

    // Immediately re-sync grid word block rules so the rule change is visible
    this.rules.syncGridWordBlockRules(this.currentTick, this.ecs, this.spatial, this.causal);
    this.saveCheckpoint();
    return true;
  }

  /** Advances the simulation by 1 deterministic tick */
  step(): TickResult {
    if (this.currentTick === 0 && !this.checkpoints.has(0)) {
      this.saveCheckpoint();
    }

    const beforeEventCount = this.causal.getAllNodes().length;
    this.currentTick += 1;

    // 1. Re-compile dynamic Rule-as-Entity & Baba-style word block sequences
    this.rules.syncGridWordBlockRules(this.currentTick, this.ecs, this.spatial, this.causal);

    // 2. Evaluate declarative Grammar -> Semantics rules
    this.rules.evaluateDeclarativeRules(
      this.currentTick,
      this.ecs,
      this.vocabulary,
      this.grammar,
      this.semantics,
      this.spatial,
      this.causal
    );

    // 3. Execute registered runtime simulator plugins according to their tick interval
    for (const plugin of this.plugins) {
      const interval = plugin.tickInterval ?? 1;
      if (this.currentTick % interval === 0) {
        plugin.onTick(this, this.currentTick);
      }
    }

    // 4. Archive checkpoint into time-travel ring buffer
    this.saveCheckpoint();

    const allEvents = this.causal.getAllNodes();
    const emittedEvents = allEvents.slice(beforeEventCount);

    return {
      tick: this.currentTick,
      emittedEvents,
      snapshot: this.getSnapshot(),
    };
  }

  stepMany(count: number): TickResult[] {
    const results: TickResult[] = [];
    for (let i = 0; i < count; i++) {
      results.push(this.step());
    }
    return results;
  }

  /** Time-travel rewind to a previously recorded tick checkpoint */
  rewindTo(targetTick: number): boolean {
    const cp = this.checkpoints.get(targetTick);
    if (!cp) return false;
    this.restoreCheckpoint(cp);
    // Prune checkpoints newer than targetTick
    for (const t of Array.from(this.checkpoints.keys())) {
      if (t > targetTick) {
        this.checkpoints.delete(t);
      }
    }
    return true;
  }

  getAvailableCheckpointTicks(): number[] {
    return Array.from(this.checkpoints.keys()).sort((a, b) => a - b);
  }

  /**
   * World Forking: Clones the exact current kernel state into an isolated parallel sandbox,
   * optionally applies a rule or state mutation, simulates N ticks forward, and returns a prediction report
   * without mutating the primary world.
   */
  forkAndPredict(
    ticks: number,
    mutateFn?: (forkedKernel: EmergenceKernel) => void
  ): ForkPredictionResult {
    const saved = this.createCheckpoint();
    const initialMetrics = this.computeMetrics();
    const beforeEventCount = this.causal.getAllNodes().length;

    try {
      if (mutateFn) {
        mutateFn(this);
      }
      for (let i = 0; i < ticks; i++) {
        this.step();
      }

      const finalMetrics = this.computeMetrics();
      const newEvents = this.causal.getAllNodes().slice(beforeEventCount);
      const criticalEvents = newEvents.filter(
        (e) =>
          e.type.includes("explosion") ||
          e.type.includes("ignite") ||
          e.type.includes("panic") ||
          e.type.includes("calmed") ||
          e.type.includes("broken") ||
          e.type.includes("compiled")
      );

      const deltaSummary: string[] = [
        `Burning entities: ${initialMetrics.burningCount} -> ${finalMetrics.burningCount}`,
        `Panicked agents: ${initialMetrics.panickedAgentCount} -> ${finalMetrics.panickedAgentCount}`,
        `Broken logistics pipes: ${initialMetrics.brokenPipeCount} -> ${finalMetrics.brokenPipeCount}`,
        `Logistics throughput: ${initialMetrics.logisticsThroughput} -> ${finalMetrics.logisticsThroughput}`,
      ];

      const safeToApply = finalMetrics.entityCount > 0;

      return {
        startTick: saved.tick,
        endTick: this.currentTick,
        simulatedTicks: ticks,
        initialMetrics,
        finalMetrics,
        deltaSummary,
        criticalEvents,
        safeToApply,
      };
    } finally {
      // Restore primary world to exact pre-fork state
      this.restoreCheckpoint(saved);
      for (const t of Array.from(this.checkpoints.keys())) {
        if (t > saved.tick) {
          this.checkpoints.delete(t);
        }
      }
    }
  }

  computeMetrics(): WorldMetrics {
    const ids = this.ecs.getAllEntityIds();
    let burningCount = 0;
    let panickedAgentCount = 0;
    for (const id of ids) {
      if (this.ecs.hasTag(id, "burning")) burningCount++;
      if (this.ecs.hasTag(id, "agent") && this.ecs.hasTag(id, "panicked")) {
        panickedAgentCount++;
      }
    }

    const logisticsEdges = this.spatial.getEdgesByKind("pipe");
    let logisticsThroughput = 0;
    let brokenPipeCount = 0;
    for (const e of logisticsEdges) {
      if (!e.intact) brokenPipeCount++;
      logisticsThroughput += e.currentFlow;
    }

    return {
      entityCount: ids.length,
      burningCount,
      panickedAgentCount,
      logisticsThroughput: Math.round(logisticsThroughput * 100) / 100,
      brokenPipeCount,
      activeRuleCount: this.rules.getActiveRuleSummaries().length,
    };
  }

  getSnapshot(): WorldSnapshot {
    return {
      tick: this.currentTick,
      seed: this.prng.initialSeed,
      prngState: this.prng.getState(),
      grid: {
        width: this.spatial.width,
        height: this.spatial.height,
      },
      entities: this.ecs.serializeEntities(),
      activeRules: this.rules.getActiveRuleSummaries(),
      overrides: this.rules.getOverrides(),
      graphEdges: this.spatial.exportEdges(),
      recentEvents: this.causal.getRecentNodes(30),
      metrics: this.computeMetrics(),
    };
  }

  private createCheckpoint(): FullKernelCheckpoint {
    return {
      tick: this.currentTick,
      prngState: this.prng.getState(),
      ecsState: this.ecs.exportState(),
      edgesState: this.spatial.exportEdges(),
      ruleState: this.rules.exportState(),
      causalState: this.causal.exportState(),
    };
  }

  private restoreCheckpoint(cp: FullKernelCheckpoint): void {
    this.currentTick = cp.tick;
    this.prng.setState(cp.prngState);
    this.ecs.importState(cp.ecsState);
    this.spatial.importEdges(cp.edgesState);
    this.rules.importState(cp.ruleState);
    this.causal.importState(cp.causalState);
  }
}
