# 全局系统架构设计 (`docs/ARCHITECTURE.md`)

本文档定义 **Emergence Engine (`@emergence/*`)** 的整体分层架构、核心抽象、数据流以及五维涌现框架在工程代码中的精确映射。

---

## 1. 架构设计目标与原则

围绕《涌现式游戏标准定义与概念指南》的“真涌现公式”：

> **瘦 Vocabulary × 极简 Grammar × 瘦 Semantics × 胖 Runtime × 清晰 Renderer**

系统遵循五大工程原则：
1. **五维显式映射**：`Vocabulary`、`Grammar`、`Semantics`、`Runtime`、`Renderer` 均在代码中对应独立且边界清晰的模块。
2. **规则即实体（Rule-as-Entity）**：模拟规则与反应矩阵不是硬编码分支，而是存储在 ECS 世界中的一等公民实体，支持运行时动态合成、失效与热重载。
3. **跨插件零直接耦合**：各领域模拟器插件（化学、物理、逻辑、物流、社会、语义）互不引用，仅通过内核的 **共享属性组件（Shared Properties）** 与 **因果事件总线（Causal Event Bus）** 产生跨界涌现。
4. **严格确定性与可逆时间轴**：给定相同初始种子与输入指令流，任何平台上的模拟结果 100% 一致；内核原生支持快照环回放（Time-Travel）与平行世界分叉推演（World Fork）。
5. **Renderer 100% 零绑定**：内核与插件层不包含任何 DOM、Canvas 或终端 I/O 代码，仅输出标准化的 `WorldSnapshot` 与 `CausalTraceNode` 数据流，同时驱动 TUI 与 Web 端。

---

## 2. 四层系统架构全景

```text
+-----------------------------------------------------------------------------------+
| Layer 4: Renderers & Inspectors (零绑定消费端)                                      |
|  - @emergence/renderer-tui : 终端 ANSI/ASCII 渲染器 + 键盘交互 + 因果树 CLI 面板    |
|  - @emergence/renderer-web : Web 多图层 Canvas + 时间轴回放 + 因果图 DAG + DSL 编辑器|
+-----------------------------------------------------------------------------------+
                                         ▲
                                         │ WorldSnapshot / CausalEvent / CommandAPI
                                         ▼
+-----------------------------------------------------------------------------------+
| Layer 3: Minimal Verification Demo (@emergence/demo-minimal)                      |
|  - Micro Outpost (16x12 微缩生态站)：声明式组装原子、初始规则与六大插件，提供跨维剧本  |
+-----------------------------------------------------------------------------------+
                                         ▲
                                         │ 声明式 DSL / TypeScript Builder API
                                         ▼
+-----------------------------------------------------------------------------------+
| Layer 2: Pluggable Runtime Simulators (@emergence/plugins)                        |
|  - ChemistryPlugin   : 温度传导、相变、接触反应矩阵、气体/火焰元胞自动机扩散           |
|  - PhysicsPlugin     : 连续/离散坐标同步、速度/冲量、爆炸冲击波力场、结构完整度坍塌    |
|  - LogicRulePlugin   : Baba 式空间词块序列检测 ([NOUN] [IS] [PROP]) -> 实时规则重编译  |
|  - LogisticsPlugin   : 有向图流网络求解、源/汇节点、容量背压、管网断裂级联拥塞        |
|  - SocialAgentPlugin : 效用 AI 决策、恐惧/士气情绪图传染、协作维修 vs 恐慌逃生        |
|  - SemanticLlmPlugin : 自然语言指令 -> 受限 DSL 编译 -> WorldFork 安全验证 -> 注入   |
+-----------------------------------------------------------------------------------+
                                         ▲
                                         │ SimulatorPlugin 接口 / 共享属性 / 因果事件
                                         ▼
+-----------------------------------------------------------------------------------+
| Layer 1: Emergence Core (@emergence/core)                                         |
|  - DeterministicECS      : TypedArray SoA 属性存储 + 实体标签 + 关系索引 + 确定性遍历 |
|  - VocabularyRegistry    : 原子 Tag、标量 Property Schema、Prefab 模板注册表         |
|  - GrammarMatcher        : 空间邻接 (Grid/Radius)、图边匹配 (Graph)、三连句法匹配器   |
|  - SemanticsExecutor     : 原子状态修改、实体派生/销毁、力场施加、规则重写执行器       |
|  - RuleEngine & DSL      : Rule-as-Entity 编译器 + 受限 DSL 解析与安全沙盒校验器      |
|  - MultiModalSpatial     : Grid2D (网格) + Continuous2D (连续空间) + GraphTopology   |
|  - CausalEventBus & DAG  : 携带 CauseID 的事件总线 + 有向无环因果溯源图谱             |
|  - Scheduler & TimeTravel: 多频固定步长调度器 + Seeded PRNG + SnapshotRingBuffer/Fork|
+-----------------------------------------------------------------------------------+
```

---

## 3. 核心模块详细设计

### 3.1 `@emergence/core`（涌现内核）

1. **`DeterministicECS`（确定性 ECS 与关系层）**
   - 使用结构化数组（TypedArray SoA 思想）与确定性递增实体 ID 管理实体生命周期。
   - 每个实体拥有：
     - `tags: Set<string>`（离散词汇标签，如 `water`、`flammable`、`npc`、`word_noun`）；
     - `props: Record<string, number>`（连续标量属性黑板，如 `temp`、`integrity`、`panic`、`charge`）；
     - `meta: Record<string, string>`（符号元数据，如 `name`、`glyph`、`wordToken`）。
   - 支持完整的序列化/反序列化与深拷贝（`serialize()` / `restore()` / `clone()`），保证快照零副作用。

2. **五维核心三元组（`Vocabulary` / `Grammar` / `Semantics`）**
   - `VocabularyRegistry`：集中注册合法的标签、标量属性默认值与上下界、以及实体原型（Prefab）。
   - `GrammarMatcher`：提供声明式匹配原语：
     - `grid_adjacent`：2D 网格曼哈顿/摩尔邻域匹配（用于化学接触反応）；
     - `spatial_radius`：连续空间欧氏距离匹配（用于物理冲击波与感知）；
     - `graph_edge`：有向图/社交图邻接匹配（用于物流输送与情绪传染）；
     - `grid_sequence`：横/竖三连词块序列匹配（用于 `BABA IS YOU` 式逻辑重编译）。
   - `SemanticsExecutor`：执行声明式反应动作（`set_prop`、`add_prop`、`add_tag`、`remove_tag`、`spawn_entity`、`destroy_entity`、`apply_impulse`、`emit_event`），并自动将触发源写入 `CausalDAG`。

3. **规则即实体与受限 DSL（`RuleEngine` & `DslCompiler`）**
   - 世界中的每条交互规则本身都可以映射为一个带 `rule` 标签的 ECS 实体，或由网格上的 `[WORD_SUBJECT] [WORD_VERB] [WORD_OBJECT]` 实时合成。
   - 提供人类可读且对 LLM 极度友好的受限 DSL 语法，例如：
     ```text
     RULE cooling_water WHEN grid_adjacent(water, hot) DO add_prop(target.temp, -15) & emit_event("cooled")
     RULE baba_water_hot WHEN token_rule(WATER, IS, HOT) DO override_tag(water, hot) & set_prop(water.temp, 120)
     ```

4. **因果事件总线与因果图谱（`CausalEventBus` & `CausalDAG`）**
   - 任何规则触发、模拟器状态突变或玩家指令都会生成一个唯一的 `CausalNode`（含 `id`、`tick`、`type`、`summary`、`subjectEntityIds`、`parentCauseIds`）。
   - 支持调用 `traceLineage(entityId | eventId)` 递归回溯完整的因果树，直接回答“为什么会发生这件事”，并可格式化为自然语言故事链。

5. **时间旅行与平行世界分叉（`SnapshotRingBuffer` & `WorldFork`）**
   - `SnapshotRingBuffer` 按固定容量保存历史帧快照，支持 `rewindTo(tick)` 与单步重放。
   - `forkAndPredict(ticks, setupFn)` 克隆当前内核状态与随机数状态，在内存沙盒中静默高速推演 `N` 帧并返回未来指标摘要（如伤亡数、火灾面积、死锁检测），不影响主世界。

---

## 4. 模块依赖边界约束

- `@emergence/core` **不依赖**任何其他内部包或第三方重型运行时。
- `@emergence/plugins` **仅依赖** `@emergence/core`。
- `@emergence/demo-minimal` **仅依赖** `@emergence/core` 与 `@emergence/plugins`。
- `@emergence/renderer-tui` 与 `@emergence/renderer-web` **仅依赖** `@emergence/core`、`@emergence/plugins`、`@emergence/demo-minimal`，二者之间完全独立。
