# annnä Model — BUILD (ordered plan, dependency-honest)

***Dependency:** Steps 1–5 want the **built** harness (the harness build — `../harness/BUILD.md` — produces the real tool contract, real assembled contexts, and real check-work mismatches these steps consume). Before that exists, only Step 0 and EVALS seeding are worth doing. This file is the ordering, written now so the layer's shape is fixed; it is not an invitation to start early.*

## Step 0 — Eval scaffold
- Stand up the exam runner: load an EVALS set, call `complete()` through the provider seam, grade (exact-match + rubric), report per-set scores against thresholds.
- Seed with the EVALS §2 **text sets** as they stand — **including the S-set**, whose two modes (carry-through, loss) are scored separately from the start; a scaffold that reports one S number has already lost the loss trap. **The P-set is not seeded here** *(2026-08-21)*: it grades stored engine state after a real turn, and this scaffold has no turn execution, no engine, and no fault injection — P joins at Step 3 (EVALS §2's P section states the deferral).
- **This scaffold subsumes the DR-7 spike, and the spike is then deleted** *(2026-08-21 — DR-7 closes on exactly this event, `../deployment/SPEC.md §8`, and no step here previously owned it)*: `model/spike/run-nset.mjs` is the N-set-only precursor; when this runner can produce its number, the spike directory is removed in the same change and DR-7's register entry closes.
- **Verify:** the scaffold runs the N-set against any one OpenRouter model and produces a scorecard; the spike directory no longer exists.

## Step 1 — Intent-vocabulary freeze
- Reconcile SPEC §2 against the **built** harness's actual tool contract and dispatch shape (including the compound-utterance sequence encoding, both `oneOf` branches — INTERFACES §2.4).
- **Verify:** every harness tool action is reachable from exactly one intent; no intent lands nowhere — **ranging over the full derivation surface SPEC §2 names** *(widened 2026-08-21: the check previously walked §5's tool tables only, so it passed while proving nothing about the eight intents that derive from the latch, mark, grant, re-enable and session laws)*.

## Step 2 — Prompt authoring
- Write the per-call instruction assets (normalize / narrate) against real assembled contexts from the built harness. Version them like code.
- **Verify:** prompts reference only the context contract's fields (`../harness/INTERFACES.md §2.1`); no prompt asks the model to compute or permit anything (SPEC §5/§9).

## Step 3 — Qualification runs
- Run the exam (EVALS §3) across candidate models per call type; grow the sets with harness check-work mismatches as they appear.
- **Snapshot custody, ruled now and mechanized later** *(2026-08-28, part of FD-84 — the replay invariant at `../harness/SPEC.md §3.14` names this step as its landing site)*: recorded **real-model firings** — the future replay fixtures — live **in-repo, committed**, like every other permanent test corpus. **Re-recording is a deliberate keyed act through a separate command, never a side effect of a green build**: a suite that silently re-records its own expectations cannot fail. The record-then-replay-keyless CI step is this step's future mechanism and is **not built now** — a readiness condition, not a date.
- **Seed candidate list** *(founder-approved 2026-08-06; OpenRouter slugs verified against the live registry at Step 0 — the exam decides, this list only says who sits it first)*: cheap tier, expected to qualify for `narrate` first — `tencent/hy3:free` (the prior build's live binding) and one current DeepSeek chat slug; frontier tier, for authoring prompts and as the quality ceiling — one current Anthropic Claude slug and one current OpenAI GPT slug via OpenRouter. Grow from the registry at run time; never hardcode a slug outside the routing config.
- **Verify:** at least one binding per **separately-bound** call type — `normalize`, `narrate`, `summarize` (judgment is not separately bound, `INTERFACES.md §2.2`) — passes; the 100%-bars (`EVALS.md §1`'s canonical enumeration) are perfect; every required language's Z sub-set (th, zh-TW, en — SPEC §6) passed by the `normalize` **and `narrate`** bindings; **the P-set runs here for the first time** (its repetition rule, EVALS §2) and the qualifying `normalize` binding clears it. **At least one binding passes the S-set with carry-through perfect** — this is the `summarize` binding, and there is no fallback posture that lets an ungraded model serve the call (EVALS §3 step 5).

## Step 4 — Routing config
- Write the qualified `routing` config (INTERFACES §2.2) with fallbacks and cost caps; wire the qualification-state record.
- **Verify:** an unqualified binding cannot go live (poka-yoke at config load, not review-time discipline). **A `byo-*` provider on `summarize` — in `model_id` or `fallback_model_id` — is unconstructable at config load**: the config refuses to load, the same mechanism as the unqualified-binding rule above, not a review checklist item (SPEC §7, **FD-3** founder-ruled 2026-08-07; INTERFACES §2.2).

## Step 5 — ChatGPT-subscription slot — CUT (FD-65, 2026-08-22)
- The step's content is removed with the slot: the vendor programme has been identity-only since 2026-08-02, so there is nothing to integrate and no terms check to run. The step number is kept so citations resolve; if the programme returns, the restoring ruling re-opens this step with the old content (one paragraph, preserved in history).
- **Verify:** with BYO active, a trigger firing still resolves to an app-supplied binding (`openrouter` or `app-direct` — FD-67); revoking BYO degrades to app-supplied with no behavior change beyond billing.

## Guardrails
- **The exam gates everything:** no model, prompt, or routing change goes live unqualified (EVALS §3).
- **No prompt smuggling:** if a prompt starts encoding policy (scopes, floors, prices), stop — that belongs in the harness/engine, and the exam's J-set should have caught it.
- **Scope:** anything deterministic you're tempted to build here is the harness's or engine's; this layer owns only vocabulary, prompts, routing, and the exam.
