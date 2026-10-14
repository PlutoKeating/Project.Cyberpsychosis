/**
 * Interactive & Animated SVG Schematics for Landing Page, 8 Documentation Chapters, Legal Pages, and 404.
 * All colors strictly reference `--ds-color-*` tokens; all labels strictly read from `diagrams.i18n.ts`.
 */

import { escapeHtml, pickLocale, trSvg } from "../i18n/index.ts";
import { DIAGRAMS_I18N } from "./diagrams.i18n.ts";

/**
 * 1. Cross-Domain Operation & Causal Cascade Schematic (Landing Stage 2)
 */
export function renderCausalCascadeSchematic(): string {
  const d = DIAGRAMS_I18N.cascade;
  return `<div class="clip-panel overflow-hidden border border-border-strong bg-surface p-4 shadow-lg sm:p-6">
    <svg class="w-full h-auto" viewBox="0 0 1120 340" role="img" aria-label="${escapeHtml(pickLocale(d.ariaLabel))}">
      <rect x="0" y="0" width="1120" height="340" fill="var(--ds-color-code-bg)" rx="8" />
      ${trSvg(d.header, 'x="28" y="34" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}

      <!-- Shared Scalar Blackboard Bar at Bottom -->
      <rect x="28" y="276" width="1064" height="42" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-border-strong)" stroke-width="1.5" />
      <path d="M 110 190 L 110 276 M 280 190 L 280 276 M 450 190 L 450 276 M 620 190 L 620 276 M 800 246 L 800 276 M 990 190 L 990 276" fill="none" stroke="var(--ds-color-border-strong)" stroke-width="1.5" stroke-dasharray="4 4" />
      ${trSvg(d.blackboardLabel, 'x="560" y="302" text-anchor="middle" fill="var(--ds-color-fg-muted)" font-family="var(--ds-font-mono)" font-size="11.5"')}

      <!-- Animated Causal Edges -->
      <path class="svg-flow-fast" d="M 180 145 L 210 145" fill="none" stroke="var(--ds-color-cyber-logic)" stroke-width="2.5" />
      <path class="svg-flow-fast" d="M 350 145 L 380 145" fill="none" stroke="var(--ds-color-cyber-logistics)" stroke-width="2.5" />
      <path class="svg-flow-fast" d="M 520 145 L 550 145" fill="none" stroke="var(--ds-color-cyber-physics)" stroke-width="2.5" />
      <path class="svg-flow" d="M 690 130 L 730 92" fill="none" stroke="var(--ds-color-cyber-chemistry)" stroke-width="2.5" />
      <path class="svg-flow" d="M 690 160 L 730 202" fill="none" stroke="var(--ds-color-cyber-social)" stroke-width="2.5" />
      <path class="svg-flow-fast" d="M 870 92 L 920 135" fill="none" stroke="var(--ds-color-cyber-semantic)" stroke-width="2.5" />
      <path class="svg-flow-fast" d="M 870 202 L 920 155" fill="none" stroke="var(--ds-color-cyber-semantic)" stroke-width="2.5" />

      <!-- Node 1: Grid Push -->
      <g>
        <rect x="34" y="105" width="146" height="80" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-fg-muted)" stroke-width="1.8" />
        ${trSvg(d.n1Title, 'x="107" y="138" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        ${trSvg(d.n1Sub, 'x="107" y="164" text-anchor="middle" fill="var(--ds-color-fg-muted)" font-family="var(--ds-font-sans)" font-size="11.5"')}
      </g>

      <!-- Node 2: Logic Recompile -->
      <g>
        <rect x="210" y="105" width="140" height="80" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logic)" stroke-width="2" />
        ${trSvg(d.n2Title, 'x="280" y="138" text-anchor="middle" fill="var(--ds-color-cyber-logic)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        ${trSvg(d.n2Sub, 'x="280" y="164" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-sans)" font-size="11.5"')}
      </g>

      <!-- Node 3: Logistics Heat -->
      <g>
        <rect x="380" y="105" width="140" height="80" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" stroke-width="2" />
        ${trSvg(d.n3Title, 'x="450" y="138" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        ${trSvg(d.n3Sub, 'x="450" y="164" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-sans)" font-size="11.5"')}
      </g>

      <!-- Node 4: Physics Shockwave -->
      <g>
        <circle class="svg-shockwave" cx="620" cy="145" r="56" fill="none" stroke="var(--ds-color-cyber-physics)" stroke-width="1.5" />
        <rect x="550" y="105" width="140" height="80" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-physics)" stroke-width="2" />
        ${trSvg(d.n4Title, 'x="620" y="138" text-anchor="middle" fill="var(--ds-color-cyber-physics)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        ${trSvg(d.n4Sub, 'x="620" y="164" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-sans)" font-size="11.5"')}
      </g>

      <!-- Node 5: Chemistry Fire -->
      <g>
        <rect x="730" y="54" width="140" height="74" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-chemistry)" stroke-width="2" />
        ${trSvg(d.n5Title, 'x="800" y="84" text-anchor="middle" fill="var(--ds-color-cyber-chemistry)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        ${trSvg(d.n5Sub, 'x="800" y="108" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-sans)" font-size="11.5"')}
      </g>

      <!-- Node 6: Social Contagion -->
      <g>
        <rect x="730" y="166" width="140" height="74" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-social)" stroke-width="2" />
        ${trSvg(d.n6Title, 'x="800" y="196" text-anchor="middle" fill="var(--ds-color-cyber-social)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        ${trSvg(d.n6Sub, 'x="800" y="220" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-sans)" font-size="11.5"')}
      </g>

      <!-- Node 7: Semantic WorldFork -->
      <g>
        <rect class="svg-pulse-node" x="920" y="105" width="166" height="80" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-semantic)" stroke-width="2.2" />
        ${trSvg(d.n7Title, 'x="1003" y="138" text-anchor="middle" fill="var(--ds-color-cyber-semantic)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        ${trSvg(d.n7Sub, 'x="1003" y="164" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-sans)" font-size="11.5"')}
      </g>
    </svg>
  </div>`;
}

/**
 * 2. Six Bento Highlight Card Animated Schematics (Landing Stage 4)
 */
export function renderHighlightSvg(index: string): string {
  const h = DIAGRAMS_I18N.highlights;
  switch (index) {
    case "01":
      return `<svg class="w-full h-36" viewBox="0 0 420 140" aria-hidden="true">
        <rect width="420" height="140" rx="6" fill="var(--ds-color-code-bg)" />
        <path class="svg-flow-fast" d="M 48 62 L 372 62" fill="none" stroke="var(--ds-color-accent)" stroke-width="2" />
        <rect x="14" y="42" width="66" height="40" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(h.h1Vocab, 'x="47" y="66" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="10" font-weight="700"')}
        <rect x="94" y="42" width="72" height="40" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(h.h1Grammar, 'x="130" y="66" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="10" font-weight="700"')}
        <rect x="180" y="42" width="76" height="40" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(h.h1Semantics, 'x="218" y="66" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="9.5" font-weight="700"')}
        <rect class="svg-pulse-node" x="270" y="34" width="68" height="56" rx="5" fill="var(--ds-color-accent-soft)" stroke="var(--ds-color-accent)" stroke-width="2" />
        ${trSvg(h.h1Runtime, 'x="304" y="66" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
        <rect x="350" y="42" width="56" height="40" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" />
        ${trSvg(h.h1Render, 'x="378" y="66" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="10" font-weight="700"')}
        ${trSvg(h.h1Caption, 'x="210" y="118" text-anchor="middle" fill="var(--ds-color-fg-subtle)" font-family="var(--ds-font-mono)" font-size="10.5"')}
      </svg>`;

    case "02":
      return `<svg class="w-full h-36" viewBox="0 0 420 140" aria-hidden="true">
        <rect width="420" height="140" rx="6" fill="var(--ds-color-code-bg)" />
        <rect x="46" y="32" width="72" height="44" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" stroke-width="1.8" />
        ${trSvg(h.h2BlockW, 'x="82" y="59" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        <rect x="132" y="32" width="56" height="44" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-fg)" stroke-width="1.8" />
        ${trSvg(h.h2BlockI, 'x="160" y="59" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        <g class="svg-word-slide">
          <rect x="202" y="32" width="72" height="44" rx="5" fill="var(--ds-color-accent-soft)" stroke="var(--ds-color-accent)" stroke-width="2.2" />
          ${trSvg(h.h2BlockH, 'x="238" y="59" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        </g>
        <rect x="292" y="32" width="72" height="44" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-border-strong)" stroke-dasharray="4 3" />
        ${trSvg(h.h2BlockC, 'x="328" y="59" text-anchor="middle" fill="var(--ds-color-fg-subtle)" font-family="var(--ds-font-mono)" font-size="11"')}
        ${trSvg(h.h2Compiled, 'x="210" y="118" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      </svg>`;

    case "03":
      return `<svg class="w-full h-36" viewBox="0 0 420 140" aria-hidden="true">
        <rect width="420" height="140" rx="6" fill="var(--ds-color-code-bg)" />
        <path class="svg-flow-fast" d="M 105 70 L 155 70 M 245 70 L 295 42 M 245 70 L 295 98" fill="none" stroke="var(--ds-color-accent)" stroke-width="2" />
        <rect x="18" y="50" width="88" height="40" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-accent)" stroke-width="1.8" />
        ${trSvg(h.h3Root, 'x="62" y="74" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="10" font-weight="700"')}
        <rect x="155" y="50" width="90" height="40" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-physics)" stroke-width="1.8" />
        ${trSvg(h.h3Mid2, 'x="200" y="74" text-anchor="middle" fill="var(--ds-color-cyber-physics)" font-family="var(--ds-font-mono)" font-size="10" font-weight="700"')}
        <rect x="295" y="22" width="106" height="36" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" stroke-width="1.6" />
        ${trSvg(h.h3Leaf1, 'x="348" y="44" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="10"')}
        <rect x="295" y="80" width="106" height="36" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-social)" stroke-width="1.8" />
        ${trSvg(h.h3Leaf2, 'x="348" y="102" text-anchor="middle" fill="var(--ds-color-cyber-social)" font-family="var(--ds-font-mono)" font-size="10" font-weight="700"')}
      </svg>`;

    case "04":
      return `<svg class="w-full h-36" viewBox="0 0 420 140" aria-hidden="true">
        <rect width="420" height="140" rx="6" fill="var(--ds-color-code-bg)" />
        <path d="M 36 78 L 210 78" fill="none" stroke="var(--ds-color-accent)" stroke-width="2.5" />
        <path class="svg-flow" d="M 180 72 Q 115 24 58 72" fill="none" stroke="var(--ds-color-cyber-logistics)" stroke-width="2" />
        ${trSvg(h.h4Rewind, 'x="120" y="34" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
        <path d="M 210 78 L 270 42 L 392 42" fill="none" stroke="var(--ds-color-cyber-physics)" stroke-width="2" stroke-dasharray="4 4" />
        <path class="svg-flow-fast" d="M 210 78 L 270 106 L 392 106" fill="none" stroke="var(--ds-color-cyber-semantic)" stroke-width="2.5" />
        <circle cx="56" cy="78" r="6" fill="var(--ds-color-accent)" />
        <circle cx="210" cy="78" r="7" fill="var(--ds-color-accent)" />
        ${trSvg(h.h4Main, 'x="124" y="104" text-anchor="middle" fill="var(--ds-color-fg-muted)" font-family="var(--ds-font-mono)" font-size="10"')}
        ${trSvg(h.h4ForkUnsafe, 'x="332" y="32" text-anchor="middle" fill="var(--ds-color-cyber-physics)" font-family="var(--ds-font-mono)" font-size="10"')}
        ${trSvg(h.h4ForkSafe, 'x="332" y="96" text-anchor="middle" fill="var(--ds-color-cyber-semantic)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
      </svg>`;

    case "05":
      return `<svg class="w-full h-36" viewBox="0 0 420 140" aria-hidden="true">
        <rect width="420" height="140" rx="6" fill="var(--ds-color-code-bg)" />
        <path class="svg-flow" d="M 90 36 L 210 70 M 90 104 L 210 70 M 210 20 L 210 70 M 210 120 L 210 70 M 330 36 L 210 70 M 330 104 L 210 70" fill="none" stroke="var(--ds-color-border-strong)" stroke-width="1.8" />
        <rect x="152" y="48" width="116" height="44" rx="6" fill="var(--ds-color-accent-soft)" stroke="var(--ds-color-accent)" stroke-width="2" />
        ${trSvg(h.h5Center, 'x="210" y="67" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="10" font-weight="700"')}
        ${trSvg(h.h5Props, 'x="210" y="83" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="9.5"')}
        <rect x="38" y="20" width="64" height="28" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-chemistry)" />
        ${trSvg(h.h5P1, 'x="70" y="38" text-anchor="middle" fill="var(--ds-color-cyber-chemistry)" font-family="var(--ds-font-mono)" font-size="10" font-weight="700"')}
        <rect x="38" y="92" width="64" height="28" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-physics)" />
        ${trSvg(h.h5P2, 'x="70" y="110" text-anchor="middle" fill="var(--ds-color-cyber-physics)" font-family="var(--ds-font-mono)" font-size="10" font-weight="700"')}
        <rect x="318" y="20" width="64" height="28" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" />
        ${trSvg(h.h5P4, 'x="350" y="38" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="10" font-weight="700"')}
        <rect x="318" y="92" width="64" height="28" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-social)" />
        ${trSvg(h.h5P5, 'x="350" y="110" text-anchor="middle" fill="var(--ds-color-cyber-social)" font-family="var(--ds-font-mono)" font-size="10" font-weight="700"')}
      </svg>`;

    default:
      return `<svg class="w-full h-36" viewBox="0 0 420 140" aria-hidden="true">
        <rect width="420" height="140" rx="6" fill="var(--ds-color-code-bg)" />
        <path class="svg-flow-fast" d="M 176 70 L 248 40 M 176 70 L 248 100" fill="none" stroke="var(--ds-color-accent)" stroke-width="2.2" />
        <rect x="22" y="46" width="154" height="48" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-accent)" stroke-width="1.8" />
        ${trSvg(h.h6Core, 'x="99" y="74" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
        <rect x="248" y="20" width="150" height="40" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" stroke-width="1.8" />
        ${trSvg(h.h6Web, 'x="323" y="44" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
        <rect x="248" y="80" width="150" height="40" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-semantic)" stroke-width="1.8" />
        ${trSvg(h.h6Tui, 'x="323" y="104" text-anchor="middle" fill="var(--ds-color-cyber-semantic)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
      </svg>`;
  }
}

/**
 * 3. Full 4-Layer Engine Architecture Blueprint SVG (Landing Stage 5)
 */
export function renderArchitectureBlueprintSvg(): string {
  const b = DIAGRAMS_I18N.blueprint;
  return `<div class="clip-panel overflow-hidden border border-border-strong bg-surface p-4 shadow-lg sm:p-6">
    <svg class="w-full h-auto" viewBox="0 0 1120 440" role="img" aria-label="${escapeHtml(pickLocale(b.ariaLabel))}">
      <rect width="1120" height="440" rx="8" fill="var(--ds-color-code-bg)" />

      <!-- Layer 4 -->
      <rect x="24" y="18" width="1072" height="78" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" stroke-width="1.8" />
      ${trSvg(b.l4Tag, 'x="44" y="40" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      <rect x="44" y="50" width="332" height="34" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-border-strong)" />
      ${trSvg(b.l4A, 'x="210" y="71" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="11"')}
      <rect x="394" y="50" width="332" height="34" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-border-strong)" />
      ${trSvg(b.l4B, 'x="560" y="71" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="11"')}
      <rect x="744" y="50" width="332" height="34" rx="4" fill="var(--ds-color-accent-soft)" stroke="var(--ds-color-accent)" />
      ${trSvg(b.l4C, 'x="910" y="71" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}

      <!-- Protocol 4 <-> 3 -->
      ${trSvg(b.proto43, 'x="560" y="114" text-anchor="middle" fill="var(--ds-color-fg-muted)" font-family="var(--ds-font-mono)" font-size="10.5"')}

      <!-- Layer 3 -->
      <rect x="24" y="126" width="1072" height="68" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-border-strong)" stroke-width="1.6" />
      ${trSvg(b.l3Tag, 'x="44" y="148" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      <rect x="44" y="156" width="1032" height="28" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-border)" />
      ${trSvg(b.l3Box, 'x="560" y="175" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="11"')}

      <!-- Protocol 3 <-> 2 -->
      ${trSvg(b.proto32, 'x="560" y="212" text-anchor="middle" fill="var(--ds-color-fg-muted)" font-family="var(--ds-font-mono)" font-size="10.5"')}

      <!-- Layer 2 -->
      <rect x="24" y="224" width="1072" height="82" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-accent)" stroke-width="1.8" />
      ${trSvg(b.l2Tag, 'x="44" y="246" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      <rect x="44" y="258" width="160" height="36" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-cyber-chemistry)" />
      ${trSvg(b.pChem, 'x="124" y="280" text-anchor="middle" fill="var(--ds-color-cyber-chemistry)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      <rect x="218" y="258" width="160" height="36" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-cyber-physics)" />
      ${trSvg(b.pPhys, 'x="298" y="280" text-anchor="middle" fill="var(--ds-color-cyber-physics)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      <rect x="392" y="258" width="160" height="36" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-cyber-logic)" />
      ${trSvg(b.pLogic, 'x="472" y="280" text-anchor="middle" fill="var(--ds-color-cyber-logic)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      <rect x="566" y="258" width="160" height="36" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-cyber-logistics)" />
      ${trSvg(b.pPipe, 'x="646" y="280" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      <rect x="740" y="258" width="160" height="36" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-cyber-social)" />
      ${trSvg(b.pSoc, 'x="820" y="280" text-anchor="middle" fill="var(--ds-color-cyber-social)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      <rect x="914" y="258" width="162" height="36" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-cyber-semantic)" />
      ${trSvg(b.pSem, 'x="995" y="280" text-anchor="middle" fill="var(--ds-color-cyber-semantic)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}

      <!-- Layer 1 -->
      <rect x="24" y="324" width="1072" height="94" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-semantic)" stroke-width="2" />
      ${trSvg(b.l1Tag, 'x="44" y="348" fill="var(--ds-color-cyber-semantic)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      <rect x="44" y="362" width="160" height="40" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-border-strong)" />
      ${trSvg(b.k1, 'x="124" y="386" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
      <rect x="218" y="362" width="160" height="40" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-border-strong)" />
      ${trSvg(b.k2, 'x="298" y="386" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
      <rect x="392" y="362" width="160" height="40" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-border-strong)" />
      ${trSvg(b.k3, 'x="472" y="386" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
      <rect x="566" y="362" width="160" height="40" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-border-strong)" />
      ${trSvg(b.k4, 'x="646" y="386" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
      <rect x="740" y="362" width="160" height="40" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-border-strong)" />
      ${trSvg(b.k5, 'x="820" y="386" text-anchor="middle" fill="var(--ds-color-cyber-social)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
      <rect x="914" y="362" width="162" height="40" rx="4" fill="var(--ds-color-bg-elevated)" stroke="var(--ds-color-border-strong)" />
      ${trSvg(b.k6, 'x="995" y="386" text-anchor="middle" fill="var(--ds-color-cyber-semantic)" font-family="var(--ds-font-mono)" font-size="10.5" font-weight="700"')}
    </svg>
  </div>`;
}

/**
 * 4. Dedicated SVG Schematic for each of the 8 Documentation Chapters
 */
export function renderDocChapterSvg(chapterNumber: string): string {
  const dc = DIAGRAMS_I18N.docChapters;
  const h = DIAGRAMS_I18N.highlights;
  switch (chapterNumber) {
    case "01":
      return `<svg class="w-full h-auto" viewBox="0 0 760 150" aria-hidden="true">
        <rect width="760" height="150" rx="6" fill="var(--ds-color-code-bg)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(dc.ch01Title, 'x="24" y="28" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <path class="svg-flow-fast" d="M 80 86 L 680 86" fill="none" stroke="var(--ds-color-accent)" stroke-width="2" />
        <rect x="24" y="62" width="116" height="48" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(h.h1Vocab, 'x="82" y="90" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="172" y="62" width="116" height="48" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(h.h1Grammar, 'x="230" y="90" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="320" y="62" width="116" height="48" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(h.h1Semantics, 'x="378" y="90" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="468" y="54" width="124" height="64" rx="6" fill="var(--ds-color-accent-soft)" stroke="var(--ds-color-accent)" stroke-width="2" />
        ${trSvg(h.h1Runtime, 'x="530" y="90" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        <rect x="620" y="62" width="116" height="48" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" />
        ${trSvg(h.h1Render, 'x="678" y="90" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      </svg>`;

    case "02":
      return `<svg class="w-full h-auto" viewBox="0 0 760 150" aria-hidden="true">
        <rect width="760" height="150" rx="6" fill="var(--ds-color-code-bg)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(dc.ch02Title, 'x="24" y="28" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <path class="svg-flow-fast" d="M 244 86 L 340 60 M 244 86 L 340 112" fill="none" stroke="var(--ds-color-accent)" stroke-width="2" />
        <rect x="24" y="58" width="220" height="56" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-accent)" stroke-width="1.8" />
        ${trSvg(h.h6Core, 'x="134" y="90" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11.5" font-weight="700"')}
        <rect x="340" y="40" width="392" height="40" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" />
        ${trSvg(h.h6Web, 'x="536" y="65" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="11.5" font-weight="700"')}
        <rect x="340" y="92" width="392" height="40" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-semantic)" />
        ${trSvg(h.h6Tui, 'x="536" y="117" text-anchor="middle" fill="var(--ds-color-cyber-semantic)" font-family="var(--ds-font-mono)" font-size="11.5" font-weight="700"')}
      </svg>`;

    case "03":
      return `<svg class="w-full h-auto" viewBox="0 0 760 150" aria-hidden="true">
        <rect width="760" height="150" rx="6" fill="var(--ds-color-code-bg)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(dc.ch03Title, 'x="24" y="28" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="24" y="48" width="224" height="82" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-accent)" />
        ${trSvg(dc.c03Grid, 'x="136" y="94" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="268" y="48" width="224" height="82" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-physics)" />
        ${trSvg(dc.c03Radius, 'x="380" y="94" text-anchor="middle" fill="var(--ds-color-cyber-physics)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="512" y="48" width="224" height="82" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" />
        ${trSvg(dc.c03Graph, 'x="624" y="94" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      </svg>`;

    case "04":
      return `<svg class="w-full h-auto" viewBox="0 0 760 150" aria-hidden="true">
        <rect width="760" height="150" rx="6" fill="var(--ds-color-code-bg)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(dc.ch04Title, 'x="24" y="28" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="44" y="56" width="110" height="56" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" stroke-width="2" />
        ${trSvg(h.h2BlockW, 'x="99" y="89" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="13" font-weight="700"')}
        <rect x="174" y="56" width="90" height="56" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-fg)" stroke-width="2" />
        ${trSvg(h.h2BlockI, 'x="219" y="89" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="13" font-weight="700"')}
        <rect x="284" y="56" width="110" height="56" rx="6" fill="var(--ds-color-accent-soft)" stroke="var(--ds-color-accent)" stroke-width="2.2" />
        ${trSvg(h.h2BlockH, 'x="339" y="89" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="13" font-weight="700"')}
        <path class="svg-flow-fast" d="M 412 84 L 494 84" fill="none" stroke="var(--ds-color-accent)" stroke-width="2.5" />
        <rect x="504" y="56" width="224" height="56" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-semantic)" stroke-width="2" />
        ${trSvg(h.h2Compiled, 'x="616" y="89" text-anchor="middle" fill="var(--ds-color-cyber-semantic)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
      </svg>`;

    case "05":
      return `<svg class="w-full h-auto" viewBox="0 0 760 150" aria-hidden="true">
        <rect width="760" height="150" rx="6" fill="var(--ds-color-code-bg)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(dc.ch05Title, 'x="24" y="28" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <path d="M 50 96 L 360 96" fill="none" stroke="var(--ds-color-accent)" stroke-width="3" />
        <path class="svg-flow" d="M 320 90 Q 200 32 80 90" fill="none" stroke="var(--ds-color-cyber-logistics)" stroke-width="2" />
        ${trSvg(h.h4Rewind, 'x="200" y="54" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <path d="M 360 96 L 460 58 L 710 58" fill="none" stroke="var(--ds-color-cyber-physics)" stroke-width="2" stroke-dasharray="5 4" />
        <path class="svg-flow-fast" d="M 360 96 L 460 120 L 710 120" fill="none" stroke="var(--ds-color-cyber-semantic)" stroke-width="2.8" />
        ${trSvg(h.h4ForkUnsafe, 'x="585" y="48" text-anchor="middle" fill="var(--ds-color-cyber-physics)" font-family="var(--ds-font-mono)" font-size="11"')}
        ${trSvg(h.h4ForkSafe, 'x="585" y="110" text-anchor="middle" fill="var(--ds-color-cyber-semantic)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      </svg>`;

    case "06":
      return `<svg class="w-full h-auto" viewBox="0 0 760 150" aria-hidden="true">
        <rect width="760" height="150" rx="6" fill="var(--ds-color-code-bg)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(dc.ch06Title, 'x="24" y="28" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="280" y="54" width="200" height="62" rx="6" fill="var(--ds-color-accent-soft)" stroke="var(--ds-color-accent)" stroke-width="2" />
        ${trSvg(h.h5Center, 'x="380" y="80" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
        ${trSvg(h.h5Props, 'x="380" y="100" text-anchor="middle" fill="var(--ds-color-fg)" font-family="var(--ds-font-mono)" font-size="11"')}
        <rect x="36" y="44" width="96" height="34" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-chemistry)" />
        ${trSvg(h.h5P1, 'x="84" y="65" text-anchor="middle" fill="var(--ds-color-cyber-chemistry)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="36" y="92" width="96" height="34" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-physics)" />
        ${trSvg(h.h5P2, 'x="84" y="113" text-anchor="middle" fill="var(--ds-color-cyber-physics)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="628" y="44" width="96" height="34" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" />
        ${trSvg(h.h5P4, 'x="676" y="65" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="628" y="92" width="96" height="34" rx="4" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-social)" />
        ${trSvg(h.h5P5, 'x="676" y="113" text-anchor="middle" fill="var(--ds-color-cyber-social)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      </svg>`;

    case "07":
      return `<svg class="w-full h-auto" viewBox="0 0 760 150" aria-hidden="true">
        <rect width="760" height="150" rx="6" fill="var(--ds-color-code-bg)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(dc.ch07Title, 'x="24" y="28" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="36" y="56" width="240" height="60" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-accent)" stroke-width="2" />
        ${trSvg(dc.c07Server, 'x="156" y="91" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <path class="svg-flow-fast" d="M 276 76 L 484 76 M 484 98 L 276 98" fill="none" stroke="var(--ds-color-cyber-logistics)" stroke-width="2.2" />
        <rect x="484" y="56" width="240" height="60" rx="6" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-logistics)" stroke-width="2" />
        ${trSvg(dc.c07Client, 'x="604" y="91" text-anchor="middle" fill="var(--ds-color-cyber-logistics)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      </svg>`;

    default:
      return `<svg class="w-full h-auto" viewBox="0 0 760 150" aria-hidden="true">
        <rect width="760" height="150" rx="6" fill="var(--ds-color-code-bg)" stroke="var(--ds-color-border-strong)" />
        ${trSvg(dc.ch08Title, 'x="24" y="28" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <path class="svg-flow-fast" d="M 150 86 L 610 86" fill="none" stroke="var(--ds-color-cyber-semantic)" stroke-width="2.2" />
        <rect x="36" y="60" width="150" height="52" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-cyber-semantic)" stroke-width="2" />
        ${trSvg(DIAGRAMS_I18N.blueprint.k1, 'x="111" y="90" text-anchor="middle" fill="var(--ds-color-cyber-semantic)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="290" y="60" width="180" height="52" rx="5" fill="var(--ds-color-surface)" stroke="var(--ds-color-accent)" stroke-width="2" />
        ${trSvg(DIAGRAMS_I18N.blueprint.pLogic, 'x="380" y="90" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
        <rect x="574" y="60" width="150" height="52" rx="5" fill="var(--ds-color-accent-soft)" stroke="var(--ds-color-accent)" stroke-width="2" />
        ${trSvg(h.h6Web, 'x="649" y="90" text-anchor="middle" fill="var(--ds-color-accent)" font-family="var(--ds-font-mono)" font-size="11" font-weight="700"')}
      </svg>`;
  }
}

/**
 * 5. Article Hero Schematic (About / Terms / Privacy) & 404 Schematic
 */
export function renderArticleHeroSvg(kind: "about" | "terms" | "privacy"): string {
  const a = DIAGRAMS_I18N.articles;
  const label =
    kind === "about"
      ? a.aboutBanner
      : kind === "terms"
        ? a.termsBanner
        : a.privacyBanner;
  const strokeColor =
    kind === "about"
      ? "var(--ds-color-accent)"
      : kind === "terms"
        ? "var(--ds-color-cyber-logistics)"
        : "var(--ds-color-cyber-semantic)";

  return `<svg class="w-full h-24" viewBox="0 0 720 96" aria-hidden="true">
    <rect width="720" height="96" rx="6" fill="var(--ds-color-code-bg)" stroke="${strokeColor}" stroke-width="1.5" />
    <path class="svg-flow" d="M 40 48 L 680 48" fill="none" stroke="var(--ds-color-border-strong)" stroke-width="1.5" />
    <rect x="110" y="24" width="500" height="48" rx="6" fill="var(--ds-color-surface)" stroke="${strokeColor}" stroke-width="1.8" />
    ${trSvg(label, `x="360" y="53" text-anchor="middle" fill="${strokeColor}" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"`)}
  </svg>`;
}

export function renderNotFoundSvg(): string {
  const a = DIAGRAMS_I18N.articles;
  return `<svg class="mx-auto w-full max-w-prose h-44" viewBox="0 0 640 176" aria-hidden="true">
    <rect width="640" height="176" rx="8" fill="var(--ds-color-code-bg)" stroke="var(--ds-color-cyber-physics)" stroke-width="1.8" />
    <path d="M 60 88 L 260 88" fill="none" stroke="var(--ds-color-accent)" stroke-width="3" />
    <path class="svg-flow" d="M 300 88 L 580 52" fill="none" stroke="var(--ds-color-cyber-physics)" stroke-width="2.5" />
    <circle cx="260" cy="88" r="8" fill="var(--ds-color-cyber-physics)" />
    <circle class="svg-shockwave" cx="260" cy="88" r="26" fill="none" stroke="var(--ds-color-cyber-physics)" stroke-width="1.5" />
    ${trSvg(a.notFoundCode, 'x="320" y="38" text-anchor="middle" fill="var(--ds-color-cyber-physics)" font-family="var(--ds-font-mono)" font-size="12" font-weight="700"')}
    ${trSvg(a.notFoundSub, 'x="320" y="146" text-anchor="middle" fill="var(--ds-color-fg-muted)" font-family="var(--ds-font-sans)" font-size="12"')}
  </svg>`;
}
