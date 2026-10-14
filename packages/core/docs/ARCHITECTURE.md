# `cyberpsychosis-core` 内部架构设计

## 1. 模块组成与职责边界

```text
packages/core/src/
├── types.ts        # 公共类型、快照协议、ReplayTape、WorldBundle 与插件接口定义
├── prng.ts         # Mulberry32 受控种子确定性随机数生成器
├── ecs.ts          # 确定性 ECS 容器、倒排标签索引、O(1) 网格桶与 CoW 增量追踪
├── spatial.ts      # Grid2D + Continuous2D + GraphTopology 多模态空间索引
├── causal.ts       # 因果事件总线、有向无环因果图 (Causal DAG) 与追加式 CoW 增量
├── vocabulary.ts   # 原子属性约束与 Prefab 原型注册表
├── grammar.ts      # 空间邻接、半径、图边、三连句法模式匹配器
├── semantics.ts    # 原子状态修改与因果自动关联执行器
├── rules.ts        # 规则即实体重编译器 (Baba式词块扫描) 与受限 DSL 编译器
├── kernel.ts       # 内核主控循环、CoW Delta/Keyframe 快照环、StateHash、WorldFork 与 WorldBundle
├── lockstep.ts     # Lockstep 帧同步回滚协调器与 ReplayTape Base64URL 编解码器
├── bench.ts        # 四档位实体规模 (32 ~ 5,000 实体) 性能与快照压缩基准测试
└── index.ts        # 统一导出入口
```

## 2. 确定性单帧执行流水线（Single-Tick Pipeline）

每次调用 `kernel.step()` 时，严格按以下确定性顺序执行：

1. **Tick 递增 (`tick + 1`)**。
2. **规则即实体重编译 (`rules.syncDynamicRules`)**：
   - 扫描 2D 网格上所有携带 `word_noun`、`word_verb`、`word_prop` 的规则词块实体；
   - 若拼出合法横/竖三连（如 `[WATER] [IS] [HOT]`），动态激活对应的全局属性覆盖与衍生规则；若词块被推开，则自动撤销该动态规则并恢复基线标签。
3. **声明式规则匹配与执行 (`rules.evaluateDeclarativeRules`)**：
   - 按 `priority` 降序遍历所有激活的声明式规则（包含静态规则、实体规则与 DSL 注入规则）；
   - 由 `GrammarMatcher` 查找匹配的 `(subject, target)` 对，交由 `SemanticsExecutor` 执行状态修改并写入 `CausalTracker`。
4. **可插拔模拟器调度 (`plugins.onTick`)**：
   - 按插件注册顺序调用满足 `tick % plugin.tickInterval === 0` 的模拟器插件（化学 $\rightarrow$ 物理 $\rightarrow$ 逻辑 $\rightarrow$ 物流 $\rightarrow$ 社会 $\rightarrow$ 语义）。
5. **环形快照归档 (`snapshotRingBuffer.push`)**：
   - 将当前帧完整状态归档，支持随时 `rewindTo(tick)`。
