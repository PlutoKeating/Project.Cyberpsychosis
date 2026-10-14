import { definePageI18n, L } from "../i18n/index.ts";

export const NOT_FOUND_I18N = definePageI18n({
  title: L("404 未找到 — Cyberpsychosis", "404 Not Found — Cyberpsychosis"),
  description: L(
    "页面路径不存在于当前时间线快照中。",
    "Requested path does not exist in the current timeline snapshot."
  ),
  eyebrow: L(
    "// ERROR 404 · ENTITY NOT FOUND IN ECS",
    "// ERROR 404 · ENTITY NOT FOUND IN ECS"
  ),
  headingNumber: L("404", "404"),
  headingCursor: L("_", "_"),
  message: L(
    "当前时间线分支未找到该路径，请回滚至首页或打开文档中心。",
    "Path missing from the active timeline snapshot. Rewind to Home or open Docs."
  ),
  homeBtn: L("回滚至首页 / HOME", "REWIND HOME"),
  docsBtn: L("架构文档 / DOCS", "OPEN DOCS"),
});
