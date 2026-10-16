---
name: probe-situation
description: "Build an annnä user-story Situation folder from a probe-elicit sitting's answers: stakeholder map, one setup story per resource type, floor/ceiling/probe runs, and a storybook README. Staged (map|setup|runs|storybook), each stage runnable alone. Use for use cases that are a coordinated market of many stakeholders (like the dive). annnä-specific."
allowed-tools: Read, Bash, Glob, Grep, Write, Edit, AskUserQuestion
user-invocable: true
---

# /probe-situation: build an annnä Situation

Turn a sitting's answers (from `probe-elicit`) into a `user-stories/Situations/Situation-<slug>/` folder, told the way the dive (`Situation-C/`) is for a market of many, or as a single protagonist's `story-<name>.md` with its setup and runs. Staged so any stage runs on its own. Paths here are repo-relative to the annnä repository root.

**First:** read `user-stories/README.md`, the law for every story (folder shape, voice, provenance registers, change rules), then `.agents/skills/probe-situation/METHOD.md` (co-located) for the taxonomy, the setup-story shape and the runs. The gold reference for a market of many is the whole `user-stories/Situations/Situation-C/` folder; read it before writing.

## Invocation
`probe-situation <slug> [stage=map|setup|runs|storybook]`, default runs all stages in order. Each stage reads and writes the Situation folder, so you can run just one (e.g. re-do the storybook after edits).

## When to use
- The answers from a `probe-elicit` sitting are ready.
- An existing Situation is being extended by a new elicited run.

## When NOT to use
- No sitting yet → `probe-elicit` first.

## Workflow

Read `user-stories/README.md`, `METHOD.md`, the sitting's answers and `Situation-C/` first, always. Then run the requested stage(s).

### Stage `map`: the stakeholder map
Write `Situation-<slug>/_map.md` (working doc):
- Split every actor into **resource (one-of-one / atom)** vs **operator (taker / composite)**; mark the **customer** (usually off-app).
- **Every resource type must be a market of ≥2**: a first choice that can fail + a fallback (METHOD §5). If the sitting gave one, invent a plausible second from the real domain and give it a concrete failure reason (out of stock, too small, booked, wrong config), and mark the invention as such.
- Set the **build order: atoms → composites.**
- List the **roster of players per type** (the ≥2+), with the one attribute that makes each a first choice vs. fallback.

### Stage `setup`: one setup story per type
For each **resource type**, write one `resource-<type>.md` (not one per player), through a single representative (METHOD §5–6):
- Land on an empty board → the administrator-authored **template** fills it → declare specifics via the console, bounded by the outside standards the template already encodes → availability + acceptance (Auto vs Review) → their slice of a booking.
- Note real within-type variation only where it matters; if setup genuinely differs (e.g. **boats** have different routes), show two or three in that one file.
- Encode standard-driven permissions where present (e.g. a divemaster = an instructor rating the standard restricts to no-certify), as structured declarations, never as an uploaded document (owner and guest uploads are excluded from v1, `security/SPEC.md`).
Then the **operators**: `operator-<role>.md` each (a dive center owns its resources via the same forms; an agent depends on a center). And `customer.md` (off-app, form only).
Voice per `user-stories/README.md` (METHOD §4).

### Stage `runs`: the situations
Write `situation-1.md …`, **each stating its purpose and its provenance register** (METHOD §7; `user-stories/README.md` §Provenance):
- **`situation-1` = ceiling**: everyone on annnä; it places the whole thing in one pass; ranked lists resolve silently; zero calls.
- **`situation-2` = floor / current reality**: the same world with only the center on the app; the manual mess (phone trees, cascades ≥2 deep, contention no one can see). "Even if annnä didn't exist."
- **`situation-3+` = probes**: targeted interactions: a scarce match that **works** (rating → language → availability), and one **honestly refused** ("no X available" at submit). Add as many as the must-refuse list needs.
- Cover **must-work AND must-be-refused**. Prefer a **multi-party concurrent** load (several customers, shared resources) so contention and capacity do real work.

### Stage `storybook`: the README
Write `Situation-<slug>/README.md`, self-contained so another LLM gets the whole scope (METHOD §8): **how to read → the two stakeholder kinds → the cast/roster (all players, ≥2 per type, with failure quirks) → the file index (the setup + operator + customer stories) → the courses/rules → the situations with their purposes → the wider real-world market it's drawn from.** One story per type; roster lives here, not in per-player files.

### Finish
A new or extended Situation is not done until the corpus registers it:
- **`INDEX.md`**: one row per new tracked `.md` file, tier and what it decides (`npm run derive` placeholds the rows; `deployment/scripts/index-complete.mjs` fails until each is described).
- **`user-stories/COVERAGE.md`**: a section or rows for the new beats against the layers that owe them, each cell citing a scenario or recorded as owed.
- **Provenance**: a row in `user-stories/README.md` §Provenance's table, and the register declared in each run file.
- A row in `user-stories/README.md` §How to read's path table; delete `_map.md` or keep it as a working note.
- Run `npm run check`.
- **Meta-principle check:** nothing "designs annnä to the probe"; any model break is flagged as a missing **general** primitive (METHOD §1), and mechanism ideas go to the owning layer spec or the invented-and-justified register (`user-stories/README.md`), never into the story.
