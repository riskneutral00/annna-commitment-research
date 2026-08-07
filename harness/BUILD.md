# annnä Harness — BUILD (ordered implementation plan)

*How a fresh agent session turns `SPEC.md` into a working, tested harness. Build against the stubs in `INTERFACES.md`; verify red-green against `SCENARIOS.md`. Do the steps in order — each depends on the one before. Nothing here requires a real Engine/Model/App.*

**Definition of done:** every `[MUST]` scenario passes against stubs; `[HELD-OUT]` probes are executed and their results recorded (not fixed); no harness code reaches across a seam except through the `INTERFACES.md` contracts.

---

## Step 0 — Project setup
- **Pin the tooling: TypeScript.** The typed tool contract (§5), the shared `EngineSeam` interface below, and the injected virtual-clock contract make an untyped language a poor fit — this is the harness build's language pin, not a preference.
- Set up a test runner and the **steppable virtual clock** (`INTERFACES.md §5`), **injected, not imported ambiently**, so hold/offer expiry and the escalation ladder advance on stepped time.
- Create the three stubs from `INTERFACES.md §5`: `EngineStub`, `ModelStub`, `AppStub`. Keep them deterministic and scenario-keyed.
- **One injection point — `makeEngine()` / `makeModel()` / `makeApp()`** — so the stubs (now) and the real adapters (at the swap) slot in with **zero harness changes**. The engine seam is a shared `EngineSeam` TypeScript interface, implemented by `EngineStub` now and the real engine adapter later; the same point injects the virtual clock the stubs and the real engine share. This is what makes the stub-swap (`../engine/SCENARIOS.md Z2`) a drop-in rather than an edit.
- Wire an empty harness entry point: `handleTurn(input)` and `handleTrigger(event)`.
- **Verify:** the test runner runs; a trivial "echo" test passes; swapping a stub for a no-op adapter through the injection point needs no harness edit.

## Step 1 — The object model (the atoms)
- Implement the SPEC §3 types as data structures: `Principal`, `Board`, `Commitment-kind`, `Commitment` (with the latched-status shape), `Rule`, `SOP`, `Shared`, `Order`.
- Implement the **derived** functions (pure, over stored structure): `temporal_type` (from roles), `completed` (`actual_end ?? end-passed`, or task-ticked), and `status = latch?.label ?? derive(unmet_conditions)`.
- Implement `needs_human` (the park) as a **stored field alongside `status`, not a status value** — set by the loop, cleared only by a human act, and always surfaced (SPEC §3.4).
- Correctness-critical values are typed handles from `EngineStub` — do **not** compute them here.
- **Verify:** C4, C5, C6, C7 (derivations); and unit tests that a set latch overrides derivation (precursor to C1–C3).

## Step 2 — The tool contract
- Define every tool from SPEC §5 with a typed signature and a declared **reversibility class** (`internal` | `outward:comms|value|destruction`). Make the class a **required, non-optional** part of the type — a tool with no declared class is **unconstructable** (M2 at the tool boundary), so "undeclared" cannot occur; the floor's fail-closed rule (D19, `SPEC.md §7` rule 5) is the runtime backstop if one ever slips.
- Route each tool to the correct seam: `calculate`→Engine, `CRUD_*`/rule-writes→Engine `commit` (as diffs), generative-UI/`publish`/`notify_and_await`→App.
- Enforce **diff-only** semantics for `CRUD_Board` and rule writes (never send a destructive replace).
- Validate every tool **return** against its declared return schema before the model consumes it (SPEC §5); a mismatch is a **structured error**, never a raw dump (A7).
- **Verify:** A1, A2, A3 (create/edit/task), A4 (conflict surfaced), A5 (tasks reserve nothing), **A7 (tool return validated against its declared schema)**, G7 (SOP lifecycle via `CRUD_SOP`), H4's payload shape (board-blind), H6 (per-recipient token attribution), N2 (no tool declares `value-transfer`), D9 (no tool declares `destruction`), and that each tool exposes a reversibility class.

## Step 3 — The clarify/permission floor (M1)
- Implement the floor as a gate **at the tool boundary**: before any tool call, if its reversibility class is across-the-line, require a live confirmation OR a matching `Grant{action_class, scope, expiry}`; else raise an elicitation gap (gap-2). Never infer a grant.
- Attribute every across-the-line call `{who, basis, when}`.
- Implement `Grant` as a stored, addressable, revocable object.
- Implement the floor's refinements: outward prose is `narrate(structure)` + typed payload (never free composition); a signed document's **named** terms are a stored basis for recording their consequences; paid/settled marks classify as internal.
- **Content-bind the live confirmation:** a confirmation's basis is the tool + its **canonicalized arguments**, so a changed argument is a new act needing a fresh basis (D18) — record that identity in `{who, basis, when}`. **Fail closed:** an undeclared/unclassifiable reversibility class is treated as across-the-line, never run unattended (D19).
- **The floor property:** raise the case-by-case D-family to one **property-based test** — no outward act ever fires without a matching basis, over any tool-call sequence (D20; the invariant's home is `SPEC.md §7`, `../TDD/harness.md`).
- **Verify:** D1, D2, D3, D6 (and D5's "owner-side floor on returned data"), D7 (narrated-not-composed), D8 (document-derived basis), **D18 (confirmation is content-bound), D19 (fail closed on an undeclared tool), D20 (the floor property)**, A6 (a hand-edit write transits `CRUD_Commitment` under the floor exactly as an utterance does), N1 (marks are internal, attributed). This step must be airtight before anything acts outward.

## Step 4 — The elicitation policy
- Implement gap detection: gap-1 missing-required, gap-2 uncovered-crossing (from Step 3), gap-3 conflict (via `EngineStub.check_consistency`), gap-4 ambiguity (from `ModelStub.normalize`), gap-5 coverage (via `check_coverage`).
- Implement **propose-with-scope** (use `ModelStub.narrate` for read-back), **store-routing** (Rule/Grant/Board-field/Commitment-field/Exception), the **ask-once** check (scope ladder), **conflict handling** (governing hard-stop / own override-with-reason / latent alert / **unsatisfiable hard-stop with no override affordance, regardless of authority** — `../engine/SPEC.md §8` item 4, gated by F3b below), the **correction/impact** surface, and the **M2 go-live gate**.
- Implement the **noticed-pattern offer** (SPEC §6): count repeated hand-sets over `owner`-tagged slice material only, propose inline on the console turn, Rule/Board-field only, never on a trigger firing, never carried in the assembled context, gated on the owner's stored self-improvement setting. Implement `PatternDecline` (SPEC §3.10) as a stored, addressable, revocable object, and `reject-permanently` as an ordinary `proposal.respond` value (`../model/SPEC.md §2`).
- Implement the M2 classify gate: a governed-board commitment must resolve to a kind or an `exception` (make the illegal state unconstructable).
- Implement **generative-UI pinning**: a hand-set field is marked user-owned and a subsequent agent re-proposal cannot regenerate it (SPEC §5; the mid-session, field-level twin of G6's whole-form freeze).
- Wire **save-as-bundle** (FR38): a T2 session's output (complete or in progress — `../engine/SPEC.md §1.7a`) is emitted as a `../marketplace/SPEC.md §1.2` bundle via the engine's bundle **shape-projection**, invoked as an internal `calculate`-class read — **never a publish**. The projection mechanism's home is `../engine/SPEC.md §1.7a`; the harness side asserts only that it hands the engine a representable request and stores/forwards the result. Authoring law's home is `../marketplace/SPEC.md §2` — do not restate it here.
- ***Sub-gate (advisory, I5):*** Step 4 spans **9 sub-capabilities** (gap detection · propose-with-scope · store-routing · ask-once · conflict handling · the M2 classify gate · generative-UI pinning · save-as-bundle · the noticed-pattern offer). Gate them in **clusters, each with its own green checkpoint** (`../deployment/SPEC.md §4` checkpoint law — a declared subset of the step's gate IDs that merges green on its own), never as one thousand-line step. The step **closes** only when the full Verify set below is green.
- **Verify:** B1–B5 (incl. the quota rule surfaced at the picker), E1–E3, F1–F3, **F3b (unsatisfiable pairs get no override affordance)**, G1–G6 (incl. template-Lego authoring), **G6b (a hand-set field survives re-proposal)**, **G8 (save-as-bundle projects a valid §1.2 bundle, declares `internal`, does not publish, re-projects identically); G9's authoring fence is `[ENGINE]`, verified engine-side at swap time**, **B6–B8** (the noticed-pattern offer; its absence box; a decline is remembered).

## Step 5 — The loop
- Implement `handleTurn` (console utterance → normalize → plan → tool calls under the floor → **check-work** → narrate) and `handleTrigger` (sale / hold-expiry / decline / returned-form / clock).
- Implement **context assembly** (SPEC §8): standing frame + relevant slice per firing; the handoff frame for trigger firings — assembled from stored structure, never accumulated conversation. Stamp every assembled string with its `owner|guest|import|document` **source tag** (layer-1 spotlighting, L4); route the highest-risk untrusted channels (guest free text, uploaded SOP) through a **quarantined tool-less model** so the privileged model sees only the structured summary (layer-2 isolation, L5 — seeded from the code-repo injection-fixture corpus, `../security/SPEC.md §5`). On a console firing, carry the app-stamped **view-context** `{surface, visible_range?, selected_ref?}` in the standing frame so a deictic utterance resolves against `selected_ref` (L6; `INTERFACES.md §2.1`).
- Implement **check-work**: verify committed structure against the normalized intent (read-back turn-driven, engine re-read trigger-driven); mismatch re-enters the loop **exactly once**, then surfaces as a gap (attended) or parks (unattended); re-entry may re-commit but never re-fires an already-attributed outward act (SPEC §7). Termination = effect done **and verified** | gap to elicit | escalation.
- Implement **unattended behavior** against the objects at `SPEC.md §3.9`: the owner-scoped `OnCall` list and the stored `Escalation`. Walk the ladder on the virtual clock (`step_timeout` per rung, `total_timeout` overall); on exhaustion — including the empty-list and everyone-unreachable cases — **park** in a needs-human state, close the Escalation `timed_out_parked`, and surface it attributed to exhaustion. Never fire an ungranted across-the-line act. **Notification is not authorization:** reaching a rung creates no basis.
- Implement **auto-accept as a Grant** (`SPEC.md §7`): setup answers mint an ordinary Grant, matched by the same floor lookup as any other. **Do not build a second authorization path** — if the implementation grows one, that is the defect D10 tests for.
- Wire `AppStub.on_form_return` as a trigger source (the guest flow), and the hold/offer expiry as a trigger source (the clocked offer's cascade).
- **Verify:** D4 (unattended park), **D10–D11 (auto-accept is a Grant; it never widens)**, **D12–D17 (the ladder walks, notification is not a basis, exhaustion parks, empty list is not an error, in-app cannot be disabled, the park says why)**, C9 (a park never self-clears), K1–K3 (check-work attended + unattended; bounded termination with no re-fire and no Escalation), L1–L2 (context assembly), **L3 (bounded slice → deterministic prioritized truncation; oversized firing stays self-sufficient or parks)**, **L4 (spotlight tags on the wire), L5 (dual-model isolation of stranger text), L6 (deictic utterance resolves against stamped view-context)**, H4 (returned form fires loop), C8 (offer lapses → cascades; late yes refused), **I1–I4 (the share path: two H1s working one commitment, no sixth seam verb, counterparty's floor, ordinary trigger)**, F4–F5 (version-of-record: governing and own terms), H1–H3, H5 (order/partial/group cancel + half-clear), H7–H8 (cancellation asymmetry + rebook offer), P1 (the proposal round-trip — loop + floor + elicitation + `resolve`/`commit(proposal_ref)` composed).

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
- **Tool ACI is prompt-engineering, not an afterthought:** a tool's **description** and its **decline/error returns** get the same first-class prompt-engineering and eval iteration as any system prompt. Returns carry **agent-legible context** — a structured decline says *which constraint refused and what the next move is* (the engine already distinguishes `no-feasible-placement` from `travel-unknown`, `../engine/SPEC.md §5`), never a bare error code or raw ID the model must decode. This is the prose face of the **return-leg validation** whose normative home is `SPEC.md §5` (every return validated against its declared schema before the model consumes it; A7) — legibility and validation are the same requirement seen from two sides. The tool surface is small on purpose (§5, no tool zoo); spend the saved effort making each tool's contract legible to the model.

---

## Reading order for the builder
1. `SPEC.md` — what the harness is (esp. §2 inventory, §3 atoms, §4–8 the five responsibilities).
2. `INTERFACES.md` — what to stub and never build.
3. `SCENARIOS.md` — the acceptance suite; turn these into tests.
4. `BUILD.md` (this file) — the order to build them in.

History / rationale (not needed to build, useful if a decision is questioned): `../archive/DESIGN.md`, `../archive/05-post-critique-decisions.md`, `../archive/06-round-two-decisions.md`, `../archive/07-elicitation-mechanism.md`, and the two adversarial reviews `../archive/CRITIQUE-FINDINGS.md` / `../archive/CRITIQUE-FINDINGS-2.md`.
