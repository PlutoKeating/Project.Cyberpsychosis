# Cyberpsychosis (`cyberpsychosis*`)

**通用涌现式游戏引擎内核中间件、双端可视化工作台与官方宣传文档站**

> **真涌现设计公式**：
> **瘦 Vocabulary** × **极简 Grammar** × **瘦 Semantics** × **胖 Runtime** × **清晰 Renderer**

**Cyberpsychosis** 旨在填补“通用涌现式游戏引擎中间件”的空白。通过组合高性能确定性 ECS 底座与自研的 **`cyberpsychosis-core`（涌现内核）**，向下统一调度六大可插拔模拟器插件（化学/元素、物理、逻辑/规则重编译、网络/物流、社会/Agent、语义/LLM），向上通过零绑定的状态快照与因果事件协议，同时驱动 **终端字符界面（`cyberpsychosis-tui`）** 与 **Web 涌现实验室工作台（`cyberpsychosis-web`）**。

---

## 核心特性

1. **五维框架一等公民建模**
   - `VocabularyRegistry`：声明式定义原子标签（Tag）、正交标量属性（Property）与实体原型（Prefab）。
   - `GrammarMatcher`：统一支持 2D 网格邻接、连续空间半径、有向图连接以及 `[NOUN] [IS] [PROPERTY]` 句法序列匹配。
   - `SemanticsExecutor`：声明式反应矩阵与原子状态重写算子，支持 JSON/DSL 热重载与 TypeScript API 扩展。
2. **内核级“规则即实体”（Rule-as-Entity）动态重编译**
   - 模拟规则本身作为 ECS 中的特殊实体存在；空间词块移动或 DSL 注入可实时重编译当前帧的全局/局部物理、化学与逻辑规则。
3. **跨模态解耦通信：共享属性黑板 + 因果事件总线（Causal DAG）**
   - 各模拟器插件零直接依赖，通过共享通用标量组件（如 `temp`、`integrity`、`panic`）与携带 `causeId` 的因果事件总线联动。
   - 内置一等公民**有向无环因果图（Causal Lineage DAG）**，支持任意结果实体的完整起因链回溯与故事生成。
4. **严格确定性、时间旅行回放与平行世界分叉（World Fork）**
   - 基于固定步长（Fixed-Tick）与受控种子 PRNG（Mulberry32），内置快照环缓冲区支持任意帧倒带回放（`rewindTo`）。
   - 支持后台极速 `forkAndPredict(ticks)` 平行推演未来状态，用于验证新注入规则的安全性与涌现趋势预测。
5. **六大模拟器插件与唯一极简综合验证场景**
   - 内置 **化学/元素（CA）**、**物理（刚体/力场）**、**逻辑/规则（Baba式重编译）**、**网络/物流（有向流与背压）**、**社会/Agent（效用AI与情绪传染）**、**语义桥接（LLM $\rightarrow$ 受限 DSL $\rightarrow$ ECS，自带离线确定性编译器）**。
   - 提供 `cyberpsychosis-demo`（微缩生态站 Micro Outpost），在同一张 16×12 沙盒中完整串联六大涌现机制。
6. **Renderer 零绑定：双官方渲染端（TUI + Web Workbench）**
   - `cyberpsychosis-tui`：终端 ANSI/ASCII 实时交互沙盒与因果检查器。
   - `cyberpsychosis-web`：浏览器端多图层 Canvas 画布、时间轴控制器、因果图溯源面板、WorldFork 预览与实时 DSL 编辑器。
7. **官方宣传与多章节文档站（`website/`）**
   - 托管于 Cloudflare Workers（Worker 名称：`cyberpsychosis`），全站复用 `plutokeating.beer` 设计系统与模块化 `*.i18n.ts` 中英双语架构（构建期强制零硬编码视觉参数与零硬编码页面文案校验），包含五阶段视觉化 Landing Page（H5 实时涌现画布、SVG 六维因果图、双端真实运行截图画廊、六大机制动效卡片、四层架构蓝图）、8 章配图技术文档、关于我们、服务条款与隐私政策。

---

## 仓库目录结构

```text
Project.Cyberpsychosis/
├── AGENTS.md                        # Agent 工程开发规范
├── REQUIREMENTS.md                  # 需求背景与现有开源方案盘点
├── LICENSE                          # Apache-2.0 开源许可证
├── README.md                        # 项目总览
├── .env.example                     # 环境变量模板
├── package.json                     # Monorepo 工作区与脚本入口
├── tsconfig.base.json               # TypeScript 严格编译基线
├── .github/workflows/               # CI/CD 与 npmjs 自动化发版流水线
├── docs/
│   ├── 涌现式游戏标准定义与概念指南.md # 涌现式游戏五维理论指南
│   ├── ARCHITECTURE.md              # 全局系统架构设计文档
│   ├── API.md                       # 核心模块、DSL 与渲染协议 API 手册
│   └── QUICK_START.md               # 快速启动、测试、网站构建与发版指南
├── packages/
│   ├── core/                        # [cyberpsychosis-core] 涌现内核中间件
│   ├── plugins/                     # [cyberpsychosis-plugins] 六大可插拔模拟器插件
│   ├── demo-minimal/                # [cyberpsychosis-demo] 极简综合验证场景
│   ├── renderer-tui/                # [cyberpsychosis-tui] 终端 ASCII/TUI 沙盒端
│   ├── renderer-web/                # [cyberpsychosis-web] Web 涌现实验室工作台
│   └── cyberpsychosis/              # [cyberpsychosis] 一站式聚合 SDK 与 CLI 主包
└── website/                         # 官方宣传与多章节文档网站 (Cloudflare Worker: cyberpsychosis)
```

---

## 快速体验

详见 [`docs/QUICK_START.md`](./docs/QUICK_START.md)：

```bash
# 1. 安装依赖
npm install

# 2. 运行全量类型检查、设计系统校验与单元测试
npm test

# 3. 启动终端 ASCII/TUI 涌现沙盒 (自动剧本模式)
npm run demo:tui

# 4. 启动 Web 涌现实验室工作台 (默认 http://localhost:4173)
npm run start:web

# 5. 构建并预览官方宣传与文档网站
npm run site:build
```

---

## 开源许可

本项目采用 [Apache License 2.0](./LICENSE) 开源许可协议。
