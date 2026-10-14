# `cyberpsychosis-web` — Web 涌现实验室工作台（Emergence Lab Workbench）

`cyberpsychosis-web` 是 Cyberpsychosis 引擎的官方可视化调试与实验工作台。它通过零耦合的 HTTP JSON 快照与因果图谱协议连接 `cyberpsychosis-demo` 与 `cyberpsychosis-core`，提供直观的浏览器交互体验。

## 核心功能

1. **多图层交互式 2D 画布（Canvas）**：
   - 底层：16×12 坐标网格与温度场热力渲染；
   - 中层：物流管网（实线流动/断管告警）与社交信任图（`social_trust` 连线）拓扑叠加；
   - 顶层：实体符号、状态光环（燃烧/恐慌/镇静）与点选高亮。
2. **时间旅行控制器（Time-Travel Debugger）**：
   - 支持单步 Tick、连续步进、自动播放，以及任意历史 Checkpoint 帧滑块回溯（`rewindTo`）。
3. **跨界涌现触发器、Prefab 画笔、可视化规则构建器与 URL 故事分享**：
   - 一键推动词块触发 `[WATER] [IS] [HOT]` 元规则重编译；
   - 支持 Prefab 画笔直接在网格上放置实体、Visual Rule Builder 下拉式构建反应规则、导出热重载 `WorldBundle` JSON，以及一键生成 `?replay=...` 确定性故事回放链接。
4. **因果溯源检查器（Causal Lineage DAG Inspector）**：
   - 点击画布上任意实体或右侧事件流，实时展开跨领域的完整因果树。
