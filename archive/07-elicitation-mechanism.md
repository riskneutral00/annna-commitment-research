# 07 — The Elicitation Mechanism (harness Step 2)

> ⚠️ **Historical — this is design *history*, not the build plan.** Preserved so decisions can be traced to their reasoning. Where anything here conflicts with a layer package (`harness/`, `engine/`, `app/`, `model/`), **the layer's `SPEC.md` wins.** Start at the [root README](../README.md).


*The machinery for the user-config pile (`06`): turn unknown user policy into stored, reusable policy — **ask once, apply forever** — without nagging, over-applying, or silently guessing. Everything here traces to a settled decision (D1 templates-primary, M1 floor, M2 gate, ask-and-encode) or a named finding; nothing speculative. Scope: the harness's elicitation policy only.*

---

## 0. What this is not
Elicitation does not decide policy — the **user** does. The harness detects the gap, proposes, captures the answer, stores it addressably, and applies it thereafter. It never invents a policy and never guesses across the M1 floor.

---

## 1. When elicitation fires — the five gap types
A **gap** = the agent needs a value or policy to act and doesn't have one. Only these fire a question:

- **G1 — Missing required input.** A declared `kind`'s required attribute is unset; or (M2) a governed-board commitment resolves to neither a `kind` nor an `exception`.
- **G2 — Uncovered floor-crossing.** An across-the-line act (M1: comms / value / destruction) with no matching grant and no live confirmation.
- **G3 — Conflict.** A new rule/answer contradicts an existing rule.
- **G4 — Ambiguity.** The utterance admits more than one normalization the agent can't safely pick.
- **G5 — Coverage gap.** A governed board is about to go live with a policy hole a real event will hit (e.g. no decline-handling policy).

**Not a gap (never ask):** anything reversible and inferable → just act; it's undoable (M1 — reversible work runs at full autonomy). The floor is the line between "act" and "ask."

---

## 2. How it asks — house style
- **Propose, don't interrogate.** The agent states a **recommended answer**; the user accepts ("k") or edits. An opinionated agent is the product thesis — never a blank open question when a sensible default exists.
- **The proposal includes the SCOPE.** Not just the value but how widely it applies ("apply the 5-min buffer to *all your teaching sessions*?"). The user confirms or narrows. This is the poka-yoke on scope — it prevents both nagging (too narrow) and over-applying (too broad).
- **One gap at a time**, unless several are independent and bundle into a single confirm.
- **Structured asks use the generative-UI tool** (typed schema from the fixed catalog); simple ones are console text.

---

## 3. What gets stored — routing by what the answer governs
The answer is normalized into a durable, **addressable** object (so it can be shown, edited, revoked):

| The answer governs… | Stored as |
|---|---|
| policy over a kind / board / audience | **Rule** (authority-leveled) |
| authorization to act unattended | **Grant** `{action_class, scope, expiry, revocable}` — above the M1 floor |
| a per-board fact (empty = unknown, capacity) | **Board field** |
| a per-instance fact | **Commitment field** |
| a deliberate deviation | **Exception** (M2), attributed |

Every stored answer carries provenance `{author_utterance, at}`.

---

## 4. Ask-once + scope (round-1 5.3)
"Ask once" is enforced by the store: **before asking, the agent checks whether a stored answer at a covering scope already resolves the gap.** Scope levels, narrow → broad:

`instance < kind-on-this-board < kind-globally < board < customer < global`

An answer resolves any gap within its scope. Storing at the confirmed scope (§2) is what makes it *ask-once* — not ask-never (silent guess) and not ask-always (nag).

---

## 5. Conflict surfacing (applies D1 / §14)
Engine-verified consistency check on every store:
- **vs a governing rule → hard stop.** The conflicting answer cannot be stored (D1: governing is non-overridable). The only forward move is a recorded `exception` where the exception path allows, or abandon.
- **vs the user's own rule → surface both, require an explicit override.** The override is itself stored **with a reason** — never silent.
- **Latent inconsistency** (two rules that don't clash yet but could) → **alert, don't block.**

---

## 6. Correction / revocation
Stored answers are editable and revocable. Editing or revoking triggers an **impact surface**: the agent shows which existing commitments/grants the change invalidates *before* applying it. Any outward consequence of the change crosses the M1 floor → needs confirmation.

---

## 7. The authoring (T2) interview — state + stop-condition
- **Front-loaded by templates (D1).** A template ships its kinds + rules, so onboarding is mostly **adopt + confirm**, not blank interview. The live interview handles only the long tail (a kind no template covers).
- **Lazy for the tail.** G1–G5 fire just-in-time as real actions hit them.
- **Interview state.** An authoring session is **save / resume / abandon**-able; partial policy is stored as `draft` rules (`enabled = false`) until the user commits.
- **Stop-condition / go-live gate.** A board/SOP is "ready to go live" when every declared kind's required attributes + rules are present (**structural coverage check**) — OR the user explicitly accepts each remaining gap, and each accepted gap becomes a **recorded exception**. Going live with a hole is therefore deliberate and attributed, never silent. This mirrors M2's structural-gate-plus-explicit-exception shape.
  - Harness scope note: the coverage check is **structural** (required fields present). Semantic completeness ("does this SOP cover every situation?") is undecidable and is *not* claimed — the harness closes the coverage-vs-consistency gap (round-1 3.2 / 5.2) only to the structural line.

---

## Settled
**§7 go-live gate = M2-consistent** (Matt): structural coverage required; a governed board goes live with a policy hole **only** as a recorded, attributed exception — no silent holes, no soft warn-and-allow.

*Status: elicitation mechanism drafted. Feeds `DESIGN.md §3/§13/§14` at Phase 5 consolidation.*
