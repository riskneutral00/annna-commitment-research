# annnä Deployment — BUILD (ordered plan)

*Deployment **builds alongside** — **Steps 0–1 complete before any layer's `BUILD.md` Step 0 begins**, and Steps 2–4 land as the things they gate come into existence: Step 2's rung ladder when a hosted rung does, Step 3's swap diff gate before the first swap, Step 4's ladder drills at app Step 0 when production first has content. **Every gate is kept — the re-scope moves when they land, never whether** (ruled 2026-08-08; normative home `SPEC.md §0`, which also records what it replaces and the two departures from the old order). The scratch repo is optional rehearsal (`INTERFACES.md §6`); the canary and drills run for real. Tech is named freely here: GitHub (protected environments · Actions) · Cloudflare · Convex · Clerk · Resend · OpenRouter · `gh`.*

## Step 0 — The spec/code boundary
The repo already exists — this step wires the boundary that replaces the vendored copy (`SPEC.md §1`): the required **path-class check** refusing any commit whose changed paths span a layer's spec files and that layer's code (S2); the no-outside-spec static check over workflows and config (S3). Gate: **S2–S3**.

**CLOSED 2026-08-08.** `scripts/s2-path-class.mjs` classifies the staged set by **file extension** — `.md` is spec, everything else is code — because layer code will live beside its specs and a directory rule would be wrong the day the first `.ts` lands in `harness/`. `scripts/s3-no-outside-spec.mjs` asserts no `.gitmodules` and no workflow step that checks out another repository or fetches a URL. Both run in `npm run check`, fired by `.githooks/pre-commit` — the pre-landing form `SCENARIOS.md` B1 pre-authorized, `--no-verify` its acknowledged bypass. **S2's canary was fired for real**: `README.md` + `scripts/size-guard.mjs` staged together, commit refused, `S2 FAIL — spec and code in one commit`.

## Step 1 — Landing law
The always-run aggregator (`npm run check`, no path filters on required checks); security's X1 grep gates as required checks; the **canary red test** proving B1 bites before anything real depends on it; the **gate-coverage** required check + its orphan canary (`scripts/gate-coverage.mjs`, a pure `SCENARIOS × BUILD` check needing no suite, live from Step 1); the **twice-run byte-compare** determinism job wired here, its comparison exercised at harness-build when transcripts first exist; the human's structured verdict recorded per landed change (B4 — a discipline, not a check, and `SPEC.md §4` says why). Gate: **B1, B4, B8** · **B9** wired now, exercised at harness-build.

**CLOSED 2026-08-08.** All four gates hold.
- **B1 — `[MUST]` since FD-7, and green.** The aggregator exists and `.githooks/pre-commit` fires it before every commit. The canary red test was fired for real, three times: a spec+code co-move (`S2 FAIL`), a planted `NEXT_PUBLIC_API_SECRET` (`X1 FAIL — a client-exposed secret is in the tree`), and a 3MB staged file (`SIZE-GUARD FAIL — tracked over 2MB and not pinned`). Each refused the commit. **Ceiling:** `--no-verify` bypasses the hook and the hook is per-checkout — accepted and recorded (`SPEC.md §4`, `§9`), not closed.
- **B8 — green.** `scripts/gate-coverage.mjs` runs its `--selfcheck` assert suite first, which carries the orphan canary as a negative case, then walks six layers.
- **X1 as a required check** — `scripts/x1-secret-grep.mjs`, canary fired above (`../security/BUILD.md` Step 0 owns the scenario).
- **B4 — cast 2026-08-08 by the founder**, as a `git notes --ref=verdict` note on the run's head commit (`SPEC.md §4`): *"Accepted without independent review. Author's own falsification pass found and fixed four defects; no second reader. Recorded honestly."* **It says what actually happened rather than what would read better** — the falsification pass was the author's own, it found four real defects (an engine-stub handle collision, an R6 step-level bypass, an R2 exfil host, a language pin no gate ran), and no second reader existed. A verdict recording its own limit is worth more than one implying a review that did not happen.
- **B9 — wired and now EXERCISED, 2026-08-08.** `scripts/b9-twice-run.mjs` discovers every layer with a suite, runs each twice, and byte-compares `.tmp/transcripts/<layer>.txt` (`SPEC.md §4` defines the path). **`../harness/BUILD.md` Step 0 closed the *exercised then* half the same day it was wired:** harness and engine both write transcripts through one shared reporter, and the gate reports *B9 OK — 2 suite(s) run twice, 2 transcript(s) byte-identical*. **Canary fired twice** — once against a temporary layer emitting `Math.random()` while nothing real wrote a transcript, and again against the real harness suite with a `Math.random()` test name. Both refused. `--selfcheck` runs its five comparison cases ahead of the real pass.

## Step 2 — The rung ladder
Local runbook + the one untracked secrets file (`../security/SPEC.md §7`); the **per-change preview** rung, `SPEC.md §3`'s name for it (Cloudflare Workers preview + Convex preview deployment + Clerk dev instance) with noindex and the no-debug-flag grep; production **provisioned dark but activating at app Step 0** (deployment protection wired now, exercised then); the env manifest + enumerate-and-diff checks; the seed entrypoint import-lint; the closed-service static check; the mail sandbox below production; the model-key workflow lint + protected qualification environment (human required reviewer, provider-side spend cap). Gate: **R1–R6, R8–R9, R11** now · **R7** at app Step 0 · **R10** drilled once rungs carry real secrets.

**NOT CLOSED 2026-08-08 — every gate that can be built without a rung is built; the rest need accounts, and naming which is the point of the tag.** The split is not arbitrary: an `[MUST]` over an **absence** is checkable statically (`SCENARIOS.md` preamble), and one over an **enumeration of a live store** is not. *(2026-08-24, G2-1: a Cloudflare account is the founder's later act. A stubbed local build — harness → engine against stubs → app locally — does not wait. This step staying NOT CLOSED does not block Ready for the application build in this repo.)*

*Built and canaried:*
- **R2 — `scripts/r2-closed-service.mjs`.** Matches on shape, not vendor, because the closed marketplace service has no vendor yet: credential identifiers tying a secret to marketplace/store/closed-service, plus any URL outside seven declared hosts. Lockfiles excluded — a gate that fires on a hundred npm-registry lines is one people learn to scroll past, and dependency provenance is a different problem with a different tool. **Canary:** `https://closed.vendor.io/v1` + `MARKETPLACE_API_SECRET` → refused.
- **R3 — `scripts/r3-workflow-lint.mjs`**, built earlier. **Canary fired 2026-08-08:** a workflow lane referencing the model secret with no qualification environment → refused.
- **R4 — `scripts/r4-one-seed-door.mjs`.** Counts doors by name (`seed.<ext>`, `SPEC.md §3`) and asserts **at most one**. **Canaries:** two doors → refused; one door importing `../prod/dump` → refused.
- **R6 — the static half.** No unprotected job holds a deploy/production secret. **Canary:** a bare job holding `CLOUDFLARE_API_TOKEN` → refused.
- **R9 — the flag half**, built earlier. **Canary fired 2026-08-08:** a planted `SKIP_AUTH` → refused.

*Not built, and why — each waits on a thing that does not exist, not on a decision:*
- **R1, R5, R11** enumerate a rung's env store and diff it against the env manifest. **The manifest now exists** (`env-manifest.md`) — writing it first is what makes these buildable the day a rung stands up; a manifest authored afterwards is written to match whatever was already there and asserts nothing. No hosted rung exists to enumerate.
- **R8** needs a protected GitHub environment with a human required reviewer and a provider-side spend cap — a console action, not a script.
- **R9's noindex half** needs a rung config (no `wrangler.toml`, no `wrangler.jsonc`).
- **R6's env-dump canary** needs a job holding a deploy secret to dump; CI fires since FD-10, but no rung issues one.
- **R4's import half** needs a seed door to read.
- **R10** is a `[DRILL]` that needs rungs carrying real secrets. **R7** is at app Step 0 by design.

**Harness Step 0 begins with this step open.** It was a real departure from this file's preamble as that preamble then read, recorded as **DR-8** (`SPEC.md §8`) rather than absorbed; the alternative was to wait on accounts for work that does not touch them. **Under the preamble as it now reads it is conformant** — Steps 0 and 1 were closed when harness Step 0 began, and that is the whole of what the rule requires (ruled 2026-08-08, `SPEC.md §0`). The record stays: DR-8 is the reasoning that changed the rule, and this step is still not closed.

## Step 3 — The swap diff gate and the egress allowlist
The **diff gate**: `git diff harness/` asserted empty in a swap commit, wired as a required check (Q3) — the mechanical half of the zero-harness-changes swap law, live before the first swap it guards. The egress allowlist + its lint, a floor path (`SPEC.md §7`). Gate: **Q3** (first exercised for real at the engine swap) · **S3** (its egress clause (b) — lint built and canaried here; the clause landed 2026-08-21).

**CLOSED 2026-08-08.** Both mechanisms exist and both were canaried.
- **Q3 — `scripts/q3-swap-diff.mjs`, fired from a new `.githooks/commit-msg`.** A swap commit declares itself with a `Swap: <layer>` trailer (`SPEC.md §6`, which also states the bound: an undeclared swap is not caught). The second hook exists because the message does not exist yet at pre-commit time. **Canary fired both ways:** a staged `harness/SPEC.md` edit with `Swap: engine` → `Q3 FAIL — a swap commit may not change the harness`; the identical staged set without the trailer → `Q3 OK — not a swap commit`. Its real pass needs a message file, so `npm run check` runs only its `--selfcheck` and says so.
- **Egress — `scripts/egress-lint.mjs` over `egress-allowlist.md`.** Two files are allowed today, both process-only. The allowlist is **markdown deliberately**, so S2 refuses to let a widened allowlist ride in the same commit as the code that widens it (`SPEC.md §7`). **Canary fired:** a planted `fetch()` in `engine/` → `EGRESS FAIL`.
- **What the egress canary caught, recorded because the lesson generalizes.** The first version matched with `git grep -E` using `\b`. POSIX ERE has no word-boundary escape, so every pattern matched nothing and the gate passed on an empty result — while `--selfcheck` passed because it built a **JS** RegExp from the same strings. A selfcheck running a different engine from the real pass proves nothing. Both now share one matcher, and a selfcheck case asserts that. **This is why a gate without a fired canary is a declaration:** three gates that shipped green were only proven by attempting the forbidden act.
- **Three earlier gates canaried retrospectively at the same time**, none of which had been: `R9` (planted `SKIP_AUTH` → refused), `R3` (a workflow lane referencing the model secret with no qualification environment → refused), `S3` (a `curl` in a workflow step → refused). All three bite.

## Step 4 — The ladder drills (at app Step 0)
When the first deployable surface lands: the full ladder walked on a trivial change behind R7, and the revert drill. Record both. Gate: **Z1–Z2, R7**. Before this fires, deployment's definition of done is "all `[MUST]`s mechanized + pre-app drills recorded"; harness Step 0 proceeds on that basis.

## Guardrails
- A rule enforced only by prose has gone wrong — mechanize it, tag it `[DRILL]`, or delete it (`SPEC.md §0`).
- A builder editing a spec beside the test it is failing is a defect, not a shortcut — batch it into its own spec commit on the floor (`SPEC.md §1`).
- A CI call to a real closed service or model provider is a build error, not a flake — and there must be no credential or endpoint by which to make one (`SPEC.md §3`).
- Never weaken a gate to unblock a wave — escalate to the human floor (`SPEC.md §7`).
- "Concurrent", never "parallel" — the harness owns that word (`SPEC.md §2`).

## Reading order for the builder
1. `SPEC.md` — the law: repos, rungs, the landing law, waves, the floor.
2. `INTERFACES.md` — what deployment owns, the four seams, the optional scratch rehearsal.
3. `SCENARIOS.md` — the proof obligations each step above gates on.
4. `../TDD.md §Integration` — the swap sequence Step 4 serializes.
