import { CausalTracker } from "./causal.js";
import { DeterministicECS } from "./ecs.js";
import { GrammarMatchPair } from "./grammar.js";
import { DeclarativeRule, EntityId, SemanticAction } from "./types.js";
import { VocabularyRegistry } from "./vocabulary.js";

/**
 * Dimension 3 of the Five-Dimensional Emergence Framework: Semantics Executor.
 * Applies atomic state transformations and records causal lineage edges.
 */
export class SemanticsExecutor {
  executeRuleActions(
    tick: number,
    ecs: DeterministicECS,
    vocabulary: VocabularyRegistry,
    causal: CausalTracker,
    rule: DeclarativeRule,
    pair: GrammarMatchPair,
    parentCauseIds?: string[]
  ): void {
    const { subjectId, targetId } = pair;
    if (!ecs.hasEntity(subjectId) || !ecs.hasEntity(targetId)) return;

    const resolveTarget = (who: "subject" | "target"): EntityId =>
      who === "subject" ? subjectId : targetId;

    let mutated = false;

    for (const action of rule.semantics) {
      switch (action.kind) {
        case "add_prop": {
          const eid = resolveTarget(action.target);
          const before = ecs.getProp(eid, action.prop);
          const after = ecs.addProp(eid, action.prop, action.delta);
          if (Math.abs(after - before) > 1e-6) mutated = true;
          break;
        }
        case "set_prop": {
          const eid = resolveTarget(action.target);
          const before = ecs.getProp(eid, action.prop);
          const after = ecs.setProp(eid, action.prop, action.value);
          if (Math.abs(after - before) > 1e-6) mutated = true;
          break;
        }
        case "add_tag": {
          const eid = resolveTarget(action.target);
          if (!ecs.hasTag(eid, action.tag)) {
            ecs.addTag(eid, action.tag);
            mutated = true;
          }
          break;
        }
        case "remove_tag": {
          const eid = resolveTarget(action.target);
          if (ecs.hasTag(eid, action.tag)) {
            ecs.removeTag(eid, action.tag);
            mutated = true;
          }
          break;
        }
        case "spawn": {
          const anchor = ecs.getEntity(resolveTarget(action.at));
          if (anchor) {
            const spawnedId = vocabulary.spawnPrefab(ecs, action.prefabId, anchor.x, anchor.y);
            const node = causal.recordEvent({
              tick,
              domain: rule.source === "semantic_dsl" ? "semantic" : "core",
              type: `rule_spawn:${rule.id}`,
              summary: `Rule [${rule.name}] spawned ${action.prefabId} (#${spawnedId}) at (${anchor.x},${anchor.y})`,
              subjectIds: [subjectId, targetId, spawnedId],
              parentCauseIds,
            });
            causal.setLastCauseForEntity(spawnedId, node.id);
          }
          break;
        }
        case "destroy": {
          const eid = resolveTarget(action.target);
          if (ecs.destroyEntity(eid)) {
            mutated = true;
          }
          break;
        }
        case "emit_event": {
          if (mutated || rule.semantics.length === 1) {
            causal.recordEvent({
              tick,
              domain: action.domain ?? (rule.source === "semantic_dsl" ? "semantic" : "core"),
              type: action.eventType,
              summary: action.summary,
              subjectIds: subjectId === targetId ? [subjectId] : [subjectId, targetId],
              parentCauseIds,
            });
          }
          break;
        }
      }
    }
  }
}
