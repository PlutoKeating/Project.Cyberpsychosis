import type { ArticlePageSpec } from "../components/article.ts";
import { definePageI18n, L } from "../i18n/index.ts";

export const PRIVACY_I18N: Readonly<ArticlePageSpec> = definePageI18n({
  path: "/privacy/",
  heroKind: "privacy",
  title: L("隐私政策 — Cyberpsychosis", "Privacy Policy — Cyberpsychosis"),
  description: L(
    "Cyberpsychosis 官方网站与本地工具链的零遥测、零追踪隐私声明。",
    "Zero-telemetry, local-first privacy policy for the Cyberpsychosis website and SDK."
  ),
  eyebrow: L("// PRIVACY POLICY · 隐私政策", "// PRIVACY POLICY"),
  heading: L("零追踪。本地优先。", "Zero Tracking. Local First."),
  lead: L(
    "Cyberpsychosis 坚持零遥测与本地内存运行原则，不收集任何个人身份或使用行为数据。",
    "Cyberpsychosis operates with zero telemetry and local-first execution, collecting no personal or behavioral data."
  ),
  updated: L("生效日期：2026-10-14", "Effective Date: 2026-10-14"),
  highlights: [
    {
      badge: "01 // 0 COOKIES",
      title: L("零追踪 Cookie", "Zero Tracking Cookies"),
      detail: L("主题与语言偏好仅保存在本地浏览器 localStorage。", "Theme and language preferences stay strictly in local browser storage."),
    },
    {
      badge: "02 // 0 TELEMETRY",
      title: L("SDK 零遥测上报", "Zero SDK Telemetry"),
      detail: L("全部 6 个 npm 包不包含任何联网统计或后台上报代码。", "All six npm packages contain zero analytics or background reporting code."),
    },
    {
      badge: "03 // 100% LOCAL",
      title: L("本地进程推演", "100% Local Simulation"),
      detail: L("ECS、因果图谱与 WorldFork 全部在本地内存中离线完成。", "ECS, Causal DAG, and WorldFork execute entirely in local memory."),
    },
  ],
  sections: [
    {
      index: "01 / WEBSITE STORAGE",
      heading: L("1. 网站访问与本地存储", "1. Website & Local Storage"),
      paragraphs: [
        L(
          "本站托管于 Cloudflare Workers，不设置身份追踪 Cookie，不加载第三方广告或统计脚本。主题（cyberpsychosis.theme）与语言（cyberpsychosis.lang）偏好仅存储于本地浏览器 localStorage。",
          "Hosted on Cloudflare Workers, this site sets no tracking cookies and loads no third-party analytics. Theme (cyberpsychosis.theme) and language (cyberpsychosis.lang) settings remain in your browser's localStorage."
        ),
      ],
    },
    {
      index: "02 / SDK & CLI",
      heading: L("2. 引擎 SDK 与命令行工具", "2. Engine SDK & CLI"),
      paragraphs: [
        L(
          "cyberpsychosis 系列 npm 包包含 0 行遥测代码，所有世界模拟与平行分叉推演均在本地内存离线执行。",
          "The cyberpsychosis npm packages contain zero telemetry code; all simulations and WorldFork predictions run offline in local memory."
        ),
      ],
      bullets: [
        L("离线语义编译：SemanticLlmPlugin 默认采用内置确定性离线编译器，无需联网即可运行。", "Offline semantic compiler: SemanticLlmPlugin defaults to a deterministic offline compiler requiring no network access."),
        L("自控外部端点：仅当开发者主动配置外部 API 密钥时，才会向指定端点发起请求。", "User-controlled endpoints: network requests occur only when you explicitly configure an external LLM endpoint."),
      ],
    },
    {
      index: "03 / EDGE LOGS",
      heading: L("3. 边缘网络防护", "3. Edge Network Protection"),
      paragraphs: [
        L(
          "Cloudflare 边缘节点仅按安全防护标准处理基础 TLS 握手与连接元数据；维护者不收集、存储或共享任何访客个人数据。",
          "Cloudflare edge nodes process standard TLS and connection metadata solely for DDoS mitigation; the maintainer collects, stores, or shares no personal visitor data."
        ),
      ],
    },
    {
      index: "04 / CONTACT",
      heading: L("4. 隐私联系通道", "4. Privacy Contact"),
      paragraphs: [
        L(
          "如有任何隐私相关问题，请通过 GitHub 仓库或发送邮件至 PlutoKeating@outlook.com 联系。",
          "For privacy questions, open an issue on GitHub or email PlutoKeating@outlook.com."
        ),
      ],
    },
  ],
});
