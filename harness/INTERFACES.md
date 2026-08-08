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
- `query` is a typed read-only request: availability of board(s) over a window, gap/buffer between placements, a candidate solution reconciling N boards, a balance draw check, a predicate evaluation over attributes.
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
- (Stub: an in-memory store with a capacity check and a latch check; for `proposal_ref`, a scripted all-or-nothing apply keyed by scenario.)

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
- The value vocabulary (unit-bearing number, ordered set, range/comparator, board-ref list, relation-between-two-quantities, money{amount,currency}, rate-over-recurring-window for `quota` rules) and its operators live HERE, not in the harness. Quota evaluation (has this student used 10 of 10 hours this month?) is engine math; the harness only carries the typed rule and surfaces the verdict.
- The harness only guarantees the tool contract carries **declared typed values**; it hands raw operands + a type_spec to the engine and stores the returned TypedValue/Handle.
- (Stub: accept anything, echo it back as a tagged TypedValue; `compare` returns canned truth per scenario.)

### 1.5 Concurrency / re-solve
```
resolve(goal, boards, rules) -> Handle          // a satisfying placement, or a decline
```
- Arbitration of simultaneous triggers, bounded re-solve rounds, contention ordering — all Engine. The harness fires the loop; the engine decides who wins. (Stub: single-threaded, deterministic pick.)

---

## 2. Model seam (the LLM)

The harness wraps the model; these are the calls the harness makes INTO the model. (In the harness build these can be a scripted/mock model that returns fixed structured outputs per scenario.)

**There are exactly four call types** — `normalize` (§2.1), `narrate` (§2.2), judgment (§2.3), and `summarize` (§2.4) — one of which, judgment, **rides inside `normalize`/`narrate` rather than being separately bound** (`../model/INTERFACES.md §2.2`; it is listed so a future split stays representable). **The seam is pinned at four from here forward**, under the same discipline the engine and app seams carry: a fifth call is a harness change, and the swap law is zero harness changes once the harness is built. (The model seam was never interview-locked the way `../engine/INTERFACES.md §1` and `../app/INTERFACES.md §1` are, but it has the same swap property, so it takes the same pin.)

**The seam is per-call selectable.** Nothing may assume a single model: `normalize`, `narrate`, and judgment may each bind to a different model/tier, chosen per call (build-with-frontier, run-with-cheap is an ops decision the seam must keep open — do not narrow it to a one-model assumption in Engine/App phases). `summarize` is per-call selectable in the same way with **one confinement**: never a `byo-*` provider (§2.4).

### 2.1 Normalize
```
normalize(utterance, context) -> { intent, fields:{…raw…}, ambiguities:[…] }
```
- Turns an utterance into a candidate structured action + raw field values. **Raw values are not trusted** — correctness-critical ones go through `typed_value`/`calculate` before commit.
- `ambiguities` is non-empty when the model cannot safely pick a single normalization → drives elicitation gap-4.
- **The `context` contract (assembled by the harness — SPEC §8):** `{ standing_frame: {owner, surface: board | commitment-page, view_context?: {surface, visible_range?, selected_ref?}}, board_summary, relevant_slice: {rules[], stored_answers[], commitments[]}, handoff_frame?: {trigger_event, affected_commitments[], pending[]} }`. `view_context` is present on **console** firings (stamped by the app on the existing contract, `../app/INTERFACES.md §1` — not a new call) and gives a deictic utterance its referent (`selected_ref`); its `surface` equals the frame's `surface`, stamped as one object; absent on trigger firings, which carry the `handoff_frame` instead. The harness assembles it from engine reads per firing; it never accumulates conversation. `handoff_frame` is present on trigger firings (which have no utterance/conversation) and must make the firing self-sufficient. **`relevant_slice` is bounded and priority-ordered** (nearest scope first, SPEC §8): when the target overflows the budget the slice truncates **deterministically** by that fixed order (identical on replay), and a firing that cannot fit a self-sufficient slice parks rather than proceeding on a truncated context. (Stub: assert the shape and the deterministic truncation order; scenarios L1–L3.)
- **Every free-text string in the assembled context rides with its source tag** — `{text, source: owner | guest | import | document}` — the wire form of **layer-1 spotlighting** (SPEC §8; law at `../security/SPEC.md §5`). **A derived value rides with the least-trusted tag among its inputs** (same law), so no tag on the wire is more trusting than the material behind it; asserted at `SCENARIOS.md` L8. (Stub: the tag is an input the stub echoes; the inheritance rule is harness-side and testable without any seam.) The tag instructs the model to read non-`owner` text as data, not obey it as instructions; it is a labeling defense the model must honor, not a structural guarantee. **Layer-2 dual-model isolation** for the highest-risk untrusted channels (guest free text, uploaded SOP) sits above this: those strings are first reduced to a structured summary by a quarantined tool-less model, so the raw text never reaches this seam's tool-bearing model (SPEC §8; `../security/SPEC.md §5`).

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
- **The layer-2 call.** The law is `../security/SPEC.md §5` (FD-2) and lives there; this is its seam contract. Called by **context assembly** (`SPEC.md §8`), on the highest-risk untrusted channels — guest-returned free text and uploaded SOP documents — **before** the privileged call, so the raw stranger text never reaches the tool-bearing model of §2.1.
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
- The harness/LLM emits a **typed schema**; the app maps types → vetted components. The LLM composes; it never invents a widget. The same types are validated by the engine.

### 3.3 Delivery channels + the traditional guest flow
```
publish(shared, recipients?) -> url/artifact       // the board-blind exported form (from CRUD_Shared);
                                                   //   per-recipient TOKEN when delivered to named
                                                   //   recipients, so a return attributes to exactly one
notify_and_await(form_payload, recipient) -> pending // OUTWARD; third-party comms (crosses the floor)
on_form_return(reply) -> Event                     // fires the trigger-driven loop; carries the token's attribution
```
- The off-app party interacts with `publish`/`notify_and_await` output as a **traditional pre-AI form** — no agent. Their consent (signature/payment) is captured by the form itself.
- `on_form_return` is a **trigger source** into the loop; the owner's agent then processes the returned data (subject to the floor).

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
- App `render`/`publish`/`notify_and_await`: record-and-return spies (assert the payload/reversibility class; simulate `on_form_return`). The escalation ladder's per-rung notifications ride this same spy — asserting *who was notified, when, on which rung* needs no new stub.

The harness is "done" when every scenario passes against these stubs. Swapping stubs for the real Engine/Model/App is the later phases' job and must not require harness changes.
