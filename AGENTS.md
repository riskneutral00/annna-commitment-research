# AGENTS.md — operating instructions for agents in this repo

**This repo is a specification corpus — its source of truth is markdown.** Two things now execute: `engine/` carries real TypeScript and a vitest suite (the Step-0 scaffold), and two Node scripts run outside it — `assets/make-pack.mjs` and `deployment/scripts/gate-coverage.mjs` (the gate-coverage law, `deployment/SCENARIOS.md B8`). Everything else — **134** markdown spec files (`find . -name '*.md'` excluding `.git/`, `node_modules/`, `.tmp/`, and untracked `docs/`) — is specification, not code; untracked `docs/` raises the working-tree total. Read that as a standing caveat on everything below.

## Authority order

1. **A layer's `SPEC.md` is the source of truth.** Build from it.
2. **`archive/` is history, not authority.** It records how the design was reached — the founding research and two adversarial critiques. It is there to *justify*, not to build from. Where `archive/` and a layer `SPEC.md` disagree, **the SPEC wins**. `archive/` is 26% of the corpus and sorts first in recursive grep, so a naive search will surface superseded material before live material. Check which side of that line your hit falls on before you use it.
3. **`NOTES.md` is never authoritative** — a backlog scratchpad of items absorbed into the spec, plus anything still open.

## Package shape

```
<layer>/
  README.md      purpose, role, read order
  SPEC.md        what the layer is — source of truth
  INTERFACES.md  the seams to other layers — what it calls, what it must stub
  SCENARIOS.md   the pass/fail acceptance suite (derived from user-stories/)
  BUILD.md       the ordered implementation plan, each step naming its gating scenarios
```

Deviations: `model/` uses `EVALS.md` (graded, because models are qualified rather than built) · `app/` adds `DESIGN.md` (carried design law) · `harness/`, `app/`, `marketplace/`, `deployment/` carry `NOTES.md` · `deployment/` is a process spec governing the build in this repo (ruled in place 2026-08-07), not a layer.

## Citation conventions that will otherwise trip you

- **`§6.5` means item 5 of §6's numbered list, not a subsection.** Three separate automated checkers have filed this as a phantom-section bug. It is not one. See the note at the top of `engine/SPEC.md`.
- **Section citations mix relative and repo-root-relative forms.** Some resolve only from the repo root, not from the citing file's directory.
- **Citations of the form `DESIGN:line` and `research/<name>.md:line` point outside this repo**, into a prior build on the founder's machine. They are traceability, not required reading; every law is stated in full in-repo. Nothing is lost if they don't resolve.

## Rulings

- **`FR#` = founder rulings.** Registry: `archive/08-founder-rulings-2026-08-06.md`. `FR-B` and `FR9` are the same ruling; the corpus cites `FR-B` only.
- **`OR-##` = open rulings.** Three exist — OR-28, OR-29, OR-39 — each fully defined where it is used. The numbering is non-contiguous; missing numbers were never assigned.
- **Some spec sections were drafted by an agent and are marked as such.** Where a section carries a drafted-not-ratified marker, treat its reasoning as a proposal, not as settled law.

## Where to start

- **To build a layer:** open its folder, follow its read order. Start at `harness/BUILD.md` — the harness is built and tested first, in isolation, against stubs.
- **To write or extend tests:** start in `user-stories/`. Those are the top of the hierarchy; per-layer `SCENARIOS.md` derives from them, and `TDD/` says what kind of executable test each criterion becomes.
- **To trace a decision:** `archive/`, subject to the authority order above.

## Two standing constraints

- **Documentation states readiness, never schedule** (FR2). A checklist of conditions is allowed; "start after Phase 3" is not. Do not add dates or sequencing promises.
- **One normative home per rule** (FR13). Every restatement cites the home. If you add a rule, put it in exactly one place and point at it from everywhere else.

## Agent skills

### Contradiction sweep

`.claude/skills/contradiction-sweep/` — after any multi-file spec pass and before committing spec changes, sweep for survivors of the edit: dead vocabulary, diverging restatements, unresolvable citations, seam pairs that disagree. Report-only; fixes are a separate ask.

### Issue tracker

GitHub Issues in `riskneutral00/annna-commitment-research`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout. Layer `SPEC.md` files are authoritative; `archive/` is history; `NOTES.md` is never authoritative. See `docs/agents/domain.md`.
