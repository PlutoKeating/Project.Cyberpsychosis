/**
 * Cyberpsychosis 官网设计系统：全站唯一的视觉参数来源。
 *
 * 直接继承自 plutokeating.beer 的设计系统（保留原有的深色/浅色核心配色、字体、字号阶梯、阴影与动效），
 * 并扩展了 Cyberpsychosis 专属的六大涌现维度色标与战术切角（chamfered clip-path）变体。
 *
 * 硬规则：页面与组件（src/components 与 src/pages）中严禁出现任何字面量的色值、圆角、阴影、光效、透明度、模糊、时长。
 * 构建前由 scripts/gen-tokens.ts 自动生成 tokens.generated.css，并由 scripts/lint-tokens.ts 强制扫描校验。
 */

export type ColorScheme = "dark" | "light";

const palette = {
  dark: {
    bg: "#0e0f11",
    "bg-elevated": "#131417",
    surface: "#17181c",
    "surface-hover": "#1d1e23",
    "surface-glass": "rgb(14 15 17 / 0.86)",
    border: "rgb(232 228 221 / 0.08)",
    "border-strong": "rgb(232 228 221 / 0.18)",
    fg: "#e8e4dd",
    "fg-display": "#e8e4dd",
    "display-shadow": "rgb(0 0 0 / 0.45)",
    "fg-muted": "#a9a49c",
    "fg-subtle": "#6f6b65",
    link: "#cfd8d5",
    "link-hover": "#e8e4dd",
    accent: "#f0a35e",
    "accent-hover": "#f5b67c",
    "accent-fg": "#1a120a",
    "accent-soft": "rgb(240 163 94 / 0.12)",
    "accent-glow": "rgb(240 163 94 / 0.32)",
    "accent-glow-faint": "rgb(240 163 94 / 0.08)",
    secondary: "#7d8f8a",
    "secondary-fg": "#c2cfcb",
    "secondary-soft": "rgb(125 143 138 / 0.14)",
    success: "#7fb08f",
    warning: "#d9b96a",
    danger: "#c97c7c",
    overlay: "rgb(0 0 0 / 0.6)",
    "code-bg": "#111215",
    "code-fg": "#d8d4cc",
    selection: "rgb(240 163 94 / 0.28)",
    "chart-line": "#7d8f8a",
    "chart-fill": "rgb(125 143 138 / 0.12)",
    "chart-marker": "#f0a35e",
    "orb-hi": "#fffefc",
    "orb-mid": "#ffd3ab",
    orb: "#ffb26e",
    "orb-rim": "#fa7600",
    "orb-glow": "rgb(255 178 110 / 0.64)",
    "orb-glow-mid": "rgb(255 178 110 / 0.19)",
    "orb-glow-end": "rgb(255 178 110 / 0)",
    "syntax-keyword": "#c9a7d9",
    "syntax-string": "#a7c9a3",
    "syntax-constant": "#e0c48a",
    "syntax-function": "#9fc3d6",
    "syntax-comment": "#6f6b65",
    "syntax-punctuation": "#8f8a83",
    /* Cyberpsychosis 专属涌现维度与网格语义变体（保持原有暖琥珀+冷青灰低饱和调性） */
    "cyber-grid-line": "rgb(232 228 221 / 0.035)",
    "cyber-scanline": "rgb(14 15 17 / 0.12)",
    "cyber-logic": "#f0a35e",
    "cyber-chemistry": "#d9b96a",
    "cyber-physics": "#c97c7c",
    "cyber-logistics": "#9fc3d6",
    "cyber-social": "#c9a7d9",
    "cyber-semantic": "#7fb08f",
  },
  light: {
    bg: "#f7f3ec",
    "bg-elevated": "#fbf9f5",
    surface: "#fdfbf8",
    "surface-hover": "#f1ece3",
    "surface-glass": "rgb(247 243 236 / 0.88)",
    border: "rgb(44 38 32 / 0.1)",
    "border-strong": "rgb(44 38 32 / 0.22)",
    fg: "#26221e",
    "fg-display": "#16130f",
    "display-shadow": "transparent",
    "fg-muted": "#625b53",
    "fg-subtle": "#8d857c",
    link: "#4b6560",
    "link-hover": "#26221e",
    accent: "#a5623f",
    "accent-hover": "#8f5233",
    "accent-fg": "#fbf6ef",
    "accent-soft": "rgb(165 98 63 / 0.1)",
    "accent-glow": "rgb(165 98 63 / 0.2)",
    "accent-glow-faint": "rgb(165 98 63 / 0.06)",
    secondary: "#5f726d",
    "secondary-fg": "#3e4f4b",
    "secondary-soft": "rgb(95 114 109 / 0.12)",
    success: "#3f7a53",
    warning: "#8f7325",
    danger: "#9c4b4b",
    overlay: "rgb(38 34 30 / 0.4)",
    "code-bg": "#efe9df",
    "code-fg": "#2d2822",
    selection: "rgb(165 98 63 / 0.22)",
    "chart-line": "#5f726d",
    "chart-fill": "rgb(95 114 109 / 0.1)",
    "chart-marker": "#a5623f",
    "orb-hi": "#fffefc",
    "orb-mid": "#ffd3ab",
    orb: "#ffb26e",
    "orb-rim": "#fa7600",
    "orb-glow": "rgb(255 178 110 / 0.64)",
    "orb-glow-mid": "rgb(255 178 110 / 0.19)",
    "orb-glow-end": "rgb(255 178 110 / 0)",
    "syntax-keyword": "#7a4f8c",
    "syntax-string": "#3f7a4a",
    "syntax-constant": "#8a6a1f",
    "syntax-function": "#2f6a84",
    "syntax-comment": "#8d857c",
    "syntax-punctuation": "#6b655e",
    /* Cyberpsychosis 专属涌现维度与网格语义变体（浅色模式） */
    "cyber-grid-line": "rgb(44 38 32 / 0.05)",
    "cyber-scanline": "rgb(247 243 236 / 0.15)",
    "cyber-logic": "#a5623f",
    "cyber-chemistry": "#8f7325",
    "cyber-physics": "#9c4b4b",
    "cyber-logistics": "#2f6a84",
    "cyber-social": "#7a4f8c",
    "cyber-semantic": "#3f7a53",
  },
} as const satisfies Record<ColorScheme, Record<string, string>>;

export type ColorToken = keyof (typeof palette)["dark"];

export const designSystem = {
  colors: palette,

  radius: {
    xs: "0.25rem",
    sm: "0.375rem",
    md: "0.625rem",
    lg: "0.875rem",
    xl: "1.25rem",
    "2xl": "1.75rem",
    full: "9999px",
  },
  borderWidth: { hairline: "1px", thick: "2px" },

  /** Cyberpsychosis 继承自 plutokeating.beer 的切角几何路径 */
  clipPath: {
    small: "polygon(0 0, calc(100% - 7px) 0, 100% 7px, 100% 100%, 0 100%)",
    button: "polygon(0 0, calc(100% - 13px) 0, 100% 13px, 100% 100%, 0 100%)",
    panel: "polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)",
    hero: "polygon(0 0, calc(100% - 28px) 0, 100% 28px, 100% 100%, 27px 100%, 0 calc(100% - 27px))",
  },

  shadow: {
    none: "none",
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.18)",
    md: "0 8px 24px -12px rgb(0 0 0 / 0.4)",
    lg: "0 24px 60px -24px rgb(0 0 0 / 0.5)",
    glow: "0 0 0 1px var(--ds-color-accent-soft), 0 0 48px -8px var(--ds-color-accent-glow)",
    "glow-strong": "0 0 0 1px var(--ds-color-accent-soft), 0 0 96px -12px var(--ds-color-accent-glow)",
    ring: "0 0 0 3px var(--ds-color-accent-soft)",
  },
  blur: { glass: "12px", halo: "90px" },
  textShadow: {
    display: "0 2px 16px var(--ds-color-display-shadow)",
    glitch: "0 0 38px var(--ds-color-accent-glow)",
  },

  opacity: {
    disabled: "0.45",
    muted: "0.7",
    hover: "0.85",
    halo: "0.55",
    "halo-light": "0.3",
    pattern: "0.5",
  },

  motion: {
    duration: { fast: "150ms", base: "240ms", slow: "320ms", reveal: "600ms", breath: "5000ms" },
    ease: {
      standard: "cubic-bezier(0.2, 0, 0, 1)",
      emphasized: "cubic-bezier(0.3, 0, 0, 1)",
      breath: "cubic-bezier(0.45, 0, 0.55, 1)",
    },
    revealOffset: "6px",
    breathAmplitude: "0.08",
  },

  font: {
    sans: '"Inter", "Noto Sans SC Variable", "Noto Sans SC", "Source Han Sans SC", "Noto Sans CJK SC", sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", "Noto Sans Mono CJK SC", monospace',
  },

  text: {
    xs: ["0.8125rem", "1.2rem"],
    sm: ["0.9375rem", "1.5rem"],
    base: ["1.0625rem", "1.75rem"],
    lg: ["1.1875rem", "1.9rem"],
    xl: ["1.375rem", "2rem"],
    "2xl": ["1.625rem", "2.15rem"],
    "3xl": ["2rem", "2.45rem"],
    "4xl": ["2.5rem", "2.9rem"],
    "5xl": ["3.25rem", "3.55rem"],
    "6xl": ["4.25rem", "4.45rem"],
  },

  weight: { normal: "450", medium: "600", semibold: "700" },
  tracking: { tight: "-0.02em", normal: "0", wide: "0.06em", widest: "0.14em" },

  container: { figure: "32rem", prose: "44rem", content: "72rem", wide: "88rem" },
  breakpoint: { sm: "40rem", md: "48rem", lg: "64rem", xl: "80rem", "2xl": "96rem" },
  shortHeight: "36rem",
  headerHeight: "4.25rem",
} as const;

export type DesignSystem = typeof designSystem;
