# annnä Engine — SPEC (the store and the math of record)

*Source of truth for the engine layer. The engine is **built** (not imported): the persistent store plus the deterministic compute behind the harness's tools. Its contract was pinned before it was designed — every obligation in `../harness/INTERFACES.md §1` lands in a section here — and its acceptance is the **stub-swap** (`BUILD.md` final gate): the real engine replaces the harness's stubs with zero harness changes. Design decisions locked by interview: `../.specs/deep-interview-engine.md` (7 decisions). The location/reshuffle requirements derive from `../user-stories/Situations/Situation-D/` — a falsification probe, generalized here, never a design target.*

*Citation convention, stated because three separate automated checkers have filed it as a bug: **`§6.5` denotes item 5 of §6's numbered list, not a subsection.** The numbered items under `§6` and `§7` are cited this way throughout the corpus; they are deliberately not promoted to `###` headers, because renumbering would ripple through every citing site. A checker that resolves `§N.M` only against markdown headers will report false phantoms here.*

---

## §0. What the engine is

The engine is **the only layer where truth lives**: what is stored, and what deterministically follows from it. Same store state + same query → same answer, always — that determinism is what makes handles trustworthy, scenarios replayable, and the model safely swappable above it.

- **Sole client: the harness.** The engine never talks to the model, a user, or a third party; it never renders and never sends. Anything it cannot answer comes back as *data* (a structured decline, a pending decision) for the harness to route — the engine records questions, it never asks them. One carve, for display only *(founder-ruled 2026-08-06)*: the engine **publishes read-only display projections** — shaped views naming exactly what a screen may see (the guest Shared projection is one; the owner's live board view is another; the FR38 template-bundle projection is a third — a shape-only view of a T2 authoring session's kinds, rules, shared and resource shapes, whose selectable set cannot name a counterparty, booking, history, ledger or personal-data field: §1.7a) — and the app may subscribe to those. A projection is a **contract, not a copy**: whether it is materialized or computed on read is a substrate decision (`BUILD.md` Step 0). Projections accept no writes and answer no questions; every command still enters through the harness. The point is leak-prevention by construction: what a projection omits was never in the readable set, so no access rule has to be right for it to stay unseen.
- **Poka-yoke stance:** the invariants in §10 hold **by construction of the store and the write path**, not by post-hoc validation. Illegal states are unrepresentable or unconstructable, per case.
- **Never outward:** the `destruction` and `value-transfer` reversibility classes have **no entry point** in this layer (no delete operation exists, §1.10; no operation moves value, §1.9).

## §1. The stored object model (the schema of record)

The shapes below restate `../harness/SPEC.md §3` from the engine's side — the harness defined *what exists*; this section is the stored record plus the engine-owned details the harness deliberately left open.

### §1.1 Principal & party
- A principal = identity + attributes + (for bookable ones) a board. Every stored object carries its owning tenant (`owner_org`); nothing leaks across tenants at the store level.
- **A counterparty's own constraints are not a new object class.** "Harold will never move," "Mrs. Ito only Tuesday mornings" are **rules from the menu (§3)** — `pin` and `location-window` — with `target: party`. They store, version, and evaluate like every other rule; what's special is only their force in `resolve` (§7: filtered before candidates exist).

### §1.2 Board
- Fields per harness §3: `id`, `owner`, `owner_org` (§1.1 — every stored object), **`capacity | balance`**, `attributes {…}`, **`empty_means: free | unknown`**, `zone`.
- **Capacity math:** a commitment consumes `quantity` for its occupying interval; the invariant is *max concurrent consumption ≤ capacity at every instant*. Person = 1, pool = N, fleet = N units.
- **Balance math:** cumulative draw-down over a period (the class-pack: 10 dives / 3 months). A board may carry both; they evaluate independently.
- `empty_means: unknown` (the default for proxy boards) **never counts as free** in any availability computation — availability then comes from confirmation, not assumption.
- `zone`: patterns store zone-relative times; instances store absolute instants; all intersection math runs in UTC. **The zone authority, stated once:** a board's `zone` is its owner's declared home zone (asked once, at board creation) — the default for new patterns and for owner-facing display projections; guest pages display in the *board's* zone and say so on the page, so a guest never reads a silently-converted time. DST at pattern edges: §9.

### §1.3 Commitment
The anatomy of `../harness/SPEC.md §3.4`, stored exactly — plus `owner_org` like every stored object (§1.1): `title` (the only universally required field) · `kind` or `exception{reason, by}` (M2: silent-untyped-on-governed is unrepresentable) · `attributes` per kind schema · time fields with **roles** (`start{value, role}`, `end{value, role}`, `actual_end` free — early return is normal) · `temporal_type` and `completed` **derived**, never written · `consumes[{board_ref, quantity}]` · `depends_on[]` · `party` · `order` · `preconditions[]` carrying **evidence** `{principal, at, evidence}` · `expires_at` · per-field `provenance`.

Engine-owned specifics:
- **`place` — one optional attribute type, general.** A declared address plus at most one resolved geo-reference. Any commitment may carry one; nothing else about location is an object. (No GIS: no polygons, no routes stored.)
- **Latches are write-once.** `confirmed_at / cancelled_at / declined_at / expired_at`, each `{by, at}`: the store **rejects any write that clears a set latch**. A set latch wins over the derived status layer.
- **The park is stored, and only a human clears it.** `needs_human {reason, since, trigger_ref, cleared_by{principal, at}?}` (harness §3.4) stores alongside `status`, never replacing it. The store **rejects a `cleared_by` whose author is `engine` or `llm`** — clearing is a human act or it does not happen. Uncleared parks are queryable as a set, because the app must surface them regardless of what the commitment's status derives to.
- **Provenance includes `author: engine`** — computed values (a travel gap, a materialized instance, a resolved geo-ref) are attributed to the engine, distinguishable from customer-, template-, and model-authored values. Needed for override precedence (§5) and replay.

### §1.4 Recurrence — pattern + materialized instances
- **`Pattern { shape, zone-relative time, ends?, horizon_policy }`** stored once; the engine **materializes real Commitment rows** over a rolling horizon. Each instance has its own id, latches, parties, preconditions — cancel one, complete one, move one.
- **The `shape` vocabulary is a closed menu, same law as §3's:** `daily` (= all seven weekdays; the form's weekday unticks narrow it) · `weekly {days: [mon…sun]}` · `monthly-by-date {date: 1–31 | last}` — each with optional `interval: N` (every N days/weeks/months; default 1) and optional `except: [dates]` (excluded instances are never materialized). A shape outside the menu is **unstorable**, exactly like an off-menu rule type (§1.5). `ends?` is `{until: date} | {count: N}`; `horizon_policy` is the materialization look-ahead, **default 8 weeks**, per-pattern overridable.
- An instance records its generating pattern and generation version. **A pattern edit is forward-only:** instances **carrying state** — any latch, any attached party, any satisfied-precondition evidence — are never touched; bare materialized drafts are regenerated under the new shape.
- Horizon extension is an **internal clock-triggered job** in the engine's write path: deterministic, idempotent, invisible to the harness.
- A request beyond the current horizon **materializes on demand, bounded to the requested window** (a request names its window, so materialization is always finite). See §9.

### §1.5 Rule
- Fields per harness §3.5: `id` · `authority: governing | org | individual` · `owner_org` · `target: board | commitment-kind | audience | party` · `type` · typed `operand` (§2) · `enabled` · `effective_from / supersedes` · provenance.
- **`type` must come from the closed menu (§3). An off-menu type is *unstorable*** — "I can't enforce that yet" is a storage fact, not agent politeness.
- **Binding time, per type:** terms a commitment was made under **bind at booking** and never re-evaluate against later edits (`pricing`, `duration`, the booked shape). Placement-safety rules (`buffer`, `capacity`, `quota`, `hold`, windows) **re-evaluate on any placement change**. Each menu entry states its binding in §3.
- Governing-authority rules cannot be removed or disabled by a lower-authority diff (§6.3).

### §1.6 Grant
- `{ action_class, scope, expiry, revocable }` — the harness §7 shape, stored exactly, attributed. The engine **stores and matches** — it answers "does a covering, unexpired, unrevoked grant exist for this act?" as a pure lookup. The *decision to act* is the harness floor's, never the engine's.
- Revocation is a latched act (stored, attributed, forward-only), not a delete. `revocable` states whether that path exists for this grant — elicited harness-side; the store only honors it.

### §1.7 Shared
- A published projection: `{ content_ref, audience, scope, per-recipient token digests }` (plaintext tokens are never stored — `../security/SPEC.md §3`). A token attributes exactly one return (`on_form_return` carries it).
- **The board-blind projection is an engine guarantee:** a Shared's answer set is computed availability only. No blocking commitment, no reason, no third party's name or address can appear in it — enforced by what the projection query is *able* to select, not by filtering afterward.
- **In the grant vocabulary (§7.1, the normative home): a Shared *is* the `availability`-rung grant rendered, and a per-recipient token is that grant held anonymously by its bearer.** Wider visibility is a higher rung the owner grants — never a different mechanism.

### §1.7a Template-bundle projection (FR38 save-as-bundle)
- A read-only **shape projection** of a T2 authoring session: it emits a `../marketplace/SPEC.md §1.2` bundle document from the session's authored **kinds, rule shapes, shared shapes and resource shapes**, with operands **blanked or marked publisher's-choice**.
- **The §1.2 hard fence is enforced by construction of this projection's selectable set** — exactly as the §1.7 guest Shared projection is board-blind by what it is *able* to select. The projection **cannot name** a counterparty, booking, history, ledger, or personal-data field: those fields are not in the readable set, so no filter has to be right for them to stay out. This is the authoring twin of `../marketplace/SCENARIOS.md F3` ("the fields do not exist").
- **Reads the session's stored structure as it stands, `draft` rules included** *(joint-review ruling 2026-08-07)*: an in-progress save is legal. A draft rule's *shape* is as real as a final one, and operands are blanked either way; nothing ships without the marketplace's admin-only publish review regardless.
- **Determinism:** the same session projects an **identical bundle** every time (the §1.7/L2 replay guarantee applied to bundles).
- **Invoked as an internal read.** The harness calls it `calculate`-class (`../harness/INTERFACES.md §1.1`); it declares reversibility class `internal`, never outward. **It never publishes** — publish is the marketplace's admin-only call (`../marketplace/SPEC.md §2`), so no new outward seam verb is added and the zero-new-seam-verb law (`../harness/SCENARIOS.md I2`) holds.
- **Residual the fence does not catch (founder-noted 2026-08-07):** a field's *name* is part of the shape the user authors. A field named after the data it holds ("John's medication list") is not caught by any mechanical fence. Mitigation: publishing is admin-only, so every bundle passes founder review before shipping — **field names are a publisher-review item**, valid exactly as long as the admin-only supply law (`../marketplace/SPEC.md §2`) stands.

### §1.8 Order
- Composition root per harness §3.7: `customers[]`, `payment_preconditions`, `members[commitment_id]`.
- Whole-order cancel dissolves all members and releases their capacity **in one transaction**; partial cancel dissolves one member the same way, leaving the rest untouched.
- **Canonical structure (settles the parked question):** `order` = ownership/cancellation grouping; `depends_on` = the scheduling edge. There is **no third mechanism** — decomposition children group under an order and sequence by `depends_on`.

### §1.9 Money marks
- Money is a typed value (§2); `priced / owed / paid / held / settled` are **latched marks** `{by, at}`. **`owed` is derived** from commitment state, never an independently mutable number — cancel the visit and the record corrects itself (the $140 never owed).
- **`held` is the fifth mark** (founder-ruled 2026-08-07, D-B), and it was missing here while three files above this one in authority already carried it — `../harness/SPEC.md §3.8`, `../user-stories/README.md`, `../security/SPEC.md §2`. This line conforms to them; it is not a new decision. **What is still unspecified, deliberately not invented here:** what sets and clears the mark. The obvious pairing is the hold vocabulary (`../security/SPEC.md §3`: hold creation, hold expiry), but no file states it, so no file should be read as if it did — the mark exists, its trigger is an open question for whoever specifies deposits.
- **`no-show` is always a human mark (founder-ruled 2026-08-07, #5).** The system may surface the fact — scheduled start passed, no check-in — but never declares a no-show itself; the owner marks it, attributed `{by, at}`. What a no-show then costs is the commitment's **no-show policy**, a creator-set field (nothing / deposit forfeit / full rate / custom) that, being money terms, **binds at booking** under §1.5 — edits govern forward only. The ledger records what the bound policy says is owed; collecting it stays outside (money tracked, never moved).
- **No operation in this layer moves value.** The `value-transfer` class isn't forbidden here — it is *unconstructable*: no such entry point exists.

### §1.10 History & diffs
- **Append-only:** every write is a diff with attribution and timestamp. **No hard-delete operation exists in the engine's API.** Cancellation, revocation, expiry are latches; the record survives. (Reconciled with lawful erasure at `../security/SPEC.md §4`: sensitive artifacts never enter this store, and engine-resident contact PII crypto-shreds — the ciphertext history stays, the key doesn't.)
- Point-in-time reads (v1-minimal): a per-object version chain sufficient to answer "the terms this commitment was made under" and to let check-work re-read what was stored.

### §1.11 Proposal (new object — the reshuffle deliverable)
```
Proposal {
  id, trigger,                       // the event that opened the day (a cancellation, an insertion)
  direction: toward-start | toward-end,
  moves: [{ commitment, from, to, moved_party, confirmation: pending|confirmed|declined }],
  untouched: [{ commitment, reason }],   // e.g. "pin rule", "party window", "governing rule"
  freed: [{ window, decision: pending | keep-blocked | reopen }],
  computed_at: store_version, expires
}
```
- A Proposal is **stored, first-class** — it must survive the round-trip (owner approves → moved parties confirm) and be re-checkable when applied.
- **It never applies itself.** Applying is a `commit` variant (§6.5) that re-validates everything as of *now* and requires each move's stored confirmation. A declined move changes nothing.
- **`freed` windows fail closed:** not bookable until the owner's keep-vs-reopen answer is stored. The engine records the pending decision (the harness's elicitation reads and routes it); reclaimed time cannot be booked out from under the owner by default.

### §1.12 Kind template — the multi-day shape (F7, resolved 2026-08-06 — **Claude-drafted mechanism; per FR37 no founder ruling is owed**: the course content is user-built, and the proof is the founder building real courses as a user — `../archive/08-founder-rulings-2026-08-06.md` §Provenance)

*The open item at `../marketplace/NOTES.md` (F7): "the saved course fills the whole assembly at once" was not representable — `dependency` carries only a board-ref list, and the archive's `composition` mechanism was dropped without a recorded resolution. This is the resolution.*

**The ruling, in one line: the shape is authoring-time vocabulary, and it expands into `order` + `depends_on`. There is still no third mechanism.**

That sentence is the whole design, and §1.8's canonical structure is the reason for it. A saved course is **not** a new way to compose commitments at runtime — it is a **template that writes the composition you would otherwise have authored by hand.** Adding a live composition object would have been the third mechanism §1.8 rules out.

```
KindTemplate {
  id, kind, owner_org,
  sessions: [ {
      label,                              // "Day 1 — pool"
      offset: { days, at? },              // relative to the assembly's anchor day
      duration,
      consumes: [{ board_ref | board_role, quantity }],
      requires: [ session_label ]         // becomes depends_on at expansion
  } ],
  anchor_policy : first-session | named-date
}
```

- **Offsets are relative, never absolute.** A four-day course is `+0, +1, +2, +3` from its anchor. The same template books in March and in November without editing.
- **`board_role` resolves at expansion.** A template says *"a boat"* and *"an instructor,"* not *which* boat — the role binds to a concrete board when the course is placed, which is what lets one template serve a shop whose fleet changes.
- **Expansion is a pure authoring act.** Instantiating a template produces N ordinary Commitments under **one Order** (§1.8), sequenced by `depends_on` per `requires`. After expansion **nothing distinguishes a template-authored course from a hand-authored one** — same objects, same rules, same cancellation semantics, same partial-cancel behaviour. `provenance` records `author: template` (§1.3), and that is the only trace.
- **A template stores no times and no availability.** It cannot: placement is `resolve`'s job (§7's multi-day decomposition), run per day at expansion. A template that carried times would be a second scheduler.
- **Editing a template is forward-only.** Already-expanded courses are untouched — the same law as a recurrence pattern edit (§1.4). A customer's booked course does not change because the shop rewrote its curriculum.
- **A template is not a Recurrence.** A pattern repeats *one* commitment on a cadence; a template lays out *several different* sessions once. They share nothing but a sense of "shape," and conflating them was part of why this item stayed open.
- **Partial placement is expected, not exceptional.** If day 3 has no boat, §7's decomposition returns three placements and one structured decline; the Order carries what placed. The template does not require all-or-nothing — the owner does, or doesn't (§7).

### §1.13 Escalation & on-call — stored, not held in harness memory (engine half; gated by B4)

*The `OnCall` and `Escalation` object **shapes** are the harness's — `../harness/SPEC.md §3.9` is their normative home. This section is only the engine's **storage** of them, because an `Escalation` must survive between the trigger that raises it and the `total_timeout` that parks it (different clock firings), and context is assembled from stored structure, never accumulated conversation (`../harness/SPEC.md §8`). It cannot live in harness memory; the engine holds it like every other stored object.*

- **`OnCall`** — board-owner-scoped configuration (`ranked[]`, `step_timeout`, `total_timeout`, per-rung channels/quiet-hours), stored addressably like any owner setup answer (elicited harness-side, §6 ask-once). An owner with no list is the ordinary single-operator case, stored as an empty ladder — not an error.
- **`Escalation`** — first-class stored object: `commitment`, `reason`, `raised_at`, `ladder_state {rung, notified_at}`, `status: open | answered | timed_out_parked`, `answered_by -> principal?`. **`answered_by` is a reference to a principal, not an inline compound** — the `{who, basis, when}` triple lives on the **resulting act**, which is where the harness defines it (`../harness/SPEC.md §7`, the single normative home; §0 above says this section restates the harness and does not redefine it). Storing the triple here would have been a second, divergent home for an attribution the floor already stamps. The harness's ladder walk advances `ladder_state`; the engine **persists each advance**, so a replay reads the same ladder state (determinism, §0).
- **Terminal status is write-once.** `answered` and `timed_out_parked` latch under §1.3's latch discipline — the store **rejects a write that reverts a set terminal status**, so an escalation cannot be silently reopened. `timed_out_parked` co-occurs with the commitment's `needs_human` park (§1.3), which only a human clears — the loop can never un-park itself.
- **Reached through the existing verbs — no new seam verb.** The harness writes the object, advances the ladder, and latches the terminal status through `commit`; it reads open escalations and the on-call list through `calculate`. There is **no escalation-specific engine entry point** — the same guard the cross-owner share obeys (`../harness/SCENARIOS.md I2`; `../harness/INTERFACES.md §4`). *Notification itself is never authority* — the engine stores who was notified when; a basis is created only by the human's answer, captured the ordinary way (harness §7).

### §1.14 PendingDecision — the question the engine records and never asks

*§0's law says anything the engine cannot answer comes back as data — "a structured decline, a pending decision" — for the harness to route. The structured decline has an object. The pending decision did not, and an instruction with no object is not implementable (`../harness/SPEC.md §3.9`, verbatim precedent). This is that object, built as the **general primitive** rather than the `min-occupancy` case, because §0's law is general.*

```
PendingDecision {
  id, commitment,
  raised_by,                          // the rule type or trigger that raised it (e.g. `min-occupancy`)
  choices: [ … ],                     // CLOSED set, ENGINE-NAMED — the whole menu, no free text
  chosen { by, at }?                  // absent until a human answers; never written by the engine
}
```

- **Written only by the engine, chosen only by a human.** The engine names the choices because only it knows which are legal; it never picks one, and there is no default. `chosen.by` has no `engine` or `llm` member — the same shape that makes a park unclearable by the loop (§1.3).
- **It co-occurs with the `needs_human` park** (§1.3) and is **cleared only by a stored human choice**. The stored choice is what clears the park; no retry, timeout, or later firing absorbs it.
- **The harness routes it; the engine does not surface it.** Reading it is an ordinary `calculate` read — **no new seam verb** (§0 sole-client, `../harness/INTERFACES.md §1`). Whether acting on the chosen option crosses the customer-facing line is the harness floor's question, never the engine's (`../harness/SPEC.md §7`).
- **`Proposal.freed[].decision` (§1.11) is the pre-existing instance of this shape and stays where it is.** It is a `pending | keep-blocked | reopen` field inside a stored Proposal, gated by a passing pinned scenario (X5), and this section does **not** refactor it. Two instances of one shape is a known, deliberate near-duplicate; unifying them would be a separate scoped change, not a side effect of giving the primitive a name.

## §2. The type-value system (M3)

The closed value vocabulary — the only shapes a rule operand or correctness-critical field may hold:

| Type | Example | `compare` operators |
|---|---|---|
| unit-bearing number | 45 minutes, 3 seats | `< ≤ = ≥ >` (unit-checked; mismatched units are a type error) |
| ordered set | Divemaster < Instructor | `< ≤ = ≥ >` over the declared order |
| range / comparator | 30–120 min | membership, `⊆` |
| board-ref list | [pool-A, pool-B] | membership, ranked order |
| relation between quantities | students ≤ instructors × 4 | evaluate → bool |
| money `{amount, currency}` | $140 USD | `< = >` same-currency only |
| rate over recurring window | 10 h / month / customer | draw + window arithmetic (quota math) |
| recurring time-window set | Tue 09:00–12:00 weekly | membership of an instant/interval |
| **place** | declared address + ≤1 resolved geo-ref | equality; input to `travel()` (§5) |
| **computed duration (travel)** | drive(place-A, place-B, at) | `< ≤ = ≥ >`; produced only by the engine (§5), never authored |

- `typed_value(raw, type_spec) → TypedValue | error` is the sole entry: raw strings become typed values here or nowhere. `compare(a, op, b)` is total over the table above and undefined elsewhere.
- **The stored struct — one shape for every row above:** `TypedValue { type_tag, value, unit?, currency?, order_ref?, zone? }`. `type_tag` names the table row; `value` carries the row's payload (number · ordered-set member · range pair · board-ref list · relation expression · amount · rate `{quantity, window, per}` · window set · declared address + geo-ref); `unit`/`currency` accompany the rows that need them; `order_ref` points at the declared ordered set; `zone` rides recurring-window values. Two builders reading this table must produce identical encodings — that is the struct's whole job.
- **Typed values are the only operands evaluation accepts.** A raw literal cannot reach rule math — thin-agent enforced at the type layer, not by review.

## §3. The rule-type menu (closed)

**The menu is closed.** A rule type exists only if this section gives it an operand shape, target, evaluation point, exact math, and violation result. Off-menu requests are unstorable (§1.5) and surface as design requests — never as a runtime path. *(Anti-creep rule, printed here on purpose: no exact math + evaluation point → no menu entry.)*

**The one known off-menu request is now on the menu (F20, resolved 2026-08-06 — *Claude-drafted mechanism; per FR37 no founder ruling is owed*, the proof is a user wiring a real boat; `../archive/08-founder-rulings-2026-08-06.md` §Provenance):** a boat's **minimum passenger count to run** (`../user-stories/Situations/Situation-C/resource-boat.md`) is the `min-occupancy` entry below. *Why it sat off-menu so long is worth printing, because it is the entry's whole design:* every other rule type refuses a write at intake, placement, or commit. `min-occupancy` **cannot** — at the moment of the first booking the count is always below the minimum, so a commit-time gate would make the boat unbookable. It is the menu's only rule that **evaluates at a clock time** and whose violation is **an owner decision, not a refusal**. That is a different shape, which is exactly why improvising it during a build would have been wrong.

| Type | Operand (M3) | Targets | Evaluated at | Math / violation |
|---|---|---|---|---|
| `buffer` | constant duration, **or** computed travel | board, kind, party | placement (calculate, resolve, commit) | gap between adjacent placements ≥ operand; the computed form is `travel(a.place, b.place, at)` per §5 precedence — **one type, two operand forms** (harness `Rule{type: buffer, operand: 5min}` stores unchanged; the travel-gap is its computed case). Violation: placement infeasible → not offered / `{conflict}` |
| `capacity` | unit number | board | commit | concurrent consumption ≤ N at every instant (the no-double-book check). Violation: loser of the race gets `{conflict, reason, alternatives}` |
| `balance` | number over period | board | commit | cumulative draw ≤ pack within period. Violation: draw refused |
| `quota` | rate over recurring window + scope (owner / per-customer / per-link) | kind, audience | commit + calculate | window draw + this booking ≤ rate. Violation: slot not offered; commit refuses (the 11th hour) |
| `location-window` | (attribute value, recurring window) | board, kind, party | availability projection + placement | "attribute = V only during W" — **site-days generalized** (Eastside only Mon/Wed); plain bookable-hours is the degenerate case with no attribute. Violation: excluded from projection |
| `attribute-domain` | typed domain (set / range / geo-radius membership) | kind, audience | intake / commit | attribute value must fall in the declared domain — **service-area generalized**. Violation: the honest no at submit |
| `pricing` | money (+ optional per-unit rate) | kind, audience | **binds at booking**; marked at settle | booked commitments keep their price forever; edits govern forward only |
| `duration` | range | kind | intake / commit | booked length ∈ [min, max]. Violation: sub-minimum grab unconstructable at the picker |
| `hold` | duration (response window) | kind | commit + clock trigger | sets `expires_at`; lapse fires the trigger loop and the `expired_at` latch (§6.2). Governs pull/rental holds only — an offer's expiry is the commitment's own creator-set `hold` field (§7.1), never this rule |
| `precondition` | precondition-kind list | kind | status derivation | unmet → commitment `pending`; evidence recorded on satisfaction; a precondition kind may require a **recorded human conversation** — its violation **parks as an attributed human decision**, never satisfied by document collection alone (founder-ruled 2026-08-07, #9; wiring a domain flag to it — e.g. a dive-medical flag — is template configuration, not platform law) |
| `admission` / `qualification` | comparator over attributes | board / kind | commit (intake) | occupant/executor attributes satisfy the predicate; else refused with the failing comparison |
| `dependency` / `fallback` | board-ref list / ranked list | kind | resolve | required composition; ranked substitute chain on decline/lapse. **A `pin` is not a decline** — a pinned entry is excluded before candidate generation (below), so the chain never encounters it and simply generates from the alternatives that remain. Stated rather than inferred, because §8's clash test for this pair depends on it |
| **`pin`** | boolean lock | party, commitment | **resolve only** | placements involving the pinned party are **excluded before candidate generation** — never proposed, never surfaced as a declinable option |
| **`min-occupancy`** | (unit number `min`, lead duration `decide_by`) | board, kind | **clock trigger** at `start − decide_by` (never at intake or commit) | confirmed concurrent draw at the trigger instant ≥ `min`. **Violation is not a refusal:** on a shortfall the engine **writes the `needs_human` park (§1.3) and a `PendingDecision` (§1.14)** naming the open choices (run under minimum / cancel / extend the window) — and nothing more. The engine owns neither the notification nor the loop: the **harness's trigger loop** reads the park and routes the owner's decision (`../harness/SPEC.md §7`), because cancelling real people's bookings is an across-the-line act. The engine never auto-cancels a run, and never blocks a booking for being early |

**Precedence:** `governing > org > individual`; among same-level rules on one placement, **most restrictive wins**. Governing rules are non-overridable (recorded exception is the only forward path); own-rule conflicts take the override-with-reason path (§8) — **except unsatisfiable pairs, which no authority overrides** (§8 item 4).

**Clash tests (what `check_consistency` §8 evaluates).** Rules clash only where their math meets — overlapping targets and a shared evaluated quantity. Most clashes are pairwise, but the check is **not strictly pairwise**: the `duration + buffer × location-window` row below is a **three-rule joint** unsatisfiability where each pair alone passes, so the test ranges over the **bounded N-ary** set of rules sharing one quantity, not over pairs only. The closed menu keeps that set finite and this table exhaustive: same-type pairs never clash (same-level precedence resolves to most-restrictive, above), and a cross-type combination not listed shares no evaluated quantity — structurally clash-free, its checks compose. §8 routes each hit to its class: rows marked ***unsatisfiable*** are **refused at write whatever the authority** (no override can make them satisfiable — §8 item 4); the three rows marked *latent* always classify latent; everything else routes by authority level (governing conflict / own-rule conflict).

**Read each row's test, not its label.** Of the seven unsatisfiable rows, **five are unconditional** and **two fire only under a stated condition** — `capacity × dependency` (*only at the minimum*) and `dependency × pin` (*only when nothing can be generated*). Treating those two as unconditional is not a small error: it refuses rulesets that work, which is the failure this class was never meant to cause. Both were in fact mislabelled once and corrected. The label names the *class*; the sentence after the colon is the *test*, and the test governs.

| Pair (overlapping targets) | Clash when (the exact test) |
|---|---|
| `duration` × `quota` | ***unsatisfiable:*** shortest legal booking overdraws the window: `duration.min > quota.rate.quantity` |
| `duration` × `location-window` | ***unsatisfiable:*** nothing fits: `duration.min >` the longest contiguous allowed window |
| `duration` + `buffer` × `location-window` | ***unsatisfiable:*** `duration.min + 2 × buffer >` the longest allowed window — jointly unsatisfiable even though each pair alone passes |
| `buffer` × `location-window` | *latent:* buffer exceeds every gap between allowed windows — one placement per window is all that's possible; alert, don't block |
| `capacity` × `dependency` | ***unsatisfiable* only at the minimum:** the composition's draw for a **single instance of the kind** already exceeds capacity N — the smallest possible booking cannot fit, so none can. **If the draw merely exceeds N for *larger* bookings, this is not a rule clash at all** — it is an ordinary capacity refusal at commit (A1), and the pair stays storable. (Draw scales with booking size: `consumes[{board_ref, quantity}]`, and a group booking of N customers draws N seats.) |
| `dependency` × `pin` | ***unsatisfiable* only when nothing can be generated** — and the two readings of this type differ, so both tests are printed. **Required composition:** any named board whose party is pinned is fatal, because a required member that can never be proposed can never resolve. **Ranked `fallback` chain:** unsatisfiable only when **every** ranked alternative is pinned; a pinned *top* choice with any unpinned alternative below it **resolves normally and is not a clash at all** — the chain generates from what remains. A pin is not a decline: the pinned entry is excluded *before* candidate generation (§3 `pin`), so the chain never encounters it and has nothing to advance past. Refusing that pair at write would make a fallback unstorable in the one situation it exists for — a first-choice instructor on leave |
| `admission`/`attribute-domain` × `attribute-domain` | ***unsatisfiable:*** joint predicate is empty over the declared domain (closed comparators over typed domains keep this decidable) |
| `quota` × `balance` | *latent:* per-window rate × windows in the balance period exceeds the pack — the quota offers what the balance will refuse late |
| `min-occupancy` × `capacity` | ***unsatisfiable:*** the run can never legally sail: `min-occupancy.min > capacity.N` on the same board |
| `min-occupancy` × `quota` | *latent:* the per-window rate cannot admit `min` bookings before the trigger — the boat is offered on terms that can never reach its own minimum |

(`pricing` and `hold` share an evaluated quantity with nothing — binding-time and clock semantics respectively — and appear in no pair. `min-occupancy` shares occupancy with `capacity` and admission rate with `quota`, and nothing else.)

## §4. Handles

- A `Handle` = an engine-minted opaque reference `{ id, query, computed_at: store_version, expires }` to a value the engine computed and validated. Handles are random, resolvable only inside the engine: the model cannot construct one that resolves, and **a literal appearing in a handle-typed position is a type error** — the structural half of thin-agent.
- **Display facet:** a handle carries an engine-rendered, display-only projection (e.g. `"Tom 2:30 → 10:30"`) so the harness can narrate it. Re-entering displayed values as write literals is rejected by the same type rule — read-back can never become authoring.
- **Staleness:** a handle is bound to the store version it was computed against. `commit` re-validates on redemption (§6.4): it either revalidates cleanly or returns `{conflict}` — stale math never applies silently.

## §5. `calculate` — read-only compute

`calculate(query) → Handle`. The query taxonomy is **closed**:

1. **Availability** of board(s) over a window — including the **Shared projection variant** (what a link shows: §1.7 guarantees apply).
2. **Gap** between placements — constant and travel forms (below).
3. **Candidate solution** reconciling N boards (read-only entry to §7's math).
4. **Quota / balance draw** check.
5. **Predicate evaluation** over attributes (admission/qualification comparators).
6. **Marks aggregate** — one closed reporting query over money marks ("what did the week make"). It does not grow options; anything richer is an app read surface.

**The travel seam.** `travel(place-A, place-B, at) → computed duration` is answered by an **external source (maps provider) behind the engine's own interface** — the harness never fetches or carries a travel number. Results are cached as stored facts with `author: engine` provenance, so replays are deterministic and scenarios run against a scripted provider (`INTERFACES.md §2`).

**Override precedence, exact:** user-declared travel rule (scoped to a route / time-of-day) **>** cached computed fact **>** fresh external fetch **>** **fail-closed**. If no value is obtainable, the gap is *unknown* — and **unknown ≠ feasible**: the slot is not offered, the move is not proposed. (Same posture as `empty_means: unknown`, §1.2.)

**The travel envelope (bounded, so the seam cannot become the product's latency).** An external call sits inside the hot path of every placement, so its cost is capped by law, not by hope:

- **Ceiling per `resolve`:** a placement call makes **at most 8 fresh external travel fetches**. Beyond that the remaining unknown legs are *unknown*, and unknown fails closed (above) — the search declines rather than stalls. The number is a named constant in one place, tuned at BUILD.
- **Batching.** Legs are resolved **per candidate day, in one batched request**, not per candidate instant — the §7 lattice generates many candidates over the same small set of place-pairs. Distinct `(place_a, place_b, time-bucket)` triples in a call are deduplicated before any fetch.
- **Cache policy.** A computed fact is keyed `(place_a, place_b, departure-bucket)` and stored with `author: engine` provenance. **Buckets are 30 minutes** and facts carry a **30-day TTL**; a cache hit is preferred over a fetch, always (the precedence above). Cached facts are ordinary stored facts — replays and scenarios are deterministic against them.
- **Timeout:** **2 seconds** per batched request, one retry, then the legs are unknown. No placement waits on a slow provider.
- **"No times" and "can't compute" are different answers, and the decline says which.** A structured decline carries either `no-feasible-placement` (the math ran; nothing fits — the honest "your day is full") or `travel-unknown` (the math could not run; the provider failed or the ceiling was hit). The harness narrates them differently, because the user's next move differs: one is *change something*, the other is *try again*. Collapsing them into one message is a defect (§9).

`calculate` never produces an outward effect and writes nothing except the compute cache.

## §6. `commit` — write semantics

`commit(commitment | diff | proposal_ref) → {ok, …} | {conflict, reason, alternatives?}`

1. **Atomicity & the race.** Every commit-time check — capacity, balance, quota, buffer gaps (constant or travel-computed) against both neighbors, latches, preconditions, governing rules — evaluates inside **one atomic transaction**. Two commits racing for the same capacity: at most one succeeds; the loser gets `{conflict, reason, alternatives}` (the honest "that time was just taken," with what's still open).
2. **The latch invariant.** A write that would clear a set latch is rejected. Late precondition evidence against `expired_at` is **recorded** (evidence is never thrown away) but the status never flips — no un-expire, ever.
3. **Diff-only application.** Board and rule writes arrive as diffs and apply non-destructively. A diff whose effect would remove or disable a governing-authority rule from a lower authority **does not apply** — the wipe is unconstructable, not audited-after.
4. **Handle redemption.** Correctness-critical fields must arrive as handles or typed values; the engine resolves and **re-validates them at commit time** against the current store version.
5. **Apply-proposal** is a commit variant: takes a Proposal handle, requires every move's stored `confirmed`, re-runs every check as of *now* (the board may have moved since §7 computed it), and applies all moves in one transaction — or returns `{conflict}` and the proposal goes stale. Freed-window decisions are stored the same way.

## §7. `resolve` — placement

`resolve(goal, boards, rules) → Handle` *(a placement, a proposal, or a structured decline — same seam signature as `../harness/INTERFACES.md §1.5`).*

**Place-only core (fully designed):** find a placement of `goal` into genuinely free, rule-satisfying space across every board it touches. Output: a placement handle, or a **structured decline** — "nothing fits" is a first-class answer carrying which constraint class refused (never a silent failure, never a forced fit).

**Reshuffle-as-proposal** (the Situation-D revisit, in scope now): when the goal is *compaction* — a trigger opened a window and the owner wants the day pulled tighter — `resolve` additionally takes the trigger and a **`direction` (toward-start | toward-end), supplied per event by the harness**. It is never a stored default: the owner's pick governs that event only. Output: a **Proposal object** (§1.11), never an applied change.

**Constraint classes the search honors, in order:**
- (a) **governing rules** — hard bounds on the space;
- (b) **party-owned absolutes** (`pin`, party-targeted `location-window`) — **filtered before candidate generation**: an excluded move never exists to be declined;
- (c) **buffer gaps (including computed travel)** across every adjacent pair in the candidate day, including the first leg from the owner's start place;
- (d) **latches and preconditions** of any instance touched;
- (e) **bound terms** — a move never re-prices or re-shapes what was booked (§1.5 binding).

**Candidate generation, printed (what makes the search deterministic and finite):** candidates are start instants on a **5-minute lattice** (a named constant, one place) inside the goal's rule-allowed windows — classes (a)/(b) shape the windows *before* generation, so an excluded candidate never exists to be tested. Candidates are tried **earliest-first** in the goal's zone (compaction goals: in the supplied `direction` instead); the first satisfying (c)–(e) wins — feasibility, not optimality, per the printed bound below. Termination is structural: finite windows × finite lattice, each candidate tested once; exhaustion **is** the structured decline, carrying the tightest refusing constraint class.

**The v1 bound, printed — it bounds the *reshuffle* search:** single board-owner, single day, **at most 3 moves per proposal**. *(It is a bound on rearranging existing commitments. It is not a claim that `resolve` only ever sees one owner's boards — a §7.1 share offer reads a second owner's **exposed availability** and moves nothing, so it is outside this bound by construction, not by exception.)* The promise is *feasibility and improvement in the chosen direction* — not optimality. (Week-level batching and multi-owner reshuffles are §11 non-goals; this bound is what keeps `resolve` a checker, not a routing optimizer.)

**Multi-day placement — decomposition, printed.** The v1 bound is *per call*, not per booking. A multi-day goal (Situation C's four-day course, `../README.md`) is **N single-day `resolve` calls chained by the caller** — the harness — never one multi-day search. The engine exposes no multi-day solver and never will at v1; the bound above is what keeps `resolve` a checker.

- **Composition root.** The days are held together by an **Order** (§1.8) — the object that already exists for exactly this. `resolve` returns one handle per day; the Order carries the set.
- **Partial success is a real outcome, not a failure.** A decline on day N **does not invalidate days 1…N−1.** Their handles stay valid and independently committable. There is no rollback of earlier days, because nothing was written — placement handles are `calculate`-class reads until `commit`.
- **The proposal reports which days placed.** The caller receives, per day, either a placement handle or a structured decline carrying its refusing constraint class (§7 above). *"Three of four days fit; Thursday has no boat"* is a first-class answer the harness can narrate and elicit against — never a silent partial, never a forced fit on the fourth day.
- **All-or-nothing is the caller's choice, expressed as an Order commit.** If the owner wants the course booked only whole, the harness commits the day set as one Order in **one transaction** (§6.1) — all days or none. If the owner will take a partial course, the days commit individually. The engine supplies both; it does not decide which the domain wants.
- **Where the kind-level shape lives:** how a saved course is *stored* — "the saved course fills the whole assembly at once" — is **§1.12** (`KindTemplate`, F7's resolution). This section defines how days are **placed and committed**; §1.12 defines how the template is **stored and expanded**. Two questions, two homes, deliberately.

**Contention:** simultaneous triggers are arbitrated in deterministic order (arrival, then stable id tiebreak); re-solve rounds are bounded; a goal that survives no round parks as a structured decline for the harness loop. No interleaving may violate §10.

### §7.1 The share seam — one commitment across owners

*The mechanism cited by `../harness/SPEC.md §2`, `../harness/SCENARIOS.md` I1, `../harness/BUILD.md` Step 5, and `../security/SPEC.md §9` (the sole class of legal crossing at v1). Defined here, once. The permission vocabulary below is also the normative home the grant system cites.*

> **Provenance: founder-ruled 2026-08-07** (wayfinder tickets #2 and #12; registry `../archive/08-founder-rulings-2026-08-06.md` §2026-08-07). This section replaces the earlier drafted-not-ruled bind-handshake proposal, which specified paired commitments reconciled by an atomic pair-write. The founder redrew it: there are no pairs.

**What it is, in one line:** there is always exactly **one commitment** — whoever creates it owns it (ownership does not transfer), and it reaches other people's boards and eyes only through **Grants** the mechanics below mint. Not a message, not a request queue, not a mirrored record.

**The ShareGrant — the permission vocabulary (one home, cited everywhere).** It is a distinct shape from the §1.6 authorization `Grant` `{action_class, scope, expiry, revocable}` — a `ShareGrant` is `{holder, rung, scope, edit_mode}` and governs *who may see or edit one shared commitment or board*, never *which action class the floor permits*. The two shared the bare name `Grant` and are separated here so a reader never conflates them.

- **Three rungs:** `availability` (see free times — the default exposure, and all a stranger ever sees) · `details` (see what was shared) · `edit`. There is no manage-sharing rung: ownership is non-transferable, so only the owner widens or revokes.
- **Scope:** a grant attaches to **one commitment or one board**, and is held by a **person** — or by a **link token**, which is the same grant held anonymously by its bearer (the §1.7 Shared projection *is* the `availability` grant rendered; a per-recipient token is its bearer form). Grants to groups are not in the menu.
- **Edit semantics:** an `edit` grant carries the owner's per-grant choice — apply directly or apply with the owner's approval — defaulted to direct. Either way the edit walks every §6.1 check; a grant widens who may *ask*, never what the rules *allow*.

**It is NOT the §11 reshuffle handshake.** This seam **places a new commitment into already-published free space**; it never moves, re-times, or re-shapes a commitment that already exists on either board. The banned thing at §11 is a *multi-owner reshuffle* — an optimizer that rearranges two people's existing days to make room. That stays banned, and the §7 v1 bound (single owner, single day, ≤3 moves) is unchanged: **reshuffle is single-owner; a share offer is two-owner; they are different operations.** A reader who conflates them re-derives a conflict that is not there.

**No new read power — the grant is the whole window.** The initiator never queries the counterparty's board. It sees exactly what the counterparty exposes: the `availability` grant (§1.7's Shared projection), with §1.7's leak guarantees intact. *Reachability is not readability.* Richer visibility between trusting parties is the counterparty granting a higher rung — the seam itself never reads more.

**The offer is the commitment itself, in a pre-accepted state.** There is no separate proposal object to reconcile with the commitment later — the one object carries its own lifecycle:

```
Commitment (share-relevant fields)
  owner            -> { tenant, board, principal }   // the creator; never transfers
  grants[]         -> ShareGrant { holder: person | token, rung, scope, edit_mode }   // engine-minted only
  status           : draft | offered | declined | expired | …
  hold             : duration                         // creator-set at share time: default 5 min, 0–24 h
  decline_reason                                      // structured; set only from `declined`
```

**The status vocabulary's home is `../harness/SPEC.md §3.4`**, not here — the four values above are the share-relevant subset of that block, and a value this seam needs but does not print is read from there. Two values this list previously carried have been removed rather than reconciled: `placed` (a committed, accepted offer is `confirmed` as a latch and `active` as a derived condition — nothing needed a third name for it) and `stale` (an offer that ends at a commit-time conflict is not a status; item 5 below records it as a terminal event, and `stale` is reserved throughout this corpus for **computed artifacts** — handles §4, proposals §6/§9 — never for a commitment).

The `grants[]` edge (each entry a `ShareGrant`) is the only structure in the store permitted to name a second tenant, and **no caller can construct one** — the engine mints it through this seam or it does not exist. That keeps the `../security/SPEC.md §9` invariant literal ("unconstructable by a caller") while making the crossing possible.

**The seam, exactly — and it is not a new one.** The share adds **no verb** to the engine's surface. The harness contract pins five obligations (`../harness/INTERFACES.md §1`) and the swap law is *zero harness changes*; a sixth verb would break both. **One machine (founder-ruled, #2):** a cross-owner booking is an ordinary booking that needs one more yes, riding the two verbs that already exist:

- **`resolve(goal, boards, rules) → Handle`** — when `boards` includes a counterparty's **published availability ref** rather than a board the caller owns, `resolve` validates the goal against the exposed windows and returns the commitment in `offered`. Same signature — *"a placement, a proposal, or a structured decline"* — no new parameter. It consumes no counterparty capacity yet.
- **`commit(offer_ref)`** — the existing **apply-proposal variant** (§6.5): re-runs every check as of *now*, applies atomically or returns `{conflict}`. Applying an accepted offer places the one commitment so it stands on the owner's board and, via the accept grant, on the counterparty's — **visible on both or on neither**; a half-shared state cannot exist.

*Why one machine is worth stating out loud:* the temptation is to give a cross-tenant operation its own dedicated entry point, and that instinct is exactly wrong here. A second write path is a second place for the tenant line to leak, a second thing the stub must fake, and a harness change at swap time. One seam, one set of checks — the same code path serves a booking on your own board and one that reaches another owner.

**The five questions, answered:**

1. **What crosses.** Only the goal and the counterparty's exposed windows. Never their other commitments, rules, parties, or money marks — none are readable to construct with, unless the counterparty has separately granted a higher rung.
2. **Consent is the counterparty's floor act, not the engine's.** `status: offered` fires the **counterparty's** trigger loop (`../harness/SPEC.md §4`). Their yes arrives per their stored **accept mode** — auto-accept what fits the schedule, auto-accept per person, or always manual (the first two are ordinary stored Grants, `../harness/SPEC.md §7`; the third is a live confirmation). **Silence is not acceptance** — an unanswered offer expires when its hold runs out; it never binds.
3. **What accepting does.** The accept mints the counterparty-side grant and `commit(offer_ref)` re-runs **every** §6.1 check on **both** boards as of *now* — capacity, buffers (including travel), latches, preconditions, governing rules — inside **one atomic transaction**. The one commitment then stands on both boards or on neither.
4. **Contention — the hold is the creator's setting.** While `offered`, the targeted window on the counterparty's board is **held** for the offer's `hold` duration — creator-set at share time, **default 5 minutes, range 0–24 hours**; `hold: 0` means no reservation, first commit wins. Expiry frees the window and the offer lapses (cascade behavior: `../harness/SPEC.md §4`). A racer against a zero-hold or expired offer gets `{conflict, reason, alternatives}`, alternatives drawn from the **exposed availability**, never the board.
5. **Partial failure and the honest dead end.** Decline, expiry, and commit-time conflict are first-class terminal states that place nothing on either board and return a structured reason — **a decline carries its reason** (rate, distance, timing, or a free note; founder-ruled, #8), so the owner learns why and may re-offer on changed terms; that re-offer *is* the counter, and no negotiation thread exists. Each terminal state is recorded on **both** boards as an attributed event `{who, basis, when}` — `../security/SPEC.md §9` N3 made concrete.

**Off-app counterparties are unaffected.** The form-export path (`../harness/SPEC.md §2`) is untouched: no agent, no tenant, no grant edge. The share seam is the *both-on-app* case only.

**Referral is a different thing and is deferred.** The share seam reaches a counterparty **the initiator already holds an availability grant from**. Handing a customer to another centre — discovering a stranger, passing their data — is the referral flow, deferred (see `../README.md`). The share seam does not build toward it and must not be read as a partial version of it.

## §8. `check_consistency` / `check_coverage`

- `check_consistency(rule | ruleset) → {conflicts, latent}` classifies **four** ways. The first three route by **authority**; the fourth routes by **satisfiability** and outranks them.
  1. **Governing conflict** — hard stop, the write is refused.
  2. **Own-rule conflict** — returned for the harness's override-with-reason path.
  3. **Latent** — alert, don't block.
  4. **Unsatisfiable** *(added 2026-08-06)* — **refused at write regardless of authority.** A pair is unsatisfiable when **no input can satisfy both**: `min-occupancy.min > capacity.N`, `duration.min >` the longest allowed window, a **required** `dependency` on a `pin`ned party (a ranked `fallback` with an unpinned alternative is not this — §3). *Why this cannot be an own-rule conflict:* the override-with-reason path exists so an owner can say **"I know something the checker doesn't."** That is meaningful when the checker is being conservative. It is meaningless when the two rules are arithmetically incompatible — the owner is not overriding a judgment, they are asking to store a contradiction, and every future placement would simply decline. Storing it buys an unsailable boat that looks bookable.
  - **The refusal names the fix**, so ordering is never a trap while authoring: *"capacity is 4 and you've set a minimum of 6 — raise the capacity or lower the minimum."* (The §6 voice: decline by naming the blocking rule, never a bare refusal.)
  - **The test is always against the *smallest* case, and this is the discipline that keeps the class honest.** A pair is unsatisfiable only when the **minimum** input already fails — `duration.min`, the longest available window, a single instance of a kind. It is **not** unsatisfiable merely because *large* inputs fail: a group of six exceeding a four-seat boat is an ordinary capacity refusal at commit (A1), not a broken ruleset, and refusing it at write would block a shop from storing rules that work fine for small bookings. **Getting this backwards turns a working configuration into an unstorable one**, which is worse than the problem the class was added to solve. **Every** row in §3's table must state its minimum-case test explicitly — not merely every new one. Two rows have already been narrowed after the fact (`capacity × dependency`, `dependency × pin`), and both were caught by asking "what is the smallest input that fails?" rather than by reading the row. A row whose test is not printed has not been checked.

  Because the menu is closed, clash conditions are **enumerable** — pairwise, plus the single bounded N-ary joint row (`duration + buffer × location-window`); the spec of each row's clash test lives with the menu entries (§3), not in open-ended logic, and §3's table marks which rows are unsatisfiable.
- `check_coverage(board) → {missing_required}` is **structural only**: required attributes/rules present per the governing kind's schema. Semantic completeness is undecidable and never claimed.

## §9. Failure & edge behavior

- **External travel source down** → the gap is unknown → fail closed (not offered, not proposed) with a structured reason the harness can narrate.
- **Beyond-horizon request** → materialize on demand, bounded to the requested window; quota windows spanning the horizon edge compute from pattern + instances (materialization never changes a quota verdict).
- **Stale handle / stale proposal at redemption** → `{conflict, reason}`; fresh recompute required; never partial application.
- **Clock edges** — DST inside a recurring pattern: the pattern's zone governs expansion; instants convert after. A local time erased by spring-forward materializes at the gap's first existing instant; a local time duplicated by fall-back materializes exactly once, at its earlier-UTC occurrence. No day yields zero or two instances, and a duration spanning the transition keeps its true elapsed length. Stated once, here; tested at M5–M6.
- All failure paths return data; none skip a check, none invent a partial result.

## §10. Invariants (the poka-yoke ledger)

| Invariant | Constructed at |
|---|---|
| No double-book (concurrent ≤ capacity, always) | §6.1 |
| No un-expire; no latch ever cleared | §1.3, §6.2 |
| A park is cleared by a human or not at all | §1.3 |
| Diffs cannot wipe governing rules | §6.3 |
| No hard delete exists | §1.10 |
| Money tracked, never moved (recorded as latched marks) | §1.9 |
| Proposals never auto-apply; declined move = no change | §1.11, §6.5 |
| Freed time fail-closed until the owner decides | §1.11, §6.5 |
| Unknown ≠ free, unknown ≠ feasible | §1.2, §5 |
| No caller-authored correctness literal reaches math | §2, §4 |
| Shared projections cannot leak the board | §1.7 |
| The template-bundle projection cannot select people or data | §1.7a |
| Terms bind at booking; edits govern forward only | §1.5, §3 (`pricing`) |
| One commitment, creator-owned; a cross-owner share stands on both boards or neither | §7.1 |
| Only the engine mints a grant — the sole two-tenant edge; no caller can author one | §7.1 |
| A run under its minimum parks for a human; the engine never auto-cancels | §3 (`min-occupancy`) |
| A PendingDecision is never chosen by the engine — `chosen` is a human write or absent | §1.14 |
| Unknown travel and no-feasible-placement are distinguishable in every decline | §5, §9 |

## §11. What the engine is NOT (non-goals & incoming pressure)

- **No week-level route optimization** (stubbed in Situation-D's README) and **no multi-owner reshuffle handshake** — the §7 bound is the line. *(Read this precisely: what is banned is a **reshuffle** across owners — moving two people's existing commitments to make room. The **share seam** of §7.1, which places one new creator-owned commitment into already-published free space, is v1 and specified. Two mechanisms; only the reshuffle one is a non-goal.)*
- **No multi-day solver** — a multi-day booking is per-day `resolve` calls chained by the caller, composed by an Order (§7). The engine never searches across days.
- **No predicate language** — the closed menu is the interview's decision 4; off-menu = design request.
- **No payment rails** (records only), **no GIS** (one geo-ref per place), **no export** (in the marketplace-extraction/scraping sense: no path turns a live board into a shareable or installable artifact — lawful owner takeout and DR backups are the harness §0 "legal minimum," defined at `../security/SPEC.md §8`; data returns to its owner, never becomes publishable), **no semantic completeness**.
- **No storage technology named here** — SPEC is tech-neutral; candidates live in `BUILD.md` only.
