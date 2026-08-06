# annnä — Harness & Commitment Design Spec

> ⚠️ **Historical — this is design *history*, not the build plan.** Preserved so decisions can be traced to their reasoning. Where anything here conflicts with a layer package (`harness/`, `engine/`, `app/`, `model/`), **the layer's `SPEC.md` wins.** Start at the [root README](../README.md).


*Started 2026-08-03. This **was** the living design doc during the design interview; it is **no longer authoritative**. It has been superseded by the four layer packages — most notably its commitment-lifecycle statuses (§ "Kanban-grounded"), which `06-round-two-decisions.md` replaced with latched, attributed events. Read it for reasoning, never for the current model. Companion to the research in this folder (`README`, `01`–`03`, `appendix`).*

---

## 0. Product framing

- **annnä** is an **AI-first "commitment harness"** — a reimagined calendar called the **Board**, driven by a conversational agent. Built from scratch around the agent, not a legacy calendar with AI bolted on. **Standalone — no external calendar sync** (no Google/Apple/Outlook). Unrelated to the founder's other products.
- The user interacts through a **console** (chatbot). They speak; the agent creates/edits **commitments** on the Board.

### Two senses of "harness" (kept distinct)
- **Agent harness** (what we are designing) — the scaffolding around the LLM: the loop, tool contract, elicitation rules, stop-and-ask policy.
- **The product** — the whole app, sometimes called the "commitment harness."
- **Personal Harness** (deferred) — each user's own learned rules/preferences/availability.

---

## 1. Architecture — four layers

| Layer | Owns |
|---|---|
| **Model** (LLM) | language parsing, world knowledge, judgment (e.g. "breakfast is daily", "dinner = 8pm", floating-vs-instant inference) |
| **Harness** | the loop, the tool contract, elicitation rules, the stop-and-ask/clarify policy, slot-tracking |
| **Engine** | deterministic compute + storage behind the tools (CRUD, availability, all time math) |
| **App** | console + the Board **view** (presentation), hosting, captures the device timezone |

**Core principle — thin agent / rich engine:** the LLM only translates speech → structured intent and narrates results. It **never computes a value that must be correct** (leave-by math, availability, quorum intersection, recurrence expansion, time arithmetic). The engine does all of that, exposed as tools.

**Key mental model:** *the Board is a **view** of the data, not a place the agent arranges.* The agent has no "arm." Its only hands are writing data (a tool call). Layout (e.g. "reverse-Tetris" stacking) is a pure function of the data, recomputed by the app on every render. The harness doesn't know layout exists.

---

## 2. The Commitment (the atom)

**One `Commitment` object. No `event`/`task` types** — the label is **derived, not entered**. The user never categorizes; the agent captures fields and the type falls out.

### Raw schema
| Field | Status |
|---|---|
| `id` | system (auto) |
| `title` | **required — the only universal must** |
| `start` | optional — date **or** datetime |
| `end` | optional — date **or** datetime |
| `who` | optional → **defaults to self** (not asked for now) |
| `recurrence` | optional — stored as a **rule** (LLM parses phrase; clarify if fuzzy) |
| `urgency` | optional (replaces "priority" — priority is *relative* so can't live on a single commitment; urgency is *intrinsic*) |
| `parent` | optional — set on child events, points to the source task |
| `notes` / `location` / `reminder` | optional |

### Classification (derived)
- **Event = has BOTH start and end.** Events are **not completable** (you don't mark an event done).
- **Task = has at most one** of {start, end} — start-only, end-only, or neither. Tasks **are completable**.
- `type = event if (start AND end) else task` · `completable = (type == task)`.
- start/end on a task carry **time-of-day**, not just a date — same precision as an event. The only difference is a task can't have both.

---

## 3. Elicitation policy (harness)

- **Bias toward event:** the agent actively tries to complete an event — it asks for a missing end time — and only lands on `task` when the user *explicitly* says there is no end.
- **Batched inquisition:** ask for everything a commitment needs in a few large chunked rounds, not one field per turn.
- **Persistent form + slot-tracking:** the form is a partially-filled object across turns; when the agent re-asks, known answers are already filled and it only chases empty slots. Can only "submit" once `title` is filled (and, if both times were given, they validate).
- **World knowledge lives in the Model, never hardcoded in the harness.** "Breakfast is daily", "dinner = 8pm" — the model supplies these, with discretion to confirm or not. The harness encodes *structure and guarantees*; the model brings *knowledge and judgment*.
- **Generative UI** (deferred detail, decision locked): the LLM emits a **typed schema** whose field types come from a **fixed component catalog** (date, duration, ranked-list, threshold, executor, scope-selector…); a renderer maps each type to one vetted component; the engine validates against the same types. LLM composes, never invents widgets. One type system spans LLM output, UI, and engine validation.

---

## 4. Decomposition

A **task → many child events**, linked by `parent`. The task persists (it owns the deadline/intent); the child events are the scheduled work toward it, each with both start+end (so each is a real event), each inheriting the task's title.

The harness loop for "finish by Friday, in 2-hour chunks per day":
1. **interpret** the decomposition spec — *LLM*
2. **find availability** via `calculate` — *engine, exact*
3. **create** one child event per slot, linked to the task — *engine*
4. **negotiate on failure** — no 2-hr slot Thursday → tell the user, accept "make it 1 hour", recompute — *LLM converses, engine recomputes*
5. user can move any child afterward; harness re-validates.

---

## 5. Availability

- **Occupancy = events only.** Events own a slot; tasks (≤1 time) never block time — until a task is decomposed into events, which then do.
- **Availability = gaps between events** within the search window, computed by the **engine** (never the LLM eyeballing). Each created child event immediately joins the busy map, so a multi-chunk decomposition can't double-book itself.
- **Blocked time (sleep, lunch) is just events** — usually recurring. No separate "no-schedule" primitive. The engine needs nothing beyond the board's events to compute availability.

---

## 6. Tool surface (the contract)

Two families. Naming = `verb_resource` (there will be other resources, e.g. templates).

**Mutations — CRUD per resource:**
- `create_commitment(fields)` — validates title, classifies event/task, rejects a double-booked event
- `read_commitment` — fetch by id, or query a window (replaces get + list)
- `update_commitment` — change any field (**move = update start/end**; no separate tool)
- `delete_commitment`
- …later `create_template` / `read_template` / … same shape.

**Computation — one general, read-only tool:**
- `calculate` — turns *rules + the board* into *concrete values*, changing nothing: free-time gaps, recurrence rule → dates, relative phrase → real date. One coherent job: "engine, work out a time value." (Avoids the **"tool zoo"** antipattern — one general tool, not `gaps`/`expand_recurrence`/`next_weekday`/…)

### The agent loop (per turn)
1. assemble context (system prompt + tool schemas + relevant board slice)
2. LLM → field values + tool calls, *or* a clarifying question
3. structural check (permissions, required fields) — before any write
4. execute engine tool(s)
5. if ambiguous / conflicting / failed → **stop and ask the user**; don't proceed
6. narrate; loop until the commitment(s) exist

---

## 7. Time handling (fully settled)

Root cause of ~all calendar time bugs: conflating two kinds of time. Adopt **iCalendar RFC 5545's three-form model** as the engine's source of truth (proven, correct — not reinvented). Standalone, so full fidelity, no interop compromises.

| Form | Use for | Stored as |
|---|---|---|
| **Floating** | solo personal routine ("breakfast 7am") | naive local time + rule — resolved to the user's **current** zone at compute/render; **follows the user when traveling** |
| **Instant** | anything shared, or tied to a place | wall time **+ canonical IANA zone** → derive UTC; recurrence expands in that zone |
| **Date-only** | all-day | a date |

**Rules:**
- Always **IANA zone names** (`America/Los_Angeles`), never bare offsets (offsets don't carry DST).
- **UTC is the computation currency** — all comparisons/overlaps/availability intersections done in UTC.
- **Expand recurrence in local/canonical zone, then convert to instants.** Compute "next fire" **lazily**; never materialize far-future UTC rows.
- **A shared commitment is always an instant, never floating** (floating fires at different absolute moments per member — incoherent for ≥2 people).
- **Group availability**: resolve each member's floating blocks through *their own current zone*, convert to instants, intersect in UTC. (This is also the story-D private intersection, made timezone-correct.)
- **Travel is free**: a member's current device zone drives both their floating resolution and their display; flying re-resolves everything automatically.
- **Canonical zone matters only for recurring cross-zone events** (it decides whose wall-clock stays fixed across DST — you can't keep two DST-differing zones both stable). Anchor = **location's zone → else creator's zone → else group-chosen**. Not a global setting; a per-commitment fact captured once. One-off events need no canonical zone — just a UTC instant.

Layer placement: Model infers floating-vs-instant; Harness asks only when travel/cross-zone is ambiguous; Engine owns all math; App captures device zone + renders in the viewer's zone.

---

## 8. Deferred / parked

- **Personal Harness** — learned fields (user habitually adds "restaurant" to lunches → auto-ask next time; never blocks). Deferred.
- **Enrichment** — derived attachments (restaurant name → map link). Deferred.
- **Field-status taxonomy** (when we build templates): REQUIRED (system/per-type; blocks) · OPTIONAL (system) · LEARNED (personal Harness; auto-asked, never blocks) · ENRICHED (derived; never asked). Template authors can also mark their own required fields.
- **T2 use-case templates** — how a whole domain (teacher / dive centre / ER) is authored from commitment templates. The five user stories (ET-A…E) live here.
- **Safety spine** — beyond the clarify policy: drift-vs-Gate vs undo. Parked.

## 9. Open threads (resume here)

1. **Clarify-vs-proceed policy — RESOLVED (§14):** a hard floor on irreversible/outward actions + ask-and-encode while authoring + proceed-per-SOP / escalate-on-gap at runtime; the reversibility dial and author-tunability parked to engine/content.
2. **Harness count — one authoring harness; no separate "runtime harness."** Runtime behavior — contention, `pending`, holds, buffers, `blocked` dependencies, re-solve — is **engine** (silent, automatic), present in *every* case (even the teacher), and is **v1**. There is no second *conversation*; the **same agent loop** steps in only to get a human decision when the engine is stuck (E's escalations are the heaviest such case, not a different job). Standing rule holds: *new domain = content; new job = harness* — no new job has appeared.
3. **Tool surface & SOP/Shared ontology — RESOLVED.** The **rule is the atom**; `SOP` and `Shared` are **optional layers** on top (each skippable — §13 ontology). Tool surface: `CRUD_Commitment` + `CRUD_Shared` + `CRUD_SOP` + `calculate` + generative-UI + `notify-and-await-confirmation` (+ maybe `publish`). Rules are managed *where they attach*, not via a `CRUD_Rule` zoo. Domains add **content**, never tools.

## 11. Which harness are we building (the synthesis)

The thing we set out to build is the **agent harness** — concretely four parts:
1. **The loop** — assemble context → LLM → structural check → execute tools → clarify-or-narrate.
2. **The tool contract** — `*_commitment` CRUD + `calculate`. The app implements the engine *behind* this contract; the harness only ever talks to the contract (the seam).
3. **The elicitation policy** — bias-to-event, batched inquisition, persistent form + slot-tracking, world-knowledge-is-the-model's.
4. **The clarify / permission policy** — stop-and-ask rules + structural checks before any write.

It **sits on** the engine (commitment store + `calculate`) and is **consumed by** the app (console + board view). The **personal Harness** and **T2 templates** are future layers *on top*, not part of the first harness. So the original charter is well-scoped and fully specified except (a) the clarify policy and (b) the app-side "hands."

## 12. Build & integration plan

Staged, engine-first (the contract is the seam, so each stage is testable in isolation):

- **Stage 1 — Engine + contract (no LLM).** Commitment store + CRUD + `calculate` (availability, recurrence, the three-form time model). Unit-testable alone. Deletes all sync complexity (standalone).
- **Stage 2 — Harness loop over the contract.** Wire an LLM to the tool schemas; the loop; slot-tracking; a system prompt encoding the elicitation policy. Test: scripted conversations → correct tool calls + correct data.
- **Stage 3 — Clarify/permission + decomposition + negotiation.** Stop-and-ask policy, structural pre-write checks, task→events loop with availability negotiation.
- **Stage 4 — Integration ("the hands").** Connect console UI ↔ harness ↔ engine ↔ store inside the app; capture device timezone; render the board view (reverse-Tetris projection). This is the part that required knowing the app — now known: standalone, own store.
- **Later.** T2 use-case templates (the 5 stories) · personal Harness (learned fields) · enrichment.

**Integration point:** the app hosts the engine + its own store; the console calls the harness; the harness talks only to the tool contract. One clean seam, no leakage of app concerns into the harness.

## 13. The T2 harness — the onboarding / SOP-authoring interview

**Scope note:** harness only. Engine / Model / App come after. See memory `project_annna_layered_design`.

**The reframe (the handshake).** "Push" and "pull" are **not** two jobs — they are the one-sided cases of a single engine operation: **reconcile several boards and place a commitment that satisfies all of them.** One side on-app looks like *pull* (B: a student takes the teacher's time) or *push* (C: the dive center chases stakeholders); everyone on-app is a **handshake** (all boards match at once). Direction is a **runtime** fact — *who is on-app and who initiates* — not a difference in the user's job. So **B and C are the same job**, and the matching itself is **engine**. (Applies to A too.)

**What the T2 harness is:** **one authoring / onboarding interview.** The user sits with the agent "like teaching a new employee," and the agent **extracts — or co-writes, when none exists — a complete, self-consistent SOP** (a bundle of rules) for a *kind* of commitment. The teacher writes a tiny SOP; the dive center writes a large one — **same job, different amount of content.** Afterward the engine handles all matching / pulling / pushing / handshaking on its own.

**Standing rule — what creates a new harness:**
> **New domain → new *content* (more rules). New *job* → new harness.**

Dive shop, teacher, motorbike rental (B/C/D/E … Z) are different **domains**, not jobs → they add rules, never harnesses. A new harness is warranted only when the agent's *goal / questions / stop-condition* genuinely differ. The **one open candidate** for a second job is **live runtime negotiation** (talking to someone *while* a handshake or a decline happens) vs. **authoring**. That decision is **deferred and reversible** — it costs ~one system prompt + stop-condition, touches neither engine nor data model, so we decide it only when a real case forces it. If needed, it's likely the *same agent loop* doing a small follow-up, not a separate harness.

**The board is the universal availability primitive.** People *and* resources have boards; a commitment must be satisfiable across **all** the boards it touches. Occupancy is a **number, not a boolean** — capacity: person = 1, pool = N concurrent, inventory/rental = N units, org ≈ ∞. A commitment **consumes a quantity of a board's capacity for its duration** (class of 6 → 6 pool-slots + 6 gear-sets). *Enforcement is **engine**; authoring the capacities/rules is harness.* (Full detail: `04-use-cases-and-board-model.md`.)

**Ontology — layered, every layer OPTIONAL above the base (resolved 2026-08-03).** Neither `SOP` nor `Shared` is primary; the **rule is the atom**, and SOP/Shared are optional compositions on top of it (mirrors: the Commitment is the atom; event/task are derived).

```
Board + Commitment      ← always present (the base — Harness 1)
   └─ Rule              ← optional; attaches DIRECTLY to a target (board / commitment-type / audience)
        └─ SOP          ← optional; a named/versioned BUNDLE of rules — earns object-status only as a *document*
             └─ Shared  ← optional; a PUBLICATION of rules to an audience + scope
```

- **A rule needs no SOP.** The teacher's 5-min buffer is just a rule on his board — no SOP anywhere. You can **stop at any layer**; most users trigger neither `CRUD_SOP` nor `CRUD_Shared`. ("What if there's no SOP?" → nothing breaks; there are just rules, possibly zero.)
- The **atom is a `rule`**: it carries a **target** (board / commitment-type / audience) + a **type** (buffer, capacity, precondition, admission-predicate, fallback, dependency…). Toggle on/off, edit, compose.
- An **SOP is an editable *bundle* of rules** — optional, and it earns real identity **when it is a document** (an uploaded file / a named, versioned playbook / an audited artifact / a franchise hand-off). When present it's a **live source of truth** (edit → re-derive everywhere). Rules enter two ways: **spoken** (the rule itself is the truth — no document) or **parsed from an uploaded SOP** (the document is the source). Not sacred — user-editable. Management **view is app-side — parked.**

**Commitment lifecycle — Kanban-grounded (statuses).** `draft → pending → blocked → active → complete → review`.
- **pending** = reserved but unconfirmed (the *hold* / "purgatory") — waiting on **its own preconditions**: documents, signature, the expiry timer.
- **blocked** = waiting on **another commitment** to happen/complete first — a **prerequisite edge** between commitments (event↔task, any direction). **Derived, not entered:** you declare "X depends on Y"; the system computes "blocked" while Y is unmet and un-blocks automatically when Y completes. Distinct from `parent` (which is decomposition).
- **pending and blocked are two distinct statuses** (waiting on *own preconditions* vs. waiting on *another commitment*) — confirmed.
- **active** (in use) → **complete** → **review** (needs a human look: an escalation/approval).

States/transitions are engine/data; *which* apply is **authored via this harness**; the agent drives them via tools. A **hold** is a **per-SOP rule, not a global policy** — supersedes the earlier "no hold" (default off; an SOP may require one with expiry + preconditions).

**"Cooldown" is not a status.** The 12h post-return gap is a **buffer on the *resource*** (turnaround) — the same buffer primitive applied to a board's availability after a commitment ends. Folded into buffer; removed from the lifecycle.

**Surfaced palette (authoring UX).** The authoring agent **proactively offers** high-value optional capabilities so authors know they exist (most won't think to ask) — chiefly **hold** (tentative + timer) and **buffer**. Buffer has three applications: a **static breather** (±N min); a **dynamic travel-time buffer** — `buffer = calculate(travel time, location A → B)`, so the next booker sees reduced availability (not 10:00 but 10:30) after a located commitment; and **turnaround** (a buffer *after* a commitment ends, on the resource — the bike's 12h). Location becomes load-bearing where travel buffers are on.

**Rule-model axes harvested (B→E)** — the *content* the type-system must express, and why the tool surface stays small: buffers (static / travel-time / turnaround) / caps / precedence / pricing / scope (B); composition-requirement, ranked-fallback, qualification-matched-fill, time-uncertainty, quantity/capacity, push+confirm (C); hold-with-expiry, conditions-precedent / required-artifacts (D); board-admission-predicate, competitive-bid + precedence-resolution, **prerequisite/dependency edge** (`blocked`) (E). New component-catalog types: file upload, signature, ID/verification.

**Consistency-checking (harness surfaces, engine verifies):**
- *Latent* inconsistency (inside an SOP, or SOP-vs-existing-rule) → **alert, don't block.**
- *Active* conflict (a new rule contradicts the SOP now) → **stop and require an explicit override**, stored so it's asked once. Conflict branch of the clarify-vs-proceed policy (§9.1).
- Detection is **engine-verified**; the model only **normalizes** a rule into a structured constraint — it never *decides* a clash.

**Tools:**
- **`CRUD_Shared`** — manages the optional **publication**: a `Shared` references rules/an SOP + an audience + a scope. *(name locked 2026-08-03; replaced "CRUD_Template".)*
- **`CRUD_SOP`** — manages the optional **document/bundle**; touched only when a user uploads or names a playbook, never otherwise.
- **Rules** are managed *where they attach* (on a commitment / board / shared) — like fields, **not** a separate `CRUD_Rule` tool zoo. Most users trigger neither `CRUD_SOP` nor `CRUD_Shared`.
- **More than CRUD** (D/E added **no new tools** — the surface is now stable): a consistency-check call, a preview / "what would this expose" read (`calculate`-family), an SOP-parse call, possibly **`publish`** as a real lifecycle step (draft → live, gated by the pre-publish confirmation), and a **notify-and-await-confirmation** verb (the push/handshake outreach, with a reply that feeds back). Everything else D/E surfaced landed as *rule-model content* or *commitment states*, not tools.
- **Generative UI is a tool — shared across all harnesses:** *"present this catalog-typed schema as a form, return validated input."* Keeps the LLM composing only from vetted component types while the engine validates the same types. Used for slot-filling (Harness 1) and the pre-publish confirm/edit/add form + SOP review (T2).

**Parked to later layers (NOT harness):** no-double-book by construction, atomic commit / race resolution, contention→`pending`, hold + expiry timers, buffer / travel-time computation, `blocked`-dependency resolution, capacity enforcement, live re-solve, the matching/handshake computation → **engine** (all **v1** — can't ship without them). Rendering scale (∞ per block), delivery channel to non-users, SOP management view → **app**.

## 14. Clarify / permission policy (resolved)

The harness's answer to *"proceed silently, or stop and ask?"* — reframed from a binary into **a floor + phase behaviors + a deferred dial.** Correctness is **structural** (a floor), not left to the model's judgment (poka-yoke).

**The reframe.** "Ambiguity" is *not* the driver — the **cost of being wrong** is (**reversibility × stakes/outwardness**); ambiguity only raises the odds of a wrong guess. And an authoring product has a **third move** beyond proceed/ask: **encode** (ask once, store as a rule).

**1. The floor (inviolable — harness-enforced, never tunable below it).**
No **irreversible or outward-facing** action — `publish`, notify a real person, charge, delete — without **explicit confirmation** *or* **explicit standing authorization.** Structural and testable, not judgment-based. (Matt's standing caution rule, made a hard floor.)

**2. Authoring behavior — ask-and-encode.**
While building an SOP, gaps / ambiguities / conflicts are the *raw material.* Surface them, ask (batched, §3), and **persist the answer as a rule** so it's asked once. **Bias to ask** — a wrong silent guess becomes a permanent rule. (This *is* the authoring harness.)

**3. Runtime behavior — proceed-per-SOP, escalate-on-gap.**
At runtime the SOP has already answered; the engine proceeds automatically. Stop only on a true gap / conflict / failure, and **escalate to the right party** — policy gaps → the **author**; situational choices → the **live party**; never answer a question that belongs to a different party (Matt's "don't decide what another party should decide"). Where possible, capture the resolution **back into the SOP** so the gap closes.

**Conflict sub-rule (from §13):** an active rule/SOP conflict → stop + require an explicit, **stored** override (asked once).

**Deferred to engine/content (NOT harness):**
- the **reversibility dial** for the middle ground (reversible + low-stakes → proceed & let the user correct; costly/irreversible → confirm);
- **author-tunable thresholds** *above* the floor (an ER may require human approval per assignment; a bike shop may auto-confirm everything).

## 10. Standing conventions

- Product name is always **annnä** (voice-to-text produces Ana/Anna/ann/annnnna — always normalize).
- One question at a time in interviews, with a recommended answer.
- We design **one layer at a time**: Harness → Engine → Model → App. Currently: Harness only.
- **New domain → new content (more rules); new *job* → new harness.** Different domains never multiply harnesses; only a genuinely different agent goal/stop-condition does. Harness *count* is a late, reversible decision — never baked into the engine or data model.
