# Deployment — NOTES (backlog scratchpad)

*Like the other NOTES files: items already absorbed into the spec, plus anything still open. **Never authoritative** — build from `SPEC.md`.*

## Adversarial review, round one (2026-08-06) — record and kill list

Four independent refuter sessions, each prompted to falsify, each on one lens: **enforceability** (every `[MUST]` vs the real substrate, 16 findings) · **first-contact practicality** (solo founder, one machine, 8) · **consistency** (vs the layer BUILDs, TDD, security/, itself, 8) · **build-pipeline security** (10). **42 findings raised. 39 applied (several merged), 0 killed outright, 3 partially rejected.** Each lens pre-filtered its own failures — claims that survived a refuter's attack were not reported, so the surviving-finding rate is by construction. Verdicts:

| # | Finding (compressed) | Verdict | Landed |
|---|---|---|---|
| P1 | Solo can never satisfy non-author approval — deadlock | **Applied** — via the three-identities law (builder bot · reviewer bot · human), not by dropping the approval | SPEC §4 |
| P2 | One-step-one-PR forces unreviewable monster PRs | **Applied** — checkpoint PRs (named gate subsets; step closes on full set) | SPEC §4, B5 |
| P3 | Per-lie re-pin serializes swap week | **Applied** — batch re-pin per swap pass | SPEC §1, DR-3 |
| P4 | Dark production has nothing to deploy until app Step 0 | **Applied** — rung activates at app Step 0; Z1/Z2 deferred there; pre-app terminal rung is CI-green | SPEC §0/§3/§4, Z1, BUILD Step 5 |
| P5 | App Steps 1–7 wrongly gated on harness | **Applied** — app moved into Wave 0 (its BUILD states no harness dependency before the swap) | SPEC §6 |
| P6 | Orchestrator read-only yet sole config editor — contradiction | **Applied** — the ops lane (`ops/<slug>` PRs, B2 exemption, floor on protected paths) | SPEC §5, B2 |
| P7 | Scratch-repo rehearsal is ceremony | **Applied** — scratch optional; canary + drills run on the real repo (composed with E16) | INTERFACES §6, BUILD preamble |
| P8 | Cross-host registry guards a fleet that doesn't exist | **Applied** — merged with E6; deferred as DR-4 | SPEC §5/§8 |
| S1 | Atomic unpinned = supply-chain hole; "runtime-neutral" is portability, not security | **Applied** — pin + integrity hash + refuse-on-mismatch (W4), audit (W5) | INTERFACES §4, W4/W5 |
| S2 | Builder credential scope never specced; injected builder can exfiltrate | **Applied** — credential floor: R6 + repo-scoped branch-limited tokens | SPEC §3/§5, R6 |
| S3 | "Dark" production names no mechanism, tested nowhere | **Applied** — deployment protection, anonymous-refusal scenario | SPEC §3, R7 |
| S4 | Fellow-AI reviewer approves an exfil PR; layer code never on the floor | **Applied** — egress allowlist on the floor + red-team canary drill (different-model-family option noted, not law) | SPEC §7, B7 |
| S5 | Human floor is prose — AI approvals satisfy it | **Applied** — CODEOWNERS on the human identity for all floor paths (absorbs S9's workflow-floor half, E8's trust anchor) | SPEC §7 |
| S6 | Vendored hash recorded, never verified | **Applied** — merged with E13: content hash recomputed every CI run; provenance checked at re-pin on the floor | SPEC §1, S2 |
| S7 | Preview exposure (indexing, debug flags, repo visibility unstated) | **Applied** — noindex + no-debug-flag checks (R9); code repo declared private | SPEC §1/§3, R9 |
| S8 | "Budgeted" and "manually fired" name no mechanism | **Applied** — provider-side hard spend cap + human-reviewer protected environment | SPEC §3, R8 |
| S9 | CI token scope unbounded; workflow edits off the floor | **Applied** — split: ruleset/bypass into E3's fix, `.github/workflows/**` onto the floor (S5) | SPEC §7, B3 |
| S10 | Rotation is a free-text note | **Applied** — rotation drill | R10 |
| E1 | R3's runtime env-grep unenforceable; transitive key access | **Applied** — static workflow lint + qualification-environment confinement | SPEC §3, R3 |
| E2 | Q2 racy: required checks are snapshots | **Applied** — swap lockfile mutex (git-enforced) + waves ledger for order | SPEC §6, Q2 |
| E3 | B3: admins/apps bypass classic protection | **Applied** — ruleset with empty bypass list, asserted | B3 |
| E4 | R1's attempt/refusal unrunnable; token scoping missing | **Applied, claim partially rejected** — attempting with *held* credentials is runnable; the stronger enumerate-and-diff + token-scope assertion adopted anyway | R1 |
| E5 | W2 not repo-observable | **Applied** — downgraded to orchestrator-reconciliation `[DRILL]` | W2 |
| E6 | W3 cross-host half has no substrate mechanism | **Applied** — merged with P8; same-host git refusal is the whole `[MUST]`; DR-4 | W3, DR-4 |
| E7 | B4 names no parser or trigger | **Applied** — required check on review events reading the latest non-author review body | B4 |
| E8 | S1 needs the path-diff check named; label exemption spoofable | **Applied** — path-diff named; exemption is a human-cast floor approval | S1 |
| E9 | S3 "no network route" unprovable on hosted runners | **Applied** — restated as static no-fetch | S3 |
| E10 | Q1 cross-layer state has no source of truth | **Applied** — the waves ledger | SPEC §6, Q1 |
| E11 | R2 has no detection mechanism | **Applied** — credential + endpoint-string absence, static | R2 |
| E12 | R4 is an unprovable universal | **Applied** — single seed entrypoint + import lint | R4 |
| E13 | S2 conflates form and truth under hermetic CI | **Applied** — merged with S6 (content vs provenance split) | S2 |
| E14 | R5's prod half needs a prod credential in CI — conflicts with R1 | **Applied** — prod half confined to the protected deploy environment | R5 |
| E15 | Path-filtered required checks read skipped-as-success | **Applied** — no path filters; always-run aggregator | B1 |
| E16 | Scratch can't rehearse Q1/Q2, W-runtime, prod-rung checks | **Applied** — composed with P7; first real execution recorded as a drill | INTERFACES §6 |
| C1 | Model Step 0's Verify needs a real model call the mock law bans | **Applied** — code in CI, live Verify in the qualification lane | SPEC §6 |
| C2 | Secret-storage law contradicts security §7 | **Applied as composition, not a loser** — deployment stores (env store / the one untracked file per rung), security governs loading; reciprocal cite flagged to the security package, not edited from here | SPEC §3, INTERFACES §3 |
| C3 | Diff gate written `<layer>/`, should be `harness/` | **Applied** | SPEC §4 |
| C4 | Deployment↔security seam absent | **Applied** — INTERFACES §3 (X1 as deployment CI jobs; vault keys in the manifest) | INTERFACES §3 |
| C5 | Wave 1 offered model steps "or its stubs" vs model/BUILD's ban | **Applied** — "built harness only" | SPEC §6 |
| C6 | Q1 said "B/D families"; marketplace names B1/B2 + D | **Applied** | Q1 |
| C7 | "Session" banned, then used 33× | **Applied** — ban softened to *unqualified*; compound forms are the law | SPEC §2, README |
| C8 | NOTES used banned "agent" in dev sense | **Applied** — reworded (this file) | here |

**Partial rejections on record:** E4's "unrunnable" framing (half-wrong, fix adopted regardless) · P1's alternative fix (dropping the approval count) rejected in favor of identities · S4's different-model-family reviewer noted as option, not law.

## Folded (pointers, not content)

| Deliberation | Where it landed |
|---|---|
| Submodule vs pinned copy — submodule lost on accidental-update hazard + non-hermetic CI | `SPEC.md §1` |
| Standing staging rung — declined; previews are ephemeral staging | `SPEC.md §3`, DR-1 |
| Root-README linear order vs the BUILD preambles — the preambles are the DAG; app joined Wave 0 in review round one | `SPEC.md §6` |
| "Builder" as the development-time word — inherited from `../harness/SPEC.md`, not coined | `SPEC.md §2` |
| Scratch-repo rehearsal — demoted from mandatory to optional in review round one | `INTERFACES.md §6` |

## Risk on record: Atomic maturity (2026-08-06)

The orchestration runtime (`INTERFACES.md §4`) is **Atomic** (`bastani-inc/atomic`, MIT): verified first-class worktree-per-builder-session management, workflows-as-code with gates, built-in adversarial-verification. It is young (~400 stars). Two independent mitigations: **portability** — `SPEC.md` is runtime-neutral, so a swap re-costs only workflow definitions; **security** — the pin + integrity hash + refuse-on-mismatch law (W4/W5), added in review round one when the portability argument was correctly refuted as not being a security control.

## Still open

- **DR-1** — standing staging rung. Absent by decision.
- **DR-2** — production exposure / launch. Post-build-phase.
- **DR-3** — spec-change fast path. *No* on record; batch re-pin (§1) relieves the pressure that motivated it.
- **DR-4** — cross-host builder-session registry. Deferred until a second build host exists.
- ~~The reciprocal cite in `../security/SPEC.md §7` (env manifest as the enumeration of record)~~ — **closed 2026-08-06**: §7 now names the manifest as the enumeration of record.
- The post-launch operations package (monitoring, on-call, incidents) — explicitly out of scope here, unwritten anywhere.
