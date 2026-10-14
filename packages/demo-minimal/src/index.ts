import {
  CausalLineageReport,
  EmergenceKernel,
  EntityId,
} from "@emergence/core";
import {
  ChemistryPlugin,
  LogicRulePlugin,
  LogisticsPlugin,
  PhysicsPlugin,
  SemanticLlmPlugin,
  SemanticTranslationResult,
  SocialAgentPlugin,
} from "@emergence/plugins";

export interface OutpostEntities {
  wordWaterId: EntityId;
  wordIsId: EntityId;
  wordCoolId: EntityId;
  wordHotId: EntityId;
  pumpId: EntityId;
  pipe1Id: EntityId;
  pipe2Id: EntityId;
  generatorId: EntityId;
  oil1Id: EntityId;
  oil2Id: EntityId;
  agentAlphaId: EntityId;
  agentBetaId: EntityId;
}

export class OutpostSandbox {
  readonly kernel: EmergenceKernel;
  readonly semanticPlugin: SemanticLlmPlugin;
  readonly entities: OutpostEntities;

  constructor(seed = 20261014) {
    this.kernel = new EmergenceKernel({
      seed,
      gridWidth: 16,
      gridHeight: 12,
      snapshotHistoryLimit: 128,
    });

    this.semanticPlugin = new SemanticLlmPlugin();

    // Register all 6 runtime simulator plugins
    this.kernel
      .usePlugin(new ChemistryPlugin())
      .usePlugin(new PhysicsPlugin())
      .usePlugin(new LogicRulePlugin())
      .usePlugin(new LogisticsPlugin())
      .usePlugin(new SocialAgentPlugin())
      .usePlugin(this.semanticPlugin);

    // Register prefabs in VocabularyRegistry
    this.registerPrefabs();

    // Spawn initial 16x12 Micro Outpost entities and topology
    this.entities = this.spawnInitialWorld();

    // Sync initial grid word rules ([WATER] [IS] [COOL]) and save Tick 0 checkpoint
    this.kernel.rules.syncGridWordBlockRules(
      0,
      this.kernel.ecs,
      this.kernel.spatial,
      this.kernel.causal
    );
    this.kernel.saveCheckpoint();
  }

  private registerPrefabs(): void {
    const v = this.kernel.vocabulary;

    v.registerPrefab({
      id: "smoke",
      name: "SmokeCloud",
      glyph: "~",
      color: "#94a3b8",
      tags: ["smoke", "gas", "movable"],
      props: { temp: 65, calmAura: 0 },
    });

    v.registerPrefab({
      id: "water_pump",
      name: "CoolantPump",
      glyph: "P",
      color: "#38bdf8",
      tags: ["water", "cool", "pump", "structure"],
      props: { temp: 16, integrity: 100, pressure: 20 },
    });

    v.registerPrefab({
      id: "pipe_node",
      name: "CoolantPipe",
      glyph: "=",
      color: "#0284c7",
      tags: ["water", "cool", "pipe_node", "structure"],
      props: { temp: 16, integrity: 100, pressure: 20 },
    });

    v.registerPrefab({
      id: "generator",
      name: "CoreGenerator",
      glyph: "G",
      color: "#eab308",
      tags: ["generator", "machinery", "explosive", "structure"],
      props: { temp: 58, integrity: 100, pressure: 30 },
    });

    v.registerPrefab({
      id: "oil_barrel",
      name: "OilDrum",
      glyph: "o",
      color: "#a855f7",
      tags: ["oil", "flammable", "movable"],
      props: { temp: 24, fuel: 150, integrity: 80 },
    });

    v.registerPrefab({
      id: "agent",
      name: "Engineer",
      glyph: "@",
      color: "#22c55e",
      tags: ["agent", "movable"],
      props: { temp: 37, panic: 5, integrity: 100 },
      meta: { intent: "MAINTAINING_OUTPOST" },
    });
  }

  private spawnInitialWorld(): OutpostEntities {
    const { ecs, vocabulary, spatial } = this.kernel;

    // 1. Baba-style word blocks on row y=2 and y=3
    const wordWaterId = ecs.createEntity({
      name: "WORD:WATER",
      glyph: "W",
      color: "#38bdf8",
      x: 3,
      y: 2,
      tags: ["word_block", "word_noun", "pushable"],
      meta: { wordToken: "WATER" },
    });
    const wordIsId = ecs.createEntity({
      name: "WORD:IS",
      glyph: "I",
      color: "#f8fafc",
      x: 4,
      y: 2,
      tags: ["word_block", "word_verb", "pushable"],
      meta: { wordToken: "IS" },
    });
    const wordCoolId = ecs.createEntity({
      name: "WORD:COOL",
      glyph: "C",
      color: "#22d3ee",
      x: 5,
      y: 2,
      tags: ["word_block", "word_prop", "pushable"],
      meta: { wordToken: "COOL" },
    });
    const wordHotId = ecs.createEntity({
      name: "WORD:HOT",
      glyph: "H",
      color: "#f97316",
      x: 5,
      y: 3,
      tags: ["word_block", "word_prop", "pushable"],
      meta: { wordToken: "HOT" },
    });

    // 2. Logistics cooling pipeline & Core Generator on row y=5
    const pumpId = vocabulary.spawnPrefab(ecs, "water_pump", 3, 5);
    const pipe1Id = vocabulary.spawnPrefab(ecs, "pipe_node", 5, 5, { name: "PipeSegment_A" });
    const pipe2Id = vocabulary.spawnPrefab(ecs, "pipe_node", 7, 5, { name: "PipeSegment_B" });
    const generatorId = vocabulary.spawnPrefab(ecs, "generator", 9, 5);

    spatial.addEdge({ id: "pipe:pump->p1", from: pumpId, to: pipe1Id, kind: "pipe", capacity: 25 });
    spatial.addEdge({ id: "pipe:p1->p2", from: pipe1Id, to: pipe2Id, kind: "pipe", capacity: 25 });
    spatial.addEdge({
      id: "pipe:p2->gen",
      from: pipe2Id,
      to: generatorId,
      kind: "pipe",
      capacity: 25,
    });

    // 3. Flammable oil drums near the generator
    const oil1Id = vocabulary.spawnPrefab(ecs, "oil_barrel", 10, 5, { name: "OilDrum_East" });
    const oil2Id = vocabulary.spawnPrefab(ecs, "oil_barrel", 9, 6, { name: "OilDrum_South" });

    // 4. Two outpost engineers connected by a social trust relationship
    const agentAlphaId = vocabulary.spawnPrefab(ecs, "agent", 10, 6, {
      name: "Engineer_Alpha",
      glyph: "A",
    });
    const agentBetaId = vocabulary.spawnPrefab(ecs, "agent", 13, 8, {
      name: "Engineer_Beta",
      glyph: "B",
    });

    spatial.addEdge({
      id: "social:alpha->beta",
      from: agentAlphaId,
      to: agentBetaId,
      kind: "social_trust",
      capacity: 1,
    });

    return {
      wordWaterId,
      wordIsId,
      wordCoolId,
      wordHotId,
      pumpId,
      pipe1Id,
      pipe2Id,
      generatorId,
      oil1Id,
      oil2Id,
      agentAlphaId,
      agentBetaId,
    };
  }

  /**
   * Triggers the Baba-Is-You style meta-rule shift:
   * Pushes [WORD:COOL] right to (6,2) and pushes [WORD:HOT] up from (5,3) to (5,2),
   * transforming the active rule from [WATER IS COOL] into [WATER IS HOT].
   */
  triggerLogicShiftWaterIsHot(): boolean {
    const coolEnt = this.kernel.ecs.getEntity(this.entities.wordCoolId);
    const hotEnt = this.kernel.ecs.getEntity(this.entities.wordHotId);
    if (!coolEnt || !hotEnt) return false;

    if (Math.round(coolEnt.x) === 5 && Math.round(coolEnt.y) === 2) {
      this.kernel.pushEntity(
        this.entities.wordCoolId,
        1,
        0,
        "Player pushed [WORD:COOL] away from rule slot"
      );
    }
    if (Math.round(hotEnt.x) === 5 && Math.round(hotEnt.y) === 3) {
      return this.kernel.pushEntity(
        this.entities.wordHotId,
        0,
        -1,
        "Player pushed [WORD:HOT] into slot (5,2) to form [WATER IS HOT]"
      );
    }
    return false;
  }

  /**
   * Compiles a natural language intent or Restricted DSL string, previews it in a parallel WorldFork,
   * and injects it into the live simulation.
   */
  injectSemanticRule(prompt: string, previewTicks = 6): SemanticTranslationResult {
    return this.semanticPlugin.compilePreviewAndInject(this.kernel, prompt, previewTicks);
  }

  /**
   * Returns the complete causal lineage report for Engineer Beta (or the latest critical event),
   * proving how a multi-domain emergent chain unfolded.
   */
  traceCrisisLineage(target?: string | EntityId): CausalLineageReport {
    if (target !== undefined) {
      return this.kernel.causal.traceLineage(target);
    }
    // Prefer tracing from Engineer Beta if panicked, else Engineer Alpha, else generator
    if (this.kernel.ecs.hasTag(this.entities.agentBetaId, "panicked")) {
      return this.kernel.causal.traceLineage(this.entities.agentBetaId);
    }
    if (this.kernel.ecs.hasTag(this.entities.agentAlphaId, "panicked")) {
      return this.kernel.causal.traceLineage(this.entities.agentAlphaId);
    }
    return this.kernel.causal.traceLineage(this.entities.generatorId);
  }
}

export function createOutpostSandbox(seed = 20261014): OutpostSandbox {
  return new OutpostSandbox(seed);
}
