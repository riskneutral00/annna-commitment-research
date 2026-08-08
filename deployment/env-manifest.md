# Env manifest — the enumeration of record

*`SPEC.md §3` and `../security/SPEC.md §7`: every secret on every rung is enumerated here — name · rung · owner · rotation note. **A variable absent from this file is a defect wherever it appears** (`../security/SPEC.md §7`, "The env manifest is the enumeration of record"). This file names variables; it never carries a value.*

**What this manifest is for.** R1, R5 and R11 all work by **enumerating a rung's env store and diffing it against this list**. None of those three can run today, because no hosted rung exists to enumerate. Writing the manifest first is what makes them buildable the day one does — and a manifest authored after the rung is a manifest written to match whatever was already there, which asserts nothing.

**Rungs** (`SPEC.md §3`): **local** · **per-change preview** · **production**. There is no standing staging rung (DR-1). Production activates at app Step 0; before that, main's terminal rung is CI-green.

## Local rung

The one untracked secrets file (`../security/SPEC.md §7`) plus the separate human-login file no code reads. Both are gitignored forever: `.env`, `.env.local`, `.convex-deployment`.

| Name | Owner | Rotation | Note |
|---|---|---|---|
| `CONVEX_URL` | founder | on deployment change | Names the engine's dev deployment. Read by `engine/scripts/reactive-push-check.mjs`; `npm run check` skips that gate explicitly when it is unset. **Not secret-bearing** — enumerated because the manifest is the record of what exists, not only of what is sensitive. |
| `CONVEX_DEPLOY_KEY` | founder | on suspicion; drilled once (R10) | Writes to the engine's dev deployment. Never present in any lane that runs agent-authored code (R6). |

## Per-change preview rung

**No rows yet — the rung does not exist.** It stands up at `BUILD.md` Step 2 (Cloudflare Workers preview + Convex preview deployment + Clerk dev instance). Its rows arrive with it, and R1's token-scope assertion applies from the first one: *the preview-creation credential cannot read the production deployment.*

Structurally forbidden here, so no row may ever appear (`SPEC.md §3`, the mock law): any production-tagged secret (R1) · any closed-marketplace-service credential or real base URL (R2) · the model-provider key (R3) · any production mail credential (R11).

## Production rung

**No rows yet — the rung is provisioned dark and activates at app Step 0** (`SPEC.md §3`). The production half of R5's diff runs only inside the protected deploy environment, which is the one place a production-scoped read credential is sanctioned.

## Qualification environment (not a rung)

A protected GitHub environment, manually fired, whose required reviewer is the human identity (R8).

| Name | Owner | Rotation | Note |
|---|---|---|---|
| `OPENROUTER_API_KEY` | founder | on suspicion | **The only place the model-provider key may be referenced** (R3, lint-enforced today). Carries a provider-side hard spend cap (R8). Not yet supplied: the model spike is built and deliberately unrun (FD-5). |

## Vault keys (`../security/SPEC.md §4`)

The vault's encryption keys live **with the runtime secrets, never in the store they encrypt** (`../security/SPEC.md §7`, "Provider keys are server-side only"). No rows yet — the vault is built at `../security/BUILD.md` Step 3. They are manifest-bearing when they exist; naming them here in advance would be naming secrets that do not exist, which is the same defect in the other direction.

## Standing bound

This manifest is enforced by **diff against a live env store**, and there is no live store below the local rung. Until Step 2 stands the preview rung up, R1/R5/R11 are **declarations, not implementations** — recorded in `SPEC.md §8` DR-8 rather than left to be read as working. *(DR-8's ordering half became conformant 2026-08-08 when the build order was re-scoped to "builds alongside, Steps 0–1 first" — `SPEC.md §0`. That changes nothing here: the gates below still wait on a store that does not exist, and the re-scope kept every one of them.)*
