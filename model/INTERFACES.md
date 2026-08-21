# annnä Model — INTERFACES (two seams)

*The model layer sits between the harness (above, its consumer) and model providers (below, its supply). Both seams are contracts; neither side is trusted.*

---

## 1. Upward — the harness seam (this layer SATISFIES it)

The contract is **owned and defined by `../harness/INTERFACES.md §2`** — not duplicated here. This layer implements the producer side:

| Harness call | Producer obligation (see SPEC) |
|---|---|
| `normalize(utterance, context)` | intent from the §2 vocabulary only; fields raw; `ambiguities` per §3; context-only (no memory); never called on a trigger firing (FD-28) |
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
  <call_type>: {
    attended:   { model_id, provider, fallback_model_id, fallback_provider },
    unattended: { model_id, provider, fallback_model_id, fallback_provider },
    max_cost_per_call, timeout_ms: { attended, unattended }, context_budget_tokens
  }
}
firing_budget: { max_steps_per_firing, max_cost_per_firing }
// Restructured 2026-08-21: the old single per-entry `provider` field made three standing rules
//   structurally unexpressible — "Fallback is app-supplied, always" (SPEC §7: a byo primary's
//   fallback is another byo), the attended-only confinement (FR31: a single entry had nowhere to
//   name what trigger firings resolve to), and FD-3's summarize rule. Now each binding carries its
//   own provider, and the attended/unattended split the timeout already had covers the provider
//   dimension too. Load-refusals, all poka-yoke (BUILD Step 4): `fallback_provider` must be
//   `openrouter`, always · any `byo-*` in an `unattended` binding refuses · any `byo-*` anywhere
//   on `summarize` refuses (FD-3).
// provider = openrouter | byo-chatgpt | byo-key
// timeout_ms defaults: 10_000 attended (a console turn), 30_000 unattended (trigger firings —
//   nobody is waiting, and the fallback hop still runs). Timeout → fallback per SPEC §8.
// context_budget_tokens (2026-08-21) is the assembly budget the harness truncates against
//   (../harness/SPEC.md §8). A binding is QUALIFIED AT its budget (EVALS.md §3): swapping to a
//   model with a smaller budget is a re-qualification, never a silent config diff — otherwise a
//   cheap swap silently changes which busy boards park.
// firing_budget (2026-08-21) is the per-FIRING ceiling ../harness/SPEC.md §4's fourth termination
//   condition reads — a step count and a spend total across ALL of a firing's calls (assembly
//   summarize reads, tool round-trips, narrate, check-work). It sits beside the per-call routing
//   because §4 cites this section for it and no field carried it: max_cost_per_call bounds one
//   call, never the firing.
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

**`normalize`** *(a `oneOf` since 2026-08-21 — the schema previously admitted only the single form while SPEC §1 required compound utterances to return a sequence, so the declared compound return was rejected by its own schema and N-07 was unpassable on any model)*:
```json
{ "oneOf": [
  {
    "type": "object", "additionalProperties": false,
    "required": ["intent", "fields", "ambiguities"],
    "properties": {
      "intent":      { "$ref": "#/$defs/intent" },
      "fields":      { "type": "object" },
      "ambiguities": { "$ref": "#/$defs/ambiguities" }
    }
  },
  {
    "type": "object", "additionalProperties": false,
    "required": ["sequence", "ambiguities"],
    "properties": {
      "sequence": { "type": "array", "minItems": 2, "items": {
        "type": "object", "additionalProperties": false,
        "required": ["intent", "fields"],
        "properties": { "intent": { "$ref": "#/$defs/intent" }, "fields": { "type": "object" } }
      } },
      "ambiguities": { "$ref": "#/$defs/ambiguities" }
    }
  }
],
"$defs": {
  "intent": { "enum": ["commitment.create","commitment.edit","commitment.complete","commitment.cancel","commitment.confirm","commitment.mark","board.query","board.edit","rule.author","rule.edit","rule.override","proposal.respond","answer.provide","grant.give","grant.revoke","exception.record","sop.author","shared.author","shared.publish","notify.request","party.reenable","session.control"] },
  "ambiguities": { "type": "array", "items": {
    "type": "object", "additionalProperties": false,
    "required": ["question", "readings"],
    "properties": { "question": {"type": "string"}, "readings": {"type": "array", "items": {"type": "string"}, "minItems": 2} }
  } }
} }
```
- The `intent` enum **is** SPEC §2's vocabulary — one source; an edit there is an edit here (same review).
- `fields` stays schema-open by design: values are raw-as-heard (SPEC §1); per-intent key expectations are the §2 table's rows, enforced by the harness's own seam validation, not by the provider.
- The second branch **is** the compound-utterance sequence (SPEC §1); Step 1's freeze reconciles both branches against the built harness's dispatch shape.

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
                  "labels":  { "type": "array", "maxItems": 8, "items": {
                    "enum": ["contains-instruction","impersonation-attempt","document","question",
                             "request","confirmation","complaint","unresolved-reference"] } } } }
```
- `additionalProperties: false` is load-bearing here, not stylistic: it is what stops a quarantined model from smuggling an extra field into the privileged context. A return that validates is the *whole* of what crosses.
- **`labels[]` is a closed enum** *(2026-08-21 — as an open string array it was a free-text channel that validated, unbounded and outside the S-set's carry-through bar, while this section's own argument is that a return that validates is the whole of what crosses)*: it carries what the summary reports **about** the text and structurally cannot carry the instruction — there is no string to put one in. The carry-through bar covers `summary` and the label *choice* both (SPEC §1). Growing the enum is an exam-and-schema edit, same review as the intent vocabulary. `source_tag` is an input; the return has no field for it, so it cannot be changed or elevated (`../harness/INTERFACES.md §2.4`).

Judgment has no schema of its own — it rides inside `normalize`/`narrate` (SPEC §1).

---

## 3. What this layer OWNS (for contrast)

- The **intent vocabulary** (SPEC §2) and the per-call **output schemas**.
- The **prompt/instruction assets** (authored at BUILD Step 2, versioned like code).
- The **routing config** and its qualification state.
- The **exam** (`EVALS.md`) and its graded sets.

Everything correctness-critical is above (harness floor/loop) or beside (engine truth) — never here.
