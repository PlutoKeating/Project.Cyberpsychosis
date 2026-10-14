# 快速启动与验证指南 (`docs/QUICK_START.md`)

本文档说明如何在本地安装、构建、测试并运行 **Emergence Engine** 的终端 TUI 沙盒与 Web 涌现实验室工作台。

---

## 1. 环境要求

- **Node.js**：`>= 20.0.0`（当前开发环境为 `v24.16.0`）
- **npm**：`>= 10.0.0`（支持 `npm workspaces`）
- **操作系统**：Linux / macOS / Windows

---

## 2. 安装与构建

```bash
# 1. 安装工作区依赖（零臃肿外部运行时依赖，开箱即用）
npm install

# 2. 编译所有子包 TypeScript 源码
npm run build

# 3. 运行类型检查
npm run typecheck

# 4. 运行全量单元测试与跨维度涌现集成测试
npm test
```

---

## 3. 启动极简验证 Demo（双渲染端）

本项目内置唯一高内聚综合验证场景 **`@emergence/demo-minimal`（Micro Outpost 微缩生态站）**，可通过以下任意一种渲染端启动：

### 3.1 方式一：启动终端字符界面（ASCII / ANSI TUI）

```bash
# 交互式 TUI 模式（或使用 --headless-demo 自动演示完整跨维度涌现链并打印因果树）
npm run start:tui

# 自动运行剧本演示并输出 ASCII 快照与因果溯源报告（适合 CI 或非交互式终端）
npm run demo:tui
```

**TUI 交互按键**：
- `Space` / `Enter`：单步推进 1 Tick
- `n`：连续推进 5 Ticks
- `b`：触发逻辑涌现（将词块推成 `WATER IS HOT`，改写全局水属性）
- `s`：触发语义涌现（注入自然语言/受限 DSL 规则，如令烟雾安抚恐慌 NPC）
- `r`：时光倒流（回退 5 Ticks）
- `c`：查看当前最新危机事件的完整因果溯源树（Causal Lineage DAG）
- `q`：退出

### 3.2 方式二：启动 Web 涌现实验室工作台（Emergence Lab Workbench）

```bash
npm run start:web
```

启动后访问 `http://localhost:4173`，即可使用：
1. **16×12 多图层可视化画布**：实时观察管道水流、逻辑词块、火焰蔓延、爆炸冲击波与 NPC 移动；
2. **时间旅行控制栏**：支持单步、自动播放、时光倒流滑块回放（Time-Travel Rewind）；
3. **跨界涌现触发器与 DSL 热编辑台**：一键推动词块改写 `[WATER] [IS] [HOT]`、输入自然语言/DSL 编译注入新规则，并查看 **World Fork（平行世界未来 15 帧预测报告）**；
4. **因果溯源检查器（Causal DAG Inspector）**：点击任意实体或事件，直接展开触发它的完整跨系统因果依赖链。
