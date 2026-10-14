import type { DocChapterPage } from "../components/docs-layout.ts";
import { definePageI18n, L } from "../i18n/index.ts";

export const DOCS_DATA_I18N = definePageI18n({
  chapters: [
    {
      slug: "",
      chapterNumber: "01",
      category: L("FOUNDATION", "FOUNDATION"),
      title: L("五维涌现架构", "5D Emergence Architecture"),
      subtitle: L(
        "用五维正交原语替代硬编码脚本，让跨领域规则在确定性内核中自动碰撞。",
        "Replace hardcoded scripts with five orthogonal primitives that interact inside a deterministic kernel."
      ),
      description: L(
        "Cyberpsychosis 五维涌现公式与四层引擎架构说明。",
        "Cyberpsychosis five-dimension emergence formula and four-layer architecture overview."
      ),
      specs: [
        { label: L("CORE FORMULA", "CORE FORMULA"), value: L("5D Orthogonal", "5D Orthogonal") },
        { label: L("ARCHITECTURE", "ARCHITECTURE"), value: L("4 Decoupled Layers", "4 Decoupled Layers") },
        { label: L("RUNTIME DEPS", "RUNTIME DEPS"), value: L("0 External Packages", "0 External Packages") },
      ],
      sections: [
        {
          id: "what-is-cyberpsychosis",
          heading: L("1.1 核心定位", "1.1 Core Positioning"),
          paragraphs: [
            L(
              "Cyberpsychosis 提供确定性涌现内核（cyberpsychosis-core）与六大可插拔模拟器插件（cyberpsychosis-plugins），向上输出无头快照流驱动终端与 Web 工作台。",
              "Cyberpsychosis provides a deterministic emergence kernel (cyberpsychosis-core) and six pluggable simulators (cyberpsychosis-plugins), streaming headless snapshots to terminal and Web studios."
            ),
          ],
          bullets: [
            L("五维显式建模：Vocabulary、Grammar、Semantics、Runtime、Renderer 各自对应独立模块。", "Explicit 5D modules: Vocabulary, Grammar, Semantics, Runtime, and Renderer map to distinct classes."),
            L("规则即实体：模拟规则作为 ECS 实体存储，支持单帧实时重编译。", "Rule-as-Entity: simulation rules live inside the ECS world and recompile within a single tick."),
            L("因果溯源图谱：CausalTracker 自动记录每次状态突变的父级起因。", "Causal Lineage DAG: CausalTracker automatically links parent causes across every state mutation."),
            L("双端零绑定渲染：同一 JSON 快照流同时驱动 ASCII TUI 与 Web 多图层画布。", "Zero-binding rendering: one JSON snapshot stream drives both ASCII TUI and Web Canvas."),
          ],
        },
        {
          id: "five-dimension-formula",
          heading: L("1.2 五维公式与代码映射", "1.2 5D Formula to Code Mapping"),
          paragraphs: [
            L(
              "系统严格遵循公式：瘦 Vocabulary × 极简 Grammar × 瘦 Semantics × 胖 Runtime × 清晰 Renderer。",
              "The engine implements the formula: Lean Vocabulary × Minimal Grammar × Lean Semantics × Fat Runtime × Clear Renderer."
            ),
          ],
          table: {
            headers: [
              L("维度", "Dimension"),
              L("内核模块", "Kernel Module"),
              L("工程职责", "Responsibility"),
            ],
            rows: [
              [
                L("Vocabulary", "Vocabulary"),
                L("VocabularyRegistry", "VocabularyRegistry"),
                L("注册原子标签、标量属性上下界与实体原型", "Registers atomic tags, scalar property bounds, and entity prefabs"),
              ],
              [
                L("Grammar", "Grammar"),
                L("GrammarMatcher", "GrammarMatcher"),
                L("执行 2D 网格邻接、连续半径、有向图边与三连词块匹配", "Matches 2D grid adjacency, Euclidean radius, directed edges, and word triplets"),
              ],
              [
                L("Semantics", "Semantics"),
                L("SemanticsExecutor", "SemanticsExecutor"),
                L("执行标量属性重写、标签增删、实体派生与因果记录", "Executes scalar property mutations, tag updates, spawning, and causal logging"),
              ],
              [
                L("Runtime", "Runtime"),
                L("EmergenceKernel + 6 Plugins", "EmergenceKernel + 6 Plugins"),
                L("固定步长调度、规则重编译、快照环倒带与平行分叉", "Fixed-tick scheduling, rule recompilation, ring-buffer rewind, and WorldFork"),
              ],
              [
                L("Renderer", "Renderer"),
                L("WorldSnapshot + Causal DAG", "WorldSnapshot + Causal DAG"),
                L("输出纯 JSON 世界快照与拓扑因果链", "Emits pure JSON world snapshots and topologically sorted causal chains"),
              ],
            ],
          },
        },
        {
          id: "four-layer-architecture",
          heading: L("1.3 四层解耦栈", "1.3 Four-Layer Stack"),
          paragraphs: [
            L(
              "系统自底向上分为四层，下层永不反向依赖上层。",
              "The stack is organized into four unidirectional layers from headless kernel to visual studios."
            ),
          ],
          codeBlock: {
            lang: "text",
            code: `Layer 4: Renderers & CLI      (cyberpsychosis-tui / cyberpsychosis-web / cyberpsychosis)
  ▲  WorldSnapshot / CausalLineageReport / REST & CLI
Layer 3: Verification Demo    (cyberpsychosis-demo: 16x12 Micro Outpost)
  ▲  Declarative Prefabs & Scenario Script
Layer 2: Runtime Simulators   (cyberpsychosis-plugins: Chem / Phys / Logic / Pipe / Social / LLM)
  ▲  Shared Scalar Blackboard (temp, integrity, panic) + Causal Bus
Layer 1: Emergence Kernel     (cyberpsychosis-core: ECS, RuleEngine, SpatialIndex, CausalDAG, WorldFork)`,
          },
        },
      ],
    },
    {
      slug: "quick-start",
      chapterNumber: "02",
      category: L("GETTING STARTED", "GETTING STARTED"),
      title: L("快速启动与 CLI", "Quick Start & CLI"),
      subtitle: L(
        "一行命令启动 16×12 跨维涌现演示、交互式终端沙盒或 Web 实验室工作台。",
        "Launch the 16×12 cascade demo, interactive terminal sandbox, or Web workbench with a single command."
      ),
      description: L(
        "安装与运行 Cyberpsychosis CLI、终端 TUI 与 Web 实验室工作台指南。",
        "Guide to running Cyberpsychosis CLI, Terminal TUI, and Web Visual Workbench."
      ),
      specs: [
        { label: L("NODE ENGINE", "NODE ENGINE"), value: L(">= 20.0.0", ">= 20.0.0") },
        { label: L("WEB PORT", "WEB PORT"), value: L("localhost:4173", "localhost:4173") },
        { label: L("DEFAULT SEED", "DEFAULT SEED"), value: L("20261014", "20261014") },
      ],
      sections: [
        {
          id: "npx-instant-run",
          heading: L("2.1 NPX 极速体验", "2.1 Instant NPX Launch"),
          paragraphs: [
            L(
              "直接通过 npx 运行主包，立即观察微缩生态站的六维连锁反应与因果溯源输出：",
              "Run the umbrella package via npx to observe the six-domain cascade and causal trace immediately:"
            ),
          ],
          codeBlock: {
            lang: "bash",
            code: `npx cyberpsychosis demo      # Auto-run 16x12 cascade & print Causal DAG
npx cyberpsychosis-tui       # Interactive keyboard-driven ASCII sandbox
npx cyberpsychosis web       # Start Web Visual Workbench at http://localhost:4173`,
          },
        },
        {
          id: "monorepo-build",
          heading: L("2.2 源码构建与验证", "2.2 Build & Verify from Source"),
          paragraphs: [
            L(
              "克隆仓库后，通过 npm workspaces 执行全量编译、设计系统静态检查与集成测试：",
              "Clone the repository to run workspace compilation, design system checks, and integration tests:"
            ),
          ],
          codeBlock: {
            lang: "bash",
            code: `git clone https://github.com/PlutoKeating/Project.Cyberpsychosis.git
cd Project.Cyberpsychosis
npm install
npm run build
npm test`,
          },
        },
        {
          id: "tui-controls",
          heading: L("2.3 终端 TUI 快捷键", "2.3 Terminal TUI Keymap"),
          paragraphs: [
            L(
              "交互式终端模式支持单键控制时间步进、词块推动、DSL 注入与时间回溯：",
              "Interactive TUI mode provides single-key controls for stepping, word pushing, DSL injection, and rewinding:"
            ),
          ],
          table: {
            headers: [
              L("按键", "Key"),
              L("动作", "Action"),
              L("触发机制", "Triggered Mechanism"),
            ],
            rows: [
              [L("Space / Enter", "Space / Enter"), L("推进 1 帧", "Step +1 Tick"), L("执行单帧规则重编译与六大插件模拟", "Runs 1 tick of rule compilation and all 6 plugins")],
              [L("n", "n"), L("推进 5 帧", "Step +5 Ticks"), L("连续步进观察级联演化", "Fast-forwards 5 deterministic ticks")],
              [L("b", "b"), L("推动 [WATER IS HOT]", "Push [WATER IS HOT]"), L("将 [HOT] 推入 (5,2) 重编译全局规则", "Slides [HOT] into (5,2) to recompile meta-rules")],
              [L("s", "s"), L("注入 'Make smoke calm'", "Inject 'Make smoke calm'"), L("经 WorldFork 验证后注入镇静烟雾规则", "Verifies in WorldFork and injects calm smoke rule")],
              [L("r", "r"), L("回退 3 帧", "Rewind -3 Ticks"), L("从环形快照缓冲区恢复历史状态", "Restores historical state from ring buffer")],
              [L("c", "c"), L("展开因果树", "Trace Causal DAG"), L("输出当前危机实体的完整跨系统起因链", "Prints root-to-leaf causal lineage report")],
            ],
          },
        },
      ],
    },
    {
      slug: "core-kernel",
      chapterNumber: "03",
      category: L("CORE ARCHITECTURE", "CORE ARCHITECTURE"),
      title: L("确定性内核与多模态空间", "Deterministic Kernel & Spatial Index"),
      subtitle: L(
        "固定步长调度、标量上下界钳制与网格/连续半径/有向图三合一空间索引。",
        "Fixed-tick scheduling, clamped scalar blackboard, and unified Grid, Radius, and Graph spatial indexing."
      ),
      description: L(
        "DeterministicECS 属性存储与 MultiModalSpatialIndex 三模态空间查询说明。",
        "DeterministicECS storage and MultiModalSpatialIndex tri-modal spatial query reference."
      ),
      specs: [
        { label: L("PRNG ALGORITHM", "PRNG ALGORITHM"), value: L("Mulberry32 (32-bit)", "Mulberry32 (32-bit)") },
        { label: L("FLOAT CLAMPING", "FLOAT CLAMPING"), value: L("0.001 Precision", "0.001 Precision") },
        { label: L("SPATIAL MODES", "SPATIAL MODES"), value: L("Grid · Radius · Graph", "Grid · Radius · Graph") },
      ],
      sections: [
        {
          id: "deterministic-ecs",
          heading: L("3.1 DeterministicECS 与标量黑板", "3.1 DeterministicECS & Scalar Blackboard"),
          paragraphs: [
            L(
              "DeterministicECS 按严格递增的 EntityId 遍历实体，所有标量属性按注册区间自动钳制并保留千分位精度，彻底消除跨平台浮点漂移。",
              "DeterministicECS iterates entities in ascending EntityId order and clamps all scalar properties to thousandth precision, eliminating cross-platform float drift."
            ),
          ],
          codeBlock: {
            lang: "typescript",
            code: `import { EmergenceKernel } from "cyberpsychosis-core";

const kernel = new EmergenceKernel({ seed: 20261014, gridWidth: 16, gridHeight: 12 });

kernel.vocabulary.registerProperty(kernel.ecs, {
  name: "temp",
  defaultValue: 20,
  min: -40,
  max: 600,
});

const generatorId = kernel.ecs.createEntity({
  name: "CoreGenerator",
  glyph: "G",
  x: 9,
  y: 5,
  tags: ["generator", "machinery", "explosive"],
  props: { temp: 58, integrity: 100 },
});`,
          },
        },
        {
          id: "multimodal-spatial",
          heading: L("3.2 三合一空间索引 (MultiModalSpatialIndex)", "3.2 Tri-Modal Spatial Index"),
          paragraphs: [
            L(
              "同一个实体可同时参与离散网格邻接、连续欧氏半径与有向图拓扑查询：",
              "A single entity simultaneously participates in discrete grid adjacency, continuous Euclidean radius, and directed graph queries:"
            ),
          ],
          bullets: [
            L("Grid2D：getEntitiesAtGrid(x, y) 与 getGridNeighbors(x, y, eightWay) 驱动元胞热传导与词块扫描。", "Grid2D: getEntitiesAtGrid(x, y) and getGridNeighbors(x, y, eightWay) power cellular heat diffusion and word scanning."),
            L("Continuous2D：queryRadius(cx, cy, radius) 驱动爆炸冲击波衰减与 Agent 威胁感知。", "Continuous2D: queryRadius(cx, cy, radius) powers blast shockwaves and Agent hazard perception."),
            L("GraphTopology：addEdge({ from, to, kind, capacity }) 建模冷却管道与社交信任网络。", "GraphTopology: addEdge({ from, to, kind, capacity }) models coolant pipelines and social trust edges."),
          ],
        },
      ],
    },
    {
      slug: "rule-as-entity",
      chapterNumber: "04",
      category: L("META-PROGRAMMING", "META-PROGRAMMING"),
      title: L("规则即实体与受限 DSL", "Rule-as-Entity & Restricted DSL"),
      subtitle: L(
        "将模拟规则本身作为 ECS 实体存储，打通空间推块改写与自然语言安全编译。",
        "Store rules as first-class ECS entities, unifying spatial word-block rewriting and safe DSL injection."
      ),
      description: L(
        "RuleEngine 2D 网格词块实时重编译与 Restricted Emergence DSL 语法参考。",
        "RuleEngine 2D grid word-block recompilation and Restricted Emergence DSL syntax guide."
      ),
      specs: [
        { label: L("GRID PATTERN", "GRID PATTERN"), value: L("[NOUN] [IS] [PROP]", "[NOUN] [IS] [PROP]") },
        { label: L("RECOMPILE LATENCY", "RECOMPILE LATENCY"), value: L("Single Tick (0ms)", "Single Tick (0ms)") },
        { label: L("DSL EXECUTION", "DSL EXECUTION"), value: L("Zero eval() Whitelist", "Zero eval() Whitelist") },
      ],
      sections: [
        {
          id: "baba-grid-compilation",
          heading: L("4.1 Baba 式空间词块重编译", "4.1 Baba-Style Grid Word Recompilation"),
          paragraphs: [
            L(
              "每帧开始时，RuleEngine 自动扫描网格上横排或竖排相连的 [word_noun] + [word_verb:IS] + [word_prop] 词块序列，并实时重编译全局规则：",
              "At the start of each tick, RuleEngine scans horizontally or vertically aligned [word_noun] + [word_verb:IS] + [word_prop] triplets and recompiles active rules:"
            ),
          ],
          codeBlock: {
            lang: "typescript",
            code: `// Slide [WORD:HOT] into (5,2) to align [WATER] [IS] [HOT]
kernel.pushEntity(wordHotId, 0, -1, "Player pushed [WORD:HOT] into rule slot");

// Single-tick automatic kernel transition:
// 1. Deactivates previous rule [WATER IS COOL]
// 2. Activates [WATER IS HOT], setting temp >= 95°C on all [water] entities
// 3. Appends causal edge: user:entity_pushed -> logic:rule_compiled`,
          },
        },
        {
          id: "restricted-dsl",
          heading: L("4.2 受限涌现 DSL 语法", "4.2 Restricted Emergence DSL Syntax"),
          paragraphs: [
            L(
              "内置零 eval 白名单解析器（RuleEngine.injectDsl），支持全局覆盖语句与邻接反应语句：",
              "The zero-eval whitelist parser (RuleEngine.injectDsl) supports global overrides and adjacency reaction rules:"
            ),
          ],
          codeBlock: {
            lang: "text",
            code: `# 1. Global Tag/Property Override
OVERRIDE water IS hot
OVERRIDE smoke IS calm

# 2. Adjacency Interaction Rule
RULE agent_auto_repair WHEN adjacent(agent, broken) DO set_prop(target.integrity, 100); remove_tag(target, broken); emit("Agent repaired structure")`,
          },
        },
      ],
    },
    {
      slug: "causal-and-time",
      chapterNumber: "05",
      category: L("OBSERVABILITY & TIME", "OBSERVABILITY & TIME"),
      title: L("因果图谱与平行世界推演", "Causal DAG & WorldFork Prediction"),
      subtitle: L(
        "自动串联跨系统事件起因链，并在隔离沙盒中超前验证新规则的未来演化。",
        "Automatically stitch cross-domain root causes and verify new rules in isolated parallel timelines."
      ),
      description: L(
        "CausalTracker 有向无环因果图、时间回滚（rewindTo）与平行世界分叉（forkAndPredict）指南。",
        "CausalTracker lineage DAG, time-travel rewindTo, and parallel WorldFork prediction reference."
      ),
      specs: [
        { label: L("LINEAGE GRAPH", "LINEAGE GRAPH"), value: L("Topological DAG", "Topological DAG") },
        { label: L("DELTA SNAPSHOT", "DELTA SNAPSHOT"), value: L("4.2x–6.2x CoW Ratio", "4.2x–6.2x CoW Ratio") },
        { label: L("NETCODE READY", "NETCODE READY"), value: L("FNV-1a Lockstep + URL Tape", "FNV-1a Lockstep + URL Tape") },
      ],
      sections: [
        {
          id: "causal-dag",
          heading: L("5.1 跨系统因果自动缝合", "5.1 Automated Causal DAG Stitching"),
          paragraphs: [
            L(
              "CausalTracker 维护每个实体的最新受影响指针（lastCauseByEntity），调用 traceLineage(entityId) 即可输出从根因到结果的完整拓扑故事链：",
              "CausalTracker maintains each entity's latest causal pointer (lastCauseByEntity). Calling traceLineage(entityId) reconstructs the full root-to-leaf narrative:"
            ),
          ],
          codeBlock: {
            lang: "typescript",
            code: `const report = kernel.causal.traceLineage(engineerBetaId);
for (const line of report.narrative) {
  console.log(line);
}
// [Step 1 | Tick 2 | USER]      Player pushed [WORD:HOT] into slot (5,2)
// [Step 2 | Tick 2 | LOGIC]     Compiled active grid meta-rule: [WATER IS HOT]
// [Step 3 | Tick 6 | PHYSICS]   Overheated [CoreGenerator#8] triggered shockwave!
// [Step 4 | Tick 6 | SOCIAL]    [Engineer_Alpha#13] distress spread to [Engineer_Beta#14]`,
          },
        },
        {
          id: "incremental-delta-and-lockstep",
          heading: L("5.2 增量快照 (CoW Delta) 与 Lockstep 回放分享", "5.2 Copy-on-Write Delta Snapshots & Lockstep Story Sharing"),
          paragraphs: [
            L(
              "内核采用『周期关键帧 + 写时复制增量帧 (Copy-on-Write Delta)』混合架构：中间帧仅记录脏实体属性变更与追加的因果节点 ID，压缩比达 4.2x~6.2x。配合 FNV-1a 32-bit 状态哈希 (getStateHash)，天然支持 URL 故事回放磁带 (?replay=...) 与带延迟回滚的 LockstepCoordinator 帧同步联机：",
              "The kernel uses a Periodic Keyframe + Copy-on-Write Delta architecture, recording only mutated entities and appended causal node IDs (4.2x–6.2x compression). Combined with FNV-1a 32-bit state hashing (getStateHash), it natively powers URL story replay links (?replay=...) and rollback lockstep multiplayer via LockstepCoordinator:"
            ),
          ],
          codeBlock: {
            lang: "typescript",
            code: `import { LockstepCoordinator, encodeReplayTapeToBase64Url } from "cyberpsychosis-core";

// 1. Share an entire emergent story in a <150-char Base64URL parameter
const tape = kernel.exportReplayTape();
const shareUrl = \`https://cyberpsychosis.plutokeating.beer/?replay=\${encodeReplayTapeToBase64Url(tape)}\`;

// 2. Rollback Lockstep Multiplayer (auto-rewinds & resimulates on late peer packets)
const lockstep = new LockstepCoordinator(kernel);
lockstep.submitPeerInput({
  tick: 2,
  playerId: "peer-alpha",
  commands: [{ tick: 2, type: "push", entityId: 4, dx: 0, dy: -1 }],
});`,
          },
        },
        {
          id: "world-fork",
          heading: L("5.3 平行世界推演 (forkAndPredict)", "5.3 Parallel WorldFork Prediction"),
          paragraphs: [
            L(
              "forkAndPredict(ticks, mutateFn) 深度克隆当前世界状态与随机数种子，在内存沙盒中高速推演未来 N 帧并返回指标差异报告：",
              "forkAndPredict(ticks, mutateFn) deep-clones the world and PRNG state, simulates N ticks ahead in isolation, and returns a delta report:"
            ),
          ],
          codeBlock: {
            lang: "typescript",
            code: `const preview = kernel.forkAndPredict(10, (forked) => {
  forked.rules.injectDsl(forked.tick, "OVERRIDE smoke IS calm", forked.ecs, forked.causal);
});

console.log(preview.deltaSummary);
// ["Burning entities: 3 -> 3", "Panicked agents: 2 -> 0", "Broken pipes: 1 -> 1"]`,
          },
        },
      ],
    },
    {
      slug: "runtime-plugins",
      chapterNumber: "06",
      category: L("RUNTIME SIMULATORS", "RUNTIME SIMULATORS"),
      title: L("六大解耦模拟器插件", "Six Decoupled Simulator Plugins"),
      subtitle: L(
        "化学、物理、逻辑、管网、社会 AI 与语义桥接器通过共享标量黑板实现零耦合联动。",
        "Chemistry, Physics, Logic, Logistics, Social AI, and Semantic LLM interact via a shared scalar blackboard."
      ),
      description: L(
        "cyberpsychosis-plugins 六大模拟器插件机制与自定义插件扩展指南。",
        "Reference for the six cyberpsychosis-plugins simulators and custom plugin authoring."
      ),
      specs: [
        { label: L("DIRECT IMPORTS", "DIRECT IMPORTS"), value: L("0 Between Plugins", "0 Between Plugins") },
        { label: L("SHARED PROPS", "SHARED PROPS"), value: L("temp · integrity · panic", "temp · integrity · panic") },
        { label: L("PLUGIN API", "PLUGIN API"), value: L("SimulatorPlugin<K>", "SimulatorPlugin<K>") },
      ],
      sections: [
        {
          id: "plugin-matrix",
          heading: L("6.1 六大插件职责与共享属性", "6.1 Plugin Responsibilities & Shared Properties"),
          paragraphs: [
            L(
              "所有插件仅实现 SimulatorPlugin 接口，互不导入，仅通过读写内核标量属性与标签触发跨界涌现：",
              "All plugins implement SimulatorPlugin without importing one another, coupling strictly through shared scalar properties and tags:"
            ),
          ],
          table: {
            headers: [
              L("插件", "Plugin"),
              L("模拟机制", "Mechanism"),
              L("共享属性与标签", "Shared Props & Tags"),
            ],
            rows: [
              [L("ChemistryPlugin", "ChemistryPlugin"), L("8 邻域热传导、85°C 引燃、浓烟派生、冷水灭火", "8-way heat conduction, 85°C ignition, smoke spawning"), L("temp, fuel, burning, smoke", "temp, fuel, burning, smoke")],
              [L("PhysicsPlugin", "PhysicsPlugin"), L("2D 刚体动量碰撞、可断裂桁架关节、135°C 冲击波与 Rapier2D 适配", "2D rigid-body impulse collisions, breakable truss joints, shockwaves & Rapier2D adapter"), L("mass, restitution, radius, integrity, joint", "mass, restitution, radius, integrity, joint")],
              [L("LogicRulePlugin", "LogicRulePlugin"), L("同步激活的元规则 Override 驱动全局属性映射", "Applies active meta-rule overrides across matching entities"), L("hot, cool, calm, calmAura", "hot, cool, calm, calmAura")],
              [L("LogisticsPlugin", "LogisticsPlugin"), L("有向管道流体输送、断管停流与上游背压累积", "Directed pipe flow, rupture cutoff, upstream backpressure"), L("temp, pressure, integrity, pipe", "temp, pressure, integrity, pipe")],
              [L("SocialAgentPlugin", "SocialAgentPlugin"), L("半径 4.5 威胁感知、信任边恐慌传染、效用 AI", "Radius 4.5 hazard sensing, trust-edge panic contagion"), L("panic, panicked, calmAura, social_trust", "panic, panicked, calmAura, social_trust")],
              [L("SemanticLlmPlugin", "SemanticLlmPlugin"), L("自然语言转受限 DSL、WorldFork 预览与安全注入", "Natural language to Restricted DSL + WorldFork verification"), L("DeclarativeRule, GlobalTagOverride", "DeclarativeRule, GlobalTagOverride")],
            ],
          },
        },
        {
          id: "rapier-rigid-body-bridge",
          heading: L("6.2 刚体物理与 Rapier2D 确定性桥接器", "6.2 Rigid-Body Impulse, Breakable Joints & Rapier2D Adapter"),
          paragraphs: [
            L(
              "PhysicsPlugin 同时内置零依赖的 2D 刚体动量解算器（支持质量、恢复系数、圆碰撞体与可断裂桁架关节 joint）以及标准 ExternalRigidBodyAdapter 接口。你可以直接挂载 @dimforge/rapier2d-deterministic-compat，将 WASM 物理快照无缝纳入内核的 Time-Travel 与 WorldFork 生命周期：",
              "PhysicsPlugin includes both a zero-dependency 2D rigid-body impulse solver (supporting mass, restitution, circle colliders, and breakable truss joints) and the ExternalRigidBodyAdapter interface for @dimforge/rapier2d-deterministic-compat:"
            ),
          ],
          codeBlock: {
            lang: "typescript",
            code: `import { PhysicsPlugin, ExternalRigidBodyAdapter } from "cyberpsychosis-plugins";

const rapierBridge: ExternalRigidBodyAdapter = {
  syncFromECS(kernel) { /* copy ECS transforms to Rapier bodies */ },
  step(dt) { world.step(eventQueue); return extractCollisionPairs(eventQueue); },
  syncToECS(kernel) { /* write solved Rapier transforms back to ECS */ },
  takeSnapshot() { return world.takeSnapshot(); }, // Uint8Array saved in Kernel Checkpoint!
  restoreSnapshot(bytes) { world = RAPIER.World.restoreSnapshot(bytes as Uint8Array); },
};

kernel.usePlugin(new PhysicsPlugin({ externalAdapter: rapierBridge }));`,
          },
        },
        {
          id: "custom-plugin",
          heading: L("6.3 编写自定义插件", "6.3 Writing a Custom Plugin"),
          paragraphs: [
            L(
              "实现 SimulatorPlugin 接口并通过 kernel.usePlugin() 挂载即可接入新的模拟维度：",
              "Implement SimulatorPlugin and register it via kernel.usePlugin() to add a new simulation domain:"
            ),
          ],
          codeBlock: {
            lang: "typescript",
            code: `import { EmergenceKernel, SimulatorPlugin } from "cyberpsychosis-core";

export class WeatherPlugin implements SimulatorPlugin<EmergenceKernel> {
  readonly id = "weather";
  readonly name = "Dynamic Rain Simulator";
  readonly tickInterval = 2;

  onTick(kernel: EmergenceKernel, tick: number): void {
    for (const id of kernel.ecs.queryByTags(["burning"])) {
      if (kernel.prng.next() < 0.25) {
        kernel.ecs.removeTag(id, "burning");
        kernel.causal.recordEvent({
          tick,
          domain: "chemistry",
          type: "weather:rain_extinguished",
          summary: \`Rain extinguished entity #\${id}\`,
          subjectIds: [id],
        });
      }
    }
  }
}`,
          },
        },
      ],
    },
    {
      slug: "renderers-and-api",
      chapterNumber: "07",
      category: L("RENDERERS & API", "RENDERERS & API"),
      title: L("零绑定渲染协议与 API", "Zero-Binding Snapshot & REST API"),
      subtitle: L(
        "纯 JSON WorldSnapshot 数据契约与 Web 实验室 HTTP 控制端点。",
        "Pure JSON WorldSnapshot data contract and Web Workbench HTTP control endpoints."
      ),
      description: L(
        "WorldSnapshot 渲染协议与 cyberpsychosis-web REST API 手册。",
        "WorldSnapshot rendering protocol and cyberpsychosis-web REST API manual."
      ),
      specs: [
        { label: L("SNAPSHOT FORMAT", "SNAPSHOT FORMAT"), value: L("Serializable JSON", "Serializable JSON") },
        { label: L("HTTP SERVER", "HTTP SERVER"), value: L("Zero-Dep node:http", "Zero-Dep node:http") },
        { label: L("ENDPOINTS", "ENDPOINTS"), value: L("7 REST Routes", "7 REST Routes") },
      ],
      sections: [
        {
          id: "snapshot-protocol",
          heading: L("7.1 WorldSnapshot 数据结构", "7.1 WorldSnapshot Contract"),
          paragraphs: [
            L(
              "所有渲染端只需消费 kernel.getSnapshot() 返回的纯 JSON 快照：",
              "Every renderer consumes the pure JSON snapshot returned by kernel.getSnapshot():"
            ),
          ],
          codeBlock: {
            lang: "typescript",
            code: `export interface WorldSnapshot {
  tick: number;
  seed: number;
  prngState: number;
  grid: { width: number; height: number };
  entities: SerializedEntity[];
  activeRules: ActiveRuleSummary[];
  overrides: GlobalTagOverride[];
  graphEdges: SerializedGraphEdge[];
  recentEvents: CausalNode[];
  metrics: {
    entityCount: number;
    burningCount: number;
    panickedAgentCount: number;
    logisticsThroughput: number;
    brokenPipeCount: number;
    activeRuleCount: number;
  };
}`,
          },
        },
        {
          id: "web-workbench-rest-api",
          heading: L("7.2 Web 工作台 REST 接口", "7.2 Web Workbench REST Endpoints"),
          paragraphs: [
            L(
              "cyberpsychosis-web 提供 7 个标准 HTTP 控制与溯源接口：",
              "cyberpsychosis-web exposes 7 HTTP endpoints for simulation control and causal inspection:"
            ),
          ],
          table: {
            headers: [
              L("路由", "Endpoint"),
              L("请求体", "Payload"),
              L("功能", "Function"),
            ],
            rows: [
              [L("GET /api/snapshot", "GET /api/snapshot"), L("—", "—"), L("返回当前帧 WorldSnapshot 与可用历史帧列表", "Returns current WorldSnapshot and checkpoint ticks")],
              [L("POST /api/step", "POST /api/step"), L('{ "count": 5 }', '{ "count": 5 }'), L("推进指定数量的确定性逻辑帧", "Advances N deterministic ticks")],
              [L("POST /api/rewind", "POST /api/rewind"), L('{ "tick": 2 }', '{ "tick": 2 }'), L("回滚到指定历史 Tick 快照", "Rewinds world state to target checkpoint tick")],
              [L("POST /api/push-word", "POST /api/push-word"), L('{ "preset": "WATER_IS_HOT" }', '{ "preset": "WATER_IS_HOT" }'), L("推动词块触发全局元规则重编译", "Pushes word block to recompile grid meta-rules")],
              [L("POST /api/inject-dsl", "POST /api/inject-dsl"), L('{ "input": "Make smoke calm" }', '{ "input": "Make smoke calm" }'), L("执行 WorldFork 安全预览并注入规则", "Runs WorldFork preview and injects compiled DSL")],
              [L("GET /api/causal/:id", "GET /api/causal/:id"), L("—", "—"), L("查询指定实体或事件的完整因果溯源链", "Traces root-to-leaf CausalLineageReport for target ID")],
              [L("POST /api/reset", "POST /api/reset"), L("{}", "{}"), L("重置沙盒至 Tick 0 初始状态", "Resets Micro Outpost sandbox to Tick 0")],
            ],
          },
        },
      ],
    },
    {
      slug: "npm-packages",
      chapterNumber: "08",
      category: L("ECOSYSTEM & NPM", "ECOSYSTEM & NPM"),
      title: L("NPM 软件包矩阵", "NPM Package Matrix"),
      subtitle: L(
        "6 个遵循 Apache-2.0 协议的模块化软件包，支持按层独立安装或全栈引入。",
        "Six modular Apache-2.0 packages designed for standalone headless import or full-stack launch."
      ),
      description: L(
        "Cyberpsychosis 6 个官方 npm 软件包清单与拓扑发版工作流。",
        "Cyberpsychosis official npm packages and topological publishing workflow."
      ),
      specs: [
        { label: L("PACKAGES", "PACKAGES"), value: L("6 Public Modules", "6 Public Modules") },
        { label: L("LICENSE", "LICENSE"), value: L("Apache-2.0", "Apache-2.0") },
        { label: L("MODULE TARGET", "MODULE TARGET"), value: L("ESM + TypeScript .d.ts", "ESM + TypeScript .d.ts") },
      ],
      sections: [
        {
          id: "package-list",
          heading: L("8.1 官方软件包清单", "8.1 Official NPM Packages"),
          paragraphs: [
            L(
              "各子包严格遵循单向依赖边界，可按项目需求自由组合：",
              "Packages follow strict unidirectional dependency boundaries:"
            ),
          ],
          table: {
            headers: [
              L("包名", "Package"),
              L("版本", "Version"),
              L("定位", "Role"),
              L("安装命令", "Install Command"),
            ],
            rows: [
              [L("cyberpsychosis", "cyberpsychosis"), L("0.1.0", "0.1.0"), L("全功能 SDK 重导出与 CLI 总入口", "Umbrella SDK re-export & CLI"), L("npm i cyberpsychosis", "npm i cyberpsychosis")],
              [L("cyberpsychosis-core", "cyberpsychosis-core"), L("0.1.0", "0.1.0"), L("零外部依赖的确定性涌现内核", "Zero-dependency emergence kernel"), L("npm i cyberpsychosis-core", "npm i cyberpsychosis-core")],
              [L("cyberpsychosis-plugins", "cyberpsychosis-plugins"), L("0.1.0", "0.1.0"), L("六大标准运行时模拟器插件集", "Six runtime simulator plugins"), L("npm i cyberpsychosis-plugins", "npm i cyberpsychosis-plugins")],
              [L("cyberpsychosis-demo", "cyberpsychosis-demo"), L("0.1.0", "0.1.0"), L("16×12 微缩生态站验证场景", "16×12 Micro Outpost scenario"), L("npm i cyberpsychosis-demo", "npm i cyberpsychosis-demo")],
              [L("cyberpsychosis-tui", "cyberpsychosis-tui"), L("0.1.0", "0.1.0"), L("终端 ASCII/ANSI 沙盒渲染器", "Terminal ASCII/ANSI sandbox"), L("npm i -g cyberpsychosis-tui", "npm i -g cyberpsychosis-tui")],
              [L("cyberpsychosis-web", "cyberpsychosis-web"), L("0.1.0", "0.1.0"), L("Web 涌现实验室工作台与 REST 服务", "Web Visual Workbench & REST server"), L("npm i -g cyberpsychosis-web", "npm i -g cyberpsychosis-web")],
            ],
          },
        },
        {
          id: "publish-workflow",
          heading: L("8.2 拓扑校验与发版命令", "8.2 Topological Verification & Publish"),
          paragraphs: [
            L(
              "仓库内置干跑校验脚本与按依赖拓扑顺序发布的自动化命令：",
              "Built-in scripts verify package exports and publish in topological dependency order:"
            ),
          ],
          codeBlock: {
            lang: "bash",
            code: `npm run publish:dry-run   # Verify all 6 package tarballs & types
npm run publish:all       # Publish in topological order (core -> plugins -> demo -> tui/web -> umbrella)`,
          },
        },
        {
          id: "performance-benchmarks-and-limits",
          heading: L("8.3 性能基准测试与实体规模边界 (npm run bench)", "8.3 Scaling Benchmarks & Entity Limits (npm run bench)"),
          paragraphs: [
            L(
              "通过空间网格桶索引（O(1) 邻接查询）、标签倒排索引与写时复制增量快照（Copy-on-Write Delta），单线程纯 TypeScript 内核在不同实体规模下的实测基准如下（运行 npm run bench 可在本机复现）：",
              "Powered by O(1) spatial grid buckets, inverted tag indices, and Copy-on-Write Delta snapshots, single-threaded TypeScript kernel benchmarks across four scaling tiers (reproducible via npm run bench):"
            ),
          ],
          table: {
            headers: [
              L("规模档位", "Scaling Tier"),
              L("网格与实体数", "Grid & Entities"),
              L("单帧耗时 (avgStepMs)", "Avg Step Latency"),
              L("吞吐帧率 (TPS)", "Throughput (TPS)"),
              L("增量快照压缩比", "Delta Compression"),
            ],
            rows: [
              [L("Micro (微缩沙盒)", "Micro (Sandbox)"), L("16×12 · 32 实体", "16×12 · 32 Entities"), L("0.44 ms/tick", "0.44 ms/tick"), L("~2,260 ticks/s", "~2,260 ticks/s"), L("2.89x", "2.89x")],
              [L("Standard (独立游戏)", "Standard (Indie Game)"), L("48×48 · 500 实体", "48×48 · 500 Entities"), L("3.40 ms/tick", "3.40 ms/tick"), L("~294 ticks/s", "~294 ticks/s"), L("4.37x", "4.37x")],
              [L("Large (殖民地模拟)", "Large (Colony Sim)"), L("96×96 · 2,000 实体", "96×96 · 2,000 Entities"), L("14.5 ms/tick", "14.5 ms/tick"), L("~68 ticks/s", "~68 ticks/s"), L("6.24x", "6.24x")],
              [L("Stress (高压极限)", "Stress (High-Density)"), L("128×128 · 5,000 实体", "128×128 · 5,000 Entities"), L("14.8 ms/tick", "14.8 ms/tick"), L("~67 ticks/s", "~67 ticks/s"), L("4.23x", "4.23x")],
            ],
          },
        },
      ],
    },
  ] satisfies ReadonlyArray<DocChapterPage>,
});
