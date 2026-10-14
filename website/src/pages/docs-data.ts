import type { DocChapterPage } from "../components/docs-layout.ts";

export const DOC_CHAPTER_PAGES: ReadonlyArray<DocChapterPage> = [
  {
    slug: "",
    chapterNumber: "01",
    category: "FOUNDATION",
    title: "概览与五维涌现架构",
    subtitle: "为什么涌现式游戏需要一层专门的“胖 Runtime 内核中间件”，以及五维公式如何映射为工程代码。",
    description: "Cyberpsychosis 涌现式游戏引擎核心设计理念、五维分析框架与四层架构全景。",
    sections: [
      {
        id: "what-is-cyberpsychosis",
        heading: "1.1 什么是 Cyberpsychosis 涌现引擎",
        paragraphs: [
          "在传统内容驱动游戏中，玩家体验到的是设计师一笔一画预设的关卡与剧情；而在涌现式游戏（Emergent Gameplay，如 Noita、Baba Is You、Dwarf Fortress、Factorio）中，乐趣来自于简单原子规则在运行时碰撞出的意外结果。",
          "Cyberpsychosis 旨在填补开源界“通用涌现式游戏引擎中间件”的空白。我们不重复造底层的渲染轮子，而是专注于提供一层薄而强大的确定性涌现内核（cyberpsychosis-core）与六大可插拔模拟器插件（cyberpsychosis-plugins）。"
        ],
        bullets: [
          "五维显式建模：Vocabulary、Grammar、Semantics、Runtime、Renderer 各自对应独立模块；",
          "规则即实体（Rule-as-Entity）：模拟规则本身存储在 ECS 世界中，支持运行时实时重编译；",
          "跨模态因果溯源：内置有向无环因果图（Causal DAG），自动回答“为什么会发生这件事”；",
          "零绑定双端渲染：同一套世界快照流同时驱动终端 ASCII/TUI 与 Web 涌现实验室工作台。"
        ]
      },
      {
        id: "five-dimension-formula",
        heading: "1.2 真涌现设计公式与代码映射",
        paragraphs: [
          "根据《涌现式游戏标准定义与概念指南》，高杠杆涌现系统遵循核心公式：瘦 Vocabulary × 极简 Grammar × 瘦 Semantics × 胖 Runtime × 清晰 Renderer。"
        ],
        table: {
          headers: ["维度 (Dimension)", "理论定义", "Cyberpsychosis 对应模块", "核心职责"],
          rows: [
            ["Vocabulary", "玩家能操作的原子单元", "VocabularyRegistry", "注册正交 Tag、标量属性上下界与 Prefab 原型"],
            ["Grammar", "单元怎么组合才合法", "GrammarMatcher", "支持 2D 网格邻接、连续空间半径、图拓扑边、三连句法匹配"],
            ["Semantics", "组合意味着什么状态变化", "SemanticsExecutor", "执行原子属性增减、标签赋予、实体派生与因果记录"],
            ["Runtime", "世界怎么运行与跨系统模拟", "EmergenceKernel + 6 Plugins", "确定性 Tick 调度、Rule-as-Entity 重编译、快照回放与平行分叉"],
            ["Renderer", "玩家如何清晰读懂涌现结果", "WorldSnapshot + Causal DAG", "零耦合输出 JSON 快照流，驱动 TUI 与 Web 多图层工作台"]
          ]
        }
      },
      {
        id: "four-layer-architecture",
        heading: "1.3 四层解耦架构全景",
        paragraphs: [
          "整个系统自底向上分为四层：Layer 1 涌现内核（cyberpsychosis-core）、Layer 2 可插拔模拟器插件（cyberpsychosis-plugins）、Layer 3 极简综合验证沙盒（cyberpsychosis-demo）、以及 Layer 4 零绑定渲染与调试端（cyberpsychosis-tui / cyberpsychosis-web）。"
        ],
        codeBlock: {
          lang: "text",
          code: `Layer 4: Renderers & Inspectors (cyberpsychosis-tui / cyberpsychosis-web)
  ▲  WorldSnapshot / CausalLineageReport / REST & CLI Commands
Layer 3: Verification Scenario (cyberpsychosis-demo: 16x12 Micro Outpost)
  ▲  Declarative DSL & Prefab Assembly
Layer 2: Pluggable Simulators (cyberpsychosis-plugins: Chemistry/Physics/Logic/Logistics/Social/Semantic)
  ▲  Shared Scalar Properties (temp, integrity, panic) + Causal Event Bus
Layer 1: Emergence Kernel (cyberpsychosis-core: ECS, RuleEngine, SpatialIndex, CausalTracker, WorldFork)`
        }
      }
    ]
  },
  {
    slug: "quick-start",
    chapterNumber: "02",
    category: "GETTING STARTED",
    title: "快速开始与 CLI 工作台",
    subtitle: "5 分钟内在本地或通过 npx 体验跨维度涌现模拟、终端 TUI 沙盒与 Web 可视化实验室。",
    description: "安装与运行 Cyberpsychosis CLI、终端 TUI 沙盒以及 Web 涌现实验室工作台的完整指南。",
    sections: [
      {
        id: "npx-instant-run",
        heading: "2.1 使用 npx 一键运行演示",
        paragraphs: [
          "如果你只需要立即体验微缩生态站（Micro Outpost）的六大涌现级联反应，可以直接通过 npx 运行官方主包："
        ],
        codeBlock: {
          lang: "bash",
          code: `# 在终端自动推演完整跨维涌现剧本并输出 ASCII 状态图与因果溯源树
npx cyberpsychosis demo

# 启动交互式终端 ASCII/TUI 沙盒
npx cyberpsychosis-tui

# 启动浏览器端 Web 涌现实验室工作台 (默认监听 http://localhost:4173)
npx cyberpsychosis web`
        }
      },
      {
        id: "monorepo-build",
        heading: "2.2 从源码构建与本地测试",
        paragraphs: [
          "克隆 GitHub 仓库后，使用 Node.js (>= 20.0.0) 与 npm workspaces 即可完成全量构建、设计系统校验与端到端测试："
        ],
        codeBlock: {
          lang: "bash",
          code: `git clone https://github.com/PlutoKeating/Project.Cyberpsychosis.git
cd Project.Cyberpsychosis

# 1. 安装依赖
npm install

# 2. 编译所有子包并构建官网静态产物
npm run build

# 3. 运行全量类型检查与单元测试
npm test

# 4. 启动 TUI 或 Web 涌现实验室
npm run start:tui
npm run start:web`
        }
      },
      {
        id: "tui-controls",
        heading: "2.3 终端 TUI 交互快捷键",
        paragraphs: [
          "在交互式 TUI 模式（npm run start:tui）中，你可以通过键盘实时操纵世界时间轴与规则："
        ],
        table: {
          headers: ["按键 (Key)", "动作 (Action)", "触发的涌现机制"],
          rows: [
            ["Space / Enter", "单步推进 1 Tick", "执行一帧完整的规则重编译与六大插件模拟"],
            ["n", "连续推进 5 Ticks", "快进观察连锁反应演化"],
            ["b", "推动词块 [WATER IS HOT]", "触发 Baba 式逻辑重编译，将冷却水变为高温热源"],
            ["s", "注入语义规则 'Make smoke calm'", "通过 SemanticLlmPlugin 与 WorldFork 安全校验注入镇静烟雾规则"],
            ["r", "时光倒流 (Rewind 3 Ticks)", "从环形快照缓冲区恢复历史状态"],
            ["c", "展开因果溯源图谱 (Causal DAG)", "输出当前危机实体的完整跨系统起因链"],
            ["q", "退出程序", "安全恢复终端模式并退出"]
          ]
        }
      }
    ]
  },
  {
    slug: "core-kernel",
    chapterNumber: "03",
    category: "CORE ARCHITECTURE",
    title: "确定性涌现内核与多模态空间",
    subtitle: "深入 cyberpsychosis-core：DeterministicECS、五维原语注册表与三种空间拓扑索引。",
    description: "详解 Cyberpsychosis 内核的确定性 ECS 存储、属性上下界钳制以及 Grid2D、Continuous2D、GraphTopology 多模态空间抽象。",
    sections: [
      {
        id: "deterministic-ecs",
        heading: "3.1 DeterministicECS 与属性黑板",
        paragraphs: [
          "涌现游戏的调试高度依赖可复现性。DeterministicECS 保证所有实体按严格递增的 EntityId 顺序遍历，所有浮点数标量属性按 VocabularyRegistry 定义的 [min, max] 区间自动钳制并保留千分位精度，彻底消除跨平台浮点漂移。",
          "每个实体由三部分正交数据构成：离散标签集合（tags）、连续标量属性表（props）与键值元数据（meta）。"
        ],
        codeBlock: {
          lang: "typescript",
          code: `import { EmergenceKernel } from "cyberpsychosis-core";

const kernel = new EmergenceKernel({ seed: 20261014, gridWidth: 16, gridHeight: 12 });

// 注册带上下界约束的共享标量属性
kernel.vocabulary.registerProperty(kernel.ecs, {
  name: "temp",
  defaultValue: 20,
  min: -40,
  max: 600,
  description: "Temperature in Celsius"
});

// 创建实体
const generatorId = kernel.ecs.createEntity({
  name: "CoreGenerator",
  glyph: "G",
  x: 9,
  y: 5,
  tags: ["generator", "machinery", "explosive"],
  props: { temp: 58, integrity: 100 }
});`
        }
      },
      {
        id: "multimodal-spatial",
        heading: "3.2 多模态空间索引 (MultiModalSpatialIndex)",
        paragraphs: [
          "不同类型的涌现需要不同的空间拓扑：落沙与推箱子需要离散网格，爆炸冲击波与危险感知需要连续欧氏距离，而物流管线与社交关系需要有向图。",
          "MultiModalSpatialIndex 在内核层同时提供这三种空间查询原语，且允许同一个实体同时处于网格、连续空间与有向图节点中："
        ],
        bullets: [
          "Grid2D：getEntitiesAtGrid(x, y) 与 getGridNeighbors(x, y, eightWay) 支持 4 邻域/8 邻域元胞匹配；",
          "Continuous2D：queryRadius(cx, cy, radius) 支持连续半径内的冲击波与 Agent 感知查询；",
          "GraphTopology：addEdge({ from, to, kind, capacity }) 支持物流管道（pipe）与社交信任边（social_trust）拓扑建模。"
        ]
      }
    ]
  },
  {
    slug: "rule-as-entity",
    chapterNumber: "04",
    category: "META-PROGRAMMING",
    title: "规则即实体与受限 DSL 编译器",
    subtitle: "将模拟规则本身作为 ECS 中的一等公民实体，打通 Baba 式空间规则改写与 LLM 语义规则生成。",
    description: "RuleEngine 如何扫描 2D 网格词块实时重编译全局规则，以及 Restricted Emergence DSL 的语法规范。",
    sections: [
      {
        id: "baba-grid-compilation",
        heading: "4.1 Baba 式空间词块实时重编译",
        paragraphs: [
          "在传统引擎中，'水能灭火'是写死在代码里的分支；而在 Cyberpsychosis 中，地图上带有 word_block 标签的实体本身就是规则编译器的数据源。",
          "每个 Tick 开始时，RuleEngine.syncGridWordBlockRules 会扫描 2D 网格上所有横排或竖排相邻的 [word_noun] + [word_verb:IS] + [word_prop] 三元组："
        ],
        codeBlock: {
          lang: "typescript",
          code: `// 当玩家推动 [WORD:HOT] 到 (5,2)，与 (3,2) 的 [WATER] 和 (4,2) 的 [IS] 连成一线：
kernel.pushEntity(wordHotId, 0, -1, "Player pushed [WORD:HOT] into rule slot");

// 内核立即重编译规则：
// 1. 撤销旧规则 [WATER IS COOL]
// 2. 激活新规则 [WATER IS HOT]，自动为所有带 'water' 标签的实体赋予 'hot' 标签并将温度提升至 95°C+
// 3. 在 CausalTracker 中记录 user:entity_pushed -> logic:rule_compiled 因果边`
        }
      },
      {
        id: "restricted-dsl",
        heading: "4.2 受限涌现 DSL (Restricted Emergence DSL)",
        paragraphs: [
          "为了同时支持配置文件热重载与大模型（LLM）运行时生成规则，内核内置了零 eval、严格白名单校验的受限 DSL 解析器（RuleEngine.injectDsl）。支持两类核心语句："
        ],
        codeBlock: {
          lang: "text",
          code: `# 1. 全局属性重定义语句 (Global Tag/Property Override)
OVERRIDE water IS hot
OVERRIDE smoke IS calm

# 2. 邻接交互反应语句 (Declarative Interaction Rule)
RULE agent_auto_repair WHEN adjacent(agent, broken) DO set_prop(target.integrity, 100); remove_tag(target, broken); emit("Agent repaired structure")`
        }
      }
    ]
  },
  {
    slug: "causal-and-time",
    chapterNumber: "05",
    category: "OBSERVABILITY & TIME",
    title: "因果溯源图谱与平行世界推演",
    subtitle: "解决涌现游戏开发最大的痛点：看清“为什么会发生这件事”，并在新规则生效前预知未来。",
    description: "CausalTracker 有向无环因果图（Causal DAG）、时间旅行回放（rewindTo）与平行世界分叉推演（forkAndPredict）。",
    sections: [
      {
        id: "causal-dag",
        heading: "5.1 自动跨系统因果缝合 (Causal Lineage DAG)",
        paragraphs: [
          "当一个结果由横跨多个模拟器的连锁反应产生时，普通日志只能看到一串按时间排列的孤立文本。CausalTracker 通过维护每个实体的最新受影响因果指针（lastCauseByEntity），在后续事件触发时自动将前置事件挂载为 parentCauseIds。",
          "调用 kernel.causal.traceLineage(entityId) 即可通过深度优先拓扑排序，还原从根因（Root Cause）到最终现象的完整因果链："
        ],
        codeBlock: {
          lang: "typescript",
          code: `const report = kernel.causal.traceLineage(engineerBetaId);
for (const line of report.narrative) {
  console.log(line);
}
// 输出示例：
// [Step 1 | Tick 2 | USER]      Player pushed [WORD:HOT] into slot (5,2)
// [Step 2 | Tick 2 | LOGIC]     Compiled active grid meta-rule: [WATER IS HOT]
// [Step 3 | Tick 6 | PHYSICS]   Overheated [CoreGenerator#8] triggered shockwave explosion!
// [Step 4 | Tick 6 | SOCIAL]    [Engineer_Alpha#11]'s distress spread to [Engineer_Beta#12]
// [Step 5 | Tick 6 | SOCIAL]    [Engineer_Beta#12] panicked and abandoned station duties!`
        }
      },
      {
        id: "world-fork",
        heading: "5.2 平行世界分叉推演 (forkAndPredict)",
        paragraphs: [
          "当玩家或 LLM 在运行时注入一条新规则时，怎么知道这条规则会不会在 10 帧后导致全图死锁或殖民地全灭？",
          "EmergenceKernel.forkAndPredict(ticks, mutateFn) 会在内存中完整克隆当前 ECS、空间拓扑与随机数种子状态，在隔离沙盒中静默高速推演未来 N 帧，返回指标对比与关键危机事件列表，而主世界状态保持 100% 零污染："
        ],
        codeBlock: {
          lang: "typescript",
          code: `const preview = kernel.forkAndPredict(10, (forked) => {
  forked.rules.injectDsl(forked.tick, "OVERRIDE smoke IS calm", forked.ecs, forked.causal);
});

console.log(preview.deltaSummary);
// ["Burning entities: 3 -> 3", "Panicked agents: 2 -> 0", ...]`
        }
      }
    ]
  },
  {
    slug: "runtime-plugins",
    chapterNumber: "06",
    category: "RUNTIME SIMULATORS",
    title: "六大可插拔模拟器插件详解",
    subtitle: "化学、物理、逻辑、物流、社会与语义桥接器如何通过共享属性黑板实现零耦合跨界涌现。",
    description: "cyberpsychosis-plugins 六大运行时模拟器插件的内部机制与跨插件交互矩阵。",
    sections: [
      {
        id: "plugin-matrix",
        heading: "6.1 六大插件职责与共享属性矩阵",
        paragraphs: [
          "在 cyberpsychosis-plugins 中，没有任何两个插件互相 import。它们全部只实现 SimulatorPlugin 接口，并通过读写内核的通用标量属性（temp、integrity、panic、pressure）自然耦合："
        ],
        table: {
          headers: ["插件名称", "涌现类型", "核心模拟机制", "读写的共享属性/标签"],
          rows: [
            ["ChemistryPlugin", "化学/元素涌现", "8 邻域热传导、85°C 燃点引燃、浓烟派生、冷水灭火", "temp, fuel, burning, hot, cool, smoke"],
            ["PhysicsPlugin", "物理与结构涌现", "135°C 超温爆炸冲击波、径向冲量速度积分、管道结构断裂", "temp, pressure, integrity, broken, exploded"],
            ["LogicRulePlugin", "逻辑/规则涌现", "同步激活的元规则 Override，持续驱动全局标签与属性映射", "hot, cool, calm, calmAura"],
            ["LogisticsPlugin", "网络/物流涌现", "有向管网流计算、冷却/热源输送、断管停流与上游背压累积", "temp, pressure, integrity, pipe edges"],
            ["SocialAgentPlugin", "社会/叙事涌现", "半径 4.5 危险/镇静感知、social_trust 关系网恐慌传染、效用 AI", "panic, panicked, calmAura, social_trust edges"],
            ["SemanticLlmPlugin", "语义涌现桥接", "自然语言转受限 DSL、WorldFork 安全预览、离线确定性编译", "DeclarativeRule, GlobalTagOverride"]
          ]
        }
      },
      {
        id: "custom-plugin",
        heading: "6.2 编写自定义模拟器插件",
        paragraphs: [
          "只需实现 SimulatorPlugin 接口并通过 kernel.usePlugin() 挂载，即可将你自己的领域模拟器接入涌现生态："
        ],
        codeBlock: {
          lang: "typescript",
          code: `import { EmergenceKernel, SimulatorPlugin } from "cyberpsychosis-core";

export class WeatherPlugin implements SimulatorPlugin<EmergenceKernel> {
  readonly id = "weather";
  readonly name = "Dynamic Rain & Wind Simulator";
  readonly tickInterval = 2; // 每 2 个主 Tick 执行一次

  onTick(kernel: EmergenceKernel, tick: number): void {
    for (const id of kernel.ecs.queryByTags(["burning"])) {
      if (kernel.prng.next() < 0.25) {
        kernel.ecs.removeTag(id, "burning");
        kernel.causal.recordEvent({
          tick,
          domain: "chemistry",
          type: "weather:rain_extinguished",
          summary: \`Rainstorm extinguished entity #\${id}\`,
          subjectIds: [id]
        });
      }
    }
  }
}`
        }
      }
    ]
  },
  {
    slug: "renderers-and-api",
    chapterNumber: "07",
    category: "RENDERERS & API",
    title: "零绑定渲染协议与 API 手册",
    subtitle: "WorldSnapshot 数据契约、Web 涌现实验室 REST 接口与核心 TypeScript 类型参考。",
    description: "Cyberpsychosis 零绑定渲染协议（WorldSnapshot、CausalNode）与 Web Workbench HTTP API 完整文档。",
    sections: [
      {
        id: "snapshot-protocol",
        heading: "7.1 WorldSnapshot 零绑定渲染协议",
        paragraphs: [
          "无论是终端字符界面（cyberpsychosis-tui）、Web 实验室画布（cyberpsychosis-web），还是外部游戏引擎（Three.js / Godot / PixiJS），都只需要消费 kernel.getSnapshot() 返回的纯 JSON 数据结构："
        ],
        codeBlock: {
          lang: "typescript",
          code: `export interface WorldSnapshot {
  tick: number;
  seed: number;
  prngState: number;
  grid: { width: number; height: number };
  entities: SerializedEntity[];
  activeRules: ActiveRuleSummary[];
  overrides: GlobalTagOverride[];
  graphEdges: SerializedGraphEdge[];
  recentEvents: CausalNode[];
  metrics: {
    entityCount: number;
    burningCount: number;
    panickedAgentCount: number;
    logisticsThroughput: number;
    brokenPipeCount: number;
    activeRuleCount: number;
  };
}`
        }
      },
      {
        id: "web-workbench-rest-api",
        heading: "7.2 Web 涌现实验室 HTTP / REST 接口",
        paragraphs: [
          "cyberpsychosis-web 内置基于 node:http 的零依赖服务端，对外提供完整的沙盒控制与可观测 REST 接口："
        ],
        table: {
          headers: ["HTTP 方法与路径", "请求体示例", "功能说明"],
          rows: [
            ["GET /api/snapshot", "—", "获取当前帧 WorldSnapshot 及可用历史 Checkpoint 帧列表"],
            ["POST /api/step", "{ \"count\": 5 }", "向前推进指定数量的确定性逻辑帧"],
            ["POST /api/rewind", "{ \"tick\": 2 }", "时间旅行回滚到指定的历史 Tick 快照"],
            ["POST /api/push-word", "{ \"preset\": \"WATER_IS_HOT\" }", "推动网格词块改写全局元规则或移动指定实体"],
            ["POST /api/inject-dsl", "{ \"input\": \"Make smoke calm\", \"previewTicks\": 5 }", "编译自然语言/DSL、执行 WorldFork 平行推演并注入规则"],
            ["GET /api/causal/:id", "—", "查询任意实体 ID 或事件 ID 的完整因果溯源链 (CausalLineageReport)"],
            ["POST /api/reset", "{}", "重置微缩生态站至初始 Tick 0 状态"]
          ]
        }
      }
    ]
  },
  {
    slug: "npm-packages",
    chapterNumber: "08",
    category: "ECOSYSTEM & NPM",
    title: "npm 软件包矩阵与发布规范",
    subtitle: "了解 Cyberpsychosis 在 npmjs 上的 6 个公开软件包、安装组合方式与自动化发布工作流。",
    description: "Cyberpsychosis 系列 npm 包（cyberpsychosis、cyberpsychosis-core、cyberpsychosis-plugins 等）安装与发版说明。",
    sections: [
      {
        id: "package-list",
        heading: "8.1 官方 npm 软件包清单",
        paragraphs: [
          "本项目采用 Monorepo 架构维护 6 个公开 npm 包，全部遵循 Apache-2.0 开源许可协议："
        ],
        table: {
          headers: ["npm 包名", "版本", "适用场景", "安装命令"],
          rows: [
            ["cyberpsychosis", "0.1.0", "一站式全功能 SDK 重导出 + CLI 入口", "npm install cyberpsychosis"],
            ["cyberpsychosis-core", "0.1.0", "仅需纯无头涌现内核（零外部依赖）", "npm install cyberpsychosis-core"],
            ["cyberpsychosis-plugins", "0.1.0", "六大标准运行时模拟器插件集", "npm install cyberpsychosis-plugins"],
            ["cyberpsychosis-demo", "0.1.0", "16×12 微缩生态站验证场景", "npm install cyberpsychosis-demo"],
            ["cyberpsychosis-tui", "0.1.0", "终端 ASCII/ANSI 沙盒渲染器与 CLI", "npm install -g cyberpsychosis-tui"],
            ["cyberpsychosis-web", "0.1.0", "Web 涌现实验室工作台与调试服务器", "npm install -g cyberpsychosis-web"]
          ]
        }
      },
      {
        id: "publish-workflow",
        heading: "8.2 自动化校验与 npmjs 发布流程",
        paragraphs: [
          "仓库内置 npm run publish:dry-run 本地预检脚本与 .github/workflows/npm-publish.yml 自动化发布流水线。每次发版前自动执行全量 TypeScript 编译与跨维度涌现集成测试，确保发布的产物 100% 可用。"
        ],
        codeBlock: {
          lang: "bash",
          code: `# 本地验证所有工作区包的打包清单与导出类型
npm run publish:dry-run

# 登录 npmjs 后按依赖拓扑顺序发布公开包
for pkg in core plugins demo-minimal renderer-tui renderer-web cyberpsychosis; do
  npm publish "./packages/$pkg" --access public
done`
        }
      }
    ]
  }
];
