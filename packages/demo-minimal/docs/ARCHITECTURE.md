# `@emergence/demo-minimal` 场景拓扑与架构

## 16×12 网格初始空间布局

```text
y=2:   [WATER (3,2)]  [IS (4,2)]   [COOL (5,2)]   (初始激活规则: WATER IS COOL)
y=3:                               [HOT  (5,3)]   (待推入词块)
y=5:   [Pump  (3,5)] ==Pipe(5,5)==Pipe(7,5)==> [Generator (9,5)] [Oil (10,5)]
y=6:                                           [Oil (9,6)]       [Eng.Alpha (10,6)]
y=8:                                                                \--(social_trust)--> [Eng.Beta (13,8)]
```

## 导出接口

- `createOutpostSandbox(seed?: number): OutpostSandbox`
  - 返回包含 `kernel`、`semanticPlugin`、关键实体 ID 字典以及便捷触发器方法的沙盒控制器实例。
  - 同时被 `@emergence/renderer-tui` 与 `@emergence/renderer-web` 零修改复用。
