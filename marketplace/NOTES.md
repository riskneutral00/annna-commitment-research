# Marketplace — NOTES (backlog scratchpad)

*Like the harness and app NOTES files: items already absorbed into the spec, plus anything still open. **Never authoritative** — build from `SPEC.md`.*

## Adversarial review, round one — COMPLETE (2026-08-06)

10-lens fan-out: **46 raw findings → 30 distinct → 30 killed by refuters → the kill-audit critic overturned 4 kills and the coverage critic added 5 gaps.** The overturned + surgical items were worked into the spec the same day (degradation/fave-four/Plain reconciliation across app S6 + SPEC §1.1/§3/§4; device-copy persistence ruling for store skins; executable mock — store-skin fixture + real expiring test signer; palette field re-described to match the real `palette.json` shape; propose→confirm elicitation clarified (the proposal card **is** the preview, not a stage); the `shared_shapes`/`resource_shapes` divergence recorded; the pipeline's public-web-root scoped to shipped skins; root README's "no code" claim corrected). Full kill list: the session record of 2026-08-06.

## Confirmed findings from the review — **all four closed (F20, F7, F5→FR14, language→FR15); one process note open**

- ~~**The engine rule menu cannot carry the dive bundle (F20).**~~ **CLOSED 2026-08-06.** The menu gained a **`min-occupancy`** entry — operand `(min, decide_by)`, evaluated at a **clock trigger** before departure, violation **parks the run as an owner decision** rather than refusing a booking (`../engine/SPEC.md §3`; scenarios `../engine/SCENARIOS.md` O1–O4). Marketplace Z1 is constructible. *(Why it took a ruling: it is the menu's only rule that cannot evaluate at intake or commit — at the first booking the count is always below the minimum, so a commit-time gate would make the boat unbookable.)*
- ~~**The course day-shape has no representation (F7).**~~ **CLOSED 2026-08-06.** Resolved as **`KindTemplate`** (`../engine/SPEC.md §1.12`): the shape is **authoring-time vocabulary** that expands into ordinary Commitments under one **Order**, sequenced by `depends_on` — so §1.8's *"there is no third mechanism"* still holds literally, which is why the archive's live `composition` object was correctly dropped. Placement is `resolve`'s per-day decomposition (`§7`); scenarios `../engine/SCENARIOS.md` W1–W8.
- ~~**Entitlement revocation semantics (F5).**~~ **CLOSED 2026-08-06 (FR14).** A withdrawn entitlement takes effect at the **next entitlement check** (activation, app open): the skin deactivates, the fave slot clears, appearance falls back to the shipped floor. One rule, no special cases — *why* the entitlement was withdrawn is closed-service business and never reaches the open half (`SPEC.md §5`). The **device copy is not deleted**; the entitlement simply stops authorizing activation, which is what keeps §3's persistence law and the S4/S6 outage laws intact. Landed at `SPEC.md §4`; scenario `SCENARIOS.md` E5.
- ~~**No marketplace language law — narrowed 2026-08-06 by FR15, still open.**~~ **CLOSED 2026-08-07 (wayfinder #4).** The catalog surface renders in the **viewing owner's stored language setting** with English fallback — landed at `SPEC.md §6`.
- **Prior-source drift check.** The review ran against committed HEAD; the same-day security/deployment packages and their cross-edits were not in its scope. Round two, when it runs, should take the whole tree.

## Relocated from PR/NOTES (2026-08-06)

*Outward surfaces are commercially silent (`../PR/VOICE.md` §Commercial silence); the money questions live here instead.*

- ~~**No-show money**~~ — **CLOSED 2026-08-07 (wayfinder #5).** No-show is always a human mark; the policy is a creator-set per-commitment field binding at booking. Landed at `../engine/SPEC.md §1.9`.
- **Store terms** — held by the closed service and, per `SPEC.md §5` (FR18, 2026-08-06), **deliberately unspecified anywhere in this repo**. Not an omission and not a gap: the open half is complete without them. Do not re-introduce them here.

## Prepared: the Situation-A′/C′ install-run probe — **AUTHORED 2026-08-07** (`../user-stories/Situations/Situation-A-prime/`, `Situation-C-prime/`; the checklist below is what they were built from)

The flagged gap (`SCENARIOS.md` coverage map): no user story exercises the marketplace itself — Sofia never installs, TingTing never browses. The fix is a **probe, not a design target**: two short install-run situations derived from A and C. Route: the `probe-situation` staged flow, seeded with this scope.

**A′ — Sofia-shaped install run** must exercise:
- Discovering the store; previewing "Free Time Available" as the **ghost guest page rendered from her real availability** (D3's template half) — before any write.
- Installing: the agent walks the blanked parameters (hours, duration, buffer, price) as ordinary proposals — *her* numbers, nothing written without confirm (I2).
- Publishing a link from the installed shape; a booking lands (Z1 first half).
- Later, uninstalling — her booked lessons stand (I5).
- **A refusal:** she asks the agent to "publish my setup so other teachers can use it" — refused; supply is admin-only (P2's human face).

**C′ — Hug-shaped install run** must exercise:
- Installing the dive-center bundle: multi-resource shapes stood up (roster slots, boat, pool, gear), course kinds, governed rules with blanked operands (F5, I4).
- The installed state being the setup Situation C's clean run starts from (Z1 second half).
- **A refusal:** a tampered/over-reaching bundle (carries a rule off the menu, or tries to carry "our regular customers") — refused whole at the door, entry named (I3, F3).

**Domain-brief questions — ANSWERED 2026-08-07 (wayfinder #6), probe unblocked:**
1. **The agent suggests the store** when the owner describes a need; browsing may appear as a beat inside the story, never its opening.
2. For A′: **no skin** — Sofia's story stays templates-only. (Recorded consequence: the skin-entitlement path stays scenario-tested (E5) but exercised by no user story for now.)
3. For C′: **empty account** — the bundle stands up a fresh shop from nothing. (Recorded consequence: install-into-lived-in-board stays covered at scenario level only.)

## Prepared: the two open rulings (`SPEC.md §7`)

**OR-28 — curation & impersonation.** *Decision:* how publisher identity is vouched when anything beyond founder supply exists (the "Official PADI Blueprint" problem). *Options on record:* (a) fully curated catalog — current de facto state, admin-only supply makes impersonation structurally impossible for now; (b) verified-publisher identity before any third-party supply; (c) staged private link-share (share a bundle by link without a catalog listing) as the first crack in admin-only. *Evidence to gather before ruling:* trademark posture for certifying-body names; how the app stores label "official". *Trigger:* the first serious third-party-supply conversation — not before. **Note the recorded dependency:** opening user supply also re-opens the engine's no-export ruling (`SPEC.md §7`) — the two must be ruled together.

**OR-29 — template supply terms.** *Decision:* what terms, if any, attach to template supply. *Status:* open, and the substance sits **inside the closed service** — per `SPEC.md §5` (FR18) the terms are not stated in this repo, so neither are the options. *Recorded dependency, which is the only part the open half needs:* any change here that opens **publisher** supply re-opens OR-28 and the engine's no-export ruling together. *Trigger:* the closed service's own post-alpha ruling. **Nothing in the open half depends on the outcome** — templates install through the entitlement seam either way.
