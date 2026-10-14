import { DeterministicECS } from "./ecs.js";
import { EntityId, SerializedGraphEdge } from "./types.js";

/**
 * Multi-modal spatial topology index supporting:
 * 1. Grid2D (Discrete cells for cellular automata, falling sand, and Baba-style word blocks)
 * 2. Continuous2D (Euclidean radius queries & continuous coordinates for physics/agents)
 * 3. GraphTopology (Directed edges with flow capacity & integrity for logistics & social networks)
 */
export class MultiModalSpatialIndex {
  readonly width: number;
  readonly height: number;
  private edges = new Map<string, SerializedGraphEdge>();

  constructor(width = 16, height = 12) {
    this.width = width;
    this.height = height;
  }

  inBounds(x: number, y: number): boolean {
    const gx = Math.round(x);
    const gy = Math.round(y);
    return gx >= 0 && gx < this.width && gy >= 0 && gy < this.height;
  }

  clampToGrid(x: number, y: number): { x: number; y: number } {
    return {
      x: Math.max(0, Math.min(this.width - 1, Math.round(x))),
      y: Math.max(0, Math.min(this.height - 1, Math.round(y))),
    };
  }

  getEntitiesAtGrid(ecs: DeterministicECS, gx: number, gy: number): EntityId[] {
    const result: EntityId[] = [];
    for (const id of ecs.getAllEntityIds()) {
      const e = ecs.getEntity(id)!;
      if (Math.round(e.x) === gx && Math.round(e.y) === gy) {
        result.push(id);
      }
    }
    return result;
  }

  getGridNeighbors(
    ecs: DeterministicECS,
    gx: number,
    gy: number,
    eightWay = false,
    includeSelf = true
  ): EntityId[] {
    const offsets = eightWay
      ? [
          [0, 0],
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
          [1, -1],
          [1, 1],
          [-1, 1],
          [-1, -1],
        ]
      : [
          [0, 0],
          [0, -1],
          [1, 0],
          [0, 1],
          [-1, 0],
        ];

    const result: EntityId[] = [];
    for (const [dx, dy] of offsets) {
      if (!includeSelf && dx === 0 && dy === 0) continue;
      const nx = gx + dx;
      const ny = gy + dy;
      if (!this.inBounds(nx, ny)) continue;
      result.push(...this.getEntitiesAtGrid(ecs, nx, ny));
    }
    return result;
  }

  queryRadius(ecs: DeterministicECS, cx: number, cy: number, radius: number): EntityId[] {
    const rSq = radius * radius;
    const result: EntityId[] = [];
    for (const id of ecs.getAllEntityIds()) {
      const e = ecs.getEntity(id)!;
      const dx = e.x - cx;
      const dy = e.y - cy;
      if (dx * dx + dy * dy <= rSq) {
        result.push(id);
      }
    }
    return result;
  }

  addEdge(edge: {
    id?: string;
    from: EntityId;
    to: EntityId;
    kind: string;
    capacity?: number;
    intact?: boolean;
  }): SerializedGraphEdge {
    const id = edge.id ?? `${edge.kind}:${edge.from}->${edge.to}`;
    const record: SerializedGraphEdge = {
      id,
      from: edge.from,
      to: edge.to,
      kind: edge.kind,
      capacity: edge.capacity ?? 10,
      currentFlow: 0,
      intact: edge.intact ?? true,
    };
    this.edges.set(id, record);
    return record;
  }

  getEdge(id: string): SerializedGraphEdge | undefined {
    return this.edges.get(id);
  }

  getEdgesByKind(kind?: string): SerializedGraphEdge[] {
    const list = Array.from(this.edges.values()).sort((a, b) => a.id.localeCompare(b.id));
    if (!kind) return list;
    return list.filter((e) => e.kind === kind);
  }

  getOutgoingEdges(from: EntityId, kind?: string): SerializedGraphEdge[] {
    return this.getEdgesByKind(kind).filter((e) => e.from === from);
  }

  getIncomingEdges(to: EntityId, kind?: string): SerializedGraphEdge[] {
    return this.getEdgesByKind(kind).filter((e) => e.to === to);
  }

  exportEdges(): SerializedGraphEdge[] {
    return this.getEdgesByKind().map((e) => ({ ...e }));
  }

  importEdges(edges: SerializedGraphEdge[]): void {
    this.edges.clear();
    for (const edge of edges) {
      this.edges.set(edge.id, { ...edge });
    }
  }
}
