# Testing everything together — swap tests and the two walkthroughs

*The all-together strategy. There is no separate "integration test suite" to write — integration is proven by **re-running suites that already exist** with real parts in place of stubs.*

## The idea

The harness is built first, against stubs of everything else, and its behavioral suite passes on those stubs. Each stub is a **promise** of how the real layer will behave. Integration testing = cashing the promises: replace one stub with the real thing and re-run the same suite. If the stub was honest, everything stays green with **zero changes to the harness or its tests**.

## The swap sequence

1. **Engine swap** (engine Z1–Z2) — the real engine replaces the engine stubs. Parity first (Z1: each stub behavior reproduced exactly on the harness scenarios' inputs), then the full harness suite **including P1**, the compaction pass-through — so the proposal path is exercised end-to-end and Z2 can't pass vacuously.
2. **App swap** (app Z1–Z3) — the real app replaces the app spies. Spy parity (Z1), full harness suite green with `git diff harness/` empty (Z2), then the two browser walkthroughs (Z3).
3. **Model qualification** (model EVALS) — last, against the built harness. Not a swap-suite rerun: the model is graded, and by design nothing deterministic depends on it.

`[ENGINE]`-tagged harness scenarios (enforcement halves the stubs only promised) become fully proven at step 1.

## The two canonical walkthroughs (app Z3)

The only end-to-end browser tests in the project, both straight from `user-stories/`:

- **Sofia's link flow** — generate link → student's board-blind month view → booking lands → the owner's board updates live.
- **Debra's compaction morning** — cancellation event → direction question → proposal card → move confirmations → the board re-forms → the freed-afternoon question.

Every screen along both paths renders from stored structure with zero model calls.

## When a swap turns red

A test that was green on the stub and is red on the real layer means **the stub lied** — the stub's contract and the real layer disagree. The fix is a design decision, not a test edit:

1. Decide which side is right (usually the layer's SPEC).
2. Fix the wrong side **and its contract** (`INTERFACES.md` stub description) so the stub and reality can't drift apart again.
3. Re-run the full suite from the top of the swap.

Never weaken the test, and never patch the harness to absorb a layer's deviation — `git diff harness/` empty is the gate precisely so this can't happen silently.
