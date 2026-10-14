import { DeterministicECS } from "./ecs.js";
import { MultiModalSpatialIndex } from "./spatial.js";
import { EntityId, GrammarCondition, PropertyPredicate } from "./types.js";

export interface GrammarMatchPair {
  subjectId: EntityId;
  targetId: EntityId;
}

/**
 * Dimension 2 of the Five-Dimensional Emergence Framework: Grammar Matcher.
 * Evaluates spatial adjacency, radius proximity, graph connectivity, and entity state predicates.
 */
export class GrammarMatcher {
  match(
    ecs: DeterministicECS,
    spatial: MultiModalSpatialIndex,
    condition: GrammarCondition
  ): GrammarMatchPair[] {
    switch (condition.kind) {
      case "grid_adjacent":
        return this.matchGridAdjacent(ecs, spatial, condition);
      case "spatial_radius":
        return this.matchSpatialRadius(ecs, spatial, condition);
      case "graph_edge":
        return this.matchGraphEdge(ecs, spatial, condition);
      case "entity_state":
        return this.matchEntityState(ecs, condition);
    }
  }

  private checkPredicates(
    ecs: DeterministicECS,
    entityId: EntityId,
    predicates?: PropertyPredicate[]
  ): boolean {
    if (!predicates || predicates.length === 0) return true;
    for (const p of predicates) {
      const actual = ecs.getProp(entityId, p.prop);
      switch (p.op) {
        case ">":
          if (!(actual > p.value)) return false;
          break;
        case ">=":
          if (!(actual >= p.value)) return false;
          break;
        case "<":
          if (!(actual < p.value)) return false;
          break;
        case "<=":
          if (!(actual <= p.value)) return false;
          break;
        case "==":
          if (Math.abs(actual - p.value) > 1e-6) return false;
          break;
        case "!=":
          if (Math.abs(actual - p.value) <= 1e-6) return false;
          break;
      }
    }
    return true;
  }

  private matchGridAdjacent(
    ecs: DeterministicECS,
    spatial: MultiModalSpatialIndex,
    cond: Extract<GrammarCondition, { kind: "grid_adjacent" }>
  ): GrammarMatchPair[] {
    const subjects = ecs.queryByTags([cond.subjectTag]);
    const matches: GrammarMatchPair[] = [];

    for (const subjectId of subjects) {
      const subEntity = ecs.getEntity(subjectId);
      if (!subEntity) continue;
      if (!this.checkPredicates(ecs, subjectId, cond.subjectPredicates)) continue;

      const neighbors = spatial.getGridNeighbors(
        ecs,
        Math.round(subEntity.x),
        Math.round(subEntity.y),
        cond.eightWay ?? false,
        true
      );

      for (const targetId of neighbors) {
        if (targetId === subjectId) continue;
        if (!ecs.hasTag(targetId, cond.targetTag)) continue;
        if (!this.checkPredicates(ecs, targetId, cond.targetPredicates)) continue;
        matches.push({ subjectId, targetId });
      }
    }
    return matches;
  }

  private matchSpatialRadius(
    ecs: DeterministicECS,
    spatial: MultiModalSpatialIndex,
    cond: Extract<GrammarCondition, { kind: "spatial_radius" }>
  ): GrammarMatchPair[] {
    const subjects = ecs.queryByTags([cond.subjectTag]);
    const matches: GrammarMatchPair[] = [];

    for (const subjectId of subjects) {
      const subEntity = ecs.getEntity(subjectId);
      if (!subEntity) continue;
      if (!this.checkPredicates(ecs, subjectId, cond.subjectPredicates)) continue;

      const candidates = spatial.queryRadius(ecs, subEntity.x, subEntity.y, cond.radius);
      for (const targetId of candidates) {
        if (targetId === subjectId) continue;
        if (!ecs.hasTag(targetId, cond.targetTag)) continue;
        if (!this.checkPredicates(ecs, targetId, cond.targetPredicates)) continue;
        matches.push({ subjectId, targetId });
      }
    }
    return matches;
  }

  private matchGraphEdge(
    ecs: DeterministicECS,
    spatial: MultiModalSpatialIndex,
    cond: Extract<GrammarCondition, { kind: "graph_edge" }>
  ): GrammarMatchPair[] {
    const edges = spatial.getEdgesByKind(cond.edgeKind);
    const matches: GrammarMatchPair[] = [];

    for (const edge of edges) {
      if (!edge.intact) continue;
      const subjectId = edge.from;
      const targetId = edge.to;
      if (!ecs.hasTag(subjectId, cond.subjectTag)) continue;
      if (!ecs.hasTag(targetId, cond.targetTag)) continue;
      if (!this.checkPredicates(ecs, subjectId, cond.subjectPredicates)) continue;
      if (!this.checkPredicates(ecs, targetId, cond.targetPredicates)) continue;
      matches.push({ subjectId, targetId });
    }
    return matches;
  }

  private matchEntityState(
    ecs: DeterministicECS,
    cond: Extract<GrammarCondition, { kind: "entity_state" }>
  ): GrammarMatchPair[] {
    const subjects = ecs.queryByTags([cond.subjectTag]);
    const matches: GrammarMatchPair[] = [];

    for (const subjectId of subjects) {
      if (!this.checkPredicates(ecs, subjectId, cond.subjectPredicates)) continue;
      matches.push({ subjectId, targetId: subjectId });
    }
    return matches;
  }
}
