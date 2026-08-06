# annnä Deployment — INTERFACES (the seams)

*Four seams: **upward** to the five layer packages (whose BUILD orders are the contract), **across** to the spec repo (the pinned-snapshot import) and to the security package (whose laws deployment's CI enforces), and **downward** to the substrate (the only place tools are named). The governing constraint: deployment owns the space **between** the layers — sequencing, environments, enforcement — and nothing inside any layer folder.*

---

## §1. To the five layer packages (upward)

- Deployment consumes each layer's `BUILD.md` — the `## Step N` order and the **`Gate:` scenario-ID lines** — as its contract. The `Gate:` lines are machine-readable by design intent: they drive the CI job definitions and the **waves ledger** (`SPEC.md §6`), the committed file cross-layer merge checks read.
- Deployment owns **when** a step may start (waves) and **whether** its PR may merge (gates); it never owns **what** a step contains. A deployment-driven edit inside a layer folder is a defect.
- The swap serialization (`SPEC.md §6`) is `../TDD/integration.md §The swap sequence`, mechanized via the swap lockfile — deployment adds enforcement, not order.

## §2. To the spec repo (the import seam)

- What crosses: the spec folders, **one way**, as a pinned snapshot into a **private** code repo (`SPEC.md §1`). The **manifest** (source repo · source commit · date · vendored-tree content hash; both source hashes on re-pin) is the seam artifact.
- What never crosses: code (nothing flows back), and edits (the vendored tree is read-only; design changes happen upstream, then batch-re-pin per swap pass).
- The seam is offline: CI never fetches the research repo (`SCENARIOS.md` S3) and verifies the vendored content by recomputing its hash (S2).

## §3. To the security package (across)

- **Secret law composes** (`SPEC.md §3`): deployment owns *where each rung stores* (hosted rungs: host env store; local: the one untracked file); `../security/SPEC.md §7` owns *what code may load and how*. The security vault keys are ordinary env-manifest entries.
- **Security's grep gates run as deployment CI jobs**: the X1-pattern checks (`../security/SPEC.md §7` — "grep-gated in CI from every layer's Step 0") are required checks in deployment's CI skeleton from `BUILD.md` Step 1, and R9 reuses the same pattern against deployed rungs.
- *Resolved 2026-08-06: `../security/SPEC.md §7` now cites the env manifest as the enumeration of record.*

## §4. To the substrate (downward — named here, per the app precedent)

| Substrate | Role |
|---|---|
| **GitHub** | The private code repo · **repository rulesets with an empty bypass list** · required checks (no path filters; always-run aggregator) · **protected environments** (deploy, qualification — the human identity as required reviewer) · **CODEOWNERS** as the floor mechanism (`SPEC.md §7`) · Actions · `gh` |
| **Vercel** | Per-PR preview rung · production rung with **deployment protection** (R7) — production activates at app Step 0 |
| **Convex** | Per-rung deployments + the per-rung env store (enumerable for R1/R5) |
| **Clerk** | Per-rung auth instances |
| **Resend** | Mail — sandbox below production |
| **OpenRouter** | The model key, confined to the qualification environment, **provider-side hard spend cap** (R3/R8) |
| Travel provider *(candidate — unbound)* | The engine's `travel()` seam (`../engine/INTERFACES.md §2.1`). Candidates named at `../engine/BUILD.md` Step 0 (Google Routes API / Mapbox / OSRM); scripted stub below production until bound; key confined like the model key when it is |
| **Atomic** (`bastani-inc/atomic`) | **The orchestration runtime**: worktree-per-builder-session, workflows-as-code for the wave table, the adversarial-review workflow behind B4/B6/B7. **Pinned to an exact version with a recorded integrity hash in a committed manifest; the orchestrator refuses to run on hash mismatch (W4), and each bump is audited (W5)** — runtime-neutrality (`NOTES.md`) is a portability property, the pin is the security control. |
| Closed marketplace service | **Mock only** — no credential, no real endpoint string anywhere below production (R2) |

## §5. What deployment OWNS (do not stub these)

- CI configuration · ruleset/protection configuration · CODEOWNERS · the orchestration and worktree workflow definitions (Atomic workflows-as-code) · the runtime pin manifest · the env manifest · the spec-import manifest · the waves ledger · the swap lockfile · the egress allowlist (`SPEC.md §7`).
- **Never:** layer code · layer tests · spec content · the product runtime. Deployment has no opinion on what the harness does — only on how its builders work.

## §6. Stub strategy

Deployment's rehearsal target is a **scratch repository** — now **optional** (adversarial review round one): protection and CI are declarative, and the empty real repo, pre-harness, is itself a safe rehearsal surface. What is mandatory is the proof, wherever it runs: the canary red test and the `[DRILL]` walks execute **on the real code repo before the first layer PR**. Three groups of `[MUST]`s cannot be rehearsed anywhere but reality — cross-layer state (Q1/Q2, no layers exist yet), runtime state (W2/W3, orchestrator filesystem), and production-rung checks (R5's prod half, R7, no production exists yet) — their first real execution is an explicit recorded drill at the step that activates them.
