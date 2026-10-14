import { DeterministicECS } from "./ecs.js";
import { EntityId, PrefabDefinition, PropertyDefinition } from "./types.js";

/**
 * Dimension 1 of the Five-Dimensional Emergence Framework: Vocabulary Registry.
 * Manages atomic tags, scalar property schemas, and entity prefabs.
 */
export class VocabularyRegistry {
  private tags = new Map<string, string>();
  private properties = new Map<string, PropertyDefinition>();
  private prefabs = new Map<string, PrefabDefinition>();

  registerTag(tag: string, description = ""): void {
    this.tags.set(tag, description);
  }

  registerProperty(ecs: DeterministicECS, def: PropertyDefinition): void {
    this.properties.set(def.name, def);
    ecs.registerPropertySchema(def);
  }

  registerPrefab(prefab: PrefabDefinition): void {
    this.prefabs.set(prefab.id, {
      ...prefab,
      tags: [...prefab.tags],
      props: { ...prefab.props },
      meta: { ...(prefab.meta ?? {}) },
    });
  }

  getPrefab(id: string): PrefabDefinition | undefined {
    return this.prefabs.get(id);
  }

  getAllPrefabs(): PrefabDefinition[] {
    return Array.from(this.prefabs.values());
  }

  getAllProperties(): PropertyDefinition[] {
    return Array.from(this.properties.values());
  }

  spawnPrefab(
    ecs: DeterministicECS,
    prefabId: string,
    x: number,
    y: number,
    overrides?: {
      name?: string;
      glyph?: string;
      color?: string;
      tags?: string[];
      props?: Record<string, number>;
      meta?: Record<string, string>;
    }
  ): EntityId {
    const prefab = this.prefabs.get(prefabId);
    if (!prefab) {
      throw new Error(`Unknown prefab '${prefabId}' in VocabularyRegistry`);
    }
    return ecs.createEntity({
      name: overrides?.name ?? prefab.name,
      glyph: overrides?.glyph ?? prefab.glyph,
      color: overrides?.color ?? prefab.color,
      x,
      y,
      tags: [...prefab.tags, ...(overrides?.tags ?? [])],
      props: { ...prefab.props, ...(overrides?.props ?? {}) },
      meta: { ...(prefab.meta ?? {}), ...(overrides?.meta ?? {}), prefabId },
    });
  }
}
