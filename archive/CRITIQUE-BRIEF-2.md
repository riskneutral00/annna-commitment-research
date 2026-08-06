# Critique Brief — Round Two (verbatim prompt)

> ⚠️ **Historical.** This is the *verbatim prompt* given to an adversarial reviewer on 2026-08-04, against the revised harness — not a design document and not instructions to a builder. The results are in [`CRITIQUE-FINDINGS-2.md`](CRITIQUE-FINDINGS-2.md). Any "still open" list below reflects 2026-08-04, not today. Start at the [root README](../README.md).

---

You are an adversarial design reviewer. A product called annnä has designed one layer
— its "harness" — and then revised that design after a first round of critique. I want
you to critique the REVISED design and ask questions wherever it is underspecified,
risky, contradictory, or wrong.

This briefing deliberately omits all rationale. You are NOT told why any decision was
made or why it might be right. Do not assume a decision is correct because it was made.
The reference documents contain the authors' reasoning — treat any such reasoning as
claims to be tested, not as givens.

A first critique already ran (`CRITIQUE-FINDINGS.md`). Its findings were triaged: some
adopted as fixes, some deferred, some turned into decisions. **Do not re-report a
finding that has already been resolved** — unless you judge the resolution itself is
wrong, in which case attack the resolution. Your value is in (a) whether the fixes
actually close the holes, (b) new holes, and (c) the parts still marked not-done.

────────────────────────────────────────
THE PROJECT
annnä is an AI-first product: a reimagined calendar ("the Board") driven by a
conversational agent the user talks to through a "console." The user speaks; the agent
creates and edits "commitments" on the Board. The product is standalone (import IN
allowed, no export/sync OUT beyond a legal minimum) and is designed on the assumption
that a user's entire schedule eventually lives in annnä.

ARCHITECTURE (four layers): Model (LLM) / Harness / Engine / App. Only the HARNESS is
being designed. Stated principle: "thin agent / rich engine" — the LLM translates and
narrates, it does not compute correctness-critical values.

ROLE OF THE HARNESS: the scaffolding around the LLM for a given job — the loop, the
tool contract, the elicitation policy, and the clarify/permission policy. Storage,
matching math, rendering, and delivery channels are out of harness scope (Engine/App).

────────────────────────────────────────
CURRENT DECISIONS (stated flatly, no justification)

A. Carried from the original spec and still standing:
1. One `Commitment` object; `title` is the only universal required field.
2. The Board is the universal availability primitive; both people and resources have
   boards; occupancy is a number — capacity — not a boolean.
3. Generative UI is a tool: the LLM emits a typed schema from a fixed component
   catalog; a renderer maps types to vetted components.
4. Time uses RFC 5545's three-form model (floating / UTC-instant / date-only); IANA
   zones; shared commitments are instants. (The "fully settled" label was withdrawn.)
5. The `rule` is the atom; `SOP` and `Shared` are optional layers above
   Board+Commitment; a rule needs no SOP.

B. Changed or added after the first critique (authoritative record:
`05-post-critique-decisions.md`):
6. Templates are the PRIMARY setup path; the live interview is the fallback. Templates
   are authority-leveled (governing / org / individual): a governing template (e.g. a
   certifying body) defines rules AND the commitment-kinds/attributes; org and
   individual may extend but not override governing ones. Governing content is
   admin-seeded.
7. Import IN is supported; no export/sync OUT beyond a legal minimum. Design assumes
   annnä holds the complete schedule. External stakeholders (who never had an app)
   assert availability via confirmation; an empty board means "unknown," not "free."
8. Commercial layer: a customer is a first-class party; an `order` is a composition
   root that cancels together. Money is REPRESENTED, not processed — a payment is a
   precondition artifact; the floor gates charge-initiating actions; payment execution
   is deferred to the Engine.
9. Completion: an event auto-completes when its end passes ("completed" = in the past);
   resource-bound/overrun commitments also carry an `actual_end` (≥ scheduled end) and
   completion is the later of the two; tasks complete by action, not by time. Time
   fields carry ROLES (occupies / deadline / defer / terminal-constraint), not bare
   presence. (This reversed an earlier "both times ⇒ event ⇒ not completable" rule.)
10. The "bounded tool surface / new-domain-adds-no-tools" claim is downgraded to
    unproven. A `balance`/entitlement is added to boards (for cumulative draw-down like
    a class-pack). Buffers stay open to pair-dependence; a pair-dependent changeover
    engine is deferred.
11. No "runtime harness" is scoped to any use case. The loop becomes trigger-driven
    (fires on a sale / hold-expiry / decline / clock time, not only a console turn).
    An escalation model is required, including behavior when no human is reachable.
12. Meta-principle: the harness is designed as a GENERAL capability; no decision caters
    to a specific use case. The use cases (teacher / dive shop / rental / ER) are
    falsification probes for generality, not design targets.

C. The atoms, as currently drafted (in `05`):
13. Vocabulary layer: a `commitment-kind` (e.g. OWD, rental) carries an attribute
    schema; boards carry attributes; predicate rules (admission / qualification /
    composition) quantify over those attributes. Kinds and attributes are
    authority-leveled. Templates/SOPs bundle kinds + rules.
14. `Rule` = { id; authority (governing|org|individual); target (board |
    commitment-kind | audience); type (buffer|capacity|balance|hold|precondition|
    admission|qualification|fallback|dependency|pricing|…); operand (typed value);
    enabled; provenance {author_utterance, normalized_by} }. Instance-level facts
    (e.g. "day 2 depends on day 1") are commitment fields, not rules.
15. `Commitment` = { id; title; kind; attributes; start{value,role};
    end{value,role}; actual_end; temporal_type (derived); completed (derived);
    consumes[{board_ref,quantity}]; depends_on[commitment_id]; party; order;
    status (DERIVED over the SET of unmet conditions: draft/pending/blocked/active/
    completed/review/cancelled/declined/expired); preconditions[artifact]; expires_at;
    provenance }.
16. Objects: Principal/party (board owner, turn actor, order customer); Board (owner,
    capacity|balance, attributes, [zone open]); Commitment-kind; Rule; SOP (optional
    bundle, document identity when uploaded/named); Shared (optional publication);
    Order (composition root). `CRUD_Board` is added to the tool surface.

────────────────────────────────────────
STILL OPEN / NOT YET DONE (fair game, but know they're unfinished, not overlooked)
- `status`-as-derived-from-conditions is pending final confirmation.
- Write-path details; the principal/consent model; defining "standing authorization"
  (the floor's escape hatch) as a real, scoped, revocable, action-classed grant;
  reconciling the floor with the silent/automatic engine.
- Choosing ONE tool contract and rewriting the build plan; making "thin agent" a
  STRUCTURAL guarantee (correctness-critical values as opaque handles from a compute
  tool, never LLM-authored literals).
- Coverage (not just consistency) checking; which clash classes are engine-decidable;
  the T2 interview's stop-condition and save/resume/abandon; outward generative UI
  (forms delivered to off-console parties); time-uncertainty; resource-board
  timezones; duration value grammar; recurrence occurrence-addressing.
- Documentation consolidation: `DESIGN.md` still contains text superseded by `05`.

────────────────────────────────────────
WHERE TO READ THE FULL RECORD (paths given from Desktop)
- annnä-commitment-research/05-post-critique-decisions.md — CURRENT decisions (Phase 0)
  and the revised atoms (Phase 1). **Authoritative where it conflicts with DESIGN.md.**
- annnä-commitment-research/DESIGN.md — the original spec. Section map: §0 framing;
  §1 architecture; §2 commitment atom; §3 elicitation; §4 decomposition; §5
  availability; §6 tool surface + loop; §7 time; §8 parked; §9 threads; §10
  conventions; §11 which harness; §12 build plan; §13 T2 harness + ontology; §14
  clarify/permission policy. **Partly superseded by `05` — treat `05` as the amendment.**
- annnä-commitment-research/CRITIQUE-FINDINGS.md — the FIRST critique (already triaged;
  don't re-raise resolved items).
- annnä-commitment-research/01-commitment-anatomy.md,
  annnä-commitment-research/02-data-models-event-vs-task.md,
  annnä-commitment-research/03-model-fields-and-board.md,
  annnä-commitment-research/04-use-cases-and-board-model.md — research + use cases.

A phased revision plan exists; `05` is its running record. Phases 2–5 (substrate,
contract, policies, doc hygiene) are not yet executed.

────────────────────────────────────────
YOUR TASK
Critique the revised design. Test whether the Phase-0 decisions and the new atoms
actually close the first critique's holes or merely relabel them. Find new
contradictions, unhandled cases, scope leaks between layers, places the atoms won't
stretch, and anything underspecified — including in the not-yet-done list. Ask
questions wherever a decision is ambiguous or a case seems unaddressed. Do not soften
your critique to agree with the existing choices. If a decision or a fix looks wrong,
say so and say what breaks.
