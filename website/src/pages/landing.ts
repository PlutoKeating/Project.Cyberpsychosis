import {
  escapeHtml,
  GITHUB_REPO_URL,
  NPM_PACKAGE_URL,
  renderPageLayout,
} from "../components/shell.ts";

interface HighlightItem {
  index: string;
  domain: string;
  title: string;
  subtitle: string;
  description: string;
  docHref: string;
  featured?: boolean;
}

const HIGHLIGHTS: ReadonlyArray<HighlightItem> = [
  {
    index: "01",
    domain: "CORE FORMULA",
    title: "五维涌现架构显式建模",
    subtitle: "Vocabulary × Grammar × Semantics × Fat Runtime × Clear Renderer",
    description:
      "将《涌现式游戏标准定义与概念指南》的五维设计公式一比一编码为内核一等公民模块：VocabularyRegistry 注册正交原子标签与标量属性，GrammarMatcher 执行多模态拓扑匹配，SemanticsExecutor 驱动确定性状态重写。",
    docHref: "/docs/",
    featured: true,
  },
  {
    index: "02",
    domain: "RULE-AS-ENTITY",
    title: "内核级“规则即实体”实时重编译",
    subtitle: "Baba-Is-You Style Dynamic Meta-Rule Rewriting",
    description:
      "模拟规则本身作为 ECS 世界中的特殊实体存在。推动网格上的 [WATER] [IS] [HOT] 词块或动态注入受限 DSL，内核在单帧内实时重编译全局物理与化学反应规则，词块推开即刻无副作用回退。",
    docHref: "/docs/rule-as-entity/",
    featured: true,
  },
  {
    index: "03",
    domain: "CAUSAL LINEAGE DAG",
    title: "一等公民因果溯源图谱",
    subtitle: "Automated Cross-Domain Root-Cause Lineage & Story Generation",
    description:
      "内置 CausalTracker 自动追踪每一次属性突变与事件传播的父级起因，构建有向无环因果图（Causal DAG）。点击任意恐慌逃跑的 NPC 或损毁节点，即可一键反向追溯从玩家推块到社交传染的完整故事链。",
    docHref: "/docs/causal-and-time/",
  },
  {
    index: "04",
    domain: "TIME-TRAVEL & WORLDFORK",
    title: "确定性时间旅行与平行世界分叉",
    subtitle: "Mulberry32 Seeded PRNG + RingBuffer Rewind + Parallel Sandbox",
    description:
      "保证相同种子与输入序列产生 100% 一致的涌现结果。支持任意历史帧倒带回放（rewindTo），并可通过 forkAndPredict 在后台克隆平行世界高速推演未来 N 帧，提前预判新规则是否引发系统崩溃。",
    docHref: "/docs/causal-and-time/",
  },
  {
    index: "05",
    domain: "SIX RUNTIME PLUGINS",
    title: "六大零耦合可插拔模拟器",
    subtitle: "Chemistry · Physics · Logic · Logistics · Social · Semantic LLM",
    description:
      "内置化学元胞自动机、2D 冲击波与结构完整度物理、Baba 式逻辑重编译、有向流与背压物流网络、效用 AI 与社交情绪传染、以及 LLM 受限 DSL 语义桥接器，插件间通过共享属性黑板实现零直接耦合联动。",
    docHref: "/docs/runtime-plugins/",
  },
  {
    index: "06",
    domain: "ZERO-BINDING RENDERERS",
    title: "双官方可视化工作台（TUI + Web）",
    subtitle: "Headless Snapshot Protocol Driving Terminal & Browser Studio",
    description:
      "内核不绑定任何 UI 框架，仅输出标准化 WorldSnapshot 与 CausalLineageReport。同一套微缩生态站验证场景可同时在终端 ASCII/ANSI TUI 与浏览器多图层 Canvas 实验室工作台中交互运行。",
    docHref: "/docs/renderers-and-api/",
  },
];

export function renderLandingPage(): string {
  const highlightCards = HIGHLIGHTS.map(
    (item) => `<article class="project-card clip-panel group relative flex flex-col justify-between border border-border bg-surface p-6 transition-all duration-(--ds-duration-slow) hover:-translate-y-1 hover:border-accent hover:shadow-glow ${
      item.featured ? "project-card--featured" : ""
    }">
      <div>
        <div class="flex items-center justify-between gap-3 font-mono text-xs tracking-widest">
          <span class="text-fg-subtle">${escapeHtml(item.index)} / ${escapeHtml(item.domain)}</span>
          <span class="text-accent">ACTIVE MODULE</span>
        </div>
        <h3 class="mt-5 font-sans text-xl font-semibold tracking-tight text-fg">${escapeHtml(item.title)}</h3>
        <p class="mt-1 font-mono text-xs text-accent">${escapeHtml(item.subtitle)}</p>
        <p class="mt-3 text-sm leading-relaxed text-fg-muted">${escapeHtml(item.description)}</p>
      </div>
      <div class="mt-6 flex items-center justify-between border-t border-border pt-3 font-mono text-xs">
        <span class="text-fg-subtle"><span class="mr-2 text-accent">●</span>TypeScript / ECS</span>
        <a class="text-accent transition-colors duration-(--ds-duration-fast) hover:text-accent-hover" href="${item.docHref}">阅读章节文档 <span aria-hidden="true">↗</span></a>
      </div>
    </article>`
  ).join("\n        ");

  const bodyHtml = `<section class="relative mx-auto grid max-w-wide grid-cols-1 gap-10 px-5 pt-10 pb-14 sm:px-8 lg:grid-cols-2 lg:items-center lg:px-14 lg:pt-16 lg:pb-20" id="top">
      <div class="flex flex-col gap-5">
        <div class="inline-flex items-center gap-2.5 font-mono text-xs tracking-widest text-accent">
          <span class="signal-dot inline-block size-2 rounded-full bg-accent"></span>
          <span>// EMERGENT GAMEPLAY ENGINE MIDDLEWARE</span>
        </div>
        <h1 class="font-sans text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
          CYBER<br/>
          <span class="glitch-text text-accent" data-text="PSYCHOSIS">PSYCHOSIS</span><span class="cursor-blink font-normal text-fg">_</span>
        </h1>
        <p class="max-w-prose font-sans text-lg leading-relaxed text-fg sm:text-xl">
          瘦 Vocabulary × 极简 Grammar × 瘦 Semantics × <span class="text-accent font-semibold">胖 Runtime</span> × 清晰 Renderer
        </p>
        <p class="max-w-prose text-sm leading-relaxed text-fg-muted sm:text-base">
          面向涌现式游戏的通用内核中间件与双端可视化实验室。将确定性 ECS、规则即实体（Rule-as-Entity）实时重编译、六大跨模态模拟器、因果溯源图谱（Causal DAG）与平行世界分叉推演（WorldFork）封装为开箱即用的 TypeScript 工具链。
        </p>

        <div class="cyber-terminal border border-border-strong bg-code-bg p-4">
          <div class="flex items-center justify-between font-mono text-xs text-fg-subtle">
            <span>// QUICK INSTALL &amp; LAUNCH (NPMJS)</span>
            <button type="button" id="copy-cli-btn" class="text-accent hover:text-accent-hover">COPY ⧉</button>
          </div>
          <pre class="mt-2 overflow-x-auto font-mono text-xs text-code-fg"><code id="cli-command-text">npx cyberpsychosis demo   # 终端运行跨维涌现剧本与因果树溯源
npx cyberpsychosis web    # 启动 Web 涌现实验室工作台 (:4173)</code></pre>
        </div>

        <div class="mt-2 flex flex-wrap gap-3">
          <a class="clip-button inline-flex items-center gap-4 bg-accent px-6 py-3.5 font-mono text-xs font-semibold tracking-widest text-accent-fg shadow-glow transition-all duration-(--ds-duration-base) hover:-translate-y-1 hover:bg-accent-hover" href="/docs/">
            <span>阅读完整文档 / READ DOCS</span>
            <span aria-hidden="true">→</span>
          </a>
          <a class="clip-button inline-flex items-center gap-4 border border-border-strong bg-surface px-6 py-3.5 font-mono text-xs font-semibold tracking-widest text-fg transition-all duration-(--ds-duration-base) hover:-translate-y-1 hover:border-accent hover:text-accent" href="/docs/quick-start/">
            <span>快速开始 / QUICK START</span>
            <span aria-hidden="true">↘</span>
          </a>
          <a class="clip-button inline-flex items-center gap-3 border border-border bg-bg-elevated px-5 py-3.5 font-mono text-xs text-fg-muted transition-all duration-(--ds-duration-base) hover:border-accent hover:text-accent" href="${NPM_PACKAGE_URL}" target="_blank" rel="noopener noreferrer">
            <span>NPMJS.COM</span>
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div class="cyber-terminal border border-border bg-surface p-5 shadow-lg sm:p-6">
        <div class="flex items-center justify-between border-b border-border pb-3 font-mono text-xs">
          <span class="text-accent"><span class="signal-dot mr-2 inline-block size-2 rounded-full bg-accent"></span>LIVE CAUSAL DAG TRACE // MICRO OUTPOST</span>
          <span class="text-fg-subtle">SEED: 20261014</span>
        </div>
        <pre class="mt-4 overflow-x-auto bg-code-bg p-4 font-mono text-xs leading-relaxed text-code-fg"><code>=== CYBERPSYCHOSIS ENGINE TUI | Tick: 7 | Seed: 20261014 ===
Active Meta-Rules: [WATER IS HOT] -> [SMOKE IS CALM]
+---------------------------------+
| · · · W I H C · · · · · · · · · |  Rule Slot: WATER IS HOT
| · · · P · = · x · G ~ * ~ · · · |  PipeB ruptured, Generator burning
| · · · · · · · · · A · B · · · · |  Engineers Alpha &amp; Beta
+---------------------------------+
[ROOT] [T2 | USER]      Pushed [WORD:HOT] into (5,2)
  └─&gt; [T2 | LOGIC]     Compiled meta-rule: [WATER IS HOT]
    └─&gt; [T3 | LOGISTICS] Pipeline pumped scalding fluid into CoreGenerator
      └─&gt; [T6 | PHYSICS]   CoreGenerator (174°C) triggered shockwave explosion
        └─&gt; [T6 | LOGISTICS] Pipeline [pipe:p1-&gt;p2] severed; backpressure rising
        └─&gt; [T6 | SOCIAL]    Alpha distress spread via social_trust to Beta
          └─&gt; [T7 | SEMANTIC]  Injected "Make smoke calm" -&gt; WorldFork Safe ✓</code></pre>
        <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 font-mono text-xs text-fg-subtle">
          <span>6 DOMAINS BRIDGED IN 1 DETERMINISTIC KERNEL</span>
          <a class="text-accent hover:text-accent-hover" href="/docs/causal-and-time/">探索因果溯源原理 ↗</a>
        </div>
      </div>
    </section>

    <section class="border-y border-border bg-bg-elevated py-8">
      <div class="mx-auto grid max-w-wide grid-cols-2 gap-6 px-5 sm:px-8 lg:grid-cols-4 lg:px-14">
        <div class="border-l border-accent pl-4">
          <strong class="font-sans text-3xl font-semibold text-accent sm:text-4xl">6</strong>
          <p class="mt-1 font-mono text-xs text-fg-muted">可插拔模拟器插件<br/>RUNTIME PLUGINS</p>
        </div>
        <div class="border-l border-border-strong pl-4">
          <strong class="font-sans text-3xl font-semibold text-fg sm:text-4xl">5</strong>
          <p class="mt-1 font-mono text-xs text-fg-muted">涌现设计标准维度<br/>EMERGENCE DIMENSIONS</p>
        </div>
        <div class="border-l border-border-strong pl-4">
          <strong class="font-sans text-3xl font-semibold text-fg sm:text-4xl">100%</strong>
          <p class="mt-1 font-mono text-xs text-fg-muted">确定性回放与平行分叉<br/>DETERMINISTIC REPLAY</p>
        </div>
        <div class="border-l border-border-strong pl-4">
          <strong class="font-sans text-3xl font-semibold text-accent sm:text-4xl">0</strong>
          <p class="mt-1 font-mono text-xs text-fg-muted">渲染器耦合依赖<br/>RENDERER LOCK-IN</p>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-wide px-5 py-16 sm:px-8 sm:py-24 lg:px-14" id="highlights">
      <div class="flex flex-col justify-between gap-4 border-b border-border-strong pb-6 lg:flex-row lg:items-end">
        <div>
          <div class="font-mono text-xs tracking-widest text-accent">// ARCHITECTURE &amp; CAPABILITIES</div>
          <h2 class="mt-2 font-sans text-3xl font-semibold tracking-tight text-fg sm:text-5xl">项目核心亮点<span class="text-accent">.</span></h2>
        </div>
        <p class="max-w-prose text-sm text-fg-muted">
          组合成熟 ECS 思想与自研薄内核，填补“逻辑重编译 + 跨系统因果传导 + 语义规则安全注入”的开源空白。
        </p>
      </div>

      <div class="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        ${highlightCards}
      </div>
    </section>

    <section class="border-t border-border bg-bg-elevated py-16 sm:py-24">
      <div class="mx-auto max-w-wide px-5 sm:px-8 lg:px-14">
        <div class="font-mono text-xs tracking-widest text-accent">// NPM PACKAGE MATRIX</div>
        <h2 class="mt-2 font-sans text-2xl font-semibold tracking-tight text-fg sm:text-4xl">模块化 npm 软件包体系<span class="text-accent">.</span></h2>
        <p class="mt-3 max-w-prose text-sm text-fg-muted">
          所有子包均以 Apache-2.0 协议发布至 npmjs，既可按需独立引入无头内核，也可一键安装全功能包。
        </p>

        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div class="clip-panel border border-border bg-surface p-5">
            <p class="font-mono text-xs text-accent">UMBRELLA SDK &amp; CLI</p>
            <h3 class="mt-2 font-mono text-base font-semibold text-fg">cyberpsychosis</h3>
            <p class="mt-2 text-xs text-fg-muted">聚合导出全部核心与插件 API，并提供 <code>npx cyberpsychosis demo | web</code> 命令行入口。</p>
          </div>
          <div class="clip-panel border border-border bg-surface p-5">
            <p class="font-mono text-xs text-accent">KERNEL MIDDLEWARE</p>
            <h3 class="mt-2 font-mono text-base font-semibold text-fg">cyberpsychosis-core</h3>
            <p class="mt-2 text-xs text-fg-muted">零外部依赖的确定性 ECS、五维模块、Rule-as-Entity 编译器、Causal DAG 与 WorldFork。</p>
          </div>
          <div class="clip-panel border border-border bg-surface p-5">
            <p class="font-mono text-xs text-accent">SIMULATOR PLUGINS</p>
            <h3 class="mt-2 font-mono text-base font-semibold text-fg">cyberpsychosis-plugins</h3>
            <p class="mt-2 text-xs text-fg-muted">化学、物理、逻辑重编译、物流管网、社会效用 AI 与语义 LLM-to-DSL 六大模拟器插件。</p>
          </div>
          <div class="clip-panel border border-border bg-surface p-5">
            <p class="font-mono text-xs text-accent">VERIFICATION SCENARIO</p>
            <h3 class="mt-2 font-mono text-base font-semibold text-fg">cyberpsychosis-demo</h3>
            <p class="mt-2 text-xs text-fg-muted">16×12 微缩生态站（Micro Outpost）跨维度级联涌现标准验证沙盒。</p>
          </div>
          <div class="clip-panel border border-border bg-surface p-5">
            <p class="font-mono text-xs text-accent">TERMINAL RENDERER</p>
            <h3 class="mt-2 font-mono text-base font-semibold text-fg">cyberpsychosis-tui</h3>
            <p class="mt-2 text-xs text-fg-muted">Dwarf Fortress 风格终端 ASCII/ANSI 实时交互沙盒与因果树命令行渲染器。</p>
          </div>
          <div class="clip-panel border border-border bg-surface p-5">
            <p class="font-mono text-xs text-accent">VISUAL WORKBENCH</p>
            <h3 class="mt-2 font-mono text-base font-semibold text-fg">cyberpsychosis-web</h3>
            <p class="mt-2 text-xs text-fg-muted">浏览器端多图层 Canvas 画布、时间轴回放、WorldFork 预测与因果图检查器。</p>
          </div>
        </div>

        <div class="mt-10 flex flex-wrap gap-4">
          <a class="clip-button inline-flex items-center gap-3 bg-accent px-6 py-3 font-mono text-xs font-semibold tracking-widest text-accent-fg shadow-glow hover:bg-accent-hover" href="/docs/">
            进入多章节技术文档 →
          </a>
          <a class="clip-button inline-flex items-center gap-3 border border-border-strong bg-surface px-6 py-3 font-mono text-xs font-semibold tracking-widest text-fg hover:border-accent hover:text-accent" href="${GITHUB_REPO_URL}" target="_blank" rel="noopener noreferrer">
            查看 GitHub 仓库 ↗
          </a>
        </div>
      </div>
    </section>`;

  return renderPageLayout({
    title: "Cyberpsychosis — 通用涌现式游戏引擎中间件与可视化工作台",
    description:
      "Cyberpsychosis 是基于五维涌现设计框架的通用涌现式游戏引擎内核中间件，支持规则即实体动态重编译、六大可插拔模拟器、因果溯源图谱与平行世界推演。",
    activePath: "/",
    bodyHtml,
  });
}
