# annnä Harness — SCENARIOS (acceptance suite / TDD substrate)

*Every decision in `SPEC.md`, turned into a pass/fail scenario. These are the harness's acceptance criteria: the harness is "done" when all **[MUST]** scenarios pass against the stubs in `INTERFACES.md`. Format: **Given / When / Then**, with the expected outcome. `[MUST]` = build-gating; `[HELD-OUT]` = deliberately not designed-to, run as an out-of-sample generality check (record result, don't fix the atom to make it pass); `[ENGINE]` = the harness's part is only "hands the engine a representable state," the enforcement is verified later.*

*Write these as executable tests during `BUILD.md`; each build step names the scenarios it must turn green.*

---

## A. Harness 1 — board authoring

- **A1 [MUST]** — *Given* an empty board, *when* the owner says "put a dive lesson Thursday 3–4pm," *then* a Commitment is committed with an occupying start+end, `temporal_type = event`, and the app is asked to render it on the **board** surface.
- **A2 [MUST]** — *Given* A1's commitment exists, *when* the owner says "actually make it 3–5," *then* the same commitment is edited (not duplicated) and re-rendered.
- **A3 [MUST]** — *Given* a task ("email the report by Friday"), *then* `temporal_type = task` (end has role `deadline`, no occupying interval) and it completes **by action**, not by the clock.
- **A4 [MUST / poka-yoke]** — *Given* a board at capacity 1 with an active commitment 3–4pm, *when* a second commitment tries to consume it 3–4pm, *then* `commit` returns `conflict` and no double-book exists. `[ENGINE]` for the enforcement; harness must surface the conflict, not swallow it.
- **A5 [MUST / tasks reserve nothing]** — *Given* a start-only task at 19:00 (no end), *then* availability over that time is **unchanged** (a marker, not a reservation); *given* the same entry as an event 19:00–19:30 plus a 5-min buffer rule, *then* availability splits around 18:55–19:35. Same substrate, no extra machinery.
- **A6 [MUST / hand-edit transits the floor]** — *Given* the owner edits a commitment **by hand** on the board (direct manipulation, not an utterance — the app riser's *"edit by hand or by talking,"* `../app/SPEC.md §1` "Everything else is a riser"), *then* the write still transits `CRUD_Commitment` under the floor: a reversible field edit runs at full autonomy, and a hand-edit that would cross the line (e.g. changing a confirmed booking's counterparty-facing time) is gated **exactly as the utterance path is**. The app collects the edit and hands it to the harness untouched; the floor's applicability does not depend on whether the change arrived by hand or by talking.
- **A7 [MUST / tool return validated]** — *Given* a tool returns a value that does **not** match its declared return schema, *then* the harness surfaces a **structured error** and does not pass the malformed return to the model. Assert no raw or unvalidated return ever reaches the model consumer — the return leg is validated exactly as the call leg is typed (`SPEC.md §5`).

## B. Buffers, rules, elicitation basics

- **B1 [MUST]** — *Given* the owner says "leave 5 minutes between teaching sessions," *when* processed, *then* the agent **proposes a rule with a scope** ("apply to all your teaching sessions?"), and on accept a `Rule{type: buffer, operand: 5min, target: kind, scope}` is written. (The first sentence of use case B must produce a *write*, not just chat.)
- **B2 [MUST / ask-once]** — *Given* B1's rule is stored, *when* the owner books another teaching session, *then* the agent does **not** re-ask about the buffer (a covering-scope answer already exists).
- **B3 [MUST / gap-4]** — *Given* an utterance the model returns with `ambiguities` non-empty, *then* the agent asks a single clarifying question and does not guess.
- **B4 [MUST / reversible → act]** — *Given* a reversible, inferable action (create a draft, move an internal block), *then* the agent acts without asking (the floor is the act/ask line).
- **B5 [MUST / quota]** — *Given* the owner says "no student can book more than 10 hours a month," *then* the agent proposes with scope and writes `Rule{type: quota, operand: 10h/month, scope: per-customer}`; *when* a booking would take a student to 11 hours, *then* the engine-stub verdict (refuse) is **surfaced at the picker**, not swallowed — the hour is refused before it can be booked.
- **B6 [MUST / the noticed-pattern offer]** — *Given* the owner's self-improvement setting is on **and its repetition threshold set to the fixture's value** (§6 — the threshold is a stored parameter, not a constant), *when* the owner hand-sets the same field to the same value enough times to cross that stored threshold on a console turn, *then* the agent proposes — **inline on that turn** — a Rule at a named scope, showing the current value and the proposed one, and on accept an **ordinary Rule** is written with no special marking. The stored result is indistinguishable from the same rule elicited by B1.
- **B7 [MUST / absence: the offer cannot escape its box]** — assert, against the tool contract and the assembled-context spy, all of the following are **absent**, not merely unused: (1) **no** noticed-pattern proposal is ever produced by a trigger firing — only by a console turn; (2) **no** proposal of type Grant or Exception is ever produced by this path; (3) the detection **never appears in the assembled context** handed to the model; (4) with a slice containing five `guest`-tagged repetitions and zero `owner`-tagged ones, **no** offer is produced; (5) with the owner's self-improvement setting absent, **nothing detects and nothing is offered**. Mirror of the D9/N2 absence style: assert the affordance does not exist.
- **B8 [MUST / a decline is remembered]** — *Given* the owner declines a noticed-pattern proposal, *then* a `PatternDecline` is stored (`SPEC.md §3.10`, persisted through the existing `commit` verb — assert **no new seam verb** appears in the tool contract) and a re-offer **proposing the same value** is not offered again — assert its absence on a subsequent qualifying turn. *Given* a later offer at the same `pattern_key` **proposing a different value** (a new `proposed_value_hash`), *then* it **is** offered. *Given* the owner chose "don't ask me again" (`permanent: true`), *then* **no** proposal on that `pattern_key` is offered for **any** value — assert absence — and the record is **revocable**, after which offers resume. *Given* a narrowed acceptance (G2's scope behaviour), *then* the offer does **not** return on a different instance — the decline, not the scope ladder, is what silences it.

## C. Status — latched acts over derived conditions

- **C1 [MUST]** — *Given* a 3-day OWD with waiver signed, deposit paid, deps intact, *when* the owner cancels it a week before, *then* `cancelled_at` is set and `status = cancelled` — it does **not** derive `active`→`completed` when the dates pass.
- **C2 [MUST / the un-expire bug]** — *Given* a hold with `expires_at 11:00` and unmet `{signature}`, *when* 11:00 passes (→ `expired_at` set, `status = expired`, unit read free) *and then* the signature lands at 11:30, *then* `status` stays `expired` — the late input does **not** un-expire it. `[ENGINE]` enforces the latch invariant; the harness must not model status such that the latch is derivable-away.
- **C3 [MUST]** — *Given* preconditions all met and start in the future, *when* the owner confirms, *then* `confirmed_at` is set and `status = confirmed` (the interval that had "no legal status" now has one).
- **C4 [MUST]** — *Given* a commitment with an unmet own-precondition AND an unmet dependency, *then* the derived layer can report both `pending` and `blocked` (coexistent), unless a latch overrides.
- **C5 [MUST]** — *Given* an event whose end has passed with no `actual_end`, *then* `completed` derives true automatically.
- **C6 [MUST]** — *Given* a bike due Sunday 17:00 returned **Saturday 10:00**, *when* `actual_end = Sat 10:00` is written, *then* it is stored (no `≥ scheduled end` rejection) and `completed = actual_end`. The unit frees at the actual return, not the scheduled one.
- **C7 [MUST]** — *Given* "boat must be back by Friday 17:00" (end role `terminal-constraint`), *then* it is **not** typed as an occupy-nothing task; the terminal constraint is honored and the boat is not booked out across Friday afternoon.
- **C8 [MUST / the clocked offer]** — *Given* a job offered to an instructor on Review with `expires_at` set from the offer's creator-set hold (§3.4; `../engine/SPEC.md §7.1`), *when* the window passes unanswered, *then* `expired_at` latches, the lapse fires the trigger loop, and the offer **cascades to the next ranked name**; *when* the first instructor taps "yes" late, *then* the offer stays `expired` — the late yes does not revive it (C2's invariant, applied to a person's answer).

- **C9 [MUST / the park cannot self-clear]** — *Given* a commitment parked by an unattended firing (D4/K2), *when* the loop fires again and the blocking condition now looks satisfiable, *then* the park stays set and the act does **not** retry — `needs_human.cleared_by` is written only by a human act, and the commitment is surfaced as parked regardless of what `status` derives to. `[ENGINE]` rejects an `engine`/`llm`-authored clear; the harness must not model the park as derivable-away (C2's discipline, applied to the park).

## D. The floor (M1 clarify/permission)

- **D1 [MUST]** — *Given* a tool that crosses the line (`notify_and_await`) and no matching grant and no live confirmation, *when* the agent wants to call it, *then* it **asks** instead — it does not fire.
- **D2 [MUST]** — *Given* a stored grant `{action_class: notify, scope: this customer, unexpired}`, *when* the agent needs to notify that customer, *then* it fires **without** asking, and the act is recorded with `{who, basis: grant#, when}`.
- **D3 [MUST / never infer]** — *Given* no grant, *when* the agent has only an *inference* that the user would approve, *then* it still asks (silence ≠ consent; no inferred grants).
- **D4 [MUST / unattended]** — *Given* a trigger fires with no human at the console and the action needs a basis it lacks, *when* escalation finds no reachable human within the timeout, *then* the commitment is **parked** in a needs-human state and surfaced — no ungranted across-the-line act fires.
- **D5 [MUST / guest side]** — *Given* an off-app renter returns a form with a signature/payment, *then* their consent is taken from the form (not an agent), and the **owner's** agent still honors the floor when acting on the returned data.
- **D6 [MUST / attribution]** — every across-the-line act has `{who, basis, when}`; assert none can be found without it.
- **D7 [MUST / narrated, not composed]** — *Given* a standing grant covers an outbound message, *when* the message's factual content diverges from stored structure (the narrate spy detects free-composed facts), *then* the send is **blocked** before it fires — outward prose is `narrate(structure)` + the typed payload, never free model composition.
- **D8 [MUST / document-derived basis]** — *Given* a signed T&C that **names** a late-return fee, *when* the return comes in late, *then* the fee is **recorded** under the signature basis without a fresh ask; *given* a damage charge the document does **not** name, *then* there is no basis and the agent asks. Same commitment, same signature — the document's named terms are the scope.
- **D9 [MUST / destruction class empty]** — assert that **no tool in the contract declares the `destruction` reversibility class** (mirror of N2): cancellation is a latch and writes are diff-only, so nothing in the harness can destroy the sole record.
- **D10 [MUST / auto-accept is a Grant]** — *Given* an owner's setup answer *"accept bookings from my regulars,"* *then* a **Grant** is stored (`SPEC.md §7`) and every act it authorizes carries `basis: grant#` — assert that **no authorization path exists other than grant-or-live-confirmation**, structurally. A second mechanism would be a second place to look for who allowed an act.
- **D11 [MUST / auto-accept does not widen]** — *Given* that Grant, *when* a booking arrives from someone outside its scope, *then* there is no basis and the agent asks. Scope is matched, never inferred toward.
- **D18 [MUST / confirmation is content-bound]** — *Given* the owner confirms an across-the-line act ("send Maria the 3 pm move"), *when* an argument changes before it fires (3 pm → 4 pm), *then* the changed act has **no basis** — the prior confirmation does not carry it — and the agent asks again. Assert `basis` records the confirmed tool + canonicalized args, so an approve-then-swap-args cannot read as authorized after the fact (`SPEC.md §7`, rules 2/4).
- **D19 [MUST / fail closed on an undeclared tool]** — *Given* a tool whose reversibility class is **undeclared or unclassifiable**, *when* the agent would call it, *then* it is treated as **across-the-line** — it asks, and never runs unattended on the guess that it was reversible. Assert the floor fails **closed**, never open (`SPEC.md §7` rule 5). The type-level impossibility of a missing declaration is M2's job (BUILD Step 2); this is the runtime backstop.
- **D20 [MUST / the floor property]** — the floor's invariant as a **property-based test** (`../TDD/harness.md`): *no outward act ever occurs without a matching basis, under any tool-call sequence.* Over arbitrary interleavings of tool calls, confirmations, and grants, assert every across-the-line effect the spies recorded carries `{who, basis, when}` whose basis actually matches — a content-bound live confirmation (D18) or a scope-matched grant (D11). Names the harness's one property (the analogue of the engine's property-tested invariants); the executable test is written at build time. **Home: `SPEC.md §7`** — no new law.

## D′. Escalation (the on-call ladder, `SPEC.md §3.9`)

- **D12 [MUST / ladder walks]** — *Given* a ranked on-call list and an escalation raised, *when* rung 1 does not answer within `step_timeout`, *then* rung 2 is notified; the `Escalation` object records each rung and time. Assert the ladder advances on the **virtual clock**, not on a live wait.
- **D13 [MUST / reaching a human is not a basis]** — *Given* rung 2 is successfully notified, *then* **no across-the-line act fires** until a human actually answers. Notification is not authorization.
- **D14 [MUST / exhaustion parks]** — *Given* `total_timeout` passes with no answer, *then* the commitment **parks** and the Escalation closes `timed_out_parked` (this is D4's mechanism, now with an object behind it). Assert no act fired.
- **D15 [MUST / empty list is not an error]** — *Given* an owner with **no** on-call list (the ordinary single-operator case), *then* exhaustion is immediate and the commitment parks. Assert this raises no error state and logs no defect — it is correct behaviour.
- **D16 [MUST / in-app cannot be disabled]** — assert the channel set can never be empty: with email disabled and quiet hours active, the in-app entry still exists. **An escalation nobody reads is a park, never a silent proceed** — assert the outcome equals D14's.
- **D17 [MUST / the park says why]** — a park raised by ladder exhaustion is attributed to it and distinguishable from a park raised by a missing basis. The owner can tell "nobody answered" from "I was never asked."

## E. M2 — governed-board classify gate

- **E1 [MUST]** — *Given* a board carrying governing rules, *when* a commitment is placed with **no** `kind` and **no** `exception`, *then* it is **refused** (unrepresentable), not silently recorded as compliant.
- **E2 [MUST]** — *Given* the same board, *when* a commitment is placed as an explicit `exception {reason, by}` (a maintenance block), *then* it is allowed and recorded **as an exception**, never as compliant.
- **E3 [MUST]** — *Given* a commitment declaring a governed `kind`, *then* that kind's rules are evaluated before it can go active.

## F. Conflict & versioning

- **F1 [MUST]** — *Given* a new rule that contradicts a **governing** rule, *then* the write is a **hard stop** (only forward move is a recorded exception).
- **F2 [MUST]** — *Given* a new rule that contradicts the owner's **own** rule, *then* the agent surfaces both and requires an explicit **override stored with a reason**.
- **F3 [MUST]** — *Given* two rules that don't clash yet but could, *then* the agent **alerts, does not block** (latent inconsistency).
- **F3b [MUST / unsatisfiable is not overridable]** — *Given* two of the owner's **own** rules that are jointly unsatisfiable (a boat minimum above its capacity; a minimum duration longer than any allowed window — `../engine/SPEC.md §8` item 4), *then* the agent **does not offer the F2 override path**: it surfaces the refusal with both operands and the remedy, and the write does not land. Assert the override affordance is **absent**, not merely unused — an owner who can override here ends up with rules that look stored and can never place anything.
- **F4 [MUST]** — *Given* a completed course validated under governing version N, *when* the governing standard is revised to N+1, *then* the completed course keeps its `effective`/version-of-record stamp and is **not** flipped to non-compliant.
- **F5 [MUST / own terms forward-only]** — *Given* booked lessons at NT$100/hour, *when* the owner raises the rate to NT$120 (or reshapes a course), *then* the already-booked commitments **keep the terms they were made under** and the change applies only to bookings made from then on. No live commitment is silently re-priced by a later edit.

## G. Elicitation store & correction

- **G1 [MUST]** — a learned answer is stored as the right object by what it governs: policy-over-kind → Rule; authorization → Grant; per-board fact → Board field; per-instance → Commitment field; deviation → Exception.
- **G2 [MUST / scope ladder]** — an answer stored at `kind-global` resolves a later gap at `instance` scope without re-asking; an answer stored at `instance` does **not** silence a different instance.
- **G3 [MUST / correction]** — *when* the owner revokes/edits a stored rule or grant, *then* the agent surfaces the downstream commitments/grants it invalidates **before** applying, and any outward consequence crosses the floor.
- **G4 [MUST / T2 go-live]** — a governed board goes live only when structural coverage is met OR every remaining hole is a recorded exception; a silent hole blocks go-live.
- **G5 [MUST / interview state]** — a T2 authoring session can save/resume/abandon; partial policy persists as `draft` (disabled) rules.
- **G6 [MUST / template-Lego]** — *Given* the owner describes a shareable thing ("students book my teaching hours"), *then* the agent proposes the **nearest known template pre-shaped** (a lesson form with the right fields); a field add and a field remove both round-trip; the finalized form is **frozen** (generate-once) so every recipient gets the identical thing.
- **G6b [MUST / pin survives re-proposal]** — *Given* the owner **hand-sets** a field during generative-UI authoring, *when* the agent subsequently re-proposes the form (a fresh suggestion, or an added field elsewhere), *then* the hand-set field is **pinned** — user-owned and immune to regeneration — and survives unchanged; the re-proposal cannot clobber it (SPEC §5). Freeze-at-finalization (G6) is the whole-form version; this is the mid-session, field-level version.
- **G8 [MUST / save-as-bundle]** — *Given* a T2 authoring session (complete or in progress — `draft` rules project too, `../engine/SPEC.md §1.7a`), *when* the owner saves it as a template bundle, *then* the harness invokes the bundle **shape-projection** as an **internal `calculate`-class read** (SPEC §6; `../engine/SPEC.md §1.7a`), the emitted document validates as a `../marketplace/SPEC.md §1.2` bundle with operands **blanked or marked publisher's-choice**, the operation declares `internal` and does **not** publish, and **re-projecting the same session yields an identical bundle** (L2's determinism). Points to `../marketplace/SCENARIOS.md I6` for the authoring≡hand-authored equivalence law (not restated here).
- **G9 [MUST / the authoring fence] `[ENGINE]`** — *Given* the bundle projection, *then* it **cannot select** any counterparty, booking, history, ledger, or personal-data field — the authoring twin of `../marketplace/SCENARIOS.md F3` ("the fields do not exist"). The harness's part is only that it **hands the engine a representable request**; the projection's selectable-set enforcement is verified engine-side (`../engine/SCENARIOS.md` S3). `[ENGINE]`
- **G7 [MUST / SOP lifecycle]** — *Given* the owner uploads or names an SOP (a bundle of kinds + rules, SPEC §3.6), *then* it gains document identity through `CRUD_SOP`; its rules govern exactly as directly-authored ones (same precedence law); and *when* it is detached from a kind, commitments already made keep the terms they were made under — forward-only, like every rule edit.

## H. Orders, groups, guest flow

- **H1 [MUST]** — *Given* an order of 3 course-days, *when* the owner cancels **day 3 only**, *then* day 3's slots release and days 1–2 stand (partial cancel), and any already-`completed` day is untouched.
- **H2 [MUST]** — *Given* whole-order cancel, *then* all members dissolve and all slots release.
- **H3 [MUST / group class]** — *Given* a class sold to 4 customers, *then* it is representable as one order with 4 customers consuming 4 seats (each attributable), and one customer cancelling does not kill the others.
- **H4 [MUST / guest]** — *Given* H2 publishes a board-blind form and an off-app party returns it, *then* `on_form_return` fires the loop and the owner's agent processes the data; assert the form exposed **nothing** of the owner's board.
- **H5 [MUST / group half-clear]** — *Given* one order, 3 customers, per-member precondition gates, *when* one member's medical gate blocks, *then* only **their** member-commitment is pending — the other two stand complete and untouched — and the group confirms the moment the last gate lifts. Nobody re-fills anything.
- **H6 [MUST / per-recipient token]** — *Given* a publication delivered to recipients X and Y with per-recipient tokens, *when* a return arrives on X's token, *then* it attributes to X and never to Y, and its data lands with that attribution.
- **H7 [MUST / owner cancel = crossing]** — *Given* a repeat counterparty's booking (their third session), *when* the **owner** cancels it, *then* the cancellation's outward consequence crosses the floor (confirm), and the agent **offers to invite a rebook** (implicit recurrence) rather than closing a dead one-off.
- **H8 [MUST / counterparty cancel ≠ gated]** — *Given* the same booking, *when* the **counterparty** cancels their own booking through their link, *then* it is **not** gated on the owner: recorded, slots released, owner informed. Their time to give up, not the owner's to approve.

## I. Handshake

- **I1 [MUST]** — *Given* two on-app users, *when* one books the other, *then* it resolves as two H1 instances working **the same one creator-owned commitment** through the engine share seam (no separate harness path invoked, no mirrored second record). *(The engine half is `../engine/SCENARIOS.md` I1–I7; the two must agree or the swap is a lie. Mechanism: `../engine/SPEC.md §7.1`.)*
- **I2 [MUST / no new seam verb]** — assert the share path calls **only** the five pinned engine obligations (`INTERFACES.md §1`): the offer arrives through `resolve` and applies through `commit(proposal_ref)`. A sixth verb would break the zero-harness-changes swap law — this is the harness-side guard on the one-machine ruling (#2).
- **I3 [MUST / counterparty's floor]** — *Given* an incoming share offer, *then* accepting is an **across-the-line act on the counterparty's side**: it fires only on a live confirmation or a matching accept-mode Grant (fits-schedule or per-person — D10). *Given* neither, *then* the offer's hold runs out and **nothing lands on the counterparty's board**. Silence is not acceptance.
- **I4 [MUST / offer is an ordinary trigger]** — the incoming offer fires the **existing** trigger loop; assert no share-specific harness path exists.

## K. Loop verification (check-work)

- **K1 [MUST / bounded, attended]** — *Given* a turn whose commit produced stored structure that diverges from the normalized intent (stub returns a mismatched state on every read), *then* the agent detects the mismatch via read-back and does not terminate claiming success; it re-enters the loop **exactly once** and then surfaces the mismatch to the owner as a gap. Assert across the whole turn: **at most two commits**, and **exactly one outward send** — the re-entry re-commits but never re-fires an act already attributed (`SPEC.md §7`).
- **K2 [MUST / unattended]** — *Given* a trigger firing with no human present whose effect fails verification against the engine re-read, *then* the firing does not finish silently — it **parks** the commitment in a needs-human state (consistent with D4). Completion is never claimed unverified.
- **K3 [MUST / the loop terminates, and nothing escalates]** — *Given* a **trigger** firing whose engine re-read mismatches on every attempt, *then* the firing terminates in bounded attempts and **parks** the commitment. Assert the absences: **no act was re-fired** (the outward stub recorded exactly one call), and **no Escalation object was created** — a verification mismatch has no route to the ladder, because the ladder answers a missing basis and nothing here is missing a basis (`SPEC.md §3.9`).

## L. Context assembly

- **L1 [MUST / self-sufficient firing]** — *Given* a trigger fires with no conversation (a hold expiry at 03:00), *then* the assembled context contains the **handoff frame** — the trigger event, the affected commitment's stored structure, and the covering rules/stored answers — and the firing completes (or parks) without needing any conversational history.
- **L2 [MUST / no residue, deterministic]** — *Given* the same trigger fired twice (replay), *then* the assembled context is **identical both times** — built from stored structure only, carrying no prior-turn conversational residue.
- **L3 [MUST / bounded slice, deterministic degradation]** — *Given* a firing whose relevant slice would exceed the context budget (a busy governed board: a large SOP, an N-member order, six scope levels of covering rules), *then* the slice is truncated **deterministically** by the priority order (nearest scope first — the §6 ladder), the **same truncation on replay** (L2 holds), and the firing either remains **self-sufficient** or **parks** (D4) — it never proceeds on a silently-truncated context.
- **L4 [MUST / spotlight tags]** — *Given* a firing whose assembled context mixes owner text with guest/import/document text, *then* **every** assembled string carries its `owner | guest | import | document` source tag, stamped at the door that admitted it; assert a guest/import/document string is **never** tagged `owner`. Layer-1 spotlighting (`SPEC.md §8`; `INTERFACES.md §2.1`) — the labeling wall, asserted **on the wire**, not on model obedience.
- **L5 [MUST / dual-model isolation]** — *Given* an untrusted stranger channel (guest-returned free text, or an uploaded SOP document), *then* the raw stranger text is read only by a **quarantined, tool-less model** that returns a structured summary, and the privileged tool-bearing model's context contains **only that summary — never the raw text** (spy on what the privileged model was shown). Layer-2 isolation (`SPEC.md §8`, FD-2); assert an obeyed non-owner instruction fails the scenario. The quarantine suite is **seeded from a named injection-fixture corpus** — public-benchmark-sourced, declared throwaway, committed to the **code repo's** harness test tree at build time (`../security/SPEC.md §5`); **no attack strings live in this spec repo**.
- **L6 [MUST / deictic view-context]** — *Given* the app stamps a console utterance with view-context `{surface, visible_range?, selected_ref?}` (`SPEC.md §8`; `INTERFACES.md §2.1`), *when* the owner says a **deictic** utterance ("push this back an hour") with a card selected, *then* the referent resolves against the stamped `selected_ref` **deterministically** — no guess, no conversation. *Given* no `selected_ref` and an ambiguous "this", *then* the agent asks (gap-4), never guesses. The app-side companion — that the stamp is actually emitted — is `../app/SCENARIOS.md C5`.

## N. Money as records

- **N1 [MUST / marks are internal]** — *Given* a customer pays at the desk (outside the app), *when* the owner marks the booking `paid` (and later `settled`), *then* the mark is an **internal** act — no floor crossing, no value moves — and it is attributed `{by, at}` where both sides can see it.
- **N2 [MUST / the class is empty]** — assert that **no tool in the contract declares the `value-transfer` reversibility class** — the class exists (future rails would occupy it) but is unoccupied; nothing in the harness can move money.

## P. Proposal round-trip (the compaction pass-through)

*Added at engine-design time (2026-08-05): the engine's reshuffle-as-proposal (`../engine/SPEC.md §7, §1.11`) rides existing harness machinery — this scenario pins the composition so the stub-swap (`../engine/SCENARIOS.md` Z2) cannot pass vacuously on the proposal path. It names **no new tool and no new seam verb**; every step below cites the existing behavior it composes.*

- **P1 [MUST / compaction pass-through]** — *Given* a mid-day cancellation trigger fires and the owner wants the day pulled tighter, *then* the harness, using only existing machinery: **(1)** asks the **direction** as a single per-event question (elicitation, B3-style — never a stored default); **(2)** calls `resolve` with a compaction goal and receives a **Proposal handle** (the §1.5 seam, unchanged signature); **(3)** narrates the proposal from its display facet — every fact traces to the handle's projection (D7); **(4)** on the owner's yes, sends each move request via `notify_and_await` — outward, floor-gated (D1), attributed (D6); **(5)** collects each moved party's answer via `on_form_return` with token attribution (H6); **(6)** applies via `commit(proposal_ref)` only when every move is confirmed — a declined move applies **nothing** (K1 read-back verifies the applied state); **(7)** routes the freed-window **keep-vs-reopen** question through store-routing (G1), the window staying blocked until answered. *Assert at the end: no tool beyond the §5 contract was called, and the harness needed no change to run the flow.*

## J. Held-out generality probes (do NOT design to these)

Run against the finished harness; record pass/fail as an out-of-sample measure. If one fails, the finding is "which general primitive is missing," not "patch the atom for E."
- **J1 [HELD-OUT]** — a request that can **lose** (a bid/waitlist): predicted absorbable as `declined_at {by: system, reason}`. Confirm.
- **J2 [HELD-OUT]** — an **ordering over principals** (seniority): predicted as a Principal attribute. Confirm it needs no new atom.
- **J3 [HELD-OUT]** — **re-solving an already-`active` commitment**: untested against the latch model.
- **J4 [HELD-OUT]** — **admission as type-match, not count**: untested against capacity-as-a-number.
- **J5 [HELD-OUT]** — a **personal preset** (a meal/workout/cycle entry) is absorbed as an ordinary commitment with no commercial fields required.

---

## Coverage map (decision → scenario)

| Decision (SPEC §) | Scenarios |
|---|---|
| Status latches + the clocked offer (§3.4) | C1–C8 |
| The park — neither latch nor status; human-cleared only (§3.4) | C9, D4, K2 |
| Temporal roles — events consume, tasks don't (§3.4) | A5, C7 |
| Reversibility floor (§7) | D1–D8, D18 (confirmation content-bound), D19 (fail-closed on undeclared), D20 (the floor property) |
| Direct-manipulation write transits the floor (§7; `../app/SPEC.md §1`) | A6 |
| Document-derived authorization (§7) | D8 |
| Cancellation asymmetry + implicit recurrence (§6–7) | H7–H8 |
| M2 gate (§3.4, §6) | E1–E3 |
| Elicitation (§6) | B1–B8, G1–G6 |
| Quota rule (§3.5) | B5 |
| Conflict/versioning — forward-only at every level (§3.5, §9) | F1–F5 |
| Orders + group half-clear (§3.7) | H1–H3, H5 |
| Guest flow / no H3 / per-recipient token (§2, §3.6) | H4, H6 |
| Handshake (§2) | I1 |
| Loop turn+trigger + check-work (§4) | D4, H4, K1–K3 |
| Context assembly (§8) | L1–L2 |
| Bounded slice — finite budget, deterministic degradation (§8) | L3 |
| Provenance quarantine — spotlight tags + dual-model isolation (§8) | L4, L5 |
| View-context stamping — deictic referent (§8; `../app/SPEC.md §1`) | L6 (harness), `../app/SCENARIOS.md C5` (app companion) |
| Money as records (§3.8) | N1–N2 |
| Tool contract + reversibility class (§5) | D1–D2, D7, D9, H4, N2, A7 (return-leg validated) |
| Template-matching generative-UI (§5, §6) | G6 |
| Generative-UI pin/lock — hand-set field survives re-proposal (§5) | G6b |
| FR38 save-as-bundle projection + authoring fence (§6; `../marketplace/SPEC.md §1.2`/§2) | G8, G9 |
| Proposal round-trip over the engine seam (§4–§7 composed; `../engine/SPEC.md §7`) | P1 |
| Held-out generality (§9) | J1–J5 |
| The noticed-pattern offer — inline, non-blocking, owner-tagged only (§6) | B6, B7 |
| PatternDecline — a decline is remembered, revocably (§3.10) | B8, `../app/SCENARIOS.md` C7 |
