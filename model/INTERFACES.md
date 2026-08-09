# annnä Model — INTERFACES (two seams)

*The model layer sits between the harness (above, its consumer) and model providers (below, its supply). Both seams are contracts; neither side is trusted.*

---

## 1. Upward — the harness seam (this layer SATISFIES it)

The contract is **owned and defined by `../harness/INTERFACES.md §2`** — not duplicated here. This layer implements the producer side:

| Harness call | Producer obligation (see SPEC) |
|---|---|
| `normalize(utterance, context)` | intent from the §2 vocabulary only; fields raw; `ambiguities` per §3; context-only (no memory) |
| `narrate(structure)` | fidelity per §4; voice per §6 |
| judgment | bounded per §5 |
| `summarize(raw_text, source_tag)` | structured return only; no instruction survives into `summary`; material facts preserved; not judgment (SPEC §1, §5) |

Two properties of that seam this layer must preserve, never weaken:
- **Per-call selectable** — nothing here may assume a single model across calls.
- **Untrusted output** — the harness schema-validates at the seam (SPEC §8); this layer never bypasses that by "guaranteeing" its own output.

## 2. Downward — the provider seam

### 2.1 Provider contract (primary: OpenRouter)
```
complete(model_id, messages, output_schema) -> structured JSON | error(malformed|refused|timeout)
```
- Chat-completions with **enforced structured output** (JSON schema per call type). One API shape for every model — that uniformity is why OpenRouter is the primary supply: swapping `model_id` is the whole swap.

### 2.2 Routing config (the layer's one real artifact)
```
routing: {
  <call_type>: { model_id, fallback_model_id, max_cost_per_call, timeout_ms, provider: openrouter | byo-chatgpt | byo-key }
}
// timeout_ms defaults: 10_000 attended (a console turn), 30_000 unattended (trigger firings —
//   nobody is waiting, and the fallback hop still runs). Timeout → fallback_model_id per SPEC §8.
// call_type = normalize | narrate | judgment | summarize (judgment rides inside normalize/narrate's
//   calls; listed so a future split stays representable. summarize is a real, separately bound call.)
```
- **Config, never code.** A routing change (new model, new fallback, provider flip) requires re-qualification (`EVALS.md §3`) and nothing else.
- `byo-chatgpt` is a **slot**: valid only for attended console calls; trigger firings always resolve to an `openrouter` binding (SPEC §7). The slot's auth/OAuth mechanics are app-seam work, integrated at `BUILD.md` Step 5.
- `byo-key` is the **owner's own provider API key** (FR5, 2026-08-06 — the ban is reversed; SPEC §7's tertiary supply). It is an ordinary `{call_type → model_id}` binding whose credential happens to be the owner's: **no new mechanism and no second code path**, which is the whole reason it is a provider value here rather than a parallel config. Same attended-only confinement as `byo-chatgpt` (SPEC §7, **FR31** founder-ruled 2026-08-07). The binding is stored here; **the secret never is** — it is vault-resident, and this config holds only the reference (`../security/SPEC.md §3.1`, member 2, asserted at `../security/SCENARIOS.md` T8).
- **`summarize` rejects every `byo-*` provider** — attended or not, console or trigger (SPEC §7, **FD-3** founder-ruled 2026-08-07). Both `model_id` and `fallback_model_id` must be `openrouter` bindings; a config naming a `byo-*` provider on this call type **does not load** (`BUILD.md` Step 4). Its `timeout_ms` rides the same attended/unattended defaults as every other call type — no special budget, and the retry/fallback path is SPEC §8's, ending fail-closed rather than in a degraded admit.

### 2.3 Stub
The harness build already defines the model stub (`../harness/INTERFACES.md §5`): scripted structured outputs keyed per scenario. This layer's eval scaffold reuses the same shape in reverse — golden inputs, graded outputs.

### 2.4 Per-call output schemas (the `output_schema` argument, v0 — frozen at `BUILD.md` Step 1)

The concrete JSON Schemas passed to `complete()`. v0 unblocks the Step 0 eval scaffold; the Step 1 freeze reconciles them against the built harness's dispatch shape (SPEC §1's compound-utterance note) — until then the shapes below are the contract as designed.

**`normalize`:**
```json
{
  "type": "object", "additionalProperties": false,
  "required": ["intent", "fields", "ambiguities"],
  "properties": {
    "intent":      { "enum": ["commitment.create","commitment.edit","commitment.complete","commitment.cancel","commitment.confirm","commitment.mark","board.query","board.edit","rule.author","rule.edit","rule.override","proposal.respond","answer.provide","grant.give","grant.revoke","exception.record","sop.author","shared.author","shared.publish","notify.request","session.control"] },
    "fields":      { "type": "object" },
    "ambiguities": { "type": "array", "items": {
      "type": "object", "additionalProperties": false,
      "required": ["question", "readings"],
      "properties": { "question": {"type": "string"}, "readings": {"type": "array", "items": {"type": "string"}, "minItems": 2} }
    } }
  }
}
```
- The `intent` enum **is** SPEC §2's vocabulary — one source; an edit there is an edit here (same review).
- `fields` stays schema-open by design: values are raw-as-heard (SPEC §1); per-intent key expectations are the §2 table's rows, enforced by the harness's own seam validation, not by the provider.
- A compound utterance returns an ordered `sequence` array of `{intent, fields}` pairs in place of the single pair; the exact encoding is what Step 1 freezes.

**`narrate`:**
```json
{ "type": "object", "additionalProperties": false,
  "required": ["text"], "properties": { "text": { "type": "string" } } }
```
**`summarize`:**
```json
{ "type": "object", "additionalProperties": false,
  "required": ["summary", "labels"],
  "properties": { "summary": { "type": "string" },
                  "labels":  { "type": "array", "items": { "type": "string" } } } }
```
- `additionalProperties: false` is load-bearing here, not stylistic: it is what stops a quarantined model from smuggling an extra field into the privileged context. A return that validates is the *whole* of what crosses.
- `labels[]` carries what the summary reports **about** the text (e.g. that it contains an instruction, that it is a document) — it never carries the instruction. `source_tag` is an input; the return has no field for it, so it cannot be changed or elevated (`../harness/INTERFACES.md §2.4`).

Judgment has no schema of its own — it rides inside `normalize`/`narrate` (SPEC §1).

---

## 3. What this layer OWNS (for contrast)

- The **intent vocabulary** (SPEC §2) and the per-call **output schemas**.
- The **prompt/instruction assets** (authored at BUILD Step 2, versioned like code).
- The **routing config** and its qualification state.
- The **exam** (`EVALS.md`) and its graded sets.

Everything correctness-critical is above (harness floor/loop) or beside (engine truth) — never here.
