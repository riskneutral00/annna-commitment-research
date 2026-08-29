# annnä Model — SPEC (the contract any candidate model must satisfy)

*Source of truth for the model layer, at **contract-and-exam level**: it defines what the model must do and how we know it does it (`EVALS.md`) — deliberately **no prompt text** (prompts are authored against the built harness, `BUILD.md` Step 2). Supersedes the earlier role-statement README (its content is absorbed into §0–§1 and §9).*

---

## 0. What the model layer is

The model **powers the agent**: language, world knowledge, and judgment, imported behind the harness's per-call seam (`../harness/INTERFACES.md §2`). It is swappable — per call, per tier, per provider — because everything correctness-critical lives elsewhere.

**The design bet:** the harness is strong enough that model choice barely matters. A weaker model never *corrupts* anything — the engine owns truth, the floor owns permission, and both are enforced structurally, not by trusting the model. What a weaker model costs is **pleasantness**: more unnecessary clarifying questions, clumsier proposals, worse phrasing. The exam (`EVALS.md`) is this bet's insurance: it measures exactly the pleasantness dimensions, so a cheaper model is swapped in on evidence, not hope.

## 1. The four calls — producer side

The harness consumes these (contract shapes in `../harness/INTERFACES.md §2`); this layer must *implement* them:

- **`normalize(utterance, context) → {intent, fields, ambiguities}`** — the owner's utterance on a console turn. **A trigger firing never calls this** *(FD-28, ruled 2026-08-21 — a short-lived union `utterance | trigger_event` was reversed: the closed vocabulary is owner-actions-only, so a hold-expiry had no intent to return, and the event already rode `handoff_frame`, arriving twice with no precedence rule)*: firings route deterministically in the harness, and the model is reachable on a firing only through `summarize` and `narrate`. Obligations: return an intent from the vocabulary in §2 (never a free-form action name); return field values **raw and unvalidated** (they are not trusted — the harness routes correctness-critical ones through the engine); populate `ambiguities` per the calibration in §3; use *only* the assembled context (never remembered conversation — there is none: the harness assembles context fresh per firing).
- **`narrate(structure) → text`** — obligations: every factual claim traces to the input structure (§4); voice per §6.
- **Judgment** — world-knowledge choices inside the other calls (which kind this sounds like, which template is nearest, how to phrase). Bounded by §5.
- **`summarize(raw_text, source_tag) → {summary, labels[]}`** — the quarantine read (seam contract `../harness/INTERFACES.md §2.4`; law `../security/SPEC.md §5`). Obligations: return **only** the declared structure — never free text, never a field the schema does not name; **no instruction in `raw_text` may survive into `summary` — or into `labels[]` — as an instruction** *(the labels half stated 2026-08-21: an open string array is a text channel that validates, so the bar covers every field that crosses)* (an imperative is reported *as a labelled fact that the text contains one*, never re-emitted as a directive); **material facts the owner would need are preserved** — an over-aggressive reduction that drops the guest's real request is a failure of this call, graded as its own mode (`EVALS.md` S-set); `source_tag` is an input the return may not alter or elevate. This call is bounded by §5 more tightly than the others: it is **not judgment** at all.

**Compound utterances** ("cancel day 3 and let James know") normalize as an **ordered sequence of single-intent actions**; the harness's plan stage owns ordering and the floor gates each action independently. *(Producer-side note: `BUILD.md` Step 1 must reconcile this with the built harness's actual dispatch shape.)*

## 2. The intent vocabulary

The enumerated intents `normalize` may return — **derived from the harness's surface, never invented**: most rows from the tool contract (`../harness/SPEC.md §5`) and elicitation policy (§6), and the rest from the harness laws their "Lands on" column names — the §3.4 latches (`commitment.cancel`/`confirm`), §3.8's marks (`commitment.mark`), §7 + FD-24 (`grant.give`/`grant.revoke`), §3.11 (`party.reenable`), and the T2 session law (`session.control`) *(the claim previously named §5/§6 alone, which was false for a third of the table and made BUILD Step 1's reachability check vacuous over eight intents)*. A model returning an intent outside this table is malformed output (§8).

| Intent | Raw fields | Lands on (harness side) |
|---|---|---|
| `commitment.create` | title, kind?, times+roles, consumes/board, party, order? | `CRUD_Commitment` |
| `commitment.edit` | target ref, changed fields | `CRUD_Commitment` |
| `commitment.complete` | target ref, actual_end? (task tick / early return) | `CRUD_Commitment` |
| `commitment.cancel` | target ref, scope: member \| whole-order | cancel latch (+ floor if outward consequence) |
| `commitment.confirm` | target ref | confirm latch |
| `commitment.mark` | target ref, mark: priced \| paid \| held \| settled \| no-show | internal latched mark (§3.8 money; `no-show` per `../engine/SPEC.md §1.9` — always a human mark, and this intent is how the human's words reach it). `owed` is **not** a member: it is derived, never written *(enum widened 2026-08-21 from `paid \| settled` — two of the marks an owner can set, out of five)*. `held` stays the fifth mark (D-B) but does not currently land: until the deposits ruling names its trigger, every write attempting it is refused (`../engine/SPEC.md §1.9`'s deliberate poka-yoke, surfaced as `refused \| unruled` — `../harness/INTERFACES.md §7.1`) *(noted 2026-08-22)*. **The why, so nobody re-asks it as a riddle (recorded 2026-08-29):** Situation B is a motorbike rental whose shop wants a deposit held until return; teaching (Situation A) never needs one. Deliberately unruled until Situation B's fixture is walked (FD-79 re-confirmed) — do not invent Stripe; money stays records, never rails |
| `board.query` | the question (availability / gap / what's-on) | `calculate` (read-only) |
| `board.edit` | board ref, attribute/declaration diff | `CRUD_Board` (diff-only) |
| `rule.author` | type, raw operand, target, proposed scope | rule write (diff) |
| `rule.edit` | rule ref, change or revoke | rule write (impact surface first) |
| `rule.override` | conflicting rule ref, reason | own-rule override, stored with reason |
| `proposal.respond` | accept \| narrow(scope) \| reject \| reject-permanently | elicitation store |
| `answer.provide` | the answer to a pending elicitation question — the stored `PendingAsk` the context's `pending_asks[]` slice names (`../harness/SPEC.md §3.13`; no conversation is carried) | store-routing (Rule/Grant/field/Exception) |
| `grant.give` | action_class, scope, expiry | Grant object |
| `grant.revoke` | grant ref | Grant revoke (impact surface) |
| `exception.record` | reason | M2 exception field |
| `sop.author` | content / upload ref | `CRUD_SOP` |
| `shared.author` | nearest-template base, field add/removes | generative-UI + `CRUD_Shared` (Lego authoring) |
| `shared.publish` | shared ref, audience/recipients | `CRUD_Shared` publish (**outward**) |
| `notify.request` | recipient, payload ref | `send` (**outward**) |
| `party.reenable` | party ref | the §3.11 suppressed-party re-enable — an ordinary attributed owner act that previously had no intent to arrive on *(added 2026-08-21)* |
| `import.fetch` | connection ref? (which connected calendar) | `import_fetch` — the attended pull (FD-49): reachable only within a caller-initiated firing, never a trigger firing; the app executes it against the vault-held credential, and the returned items' free text is `import`-tagged for the quarantine read, taking the ordinary propose→confirm walk — nothing auto-commits (`../harness/SPEC.md §5.2`) *(added 2026-08-22)* |
| `display.settings` | display-settings diff | `display_settings(diff)` — the owner's display-only settings write into the app-owned store (FD-66, FD-42's ratified mechanism): the diff carries only members of `../app/SPEC.md §7`'s closed set (an off-set member is a rejected write); never engine truth *(added 2026-08-22)* |
| `session.control` | save \| resume \| abandon | **T2 interview state only** — the external surface's turn resume/abandon (RQ-6) is the write-id continuation (`../harness/SPEC.md §5.3`), never an utterance, so the two resumable objects cannot collide on this verb set *(disambiguated 2026-08-21)* |

Field schemas stay **raw at this seam** (strings/numbers as heard); typing is `typed_value`/engine work — **time phrases included** (FD-27, shape narrowed by FD-57 2026-08-22): the model returns *"Thursday 3–4pm"* as heard **and may propose a structured instant beside it** — an *input* under FD-16's model-supplies-inputs clause, which the engine verifies by re-rendering and refuses on mismatch (`../engine/SPEC.md §2`); what stays forbidden is a model-resolved instant reaching any typed position **unverified** (§5). This table freezes only at `BUILD.md` Step 1, against the built harness's tool contract. `reject-permanently` is a distinct response, not a stronger `reject`: `reject` declines this proposal, `reject-permanently` declines the pattern for good and writes a `PatternDecline` (`../harness/SPEC.md §3.10`). Without the fourth member the model has no way to report the difference and the harness has no way to store it.

## 3. Ambiguity calibration

`ambiguities` must be **non-empty** when the utterance admits ≥2 readings that differ in **stored effect or floor status** (different target, different scope, different reversibility). It must be **empty** when readings converge, or when the difference is reversible *and* inferable (the harness just acts — the floor is the act/ask line, and the model must not manufacture questions the policy says not to ask).

The failure pair this calibrates against: **over-ask = nagging** (the elicitation policy's enemy), **under-ask = guessing** (the floor's enemy). Graded paired examples: `EVALS.md` set A.

## 4. Narration fidelity (the D7 criterion, made checkable)

Every factual claim in `narrate` output must trace to a field in the input structure. Paraphrase is allowed; **invention is not** (no facts absent from the structure — e.g. no promised refund when no refund policy is stored); **material omission is not** (a floor-relevant fact in the structure — a fee, an expiry, a condition — must appear). This is what the harness's D7 spy and check-work read-back verify. Grading rubric: `EVALS.md` set R.

## 5. Judgment boundaries

**Allowed (reversible, non-correctness-critical):** proposing which kind an utterance sounds like; picking the nearest template to pre-shape; choosing phrasing and question order; suggesting a likely scope for a proposal (user still accepts/narrows).

**Forbidden (structural, not behavioral — the tool contract blocks these, but a model attempting them fails the exam):** authoring times, prices, availability, balances, or quota verdicts as literals — **an *unverified* resolved instant is a time literal**: the raw phrase always crosses the seam, a proposed instant may ride beside it as an input, and only `typed_value`'s render-and-compare verification turns either into a typed value (FD-27 + FD-57, `../engine/SPEC.md §2`); asserting a grant exists; deciding a crossing is safe; placing a commitment (placement is an engine `resolve` handle); composing outward prose freely (§4).

**`summarize` is not judgment, and the boundary is tighter.** Reducing untrusted text is a **structural** operation, not a world-knowledge one: within `summarize` the model may not **propose** anything, may not **infer intent** behind the text, and may not **resolve references** in it ("the other booking", "as we agreed", "the usual") — an unresolved reference stays unresolved and is reported as such. Every allowance in the list above is withdrawn for this call. The reason is the failure mode: judgment inside a quarantine read is how an injection gets laundered into a plausible-sounding fact, and a laundered instruction is indistinguishable from a real one downstream.

## 6. Voice

- **Propose, don't interrogate** — recommended answer + scope, user accepts or narrows.
- **Lead with what happened**, then what's needed. Short. One question at a time.
- **Decline by naming the blocking rule** ("that would put Ms. Chen over the 10-hour monthly limit you set"), never a bare refusal.
- Outward narration is factual and neutral — never pressures a third party.
- **Language coverage is a model-selection constraint, derived from the stories:** `normalize` and `narrate` must handle the languages annnä's app users actually speak — per the user-stories corpus (the falsification probes, FD-35) that is **Thai, Mandarin, and English** (Hug Ocean runs zh/th/en; Situation C's resource owners work in Thai). The set is market-driven config, not a fixed list. **The consequence is binary per call type** *(reconciled with `EVALS.md` Z 2026-08-21 — this sentence previously named `normalize` alone while the Z-set disqualifies `narrate` too, and neither file said what "disqualified in that language" operationally means)*: the routing config has no language dimension (`INTERFACES.md §2.2`), so a binding that fails any required language's Z sub-set is **disqualified for that call type outright** — there is no per-language binding to fall back to, and pretending otherwise would be config the schema cannot express. **Outright means every slot of that call type: primary or fallback, attended or unattended** *(the slot scope stated 2026-08-29 — "disqualified" left a reading in which a Thai-failing model was merely not the primary, which is how it becomes the 3 a.m. `narrate` fallback instead)*. The disqualification is the call type's, not the language's, because the config has no language dimension to record a narrower one in.

## 7. Supply & routing

**Primary — app-supplied via OpenRouter.** The user pays for annnä and never sees any of this. *(2026-08-24, G2-2: OpenRouter account and keys are the founder's later act. First local test uses stubs. Do not invent a second pipe. This does not block Ready for the application build in this repo.)* Each call type binds to a model through the **routing config** (`INTERFACES.md §2.2`, all of whose fields carry law — the shape is stated there once and not abbreviated here, because an earlier three-field restatement of it silently dropped `context_budget_tokens` (whose swap is a re-qualification, never a config diff) and `provider` (the field FR31 and FD-3 are enforced on)). Model identity is **config, never code**; swapping requires re-running the exam (`EVALS.md` qualification), nothing else. Expect cheap models to qualify for `narrate` first, `normalize` later.

**Secondary — CUT (FD-65, 2026-08-22).** The ChatGPT-subscription slot this paragraph specified is removed: the vendor programme it was contingent on has been identity-only since 2026-08-02, and a provider enum member, a build step, and an OAuth integration for a programme that no longer exists is speculative machinery. The mechanical reason the slot was attended-only — subscription-bound access cannot power the server-side 3am loop — is preserved below because it binds every BYO shape, not just this one. If the vendor programme returns, one ruling restores the slot behind the same config shape. FR5/FR31 (`byo-key`) and FD-3 are untouched. *(History note, 2026-08-23 research: Codex ChatGPT-OAuth is a Codex-tooling login with no documented third-party contract — never a general API — and no Hermes-class client reusing that login is to be built here.)*

**Tertiary — BYO API keys (FR5, 2026-08-06 — the ban is reversed).** An owner may bind their own provider key through the **same routing config** (`INTERFACES.md §2`): a key is a `{call_type → model_id}` binding whose credential happens to be theirs. No new mechanism, no second code path. **The binding lives in the routing config; the key itself does not** — it is a held credential and lives in the vault under `../security/SPEC.md §3.1` (member 2), with the same custody, revocation and erasure rules as the calendar refresh token.

**The confinement — *founder-ruled 2026-08-07* (wayfinder #3; registry `../RULINGS.md` §2026-08-07): BYO powers *attended console calls only*.** FR5 reversed the ban; the attended-only confinement below, first drafted on the founder's behalf, was ratified as written. App-supplied models **always** back trigger firings — and "app-supplied" is a property, not a vendor (FD-67, 2026-08-22): OpenRouter is the primary gateway, and an **app-held direct provider key** (`app-direct`, vault-custodied like any `../security/SPEC.md §3.1` credential) is an equally lawful app-supplied binding, so the one gateway is no longer a single point of failure written into law. Two independent reasons for the confinement, either of which alone is sufficient:

1. **Mechanical (the subscription case):** the 3 a.m. loop runs server-side with no user session, so subscription-bound access physically cannot serve it.
2. **Qualification (the API-key case, and the more important one):** a user-supplied model is an **ungraded path to the same seam.** Every app-supplied binding must clear the exam (`EVALS.md`) before it goes live — that is what makes the invention floor and the judgment boundaries mean anything. A BYO model has cleared nothing. Confining it to **attended** turns means a human is present, reading the output, at the moment an unqualified model speaks. Unattended, nobody is. *An unqualified model may never act while nobody is watching.*

- **The structural guarantees do not depend on the model.** The tool contract, the floor, and handle-typed values block a bad model the same way whichever key paid for it (§5, §9) — BYO widens no authority.
- **What BYO can degrade is what only the exam catches:** invention in `narrate`, mis-calibrated ambiguity, a forbidden literal attempted. Those are graded failures, not structural ones — which is exactly why the attended confinement is the control.
- **The owner is told, once, plainly:** their own model powers their console turns, annnä's models run their triggers, and annnä does not vouch for a model it did not qualify. Stated, not buried.
- **Fallback is app-supplied, always — and the config can now say so** *(2026-08-21: a single per-entry `provider` field made this rule and the attended-only confinement structurally unrepresentable)*: `provider` is **per-binding** (primary and fallback each carry their own) and the binding dimension **splits attended/unattended** the way `timeout_ms` already did, so a `byo-*` primary always names an **app-supplied** fallback (`openrouter` or `app-direct` — FD-67), trigger firings always resolve to the unattended (app-supplied-only) binding, and both rules are refused at config load rather than reviewed (`INTERFACES.md §2.2`). A BYO binding that fails takes **§8's ladder** like every other binding; what this section owns is *where* it falls back — to the qualified app model, never to silence.

**`summarize` is app-supplied only, always — never BYO, not even attended *(FD-3, founder-ruled 2026-08-07; registry `../RULINGS.md`)*.** This is **stricter than the confinement above**, and deliberately so, because it is a different kind of rule. The attended-only confinement exists because an unqualified model degrades *pleasantness* while a human watches: a clumsy sentence, a mis-calibrated question. The quarantine read is not that. It is a **security control**, and its failure mode is a breach — an injection reaching the tool-bearing model — not an awkward turn. **A control the owner can weaken is not a control.** A human being present does not help: nobody reading a summary can see the instruction that was laundered into it, which is the whole reason the raw text is kept out of the privileged context in the first place. So the confinement here is not "attended only" but "never".

- **The cost is real, is annnä's, and is stated rather than hidden.** annnä pays for a `summarize` call at **every door `../security/SPEC.md §5` admits non-owner free text through**. §5 owns which doors exist and keeps that list current; this section owns only what they cost, so **a door added there is a cost added here without this paragraph being touched** *(the channel enumeration this paragraph used to carry became a citation 2026-08-29: it had already drifted twice — once when the external-client surface landed and once when the marketplace install did — and a restatement that has drifted twice is a citation waiting to be written)*. **The bill is annnä's and there is no opt-out** — including for owners who brought their own key and pay for their own console turns: a BYO owner's quarantine reads are on annnä's bill, always, with no way to shift them onto their own key. That is the accepted price of the control, and it is written here so nobody costing this layer later mistakes it for an oversight. **What bounds the spend belongs to the doors, not to this layer:** calendar sync is owner-triggered (FR12 — no background pull, so no background spend), and the external-client surface carries its own declared limits, the seed call rate and the **per-credential daily model-spend cap** (`../security/SPEC.md §10`). (`summarize` is the cheapest of the four calls — structured reduction, no judgment, §5 — which is what makes the price payable, not the reason it is charged.)
- **Enforced at config load, not in review.** A `byo-*` provider bound to `summarize` is **unconstructable** — the routing config refuses to load, the way an unqualified binding already does (`BUILD.md` Step 4; `INTERFACES.md §2.2`). Poka-yoke, because a rule that depends on someone noticing a config line is not a rule.

**Ruled out:** Anthropic BYO-subscription (banned for third-party apps **as of Feb 2026 — a vendor-terms fact** *(the BUILD Step 5 re-check this clause scheduled left with the FD-65 cut, 2026-08-22 — the ruling-out is not contingent on it)*; vendor subscription programmes are exactly the class of fact that moves).

## 8. Failure behavior

The **harness validates output shape at the seam** — the model is never trusted to self-validate. No failure path may skip the floor or invent a partial result.

**One ladder, for every failure of every call type** *(one statement, reconciled here 2026-08-29 — four texts carried four incompatible ladders: this section's two paragraphs, §7's BYO-fallback sentence, and the `timeout | model` row at `../harness/COMPAT.md §1`, and no two agreed on when the fallback engages or whether a timeout is retried)*. Every failure arrives as a member of the error union — **malformed, refused, timeout, unavailable** (`INTERFACES.md §2.1`; malformed covers schema violation, unknown intent, unparseable) — and every member takes the same three rungs:

1. **one bounded retry on the same binding**;
2. on a second failure, **one attempt on the fallback binding** for that call type (`INTERFACES.md §2.2`);
3. terminal — the turn surfaces as a **gap** (attended) or **parks** (unattended), per the harness loop.

Nothing distinguishes the members at this seam: a refusal reaches the fallback exactly as a timeout does, and a timeout is retried exactly as malformed output is. Distinguishing them would mean the *cause* of the failure changes what the owner gets, which it does not.

**`summarize` fails closed, and this is the one failure path that does not degrade gracefully.** It runs the ladder above unchanged; what differs is only the terminal. When the ladder is exhausted with no valid summary, the raw text is **not admitted to the assembled context at all**, and the firing surfaces a gap (attended) or **parks** (unattended). The harness half is `../harness/SPEC.md §8`, asserted at `../harness/SCENARIOS.md` L7. What this forbids is the graceful-looking option: admitting the raw text with a warning attached, which turns the control off precisely when it failed.

## 9. What the model layer is NOT

- **No memory.** Context is assembled by the harness per firing; the model re-derives nothing from conversation history (there is none at trigger firings).
- **No tool authority.** It cannot call tools; it returns structures the harness dispatches under the floor.
- **No correctness-critical literals.** Ever (thin agent, structural).
- **No free outward composition.** Third parties hear `narrate(structure)`, nothing else.
- **No training/fine-tuning.** Steering is prompts + routing + the exam.
