# `@emergence/plugins` — 六大可插拔涌现模拟器插件集

`@emergence/plugins` 提供六个遵循 `SimulatorPlugin` 接口的标准运行时模拟器插件。所有插件之间 **100% 零直接引用**，仅通过 `@emergence/core` 的共享标量属性黑板（`temp`、`integrity`、`panic`、`pressure`）与因果事件总线（`CausalTracker`）协同工作。

## 包含插件

1. **`ChemistryPlugin`（化学/元素涌现）**：热传导、燃点引燃、燃料消耗、烟雾生成与冷却灭火。
2. **`PhysicsPlugin`（物理涌现）**：过热/超压爆炸冲击波、径向冲量推力、结构完整度损伤与坍塌。
3. **`LogicRulePlugin`（逻辑/规则涌现）**：配合内核词块序列扫描，实时重编译元规则并驱动衍生属性传播。
4. **`LogisticsPlugin`（网络/物流涌现）**：有向管网流计算、冷却剂/热源输送、管线断裂级联中断与上游背压累积。
5. **`SocialAgentPlugin`（社会/叙事涌现）**：NPC 危险感知、效用 AI 状态切换（协作维修 vs 恐慌逃生）、社交关系图情绪传染。
6. **`SemanticLlmPlugin`（语义涌现桥接器）**：自然语言指令 $\rightarrow$ 受限 DSL 编译 $\rightarrow$ `WorldFork` 平行世界安全推演 $\rightarrow$ 运行时注入（内置离线确定性编译器与在线 LLM API 双模式）。
