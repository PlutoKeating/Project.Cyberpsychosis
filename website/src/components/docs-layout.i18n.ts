import { definePageI18n, L } from "../i18n/index.ts";

export const DOCS_LAYOUT_I18N = definePageI18n({
  sidebarHeading: L("// 章节目录 · CHAPTERS", "// DOCS CHAPTERS"),
  tocHeading: L("// 本页小节 · ON THIS PAGE", "// ON THIS PAGE"),
  chapterPrefix: L("CHAPTER", "CHAPTER"),
  prevChapter: L("← 上一章", "← PREVIOUS"),
  nextChapter: L("下一章 →", "NEXT →"),
  sdkBadge: L("CYBERPSYCHOSIS SDK", "CYBERPSYCHOSIS SDK"),
  paginationAria: L("Chapter Pagination", "Chapter Pagination"),
  titleSuffix: L(" — Cyberpsychosis 文档", " — Cyberpsychosis Docs"),
  tocPrefix: L("#", "#"),
  codePrefix: L("//", "//"),
  sepDot: L("·", "·"),
  sepSlashes: L("//", "//"),
});
