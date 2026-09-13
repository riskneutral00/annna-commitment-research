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

For owner draft interactions, consume the validated current draft/view context from `../harness/INTERFACES.md §3.1` and §2.1: selected object/use, revision, field, scope, ask and submitted source span. Normalize the submitted instruction against that context, preserving raw values and source tags; an example that was not sent is no instruction. Narrate pending questions and accepted proposals from stored structure (`../harness/SPEC.md §3.13`), distinguishing draft acceptance from applied results. The model cannot mint draft/committed revisions, transfer an old OK to changed content, infer persistence from an echo, compute travel or widen authority. Trigger processing remains deterministic and never calls normalize. Qualification controls are `EVALS.md` N-15/N-16, A-11/A-12 and R-11/R-12 at existing BUILD Steps 1–3.

For `guest-interactive`, consume only `../harness/INTERFACES.md §2.1`'s guest refinement and normalize its validated guest-tagged summary, never raw stranger text or owner context. Apply the existing intent schema then the harness's narrower executor allowlist; `summarize` preserves requested fields as facts under `../security/SPEC.md §5`, without inferring permission or resolving references. The same request/draft/ask correlation governs readback. Returned-form triggers stay deterministic and ordinary page rendering bypasses this layer.

`sop.author` consumes `SPEC.md §2`'s admitted content/reference path under `../harness/SPEC.md §3.6`, never an owner/guest upload reference or a participant verification result. `summarize` receives administrator-approved source content as `document`-tagged text under `../security/SPEC.md §§4–5`; approval cannot elevate `source_tag`, bypass quarantine or authorize an ingestion route. Preserve the policy-shaped imperative coverage in S-03 at the existing model BUILD Steps 1/3. The form-return/evidence refinement is noticed at `../harness/INTERFACES.md §7.2`; typed form triggers remain deterministic, with consent governed by its §3.3 and harness SPEC §3.4.

Ordinary translation drafting for owner-facing and guest-facing copy (`../app/SPEC.md §5`, `../marketplace/SPEC.md §6`) is an **owner authoring-time draft interaction** over the §3.1 context above and adds no call to this table: the return is an unapproved candidate the owner reviews, never published copy, and this layer neither stores it nor decides its approval. No call on this seam exists on the path that loads a guest page, renders its schema or renders a catalog or preview card; a request that renders approved stored copy reaches this layer not at all.

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
- **Envelope mapping.** Upward, `unavailable` surfaces as the refusal envelope's **existing** `` `unavailable` | `provider` `` reason (the closed reason table, `../harness/INTERFACES.md §7.1`) — the model provider is a third-party provider like the travel source and the calendar provider, so this names a cell that already exists rather than widening a closed set. Naming the model provider in that cell is the harness's own edit, not this layer's.

### 2.2 Routing config (the layer's one real artifact)

**An external-client turn resolves to the app-supplied binding** *(2026-08-31, F-12 — the surface existed with no routing binding named)*: a turn arriving through the external surface (`../PRD.md §4.2`; `../harness/SPEC.md §5.3`) runs on the **app-supplied** binding exactly as an unattended firing does — BYO powers *attended console calls only* (`SPEC.md §7`'s confinement), and an agent's credentialed call is not the owner attending; the config carries no per-client override.
Privacy notice and retained-copy treatment are `../security/SPEC.md §§4/12`'s. The existing adapter/routing record identifies actual provider recipients, processing purposes, no-training terms and retained-copy bounds for quarantine inputs, summaries, context and returns, including retry/fallback recipients. Before the affected guest input is transferred, the app/harness path requires that home's timely notice/required choice; ordinary stored-page reads still cause no model call. Purpose withdrawal prevents further processing dependent on that choice. App-supplied guest/quarantine routing stays unchanged; BYO disclosure does not authorize a guest BYO binding. Erasure readback distinguishes provider limits from verified local destruction; unavailable provider retention information is never reported as zero.

**Guest-interactive binding selection** (`SPEC.md §7`): use each call type's qualified app-supplied `unattended` primary/fallback and timeout values in the existing config. This is a supply selection, not a trigger classification: the interactive guest call still carries its distinct context mode, can normalize its quarantined request and surfaces attended gaps under SPEC §8. It never uses the owner-attended/BYO slot. Config load and dispatch both reject absent/unqualified guest qualification, any BYO primary/fallback for this route, and missing/non-finite guest limits from `../security/SPEC.md §10`. Qualification records identify guest-interactive mode and the limits exercised; any change to a binding or its qualified-at limits re-qualifies that mode. No extra provider enum, call type or secret is introduced.

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
// firing_budget: max_steps_per_firing bounds the harness's routed-step count, defined at
//   ../harness/SPEC.md §4a; max_cost_per_firing bounds accumulated provider charge below.
//   Neither field supplies effect authority or replaces that home's effect allowance.
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
**Provider-charge aggregation — one accounting home.** The model adapter accounts for every provider invocation attributable to a firing: primary, bounded retry and fallback, successful or failed, across all separately-bound call types. Include assembly's `summarize`, `normalize`, `narrate` and any check-work calls. `max_cost_per_call` bounds each invocation, including retry and fallback; `max_cost_per_firing` bounds their accumulated charges across the whole firing. A routed tool call with no provider invocation adds no provider charge; a priced failure adds its incurred charge even when it produces no structure or effect. Judgment inside another call adds no second invocation. Charges and their applicable configured cost caps use the same monetary unit; routed-step and effect counts cannot be coerced into it. No numerical setting is changed by separating these measures.

**Attempt accounting is adapter bookkeeping, not model-authored output.** Correlate each invocation with its firing, logical call, attempt and selected binding, and with the originating credential and bound guest request when applicable. Record provider usage/charge for successes and errors independently of the validated return; a replay of the same usage observation is not a new charge, whereas another actual attempt is. Carry that accounting to the harness's firing total and the security-owned daily total (`../security/SPEC.md §10`) without adding a fifth model call or inserting billing fields into the model's output schema. The adapter must expose the accounting outcome even when no valid model output exists; exact carrier/storage mechanics are BUILD work, not another provider or service.

**No failure or switch resets accumulated charge.** Before every invocation, including retry/fallback, enforce its per-call cap and the remaining per-firing and applicable daily or guest-request allowances (`../security/SPEC.md §10`). Settle incurred charges against those same totals on either success or failure; a cap trip does not erase already incurred spend (`SPEC.md §8`). Cancellation, timeout or missing usage is not evidence of zero cost: an unresolved charge stays outstanding, and no further attempt may rely on headroom that cannot be established. Recording a later usage result does not re-run the call. Harness re-entry/continuation keeps the same firing total (`../harness/SPEC.md §4a`); switching call type or binding creates no fresh firing allowance. The daily window and suspension consequence belong only to `../security/SPEC.md §10`. Per-call exhaustion takes `SPEC.md §8`'s bounded failure ladder only while the enclosing protections permit its next invocation; per-firing exhaustion takes the harness's typed budget stop. Provider billing evidence proves no outward effect, permission or delivery.

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
- **Both branches also carry an owner-turn adaptive proposal, and no member is added for it** *(2026-09-12, FD-105; `../harness/SPEC.md §4a`, seam note `../harness/INTERFACES.md §2.1`)*. A proposed next permitted owner action is the same `{intent, fields}` object this schema already admits — the harness validates it against the closed `intent` enum, its routing tables and the floor, then dispatches it or records it refused. **Nothing in this schema widens:** there is no tool name, no tool-sequence and no schema field for either, `additionalProperties: false` holds on both branches, and the enum here stays SPEC §2's one source. A returned intent outside the enum is malformed output (SPEC §8), not a weaker proposal.
- **`fields` is where a supplied catalog candidate's identity travels back, as raw reference values.** When the turn's context carried `catalog_result` (`../harness/INTERFACES.md §2.1`), a `shared.author` or `session.control` return selecting a candidate carries that candidate's **supplied** item id and content version in `fields` as the raw reference values they are — the harness resolves them against the supplied eligible set and rechecks a moved one, so an id the member never carried resolves to nothing. The schema adds no catalog member, because `fields` is schema-open by design (above) and a closed catalog member here would be a second home for `../marketplace/SPEC.md §6`'s contract.

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
- The **prompt/instruction assets** — and this section is their home, their location and their version form *(stated 2026-08-29; "versioned like code" was a simile, and three files referenced these assets while none said where they were or what a version of one is)*. They live **in-repo under `model/prompts/`**, one file per separately-bound call type plus the judge/grader asset beside them, **created by the build step that first needs them** — the FD-8 precedent, where a location is ruled for files that do not exist yet. **Which step that is differs by asset, and both producers are named** *(2026-09-13 — this section named `BUILD.md` Step 2 for every asset while Step 0 already exercises call assets and `EVALS.md §1` already authors the judge prompt with the scaffold, so one file had two producers)*: `BUILD.md` **Step 0** creates the **provisional** call assets the scaffold is calibrated against and the **judge/grader** asset, whose authoring and re-freezing lifecycle is `EVALS.md §1`'s and is cited here rather than restated; `BUILD.md` **Step 2** authors the **production** call assets that replace the provisionals. Location and version form below are this section's for all of them, judge asset included. **A prompt's version is the asset's content hash**: there is no second version register to keep in step, and the hash is exactly the value `EVALS.md §3`'s record means by "prompt version" and the value the pinned judge's `prompt hash` member means (`EVALS.md §1`; §2.2's `judge` block). A prompt edit changes the hash, and **a changed hash re-qualifies every binding that uses it** — `EVALS.md §3` step 1 already names "prompt" as a re-qualification trigger; the hash is what makes that trigger checkable rather than remembered. Prompt assets are **not `.md` documents**: they are instruction text, and they neither enter the tracked-markdown corpus nor move its counts.
- The **routing config** and its qualification-state records — **versioned the same way**, by the content hash of the artifact *(2026-08-29)*. They are **loaded at harness boot and again on every config change**, and §2.2's load-refusals apply at that moment rather than at review time, which is the whole of what makes them poka-yoke. **Where the artifact physically lives is `BUILD.md` Step 4's decision** — the step that first writes one — and is cited here, not pre-empted.
- The **recorded firings** the exam replays — the third evidence artifact, and the one the other two are checked against. Their custody is stated once, at `BUILD.md` Step 0's snapshot-custody text, and cited from here.
- The **exam** (`EVALS.md`) and its graded sets.

Everything correctness-critical is above (harness floor/loop) or beside (engine truth) — never here.
