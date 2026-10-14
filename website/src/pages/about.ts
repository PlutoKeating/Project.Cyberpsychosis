import { renderArticlePage } from "../components/article.ts";
import { DEFAULT_LOCALE, type Locale } from "../i18n/index.ts";
import { ABOUT_I18N } from "./about.i18n.ts";

export function renderAboutPage(locale: Locale = DEFAULT_LOCALE): string {
  return renderArticlePage(ABOUT_I18N, locale);
}
