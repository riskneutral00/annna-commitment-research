---
name: probe-situation
description: "Build a multi-stakeholder annnä user-story Situation folder from a domain brief, stakeholder map, one setup story per resource type, floor/ceiling/probe runs, and a storybook README. Staged (map|setup|runs|storybook), each stage runnable alone. Use for use cases that are a coordinated market of many stakeholders (like the dive). annnä-specific."
allowed-tools: Read, Bash, Glob, Grep, Write, Edit, AskUserQuestion
user-invocable: true
---

# /probe-situation: build a multi-stakeholder annnä Situation

Turn a domain brief into a `user-stories/Situations/Situation-<slug>/` folder: a coordinated market of stakeholders, told the way the dive (`Situation-C/`) is. Staged so any stage runs on its own.

**First:** read `~/.claude/skills/probe-situation/METHOD.md` (co-located). It holds every invariant this skill applies (§1–8). The gold reference is the entire `$HOME/Projects/annna/annnä-commitment-research/user-stories/Situations/Situation-C/` folder, read it before writing.

## Invocation
`probe-situation <slug> [stage=map|setup|runs|storybook]`, default runs all stages in order. Each stage reads and writes the Situation folder, so you can run just one (e.g. re-do the storybook after edits).

## When to use
- A brief from `probe-elicit` marked **multi-stakeholder market**.
- A persona that **graduated** from `person-X.md` into a whole world (like Person C → the dive).

## When NOT to use
- One or two actors → still a Situation folder here; the single protagonist's telling is `story-<name>.md` inside it.
- No brief → `probe-elicit` first.

## Workflow

Read `METHOD.md`, the brief, and `Situation-C/` first, always. Then run the requested stage(s).

### Stage `map`: the stakeholder map
Write `Situation-<slug>/_map.md` (working doc):
- Split every actor into **resource (one-of-one / atom)** vs **operator (taker / composite)**; mark the **customer** (usually off-app).
- **Every resource type must be a market of ≥2**: a first choice that can fail + a fallback (METHOD §5). If the brief gave one, invent a plausible second from the real domain and give it a concrete failure reason (out of stock, too small, booked, wrong config).
- Set the **build order: atoms → composites.**
- List the **roster of players per type** (the ≥2+), with the one attribute that makes each a first choice vs. fallback.

### Stage `setup`: one setup story per type
For each **resource type**, write one `resource-<type>.md` (not one per player), through a single representative (METHOD §5–6):
- Land on empty board → admin **template** fills it (+ agency/standards docs already loaded) → declare specifics via console (bounded by docs) → availability + acceptance (Auto vs Review) → their slice of a booking.
- Note real within-type variation only where it matters; if setup genuinely differs (e.g. **boats** have different routes), show two or three in that one file.
- Encode agency-doc-driven permissions where present (e.g. a divemaster = an instructor rating the docs restrict to no-certify).
Then the **operators**: `operator-<role>.md` each (dive center owns its resources via the same forms; agent depends on a center). And `customer.md` (off-app, form only).
Third-person, what-happens-only, named actors, no backstory (METHOD §4).

### Stage `runs`: the situations
Write `situation-1.md …` , **each stating its purpose** (METHOD §7):
- **`situation-1` = ceiling**: everyone on annnä; it places the whole thing in one pass; ranked lists resolve silently; zero calls.
- **`situation-2` = floor / current reality**: the same world with only the center on the app; the manual mess (phone trees, cascades ≥2 deep, contention no one can see). "Even if annnä didn't exist."
- **`situation-3+` = probes**: targeted interactions: a scarce match that **works** (rating → language → availability), and one **honestly refused** ("no X available" at submit). Add as many as the brief's must-refuse list needs.
- Cover **must-work AND must-be-refused**. Prefer a **multi-party concurrent** load (several customers, shared resources) so contention and capacity do real work.

### Stage `storybook`: the README
Write `Situation-<slug>/README.md`, self-contained so another LLM gets the whole scope (METHOD §8): **how to read → the two stakeholder kinds → the cast/roster (all players, ≥2 per type, with failure quirks) → the file index (the setup + operator + customer stories) → the courses/rules → the situations with their purposes → the wider real-world market it's drawn from.** One story per type; roster lives here, not in per-player files.

### Finish
- Add a row to `user-stories/README.md` and (if used) delete `_map.md` or keep it as a working note.
- **Meta-principle check:** nothing "designs annnä to the probe"; any model-break is flagged as a missing **general** primitive (METHOD §1).
