# annnä Deployment — spec package

annnä is four layers — **Model / Harness / Engine / App** (`../README.md`) — with `marketplace/` and `security/` beside them, and this package is **the discipline of the build**: how code gets from a builder's keyboard to production. Environments, PR strategy, git worktrees, concurrent builder sessions — "deployment" here means the whole delivery discipline, not just the last push.

**This package governs the build in this repo** — ruled in place 2026-08-07, reversing the 2026-08-06 separate-repo posture. The repo remains the public spec artifact and **keeps its direct-to-main flow** (founder-confirmed 2026-08-07); repo-flow sections below that assume a separate PR-governed code repo are superseded where they conflict and await a re-scope pass. Everything here binds the build from its first code commit. The bookend: `marketplace/` builds last of all — **deployment builds first of all**, before `../harness/BUILD.md` Step 0, with one dated exception: the ladder drills (Z1/Z2) fire at app Step 0, the first moment production has content.

**The two-repo topology — superseded 2026-08-07 (build ruled in place; no separate code repo, no vendored snapshot; kept for provenance):** a new **private** code repo holds the build and **vendors these specs as a pinned snapshot** — the repo's own install law applied to itself. Design changes happen here, then re-pin (batched per swap pass); the vendored copy is read-only and its content hash is verified on every CI run.

**Vocabulary warning — read before anything else.** The harness owns *agent, loop, trigger, parallel, unattended* — and bare *session* — for the product's runtime. This package always uses compound forms: **builder** (a development-time session authoring code — inherited harness vocabulary, not coined here) · **builder session** (one builder · one worktree · one branch · one layer) · **orchestrator** (assigns waves, holds the ops lane) · **wave** (concurrent sessions the dependency order permits) · **rung** (an environment) · **lane** (a CI job class). Deployment prose says *concurrent*, never *parallel*. The full glossary is `SPEC.md §2`.

**This folder's purpose:** the complete discipline. Read in order:

1. **`SPEC.md`** — the law: the two repos and the batched spec re-pin, the three rungs (production activates at app Step 0) and the mock/exposure laws, the three identities and one-step-or-checkpoint PRs under adversarial review, the worktree identity law and the ops lane, the wave plan with its ledger and swap lock, the human-cast process floor, the DR rulings.
2. **`INTERFACES.md`** — the seams: the layers' `Gate:` lines as contract, the pinned-snapshot import, the security-package composition, the substrate (GitHub · Vercel · Convex · Atomic-at-a-pinned-hash — named there only), the now-optional scratch rehearsal.
3. **`SCENARIOS.md`** — the proof: `[MUST]` rules enforced by named mechanisms and verified by refusal or static assertion; `[DRILL]` walks executed once and recorded.
4. **`BUILD.md`** — the ordered plan. **Builds first**; Step 5 fires at app Step 0.

**Definition of done:** every `[MUST]` scenario is enforced by a **named mechanism** in the code repo — a ruleset, a required CI check, a script, never a convention in prose; every pre-app `[DRILL]` has one recorded execution; the Z1/Z2 ladder drills are deliberately pending until app Step 0 and recorded then. On that basis — mechanisms live, pre-app drills recorded — `../harness/BUILD.md` Step 0 begins.

**Deliberately NOT here:** runtime operations of the shipped product (monitoring, on-call, incident response — a post-launch package) · launch and exposure mechanics (DR-2) · billing or payment infrastructure (the closed service's problem) · any change to this research repo's own workflow · CI for this research repo · the layer build orders themselves (each layer's `BUILD.md` owns its steps; deployment only sequences *between* layers).

Open rulings are held in `SPEC.md §8` as the **DR-n** series. This package was hardened by **adversarial review round one** (four lenses, 42 findings — the record and kill list are in `NOTES.md`); the Atomic supply-chain posture moved from a risk note to law (`INTERFACES.md §4`, W4/W5) as part of that round.
