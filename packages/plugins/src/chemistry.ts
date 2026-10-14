import { EmergenceKernel, SimulatorPlugin } from "cyberpsychosis-core";

/**
 * Plugin 1: Chemistry / Elemental Cellular Automata Simulator.
 * Handles conductive heat transfer, ignition thresholds, smoke emission, and extinguishing.
 */
export class ChemistryPlugin implements SimulatorPlugin<EmergenceKernel> {
  readonly id = "chemistry";
  readonly name = "Chemistry & Elemental CA Simulator";
  readonly tickInterval = 1;

  setup(kernel: EmergenceKernel): void {
    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "temp",
      defaultValue: 22,
      min: -40,
      max: 600,
      description: "Temperature in Celsius",
    });
    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "fuel",
      defaultValue: 100,
      min: 0,
      max: 500,
      description: "Combustible fuel reserve",
    });
  }

  onTick(kernel: EmergenceKernel, tick: number): void {
    const { ecs, spatial, causal, vocabulary } = kernel;
    const allIds = ecs.getAllEntityIds();

    // 1. Heat conduction between 8-way neighbors
    for (const id of allIds) {
      const entity = ecs.getEntity(id);
      if (!entity) continue;

      if (ecs.hasTag(id, "burning")) {
        ecs.addProp(id, "temp", 18);
      }

      const myTemp = ecs.getProp(id, "temp");
      if (myTemp <= 50) continue;

      const neighbors = spatial.getGridNeighbors(
        ecs,
        Math.round(entity.x),
        Math.round(entity.y),
        true,
        false
      );

      for (const nid of neighbors) {
        if (ecs.hasTag(nid, "word_block")) continue;
        const nTemp = ecs.getProp(nid, "temp");
        if (myTemp > nTemp + 10) {
          const transfer = Math.min(22, (myTemp - nTemp) * 0.28);
          ecs.addProp(nid, "temp", transfer);
          const myCause = causal.getLastCauseForEntity(id);
          if (myCause && !ecs.hasTag(nid, "burning")) {
            causal.setLastCauseForEntity(nid, myCause);
          }
        }
      }
    }

    // 2. Ignition check for flammable entities & extinguishing check
    for (const id of ecs.getAllEntityIds()) {
      const entity = ecs.getEntity(id);
      if (!entity) continue;
      const temp = ecs.getProp(id, "temp");

      if (ecs.hasTag(id, "flammable") && !ecs.hasTag(id, "burning") && temp >= 85) {
        ecs.addTag(id, "burning");
        ecs.addTag(id, "hot");
        entity.color = "#ff5722";
        causal.recordEvent({
          tick,
          domain: "chemistry",
          type: "chemistry:ignited",
          summary: `[${entity.name}#${id}] reached ${Math.round(temp)}°C and ignited into flames!`,
          subjectIds: [id],
        });
      }

      // Cool water extinguishes adjacent burning entities
      if (ecs.hasTag(id, "water") && ecs.hasTag(id, "cool") && !ecs.hasTag(id, "hot")) {
        const neighbors = spatial.getGridNeighbors(
          ecs,
          Math.round(entity.x),
          Math.round(entity.y),
          true,
          true
        );
        for (const nid of neighbors) {
          if (ecs.hasTag(nid, "burning")) {
            ecs.removeTag(nid, "burning");
            ecs.setProp(nid, "temp", 35);
            causal.recordEvent({
              tick,
              domain: "chemistry",
              type: "chemistry:extinguished",
              summary: `Cool water [${entity.name}#${id}] extinguished burning [${ecs.getEntity(nid)?.name}#${nid}]`,
              subjectIds: [id, nid],
            });
          }
        }
      }

      // 3. Burning entities emit smoke into adjacent empty/passable tile if smoke prefab exists
      if (ecs.hasTag(id, "burning") && vocabulary.getPrefab("smoke")) {
        const existingSmokeNear = spatial
          .queryRadius(ecs, entity.x, entity.y, 1.5)
          .filter((sid) => ecs.hasTag(sid, "smoke"));
        if (existingSmokeNear.length < 2) {
          const sx = Math.max(0, Math.min(spatial.width - 1, Math.round(entity.x) + 1));
          const sy = Math.max(0, Math.min(spatial.height - 1, Math.round(entity.y)));
          const smokeId = vocabulary.spawnPrefab(ecs, "smoke", sx, sy);
          const parentCause = causal.getLastCauseForEntity(id);
          causal.recordEvent({
            tick,
            domain: "chemistry",
            type: "chemistry:smoke_emitted",
            summary: `Burning [${entity.name}#${id}] emitted dense smoke cloud (#${smokeId}) at (${sx},${sy})`,
            subjectIds: [id, smokeId],
            parentCauseIds: parentCause ? [parentCause] : undefined,
          });
        }
      }
    }
  }
}
