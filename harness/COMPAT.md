# annnä Harness — COMPAT (the compatibility policy and the closed refusal vocabulary)

*The RQ-13 file (`../PRD.md §4.5`; `INTERFACES.md §6`), authored 2026-08-22 — ahead of `BUILD.md` Step 8, deliberately. The refusal vocabulary is **consumed from Step 1** (every stub's decline is a contract) and was scheduled to be **authored at Step 8**: every stub decline in between would have been an unwritten contract that independent builders fill differently, and `../engine/SCENARIOS.md` Z1's "contract-visible behavior exactly" is uncheckable without the vocabulary it names. Authoring the enumeration first follows the `../deployment/egress-allowlist.md` precedent: the permission lands first, alone, where it is the only thing to read. Step 8 still produces the capability enumeration; X7 still gates credential issuance on this file's existence.*

*This file is the **single normative home** (FR13) for two things: the closed reason set per refusal kind, and the compatibility policy. The envelope shape itself — six kinds, `{kind, reason, detail?, next?}` — is defined at `INTERFACES.md §1` and only used here.*

---

## 1. The closed reason set per kind

Every failure return on every seam is one of the six kinds (`INTERFACES.md §1`), and every kind's `reason` comes from the table below — nothing else. Each reason names the spec text it collects; the law stays at its home, this table only closes the vocabulary. **From this file's authoring onward, adding a reason is a widening of a closed enum and therefore a breaking change under §2** — exactly the rule `INTERFACES.md §1` announced would attach.

| Kind | Reason | Collected from |
|---|---|---|
| `conflict` | `capacity` | no-double-book by construction; two commits racing for the same capacity (`INTERFACES.md §1.2`) |
| `conflict` | `buffer` | the buffer/travel-gap commit-time check — "capacity, buffers (including travel)" (`../engine/SPEC.md §7.1` item 3, the §6.1 check list) |
| `conflict` | `latch` | the latch invariant — a lapsed hold or set latch refuses the write (`INTERFACES.md §1.2`; `SPEC.md §3.4`) |
| `conflict` | `precondition` | commit-time precondition check (`../engine/SPEC.md §7.1` item 3) |
| `conflict` | `governing-rule` | a governing-authority rule refusing the write (`../engine/SPEC.md §7.1` item 3; hard stop, `SPEC.md §6`) |
| `decline` | `no-feasible-placement` | "the math ran; nothing fits" — `detail` carries the tightest refusing constraint class (`../engine/SPEC.md §5`, §7's exhaustion rule) |
| `decline` | `travel-unknown` | "the math could not run" on the travel envelope — never collapsed into the row above; `detail.cause` says why, `ceiling` (the warm-up is running; expect a re-offer) or `provider-failed` (the map is down) — a `detail` discriminator, not a reason widening *(2026-08-22)* (`../engine/SPEC.md §5`, §9) |
| `invalid` | `malformed` | a malformed model return or tool call (`../model/SPEC.md §8`; `SPEC.md §5`'s no-repair-loop rule) |
| `invalid` | `type-mismatch` | `typed_value`'s error — the operand fails its declared type (`INTERFACES.md §1.4`) |
| `invalid` | `schema-mismatch` | return-leg validation and the app's rejected-render error (`SPEC.md §5`; `../app/SPEC.md §4`) |
| `refused` | `no-basis` | the floor: no live confirmation and no covering grant, including a drifted act (`SPEC.md §7` rules 2–3, fire-time re-verify) |
| `refused` | `authorization-gated` | a Grant mint/widen arriving on a trigger firing or the external surface — refused, not queued (FD-24, `SPEC.md §7`) |
| `refused` | `console-only` | the authorization-and-recovery class at the external surface (FD-26, `SPEC.md §5.3`) |
| `refused` | `unruled` | a write attempting a mark whose trigger is deliberately unspecified — today, `held` (`../engine/SPEC.md §1.9`) |
| `refused` | `byo-binding` | `summarize` rejecting any `byo-*` provider (FD-3, `INTERFACES.md §2.4`) |
| `refused` | `policy-missing` | credential issuance with no compatibility policy on record (`SCENARIOS.md` X7) |
| `refused` | `provider-refused` | the model seam's own `refused` member surfacing through a call (`INTERFACES.md §1`'s mapping of `../model/SPEC.md §8`'s error union) |
| `unavailable` | `substrate` | the seam's infrastructure member — the math did not run (`INTERFACES.md §1`, the paragraph above the envelope) |
| `unavailable` | `provider` | a third-party provider down: travel source, calendar provider (`../engine/SPEC.md §9`; `import_fetch`, `INTERFACES.md §3.3`) |
| `timeout` | `substrate` | the seam call's own deadline (`INTERFACES.md §1`) |
| `timeout` | `provider` | a third-party call's deadline (`INTERFACES.md §3.3`) |
| `timeout` | `model` | the model seam's timeout member after the one bounded retry (`../model/SPEC.md §8`) |

**What is deliberately not in this table.** A *counterparty's* decline of a share offer carries its structured human reason — rate, distance, timing, or a free note (`../engine/SPEC.md §7.1` item 5, founder-ruled #8). That is stored data about a person's answer, not a seam verb's failure return, so it is outside this closed set and widening it is template/configuration territory, not a breaking change here.

## 2. The compatibility policy (RQ-13)

- **What constitutes a breaking change:** removing or renaming a tool; changing a parameter's or return field's type or meaning; making an optional parameter required; **and widening any closed enum or return shape** — a new status value, a new refusal reason (§1), a new `labels[]` member — because clients branch on closed enums (`SPEC.md §5`'s declines are designed to be branched on). Additive optional fields with declared defaults are non-breaking, on `../engine/SPEC.md §1.10`'s additive-only precedent.
- **Forward-only:** a change never alters what an existing call already meant (`../PRD.md` RQ-13's own words). A superseded shape is superseded, never reinterpreted.
- **Notice:** a breaking change lands in this file **before** the change lands anywhere else — the spec-first half of `../deployment/SPEC.md §1`'s boundary law is the notice mechanism. While the only credential class admitted is the owner's own agents (`../PRD.md §1.2`, refusal two), that entry is the whole notice.
- **Supersession window:** a superseded shape remains callable until every issued credential has been exercised against the successor — with no third-party holders this window may be zero. **Before any credential is issued beyond the owner's own agents, this policy must first state a numbered notice period and window** — issuing without them is X7's refusal. (A readiness condition, not a schedule — FR2.)

## 3. What enforces this

- **X7** (`SCENARIOS.md`) — no credential issues without this policy on record.
- **`deployment/scripts/compat-reasons.mjs`** — the kind set here equals `INTERFACES.md §1`'s six; every kind carries at least one reason; every `reason:` string literal in `harness/src/` is a member of §1's table. The reverse direction — every reason exercised by some suite — becomes checkable as the Step 1–5 suites land and is printed as the gate's honest bound until then.
- **S2** (`../deployment/SPEC.md §1`) — this file is spec; it never moves in a commit with code.
