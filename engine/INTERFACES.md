# annnä Engine — INTERFACES (the seams)

*Three seams: **upward** (satisfy the contract the harness already pinned — `../harness/INTERFACES.md §1`, verbatim), **downward** (what the engine itself depends on: a travel source and a storage substrate), and the **sideways display-projection seam** (§2a) — the five `SPEC.md §0` projections, three pushed by subscription and two read on demand *(re-counted 2026-08-28 with §1.7c, FD-85)*, which the app renders verbatim, never computing a time, gap, or availability itself *(header re-cut 2026-08-22: it previously named only "a handle's display facet", the pre-§2a shape)*. The upward seam is the layer's acceptance boundary: the stub-swap (`BUILD.md` final gate) proves the real engine slots in with **zero harness changes**.*

---

## §1. Upward — the harness seam, satisfied

Every obligation of `../harness/INTERFACES.md §1`, mapped to where this package answers it:

| Harness obligation (§1.x) | Engine answer |
|---|---|
| §1.1 `calculate(query) → Handle` — opaque, never outward | `SPEC.md §5` (closed query taxonomy) + `§4` (handle mechanics, display facet, staleness) |
| §1.2 `commit` — no-double-book by construction, atomic, latch invariant, diff-only, never wipes governing rules, idempotent per caller write id | `SPEC.md §6` (§6.6 the write id) |
| §1.3 `check_consistency` / `check_coverage` — governing vs own vs **unsatisfiable**, structural only | `SPEC.md §8` (four classes; unsatisfiable outranks authority) |
| §1.4 `typed_value` / `compare` — the M3 value vocabulary + quota math; for `instant`/`interval` rows the `type_spec` carries the resolution context `{zone, reference_instant, locale}` (FD-27, 2026-08-21 — the two-argument pin holds) | `SPEC.md §2` (vocabulary + operators + the resolution-context rule), `§3` (`quota` entry); the implementation is the **shared library** — one implementation, `../harness/INTERFACES.md §1.4` (in `harness/src/typed-value.ts` now), consumed here when `BUILD.md` Step 2 builds *(clause added 2026-08-22 — the re-cut lived only at the harness home)* |
| §1.5 `resolve(goal, boards, rules) → Handle` — arbitration, bounded re-solve, contention ordering | `SPEC.md §7` |
| §1 `unavailable \| timeout` — the seam-wide infrastructure members (2026-08-21): a call that cannot reach the engine or times out returns these, never `{conflict}`; recovery rides the §6.6 write id | `SPEC.md §9` (the engine-unreachable bullet), `§6.6` *(row added 2026-08-21 — this table claims to map **every** §1 obligation and had five rows for six obligations)* |
| §1 the closed failure envelope (2026-08-22) — every failure return is one of six kinds, carried as `{kind, reason, detail?, next?}`, reasons from `../harness/INTERFACES.md §7.1`'s table — nothing else | `SPEC.md §6`/`§8`/`§9`'s refusals and declines all surface through the envelope; the engine invents no reason string outside the table *(row added 2026-08-22 — the every-obligation claim again)* |
| §1 the async law (2026-08-22) — every verb on every seam returns a promise of its printed return; no call blocks the loop | `SPEC.md §9` (long `resolve` computations run inside the deployment, never on the seam call's thread — the async-era pin) *(row added 2026-08-22)* |

**The proposal fits the existing seam — verified:**
- `resolve` already returns "a satisfying placement, **or a decline**" as a Handle; a compaction goal returns a **Proposal handle** through the same signature — the `direction` rides inside `goal`, no new parameter.
- Moved-party confirmations travel through the harness's **existing** outward machinery (`send` → `on_form_return`), gated by the floor exactly like any outward act. Apply-proposal is a `commit` call with a handle (`SPEC.md §6.5`).
- The freed-window keep-vs-reopen question surfaces as a **pending elicitation the harness reads** (its gap-detection already routes stored questions); the engine only records it and fails closed meanwhile.

**The cross-owner share fits the existing seam — verified against the lock (`SPEC.md §7.1`):**
- A share offer is a `resolve` whose `boards` include a counterparty's **published availability ref**; it returns the **one commitment in `offered`** as a handle through the unchanged signature — the same way a compaction goal returns a Proposal handle. **No new parameter, no new verb: one machine for own-board and cross-owner bookings.**
- It is applied by `commit(offer_ref)` — the **existing** `proposal_ref` input (`../harness/INTERFACES.md §1.2`), atomically, all-or-nothing. The harness never unpacks it; it passes the reference back, exactly as with a compaction proposal.
- The counterparty's accept/decline travels the harness's **existing** machinery (their trigger loop, their accept-mode Grants, `send` → `on_form_return`), floor-gated like any outward act. **The largest cross-tenant feature in the corpus therefore adds nothing to this table** — which is the test it had to pass.
- Pinned harness-side by `../harness/SCENARIOS.md` I1 and engine-side by `SCENARIOS.md` I1–I9, so the parity is testable rather than asserted.

**Zero new seam verbs, zero harness changes.** If building ever demands a new verb here, that contradicts the lock in `../.specs/deep-interview-engine.md` — stop and flag; don't add it silently.

The round-trip is **pinned on the harness side by `../harness/SCENARIOS.md` P1** (the compaction pass-through — added at engine-design time, before any build, so it is spec completion, not a harness change): direction asked per event → proposal handle narrated from its display facet → floor-gated move requests → token-attributed confirmations → `commit(proposal_ref)` → freed-window question store-routed. Z2 runs the harness suite *including P1*, which is what keeps the zero-changes claim testable rather than vacuous.

## §2. Downward — what the engine depends on

### §2.1 The travel source (external compute)
```
travel(place_a, place_b, at) -> duration | unavailable
```
- Lives **behind the engine's own interface** — no other layer ever calls it or carries its numbers. Results are cached as stored facts (`author: engine`), making replay deterministic.
- Precedence and fail-closed behavior: `SPEC.md §5`. Provider identity is config (BUILD), like a model binding — swappable without spec change.
- **Stub:** a scripted table `{(place_a, place_b, at-bucket) → duration}` keyed by scenario; `unavailable` on misses. Every SCENARIOS run uses the stub.

### §2.2 The storage substrate
Tech-neutral requirements (candidates named in `BUILD.md` only):
- **Atomic multi-object transactions** (one commit = one transaction, `SPEC.md §6.1`).
- **Append-only writes** with attribution (diffs, `SPEC.md §1.10`); no delete primitive exposed above the substrate.
- **Per-object version chains** for point-in-time reads and handle staleness checks (`store_version`).
- A **clock trigger** facility for holds and horizon extension (virtual/steppable clock in tests). **The trigger-registry bridge lives here** *(2026-08-22 — seam law at the seam)*: a `SPEC.md §1.15` TriggerRegistration's `fire_at` is armed on this facility, and the substrate's firing surfaces as the harness's **ordinary clock source** (`../harness/SPEC.md §4`'s fifth source — the harness never learns a new trigger kind); `scheduler_handle` is the substrate's cancellation token, a withdrawn registration cancels its arming, and a firing whose registration is gone commits nothing (`SCENARIOS.md` N1–N3).
- **Reactive push to subscribers** *(founder-ruled 2026-08-06)* — when a committed write changes a published display projection (§0's sole-client carve), subscribers are pushed the new value; the app never polls for it. This is a **hard criterion, not a preference**, and it is the one a reader is most likely to skip: a store can satisfy every row above and still be non-reactive, at which point `../app/INTERFACES.md`'s live board and app scenario Z3 ("board updates live") quietly become a polling loop nobody specified. The ruling exists precisely so a non-reactive substrate cannot be picked by accident.

## §2a. Sideways — the display-projection seam *(2026-08-22 — the header above promised three seams and the body specified two; this is the one the app builds its home screen on)*

The **five** projections `SPEC.md §0` enumerates — the guest Shared projection, the owner's live board view, the FR38 template-bundle projection, the FD-34 candidate-shape ghost, and the **effective-policy projection** (`SPEC.md §1.7c`) — are this seam's whole surface; **a sixth is a spec change with its own ruling**, exactly as a sixth seam verb would be. *(The sentence demanded a ruling for a fifth and got one — **FD-85**, 2026-08-28 — and it stays true unchanged for the next one.)* **Two transports, one fenced family** *(sentence added 2026-08-22 — `SPEC.md §1.7a` and this section previously read as giving the bundle both; re-counted 2026-08-28 with §1.7c)*: the guest Shared projection, the owner's live board view **and the effective-policy projection** are **subscription** members (§2.2's reactive push, the rules below — three of them); the template-bundle projection and the candidate-shape ghost are **read-on-demand** members — the bundle invoked as an internal `calculate`-class read (`SPEC.md §1.7a`), the ghost computed when the store surface asks and never stored. Three pushed, two read on demand.

- **Every pushed value carries `{store_version, projection_id}`.** The app **discards any payload whose `store_version` is older than what it already holds** — one rule that kills the merge ambiguity in both directions, because the board has two content sources: `render(board, payload)` from the harness sets the *surface*, the projection sets the *contents* (`../app/SPEC.md §1` carries the same sentence). A `render` payload computed at version N arriving after a push at N+1 does not repaint the board backward.
- **A subscription carries `unavailable` as a member.** A subscription that goes quiet is a *state*, never an empty board — the app renders *stale, reconnecting* (`../app/SPEC.md §1.1`'s never-lies-about-progress law reaches here). A handle's `expires` governs commit redemption (`SPEC.md §4`), not display; a displayed facet does not blank on expiry, it re-reads.
- **A projection stub ships with the engine's stub** so the app suite can exercise subscription, push, staleness-discard and the `unavailable` member without a live store — the same stub discipline §4 applies to everything else.

## §3. What the engine OWNS (and what it must never absorb)

- **Owns:** the store of record (§1 objects), all deterministic math (§2–§8), the travel cache, materialization, arbitration.
- **Never absorbs:** the floor and grants *decisions* (harness — the engine only matches, `SPEC.md §1.6`); elicitation and narration (harness/model); rendering, delivery, tokens' transport (app); anything probabilistic (model). If a computation needs judgment, it doesn't belong here.

## §4. Stub strategy for this layer's own build

`SCENARIOS.md` runs the engine against: the **scripted travel provider** (§2.1), a **virtual clock** (drive holds, expiries, horizon jobs deterministically), and **direct API calls standing in for the harness** (the scenarios call `calculate/commit/resolve/…` exactly as the harness contract states — which is what makes the final stub-swap a formality rather than an integration adventure).
