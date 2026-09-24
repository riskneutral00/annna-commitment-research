# BLASTOFF — Phase 1 exit review

*Revised 2026-09-20 following the founder's project-phase clarification in `AGENTS.md` §Project phases. This is a documentary readiness checklist, not a development command or a schedule. The previous 2026-09-17 scorecard is preserved verbatim in the local review's `before/blastoff.md` and in Git history. Its 5.9/10 and twenty scores are historical judgments, not current measurements.*

## What changed

The prior scorecard required typed implementation schemas, new suites, hosted workflows and a live qualification run before the first build could begin. That made planning depend on development. It also treated heading presence, zero model flags and file retirement as evidence stronger than those checks provide. The conditions below require precise plans and dispositions; Phase 2/3 supply implementation and observed outcome evidence at their existing gates.

**Exit decision:** every applicable row has cited documentary evidence and a named reviewer/disposition; no unresolved decision forces the authorized development scope to invent user behavior, authority, data meaning or failure handling. A later/optional item may remain open only with a clear boundary, owner and trigger. A complete checklist informs a separate founder go-word; it never issues one. This review does not claim that the rows are all complete.

**Evidence labels:** documented; independently reviewed; empirically verified; hypothetical; deferred. Keep them distinct. No new 0–10 score or aggregate threshold is assigned. Product outcome evidence lives at `PRD.md` §10.1.

## Conditions and verification

| ID | Phase 1 condition | Verify by reading / tracing | Later evidence, not required now |
|---|---|---|---|
| M1 Entry path | Current phase and authority are unambiguous; historical/local notes are identifiable. | Cross-read AGENTS, INDEX, README and current roadmap headings, not a one-token grep. | Entry-path tooling regression checks. |
| M2 One home and coherence | Accepted-scope laws have homes; discovered conflicts have resolved or explicitly blocked dispositions. | Inspect source pairs including table rows, section tails, uncited restatements and same-file references; log retrieval blind spots and sampled negatives. Zero flags does not prove global coherence. | Deterministic duplicate checks and independently qualified advisory sweeps. |
| M3 Protection plan | Existing gates and planned additions state what each can and cannot prove. | Read the gate roster and its subject/counterexample; distinguish source checks from executable behavior. No fixed gate count substitutes for coverage. | Run the appropriate implementation gates. |
| M4 Scenario → step | Accepted requirements have real pass/fail scenarios with a producing build step. | Trace representative edges both directions and list all known orphans/phantoms with dispositions. | Scenario execution and future gate checks. |
| M5 Story → behavior | Every accepted story beat has a verified meaning-to-scenario trace or an explicit owed/deferred entry. | Read the exact claimed facet, not only its ID mention; preserve compound-beat coverage and companion debt. | Executable proof of that facet. |
| M6 Decisions | In-scope behavioral forks are resolved in their homes; optional/frozen questions cannot accidentally be built. | Review drafted markers and open rulings for scope and consequence. Do not strip a marker or require every future ruling merely to reduce a count. | Exercise deferral/refusal boundaries. |
| M7 Development entry | Each authorized layer entry has prerequisites, inputs, outputs and a bounded first verification plan. | Review BUILD dependencies without requiring any Step 0/1 to be implemented during Phase 1. | Close the actual steps in order. |
| M8 Design | The accepted first-use and correction paths have sufficient layout/content/state decisions for a builder; remaining design scope is explicitly bounded. | Review reserved DESIGN/BRAND homes and success/failure/empty/uncertain states by eye. Tokens and appearance require actual design decisions. | Rendered accessibility, interaction and visual checks. |
| M9 Schemas/interfaces | Documents define required fields, identity, optional/absent meaning, authority, errors and state transitions for accepted flows. | Compare story debt with engine/harness/model/app interfaces; test examples on paper for incompatible shapes. No production `.ts` schema is needed to satisfy this planning condition. | Implement schemas and bidirectional conformance checks. |
| M10 Test design | Each correctness claim has an oracle and a counterexample, with fixtures/provenance and ownership planned. | Demonstrate why a plausible wrong implementation would fail; distinguish mocked wiring from real behavior. An empty green suite proves nothing. | Build and execute suites during development. |
| M11 Reading load | A builder can find required sections without reading the whole corpus or truncated fragments. | Map each entry step to actual sections/scenarios; confirm citations and relevant tails, not heading counts. | Optional automated reference checks. |
| M12 Deferrals | Frozen scope has one current boundary, owner and observable resume condition. | Check marketplace/security/design debt against their current homes; preserve history. | Status tooling and later feature verification. |
| M13 Readiness language | Plans express conditions, and authored examples/dates cannot be mistaken for delivery promises. | Inspect contextual meaning. Project-phase definitions are allowed; broad date/phase regex bans are not semantic proof. | Narrow mechanical checks where justified. |
| M14 Provenance | Current obligations are distinguishable from former decisions and research claims. | Trace historical claims to dated sources and current homes; preserve original evidence. Do not delete history merely to satisfy a grep. | Regression checks for known drift. |
| M15 Evaluation design | Model tasks, labels, qualification oracle, languages, splits, failure accounting and requalification triggers are specified. | Review EVALS §§1–3 and INTERFACES. No live result or model access is required for Phase 1 exit. | Offline runner verification, then authorized live qualification at existing BUILD steps. |
| M16 Environment plan | Hosting, CI, secrets, data boundaries and failure recovery are assigned and specified. | Read deployment/security plans; separate account availability from documentary completeness. Do not provision as a planning check. | Account setup, protected lanes and deployment verification. |
| M17 Security design | Threats map to controls and adversarial scenarios, including semantic misinterpretation and evidence handling. | Trace guest/owner/external input to quarantine, executor permission and data retention; a classifier cannot establish consent or isolation. | Implementation security tests and required review gates. |
| M18 Product determinacy | Accepted-scope questions are answered with actual behavior; deferred wants and user-owned choices remain explicit. | Read PRD §§11–12 and relevant briefs. A nonempty “Answered” heading is not an answer; “none open” must not hide item 4. | Pilot observations and later scope rulings. |
| M19 Story preservation | Stories remain useful falsification probes and accepted scope is traceable through any consolidation. | Preserve/rehome each unique claim and its provenance; no folder deletion or fixed number of named stories is required. | Walk the scenarios and collect real outcomes. |
| M20 Regression and learning | Every material known failure has a recorded lesson, a proposed falsifier and an owner. | Include table omission, truncated context, wrong scenario extraction, duplicate sample counts and falsely promoted model gold. | Implement and run the appropriate local tests when authorized. |

## Current unresolved planning work

- **Contracts:** disposition the exact Matt-flow debts in `user-stories/Situations/Situation-A/story-matt-verification.md` §Layer debt. “Gap / owed” is not implementation-ready simply because a general mechanism exists elsewhere.
- **Design:** reserved DESIGN/BRAND sections still need real decisions for the accepted scope; this review supplies none by assumption.
- **Decisions:** assess each open ruling/brief against the accepted development boundary; do not reopen settled user-owned policies or require unrelated future features.
- **Users:** retain RQ-14 and PRD §10.1. Define how the first owner's value and student guest experience will be observed; no model experiment replaces that plan or creates a new business target.

## Exit record to complete

For each M-row record: source revision/anchor; documentary evidence; reviewer; disposition (complete/open/deferred); what would falsify it; owner/trigger for any deferral. The re-evaluation report is a starting inventory, not a blanket completion receipt. Preserve runtime proof obligations in each BUILD file. Explicit development authorization follows a satisfactory review; it is absent from this planning task.
