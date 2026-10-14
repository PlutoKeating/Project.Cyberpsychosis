# API 与协议参考手册 (`docs/API.md`)

本文档定义 `@emergence/core`、`@emergence/plugins`、受限规则 DSL 以及零绑定渲染快照协议的公共 API 规范。

---

## 1. `@emergence/core` 核心 API

### 1.1 `EmergenceKernel`（内核主入口）

```ts
export interface KernelConfig {
  seed?: number;
  gridWidth?: number;
  gridHeight?: number;
  snapshotHistoryLimit?: number;
}

export class EmergenceKernel {
  readonly ecs: DeterministicECS;
  readonly vocabulary: VocabularyRegistry;
  readonly grammar: GrammarMatcher;
  readonly semantics: SemanticsExecutor;
  readonly rules: RuleEngine;
  readonly spatial: MultiModalSpatialIndex;
  readonly causal: CausalTracker;
  readonly prng: SeededPRNG;

  constructor(config?: KernelConfig);

  /** 注册可插拔模拟器插件 */
  usePlugin(plugin: SimulatorPlugin): this;

  /** 推进 1 个确定性逻辑帧 */
  step(): TickResult;

  /** 连续推进 N 个确定性逻辑帧 */
  stepMany(count: number): TickResult[];

  /** 导出零渲染绑定的当前世界快照 */
  getSnapshot(): WorldSnapshot;

  /** 时间旅行：回滚到历史环形缓冲区中的指定帧 */
  rewindTo(tick: number): boolean;

  /** 平行世界分叉：克隆当前世界并静默推演未来 ticks 帧 */
  forkAndPredict(ticks: number, mutateFn?: (forkedKernel: EmergenceKernel) => void): ForkPredictionResult;
}
```

### 1.2 五维框架接口（`Vocabulary` / `Grammar` / `Semantics`）

```ts
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

export interfaceDeclarativeRule {
  id: string;
  name: string;
  priority?: number;
  enabled?: boolean;
  source?: "static" | "entity_compiled" | "semantic_dsl";
  grammar: GrammarCondition;
  semantics: SemanticAction[];
}
```

### 1.3 可插拔模拟器接口（`SimulatorPlugin`）

```ts
export interface SimulatorPlugin {
  readonly id: string;
  readonly name: string;
  /** 每隔多少个主 Tick 执行一次（默认 1，即每帧执行） */
  readonly tickInterval?: number;

  setup?(kernel: EmergenceKernel): void;
  onTick(kernel: EmergenceKernel, tick: number): void;
}
```

---

## 2. 受限规则 DSL（Restricted Emergence DSL）

用于配置文件热加载及 `SemanticLlmPlugin`（LLM $\rightarrow$ 受限 DSL $\rightarrow$ ECS）的安全规则注入。

### 2.1 DSL 语法格式

支持两类语句：

1. **交互反应规则（Interaction Rule）**：
   ```text
   RULE <id> WHEN adjacent(<subjectTag>, <targetTag>) DO <action1>; <action2>
   ```
   支持动作：
   - `add_prop(subject.<prop>, <delta>)` / `add_prop(target.<prop>, <delta>)`
   - `set_prop(subject.<prop>, <value>)` / `set_prop(target.<prop>, <value>)`
   - `add_tag(subject, <tag>)` / `add_tag(target, <tag>)`
   - `remove_tag(subject, <tag>)` / `remove_tag(target, <tag>)`
   - `spawn(<prefabId>, target)`
   - `destroy(subject)` / `destroy(target)`
   - `emit("<message>")`

2. **全局词块重定义规则（Global Override / Baba-Style Rule）**：
   ```text
   OVERRIDE <nounTag> IS <propertyOrTag>
   ```
   例如：
   - `OVERRIDE water IS hot`（将所有 `water` 实体的温度设为高温并赋予 `hot` 标签）
   - `OVERRIDE smoke IS calm`（赋予 `smoke` 镇静属性，接触恐慌 NPC 时降低其 `panic`）

---

## 3. 零绑定渲染与可观测协议（Renderer Protocol）

所有渲染端（`@emergence/renderer-tui` 与 `@emergence/renderer-web`）只消费以下纯 JSON 可序列化数据结构：

```ts
export interface WorldSnapshot {
  tick: number;
  seed: number;
  grid: {
    width: number;
    height: number;
  };
  entities: SerializedEntity[];
  activeRules: ActiveRuleSummary[];
  graphEdges: SerializedGraphEdge[];
  recentEvents: CausalNode[];
  metrics: {
    entityCount: number;
    burningCount: number;
    panickedAgentCount: number;
    logisticsThroughput: number;
    activeRuleCount: number;
  };
}

export interface CausalNode {
  id: string;
  tick: number;
  domain: "core" | "chemistry" | "physics" | "logic" | "logistics" | "social" | "semantic" | "user";
  type: string;
  summary: string;
  subjectIds: number[];
  parentCauseIds: string[];
}
```

---

## 4. Web 涌现实验室 REST / HTTP 接口（`@emergence/renderer-web`）

Web 工作台支持纯前端浏览器内运行内核，同时也提供轻量级 Node HTTP 服务接口以便 CLI/外部工具联动：

- `GET /api/snapshot`：获取当前帧 `WorldSnapshot`
- `POST /api/step`：推进 `count` 帧（请求体 `{ "count": 1 }`）
- `POST /api/rewind`：时间旅行回退到指定帧（请求体 `{ "tick": 5 }`）
- `POST /api/push-word`：在沙盒中移动词块或实体（请求体 `{ "entityId": 12, "dx": 1, "dy": 0 }`）
- `POST /api/inject-dsl`：通过自然语言或受限 DSL 动态注入新规则并附带 `WorldFork` 平行世界安全预览（请求体 `{ "input": "Make smoke calm panicked agents", "previewTicks": 15 }`）
- `GET /api/causal/:id`：查询指定事件或实体的完整因果溯源链（Causal Lineage DAG）
- `POST /api/reset`：重置微缩生态站场景
