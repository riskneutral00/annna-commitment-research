# annnä Engine — SCENARIOS (deterministic acceptance suite)

*Pass/fail, deterministic, replayable — the engine is the layer where determinism lives, so unlike `../model/EVALS.md` (graded) every item here either holds or the build fails. Run against the stubs in `INTERFACES.md §4` (scripted travel provider, virtual clock). Sources: the user-stories corpus (A/B/C/D/E), the interview acceptance list (`../.specs/deep-interview-engine.md`), and the harness stub contract. Every scenario is MUST.*

*(Section letters are local to this file.)*

## A — Atomic commit & races
- **A1 [race, one winner]** Two commits race for the last unit of capacity. Exactly one succeeds; the other returns `{conflict, reason, alternatives}` listing still-open times. *(Sofia's 3:00; Situation-D's last Friday slot; Situation-C's last boat seats.)*
- **A2 [all checks, one transaction]** A commit that passes capacity but violates a buffer gap against its *following* neighbor fails atomically — nothing partial is stored.
- **A3 [governing wipe rejected]** A lower-authority diff whose effect would disable a governing rule does not apply; the governing rule remains in force. *(Mirror of harness D-series.)*

## B — Latches
- **B1 [no un-expire]** A hold lapses (`expired_at` set by the virtual clock); the signature arrives late. Evidence is recorded; status stays `expired`; the unit is never re-held. *(Situation-B's lapsed hold.)*
- **B2 [latch wins]** A cancelled-but-otherwise-complete commitment reports `cancelled`, not `completed`.
- **B3 [no clearing write]** Any write attempting to null a set latch is rejected by the store.
- **B4 [escalation stored, terminal write-once]** An `Escalation` (`../harness/SPEC.md §3.9`; stored per SPEC §1.13) is written, its `ladder_state` advanced across two virtual-clock firings (rung 1 → rung 2), then its status latched `timed_out_parked`. A later write attempting to reopen it (revert to `open`) is **rejected by the store**, and the co-occurring `needs_human` park is clearable only by a human (B3's discipline applied to the escalation). Assert the object **persists across firings** (read back from the store, not from harness memory) and that **no escalation-specific entry point** is called — only `commit`/`calculate`. *(The engine half of `../harness/SCENARIOS.md D12–D17; §3.9`.)*

## Q — Quota & balance
- **Q1 [the 11th hour]** A customer at 10h/month: `calculate` availability excludes any slot that would exceed the rate; `commit` refuses if forced. *(Sofia's cap.)*
- **Q2 [balance pack]** A 10-dive/3-month pack: draws decrement; the 11th draw and the post-expiry draw both refuse. *(Situation-C's dive pack.)*
- **Q3 [window edge]** A quota window spanning the materialization horizon computes identically before and after horizon extension.

## T — Travel & gaps
- **T1 [unreachable excluded]** Adjacent placements at two places: any candidate violating `gap ≥ travel(a,b,at)` is absent from availability and from `resolve` output. *(Situation-D: 10:00 across town after a 9:00–10:00 visit is never offered.)*
- **T2 [override beats computed]** A declared travel rule (route + time-of-day scoped) contradicts the provider's number; the declared value governs every computation touching that route/time. *(The bridge at rush hour.)*
- **T3 [fail closed]** The travel stub returns `unavailable`: the gap is unknown; the slot is not offered, the move not proposed; the decline carries the reason.
- **T4 [constant buffer]** A constant-operand `buffer` rule evaluates exactly as the classic buffer (Sofia's 10-before/15-after run) — and the harness's stored shape, `Rule{type: buffer, operand: 5min}` (harness B1), stores and evaluates **unchanged** on this menu.

## M — Recurrence & materialization
- **M1 [materialize]** A weekly pattern materializes real instances over the horizon; each has its own id and latches.
- **M2 [edit one]** Cancelling one instance latches that instance only; siblings and pattern untouched.
- **M3 [forward-only pattern edit]** Pattern shifts Monday→Tuesday: instances carrying state (a latch, an attached party, precondition evidence) keep their day; bare drafts regenerate on Tuesday.
- **M4 [beyond horizon]** A booking request past the horizon materializes only the requested window, then books normally.
- **M5 [DST gap]** A daily pattern at a local time erased by spring-forward (zone with DST): that day's instance materializes at the gap's first existing instant; every other day is unchanged; no day yields zero instances. *(Law: SPEC §9.)*
- **M6 [DST duplicate]** The same pattern crossing fall-back: the duplicated local time materializes exactly one instance, at the earlier-UTC occurrence, and a duration spanning the transition keeps its true elapsed length. *(Law: SPEC §9.)*

## P — Place-only resolve & projections
- **P1 [placement]** `resolve` returns a placement satisfying every board and rule it touches.
- **P2 [honest decline]** No placement exists: structured decline naming the refusing constraint class — never a forced fit. *(Situation-B's "no bike"; Situation-E's safe park.)*
- **P3 [site-day projection]** A `location-window` rule (Eastside only Mon/Wed): availability projections offer the day's place only. *(Debra's link; Situation-C's boat route rotation — which site the boat runs which day is the same rule.)*
- **P4 [domain refusal]** An `attribute-domain` violation (address outside service area) refuses at intake with the honest no.

## X — Reshuffle proposals
- **X1 [direction honored]** Same trigger, `toward-start` vs `toward-end`: two different proposals, each improving in its stated direction only.
- **X2 [pin pre-filtered]** A pinned party's placements never appear in `moves` — they appear in `untouched` with reason `pin`. *(Harold is never even suggested.)*
- **X3 [stale proposal]** The board changes after a proposal is computed; apply-proposal re-validates and returns `{conflict}` — no partial application.
- **X4 [declined move]** One move's confirmation is `declined`: apply refuses; the board is unchanged; nothing was moved piecemeal.
- **X5 [freed fail-closed]** The proposal's freed window is unbookable while its decision is `pending`; `keep-blocked` keeps it so; `reopen` restores it to projections. *(The afternoon that stays hers.)*
- **X6 [confirmations required]** Apply-proposal with any `pending` confirmation refuses.
- **X7 [bound respected]** A compaction needing 4 moves returns the best ≤3-move proposal or a decline — never an unbounded search. *(The printed v1 bound.)*

## K — Money marks
- **K1 [owed derived]** Cancelling a visit corrects the record: the amount is no longer owed, with no mutable-balance write anywhere. *(The $140 never owed; Bobby's credit.)*
- **K2 [marks latched]** `paid/settled` marks carry `{by, at}`; no engine operation moves value (no such entry point exists to call).
- **K3 [no-show is never engine-declared]** A commitment whose scheduled start has passed with no check-in: the engine surfaces **the fact** and **never writes a `no-show` mark of its own** — assert the absence, on the stored record, after the clock has advanced well past the start. The mark appears only from an owner act, attributed `{by, at}`; what it then costs is the commitment's no-show policy, **bound at booking** (SPEC §1.5), so a policy edited after booking does not change this instance's owed amount. *(SPEC §1.9, founder-ruled 2026-08-07 #5 — the ruling had no acceptance criterion until now.)*

## S — Shared projection
- **S1 [board-blind]** However a Shared projection is queried (weeks ahead, blacked-out days), the answer set contains only bookable time — no commitment, reason, name, or address of anything blocking. *(Sofia's life; Debra's route.)*
- **S2 [token attribution]** A return through a per-recipient token attributes to exactly that recipient.
- **S3 [bundle-fence]** *Given* the FR38 template-bundle projection (SPEC §1.7a), *then* a query that attempts to select any counterparty, booking, history, ledger, or personal-data field is **unrepresentable** — the field is not in the projection's selectable set, asserted as schema-level unrepresentability, not a runtime strip. The engine twin of `../harness/SCENARIOS.md G9 [ENGINE]` and the authoring twin of the §1.7 leak test (S1). *(The two must agree or the harness→engine swap is a lie.)*

## G — Consistency & coverage
- **G1 [governing conflict]** A rule clashing with a governing rule: hard stop, write refused.
- **G2 [own conflict]** A rule clashing with the owner's own rule: returned for the override-with-reason path — not silently applied, not hard-stopped.
- **G3 [latent]** An SOP-internal latent inconsistency: alert returned, nothing blocked.
- **G4 [coverage structural]** `check_coverage` flags a missing required attribute; it makes no semantic-completeness claim.
- **G5 [unsatisfiable outranks authority]** A pair marked ***unsatisfiable*** in §3's clash table — run it for `duration × quota` and for a **required** `dependency × pin` (not a ranked `fallback` — see G7), both authored at **individual** authority — is **refused at write** and is **not** returned on the override-with-reason path. Assert the override path is unreachable for these, and that the refusal carries the naming message. *(The G2 own-rule case proves the opposite routing for a genuinely overridable pair; G5 is the line between them.)*
- **G6 [the refusal names the fix]** Every unsatisfiable refusal carries both offending operands and the remedy — never a bare "invalid ruleset." *(SPEC §8; the `../model/SPEC.md §6` decline voice, enforced engine-side so it holds with no model in the loop.)*
- **G7 [a pinned first choice does not break a fallback]** A ranked `fallback` chain `[freelancer A, freelancer B]` with **A pinned** and B unpinned: `check_consistency` returns **no clash at all**, the ruleset stores, and `resolve` places B. Assert the ruleset is **storable** — this is the guard against the class over-applying, and it is written as a positive test because an over-broad `unsatisfiable` fails by refusing something valid, which no refusal-side assertion can catch. Pin every alternative and the same pair *does* classify unsatisfiable (§3): the line is "nothing can be generated," never "the top choice is gone."

## I — The cross-owner share (SPEC §7.1)
*Parity family: `../harness/SCENARIOS.md` I1 asserts the harness half (the path is the ordinary loop, no separate harness invoked); these assert the engine half.*
- **I1 [engine parity with harness I1]** Two on-app owners, one books the other: `resolve` (over the counterparty's exposed availability) + accept + `commit(offer_ref)` yield **one creator-owned commitment standing on both boards in one transaction** — no mirrored second record exists to diff. **No function outside the §1 seam set is called** — asserted as a walk of the contract, which is what makes the swap law survive this feature. *(The engine-side mirror of harness I1 — the two must agree or the swap is a lie.)*
- **I2 [both boards or neither]** The counterparty's board fails a check at commit time (a buffer violated by a placement made since the offer): **the commitment appears on neither board**; `{conflict, reason}` returns; the **offer ends** and the terminal state is a **recorded attributed event**, not a status value (I7's record). *Assert the commitment's status reads as one of `../harness/SPEC.md §3.4`'s values — the offer is over, so no `offered` condition holds and no latch was set — and that **no fourth value** appears for the conflict; a run that invents one fails this scenario.*
- **I3 [no read power added]** Throughout an offer, every value the initiator's side can observe about the counterparty is derivable from the `availability` grant (the published Shared projection). No commitment, rule, party, name, or money mark of the counterparty is reachable without a higher rung they granted — asserted as a walk of what the seam returns, not a runtime sample. *(The S1 board-blind guarantee, re-asserted across the tenant line.)*
- **I4 [caller cannot author a crossing]** A caller-supplied structure naming a second tenant is a type error; a grant is engine-minted or it does not exist. Asserted structurally against the contract — there is no entry point to call.
- **I5 [silence never binds]** An offer that is never answered reaches `expired` on the virtual clock when its hold runs out: the commitment stands on no counterparty board, a recorded terminal event on both.
- **I6 [the hold is the creator's setting]** While an offer sits `offered`, the targeted window is **held for the offer's `hold` duration** (default 5 minutes; creator-set 0–24 h) and then freed. With `hold: 0` the window stays bookable and the first commit wins. A racer against a zero-hold or expired offer loses with `{conflict, reason, alternatives}`, alternatives drawn from **exposed availability**, never the board.
- **I7 [terminal states recorded both sides]** Decline (with its structured reason), expiry, and conflict each write an attributed `{who, basis, when}` event to **both** boards and place the commitment on neither. *(`../security/SPEC.md §9` N3, made testable.)*

## W — Multi-day decomposition (SPEC §7)
*(Letter `W`, not `D` — this file cross-references the **harness** D-family, the floor, and two D-series would be unreadable.)*
- **W1 [per-day calls]** A four-day course resolves as four single-day `resolve` calls composed by an Order — no multi-day search exists to call. *(Situation C's flagship.)*
- **W2 [partial placement survives]** Day 3 declines; days 1–2 handles remain valid and independently committable. Nothing is rolled back, because nothing was written.
- **W3 [which days placed]** The result names, per day, a placement or a decline carrying its refusing constraint class — never a bare partial.
- **W4 [all-or-nothing is the caller's]** The same day set committed as one Order applies atomically: a day-4 failure leaves days 1–3 uncommitted. Committed individually, they stand independently. Both paths exist; the engine picks neither.
- **W5 [template expands to ordinary objects]** A four-day `KindTemplate` (SPEC §1.12) instantiates to four Commitments under one Order, sequenced by `depends_on` per `requires`. **No object type exists in the result that a hand-authored course would not produce** — asserted structurally. *(F7's resolution, made testable.)* This is *expansion*-equivalence (template → objects). Its **authoring**-equivalence twin — an agent-authored *bundle* ≡ a hand-authored one — is FR38's instance and lives in `../marketplace/SCENARIOS.md` I6, because the engine is deliberately not marketplace-aware (`INTERFACES.md`); FR38's "W5 (agent-authored ≡ hand-authored)" citation points back to the principle stated here.
- **W6 [relative offsets]** The same template expanded against two different anchor days produces correctly-dated session sets, with no stored absolute time anywhere in the template.
- **W7 [role binds at expansion]** A template naming a `board_role` ("a boat") binds to a concrete board at expansion; the template is unchanged and re-expands against a different fleet.
- **W8 [template edit is forward-only]** Editing a template leaves already-expanded courses untouched — mirror of M3's pattern-edit law.

## V — Travel envelope (SPEC §5)
- **V1 [ceiling]** A placement whose candidate set would need more than the fetch ceiling makes no further fetches: remaining legs are unknown and fail closed. The search declines; it never stalls.
- **V2 [dedup + batch]** Many candidate instants over the same place-pair and time-bucket produce **one** provider request; the scripted provider's call count is asserted.
- **V3 [cache hit beats fetch]** A second placement over a cached `(place_a, place_b, bucket)` makes no provider call and returns the identical duration.
- **V4 [the two declines are distinguishable]** A day that is genuinely full returns `no-feasible-placement`; a day the provider failed on returns `travel-unknown`. Asserted as different structured reasons — collapsing them fails this scenario.

## O — Minimum occupancy (SPEC §3 `min-occupancy`)
- **O1 [early booking never blocked]** The first booking on a boat with `min-occupancy: 4` commits normally. Being below the minimum is never a reason to refuse a booking.
- **O2 [clock trigger, owner decision]** At `start − decide_by` with 2 of 4 seats confirmed, the engine **writes the `needs_human` park and a `PendingDecision` (SPEC §1.14)** and stops there; the harness's trigger loop reads it and the run **parks for a human**. The engine cancels nothing and notifies no customer on its own. *Assert the record is a `PendingDecision` carrying its three engine-named choices (run under minimum / cancel / extend the window), readable through `calculate` with no new seam verb, and that **no engine path writes `chosen`** — a run in which the engine picks, defaults, or times out into a choice fails this scenario.*
- **O3 [minimum met, silence]** At the trigger instant with 4 of 4 confirmed, nothing fires and nothing is surfaced.
- **O4 [unsailable clash]** `min-occupancy.min` greater than the board's `capacity.N` classifies **unsatisfiable** at `check_consistency` (SPEC §8 item 4) and is **refused at write even though both rules are the shop's own** — not offered on the override-with-reason path, because no override could make the boat sailable. The refusal names the fix. Discovered at authoring, never at sea.

## Z — Stub parity (the swap insurance)
- **Z1 [behavior parity]** For each harness stub behavior (`../harness/INTERFACES.md §5`: capacity check, latch check, canned handles), the real engine reproduces the *contract-visible* behavior exactly on the harness scenarios' inputs.
- **Z2 [the swap]** The full harness `SCENARIOS.md` suite runs green against the real engine with **zero harness changes** — the layer's definition of done. The harness suite **includes P1** (the compaction pass-through) **and P2** (the pending-decision round-trip), so both engine-originated paths are exercised end-to-end through the harness — Z2 cannot pass vacuously on either.

---

**Coverage map (interview acceptance → scenarios):** no-double-book race → A1 · latch invariant → B1–B3 · escalation stored/terminal-write-once (§1.13; harness §3.9) → B4 · diff-only rule writes → A3 · quota math → Q1 · buffer math → T4 · recurrence + single-copy edits → M1–M4 · DST edges → M5–M6 · structural coverage → G4 · unsatisfiable-outranks-authority → G5–G6 · **the class does not over-apply** → G7 · place-only + honest decline → P1–P2 · reshuffle (revisit) → X1–X7 · stub-swap → Z1–Z2 · Situation-D pins → T1/T2/T3, P3/P4, X2, X5 · Situation-C pins → A1 (the last seats), Q2 (the dive pack), P3 (route rotation), B1 (the clocked offer lapses like any hold), P1–P2 + K1–K3 (the week's placements, its money record, and no engine-declared no-show) · the cross-owner share → I1–I7 (engine half of harness I1) · multi-day courses → W1–W4, course templates (F7) → W5–W8 · travel envelope → V1–V4 · boat minimum (F20) → O1–O4.
