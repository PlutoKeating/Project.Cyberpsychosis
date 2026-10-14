# Emergence Engine (`@emergence/*`)

**通用涌现式游戏引擎内核中间件与可视化实验工作台**

> **真涌现设计公式**：
> **瘦 Vocabulary** × **极简 Grammar** × **瘦 Semantics** × **胖 Runtime** × **清晰 Renderer**

本项目旨在填补“通用涌现式游戏引擎中间件”的空白。通过组合高性能确定性 ECS 底座与自研的 **Emergence Core（涌现内核）**，向下统一调度六大可插拔模拟器插件（化学/元素、物理、逻辑/规则重编译、网络/物流、社会/Agent、语义/LLM），向上通过零绑定的状态快照与因果事件协议，同时驱动 **终端字符界面（ASCII/TUI）** 与 **Web 涌现实验室工作台**。

---

## 核心特性

1. **五维框架一等公民建模**
   - `VocabularyRegistry`：声明式定义原子标签（Tag）、正交标量属性（Property）与实体原型（Prefab）。
   - `GrammarMatcher`：统一支持 2D 网格邻接、连续空间半径、有向图连接以及 `[NOUN] [IS] [PROPERTY]` 句法序列匹配。
   - `SemanticsExecutor`：声明式反应矩阵与原子状态重写算子，支持 JSON/DSL 热重载与 TypeScript API 扩展。
2. **内核级“规则即实体”（Rule-as-Entity）动态重编译**
   - 模拟规则本身作为 ECS 中的特殊实体存在；空间词块移动或 DSL 注入可实时重编译当前帧的全局/局部物理、化学与逻辑规则。
3. **跨模态解耦通信：共享属性黑板 + 因果事件总线（Causal DAG）**
   - 各模拟器插件零直接依赖，通过共享通用标量组件（如 `temperature`、`integrity`、`panic`）与携带 `causeId` 的因果事件总线联动。
   - 内置一等公民**有向无环因果图（Causal Lineage DAG）**，支持任意结果实体的完整起因链回溯与故事生成。
4. **严格确定性、时间旅行回放与平行世界分叉（World Fork）**
   - 基于固定步长（Fixed-Tick）与受控种子 PRNG（Mulberry32），内置 `SnapshotRingBuffer` 支持任意帧倒带回放。
   - 支持后台极速 `forkAndSimulate(ticks)` 平行推演未来状态，用于验证新注入规则的安全性与涌现趋势预测。
5. **六大模拟器插件与唯一极简综合验证场景**
   - 内置 **化学/元素（CA）**、**物理（刚体/力场）**、**逻辑/规则（Baba式重编译）**、**网络/物流（有向流与背压）**、**社会/Agent（效用AI与情绪传染）**、**语义桥接（LLM $\rightarrow$ 受限 DSL $\rightarrow$ ECS，自带离线确定性 Mock）**。
   - 提供 `@emergence/demo-minimal`（微缩生态站 Micro Outpost），在同一张 16×12 沙盒中完整串联六大涌现机制。
6. **Renderer 零绑定：双官方渲染端（TUI + Web Workbench）**
   - `@emergence/renderer-tui`：终端 ANSI/ASCII 实时交互沙盒與因果检查器。
   - `@emergence/renderer-web`：浏览器端多图层 Canvas 画布、时间轴控制器、因果图溯源面板、World Fork 预览与实时 DSL 编辑器。

---

## 仓库目录结构

```text
Project.Cyberpsychosis/
├── AGENTS.md                        # Agent 工程开发规范
├── REQUIREMENTS.md                  # 需求背景与现有开源方案盘点
├── README.md                        # 项目总览
├── .env.example                     # 环境变量模板
├── package.json                     # Monorepo 工作区与脚本入口
├── tsconfig.base.json               # TypeScript 严格编译基线
├── docs/
│   ├── 涌现式游戏标准定义与概念指南.md # 涌现式游戏五维理论指南
│   ├── ARCHITECTURE.md              # 全局系统架构设计文档
│   ├── API.md                       # 核心模块、DSL 与渲染协议 API 手册
│   └── QUICK_START.md               # 快速启动、测试与调试指南
└── packages/
    ├── core/                        # [@emergence/core] 涌现内核中间件
    ├── plugins/                     # [@emergence/plugins] 六大可插拔模拟器插件
    ├── demo-minimal/                # [@emergence/demo-minimal] 极简综合验证场景
    ├── renderer-tui/                # [@emergence/renderer-tui] 终端 ASCII/TUI 沙盒端
    └── renderer-web/                # [@emergence/renderer-web] Web 涌现实验室工作台
```

---

## 快速体验

详见 [`docs/QUICK_START.md`](./docs/QUICK_START.md)：

```bash
# 1. 安装依赖
npm install

# 2. 运行全量类型检查与单元测试
npm test

# 3. 启动终端 ASCII/TUI 涌现沙盒
npm run start:tui

# 4. 启动 Web 涌现实验室工作台 (默认 http://localhost:4173)
npm run start:web
```
