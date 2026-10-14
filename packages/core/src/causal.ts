import { CausalDomain, CausalLineageReport, CausalNode, EntityId } from "./types.js";

export interface InternalCausalState {
  nextSeq: number;
  nodes: CausalNode[];
  lastCauseByEntity: Array<[EntityId, string]>;
}

export interface CausalFrameDelta {
  prevNextSeq: number;
  addedNodeIds: string[];
  prevLastCauseByEntity: Array<[EntityId, string | undefined]>;
}

/**
 * First-class Causal Event Bus & Directed Acyclic Graph (Causal DAG) tracker.
 * Automatically stitches cross-domain events by tracking the latest causal node that mutated each entity.
 */
export class CausalTracker {
  private nextSeq = 1;
  private nodes = new Map<string, CausalNode>();
  private lastCauseByEntity = new Map<EntityId, string>();

  // Copy-on-Write frame delta tracking
  private trackingDelta = false;
  private deltaPrevNextSeq = 1;
  private deltaAddedNodeIds: string[] = [];
  private deltaPrevLastCause = new Map<EntityId, string | undefined>();

  beginDeltaTracking(): void {
    this.trackingDelta = true;
    this.deltaPrevNextSeq = this.nextSeq;
    this.deltaAddedNodeIds = [];
    this.deltaPrevLastCause.clear();
  }

  flushDelta(): CausalFrameDelta {
    const delta: CausalFrameDelta = {
      prevNextSeq: this.deltaPrevNextSeq,
      addedNodeIds: [...this.deltaAddedNodeIds],
      prevLastCauseByEntity: Array.from(this.deltaPrevLastCause.entries()),
    };
    this.trackingDelta = false;
    this.deltaAddedNodeIds = [];
    this.deltaPrevLastCause.clear();
    return delta;
  }

  rollbackDelta(delta: CausalFrameDelta): void {
    const wasTracking = this.trackingDelta;
    this.trackingDelta = false;
    for (const id of delta.addedNodeIds) {
      this.nodes.delete(id);
    }
    for (const [eid, prevCause] of delta.prevLastCauseByEntity) {
      if (prevCause === undefined) {
        this.lastCauseByEntity.delete(eid);
      } else {
        this.lastCauseByEntity.set(eid, prevCause);
      }
    }
    this.nextSeq = delta.prevNextSeq;
    this.trackingDelta = wasTracking;
  }

  private captureLastCause(entityId: EntityId): void {
    if (!this.trackingDelta) return;
    if (!this.deltaPrevLastCause.has(entityId)) {
      this.deltaPrevLastCause.set(entityId, this.lastCauseByEntity.get(entityId));
    }
  }

  recordEvent(input: {
    tick: number;
    domain: CausalDomain;
    type: string;
    summary: string;
    subjectIds: EntityId[];
    parentCauseIds?: string[];
  }): CausalNode {
    const id = `evt_${input.tick}_${this.nextSeq++}`;
    const inferredParents = new Set<string>(input.parentCauseIds ?? []);

    // Automatically link prior causes that affected any of the involved entities
    for (const entityId of input.subjectIds) {
      const priorCause = this.lastCauseByEntity.get(entityId);
      if (priorCause) {
        inferredParents.add(priorCause);
      }
    }

    const node: CausalNode = {
      id,
      tick: input.tick,
      domain: input.domain,
      type: input.type,
      summary: input.summary,
      subjectIds: [...input.subjectIds],
      parentCauseIds: Array.from(inferredParents),
    };

    this.nodes.set(id, node);
    if (this.trackingDelta) {
      this.deltaAddedNodeIds.push(id);
    }

    // Update latest cause pointer for all affected entities
    for (const entityId of input.subjectIds) {
      this.captureLastCause(entityId);
      this.lastCauseByEntity.set(entityId, id);
    }

    return node;
  }

  getLastCauseForEntity(entityId: EntityId): string | undefined {
    return this.lastCauseByEntity.get(entityId);
  }

  setLastCauseForEntity(entityId: EntityId, causeId: string): void {
    this.captureLastCause(entityId);
    this.lastCauseByEntity.set(entityId, causeId);
  }

  getNode(id: string): CausalNode | undefined {
    return this.nodes.get(id);
  }

  getAllNodes(): CausalNode[] {
    return Array.from(this.nodes.values());
  }

  getRecentNodes(limit = 25): CausalNode[] {
    const all = this.getAllNodes();
    return all.slice(Math.max(0, all.length - limit));
  }

  /**
   * Traces the full ancestor DAG for either an Event ID (e.g. "evt_4_12") or an Entity ID (e.g. 7).
   */
  traceLineage(target: string | EntityId): CausalLineageReport {
    let startNodeId: string | undefined;
    if (typeof target === "number") {
      startNodeId = this.lastCauseByEntity.get(target);
    } else if (this.nodes.has(target)) {
      startNodeId = target;
    } else {
      const asNum = Number(target);
      if (!Number.isNaN(asNum)) {
        startNodeId = this.lastCauseByEntity.get(asNum);
      }
    }

    if (!startNodeId || !this.nodes.has(startNodeId)) {
      return {
        targetId: target,
        rootNodes: [],
        chain: [],
        narrative: [],
      };
    }

    const visited = new Set<string>();
    const collected: CausalNode[] = [];

    const dfs = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      const node = this.nodes.get(nodeId);
      if (!node) return;
      for (const parentId of node.parentCauseIds) {
        dfs(parentId);
      }
      collected.push(node);
    };

    dfs(startNodeId);

    // Sort chronologically by tick and sequence ID
    collected.sort((a, b) => {
      if (a.tick !== b.tick) return a.tick - b.tick;
      return a.id.localeCompare(b.id, undefined, { numeric: true });
    });

    const rootNodes = collected.filter((n) => n.parentCauseIds.length === 0);
    const narrative = collected.map(
      (n, idx) =>
        `[Step ${idx + 1} | Tick ${n.tick} | ${n.domain.toUpperCase()}] ${n.summary} (${n.id})`
    );

    return {
      targetId: target,
      rootNodes,
      chain: collected,
      narrative,
    };
  }

  exportState(): InternalCausalState {
    return {
      nextSeq: this.nextSeq,
      nodes: this.getAllNodes().map((n) => ({
        ...n,
        subjectIds: [...n.subjectIds],
        parentCauseIds: [...n.parentCauseIds],
      })),
      lastCauseByEntity: Array.from(this.lastCauseByEntity.entries()),
    };
  }

  importState(state: InternalCausalState): void {
    this.nextSeq = state.nextSeq;
    this.nodes.clear();
    for (const n of state.nodes) {
      this.nodes.set(n.id, {
        ...n,
        subjectIds: [...n.subjectIds],
        parentCauseIds: [...n.parentCauseIds],
      });
    }
    this.lastCauseByEntity = new Map(state.lastCauseByEntity);
  }
}
