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

### 2.1 Provider contract — the adapter interface **every** provider enum member satisfies
```
complete(model_id, messages, output_schema) -> structured JSON | error(malformed|refused|timeout|unavailable)
```
This signature is **the contract an adapter for any `provider` value must satisfy** — `openrouter`, `app-direct` and `byo-key` alike *(reframed 2026-08-29: the section was titled and argued as an OpenRouter contract while the enum had three members, so a builder wiring a direct vendor key invented the adapter boundary)*. OpenRouter's one-API-shape-for-every-model uniformity is **why it is the primary supply** — swapping `model_id` is the whole swap — not what the contract is. The obligations, stated rather than left implicit:

- **Structured output is enforced server-side**, against the per-call schema (§2.4), by the provider. A provider that merely *requests* a schema and hopes is **not a lawful `app-direct` value**: on `summarize`, `additionalProperties: false` is the **structural** control (§2.4's own argument — a return that validates is the *whole* of what crosses), and a requested-but-unenforced schema is a labeling defense wearing a structural one's clothes. What the schema is, per call type, is §2.4's; this section states only that enforcement is the adapter's obligation.
- **The error taxonomy is exactly the union above** — four members, nothing outside it. An adapter that cannot distinguish "the provider did not answer" from "the model refused" is not finished; collapsing them is the thing the seam forbids.
- **No partial return.** An adapter returns a schema-valid structure or an error union member. A truncated, streamed-and-cut, or best-effort object is an `error(malformed)`, never a return.
- **This layer composes `messages`, and the composition is deterministic** *(2026-08-29 — `complete()` takes a `messages` array and no prompt argument, so somebody joins the prompt to the context, and neither side said which)*. The harness hands the assembled **`context` object** across the seam (`../harness/INTERFACES.md §2.1`'s `{standing_frame, board_summary, relevant_slice, handoff_frame?}`) and hands no prompt. **The join `{prompt asset (§3), serialized context} → messages` is this layer's**, and it is **byte-identical on replay**: the same context object and the same prompt hash produce the same bytes every time, which is what makes a recorded firing replayable at all. It **satisfies** the wire-order law rather than restating it — stable material first, volatile slice after, so provider prompt caching gets a stable prefix; that law's home is `../harness/SPEC.md §8` ("the serialized prompt puts the **stable material first**"). **Nothing else enters `messages`.** In particular **no tool schemas ride**, and the model never selects a tool call: the seam carries exactly four call types and owns that fact at `../harness/INTERFACES.md §2` — cited, not re-ruled here. *(The seam states no owner for this composition today. The harness is asked to state the same fact at its own home; until it does, this is the only statement of it, and if the two ever disagree the seam's governs.)*
- **`model_id` is a per-provider namespace.** An OpenRouter slug is not a vendor model id and does not resolve against a direct vendor key. Which namespace a `model_id` is read in is decided by the `provider` beside it in the same binding (§2.2), never guessed.
- **The error union is closed at four members, and this is its home.** `malformed` — the return violated the schema, named an intent outside the vocabulary, or would not parse · `refused` — the model answered, and the answer was a refusal · `timeout` — no answer inside the binding's `timeout_ms` (§2.2) · **`unavailable`** *(fourth member, 2026-08-29)* — **the provider did not answer at all**: an outage, a 5xx, a gateway that never reached a model. The distinction `unavailable` carries is that **the math did not run** — nothing was asked of a model and nothing was decided — which is a different answer from "the model refused", and the seam above forbids collapsing the two (`../harness/INTERFACES.md §1`: a provider being down is "a different answer from every semantic return and is never collapsed into one"). Every member takes the same failure ladder (`SPEC.md §8`).
- **Envelope mapping.** Upward, `unavailable` surfaces as the refusal envelope's **existing** `` `unavailable` | `provider` `` reason (the closed reason table, `../harness/COMPAT.md §1`) — the model provider is a third-party provider like the travel source and the calendar provider, so this names a cell that already exists rather than widening a closed set. Naming the model provider in that cell is the harness's own edit, not this layer's.

### 2.2 Routing config (the layer's one real artifact)
```
routing: {
  <call_type>: {
    attended:   { model_id, provider, temperature, reasoning_effort?,
                  fallback_model_id, fallback_provider, fallback_temperature, fallback_reasoning_effort? },
    unattended: { model_id, provider, temperature, reasoning_effort?,
                  fallback_model_id, fallback_provider, fallback_temperature, fallback_reasoning_effort? },
    max_cost_per_call, timeout_ms: { attended, unattended }, context_budget_tokens
  }
}
firing_budget: { max_steps_per_firing, max_cost_per_firing }
judge: { model_id, provider, prompt_hash, languages_qualified[] }
// Restructured 2026-08-21: the old single per-entry `provider` field made three standing rules
//   structurally unexpressible — "Fallback is app-supplied, always" (SPEC §7: a byo primary's
//   fallback is another byo), the attended-only confinement (FR31: a single entry had nowhere to
//   name what trigger firings resolve to), and FD-3's summarize rule. Now each binding carries its
//   own provider, and the attended/unattended split the timeout already had covers the provider
//   dimension too. Load-refusals, all poka-yoke (BUILD Step 4): `fallback_provider` must be
//   APP-SUPPLIED (`openrouter` or `app-direct` — FD-67, 2026-08-22: the vendor name was a single
//   point of failure written into law; the property was always "app-supplied", and `app-direct`
//   is an app-held direct provider key, vault-custodied like any §3.1 credential) · any `byo-*`
//   in an `unattended` binding refuses · any `byo-*` anywhere on `summarize` refuses (FD-3) ·
//   any unknown `call_type` key refuses — `judgment` included, per the note below.
// provider = openrouter | app-direct | byo-key
//   (byo-chatgpt LEFT the enum — FD-65, 2026-08-22: the vendor programme has been identity-only
//   since 2026-08-02; a slot for a programme that no longer exists is speculative machinery.
//   One ruling restores it if the programme returns.)
// timeout_ms defaults: 10_000 attended (a console turn), 30_000 unattended (trigger firings —
//   nobody is waiting, and the fallback hop still runs). A timeout takes SPEC §8's ladder,
//   which is the same ladder every other error-union member takes — do not gloss it here.
// context_budget_tokens (2026-08-21) is the assembly budget the harness truncates against
//   (../harness/SPEC.md §8). A binding is QUALIFIED AT its budget (EVALS.md §3): swapping to a
//   model with a smaller budget is a re-qualification, never a silent config diff — otherwise a
//   cheap swap silently changes which busy boards park.
// firing_budget (2026-08-21) is the per-FIRING ceiling ../harness/SPEC.md §4's fourth termination
//   condition reads — a step count and a spend total across ALL of a firing's calls (assembly
//   summarize reads, tool round-trips, narrate, check-work). It sits beside the per-call routing
//   because §4 cites this section for it and no field carried it: max_cost_per_call bounds one
//   call, never the firing.
// max_cost_per_call's behavior when a call would exceed it is SPEC §8's — a failure of that call,
//   taking §8's ladder, with the spend still counted. Stated there, cited here, never twice.
// judge (2026-08-29) sits BESIDE routing, never inside it, and is emphatically NOT a fourth
//   call_type: the exam's judge is never dispatched by the harness and has no seam. What it is
//   is a real model with real obligations (EVALS.md §1), so it needs a recordable identity —
//   model_id, provider, the content hash of its frozen prompt (§3), and the languages whose
//   Z-N mirrors it has passed, which is what licenses it to grade that language's Z-R items.
// call_type = normalize | narrate | summarize
//   Judgment is NOT a config key (2026-08-29): it rides inside normalize/narrate's calls and is
//   never separately dispatched, so a `routing.judgment` block would load a binding nothing ever
//   reaches. The seam above states the shape and owns it — "There are exactly four call types",
//   one of which "rides inside `normalize`/`narrate` rather than being separately bound"
//   (../harness/INTERFACES.md §2). Three call types are separately bound; four exist.
```
- **Config, never code.** A routing change (new model, new fallback, provider flip) requires re-qualification (`EVALS.md §3`) and nothing else.
- **Sampling is config too, and a binding is qualified at its sampling values** *(added 2026-08-29)*. `temperature` sits on every binding; `reasoning_effort` is optional and is an **adapter-owned opaque string** — handed to the provider unchanged, never translated, and deliberately **not** a shared cross-provider vocabulary: there is no settled industry one to adopt, and inventing a mapping here would be a claim no adapter could honour. Both are **qualified-at** fields, exactly as `context_budget_tokens` is: changing either is a **re-qualification, never a silent config diff**. The reason is the P-set — a variance instrument scored over independent triples (`EVALS.md §2`), and temperature is the single largest lever on that score, so a binding whose temperature moved is not the binding that passed. A fallback entry carries its own values the way it already carries its own `provider`.
- `byo-key` is the **owner's own provider API key** (FR5, 2026-08-06 — the ban is reversed; SPEC §7's tertiary supply). It is an ordinary `{call_type → model_id}` binding whose credential happens to be the owner's: **no new mechanism and no second code path**, which is the whole reason it is a provider value here rather than a parallel config. Attended-only confinement per SPEC §7 (**FR31**, founder-ruled 2026-08-07). The binding is stored here; **the secret never is** — it is vault-resident, and this config holds only the reference (`../security/SPEC.md §3.1`, member 2, asserted at `../security/SCENARIOS.md` T8).
- **`summarize` rejects every `byo-*` provider** — attended or not, console or trigger (SPEC §7, **FD-3** founder-ruled 2026-08-07). Both `model_id` and `fallback_model_id` must be app-supplied bindings (`openrouter` or `app-direct` — FD-67); a config naming a `byo-*` provider on this call type **does not load** (`BUILD.md` Step 4). Its `timeout_ms` rides the same attended/unattended defaults as every other call type — no special budget, and the retry/fallback path is SPEC §8's, ending fail-closed rather than in a degraded admit.

### 2.3 Stub, and the replay provider
The harness build already defines the model stub (`../harness/INTERFACES.md §5`): scripted structured outputs keyed per scenario. This layer's eval scaffold reuses the same shape in reverse — golden inputs, graded outputs.

**The replay provider** *(2026-08-29)*: the scaffold's keyless mode is itself an adapter satisfying §2.1's contract — it serves **recorded firings** instead of calling out, which is what lets the exam run in CI with no key and no spend. How those recordings are made, normalized and stored is `BUILD.md` Step 0's snapshot custody, cited here and stated only there.

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
  "intent": { "enum": ["commitment.create","commitment.edit","commitment.complete","commitment.cancel","commitment.confirm","commitment.mark","board.query","board.edit","rule.author","rule.edit","rule.override","proposal.respond","answer.provide","grant.give","grant.revoke","exception.record","sop.author","shared.author","shared.publish","notify.request","party.reenable","import.fetch","display.settings","session.control"] },
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
                  "labels":  { "type": "array", "uniqueItems": true, "items": {
                    "enum": ["contains-instruction","impersonation-attempt","document","question",
                             "request","confirmation","complaint","unresolved-reference"] } } } }
```
- `additionalProperties: false` is load-bearing here, not stylistic: it is what stops a quarantined model from smuggling an extra field into the privileged context. A return that validates is the *whole* of what crosses.
- **`uniqueItems: true`, not a length cap** *(corrected 2026-08-29 — the schema previously capped the array's length at the size of the enum below it, which over a closed enum can only ever trip on a duplicate; the constraint now states the rule it was always enforcing)*.
- **`labels[]` is a closed enum** *(2026-08-21 — as an open string array it was a free-text channel that validated, unbounded and outside the S-set's carry-through bar, while this section's own argument is that a return that validates is the whole of what crosses)*: it carries what the summary reports **about** the text and structurally cannot carry the instruction — there is no string to put one in. The carry-through bar covers `summary` and the label *choice* both (SPEC §1). Growing the enum is an exam-and-schema edit, same review as the intent vocabulary. `source_tag` is an input; the return has no field for it, so it cannot be changed or elevated (`../harness/INTERFACES.md §2.4`).

Judgment has no schema of its own — it rides inside `normalize`/`narrate` (SPEC §1).

---

## 3. What this layer OWNS (for contrast)

- The **intent vocabulary** (SPEC §2) and the per-call **output schemas**.
- The **prompt/instruction assets** — and this section is their home, their location and their version form *(stated 2026-08-29; "versioned like code" was a simile, and three files referenced these assets while none said where they were or what a version of one is)*. They live **in-repo under `model/prompts/`**, one file per separately-bound call type, **created by the build step that first needs them** (`BUILD.md` Step 2) — the FD-8 precedent, where a location is ruled for files that do not exist yet. **A prompt's version is the asset's content hash**: there is no second version register to keep in step, and the hash is exactly the value `EVALS.md §3`'s record means by "prompt version". A prompt edit changes the hash, and **a changed hash re-qualifies every binding that uses it** — `EVALS.md §3` step 1 already names "prompt" as a re-qualification trigger; the hash is what makes that trigger checkable rather than remembered. Prompt assets are **not `.md` documents**: they are instruction text, and they neither enter the tracked-markdown corpus nor move its counts.
- The **routing config** and its qualification-state records — **versioned the same way**, by the content hash of the artifact *(2026-08-29)*. They are **loaded at harness boot and again on every config change**, and §2.2's load-refusals apply at that moment rather than at review time, which is the whole of what makes them poka-yoke. **Where the artifact physically lives is `BUILD.md` Step 4's decision** — the step that first writes one — and is cited here, not pre-empted.
- The **recorded firings** the exam replays — the third evidence artifact, and the one the other two are checked against. Their custody is stated once, at `BUILD.md` Step 0's snapshot-custody text, and cited from here.
- The **exam** (`EVALS.md`) and its graded sets.

Everything correctness-critical is above (harness floor/loop) or beside (engine truth) — never here.
