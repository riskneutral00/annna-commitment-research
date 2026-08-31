# annnä Security — INTERFACES (who owns each control)

*Security is cross-cutting: this package owns the **laws** (`SPEC.md`), but every control is built and enforced inside some layer's existing seam — or in the one new substrate this package introduces, the vault. The governing constraint everywhere: **zero new harness/engine/app seam verbs.** A control that seems to need one has been designed wrong — stop and flag.*

---

## §1. The ownership table

| Control (SPEC §) | Owned by | Rides which existing seam | Stubbed how (§4) |
|---|---|---|---|
| Capability tokens — mint, hash, serve, headers (§3) | **App** (guest routes) | `publish` / `on_form_return` (`../harness/INTERFACES.md §3.3`); attribution contract stays harness H6; the engine stores **digests** (`../engine/SPEC.md §1.7`) | canned token fixtures + a scripted clock |
| The vault (§4) | **New downward substrate** — of the app (guest upload/serve) and of ops (clock jobs) | attestations ride precondition **evidence** (`../harness/SPEC.md §3.4`) into ordinary engine writes; artifact bytes ride no seam at all | in-memory vault, virtual clock (§4) |
| Provenance quarantine (§5) | **Harness** (context assembly, `../harness/SPEC.md §8`) | the existing `normalize` context contract — tags travel inside the assembled context, no new call | injection fixtures as scripted `normalize` inputs |
| Consent & evidence bundles (§6) | **App** captures (G6); shape is the harness's `satisfied_by {principal, at, evidence}` | `on_form_return` | canned form returns with/without evidence |
| Secrets (§7) | **BUILD/ops + CI**, per layer | none — a file-and-pipeline discipline | none needed: the grep gate is real from day one |
| Rate limits & abuse (§10) | **App** (public doors); hold idempotency is already engine law | none — limits sit in front of existing routes | scripted limit clock |
| The external-client surface (§3 fifth class; §10 its caps; FD-33 suspension) | **Harness** (it is the harness's own tool contract exposed, `../harness/SPEC.md §5.3`); credential custody is this package's Step 4b | the existing tool contract — zero new verbs (`../harness/INTERFACES.md §6`) | the scripted credential check (`../harness/INTERFACES.md §5`) *(row added 2026-08-21 — the one door attributing to a principal inside had no owner, seam, or stub here)* |
| Tenant scoping (§9) | **Engine** (store construction, `../engine/SPEC.md §1.1`) | none — it is how every existing read/write is built | the engine build itself; N-family probes it |
| Compliance tooling (§12) | **App** (§7-class views: the retention surface) + **the §12 ops runbook** (the deletion-request runbook is an operations document, not an app surface — repointed 2026-08-31, F-16; the in-product surface stays Tier-1-optional, not required) + **harness** ask-once (clock answers) | existing view + elicitation machinery | canned stored answers |
| DR & takeout (§8) | **Ops** + the engine substrate (the version chain is what takeout reads) | none — operational procedure over the store | restore drill against a seeded **two-tenant** store, backups carrying a **per-tenant watermark**, and a **simulated partial loss** — D1's platform drill and D5's detect → confirm → replay share the fixture |

## §2. The vault seam (the one new contract)

Named by shape, like the marketplace service (`../marketplace/INTERFACES.md §1`):

- `vault.put(artifact, class, subject) → attestation` — encrypts, stores, and records the class (**the retention clock arms on the purpose-served registration, not on put** — `SPEC.md §4`'s F-19 sentence; put narrowed 2026-08-31); returns `{class, verified_by, at, vault_ref}` for the engine's precondition evidence.
- `vault.get(vault_ref, basis) → artifact | tombstone` — **every get is logged with its basis** to the audit surface, admin included (SPEC §11). After destruction, an honest tombstone: what class existed, when destroyed, under which clock.
- `vault.shred(subject | vault_ref, basis) → completion attestation` — destruction by clock or by lawful request; for engine-resident contact PII, shredding the **per-subject key** is the erasure (SPEC §4).
- **The clock job** — internal, deterministic, idempotent (the engine's horizon-job pattern): scans clocks, shreds what's due, writes completion attestations.

Encryption law, inline: artifacts encrypted at rest (**AES-256-GCM**, random IV per artifact, version-prefixed ciphertext); `medical`-class under its own dedicated key so keys rotate without re-encrypting history; keys live with runtime secrets (SPEC §7), never in the vault they unlock.

**The contrast invariant, stated so no builder blurs it:** the engine has no delete (`../engine/SPEC.md §1.10`); **the vault is THE place deletion exists — that is its job.** And the vault is a *substrate*, not a harness tool: no tool in the harness contract gains the `destruction` reversibility class (`../harness/SPEC.md §5` — the class stays intentionally unoccupied). Clock-end destruction executes stored owner policy; request-driven erasure is an ops runbook act (SPEC §12). **The agent never shreds.**

## §3. What this package OWNS — and never absorbs

- **Owns:** the cross-cutting laws, the attack suite, the vault contract, the compliance frame, the posture statement.
- **Never absorbs:** permission decisions (the harness floor); truth and its math (engine); rendering and transport (app); judgment (model). **If a security control needs judgment to work, it is designed wrong** — every law here is enforceable by construction, configuration, or deterministic check.

## §4. Stub strategy

- **Vault:** in-memory implementation with a virtual clock (the engine's virtual-clock discipline) — clocks advance by test control, shreds are observable, tombstones real.
- **Rate limits:** scripted clock; limits declared exactly as in production, windows advanced by the test.
- **Identities:** canned owner/guest/admin identities plus a canned `external-client` credential; the **three**-credential-models law (M5, FD-18) asserted against the canned set *(updated 2026-08-21 — "two" survived FD-18 here)*.
- **Injection:** fixtures as scripted `normalize` inputs with source tags — the Q-family runs against the real assembly policy, stubbed model.
- **CI grep gate:** no stub — it is a grep, real from the first commit of any layer.
