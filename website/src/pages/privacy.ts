import { renderArticlePage } from "../components/article.ts";

export function renderPrivacyPage(): string {
  return renderArticlePage({
    path: "/privacy/",
    title: "隐私政策 / Privacy Policy — Cyberpsychosis",
    description: "Cyberpsychosis 官方网站与本地工具链的隐私保护原则与零数据收集声明。",
    eyebrow: "// PRIVACY POLICY · 隐私政策",
    heading: "零追踪、本地优先的隐私原则",
    lead: "Cyberpsychosis 极其重视开发者与访客的隐私。我们坚持“默认不收集、本地运行”的工程原则。",
    updated: "Effective Date: 2026-10-14",
    sections: [
      {
        index: "01 / WEBSITE PRIVACY",
        heading: "1. 官方网站访问与本地存储",
        paragraphs: [
          "本宣传与文档网站作为静态资源托管于 Cloudflare Workers 边缘网络，不设置任何身份跟踪 Cookie，不接入任何第三方广告网络或行为画像脚本。",
          "当您点击页面顶部的主题切换按钮（切换深色/浅色模式）时，您的偏好仅保存在您自己浏览器的 localStorage（键名：cyberpsychosis.theme）中，绝不会上传至任何服务器。"
        ]
      },
      {
        index: "02 / SDK & CLI TELEMETRY",
        heading: "2. 引擎 SDK 与命令行工具零遥测",
        paragraphs: [
          "您在本地安装或运行的 cyberpsychosis 系列 npm 包（含内核、模拟器插件、终端 TUI 与本地 Web 工作台）包含 0 行遥测（Telemetry）或暗中上报代码。",
          "所有的 ECS 世界模拟、快照回放、WorldFork 推演与因果溯源图谱计算均 100% 在您的本地进程内存中离线完成。"
        ],
        bullets: [
          "默认离线语义编译：SemanticLlmPlugin 默认采用内置确定性离线编译器，无需联网即可运行全部功能；",
          "自控外部 API：仅当您主动在本地环境变量中配置第三方 LLM API Key 时，程序才会向您指定的端点发起请求。"
        ]
      },
      {
        index: "03 / INFRASTRUCTURE LOGS",
        heading: "3. 基础设施边缘日志",
        paragraphs: [
          "本站由 Cloudflare 提供边缘托管与基础安全防护，Cloudflare 可能会在网络层按其标准隐私政策处理基础连接元数据（如请求 IP 与 TLS 握手信息）以防御恶意流量；本项目维护者不会收集、出售或共享任何个人身份数据。"
        ]
      },
      {
        index: "04 / CONTACT",
        heading: "4. 隐私问题联系通道",
        paragraphs: [
          "如对本隐私政策有任何疑问，请通过 GitHub 仓库（PlutoKeating/Project.Cyberpsychosis）或邮件 PlutoKeating@outlook.com 与维护者取得联系。"
        ]
      }
    ]
  });
}
