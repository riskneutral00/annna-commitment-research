# BLASTOFF — the readiness checklist for the first build commit

*Measured 2026-09-17 against the working tree. This file is a checklist of conditions, never a schedule (FR2): nothing here says when, only what must be true. It points at homes and states no law; where a task changes a rule, the rule changes in its home and this file only records that it did.*

**The rule.** Twenty metrics, each scored 0–10. The corpus is **ready to build** when every metric re-grades at **9 or 10**. A 9 means the pre-build condition for that dimension is met, not that the dimension is built: tests, deployment and qualification are the build's own work, and their bar here is "the first step can start and its gate can see it."

**How to grade.** Each metric carries a **9 means** line and a **Verify** line. Grade by running the Verify line, not by reading the tasks. When every box under a metric is ticked, re-grade it; a ticked list that still fails its Verify line means a task was wrong, and the fix is a new task, never a lower bar.

**Owners.** `F` = founder only (a ruling, an account, a by-eye pick). `A` = an agent can do it end to end. `F→A` = the founder decides, an agent lands it. Most of what holds the overall score down is `F`.

**Overall now: 5.9 / 10.** Fourteen of twenty are below 9.

---

## M1 · Entry-path clarity — now 8

**9 means:** the first 60 lines of AGENTS.md contain no claim the rest of the tree contradicts.
- [ ] `A` Delete authority-order item 2 in AGENTS.md (the `history` tier no longer exists in INDEX.md's vocabulary); renumber nothing else.
- [ ] `A` Re-read AGENTS.md top to bottom against INDEX.md's tier table and `package.json`; fix any other stale claim found.

**Verify:** `grep -c history AGENTS.md` returns 0, and `npm run check` is green.

## M2 · Single normative home — now 8

**9 means:** a script, not a reader, catches a rule stated normatively in two files.
- [ ] `A` Write `deployment/scripts/one-home.mjs`: for every bolded `[MUST]`-class sentence in a `SPEC`-tier file, flag a near-duplicate (normalised, ≥ 12 words shared) in another `SPEC`-tier file that does not cite the first. Wire it into `check`, describe it in `deployment/README.md`, register it in the Tier-2 log in RULINGS.md.
- [ ] `A` Resolve every hit the first run prints: keep one home, cite it from the other.

**Verify:** `ONE-HOME OK` in the check output.

## M3 · Gate health — now 9

**9 means:** already met. Hold it.
- [ ] `A` Add to AGENTS.md §The one green command that a fresh clone is ungated until `git config core.hooksPath .githooks` runs, and have `.github/workflows/check.yml` be the thing that catches a clone that skipped it. Already true; confirm the workflow triggers on push to main.

**Verify:** 35 gates `OK`; the workflow's trigger block names `push` on `main`.

## M4 · Scenario → step traceability — now 9

**9 means:** already met. Hold it through the story re-cut (M19), which retires scenario rows.

**Verify:** `GATE-COVERAGE OK` with no phantoms after M19 lands.

## M5 · Story → layer traceability — now 6

**9 means:** every kept story is a discovered pair, and no story ID is uncited.
- [ ] `A` Write `story-debra-verification.md` beside `story-debra.md`, in the Matt companion's format (cases, CRUD, harness cues, layer debt), so `discoverStories()` finds two pairs.
- [ ] `F→A` For each of the 97 uncited Matt IDs, the founder says *cite* or *cut*; an agent then adds the citing row or strikes the ID from the story and its companion.
- [ ] `A` Close or explicitly retire the one owed CRUD outcome (CRUD-02 delete/removal) once the founder rules on product erasure (see the layer-debt section of Matt's companion).

**Verify:** `PROBE-COVERAGE OK` reports ≥ 2 discovered pairs and `0 ID(s) with no citing row`.

## M6 · Decision debt — now 5

**9 means:** no open ruling and no drafted marker anywhere in the tree.
- [ ] `F` Answer `.tmp/ratification-2026-09-17.html`: "k" for all, or exceptions by item. Items A14–A16 are already overtaken by FD-110.
- [ ] `A` For each accepted item: strip the marker at every site, add the ruling row to RULINGS.md, remove the row from the drafted-marker registry.
- [ ] `F` Rule OR-28, OR-29 and OR-42 where each is defined.
- [ ] `A` Update the AGENTS.md open-rulings sentence and the RULINGS.md rows to closed.

**Verify:** `LABEL-REGISTRY OK — 0 drafted marker(s)`; `grep -c 'Open: OR' AGENTS.md` returns 0.

## M7 · Unblocked next step per layer — now 6

**9 means:** every layer's lowest open step is unblocked and its preceding step is CLOSED, or the layer is frozen.
- [ ] `A` Close engine Step 0: meet the Verify line that has read part-met since 2026-08-08, or state in a ruling what part is re-scoped and why. Six weeks of NOT CLOSED is a status that means nothing.
- [ ] `F` Close security Step 0 and deployment Step 2 (both wait on accounts, M16).
- [ ] `A` Remove the four FD-110 preconditions from app/BUILD.md Steps 1, 2, 3 and 5 once M8 lands.

**Verify:** `npm run check:status` prints no `NOT CLOSED` and no `BLOCKED`.

## M8 · Design readiness — now 2

**9 means:** the design scheme has landed in its reserved homes and a builder can place a pixel without inventing.
- [ ] `F` Author `app/tokens.json` first: colour, type scale, spacing, radius, motion durations. Every hex the corpus will ever quote comes from here or a pack palette; `hex-source` already reads it.
- [ ] `F→A` Fill DESIGN.md's seven reserved sections from the scheme: Tokens, Typography, Colour, Layout & board, Components, Motion & iconography, Identity & brand. Each section states law once; the glass and skin sections stay as ruled.
- [ ] `F→A` Fill BRAND.md's four owed headings: Identity, Vision, Voice, Marks.
- [ ] `A` Re-cut app/BUILD.md's coverage table so each filled section is named by a step (the design-law gate requires it), and drop the "reserved (FD-110)" rows.
- [ ] `A` Record the landing as a ruling row in RULINGS.md; strike the FD-110 preconditions (M7).
- [ ] `F` Pick the shipping skin set, or rule that the four fixtures ship. Koi stays default until then.

**Verify:** `app/tokens.json` exists; `DESIGN-LAW-COVERAGE OK` with zero sections whose body is the reserved line; `grep -c 'Reserved\.' app/DESIGN.md BRAND.md` returns 0.

## M9 · Interface concreteness — now 5

**9 means:** every seam a Step 0 or Step 1 touches is typed code held to its spec by a gate.
- [ ] `A` Derive `engine/convex/schema.ts` from the object model in engine/SPEC.md: one table per object, one field per stated attribute, latches as fields. Nine lines today; the SPEC is 35k words.
- [ ] `A` Write a gate in the style of `trigger-union.mjs` that checks the schema's tables and fields against the SPEC's object list in both directions.
- [ ] `A` Type the app seam (`display_settings(diff)` and the render verbs) in `harness/src/seams.ts` or an `app/src/seams.ts`, so the app layer has a code counterpart before app Step 0.
- [ ] `A` Type the model seam's `judge` block and `routing` block as a schema the qualification runner validates.

**Verify:** each of engine, harness, app and model has a tracked `.ts` file that its INTERFACES.md names, and a gate line reports the schema/spec agreement `OK`.

## M10 · Executable test scaffolding — now 4

**9 means:** every layer that will build has a Step 0 suite that runs green and hermetic, and the reason-pair gap list is owned by named steps.
- [ ] `A` Land app Step 0 (scaffold + empty suite) and model Step 0 (eval scaffold + judge prompt stub) so four suites exist, not two.
- [ ] `A` In each BUILD step from harness Step 1 onward, name which of the 21 unexercised verb-kind reason pairs that step's suite discharges, so the compat gate's gap list reads as an assignment.

**Verify:** `B9 OK — 4 suite(s) run twice`; `COMPAT-REASONS OK` prints every gap beside a step that names it.

## M11 · Reading load per step — now 4

**9 means:** a builder on any step knows which sections are required reading before opening the SPEC.
- [ ] `A` Add a **Read first** line to every BUILD step in all seven layers: the SPEC §s, INTERFACES §s, and scenario IDs that step needs. Cite; do not restate.
- [ ] `A` Extend `cross-layer-cite.mjs` so a **Read first** line's §s must resolve (they are ordinary citations, so this may already hold; confirm).

**Verify:** `grep -c 'Read first' */BUILD.md` equals the number of `## Step` headings per file; `CROSS-LAYER-CITE OK`.

## M12 · Freeze discipline — now 8

**9 means:** every freeze names its resume condition in one place and the status report shows it.
- [ ] `A` Have `status-report.mjs` print the resume condition beside each frozen step, read from the freeze banner's home file.

**Verify:** `npm run check:status` shows `FROZEN — resumes when <condition>` for marketplace, security Steps 4–8 and the assets pipeline.

## M13 · Readiness, never schedule — now 8

**9 means:** a script refuses a sequencing promise.
- [ ] `A` Write `deployment/scripts/no-schedule.mjs`: flag `after Phase`, `by Q[1-4]`, `next week`, `in <n> weeks`, and a month name followed by a year in any `SPEC`-tier file, excluding RULINGS rows and dated annotations of the `*(2026-…)*` form. Wire, describe, register.

**Verify:** `NO-SCHEDULE OK`.

## M14 · Survivor rate — now 7

**9 means:** no SPEC file narrates its own history; rulings live in RULINGS.md.
- [ ] `A` Move deployment/SPEC.md's header narrative (the retired NOTES reference, "adversarial review round one") and the two-paragraph order history in `deployment/SPEC.md §0` into RULINGS.md rows; leave one citation behind.
- [ ] `A` Sweep every SPEC-tier file for paragraphs beginning *Ruled …, replacing* or *The former … was law*; move each the same way.
- [ ] `A` Reduce dated annotations to the ruling ID they cite where the RULINGS row already carries the reasoning (about 12k words today; the count is not the goal, the single home is).

**Verify:** `grep -rlE 'replacing "|was law, and it was departed' --include='*.md' . | grep -v RULINGS` returns nothing.

## M15 · Model qualification readiness — now 4

**9 means:** the exam can grade a candidate, proven once.
- [ ] `A` Author an N-set item for every intent in model/SPEC.md §2 so the coverage condition in model/EVALS.md is met.
- [ ] `A` Land the `judge` config block beside `routing` as real config, pinned as EVALS.md requires.
- [ ] `F→A` Run one candidate through model/BUILD.md Step 3 end to end. A passing or failing score is fine; the point is that the exam grades.

**Verify:** a qualification transcript is tracked under `model/` and every intent in §2 has an item ID.

## M16 · Deployment readiness — now 3

**9 means:** a commit on main can reach a hosted rung through a tracked workflow, and the rung gates read something real.
- [ ] `F` Open the host account, the CI environments and the model-provider key's qualification environment.
- [ ] `A` Land the rung config and the deploy workflow deployment/BUILD.md Step 2 specifies; close Step 2.
- [ ] `A` Confirm R9, R4 and T-six stop reporting `NOT YET CONSTRUCTIBLE`.

**Verify:** `check:status` shows deployment Steps 0–3 CLOSED; no gate line contains `NOT YET`.

## M17 · Security floor — now 4

**9 means:** X1–X5 are constructible and green.
- [ ] `F` Same accounts as M16.
- [ ] `A` Build X2–X5 as security/BUILD.md Step 0 specifies; close Step 0.

**Verify:** security Step 0 CLOSED; five X gates `OK`.

## M18 · Product-requirement determinacy — now 6

**9 means:** the PRD has no open question a builder must guess at, and the briefs are answered rather than parked.
- [ ] `F` Answer each question in `PRD.md §11`; an agent moves each answer to its home and deletes the question.
- [ ] `F` Answer the 12 briefs in `user-stories/_briefs/`. The briefs stay (your earlier ruling keeps them); each gains an **Answered** block, and the answer's law lands in PRD.md or the owning SPEC.
- [ ] `A` Replace the provisional markers on PRD §1 and §1.4 once BRAND.md lands (M8).

**Verify:** `PRD.md §11` is empty or reads "none open"; every brief carries an **Answered** heading.

## M19 · Story consolidation — now 4

**9 means:** the second round is done: three or four named stories, each a discovered pair, the retired situations gone, coverage re-cut.
- [ ] `F` Finish the named stories (Matt, Debra, one or two more) in the Matt format.
- [ ] `A` Write each companion (M5).
- [ ] `A` Retire Situations B, C, C′ and D under a ruling row; rehome any scenario rows derived from them onto the named stories or strike them with the gate-coverage table updated.
- [ ] `A` Re-cut `user-stories/COVERAGE.md` and `user-stories/README.md` to the named stories only; update README.md's reading list.

**Verify:** `ls user-stories/Situations` lists only named-story folders; `PROBE-COVERAGE OK` discovers every one of them.

## M20 · Corpus regression protection — now 8

**9 means:** every drift class found in a past pass has a gate.
- [ ] `A` The one-home gate (M2) and the no-schedule gate (M13) are the two known unguarded classes. Landing them closes this.

**Verify:** ROSTER reports 37 gates; the Tier-2 log in RULINGS.md has a row for each.

---

## The re-grade

Run every Verify line, fill the column, and apply the rule.

| Metric | Was | Now | ≥ 9 |
|---|---|---|---|
| M1 Entry path | 8 | | |
| M2 One home | 8 | | |
| M3 Gate health | 9 | | |
| M4 Scenario → step | 9 | | |
| M5 Story → layer | 6 | | |
| M6 Decision debt | 5 | | |
| M7 Unblocked step | 6 | | |
| M8 Design | 2 | | |
| M9 Interfaces | 5 | | |
| M10 Tests | 4 | | |
| M11 Reading load | 4 | | |
| M12 Freezes | 8 | | |
| M13 No schedule | 8 | | |
| M14 Survivors | 7 | | |
| M15 Model | 4 | | |
| M16 Deployment | 3 | | |
| M17 Security | 4 | | |
| M18 PRD | 6 | | |
| M19 Stories | 4 | | |
| M20 Regression | 8 | | |

**Ready to build** when the last column is all yes. If one metric cannot reach 9 without building, the bar was written wrong; rewrite the **9 means** line as a pre-build condition and say so in a ruling row, never by grading generously.
