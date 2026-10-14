# API 与协议参考手册 (`docs/API.md`)

本文档定义 `cyberpsychosis`、`cyberpsychosis-core`、`cyberpsychosis-plugins`、受限规则 DSL、零绑定渲染快照协议以及 Cloudflare Worker 官网接口的公共 API 规范。

---

## 1. `cyberpsychosis-core` 核心 API

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
  usePlugin(plugin: SimulatorPlugin<EmergenceKernel>): this;

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
```

---

## 2. 受限规则 DSL（Restricted Emergence DSL）

用于配置文件热加载及 `SemanticLlmPlugin`（LLM $\rightarrow$ 受限 DSL $\rightarrow$ ECS）的安全规则注入。

1. **全局词块重定义规则（Global Override / Baba-Style Rule）**：
   ```text
   OVERRIDE <nounTag> IS <propertyOrTag>
   ```
2. **交互反应规则（Interaction Rule）**：
   ```text
   RULE <id> WHEN adjacent(<subjectTag>, <targetTag>) DO <action1>; <action2>
   ```

---

## 3. 零绑定渲染与可观测协议（Renderer Protocol）

所有渲染端（`cyberpsychosis-tui` 与 `cyberpsychosis-web`）只消费以下纯 JSON 可序列化数据结构：

- `WorldSnapshot`：包含 `tick`、`seed`、`grid`、`entities`、`activeRules`、`overrides`、`graphEdges`、`recentEvents` 与 `metrics`。
- `CausalNode` 与 `CausalLineageReport`：记录跨领域的有向无环因果边（`parentCauseIds`）及按拓扑顺序生成的故事叙述链（`narrative`）。

---

## 4. Web 涌现实验室 REST / HTTP 接口（`cyberpsychosis-web`）

- `GET /api/snapshot`：获取当前帧 `WorldSnapshot`
- `POST /api/step`：推进 `count` 帧（请求体 `{ "count": 1 }`）
- `POST /api/rewind`：时间旅行回退到指定帧（请求体 `{ "tick": 5 }`）
- `POST /api/push-word`：在沙盒中推动词块或移动实体（请求体 `{ "preset": "WATER_IS_HOT" }`）
- `POST /api/inject-dsl`：通过自然语言或受限 DSL 动态注入新规则并附带 `WorldFork` 平行世界安全预览
- `GET /api/causal/:id`：查询指定事件或实体的完整因果溯源链（Causal Lineage DAG）
- `POST /api/reset`：重置微缩生态站场景
