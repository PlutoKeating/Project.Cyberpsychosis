# `@emergence/renderer-web` 内部架构

## 模块组成

- `src/workbench-html.ts`：内聚的 Web 实验室前端单页应用（Canvas 渲染器 + 时间轴回放控制 + 因果图 DAG 面板 + DSL 编辑器）。
- `src/server.ts`：基于 `node:http` 的零外部依赖 REST 服务器，暴露 `/api/snapshot`、`/api/step`、`/api/rewind`、`/api/push-word`、`/api/inject-dsl`、`/api/causal/:id`、`/api/spawn`、`/api/edit-entity`、`/api/replay-tape`、`/api/world-bundle`、`/api/reset`。
- `src/web.test.ts`：端到端 HTTP 接口与状态流集成测试。
