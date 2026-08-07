---
name: contradiction-sweep
description: Sweep the corpus for contradictions and half-switched migrations after spec edits — dead vocabulary that survived a rename, restatements that diverge from their normative home, citations that no longer resolve, seam pairs that disagree. Suspects are auto-researched to a verdict by parallel subagents before reporting. Fire after any multi-file spec pass, before any commit of spec changes, or when the user says "sweep", "check for contradictions", or "did anything get missed".
---

# Contradiction sweep

Spec passes in this corpus rename vocabulary, redraw laws, and move numbers. What breaks is never the file that was edited — it is the **survivor**: a dead term still cited three files away, a restated number nobody updated, a scenario still asserting the old law. This skill hunts survivors. It **reports; it does not fix** — fixes are a separate, explicit ask.

Default baseline: **`origin/main`** — everything local, committed and uncommitted alike, versus what the public repo has actually seen *(founder-corrected 2026-08-07: an earlier draft said `HEAD`, which silently skipped unpushed commits)*. The user may name a narrower baseline (a commit, a date, "since the wayfinder pass", `HEAD` for uncommitted-only). Branches `research/*` and `prototype/*` are **deliberately never pushed** (primary-source capture); report them as intentional, never as drift.

## Discipline (read first — these rules exist because their violations happened)

- **Full output only.** Truncated shell output has faked drift in this corpus twice. Write every diff and grep to a file under `.tmp/sweep-<date>/` and Read the file; never reason from a clipped terminal line.
- **Count before claiming.** Before reporting a registry gap or a missing label (FR#, OR-##, scenario IDs), count the distinct labels that actually exist. A prior sweep reported an OR-## gap that was a counting error.
- **Agreement proves nothing.** A finding is CONFIRMED only by two fresh quotes with `file:line` — the home's current text and the survivor's text — read this run, not remembered.
- **Authority order** (AGENTS.md): a layer `SPEC.md` is the source of truth. `archive/` is history — archive text disagreeing with a SPEC is **not** a finding, with one exception: the FR registry's "where it lives" pointers must resolve against the current corpus. `NOTES.md` is never authoritative — but a NOTES open-item whose question a SPEC now answers **is** a finding (absorbed-but-not-struck).
- **Citation conventions:** `§6.5` means item 5 of §6's numbered list, not a subsection. `DESIGN:line` and `research/<name>.md:line` point outside this repo — never findings. Some section citations resolve only from the repo root.
- **Exclude** `.tmp/`, `.sisyphus/`, `patches/` from every grep.

## The sweep

1. **Scope.** `git diff <baseline> --stat` plus `git status --short` → the changed-file set, saved to `.tmp/sweep-<date>/scope.txt`. Untracked new files count as changed. Then `git fetch` and record the **publication gap** — commits ahead/behind `origin/main` (`git rev-list --left-right --count origin/main...HEAD`) and which swept files exist only locally — so the report states which of its content the public repo has never seen.

2. **Harvest the dying vocabulary.** From the diff's deletion lines (`git diff <baseline> -U0 | grep '^-'`, saved to file), extract: renamed or deleted **terms** (object names, section titles, field names, enum values), changed **numbers** (durations, counts, bounds), and changed **IDs** (scenario families, FR#s). This list is the hunt list. Add any terms the user names.

3. **Survivor grep.** Grep the live corpus for every hunt-list term. Each hit is a suspect: either legal history (archive narrative), a deliberate historical note (a provenance banner naming what was replaced), or a **survivor** — the old law still standing somewhere the pass never reached. Classify every hit; unclassified hits stay SUSPECTED.

4. **Restatement audit (FR13: one normative home).** For each law the diff changed, grep the topic's distinctive terms corpus-wide. Every restatement outside the home must cite the home and agree with it — compare numbers, enums, and directional words (always/never, both/neither, may/must) **exactly**. A restatement with a different value is a CONFIRMED contradiction; a restatement that no longer cites the home is a SUSPECTED one.

5. **Citation resolve.** In every changed file, collect outbound citations (`file §N`, `FR#`, scenario IDs like `I3`/`D10`, relative paths). Resolve each against the current corpus, honoring the conventions above. A citation naming a section, ruling, or scenario that no longer exists — or whose content no longer supports the citing sentence — is a finding.

6. **Seam pair-read.** For each touched layer, read both sides of its seams: `SPEC ↔ INTERFACES ↔ SCENARIOS ↔ TDD/<layer> ↔ BUILD` (BUILD steps gate on scenario IDs — each gating ID must exist and its scenario must assert the *current* law, not the old one). Cross-layer, walk the citing files the changed sections name in their own text.

7. **Auto-research the suspects.** A SUSPECTED finding does not go straight to the report — dispatch one background subagent per suspect (read-only `Explore` agents, `model: sonnet`, in parallel) with the finding, the home quote, and the mission: *confirm or clear it with fresh `file:line` quotes*. Repo reading first; reach for web research only when the question turns on a fact outside the repo (a provider API, a legal term, an industry convention) — then primary sources, cited. Fold verdicts back: CONFIRMED moves up with its evidence, cleared moves to the clean list with its reason, and only a suspect no agent could settle stays SUSPECTED. The report should land with that bucket near-empty.

8. **Report.** One table, CONFIRMED first: `# · what contradicts what · home quote (file:line) · survivor quote (file:line) · suggested fix (one line)`. Then any surviving SUSPECTED with what would confirm each. Then the clean checks (what was swept and found consistent) in one line each — a sweep that reports only findings hides its own coverage. End with the totals, the publication gap, and the baseline used.
