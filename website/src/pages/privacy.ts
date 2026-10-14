import { renderArticlePage } from "../components/article.ts";
import { DEFAULT_LOCALE, type Locale } from "../i18n/index.ts";
import { PRIVACY_I18N } from "./privacy.i18n.ts";

export function renderPrivacyPage(locale: Locale = DEFAULT_LOCALE): string {
  return renderArticlePage(PRIVACY_I18N, locale);
}
