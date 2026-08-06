# Deep Interview — Engine layer (2026-08-05)

Interview to pin the open design decisions for `engine/` before authoring its spec package. Final ambiguity ~15%.

## Goal

Produce the **full engine spec package** — `engine/README.md · SPEC.md · INTERFACES.md · SCENARIOS.md · BUILD.md`, same shape and rigor as `harness/` and `model/`. The engine = persistent store (commitments, boards, rules, grants, latches, Shared artifacts) + the deterministic math on it. Built, not imported.

## Decisions made (this interview)

1. **Deliverable** — full spec package now, not notes, not stub-minimum.
2. **Solver scope (end state)** — the engine may **propose reshuffles** ("this fits IF we move your 3pm to 4pm"), offered as proposals the owner approves. Never auto-reshuffles.
3. **Sequencing** — engine spec now (place-only), then Matt adds a **driver user story** (location + travel time between commitments matter), then we **revisit the engine** with it.
4. **Rule power** — **fixed menu of rule types** (quota, buffer, price, window, capacity, …), each with exact designed math. Off-menu requests: the agent says "I can't enforce that yet"; it becomes a design request. No general predicate language.
5. **Recurrence** — **pattern + real copies ahead**: store the recurrence pattern once, materialize real commitment rows over a rolling horizon; each copy has its own identity/state (cancel one, complete one, attach a party to one).
6. **V1 cut** — this spec designs **place-only** placement math fully; the `resolve` seam is shaped so reshuffle-proposals slot in at the revisit without rework.
7. **Done test** — every engine SCENARIO passes **and** the real engine replaces the harness's engine stubs with **zero harness changes**, all harness scenarios still green. The swap is the exam.

## Constraints (pre-existing, not re-asked)

- The engine's obligations are already pinned by `harness/INTERFACES.md §1`: `calculate`→opaque handles, `commit` (no-double-book by construction, atomic, latch invariant, diff-only writes, never wipe governing rules), `check_consistency`/`check_coverage` (structural), the M3 type-value system (units, ordered sets, ranges, board-refs, relations, money, rate-over-recurring-window + `compare`), `resolve`.
- Non-negotiables (parent README): thin agent / rich engine · reversibility floor · poka-yoke (illegal states unconstructable) · general capability, stories as falsification probes.
- `destruction` and `value-transfer` classes stay empty: engine stores marks (paid/settled) but never moves money; nothing hard-deletes (latches + diffs).
- Requirements source of truth: `user-stories/` (Situations A/B/C/D/E — D is the driver/location probe, written after this interview). Engine SCENARIOS derive from them + the harness stub contract.

## Non-goals (v1 spec)

- Reshuffle-proposal math (revisit, after the driver story).
- Location/travel-time (incoming pressure — data model must not preclude attributes that carry it; noted, not designed).
- Storage technology choice — SPEC stays tech-neutral; BUILD names candidates.
- Semantic completeness checking, general rule language, money movement, export.

## Known incoming pressure (flag in SPEC, do not design to)

- **Driver story**: location as a commitment attribute; the gap between two commitments measured in travel, not just minutes; reshuffle proposals justified by route feasibility.

## Acceptance criteria

- Engine package passes the same fresh-LLM test as harness/model (README alone orients a stranger).
- Every `harness/INTERFACES.md §1` obligation appears exactly once in engine SPEC/INTERFACES.
- SCENARIOS cover: no-double-book race, latch invariant (no un-expire), diff-only rule writes, quota math (10h/month), buffer math, recurrence materialization + single-copy edits, structural coverage, place-only resolve incl. "nothing fits" decline, stub-parity items proving swap-readiness.
- BUILD ends at the stub-swap: real engine in, harness untouched, harness suite green.

## Revisit outcome (2026-08-05 — supersedes decision 6's deferral)

Decision 6's place-only cut was conditional on the driver story not existing. Both halves of the agreed sequence completed the same day: **Situation-D (Debra) was captured**, and the engine package was authored with **reshuffle-as-proposal in scope** (per the approved authoring plan). How the probe's four held-out predictions were absorbed — as *general* primitives, per the meta-principle, never as PT features:

| Held-out prediction (brief) | Became (engine spec) |
|---|---|
| location as a commitment attribute; gap = travel | `place` M3 type + `buffer` rule's computed-travel operand form; external source behind `calculate`, fail-closed |
| per-patient third-party constraints | `pin` + party-targeted `location-window` — menu rules with `target: party`, pre-filtered in `resolve` |
| compaction = reshuffle-as-proposal | the stored Proposal object; never self-applying; owner approves, moved party confirms |
| direction-parameterized optimization | `direction` supplied per event in the `resolve` goal — never a stored default |

**Status call:** the engine-side X-series scenarios are **MUST** (deterministic and designed); the *story-level* generality check lives in the harness suite's **P1 pass-through** and Situation-D itself. The v1 bound (1 owner, 1 day, ≤3 moves) is printed in engine SPEC §7.

## Interview transcript (condensed)

| R | Q | A |
|---|---|---|
| 1 | Deliverable? | Full engine spec package |
| 2 | Solver may touch existing board? | Propose reshuffles; driver story (location/distance) showcases it |
| 3 | Driver story timing? | Engine now → add driver story → revisit engine |
| 4 | Rule power (contrarian)? | Fixed menu of rule types |
| 5 | Recurrence storage? | Pattern + real copies over rolling horizon |
| 6 | V1 cut (simplifier)? | Place-only now; reshuffle at revisit |
| 7 | Done test? | Scenarios + stub-swap with zero harness changes |

## Clarity breakdown (final)

| Dimension | Score |
|---|---|
| Goal | 0.90 |
| Constraints | 0.80 |
| Success criteria | 0.85 |
| Context (brownfield) | 0.85 |
| **Ambiguity** | **~15%** |
