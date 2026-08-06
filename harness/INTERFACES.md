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

**The seam is per-call selectable.** Nothing may assume a single model: `normalize`, `narrate`, and judgment may each bind to a different model/tier, chosen per call (build-with-frontier, run-with-cheap is an ops decision the seam must keep open — do not narrow it to a one-model assumption in Engine/App phases).

### 2.1 Normalize
```
normalize(utterance, context) -> { intent, fields:{…raw…}, ambiguities:[…] }
```
- Turns an utterance into a candidate structured action + raw field values. **Raw values are not trusted** — correctness-critical ones go through `typed_value`/`calculate` before commit.
- `ambiguities` is non-empty when the model cannot safely pick a single normalization → drives elicitation gap-4.
- **The `context` contract (assembled by the harness — SPEC §8):** `{ standing_frame: {owner, surface: board | commitment-page}, board_summary, relevant_slice: {rules[], stored_answers[], commitments[]}, handoff_frame?: {trigger_event, affected_commitments[], pending[]} }`. The harness assembles it from engine reads per firing; it never accumulates conversation. `handoff_frame` is present on trigger firings (which have no utterance/conversation) and must make the firing self-sufficient. (Stub: assert the shape; scenarios L1–L2.)
- **Every free-text string in the assembled context rides with its source tag** — `{text, source: owner | guest | import | document}` — the quarantine's wire form (SPEC §8; law at `../security/SPEC.md §5`). Non-`owner` text is data the model reads, never instructions it obeys; the tag is how that law reaches the seam.

### 2.2 Read-back / narrate
```
narrate(structure) -> text
```
- Produces human-facing text **from stored structure**, not from the model's memory of the conversation (so read-back can't drift from what was stored). Used to confirm ("I'll add a 5-minute buffer to all teaching sessions — ok?").

### 2.3 Judgment
- The model supplies world knowledge and judgment for *reversible, non-correctness-critical* choices only. It may never author a value that crosses the floor or a correctness-critical literal (enforced structurally by the tool contract, not by trusting the model).

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

- The **loop** (turn + trigger; check-work verification; termination; escalate/park) — including the **on-call ladder and the `Escalation` object** (`SPEC.md §3.9`). The ladder is harness-owned and stubbed by nothing: it is policy, not a seam.
- The **tool contract** (which tools exist, their typed signatures, their reversibility class).
- The **elicitation policy** (gap detection, propose+scope, store-routing, ask-once, conflict handling, exception path, T2 stop-condition).
- The **clarify/permission floor** (reversibility gate, grant matching, attribution, never-infer-a-grant).
- The **context-assembly policy** (standing frame, relevant slice, handoff frame — what the model is shown per firing; SPEC §8).

Everything else is a seam above.

---

## 5. Stub strategy for the build

Implement each seam as the thinnest deterministic fake that lets `SCENARIOS.md` run:
- Engine `commit`/`calculate`: in-memory store + capacity check + latch check + canned handles.
- Engine `resolve`: canned proposal handles keyed by scenario — a placement, a compaction Proposal, a **`BindProposal`** (`../engine/SPEC.md §7.1`), or a structured decline. All four ride the one signature; `commit(proposal_ref)`'s scripted all-or-nothing apply (§1.2) applies them all. **The bind needs no stub behaviour the compaction proposal did not already need** — which is the stub-layer form of the no-new-seam-verb claim, and where it would break first if that claim were false.
- **A steppable virtual clock** — required, not optional: the loop is trigger-driven on clock time (`SPEC.md §4`), and hold/offer expiry (C8), park behaviour, and the escalation ladder's `step_timeout`/`total_timeout` (`SPEC.md §3.9`, D12–D17) all advance on it. Tests **step** the clock; nothing sleeps, nothing waits on wall time.
- Model `normalize`/`narrate`: scripted structured outputs keyed to each scenario's input.
- App `render`/`publish`/`notify_and_await`: record-and-return spies (assert the payload/reversibility class; simulate `on_form_return`). The escalation ladder's per-rung notifications ride this same spy — asserting *who was notified, when, on which rung* needs no new stub.

The harness is "done" when every scenario passes against these stubs. Swapping stubs for the real Engine/Model/App is the later phases' job and must not require harness changes.
