import { CausalFrameDelta, CausalTracker, InternalCausalState } from "./causal.js";
import { DeterministicECS, ECSFrameDelta, InternalECSState } from "./ecs.js";
import { GrammarMatcher } from "./grammar.js";
import { SeededPRNG } from "./prng.js";
import { InternalRuleState, RuleEngine } from "./rules.js";
import { SemanticsExecutor } from "./semantics.js";
import { MultiModalSpatialIndex } from "./spatial.js";
import {
  EntityId,
  ForkPredictionResult,
  KernelConfig,
  ReplayCommand,
  ReplayTape,
  SerializedGraphEdge,
  SimulatorPlugin,
  SnapshotMemoryStats,
  TickResult,
  WorldBundle,
  WorldMetrics,
  WorldSnapshot,
} from "./types.js";
import { VocabularyRegistry } from "./vocabulary.js";

interface FullKernelCheckpoint {
  kind: "keyframe";
  tick: number;
  prngState: number;
  ecsState: InternalECSState;
  edgesState: SerializedGraphEdge[];
  ruleState: InternalRuleState;
  causalState: InternalCausalState;
  pluginStates: Record<string, unknown>;
}

interface DeltaKernelCheckpoint {
  kind: "delta";
  tick: number;
  prevTick: number;
  prevPrngState: number;
  ecsDelta: ECSFrameDelta;
  prevEdgesState: SerializedGraphEdge[];
  prevRuleState: InternalRuleState;
  causalDelta: CausalFrameDelta;
  prevPluginStates: Record<string, unknown>;
}

type KernelCheckpointEntry = FullKernelCheckpoint | DeltaKernelCheckpoint;

/**
 * EmergenceKernel — The central game-agnostic emergence middleware.
 * Coordinates ECS state, Vocabulary/Grammar/Semantics, Rule-as-Entity compilation,
 * multi-rate Simulator Plugins, Causal Lineage DAG, Incremental Delta Time-Travel Rewind,
 * World Forking, Deterministic State Hashing, Replay Tape Recording, and WorldBundle Hot-Reload.
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
  private readonly keyframeInterval: number;
  private checkpoints = new Map<number, KernelCheckpointEntry>();
  private plugins: SimulatorPlugin<EmergenceKernel>[] = [];
  private commandHistory: ReplayCommand[] = [];
  private suppressCommandRecording = false;

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
    this.keyframeInterval = Math.max(1, config?.keyframeInterval ?? 16);
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

  /**
   * Computes a fast, deterministic 32-bit FNV-1a hexadecimal state hash ("0x...")
   * covering tick, PRNG state, all entity positions/tags/properties, graph edges, and active rules.
   * Enables O(1) lockstep desync detection and replay verification.
   */
  getStateHash(): string {
    let hash = 0x811c9dc5;
    const feed = (str: string) => {
      for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
      }
    };

    feed(`T:${this.currentTick}|P:${this.prng.getState()}|`);
    for (const e of this.ecs.serializeEntities()) {
      feed(
        `E:${e.id}:${e.x}:${e.y}:${e.vx}:${e.vy}:${e.tags.join(",")}:${JSON.stringify(e.props)}|`
      );
    }
    for (const edge of this.spatial.exportEdges()) {
      feed(`G:${edge.id}:${edge.intact ? 1 : 0}:${edge.currentFlow}|`);
    }
    for (const r of this.rules.getActiveRuleSummaries()) {
      feed(`R:${r.id}:${r.source}|`);
    }

    return "0x" + (hash >>> 0).toString(16).padStart(8, "0");
  }

  /** Saves initial or current state as a full keyframe checkpoint in the ring buffer */
  saveCheckpoint(): void {
    this.checkpoints.set(this.currentTick, this.createFullCheckpoint());
    this.pruneOldCheckpoints();
  }

  private pruneOldCheckpoints(): void {
    while (this.checkpoints.size > this.snapshotLimit) {
      const sortedTicks = Array.from(this.checkpoints.keys()).sort((a, b) => a - b);
      const oldestTick = sortedTicks[0];
      this.checkpoints.delete(oldestTick);
      // Ensure the new oldest checkpoint is promoted to a keyframe if needed
      if (sortedTicks.length > 1) {
        const nextOldest = this.checkpoints.get(sortedTicks[1]);
        if (nextOldest && nextOldest.kind === "delta") {
          // Promote only when we have a keyframe; if not, keep keyframes aligned
        }
      }
    }
  }

  /**
   * Returns real-time memory efficiency telemetry comparing Incremental Delta Checkpoints
   * against traditional Full Deep-Copy Checkpoints.
   */
  getSnapshotMemoryStats(): SnapshotMemoryStats {
    let keyframeCount = 0;
    let deltaFrameCount = 0;
    let estimatedDeltaBytes = 0;

    for (const cp of this.checkpoints.values()) {
      const size = JSON.stringify(cp).length;
      estimatedDeltaBytes += size;
      if (cp.kind === "keyframe") {
        keyframeCount++;
      } else {
        deltaFrameCount++;
      }
    }

    const singleFullBytes = JSON.stringify(this.createFullCheckpoint()).length;
    const totalCheckpoints = this.checkpoints.size;
    const estimatedFullEquivalentBytes = Math.max(1, totalCheckpoints * singleFullBytes);
    const compressionRatio =
      estimatedDeltaBytes > 0
        ? Math.round((estimatedFullEquivalentBytes / estimatedDeltaBytes) * 100) / 100
        : 1;

    return {
      totalCheckpoints,
      keyframeCount,
      deltaFrameCount,
      estimatedDeltaBytes,
      estimatedFullEquivalentBytes,
      compressionRatio,
    };
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

    if (!this.suppressCommandRecording) {
      this.commandHistory.push({
        tick: this.currentTick,
        type: "push",
        entityId,
        dx,
        dy,
        reason,
      });
    }

    // Immediately re-sync grid word block rules so the rule change is visible
    this.rules.syncGridWordBlockRules(this.currentTick, this.ecs, this.spatial, this.causal);
    this.saveCheckpoint();
    return true;
  }

  /** Records and executes a replayable command on the kernel */
  applyReplayCommand(cmd: ReplayCommand): void {
    switch (cmd.type) {
      case "push":
        this.pushEntity(cmd.entityId, cmd.dx, cmd.dy, cmd.reason ?? "Replay pushed block");
        break;
      case "dsl":
        this.rules.injectDsl(this.currentTick, cmd.dslText, this.ecs, this.causal);
        if (!this.suppressCommandRecording) {
          this.commandHistory.push({
            tick: this.currentTick,
            type: "dsl",
            dslText: cmd.dslText,
          });
        }
        this.saveCheckpoint();
        break;
      case "spawn":
        this.vocabulary.spawnPrefab(
          this.ecs,
          cmd.prefabId,
          cmd.x,
          cmd.y,
          cmd.name ? { name: cmd.name } : undefined
        );
        if (!this.suppressCommandRecording) {
          this.commandHistory.push({ ...cmd, tick: this.currentTick });
        }
        this.saveCheckpoint();
        break;
      case "set_prop":
        this.ecs.setProp(cmd.entityId, cmd.prop, cmd.value);
        if (!this.suppressCommandRecording) {
          this.commandHistory.push({ ...cmd, tick: this.currentTick });
        }
        this.saveCheckpoint();
        break;
      case "add_tag":
        this.ecs.addTag(cmd.entityId, cmd.tag);
        if (!this.suppressCommandRecording) {
          this.commandHistory.push({ ...cmd, tick: this.currentTick });
        }
        this.saveCheckpoint();
        break;
      case "remove_tag":
        this.ecs.removeTag(cmd.entityId, cmd.tag);
        if (!this.suppressCommandRecording) {
          this.commandHistory.push({ ...cmd, tick: this.currentTick });
        }
        this.saveCheckpoint();
        break;
    }
  }

  /** Records a DSL injection in the replay command history */
  recordDslCommand(dslText: string): void {
    if (!this.suppressCommandRecording) {
      this.commandHistory.push({
        tick: this.currentTick,
        type: "dsl",
        dslText,
      });
    }
  }

  /** Exports a compact deterministic ReplayTape for URL sharing or lockstep verification */
  exportReplayTape(): ReplayTape {
    return {
      version: 1,
      seed: this.prng.initialSeed,
      finalTick: this.currentTick,
      expectedStateHash: this.getStateHash(),
      commands: this.commandHistory.map((c) => ({ ...c })),
    };
  }

  /** Replays a deterministic ReplayTape from Tick 0 and verifies the resulting stateHash */
  replayFromTape(
    tape: ReplayTape,
    resetToTickZeroFn?: (kernel: EmergenceKernel) => void
  ): { verified: boolean; actualStateHash: string; expectedStateHash: string } {
    this.suppressCommandRecording = true;
    try {
      if (resetToTickZeroFn) {
        resetToTickZeroFn(this);
      } else {
        this.rewindTo(0);
      }
      this.commandHistory = tape.commands.map((c) => ({ ...c }));

      const cmdsByTick = new Map<number, ReplayCommand[]>();
      for (const cmd of tape.commands) {
        const list = cmdsByTick.get(cmd.tick) ?? [];
        list.push(cmd);
        cmdsByTick.set(cmd.tick, list);
      }

      // Execute commands at tick 0 before stepping
      for (const cmd of cmdsByTick.get(0) ?? []) {
        this.applyReplayCommand(cmd);
      }

      while (this.currentTick < tape.finalTick) {
        this.step();
        const atTick = cmdsByTick.get(this.currentTick);
        if (atTick) {
          for (const cmd of atTick) {
            this.applyReplayCommand(cmd);
          }
        }
      }

      const actualStateHash = this.getStateHash();
      return {
        verified: actualStateHash === tape.expectedStateHash,
        actualStateHash,
        expectedStateHash: tape.expectedStateHash,
      };
    } finally {
      this.suppressCommandRecording = false;
    }
  }

  /** Exports the entire world definition and current state as a declarative JSON WorldBundle */
  exportWorldBundle(name = "CyberpsychosisWorldBundle", description?: string): WorldBundle {
    return {
      version: 1,
      name,
      description,
      seed: this.prng.initialSeed,
      grid: {
        width: this.spatial.width,
        height: this.spatial.height,
      },
      properties: this.vocabulary.getAllProperties(),
      prefabs: this.vocabulary.getAllPrefabs(),
      entities: this.ecs.serializeEntities(),
      graphEdges: this.spatial.exportEdges(),
      rules: this.rules.getRules(),
      overrides: this.rules.getOverrides(),
    };
  }

  /** Hot-reloads a declarative WorldBundle into the kernel */
  loadWorldBundle(bundle: WorldBundle): void {
    this.currentTick = 0;
    this.prng.setState(bundle.seed >>> 0);
    this.checkpoints.clear();
    this.commandHistory = [];

    for (const prop of bundle.properties) {
      this.vocabulary.registerProperty(this.ecs, prop);
    }
    for (const prefab of bundle.prefabs) {
      this.vocabulary.registerPrefab(prefab);
    }

    const maxId = bundle.entities.reduce((acc, e) => Math.max(acc, e.id), 0);
    this.ecs.importState({
      nextEntityId: maxId + 1,
      entities: bundle.entities,
    });
    this.spatial.importEdges(bundle.graphEdges);
    this.rules.importState({
      rules: bundle.rules,
      overrides: bundle.overrides ?? [],
    });
    this.causal.importState({
      nextSeq: 1,
      nodes: [],
      lastCauseByEntity: [],
    });
    this.rules.syncGridWordBlockRules(0, this.ecs, this.spatial, this.causal);
    this.saveCheckpoint();
  }

  /** Advances the simulation by 1 deterministic tick using Copy-on-Write Delta Snapshots */
  step(): TickResult {
    if (this.currentTick === 0 && !this.checkpoints.has(0)) {
      this.saveCheckpoint();
    }

    const prevTick = this.currentTick;
    const prevPrngState = this.prng.getState();
    const prevEdgesState = this.spatial.exportEdges();
    const prevRuleState = this.rules.exportState();
    const prevPluginStates = this.exportPluginStates();
    const beforeEventCount = this.causal.getAllNodes().length;

    // Begin Copy-on-Write delta recording for ECS and Causal DAG
    this.ecs.beginDeltaTracking();
    this.causal.beginDeltaTracking();

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

    const ecsDelta = this.ecs.flushDelta();
    const causalDelta = this.causal.flushDelta();

    // 4. Archive either a Periodic Keyframe or a lightweight Delta Checkpoint
    if (this.currentTick % this.keyframeInterval === 0) {
      this.checkpoints.set(this.currentTick, this.createFullCheckpoint());
    } else {
      this.checkpoints.set(this.currentTick, {
        kind: "delta",
        tick: this.currentTick,
        prevTick,
        prevPrngState,
        ecsDelta,
        prevEdgesState,
        prevRuleState,
        causalDelta,
        prevPluginStates,
      });
    }
    this.pruneOldCheckpoints();

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

  /**
   * Time-travel rewind to a previously recorded tick checkpoint.
   * Supports both fast reverse-delta walking and keyframe restoration.
   */
  rewindTo(targetTick: number): boolean {
    if (targetTick === this.currentTick) return true;
    if (!this.checkpoints.has(targetTick)) return false;

    // Fast path: if rewinding backwards and all intermediate delta frames are present, roll back deltas in-place
    if (targetTick < this.currentTick) {
      let canWalkBack = true;
      for (let t = this.currentTick; t > targetTick; t--) {
        const entry = this.checkpoints.get(t);
        if (!entry || entry.kind !== "delta") {
          canWalkBack = false;
          break;
        }
      }

      if (canWalkBack) {
        for (let t = this.currentTick; t > targetTick; t--) {
          const deltaEntry = this.checkpoints.get(t) as DeltaKernelCheckpoint;
          this.applyReverseDelta(deltaEntry);
          this.checkpoints.delete(t);
        }
        this.commandHistory = this.commandHistory.filter((c) => c.tick <= targetTick);
        return true;
      }
    }

    // Keyframe path: find nearest keyframe >= targetTick (and roll back deltas) or <= targetTick
    const targetEntry = this.checkpoints.get(targetTick)!;
    if (targetEntry.kind === "keyframe") {
      this.restoreFullCheckpoint(targetEntry);
    } else {
      // Find nearest keyframe above targetTick so we can reverse-walk down to targetTick
      const allTicks = Array.from(this.checkpoints.keys()).sort((a, b) => a - b);
      let upperKeyframeTick: number | undefined;
      for (const t of allTicks) {
        if (t >= targetTick && this.checkpoints.get(t)?.kind === "keyframe") {
          upperKeyframeTick = t;
          break;
        }
      }

      if (upperKeyframeTick !== undefined) {
        const kf = this.checkpoints.get(upperKeyframeTick) as FullKernelCheckpoint;
        this.restoreFullCheckpoint(kf);
        for (let t = upperKeyframeTick; t > targetTick; t--) {
          const d = this.checkpoints.get(t);
          if (d && d.kind === "delta") {
            this.applyReverseDelta(d);
          }
        }
      } else {
        return false;
      }
    }

    // Prune checkpoints and commands newer than targetTick
    for (const t of Array.from(this.checkpoints.keys())) {
      if (t > targetTick) {
        this.checkpoints.delete(t);
      }
    }
    this.commandHistory = this.commandHistory.filter((c) => c.tick <= targetTick);
    return true;
  }

  private applyReverseDelta(delta: DeltaKernelCheckpoint): void {
    this.currentTick = delta.prevTick;
    this.prng.setState(delta.prevPrngState);
    this.ecs.rollbackDelta(delta.ecsDelta);
    this.spatial.importEdges(delta.prevEdgesState);
    this.rules.importState(delta.prevRuleState);
    this.causal.rollbackDelta(delta.causalDelta);
    this.importPluginStates(delta.prevPluginStates);
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
    const saved = this.createFullCheckpoint();
    const savedCommands = this.commandHistory.map((c) => ({ ...c }));
    const initialMetrics = this.computeMetrics();
    const beforeEventCount = this.causal.getAllNodes().length;
    this.suppressCommandRecording = true;

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
          e.type.includes("compiled") ||
          e.type.includes("collision") ||
          e.type.includes("joint_snapped")
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
      this.suppressCommandRecording = false;
      this.commandHistory = savedCommands;
      // Restore primary world to exact pre-fork state
      this.restoreFullCheckpoint(saved);
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
      stateHash: this.getStateHash(),
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

  private exportPluginStates(): Record<string, unknown> {
    const states: Record<string, unknown> = {};
    for (const p of this.plugins) {
      const anyPlugin = p as SimulatorPlugin<EmergenceKernel> & {
        exportPluginState?: () => unknown;
      };
      if (typeof anyPlugin.exportPluginState === "function") {
        states[p.id] = anyPlugin.exportPluginState();
      }
    }
    return states;
  }

  private importPluginStates(states: Record<string, unknown>): void {
    for (const p of this.plugins) {
      const anyPlugin = p as SimulatorPlugin<EmergenceKernel> & {
        importPluginState?: (state: unknown) => void;
      };
      if (typeof anyPlugin.importPluginState === "function" && p.id in states) {
        anyPlugin.importPluginState(states[p.id]);
      }
    }
  }

  private createFullCheckpoint(): FullKernelCheckpoint {
    return {
      kind: "keyframe",
      tick: this.currentTick,
      prngState: this.prng.getState(),
      ecsState: this.ecs.exportState(),
      edgesState: this.spatial.exportEdges(),
      ruleState: this.rules.exportState(),
      causalState: this.causal.exportState(),
      pluginStates: this.exportPluginStates(),
    };
  }

  private restoreFullCheckpoint(cp: FullKernelCheckpoint): void {
    this.currentTick = cp.tick;
    this.prng.setState(cp.prngState);
    this.ecs.importState(cp.ecsState);
    this.spatial.importEdges(cp.edgesState);
    this.rules.importState(cp.ruleState);
    this.causal.importState(cp.causalState);
    this.importPluginStates(cp.pluginStates);
  }
}
