# Model spike — one number, not a qualification

`run-nset.mjs` runs the eight **N-set** seed items from [`../EVALS.md §2`](../EVALS.md) against one OpenRouter model through the `complete()` shape at [`../INTERFACES.md §2.1`](../INTERFACES.md), grades **intent exact-match only**, and prints `{model_id, per-item pass/fail, N-set %}`. It exists to price the largest unhedged risk in the build — *does any affordable model clear the bar the harness and engine are being built to?* — before three layers are finished against a contract nothing may satisfy. It is **not** the eval scaffold [`../BUILD.md`](../BUILD.md) Step 0 specs, and its number is **not** qualification: no A, R, J, Q or S sets, no Z-set language mirrors, no LLM judge, no rubric grading, no thresholds, no 100%-bars, no qualification record. [`../EVALS.md §3`](../EVALS.md) says what qualification is; nothing here produces one.

```
OPENROUTER_API_KEY=… MODEL=<openrouter-slug> node model/spike/run-nset.mjs
```

`MODEL` defaults to `openai/gpt-4o-mini`. No key is committed or defaulted — without `OPENROUTER_API_KEY` the runner exits non-zero naming the variable it needs. Running it spends money.
