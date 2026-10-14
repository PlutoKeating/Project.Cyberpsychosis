# `cyberpsychosis-core`

Deterministic emergent gameplay kernel middleware (`v0.2.0`):
- `DeterministicECS` with property clamping, inverted tag index, $O(1)$ spatial grid buckets, and Copy-on-Write (CoW) frame delta tracking
- `VocabularyRegistry`, `GrammarMatcher`, `SemanticsExecutor` (Five-Dimensional Framework)
- `RuleEngine` (Baba-Is-You style Rule-as-Entity runtime recompilation & Restricted DSL)
- `MultiModalSpatialIndex` (`Grid2D` + `Continuous2D` + `GraphTopology`)
- `CausalTracker` (First-class Causal Lineage DAG with append-only CoW delta snapshots)
- `EmergenceKernel` (Fixed-tick scheduler, 32-bit FNV-1a `getStateHash()`, CoW Delta/Keyframe `rewindTo`, `forkAndPredict` WorldFork, and declarative `WorldBundle` hot-reload)
- `LockstepCoordinator` & `ReplayTape` (Rollback lockstep multiplayer synchronization and `< 150`-char Base64URL story sharing)
- `runScalingBenchmarks` (Built-in 32 to 5,000 entity performance & delta compression benchmark suite)

License: Apache-2.0
