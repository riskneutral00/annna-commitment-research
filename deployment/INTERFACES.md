# annnä Deployment — INTERFACES (the seams)

*Four seams: **upward** to the five layer packages (whose BUILD orders are the contract), **across** to the specs (the spec/code boundary inside this repo) and to the security package (whose laws deployment's CI enforces), and **downward** to the substrate (the only place tools are named). The governing constraint: deployment owns the space **between** the layers — sequencing, environments, enforcement — and nothing inside any layer folder.*

---

## §1. To the five layer packages (upward)

- Deployment consumes each layer's `BUILD.md` — the `## Step N` order and the **`Gate:` scenario-ID lines** — as its contract. The `Gate:` lines are machine-readable by design intent: they drive the CI job definitions and `scripts/gate-coverage.mjs`.
- Deployment owns **when** a step may start (waves) and **whether** its change may land (gates); it never owns **what** a step contains. A deployment-driven edit inside a layer folder is a defect.
- The swap serialization (`SPEC.md §6`) is `../TDD.md §The swap sequence`; deployment adds the diff gate (Q3), not the order.

## §2. To the specs (the boundary seam)

- The specs are not across a repo boundary — they are in this tree (`SPEC.md §1`). The seam is a **path class**, not a copy: a layer's `SPEC.md`/`SCENARIOS.md`/`BUILD.md` on one side, its code on the other.
- What crosses: nothing, in one commit. A commit edits spec files or code, never both (`SCENARIOS.md` S2), and the spec side is a floor path the human reads (`SPEC.md §7`).
- The seam is offline: no workflow, submodule, or remote pulls spec content from outside the checked-out commit (S3), so the gate reads exactly what the reviewer read.

## §3. To the security package (across)

- **Secret law composes** (`SPEC.md §3`): deployment owns *where each rung stores* (hosted rungs: host env store; local: the one untracked file); `../security/SPEC.md §7` owns *what code may load and how*. The security vault keys are ordinary env-manifest entries.
- **Security's grep gates run as deployment CI jobs**: the X1-pattern checks (`../security/SPEC.md §7` — "grep-gated in CI from every layer's Step 0") are required checks in deployment's CI skeleton from `BUILD.md` Step 1, and R9 reuses the same pattern against deployed rungs.
- *Resolved 2026-08-06: `../security/SPEC.md §7` now cites the env manifest as the enumeration of record.*

## §4. To the substrate (downward — named here, per the app precedent)

| Substrate | Role |
|---|---|
| **GitHub** | This repo · required checks (no path filters; the always-run `npm run check` aggregator) · **protected environments** (deploy, qualification — the human as required reviewer) · Actions · `gh` |
| **Cloudflare** | Per-change preview rung (`SPEC.md §3`'s name for it) · production rung with **access protection** (R7) — production activates at app Step 0. Ruled under FD-11, replacing Vercel; the rung law in `SPEC.md §3` names no provider and did not change |
| **Convex** | Per-rung deployments + the per-rung env store (enumerable for R1/R5) |
| **TypeScript** | **The 6.x line (`^6.0`) corpus-wide, decided 2026-08-22 (FD-64, superseding the same-day `^5.9` pin)** — both suite-carrying layers' `package.json` hold `^6.0.0` and reversal is one line. TS 7 is a compiler reimplementation, a real decision not a point bump: it gets its own decision point when a layer needs it, never adoption-by-throwaway-rig. Every layer typechecks (`tsc --noEmit`) the way the harness does |
| **Clerk** | Per-rung auth instances |
| **Resend** | Mail — sandbox below production |
| **OpenRouter** | The model key, confined to the qualification environment, **provider-side hard spend cap** (R3/R8) |
| Travel provider *(candidate — unbound)* | The engine's `travel()` seam (`../engine/INTERFACES.md §2.1`). Candidates named at `../engine/BUILD.md` Step 0 (Google Routes API / Mapbox / OSRM); scripted stub below production until bound; key confined like the model key when it is |
| Closed marketplace service | **Mock only** — no credential, no real endpoint string anywhere below production (R2) |

## §5. What deployment OWNS (do not stub these)

- CI configuration · deploy/environment protection configuration · the env manifest · the egress allowlist (`SPEC.md §7`).
- **Never:** layer code · layer tests · spec content · the product runtime. Deployment has no opinion on what the harness does — only on how its builders work.

## §6. Stub strategy

Deployment's rehearsal target is a **scratch repository** — now **optional** (adversarial review round one): protection and CI are declarative, and this repo, pre-harness, is itself a safe rehearsal surface. What is mandatory is the proof, wherever it runs: the canary red test and the `[DRILL]` walks execute **for real, here, before the first layer lands**. Two groups of `[MUST]`s cannot be rehearsed anywhere but reality — the swap diff gate (Q3, no swap exists yet) and the production-rung checks (R5's prod half, R7, no production exists yet) — their first real execution is an explicit recorded drill at the step that activates them.
