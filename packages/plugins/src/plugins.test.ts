import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EmergenceKernel } from "cyberpsychosis-core";
import {
  ChemistryPlugin,
  ExternalRigidBodyAdapter,
  LogicRulePlugin,
  LogisticsPlugin,
  PhysicsPlugin,
  RigidBodyCollisionPair,
  SemanticLlmPlugin,
  SocialAgentPlugin,
} from "./index.js";

describe("cyberpsychosis-plugins — Six Simulators, Rigid-Body Impulse/Joints & Rapier2D Adapter", () => {
  it("resolves 2D rigid-body momentum collisions, snaps breakable truss joints, and bridges impacts into the Causal DAG", () => {
    const kernel = new EmergenceKernel({ seed: 101, gridWidth: 16, gridHeight: 12 });
    const physics = new PhysicsPlugin();
    kernel.usePlugin(physics);

    // Spawn a heavy flying boulder moving right (+2.0 vx) toward a truss pillar connected by a breakable joint
    const boulderId = kernel.ecs.createEntity({
      name: "HeavyBoulder",
      glyph: "O",
      x: 3,
      y: 5,
      vx: 2.0,
      vy: 0,
      tags: ["rigid_body"],
      props: { mass: 8, restitution: 0.7, radius: 0.6, integrity: 100 },
    });

    const pillarA = kernel.ecs.createEntity({
      name: "TrussNode_A",
      glyph: "T",
      x: 5,
      y: 5,
      vx: 0,
      vy: 0,
      tags: ["rigid_body", "structure", "fragile"],
      props: { mass: 1.5, restitution: 0.5, radius: 0.6, integrity: 100 },
    });

    const anchorB = kernel.ecs.createEntity({
      name: "BridgeAnchor_B",
      glyph: "H",
      x: 5,
      y: 6,
      vx: 0,
      vy: 0,
      tags: ["rigid_body", "static", "structure"],
      props: { mass: 100, radius: 0.5, integrity: 100 },
    });

    // Connect pillarA and anchorB with a breakable structural truss joint (max stretch = 1.35)
    kernel.spatial.addEdge({
      id: "joint:trussA->anchorB",
      from: pillarA,
      to: anchorB,
      kind: "joint",
      capacity: 1.35,
      intact: true,
    });

    const launchEvt = kernel.causal.recordEvent({
      tick: 0,
      domain: "user",
      type: "user:catapult_fired",
      summary: "Player launched HeavyBoulder (#1) toward TrussNode_A (#2)",
      subjectIds: [boulderId],
    });
    assert.ok(launchEvt.id);

    // Step 1: Boulder collides with TrussNode_A -> transfers momentum -> shatters TrussNode_A & snaps joint!
    kernel.step();
    kernel.step();

    const jointEdge = kernel.spatial.getEdge("joint:trussA->anchorB");
    assert.equal(jointEdge?.intact, false, "Expected truss joint to snap under impact displacement");
    assert.equal(kernel.ecs.hasTag(pillarA, "broken"), true, "Expected kinetic impact to shatter fragile truss node");

    // Verify Causal Lineage connects user launch -> collision_impact -> structure_broken / joint_snapped
    const lineage = kernel.causal.traceLineage(pillarA);
    const eventTypes = lineage.chain.map((n) => n.type);
    assert.equal(eventTypes.includes("user:catapult_fired"), true);
    assert.equal(eventTypes.includes("physics:collision_impact"), true);
  });

  it("synchronizes an ExternalRigidBodyAdapter (Rapier2D/Box2D style) across Time-Travel Rewind and WorldFork", () => {
    // Mock a Rapier2D-style WASM world with internal byte-snapshot state
    let internalSolverStepCount = 0;
    const mockRapierAdapter: ExternalRigidBodyAdapter = {
      syncFromECS(_kernel) {
        // Sync ECS state into WASM buffers
      },
      step(_dt): RigidBodyCollisionPair[] {
        internalSolverStepCount += 1;
        return [
          {
            entityA: 1,
            entityB: 2,
            normalX: 1,
            normalY: 0,
            impulseMagnitude: 4.5,
          },
        ];
      },
      syncToECS(kernel) {
        kernel.ecs.setPosition(1, 4 + internalSolverStepCount, 5);
      },
      takeSnapshot(): Uint8Array {
        return new Uint8Array([internalSolverStepCount]);
      },
      restoreSnapshot(snap) {
        const bytes = snap instanceof Uint8Array ? snap : new Uint8Array([]);
        internalSolverStepCount = bytes[0] ?? 0;
      },
    };

    const kernel = new EmergenceKernel({ seed: 88, gridWidth: 12, gridHeight: 12 });
    const physics = new PhysicsPlugin({ externalAdapter: mockRapierAdapter });
    kernel.usePlugin(physics);

    kernel.ecs.createEntity({
      name: "RapierCrate",
      x: 4,
      y: 5,
      tags: ["rigid_body"],
      props: { integrity: 100 },
    });
    const pipeId = kernel.ecs.createEntity({
      name: "TargetPipe",
      x: 5,
      y: 5,
      tags: ["structure", "pipe_node"],
      props: { integrity: 100 },
    });

    kernel.saveCheckpoint(); // Tick 0 (internalSolverStepCount = 0)
    kernel.step(); // Tick 1 (internalSolverStepCount = 1)
    assert.equal(internalSolverStepCount, 1);
    assert.equal(kernel.ecs.hasTag(pipeId, "broken"), true);

    // Run WorldFork 3 ticks ahead -> must restore Rapier WASM state back to Tick 1 afterward!
    kernel.forkAndPredict(3);
    assert.equal(internalSolverStepCount, 1);

    // Rewind to Tick 0 -> must restore Rapier WASM state back to 0!
    kernel.rewindTo(0);
    assert.equal(internalSolverStepCount, 0);
    assert.equal(kernel.ecs.hasTag(pipeId, "broken"), false);
  });

  it("tests ChemistryPlugin, LogicRulePlugin, LogisticsPlugin, SocialAgentPlugin, and SemanticLlmPlugin in isolation", () => {
    const kernel = new EmergenceKernel({ seed: 303, gridWidth: 10, gridHeight: 10 });
    const semantic = new SemanticLlmPlugin();
    kernel
      .usePlugin(new ChemistryPlugin())
      .usePlugin(new LogicRulePlugin())
      .usePlugin(new LogisticsPlugin())
      .usePlugin(new SocialAgentPlugin())
      .usePlugin(semantic);

    const a1 = kernel.ecs.createEntity({
      name: "Agent1",
      x: 2,
      y: 2,
      tags: ["agent"],
      props: { panic: 75 },
    });
    const a2 = kernel.ecs.createEntity({
      name: "Agent2",
      x: 6,
      y: 6,
      tags: ["agent"],
      props: { panic: 10 },
    });
    kernel.spatial.addEdge({ from: a1, to: a2, kind: "social_trust" });

    kernel.step();
    assert.equal(kernel.ecs.hasTag(a1, "panicked"), true);
    assert.equal(kernel.ecs.getProp(a2, "panic") >= 40, true, "Expected social panic contagion along trust edge");

    const res = semantic.compilePreviewAndInject(kernel, "Agent repair", 2);
    assert.equal(res.compiledDsl.includes("RULE agent_auto_repair"), true);
  });
});
