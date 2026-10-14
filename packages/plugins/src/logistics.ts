import { EmergenceKernel, SimulatorPlugin } from "@emergence/core";

/**
 * Plugin 4: Logistics & Directed Flow Network Solver (Factorio style).
 * Computes fluid/item transport across directed graph edges, backpressure, pipe rupture cascades,
 * and thermal exchange between transported coolant and target machinery.
 */
export class LogisticsPlugin implements SimulatorPlugin<EmergenceKernel> {
  readonly id = "logistics";
  readonly name = "Logistics & Directed Flow Network Solver";
  readonly tickInterval = 1;

  onTick(kernel: EmergenceKernel, tick: number): void {
    const { ecs, spatial, causal } = kernel;
    const pipeEdges = spatial.getEdgesByKind("pipe");

    // 1. Baseline operating heat for active generators
    for (const genId of ecs.queryByTags(["generator"])) {
      ecs.addProp(genId, "temp", 8);
    }

    // 2. Solve flow along pipe network
    for (const edge of pipeEdges) {
      const fromEnt = ecs.getEntity(edge.from);
      const toEnt = ecs.getEntity(edge.to);
      if (!fromEnt || !toEnt) {
        edge.intact = false;
        edge.currentFlow = 0;
        continue;
      }

      const endpointBroken =
        ecs.hasTag(edge.from, "broken") ||
        ecs.hasTag(edge.to, "broken") ||
        ecs.getProp(edge.from, "integrity") <= 25 ||
        ecs.getProp(edge.to, "integrity") <= 25;

      if (endpointBroken) {
        if (edge.intact) {
          edge.intact = false;
          edge.currentFlow = 0;
          ecs.addProp(edge.from, "pressure", 35);
          causal.recordEvent({
            tick,
            domain: "logistics",
            type: "logistics:pipe_severed",
            summary: `Logistics pipeline [${edge.id}] severed due to damaged node; coolant flow halted and upstream backpressure rising!`,
            subjectIds: [edge.from, edge.to],
          });
        } else {
          edge.currentFlow = 0;
          ecs.addProp(edge.from, "pressure", 10);
        }
        continue;
      }

      edge.intact = true;
      edge.currentFlow = edge.capacity;

      // Propagate thermal state of fluid along the pipeline
      const fromTemp = ecs.getProp(edge.from, "temp");
      const fromIsHot = ecs.hasTag(edge.from, "hot") || fromTemp >= 80;
      const fromIsCool = ecs.hasTag(edge.from, "cool") && !fromIsHot;

      if (fromIsHot) {
        ecs.addTag(edge.to, "hot");
        const prevTemp = ecs.getProp(edge.to, "temp");
        const nextTemp = ecs.addProp(edge.to, "temp", 32);
        const upstreamCause = causal.getLastCauseForEntity(edge.from);
        if (upstreamCause) {
          causal.setLastCauseForEntity(edge.to, upstreamCause);
        }
        if (ecs.hasTag(edge.to, "generator") && prevTemp < 85 && nextTemp >= 85) {
          causal.recordEvent({
            tick,
            domain: "logistics",
            type: "logistics:thermal_surge",
            summary: `Pipeline [${edge.id}] pumped scalding fluid into [${toEnt.name}#${edge.to}], causing thermal runaway (${Math.round(nextTemp)}°C)!`,
            subjectIds: [edge.from, edge.to],
            parentCauseIds: upstreamCause ? [upstreamCause] : undefined,
          });
        }
      } else if (fromIsCool) {
        ecs.removeTag(edge.to, "hot");
        if (ecs.hasTag(edge.to, "generator")) {
          // Cool flow offsets generator heat
          ecs.addProp(edge.to, "temp", -10);
        } else {
          ecs.setProp(edge.to, "temp", 18);
        }
      }
    }
  }
}
