/**
 * Deterministic Mulberry32 Pseudo-Random Number Generator.
 * Supports full state serialization and restoration for time-travel & world forking.
 */
export class SeededPRNG {
  private state: number;
  readonly initialSeed: number;

  constructor(seed = 20261014) {
    this.initialSeed = seed >>> 0;
    this.state = this.initialSeed;
  }

  /** Returns a deterministic float in [0, 1) */
  next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(this.state ^ (this.state >>> 15), 1 | this.state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Returns a deterministic integer in [min, max] inclusive */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  getState(): number {
    return this.state >>> 0;
  }

  setState(state: number): void {
    this.state = state >>> 0;
  }
}
