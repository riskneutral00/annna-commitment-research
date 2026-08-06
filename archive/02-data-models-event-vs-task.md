# 02 — Event vs Task in Real Data Models

> ⚠️ **Historical — this is design *history*, not the build plan.** Preserved so decisions can be traced to their reasoning. Where anything here conflicts with a layer package (`harness/`, `engine/`, `app/`, `model/`), **the layer's `SPEC.md` wins.** Start at the [root README](../README.md).


Streams 3 & 4 examined the actual schemas: iCalendar RFC 5545 (VEVENT/VTODO), Google Calendar & Microsoft Graph, and Todoist / Things 3 / TickTick / OmniFocus / Microsoft To Do / Google Tasks / GTD.

## Required fields (what a system actually forces)

### Event
| Source | Strictly required |
|---|---|
| RFC 5545 VEVENT | `UID`, `DTSTAMP` (both auto/machine), `DTSTART` (conditionally). `SUMMARY`, `DTEND`/`DURATION` optional |
| Google Calendar API | only `start` and `end` (summary optional; id auto) |
| Microsoft Graph | `subject`, `start`, `end` in every canonical example |

**Spec-vs-reality twist:** RFC's only hard requirements (`UID`, `DTSTAMP`) are exactly the fields real APIs *forbid* clients to set (generated server-side). And `DTEND`/`DURATION`, "optional" in the spec, is *de facto required* by both APIs — there is no duration-only create path.

### Task
| Source | Strictly required |
|---|---|
| RFC 5545 VTODO | `UID`, `DTSTAMP` only. `SUMMARY`, `DTSTART`, `DUE` all optional — an undated, untitled to-do is legal |
| Todoist / Things / TickTick / OmniFocus / MS To Do / Google Tasks | **title only** |

> Universal answer: **a task needs only a name.** Everything giving it time, structure, or ownership is optional layered metadata.

## Most-common optional fields (ranked)

**Event:** summary → location → description → attendees → organizer → recurrence (RRULE/RDATE/EXDATE) → reminders (VALARM) → status → free/busy transparency (TRANSP) → categories → privacy/visibility → attachments.

**Task:** due date → start/defer date → priority → project/list → tags/contexts → subtasks → notes → reminders → recurrence → assignee → completion status.

## What structurally defines each

**Event** = the class characterized by:
- a **fixed anchor** on the timeline (a start is load-bearing)
- it **occupies extent** (end or duration) → therefore can **conflict/overlap** → therefore needs a **free/busy signal** (`TRANSP`) — a property no other object type needs (this is what separates VEVENT from VTODO/VJOURNAL)
- **recurs via a rule** (one record → many occurrences)
- it either **happens or is cancelled** — no progress state (its `STATUS` is tentative/confirmed/cancelled)

**Task** = the class characterized by:
- **deadline-oriented** (`DUE`, a finish-by) rather than a booked slot (`DTEND`)
- **completable** — has `STATUS` (needs-action/in-process/completed/cancelled), `COMPLETED` timestamp, `PERCENT-COMPLETE`
- **may be undated/floating** — RFC: "associated with each successive calendar date until it is completed"
- **deferrable** — a task's start means "don't act before," not "happening now"
- **decomposable** into subtasks/checklists
- **assignable / delegable / waiting-for**

## The blur (the crucial finding)

> The schema difference between task and event **evaporates** exactly at the point where `DTSTART` + `DURATION` (or `DTSTART` + `DTEND`) fully pins down when the work happens. At that point `STATUS`/`PERCENT-COMPLETE` are the *only* fields left distinguishing them.

Evidence: Todoist task-duration + calendar drag; TickTick tasks as time-blocks; Google Tasks/Apple Reminders surfacing inside Calendar. Things 3 is the deliberate outlier that keeps "When" (may-begin) and "Deadline" (finish-by) separate to *resist* the collapse.

This is why **one object with a temporal-binding axis** is the right model: event and task are the two ends of one continuum, plus an independent completion axis.

## Decomposition & delegation (for the cake / dive-centre stories)

- **Decomposition tiers:** full hierarchical task objects (Todoist, TickTick, OmniFocus, Google Tasks) · lightweight checklist items (Things, MS To Do "Steps") · contextual only.
- **Delegation:** most consumer apps have *no* clean separation between "assigned to Alice" (ownership) and "waiting for Alice" (blocked-on-another). GTD's answer: an explicit **Waiting For** list plus a dated follow-up. RFC 5545 technically supports `ATTENDEE`/`ORGANIZER` + `PERCENT-COMPLETE` replies on VTODO, but almost nobody implements it.

*(Full field-by-field detail and sources in the appendix.)*
