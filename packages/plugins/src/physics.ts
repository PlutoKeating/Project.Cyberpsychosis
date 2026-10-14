import { EmergenceKernel, SimulatorPlugin } from "cyberpsychosis-core";

/**
 * Plugin 2: 2D Physics, Shockwave Impulse & Structural Integrity Simulator.
 * Handles overtemperature/overpressure explosions, radial impulse waves, and structural collapse.
 */
export class PhysicsPlugin implements SimulatorPlugin<EmergenceKernel> {
  readonly id = "physics";
  readonly name = "Physics & Structural Integrity Simulator";
  readonly tickInterval = 1;

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
              target.glyph = "x";
              target.color = "#ef4444";
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

          // Kinetic impulse on movable entities
          if (ecs.hasTag(targetId, "movable")) {
            const dx = Math.sign(target.x - entity.x) || 1;
            const dy = Math.sign(target.y - entity.y);
            ecs.setVelocity(targetId, dx, dy);
            causal.setLastCauseForEntity(targetId, expEvent.id);
          }
        }
      }
    }

    // 2. Integrate velocity impulses and damp velocities
    for (const id of ecs.getAllEntityIds()) {
      const entity = ecs.getEntity(id);
      if (!entity) continue;
      if (Math.abs(entity.vx) > 0.01 || Math.abs(entity.vy) > 0.01) {
        const clamped = spatial.clampToGrid(entity.x + entity.vx, entity.y + entity.vy);
        ecs.setPosition(id, clamped.x, clamped.y);
        ecs.setVelocity(id, 0, 0);
      }
    }
  }
}
