import { EmergenceKernel } from "./kernel.js";
import { ReplayCommand, ReplayTape } from "./types.js";

export interface LockstepInputPacket {
  tick: number;
  playerId: string;
  commands: ReplayCommand[];
  clientStateHash?: string;
}

export interface LockstepTickCommit {
  tick: number;
  appliedCommands: Array<{ playerId: string; command: ReplayCommand }>;
  stateHash: string;
  desyncedPeers: string[];
}

/**
 * Deterministic Lockstep & Rollback Netcode Coordinator.
 * Exploits Cyberpsychosis's byte-level deterministic ECS, Mulberry32 PRNG,
 * incremental rewindTo(tick), and FNV-1a stateHash to synchronize multi-peer emergent worlds
 * or share entire emergent stories as compact URL replay tapes.
 */
export class LockstepCoordinator {
  readonly kernel: EmergenceKernel;
  private pendingInputs = new Map<number, LockstepInputPacket[]>();
  private committedHistory = new Map<number, LockstepTickCommit>();

  constructor(kernel: EmergenceKernel) {
    this.kernel = kernel;
  }

  /**
   * Queues a player's input packet for a target tick.
   * If the target tick is in the past (late network arrival), automatically triggers
   * deterministic rollback (`rewindTo`) and fast-forwards (`step`) back to the present tick!
   */
  submitPeerInput(packet: LockstepInputPacket): {
    rolledBackFromTick: number | null;
    currentTick: number;
    stateHash: string;
  } {
    const list = this.pendingInputs.get(packet.tick) ?? [];
    list.push({
      ...packet,
      commands: packet.commands.map((c) => ({ ...c })),
    });
    this.pendingInputs.set(packet.tick, list);

    if (packet.tick < this.kernel.tick) {
      const presentTick = this.kernel.tick;
      const rewound = this.kernel.rewindTo(packet.tick);
      if (rewound) {
        while (this.kernel.tick < presentTick) {
          this.advanceSynchronizedTick();
        }
        return {
          rolledBackFromTick: presentTick,
          currentTick: this.kernel.tick,
          stateHash: this.kernel.getStateHash(),
        };
      }
    }

    return {
      rolledBackFromTick: null,
      currentTick: this.kernel.tick,
      stateHash: this.kernel.getStateHash(),
    };
  }

  /**
   * Executes all queued peer commands for the current tick in canonical `playerId` order,
   * steps the kernel by 1 tick, and verifies peer state hashes for zero-desync guarantee.
   */
  advanceSynchronizedTick(): LockstepTickCommit {
    const targetTick = this.kernel.tick;
    const packets = (this.pendingInputs.get(targetTick) ?? []).slice().sort((a, b) =>
      a.playerId.localeCompare(b.playerId)
    );

    const appliedCommands: Array<{ playerId: string; command: ReplayCommand }> = [];
    for (const pkt of packets) {
      for (const cmd of pkt.commands) {
        this.kernel.applyReplayCommand({ ...cmd, tick: targetTick });
        appliedCommands.push({ playerId: pkt.playerId, command: cmd });
      }
    }

    this.kernel.step();
    const stateHash = this.kernel.getStateHash();

    const desyncedPeers: string[] = [];
    for (const pkt of packets) {
      if (pkt.clientStateHash && pkt.clientStateHash !== stateHash) {
        desyncedPeers.push(pkt.playerId);
      }
    }

    const commit: LockstepTickCommit = {
      tick: this.kernel.tick,
      appliedCommands,
      stateHash,
      desyncedPeers,
    };
    this.committedHistory.set(commit.tick, commit);
    return commit;
  }

  getCommit(tick: number): LockstepTickCommit | undefined {
    return this.committedHistory.get(tick);
  }
}

/**
 * Encodes a deterministic `ReplayTape` into a compact URL-safe Base64 string (`?replay=...`)
 * so players can share emergent stories in a single link without server storage.
 */
export function encodeReplayTapeToBase64Url(tape: ReplayTape): string {
  const json = JSON.stringify(tape);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(json, "utf8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

/**
 * Decodes a URL-safe Base64 string back into a validated `ReplayTape`.
 */
export function decodeReplayTapeFromBase64Url(encoded: string): ReplayTape {
  const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (normalized.length % 4)) % 4;
  const padded = normalized + "=".repeat(padLen);

  let json: string;
  if (typeof Buffer !== "undefined") {
    json = Buffer.from(padded, "base64").toString("utf8");
  } else {
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    json = new TextDecoder().decode(bytes);
  }

  const parsed = JSON.parse(json) as ReplayTape;
  if (parsed.version !== 1 || typeof parsed.seed !== "number" || !Array.isArray(parsed.commands)) {
    throw new Error("Invalid ReplayTape payload");
  }
  return parsed;
}
