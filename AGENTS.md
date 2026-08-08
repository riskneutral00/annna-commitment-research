# AGENTS.md — operating instructions for agents in this repo

**This repo is a specification corpus — its source of truth is markdown.** Code now executes in a few places: `engine/` and `harness/` each carry real TypeScript and a vitest suite (both at Step 0); `engine/scripts/reactive-push-check.mjs` probes the reactive-push criterion against a live Convex deployment (normative home: `engine/BUILD.md` Step 0, I4); `assets/make-pack.mjs` builds the admin asset pack; `model/spike/run-nset.mjs` is an executable OpenRouter runner that **spends money** on every execution and is deliberately unrun (FD-5, and `deployment/SPEC.md §8` DR-7); and sixteen process gates sit in `deployment/scripts/` — `gate-coverage.mjs` (the gate-coverage law, `deployment/SCENARIOS.md B8`), `size-guard.mjs`, `package-shape.mjs`, `doc-count-check.mjs`, `b4-verdict-check.mjs` (`npm run verdicts`, not `check`), and the eleven scenario gates `s2-path-class.mjs`, `s3-no-outside-spec.mjs`, `r2-closed-service.mjs`, `r3-workflow-lint.mjs`, `r4-one-seed-door.mjs`, `r6-deploy-secret-scoping.mjs`, `r9-noindex-nodebug.mjs`, `x1-secret-grep.mjs`, `b9-twice-run.mjs`, `q3-swap-diff.mjs` and `egress-lint.mjs` (see "The one green command"). Everything else is specification, not code: **130** tracked markdown files (`git ls-files '*.md'` — what a clone contains, and the count `README.md` states). A working checkout also carries gitignored material under `.sisyphus/`, `.specs/`, `docs/agents/` and `patches/`; it is absent for every reader and no count of it is asserted (FD-10). Read that as a standing caveat on everything below.

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
- **`FD#` = founder decisions made inside a build phase** — same registry, its own section. The two series are independent and neither renumbers the other, so a citation must say which it means.
- **`OR-##` = open rulings.** Three exist — OR-28, OR-29, OR-39 — each fully defined where it is used. The numbering is non-contiguous; missing numbers were never assigned.
- **Some spec sections were drafted by an agent and are marked as such.** Where a section carries a drafted-not-ratified marker, treat its reasoning as a proposal, not as settled law.

## Where to start

- **To build a layer:** open its folder, follow its read order. Start at `harness/BUILD.md` — the harness is built and tested first, in isolation, against stubs.
- **To write or extend tests:** start in `user-stories/`. Those are the top of the hierarchy; per-layer `SCENARIOS.md` derives from them, and `TDD/` says what kind of executable test each criterion becomes.
- **To trace a decision:** `archive/`, subject to the authority order above.

## The one green command

`npm run check` from the repo root is the whole gate. `.github/workflows/check.yml` runs exactly it on every push — one always-run aggregator job, **no path filters** (a skipped required check reports as success, so a filtered gate is worse than none: `deployment/SPEC.md §4`). That job reports *after* a landing, so it is the second reader, not the refusal. **A `.githooks/pre-commit` hook runs `npm run check` before every commit** — the pre-landing form `deployment/SCENARIOS.md` B1 pre-authorized, with `--no-verify` as its acknowledged bypass. The hook is not automatic on clone: `git config core.hooksPath .githooks` once, per checkout — **a fresh clone is ungated until that line is run**. FD-7 accepted this form and wrote the bypass down as the ceiling, which is the condition B1 named for returning to `[MUST]`; it is one now, with a stated bound rather than none. It runs, in order:

1. `deployment/scripts/gate-coverage.mjs` — every `[MUST]` scenario has a BUILD home, every gated ID is a real scenario. Its own `--selfcheck` assert suite runs first, so the checker is checked before it checks.
2. the static scenario gates, all local — `s2-path-class.mjs` (S2: spec and code never move in one commit; **spec is decided by file extension, not directory**, because layer code will live beside its specs), `s3-no-outside-spec.mjs` (S3: no submodule or workflow pulls spec text from outside the commit), `r3-workflow-lint.mjs` (R3: the model key is referenced by the qualification lane and nowhere else), `r9-noindex-nodebug.mjs` (R9: no reachable debug or auth-bypass flag below production), `x1-secret-grep.mjs` (`security/SCENARIOS.md` X1: no client-exposed secret), `r2-closed-service.mjs` (R2: no closed-service credential and no undeclared service URL), `r4-one-seed-door.mjs` (R4: at most one `seed.<ext>`, importing fixtures only), `r6-deploy-secret-scoping.mjs` (R6: no unprotected CI job holds a deploy/production secret). S2 reads the **staged** set, so it is meaningful in the hook and prints an explicit *skipped* line anywhere else.
3. the engine and harness vitest suites.
4. `deployment/scripts/b9-twice-run.mjs` (B9) — every layer with a suite runs **twice** and its `.tmp/transcripts/<layer>.txt` is byte-compared. Both layers write one since harness Step 0, so this is a live byte-compare, not a placeholder; a suite that stops writing its transcript while a sibling still writes one fails it. `--selfcheck` first, same reason as gate-coverage.
5. `deployment/scripts/egress-lint.mjs` — outbound network calls confined to `deployment/egress-allowlist.md` (two files, both process-only). `q3-swap-diff.mjs` runs its `--selfcheck` here and its real pass in `.githooks/commit-msg`, which needs the commit message. **A second hook exists for that**, and it needs the same one-time `core.hooksPath` line.
6. `engine/scripts/reactive-push-check.mjs` — **only where a live deployment exists.** It needs one, and CI has none, so `check` runs it when `CONVEX_URL` names a deployment and prints an explicit *skipped* line when nothing does. Run it yourself against the dev deployment before trusting the criterion; the CI job cannot, and says so rather than passing quietly.
7. `deployment/scripts/size-guard.mjs` — no tracked file over 2MB, except `assets/masters/treestars.jpg` and `koi.jpg`, pinned by path **and exact size** so a swap at the same path cannot pass on the name. They are unreachable without a history rewrite, which `deployment/SPEC.md §7` forbids.
8. `deployment/scripts/package-shape.mjs` — every layer carries the five files "Package shape" above promises. A layer is any directory with a tracked `SPEC.md`, so the eighth layer is checked the day it lands. `model/`'s `EVALS.md` is a substitution, declared in the script.
9. `deployment/scripts/doc-count-check.mjs` — the tracked markdown count this file and `README.md` claim must be true; and **this file has a word ceiling**. Add or delete a tracked `.md` and this goes red until the number in the caveat above is corrected. Grow this file past the ceiling and it goes red until something is deleted or the ceiling is raised on purpose.

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
