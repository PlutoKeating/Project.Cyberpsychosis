import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EmergenceKernel } from "./index.js";

describe("cyberpsychosis-core — EmergenceKernel & Five-Dimensional Primitives", () => {
  it("enforces property bounds, deterministic ECS ordering, and time-travel rewind", () => {
    const kernel = new EmergenceKernel({ seed: 42, gridWidth: 8, gridHeight: 8 });
    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "temp",
      defaultValue: 20,
      min: -50,
      max: 500,
    });

    const e1 = kernel.ecs.createEntity({
      name: "WaterDrop",
      x: 2,
      y: 2,
      tags: ["water"],
      props: { temp: 15 },
    });

    const e2 = kernel.ecs.createEntity({
      name: "Heater",
      x: 2,
      y: 3,
      tags: ["heater"],
      props: { temp: 999 }, // should clamp to 500
    });

    assert.equal(kernel.ecs.getProp(e2, "temp"), 500);

    kernel.rules.registerRule({
      id: "heat_transfer",
      name: "Heater warms adjacent water",
      priority: 10,
      enabled: true,
      source: "static",
      grammar: {
        kind: "grid_adjacent",
        subjectTag: "heater",
        targetTag: "water",
      },
      semantics: [
        { kind: "add_prop", target: "target", prop: "temp", delta: 30 },
        {
          kind: "emit_event",
          domain: "chemistry",
          eventType: "water_heated",
          summary: "Heater warmed adjacent water",
        },
      ],
    });

    kernel.saveCheckpoint();
    kernel.step();
    assert.equal(kernel.tick, 1);
    assert.equal(kernel.ecs.getProp(e1, "temp"), 45);

    kernel.step();
    assert.equal(kernel.tick, 2);
    assert.equal(kernel.ecs.getProp(e1, "temp"), 75);

    // Rewind back to tick 1
    const rewound = kernel.rewindTo(1);
    assert.equal(rewound, true);
    assert.equal(kernel.tick, 1);
    assert.equal(kernel.ecs.getProp(e1, "temp"), 45);
  });

  it("compiles Baba-Is-You style grid word blocks into active rules and revokes when pushed apart", () => {
    const kernel = new EmergenceKernel({ seed: 7, gridWidth: 10, gridHeight: 10 });
    kernel.vocabulary.registerProperty(kernel.ecs, {
      name: "temp",
      defaultValue: 20,
      min: 0,
      max: 300,
    });

    const waterId = kernel.ecs.createEntity({
      name: "CoolantWater",
      x: 1,
      y: 1,
      tags: ["water", "cool"],
      props: { temp: 15 },
    });

    // Place [WATER] at (3,5), [IS] at (4,5), and [HOT] at (5,6) (not aligned yet)
    kernel.ecs.createEntity({
      name: "WORD_WATER",
      x: 3,
      y: 5,
      tags: ["word_block", "word_noun", "pushable"],
      meta: { wordToken: "WATER" },
    });
    kernel.ecs.createEntity({
      name: "WORD_IS",
      x: 4,
      y: 5,
      tags: ["word_block", "word_verb", "pushable"],
      meta: { wordToken: "IS" },
    });
    const hotWordId = kernel.ecs.createEntity({
      name: "WORD_HOT",
      x: 5,
      y: 6,
      tags: ["word_block", "word_prop", "pushable"],
      meta: { wordToken: "HOT" },
    });

    kernel.step();
    assert.equal(kernel.ecs.hasTag(waterId, "hot"), false);

    // Push [HOT] up by (0, -1) to (5,5) -> forms [WATER] [IS] [HOT]
    const pushed = kernel.pushEntity(hotWordId, 0, -1, "Player pushed HOT block");
    assert.equal(pushed, true);
    assert.equal(kernel.ecs.hasTag(waterId, "hot"), true);
    assert.equal(kernel.ecs.getProp(waterId, "temp") >= 95, true);

    // Trace causal lineage of the water entity
    const lineage = kernel.causal.traceLineage(waterId);
    assert.equal(lineage.chain.length >= 2, true);
    assert.equal(lineage.chain[0].type, "entity_pushed");
    assert.equal(lineage.chain[1].type, "rule_compiled");

    // Push [HOT] away to break the rule
    kernel.pushEntity(hotWordId, 0, 1, "Player broke rule");
    assert.equal(kernel.ecs.hasTag(waterId, "hot"), false);
  });

  it("supports World Forking (forkAndPredict) without mutating the primary world", () => {
    const kernel = new EmergenceKernel({ seed: 99, gridWidth: 8, gridHeight: 8 });
    const oilId = kernel.ecs.createEntity({
      name: "OilPool",
      x: 4,
      y: 4,
      tags: ["oil"],
      props: { temp: 25 },
    });

    const prediction = kernel.forkAndPredict(5, (forked) => {
      forked.rules.injectDsl(forked.tick, "OVERRIDE oil IS burning", forked.ecs, forked.causal);
    });

    assert.equal(prediction.finalMetrics.burningCount, 1);
    // Primary world must remain completely untouched at tick 0
    assert.equal(kernel.tick, 0);
    assert.equal(kernel.ecs.hasTag(oilId, "burning"), false);
  });

  it("compresses history via Copy-on-Write Delta Snapshots and rewinds across delta and keyframe boundaries", () => {
    const kernel = new EmergenceKernel({
      seed: 2026,
      gridWidth: 32,
      gridHeight: 32,
      snapshotHistoryLimit: 64,
      keyframeInterval: 8,
    });

    // Spawn 40 entities, but only 1 entity moves per tick -> high delta compression ratio
    const runnerId = kernel.ecs.createEntity({
      name: "Runner",
      x: 1,
      y: 1,
      tags: ["runner"],
      props: { speed: 1 },
    });
    for (let i = 0; i < 39; i++) {
      kernel.ecs.createEntity({
        name: `StaticPillar_${i}`,
        x: (i * 3) % 32,
        y: Math.floor(i / 4),
        tags: ["pillar", "solid"],
        props: { integrity: 100 },
      });
    }

    const hashesByTick = new Map<number, string>();
    hashesByTick.set(0, kernel.getStateHash());

    for (let t = 1; t <= 12; t++) {
      kernel.usePlugin({
        id: "runner-mover",
        name: "Runner Mover",
        onTick(k, tickNum) {
          k.ecs.setPosition(runnerId, tickNum, 1);
        },
      });
      break;
    }

    for (let t = 1; t <= 12; t++) {
      kernel.step();
      hashesByTick.set(kernel.tick, kernel.getStateHash());
    }

    const stats = kernel.getSnapshotMemoryStats();
    assert.equal(stats.deltaFrameCount > stats.keyframeCount, true);
    assert.equal(stats.compressionRatio > 1.5, true, "Expected delta snapshots to be significantly smaller than full copies");

    // Rewind within delta window (Tick 12 -> Tick 10)
    assert.equal(kernel.rewindTo(10), true);
    assert.equal(kernel.tick, 10);
    assert.equal(kernel.getStateHash(), hashesByTick.get(10));

    // Rewind across keyframe boundary (Tick 10 -> Tick 5)
    assert.equal(kernel.rewindTo(5), true);
    assert.equal(kernel.tick, 5);
    assert.equal(kernel.getStateHash(), hashesByTick.get(5));
  });

  it("records deterministic ReplayTapes, encodes/decodes Base64URL story links, and synchronizes Lockstep peers with rollback", async () => {
    const {
      LockstepCoordinator,
      encodeReplayTapeToBase64Url,
      decodeReplayTapeFromBase64Url,
    } = await import("./lockstep.js");

    const buildWorld = () => {
      const k = new EmergenceKernel({ seed: 777, gridWidth: 10, gridHeight: 10 });
      k.ecs.createEntity({
        name: "Water",
        x: 1,
        y: 1,
        tags: ["water", "cool"],
        props: { temp: 15 },
      });
      k.ecs.createEntity({
        name: "W_WATER",
        x: 2,
        y: 2,
        tags: ["word_block", "word_noun", "pushable"],
        meta: { wordToken: "WATER" },
      });
      k.ecs.createEntity({
        name: "W_IS",
        x: 3,
        y: 2,
        tags: ["word_block", "word_verb", "pushable"],
        meta: { wordToken: "IS" },
      });
      k.ecs.createEntity({
        name: "W_HOT",
        x: 4,
        y: 3,
        tags: ["word_block", "word_prop", "pushable"],
        meta: { wordToken: "HOT" },
      });
      k.saveCheckpoint();
      return k;
    };

    const host = buildWorld();
    host.step(); // tick 1
    host.pushEntity(4, 0, -1, "Push HOT into slot"); // at tick 1
    host.stepMany(3); // advance to tick 4

    const tape = host.exportReplayTape();
    const encoded = encodeReplayTapeToBase64Url(tape);
    const decoded = decodeReplayTapeFromBase64Url(encoded);

    const peer = buildWorld();
    const verification = peer.replayFromTape(decoded);
    assert.equal(verification.verified, true);
    assert.equal(peer.getStateHash(), host.getStateHash());

    // Verify LockstepCoordinator rollback when a late network packet arrives for an earlier tick
    const lockstepA = new LockstepCoordinator(buildWorld());
    const lockstepB = new LockstepCoordinator(buildWorld());

    // Both advance to tick 3, but A receives player input at tick 1 immediately while B receives it late at tick 3
    lockstepA.advanceSynchronizedTick(); // tick 1
    lockstepA.submitPeerInput({
      tick: 1,
      playerId: "player-1",
      commands: [{ tick: 1, type: "push", entityId: 4, dx: 0, dy: -1 }],
    });
    lockstepA.advanceSynchronizedTick(); // tick 2
    lockstepA.advanceSynchronizedTick(); // tick 3

    // Peer B advances without the packet first
    lockstepB.advanceSynchronizedTick(); // tick 1
    lockstepB.advanceSynchronizedTick(); // tick 2
    lockstepB.advanceSynchronizedTick(); // tick 3
    assert.notEqual(lockstepB.kernel.getStateHash(), lockstepA.kernel.getStateHash());

    // Now the late packet for tick 1 arrives at Peer B -> triggers automatic rollback & resimulation!
    const rb = lockstepB.submitPeerInput({
      tick: 1,
      playerId: "player-1",
      commands: [{ tick: 1, type: "push", entityId: 4, dx: 0, dy: -1 }],
    });
    assert.equal(rb.rolledBackFromTick, 3);
    assert.equal(rb.stateHash, lockstepA.kernel.getStateHash());
  });

  it("exports and hot-reloads declarative WorldBundles losslessly", () => {
    const kernel = new EmergenceKernel({ seed: 5150, gridWidth: 12, gridHeight: 12 });
    kernel.vocabulary.registerProperty(kernel.ecs, { name: "temp", defaultValue: 20, min: 0, max: 200 });
    kernel.vocabulary.registerPrefab({
      id: "crate",
      name: "Crate",
      glyph: "#",
      color: "#eab308",
      tags: ["crate", "movable"],
      props: { temp: 25 },
    });
    kernel.vocabulary.spawnPrefab(kernel.ecs, "crate", 5, 5);

    const bundle = kernel.exportWorldBundle("TestOutpostBundle", "Declarative bundle test");
    const freshKernel = new EmergenceKernel({ seed: 1, gridWidth: 12, gridHeight: 12 });
    freshKernel.loadWorldBundle(bundle);

    assert.equal(freshKernel.getStateHash(), kernel.getStateHash());
  });
});
