# Testing the engine — classic TDD: unit + property tests

*Criteria: [`../engine/SCENARIOS.md`](../engine/SCENARIOS.md) (every item MUST). Build order: [`../engine/BUILD.md`](../engine/BUILD.md).*

The engine is deterministic math over a store — the same inputs always give the same outputs. That makes it the perfect target for the classic red-green loop: write the failing test, implement, green, next.

## The three tiers

1. **Unit tests** — the bulk. Each scenario becomes one or more direct tests: set up store state, call the operation, assert the result. No mocks of the engine's own parts — the engine is tested whole, against its own real store logic.
2. **Property tests** — the invariants that must hold for *all* inputs, not just the scenario's example. Generate hundreds of random cases against each:
   - **Latches never clear** (B3): no sequence of writes leaves a set latch nulled.
   - **Commit is atomic** (A2): after any failed commit, the store is byte-identical to before it.
   - **No mutable balance** (K1): every owed/credit figure is derivable from the record; no write path stores a running balance.
   - **Exactly one winner** (A1): N racing commits for one unit → exactly one success, N−1 structured conflicts.
3. **The scenario suite** — every `SCENARIOS.md` item (families **A** races · **B** latches · **Q** quota · **T** travel/buffers · **M** recurrence · **P** resolve/projections · **X** reshuffle · **K** money · **S** shared projection · **G** consistency · **I** the cross-owner bind · **W** multi-day decomposition + course templates · **V** the travel envelope · **O** minimum occupancy · **Z** swap) as a named executable test, ID in the test name. *(`W`, not `D`, for multi-day — the harness's D-family is the floor, and two D-series across the two suites would be unreadable.)*

## Determinism harness

- **Virtual clock** — no test ever sleeps or reads real time; expiry (B1), quota windows (Q3), and horizon math (M4) run on an injected clock.
- **Scripted travel provider** (T1–T3) — the stub from `engine/INTERFACES.md §4`; the `unavailable` case (T3, fail-closed) is a first-class test, not an afterthought.
- **Replayability** — any failing case must be re-runnable from its recorded inputs alone.

## Done when

All scenario tests + property suites green, then the **swap** ([`integration.md`](integration.md)): the real engine replaces the harness's engine stubs and the full harness suite — including P1, the compaction pass-through — runs green with zero harness changes (engine Z1–Z2).
