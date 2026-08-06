# annnä App layer — spec package

annnä is four layers — **Model / Harness / Engine / App** (the full map: [`../README.md`](../README.md)) — and this folder is the App: **the human-facing layer**. It renders every surface a person touches — the owner's one-canvas app (board + console + risers) and the guest's token-URL pages — and it moves data in and out (delivery, form returns). It is **built**, not imported. It contains no truth (engine), no behavior (harness), and no judgment (model): doors and windows, not rooms.

The owner side is **one canvas**: the board is home, the console (the agent) is present everywhere, and everything else rises and sinks on the same surface — there are no pages. The guest side is deliberately the opposite: a traditional, pre-AI web form reached by a capability link, no account, no agent.

**This folder's purpose:** the complete design for **building** that layer — the surfaces, the design law they obey, the seams they honor, and the suite that proves the build correct. An agent handed this folder implements the app from it: read the five files in order, then execute `BUILD.md` Step 0 → 8. You should never need to invent a behavior — if a decision seems missing, it's in `SPEC.md`, pinned by a scenario, carried as design law in `DESIGN.md`, or deliberately out of scope (`SPEC.md §9` / the NOT list below).

Read in this order:

1. **`SPEC.md`** — behavior: the one-canvas model (and how canvas state grounds H1/H2), the board, the console, the fixed generative-UI catalog, guest pages, delivery, app-only views, onboarding, the invariants ledger.
2. **`DESIGN.md`** — the carried design law (the appearance model — skins, boring mode, opacity — plus glass, board rendering, islands, motion; distilled from the prior build, with four recorded supersessions) and the design-system mechanics. *(This sixth file exists because presentation law would bury the seam contract if folded into SPEC.)*
3. **`INTERFACES.md`** — upward: the harness's app seam satisfied verbatim (zero new verbs); downward: the named substrates.
4. **`SCENARIOS.md`** — the deterministic acceptance suite (structure and wire, not pixels), ending in stub parity + two story walkthroughs.
5. **`BUILD.md`** — the ordered plan, Step 0 (scaffold) through Step 8 (**the stub-swap**).

**Definition of done:** every scenario in `SCENARIOS.md` passes, **and** the real app replaces the harness's app stubs with **zero harness changes** — the full harness suite green, plus the Sofia and Debra walkthroughs rendering end-to-end (`SCENARIOS.md` Z1–Z3). The swap is the exam.

**Deliberately NOT here:** permission decisions, elicitation, narration (harness/model) · any deterministic math, even for preview (engine) · model calls in any render or write path · calendar sync or write-back (**banned**, not merely unbuilt — `NOTES.md` OR-39, closed 2026-08-06: data flows in, never out; import IN *is* in scope, `SPEC.md §9`) · a guest-side agent · payment rails, and storefront/commerce logic beyond rendering catalog payloads (`../marketplace/` + the closed service) · native shells (deferred).

Design decisions locked by interview: `../.specs/deep-interview-app.md`. Design-law provenance: a prior build outside this repo (`~/Desktop/annnä/docs/`, on the founder's machine) — **not needed to build**; every carried law is distilled in full in `DESIGN.md`, and the external citations there are traceability only. Glossary for M1/M2/M3/T2/H1/H2: `../harness/README.md`.
