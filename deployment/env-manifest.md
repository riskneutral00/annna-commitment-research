# Env manifest — the enumeration of record

*`SPEC.md §3` and `../security/SPEC.md §7`: every secret on every rung is enumerated here — name · rung · owner · rotation note. **A variable absent from this file is a defect wherever it appears** (`../security/SPEC.md §7`, "The env manifest is the enumeration of record"). This file names variables; it never carries a value.*

**What this manifest is for.** R1, R5 and R11 all work by **enumerating a rung's env store and diffing it against this list**. None of those three can run today, because no hosted rung exists to enumerate. Writing the manifest first is what makes them buildable the day one does — and a manifest authored after the rung is a manifest written to match whatever was already there, which asserts nothing.

**Rungs** (`SPEC.md §3`): **local** · **per-change preview** · **production**. There is no standing staging rung (DR-1). Production activates at app Step 0; before that, main's terminal rung is CI-green.

## Local rung

The one untracked secrets file (`../security/SPEC.md §7`) plus the separate human-login file no code reads. Both are gitignored forever: `.env`, `.env.local`, `.convex-deployment`.

| Name | Owner | Rotation | Note |
|---|---|---|---|
| `CONVEX_URL` | founder | on deployment change | Names the engine's dev deployment. Passed to `engine/scripts/reactive-push-check.mjs` as an argument by its npm script — the script reads `process.argv[2]`, never the environment (m-27); `npm run check` skips that gate explicitly when it is unset. **Not secret-bearing** — enumerated because the manifest is the record of what exists, not only of what is sensitive. |
| `CONVEX_DEPLOY_KEY` | founder | on suspicion; drilled once (R10) | Writes to the engine's dev deployment. Never present in any lane that runs agent-authored code (R6). |

## Per-change preview rung

**No rows yet — the rung does not exist.** It stands up at `BUILD.md` Step 2 (Cloudflare Workers preview + Convex preview deployment + Clerk dev instance). Its rows arrive with it, and R1's token-scope assertion applies from the first one: *the preview-creation credential cannot read the production deployment.*

Structurally forbidden here, so no row may ever appear (`SPEC.md §3`, the mock law): any production-tagged secret (R1) · any closed-marketplace-service credential or real base URL (R2) · the qualification model-provider key (R3) · any production mail credential (R11).

## Production rung

**No rows yet — the rung is provisioned dark and activates at app Step 0** (`SPEC.md §3`). The production half of R5's diff runs only inside the protected deploy environment, which is the one place a production-scoped read credential is sanctioned.

**The `app-direct` provider key is a production-rung runtime secret, and it has no row here yet.** `../model/SPEC.md §7` (FD-100) custodies it as infrastructure rather than as a `../security/SPEC.md §3.1` vault credential; what it does not yet have is a name, an owner or a rotation note, because nothing reads one. **Proposed identifier: `APP_DIRECT_PROVIDER_KEY`** — named in prose so the custody clause resolves to a production-rung identifier distinct from the local `MODEL` slug, and deliberately **not a table row**, because a row here asserts that the secret exists (the vault-keys section below refuses the same temptation for the same reason, and `SPEC.md §7a` item 8's grep gate reads rows, not prose). Its real row lands **in the same change as the environment read that needs it** — `../model/BUILD.md` Step 4's runtime binding of each app-supplied `provider` value — with its rung, owner and rotation note written then. It is confined by this rung's own law, not by R3: R3 governs the qualification credential below, and nothing here is an exemption from it.

## Qualification environment (not a rung)

A protected GitHub environment, manually fired, whose required reviewer is the human identity (R8).

| Name | Owner | Rotation | Note |
|---|---|---|---|
| `OPENROUTER_API_KEY` | founder | on suspicion | **The only place the *qualification* model-provider key may be referenced** (R3, lint-enforced today) *(narrowed 2026-09-13 — written unqualified, this sentence forbade the production runtime provider key `../model/SPEC.md §7` requires, and R3's lint reads workflow files for named model-secret patterns; it establishes confinement of this credential, never custody of a runtime one)*. Carries a provider-side hard spend cap (R8). Not yet supplied: the model spike is built and deliberately unrun (FD-5). |

## Vault keys (`../security/SPEC.md §4`)

The vault's encryption keys live **with the runtime secrets, never in the store they encrypt** (`../security/SPEC.md §7`, "Provider keys are server-side only"). No rows yet — the vault is built at `../security/BUILD.md` Step 3. They are manifest-bearing when they exist; naming them here in advance would be naming secrets that do not exist, which is the same defect in the other direction.

## Guest conversation consumer

`../model/SPEC.md §7` routes guest-interactive calls through qualified app supply, never an owner BYO key. No guest-specific secret is selected or added before the concrete consumer/rung exists. Its runtime secret is inventoried at that BUILD gate under the existing server-only and qualification/preview isolation rules; the current spike key row is not authorization for a product route. Input/turn/request-cost limits are configuration under `../security/SPEC.md §10`, not secret values. Ordinary guest page rendering consumes no model key.

## Standing bound

This manifest is enforced by **diff against a live env store**, and there is no live store below the local rung. Until Step 2 stands the preview rung up, R1/R5/R11 are **declarations, not implementations** — recorded in `SPEC.md §8` DR-8 rather than left to be read as working. *(DR-8's ordering half became conformant 2026-08-08 when the build order was re-scoped to "builds alongside, Steps 0–1 first" — `SPEC.md §0`. That changes nothing here: the gates below still wait on a store that does not exist, and the re-scope kept every one of them.)*
