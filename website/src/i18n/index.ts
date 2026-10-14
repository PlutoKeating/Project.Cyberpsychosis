/**
 * Core i18n Architecture & Extensible Multi-Language Scaffold.
 *
 * Supported out of the box:
 * - "zh" (Simplified Chinese / 简体中文)
 * - "en" (English)
 *
 * Extensibility Scaffold:
 * To add a new language (e.g. "ja", "ko", "de"):
 * 1. Add the locale code to `SUPPORTED_LOCALES`.
 * 2. Register its metadata in `LOCALE_META`.
 * 3. TypeScript will automatically enforce that every `*.i18n.ts` file provides translations for the new locale.
 */

export const SUPPORTED_LOCALES = ["zh", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh";

export interface LocaleMeta {
  readonly code: Locale;
  readonly htmlLang: string;
  readonly shortLabel: string;
  readonly nativeName: string;
}

export const LOCALE_META: Readonly<Record<Locale, LocaleMeta>> = {
  zh: {
    code: "zh",
    htmlLang: "zh-CN",
    shortLabel: "中",
    nativeName: "简体中文",
  },
  en: {
    code: "en",
    htmlLang: "en",
    shortLabel: "EN",
    nativeName: "English",
  },
};

/**
 * A localized text unit containing strings for all supported locales.
 * Uses `Partial<Record<string, string>>` intersection so additional locale keys can be staged incremental-first.
 */
export type LocalizedText = Readonly<Record<Locale, string>> &
  Readonly<Partial<Record<string, string>>>;

/**
 * Helper to construct a `LocalizedText` object with concise syntax: `L("中文", "English")`.
 */
export function L(
  zh: string,
  en: string,
  more?: Readonly<Record<string, string>>
): LocalizedText {
  return {
    zh,
    en,
    ...(more ?? {}),
  };
}

/**
 * Type-safe scaffold helper for page-level `*.i18n.ts` modules.
 */
export function definePageI18n<T>(schema: T): Readonly<T> {
  return schema;
}

export function escapeHtml(value: string): string {
  return String(value).replace(/[&<>"']/g, (ch) => {
    switch (ch) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return ch;
    }
  });
}

/**
 * Renders a localized HTML inline container (`<span data-lang-code="...">`) for all registered locales.
 * Visibility is toggled at zero runtime cost via `html[data-lang="..."]` CSS rules.
 */
export function tr(text: LocalizedText, className = ""): string {
  const clsAttr = className ? ` class="${escapeHtml(className)}"` : "";
  return SUPPORTED_LOCALES.map(
    (loc) =>
      `<span data-lang-code="${loc}"${clsAttr}>${escapeHtml(text[loc])}</span>`
  ).join("");
}

/**
 * Renders a localized SVG `<text>` element for each registered locale.
 */
export function trSvg(text: LocalizedText, svgAttrs: string): string {
  return SUPPORTED_LOCALES.map(
    (loc) =>
      `<text data-lang-code="${loc}" ${svgAttrs}>${escapeHtml(text[loc])}</text>`
  ).join("");
}

/**
 * Resolves a single string for a target locale (used in `<meta>` tags, `<title>`, and aria attributes).
 */
export function pickLocale(
  text: LocalizedText,
  locale: Locale = DEFAULT_LOCALE
): string {
  return text[locale] ?? text[DEFAULT_LOCALE];
}

/**
 * Serializes localized attributes (`data-i18n-title-zh`, `data-i18n-title-en`, etc.) so client-side
 * language switching can synchronize `document.title` and input placeholders.
 */
export function trDataAttrs(prefix: string, text: LocalizedText): string {
  return SUPPORTED_LOCALES.map(
    (loc) => `data-${prefix}-${loc}="${escapeHtml(text[loc])}"`
  ).join(" ");
}
