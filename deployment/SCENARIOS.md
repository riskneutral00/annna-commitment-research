# annnä Deployment — SCENARIOS (the process, falsified)

*Pass/fail, mechanical, replayable. Two tags: **`[MUST]`** — enforced continuously by a named mechanism (ruleset, required CI check, script); verified by attempting the forbidden act and observing refusal where an attempt is runnable, and by **static assertion** where the forbidden thing is an absence (a credential, a code path) — you cannot attempt with a credential that doesn't exist. **`[DRILL]`** — executed deliberately at least once, result recorded: the tag for what only a runtime or a human can enforce (the process analogue of the harness's `[HELD-OUT]`). Rehearse what is rehearsable on a scratch repo if desired (`INTERFACES.md §6`); the canary and drills run for real on the code repo before the first layer PR. (Section letters are local to this file.)*

## R — Rungs
- **R1 [prod credentials absent below] `[MUST]`** Enumerating each lower rung's env store and diffing against the manifest finds no production-tagged secret; and the preview-creation credential cannot read the production deployment (token-scope assertion).
- **R2 [closed service unreachable] `[MUST]`** No closed-service credential and no real closed-service base URL appears in any code, config, or CI environment below production — static check; there is no code path to reach it.
- **R3 [model key confined] `[MUST]`** The model-provider secret is referenced only by the protected qualification environment; a workflow lint fails the build if any other lane references that secret or environment.
- **R4 [one seed door] `[MUST]`** Exactly one named seed entrypoint exists, and its module statically imports only the fixtures bundle — no network, no store dump.
- **R5 [manifested secrets] `[MUST]`** Each rung's env store diffed against the env manifest shows no unmanifested secret; the production half of this check runs only inside the protected deploy environment.
- **R6 [no deploy secret meets PR code] `[MUST]`** No deploy or production secret is present in any CI job that executes PR-authored code — job/environment scoping, proven by an env-dump canary showing absence.
- **R7 [production refuses anonymous] `[MUST]`** From app Step 0 onward, an anonymous request to production is refused — deployment protection, attempted and observed.
- **R8 [qualification lane capped and human-fired] `[MUST]`** The qualification key carries a provider-side hard spend cap, and the lane's protected environment requires the human identity as reviewer — a non-human trigger attempt is refused.
- **R9 [lower rungs unindexed, undoored] `[MUST]`** Non-production rungs serve `X-Robots-Tag: noindex` and contain no reachable debug or auth-bypass flag — config/grep check (the security X1 pattern).
- **R10 [rotation proven] `[DRILL]`** Each rung's secrets rotated once; the rung rebuilds green.

## B — Branch & merge law
- **B1 [red cannot merge] `[MUST]`** A PR whose declared gates or layer suite are red cannot merge — proven by a **canary red test**. Required checks carry no path filters; an always-run aggregator reports for every PR, so a skipped check can never read as success.
- **B2 [one layer per PR] `[MUST]`** A PR touching two layer folders — or a layer folder plus anything else — fails the ownership check; only `ops/<slug>` PRs may touch non-layer, non-vendored root config.
- **B3 [no push, no bypass] `[MUST]`** A direct push to main is refused by a repository ruleset whose bypass list is empty — asserted by listing the bypass actors (admins and the orchestrator identity included).
- **B4 [distinct-identity verdict approval] `[MUST]`** A PR cannot merge without an approval from the reviewer identity (≠ author identity) whose review body carries a **structured verdict** — named findings, or an explicit *attempted to falsify; nothing found* — enforced by a required check on review events that reads the latest non-author review body. A bare approve fails.
- **B5 [step or checkpoint scope] `[DRILL]`** A PR spanning two BUILD steps is caught and split; a checkpoint PR names its gate subset and merges green on it.
- **B6 [review is adversarial in fact] `[DRILL]`** Sampled review verdicts show real falsification attempts — never rubber stamps.
- **B7 [red-team canary caught] `[DRILL]`** A planted PR containing a secret-read or an outbound call outside the egress allowlist is caught by the reviewer and refused; the catch is recorded.
- **B8 [gate-coverage] `[MUST]`** A required check runs `scripts/gate-coverage.mjs` over each layer's `SCENARIOS.md × BUILD.md`: a PR that adds or renames a `[MUST]`/`[ENGINE]`/`[HELD-OUT]` scenario without naming it in a BUILD step (an **orphan**), or names a BUILD gate ID no scenario defines (a **phantom**), fails the check and cannot merge — proven by a **canary**: an orphaned scenario reddens it. The script ships with an assert-based `--selfcheck` over an inline fixture; the graded model `EVALS.md` is out of scope (set-thresholds, not per-item BUILD homes).
- **B9 [determinism] `[MUST]`** The full layer suite runs **twice** in CI and the two transcripts are **byte-compared**; any divergence fails the build — the harness's L2 determinism (`../harness/SCENARIOS.md L2`) mechanized as a process gate. The byte-diff step is realized at harness-build time, when transcripts first exist (wired now, exercised then — the R7 pattern); it adds no dead script before there is a suite to replay.

## W — Worktrees & toolchain
- **W1 [worktree law visible] `[DRILL]`** An edit made outside a worktree surfaces at PR time — the branch-name law makes it visible — and is rejected.
- **W2 [prune on merge] `[DRILL]`** The orchestrator's reconciliation prunes worktrees whose branches have merged — runtime filesystem state no repo-side check can observe, so drilled, not CI-asserted.
- **W3 [one builder session per branch, same host] `[MUST]`** On the build host, git refuses a second worktree on a held branch. (Cross-host uniqueness: no substrate mechanism exists — deferred, DR-4.)
- **W4 [runtime pinned] `[MUST]`** The orchestration runtime is installed at an exact pinned version with a recorded integrity hash; the orchestrator refuses to run when the installed hash mismatches the committed manifest.
- **W5 [supply-chain audit] `[DRILL]`** The runtime and its dependency tree are audited at install and at every version bump; results recorded.

## Q — Concurrency
- **Q1 [marketplace waits on the ledger] `[MUST]`** A marketplace PR cannot merge before the waves ledger records its preconditions green: app Z2 · harness B1/B2 + the D family · engine rule menu + Shared projection.
- **Q2 [swaps mutually exclude] `[MUST]`** Every swap PR must edit the single swap lockfile, so two open swap PRs conflict on main and cannot both merge; the engine → app → model order is read from the waves ledger.
- **Q3 [the diff gate] `[MUST]`** `git diff harness/` non-empty inside a swap PR blocks the merge — a CI assertion, not a review comment.
- **Q4 [waves enforced] `[DRILL]`** An out-of-wave step request is refused by the orchestrator, with the blocking barrier named.

## S — Spec import
- **S1 [vendored is read-only] `[MUST]`** A non-re-pin PR touching the vendored spec tree fails the required path-diff check; the re-pin exemption is a human-cast floor approval (§7 CODEOWNERS), never an author-applied label.
- **S2 [content hash verified, always] `[MUST]`** The manifest records both source hashes and the vendored tree's content hash; **every CI run recomputes the content hash** and fails on mismatch. Provenance (content ≡ named source commit) is verified at re-pin creation on the floor — hermetic CI checks content, not provenance.
- **S3 [never fetched] `[MUST]`** No workflow, submodule, remote, or code path references or fetches the research repo — static check over workflows and config. (Stated as no-fetch, not "no network route": egress absence is not provable on shared runners.)

## Z — End-to-end drills
- **Z1 [the ladder walk] `[DRILL]`** At **app Step 0** — the first moment production has content — the full ladder runs green once on a trivial change: worktree → branch → PR → preview rung up → adversarial review → merge → production deploy behind R7. The deploy is the exam. Before app Step 0, main's terminal rung is CI-green and this drill is deliberately pending (`SPEC.md §0/§4`).
- **Z2 [revert deploys clean] `[DRILL]`** A merge is reverted; the revert deploys production clean — the reversibility the process floor leans on is real. Runs with Z1.

---

**Coverage map (SPEC § → scenarios):** two repos & spec import (§1) → S1–S3 · rungs, data/secret/mock/exposure law (§3) → R1–R10 · branch & merge law and the three identities (§4) → B1–B9, Q3 · builder sessions, worktrees, ops lane, toolchain (§5) → W1–W5, B2 (ops-lane exemption) · concurrency, waves ledger, swap lock (§6) → Q1–Q4 · the process floor (§7) → S1 (human-cast re-pin approval), B3 (bypass-free ruleset), B7 (egress allowlist), Z2 (revert reversibility) · merge→deploy (§4) → Z1–Z2, R7 · corpus consistency & replay (§4) → B8 (gate-coverage), B9 (determinism). Every `[MUST]` names its mechanism here or in `SPEC.md`; a `[MUST]` enforced only by prose fails its own definition.
