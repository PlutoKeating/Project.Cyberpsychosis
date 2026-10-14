# `cyberpsychosis-tui` — 终端字符界面（ASCII / ANSI TUI）渲染器

`cyberpsychosis-tui` 是 Cyberpsychosis 引擎的两个官方标配渲染端之一（Dwarf Fortress 风格字符沙盒）。它严格通过 `cyberpsychosis-core` 的 `WorldSnapshot` 与 `CausalLineageReport` 零绑定协议消费模拟状态，不包含任何游戏模拟逻辑。

## 启动方式

```bash
# 交互式 TUI 模式（支持键盘控制、时光倒流、词块推动、语义规则注入、因果树查询）
npm run start:tui

# 自动剧本推演模式（输出关键阶段 ASCII 画面、WorldFork 预测报告与完整因果溯源链）
npm run demo:tui
```
