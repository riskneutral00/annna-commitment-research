# 06 — Round-Two Decisions

> ⚠️ **Historical — this is design *history*, not the build plan.** Preserved so decisions can be traced to their reasoning. Where anything here conflicts with a layer package (`harness/`, `engine/`, `app/`, `model/`), **the layer's `SPEC.md` wins.** Start at the [root README](../README.md).


*Decisions made 2026-08-04 after the second adversarial critique (`CRITIQUE-FINDINGS-2.md`, against `CRITIQUE-BRIEF-2.md`). 48 findings raised, 26 killed, 22 survived. This file is the round-two counterpart to `05`: it records the settled harness decisions and the sort of everything else. Atom edits from these decisions are already folded into `05`. Scope is the **harness only** — loop / tool contract / elicitation / clarify-permission.*

---

## The reframe (Matt) — most "decisions" are the user's, not ours

Most round-two forks are neither mine nor Matt's — they are the **user's**, and the harness's job is to **ask once and store** them (`ask-and-encode`). The harness provides the *mechanism* and an *inviolable floor*; it never picks the policy. This test decides ownership: *"why am I deciding this? shouldn't the user decide?"* — if yes, it is not a harness fork; the agent asks its user and stores the answer.

Corollary: content-licensing, version-propagation, and the type-value system were mis-framed as harness questions in earlier drafts. They are business / app / engine and are parked below.

---

## Settled harness decisions

### H1 — Status = latched acts over derived conditions *(reverses round one's own recommendation)*
Round one said "derive status from the set of unmet conditions." Round two showed that's wrong: `cancelled` / `declined` / `expired` / `confirmed` are **decisions a principal made at a time**, not conditions going unmet — nothing could write them, and a late-landing precondition would silently *un-expire* a lapsed hold and double-book the unit.

**Decision:** store the decisions as **latched, attributed events** — `confirmed_at` / `cancelled_at` / `declined_at` / `expired_at`, each `{by, at}`. Derive `pending` / `blocked` / `active` / `completed` from the unmet-condition set **underneath** the latches. A set latch **wins** over the derivation; once `expired`, stays `expired`. Folded into the `05` atom. Closes §1.1, §1.2, §1.3, §2.2, §2.4.

### M1 — The inviolable floor = the reversibility line
The danger of full autonomy is not that the agent acts, but that it acts **irreversibly on a wrong inference**. Reversible mistakes cost ~0 (undo); irreversible ones are unbounded and land on the three things the user can least afford — **other people, their money, their only records**.

- **Each tool declares whether it crosses the line**: third-party communication / value transfer / destruction of the sole record (acute — D2 makes annnä the only copy).
- An across-the-line act fires **only on an explicit basis**: a live confirmation, OR a stored grant whose action-class + scope actually matches.
- No matching basis → **ask. Never infer a grant. Silence ≠ consent.**
- Every crossing is **attributed** `{who, basis, when}`.
- **Property-based, not an enumerated list** — a never-seen tool is classified by the property, so the irrevocable set need not be foreseen. Reversible work runs at full autonomy. Everything *above* the floor is user-configurable.

This is also thin-agent done right: the LLM cannot *judge* an act safe; the contract already classified it, and the LLM can't talk past the floor. Belongs in `DESIGN.md §14` (Phase 5).

### M2 — Governed-board classify gate (poka-yoke)
On a board carrying governing rules, a commitment must resolve to **either** a declared governed `kind` (its rules are evaluated) **or** an explicit, attributed **exception** (`{reason, by}` — maintenance / off-standard, flagged). The silent untyped-but-looks-compliant state is **unrepresentable**: accidental bypass impossible, deliberate off-standard allowed and recorded *as an exception*, never as compliant. Folded into the `05` atom (`exception` field) and vocabulary section. Closes the harness slice of §5.3.

### M3 — Type-value system → NOT a harness question (deferred to engine)
The value vocabulary (units, ordered sets, ranges, ratios, money) is engine/model design. Harness residue only: the tool contract carries **declared typed values**, correctness-critical ones as **engine handles** (already in *Adopt*). Parked.

---

## User-configured (harness elicits + stores; design the mechanism, not the policy)

The agent surfaces the gap, asks once, stores the answer, applies it thereafter. NOT Matt's to decide:
- **Autonomy envelope / standing-authorization grants** — `{action_class, scope, expiry, revocable}`; sits above the M1 floor.
- **Decline handling** — pause / re-solve one slot / partial-commit; the fate of days 1–2 when day 3 falls through.
- **Empty-board meaning** — "free" vs "unknown," per board.
- **Holds, buffers, cooldowns; cancellation/refund policy; whether money amounts/deposits are needed at all.**

Designing this elicitation mechanism (ask-once → store as grant/rule → surface conflicts → exception path) is the real remaining harness design work (plan Step 2).

---

## Adopt (implied by principles already set)

- **Thin-agent made structural** — correctness-critical values enter only as opaque engine handles, never LLM-authored literals; read-back derived from structure. Closes C12 / round-1 5.1 structurally.
- **Each tool declares a reversibility class** — feeds the M1 floor.
- **`CRUD_Board` / rule edits are diffs, never destructive replaces** — closes §2.6. (Folded into `05` object model.)
- **`notify-and-await-confirmation` carries a catalog-typed form payload** for off-console parties — the renter, not the console user, owes the passport.
- **Elicitation is `ask-once` + `ask-and-encode`.**
- Atom-level adopts (all folded into `05`): drop `actual_end ≥ end`; precondition `satisfied_by` evidence; per-field provenance; version-of-record + tenant stamps.

---

## Parked with labels (NOT harness)

- **Engine:** type-value system (M3); concurrency arbitration of the trigger-driven loop (§5.1); read-produced double-book *enforcement* (§1.2 — harness only owes a representable state, the `expired_at` latch); no-double-book by construction; clash-decidability classes.
- **App / business:** content rights — **open commercial question, parked** (goal: highest fidelity and most-current documentation; licensing or partnership with a standards body is the preferred route and is not gating the harness design); version propagation — **silent adoption** (the app facilitates the current standard; the head brand educates franchisees); warranty / documented-deviation language; management/audit read surface; default-availability UX primitive.
- **Model:** attribute-declaration objects, capacity units, money storage shape (all M3 engine/model work).

---

## Doc hygiene (done in this pass unless noted)

- **Brief-only clause folded in:** "instance-level facts (e.g. 'day 2 depends on day 1') are commitment fields, not rules" — was only in `CRITIQUE-BRIEF-2.md`; now in `05` (§3.2). ✓
- **§3.1 fixed for real:** `temporal_type` now derives from **`role`**, not occupying field-count, so `terminal-constraint` no longer types to a task. `role` is contract/engine-classified, not an LLM literal. ✓
- **Relabel tags:** the round-two-flagged relabels (preconditions, provenance, board-declaration, decline-cascade; and the §4 table — `confirmed`, `cascade`, `ask-once` scope, `shared ⇒ instant`) are addressed either by the atom edits above or explicitly re-opened here; none is left tagged "resolved" by relabel.

---

## Harness inventory — SETTLED: exactly two (no Harness 3)

Named by *which app surface* the agent interaction is grounded in (final names deferred; "board/card" rejected as too Kanban; using 1/2 for now):
- **Harness 1** — the **board / calendar surface**: create a commitment, see it placed.
- **Harness 2** — the **per-commitment support surface** (one page per commitment): author everything that *supports* one commitment — rules, SOP, stakeholder assembly, availability-sharing. Not on the calendar.

**No Harness 3.** The off-app party has **no agent** — the owner's agent (H2) *exports* a plain, board-blind form (generative-UI-as-a-tool); the off-app party fills and returns it **like a pre-AI web form**; the return fires the trigger-driven loop and the *owner's* agent processes it. AI is owner-side only; the guest surface is app/engine. The harness already has every hook for this (generative-UI tool + `notify-and-await-confirmation` + trigger loop) — nothing new to build. M1 governs only the owner's agent acting on the returned data; the guest's own consent is captured by the traditional form. On-app ↔ on-app = two H1s + engine handshake, not a harness.

---

## Use case E — deliberately held out (not walked)

**Decision (Matt):** do NOT walk E. Designing to every probe overfits the atom to probes; a genuinely general harness should absorb a case it never saw. E is kept as a **held-out test** — a real out-of-sample check of generality, run when E (or any real analog) actually shows up.

But the four shapes round two already named are not surprises — they were handed to us — so they are recorded here as **explicit falsification predictions.** The pass/fail when a real analog arrives is: *did the harness absorb it with NO atom change?* Yes → generality proven in production. No → we learn precisely which general primitive was missing (the meta-principle working as designed).

1. **A request that can lose** (bid / waitlist / competing hold) — *predicted absorbable*: the losing request is `declined_at {by: system, reason}`; no new state expected. Confirm on contact.
2. **An ordering over principals** (seniority / priority) — *general primitive, model-level*: an attribute on Principal, same shape as board attributes. Not E-specific — any ranking needs it.
3. **Re-solving an already-`active` commitment** — *genuinely held out*; untested against the latch model.
4. **Admission as type-match, not count** — *genuinely held out*; untested against capacity.

#1 and #2 are general primitives (contention, ranking) E merely exposed; #3 and #4 stay fully held out. Personal-preset (meal/workout/cycle) is likewise a held-out check on the `05:37` "already the model" claim.

*Status: round-two harness forks settled (H1, M1, M2; M3 deferred). E held out. Next: elicitation mechanism (Step 2).*
