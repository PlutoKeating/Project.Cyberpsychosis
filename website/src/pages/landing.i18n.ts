import { definePageI18n, L, type LocalizedText } from "../i18n/index.ts";

export interface JourneyStepItem {
  readonly step: string;
  readonly label: LocalizedText;
  readonly href: string;
}

export interface SimScenarioStep {
  readonly id: string;
  readonly index: string;
  readonly badge: LocalizedText;
  readonly title: LocalizedText;
  readonly ruleText: string;
  readonly tickText: string;
  readonly traceText: LocalizedText;
}

export interface GalleryTabItem {
  readonly id: "workbench" | "tui" | "worldfork";
  readonly badge: string;
  readonly title: LocalizedText;
  readonly command: string;
  readonly imgSrc: string;
  readonly imgAlt: LocalizedText;
  readonly callouts: ReadonlyArray<{
    readonly num: string;
    readonly label: LocalizedText;
  }>;
}

export interface HighlightBentoItem {
  readonly index: string;
  readonly domain: string;
  readonly title: LocalizedText;
  readonly subtitle: LocalizedText;
  readonly caption: LocalizedText;
  readonly docHref: string;
  readonly featured?: boolean;
}

export interface PackageMatrixItem {
  readonly layer: string;
  readonly name: string;
  readonly role: LocalizedText;
  readonly cmd: string;
}

export const LANDING_I18N = definePageI18n({
  meta: {
    title: L(
      "Cyberpsychosis — 确定性涌现游戏引擎内核与双端可视化工作台",
      "Cyberpsychosis — Deterministic Emergent Game Engine Kernel & Dual Visual Studio"
    ),
    description: L(
      "通用涌现式游戏引擎内核中间件，内置确定性 ECS、规则即实体实时重编译、六大解耦模拟器、因果溯源图谱与平行世界推演。",
      "General-purpose emergent gameplay engine middleware with deterministic ECS, Rule-as-Entity recompilation, six decoupled simulators, Causal DAG, and WorldFork prediction."
    ),
  },
  journeyMap: {
    label: L("USER JOURNEY //", "USER JOURNEY //"),
    steps: [
      { step: "01", label: L("交互沙盒", "LIVE SANDBOX"), href: "#top" },
      { step: "02", label: L("因果推演", "CAUSAL FLOW"), href: "#cascade" },
      { step: "03", label: L("双端实拍", "DUAL STUDIOS"), href: "#screenshots" },
      { step: "04", label: L("六大机制", "6 MECHANISMS"), href: "#highlights" },
      { step: "05", label: L("四层架构", "ARCHITECTURE"), href: "#architecture" },
    ] satisfies ReadonlyArray<JourneyStepItem>,
  },
  hero: {
    eyebrow: L(
      "// EMERGENT GAMEPLAY ENGINE MIDDLEWARE",
      "// EMERGENT GAMEPLAY ENGINE MIDDLEWARE"
    ),
    titleLine1: L("定义原子。", "WRITE ATOMS."),
    titleLine2: L("生长世界", "GROW WORLDS"),
    titleCursor: L("_", "_"),
    formulaPrefix: L("Vocabulary × Grammar × Semantics × ", "Vocabulary × Grammar × Semantics × "),
    formulaAccent: L("Fat Runtime", "Fat Runtime"),
    formulaSuffix: L(" × Clear Renderer", " × Clear Renderer"),
    summary: L(
      "面向涌现式游戏的确定性内核中间件。将规则重编译、六大跨模态模拟器、因果图谱与平行世界推演封装为轻量 TypeScript 工具链。",
      "Deterministic kernel middleware for emergent games. Unifies dynamic rule recompilation, six cross-modal simulators, causal graphs, and parallel world prediction in TypeScript."
    ),
    cliHeader: L("// 终端极速启动 · INSTANT LAUNCH", "// INSTANT CLI LAUNCH"),
    copyBtn: L("COPY ⧉", "COPY ⧉"),
    cliCode: `npx cyberpsychosis demo   # Run 16x12 cascade & Causal DAG in terminal
npx cyberpsychosis web    # Launch Web Visual Workbench (:4173)`,
    ctaDocs: L("阅读架构文档", "READ DOCS"),
    ctaQuickStart: L("5分钟快速开始", "QUICK START"),
    ctaNpm: L("NPMJS.COM", "NPMJS.COM"),
    arrowRight: L("→", "→"),
    arrowDownRight: L("↘", "↘"),
    arrowUpRight: L("↗", "↗"),
  },
  sandbox: {
    headerTitle: L(
      "IN-BROWSER REAL KERNEL // 16×12 微缩生态站",
      "IN-BROWSER REAL KERNEL // 16×12 MICRO OUTPOST"
    ),
    seedLabel: L("SEED: 20261014", "SEED: 20261014"),
    autoPlayBtn: L("AUTO LOOP", "AUTO LOOP"),
    stepOneBtn: L("STEP +1", "STEP +1"),
    rewindBtn: L("REWIND -1", "REWIND -1"),
    shareBtn: L("SHARE STORY ⧉", "SHARE STORY ⧉"),
    canvasHint: L(
      "点选任意实体实时运行 kernel.causal.traceLineage(id) · 点击词块可直接在真内核中推动",
      "Click any entity to execute live kernel.causal.traceLineage(id) · Click word blocks to push in real kernel"
    ),
    canvasAria: L(
      "16x12 微缩生态站实时涌现模拟画布",
      "16x12 Micro Outpost Live Emergence Simulation Canvas"
    ),
    steps: [
      {
        id: "steady",
        index: "01",
        badge: L("T0 · 稳态", "T0 · STEADY"),
        title: L("冷却循环", "Coolant Flow"),
        ruleText: "[WATER IS COOL]",
        tickText: "TICK 01 · 58°C",
        traceText: L(
          "[T0 | LOGIC] 词块 [WATER][IS][COOL] 激活 -> 水泵向发电机输送 16°C 冷却液",
          "[T0 | LOGIC] Grid rule [WATER][IS][COOL] active -> Pump delivers 16°C coolant to Generator"
        ),
      },
      {
        id: "push",
        index: "02",
        badge: L("T2 · 推块", "T2 · PUSH"),
        title: L("规则改写", "Rule Shift"),
        ruleText: "[WATER IS HOT]",
        tickText: "TICK 02 · 95°C",
        traceText: L(
          "[T2 | USER -> LOGIC] 推入 [HOT] 词块 -> 单帧重编译 [WATER IS HOT]，管网流体升至 95°C",
          "[T2 | USER -> LOGIC] Pushed [HOT] block -> Recompiled [WATER IS HOT], fluid jumps to 95°C"
        ),
      },
      {
        id: "blast",
        index: "03",
        badge: L("T6 · 级联", "T6 · BLAST"),
        title: L("超温引爆", "Cascade Blast"),
        ruleText: "[174°C SHOCKWAVE]",
        tickText: "TICK 06 · 174°C",
        traceText: L(
          "[T6 | PHYSICS -> SOCIAL] 发电机 174°C 爆炸 -> 管道断裂、油桶起火、恐慌沿信任边传染给 Beta",
          "[T6 | PHYSICS -> SOCIAL] Generator explodes at 174°C -> Pipe severed, oil ignites, panic spreads to Beta"
        ),
      },
      {
        id: "fork",
        index: "04",
        badge: L("T7 · 分叉", "T7 · FORK"),
        title: L("平行注入", "WorldFork Safe"),
        ruleText: "[SMOKE IS CALM]",
        tickText: "TICK 07 · SAFE ✓",
        traceText: L(
          "[T7 | SEMANTIC] WorldFork 平行推演 +5 帧确认安全 -> 注入 [SMOKE IS CALM] 平息工程师恐慌",
          "[T7 | SEMANTIC] WorldFork +5 ticks verified safe -> Injected [SMOKE IS CALM], stabilizing engineers"
        ),
      },
    ] satisfies ReadonlyArray<SimScenarioStep>,
    legendWord: L("■ W/I/H 规则词块", "■ W/I/H Word Blocks"),
    legendPipe: L("━ P/=/G 物流管线", "━ P/=/G Coolant Pipe"),
    legendSocial: L("┄ A--B 社交信任边", "┄ A--B Social Trust"),
    legendSmoke: L("● ~ 镇静烟雾场", "● ~ Calm Smoke Aura"),
  },
  kpis: [
    {
      value: L("6", "6"),
      label: L("可插拔模拟器", "SIMULATOR PLUGINS"),
      sub: L("化学 · 物理 · 逻辑 · 物流 · 社会 · 语义", "Chem · Phys · Logic · Pipe · Social · LLM"),
      accent: true,
    },
    {
      value: L("5", "5"),
      label: L("涌现标准维度", "EMERGENCE DIMENSIONS"),
      sub: L("Vocab · Grammar · Semantics · Runtime · Render", "Vocab · Grammar · Semantics · Runtime · Render"),
      accent: false,
    },
    {
      value: L("100%", "100%"),
      label: L("确定性回放与分叉", "DETERMINISTIC REPLAY"),
      sub: L("Mulberry32 种子 + 环形快照 + WorldFork", "Mulberry32 Seed + RingBuffer + WorldFork"),
      accent: false,
    },
    {
      value: L("0", "0"),
      label: L("渲染器耦合依赖", "RENDERER LOCK-IN"),
      sub: L("纯 JSON 快照协议同时驱动 TUI 与 Web", "Pure JSON Snapshot drives TUI & Web"),
      accent: true,
    },
  ],
  cascadeSection: {
    eyebrow: L("// STAGE 02 · OPERATION & CAUSAL LINEAGE", "// STAGE 02 · OPERATION & CAUSAL LINEAGE"),
    heading: L("一次推块。六维连锁。", "One Push. Six Domains."),
    subtitle: L(
      "插件间零直接引用，仅通过读写共享标量黑板与因果事件总线自然涌现跨界故事。",
      "Plugins share zero imports. Cross-domain stories emerge through shared scalar properties and the causal bus."
    ),
    exploreLink: L("查阅因果图谱与平行推演文档 →", "Explore Causal DAG & WorldFork Docs →"),
  },
  gallerySection: {
    eyebrow: L("// STAGE 03 · AUTHENTIC WORKBENCH GALLERY", "// STAGE 03 · AUTHENTIC WORKBENCH GALLERY"),
    heading: L("同一内核。双端呈现。", "One Kernel. Dual Studios."),
    subtitle: L(
      "真实运行截图：一套无头世界快照同时驱动 Web 多图层工作台与终端字符界面。",
      "Authentic runtime captures: one headless snapshot stream powers both the Web Canvas Studio and Terminal TUI."
    ),
    tabs: [
      {
        id: "workbench",
        badge: "01 // WEB STUDIO",
        title: L("Web 多图层可视化实验室", "Web Multi-Layer Visual Workbench"),
        command: "npx cyberpsychosis web",
        imgSrc: "/screenshots/workbench-live.png",
        imgAlt: L(
          "Cyberpsychosis Web 可视化实验室真实运行截图",
          "Cyberpsychosis Web Visual Workbench live screenshot"
        ),
        callouts: [
          { num: "①", label: L("16×12 网格 + 欧氏冲击波 + 管网/社交拓扑画布", "16×12 Grid + Blast Radius + Pipe/Social Topology") },
          { num: "②", label: L("单帧步进、时光倒流与 Baba 词块触发器", "Single-Tick Step, Time Rewind & Word-Block Trigger") },
          { num: "③", label: L("WorldFork +5 帧平行推演安全验证面板", "WorldFork +5 Ticks Parallel Safety Predictor") },
          { num: "④", label: L("点选实体实时展开跨领域因果溯源链", "Click-to-Trace Cross-Domain Causal Lineage DAG") },
        ],
      },
      {
        id: "tui",
        badge: "02 // TERMINAL TUI",
        title: L("终端 ASCII/ANSI 交互沙盒", "Terminal ASCII/ANSI Interactive Sandbox"),
        command: "npx cyberpsychosis demo",
        imgSrc: "/screenshots/tui-live.png",
        imgAlt: L(
          "Cyberpsychosis 终端 TUI 沙盒真实运行截图",
          "Cyberpsychosis Terminal TUI sandbox live screenshot"
        ),
        callouts: [
          { num: "①", label: L("Dwarf Fortress 风格 ANSI 着色字符地图", "Dwarf Fortress-Style ANSI Glyph Map") },
          { num: "②", label: L("右侧实时输出拓扑排序后的因果故事树", "Real-Time Topologically Sorted Causal Story Tree") },
          { num: "③", label: L("全键盘快捷键控制步进、倒带与 DSL 注入", "Full Keyboard Control for Step, Rewind & DSL Injection") },
          { num: "④", label: L("与 Web 端共享同一确定性随机数状态", "Identical Deterministic PRNG State as Web Studio") },
        ],
      },
      {
        id: "worldfork",
        badge: "03 // WORLDFORK & DAG",
        title: L("因果溯源图谱与平行世界分叉", "Causal Lineage DAG & WorldFork Timeline"),
        command: "kernel.forkAndPredict(5, mutateFn)",
        imgSrc: "/screenshots/worldfork-inspector.png",
        imgAlt: L(
          "Cyberpsychosis 因果图谱与 WorldFork 平行时间线截图",
          "Cyberpsychosis Causal DAG and WorldFork parallel timeline screenshot"
        ),
        callouts: [
          { num: "①", label: L("自动将跨插件事件缝合为有向无环图 (DAG)", "Auto-Stitches Cross-Plugin Events into a Causal DAG") },
          { num: "②", label: L("Branch A 预判未干预条件下的殖民地崩溃", "Branch A Predicts Unmitigated Outpost Collapse") },
          { num: "③", label: L("Branch B 验证 [SMOKE IS CALM] 可在 1 帧内平息恐慌", "Branch B Verifies [SMOKE IS CALM] Stabilizes Panic in 1 Tick") },
          { num: "④", label: L("主世界状态零污染，验证通过后一键提交", "Zero Main-World Mutation Before Verified Commit") },
        ],
      },
    ] satisfies ReadonlyArray<GalleryTabItem>,
  },
  highlightsSection: {
    eyebrow: L("// STAGE 04 · CORE MECHANISMS", "// STAGE 04 · CORE MECHANISMS"),
    heading: L("六大核心机制。", "Six Core Mechanisms."),
    subtitle: L(
      "极简原语组合，驱动高密度跨系统涌现。",
      "Minimalist primitives engineered for high-density cross-system emergence."
    ),
    readMore: L("章节文档 ↗", "Read Chapter ↗"),
    items: [
      {
        index: "01",
        domain: "5D FORMULA",
        title: L("五维涌现显式建模", "5D Explicit Modeling"),
        subtitle: L("Vocab × Grammar × Semantics × Runtime × Render", "Vocab × Grammar × Semantics × Runtime × Render"),
        caption: L(
          "五维原语直接映射为内核一等公民模块。",
          "Maps all five emergence dimensions directly into first-class kernel modules."
        ),
        docHref: "/docs/",
        featured: true,
      },
      {
        index: "02",
        domain: "RULE-AS-ENTITY",
        title: L("规则即实体实时重编译", "Rule-as-Entity Recompilation"),
        subtitle: L("Baba-Style Grid Meta-Rule Rewriting", "Baba-Style Grid Meta-Rule Rewriting"),
        caption: L(
          "推动网格词块或注入 DSL，单帧内重写全局物理与化学规则。",
          "Push grid word blocks or inject DSL to rewrite global rules within a single tick."
        ),
        docHref: "/docs/rule-as-entity/",
        featured: true,
      },
      {
        index: "03",
        domain: "CAUSAL DAG",
        title: L("跨系统因果溯源图谱", "Cross-Domain Causal DAG"),
        subtitle: L("Automated Root-Cause Lineage & Narrative", "Automated Root-Cause Lineage & Narrative"),
        caption: L(
          "点击任意结果实体，一键回溯从玩家输入到社交传染的完整因果链。",
          "Click any entity to trace the full causal chain back to the root player action."
        ),
        docHref: "/docs/causal-and-time/",
      },
      {
        index: "04",
        domain: "TIME & WORLDFORK",
        title: L("时间旅行与平行世界分叉", "Time-Travel & WorldFork"),
        subtitle: L("RingBuffer Rewind + Parallel Sandbox", "RingBuffer Rewind + Parallel Sandbox"),
        caption: L(
          "支持任意历史帧倒带回放，并在后台克隆平行世界超前验证新规则。",
          "Rewind to any historical checkpoint or clone parallel worlds to verify new rules safely."
        ),
        docHref: "/docs/causal-and-time/",
      },
      {
        index: "05",
        domain: "6 SIMULATORS",
        title: L("六大零耦合模拟器插件", "Six Decoupled Simulators"),
        subtitle: L("Chem · Phys · Logic · Pipe · Social · LLM", "Chem · Phys · Logic · Pipe · Social · LLM"),
        caption: L(
          "六大领域插件互不引用，通过共享标量属性黑板自然联动。",
          "Six domain simulators communicate exclusively through a shared scalar blackboard."
        ),
        docHref: "/docs/runtime-plugins/",
      },
      {
        index: "06",
        domain: "ZERO LOCK-IN",
        title: L("零绑定双端可视化工作台", "Zero-Binding Dual Studios"),
        subtitle: L("Headless JSON Snapshot Protocol", "Headless JSON Snapshot Protocol"),
        caption: L(
          "纯 JSON 快照协议同时驱动终端 TUI 与浏览器多图层工作台。",
          "A pure JSON snapshot stream drives both Terminal TUI and Browser Canvas Studio."
        ),
        docHref: "/docs/renderers-and-api/",
      },
    ] satisfies ReadonlyArray<HighlightBentoItem>,
  },
  architectureSection: {
    eyebrow: L("// STAGE 05 · SYSTEM ARCHITECTURE & NPM", "// STAGE 05 · SYSTEM ARCHITECTURE & NPM"),
    heading: L("四层架构。即插即用。", "Four Layers. Plug and Play."),
    subtitle: L(
      "零外部运行时依赖。按需引入独立无头内核，或一键启动全功能工作台。",
      "Zero external runtime dependencies. Import the headless kernel or launch the full studio."
    ),
    packagesTitle: L("// 6 OFFICIAL NPM PACKAGES (APACHE-2.0)", "// 6 OFFICIAL NPM PACKAGES (APACHE-2.0)"),
    packages: [
      {
        layer: "UMBRELLA SDK & CLI",
        name: "cyberpsychosis",
        role: L("全功能 SDK 重导出与 npx 命令行总入口。", "Full SDK re-export and unified npx CLI entry."),
        cmd: "npm i cyberpsychosis",
      },
      {
        layer: "LAYER 1 · KERNEL",
        name: "cyberpsychosis-core",
        role: L("零依赖确定性 ECS、五维模块、Causal DAG 与 WorldFork。", "Zero-dependency ECS, 5D modules, Causal DAG & WorldFork."),
        cmd: "npm i cyberpsychosis-core",
      },
      {
        layer: "LAYER 2 · PLUGINS",
        name: "cyberpsychosis-plugins",
        role: L("化学、物理、逻辑、管网、社会 AI 与语义 LLM 六大插件。", "Chemistry, Physics, Logic, Logistics, Social & Semantic plugins."),
        cmd: "npm i cyberpsychosis-plugins",
      },
      {
        layer: "LAYER 3 · SCENARIO",
        name: "cyberpsychosis-demo",
        role: L("16×12 微缩生态站跨维度涌现标准验证沙盒。", "16×12 Micro Outpost cross-domain verification sandbox."),
        cmd: "npm i cyberpsychosis-demo",
      },
      {
        layer: "LAYER 4 · TERMINAL",
        name: "cyberpsychosis-tui",
        role: L("终端 ASCII/ANSI 字符界面与实时因果树检查器。", "Terminal ASCII/ANSI sandbox and live causal tree CLI."),
        cmd: "npx cyberpsychosis-tui",
      },
      {
        layer: "LAYER 4 · WEB STUDIO",
        name: "cyberpsychosis-web",
        role: L("浏览器多图层 Canvas 画布、时间轴与 WorldFork 工作台。", "Browser multi-layer Canvas, timeline & WorldFork studio."),
        cmd: "npx cyberpsychosis web",
      },
    ] satisfies ReadonlyArray<PackageMatrixItem>,
    ctaDocs: L("进入 8 章技术文档 →", "Explore 8-Chapter Docs →"),
    ctaGithub: L("查看 GitHub 源码 ↗", "View GitHub Source ↗"),
  },
});
