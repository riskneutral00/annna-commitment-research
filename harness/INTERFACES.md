# annnä Harness — INTERFACES (the seams to Engine / Model / App)

*The harness is built and tested in isolation. It sits on three layers that do not exist yet. This document defines the **contracts** the harness calls across those seams — enough to implement stubs so the harness can run and be tested (`SCENARIOS.md`) before Engine/Model/App are real. Each contract is a boundary the harness DEPENDS ON, not something the harness implements.*

*Rule of thumb: anything **correctness-critical** (does this fit? is this free? what's the gap? is this valid?) is an Engine call returning an **opaque handle** — the harness passes handles around, never re-derives or invents the value. This is what makes "thin agent / rich engine" structural.*

---

## 1. Engine seam

The Engine owns deterministic compute + storage. The harness never computes these; it calls and stores/forwards the result.

### 1.1 Compute — the `calculate` contract
```
calculate(query) -> Handle
```
- `query` is a typed read-only request: availability of board(s) over a window, gap/buffer between placements, a candidate solution reconciling N boards, a balance draw check, a predicate evaluation over attributes, a **marks aggregate** (the closed money-marks reporting query), or a **stored-object read** by declared shape — uncleared parks, a `PendingDecision`, open escalations and the on-call list, a party's `PartyContact` (`SPEC.md §3.12`'s fire-time resolution), the stored delivery events (`SPEC.md §3.11`'s suppression read), a `PatternDecline` (`SPEC.md §3.10`'s pre-offer check), the template-bundle projection, the §2.1 relevant-slice assembly, and a `FiringEvent` — the firing log's record by firing id, both parts (`SPEC.md §3.14`; engine storage at `../engine/SPEC.md §1.16`) *(member added 2026-08-28)* *(the projection and slice members stated 2026-08-21, the contact/delivery/decline members 2026-08-22 — each time for the same reason: the engine's taxonomy or the harness's own SPEC required the read (`../engine/SPEC.md §5`) while this enumeration omitted it, and under the zero-changes swap law the harness cannot construct what is not enumerated)*.
- Returns an **opaque `Handle`** — an engine-issued reference to a computed, validated value. The harness/LLM may pass a Handle into a subsequent tool call but may **not** read its internals to author a literal. (Stub: return a deterministic fake handle + a canned result table keyed by scenario.)
- **Never** produces an outward effect.

### 1.2 Write / commit
```
commit(commitment | diff | proposal_ref) -> {ok, commitment} | {conflict, reason, alternatives?}
```
- Enforces **no-double-book by construction** and **atomic commit-time checks**; two commits racing for the same capacity → at most one succeeds.
- Re-entry after a check-work mismatch may re-commit; it never re-fires an already-attributed outward act (`SPEC.md §7` — the normative home).
- Enforces the **latch invariant**: once `expired_at` is set it cannot be cleared by later precondition satisfaction (no un-expire).
- `CRUD_Board` / rule writes arrive as **diffs**; the engine applies them non-destructively (never wipes seeded governing rules).
- **`proposal_ref`** — the third accepted input applies a whole `resolve` Proposal (§1.5) atomically: every move lands or **nothing does**. The harness never unpacks the proposal to commit moves one by one; it passes the reference back. Required by `SCENARIOS.md` P1 step 6, and specified engine-side at `../engine/SPEC.md §6`.
- `alternatives?` is an optional field on a conflict — the engine may offer other placements. The harness may narrate them from the handle but never authors one.
- **Every write carries a caller-supplied write id, and `commit` is idempotent per id** *(2026-08-21)*: re-committing the same id returns the **original result** rather than applying twice — the `../security/SPEC.md §3` hold-idempotency precedent, generalized. This is what makes a lost response recoverable: check-work's one retry re-commits the same id and cannot duplicate a create (K4). The same id is the external surface's continuation handle (`SPEC.md §5.3`, X3–X4) — one mechanism, supplied by the caller *before* the first byte of response, so an interruption that eats the response never orphans the turn.
- (Stub: an in-memory store with a capacity check and a latch check; for `proposal_ref`, a scripted all-or-nothing apply keyed by scenario; idempotency keyed on the write id.)

### 1.3 Consistency & coverage
```
check_consistency(rule | ruleset) -> { conflicts:[…], latent:[…] }
check_coverage(board) -> { missing_required:[…] }      // STRUCTURAL only
```
- `conflicts` distinguishes **governing** conflicts (hard stop), **own-rule** conflicts (override-with-reason), and **unsatisfiable** pairs (`../engine/SPEC.md §8` item 4 — hard stop *regardless of authority*, because no override could make them satisfiable). The return shape is unchanged; unsatisfiable is a class inside `conflicts`, not a new field. **The harness must not offer the override path on an unsatisfiable conflict** — doing so would let an owner store an unsailable boat that still looks bookable.
- Coverage is **structural** (required attributes/rules present), not semantic completeness (undecidable — out of scope).

### 1.4 The type-value system (M3)
```
typed_value(raw, type_spec) -> TypedValue | error
compare(a: TypedValue, op, b: TypedValue) -> bool
```
- The value vocabulary (unit-bearing number, ordered set, range/comparator, board-ref list, money{amount,currency}, rate-over-recurring-window for `quota` rules, instant/interval — the full table is `../engine/SPEC.md §2`) and its operators live HERE, not in the harness. Quota evaluation (has this student used 10 of 10 hours this month?) is engine math; the harness only carries the typed rule and surfaces the verdict.
- The harness only guarantees the tool contract carries **declared typed values**; it hands raw operands + a type_spec to the engine and stores the returned TypedValue/Handle. **For the `instant`/`interval` rows the `type_spec` carries the resolution context** `{zone, reference_instant, locale}` *(FD-27, stated 2026-08-21; zone referent sharpened 2026-08-22 — the harness supplies them from **the goal's zone** (`../engine/SPEC.md §1.2`'s goal-zone rule, which answers the multi-board and cross-owner cases), the firing's clock, and FR15's stored language; the two-argument pin is unchanged)*.
- **These two are a shared library, not seam round-trips** *(2026-08-22 — both are pure functions taking every input as an argument (the resolution context rides inside the `type_spec`); neither reads the store, and a pure function behind an async seam is a needless indirection)*: one implementation, imported by the harness now (`harness/src/typed-value.ts`) and by the engine when its Step 2 consumes it. The signatures above are unchanged — they are the library's contract, and the value vocabulary still lives in `../engine/SPEC.md §2`. **The always-succeeds stub is deleted**: the suite runs the real library, which is what makes FD-27's fail-closed path *reachable* — an unresolvable phrase is a `typed_value` error in the tests, not only in production. Thin-agent is untouched: the harness is trusted code calling a library; what thin-agent forbids is the **model** authoring a literal, which the tool contract's handle typing enforces (`../engine/SPEC.md §4`).

### 1.5 Concurrency / re-solve
```
resolve(goal, boards, rules) -> Handle          // a satisfying placement, or a decline
```
- Arbitration of simultaneous triggers, bounded re-solve rounds, contention ordering — all Engine. The harness fires the loop; the engine decides who wins. (Stub: single-threaded, deterministic pick.)

**Every §1 verb may also return `{unavailable | timeout}`** *(the infrastructure members, 2026-08-21 — the travel envelope's fail-closed shape, `../engine/SPEC.md §5`, generalized to the seam)*: the math did not run, which is a different answer from every semantic return and is never collapsed into one. Attended, it surfaces as a gap; unattended, the firing **parks** (D4's shape). The same members apply to the outward app calls (§3.3). Unknown is never treated as done — and on the **engine seam** a response that never arrived is retried only through the write-id path above, never by re-authoring. **The outward app calls are excluded from that retry sentence** *(2026-08-22 — the write id is a `commit` parameter and `send` takes none; the old text pointed at a mechanism the seam does not have, and an outward send is not idempotent at all, §7)*: an unknown-fate send is **never retried** — it parks with `needs_human.reason: unverified`, and the owner decides. The `AppStub` carries a timeout fixture on the outward call for exactly this path (§5's reasoning for `summarize`'s failure fixture applies verbatim: without it, the path is unreachable and passes vacuously).

**The refusal envelope, seam-wide** *(2026-08-22 — five files carried five failure shapes, three of them undefined, and seven independent builders would have produced seven envelopes)*: every failure return on every seam is one of six closed kinds — **`conflict | decline | invalid | refused | unavailable | timeout`** — carried as `{kind, reason, detail?, next?}` (`alternatives` rides `conflict` as `next`). The existing shapes are members, not exceptions: `commit`'s `{conflict, reason, alternatives?}` (§1.2) is `conflict`; `resolve`'s structured decline is `decline`; `typed_value`'s error is `invalid`; the model's `error(malformed | refused | timeout)` (§2.1) maps to `invalid | refused | timeout`; the app's rejected-render error (`../app/SPEC.md §4`) is `invalid`; the floor's refusals (§1.3, `SPEC.md §5`) are `refused`. The **closed reason set per kind is enumerated in the compatibility policy** — **§7.1** (the RQ-13 file's content, see §6), **authored 2026-08-22, ahead of Step 8** — so widening a reason set is a breaking change under RQ-13's own rule, from now.

**Every seam call is asynchronous** *(2026-08-22 — the seam's neighbours are all async in practice: the engine is a datastore reached over a network, the model is a multi-second remote call, the app delivers over providers — yet every interface here was written value-returning, and the swap law's zero-changes rule (Q3) would have forbidden the fix at the exact moment the first real adapter needed it)*: every verb on every seam returns a promise of its stated shape, the stubs are async, and the steppable clock's wait form is a promise too (`sleepUntil` — the twin of `step`, so the loop's own awaiting is testable without wall time). This changes no contract semantics above — the returns, the members, the envelope are as stated; it fixes only the calling convention, now, while the change is a rename instead of a rewrite. Three loop laws — fire-time re-verify (`SPEC.md §7`), the ladder walk (`SPEC.md §3.9`), check-work-then-terminate (`SPEC.md §4`) — are ordering laws *across* awaited calls, and the suite must assert them as such.

---

## 2. Model seam (the LLM)

The harness wraps the model; these are the calls the harness makes INTO the model. (In the harness build these can be a scripted/mock model that returns fixed structured outputs per scenario.)

**There are exactly four call types** — `normalize` (§2.1), `narrate` (§2.2), judgment (§2.3), and `summarize` (§2.4) — one of which, judgment, **rides inside `normalize`/`narrate` rather than being separately bound** (`../model/INTERFACES.md §2.2`; it is listed so a future split stays representable). **The seam is pinned at four from here forward**, under the same discipline the engine and app seams carry: a fifth call is a harness change, and the swap law is zero harness changes once the harness is built. (The model seam was never interview-locked the way `../engine/INTERFACES.md §1` and `../app/INTERFACES.md §1` are, but it has the same swap property, so it takes the same pin.)

**The seam is per-call selectable.** Nothing may assume a single model: `normalize`, `narrate`, and judgment may each bind to a different model/tier, chosen per call (build-with-frontier, run-with-cheap is an ops decision the seam must keep open — do not narrow it to a one-model assumption in Engine/App phases). `summarize` is per-call selectable in the same way with **one confinement**: never a `byo-*` provider (§2.4).

### 2.1 Normalize
```
normalize(utterance, context) -> { intent, fields:{…raw…}, ambiguities:[…] }
```
- Turns an owner utterance into a candidate structured action + raw field values. **Raw values are not trusted** — correctness-critical ones go through `typed_value`/`calculate` before commit. **A trigger firing never calls `normalize`** *(FD-28, ruled 2026-08-21 — this signature briefly carried a `| trigger_event` union that delivered the event twice (it already rides `handoff_frame`) and had no member of the closed intent vocabulary to return; the union is reversed)*: firings route deterministically through `calculate`/`commit`, and the model is reachable on a firing only via `summarize` (§2.4) and `narrate` (§2.2). Interpretation is for people; the consequence of an engine-owned condition is the engine's.
- `ambiguities` is non-empty when the model cannot safely pick a single normalization → drives elicitation gap-4.
- **The `context` contract (assembled by the harness — SPEC §8):** `{ standing_frame: {owner, surface: board | commitment-page, view_context?: {surface, visible_range?, selected_ref?}}, board_summary, relevant_slice: {rules[], stored_answers[], commitments[], pending_asks[]}, handoff_frame?: {trigger_event, affected_commitments[], pending[]} }`. `view_context` is present on **console** firings (stamped by the app on the existing contract, `../app/INTERFACES.md §1` — not a new call) and gives a deictic utterance its referent (`selected_ref`); its `surface` equals the frame's `surface`, stamped as one object; absent on trigger firings, which carry the `handoff_frame` instead. The harness assembles it from engine reads per firing; it never accumulates conversation — and `pending_asks[]` *(the fourth member, 2026-08-22 — SPEC §3.13)* is what makes that sustainable for a two-turn elicitation: the open ask rides as **stored structure**, so `answer.provide` has a referent with no transcript carried. `handoff_frame` is present on trigger firings (which have no utterance/conversation) and must make the firing self-sufficient. **`relevant_slice` is bounded and priority-ordered** (nearest scope first, SPEC §8): when the target overflows the budget the slice truncates **deterministically** by that fixed order (identical on replay), and a firing that cannot fit a self-sufficient slice parks rather than proceeding on a truncated context. (Stub: assert the shape and the deterministic truncation order; scenarios L1–L3.)
- **Every free-text string in the assembled context rides with its source tag** — `{text, source: owner | guest | import | document}` — the wire form of **layer-1 spotlighting** (SPEC §8; law at `../security/SPEC.md §5`). **A derived value rides with the least-trusted tag among its inputs** (same law), so no tag on the wire is more trusting than the material behind it; asserted at `SCENARIOS.md` L8. (Stub: the tag is an input the stub echoes; the inheritance rule is harness-side and testable without any seam.) The tag instructs the model to read non-`owner` text as data, not obey it as instructions; it is a labeling defense the model must honor, not a structural guarantee. **Layer-2 dual-model isolation** sits above this, scoped by the property (SPEC §8 — non-owner free text admitted to context, plus owner SOPs): those strings are first reduced to a structured summary by a quarantined tool-less model, so the raw text never reaches this seam's tool-bearing model (SPEC §8; `../security/SPEC.md §5`).

### 2.2 Read-back / narrate
```
narrate(structure) -> text
```
- Produces human-facing text **from stored structure**, not from the model's memory of the conversation (so read-back can't drift from what was stored). Used to confirm ("I'll add a 5-minute buffer to all teaching sessions — ok?").

### 2.3 Judgment
- The model supplies world knowledge and judgment for *reversible, non-correctness-critical* choices only. It may never author a value that crosses the floor or a correctness-critical literal (enforced structurally by the tool contract, not by trusting the model).

### 2.4 Quarantine read
```
summarize(raw_text, source_tag) -> { summary, labels[] }
```
- **The layer-2 call.** The law is `../security/SPEC.md §5` (FD-2) and lives there; this is its seam contract. Called by **context assembly** (`SPEC.md §8`), on every channel the layer-2 property names — non-owner free text that is admitted to context at all (guest text, connector-sourced text, surface-arrived text), plus owner-uploaded SOPs — **before** the privileged call, so the raw stranger text never reaches the tool-bearing model of §2.1. *(Vault-resident artifact classes take no summarize read: they never enter context at all — V1's law; corrected 2026-08-21.)*
- **Tool-less by construction, not by instruction.** The binding is to a call path with no tool access at all — the model on the other side *cannot* act, rather than being told not to. A binding that reaches a tool-capable path is a broken binding, not a risky one.
- **Closed structured return.** `{summary, labels[]}` against the declared schema (`../model/INTERFACES.md §2.4`), validated at the seam like every other return. Free text never crosses into the privileged context.
- **Never BYO** *(FD-3, founder-ruled 2026-08-07)*: `summarize` rejects any `byo-*` provider, attended or not — a security control the owner can weaken is not a control. Reasoning and stated cost: `../model/SPEC.md §7`.
- **Fail closed.** No summary — timeout, malformed return, or the fallback also failing, after the one bounded retry (`../model/SPEC.md §8`) — means the raw text is **not admitted to the assembled context at all**. The firing then surfaces a gap (attended) or **parks** (unattended). Same posture as `../engine/SPEC.md §9`'s unknown travel and `SPEC.md §8`'s can't-fit-a-self-sufficient-slice: unknown is never treated as safe. Asserted at `SCENARIOS.md` L7.
- `source_tag` is the `owner | guest | import | document` tag stamped at the door (§2.1); it is an **input**, never something the return may change.

---

## 3. App seam

The App renders surfaces and moves data in/out. The harness produces typed payloads and consumes typed events; it does not render or deliver.

### 3.1 Surfaces (render targets — harness emits, app renders)
```
render(surface: board | commitment-page | console, payload)
```
- **board** (H1) — the calendar view; commitments shown placed in time.
- **commitment-page** (H2) — the per-commitment support surface (one per commitment).
- **console** — the chat surface for the owner's agent.

### 3.2 Generative UI
```
render_generative(schema) -> view        // schema = typed nodes from the FIXED component catalog
```
- The harness/LLM emits a **typed schema**; the app maps types → vetted components. The LLM composes; it never invents a widget — **and composing a payload the harness requested is not choosing a call** (`SPEC.md §4a`'s reconciliation; dispatch is harness-owned). The same types are validated by the engine.

### 3.3 Delivery channels + the traditional guest flow
```
publish(shared, recipients?) -> {artifact, minted: [{digest, bound_to}]}
                                                   // the board-blind exported form (from CRUD_Shared);
                                                   //   per-recipient TOKEN when delivered to named
                                                   //   recipients, so a return attributes to exactly one.
                                                   //   minted[] is the digest return leg (2026-08-22): the
                                                   //   harness commits the mint set in the same firing —
                                                   //   the app records raw results and decides nothing,
                                                   //   and a digest reaches the store on no path but
                                                   //   this leg and on_form_return's open-time ride
                                                   //   (engine/SPEC §1.7's {digest, bound_to} entries)
send(form_payload, recipient) -> {sent | delivered-failed | handed-to-owner} | {unavailable | timeout} // OUTWARD; third-party comms (crosses the floor). Renamed from `notify_and_await` 2026-08-22: the verb never awaited — the reply arrives later through `on_form_return`, and the old name already produced one documented spec error (the retracted write-id retry sentence in §1). A seam call is a send; the awaiting is the loop's job. The return is the delivery-outcomes bullet's immediate union (2026-08-22 — the signature previously read `pending`, the retired shape's leftover).
                                                   //   recipient = {party_ref, address, channel} — RESOLVED
                                                   //   BY THE HARNESS from the party's stored contact via
                                                   //   its own engine read (2026-08-22; the app sends to the
                                                   //   literal given and resolves nothing — app/SPEC §6)
on_form_return(reply) -> Event                     // fires the trigger-driven loop; carries the token's attribution.
                                                   //   also the inbound ride for (2026-08-22): a vault
                                                   //   attestation (harness/SPEC §3.4's evidence union), a
                                                   //   confirmation-time mint record (FD-43's manage
                                                   //   token, minted with no seam call in flight), and
                                                   //   FD-45's open-time single-visitor mint record —
                                                   //   the entry-link open mints with no seam call in
                                                   //   flight (security/SPEC §3), same class as FD-43's;
                                                   //   this ride is how its digest reaches the store
```
- The off-app party interacts with `publish`/`send` output as a **traditional pre-AI form** — no agent. Their consent (signature/payment) is captured by the form itself.
- `on_form_return` is a **trigger source** into the loop; the owner's agent then processes the returned data (subject to the floor).
- **`import_fetch(connection_ref) → {items[], provider_status} | {unavailable | timeout}`** *(FD-49, 2026-08-22 — the one ruled amendment to this seam's verb count, made by `../PRD.md` RQ-3's process: the ruling is the FD entry.)* The harness asks the app to pull the owner's connected outside calendar **inside the caller-initiated firing that asked** (`SPEC.md §5.2` — never a trigger firing, never scheduled; FR12's no-background-poll is structural). The app resolves the vault-resident held credential (`../security/SPEC.md §3.1` — it appears in no payload in either direction), performs the read-only provider call, and returns items whose free text rides `{text, source: import}` (`../security/SPEC.md §5`; Q3 — `import` grants nothing `guest` lacks). Provider rejection returns the visible disconnected state and is **never retried** (T8's no-background-retry); the harness walks returned items as ordinary propose→confirm writes.
- **`display_settings(diff) → {ok} | {invalid}`** *(FD-66, 2026-08-22 — FD-42's ratified mechanism, the second ruled amendment to this seam's verb roster after `import_fetch`, made by the same RQ-3 process)*: the owner's display-only settings write, `internal` class, diff-shaped, landing in the app-owned store whose closed member set is `../app/SPEC.md §7`'s enumeration — a diff naming an off-set member returns `invalid` (`schema-mismatch`), nothing partial applies. Reachable from the console and the owner's own agent; **excluded from the parity enumeration in both directions** (§6's printed exclusion list carries its name), and no other seam call carries appearance (FD-19, as narrowed by FD-42). (Stub: a record-and-return spy like its siblings.)
- **Delivery outcomes are events the harness stores, not app decisions** *(2026-08-21; seam completed after the review found it half-landed — the missing piece was the inbound path, not the storing side)*: a `send` call's **immediate** outcome — `sent`, `delivered-failed`, `handed-to-owner` — returns on this seam call itself, and the **harness** writes it as an engine-stored attributed fact through `commit` in the same firing (no new verb; the app records the raw result and decides nothing, `../app/SPEC.md §6`). A **`complaint`** — and a late `delivered-failed` — arrives out of band **after** the call resolved: the app emits it through its existing event shape (`../app/INTERFACES.md §1`, "delivery results"), and that arrival **is the sixth trigger source** (`SPEC.md §4`, the delivery report): the firing it opens commits the event and ends. Suppression (`SPEC.md §3.11`) is then a pure read over those stored events at the next outward act. `unavailable | timeout` members apply to the outward calls exactly as to §1's (the paragraph above §2).

### 3.4 App-only views (no harness logic)
- SOP library view, management/audit read surface, default-availability UX, version-propagation UI. Listed so the builder does NOT put them in the harness.

---

## 4. What the harness OWNS (for contrast — do not stub these)

- The **loop** (turn + trigger; check-work verification; termination; escalate/park) — including the **ladder-walking policy** (which rung, which timeout, when to park): harness-owned, stubbed by nothing, because it is policy, not a seam. **But the `OnCall` and `Escalation` objects themselves are stored structure** (shape at `SPEC.md §3.9`), and storage is the **engine's** — reached through the **existing** `commit`/`calculate` verbs (§1), **never a new seam verb**. This split is forced: an `Escalation` must survive between the trigger that raises it and the `total_timeout` that parks it — different clock firings — and context is *assembled from stored structure, never accumulated conversation* (`SPEC.md §8`), so it cannot live only in harness memory. The engine holds them like any other stored object (`../engine/SPEC.md §1`); the harness walks them. Walking is the harness's; persistence is the engine's.
- The **tool contract** (which tools exist, their typed signatures, their reversibility class).
- The **elicitation policy** (gap detection, propose+scope, store-routing, ask-once, conflict handling, exception path, T2 stop-condition).
- The **clarify/permission floor** (reversibility gate, grant matching, attribution, never-infer-a-grant).
- The **context-assembly policy** (standing frame, relevant slice, handoff frame — what the model is shown per firing; SPEC §8).

Everything else is a seam above.

---

## 5. Stub strategy for the build

Implement each seam as the thinnest deterministic fake that lets `SCENARIOS.md` run:
- Engine `commit`/`calculate`: in-memory store + capacity check + latch check + canned handles.
- Engine `resolve`: canned proposal handles keyed by scenario — a placement, a compaction Proposal, an **offered share** (the one commitment in `offered`, `../engine/SPEC.md §7.1`), or a structured decline. All four ride the one signature; `commit(proposal_ref)`'s scripted all-or-nothing apply (§1.2) applies them all. **The share needs no stub behaviour the compaction proposal did not already need** — which is the stub-layer form of the one-machine claim, and where it would break first if that claim were false.
- **A steppable virtual clock** — required, not optional: the loop is trigger-driven on clock time (`SPEC.md §4`), and hold/offer expiry (C8), park behaviour, and the escalation ladder's `step_timeout`/`total_timeout` (`SPEC.md §3.9`, D12–D17) all advance on it. Tests **step** the clock; nothing sleeps, nothing waits on wall time.
- Model `normalize`/`narrate`: scripted structured outputs keyed to each scenario's input.
- Model `summarize` (§2.4): a scripted `{summary, labels[]}` keyed to each quarantined input, **plus a failure fixture** — a scenario key that returns a timeout/malformed result on every attempt including the fallback, so `L7` has something to fail against. Without the fixture the fail-closed path is unreachable and L7 passes vacuously.
- App `render`/`publish`/`send`: record-and-return spies (assert the payload/reversibility class; simulate `on_form_return`). The escalation ladder's per-rung notifications ride this same spy — asserting *who was notified, when, on which rung* needs no new stub. **`AppStub` also carries a delivery-event fixture** — scripted `sent`/`delivered-failed`/`handed-to-owner` returns per scenario, plus an out-of-band `complaint` event it can inject — so D22–D23's Given is producible against stubs.
- **The credential check (Step 8)** is a fourth scripted fake alongside the three seams — a deterministic valid/withdrawn verdict per scenario key. It stubs the `external-client` class's authorization check (`../security/SPEC.md §3`), not a seam: the surface is the harness's own contract (§6), so there is nothing else to fake.

The harness is "done" when every `[MUST]` scenario passes against these stubs; held-out probes are **run and their results recorded**, never designed or fixed toward (`README.md` states this in the same form). Swapping stubs for the real Engine/Model/App is the later phases' job and must not require harness changes.

---

## 6. The inbound surface — external clients

*Appended 2026-08-21, landing `../PRD.md §4.5`'s seam rows (RQ-2, RQ-3, RQ-4, RQ-9, RQ-13). This is not a fourth seam the harness depends on — it is the harness's own tool contract exposed to a caller that is not the app. Behavior law: `SPEC.md §5.3`. The admitting credential and its custody: `../security/SPEC.md §3` (the fifth class, FD-17), adversarial suite `../security/SCENARIOS.md` T9.*

- **The surface adds no seam verbs (RQ-3).** The verb roster is identical before and after this surface exists. A capability that would require a new verb is a spec change with its own ruling, never an implementation detail — the same lock the engine and app seams carry.
- **One enumeration serves parity and the inbound record both (RQ-2, RQ-9).** The enumeration of owner capabilities and the tool reaching each **is the same list** as what is reachable from outside the app — the inbound mirror of `../deployment/egress-allowlist.md`: a capability reachable and unlisted is a defect wherever it appears. Parity's excluded classes are `../PRD.md` RQ-2's own — guest surfaces, closed-service admin, appearance (FD-19), and **authorization-and-recovery (FD-26)**: credential mint/withdraw, grant minting (FD-24), the restore confirm, the suppressed-party re-enable, all console-only by ruling. The concrete enumeration is produced at `BUILD.md` Step 8 from Step 2's typed signatures, and a mechanical gate in the `roster-check` shape asserts **set equality in both directions over the non-excluded set** — an enumerated capability with no tool fails, and a tool serving no enumerated capability fails, **where the gate's tool domain is the contract net of tools whose sole capability is in an excluded class, each such tool named in a printed exclusion list** *(2026-08-22 — so FD-42's ratification, if it names a `display.settings` verb, adds one name to a list instead of turning the gate red on landing day)* (`deployment/scripts/`, landing with the enumeration — law now, mechanism at that step: the `../security/SPEC.md §3` printed-gate posture). Gated at `SCENARIOS.md` X1, X6.
- **Results are structured, and nothing requires a rendered surface (RQ-4).** Both legs are already under contract (`SPEC.md §5` — the call typed, the return validated against its declared schema). What this surface adds: a client that renders nothing can reach every enumerated capability, and no capability's only complete answer is obtainable by reading a rendered page.
- **The tool contract has a stated compatibility policy (RQ-13).** A published policy states what constitutes a breaking change to a verb, what notice a credential holder gets, and how long a superseded shape remains callable; a change that breaks a caller cannot land without satisfying it; and it is forward-only in the corpus's sense — a change never alters what an existing call already meant. The policy is authored — **it exists at §7 below as of 2026-08-22, ahead of Step 8** (its own preamble says why), before any credential is issued — cheap while the sole holder is the founder, expensive after (`../PRD.md §7`) — and gated at `SCENARIOS.md` X7 rather than left as prose. **What counts as breaking includes widening a closed shape**: a new status value, a new structured-decline reason, a new `labels[]` member — clients branch on closed enums (`SPEC.md §5`'s declines are designed to be branched on), so widening one is a breaking change unless the policy says otherwise. It is spec-class markdown at **§7** below *(authored 2026-08-22 as `harness/COMPAT.md`, whose INDEX row and count bump landed with it that day and were **folded** away with it 2026-08-29)*, on the `../deployment/egress-allowlist.md` precedent: the permission lands first, alone, where it is the only thing to read — and it enumerates the closed reason set per refusal kind (§1's envelope), which is what makes its own widening rule checkable.

---

## 7. Compatibility — the closed refusal vocabulary and the RQ-13 policy

*The RQ-13 policy (`../PRD.md §4.5`; §6 above), originally authored 2026-08-22 as `harness/COMPAT.md`, **folded** here 2026-08-29 when the harness package returned to the ruled five-file shape (`../AGENTS.md` §Package shape) — ahead of `BUILD.md` Step 8, deliberately. The refusal vocabulary is **consumed from Step 1** (every stub's decline is a contract) and was scheduled to be **authored at Step 8**: every stub decline in between would have been an unwritten contract that independent builders fill differently, and `../engine/SCENARIOS.md` Z1's "contract-visible behavior exactly" is uncheckable without the vocabulary it names. Authoring the enumeration first follows the `../deployment/egress-allowlist.md` precedent: the permission lands first, alone, where it is the only thing to read. Step 8 still produces the capability enumeration; X7 still gates credential issuance on this policy's existence.*

*This **section** is the **single normative home** (FR13) for two things: the closed reason set per refusal kind, and the compatibility policy. The envelope shape itself — six kinds, `{kind, reason, detail?, next?}` — is defined at **§1** above and only used here.*

### 7.1 The closed reason set per kind

Every failure return on every seam is one of the six kinds (§1), and every kind's `reason` comes from the table below — nothing else. Each reason names the spec text it collects; the law stays at its home, this table only closes the vocabulary. **From this vocabulary's authoring onward, adding a reason is a widening of a closed enum and therefore a breaking change under §7.2** — exactly the rule §1 announced would attach.

| Kind | Reason | Collected from |
|---|---|---|
| `conflict` | `capacity` | no-double-book by construction; two commits racing for the same capacity (§1.2) |
| `conflict` | `buffer` | the buffer/travel-gap commit-time check — "capacity, buffers (including travel)" (`../engine/SPEC.md §7.1` item 3, the §6.1 check list) |
| `conflict` | `latch` | the latch invariant — a lapsed hold or set latch refuses the write (§1.2; `SPEC.md §3.4`) |
| `conflict` | `precondition` | commit-time precondition check (`../engine/SPEC.md §7.1` item 3) |
| `conflict` | `governing-rule` | a governing-authority rule refusing the write (`../engine/SPEC.md §7.1` item 3; hard stop, `SPEC.md §6`) |
| `conflict` | `write-id-reuse` | a reused write id whose payload differs from the recorded one (`../engine/SPEC.md §6` item 6) *(row added 2026-08-22 — collects law older than this table, not a §7.2 widening: the engine ruled the shape before the table was authored and the table missed it)* |
| `decline` | `no-feasible-placement` | "the math ran; nothing fits" — `detail` carries the tightest refusing constraint class (`../engine/SPEC.md §5`, §7's exhaustion rule) |
| `decline` | `travel-unknown` | "the math could not run" on the travel envelope — never collapsed into the row above; `detail.cause` says why, `ceiling` (the warm-up is running; expect a re-offer) or `provider-failed` (the map is down) — a `detail` discriminator, not a reason widening *(2026-08-22)* (`../engine/SPEC.md §5`, §9) |
| `invalid` | `malformed` | a malformed model return or tool call (`../model/SPEC.md §8`; `SPEC.md §5`'s no-repair-loop rule) |
| `invalid` | `type-mismatch` | `typed_value`'s error — the operand fails its declared type (§1.4) |
| `invalid` | `schema-mismatch` | return-leg validation and the app's rejected-render error (`SPEC.md §5`; `../app/SPEC.md §4`) |
| `refused` | `no-basis` | the floor: no live confirmation and no covering grant, including a drifted act (`SPEC.md §7` rules 2–3, fire-time re-verify) |
| `refused` | `authorization-gated` | a Grant mint/widen arriving on a trigger firing or the external surface — refused, not queued (FD-24, `SPEC.md §7`) |
| `refused` | `console-only` | the authorization-and-recovery class at the external surface (FD-26, `SPEC.md §5.3`) |
| `refused` | `unruled` | a write attempting a mark whose trigger is deliberately unspecified — today, `held` (`../engine/SPEC.md §1.9`) |
| `refused` | `byo-binding` | `summarize` rejecting any `byo-*` provider (FD-3, §2.4) |
| `refused` | `policy-missing` | credential issuance with no compatibility policy on record (`SCENARIOS.md` X7) |
| `refused` | `provider-refused` | the model seam's own `refused` member surfacing through a call (§1's mapping of `../model/SPEC.md §8`'s error union) |
| `refused` | `credential-invalid` | a call on a withdrawn, suspended, or revoked credential — any surface (`../security/SPEC.md §3`'s lifecycle; `SPEC.md §5.3`) *(row added 2026-08-22 — collects law older than this table, not a §7.2 widening: the credential lifecycle predates the table's authoring and no member covered its refusals)* |
| `unavailable` | `substrate` | the seam's infrastructure member — the math did not run (§1, the paragraph above the envelope) |
| `unavailable` | `provider` | a third-party provider down: travel source, calendar provider (`../engine/SPEC.md §9`; `import_fetch`, §3.3) |
| `timeout` | `substrate` | the seam call's own deadline (§1) |
| `timeout` | `provider` | a third-party call's deadline (§3.3) |
| `timeout` | `model` | the model seam's timeout member after the one bounded retry (`../model/SPEC.md §8`) |

**What is deliberately not in this table.** A *counterparty's* decline of a share offer carries its structured human reason — rate, distance, timing, or a free note (`../engine/SPEC.md §7.1` item 5, founder-ruled #8). That is stored data about a person's answer, not a seam verb's failure return, so it is outside this closed set and widening it is template/configuration territory, not a breaking change here.

### 7.2 The compatibility policy (RQ-13)

- **What constitutes a breaking change:** removing or renaming a tool; changing a parameter's or return field's type or meaning; making an optional parameter required; **and widening any closed enum or return shape** — a new status value, a new refusal reason (§7.1), a new `labels[]` member — because clients branch on closed enums (`SPEC.md §5`'s declines are designed to be branched on). Additive optional fields with declared defaults are non-breaking, on `../engine/SPEC.md §1.10`'s additive-only precedent.
- **Forward-only:** a change never alters what an existing call already meant (`../PRD.md` RQ-13's own words). A superseded shape is superseded, never reinterpreted.
- **Notice:** a breaking change lands in this section **before** the change lands anywhere else — the spec-first half of `../deployment/SPEC.md §1`'s boundary law is the notice mechanism. While the only credential class admitted is the owner's own agents (`../PRD.md §1.2`, refusal two), that entry is the whole notice.
- **Supersession window:** a superseded shape remains callable until every issued credential has been exercised against the successor — with no third-party holders this window may be zero. **Before any credential is issued beyond the owner's own agents, this policy must first state a numbered notice period and window** — issuing without them is X7's refusal. (A readiness condition, not a schedule — FR2.)

### 7.3 What enforces this

- **X7** (`SCENARIOS.md`) — no credential issues without this policy on record.
- **`deployment/scripts/compat-reasons.mjs`** — the gate compares **§7.1's table against §1's envelope sentence: two enumerations that can still drift, now inside one file.** It asserts the kind set here equals §1's six both ways, that every kind carries at least one reason, and that every `reason:` string literal in `harness/src/` is a member of §7.1's table. The reverse direction — every reason exercised by some suite — becomes checkable as the Step 1–5 suites land and is printed as the gate's honest bound until then.
- **S2** (`../deployment/SPEC.md §1`) — this section is spec; it never moves in a commit with code.
