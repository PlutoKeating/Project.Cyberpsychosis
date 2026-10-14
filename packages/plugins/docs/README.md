# `cyberpsychosis-plugins` — 六大可插拔涌现模拟器插件集

`cyberpsychosis-plugins` 提供六个遵循 `SimulatorPlugin` 接口的标准运行时模拟器插件。所有插件之间 **100% 零直接引用**，仅通过 `cyberpsychosis-core` 的共享标量属性黑板（`temp`、`integrity`、`panic`、`pressure`、`mass`、`restitution`、`radius`）与因果事件总线（`CausalTracker`）协同工作。

## 包含插件

1. **`ChemistryPlugin`（化学/元素涌现）**：热传导、燃点引燃、燃料消耗、烟雾生成与冷却灭火。
2. **`PhysicsPlugin`（刚体与冲击波物理涌现）**：
   - 内置零依赖 **2D 刚体动量碰撞解算器**（支持质量 `mass`、恢复系数 `restitution`、碰撞半径 `radius`）与 **可断裂结构桁架关节（`joint` 边拉伸应力断裂 `physics:joint_snapped`）**；
   - 支持过热/超压爆炸冲击波、径向冲量推力与结构完整度坍塌；
   - 提供标准 `ExternalRigidBodyAdapter` 接口，支持挂载 `@dimforge/rapier2d-deterministic-compat` 等 WASM 刚体引擎并自动同步 `takeSnapshot()` / `restoreSnapshot()` 以支持 Time-Travel 与 WorldFork。
3. **`LogicRulePlugin`（逻辑/规则涌现）**：配合内核词块序列扫描，实时重编译元规则并驱动衍生属性传播。
4. **`LogisticsPlugin`（网络/物流涌现）**：有向管网流计算、冷却剂/热源输送、管线断裂级联中断与上游背压累积。
5. **`SocialAgentPlugin`（社会/叙事涌现）**：NPC 危险感知、效用 AI 状态切换（协作维修 vs 恐慌逃生）、社交关系图情绪传染。
6. **`SemanticLlmPlugin`（语义涌现桥接器）**：自然语言指令 $\rightarrow$ 受限 DSL 编译 $\rightarrow$ `WorldFork` 平行世界安全推演 $\rightarrow$ 运行时注入（内置离线确定性编译器与在线 LLM API 双模式）。
