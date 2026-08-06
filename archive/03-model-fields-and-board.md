# 03 — Proposed Model, Field Catalog, and Board Rendering

> ⚠️ **Historical — this is design *history*, not the build plan.** Preserved so decisions can be traced to their reasoning. Where anything here conflicts with a layer package (`harness/`, `engine/`, `app/`, `model/`), **the layer's `SPEC.md` wins.** Start at the [root README](../README.md).


Synthesis of both research halves into a concrete model for annnä.

## The core decision

**One `Commitment` object. No `event` / `task` types.** The classification is *derived* from axis values, never authored. The user and agent create a Commitment; the system infers the label. (Consistent with annnä's "derived, not entered" principle from user story A.)

```
Commitment {
  title            (REQUIRED — the only universal required field)

  // ---- the orthogonal axes ----
  temporal:        fixed-slot | deadline | floating/undated | recurring | continuous/open
  completion:      none  |  progress-state (needs-action → in-process → done, %)
  directedness:    self | person | group | role/institution | none
  executor:        identity | role | qualification-predicate | delegable | unfilled
  conditions:      [ precedent(activate) | subsequent(terminate) | discharge ]
  arity:           unilateral | mutual | joint | N-of-M threshold
                     (+ quorum, approval-threshold, liability-mode as distinct sub-fields)
  occupancy:       blocks-time?  +  visibility/scope (who can see it)
  consequence:     what happens if unfulfilled
  discharge:       how it ends / who can release it
}

event  = derived preset(temporal: fixed-slot, completion: none)
task   = derived preset(temporal: deadline|floating, completion: progress-state)
```

## Required vs optional (the field-status rule)

**Required (blocks "submit"):**
- **Always:** `title`. (`UID`/timestamps are auto-generated — never asked.)
- **When `temporal = fixed-slot`:** a start anchor (and, following real-world APIs, an end/duration).
- **When `temporal = deadline`:** the due date is what makes it a deadline — but a Commitment may legally float with none.

> The hinge is exactly what the original instinct said: **event = title + when-anchor; task = title.**

Beyond these system defaults, a template author can mark additional fields required (per user story B — the teacher adds their own). Field status therefore has two sources: **system defaults per axis** + **author choice**.

## Full field catalog (required · common-optional · derived)

| Field | Status | Notes |
|---|---|---|
| title | **required** | the only universal must |
| when — start anchor | required *iff* fixed-slot | makes it event-shaped |
| when — end / duration | required *iff* fixed-slot (real-world) | occupancy extent |
| when — due date | optional | makes it deadline-shaped |
| when — start/defer date | optional | "don't surface before" (task) |
| completion status / % | derived/optional | only meaningful when completion-axis on |
| notes / description | optional (common) | universal across all systems |
| location | optional (common) | + enrichment target (→ map link) |
| people — attendees | optional | shared time slot (event) |
| people — assignee / executor | optional | ownership; identity OR qualification |
| people — waiting-for | optional | blocked-on-another (GTD) |
| recurrence | optional (common) | one record → many occurrences |
| reminders | optional (common) | multiple allowed (RFC/Google) |
| priority | optional (common) | task-leaning |
| project / parent | optional | grouping + decomposition |
| subtasks / children | optional | decomposition (cake → sub-events) |
| tags / categories / contexts | optional (common) | GTD contexts = modern tags |
| visibility / scope | optional | per-viewer (story B) |
| free/busy (occupancy) | optional | does it block time |
| conditions / triggers | optional | activate / terminate / discharge (stories A, C) |
| quorum / threshold | optional | group commitments (story D) |
| consequence / fallback chain | optional | ranked substitutes (story C), breach (E) |

## How each temporal mode renders on the board

This is *why* it's a board, not a calendar — a time-slot grid cannot hold the last three:

| temporal mode | rendering |
|---|---|
| **fixed-slot** (event) | a block occupying its span on the day |
| **deadline** (task) | a marker *on* the due day — does not occupy a slot |
| **floating / undated** | a backlog rail; "associated with each successive date until completed" — not on the timeline until scheduled |
| **recurring** | one authored record generating occurrences |
| **continuous / open** | a band spanning days (e.g. ER coverage obligation) |

## Open threads (not yet decided)

- Which axes ship in the first build vs later (the "layered rollout" question).
- How the **personal Harness** promotes optional fields to "always ask this user" (deferred).
- How **enrichment** (location → map link) is modeled as a derived field (deferred).
- The **T2 use-case template** layer and which **harness(es)** we are actually building.
- The **safety spine** (drift vs Gate vs undo) — parked.

*Status as of 2026-08-03: commitment ontology (one object + derived presets) effectively agreed; field enumeration drafted above; next is deciding axis rollout and returning to the harness question.*
