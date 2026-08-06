# annnä Engine layer — spec package

annnä is four layers — **Model / Harness / Engine / App** (the full map: [`../README.md`](../README.md)) — and this folder is the Engine: **the only layer where truth lives**. It is the persistent store (commitments, boards, rules, grants, latches, shared artifacts, orders) plus the deterministic math on it (availability, gaps, travel, quotas, placement). It is **built**, not imported; its only client is the **Harness**, which calls it through a seam pinned before this design existed (`../harness/INTERFACES.md §1`). The engine never talks to the model, a user, or a third party.

If you deleted the AI entirely, this layer is what would remain: the calendar-and-calculator underneath. Everything the model is forbidden to do — state a number, a time, an availability — is answered here instead, deterministically: same store, same query, same answer, always.

**This folder's purpose:** it is the complete design for **building** that layer — what to store, what math to answer, the seams to honor, and the suite that proves the build correct. An agent handed this folder implements the engine from it: read the four files in order, then execute `BUILD.md` Step 0 → 9. You should never need to invent a behavior — if a decision seems missing, it's either in `SPEC.md`, pinned by a scenario, or deliberately out of scope (§11 / the NOT list below).

Read in this order:

1. **`SPEC.md`** — the store and math of record: the object model (including recurrence-as-materialized-instances and the Proposal object), the M3 type-value system, the **closed rule-type menu**, handles, `calculate` (with the travel seam), `commit`, `resolve` (place-only + reshuffle-as-proposal), consistency/coverage, the invariants ledger.
2. **`INTERFACES.md`** — upward: the harness seam satisfied verbatim (zero new verbs); downward: the external travel source and the storage substrate requirements; and the read-only display-projection seam (the app renders a handle's display facet, never computing).
3. **`SCENARIOS.md`** — the deterministic acceptance suite (unlike the model's graded EVALS — this layer either holds or fails), ending in the stub-parity set.
4. **`BUILD.md`** — the ordered plan, Step 0 (substrate) through Step 9 (**the stub-swap**). Storage-tech candidates live there only.

**Definition of done:** every scenario in `SCENARIOS.md` passes, **and** the real engine replaces the harness's engine stubs with **zero harness changes** — the full harness suite green (`SCENARIOS.md` Z1–Z2). The swap is the exam.

**Deliberately NOT here:** permission decisions (the harness floor — the engine only stores and matches grants), elicitation and narration (harness/model), rendering and delivery (app), payment rails (money is tracked, never moved), any predicate language (the rule menu is closed), storage technology in the SPEC (BUILD names candidates).

Design decisions locked by interview: `../.specs/deep-interview-engine.md`. Location/reshuffle requirements derive from `../user-stories/Situations/Situation-D/` (a falsification probe, generalized — never a design target). Glossary for M1/M2/M3/T2/H1/H2: `../harness/README.md`.
