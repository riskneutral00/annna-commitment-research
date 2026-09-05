# buildpack — entry point and location manifest

This is the product-level entry point for a fresh reader — any model, any runtime, any machine with a clone. Tier `index`: it says where things live and states no rule of its own. Where this file and a home disagree, the home wins.

## The topics and where each lives

| Topic | Home in this repository | Note |
|---|---|---|
| What is this product for / who is it for | `PRD.md`, `PR/IDENTITY.md`, `PR/BRIEF.md` | |
| What must it do (requirements, acceptance) | `PRD.md`, `TDD.md`, `user-stories/` | |
| Concepts and rules that must stay coherent (domain) | `engine/SPEC.md`, `harness/SPEC.md`, `PRD.md` | |
| Structure (architecture, seams) | `app/SPEC.md`, `engine/SPEC.md`, `harness/SPEC.md`, `model/SPEC.md`, `security/SPEC.md`, `marketplace/SPEC.md`, `deployment/SPEC.md` | |
| What people experience (design) | `app/DESIGN.md`, `PR/BRIEF.md` | |
| How we know it works (quality, gates) | `TDD.md`, `deployment/SPEC.md`, `deployment/scripts/status-report.mjs` | run as `npm run check:status` |
| What exists today (current state) | no file | run `npm run check:status`, `npm run check` and `git rev-parse HEAD` in a checkout. A copied number is never authoritative; without a checkout, current state is unverified |
| Which decisions are settled (rulings, provenance) | `RULINGS.md`, `AGENTS.md` §Rulings | `RULINGS.md` is the FR/FD registry and its provenance section; `AGENTS.md` §Rulings is the OR list |
| Earlier conclusions and the evidence they rested on (findings register) | `buildpack/FINDINGS.md` | |
| How a future model audits and upgrades (protocol) | `buildpack/UPGRADES.md` | |
| Where things live (index) | `INDEX.md`, `AGENTS.md` §Authority order, `THE-JOB.md` | |

## Location manifest

| Source | Identity or revision | Authority | How an authorized reader resolves it | Recovery pointer |
|---|---|---|---|---|
| This repository | the commit printed by `git rev-parse HEAD` | per `AGENTS.md` §Authority order | a clone | the remote in `git remote -v` |
| `RULINGS.md` and its provenance section | this revision | registry, not the home of every rule (FR13) | in the clone | — |
| The vault "Product BuildPack" notes (Obsidian, iCloud) | the 2026-09-04 extraction | historical evidence only; superseded as entry point by this file | absent from every clone; readable only on the founder's machine | path `Personal OS/10 Projects/Product BuildPack/` in the founder's vault |
| The Hermes product-strategy method references | installed skill files | not authority for this product | absent from clones | the Hermes skill tree on the founder's machine |
| The prior build | `git@github.com:riskneutral00/annna.git` | inspiration only (FD-20) | do not clone to chase a citation (AGENTS.md rules those citations traceability) | the remote |
| Working material (`docs/agents/`, `.hermes.md`, `CLAUDE.md`) | gitignored | never authority; absent from every clone | not resolvable from a clone | the founder's checkout |

How to disagree with an earlier conclusion is split across two homes: `buildpack/FINDINGS.md`'s header owns the verdict vocabulary and what overturns a row; `buildpack/UPGRADES.md` owns the review procedure that applies it. Which questions belong to the founder is stated once in `buildpack/UPGRADES.md`.
