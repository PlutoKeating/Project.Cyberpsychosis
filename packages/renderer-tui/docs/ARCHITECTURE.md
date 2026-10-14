# `@emergence/renderer-tui` 内部架构

## 模块职责

- `src/index.ts`：
  - `renderSnapshotToAscii(snapshot, options)`：将 `WorldSnapshot` 渲染为带图例、16×12 字符网格、激活元规则、关键实体遥测与近期因果事件的文本面板。
  - `renderCausalLineageToAscii(report)`：将 `CausalLineageReport` 格式化为可读的跨模态因果树。
- `src/cli.ts`：
  - 提供交互式按键循环与 `--auto` 自动演示模式。
- `src/tui.test.ts`：
  - 针对快照字符渲染与因果树格式化的单元测试。
