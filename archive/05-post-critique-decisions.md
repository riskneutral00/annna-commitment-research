# 05 — Post-Critique Decisions (Phase 0)

> ⚠️ **Historical — this is design *history*, not the build plan.** Preserved so decisions can be traced to their reasoning. Where anything here conflicts with a layer package (`harness/`, `engine/`, `app/`, `model/`), **the layer's `SPEC.md` wins.** Start at the [root README](../README.md).


*Decisions made 2026-08-03 after the adversarial critique (`CRITIQUE-FINDINGS.md`) and the approved plan. These are the strategic forks (plan §4) that touch product scope or reverse an earlier decision — settled one at a time before the atom redesign. Each will be folded into `DESIGN.md` in the plan's Phase 5.*

---

## Decision 1 — Template library is the PRIMARY path; the interview is the fallback (plan §4.1)

**Chosen: A.** A library of pre-seeded templates is the primary way an owner gets set up; the live agent-interview is the long-tail fallback for domains no template covers.

**Key refinement (Matt): templates are authority-leveled — "federal vs. state."**
- A template from a **governing authority** (PADI, RYA, regulators, standard-form contracts) is a **standard a shop cannot supersede.** Individual shops may **add** rules on top but may **not override** the governing rules.
- **Admin-seeded:** the governing library is seeded and curated by the app administrator in production — starting with one licensed or permitted certification standard as the worked example — not authored by each shop.

**Consequences:**
1. **Rules carry an authority level** (governing → org/shop → individual); precedence resolves by level.
2. **Conflict policy splits in two** (refines §13/§14): conflict with your *own* prior rule → override allowed (stored); conflict with a *governing* rule → **override forbidden** (rejected or flagged non-compliant).
3. **Compliance-to-standard becomes product value + moat** — annnä guarantees a shop runs to standard, not just that it schedules.
4. **Build-order inverts:** the content/template library is a first-class artifact to build and curate (an admin/curation role distinct from the shop owner), not "free." The interview handles only the long tail — which makes its known defects (no stop-condition, no coverage oracle) survivable, since a template ships with its own completeness.

*Status: settled. Feeds the rule atom (needs an authority-level field) and the coverage/consistency work.*

---

## Decision 2 — Import IN, no export OUT; assume annnä is the complete record (plan §4.2)

**Chosen: A, refined toward lock-in.**
- **Import IN: yes.** Users can import their existing scheduling data into annnä — the on-ramp that fills the board so a new user doesn't eat wrong bookings during migration.
- **Export OUT: not in v1**, beyond full data-portability compliance. No two-way sync; annnä never writes to an external calendar — a second writable copy of the board reintroduces exactly the split-truth problem the product exists to remove. *(Consequence acknowledged: this raises switching cost, and the design should not pretend otherwise.)*
- **Design assumption:** for all intents and purposes, **everything the user schedules in their life is represented in annnä; no other apps exist.** This is the intended end-state (users migrate meals, workouts, cycle, etc. — all just commitments/presets on one substrate) and is what makes §5's "the engine needs nothing beyond the board's events" hold.

**Strategy:** annnä is designed to be the *complete* record, not one calendar among several. Partial adoption is the failure mode the design refuses to optimize for — a board that holds only some of a user's commitments cannot reason correctly about availability, which is the product's whole basis. So the target is to absorb every scheduling need on one substrate (meals, workouts, cycles and the rest are commitments too), rather than to interoperate as a satellite of another calendar.

**Consequences:**
1. The critique's 6.1 hole (availability scoped to a dataset annnä doesn't own) is **accepted as a deliberate posture**, mitigated by import + the full-migration assumption. Residual risk: a user who doesn't fully migrate can get wrong bookings — an accepted bet.
2. **External stakeholders** who never had an app to import from (use case C's boat owner, a walk-in) are unaffected by import/export — their availability comes via **confirmation** (`notify-and-await-confirmation`), and **an empty board means "unknown," not "free."** (Consistent with this decision; not overridden by it.)
3. The commitment atom must be general enough to absorb meal/workout/cycle/etc. as presets — already the model, reconfirmed.

*Status: settled.*

---

## Decision 3 — Commercial layer: represent money, don't process it (plan §4.3)

**Adopted regardless (not a fork):**
- **Customer as a party.** The customer is recorded as a principal (today `who` defaults to self and the customer isn't a party at all).
- **Order = a composition root.** A group of commitments that belong together (likely the `parent` edge). **Cancellation** dissolves the order's commitments and releases their slots — pure scheduling, impossible without this.

**Chosen on money: B — represent, don't process.**
- A payment (deposit, fee) is modeled as a **precondition artifact** (same machinery as a signed waiver or uploaded passport), marked satisfied by an integration *or* manually.
- The **floor gates any charge-initiating action**; "charge" stays a real, testable verb.
- **Actual payment rails are engine/integration — deferred.** No payments subsystem enters the harness now.
- Clean upgrade path to full processing (option A) later without redesign. D's deposit/damage charge is supported as the commercial point of its hold.

*Status: settled. Feeds the atom (customer party, order/composition, payment-as-precondition) and keeps the §14 floor coherent.*

---

## Decision 4 — Completion semantics (reverses the earlier field-count derivation) (plan §4.4)

**Rejected:** completability derived from field-count ("both times ⇒ event ⇒ not completable"). It denied completion to the entire B2B half and mistyped terminal constraints.

**Chosen (Matt's model):**
- **Events auto-complete by time.** Once the end passes, the commitment is marked **`completed`** automatically — "completed" = *in the past*, never manually marked. (This preserves the "you don't mark a party done" intuition by making it automatic.)
- **Un-complete / extend** by changing the end time; **convert event↔task** by adding/removing a start or end.
- **Actual-completion signal for resource-bound / overrun-prone commitments.** Scheduled end ≠ actual end (bike returned Monday though due Sunday; C's uncertain ~2pm end runs to 3:30). Such commitments carry a **"done/returned" signal that can land later than scheduled end; completion = the later of the two.** This keeps turnaround buffers and no-double-book honest. (For meetings/parties, scheduled end = reality, so pure auto-complete is correct.)
- **Tasks complete by action, not time.** A skipped 6am gym or a report past its Friday deadline is **overdue/missed, not completed**; tasks are ticked by a person.

**Net:** completion is real for both types but driven differently — **events by time (+ an actual-done override), tasks by volition.**

**Residual carried into Phase 1 (atom design):** time fields still need explicit **roles** — occupying-interval vs. deadline(finish-by) vs. defer(not-before) vs. **terminal-constraint** ("boat must be back by Friday" must not be mistyped as an occupy-nothing task). Completion semantics are settled; field-roles are designed with the atom.

*Status: settled (completion); field-roles open, assigned to Phase 1.*

---

## Decision 5 — Bounded-surface bet: expand for balances, stay open on changeover (plan §4.5)

**Chosen: B, scoped.**
- **Retire the "surface is stable / bounded-surface proven" claim.** It was tested on one shape (a scarce resource reserved for a bounded window under an eligibility predicate) sampled four times. Two counterexamples now exist.
- **Build a `balance` / entitlement now** — the **class-pack** ("10 dives, expires in 3 months, non-transferable") is a cumulative draw-down over a period with no single instant. Capacity defined as *"max concurrent consumption ≤ capacity at any instant"* **cannot hold a running balance.** It is in-market (dive centers sell packs), so the atom/board must represent it.
- **Sequence-dependent changeover** (gap = f(ordered pair X→next); e.g. paint booth, allergen kitchen): don't architect it out — keep buffers *conceptually* extensible to pair-dependence — but **do not build** the pair-dependent `calculate` engine until a real customer needs it. Note it breaks `calculate`'s "a gap is a property of the board" assumption (gap becomes a function of board + intended placement).

**Consequence:** the "new domain = content, never tools" bet is downgraded to **unproven**; carry it as a hypothesis, not a law.

*Status: settled.*

---

## Decision 6 — Unattended operation: build the general capability, not the use case (plan §4.6)

**Reframed (Matt):** we are designing *only the harness* — the general scaffolding that lets these things happen. The ER scheduler, the dive shop, etc. are **random use cases; no design decision should cater to one.** "Is the ER scheduler v1 or north-star?" was a mis-framing — that's a *deployment's* use of a capability, not a harness decision.

**Adopted (general capabilities the harness must provide):**
- **Trigger-driven loop.** The loop can fire on a *sale*, a *hold expiry*, a *decline*, or a *clock time* — not only on a console turn. Needed by every case (B's overnight booking, D's expiring hold, C's late reply); fixes the deadlock where the turn-driven loop can't start with no human present.
- **Escalation model**, including **"no human reachable"** behavior (timeout / queue / on-call). Feeds the principal + escalation work (plan items 4 & 5.4).

**Dropped:** any scoping of autonomy to a use case (ER v1 vs north-star). How far a deployment runs unattended is *its* configuration in content/rules.

### META-PRINCIPLE (applies to all decisions)
**Design the harness's general capability; never make a design decision catering to a specific use case.** The use cases B–E (teacher / dive / rental / ER) are **falsification probes for the harness's generality — not design targets.** A probe that breaks the model reveals a missing *general primitive*; we build the primitive, not the use case. (D1–D5 already conform: authority-leveled templates, import posture, commercial primitives, completion semantics, balances are all general; PADI / class-packs / etc. are instances.)

*Status: settled. Phase 0 complete (6/6).*

---
---

# Phase 1 — The Atoms (design)

## Vocabulary layer (resolves 1.4) — authority-leveled; governing template defines the kinds

- **Commitment-kind** (OWD, rental, ER-shift, lesson): a named *domain* type carrying an **attribute schema** (OWD: language, cert-level, participant-count; patient: category, age-band, condition). Defined at an **authority level** — a governing template defines the kind + its required attributes; org/individual **extend** (add attributes) but never remove/redefine governing ones. **Distinct from the *temporal* type** (event/task), which stays derived. An instance references a kind and carries values for that kind's attributes.
- **Board attributes**: boards (person/pool/room/unit) carry authored attributes (has-ventilator, language-spoken, unit-class, depth). Authority-leveled where a standard mandates them (usually org-level).
- **Predicate rules quantify over these attributes**: `admission` = predicate over a commitment's attributes; `qualification` = board-attribute vs commitment requirement; `composition` = kind requires [sub-kinds × N] under predicates. *(The single `⊇` operator is wrong for ordinal/numeric/ratio comparisons — §3.2–3.4. The typed-value vocabulary and its operators are **engine/M3 work**, deferred; the harness only guarantees the contract carries declared typed values, correctness-critical ones as engine handles.)*
- **M2 governed-board gate (poka-yoke):** on a board carrying governing rules, a commitment must resolve to a declared `kind` (rules evaluated) **or** an explicit `exception {reason, by}` (flagged, never recorded as compliant). Silent untyped-on-governed is unrepresentable.
- **Templates/SOPs bundle kinds + rules.** A governing template (PADI OWD) = the OWD kind (vocabulary) + its rules — both authority-leveled.

## Consolidated object model (post-Phase-0)
- **Principal / party** — owner of a board, actor on a turn, customer on an order (fixes 1.5; enables the floor + consent).
- **Board** — id, owner(principal), `capacity | balance`, attributes, zone [zone open → Phase 4]. Universal availability primitive; write path is `CRUD_Board`, which edits by **DIFF, never destructive replace** (§2.6 — so a local rule can't silently wipe seeded governing rules).
- **Commitment-kind** — vocabulary (above).
- **Commitment** — instance (atom below).
- **Rule** — id, authority, **owner_org (tenant, §2.5)**, target(board|kind|audience), type, operand(typed → engine/M3), enabled, **effective_from / supersedes (version-of-record, §5.2)**, provenance; optionally in an SOP bundle. Rules edit by diff (as boards).
- **SOP** — optional bundle of kinds + rules; document identity when uploaded/named.
- **Shared** — optional publication (rules/SOP + audience + scope).
- **Order** — composition root; carries **customer(s)** + payment preconditions. Supports **partial cancellation** (dissolve one member, release its slots) distinct from whole-order cancel (§2.4). A **group booking** = one order, N customers, consuming N seats (§2.3). *Open: reconcile `order` / `depends_on` / `parent` into one canonical structure — see `06`.*

## Reconciled Commitment atom (resolves 1.3, 2.2, C7; joins §2↔§13)
```
Commitment {
  id
  title                                   // still the only universal required field

  kind        -> commitment-kind          // domain type; optional for a BARE commitment.
  exception   { reason, by }?             // M2: on a GOVERNED board a commitment must resolve
                                           //   to a kind OR this explicit exception; the silent
                                           //   untyped-but-looks-compliant state is unrepresentable.
  attributes  { … per kind's schema }     // vocabulary values (language, category…)

  // time — fields carry ROLES; temporal type derives from ROLE, not field-count (§3.1 fix):
  start   { value, role: occupies | defer }
  end     { value, role: occupies | deadline | terminal-constraint }
  actual_end                              // actual done/returned — FREE (≥-constraint dropped, §2.1)
  temporal_type = derived from ROLES (event if it has an occupying interval; else task)
                                           //   `role` is contract/engine-classified, never an LLM literal
  completed     = derived (event: actual_end ?? (end passed); task: ticked)   // D4/§2.1

  consumes    [ { board_ref, quantity } ] // capacity/balance draw (D5)
  depends_on  [ commitment_id ]           // instance-level prereq edge (NOT a rule, §3.2); drives `blocked`

  party  { customer?, executor?/board_ref, … }   // D3, principal
  order  -> order_id                              // see Order (partial-cancel, group-class)

  // STATUS = latched acts (stored, attributed) OVER derived conditions (H1):
  confirmed_at { by, at }?               // \
  cancelled_at { by, at }?               //  \  latched DECISIONS — stored + attributed;
  declined_at  { by, at }?               //  /  a set latch WINS over the derivation
  expired_at   { at }?                   // /   (once expired, stays expired — no un-expire, §1.2)
  status = latch?.label ?? derive(unmet_conditions)
           //   derived layer: draft / pending[own preconditions] / blocked[deps] /
           //                   active / completed / review

  preconditions [ { kind: signature|id|payment|…,
                    satisfied_by { principal, at, evidence }? } ]   // §3.5: evidence, not a bare tag
  expires_at                              // hold timer → feeds the expired_at latch

  provenance [ { field, value, author: customer|template|engine|llm,
                 author_utterance?, at } ]   // §3.6: PER-FIELD attribution + timestamp
}
```
**Key resolutions (round 2):** status splits into **latched acts** (`confirmed/cancelled/declined/expired_at` — stored, attributed; a set latch overrides derivation) **over** a **derived** layer (`pending/blocked/active/completed`). So a cancelled-but-otherwise-complete course reports `cancelled`, not `active→completed`; a lapsed hold that later gets a signature stays `expired` — the late input can't un-expire it and double-book the unit (H1; §1.1–1.3, 2.2, 2.4). `actual_end` is **free**, so an early return (the common case) is representable (§2.1). `temporal_type` derives from **role**, not field-count — a `terminal-constraint` end ("boat back by Friday") is not mis-typed as an occupy-nothing task (§3.1). `preconditions[]` carry **evidence** (`satisfied_by`), so the floor's poka-yoke has something real to test (§3.5). `provenance` is **per-field** with author + timestamp (§3.6), so an engine-authored value is distinguishable from an LLM-inferred one. `depends_on[]` is an **instance-level fact, not a rule** (§3.2, previously only in the brief).

*Status: Phase 1 atoms revised per round-two decisions (H1/M1/M2). The Order object (partial-cancel + group-class) is now **closed** — settled by `../engine/SPEC.md §1.8` (*"there is still no third mechanism"*). The engine type-value system (M3) remains open — see `06-round-two-decisions.md`.*
