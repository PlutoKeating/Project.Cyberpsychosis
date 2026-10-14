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

/**
 * Deterministic Entity-Component-System (ECS) store.
 * Guarantees deterministic entity ID ordering, property clamping, and zero-reference snapshot serialization.
 */
export class DeterministicECS {
  private nextId: EntityId = 1;
  private entities = new Map<EntityId, EntityRecord>();
  private propSchema = new Map<string, PropertyDefinition>();

  registerPropertySchema(def: PropertyDefinition): void {
    this.propSchema.set(def.name, def);
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

    this.entities.set(id, {
      id,
      name: init.name,
      glyph: init.glyph ?? "?",
      color: init.color ?? "#ffffff",
      x: init.x ?? 0,
      y: init.y ?? 0,
      vx: init.vx ?? 0,
      vy: init.vy ?? 0,
      tags,
      props,
      meta,
    });
    return id;
  }

  destroyEntity(id: EntityId): boolean {
    return this.entities.delete(id);
  }

  hasEntity(id: EntityId): boolean {
    return this.entities.has(id);
  }

  getEntity(id: EntityId): EntityRecord | undefined {
    return this.entities.get(id);
  }

  /** Returns all active entity IDs in strictly ascending deterministic order */
  getAllEntityIds(): EntityId[] {
    return Array.from(this.entities.keys()).sort((a, b) => a - b);
  }

  /** Queries entities having ALL specified tags in deterministic order */
  queryByTags(requiredTags: string[]): EntityId[] {
    const result: EntityId[] = [];
    for (const id of this.getAllEntityIds()) {
      const entity = this.entities.get(id)!;
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
    return result;
  }

  hasTag(id: EntityId, tag: string): boolean {
    return this.entities.get(id)?.tags.has(tag) ?? false;
  }

  addTag(id: EntityId, tag: string): void {
    this.entities.get(id)?.tags.add(tag);
  }

  removeTag(id: EntityId, tag: string): void {
    this.entities.get(id)?.tags.delete(tag);
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
    entity.props.set(prop, clamped);
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
    this.entities.get(id)?.meta.set(key, value);
  }

  setPosition(id: EntityId, x: number, y: number): void {
    const entity = this.entities.get(id);
    if (!entity) return;
    entity.x = x;
    entity.y = y;
  }

  setVelocity(id: EntityId, vx: number, vy: number): void {
    const entity = this.entities.get(id);
    if (!entity) return;
    entity.vx = vx;
    entity.vy = vy;
  }

  private clampProp(prop: string, value: number): number {
    const def = this.propSchema.get(prop);
    let next = Number.isFinite(value) ? value : 0;
    if (def?.min !== undefined && next < def.min) next = def.min;
    if (def?.max !== undefined && next > def.max) next = def.max;
    return Math.round(next * 1000) / 1000;
  }

  serializeEntities(): SerializedEntity[] {
    return this.getAllEntityIds().map((id) => {
      const e = this.entities.get(id)!;
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
    });
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
    for (const s of state.entities) {
      this.entities.set(s.id, {
        id: s.id,
        name: s.name,
        glyph: s.glyph,
        color: s.color,
        x: s.x,
        y: s.y,
        vx: s.vx,
        vy: s.vy,
        tags: new Set(s.tags),
        props: new Map(Object.entries(s.props)),
        meta: new Map(Object.entries(s.meta)),
      });
    }
  }
}
