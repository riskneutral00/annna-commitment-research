# Testing the model — evals, not tests

*Criteria: [`../model/EVALS.md`](../model/EVALS.md) — the sets, seed items, thresholds, and grading rules all live there. This page only states why the model is the one part that isn't pass/fail, and where the hard floors are.*

## Why evals

A model is statistical: the same prompt can produce different phrasings, and one wrong answer out of a hundred may be acceptable. So the model passes **sets at thresholds** ("N-set ≥ 95% intent accuracy"), not every item always. Determinism was deliberately kept *out* of the model — everything correctness-critical lives in the harness and engine, which is why they get pass/fail suites and the model gets an exam.

## The sets (defined in `../model/EVALS.md` §1)

**N** normalize · **A** ambiguity calibration (ask / don't-ask pairs) · **R** narrate fidelity · **J** judgment boundaries · **Z** per-language mirrors. Seeded from the user-stories corpus; grown from real traffic — every production check-work mismatch becomes a new eval item.

## The two 100% floors

Two things are graded like pass/fail even inside the exam, because they're safety properties, not pleasantness:

- **Invention = 0** (R-set): any invented fact in narrated output fails the whole set — this is the harness's D7 floor measured at the model.
- **Forbidden attempts = 0** (J-set): any attempt to author a correctness-critical value or cross a boundary fails the whole set.

A model that aces everything else and misses a floor is **not qualified**.

## When this runs

Last. Model qualification wants the *built* harness (real prompts, real tool contract, real traffic shapes) — `model/BUILD.md`. Until then, every harness test uses the scripted model stub ([`harness.md`](harness.md)), which is exactly why nothing else in the project waits on a model.
