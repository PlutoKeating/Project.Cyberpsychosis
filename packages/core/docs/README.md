# `@emergence/core` — 通用涌现内核中间件

`@emergence/core` 是整个 Emergence Engine 的零外部依赖核心包。它将《涌现式游戏标准定义与概念指南》中的五维框架（Vocabulary、Grammar、Semantics、Runtime、Renderer 协议）显式编码为确定性的 TypeScript 核心抽象。

## 核心职责

1. **`DeterministicECS`**：确定性实体、标签（Tags）、连续标量属性（Properties）、元数据（Meta）与关系存储，支持完整深拷贝快照。
2. **`VocabularyRegistry`**：管理原子标签、属性上下界约束与实体原型（Prefab）注册与实例化。
3. **`GrammarMatcher` & `SemanticsExecutor`**：声明式拓扑模式匹配（网格邻接、连续空间半径、图连接、三连词块序列）与状态重写执行器。
4. **`RuleEngine` & `DslCompiler`**：实现“规则即实体（Rule-as-Entity）”实时重编译与受限 DSL 解析校验。
5. **`MultiModalSpatialIndex`**：统一维护 `Grid2D`、`Continuous2D` 与 `GraphTopology` 多模态空间索引。
6. **`CausalTracker`**：自动追踪跨系统状态变更的因果谱系（Causal Lineage DAG），支持按实体 ID 或事件 ID 反向溯源完整故事链。
7. **`EmergenceKernel`**：多频固定步长调度器、确定性随机数（`SeededPRNG`）、环形快照回放（`rewindTo`）与平行世界分叉推演（`forkAndPredict`）。
