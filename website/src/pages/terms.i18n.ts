import type { ArticlePageSpec } from "../components/article.ts";
import { definePageI18n, L } from "../i18n/index.ts";

export const TERMS_I18N: Readonly<ArticlePageSpec> = definePageI18n({
  path: "/terms/",
  heroKind: "terms",
  title: L("服务条款 — Cyberpsychosis", "Terms & Conditions — Cyberpsychosis"),
  description: L(
    "Cyberpsychosis 开源软件、官方网站与文档的使用条款与免责声明。",
    "Terms of use and Apache-2.0 license conditions for Cyberpsychosis software and website."
  ),
  eyebrow: L("// TERMS & CONDITIONS · 服务条款", "// TERMS & CONDITIONS"),
  heading: L("开源许可与使用条款。", "Open License & Terms."),
  lead: L(
    "使用 Cyberpsychosis 官方网站、文档及关联 npm 软件包即适用以下条款。",
    "Using the Cyberpsychosis website, documentation, and npm packages is governed by the following terms."
  ),
  updated: L("生效日期：2026-10-14", "Effective Date: 2026-10-14"),
  highlights: [
    {
      badge: "01 // APACHE-2.0",
      title: L("自由商用与修改", "Commercial & Modification Rights"),
      detail: L("全部 6 个 npm 软件包均遵循 Apache-2.0 协议。", "All six npm packages are licensed under Apache License 2.0."),
    },
    {
      badge: "02 // ATTRIBUTION",
      title: L("保留版权声明", "Retain Copyright Notice"),
      detail: L("分发衍生作品时需保留原始 LICENSE 与版权文本。", "Include the original LICENSE and copyright notice in distributions."),
    },
    {
      badge: "03 // AS-IS",
      title: L("按原样提供", "Provided AS-IS"),
      detail: L("开源软件不附带特定用途担保或连带责任。", "Software is provided without warranties or liability under Sections 7 & 8."),
    },
  ],
  sections: [
    {
      index: "01 / OPEN SOURCE LICENSE",
      heading: L("1. 开源软件授权（Apache License 2.0）", "1. Apache License 2.0 Grant"),
      paragraphs: [
        L(
          "Cyberpsychosis 源码及全部官方 npm 包（cyberpsychosis、cyberpsychosis-core、cyberpsychosis-plugins、cyberpsychosis-demo、cyberpsychosis-tui、cyberpsychosis-web）均按 Apache License 2.0 授权。",
          "All Cyberpsychosis source code and official npm packages are licensed under the Apache License, Version 2.0."
        ),
      ],
    },
    {
      index: "02 / ACCEPTABLE USE",
      heading: L("2. 合规使用边界", "2. Acceptable Use"),
      paragraphs: [
        L(
          "接入第三方大语言模型接口（SemanticLlmPlugin）时，开发者需自行确保 API 密钥、提示词与生成内容符合所在地法规及服务商条款。",
          "When connecting external LLM endpoints via SemanticLlmPlugin, users are responsible for complying with applicable laws and provider policies."
        ),
      ],
      bullets: [
        L("禁止对本站边缘节点实施未授权探测或拒绝服务攻击。", "Do not perform unauthorized probing or denial-of-service attacks against site endpoints."),
        L("分发包含本项目的衍生作品时须保留原始版权声明。", "Retain original copyright notices when redistributing derivative works."),
      ],
    },
    {
      index: "03 / DISCLAIMER",
      heading: L("3. 免责声明", "3. Disclaimer of Warranty"),
      paragraphs: [
        L(
          "依据 Apache-2.0 第 7 条与第 8 条，本项目按“原样（AS IS）”提供，维护者不对因使用本项目产生的任何直接或间接损失承担责任。",
          "Pursuant to Sections 7 and 8 of Apache-2.0, the software is provided on an AS IS basis without warranties or liability of any kind."
        ),
      ],
    },
    {
      index: "04 / CONTACT",
      heading: L("4. 联系方式", "4. Contact"),
      paragraphs: [
        L(
          "许可与条款咨询请通过 GitHub Issues 或发送邮件至 PlutoKeating@outlook.com。",
          "For licensing inquiries, open a GitHub Issue or email PlutoKeating@outlook.com."
        ),
      ],
    },
  ],
});
