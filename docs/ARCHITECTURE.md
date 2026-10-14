# 全局系统架构设计 (`docs/ARCHITECTURE.md`)

本文档定义 **Cyberpsychosis (`cyberpsychosis*`)** 的整体分层架构、核心抽象、数据流、五维涌现框架映射以及 `website/` 宣传文档站的架构规范。

---

## 1. 架构设计目标与原则

围绕《涌现式游戏标准定义与概念指南》的“真涌现公式”：

> **瘦 Vocabulary × 极简 Grammar × 瘦 Semantics × 胖 Runtime × 清晰 Renderer**

系统遵循五大工程原则：
1. **五维显式映射**：`Vocabulary`、`Grammar`、`Semantics`、`Runtime`、`Renderer` 均在代码中对应独立且边界清晰的模块。
2. **规则即实体（Rule-as-Entity）**：模拟规则与反应矩阵不是硬编码分支，而是存储在 ECS 世界中的一等公民实体，支持运行时动态合成、失效与热重载。
3. **跨插件零直接耦合**：各领域模拟器插件（化学、物理、逻辑、物流、社会、语义）互不引用，仅通过内核的 **共享属性组件（Shared Properties）** 与 **因果事件总线（Causal Event Bus）** 产生跨界涌现。
4. **严格确定性与可逆时间轴**：给定相同初始种子与输入指令流，任何平台上的模拟结果 100% 一致；内核原生支持快照环回放（Time-Travel）与平行世界分叉推演（World Fork）。
5. **Renderer 100% 零绑定**：内核与插件层不包含任何 DOM、Canvas 或终端 I/O 代码，仅输出标准化的 `WorldSnapshot` 与 `CausalNode` 数据流，同时驱动 TUI 与 Web 端。

---

## 2. 四层引擎架构与官网工作区全景

```text
+-----------------------------------------------------------------------------------+
| Layer 4: Renderers, CLI & Website                                                 |
|  - cyberpsychosis-tui : 终端 ANSI/ASCII 渲染器 + 键盘交互 + 因果树 CLI 面板         |
|  - cyberpsychosis-web : Web 多图层 Canvas + 时间轴回放 + 因果图 DAG + DSL 编辑器     |
|  - cyberpsychosis     : 一站式聚合 SDK 重导出与 CLI 入口 (npx cyberpsychosis)        |
|  - website/           : Cloudflare Worker (cyberpsychosis) 官方宣传与多章节文档网站  |
+-----------------------------------------------------------------------------------+
                                         ▲
                                         │ WorldSnapshot / CausalEvent / CommandAPI
                                         ▼
+-----------------------------------------------------------------------------------+
| Layer 3: Minimal Verification Demo (cyberpsychosis-demo)                          |
|  - Micro Outpost (16x12 微缩生态站)：声明式组装原子、初始规则与六大插件，提供跨维剧本  |
+-----------------------------------------------------------------------------------+
                                         ▲
                                         │ 声明式 DSL / TypeScript Builder API
                                         ▼
+-----------------------------------------------------------------------------------+
| Layer 2: Pluggable Runtime Simulators (cyberpsychosis-plugins)                    |
|  - ChemistryPlugin   : 温度传导、相变、接触反应矩阵、气体/火焰元胞自动机扩散           |
|  - PhysicsPlugin     : 2D 刚体动量碰撞、可断裂桁架关节 (joint)、冲击波、Rapier2D 适配 |
|  - LogicRulePlugin   : Baba 式空间词块序列检测 ([NOUN] [IS] [PROP]) -> 实时规则重编译  |
|  - LogisticsPlugin   : 有向图流网络求解、源/汇节点、容量背压、管网断裂级联拥塞        |
|  - SocialAgentPlugin : 效用 AI 决策、恐惧/士气情绪图传染、协作维修 vs 恐慌逃生        |
|  - SemanticLlmPlugin : 自然语言指令 -> 受限 DSL 编译 -> WorldFork 安全验证 -> 注入   |
+-----------------------------------------------------------------------------------+
                                         ▲
                                         │ SimulatorPlugin 接口 / 共享属性 / 因果事件
                                         ▼
+-----------------------------------------------------------------------------------+
| Layer 1: Emergence Core (cyberpsychosis-core)                                     |
|  - DeterministicECS      : 确定性属性存储 + 倒排标签索引 + O(1) 网格桶 + CoW 增量追踪   |
|  - VocabularyRegistry    : 原子 Tag、标量 Property Schema、Prefab 模板注册表         |
|  - GrammarMatcher        : 空间邻接 (Grid/Radius)、图边匹配 (Graph)、状态匹配器       |
|  - SemanticsExecutor     : 原子状态修改、实体派生/销毁、规则重写执行器               |
|  - RuleEngine & DSL      : Rule-as-Entity 编译器 + 受限 DSL 解析与安全沙盒校验器      |
|  - MultiModalSpatial     : Grid2D (网格桶) + Continuous2D (连续空间) + GraphTopology |
|  - CausalTracker & DAG   : 携带 CauseID 的事件总线 + 有向无环因果溯源图谱 + CoW 增量   |
|  - Lockstep & Replay     : FNV-1a StateHash + ReplayTape URL 编码 + Lockstep 回滚帧同步|
|  - EmergenceKernel       : 固定步长调度 + CoW Delta/Keyframe 快照环 + WorldFork/Bundle|
+-----------------------------------------------------------------------------------+
```

---

## 3. 模块依赖边界约束

- `cyberpsychosis-core` **不依赖**任何其他内部包或第三方重型运行时。
- `cyberpsychosis-plugins` **仅依赖** `cyberpsychosis-core`。
- `cyberpsychosis-demo` **仅依赖** `cyberpsychosis-core` 与 `cyberpsychosis-plugins`。
- `cyberpsychosis-tui` 与 `cyberpsychosis-web` **仅依赖** `cyberpsychosis-core`、`cyberpsychosis-plugins`、`cyberpsychosis-demo`，二者之间完全独立。
- `cyberpsychosis` 聚合导出上述 5 个子包并提供统一 CLI。
- `website/` 独立维护项目的五阶段视觉化宣传页面、8 章配图技术文档及合规法律页面（About / Terms / Privacy），每个页面与组件均配对独立的 `*.i18n.ts` 多语言字典（内置中文与英文，预留多语种扩展脚手架），通过 `designSystem.ts` 与 `lint-tokens.ts` 强制保证零硬编码视觉参数与零硬编码页面文案，并部署于 Cloudflare Worker `cyberpsychosis`。
