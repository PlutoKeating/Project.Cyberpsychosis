import { EmergenceKernel, SimulatorPlugin } from "@emergence/core";

/**
 * Plugin 3: Logic & Rule-as-Entity Simulator (Baba Is You style).
 * Enforces active meta-rule overrides across newly spawned or mutated entities every tick.
 */
export class LogicRulePlugin implements SimulatorPlugin<EmergenceKernel> {
  readonly id = "logic";
  readonly name = "Logic & Rule-as-Entity Recompiler";
  readonly tickInterval = 1;

  onTick(kernel: EmergenceKernel, tick: number): void {
    const { ecs, rules, causal } = kernel;
    const overrides = rules.getOverrides();

    for (const ov of overrides) {
      const matchingIds = ecs.queryByTags([ov.nounTag]);
      for (const id of matchingIds) {
        if (ov.propertyTag === "hot") {
          ecs.addTag(id, "hot");
          ecs.removeTag(id, "cool");
          if (ecs.getProp(id, "temp") < 100) {
            ecs.setProp(id, "temp", 100);
            if (ov.causeId) {
              causal.setLastCauseForEntity(id, ov.causeId);
            }
          }
        } else if (ov.propertyTag === "cool") {
          ecs.addTag(id, "cool");
          ecs.removeTag(id, "hot");
          ecs.removeTag(id, "burning");
          if (ecs.getProp(id, "temp") > 18) {
            ecs.setProp(id, "temp", 18);
            if (ov.causeId) {
              causal.setLastCauseForEntity(id, ov.causeId);
            }
          }
        } else if (ov.propertyTag === "calm") {
          ecs.addTag(id, "calm");
          ecs.setProp(id, "calmAura", 1);
          if (ov.causeId) {
            causal.setLastCauseForEntity(id, ov.causeId);
          }
        }
      }
    }

    // Track tick parameter for lint cleanliness
    void tick;
  }
}
