# AGENTS.md — operating instructions for agents in this repo

**This repo is a specification corpus. There is no application code, no tests, and no CI.** 122 markdown files plus one asset script (`assets/make-pack.mjs`). Nothing here executes. Read that as a standing caveat on everything below.

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

Deviations: `model/` uses `EVALS.md` (graded, because models are qualified rather than built) · `app/` adds `DESIGN.md` (carried design law) · `harness/`, `app/`, `marketplace/`, `deployment/` carry `NOTES.md` · `deployment/` is a process spec governing the *future code repo*, not a layer.

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

### Issue tracker

GitHub Issues in `riskneutral00/annna-commitment-research`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout. Layer `SPEC.md` files are authoritative; `archive/` is history; `NOTES.md` is never authoritative. See `docs/agents/domain.md`.
