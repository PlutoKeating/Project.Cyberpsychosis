# `cyberpsychosis-core` — 通用涌现内核中间件

`cyberpsychosis-core` 是整个 Cyberpsychosis 引擎的零外部依赖核心包。它将《涌现式游戏标准定义与概念指南》中的五维框架（Vocabulary、Grammar、Semantics、Runtime、Renderer 协议）显式编码为确定性的 TypeScript 核心抽象。

## 核心职责

1. **`DeterministicECS`**：确定性实体、倒排标签索引（Inverted Tag Index）、$O(1)$ 网格桶空间索引（Grid Buckets）、连续标量属性（Properties）、元数据（Meta）与写时复制增量帧记录（Copy-on-Write Frame Delta）。
2. **`VocabularyRegistry`**：管理原子标签、属性上下界约束与实体原型（Prefab）注册与实例化。
3. **`GrammarMatcher` & `SemanticsExecutor`**：声明式拓扑模式匹配（网格邻接、连续空间半径、图连接、三连词块序列）与状态重写执行器。
4. **`RuleEngine` & `DslCompiler`**：实现“规则即实体（Rule-as-Entity）”实时重编译与受限 DSL 解析校验。
5. **`MultiModalSpatialIndex`**：统一维护 `Grid2D`（基于网格桶 $O(1)$ 查询）、`Continuous2D`（空间分桶半径裁剪查询）与 `GraphTopology` 多模态空间索引。
6. **`CausalTracker`**：自动追踪跨系统状态变更的因果谱系（Causal Lineage DAG），内置追加式 CoW 增量快照，支持按实体 ID 或事件 ID 反向溯源完整故事链。
7. **`EmergenceKernel`**：多频固定步长调度器、确定性随机数（`SeededPRNG`）、32-bit FNV-1a 状态指纹（`getStateHash`）、周期关键帧 + CoW 增量帧时间旅行回放（`rewindTo`）、平行世界分叉推演（`forkAndPredict`）以及声明式 `WorldBundle` 热重载。
8. **`LockstepCoordinator` & `ReplayTape`**：基于逐字节确定性与状态指纹的 URL 故事分享编码器（`encodeReplayTapeToBase64Url`）与支持网络延迟自动回滚重演（Rollback & Resimulate）的多人帧同步协调器。
9. **`runScalingBenchmarks` (`bench.ts`)**：内置 Micro / Standard / Large / Stress 四档位（32 ~ 5,000 实体）性能基准测试套件。
