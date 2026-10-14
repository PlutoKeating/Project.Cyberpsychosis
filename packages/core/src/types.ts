export type EntityId = number;

export type CausalDomain =
  | "core"
  | "chemistry"
  | "physics"
  | "logic"
  | "logistics"
  | "social"
  | "semantic"
  | "user";

export interface PropertyDefinition {
  name: string;
  defaultValue: number;
  min?: number;
  max?: number;
  description?: string;
}

export interface PrefabDefinition {
  id: string;
  name: string;
  glyph: string;
  color: string;
  tags: string[];
  props: Record<string, number>;
  meta?: Record<string, string>;
}

export interface SerializedEntity {
  id: EntityId;
  name: string;
  glyph: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tags: string[];
  props: Record<string, number>;
  meta: Record<string, string>;
}

export interface SerializedGraphEdge {
  id: string;
  from: EntityId;
  to: EntityId;
  kind: string;
  capacity: number;
  currentFlow: number;
  intact: boolean;
}

export interface PropertyPredicate {
  prop: string;
  op: ">" | ">=" | "<" | "<=" | "==" | "!=";
  value: number;
}

export type GrammarCondition =
  | {
      kind: "grid_adjacent";
      subjectTag: string;
      targetTag: string;
      eightWay?: boolean;
      subjectPredicates?: PropertyPredicate[];
      targetPredicates?: PropertyPredicate[];
    }
  | {
      kind: "spatial_radius";
      subjectTag: string;
      targetTag: string;
      radius: number;
      subjectPredicates?: PropertyPredicate[];
      targetPredicates?: PropertyPredicate[];
    }
  | {
      kind: "graph_edge";
      edgeKind: string;
      subjectTag: string;
      targetTag: string;
      subjectPredicates?: PropertyPredicate[];
      targetPredicates?: PropertyPredicate[];
    }
  | {
      kind: "entity_state";
      subjectTag: string;
      subjectPredicates?: PropertyPredicate[];
    };

export type SemanticAction =
  | {
      kind: "add_prop";
      target: "subject" | "target";
      prop: string;
      delta: number;
    }
  | {
      kind: "set_prop";
      target: "subject" | "target";
      prop: string;
      value: number;
    }
  | {
      kind: "add_tag";
      target: "subject" | "target";
      tag: string;
    }
  | {
      kind: "remove_tag";
      target: "subject" | "target";
      tag: string;
    }
  | {
      kind: "spawn";
      prefabId: string;
      at: "subject" | "target";
    }
  | {
      kind: "destroy";
      target: "subject" | "target";
    }
  | {
      kind: "emit_event";
      domain?: CausalDomain;
      eventType: string;
      summary: string;
    };

export interface DeclarativeRule {
  id: string;
  name: string;
  priority: number;
  enabled: boolean;
  source: "static" | "entity_compiled" | "semantic_dsl";
  dslText?: string;
  grammar: GrammarCondition;
  semantics: SemanticAction[];
}

export interface GlobalTagOverride {
  id: string;
  nounTag: string;
  verb: "IS";
  propertyTag: string;
  source: "grid_word_blocks" | "semantic_dsl";
  sourceEntityIds: EntityId[];
  causeId?: string;
}

export interface ActiveRuleSummary {
  id: string;
  name: string;
  source: string;
  description: string;
}

export interface CausalNode {
  id: string;
  tick: number;
  domain: CausalDomain;
  type: string;
  summary: string;
  subjectIds: EntityId[];
  parentCauseIds: string[];
}

export interface CausalLineageReport {
  targetId: string | EntityId;
  rootNodes: CausalNode[];
  chain: CausalNode[];
  narrative: string[];
}

export interface WorldMetrics {
  entityCount: number;
  burningCount: number;
  panickedAgentCount: number;
  logisticsThroughput: number;
  brokenPipeCount: number;
  activeRuleCount: number;
}

export interface WorldSnapshot {
  tick: number;
  seed: number;
  prngState: number;
  stateHash: string;
  grid: {
    width: number;
    height: number;
  };
  entities: SerializedEntity[];
  activeRules: ActiveRuleSummary[];
  overrides: GlobalTagOverride[];
  graphEdges: SerializedGraphEdge[];
  recentEvents: CausalNode[];
  metrics: WorldMetrics;
}

export interface TickResult {
  tick: number;
  emittedEvents: CausalNode[];
  snapshot: WorldSnapshot;
}

export interface ForkPredictionResult {
  startTick: number;
  endTick: number;
  simulatedTicks: number;
  initialMetrics: WorldMetrics;
  finalMetrics: WorldMetrics;
  deltaSummary: string[];
  criticalEvents: CausalNode[];
  safeToApply: boolean;
}

export interface KernelConfig {
  seed?: number;
  gridWidth?: number;
  gridHeight?: number;
  snapshotHistoryLimit?: number;
  keyframeInterval?: number;
}

export type ReplayCommand =
  | {
      tick: number;
      type: "push";
      entityId: EntityId;
      dx: number;
      dy: number;
      reason?: string;
    }
  | {
      tick: number;
      type: "dsl";
      dslText: string;
    }
  | {
      tick: number;
      type: "spawn";
      prefabId: string;
      x: number;
      y: number;
      name?: string;
    }
  | {
      tick: number;
      type: "set_prop";
      entityId: EntityId;
      prop: string;
      value: number;
    }
  | {
      tick: number;
      type: "add_tag";
      entityId: EntityId;
      tag: string;
    }
  | {
      tick: number;
      type: "remove_tag";
      entityId: EntityId;
      tag: string;
    };

export interface ReplayTape {
  version: 1;
  seed: number;
  finalTick: number;
  expectedStateHash: string;
  commands: ReplayCommand[];
}

export interface WorldBundle {
  version: 1;
  name: string;
  description?: string;
  seed: number;
  grid: {
    width: number;
    height: number;
  };
  properties: PropertyDefinition[];
  prefabs: PrefabDefinition[];
  entities: SerializedEntity[];
  graphEdges: SerializedGraphEdge[];
  rules: DeclarativeRule[];
  overrides?: GlobalTagOverride[];
}

export interface SnapshotMemoryStats {
  totalCheckpoints: number;
  keyframeCount: number;
  deltaFrameCount: number;
  estimatedDeltaBytes: number;
  estimatedFullEquivalentBytes: number;
  compressionRatio: number;
}

export interface SimulatorPlugin<TKernel = unknown> {
  readonly id: string;
  readonly name: string;
  readonly tickInterval?: number;
  setup?(kernel: TKernel): void;
  onTick(kernel: TKernel, tick: number): void;
  exportPluginState?(): unknown;
  importPluginState?(state: unknown): void;
}
