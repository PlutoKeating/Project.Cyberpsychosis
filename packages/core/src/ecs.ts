import { EntityId, PropertyDefinition, SerializedEntity } from "./types.js";

export interface EntityRecord {
  id: EntityId;
  name: string;
  glyph: string;
  color: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  tags: Set<string>;
  props: Map<string, number>;
  meta: Map<string, string>;
}

export interface InternalECSState {
  nextEntityId: number;
  entities: SerializedEntity[];
}

export interface ECSFrameDelta {
  prevNextEntityId: number;
  createdIds: EntityId[];
  /** Previous full snapshot of entities modified or destroyed during the frame */
  previousEntities: SerializedEntity[];
}

/**
 * Deterministic Entity-Component-System (ECS) store.
 * Guarantees deterministic entity ID ordering, property clamping, inverted tag indexing,
 * spatial grid bucket acceleration, and copy-on-write frame delta tracking.
 */
export class DeterministicECS {
  private nextId: EntityId = 1;
  private entities = new Map<EntityId, EntityRecord>();
  private sortedIdsCache: EntityId[] | null = null;
  private tagIndex = new Map<string, Set<EntityId>>();
  private gridBuckets = new Map<string, Set<EntityId>>();
  private propSchema = new Map<string, PropertyDefinition>();

  // Copy-on-Write (CoW) dirty tracking for incremental delta snapshots
  private trackingDelta = false;
  private deltaPrevNextId = 1;
  private deltaCreatedIds = new Set<EntityId>();
  private deltaPrevEntities = new Map<EntityId, SerializedEntity>();

  registerPropertySchema(def: PropertyDefinition): void {
    this.propSchema.set(def.name, def);
  }

  /** Starts recording Copy-on-Write mutations for the current frame */
  beginDeltaTracking(): void {
    this.trackingDelta = true;
    this.deltaPrevNextId = this.nextId;
    this.deltaCreatedIds.clear();
    this.deltaPrevEntities.clear();
  }

  /** Flushes and returns the compact ECSFrameDelta since beginDeltaTracking() */
  flushDelta(): ECSFrameDelta {
    const delta: ECSFrameDelta = {
      prevNextEntityId: this.deltaPrevNextId,
      createdIds: Array.from(this.deltaCreatedIds).sort((a, b) => a - b),
      previousEntities: Array.from(this.deltaPrevEntities.values()).sort((a, b) => a.id - b.id),
    };
    this.trackingDelta = false;
    this.deltaCreatedIds.clear();
    this.deltaPrevEntities.clear();
    return delta;
  }

  /** Rolls back a single frame delta in-place */
  rollbackDelta(delta: ECSFrameDelta): void {
    const wasTracking = this.trackingDelta;
    this.trackingDelta = false;

    for (const createdId of delta.createdIds) {
      this.destroyEntity(createdId);
    }
    for (const prev of delta.previousEntities) {
      this.restoreSingleEntity(prev);
    }
    this.nextId = delta.prevNextEntityId;
    this.sortedIdsCache = null;
    this.trackingDelta = wasTracking;
  }

  private captureBeforeMutate(id: EntityId): void {
    if (!this.trackingDelta) return;
    if (this.deltaCreatedIds.has(id) || this.deltaPrevEntities.has(id)) return;
    const entity = this.entities.get(id);
    if (!entity) return;
    this.deltaPrevEntities.set(id, this.serializeSingleEntity(entity));
  }

  private gridKey(x: number, y: number): string {
    return `${Math.round(x)},${Math.round(y)}`;
  }

  private addToGridBucket(id: EntityId, x: number, y: number): void {
    const key = this.gridKey(x, y);
    let bucket = this.gridBuckets.get(key);
    if (!bucket) {
      bucket = new Set<EntityId>();
      this.gridBuckets.set(key, bucket);
    }
    bucket.add(id);
  }

  private removeFromGridBucket(id: EntityId, x: number, y: number): void {
    const key = this.gridKey(x, y);
    const bucket = this.gridBuckets.get(key);
    if (bucket) {
      bucket.delete(id);
      if (bucket.size === 0) {
        this.gridBuckets.delete(key);
      }
    }
  }

  /** Fast O(1) lookup of entity IDs occupying discrete cell (gx, gy) in ascending order */
  getEntityIdsAtCell(gx: number, gy: number): EntityId[] {
    const bucket = this.gridBuckets.get(`${gx},${gy}`);
    if (!bucket || bucket.size === 0) return [];
    return Array.from(bucket).sort((a, b) => a - b);
  }

  createEntity(init: {
    name: string;
    glyph?: string;
    color?: string;
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    tags?: Iterable<string>;
    props?: Record<string, number>;
    meta?: Record<string, string>;
  }): EntityId {
    const id = this.nextId++;
    const tags = new Set<string>(init.tags ?? []);
    const props = new Map<string, number>();
    if (init.props) {
      for (const [k, v] of Object.entries(init.props)) {
        props.set(k, this.clampProp(k, v));
      }
    }
    const meta = new Map<string, string>(Object.entries(init.meta ?? {}));
    const x = init.x ?? 0;
    const y = init.y ?? 0;

    this.entities.set(id, {
      id,
      name: init.name,
      glyph: init.glyph ?? "?",
      color: init.color ?? "#ffffff",
      x,
      y,
      vx: init.vx ?? 0,
      vy: init.vy ?? 0,
      tags,
      props,
      meta,
    });

    this.sortedIdsCache = null;
    for (const tag of tags) {
      this.indexTagAdd(id, tag);
    }
    this.addToGridBucket(id, x, y);

    if (this.trackingDelta) {
      this.deltaCreatedIds.add(id);
    }
    return id;
  }

  destroyEntity(id: EntityId): boolean {
    const existing = this.entities.get(id);
    if (!existing) return false;
    this.captureBeforeMutate(id);
    for (const tag of existing.tags) {
      this.indexTagRemove(id, tag);
    }
    this.removeFromGridBucket(id, existing.x, existing.y);
    this.entities.delete(id);
    if (this.trackingDelta) {
      this.deltaCreatedIds.delete(id);
    }
    this.sortedIdsCache = null;
    return true;
  }

  hasEntity(id: EntityId): boolean {
    return this.entities.has(id);
  }

  getEntity(id: EntityId): EntityRecord | undefined {
    return this.entities.get(id);
  }

  /** Returns all active entity IDs in strictly ascending deterministic order */
  getAllEntityIds(): EntityId[] {
    if (!this.sortedIdsCache) {
      this.sortedIdsCache = Array.from(this.entities.keys()).sort((a, b) => a - b);
    }
    return [...this.sortedIdsCache];
  }

  /** Queries entities having ALL specified tags in deterministic order using inverted tag index */
  queryByTags(requiredTags: string[]): EntityId[] {
    if (requiredTags.length === 0) {
      return this.getAllEntityIds();
    }

    // Pick the smallest tag set first for fast intersection
    let smallestSet: Set<EntityId> | undefined;
    for (const tag of requiredTags) {
      const set = this.tagIndex.get(tag);
      if (!set || set.size === 0) return [];
      if (!smallestSet || set.size < smallestSet.size) {
        smallestSet = set;
      }
    }

    if (!smallestSet) return [];

    const result: EntityId[] = [];
    for (const id of smallestSet) {
      const entity = this.entities.get(id);
      if (!entity) continue;
      let match = true;
      for (const tag of requiredTags) {
        if (!entity.tags.has(tag)) {
          match = false;
          break;
        }
      }
      if (match) {
        result.push(id);
      }
    }
    return result.sort((a, b) => a - b);
  }

  private indexTagAdd(id: EntityId, tag: string): void {
    let set = this.tagIndex.get(tag);
    if (!set) {
      set = new Set<EntityId>();
      this.tagIndex.set(tag, set);
    }
    set.add(id);
  }

  private indexTagRemove(id: EntityId, tag: string): void {
    const set = this.tagIndex.get(tag);
    if (set) {
      set.delete(id);
      if (set.size === 0) {
        this.tagIndex.delete(tag);
      }
    }
  }

  hasTag(id: EntityId, tag: string): boolean {
    return this.entities.get(id)?.tags.has(tag) ?? false;
  }

  addTag(id: EntityId, tag: string): void {
    const entity = this.entities.get(id);
    if (!entity || entity.tags.has(tag)) return;
    this.captureBeforeMutate(id);
    entity.tags.add(tag);
    this.indexTagAdd(id, tag);
  }

  removeTag(id: EntityId, tag: string): void {
    const entity = this.entities.get(id);
    if (!entity || !entity.tags.has(tag)) return;
    this.captureBeforeMutate(id);
    entity.tags.delete(tag);
    this.indexTagRemove(id, tag);
  }

  getProp(id: EntityId, prop: string): number {
    const entity = this.entities.get(id);
    if (!entity) return 0;
    if (entity.props.has(prop)) {
      return entity.props.get(prop)!;
    }
    return this.propSchema.get(prop)?.defaultValue ?? 0;
  }

  setProp(id: EntityId, prop: string, value: number): number {
    const entity = this.entities.get(id);
    if (!entity) return 0;
    const clamped = this.clampProp(prop, value);
    const prev = entity.props.get(prop);
    if (prev !== clamped) {
      this.captureBeforeMutate(id);
      entity.props.set(prop, clamped);
    }
    return clamped;
  }

  addProp(id: EntityId, prop: string, delta: number): number {
    const current = this.getProp(id, prop);
    return this.setProp(id, prop, current + delta);
  }

  getMeta(id: EntityId, key: string): string | undefined {
    return this.entities.get(id)?.meta.get(key);
  }

  setMeta(id: EntityId, key: string, value: string): void {
    const entity = this.entities.get(id);
    if (!entity) return;
    if (entity.meta.get(key) !== value) {
      this.captureBeforeMutate(id);
      entity.meta.set(key, value);
    }
  }

  setAppearance(id: EntityId, glyph?: string, color?: string): void {
    const entity = this.entities.get(id);
    if (!entity) return;
    if ((glyph !== undefined && entity.glyph !== glyph) || (color !== undefined && entity.color !== color)) {
      this.captureBeforeMutate(id);
      if (glyph !== undefined) entity.glyph = glyph;
      if (color !== undefined) entity.color = color;
    }
  }

  setPosition(id: EntityId, x: number, y: number): void {
    const entity = this.entities.get(id);
    if (!entity) return;
    const rx = Math.round(x * 1000) / 1000;
    const ry = Math.round(y * 1000) / 1000;
    if (entity.x === rx && entity.y === ry) return;
    this.captureBeforeMutate(id);
    this.removeFromGridBucket(id, entity.x, entity.y);
    entity.x = rx;
    entity.y = ry;
    this.addToGridBucket(id, rx, ry);
  }

  setVelocity(id: EntityId, vx: number, vy: number): void {
    const entity = this.entities.get(id);
    if (!entity) return;
    const rvx = Math.round(vx * 1000) / 1000;
    const rvy = Math.round(vy * 1000) / 1000;
    if (entity.vx === rvx && entity.vy === rvy) return;
    this.captureBeforeMutate(id);
    entity.vx = rvx;
    entity.vy = rvy;
  }

  private clampProp(prop: string, value: number): number {
    const def = this.propSchema.get(prop);
    let next = Number.isFinite(value) ? value : 0;
    if (def?.min !== undefined && next < def.min) next = def.min;
    if (def?.max !== undefined && next > def.max) next = def.max;
    return Math.round(next * 1000) / 1000;
  }

  private serializeSingleEntity(e: EntityRecord): SerializedEntity {
    const propsObj: Record<string, number> = {};
    for (const [k, v] of Array.from(e.props.entries()).sort(([a], [b]) => a.localeCompare(b))) {
      propsObj[k] = v;
    }
    const metaObj: Record<string, string> = {};
    for (const [k, v] of Array.from(e.meta.entries()).sort(([a], [b]) => a.localeCompare(b))) {
      metaObj[k] = v;
    }
    return {
      id: e.id,
      name: e.name,
      glyph: e.glyph,
      color: e.color,
      x: e.x,
      y: e.y,
      vx: e.vx,
      vy: e.vy,
      tags: Array.from(e.tags).sort(),
      props: propsObj,
      meta: metaObj,
    };
  }

  private restoreSingleEntity(s: SerializedEntity): void {
    const existing = this.entities.get(s.id);
    if (existing) {
      for (const t of existing.tags) {
        this.indexTagRemove(s.id, t);
      }
      this.removeFromGridBucket(s.id, existing.x, existing.y);
    }
    const tags = new Set(s.tags);
    this.entities.set(s.id, {
      id: s.id,
      name: s.name,
      glyph: s.glyph,
      color: s.color,
      x: s.x,
      y: s.y,
      vx: s.vx,
      vy: s.vy,
      tags,
      props: new Map(Object.entries(s.props)),
      meta: new Map(Object.entries(s.meta)),
    });
    for (const t of tags) {
      this.indexTagAdd(s.id, t);
    }
    this.addToGridBucket(s.id, s.x, s.y);
  }

  serializeEntities(): SerializedEntity[] {
    return this.getAllEntityIds().map((id) => this.serializeSingleEntity(this.entities.get(id)!));
  }

  exportState(): InternalECSState {
    return {
      nextEntityId: this.nextId,
      entities: this.serializeEntities(),
    };
  }

  importState(state: InternalECSState): void {
    this.nextId = state.nextEntityId;
    this.entities.clear();
    this.tagIndex.clear();
    this.gridBuckets.clear();
    this.sortedIdsCache = null;
    for (const s of state.entities) {
      this.restoreSingleEntity(s);
    }
  }
}
