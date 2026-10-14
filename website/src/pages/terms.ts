import { renderArticlePage } from "../components/article.ts";

export function renderTermsPage(): string {
  return renderArticlePage({
    path: "/terms/",
    title: "服务条款 / Terms & Conditions — Cyberpsychosis",
    description: "Cyberpsychosis 开源软件、官方网站与相关文档的使用条款与免责声明。",
    eyebrow: "// TERMS & CONDITIONS · 服务条款",
    heading: "使用条款与开源许可声明",
    lead: "访问或使用 Cyberpsychosis 官方网站、文档及关联的开源软件包（统称“本项目”），即表示您同意遵守以下条款。",
    updated: "Effective Date: 2026-10-14",
    sections: [
      {
        index: "01 / OPEN SOURCE LICENSE",
        heading: "1. 开源软件许可（Apache License 2.0）",
        paragraphs: [
          "Cyberpsychosis 的源代码及发布在 npmjs 上的软件包（包括但不限于 cyberpsychosis、cyberpsychosis-core、cyberpsychosis-plugins、cyberpsychosis-demo、cyberpsychosis-tui、cyberpsychosis-web）均依据 Apache License, Version 2.0 授权许可。",
          "您可以在遵守 Apache-2.0 许可证条款的前提下自由使用、修改、分发本项目或将其集成至商业及非商业作品中。完整许可证文本请参见代码仓库根目录的 LICENSE 文件。"
        ]
      },
      {
        index: "02 / ACCEPTABLE USE",
        heading: "2. 合理使用与合规边界",
        paragraphs: [
          "本项目定位为通用游戏开发中间件与复杂系统仿真工具。您在接入第三方大语言模型（LLM API）使用语义涌现桥接器（SemanticLlmPlugin）时，应自行确保所配置的 API 密钥、提示词内容及生成结果符合您所在司法管辖区的法律法规及对应模型服务商的使用政策。"
        ],
        bullets: [
          "不得利用本网站或相关接口实施任何破坏计算机信息系统、DDoS 攻击或未授权探测行为；",
          "在分发包含本项目代码的衍生作品时，须按 Apache-2.0 要求保留原始版权声明与许可文本。"
        ]
      },
      {
        index: "03 / DISCLAIMER OF WARRANTY",
        heading: "3. 免责声明与责任限制",
        paragraphs: [
          "按 Apache-2.0 许可证第 7 条与第 8 条规定，本项目及本网站内容均按“原样（AS IS）”提供，不附带任何明示或暗示的担保（包括但不限于适销性、特定用途适用性及非侵权担保）。",
          "在任何情况下，项目维护者或贡献者均不对因使用或无法使用本项目而产生的任何直接、间接、附带或后果性损害承担责任。"
        ]
      },
      {
        index: "04 / CHANGES TO TERMS",
        heading: "4. 条款修订與联系方式",
        paragraphs: [
          "维护者可能随项目演进更新本页面条款，更新后的版本将直接发布于本页面并标注生效日期。如有任何法律或许可疑问，请通过 GitHub Issues 或发送邮件至 PlutoKeating@outlook.com 联系。"
        ]
      }
    ]
  });
}
