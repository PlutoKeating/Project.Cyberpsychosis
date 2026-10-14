# `@emergence/plugins` 架构与跨模态交互矩阵

## 跨插件解耦交互矩阵

| 源插件 | 写入的共享属性 / 标签 | 派发的因果事件类型 | 下游响应插件 |
| :--- | :--- | :--- | :--- |
| **`LogicRulePlugin`** | `hot` / `cool` / `calm` 标签，`temp` | `logic:rule_compiled` | `LogisticsPlugin`、`ChemistryPlugin`、`SocialAgentPlugin` |
| **`LogisticsPlugin`** | `temp`（向发电机输送冷/热流）、`pressure` | `logistics:thermal_surge`、`logistics:pipe_severed` | `ChemistryPlugin`、`PhysicsPlugin` |
| **`ChemistryPlugin`** | `temp`、`burning` 标签、派生 `smoke` 实体 | `chemistry:ignited`、`chemistry:smoke_emitted` | `PhysicsPlugin`、`SocialAgentPlugin` |
| **`PhysicsPlugin`** | `(vx, vy)` 刚体动量冲量、`integrity`、`broken` 标签、`joint` 断裂 | `physics:explosion`、`physics:collision_impact`、`physics:joint_snapped`、`physics:structure_broken` | `LogisticsPlugin`、`SocialAgentPlugin` |
| **`SocialAgentPlugin`** | `panic`、`panicked` 标签、NPC 移动坐标 | `social:agent_panicked`、`social:panic_contagion`、`social:agent_calmed` | 渲染端与因果故事生成器 |
| **`SemanticLlmPlugin`** | 注入 `DeclarativeRule` 或 `GlobalTagOverride` | `semantic:dsl_injected` | 全部插件实时生效 |
