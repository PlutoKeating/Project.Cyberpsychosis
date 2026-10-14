import { CausalTracker } from "./causal.js";
import { DeterministicECS } from "./ecs.js";
import { GrammarMatcher } from "./grammar.js";
import { SemanticsExecutor } from "./semantics.js";
import { MultiModalSpatialIndex } from "./spatial.js";
import {
  ActiveRuleSummary,
  DeclarativeRule,
  EntityId,
  GlobalTagOverride,
  SemanticAction,
} from "./types.js";
import { VocabularyRegistry } from "./vocabulary.js";

export interface InternalRuleState {
  rules: DeclarativeRule[];
  overrides: GlobalTagOverride[];
}

/**
 * Rule-as-Entity Engine & Restricted Emergence DSL Compiler.
 * Supports:
 * 1. Static declarative rules
 * 2. Baba-Is-You style grid word block runtime compilation ([WORD_NOUN] [IS] [WORD_PROP])
 * 3. Restricted DSL parsing & validation for safe LLM / user rule injection
 */
export class RuleEngine {
  private rules = new Map<string, DeclarativeRule>();
  private overrides = new Map<string, GlobalTagOverride>();

  registerRule(rule: DeclarativeRule): void {
    this.rules.set(rule.id, {
      ...rule,
      semantics: [...rule.semantics],
    });
  }

  removeRule(id: string): boolean {
    return this.rules.delete(id);
  }

  getRules(): DeclarativeRule[] {
    return Array.from(this.rules.values()).sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return a.id.localeCompare(b.id);
    });
  }

  getOverrides(): GlobalTagOverride[] {
    return Array.from(this.overrides.values());
  }

  getActiveRuleSummaries(): ActiveRuleSummary[] {
    const summaries: ActiveRuleSummary[] = [];
    for (const ov of this.overrides.values()) {
      summaries.push({
        id: ov.id,
        name: `${ov.nounTag.toUpperCase()} IS ${ov.propertyTag.toUpperCase()}`,
        source: ov.source,
        description: `All [${ov.nounTag}] entities dynamically acquire [${ov.propertyTag}] behavior`,
      });
    }
    for (const r of this.getRules()) {
      if (!r.enabled) continue;
      summaries.push({
        id: r.id,
        name: r.name,
        source: r.source,
        description: r.dslText ?? `${r.grammar.kind} -> ${r.semantics.map((s) => s.kind).join(", ")}`,
      });
    }
    return summaries;
  }

  /**
   * Scans the 2D grid for 3-tile horizontal or vertical sequences:
   * [word_noun] + [word_verb:IS] + [word_prop]
   * and dynamically updates active overrides (Baba Is You style).
   */
  syncGridWordBlockRules(
    tick: number,
    ecs: DeterministicECS,
    spatial: MultiModalSpatialIndex,
    causal: CausalTracker
  ): void {
    const nounEntities = ecs.queryByTags(["word_block", "word_noun"]);
    const discovered = new Map<string, GlobalTagOverride>();

    const checkSequence = (dx: number, dy: number, nounId: EntityId) => {
      const nounEnt = ecs.getEntity(nounId);
      if (!nounEnt) return;
      const nx = Math.round(nounEnt.x);
      const ny = Math.round(nounEnt.y);
      const verbCandidates = spatial.getEntitiesAtGrid(ecs, nx + dx, ny + dy);
      const propCandidates = spatial.getEntitiesAtGrid(ecs, nx + dx * 2, ny + dy * 2);

      for (const verbId of verbCandidates) {
        if (!ecs.hasTag(verbId, "word_verb")) continue;
        const verbToken = (ecs.getMeta(verbId, "wordToken") ?? "IS").toUpperCase();
        if (verbToken !== "IS") continue;

        for (const propId of propCandidates) {
          if (!ecs.hasTag(propId, "word_prop")) continue;
          const nounToken = (ecs.getMeta(nounId, "wordToken") ?? "").toLowerCase();
          const propToken = (ecs.getMeta(propId, "wordToken") ?? "").toLowerCase();
          if (!nounToken || !propToken) continue;

          const id = `baba:${nounToken}_is_${propToken}`;
          discovered.set(id, {
            id,
            nounTag: nounToken,
            verb: "IS",
            propertyTag: propToken,
            source: "grid_word_blocks",
            sourceEntityIds: [nounId, verbId, propId],
          });
        }
      }
    };

    for (const nounId of nounEntities) {
      checkSequence(1, 0, nounId);
      checkSequence(0, 1, nounId);
    }

    // Remove deactivated grid overrides and clean up their granted tags
    for (const [id, prev] of Array.from(this.overrides.entries())) {
      if (prev.source === "grid_word_blocks" && !discovered.has(id)) {
        this.overrides.delete(id);
        this.revokeOverrideFromEntities(ecs, prev);
        causal.recordEvent({
          tick,
          domain: "logic",
          type: "rule_deactivated",
          summary: `Grid rule [${prev.nounTag.toUpperCase()} IS ${prev.propertyTag.toUpperCase()}] broken and deactivated`,
          subjectIds: prev.sourceEntityIds,
        });
      }
    }

    // Activate newly formed grid overrides
    for (const [id, next] of discovered.entries()) {
      if (!this.overrides.has(id)) {
        const parentCauses: string[] = [];
        for (const wid of next.sourceEntityIds) {
          const c = causal.getLastCauseForEntity(wid);
          if (c) parentCauses.push(c);
        }
        const evt = causal.recordEvent({
          tick,
          domain: "logic",
          type: "rule_compiled",
          summary: `Compiled active grid meta-rule: [${next.nounTag.toUpperCase()} IS ${next.propertyTag.toUpperCase()}]`,
          subjectIds: next.sourceEntityIds,
          parentCauseIds: parentCauses,
        });
        next.causeId = evt.id;
        this.overrides.set(id, next);
      }
    }

    // Apply all active overrides to matching entities in ECS
    for (const ov of this.overrides.values()) {
      this.applyOverrideToEntities(ecs, causal, ov);
    }
  }

  private applyOverrideToEntities(
    ecs: DeterministicECS,
    causal: CausalTracker,
    ov: GlobalTagOverride
  ): void {
    const targets = ecs.queryByTags([ov.nounTag]);
    for (const entityId of targets) {
      const wasApplied = ecs.hasTag(entityId, ov.propertyTag);
      ecs.addTag(entityId, ov.propertyTag);

      // Standard property semantics for known meta-tags
      if (ov.propertyTag === "hot") {
        ecs.removeTag(entityId, "cool");
        if (ecs.getProp(entityId, "temp") < 95) {
          ecs.setProp(entityId, "temp", 95);
        }
      } else if (ov.propertyTag === "cool") {
        ecs.removeTag(entityId, "hot");
        if (ecs.getProp(entityId, "temp") > 15) {
          ecs.setProp(entityId, "temp", 15);
        }
      } else if (ov.propertyTag === "calm") {
        ecs.setProp(entityId, "calmAura", 1);
      }

      if (!wasApplied && ov.causeId) {
        causal.setLastCauseForEntity(entityId, ov.causeId);
      }
    }
  }

  private revokeOverrideFromEntities(ecs: DeterministicECS, ov: GlobalTagOverride): void {
    const targets = ecs.queryByTags([ov.nounTag]);
    for (const entityId of targets) {
      ecs.removeTag(entityId, ov.propertyTag);
    }
  }

  evaluateDeclarativeRules(
    tick: number,
    ecs: DeterministicECS,
    vocabulary: VocabularyRegistry,
    grammar: GrammarMatcher,
    semantics: SemanticsExecutor,
    spatial: MultiModalSpatialIndex,
    causal: CausalTracker
  ): void {
    for (const rule of this.getRules()) {
      if (!rule.enabled) continue;
      const matches = grammar.match(ecs, spatial, rule.grammar);
      for (const pair of matches) {
        semantics.executeRuleActions(tick, ecs, vocabulary, causal, rule, pair);
      }
    }
  }

  /**
   * Parses and registers a Restricted Emergence DSL string:
   * - `OVERRIDE <nounTag> IS <propertyTag>`
   * - `RULE <id> WHEN adjacent(<subjectTag>, <targetTag>) DO <action1>; <action2>`
   */
  injectDsl(
    tick: number,
    dslText: string,
    ecs: DeterministicECS,
    causal: CausalTracker
  ): { kind: "override" | "rule"; id: string; summary: string } {
    const cleaned = dslText.trim();
    const overrideMatch = /^OVERRIDE\s+([a-zA-Z0-9_]+)\s+IS\s+([a-zA-Z0-9_]+)$/i.exec(cleaned);
    if (overrideMatch) {
      const nounTag = overrideMatch[1].toLowerCase();
      const propertyTag = overrideMatch[2].toLowerCase();
      const id = `dsl_override:${nounTag}_is_${propertyTag}`;
      const targets = ecs.queryByTags([nounTag]);
      const evt = causal.recordEvent({
        tick,
        domain: "semantic",
        type: "dsl_override_injected",
        summary: `Semantic DSL injected global override: [${nounTag.toUpperCase()} IS ${propertyTag.toUpperCase()}]`,
        subjectIds: targets,
      });
      const ov: GlobalTagOverride = {
        id,
        nounTag,
        verb: "IS",
        propertyTag,
        source: "semantic_dsl",
        sourceEntityIds: targets,
        causeId: evt.id,
      };
      this.overrides.set(id, ov);
      this.applyOverrideToEntities(ecs, causal, ov);
      return {
        kind: "override",
        id,
        summary: `OVERRIDE ${nounTag.toUpperCase()} IS ${propertyTag.toUpperCase()}`,
      };
    }

    const ruleMatch =
      /^RULE\s+([a-zA-Z0-9_]+)\s+WHEN\s+adjacent\(\s*([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*\)\s+DO\s+(.+)$/i.exec(
        cleaned
      );
    if (!ruleMatch) {
      throw new Error(
        `Invalid Restricted Emergence DSL syntax: "${cleaned}". Expected "OVERRIDE <noun> IS <prop>" or "RULE <id> WHEN adjacent(<a>, <b>) DO <actions>"`
      );
    }

    const [, ruleId, subjectTag, targetTag, actionsRaw] = ruleMatch;
    const actions: SemanticAction[] = actionsRaw
      .split(";")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((stmt): SemanticAction => {
        const addPropMatch = /^add_prop\(\s*(subject|target)\.([a-zA-Z0-9_]+)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/i.exec(
          stmt
        );
        if (addPropMatch) {
          return {
            kind: "add_prop",
            target: addPropMatch[1].toLowerCase() as "subject" | "target",
            prop: addPropMatch[2],
            delta: Number(addPropMatch[3]),
          };
        }

        const setPropMatch = /^set_prop\(\s*(subject|target)\.([a-zA-Z0-9_]+)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/i.exec(
          stmt
        );
        if (setPropMatch) {
          return {
            kind: "set_prop",
            target: setPropMatch[1].toLowerCase() as "subject" | "target",
            prop: setPropMatch[2],
            value: Number(setPropMatch[3]),
          };
        }

        const addTagMatch = /^add_tag\(\s*(subject|target)\s*,\s*([a-zA-Z0-9_]+)\s*\)$/i.exec(stmt);
        if (addTagMatch) {
          return {
            kind: "add_tag",
            target: addTagMatch[1].toLowerCase() as "subject" | "target",
            tag: addTagMatch[2].toLowerCase(),
          };
        }

        const removeTagMatch = /^remove_tag\(\s*(subject|target)\s*,\s*([a-zA-Z0-9_]+)\s*\)$/i.exec(
          stmt
        );
        if (removeTagMatch) {
          return {
            kind: "remove_tag",
            target: removeTagMatch[1].toLowerCase() as "subject" | "target",
            tag: removeTagMatch[2].toLowerCase(),
          };
        }

        const emitMatch = /^emit\(\s*"([^"]+)"\s*\)$/i.exec(stmt);
        if (emitMatch) {
          return {
            kind: "emit_event",
            domain: "semantic",
            eventType: `dsl_event:${ruleId}`,
            summary: emitMatch[1],
          };
        }

        throw new Error(`Unsupported DSL action statement: "${stmt}"`);
      });

    const rule: DeclarativeRule = {
      id: ruleId,
      name: `DSL:${ruleId}`,
      priority: 50,
      enabled: true,
      source: "semantic_dsl",
      dslText: cleaned,
      grammar: {
        kind: "grid_adjacent",
        subjectTag: subjectTag.toLowerCase(),
        targetTag: targetTag.toLowerCase(),
        eightWay: true,
      },
      semantics: actions,
    };

    this.registerRule(rule);
    causal.recordEvent({
      tick,
      domain: "semantic",
      type: "dsl_rule_injected",
      summary: `Semantic DSL registered rule [${ruleId}]: ${cleaned}`,
      subjectIds: ecs.queryByTags([subjectTag.toLowerCase()]),
    });

    return {
      kind: "rule",
      id: ruleId,
      summary: cleaned,
    };
  }

  exportState(): InternalRuleState {
    return {
      rules: this.getRules().map((r) => ({
        ...r,
        grammar: { ...r.grammar },
        semantics: r.semantics.map((s) => ({ ...s })),
      })),
      overrides: this.getOverrides().map((o) => ({
        ...o,
        sourceEntityIds: [...o.sourceEntityIds],
      })),
    };
  }

  importState(state: InternalRuleState): void {
    this.rules.clear();
    for (const r of state.rules) {
      this.rules.set(r.id, {
        ...r,
        grammar: { ...r.grammar },
        semantics: r.semantics.map((s) => ({ ...s })),
      });
    }
    this.overrides.clear();
    for (const o of state.overrides) {
      this.overrides.set(o.id, {
        ...o,
        sourceEntityIds: [...o.sourceEntityIds],
      });
    }
  }
}
