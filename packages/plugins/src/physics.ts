import { EmergenceKernel, EntityId, SimulatorPlugin } from "cyberpsychosis-core";

export interface RigidBodyCollisionPair {
  entityA: EntityId;
  entityB: EntityId;
  normalX: number;
  normalY: number;
  impulseMagnitude: number;
}

export interface ExternalRigidBodyAdapter {
  /** Steps the external rigid-body physics world (e.g., @dimforge/rapier2d-deterministic-compat) */
  step(dt: number): RigidBodyCollisionPair[];
  /** Syncs ECS positions/velocities into the external solver before stepping */
  syncFromECS(kernel: EmergenceKernel): void;
  /** Syncs solved rigid-body transforms back into DeterministicECS */
  syncToECS(kernel: EmergenceKernel): void;
  /** Takes a byte-accurate deterministic snapshot (e.g., Rapier world.takeSnapshot()) for Time-Travel & WorldFork */
  takeSnapshot(): Uint8Array | Record<string, unknown>;
  /** Restores a byte-accurate deterministic snapshot */
  restoreSnapshot(snapshot: Uint8Array | Record<string, unknown>): void;
}

/**
 * Plugin 2: 2D Rigid-Body Impulse Solver, Breakable Structural Joints, Shockwave & External Rapier2D Adapter.
 * Bridges continuous 2D rigid-body physics (elastic/inelastic collisions, momentum transfer,
 * breakable truss joints, and radial shockwaves) with the Causal Lineage DAG.
 * Also supports mounting an external `ExternalRigidBodyAdapter` (such as Rapier2D WASM) with
 * automatic Time-Travel / WorldFork state snapshot synchronization.
 */
export class PhysicsPlugin implements SimulatorPlugin<EmergenceKernel> {
  readonly id = "physics";
  readonly name = "2D Rigid-Body Impulse, Breakable Joint & Shockwave Simulator";
  readonly tickInterval = 1;

  private externalAdapter?: ExternalRigidBodyAdapter;
  private externalSnapshotState: Uint8Array | Record<string, unknown> | null = null;

  constructor(options?: { externalAdapter?: ExternalRigidBodyAdapter }) {
    this.externalAdapter = options?.externalAdapter;
  }

  /** Attaches a Rapier2D / Box2D deterministic adapter at runtime */
  setExternalAdapter(adapter: ExternalRigidBodyAdapter): void {
    this.externalAdapter = adapter;
  }

  exportPluginState(): unknown {
    if (this.externalAdapter) {
      const snap = this.externalAdapter.takeSnapshot();
      if (snap instanceof Uint8Array) {
        return Array.from(snap);
      }
      return snap;
    }
    return this.externalSnapshotState;
  }

  importPluginState(state: unknown): void {
    if (this.externalAdapter && state) {
      if (Array.isArray(state)) {
        this.externalAdapter.restoreSnapshot(new Uint8Array(state as number[]));
      } else {
        this.externalAdapter.restoreSnapshot(state as Record<string, unknown>);
      }
    }
    this.externalSnapshotState = (state as Record<string, unknown>) ?? null;
  }

  setup(kernel: EmergenceKernel): void {
    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "integrity",
      defaultValue: 100,
      min: 0,
      max: 100,
      description: "Structural health integrity (0-100)",
    });
    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "pressure",
      defaultValue: 10,
      min: 0,
      max: 200,
      description: "Internal mechanical/fluid pressure",
    });
    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "mass",
      defaultValue: 1,
      min: 0.1,
      max: 1000,
      description: "Rigid-body mass in kg",
    });
    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "restitution",
      defaultValue: 0.6,
      min: 0,
      max: 1,
      description: "Coefficient of restitution (bounciness 0-1)",
    });
    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "radius",
      defaultValue: 0.45,
      min: 0.1,
      max: 5,
      description: "Collider radius for 2D rigid-body impulse resolution",
    });
  }

  onTick(kernel: EmergenceKernel, tick: number): void {
    const { ecs, spatial, causal } = kernel;

    // 1. Check for thermal/pressure overload explosions on machinery or explosive containers
    for (const id of ecs.getAllEntityIds()) {
      const entity = ecs.getEntity(id);
      if (!entity) continue;

      const temp = ecs.getProp(id, "temp");
      const pressure = ecs.getProp(id, "pressure");
      const canExplode = ecs.hasTag(id, "explosive") || ecs.hasTag(id, "generator");

      if (canExplode && !ecs.hasTag(id, "exploded") && (temp >= 135 || pressure >= 130)) {
        ecs.addTag(id, "exploded");
        ecs.addTag(id, "burning");
        const expEvent = causal.recordEvent({
          tick,
          domain: "physics",
          type: "physics:explosion",
          summary: `Overheated [${entity.name}#${id}] (${Math.round(temp)}°C) triggered a violent shockwave explosion!`,
          subjectIds: [id],
        });

        // Apply radial shockwave within radius 3.2
        const affected = spatial.queryRadius(ecs, entity.x, entity.y, 3.2);
        for (const targetId of affected) {
          if (targetId === id) continue;
          const target = ecs.getEntity(targetId);
          if (!target) continue;

          // Structural damage to pipes and machinery
          if (ecs.hasTag(targetId, "structure") || ecs.hasTag(targetId, "pipe_node")) {
            const newIntegrity = ecs.addProp(targetId, "integrity", -75);
            if (newIntegrity <= 25 && !ecs.hasTag(targetId, "broken")) {
              ecs.addTag(targetId, "broken");
              ecs.setAppearance(targetId, "x", "#ef4444");
              causal.recordEvent({
                tick,
                domain: "physics",
                type: "physics:structure_broken",
                summary: `Shockwave from [${entity.name}#${id}] ruptured [${target.name}#${targetId}] (integrity=${newIntegrity}%)`,
                subjectIds: [id, targetId],
                parentCauseIds: [expEvent.id],
              });
            }
          }

          // Kinetic impulse on movable or rigid_body entities
          if (ecs.hasTag(targetId, "movable") || ecs.hasTag(targetId, "rigid_body")) {
            const dx = Math.sign(target.x - entity.x) || 1;
            const dy = Math.sign(target.y - entity.y);
            ecs.setVelocity(targetId, target.vx + dx, target.vy + dy);
            causal.setLastCauseForEntity(targetId, expEvent.id);
          }
        }
      }
    }

    // 2. If an external Rapier2D / Box2D adapter is mounted, delegate continuous rigid-body stepping
    if (this.externalAdapter) {
      this.externalAdapter.syncFromECS(kernel);
      const collisions = this.externalAdapter.step(1.0);
      this.externalAdapter.syncToECS(kernel);
      for (const col of collisions) {
        this.handleCollisionImpact(kernel, tick, col);
      }
      return;
    }

    // 3. Built-in Deterministic 2D Rigid-Body Impulse & Breakable Joint Solver (Besiege / KSP style)
    const rigidIds = ecs.queryByTags(["rigid_body"]);
    if (rigidIds.length > 0) {
      this.solveRigidBodiesAndJoints(kernel, tick, rigidIds);
    }

    // 4. Integrate discrete velocity impulses for standard grid-movable entities
    for (const id of ecs.getAllEntityIds()) {
      if (ecs.hasTag(id, "rigid_body")) continue;
      const entity = ecs.getEntity(id);
      if (!entity) continue;
      if (Math.abs(entity.vx) > 0.01 || Math.abs(entity.vy) > 0.01) {
        const clamped = spatial.clampToGrid(entity.x + entity.vx, entity.y + entity.vy);
        ecs.setPosition(id, clamped.x, clamped.y);
        ecs.setVelocity(id, 0, 0);
      }
    }
  }

  private solveRigidBodiesAndJoints(
    kernel: EmergenceKernel,
    tick: number,
    rigidIds: EntityId[]
  ): void {
    const { ecs, spatial, causal } = kernel;

    // 3a. Integrate continuous positions for non-static rigid bodies
    for (const id of rigidIds) {
      if (ecs.hasTag(id, "static")) continue;
      const ent = ecs.getEntity(id);
      if (!ent) continue;
      const nextX = Math.max(0, Math.min(spatial.width - 1, ent.x + ent.vx));
      const nextY = Math.max(0, Math.min(spatial.height - 1, ent.y + ent.vy));
      ecs.setPosition(id, nextX, nextY);
    }

    // 3b. Resolve 2D Circle/AABB elastic & inelastic collisions between rigid_body and solid/structure entities
    const collidableIds = Array.from(
      new Set([...rigidIds, ...ecs.queryByTags(["structure"]), ...ecs.queryByTags(["solid"])])
    ).sort((a, b) => a - b);

    for (let i = 0; i < rigidIds.length; i++) {
      const idA = rigidIds[i];
      const entA = ecs.getEntity(idA);
      if (!entA) continue;
      const rA = ecs.getProp(idA, "radius") || 0.5;
      const mA = ecs.hasTag(idA, "static") ? Infinity : Math.max(0.1, ecs.getProp(idA, "mass") || 1);
      const invMassA = mA === Infinity ? 0 : 1 / mA;

      for (const idB of collidableIds) {
        if (idB === idA) continue;
        // Avoid double-resolving two rigid bodies
        if (ecs.hasTag(idB, "rigid_body") && idB < idA) continue;

        const entB = ecs.getEntity(idB);
        if (!entB) continue;
        const rB = ecs.getProp(idB, "radius") || 0.5;
        const minDist = rA + rB;

        const dx = entB.x - entA.x;
        const dy = entB.y - entA.y;
        const distSq = dx * dx + dy * dy;
        if (distSq > minDist * minDist) continue;

        const dist = Math.sqrt(distSq);
        const nx = dist > 1e-5 ? dx / dist : Math.sign(entA.vx - entB.vx) || 1;
        const ny = dist > 1e-5 ? dy / dist : Math.sign(entA.vy - entB.vy);

        const rvx = entB.vx - entA.vx;
        const rvy = entB.vy - entA.vy;
        const velAlongNormal = rvx * nx + rvy * ny;

        // Only resolve if moving towards each other
        if (velAlongNormal > 0) continue;

        const isStaticB = ecs.hasTag(idB, "static") || !ecs.hasTag(idB, "rigid_body");
        const mB = isStaticB ? Infinity : Math.max(0.1, ecs.getProp(idB, "mass") || 1);
        const invMassB = mB === Infinity ? 0 : 1 / mB;
        const invMassSum = invMassA + invMassB;
        if (invMassSum === 0) continue;

        const e = Math.min(
          ecs.getProp(idA, "restitution") || 0.6,
          ecs.getProp(idB, "restitution") || 0.6
        );

        const j = (-(1 + e) * velAlongNormal) / invMassSum;
        const impulseX = j * nx;
        const impulseY = j * ny;

        if (invMassA > 0) {
          ecs.setVelocity(idA, entA.vx - impulseX * invMassA, entA.vy - impulseY * invMassA);
        }
        if (invMassB > 0) {
          ecs.setVelocity(idB, entB.vx + impulseX * invMassB, entB.vy + impulseY * invMassB);
        }

        // Positional correction to prevent sinking
        const penetration = Math.max(0, minDist - dist);
        if (penetration > 0.01) {
          const corrX = (penetration / invMassSum) * 0.5 * nx;
          const corrY = (penetration / invMassSum) * 0.5 * ny;
          if (invMassA > 0) {
            ecs.setPosition(idA, entA.x - corrX * invMassA, entA.y - corrY * invMassA);
          }
          if (invMassB > 0) {
            ecs.setPosition(idB, entB.x + corrX * invMassB, entB.y + corrY * invMassB);
          }
        }

        this.handleCollisionImpact(kernel, tick, {
          entityA: idA,
          entityB: idB,
          normalX: nx,
          normalY: ny,
          impulseMagnitude: Math.abs(j),
        });
      }
    }

    // 3c. Evaluate breakable structural joints (`joint` graph edges)
    const joints = spatial.getEdgesByKind("joint");
    for (const joint of joints) {
      if (!joint.intact) continue;
      const entA = ecs.getEntity(joint.from);
      const entB = ecs.getEntity(joint.to);
      if (!entA || !entB) {
        joint.intact = false;
        continue;
      }

      const dx = entB.x - entA.x;
      const dy = entB.y - entA.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxStretch = joint.capacity || 2.0;
      joint.currentFlow = Math.round(dist * 100) / 100;

      if (dist > maxStretch || ecs.hasTag(joint.from, "broken") || ecs.hasTag(joint.to, "broken")) {
        joint.intact = false;
        const causeA = causal.getLastCauseForEntity(joint.from);
        const causeB = causal.getLastCauseForEntity(joint.to);
        const parents = [causeA, causeB].filter((c): c is string => Boolean(c));
        causal.recordEvent({
          tick,
          domain: "physics",
          type: "physics:joint_snapped",
          summary: `Structural truss joint [${joint.id}] snapped under tensile stress (stretch=${dist.toFixed(2)} > limit=${maxStretch})!`,
          subjectIds: [joint.from, joint.to],
          parentCauseIds: parents.length > 0 ? parents : undefined,
        });
      }
    }

    // 3d. Apply linear velocity damping (friction) to rigid bodies
    for (const id of rigidIds) {
      const ent = ecs.getEntity(id);
      if (!ent) continue;
      const nvx = Math.abs(ent.vx) < 0.02 ? 0 : ent.vx * 0.85;
      const nvy = Math.abs(ent.vy) < 0.02 ? 0 : ent.vy * 0.85;
      ecs.setVelocity(id, nvx, nvy);
    }
  }

  private handleCollisionImpact(
    kernel: EmergenceKernel,
    tick: number,
    col: RigidBodyCollisionPair
  ): void {
    const { ecs, causal } = kernel;
    if (col.impulseMagnitude < 1.2) return;

    const entA = ecs.getEntity(col.entityA);
    const entB = ecs.getEntity(col.entityB);
    if (!entA || !entB) return;

    const causeA = causal.getLastCauseForEntity(col.entityA);
    const causeB = causal.getLastCauseForEntity(col.entityB);
    const parents = [causeA, causeB].filter((c): c is string => Boolean(c));

    const damage = Math.round(col.impulseMagnitude * 22);
    const impactEvt = causal.recordEvent({
      tick,
      domain: "physics",
      type: "physics:collision_impact",
      summary: `Rigid-body collision between [${entA.name}#${col.entityA}] and [${entB.name}#${col.entityB}] (impulse=${col.impulseMagnitude.toFixed(2)} N·s, damage=${damage})`,
      subjectIds: [col.entityA, col.entityB],
      parentCauseIds: parents.length > 0 ? parents : undefined,
    });

    for (const targetId of [col.entityA, col.entityB]) {
      const target = ecs.getEntity(targetId);
      if (!target) continue;
      if (ecs.hasTag(targetId, "structure") || ecs.hasTag(targetId, "pipe_node") || ecs.hasTag(targetId, "fragile")) {
        const nextInt = ecs.addProp(targetId, "integrity", -damage);
        if (nextInt <= 25 && !ecs.hasTag(targetId, "broken")) {
          ecs.addTag(targetId, "broken");
          ecs.setAppearance(targetId, "x", "#ef4444");
          causal.recordEvent({
            tick,
            domain: "physics",
            type: "physics:structure_broken",
            summary: `Kinetic impact shattered [${target.name}#${targetId}] (integrity=${nextInt}%)`,
            subjectIds: [targetId],
            parentCauseIds: [impactEvt.id],
          });
        }
      }
    }
  }
}
