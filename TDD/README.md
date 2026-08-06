# annnä — TDD (the testing strategy)

*If you are an agent handed this folder: this is **how annnä is tested** — which kind of test each part gets, why, and in what order. The test **criteria** already exist (each layer's `SCENARIOS.md` / `EVALS.md`); this folder never invents new criteria. It classifies and sequences what those files already state, so a builder knows exactly what kind of tests to write.*

---

## The kinds of testing, in plain words

There are many named testing styles; annnä uses five. One line each:

- **Unit test** — feed one small function an input, check the output. Fast, thousands of them. *(Engine: "given these bookings, is 3pm free?")*
- **Property test** — instead of one example, state a rule that must hold for **all** inputs, and let the test tool generate hundreds of random cases trying to break it. *(Engine: "no write, ever, can clear a latch.")*
- **Behavioral test** — set up a situation, perform an action, check what the *system did* — Given / When / Then. Tests a whole loop of behavior, not one function. *(Harness: "given a stored buffer rule, when the owner books again, then the agent does not re-ask.")*
- **End-to-end (e2e) test** — drive the real app in a real browser like a user would, click by click. Slow and few — reserved for the stories that matter most. *(App: Sofia's link flow.)*
- **Eval** — for the model only. Not pass/fail: a set of graded items with a **threshold** ("≥95% of utterances normalized correctly"). Models are statistical, so their tests are too.

**Is TDD the right way?** Yes — but TDD is the **method**, not a kind of test. TDD means: write the failing test *first*, then write code until it passes. Any of the five kinds above can be written TDD-style. annnä uses TDD as the method everywhere, with a different kind of test per layer (next section).

## The strategy, per part

| Part | Kind of test | Details |
|---|---|---|
| **Engine** | Unit + property tests | [`engine.md`](engine.md) |
| **Harness** | Behavioral tests on stubs | [`harness.md`](harness.md) |
| **App** | Component/wire tests + a few e2e | [`app.md`](app.md) |
| **Model** | Evals (graded, thresholds) | [`model.md`](model.md) |
| **All together** | Swap tests + two story walkthroughs | [`integration.md`](integration.md) |
| **Security** | Unit + property + behavioral + wire tests, riding each layer's build | [`security.md`](security.md) |
| **Marketplace** | Unit + behavioral tests against the mock, reusing app's component/wire tiers, one integration run | [`marketplace.md`](marketplace.md) |

## The hierarchy (what derives from what)

```
user-stories/          real life, the requirements source-of-truth
   ↓
<layer>/SCENARIOS.md   each layer's pass/fail criteria  (model: EVALS.md, graded)
   ↓
TDD/                   this folder — what KIND of test each criterion becomes
   ↓
executable tests       written during each layer's build, living with that layer's code
```

The tests are not written yet — they are written **during each build**, and this is by design (the law below). `TDD/` also owns the naming convention: every executable test carries its scenario ID (e.g. `harness C2`, `engine B1`, `app G1`) so any red test traces straight back to the criterion it enforces.

## The pyramid (how many of each)

Many fast engine unit/property tests at the bottom · the full harness behavioral suite in the middle (deterministic, because every neighbor is a scripted stub) · a **few** app e2e browser tests at the top (slow, so only the canonical stories) · model evals **off to the side** — graded and statistical, never mixed into the pass/fail suites.

## The law

1. **Tests first.** Every layer's `BUILD.md` step already names its gating scenarios. The build discipline is: turn that step's scenarios into failing executable tests, **then** implement until green. Never the reverse; never delete a red test to pass a step.
2. **The swap is the exam.** A layer is done only when the real thing replaces its stub and every suite that ran against the stub runs green **unchanged** ([`integration.md`](integration.md)).
3. **HELD-OUT stays held out.** Scenarios marked `[HELD-OUT]` (harness J-family) are run and their results **recorded** — the design is never patched to make them pass. They measure generality, they don't gate it.
4. **Visual law is a checklist, not a test.** The app's design law (`app/DESIGN.md`) gates build steps by human review — pixels are judged, not asserted ([`app.md`](app.md)).

## Read order

This page → the file for the layer you're building → that layer's `SCENARIOS.md`/`EVALS.md` → its `BUILD.md`. Before any stub-swap: [`integration.md`](integration.md).
