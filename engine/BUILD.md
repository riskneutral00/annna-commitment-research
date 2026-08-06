# annnä Engine — BUILD (ordered plan, each step gated by scenarios)

*Build order for the layer. Per the parent README, the engine is built **after** the harness (its seams are the requirements) and its final gate is the stub-swap. Storage-technology candidates are named here and only here (SPEC is tech-neutral): an embedded SQL store (SQLite) for the isolated build; the serving substrate is **Convex** — **ratified (FR7) after being checked against** the transaction, version-chain and reactive-push requirements of `INTERFACES.md §2.2`, not chosen by preference. The check is printed at Step 0 so it can be re-run rather than trusted; PostgreSQL remains the named alternative, at the cost printed with the check (it fails the reactive-push row and would have to build it). Travel-provider candidates, same treatment *(founder-ruled 2026-08-06)*: the scripted stub for the whole isolated build, then **Google Routes API** or **Mapbox Directions** as serving candidates (OSRM self-hosted as the no-key fallback) — decided at the serving step by the `travel(place_a, place_b, at)` seam's needs (`INTERFACES.md §2.1`: the `(place_a, place_b, at)` signature, result caching, and fail-closed precedence), and recorded in `../deployment/INTERFACES.md §4` when bound.*

## Step 0 — Substrate & scaffold

**Substrate ratification — settled, and settled the right way round (founder ruling FR7, 2026-08-06).** The serving substrate is **Convex**. This does not weaken the *"not by preference"* law above, because the ruling was **checked against `INTERFACES.md §2.2`'s five criteria before it was accepted**, not asserted over them. The check, printed so a later reader can re-run it rather than take it on trust:

| §2.2 criterion | How Convex answers |
|---|---|
| Atomic multi-object transactions | mutations are serializable transactions over arbitrarily many documents — one `commit` = one mutation (`SPEC.md §6.1`) |
| Append-only writes with attribution | a discipline the schema enforces, not a substrate feature — no delete primitive is exposed above the store layer (`SPEC.md §1.10`) |
| Per-object version chains | stored explicitly as `store_version` on each object; handle staleness reads against it (`SPEC.md §4`) |
| Clock trigger facility | scheduled functions drive holds, horizon extension, and `min-occupancy` decisions; the scenario runner substitutes a steppable virtual clock |
| **Reactive push to subscribers** | live queries push a changed display projection to its subscribers on commit — the app never polls (`SPEC.md §0` sole-client carve; `../app/INTERFACES.md`, app scenario Z3) |

**Three of the five are the substrate's; two are ours.** That distinction is the point of writing this down: append-only and version chains are **our schema discipline**, and they would have to be built the same way on any substrate. Only atomicity, the clock, and reactive push are things a substrate can hand you. A future substrate change re-runs this table — the criteria stay authoritative, the answer does not.

**The fallback is not free, and this is where that shows.** PostgreSQL passes rows 1–4 and **fails row 5** as it stands: reactive push would have to be built (`LISTEN`/`NOTIFY` plus a socket fan-out layer, with its own delivery and reconnect semantics). Naming that here is the whole reason row 5 exists — without it Postgres reads as a drop-in, and the property the ruling was protecting disappears silently rather than failing a printed check.

**If any row fails at build time, the ruling reopens.** FR7 ratified a candidate that passes this check; it did not exempt the substrate from the check. That is what keeps `not by preference` literally true.

- Stand up the scenario runner with the virtual clock and the scripted travel provider.
- **Verify:** an empty store boots; a diff writes and reads back with attribution; the clock steps; **a commit that changes a published projection reaches a subscriber without the subscriber asking** — the reactive-push row is checked here, not taken on trust, because it is the one criterion that fails silently by degrading into a polling loop rather than by erroring.

## Step 1 — Object model & latches
- Implement §1 objects (principal, board, commitment, rule, grant, shared, order, money marks, history). Write-once latches and no-delete enforced at the store layer.
- **Verify:** B1–B3, K1–K2, A3.

## Step 2 — Type-value system (M3)
- `typed_value` / `compare` over the full §2 vocabulary; raw literals rejected outside `typed_value`.
- **Verify:** type-error cases + Q2's typed draws.

## Step 3 — Rule menu & evaluation points
- The closed §3 menu: storage constraint (off-menu unstorable), per-type math, binding times, precedence.
- Implement §3's **pairwise clash table** and §8's four-way classification — including the **unsatisfiable** class, which is refused at write regardless of authority and is never offered on the override path. Each row's **minimum-case test** is the implementation, not a comment: code the smallest failing input the row names, not the general shape of the clash.
- **Verify:** G1–G4, Q1, P4, **G5–G6 (unsatisfiable outranks authority; the refusal names the fix)**, and **G7 — the over-application guard.** G7 is the one that fails silently if skipped: an over-broad `unsatisfiable` refuses a valid ruleset, and no refusal-side assertion catches that. Gate the positive case with the negative ones.

## Step 4 — `calculate` & the travel seam
- Closed query taxonomy, handles with display facets, the travel interface + cache + precedence + fail-closed.
- **Verify:** T1–T4, S1–S2, P3.

## Step 5 — `commit`
- One-transaction checks, races, handle redemption, diff application.
- **Verify:** A1–A2, Q1 (commit side), B1 (lapse under the clock).

## Step 6 — Recurrence & materialization
- Pattern objects, rolling-horizon job, forward-only edits, bounded on-demand materialization, the §9 DST law.
- **Verify:** M1–M6, Q3.

## Step 7 — `resolve`: place-only core
- Placement search with the §7 constraint classes; structured declines; contention ordering + bounded re-solve.
- **Verify:** P1–P2.

## Step 8 — `resolve`: reshuffle proposals
- Proposal objects, direction, pin pre-filtering, the ≤3-move bound, apply-proposal via commit, freed-window fail-closed.
- **Verify:** X1–X7.

## Step 9 — The stub-swap (definition of done)
- Point the built harness at the real engine. Run the **entire harness suite**.
- **Verify:** Z1–Z2 — every harness scenario green, `git diff` on `harness/` empty. If any harness change is needed, stop: that is a seam-contract bug to fix on the engine side (or to flag, per `INTERFACES.md §1`), never a harness edit.

## Guardrails
- **The bound is law:** if Step 8 tempts you toward route optimization or week-level moves, re-read SPEC §7/§11 — feasibility and improvement, ≤3 moves, one day, one owner.
- **No new seam verbs** (INTERFACES §1); no rule type without §3's math + evaluation point; no delete, ever.
- Determinism is a test: any scenario that flakes under replay is a bug in the engine, not the suite.
