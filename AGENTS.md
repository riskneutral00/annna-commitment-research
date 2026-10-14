# AGENTS.md — operating instructions for agents in this repo

This is a markdown specification corpus. Executable code is limited to TypeScript in `engine/` and `harness/` (both have Step 0 suites), `engine/scripts/reactive-push-check.mjs` (home: `engine/BUILD.md` Step 0, I4), `assets/make-pack.mjs`, and process gates in `deployment/scripts/` wired through `package.json` (`deployment/README.md`, “The one green command”). `git ls-files '*.md'` shows what clones contain. Local checkouts carry gitignored material under `.sisyphus/`, `docs/agents/` and `patches/`; it is absent to readers and excluded from counts (FD-10).

## Authority order

1. **A `SPEC` is the source of truth.** Build from it. `SPEC` is a tier `INDEX.md` grades, not a location — root files carry it too.
2. **Use `INDEX.md`'s closed tier vocabulary:** `SPEC`, `derived`, `index`, `never`. Historical evidence justifies a decision; it does not override its current home. Local working notes are not product law.

Ask the founder only platform-architecture questions. User-configurable behavior is a setting; domain-specific behavior is future template configuration (FR37); UI/UX gets a separate handoff marked not a founder question. With Matt, say event, task, lesson and deadline; “commitment” is engine/schema vocabulary.

## Project phases

**Founder clarification, 2026-09-20:** Phase 1 = planning; Phase 2 = development; Phase 3 = maintaining live annnä. **Current: Phase 1; all planning material is editable.** Preserve history; mark proposals. BUILD steps use separate numbering. Planning exits: `blastoff.md`. Development requires explicit authorization.

## Package shape

```
<package>/
  README.md      purpose, role, read order
  SPEC.md        what the layer is — source of truth
  INTERFACES.md  the seams to other layers — what it calls, what it must stub
  SCENARIOS.md   the pass/fail acceptance suite (derived from user-stories/)
  BUILD.md       the ordered implementation plan, each step naming its gating scenarios
```

Deviations: `model/` uses graded `EVALS.md`; `app/` adds `DESIGN.md` (canvas, skins and glass; rest reserved under FD-110); `deployment/` is a build-process spec, not a layer. Layer folders are unnumbered; `BUILD.md` numbers steps and `INTERFACES.md` joins modules.

## Citation conventions that will otherwise trip you

- **`§6.5` means item 5 of §6's numbered list, not a subsection.** Three separate automated checkers have filed this as a phantom-section bug. It is not one. See the note at the top of `engine/SPEC.md`.
- **Section citations mix relative and repo-root-relative forms.** Some resolve only from the repo root, not from the citing file's directory.
- **Citations of the form `DESIGN:line`, `research/<name>.md:line` and any `archive/…` path point outside the tracked tree** — the first two into a prior build on the founder's machine, `archive/` into this repo's own git history. They are traceability, not required reading; every law is stated in full in-repo. Nothing is lost if they don't resolve.
- **Never cite an in-repo line number. Quote the phrase instead** — a line number rots the next time anything is inserted above it, silently. Enforced by `cite-form.mjs`.

## Rulings

- **`FR#` = founder rulings.** Registry: `RULINGS.md`. `FR-B` and `FR9` are the same ruling; the corpus cites `FR-B` only.
- **`FD#` = founder decisions made inside a build phase** — same registry, its own section. The two series are independent and neither renumbers the other, so a citation must say which it means.
- **`OR-##` = open rulings.** Open: OR-28, OR-29, OR-42 (OR-39, OR-40, OR-41 closed) — each fully defined where it is used. The numbering is non-contiguous; missing numbers were never assigned.
- **`RQ-##` = product requirements** (with `SM-#`, `UJ-`). Home: `PRD.md`. Deliberately not `FR#` — reusing that label would rebuild the collision the `R#` → `FR#` rename ended.
- **Some spec sections were drafted by an agent and are marked as such.** A drafted-not-ratified section's `[MUST]` rows still gate the build until the founder rules (FD-91); reasoning stays proposal.

## Where to start

`INDEX.md` lists tracked files, authority tiers and decisions; read it before grepping. Build from `harness/BUILD.md` against stubs, derive tests from `user-stories/`, and trace decisions in `RULINGS.md`.

## The one green command

`npm run check` is the whole gate; [`deployment/README.md`](deployment/README.md) §The one green command owns its steps, hook setup and why.

Delivery: PR to `main`, merged without Matt by `gh pr merge --match-head-commit <sha>` once `npm run check` and an independent verification pass that sha; no auto-merge or merge queue.

## Two standing constraints

- **Documentation states readiness, never schedule** (FR2). A checklist of conditions is allowed; "start after Phase 3" is not. Do not add dates or sequencing promises.
- **One normative home per rule** (FR13). Every restatement cites the home. If you add a rule, put it in exactly one place and point at it from everywhere else. **Two `SPEC`s in conflict: the rule's home wins; if neither claims it, ask.**

## Standing discipline

Before committing a multi-file pass, sweep for dead terms, diverged restatements, broken citations and stale counts; gate script-detectable survivors. Before claiming absence or count, test a known positive, save and read complete `git grep` output with a count; never truncate it, reuse counts, or treat a read limit as EOF.

Never record or publish the origin story of the name "annnä", never ask Matt to re-tell it, and never reconstruct it from context (Matt, 2026-08-06). The only recordable facts are the pronunciation (like "Anna") and that the app is personified (you talk to her).

## Agent skills

### Issue tracker

GitHub Issues in `riskneutral00/annna-commitment-research`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

*`docs/agents/` is working material, absent from a clone.*

## Corpus language and design discipline

- Spell the product **annnä**; silently normalize speech variants but preserve identifiers and append-only logs.
- If a document depends on outside input, add **Blocked On** (gap, blocker, resolver); do not guess or conflate it with an open question.
- Take physical descriptions literally; do not add primitives or preserve rules for nonexistent contention.
- Keep engine code and FRs domain-free; domain vocabulary belongs in deletable content or templates.
- Offer the strict option first; resolve spec collisions by deleting or narrowing overreaching absolutes before adding mechanisms.
