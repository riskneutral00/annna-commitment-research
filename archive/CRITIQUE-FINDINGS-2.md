# annnä — Round-Two Adversarial Critique of the Revised Harness

> ⚠️ **Historical — this is design *history*, not the build plan.** Preserved so decisions can be traced to their reasoning. Where anything here conflicts with a layer package (`harness/`, `engine/`, `app/`, `model/`), **the layer's `SPEC.md` wins.** Start at the [root README](../README.md).


*Against `CRITIQUE-BRIEF-2.md`. Source of truth: `05-post-critique-decisions.md`, treated as authoritative over `DESIGN.md`. Round one is `CRITIQUE-FINDINGS.md`.*

*Method: 12 attack lenses → 2 refuters per finding (one hunting for text that already answers it or shows it is a re-raise, one asking whether anything actually breaks) → 3 completeness critics. 111 agents. **48 findings raised, 26 killed, 22 survived.** More than half died — round one killed 4 of 45. That difference is the most useful number in this document: most of what looked attackable in the revision turned out to be genuinely answered or honestly deferred. What follows is the residue, plus my own verification pass.*

---

## Verdict

`05` is a real revision, not a defensive one. Four of round one's five build-stoppers are structurally closed: the vocabulary layer exists, the principal exists, the commitment atom now holds the lifecycle, and the rule has an identity and a slot for a value. The refuters killed most attacks on those because the attacks were re-raises.

The problem is narrower and worse than round one's. Round one found a design split between two products. Round two finds **one mechanism, adopted from round one's own recommendation, that is wrong — and load-bearing.** `status` as a derived label over a set of unmet conditions cannot express `cancelled`, `declined`, `expired`, or `confirmed`. Four of the nine labels in the drafted enum are unreachable, and three of them are the ones the commercial layer, the hold, and the multi-party handshake all key off.

That mechanism came from me. Round one, §1.3: *"Status should be a derived label over an underlying set of unmet conditions, which is also how you'd get `cancelled`, `declined` and `expired`."* `05` line 157 adopts it and reports the result: *"adds cancelled/declined/expired §13 lacked."* The clause after the dash in my sentence is false, and `05` built on it. That is the first thing in this document because it is the thing I most owe you.

Second theme: **`05`'s fixes are correctly shaped and undertyped.** `operand (typed value)`, `attributes {…}`, `preconditions [artifact-spec: signature | id | payment | …]`, `end.role`, `provenance {author_utterance, normalized_by}` — five fields added to close five round-one findings, none carrying a declared domain, grammar, writer or validity rule. Round one's charge against the rule atom was *"a bundle of parameterless type tags."* That disease was cured on the rule and transplanted onto the commitment.

Third: the compliance moat is the most exposed decision in the document, and not for design reasons. It has no tenant field, no version, no effective date, no deviation path, no audit surface — and the content it depends on isn't yours to redistribute.

---

## 1. The mechanism round one recommended and `05` adopted is wrong

### 1.1 `cancelled` and `declined` are acts, not unmet conditions — nothing can write either

> `05:148–150` — *"status = DERIVED label over the SET of unmet conditions (draft / pending[own preconditions] / blocked[deps] / active / completed / review / cancelled / declined / expired)"*

The only condition-bearing fields in the atom are `preconditions[]` (151), `depends_on[]` (143) and `expires_at` (152). A cancellation is not a condition going unmet. It is a decision a principal made at a time.

**Walk it.** A 3-day OWD is cancelled the week before. Its waiver is signed, its deposit paid, its dependencies intact. **The unmet-condition set is empty.** The derivation returns `active`, then `completed` when the dates pass. There is no field whose value could have made it return `cancelled`. `cancel_order` — and note there is no `CRUD_Order` in the surface either — has nothing to write.

**Worse, the set is two-valued.** "Person C hasn't replied" and "Person C replied *no*" are the same unmet condition. They derive the same label. So decision 11's decline trigger has no observable state change to fire on, and the engine keeps re-notifying someone who already refused.

The only implementable cancellation is deleting the row — which destroys the payment precondition and the refund obligation that decision 8 called the commercial point.

> The refuter searched hard here and came back empty. `DESIGN.md:227` says `notify-and-await-confirmation` has *"a reply that feeds back"* without naming any field it feeds into.

### 1.2 The derivation is non-monotone in time — a late signature un-expires a lapsed hold and double-books the unit

`expired` looks derivable: `expires_at` passed **and** preconditions unmet. But that predicate reads only current state, and preconditions are monotonically satisfiable. Nothing forbids the last artifact landing after the timer.

**D, one bike, capacity 1.**

| Time | Event | Derived status |
|---|---|---|
| 10:00 | Wong pulls the unit. `consumes[{bike,1}]`, `preconditions[passport, licence, signature]`, `expires_at 11:00` | `pending` |
| 10:20 | Passport + licence land | `pending` — unmet `{signature}` |
| 11:00 | Timer passes | `expired` — hold-expiry trigger fires, unit must read free |
| 11:10 | Chen rents the same bike | — |
| 11:30 | **Wong walks in and signs.** Nothing forbids it; preconditions have no expiry of their own | unmet set is now **empty** → `expired` stops deriving → `active`, with `consumes[{bike,1}]` still live |

Two rentals, one bike. **No engine write ever violated "no double-book" — the violation is produced by a read**, and no gate in the design inspects reads.

To prevent it you need *expired once ⇒ expired forever*: a latch. Stored state, which is the exact thing "derived" denies. And `provenance {author_utterance, normalized_by}` has no actor and no timestamp, so the history that would let you derive the latch doesn't exist anywhere in the atom.

Note also what nothing says: at 11:00, was `consumes[{bike,1}]` removed? If yes, something wrote to a derived-status commitment. If no, every availability query must evaluate the status derivation for every commitment on every board, in the hot path.

### 1.3 `confirmed` is still absent, and the derivation makes that structural

Round one, §1.3: *"The interval [preconditions met, start time] maps to no legal status — and that is where every booking in B, C, D and E spends most of its life."*

`05:157` enumerates its own additions — *"adds cancelled/declined/expired §13 lacked"* — and `confirmed` is not among them. **I verified this by grep: zero occurrences in `05`.**

It isn't a missing enum member you can append. A commitment with an empty unmet set and a future start has, by construction, no defined value: `pending` and `blocked` are both keyed to unmet conditions, `active` is the running interval, `draft` is pre-commitment. The atom's own comment on `preconditions` reads `// gate confirm` — gating a transition into a state the status set does not contain.

"Is my booking confirmed?" is the single most externally visible fact in every use case, and it is what the charge gate, the hold release and the customer notification all key off.

### 1.4 What this costs together

Four of nine labels — `cancelled`, `declined`, `expired`, `confirmed` — cannot be produced by the stated basis. The brief lists status-as-derived as *"pending final confirmation."* **Don't confirm it.** The shape that works is what round one should have said: an event log of latched acts (`cancelled_at` / `declined_at` / `expired_at` / `confirmed_at`, each with an actor), with `pending` and `blocked` derived over the unmet set *underneath* those latches. Derivation is right for the conditions. It is wrong for the decisions.

---

## 2. Also stops the build

### 2.1 `actual_end ≥ scheduled end` makes an early finish unrepresentable — and it's the common case

> `05:138` — *"`actual_end` // actual done/returned; ≥ scheduled end (D4)"*, with completion = the later of the two.

Bike due Sunday 17:00, returned **Saturday 10:00**. That value cannot be stored. Written anyway, it's discarded by the constraint.

So `consumes[{bike,1}]` holds until Sunday 17:00, the 12-hour turnaround starts *from there*, and the unit frees Monday 05:00 — **roughly 31 hours late.** Walk-ins are refused against a bike sitting in the rack, and a repair block that must begin at the actual return can't be placed.

The spec's only workaround is to edit `end` downward, which destroys the scheduled-vs-actual distinction `actual_end` was added to preserve — and re-prices, re-derives and rewrites history.

The inequality was added to stop overrun from lying about availability. It solves that direction and forecloses the other. **Drop the constraint.** `actual_end` should be free, with `completed = actual_end ?? (end passed)`.

### 2.2 Auto-complete-by-clock makes every prerequisite self-satisfying

> `05:140` — *"`completed` = derived (event: end/actual_end passed; task: ticked)"* · `05:143` — *"`depends_on [ commitment_id ]` // materialized prereq edges → drives `blocked`"*

`depends_on` releases on `completed`. `completed` is a pure function of the clock. **Therefore every prerequisite edge in the system satisfies itself on schedule, whether or not anything happened.**

A no-showed or cancelled OWD day 1 un-blocks day 2 silently, and passes every consistency check. Combined with §1.1 — cancelled commitments also flip `completed` once their dates pass — this burns class-pack draws and records three completed course days for a student who never entered the water.

There is no value in the atom that means *this did not happen*: `actual_end` may only be ≥ scheduled end, and `cancelled` can't be produced by the stated basis.

### 2.3 A group class is unbookable in both directions

> `05:125` — *"Order — composition root grouping commitments that cancel together; carries customer + payment preconditions"* · `05:146` — `order -> order_id` (singular) · `04:51` — *"a class of 6 consumes 6 pool-slots and 6 gear-sets"*

The shop sells 4 seats in one 3-day course. Two ways to model it, both refused by the design's own rules:

| Modelling | What breaks |
|---|---|
| **One commitment consuming 4** | `order` is a single ref, so three customers are unrecorded — reintroducing exactly the gap decision 8 exists to close. Four waivers land in one flat `preconditions[]` with no attribution, so a missing one makes the whole class `pending` and the agent can't name who to chase. Then student 3 cancels and *"cancellation dissolves the order's commitments"* kills the course for the three who paid. |
| **Four commitments consuming 1 each** | All four sit concurrently on the instructor's board, capacity 1. *"Max concurrent consumption ≤ capacity at any instant"* refuses bookings 2, 3 and 4. Raising his capacity to 4 leaves him bookable for an unrelated private lesson in the same window. |

The modal product of the flagship domain has no representation. This one is new — `05` introduced it by making the order carry exactly one customer.

### 2.4 Partial cancellation has no object

`depends_on` releases a dependent only when its prerequisite *completes*. The atom has no writable fact for any of the three non-completing terminal states. So **any prerequisite that ends without completing leaves its dependents permanently `blocked` and permanently consuming their boards** — and the only stated cancel authority (all-or-nothing order dissolution) can free them only by also dissolving the days `05` has already auto-marked `completed`.

Cancel day 3 of a 3-day course. There is no object that partially dissolves. Note also that `parent` was in `DESIGN.md`'s schema, `05:125` says the order *is* the `parent` edge, and `parent` does not appear in the drafted atom — so `order`, `depends_on` and `parent` are three overlapping structures and one of them has quietly vanished.

### 2.5 `Rule` has no tenant — `authority: org` names a level, not *which* org

> `05:122` — *"Rule — id, authority, target(board|kind|audience), type, operand(typed), enabled, provenance"*

Every rule targeting a `commitment-kind` is gathered by kind. `authority` says `org`. Nothing says **whose**.

Shop X in Phuket authors `rule{authority: org, target: kind=OWD, type: composition, operand: [boat ×1 on days 2–3]}`. Shop Y runs OWD at an altitude quarry in Colorado and owns no boat. A customer buys an OWD at Y. The engine collects rules targeting kind OWD; **X's rule matches**, because nothing distinguishes X's org from Y's. Y's course derives `blocked` on a board class Y doesn't own, forever.

The escape — give each org its own copy of the kind — breaks the other horn: governing rules target `OWD@governing`, Y's extension is a distinct object `OWD@Y`, `target` is a single flat reference, and **no inheritance or subtyping semantics for kind references is specified anywhere.** On that reading the governing rules never reach the kind instances actually use, and the compliance guarantee evaluates over an empty set.

This is new, and it's newly load-bearing *because* `05` promoted kinds to shared, authority-leveled objects. Before decision 1, every rule attached to something with an owner.

### 2.6 A shop can delete the standard it cannot override

> `05:13` — *"the governing library is seeded and curated by the app administrator… not authored by each shop"*

Rules still have no write path of their own — `DESIGN.md`'s *"managed where they attach"* stands, and I verified `CRUD_Rule` appears nowhere in `05`. So a board's rules are a list edited through `CRUD_Board`, whose stated semantics are *"change any field."*

`update_board(rules=[my 5-minute buffer])` **silently deletes every seeded governing rule on that board.** Nothing specifies `CRUD_Board` as a diff rather than a replacement. The unoverridable standard is enforced at no point in the design.

And the seeder has almost no verbs: there is no `create_kind` (0 occurrences in either file) and no Template object in the consolidated model. `DESIGN.md:102` does gesture at one — *"…later `create_template` / `read_template` / … same shape"* — but "later" is doing the work there, and decision 1 has since made templates the **primary** setup path. The tool the primary path depends on is parked. `CRUD_SOP` is barred *"never otherwise"* — and if the seeder uses it anyway, then SOP is mandatory for the primary path and decision 5's *"a rule needs no SOP / every layer optional"* is false for most users.

Also unstated, and it decides whether the moat exists: when a shop adopts a template, does it get **a copy or a live reference?** That single unanswered question determines whether a PADI revision ever reaches the shops claiming compliance.

---

## 3. Fixes that are relabels

These are the most valuable findings in the round, because the record currently reads as though they're closed.

### 3.1 `terminal-constraint` is a name pasted on the derivation that caused the bug

| Round one 2.3 | `05`'s fix | Why it doesn't close |
|---|---|---|
| *"'Boat must be back by Friday 17:00' → end-only → also task → occupies nothing, so the engine books the boat out Friday 16:00–19:00"* | `05:137` `end { value, role: occupies \| deadline \| terminal-constraint }`, and `05:157` claims it resolved: *"'boat back by Friday' = terminal-constraint, not an occupy-nothing task"* | **Three lines below the role field, `05:139` restates the identical derivation:** *"temporal_type = derived (event if **occupying** start+end, else task)."* `terminal-constraint` is not an occupying role. The boat still has no occupying start+end, still types to `task`, still occupies nothing. |

The round-one failure reproduces verbatim. And it now also breaks completion: a terminal-constraint commitment is a task, tasks complete only by volition, so a resource's hard return time waits for a human to tick a checkbox.

Decision 4 opens by saying it *rejected* field-count derivation. The atom re-ships it with the word "occupying" inserted. Nothing states who writes `role` — it is a correctness-critical classification currently assigned to the LLM — what the legal combinations are, or what the engine does differently for `deadline` versus `terminal-constraint`.

### 3.2 `operand (typed value)` names the hole without typing anything

Round one 1.2 wasn't "add a slot." It was a six-row table showing each rule type needs a *differently shaped* operand, two of which don't fit one slot at all: ranked fallback needs an **ordered list of boards** (*"Pool B is unnameable"* with one singular `target`); dependency is **inherently two-place**.

`05` answers all six rows with two words. No operand grammar, no per-`type` schema, no `(type, target)` validity rule, no writer. `target` is still singular, so "Pool A else Pool B" is still unrepresentable unless the operand is secretly a board-ref list — stated nowhere.

And the enum is now internally inconsistent: `dependency` remains a listed rule type while the record says *"Instance-level facts (e.g. 'day 2 depends on day 1') are commitment fields, not rules."*

> That clause appears **only in `CRITIQUE-BRIEF-2.md:91–92`. It is not in `05` anywhere** — I grepped both files. So the statement that resolves the `dependency` contradiction exists only in the document written *about* the design, not in the authoritative record of it. Either `05` is missing a decision you made, or the brief asserts one you didn't. Worth checking before Phase 2 folds `05` into `DESIGN.md`.

**Nothing specifies who materializes a kind-level dependency rule** (the governing template's "day 2 requires day 1") **into the instance-level `depends_on[]`, or when.** `blocked` is computable in principle and unreachable in the flagship flow.

### 3.3 Attributes have names and values and no declaration object

Round one 1.4 said the harness authors rules but never authors the vocabulary they quantify over. `05` adds the layer — and adds only names and values. There is no Attribute object in the consolidated model, and `qualification = board-attribute ⊇ commitment requirement` is the only comparison operator the design names.

**`⊇` is a set operator, and the attributes it is asked to compare are not sets.**

- **Ordinal.** A certification ladder is ordered. Under `⊇` a rule requiring one grade rejects a board holding a higher one — *unless* the attribute stores the full set of ratings held rather than the top one. **`05` doesn't say which**, and the operator only works under one reading. That ambiguity *is* the finding; I'm not asserting the failure, I'm asserting nothing decides it.
- **Numeric.** Pool depth 5m against a requirement of ≥4m. `{5} ⊇ {4}` is false. "At least X" is inexpressible under the one stated operator.
- **Namespace.** The governing template declares `language-spoken` meaning *certified to teach in*. A shop, violating no stated constraint, adds `language-spoken` to its front-desk boards meaning *can converse in*. Now a governing predicate matches staff who aren't certified. The write is either rejected — so a shop can never author a local attribute sharing an English word (`level`, `class`, `category`, `depth`) — or accepted, so a governing predicate is evaluated against org-authored semantics. **Nothing in `05` picks.**

### 3.4 `composition` can't relate two variable counts — so the flagship rule can't be written

> `05:114` — *"`composition` = kind requires [sub-kinds × N] under predicates"*

A student-to-instructor ratio relates two quantities that both vary. No form in decisions 13–15 does that. The best normalization the stated forms admit is `composition: OWD requires [instructor × 1]` plus a capacity number on the pool — and then a booking with many students and one instructor satisfies both rules independently. Nothing relates the two numbers. A 3-instructor and a 1-instructor booking of the same class size are **indistinguishable to every rule form `05` defines**, and the compliance guarantee certifies the illegal one.

*(I'm stating the structure, not a ratio. You know the number; the point is that the model has no slot for it.)*

This also settles round one 5.1. That finding asked for two things: the author's utterance retained verbatim, **and** the stored constraint read back in domain language derived from the *structure*. `05` shipped the first. The second is impossible here, because the structure can't hold the constraint at all. Net effect: `author_utterance` now archives the correct sentence verbatim beside a normalization provably not equivalent to it, `normalized_by` records who mistranslated, and **no component compares the two.**

### 3.5 `preconditions[]` is the parameterless-type-tag disease, transplanted

> `05:151` — *"preconditions [ artifact-spec: signature | id | payment | … ]"*

Round one 3.5's surviving half was that **type-validity guarantees nothing** — a `signature` that typechecks is a well-formed blob; what a rental depends on is that a specific legal person assented. `05`'s field is a list of the same bare tags with **no `satisfied_by` principal, no timestamp, no evidence handle, no verifying authority, no revocation.**

Decision 3 then makes it strictly weaker by letting a payment precondition be *"marked satisfied by an integration **or manually**"* — a manual tick on the gate for the floor's `charge` verb, performed by an actor the atom has no field to record. The floor is billed as poka-yoke, *"structural and testable, not judgment-based."* A boolean-shaped, manually-tickable, actor-less precondition cannot support that test.

### 3.6 `provenance` is one scalar per record; a commitment's values have four authors

`provenance {author_utterance, normalized_by}` is a single pair per commitment. A single commitment's correctness-critical fields come from the customer's utterance, the governing template, the engine's resolution, and the LLM's inference. The field added to close round one's laundering hole **cannot mark which value carries engine authority.** And because it's written at creation, every record stored before the shape is corrected to per-field is permanently un-attributable.

### 3.7 *"An empty board means unknown, not free"* is a sentence with no field

Round one's exact words: *"**A board cannot declare** whether its emptiness means 'free' or 'unknown.'"* `05:36` restates the policy and closes it with *"(Consistent with this decision; not overridden by it.)"* — so it reads as settled. The Board object is still `id, owner, capacity|balance, attributes, zone`. **No field carries the declaration.**

And read universally the sentence breaks decision 2's own premise: if every empty board reads unknown, the user's own empty pool board is unknown too and nothing can be placed. Read narrowly, a field must mark which boards are authoritative proxies — and none exists. `consumes[{board_ref, quantity}]` has no slot for *"drawn subject to that owner's confirmation."*

### 3.8 The decline cascade was relabelled a second time

Round one §8 charged: *"Relabeling is not deciding."* `DESIGN.md` closed the decline cascade by calling it engine. **`05` closes it by calling it a trigger** — *"The loop can fire on a sale, a hold expiry, a decline, or a clock time."* That says the loop starts. It does not say what the loop decides.

Pause the plan / re-solve one slot / commit partially is still an author policy with no rule type. The enum has `fallback` and has nothing for *no fallback remains*. And decision 3's *"an order cancels together"* now actively **forbids** the partial-commit branch without saying so.

This is where use case C stops: Person C has already been notified — an outward, irreversible act — when the boat declines day 3, and nothing states whether days 1–2 stand.

**I verified: `"cascade"` has zero occurrences in `05`.**

---

## 4. Neither fixed nor on the not-yet-done list

Verified by grep, independent of the agents. These read as handled and aren't.

| Item | Round one | Status in `05` |
|---|---|---|
| `confirmed` | 1.3 | 0 occurrences · §1.3 above |
| Decline cascade | 3.3, §8 | `"cascade"` 0 occurrences · §3.8 above |
| Assembly-loop termination | 3.4 | 0 occurrences · §5.1 below |
| "Ask once" scope + correction path | 5.3 | `"ask once"` 0 occurrences. `provenance` is the provenance third of the triple; scope and correction are untouched |
| *"Shared ⇒ instant"* constrains the wrong object | 4.5 | `DESIGN.md:131` unchanged, restated verbatim in brief decision 4, absent from the list |
| Is the rule set inspectable at all? | 7.4 | The one judgment question that got no decision — while decision 1 makes it the moat. §5.2 below |

---

## 5. New holes the revision opened

### 5.1 Four trigger sources, no concurrency model

Round one walked the assembly loop: a 3-board OWD is invalidated by a walk-in during the human-latency window, re-solves, is invalidated again, and can starve behind single-board bookings. `05` makes `hold` a rule type and says nothing about bounded rounds, arbitration or ordering — **and then adds four independent loop triggers with no concurrency model.**

The failure moves from one loop racing walk-ins to N unattended loops racing each other for the same `consumes[]` draws, with no human present to arbitrate. And decision 6's claimed benefit is directly falsified: it fixes the deadlock *"where the turn-driven loop can't start with no human present,"* but a loop that starts unattended and whose central branch is still *"if ambiguous / conflicting / failed → stop and ask"* **has no one to ask and no stop-condition of its own.** That's a distinct hole from the T2 *interview's* stop-condition, which is the only one the not-yet-done list covers.

### 5.2 Compliance has no version, no effective date, and no read surface

`Rule` carries `provenance {author_utterance, normalized_by}` and nothing else: no source document, no standard version, no `effective_from`, no `superseded_by`. `Commitment` has no reference to the constraint set it was validated against.

So the first governing revision is a **destructive in-place operand edit** that changes the constraint set for every shop at once. `DESIGN.md`'s *"edit → re-derive everywhere"* then flips already-completed history to non-compliant, with no data left to reconstruct what was lawful at the time. Decision 2 makes annnä the only copy of that record.

And there is still no assembled, readable representation of the rule set governing a business — no list, no diff, no last-modified, no rule-of-record on a commitment, no actor and no timestamp on anything. The management view remains parked. **A compliance guarantee that cannot be read is not auditable**, and the admin curating the library has no read surface either.

### 5.3 `kind` is optional, so the whole predicate layer is opt-in

> `05:132` — *"`kind` -> commitment-kind // domain type; **optional** (bare commitments have none)"*

No gate in the atom, the tool contract, or the elicitation policy ever requires it. A commitment can reach `active` on a governed board with **zero predicate rules evaluated** — and be recorded as compliant rather than flagged as an exception.

The coverage critic pushed this further and I think correctly: `kind` is optional *because of* decision 1. Every rule target — board, kind, audience — is reachable only through an optional field (`kind`, `consumes[].board_ref`, `party`). **The only mandatory field is `title`, which is LLM-authored free text and targetable by nothing.** So making `kind` required wouldn't close it; the atom has no required field any rule can key on.

### 5.4 Pack expiry has no object to live on

The class pack — *"10 dives, expires in 3 months, non-transferable"* — puts `balance` on the Board. But the expiry date has nowhere to go: Board has no lifecycle fields, decision 14 forbids the rule route (*"instance-level facts are commitment fields"*), `consumes[]` forces the target to be a Board rather than an Order, and commitment `expires_at` is the hold timer. The balance check passes on a dead entitlement, and the shop learns it sold a dive it can't deliver when the customer arrives at the boat.

### 5.5 Money is represented with no amount

Decision 3 chose *"represent money, don't process it"* and shipped a boolean gate. **There is no amount, no currency, and no applied-versus-held-refundable field anywhere in the atom, the order, or the board**, and the `pricing` rule type has nothing to write its output into. A deposit is a partial payment against a total the model can't hold; the damage charge has no host object. The *"clean upgrade path to full processing without redesign"* is not available — a typed money shape is needed before any commercial preset can be authored.

---

## 6. Decisions that took no finding

The coverage critic's answers, which I think are right:

- **Decision 4 (RFC 5545) is essentially unattackable as a representation choice** — and that's worth saying plainly. What nobody attacked is that RFC 5545 is a *representation* standard, not an arithmetic one, and every new decision does arithmetic across forms. `actual_end ≥ scheduled end` compares two values whose forms are undeclared: a date-only "due Sunday" against an instant return is not a well-defined comparison. §2.1 argued that inequality on semantics; **the type-level version is a cleaner kill.** Separately, floating times follow the traveller, so a hold's `expires_at` measured against a floating anchor changes remaining life when the customer boards a plane — and resource-board timezones are not-yet-done, so a bike has no zone to resolve against.
- **Decision 2 (capacity as a number)** — the same defect §3.3 found for attributes applies to capacity: it's a bare integer with no unit and no declaration. A group class consuming 4 *seats* and a maintenance block consuming 1 *whole boat* both subtract from one unlabeled scalar, and nothing says 4 + 1 ≠ 5. Also `capacity | balance` is written as an XOR, and real boards need both — a boat has seats *and* a fuel draw; an instructor has capacity 1 *and* an annual training-hours balance.
- **Decision 3 (fixed component catalog)** — decision 10 retired *"new domain = content, never tools"* as unproven, but applied the retirement only to the CRUD surface. The component catalog is the same bet in a second location, and `DESIGN.md` §6 cites as *evidence* that D and E added three new catalog types — the same counterexample pattern that forced the downgrade, counted as a success.
- **Decision 12 (the meta-principle)** — both meta-principle findings hit adjacent targets, so the principle itself went unattacked. The sharpest version: decision 10 sits four lines above it and retires the generality claim as unproven, and decision 12 then re-asserts generality as a **binding design rule** with no oracle for what "general" means. Note it is also violated by the decision it claims conforms: a three-level totally-ordered `governing > org > individual` lattice modelled on "federal vs state" is a use-case shape, not a general one. A freelance teacher has no org. I'd rate this an argument rather than a break, but the principle currently can't refuse anything.

---

## 7. What this round did not test

**Use case E was never walked.** Zero contact across 111 agents — no finding mentions a room, a shift, a bid, a ventilator or a re-solve. Every lens drew its concrete example from C or D.

That matters more than a coverage gap usually would, because **E generated the two largest open items**: decision 11's escalation model with "no human reachable," and the not-yet-done "standing authorization / reconciling the floor with the silent engine." Those are being carried as open without ever being walked against the atoms that must implement them.

Four E-specific shapes nobody surfaced, worth walking yourself:

1. An **advance time-off bid** is a competing request over scarce availability, resolved by seniority. A bid consumes nothing, blocks nothing, and may lose. The atom has no losing-request representation and the status set has no `lost` or `superseded`.
2. A **live re-solve under disruption** moves commitments that are already `active` — and `active` is derived from the clock, not settable.
3. **Room admission predicates** generalize capacity from a count to a type-match, which §6's unitless integer can't express.
4. **Seniority** is an ordering over principals, and Principal has no attributes.

So the break count here is a floor, not a ceiling. Decision 12 says probes exist to falsify generality; running two of four and skipping the stress-test is the specific failure decision 12 was written to prevent.

**One claim asserted and never tested anywhere in the record**, including by me: `05:37` — *"The commitment atom must be general enough to absorb meal/workout/cycle/etc. as presets — **already the model, reconfirmed**."* Self-certified, with no supporting walk in `04`, round one, or round two. All four probes are commercial or institutional; none is personal. And it's load-bearing — the entire lock-in posture and the acceptance of round one 6.1 rest on *"everything the user schedules in their life is represented in annnä."* Applied against the revised atom it visibly strains: a cycle prediction is a retro-edited probabilistic observation with no party, no order, no preconditions and no `consumes[]`, and under decision 9 it auto-derives `completed` when its predicted end passes whether or not it happened.

---

## 8. Outside the design: the content business

The product critic's findings are not about internal consistency, and I'd rank the first two above most of §3.

**The moat is content you have no right to redistribute.** PADI Standards and Procedures, RYA syllabi and standard-form contracts are copyrighted and licensed to *members*, not to software vendors. Encoding them as machine-readable governing rules and shipping them to third-party shops is redistribution, and calling it "the PADI template" is trademark use implying endorsement. Nothing in the record contemplates a license, an agreement, or a naming convention. This fires the moment the first shop that isn't yours signs up. If the library requires a partnership per authority, annnä is a partnership-gated business with a per-authority BD cycle — a different GTM, timeline and fundraising story than self-serve SaaS. The alternative (each shop encodes the standard from its own licensed copy) is clean but destroys both the moat and the "admin-seeded, shop cannot override" model. **That fork is never taken anywhere in the record**, and it determines the company's cost structure.

**"annnä guarantees a shop runs to standard" is a warranty the product can't honor.** What annnä observes is the shape of the schedule. Conformance is about what happened in the water. There's no disclaimer, no scoping language, and no audit artifact showing which encoded rules were evaluated. Two hits: the first buyer with a risk officer routes "guarantees compliance" to legal and it won't clear procurement from an unproven vendor; and after any incident the shop's defense becomes "the software said we were compliant," which pulls annnä into the claim. The defensible version — *"this schedule conforms to standard X as encoded, version N"* — is narrower than what decision 1 banks on, and it needs §5.2's versioning to be true at all.

**No documented-deviation path.** Governing conflicts are *"rejected or flagged non-compliant"* with override forbidden. But encodings are sometimes wrong or stale, authorities grant variances, local law is sometimes stricter, and dual-agency shops run overlapping standards. There's no override-with-reason-and-audit-trail and no SLA for correcting a bad seeded rule. The person who hits this is a shop owner on a Saturday with a paying customer in front of him and a hard block from software he can't argue with. That single event churns an SMB account faster than any missing feature — and it's what makes people keep a shadow spreadsheet, which then breaks the complete-schedule premise.

**The primary path is empty on launch day.** Decision 1 names exactly one seeded artifact. One course is not one dive shop — a real center also sells Advanced, Rescue, Divemaster, Nitrox, EFR, Discover Scuba and fun dives, all of which fall to "the fallback." So the interview's known defects aren't survivable; **they're the product experience for every early account**, and both artifacts — the curation pipeline *and* a robust interview — must exist before first revenue. The build-order inversion doubles pre-revenue scope rather than reducing it.

**Day one has nothing to import and no way to declare baseline availability.** A shop's state is a paper daybook, WhatsApp threads and a spreadsheet. Import can't fill most of it. And since an empty board means "unknown," every internal staff and resource board starts unknown, so every booking fans out confirmation requests to everyone — **a system that generates more messages than the phone call it replaced**, in exactly the week a new account decides whether to continue. A default-availability pattern on the Board ("I work Tue–Sat 08:00–17:00") is the one primitive that makes "empty means unknown" livable. It's a general capability, so the meta-principle doesn't excuse its absence.

**Curation cost is named and never costed.** The workload is domains × authorities × jurisdictions × versions, each needing a domain expert on an annual revision cycle. Per-seat SMB pricing can't fund a standards-curation operation — that's a data-business cost structure attached to a software-business price.

---

## 9. The kill list, and what I'd argue with

**26 of 48 died.** That's the headline about `05`, not about the workflow. Notable kills:

| Killed | Why |
|---|---|
| "The floor gates any charge-initiating action gates nothing — money moves beneath the floor" | Consequence-rated nitpick: decision 3 defers rails to the Engine explicitly |
| "Decision 6 changes the trigger and nothing else — the other three harness parts are still console-only" | Refuted: the brief lists the escalation model as required work, not as done |
| "On a clock-triggered turn there is no actor, so the floor evaluates against a null principal" | Refuted: the principal/consent model is on the not-yet-done list |
| "`capacity \| balance` as an XOR is falsified by the design's own boards" | Refuted as a re-raise — though the coverage critic revived the *same* point in §6, and I kept it there. Judge for yourself; I think the refuter was too strict |
| "A class pack is a two-party entitlement a single-owner board can't hold" | Refuted, and the surviving version (§5.4, expiry has no home) is narrower and better |
| "No export + customer-as-party: the counterparty owes money, ID and a signature and can receive nothing" | Refuted as covered by "outward generative UI," which is on the list. I think this one deserved to live — the not-yet-done item is about *forms*, not about the counterparty having no channel at all |
| "`end.role` is single-valued, so a rental can't be both occupied-until-Sunday and due-back-by-Sunday" | Rated a nitpick. **I disagree** and am flagging it: it's the same object as §3.1, and single-valued `end.role` is exactly why `terminal-constraint` can't coexist with `occupies` |
| "The meta-principle has no decision procedure" | Not refuted, but rated nitpick — a critique of a rationale rather than a mechanism. I moved its strongest form into §6 |

**Three places I softened an agent's claim rather than pass it through:**

1. The certification-ladder example in §3.3. Ratings are cumulative, so whether `⊇` fails depends on whether the attribute stores the top rating or the full set held. `05` doesn't say. I made the ambiguity the finding rather than assert the failure.
2. I did not put a student-to-instructor number in §3.4. The structural claim doesn't need it and a wrong number would cost the document more than the example is worth.
3. §5.3's escalation from "`kind` is optional" to "no required field is targetable" is the coverage critic's, not a lens finding, and it wasn't run through refutation. It's the strongest form of the argument and it's also the least tested thing in this document.

**What I could not attack:** anything downstream of the Engine, which still doesn't exist. Several findings here — §1.2's read-produced double-book, §5.1's concurrency, §5.2's re-derivation — are only *provably* wrong once someone specifies the Engine, and each could turn out to be an Engine-level concern with a clean answer. I've flagged them as harness problems because the harness is what hands the Engine an unrepresentable state.

---

## 10. If I had to order the work

1. **Un-confirm status-as-derived-set.** It's on the brief as pending; don't confirm it. Split latched acts (`cancelled_at`, `declined_at`, `expired_at`, `confirmed_at`, each with an actor and a timestamp) from derived conditions (`pending`, `blocked`). This single change closes §1.1, §1.2, §1.3, §2.2 and §2.4, and it's the prerequisite for the commercial layer working at all.
2. **Drop `actual_end ≥ scheduled end`.** One constraint deletion. Closes §2.1.
3. **Give `Rule` a tenant, a version and an effective date.** `owner_org`, `effective_from`, `supersedes`. Closes §2.5 and §5.2, and it's what makes any compliance claim defensible.
4. **Specify the attribute declaration object and the operand grammar together.** They're the same problem — a type system — and §3.2, §3.3 and §3.4 all reduce to it. This is the largest remaining design task and it should be one task, not three.
5. **Decide copy-or-reference for adopted templates, and make `CRUD_Board` a diff.** Closes §2.6. Small, and the moat depends on it.
6. **Settle the content-rights fork before Phase 2.** §8. It determines whether the governing tier exists in the form decision 1 describes, which changes the atom.
7. **Walk E against the revised atoms.** §7. Everything above is validated against the two easiest probes.
