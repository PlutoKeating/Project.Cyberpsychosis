# `cyberpsychosis-plugins`

Six decoupled runtime simulator plugins for `cyberpsychosis-core` (`v0.2.0`):
1. `ChemistryPlugin`: Conductive heat transfer, ignition, smoke emission, and extinguishing
2. `PhysicsPlugin`: 2D rigid-body momentum collisions, breakable structural truss joints (`joint`), overheat/overpressure shockwaves, and `ExternalRigidBodyAdapter` for `@dimforge/rapier2d-deterministic-compat`
3. `LogicRulePlugin`: Rule-as-Entity global property overrides
4. `LogisticsPlugin`: Directed pipe flow, backpressure, and rupture cascades
5. `SocialAgentPlugin`: Hazard perception, emotional contagion along social graphs, and utility AI
6. `SemanticLlmPlugin`: Natural language to Restricted DSL compiler with `WorldFork` safety verification

License: Apache-2.0
