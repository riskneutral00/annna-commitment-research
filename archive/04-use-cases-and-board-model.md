# 04 — T2 Use Cases & the Board Model (domain capture)

> ⚠️ **Historical — this is design *history*, not the build plan.** Preserved so decisions can be traced to their reasoning. Where anything here conflicts with a layer package (`harness/`, `engine/`, `app/`, `model/`), **the layer's `SPEC.md` wins.** Start at the [root README](../README.md).


*Captured 2026-08-03 from the design interview. This is **domain/exploration** capture — the raw use-case detail and the model it implies — kept even where it isn't used directly in the harness. Harness decisions live in `DESIGN.md`; this file is the reasoning behind them.*

The T2 use cases (persons A–E) are all the same *interaction pattern*: a user talks to the agent to author a rule/structure object that governs how commitments get created **in relation to other parties**, and the agent produces a generative-UI form to confirm/edit/add before it goes live. What differs is the *shape* of the relationship. B and C are the two poles.

---

## Use case B — the freelance teacher (recap: the "pull" pole)

The user publishes a scoped, rule-governed way for **others to come and take time off their board**. Set up once, publish a link, then wait. Students arrive and pick slots. See `DESIGN.md` §13 (the `Shared` resource).

---

## Use case C — the dive center (the "push" pole)

**Frame.** C is a freelance scuba instructor, but the real actor is the **dive center**. After a customer books a dive, the center must **go find every other stakeholder and confirm availability** — assemble everyone/everything needed for a successful dive. Some stakeholders are internal, some external (Person C is external). **For the app it does not matter whether a stakeholder is internal or external.**

**The trigger.** A customer buys a package — e.g., an **Open Water Diver (OWD) course**. The center has uploaded its **SOP**, which tells us the OWD runs **over 3 days**:
- **Day 1:** starts 9:00 am, **uncertain end ~2:00 pm** — varies case-by-case. The author should be able to *enter this uncertainty* when creating the rules for an OWD.
- **Day 2:** starts 7:30 (am), ends 5:00 (pm).
- **Day 3:** starts 7:30 (am), ends 7:00 (pm).
- The agent should infer **am/pm from context** — the user should not have to specify.

**The stakeholders/resources to assemble:**
- **Pool (day 1, confined diving).** First choice **Pool A**; if unavailable, default to **Pool B** (saved in settings). → *ranked fallback.*
- **Instructor.** The app finds the available, *appropriate* instructor. The student's **language requirement** selects **Person C**. Person C must then be **made aware of all conditions and the time required.** → *qualification-matched selection + push-and-confirm.*
- **Boat (days 2 & 3).** Could be the same boat or different — doesn't have to be the same.
- Many more stakeholders, many more rules — this is only a glimpse.

**Who's on the app:** assume the full spectrum. One extreme: **no stakeholder uses the app except Person C.** Other extreme: **every stakeholder uses the app.** The design must handle both.

---

## What C reveals about the model

### 1. The Board is the universal availability primitive
Not just a person's calendar. **People *and* resources each have a board.** A dive is a commitment that must be **satisfiable across many boards at once** (student ∩ instructor ∩ pool ∩ boat). "No-double-book" protects a *pool*, not only a person.

### 2. Occupancy is a number, not a boolean (capacity)
"One event per time slot" is not a rule — it's just **capacity = 1.** Generalize free/busy to a count, and every board is the same primitive with a different capacity:

| Board | Capacity |
|---|---|
| Person C (individual) | 1 — exclusive (can't do two things at once *for now*; future maybe overlap like lunch+meeting — not now) |
| Pool | N — concurrent divers for a duration |
| Equipment provider | N — inventory of units |
| Motorbike rental etc. (D, E) | N — inventory |
| Dive center | effectively unbounded — an aggregate/org board (can hold ∞ concurrent OWD courses in a time block) |

**Unified rule:** *max concurrent consumption ≤ capacity at any instant.* A commitment **consumes a quantity** of a board's capacity for its duration — a class of 6 consumes 6 pool-slots and 6 gear-sets for its window.

The "infinite courses in one time block" on the org board is a **rendering/scale** concern → the **app's** problem, not the harness's.

### 3. Push vs pull
- **B = pull:** others come take time off your board. Set-and-wait.
- **C = push:** a sale fans out; the owner goes and assembles stakeholders across many boards, notifying and awaiting confirmation. Active orchestration.

### 4. The SOP is a blueprint, not just constraints
In B the SOP is limits (buffers, caps). In C the SOP also **composes**: "an OWD *requires* 3 structured days + a pool + a qualified instructor + a boat." It expands one booking into a structured set of sub-commitments and resource requirements.

### 5. Stakeholder is a uniform abstraction
User / non-user / resource all **book-and-confirm through one interface**. *Which channel* (in-app / external message / settings lookup) is an **engine/app** concern; the harness treats a pool like a person.

---

## Rule-model axes surfaced by C (feeding the future "rule type-system")
- **Composition / requirement** — this commitment requires these sub-commitments + resources (SOP-as-blueprint).
- **Ranked fallback** — pool A else pool B.
- **Qualification-matched fill** — instructor by language predicate. (Confirms the 9-axis "executor: qualification".)
- **Time uncertainty** — a time field can be soft/estimated ("~2pm, varies"), not just fixed. *(Dents the settled RFC-5545 time model — revisit in the Engine layer.)*
- **Quantity / capacity** — boards declare capacity; commitments consume a quantity for a duration.
- **Push + confirm** — notify a stakeholder, await accept/decline, re-solve on decline.

## Layer assignment (from C)
- **Model (LLM):** am/pm inference; language→instructor reasoning; parsing SOP prose into structured requirements.
- **Harness:** authoring the rules (incl. capacity, fallback, uncertainty, requirements); the push/orchestration loop; stop-and-ask on ambiguity/conflict/failure.
- **Engine:** capacity enforcement; multi-board availability intersection; no-double-book by construction.
- **App:** rendering scale (∞ courses per block); the delivery channel to non-users.

## Open questions from C (not yet decided)
- **One harness or two?** Is C its own *push/orchestration* harness, distinct from B's *pull/intake* harness, on a shared engine? (Under discussion.)
- **Decline cascade:** if a stakeholder declines, does the whole plan pause, or does the agent re-solve just that one slot?
- **Is the customer's *sale* itself the trigger commitment** that everything else hangs off?
- **How much does the SOP-blueprint pre-decide vs. how much the agent solves live?**

## The handshake — A, B, and C are ONE operation (not push vs pull)

Push and pull are not two different things. They are the **one-sided (asymmetric) cases** of a single symmetric operation: **match availability across boards and place a commitment that satisfies all of them.**

- Teacher + student *both* on-app: neither "waits to be grabbed" — both say "grab a slot" and the system converges. A **handshake.**
- Wedding planner: same.
- Dive shop: could be an **off-app** party pulling inventory (looks one-sided), *or* every stakeholder on-app and it **all handshakes at once** to match availability.

So "push" (C) and "pull" (B) are just *how many participants are on-app and who initiates* — a **runtime variation, not a different job.** The underlying operation — reconcile N boards, place a satisfying commitment — is the same, and it is **engine**. This is true of A and B as much as C.

**Implication:** the T2 side is likely **one authoring harness**, not a push-harness plus a pull-harness. Direction is decided at runtime by who's on-app.

## Authoring is onboarding — the SOP is usually *created*, not uploaded

When a dive-center owner sits down with the agent, they **go through the whole process like teaching a new employee.** Ideally they insert an existing SOP; **realistically there is no SOP, and they create it now, through the conversation.** So the T2 authoring harness doubles as an **SOP-creation interview**: its output is a complete, self-consistent SOP (bundle of rules), whether uploaded or co-authored live. B's teacher does a tiny version; C's dive center does a large one — same job, different amount of content.

## The generality requirement — onboarding strangers

Unfair advantage: Matt will **personally onboard Person C and everyone in his own dive** (he is the actual first use case). But persons **E, F, G, H, I** he cannot personally onboard. So the authoring harness must be general enough to onboard **domains Matt has never seen**, with no hand-tuning. This is the concrete reason the harness must stay a **bounded, general interviewer over an unbounded rule-model** (see `DESIGN.md` — bounded surface / unbounded model), not a dive-specific script.

## Use case D — motorcycle rental (a simplified C, + holds & preconditions)

- Owner lists motorcycles online; customers **see inventory and pull a unit out** themselves (self-service; pull/handshake).
- Owner adds rules per unit — e.g. **12-hour cooldown after return** before it can be rented again (author picks the number). → *turnaround/recovery period keyed to the "return" state transition.*
- **Purgatory (tentative hold):** pulling a bike puts it in a hold — no one else can pull it — with a **time limit** (e.g. 1 hour) to complete requirements. → **a hold with expiry.** Crucially, the hold is a **per-SOP rule the author sets, not a global policy** — this **resolves the earlier global "no hold" lean** (default no-hold; an SOP may *require* a hold).
- **Preconditions to confirm:** inside the hold window the customer must **upload required documents** (passport, driver's license), **sign terms & conditions**, etc. Only then does the hold become a confirmed commitment. → *conditions-precedent gating hold→confirmed; required **artifacts** (file upload, signature, ID) as field/component types.*
- Matt's words: "a more simplified version of person C."

## Use case E — hospital ER scheduler (the most complex; the runtime stress-test)

- **10 rooms, each with its own SOP** for what may go in it — surgery / prepping / men / children, etc. → **each room is a board with an *admission predicate*** — a qualitative eligibility rule on the board (what *type* of commitment/occupant it accepts), generalizing capacity from a count to a type-match.
- A **full-time human "scheduler"** currently controls all ins/outs. **The app should replace the scheduler and do it automatically.** → autonomous orchestration is the ambition.
- **Advance time-off bidding:** staff put bids in **1–2 years ahead** to request time off. → **competing requests for scarce availability, resolved by policy** (seniority / precedence / quota) — a *bid/request* commitment with a resolution rule.
- **Live disruption:** someone is sick *now* → the schedule must **re-solve** so a replacement surgeon/nurse covers the cascade. → **real-time re-optimization under disruption** — the clearest case of a *runtime* job distinct from *authoring*.
- ER scheduling is among the most chaotic domains (Matt: "besides a war zone"). Deep domain web-research **offered** — capture here if pursued.

## What D and E added — content, not tools (the payoff)

**No new CRUD-style tool appeared.** D and E enriched the *model*, not the tool surface:
- **New rule-model axes:** hold-with-expiry (as a rule), conditions-precedent / required artifacts, turnaround-cooldown keyed to a state, board admission predicate, competitive bid + precedence resolution.
- **New component-catalog types:** file upload, signature, ID / document verification.
- **A commitment lifecycle / state machine:** `draft → tentative (hold: expiry + preconditions) → confirmed → in-use → returned/completed → cooldown`. States + transitions are engine/data; *which* apply is **authored via the T2 harness**; the agent *drives* transitions via tools. **[SUPERSEDED — this enum was not adopted. Live status is latches (`../engine/SPEC.md`, "Latches are write-once") plus the proposal enum (same file). This is the top grep hit for "commitment lifecycle"; it is history.]**
- **One genuine cross-cutting capability** (not plain CRUD): **notify-and-await-confirmation** (outward push + reply) — used by C (stakeholders), D (document collection), E (replacement-finding).
- **E alone raises a possible second (runtime) job:** autonomous live re-solve under disruption, escalating to a human only when no solution exists. Forcing case for the deferred runtime-harness decision.

This is the bounded-surface / unbounded-model thesis holding up across five wildly different domains: the domains poured into **content**, never into new tools.

## To be added
- Person **A** (the mirror of B) if detailed. Optional: ER-scheduling domain research (web) if pursued.
