import { EmergenceKernel, SimulatorPlugin } from "@emergence/core";

/**
 * Plugin 5: Social & Agent Utility AI Simulator (RimWorld / Dwarf Fortress style).
 * Simulates hazard perception, panic accumulation, social graph emotional contagion,
 * and utility-driven behavioral transitions (cooperative maintenance vs panic evacuation).
 */
export class SocialAgentPlugin implements SimulatorPlugin<EmergenceKernel> {
  readonly id = "social";
  readonly name = "Social Network & Agent Utility AI Simulator";
  readonly tickInterval = 1;

  setup(kernel: EmergenceKernel): void {
    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "panic",
      defaultValue: 0,
      min: 0,
      max: 100,
      description: "Agent psychological panic level (0-100)",
    });
  }

  onTick(kernel: EmergenceKernel, tick: number): void {
    const { ecs, spatial, causal } = kernel;
    const agents = ecs.queryByTags(["agent"]);

    // 1. Direct environmental hazard & calming perception
    for (const agentId of agents) {
      const agent = ecs.getEntity(agentId);
      if (!agent) continue;

      const nearby = spatial.queryRadius(ecs, agent.x, agent.y, 4.5);
      let hazardScore = 0;
      let calmScore = 0;
      const hazardCauses: string[] = [];
      const calmCauses: string[] = [];

      for (const otherId of nearby) {
        if (otherId === agentId) continue;
        if (ecs.hasTag(otherId, "burning") || ecs.hasTag(otherId, "exploded")) {
          hazardScore += 28;
          const c = causal.getLastCauseForEntity(otherId);
          if (c) hazardCauses.push(c);
        } else if (ecs.hasTag(otherId, "broken")) {
          hazardScore += 18;
          const c = causal.getLastCauseForEntity(otherId);
          if (c) hazardCauses.push(c);
        }

        if (ecs.hasTag(otherId, "calm") || ecs.getProp(otherId, "calmAura") > 0) {
          calmScore += 45;
          const c = causal.getLastCauseForEntity(otherId);
          if (c) calmCauses.push(c);
        }
      }

      if (calmScore > 0) {
        ecs.addProp(agentId, "panic", -calmScore);
        if (calmCauses.length > 0) {
          causal.setLastCauseForEntity(agentId, calmCauses[0]);
        }
      } else if (hazardScore > 0) {
        ecs.addProp(agentId, "panic", hazardScore);
        if (hazardCauses.length > 0) {
          causal.setLastCauseForEntity(agentId, hazardCauses[0]);
        }
      } else {
        // Natural slow recovery in safe environments
        ecs.addProp(agentId, "panic", -4);
      }
    }

    // 2. Social graph emotional contagion along "social_trust" edges
    const socialEdges = spatial.getEdgesByKind("social_trust");
    for (const edge of socialEdges) {
      if (!edge.intact) continue;
      const fromPanic = ecs.getProp(edge.from, "panic");
      const toPanic = ecs.getProp(edge.to, "panic");

      if (fromPanic >= 60 && toPanic < 60) {
        const nextPanic = ecs.addProp(edge.to, "panic", 35);
        const sourceCause = causal.getLastCauseForEntity(edge.from);
        const fromName = ecs.getEntity(edge.from)?.name ?? `Agent#${edge.from}`;
        const toName = ecs.getEntity(edge.to)?.name ?? `Agent#${edge.to}`;

        causal.recordEvent({
          tick,
          domain: "social",
          type: "social:panic_contagion",
          summary: `[${fromName}#${edge.from}]'s distress spread through social bond to [${toName}#${edge.to}] (panic=${Math.round(nextPanic)})`,
          subjectIds: [edge.from, edge.to],
          parentCauseIds: sourceCause ? [sourceCause] : undefined,
        });
      }
    }

    // 3. Utility AI state transition & movement
    for (const agentId of agents) {
      const agent = ecs.getEntity(agentId);
      if (!agent) continue;
      const panic = ecs.getProp(agentId, "panic");
      const wasPanicked = ecs.hasTag(agentId, "panicked");

      if (panic >= 60 && !wasPanicked) {
        ecs.addTag(agentId, "panicked");
        ecs.setMeta(agentId, "intent", "FLEEING_HAZARD");
        agent.color = "#f43f5e";
        const parentCause = causal.getLastCauseForEntity(agentId);
        causal.recordEvent({
          tick,
          domain: "social",
          type: "social:agent_panicked",
          summary: `[${agent.name}#${agentId}] panicked (panic=${Math.round(panic)}) and abandoned station duties to flee!`,
          subjectIds: [agentId],
          parentCauseIds: parentCause ? [parentCause] : undefined,
        });
      } else if (panic < 35 && wasPanicked) {
        ecs.removeTag(agentId, "panicked");
        ecs.setMeta(agentId, "intent", "MAINTAINING_OUTPOST");
        agent.color = "#22c55e";
        const parentCause = causal.getLastCauseForEntity(agentId);
        causal.recordEvent({
          tick,
          domain: "social",
          type: "social:agent_calmed",
          summary: `[${agent.name}#${agentId}] regained composure (panic=${Math.round(panic)}) and resumed cooperative maintenance.`,
          subjectIds: [agentId],
          parentCauseIds: parentCause ? [parentCause] : undefined,
        });
      }

      // If panicked, take 1 step away from center hazard toward emergency shelter (1, 10)
      if (ecs.hasTag(agentId, "panicked")) {
        const targetX = 1;
        const targetY = Math.min(spatial.height - 2, 10);
        const dx = Math.sign(targetX - Math.round(agent.x));
        const dy = Math.sign(targetY - Math.round(agent.y));
        const nextPos = spatial.clampToGrid(agent.x + dx, agent.y + dy);
        ecs.setPosition(agentId, nextPos.x, nextPos.y);
      }
    }
  }
}
