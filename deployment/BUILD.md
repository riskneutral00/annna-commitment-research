# annnä Deployment — BUILD (ordered plan)

*Deployment **builds first of all** — Steps 0–4 complete before `../harness/BUILD.md` Step 0 begins; Step 5's ladder drills are the one dated exception, firing at app Step 0 when production first has content. The scratch repo is optional rehearsal (`INTERFACES.md §6`); the canary and drills run for real. Tech is named freely here: GitHub (rulesets · protected environments · CODEOWNERS · Actions) · Vercel · Convex · Clerk · Resend · OpenRouter · `git worktree` · `gh` · **Atomic** (installed at an exact pinned version + integrity hash per `INTERFACES.md §4` — never a floating `npm i -g`).*

## Step 0 — Repo genesis + spec import
Create the **private** code repo; vendor the pinned spec folders; write the import manifest (source repo · commit · date · vendored-tree content hash); wire the required path-diff check, the every-run content-hash recompute, and the no-fetch static check. Gate: **S1–S3**.

## Step 1 — Identities, branch & merge law
The three identities (builder bot · reviewer bot · human CODEOWNERS). Repository ruleset with an **empty bypass list**; the ownership check (one layer folder + tests; `ops/` exemption); CODEOWNERS on the floor paths (vendored tree · `.github/workflows/**` · deploy config · env manifest · egress allowlist · suite files); the verdict-presence check on review events; the always-run aggregator (no path filters on required checks); security's X1 grep gates as required checks; the **canary red test** proving B1 bites before anything real depends on it. Gate: **B1–B4** (+ S1's human-cast exemption).

## Step 2 — The rung ladder
Local runbook + the one untracked secrets file (`../security/SPEC.md §7`); per-PR preview (Vercel preview + Convex preview deployment + Clerk dev instance) with noindex and the no-debug-flag grep; production **provisioned dark but activating at app Step 0** (deployment protection wired now, exercised then); the env manifest + enumerate-and-diff checks; the seed entrypoint import-lint; the closed-service static check; the model-key workflow lint + protected qualification environment (human required reviewer, provider-side spend cap). Gate: **R1–R6, R8–R9** now · **R7** at app Step 0 · **R10** drilled once rungs carry real secrets.

## Step 3 — Worktree tooling
Atomic installed at the pinned hash, refuse-on-mismatch wired (W4), install audit recorded (W5); worktree workflows: create-from-fresh-main, branch-name law (`builder/<layer>/<step-N>-<slug>`), prune-on-merge reconciliation; the builder session protocol doc; builder tokens repo-scoped and branch-limited. Gate: **W3–W5** (+ W1/W2 drilled on first real PRs).

## Step 4 — Orchestration
The wave table (`SPEC.md §6`) as an Atomic workflow wired to the layers' `Gate:` lines; the **waves ledger** file + its ops-lane update flow; the **swap lockfile**; the egress allowlist + lint; the adversarial-review workflow (reviewer identity, falsify prompt) behind B4; the red-team canary workflow. Gate: **Q1–Q4** (Q1/Q2 first exercised for real when multiple layers exist — recorded as drills then) · **B7**.

## Step 5 — The ladder drills (at app Step 0)
When the first deployable surface lands: the full ladder walked on a trivial change behind R7, and the revert drill; the walk's review sampled for B6; B5 checkpoint discipline observed on the first oversized step. Record all. Gate: **Z1–Z2, B5, B6, W1, R7**. Before this fires, deployment's definition of done is "all `[MUST]`s mechanized + pre-app drills recorded"; harness Step 0 proceeds on that basis.

## Guardrails
- A rule enforced only by prose has gone wrong — mechanize it, tag it `[DRILL]`, or delete it (`SPEC.md §0`).
- A builder editing the vendored specs is a defect, not a shortcut — fix upstream, batch, re-pin (`SPEC.md §1`).
- A CI call to a real closed service or model provider is a build error, not a flake — and there must be no credential or endpoint by which to make one (`SPEC.md §3`).
- Never weaken a gate to unblock a wave — escalate to the human floor (`SPEC.md §7`).
- A floating runtime install is a supply-chain hole, not a convenience — the pin is the law (`INTERFACES.md §4`).
- "Concurrent", never "parallel" — the harness owns that word (`SPEC.md §2`).

## Reading order for the builder
1. `SPEC.md` — the law: repos, rungs, identities, branches, worktrees, waves, the floor.
2. `INTERFACES.md` — what deployment owns, the four seams, the optional scratch rehearsal.
3. `SCENARIOS.md` — the proof obligations each step above gates on.
4. `../TDD/integration.md` — the swap sequence Step 4 serializes.
