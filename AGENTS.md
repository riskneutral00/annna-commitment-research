# AGENTS.md — operating instructions for agents in this repo

**This repo is a specification corpus — its source of truth is markdown.** Code now executes in a few places: `engine/` and `harness/` each carry real TypeScript and a vitest suite (both at Step 0); `engine/scripts/reactive-push-check.mjs` probes the reactive-push criterion against a live Convex deployment (normative home: `engine/BUILD.md` Step 0, I4); `assets/make-pack.mjs` builds the admin asset pack; `model/spike/run-nset.mjs` is an executable OpenRouter runner that **spends money** on every execution and is deliberately unrun (FD-5, and `deployment/SPEC.md §8` DR-7); and twenty-five process gates sit in `deployment/scripts/` — each wired to an `npm` script in `package.json`, which is executable and therefore the only copy that cannot go stale (what each is for: "The one green command"). Everything else is specification, not code: **132** tracked markdown files (`git ls-files '*.md'` — what a clone contains, and the count `README.md` states). A working checkout also carries gitignored material under `.sisyphus/`, `docs/agents/` and `patches/`; it is absent for every reader and no count of it is asserted (FD-10). Read that as a standing caveat on everything below.

## Authority order

1. **A layer's `SPEC.md` is the source of truth.** Build from it.
2. **`archive/` is history, not authority.** It records how the design was reached — the founding research and two adversarial critiques. It is there to *justify*, not to build from. Where `archive/` and a layer `SPEC.md` disagree, **the SPEC wins**. `archive/` is 17% of the corpus and sorts first in recursive grep, so a naive search will surface superseded material before live material. Check which side of that line your hit falls on before you use it.
3. **`NOTES.md` is never authoritative** — a backlog scratchpad of items absorbed into the spec, plus anything still open.

## Package shape

```
<package>/
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
- **Never cite an in-repo line number. Quote the phrase instead** — a line number rots the next time anything is inserted above it, silently. Enforced by `cite-form.mjs`; `archive/` targets are exempt, being history that does not move.

## Rulings

- **`FR#` = founder rulings.** Registry: `RULINGS.md`. `FR-B` and `FR9` are the same ruling; the corpus cites `FR-B` only.
- **`FD#` = founder decisions made inside a build phase** — same registry, its own section. The two series are independent and neither renumbers the other, so a citation must say which it means.
- **`OR-##` = open rulings.** Three exist — OR-28, OR-29, OR-39 — each fully defined where it is used. The numbering is non-contiguous; missing numbers were never assigned.
- **Some spec sections were drafted by an agent and are marked as such.** Where a section carries a drafted-not-ratified marker, treat its reasoning as a proposal, not as settled law.

## Where to start

**`INDEX.md` lists every tracked file with its authority tier and what it decides — read it before grepping.** To build a layer: `harness/BUILD.md` first, in isolation against stubs. To write tests: `user-stories/`, the top of the hierarchy. To trace a decision: `archive/`.

## The one green command

`npm run check` from the repo root is the whole gate, and `.githooks/pre-commit` runs it before every commit — `git config core.hooksPath .githooks` once, per checkout, or a fresh clone is ungated. **What it runs and why each step exists: [`deployment/README.md`](deployment/README.md) §The one green command** (the order lives in `package.json`'s chain). That detail is needed once, while debugging a red gate; this file is injected on every turn, so it is not kept here.

## Two standing constraints

- **Documentation states readiness, never schedule** (FR2). A checklist of conditions is allowed; "start after Phase 3" is not. Do not add dates or sequencing promises.
- **One normative home per rule** (FR13). Every restatement cites the home. If you add a rule, put it in exactly one place and point at it from everywhere else.

## Standing discipline

After any multi-file pass, before committing, sweep for **survivors** — dead vocabulary a rename left behind, restatements that diverged from their home, citations that no longer resolve, counts the work overtook. Where a survivor is a class a script could catch, write the gate, not just the fix.

## Agent skills

### Issue tracker

GitHub Issues in `riskneutral00/annna-commitment-research`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

*Both `docs/agents/` files are working material, absent from a clone.*
