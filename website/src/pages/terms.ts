import { renderArticlePage } from "../components/article.ts";
import { DEFAULT_LOCALE, type Locale } from "../i18n/index.ts";
import { TERMS_I18N } from "./terms.i18n.ts";

export function renderTermsPage(locale: Locale = DEFAULT_LOCALE): string {
  return renderArticlePage(TERMS_I18N, locale);
}
