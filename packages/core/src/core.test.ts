import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { EmergenceKernel } from "./index.js";

describe("@emergence/core — EmergenceKernel & Five-Dimensional Primitives", () => {
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
});
