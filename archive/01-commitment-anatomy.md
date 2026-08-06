# 01 — The Anatomy of a Commitment (philosophy & law)

> ⚠️ **Historical — this is design *history*, not the build plan.** Preserved so decisions can be traced to their reasoning. Where anything here conflicts with a layer package (`harness/`, `engine/`, `app/`, `model/`), **the layer's `SPEC.md` wins.** Start at the [root README](../README.md).


Two streams — one across philosophy and human relationships, one across contract law and formal obligation — produced nearly the same structure. A commitment is a **normative operator** an agent lays over future-directed content, making itself *answerable* to some party, over some time horizon, under conditions, backed by consequences, until discharged.

## The universal field tuple

Formal synthesis: **C = ⟨A, B, X, T, K, N, R, D, M⟩**

| Field | Philosophy/relational | Contract/legal analogue |
|---|---|---|
| **A — Committer** | who is bound (may be a "we" / plural subject, Gilbert) | Obligor / bearer |
| **B — Beneficiary** | to whom it's owed (person, group, institution, God, or *no one* — vows, Sartre) — the **least universal** field | Obligee |
| **X — Content** | the future act/state/relationship-quality undertaken | Obligated act/object |
| **T — Temporal** | instantaneous · deadline · episodic · continuous · lifelong · renewable | Timing; "time is of the essence" |
| **K — Conditions/triggers** | felicity conditions (Austin/Searle), induced expectation (Scanlon) | Condition precedent (activates) / subsequent (terminates) / discharge events |
| **Executor** | agency modality | **named identity · role/office · qualification predicate · delegable** |
| **N — Arity** | unilateral · mutual · **joint** (bipolar, irreducible) | cardinality; **quorum ≠ approval-threshold ≠ liability-mode** (three distinct fields) |
| **breach** | blame · betrayal · perjury · sacrilege · inauthenticity | remedy: cure, damages, penalty, termination |
| **R/D — Revocation/Discharge** | release by consent, joint concurrence, institutional dispensation, or *no clean exit* (betrayal) | performance, agreement, breach-termination, frustration, operation of law |
| **M — Modality** | personal · interpersonal · institutional · joint | deontic type: obligation/permission/prohibition/right/power |

## Key structural insights

**Conditions are three different things** (law is emphatic — don't conflate them into one "trigger" field):
- **Condition precedent** — must occur *before* the duty exists (activates).
- **Condition subsequent** — extinguishes a duty already in force (a built-in exit clause).
- **Discharge event** — ends the obligation entirely (performance, agreement, breach, frustration, law).

**"Who performs" has four drafting patterns** (LegalRuleML formalizes Actor `filledBy` Role):
1. **Named party** — identity is material; substitution forbidden or needs consent ("key personnel").
2. **Role/office** — binds whoever occupies "the Landlord," "the on-call engineer."
3. **Qualification predicate** — "a duly licensed engineer," "anyone ACLS-certified"; performer can change silently while the predicate holds.
4. **Delegable** — performance can be handed off, but **liability usually stays with the delegator** unless there's a novation. Personal-service duties (unique skill, fiduciary trust) are **non-delegable**.

**Coverage / on-call = an unfilled-but-real duty.** The obligation attaches to the role, not to whoever is currently rostered. An unfilled shift is a staffing defect, *not* a lapse of the obligation. Suggested fields: `role`, `service_window`, `required_performer` (qualification), `assignment` (who fills it, or null), `status` (filled/unfilled/replacement-pending). SLA escalation ladders are literally **ranked fallback chains of executors**.

**Group obligations need three separate fields, not one:** `quorum` (can the body act at all?), `approval_threshold` (how many yeses once quorum is met — "2 of 3" is ambiguous across five different structures), and `liability_mode` (joint vs joint-and-several — who the obligee can pursue for the whole).

## Why event/task is inadequate (philosophy's verdict)

Event/task only characterizes the **content-shape** field (X). It says nothing about:
- **Directedness** (to whom it's owed) — central to Scanlon, Gilbert, second-personal accounts
- **Conditionality** (consent-, institution-, trigger-, or relationship-dependent)
- **Temporal extension** (a marriage vow and a delivery promise have radically different temporal architectures both collapsed to "event/task")
- **Normative intensity** (casual assurance vs oath vs vow vs pledge — same content, different force)
- **Social arity** (a joint commitment is not parallel individual tasks)
- **Revocability / exit logic**

> Conclusion: event and task are two possible values within the temporal/content field of a richer structure — not competing categories for "commitment" as a whole.

*(Full sources in the appendix: SEP Promises/Speech-Acts/Trust; Gilbert, Joint Commitment; Scanlon, What We Owe to Each Other; Baier on trust/betrayal; Sartre/IEP; OASIS LegalRuleML; contract-law and SLA/on-call sources.)*
