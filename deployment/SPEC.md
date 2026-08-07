# annnä Deployment — SPEC (the discipline of the build)

*"Deployment" here is the whole discipline that gets code from a builder's keyboard to production: repos, environments, branches, merges, worktrees, concurrency. **This file governs the build in this repo** — ruled in place 2026-08-07; the repo keeps its direct-to-main flow (founder rulings 2026-08-06/07), so branch/PR/worktree sections below are superseded where they conflict and await a re-scope pass. Everything below binds the build from its first code commit. Tech-neutral throughout: "the host", "the CI service", "the model provider" — substrates are named at the seams (`INTERFACES.md §3`) and ordered in `BUILD.md`. Hardened by adversarial review round one, 2026-08-06 (`NOTES.md` holds the record).*

---

## §0. What deployment is

- **Scope: the code repo's build phase** — from repo genesis to the marketplace's Z1 integration gate. Post-launch operations (monitoring, on-call, incidents) are a later package, not this one.
- **The process is specced falsifiably, like everything else.** Every `[MUST]` below is enforced by a named mechanism — a repository ruleset, a required CI check, a script — never by prose alone. A rule no mechanism can refuse is not a rule here (`SCENARIOS.md` is the proof obligation). What only a runtime or a human can enforce is tagged honestly as a `[DRILL]`, not dressed as a `[MUST]`.
- The bookend: `marketplace/` builds last of all; **deployment builds first of all** — its own `BUILD.md` completes before `../harness/BUILD.md` Step 0 begins (one deliberate exception: the Z1/Z2 ladder drills run at app Step 0, the first moment production has content — §4).

## §1. The two repos and the spec import

**Two repos** (founder ruling 2026-08-06): this research repo stays the public spec artifact; a **new, private code repo** holds the build. The specs travel one way, by **pinned snapshot copy** — not submodule, not live reference:

- The code repo **vendors** this repo's spec folders at a named commit. A manifest records source repo · source commit hash · date · **the vendored tree's own content hash**.
- The vendored tree is **read-only in the code repo** — enforced by a required path-diff check (`SCENARIOS.md` S1); **CI recomputes the content hash on every run** and fails on mismatch (S2) — tamper-checked, not merely tamper-evident.
- Refresh is an explicit **re-pin**: a dedicated PR changing only the vendored tree + manifest, old and new source hashes recorded. Hermetic CI verifies *content* (the hash); *provenance* — that the content truly equals the named source commit — is checked at re-pin creation, on the floor (§7), because hermetic CI cannot reach the source repo to check it.
- **Stub-lies batch.** During a swap pass, do not re-pin per lie: complete the pass, collect every stub-lie it surfaces, fix the set upstream as one change, one re-pin PR, one replay from the top of the swap. The authority law holds; the per-lie serialization does not.

Why a pinned copy: (a) it is the repo's own install law — a template install is a snapshot fork, "the installer owns their copy" (`../marketplace/SPEC.md §3`); (b) hermetic CI — a full run never fetches a second repo (S3); (c) a submodule is an accidental-update hazard for builder sessions.

**Authority law: design changes happen here, then re-pin — never in the vendored copy.** When a swap turns red because a stub lied (`../TDD/integration.md §When a swap turns red`), the fix is a design decision made in this repo, then batched into the pass's re-pin. DR-3 (patching the vendored copy directly) stays *no* (§8).

## §2. Vocabulary

The harness owns **agent · loop · trigger · parallel · unattended** for the product's runtime (`../harness/SPEC.md`), and owns bare **session** (T2 interview sessions). Deployment never uses those words **unqualified** in the development sense; its own terms are always compound. Normative:

| Term | Meaning | Never confused with |
|---|---|---|
| **builder** | A development-time AI session authoring code (inherited — `../harness/SPEC.md` read-order line, "a fresh builder") | The product's runtime agent |
| **builder session** | One builder in one worktree on one branch (always the compound form — never bare "session") | A harness/interview session (T2) |
| **orchestrator** | The supervised session that opens worktrees, assigns steps, enforces waves (§6), and holds the ops lane (§5) | The harness loop |
| **wave** | A set of **concurrent** builder sessions the dependency order permits | Harness "parallel" (a runtime word) |
| **rung** | One environment on the promotion ladder (§3) | — |
| **lane** | A CI job class (suite lane, qualification lane, ops lane) | The marketplace money lane |

Deployment says **"concurrent"**, never "parallel".

## §3. The rungs (environments)

**Three rungs: local · per-change preview · production.** No standing staging rung (DR-1). **The ladder grows with the repo:** the production rung *activates at app Step 0* — the first moment a deployable surface exists. Before that, main's terminal rung is **CI-green**; harness and engine are not web deploys and pretending otherwise would make "the deploy is the exam" an exam with no answers.

- **Data law: production data never descends.** Lower rungs seed from **suite fixtures only**, through **one named seed entrypoint** whose module imports nothing but the fixtures bundle — statically checked (R4). Poka-yoke on credentials: a lower rung's env store holds **no production-tagged secret** — asserted by enumerating each rung's env store and diffing against the manifest (R1), plus a token-scope assertion: the preview-creation credential cannot read the production deployment.
- **Secret law — composed with `../security/SPEC.md §7`.** Deployment owns *where each rung stores*; security §7 owns *what code may load and how*. Hosted rungs: the host's env store, injected as environment. Local rung: exactly the one untracked secrets file security §7 prescribes. Every secret on every rung is enumerated in the **env manifest** (name · rung · owner · rotation note) — including the security-package vault keys; an unmanifested secret fails CI (R5; the production half of that check runs only inside the protected deploy environment, the one place a production-scoped read credential is sanctioned). Each rung's secrets are rotated once as a drill (R10).
- **The mock law, promoted to environment law.** Below production, the paid and closed world is mocked — enforced statically, not hoped:
  - **Closed marketplace service** — no closed-service credential and no real base URL exists anywhere below production: a static check over code and config, so there is no path to reach it (R2).
  - **Model provider** — the model key lives in exactly one place: a **protected qualification environment**, manually fired. A required lint over the CI workflows fails if that secret or environment is referenced by any other lane (R3) — key absence is proven statically, not by a job grepping its own env. The qualification key carries a **provider-side hard spend cap**, and the lane fires only from a **human-held trigger** (a protected environment whose required reviewer is the human identity) (R8).
  - **Mail** — sandboxed below production. **Clock and travel** — scripted, per `../engine/BUILD.md` Step 0.
- **Exposure law.** Production, once active, refuses anonymous access — deployment protection, attempted and observed (R7); "dark" is a mechanism, not a habit of not sharing the URL. Non-production rungs are non-indexable and carry no reachable debug or auth-bypass flag — config/grep-checked, the security X1 pattern (R9).
- **Builder credential floor.** No deploy or production secret is present in any CI job that executes PR-authored code (R6). A builder session holds a repo-scoped, branch-limited write token and nothing else — a prompt-injected builder must have nothing worth exfiltrating.

## §4. Branch and merge law

- **Trunk-based, short-lived branches.** No git-flow, no release branches: nothing here has releases yet, and a long-lived branch breaks the stub-swap discipline, which assumes main is always the integrated truth.
- **The three identities.** Solo does not mean one identity: the **builder identity** (a bot/App) authors commits and PRs · the **reviewer identity** (a second bot/App, driven by the adversarial-review workflow) casts approvals · the **human identity** (the founder) holds the floor (§7). Author ≠ approver is therefore real, not aspirational — a solo operator with one account can never satisfy a non-author approval rule, so the identities are what make B4 mechanical.
- **PR scope law: one PR = one BUILD step of one layer — or a named checkpoint of one.** A checkpoint is a declared subset of the step's gate IDs that can merge green on its own; the step *closes* when its full gate set is green. This keeps whole-surface steps (app Step 1, harness Step 5) reviewable instead of forcing thousand-line PRs. Larger than a step: never (B5). A PR names its step (or checkpoint) and its gate IDs in the description.
- **Merge gates — all mechanical** (`SCENARIOS.md` B-family):
  - The PR's declared gate IDs green, and the layer suite green on stubs (B1). Required checks carry **no path filters** — a skipped required check reads as success on the substrate, so an always-run aggregator job reports for every PR (B1's footgun clause).
  - Swap PRs additionally run the swap suite with **`git diff harness/` empty asserted in CI** — a job, not a reviewer's eyeball (Q3).
  - Ownership check: the PR touches one layer folder + its tests, nothing else (B2) — the orchestrator's **ops lane** (§5) is the one exemption, for non-layer, non-vendored root config.
  - The vendored spec tree untouched, except by re-pin PRs whose exemption is a human-cast approval, never an author-applied label (S1).
  - Protection is a **repository ruleset with an empty bypass list** — admins and the orchestrator identity included; direct pushes to main are refused for everyone (B3).
  - **Gate-coverage: every `[MUST]`/`[ENGINE]` scenario names a BUILD step, and every BUILD-named gate ID is a real scenario.** A required check runs `scripts/gate-coverage.mjs` over each layer's `SCENARIOS.md × BUILD.md`; an orphan (scenario with no BUILD home) or a phantom (gated ID no scenario defines) fails it (B8). This mechanizes the standing rule that a `[MUST]` enforced only by prose is not a rule — the checker is the machine that refuses a stale gate list, run in CI against the vendored spec tree.
  - **Determinism: the suite replays byte-identical.** The full layer suite runs **twice** and its transcripts are byte-compared; divergence fails the build — the harness's L2 determinism (`../harness/SCENARIOS.md L2`) lifted to a process gate (B9). The byte-compare is realized at harness-build time, when transcripts first exist.
- **Review law: adversarial, never self-approved.** **The mechanical half (B4):** the reviewer identity's approval is required, and a required check — triggered on review events, reading the latest non-author review body — fails unless it carries a **structured verdict**: named findings, or an explicit *attempted to falsify; nothing found*. A bare approve fails. **The discipline half:** the reviewer session is prompted to **falsify, not approve** (the discipline this design survived — two rounds, 93 findings, `../archive/`); intent can't be CI-checked, so it is drilled: sampled verdicts must show real falsification attempts (B6), and a planted red-team PR — a secret-read or new-egress change — must be caught (B7).
- **Merge → deploy: continuous; dark once live.** From app Step 0 onward, merge to main deploys production on every merge, behind R7's access gate, until a launch ruling (DR-2). A deploy pipeline exercised from the first deployable commit cannot rot — "the swap is the exam" generalizes to **the deploy is the exam** (Z1, run at app Step 0).

## §5. Builder sessions and worktrees

- **The identity law: one builder session = one worktree = one branch = one layer.** All four bindings, always.
- **Lifecycle:** create from fresh main → work → PR → merge → **prune**. Worktrees are disposable; the orchestrator's reconciliation prunes merged worktrees (W2 — runtime state, so drilled, not CI-asserted). When main moves past a session's base, rebase or recreate.
- **Naming:** branch `builder/<layer>/<step-N>-<slug>`; the worktree directory mirrors the branch name. The name law is what makes outside-worktree edits visible at PR time (W1).
- **The ops lane.** The orchestrator is not read-only: root configuration (CI, protection, manifests, workflow definitions — never layer folders, never the vendored tree) changes through orchestrator-lane PRs on `ops/<slug>` branches — exempt from B2's layer rule, still gated by B1/B4, and on the floor (§7) when they touch protected paths. Routine maintenance has a legal lane.
- **Credential floor:** per §3 — a builder session holds a repo-scoped, branch-limited token; deploy and production secrets are structurally out of its reach (R6).
- **Isolation:** no shared index or working tree between concurrent sessions. On the build host, git itself refuses a second worktree on a held branch (W3) — that is the whole of the enforced law while the build is single-host. Cross-host branch uniqueness has no substrate mechanism (git has no server-side branch lock); it is orchestrator policy, deferred with DR-4 until a multi-operator phase exists.

## §6. Concurrency and the wave plan

The dependency order is **the per-layer BUILD preambles, not the root README's linear prose**: the engine builds after the harness ("its seams are the requirements", `../engine/BUILD.md`); **the app states no harness dependency before its swap step** — it builds against its own spies (`../app/BUILD.md`, `../app/INTERFACES.md §4`); model Steps 1–5 want the **built** harness only ("not an invitation to start early", `../model/BUILD.md`); the marketplace is gated on all four (`../marketplace/BUILD.md`). The swaps serialize per `../TDD/integration.md §The swap sequence`.

| Wave | Concurrent builder sessions | Barrier to the next wave |
|---|---|---|
| **0** | Harness · **app Steps 0–7** (against its spies — no harness dependency until the swap) · model Step 0 (scaffold *code* in CI; its live Verify — "runs the N-set against any one OpenRouter model" — fires in the qualification lane, never ordinary CI) | Harness suite green on stubs — gates the **engine and model tracks only** |
| **1** | Engine · model Steps 1–5 (**built harness only**) · app continues | Each layer's own suite green |
| **2** | The swaps, **serialized on main**: engine swap → app swap (app Step 8) → model qualification | Each swap green before the next opens (Q2) |
| **3** | Marketplace | Its preconditions in the waves ledger (Q1) |

- **The waves ledger.** Cross-layer gates need a source of truth a PR check can read: a committed **ledger file** on main, updated as each barrier clears (by the orchestrator's ops lane). Q1 reads it — a marketplace PR cannot merge before the ledger records app Z2, harness B1/B2 + the D family, and the engine rule menu + Shared projection green (`../marketplace/BUILD.md` preamble, mechanized). Required checks are snapshots; the ledger is the state they check.
- **Swap mutual exclusion is git-enforced, not check-enforced.** Every swap PR must edit the single **swap lockfile**; two open swap PRs therefore conflict on main and cannot both merge (Q2) — a required check alone is a stale snapshot the moment a sibling PR opens. Order (engine → app → model) is read from the waves ledger.
- **Conflict law: one layer admits one builder session at a time.** Folder ownership (B2) makes cross-layer conflicts unconstructable. Steps within a layer are sequential by construction, so a second session in a layer is a **handoff at a step boundary, never concurrent work** — and never a file-level split. Checkpoints (§4) sequence within a step the same way.
- **Orchestration: a human-supervised orchestrator session.** The orchestrator opens worktrees, assigns steps, refuses out-of-wave work (Q4), maintains the waves ledger, and holds the ops lane. The human holds the floor (§7) and stub-lie adjudication — a green-on-stub/red-on-real dispute is a design decision that escalates out of the code repo entirely: fix here, batch, re-pin (§1).

## §7. The process floor

M1 — the reversibility line (`../harness/SPEC.md §7`) — mapped onto the process, **with a mechanism**: the floor paths carry CODEOWNERS entries held by the **human identity**, so a floor-crossing PR cannot merge on bot approvals alone — the "explicit human basis" is a required human-cast approval, checkable in the ruleset, not prose.

**On the floor:** the vendored spec tree (re-pins) · deploy configuration · the env manifest · **the CI workflow definitions** (`.github/workflows/**` — a workflow edit can weaken every other gate) · **the egress allowlist** (outbound network calls in product code are confined to an allowlisted module set, lint-asserted; adding egress is a floor act — the path a prompt-injected builder would need) · deleting or weakening any layer's suite · production secret changes · history rewrites — **force-push: never**, on any branch with an open PR.

Everything else is reversible-by-revert and needs no ceremony (Z2 proves the revert path).

## §8. Open rulings (DR series)

- **DR-1 — standing staging rung.** Absent by decision (§3). Re-open if launch or a multi-operator phase demands soak time.
- **DR-2 — production exposure.** When dark production opens, and to whom. A launch question, not a build-phase question.
- **DR-3 — spec-change fast path.** May a build-blocking spec defect be patched in the vendored copy ahead of the upstream fix? **No**, on record — and the pressure that motivated a fast path is relieved by §1's batch re-pin: one re-pin per swap pass, not per lie.
- **DR-4 — cross-host builder-session registry.** Branch-uniqueness across build hosts (§5) has no substrate mechanism and no victim while the build is single-host. Deferred until a multi-operator phase; re-opens with DR-1's trigger.

## §9. Invariants ledger

| Invariant | Where constructed |
|---|---|
| Production data never descends a rung | §3 (no production-tagged secret below; single seed entrypoint, fixtures only) |
| The model key exists only in the qualification environment | §3 (workflow lint; human-held trigger; provider-side spend cap) |
| The closed service is unreachable below production | §3 (no credential, no real endpoint string — static) |
| No deploy secret is reachable from PR-authored code | §3/§5 (job scoping; builder credential floor) |
| Active production refuses anonymous access | §3 (deployment protection, R7) |
| One PR = one BUILD step (or named checkpoint) of one layer | §4 (scope law + ownership check) |
| PR author and approver are distinct identities | §4 (builder bot · reviewer bot · human) |
| A bare approve cannot merge | §4 (verdict-presence check, B4) |
| Every `[MUST]`/`[ENGINE]` scenario names a BUILD step (no orphan/phantom) | §4 (gate-coverage check, B8) |
| The suite replays byte-identical | §4 (twice-run byte-compare, B9) |
| Direct push and bypass are refused for everyone | §4 (ruleset, empty bypass list) |
| One builder session = one worktree = one branch = one layer | §5 (identity law; same-host git refusal) |
| The orchestration runtime runs only at its pinned hash | `INTERFACES.md §4` (pin + refuse-on-mismatch, W4) |
| Swaps serialize on main | §6 (swap lockfile; waves ledger) |
| The vendored spec tree matches its manifest hash, every CI run | §1 (content-hash recompute, S2) |
| Floor crossings require a human-cast approval | §7 (CODEOWNERS on the human identity) |
| Force-push never | §7 (ruleset) |

**Status of open items (do not block the build):** DR-1/DR-2 are post-build-phase; DR-3 is closed-unless-reopened with batching in place; DR-4 waits on a second build host existing. The Z1/Z2 drills are deliberately deferred to app Step 0 (§0, §4) — the one dated exception to "deployment completes first." None of this gates `BUILD.md` Step 0.
