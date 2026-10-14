# 快速启动、网站构建与 npm 发布指南 (`docs/QUICK_START.md`)

本文档说明如何在本地安装、构建、测试并运行 **Cyberpsychosis** 的终端 TUI 沙盒、Web 涌现实验室工作台、官方宣传文档网站以及发布 npmjs 软件包。

---

## 1. 环境要求

- **Node.js**：`>= 20.0.0`（当前开发环境为 `v24.16.0`）
- **npm**：`>= 10.0.0`（支持 `npm workspaces`）

---

## 2. 安装、构建与测试

```bash
# 1. 安装全部工作区依赖
npm install

# 2. 编译所有子包并构建 website 静态站点
npm run build

# 3. 运行类型检查与设计系统零硬编码检查
npm run typecheck

# 4. 运行全量单元测试、跨维度涌现集成测试与网站契约测试
npm test
```

---

## 3. 启动极简验证 Demo（TUI + Web 双渲染端）

### 3.1 终端字符界面（`cyberpsychosis-tui`）

```bash
# 自动运行剧本演示并输出 ASCII 快照与因果溯源报告
npm run demo:tui

# 交互式 TUI 模式
npm run start:tui
```

### 3.2 Web 涌现实验室工作台（`cyberpsychosis-web`）

```bash
npm run start:web
```
启动后访问 `http://localhost:4173`。

---

## 4. 构建与部署官方宣传文档网站（`website/`）

```bash
# 生成设计系统变量、校验零硬编码并构建静态站至 website/dist
npm run site:build

# 本地通过 Wrangler 预览 Cloudflare Worker 站点
npm run site:dev

# 部署至 Cloudflare Worker (cyberpsychosis)
npm run site:deploy
```

---

## 5. 发布软件包至 npmjs

```bash
# 执行全量包预发布干跑检查 (dry-run)
npm run publish:dry-run
```
