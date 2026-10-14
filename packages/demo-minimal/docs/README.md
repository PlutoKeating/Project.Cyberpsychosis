# `cyberpsychosis-demo` — 微缩生态站（Micro Outpost）极简综合验证场景

`cyberpsychosis-demo` 是本引擎的唯一高内聚综合验证场景（16×12 网格）。它在零 UI 绑定的前提下，将化学、2D 刚体/桁架关节物理、逻辑重编译、物流管网、社会 Agent 与语义 DSL 桥接器组装在同一个确定性世界中，用于端到端验证“跨模态级联涌现”与“因果图谱自动溯源”。

## 核心验证链路

1. **稳态阶段**：网格上方词块排列为 `[WATER] [IS] [COOL]`，水泵通过物流管道向发电机输送冷却水，发电机温度稳定在安全区间，两名工程师（Alpha 与 Beta）正常维护站点。
2. **逻辑涌现触发（Baba 式）**：调用 `triggerLogicShiftWaterIsHot()` 将词块改推为 `[WATER] [IS] [HOT]`，内核实时重编译规则，全局水体变为高温热源。
3. **物流 + 化学 + 刚体物理级联**：管道将高温水泵入发电机引发热失控（`logistics:thermal_surge`）$\rightarrow$ 引燃周边油桶并释放浓烟（`chemistry:ignited` / `chemistry:smoke_emitted`）$\rightarrow$ 发电机过热爆炸产生冲击波，震碎冷却管道并推飞刚体货箱 `CargoCrate`，拉断支撑桁架关节 `joint:strut->crate`（`physics:explosion` / `physics:structure_broken` / `physics:joint_snapped`）$\rightarrow$ 物流管网断流背压飙升（`logistics:pipe_severed`）。
4. **社会涌现级联**：工程师 Alpha 因近距离火灾与爆炸陷入恐慌逃跑（`social:agent_panicked`），并通过 `social_trust` 社交关系边将恐慌传染给远处的工程师 Beta（`social:panic_contagion`）。
5. **语义涌现干预（LLM $\rightarrow$ 受限 DSL $\rightarrow$ WorldFork）**：输入自然语言 `"Make smoke calm"`，经 `WorldFork` 平行世界推演验证安全后编译为 `OVERRIDE smoke IS calm`，火场浓烟转变为镇静气场，两名工程师恢复镇定。
