# Critique Brief — Round One (verbatim prompt)

> ⚠️ **Historical.** This is the *verbatim prompt* given to an adversarial reviewer on 2026-08-03 — not a design document and not instructions to a builder. The results are in [`CRITIQUE-FINDINGS.md`](CRITIQUE-FINDINGS.md). Start at the [root README](../README.md).

---

You are an adversarial design reviewer. A product called annnä has completed the
design of ONE layer — its "harness" — and I want you to critique the decisions and
ask questions wherever they are underspecified, risky, contradictory, or wrong.

This briefing deliberately omits all rationale. You are NOT told why any decision was
made or why it might be right. Do not assume a decision is correct because it was made.
The reference documents contain the authors' reasoning — treat any such reasoning as
claims to be tested, not as givens.

────────────────────────────────────────
THE PROJECT
annnä is an AI-first product: a reimagined calendar called the "Board," driven by a
conversational agent the user talks to through a "console." The user speaks; the agent
creates and edits "commitments" on the Board. annnä is standalone — no external
calendar sync (no Google/Apple/Outlook). It is unrelated to any of the author's other
products.

ARCHITECTURE (four layers)
  - Model (the LLM): language, world knowledge, judgment.
  - Harness: the loop, the tool contract, the elicitation policy, the clarify/
    permission policy.
  - Engine: deterministic compute + storage behind the tools.
  - App: the console + the Board view + hosting.
Only the HARNESS layer has been designed so far. The Engine, Model, and App layers
have not. A stated principle is "thin agent / rich engine": the LLM translates and
narrates but does not compute correctness-critical values.

ROLE OF THE HARNESS
The harness is the scaffolding around the LLM for a given job. Its scope is exactly:
the agentic loop, the tool contract, the elicitation policy, and the clarify/permission
policy. Anything about storage, matching math, rendering, or delivery channels is
explicitly out of harness scope (assigned to Engine or App).

────────────────────────────────────────
DECISIONS MADE (stated flatly, no justification)

1. One `Commitment` object. No authored "event"/"task" types. event = has BOTH start
   and end (not completable); task = has at most one of {start, end} (completable).
   `title` is the only universal required field; all else optional. Type is derived.

2. Two harnesses are identified: Harness 1 = author your own commitments; Harness 2
   ("T2") = author the rules by which commitments involve other parties. T2 is decided
   to be ONE authoring/onboarding interview harness.

3. "Push" and "pull" are treated as the same single engine operation (a "handshake":
   reconcile several boards, place a commitment satisfying all). There is no separate
   "runtime harness." Live behavior (contention, holds, buffers, blocked-dependencies,
   re-solve) is assigned to the Engine and is in scope for v1.

4. Standing rule: a new domain adds content (rules), never new tools/harnesses; only a
   genuinely different agent job adds a harness. Harness count is treated as a late,
   reversible decision.

5. The Board is the universal availability primitive; both people and resources have
   boards. Occupancy is a number (capacity), not a boolean: person=1, pool=N,
   inventory=N, org≈unbounded. A commitment consumes a quantity of a board's capacity
   for its duration.

6. Commitment lifecycle (Kanban): draft → pending → blocked → active → complete →
   review. `pending` (a hold, waiting on its own preconditions) and `blocked` (waiting
   on another commitment, via a prerequisite edge) are kept as two distinct statuses;
   `blocked` is derived. "Cooldown" is not a status — it is folded into "buffer."

7. Ontology: the `rule` is the atom (it has a target — board / commitment-type /
   audience — and a type). An `SOP` is an OPTIONAL named bundle of rules that gains
   object-status only when it is a document (uploaded/versioned/audited). A `Shared` is
   an OPTIONAL publication of rules to an audience + scope. Every layer above
   Board+Commitment is optional; a rule needs no SOP; most users create neither an SOP
   nor a Shared.

8. Tool surface: `CRUD_Commitment` + `CRUD_Shared` + `CRUD_SOP` + `calculate` (one
   general read-only compute tool) + a generative-UI tool + `notify-and-await-
   confirmation` (+ possibly `publish`). Rules are managed where they attach, not via a
   `CRUD_Rule`.

9. Generative UI is a tool: the LLM emits a typed schema drawn from a fixed component
   catalog; a renderer maps types to vetted components; the engine validates the same
   types. The LLM composes, it does not invent widgets.

10. Clarify/permission policy: (a) an inviolable floor — no irreversible or outward-
    facing action (publish, notify a real person, charge, delete) without explicit
    confirmation or explicit standing authorization; (b) while authoring — surface
    gaps, ask, and encode answers as rules ("ask once"); (c) at runtime — proceed per
    the SOP, escalate only on a genuine gap/conflict/failure, to the appropriate party.
    A reversibility "dial" and author-tunable thresholds are deferred to Engine/content.

11. Consistency-checking: engine-verified. Latent inconsistency (within an SOP, or SOP
    vs. an existing rule) → alert, don't block. Active conflict (a new rule contradicts
    the SOP) → stop and require an explicit, stored override.

12. Time: RFC 5545 three-form model (floating / UTC-instant / date-only). UTC is the
    computation currency; IANA zone names only; shared commitments are always instants;
    a canonical zone is used only for recurring cross-zone events. (Note: a "time
    uncertainty" need — soft/estimated end times — was surfaced and is unresolved.)

13. Correctness is placed in the Engine: no-double-book by construction, atomic commit-
    time check, races resolved with no hold by default (a hold is a per-SOP rule).

CONTEXT: THE USE CASES THAT DROVE THE MODEL
  B — a freelance teacher publishes bookable availability to students.
  C — a dive center, after a sale, assembles many stakeholders/resources (pool,
      instructor, boat) to fulfill a multi-day course.
  D — a motorcycle rental with holds ("purgatory" + expiry), document/signature
      preconditions, and a post-return cooldown.
  E — a hospital ER scheduler: rooms with admission rules, advance time-off bidding,
      and live re-scheduling under disruption.

────────────────────────────────────────
WHERE TO READ THE FULL RECORD
(Paths as given to the reviewer in 2026-08. All of these files now live in this
`archive/` folder; DESIGN.md is no longer the source of truth — see its banner.)
  - DESIGN.md — the then-living spec.
    Section map: §0 product framing; §1 four-layer architecture; §2 the Commitment
    atom; §3 elicitation; §4 decomposition; §5 availability; §6 tool surface + loop;
    §7 time; §8 deferred/parked; §9 (resolved) threads; §10 conventions; §11 which
    harness; §12 build plan; §13 the T2 harness + ontology; §14 clarify/permission
    policy.
  - annnä-commitment-research/01-commitment-anatomy.md
  - annnä-commitment-research/02-data-models-event-vs-task.md
  - annnä-commitment-research/03-model-fields-and-board.md — the "what is a commitment"
    research.
  - annnä-commitment-research/04-use-cases-and-board-model.md — use cases B–E and the
    board/capacity model.
  - annnä-commitment-research/appendix-raw-research.md — raw sources.

────────────────────────────────────────
YOUR TASK
Critique these decisions. Find internal contradictions, unhandled cases, scope leaks
between layers, places the model will not stretch, and anything underspecified. Ask
questions wherever a decision is ambiguous or a case seems unaddressed. Do not soften
your critique to agree with the existing choices. If a decision looks wrong, say so and
say what breaks.
