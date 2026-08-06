# annnä Harness — BUILD (ordered implementation plan)

*How a fresh agent session turns `SPEC.md` into a working, tested harness. Build against the stubs in `INTERFACES.md`; verify red-green against `SCENARIOS.md`. Do the steps in order — each depends on the one before. Nothing here requires a real Engine/Model/App.*

**Definition of done:** every `[MUST]` scenario passes against stubs; `[HELD-OUT]` probes are executed and their results recorded (not fixed); no harness code reaches across a seam except through the `INTERFACES.md` contracts.

---

## Step 0 — Project setup
- Create a project (language of choice; TypeScript recommended for the typed tool contract). Set up a test runner.
- Create the three stubs from `INTERFACES.md §5`: `EngineStub`, `ModelStub`, `AppStub`. Keep them deterministic and scenario-keyed.
- Wire an empty harness entry point: `handleTurn(input)` and `handleTrigger(event)`.
- **Verify:** the test runner runs; a trivial "echo" test passes.

## Step 1 — The object model (the atoms)
- Implement the SPEC §3 types as data structures: `Principal`, `Board`, `Commitment-kind`, `Commitment` (with the latched-status shape), `Rule`, `SOP`, `Shared`, `Order`.
- Implement the **derived** functions (pure, over stored structure): `temporal_type` (from roles), `completed` (`actual_end ?? end-passed`, or task-ticked), and `status = latch?.label ?? derive(unmet_conditions)`.
- Implement `needs_human` (the park) as a **stored field alongside `status`, not a status value** — set by the loop, cleared only by a human act, and always surfaced (SPEC §3.4).
- Correctness-critical values are typed handles from `EngineStub` — do **not** compute them here.
- **Verify:** C4, C5, C6, C7 (derivations); and unit tests that a set latch overrides derivation (precursor to C1–C3).

## Step 2 — The tool contract
- Define every tool from SPEC §5 with a typed signature and a declared **reversibility class** (`internal` | `outward:comms|value|destruction`).
- Route each tool to the correct seam: `calculate`→Engine, `CRUD_*`/rule-writes→Engine `commit` (as diffs), generative-UI/`publish`/`notify_and_await`→App.
- Enforce **diff-only** semantics for `CRUD_Board` and rule writes (never send a destructive replace).
- **Verify:** A1, A2, A3 (create/edit/task), A4 (conflict surfaced), A5 (tasks reserve nothing), G7 (SOP lifecycle via `CRUD_SOP`), H4's payload shape (board-blind), H6 (per-recipient token attribution), N2 (no tool declares `value-transfer`), D9 (no tool declares `destruction`), and that each tool exposes a reversibility class.

## Step 3 — The clarify/permission floor (M1)
- Implement the floor as a gate **at the tool boundary**: before any tool call, if its reversibility class is across-the-line, require a live confirmation OR a matching `Grant{action_class, scope, expiry}`; else raise an elicitation gap (gap-2). Never infer a grant.
- Attribute every across-the-line call `{who, basis, when}`.
- Implement `Grant` as a stored, addressable, revocable object.
- Implement the floor's refinements: outward prose is `narrate(structure)` + typed payload (never free composition); a signed document's **named** terms are a stored basis for recording their consequences; paid/settled marks classify as internal.
- **Verify:** D1, D2, D3, D6 (and D5's "owner-side floor on returned data"), D7 (narrated-not-composed), D8 (document-derived basis), N1 (marks are internal, attributed). This step must be airtight before anything acts outward.

## Step 4 — The elicitation policy
- Implement gap detection: gap-1 missing-required, gap-2 uncovered-crossing (from Step 3), gap-3 conflict (via `EngineStub.check_consistency`), gap-4 ambiguity (from `ModelStub.normalize`), gap-5 coverage (via `check_coverage`).
- Implement **propose-with-scope** (use `ModelStub.narrate` for read-back), **store-routing** (Rule/Grant/Board-field/Commitment-field/Exception), the **ask-once** check (scope ladder), **conflict handling** (governing hard-stop / own override-with-reason / latent alert / **unsatisfiable hard-stop with no override affordance, regardless of authority** — `../engine/SPEC.md §8` item 4, gated by F3b below), the **correction/impact** surface, and the **M2 go-live gate**.
- Implement the M2 classify gate: a governed-board commitment must resolve to a kind or an `exception` (make the illegal state unconstructable).
- **Verify:** B1–B5 (incl. the quota rule surfaced at the picker), E1–E3, F1–F3, **F3b (unsatisfiable pairs get no override affordance)**, G1–G6 (incl. template-Lego authoring).

## Step 5 — The loop
- Implement `handleTurn` (console utterance → normalize → plan → tool calls under the floor → **check-work** → narrate) and `handleTrigger` (sale / hold-expiry / decline / returned-form / clock).
- Implement **context assembly** (SPEC §8): standing frame + relevant slice per firing; the handoff frame for trigger firings — assembled from stored structure, never accumulated conversation.
- Implement **check-work**: verify committed structure against the normalized intent (read-back turn-driven, engine re-read trigger-driven); mismatch re-enters the loop (bounded), then escalates/parks. Termination = effect done **and verified** | gap to elicit | escalation.
- Implement **unattended behavior** against the objects at `SPEC.md §3.9`: the owner-scoped `OnCall` list and the stored `Escalation`. Walk the ladder on the virtual clock (`step_timeout` per rung, `total_timeout` overall); on exhaustion — including the empty-list and everyone-unreachable cases — **park** in a needs-human state, close the Escalation `timed_out_parked`, and surface it attributed to exhaustion. Never fire an ungranted across-the-line act. **Notification is not authorization:** reaching a rung creates no basis.
- Implement **auto-accept as a Grant** (`SPEC.md §7`): setup answers mint an ordinary Grant, matched by the same floor lookup as any other. **Do not build a second authorization path** — if the implementation grows one, that is the defect D10 tests for.
- Wire `AppStub.on_form_return` as a trigger source (the guest flow), and the hold/offer expiry as a trigger source (the clocked offer's cascade).
- **Verify:** D4 (unattended park), **D10–D11 (auto-accept is a Grant; it never widens)**, **D12–D17 (the ladder walks, notification is not a basis, exhaustion parks, empty list is not an error, in-app cannot be disabled, the park says why)**, C9 (a park never self-clears), K1–K2 (check-work, attended + unattended), L1–L2 (context assembly), H4 (returned form fires loop), C8 (offer lapses → cascades; late yes refused), **I1–I4 (the bind path: two H1s, no sixth seam verb, counterparty's floor, ordinary trigger)**, F4–F5 (version-of-record: governing and own terms), H1–H3, H5 (order/partial/group cancel + half-clear), H7–H8 (cancellation asymmetry + rebook offer), P1 (the proposal round-trip — loop + floor + elicitation + `resolve`/`commit(proposal_ref)` composed).

## Step 6 — Held-out probes & sign-off
- Run J1–J5 against the finished harness. **Record** each result. If a probe fails, write up *which general primitive is missing* (do not patch the atom to force a pass — that would overfit; escalate as a design finding).
- Confirm the full `[MUST]` suite is green.
- Produce a short BUILD-RESULT note: what passed, the held-out results, and any seam that turned out under-specified (feed back to whoever builds Engine/Model/App).

---

## Guardrails (from the project's standing rules)
- **TDD:** write the scenario test before the code that satisfies it. Every step above names its gating scenarios.
- **Thin agent, structural:** if you ever find the LLM authoring a correctness-critical literal, that's a bug — route it through `calculate`/`typed_value` as a handle.
- **Poka-yoke:** prefer making an illegal state *unconstructable* over validating against it after the fact (esp. M2 and the status latches).
- **Meta-principle:** if a probe or use case tempts a special-case, stop — build the general primitive it reveals, not the case. The use cases are falsification probes, not targets.
- **Scope:** build only the harness. If a task feels like board math, storage, rendering, or delivery, it belongs behind a seam (`INTERFACES.md`) — stub it, don't build it.

---

## Reading order for the builder
1. `SPEC.md` — what the harness is (esp. §2 inventory, §3 atoms, §4–8 the five responsibilities).
2. `INTERFACES.md` — what to stub and never build.
3. `SCENARIOS.md` — the acceptance suite; turn these into tests.
4. `BUILD.md` (this file) — the order to build them in.

History / rationale (not needed to build, useful if a decision is questioned): `../archive/DESIGN.md`, `../archive/05-post-critique-decisions.md`, `../archive/06-round-two-decisions.md`, `../archive/07-elicitation-mechanism.md`, and the two adversarial reviews `../archive/CRITIQUE-FINDINGS.md` / `../archive/CRITIQUE-FINDINGS-2.md`.
