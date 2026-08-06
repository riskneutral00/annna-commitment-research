# annnä — Adversarial Critique of the Harness Design

> ⚠️ **Historical — this is design *history*, not the build plan.** Preserved so decisions can be traced to their reasoning. Where anything here conflicts with a layer package (`harness/`, `engine/`, `app/`, `model/`), **the layer's `SPEC.md` wins.** Start at the [root README](../README.md).


*Produced 2026-08-03 against `CRITIQUE-BRIEF.md`. Method: 9 independent attack lenses, each finding then tested by a grounding refuter (killed if the documents already answer it) and a consequence refuter (killed if it's a nitpick), then two completeness critics over the survivors. 45 findings raised, 4 killed, 40 survived; 12 additional gaps from the critics. Deduped and ranked here. Citations verified against source.*

---

## Verdict

**§2 and §13 describe two different products, and nothing in the document reconciles them.**

§2 is the atom of a personal calendar: a title, two optional times, `who` defaulting to self. §5, §6, §11 and §12 are all built on that object — occupancy is "events only," the tool contract is "`*_commitment` CRUD + `calculate`," the build plan's Stage 1 is a commitment store.

§13 is something else entirely: a multi-party resource-booking ontology with boards that have capacity, rules with targets and types, a six-state lifecycle, holds, prerequisite edges, admission predicates, and outward notification.

Every use case that drove the design — B, C, D, E — lives in §13. Every specified mechanism lives in §2. **Almost every serious finding below is a seam between the two**, and they were never joined. The document reads as settled because each half is internally coherent; the incoherence is entirely in the join, and the join is where the product is.

The single most consequential consequence: **the harness has no write path for its own output.** The T2 harness's entire product is rules on boards. No tool in the contract creates a board or writes a rule, and the rule atom as specified cannot hold a number. Use case B — the smallest case in the corpus — stops at its first sentence.

Second verdict, on process: the layer discipline is being used as a shield. "That's Engine" appears in front of no-double-book, holds, buffers, capacity, dependency resolution, contention, and the entire handshake — all marked v1. What remains inside the harness boundary is the part that was already easy. Several decisions marked **resolved** are resolved by relabeling, not by deciding.

---

## 1. The five that stop the build

### 1.1 No tool can create a board or write a rule — the harness's entire output has no persistence path

The board is "the universal availability primitive," present at the base of the ontology, and §13 explicitly assigns authoring to this layer: *"Enforcement is **engine**; authoring the capacities/rules is harness."*

The full mutation surface is `CRUD_Commitment` + `CRUD_Shared` + `CRUD_SOP`. There is no `CRUD_Board`. Rules are deliberately denied a tool — *"managed where they attach ... not a separate `CRUD_Rule` tool zoo"* — but that is only an answer when the attachment target is writable, and the board isn't.

**Walk B, step 1.** Teacher: *"I teach 1-hour lessons, leave 5 minutes between them."*

| Candidate call | Why it fails |
|---|---|
| `create_commitment` | A buffer has no title, start or end; it is not a commitment |
| `CRUD_SOP` | §13: *"touched only when a user uploads or names a playbook, **never otherwise**"* — and §13 says the teacher has no SOP |
| `CRUD_Shared` | Publishes rules that must already exist |
| `calculate` | Read-only, *"changing nothing"* |

**There is no legal tool call.** The turn cannot produce a write. Identically: nothing creates Pool A with capacity 8 (C), the bike inventory (D), or the ten rooms (E).

The "tool zoo" argument is what concealed this. Avoiding `CRUD_Rule` is defensible; avoiding it *and* `CRUD_Board` leaves the design's own base primitive unwritable.

> There is also a naming collision that explains why nobody noticed. §1 defines the Board as a pure projection — *"a view of the data, not a place the agent arranges"* — which correctly needs no create tool. §13 redefines it as a first-class entity with an id, an owner, a capacity number, admission predicates and attached rules. Same word, two objects, and the §1 sense is why the missing verb looks fine.

### 1.2 The rule is declared the atom and cannot hold a value

*"The atom is a `rule`: it carries a **target** (board / commitment-type / audience) + a **type** (buffer, capacity, precondition, admission-predicate, fallback, dependency…)."*

That is the complete schema. **There are no operands.**

- B's 5-minute buffer is `rule(target: teacher board, type: buffer)`.
- D's 12-hour turnaround is `rule(target: bike board, type: buffer)` — §13 explicitly calls it *"the same buffer primitive."*

**These are the same object.** Nothing holds the 5 and nothing holds the 12. The engine that "enforces" receives two identical rules and must produce a 5-minute gap from one and a 12-hour gap from the other.

It gets worse per type:

| Rule type | Operand it needs | Slot available |
|---|---|---|
| capacity | the number (8) | none |
| buffer | the duration | none |
| hold | expiry duration | none |
| ranked fallback | an **ordered list** of boards ("Pool A else Pool B") | one `target` — Pool B is unnameable |
| dependency | the other commitment's id — inherently **two-place** | one `target` |
| admission-predicate | a predicate expression | none |

Every axis §13 harvested from B–E requires an operand the atom cannot carry. So decision 7 — "the rule is the atom, SOP and Shared are optional compositions on top" — is a claim about a structure that has not been designed, and T2's stated output, *"a complete, self-consistent SOP,"* is a bundle of parameterless type tags.

§13 also gives the rule's target two different enums, 25 lines apart, and they don't match:

| Line 198 | Line 223 |
|---|---|
| *"a **target** (board / **commitment-type** / audience)"* | *"managed where they attach (on a **commitment** / board / **shared**)"* |

A commitment instance, a commitment-*type*, an audience and a Shared are four different things across two three-item lists. Whichever is authoritative, note that **board appears in both** — and has no CRUD.

Rules also have **no identity**. Three mechanisms need a handle: "toggle on/off, edit, compose"; an SOP as a live bundle whose edits "re-derive everywhere"; and decision 11's stored override, which must record *which* rule was overridden. *"Managed like fields"* gives none, because fields are anonymous slots on their owner.

### 1.3 The commitment schema cannot hold the lifecycle

§2's raw schema is complete: `id`, `title`, `start`, `end`, `who`, `recurrence`, `urgency`, `parent`, `notes`, `location`, `reminder`.

Now trace D against it:

| Step | Needs | Field exists? |
|---|---|---|
| Hold with 1h expiry | `status`, `expires_at` | **no** |
| Passport + licence uploaded | artifact receipt | **no** |
| Signature | same | **no** |
| Confirmed | `status` | **no** |
| Consumes 1 of N bikes | board ref, quantity | **no** |
| "Day 2 depends on day 1" | `depends_on` | **no** |

Decision 8 refuses new tools on the grounds that `update_commitment` changes "any field." **None of the lifecycle is a field.** Decision 6 defines a six-state machine that exists entirely in prose.

`blocked` is the sharpest case: it is *"derived, not entered"* from a prerequisite edge — and no field holds the edge, no tool writes it, and the rule atom's target enum (board / commitment-type / audience) admits no commitment instance. **`blocked` can never become true.** In C the day-2 boat dive should wait on the day-1 pool session; the author says so in the interview; the sentence is unstorable, and the engine will place day 2 before day 1.

§13 also states both halves of a contradiction one paragraph apart: `blocked` is *"derived, not entered,"* yet *"the agent drives them via tools."*

And `pending` and `blocked` are **orthogonal, not sequential** — a day-2 dive can await both an unsigned waiver and an incomplete day-1 session. A single-valued Kanban chain forces the engine to discard one reason and the agent to narrate half the truth. Status should be a derived label over an underlying set of unmet conditions, which is also how you'd get `cancelled`, `declined` and `expired` — none of which exist, though D's hold expiry and C's decline are both stated mechanisms.

There is no `confirmed` either. It was present in `04` (*"draft → tentative → confirmed → in-use → returned/completed → cooldown"*) and dropped in §13. **The interval [preconditions met, start time] maps to no legal status** — and that is where every booking in B, C, D and E spends most of its life.

### 1.4 "Commitment-type" doesn't exist, so most rules have nothing to bind to

Rules may target a **commitment-type**. The complete type system is `type = event if (start AND end) else task`.

So every rule targeting a commitment-type can say exactly one of two things: *all events*, or *all tasks*.

**C:** *"an OWD requires a pool, a language-qualified instructor, and a boat on days 2–3."* Target must be commitment-type = OWD. OWD is not a type; the three day-commitments are all `event`. The rule fires on the owner's lunch.

**E:** Room 3 admits *"children and prepping only."* A commitment titled "Ortho consult — J. Smith" arrives. §2 carries no domain attributes at all — no category, no qualification, no participant count, no language — so the only deterministic test available is a substring match on the title.

The deeper miss: **the T2 harness authors rules but never authors the vocabulary those rules quantify over.** Capacity is expressible because it's a number on a board. Every predicate axis the design itself harvested — admission-predicate, qualification-matched fill, composition-requirement — needs authored *attributes* on commitment-kinds and boards, and the ontology (Board+Commitment → Rule → SOP → Shared) has no layer for them.

### 1.5 There is no principal, so the floor cannot be enforced and boards have no owner

The word "permissions" appears once, in loop step 3: *"structural check (permissions, required fields) — before any write."* There is no principal on a tool call, no owner on a board, no actor on a turn. `who` is *"optional → defaults to self (not asked for now)."* Half the check is a null test on one string; the other half has no data.

This matters because §14 nominates that check as the enforcement point for the floor.

**The consent hole.** Consumption is defined physically (a number goes down) and never normatively (who was allowed to make it go down). Concretely: the dive center's SOP includes a hold. Person C is an external freelancer who also works for a rival center. The center's engine places a 3-day pending hold on C's board before C has replied. C's capacity is 1, so his board now reads busy to every other party. The rival's engine cannot book him. On expiry the center re-issues. **A third party has been denied use of his own calendar, indefinitely, by a rule he never agreed to** — and he has no modelled recourse.

The research named this field and it was dropped: `01` — *"**Named party** — identity is material; substitution forbidden or **needs consent**."*

Three sections marked settled already quantify over a principal that doesn't exist: §7's group availability resolves *"each member's"* floating time through their own device zone; `Shared` publishes to an "audience" and E resolves bids by seniority; §14.3 escalates *"to the right party."*

---

## 2. Contradictions inside the design

### 2.1 The floor and the silent engine are the same sentence with opposite verbs

| §9.2 | §14.1 |
|---|---|
| Runtime behavior — contention, `pending`, holds, buffers, `blocked` dependencies, re-solve — is **engine** (silent, automatic) | No irreversible or outward-facing action — publish, **notify a real person**, charge, delete — without explicit confirmation *or* explicit standing authorization |

Re-solve-on-decline *is* an outward notification to the next fallback. Hold expiry cancels a reservation a real customer holds. Both statements are marked binding; one of them is false.

The escape hatch is *"explicit standing authorization"* — named once, never defined. **It is not a rule type, has no writer, no scope, no expiry, no revocation, and no step of the authoring interview elicits it.** So:

- **Path 1, floor enforced literally:** an OWD sale at 22:00 wakes the owner for four confirmations, and again for each decline. annnä is now slower than the WhatsApp thread it replaced.
- **Path 2, blanket authorization at authoring time:** the floor never fires again, for any action, against any party. It isn't a floor.

The floor is billed as poka-yoke — *"structural and testable, not judgment-based"* — but the rule atom it must be checked against has no action-class axis, so a grant to *notify* Instructor C is indistinguishable from a grant to *charge* or *delete* against him. §14.1 enumerates four verbs that §6's check has no field to discriminate.

**This is the finding I'd fix first after §1.** It's the one place where the design's stated principle and its stated behavior are in direct, unresolvable conflict.

### 2.2 "Events are not completable" versus a lifecycle that completes everything

`completable = (type == task)`. And: `draft → pending → blocked → active → complete → review`.

Every commitment in C, D and E has a start and an end — a rental, a dive day, an ER shift, a room occupancy. All type to `event`. All non-completable. **The `active → complete → review` half of the lifecycle is unreachable for the entire T2 half of the product**, and reachable only for tasks, which per §5 block no time and therefore touch no resource.

The state machine is on the objects that don't need it and denied to the ones that do.

The deeper problem underneath the naming clash: **the atom has exactly one `end` and it means *scheduled* end. Nothing records when a commitment actually finished.** Two v1 mechanisms already depend on that signal:

- D's turnaround. `04` keys it to *"the 'return' state transition"*; §13 re-bases it to *"after a commitment ends."* Those are the same phrase only if scheduled end = actual return, which is the one assumption a rental business cannot make. Bike due Sunday 17:00, returned Monday 09:00: the 12h buffer computed from `end` frees it Monday 05:00, while it is still out.
- `blocked` *"un-blocks automatically when Y completes."* If Y is an event and events have no completion signal, **`blocked` never resolves** — and `blocked` is an E requirement, not a nicety.

### 2.3 §2 inverts the research it cites

`02` and the appendix conclude that once start+end are pinned, *"`STATUS`/`PERCENT-COMPLETE` are the **only** distinguishing fields"* — event and task are *"two ends of one continuum, plus an independent completion axis."*

§2 takes that single independent discriminator and makes it a pure function of the non-discriminating fields. It is the one derivation the cited research rules out, and §2 cannot claim to rest on `02`/`03`.

The casualty is a distinction `03`'s field catalog kept separate — *"when — end / duration"* versus *"when — due date"*:

- *"Submit the grant report by Friday 17:00"* → end-only → task → correctly occupies nothing.
- *"Boat must be back on the mooring by Friday 17:00"* → end-only → also task → occupies nothing, so the engine books the boat out Friday 16:00–19:00.

A finish-by and a hard terminal constraint are now the same object.

Worse, the commonest task shape in every system surveyed — a defer date plus a deadline, *"start Wednesday, submit by Friday"* — is silently retyped as an **event**: uncompletable, and per §5 occupying Wed→Fri solid. §4's own worked decomposition then finds zero availability for the children it is supposed to spawn.

### 2.4 "Bias toward event" deletes capability as a reward for cooperating

*"the agent actively tries to complete an event — it asks for a missing end time."*

Since `completable` is a function of field count, **adding a field removes a capability**, and the elicitation policy is defined to chase exactly that field.

> User: *"gym at 6am."* → start-only → task → completable; ticking it off daily is the entire point.
> Agent: *"when do you finish?"* User: *"7."*
> → start AND end → event → `completable = false`. The checkbox and its history disappear, with no warning, as the reward for answering.

The policy also has no exit on the other side: *"remind me to call mum"* has no end; the user says "whenever"; that is not an explicit *"there is no end,"* so the batched inquisition re-asks.

### 2.5 §9.2 asserts the opposite of its own source document

| `04`, line 130 | §9.2 |
|---|---|
| **E alone raises a possible second (runtime) job:** autonomous live re-solve under disruption ... **Forcing case for the deferred runtime-harness decision.** | There is no second *conversation* ... (E's escalations are the heaviest such case, **not a different job**) ... **no new job has appeared** |

§13 says the runtime-harness decision is deferred *"until a real case forces it"* — while holding the forcing case inside its own driving set. Apply the design's own three-part test to E's re-solve:

| | Authoring | Live re-solve |
|---|---|---|
| **Goal** | a complete, self-consistent SOP | a covered schedule before a wall-clock deadline |
| **Questions** | "what should the rule be?" (to the author) | "can you take 07:00 today?" (to non-authors) |
| **Stop-condition** | (none specified — see 3.1) | coverage achieved, or clock expiry |

By the design's own standing rule, that is a different job.

And the loop cannot start. §6's loop is turn-driven end to end: *"assemble context ... narrate; loop until the commitment(s) exist."* At 06:00 nobody is at a console — `04` requires exactly that: *"The app should replace the scheduler and do it automatically."* **Deadlock: the escalation needs the loop, the loop needs a human, and the human is what's being escalated to.**

### 2.6 The document states its tool contract twice, and the build plan implements the smaller one

| §11 | §9.3 / §13 |
|---|---|
| *"The **tool contract** — `*_commitment` CRUD + `calculate`"* | six tools: `CRUD_Commitment` + `CRUD_Shared` + `CRUD_SOP` + `calculate` + generative-UI + `notify-and-await-confirmation` |
| *"The personal Harness and **T2 templates are future layers on top, not part of the first harness**"* | §13 designs T2 in full, across 55 lines |
| *"the original charter is well-scoped and **fully specified**"* | |

§12 follows §11. Stage 1 is *"Commitment store + CRUD + `calculate`"* — no Board table, no Rule, no status, no capacity, no hold, no handshake. Stage 2 wires an LLM to those schemas and tests *"scripted conversations → correct tool calls."*

**That test goes green on a system in which C, D and E are impossible by construction.** No stage in §12 builds boards, capacities, rules, the lifecycle, or T2.

Before any other finding here can be triaged, the document has to say which contract is real. If it's the six-tool one, §11's "fully specified" is false and §12 has no plan.

### 2.7 A hold requires an SOP; the users who need holds have no SOP

Three sentences, jointly unsatisfiable:

1. *"A **hold** is a **per-SOP rule**, not a global policy."*
2. An SOP *"earns real identity **when it is a document**"*, and `CRUD_SOP` is *"touched only when a user uploads or names a playbook, **never otherwise**."*
3. `04`: *"realistically there is no SOP, and they create it now, through the conversation"* — the normal case.

**D's entire product is the hold.** The owner has no document and never uploads one. No document → no SOP → no per-SOP rule → **the shop cannot have a hold.**

Either the harness quietly mints an SOP for anyone who mentions a hold — and *"never otherwise"* is false, and SOP is not optional, and decision 7's headline collapses — or D is unbuildable without violating the ontology's own gate. An implementer must pick; the two picks produce different products.

The same seam breaks B from the other side. §14.3: *"At runtime the SOP has already answered; the engine proceeds automatically. Stop only on a true gap."* The teacher explicitly has no SOP. Read literally, nothing has answered, every booking is a gap, *"policy gaps → the author"* — **and the teacher is woken for every student booking**, which is the exact thing publishing a Shared was meant to eliminate. Nothing distinguishes "no SOP at all" from "an SOP silent on this point," and that is precisely the discriminator the runtime branch turns on.

---

## 3. Breaks a stated use case

### 3.1 T2 has no stop-condition — and the design defines a harness *by* its stop-condition

*"A new harness is warranted only when the agent's goal / questions / stop-condition genuinely differ."*

Harness 1 has a real one, stated as a hard predicate: *"Can only 'submit' once `title` is filled."* T2 has none. Its output is *"a complete, self-consistent SOP"* and **"complete" is never given a test.**

Two consequences, both concrete:

- Two runs of the same interview with the same author terminate at different SOPs, and neither is wrong. §12's Stage-2 acceptance test cannot be written.
- Because decision 4's rule is falsifiable only by exhibiting a differing stop-condition, and T2 has none, **no observation can ever falsify it.** "New domain = content, new job = harness" does no work as written.

There is also no state model around the interview: no save/resume, no partial SOP, no abandonment behavior, no statement of whether a half-authored SOP can go live. `publish` is listed as *"possibly `publish` as a real lifecycle step"* — the doc has not committed to the existence of the one transition that would make any of this well-defined.

**Walk it.** The owner is 90 minutes in. Days 1–2 captured; boat rule, instructor predicate and pool fallback are not. He closes the laptop. Next morning a customer buys an OWD. A half-authored SOP is nothing but gaps, so §14.3 escalates to the author on every one.

### 3.2 The design checks SOPs for consistency, never for coverage — so the runtime default is fail-open

Every quality gate in §13 is an *inconsistency* gate, and detection is *"engine-verified."* An engine can only check rules that exist against rules that exist. **A rule that was never elicited is not an inconsistency — it is invisible to every mechanism in the document.**

So the whole weight of *"complete, self-consistent SOP"* falls on the first word, and the first word is delivered by the Model having thought to ask, in a domain nobody hand-tuned.

**Concretely, in the flagship domain.** A PADI OWD carries a mandatory instructor-to-student ratio and a medical-statement precondition. Nothing makes the agent ask for either. And the ratio is not expressible anyway: capacity is a per-board number, and **a ratio between two boards' consumption within one commitment has no representation.** The surfaced palette offers only hold and buffer, so the author is never prompted toward it. An SOP ships, a class is sold over ratio, and no check fires.

The compounding error is §14.3: *"the SOP has already answered ... stop only on a true gap."* A gap is only detectable against an authored rule, so **absence of a rule means permission** — a fail-open default in a system whose normal state during onboarding is missing rules.

### 3.3 The decline cascade was never decided, and it's the author's decision to make

`04` lists it under *"Open questions from C (not yet decided)"*: *"if a stakeholder declines, does the whole plan pause, or does the agent re-solve just that one slot?"* DESIGN.md closes it by omission, via decision 3's "it's engine."

**Relabeling is not deciding.** "Whole plan pauses vs. re-solve one slot vs. commit partially" is not a compute question the engine can answer from data — it's a policy, and by your own rule it belongs to the SOP author, not to you and not to the engine. Which means the harness must elicit and store it. By declaring it engine-and-resolved, the design removed it from the one layer that was going to ask.

It has no home in the rule model either: `ranked-fallback` covers *"Pool A else Pool B"*; nothing covers *"no fallback remains."*

**Walk C to the stop.** Sale fires → 3 day-events + pool hold + instructor request + boat days 2–3. Person C is notified and accepts all three days. Pool A unavailable day 1 → fallback to Pool B (this one has a rule type). Boat declines day 3. **Stop.** Nothing states whether days 1–2 stand or roll back. If they roll back, Person C has already been notified — an outward, irreversible act — and there is no unwind conversation specified.

### 3.4 The assembly loop is not shown to terminate

No hold by default + a mandatory human round-trip inside placement = a solution that can be invalidated while you wait for the reply.

> 09:00 OWD sale. Engine finds Pool A + Person C + boat, notifies Person C. 09:05 a walk-in Discover Scuba legally takes Pool A — no hold existed. 09:40 Person C accepts a plan that is now invalid. Re-solve → Pool B → different boat window → notify the boat operator → another human-latency window → during which a second sale's re-solve takes Person C's day 3.

Nothing bounds the rounds. There is no fairness rule, no ageing, no priority — a 3-board assembly can starve indefinitely behind single-board walk-ins. Turning holds **on** doesn't fix it: each abandoned round leaves a reservation only a timer clears, so the flow starves the shop's own inventory instead.

And note where the escape lives: the fix is a hold, which is optional, per-SOP, and surfaced only because the palette *"proactively offers"* it during an interview with no stop-condition. **Whether the dive center's flagship transaction terminates depends on whether the LLM remembered to mention holds** — against §14's *"correctness is structural, not left to the model's judgment."*

### 3.5 Generative UI renders to the console user; every artifact it collects is owed by someone else

*This decision was the only one no lens attacked, and it breaks on its own motivating case.*

The tool is *"present this catalog-typed schema as a form, return validated input"* — synchronous, in-console. The three catalog types D contributed are **file upload, signature, ID/verification**.

The party who must upload the passport, present the licence and sign the T&Cs is the **renter**, who is self-serving off a public listing and is not at the owner's console. The only outward verb is `notify-and-await-confirmation` — described as "outward push + reply," with no schema payload and no statement that a catalog-typed form can ride on it — and *"delivery channel to non-users"* is parked to the App.

**So D's hold preconditions can never be satisfied by the party who owes them. Every hold in D expires at 60 minutes regardless of what the customer does.** Same in C: Person C must be *"made aware of all conditions and the time required,"* and a bare accept/decline cannot carry that.

Second failure, on the type-system claim (*"the engine validates against the same types"*): a `signature` value that passes type validation is a well-formed blob. What the rental depends on is that a specific legal person assented. `ID/verification` isn't a type property either — verification is a check against an external authority that no layer owns. **Type-validity is presented as the poka-yoke and it guarantees nothing D needs.**

This also falsifies decision 4 in the design's own audit trail. A catalog type is not content — it is a renderer component *plus* an engine validator *plus* an LLM-facing type, i.e. code in three layers. `04` records that one domain added three of them. "New domain = content, never new tools" is already false.

---

## 4. Time (decision 12 is not "fully settled")

§7 is labelled *fully settled*. `04` says time-uncertainty *"dents the settled RFC-5545 time model."* Both cannot be true, and the hole is not an engine detail — it is load-bearing for the harness's own two named jobs.

### 4.1 An uncertain end is a binary switch on whether anything is reserved

Because type derives from field presence and occupancy derives from type, **a soft end is not a cosmetic gap.** C's Day 1 is *"9:00 am, uncertain end ~2:00 pm."* Two exits, both wrong:

| Branch | Result |
|---|---|
| Agent takes 14:00 (per bias-to-event) | Session runs to 15:30. Pool reports free from 14:00. Engine books a Discover Scuba at 14:15 into an occupied pool — fed a false end **by the harness**, then "guaranteed" no-double-book by the engine |
| Author refuses ("it varies") | start-only → task → *"tasks never block time"* → **Day 1 consumes zero pool capacity**, and a 4-hour dive session gets a checkbox |

§3 specifies exactly two branches — an end is given, or the user *explicitly* says there is none. The most common real answer across C, D and E is a third one. And at SOP-authoring time the hardened guess isn't a one-off: it becomes the rule for **every OWD ever sold** — precisely the *"a wrong silent guess becomes a permanent rule"* case §14.2 exists to prevent.

### 4.2 Resource boards have no timezone

Every zone-resolution path in §7 terminates in a *person*: the user's current zone, a member's device zone, the creator's zone, a group's choice. Decision 5 then makes half the boards non-persons. Pools, boats, rooms and motorcycles have recurring rules — maintenance windows, dry-dock, deep-clean, turnaround — and no device, no travel, no zone.

The fallback chain runs *location's zone → creator's zone*, and `location` is optional free text that §13 concedes is normally off. Boards **are** the places, and they carry capacity but no zone.

> Phuket dive center. Owner authors the SOP while visiting family in Vancouver — normal, since authoring is framed as a sit-down interview that can happen anywhere. *"Pool A is closed 06:00–07:00 daily."* No location → creator's zone → `America/Vancouver`, captured silently from the device. Stored as 21:00–22:00 `Asia/Bangkok`. The engine books confined training into a closed pool.

### 4.3 Durations were not adopted with the standard

§7 adopts RFC 5545's DATE-TIME forms and calls the model settled. RFC 5545's answer to durations is that `P1D` (nominal, wall-clock, absorbs DST) and `PT24H` (exact, elapsed) are **different values that produce different results**. §7 imports one half.

Durations are exactly what T2 spends its time collecting: buffers, travel buffers, turnaround, hold expiry, §4's "2-hour chunks." The `duration` catalog type has no stated value grammar, so **the ask-once-and-encode harness has nowhere to store the answer to "did you mean 24 clock-hours or the same time tomorrow?"**

> Bike returned Sat 20:00 `America/Los_Angeles`, 12h turnaround, DST ends 02:00 that night. Nominal → available Sun 08:00. Exact → Sun 07:00. A customer requests 07:30: one reading confirms, the other refuses, from the same authored rule.

### 4.4 No occurrence addressing — no `RECURRENCE-ID`, no `EXDATE`

`recurrence` is *"stored as a rule"* and that is the entire schema. The research's companion machinery didn't survive.

`update_commitment` is the sole mutation verb and carries **no occurrence selector**. *"Move next Thursday's 9am standup to 10, just that week"* has exactly one representable call — one that rewrites all 200 occurrences while the agent narrates success. A perfectly correct model cannot express the right intent; that's a poka-yoke failure by §14's own standard.

E's advance bidding is the forcing case: staff bid 1–2 years out against occurrences that are lazily expanded and therefore not addressable.

### 4.5 "Shared ⇒ instant" constrains the wrong object

The rule pins the shared commitment while leaving **unpinned the floating blocks it must be intersected against**. `04`'s invariant is *"max concurrent consumption ≤ capacity at any instant"* — unevaluable for a floating consumer, which has no instant until render.

> The teacher's recurring floating 07:00 swim consumes 1 of the community pool's capacity. He flies Bangkok → Tokyo; *"flying re-resolves everything automatically"*; his block silently moves two hours in UTC. A student who booked that lane yesterday is now retroactively the 21st concurrent swimmer. No-double-book is violated by an event nobody edited.

"Shared" is never defined, and once resources have boards the term has to decide whether touching a resource board makes a commitment shared. Both readings break something.

---

## 5. The principle that isn't structural

**"Thin agent / rich engine" is a system-prompt convention, not a property of the harness.** It is asserted five times and enforced nowhere.

Loop step 1 hands the LLM *"relevant board slice"* — the raw material for the forbidden computation. Nothing makes calling `calculate` mandatory. No field records provenance.

> **B.** Student: *"give me the slot right after Marcus's lesson, I'm coming from Thonglor."*
> Correct path: `calculate(travel)` → `calculate(gaps)`.
> What can happen instead: the LLM reads the board slice already in its context and emits `create_commitment(title, start=15:35, end=16:35)`. Per §6 that call *"validates title, classifies event/task, rejects a double-booked event"* — title present, no overlap — **accepted**. The buffer and the travel time were never applied.

**It is unfalsifiable by the design's own acceptance test.** §12 Stage 2's oracle is *"scripted conversations → correct tool calls + correct data,"* and the final tool call is byte-identical whether the LLM computed 15:35 or the engine did. A poka-yoke that cannot fail a test is not a poka-yoke.

The fix is structural and belongs in this layer: **values that must be correct arrive as opaque handles returned by `calculate`, never as LLM-authored literals.** That makes the tool contract as written wrong, not merely incomplete.

### 5.1 Normalization is the correctness-critical act, and it's the model's

*"the model only **normalizes** a rule into a structured constraint — it never decides a clash."*

> Author: *"eight students max per instructor in confined water."*
> LLM normalizes: `capacity(Pool A) = 8`.
> The engine then verifies, deterministically and provably, that a class of 8 fits. **It is right, about the wrong constraint.**

The deterministic checker doesn't catch the error — it **launders** it. After normalization the LLM's guess carries the engine's authority, and every downstream consistency check certifies it.

The human backstop isn't independent either: the pre-publish form renders the LLM's own normalization back to the author, in the LLM's own phrasing. An author who said "eight per instructor" and is shown "Pool A capacity: 8" will tick approve.

Two more classifications sit on the same fault line. *"Model infers floating-vs-instant"* decides whether a commitment moves when its owner boards a plane — a classification, so it escapes the ban on "computing," and exactly as consequential. And *"world knowledge lives in the Model"* is harmless when it guesses dinner is 8pm for one person, permanent when §14.2 turns an unasked model-supplied default into a stored rule governing a business — "asked once" meaning, in that case, never asked at all.

**What would make it structural:** the stored constraint read back in domain language derived from the *structure*, not regenerated by the model, with the author's original utterance retained verbatim beside it. Neither exists, and the only surface that could carry them is parked (*"Management view is app-side — parked"*).

### 5.2 Clash detection over open predicates isn't decidable

*"Detection is engine-verified"* — but the rule-type set is explicitly open (note the ellipsis) and includes `admission-predicate` and qualification predicates over a domain-supplied vocabulary that grows with every new domain **by policy**.

> Room 4: *"pediatric patients only."* New rule: *"any patient in respiratory distress goes to the nearest room with a ventilator."* Room 4 has a ventilator and is nearest to triage. Clash?
> Only if a patient can be simultaneously non-pediatric, in respiratory distress, and nearest-served by Room 4. Answering needs to know that pediatric/adult partition patients, that respiratory distress is orthogonal to age, and to evaluate "nearest" — computed at runtime from data that doesn't exist at authoring time.

Decision 11 offers two outcomes, alert or block. §14 already supplies a better third: **ask and encode.** The harness should enumerate which clash classes the engine decides structurally — buffer, capacity, same-slot value conflict, dependency cycle, window disjointness — and route everything else to the author instead of promising a checker that cannot exist.

### 5.3 "Ask once" has no scope, no provenance, no correction path

§14.2 names the hazard itself — *"a wrong silent guess becomes a permanent rule"* — and supplies no scope, no provenance, and no reversal.

**Scope:** the target of an answer given about one live incident is not derivable from the answer. This-commitment, this-customer, this-commitment-type and this-board are all defensible, and they differ by orders of magnitude in blast radius.

> **D.** Wong's hold expires with the passport uploaded, signature missing. Engine escalates: *"release or extend?"* The owner, who knows Wong, says *"give him 30 more minutes."* The only target that generalizes is commitment-type = rental. Stored: *on hold-expiry with partial preconditions, extend 30 minutes.* A stranger later stalls deliberately, gets a silent free extension, and a paying customer is turned away. The owner is never told a rule was created.

§14.3 routes policy gaps to the author and situational choices to the live party — and gives **no discriminator**. The same sentence from the same person is textually identical whether it's a one-off favor or a standing policy. Worse, in E a live party's individual waiver — Nguyen's 03:00 *"fine, I'll come in"* — is eligible to become the org's standing rule, **authored by exactly the interested party the floor exists to exclude.**

### 5.4 "Escalate to the right party" needs two things the design doesn't model

A decision procedure sorting a gap into policy-vs-situational, and a resolution from the abstract role "the author" to a contactable, awake identity. There is no `author` field, no escalation contact, no on-call notion, no timeout.

> **E, 03:00.** Dr. Reyes is sick. The only qualified replacement holds an *approved* advance time-off bid for that block. The SOP encodes qualification-matched fill and bid precedence; it does not say whether an emergency re-solve may override a granted bid.
> It is a missing precedence rule → **policy gap** → wake the administrator (asleep, unmodelled, unreachable by any specified tool).
> It is also a decision about one person's own board and own approved leave → **situational** → ask Nguyen.
> Both classifications are correct. The design forbids picking wrong and gives no way to pick.

---

## 6. Off-app parties: the model requires universal adoption and doesn't say so

*"a commitment must be satisfiable across **all** the boards it touches."* `04`: *"One extreme: **no stakeholder uses the app except Person C**."*

An off-app boat owner has no board. **There is nothing to intersect** — and an empty board and a free board are the same data.

> Engine intersects student ∩ Person C ∩ Pool A ∩ boat-board. The boat board is empty → reads fully available → days 2–3 placed → *"proceed-per-SOP"* fires because no rule declares a gap. The center's board shows a confirmed 3-day OWD. The boat is chartered elsewhere. Nothing in the system can detect this.

**A board cannot declare whether its emptiness means "free" or "unknown."** And because the confirmation floor only fires on outreach the system already knows it must perform, an unmarked off-app resource gets booked without anyone being asked.

The escape — "the harness treats a pool like a person" — smuggles in an assumption: that the boat can be modelled as a locally-owned resource board the center maintains. But a pool the center owns and a boat a third party owns are different objects. One has a board whose contents the center authors; the other is a **stale local proxy** for facts living somewhere else. If a human keeps that shadow board current, the handshake claim is circular — the intersection is only as good as manual data entry, which is the thing the product exists to replace.

**No degradation story is specified anywhere**, and the design needs one, because per `04` the off-app case is not an edge — it's an explicit design target.

### 6.1 "No external sync" breaks the headline guarantee for on-app users too

§5 asserts *"the engine needs nothing beyond the board's events to compute availability."* True only if annnä's board is the complete record of a person's time.

Person C is the *one* stakeholder who **is** on-app — and he's a freelancer who also teaches for other centers, has a dentist appointment, and a flight. All of it lives in a calendar annnä cannot see and will not import. His board reads capacity-1-and-free for every hour he hasn't re-entered by hand. The engine books him 07:30 Saturday against a flight. No rule violated, no engine bug — **the data was simply not there.**

§12 books this as a win: *"Deletes all sync complexity."* It deletes engineering complexity and relocates it onto the user as a data-entry obligation, and onto the product as a permanently incomplete availability picture. **The thing annnä guarantees is exactly the thing it cannot guarantee, because the guarantee is scoped to a dataset it doesn't own.**

From the other side: B's student receives nothing in the calendar they actually use — no invite, no reminder, no artifact, because the delivery channel to non-users is parked. Just a no-show.

**Read-only free/busy ingest** — no writes, no invites, no CalDAV round-trip — would restore the guarantee at a fraction of full sync. The design never considers the middle. As written this isn't a scope decision, it's the adoption ceiling, and it's set in §0.

---

## 7. Questions worth your judgment

These are genuinely open, and they're yours — not the reviewers'.

**7.1 Is the interview the primary path, or the fallback?**
`04` asserts *"realistically there is no SOP, and they create it now, through the conversation."* **That empirical claim is false for your own flagship domain.** A PADI dive center cannot run an OWD except to the standards in the Instructor Manual — the SOP exists, is published, is identical across every center on earth, and the owner didn't write it. The same holds for the other three: D's rental agreement is a standard-form contract; E's rostering runs on duty-hour rules plus an incumbent scheduler; B's "SOP" is four fields Calendly collects in ninety seconds.

The design never compares the interview against a template gallery keyed to a certifying body, an SOP importer, or a plain form. If a pre-seeded "PADI OWD" template beats a 90-minute interview on time-to-live and completeness, **the primary artifact is a content library and the interviewer is the long-tail fallback** — which inverts the build order and relocates the moat into content that the design currently treats as free and unbuilt. It also makes the interview's known defects (no stop-condition, no coverage oracle) survivable, because a template ships with its own completeness.

Cheap falsifier: run the OWD interview with two dive-center owners who aren't you, and race it against a seeded template.

**7.2 Has the bounded-surface bet actually been tested?**
`04` claims the thesis is *"holding up across five wildly different domains."* B, C, D and E are not wildly different — they are **one shape sampled four times**: *a scarce physical or human resource is reserved for a bounded window subject to an eligibility predicate.* They differ in the capacity integer and the board count. Of course no new tool appeared.

Two adjacent, commercially obvious domains that break it in one step:

- **Sequence-dependent changeover** (paint booth, print shop, allergen-segregated kitchen). The gap after job X is a function of the ordered *pair* (X, next) — white after black = purge; black after black = 0. §13 defines buffer in exactly three forms, all functions of one commitment or one resource. And a rule gets one `target`; an ordered pair of commitment-types is not one of the three permitted kinds. The damage isn't a missing rule type — **`calculate`'s central primitive stops being well-defined**, because the size of a gap now depends on what you intend to put in it, so availability becomes a function of the board *plus the query*.
- **The class pack** — "10 dives, expires in 3 months, non-transferable." A cumulative entitlement drawn down over a period, with no instant. `04` defines capacity strictly as *"max concurrent consumption ≤ capacity at any instant."* **A board cannot hold a balance.** A dive center runs course packs; this is inside your own market.

Decision 4 is the justification for freezing the tool surface *now*, before the Engine exists. That freeze is being made on evidence that can't falsify it.

**7.3 Where do the customer, the order, and the money live?**
Every use case is a commercial transaction. There is no customer, no order, no price field, and no charge tool — yet §14's floor already gates *"charge"*, and `04` makes C's trigger *"a customer buys a package."* `who` defaults to self and isn't asked, so the customer isn't recorded as a party at all.

The system therefore cannot reason about the most common real event in any of these businesses: **a cancellation.** Customer cancels on day 2 — which commitments dissolve? Is the boat's day-3 slot released? Same customer books again — the system can't tell it's the same person. A refund is owed — no object holds it. In D the deposit and damage charge are the commercial point of the hold.

It also puts a hole in the thing §14 calls inviolable and testable: **a floor that gates "charge" can't be validated when charging is unrepresentable**, so Stage 3 has no test to write for a quarter of the floor's own enumerated verbs.

**7.4 Is an un-inspectable rule set acceptable?**
§13 names *"a franchise hand-off"* and *"an audited artifact"* as the reasons an SOP earns object status — and in the same breath parks the only thing that would make either possible: *"Management view is app-side — parked."* Combined with rules having no CRUD, **there is no assembled, readable representation of the rule set governing a business, at any layer, at any time.**

Four months in, bookings start landing wrong. The owner's only instrument is to ask the LLM which rules exist — asking the component that authored the state to report on state it may have authored incorrectly. No list, no diff, no last-modified, no "which conversation created this," no way to turn one rule off except to describe it well enough that the agent finds it.

Then run your own franchise case: what, exactly, is handed over? Its contents were never assembled anywhere a human can read them, and the receiving manager must re-derive the business's operating rules by interrogating a chatbot. In E, an assignment must be defensible to a union or a malpractice review, and §2 records no actor, no timestamp, and no rule-of-record.

This was filed as presentation. **The actual content of the decision is whether the product's output is inspectable at all**, and as specified the answer is no — which is also the only realistic path to trusting an LLM-authored rule set: seeing it.

---

## 8. Where the design decides things that belong to its user

Your own rule — *don't answer a question that belongs to another party* — is stated in §14.3 and then violated structurally in three places. Each is a case where the design picks a default instead of eliciting a decision:

| The design says | Whose decision it actually is |
|---|---|
| Decline cascade is "engine" | **The SOP author's.** Pause / re-solve one slot / commit partially is a business policy, and has no rule type, so it's never asked |
| "Races resolved with no hold by default" | **The author's**, and §13 half-admits it by making holds per-SOP — but the default only surfaces if the LLM mentions the palette |
| §14.2 persists an escalation answer as a rule | **The answerer's** — nothing asks "is this a one-off or a policy?", which is the only question that determines whether it should be stored at all |

The fix in all three is the same and is already in the document: **surface, ask, encode.** These are exactly the *"raw material"* §14.2 describes, and they were resolved by default instead.

---

## 9. What I could not attack, and what I got wrong

**Killed by the grounding refuter** (the record already answers these — I'm reporting them so you can see what didn't make the cut):

- *"An expired hold and a declined stakeholder have no terminal state"* — grounded out on §9.2 assigning runtime behavior to the engine. I think this refutation is **weak**: assigning a behavior to a layer doesn't give it a state, and §2 still has no `status` field to hold one. I've kept the substance in 1.3 and flagged it here rather than silently dropping or silently keeping it.
- *"Decline cascade closed by omission"* — grounded out because `04` does explicitly list it as open. The surviving version (3.3) attacks the closure in DESIGN.md, not the omission.

**Killed as nitpicks:** the *"notify a real person"* predicate objection (the floor triggers on verbs, not on a person/resource classification — the refuter is right), and the §3-vs-§10 "batched inquisition vs one question at a time" contradiction (§10's convention governs the design interview, not the product).

**What I could not attack.** Everything gated on the unbuilt Engine — the matching algorithm, race resolution semantics, the actual availability computation — is unreviewable, and that is the point of finding 2.6: the tool contract has **no result or error taxonomy**, so the loop's central branch (*"if ambiguous / conflicting / failed → stop and ask"*) cannot be written. Whether a multi-board placement can partially succeed, whether contention returns `pending` or an error, whether a hold is taken before or after confirmation — each produces a different next utterance, a different set of things the user can say, and a different undo obligation. That deferral is **undecidable, not untidy**, and it is why the harness cannot be validated in isolation as §11 claims.

That hole is already inside §4/§5, which the doc calls finished: decomposition creates child events one at a time, each joining the busy map immediately, so **partial progress is the specified model** — and nothing says what the agent owes the user when chunk 4 of 5 fails or the user abandons mid-negotiation.

**Coverage.** All 13 briefed decisions took at least one surviving finding. Decision 9 (generative UI) was reached only by the completeness critic, after nine lenses left it alone — worth noting, since it turned out to break D's entire precondition chain (3.5).

---

## 10. If I had to order the work

1. **Decide which contract is real** (2.6). Nothing else can be triaged until §11 and §13 agree. If it's the six-tool surface, §11's "fully specified" is false and §12 has no plan for the product in §0.
2. **Design the rule** — schema, operands, identity, and the vocabulary its predicates quantify over (1.2, 1.4). It is called the atom and it is the one thing with no specification. Everything in T2 is downstream.
3. **Give boards and rules a write path** (1.1). B doesn't work without it.
4. **Reconcile §2's schema with §13's lifecycle** (1.3, 2.2) — status, expiry, board refs, quantity, dependency edge, and an *actual* completion time distinct from the scheduled `end`.
5. **Model the principal** (1.5) — owner, actor, consent to consume a board. The floor is unenforceable without it, and 2.1 stays contradictory.
6. **Then** re-open the runtime-harness question (2.5) with the loop's trigger problem on the table.

Items 1–5 are all in the seam between §2 and §13. That seam is the design.
