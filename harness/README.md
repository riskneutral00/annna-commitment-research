# annnä Harness — build package

Everything a fresh agent session needs to **build the annnä harness**, with no access to the design conversation. Read in this order:

1. **`SPEC.md`** — what the harness is: product framing, the four-layer architecture, the **two-harness inventory** (H1 board surface, H2 per-commitment support surface; no H3), the object model (atoms), and the five responsibilities (loop / tool contract / elicitation / clarify-permission floor / context assembly). Terminology note: this package builds the harness **layer**; that layer contains two harness **instances** (H1/H2) — interaction patterns sharing the same five responsibilities and tool surface. *Source of truth — supersedes the older `../archive/DESIGN.md`/`../archive/05`/`../archive/06`/`../archive/07` for the harness.*
2. **`INTERFACES.md`** — the seams to Engine / Model / App: the contracts the harness calls across and must **stub** (so it builds and tests in isolation). Also lists what the harness OWNS vs what to never build.
3. **`SCENARIOS.md`** — the pass/fail acceptance suite (TDD substrate). `[MUST]` = build-gating; `[HELD-OUT]` = out-of-sample generality probes to record, not design to.
4. **`BUILD.md`** — the ordered implementation plan (Step 0 setup → 1 atoms → 2 tool contract → 3 floor → 4 elicitation → 5 loop → 7 assisted off-app path → 8 external surface → 6 held-out & sign-off last; Steps 7–8 are appended after 6 in the file but build before its sign-off), each step naming its gating scenarios.

**Definition of done:** every `[MUST]` scenario in `SCENARIOS.md` passes against the `INTERFACES.md` stubs; held-out probes executed and recorded; no harness code crosses a seam except via the interface contracts.

**Non-negotiables** (see SPEC §7, §9): thin-agent-structural (correctness-critical values are engine handles, never LLM literals); the reversibility floor (no across-the-line act without an explicit basis; never infer a grant); poka-yoke (make illegal states unconstructable — the M2 gate and the status latches); the meta-principle (build the general primitive a probe reveals, never the use case).

**Glossary** (labels inherited from the archive design docs — used throughout without re-definition):
- **M1** — the inviolable clarify/permission floor: the reversibility line (SPEC §7).
- **M2** — the governed-board classify gate and its go-live shape: kind-or-recorded-exception, no silent holes (SPEC §3.4, §6).
- **M3** — the engine's type-value system (typed operands + operators), deferred behind the engine seam (INTERFACES §1.4).
- **T2** — legacy label for what became H2's authoring/onboarding interview ("author the rules by which commitments involve other parties").
- **H1 / H2** — the two harness instances: the board surface and the per-commitment support surface (SPEC §2). SCENARIOS section letters skip M to avoid colliding with the labels above.

Rationale/history if a decision is challenged: `../archive/05-post-critique-decisions.md`, `../archive/06-round-two-decisions.md`, `../archive/07-elicitation-mechanism.md`, `../archive/CRITIQUE-FINDINGS.md`, `../archive/CRITIQUE-FINDINGS-2.md`.
