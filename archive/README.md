# archive/ — the original research and design history

> ⚠️ **This folder is history, not the build plan.** It records how annnä's design was reached — the founding research, the decision records, and two rounds of adversarial critique. Where anything here conflicts with a layer package (`harness/`, `engine/`, `app/`, `model/`), **the layer's `SPEC.md` wins.** If you are looking for what annnä *is* or what to build, start at the [root README](../README.md).
>
> The one thing here that is still load-bearing is the research result below — the commitment primitive everything else is built on.
>
> **Editorial note:** a small number of lines in `05` and `06` were reworded before this repo was published — commercially sensitive framing, not decisions. The decisions themselves are unchanged. The earlier wording was never published and is not recoverable from this repo's history.

*Research commissioned 2026-08-03. Question: what is a "commitment," really — from contracts to promises to love to betrayal to calendar events and to-do tasks? What defines an event vs a task? What are the required and common-optional fields? Is the event/task split even adequate?*

Four parallel research streams (philosophy/relational, contract/legal, calendar data models, task data models) were run blind to each other. **They converged.** That convergence is the main result.

---

## The headline

**A commitment is not the thing itself — it is a normative wrapper around future-directed content.** "Event" and "task" describe only *one* field of that wrapper (the temporal/content shape). The event/task split is **inadequate** as a top-level taxonomy — but the fix is *not* more types. The fix is: **one Commitment object with orthogonal axes, where "event" and "task" are derived presets.**

Both research halves reached this independently:
- **Philosophy/law:** commitment = ⟨committer, beneficiary, content, temporal, conditions, executor, arity/quorum, consequence, discharge⟩. Event/task only characterizes *content+temporal*.
- **Calendar/task specs:** RFC 5545's VEVENT and VTODO share almost every property; they differ only on `DTEND` (a booked slot) vs `DUE` (a deadline) and on having a `STATUS`/`PERCENT-COMPLETE` progress state. The moment a task gets a fixed start + duration, it *is* an event.

## The design decision this produced

The user and agent only ever create a **Commitment**. Nobody picks "event" or "task." The agent captures axis values from plain speech; the classification is **derived, not entered**:

- fixed start, occupies a slot → renders as an **event**
- deadline, or no time → renders as a **task**
- start + duration + a done-state → the blur case; just a Commitment with both axes set

"Event"/"task" are read-only inferred labels. The user can't miscategorize because they never categorize.

## The required-field answer (what blocks "submit")

- **Every commitment:** a **title** only. (Identity/timestamp are auto-generated — never asked.)
- **+ if fixed-slot (event):** a **start anchor** (real-world APIs also force an end/duration).
- **+ if task:** nothing beyond title — the deadline is optional; it may float.

This validates the original instinct: **event = title + when-anchor; task = title. The deadline is the hinge.**

---

## Index

**The original research (2026-08-03)** — the four blind streams and what they converged on:

- [`01-commitment-anatomy.md`](01-commitment-anatomy.md) — the philosophical & legal structure of a commitment (streams 1 & 2)
- [`02-data-models-event-vs-task.md`](02-data-models-event-vs-task.md) — RFC 5545, Google/Outlook, Todoist/Things/OmniFocus/GTD: required vs optional fields, and the event↔task blur (streams 3 & 4)
- [`03-model-fields-and-board.md`](03-model-fields-and-board.md) — the proposed one-object / N-axis model, the full field catalog, and how each temporal mode renders on the board
- [`appendix-raw-research.md`](appendix-raw-research.md) — the four research streams verbatim, with all source citations

**The design interview and its decision records:**

- [`04-use-cases-and-board-model.md`](04-use-cases-and-board-model.md) — domain capture: raw use-case detail and the model it implies
- [`05-post-critique-decisions.md`](05-post-critique-decisions.md) — the strategic forks settled after round one
- [`06-round-two-decisions.md`](06-round-two-decisions.md) — harness decisions after round two; **replaced the lifecycle statuses** in `DESIGN.md` with latched, attributed events
- [`07-elicitation-mechanism.md`](07-elicitation-mechanism.md) — the ask-once-apply-forever machinery
- [`DESIGN.md`](DESIGN.md) — the original living design doc. **Superseded** — read for reasoning, never for the current model.

*The FR/FD ruling registry used to sit here as `08-founder-rulings-2026-08-06.md`. It moved to [`../RULINGS.md`](../RULINGS.md) on 2026-08-08 — it is current and actively edited, and nothing current belongs in a folder that is history.*

**The two adversarial critiques** — annnä's design was attacked twice on purpose, and the findings were worked through rather than filed away:

- [`CRITIQUE-BRIEF.md`](CRITIQUE-BRIEF.md) / [`CRITIQUE-FINDINGS.md`](CRITIQUE-FINDINGS.md) — round one: 45 findings raised, 4 killed, 40 survived. The survivors were answered in `05`.
- [`CRITIQUE-BRIEF-2.md`](CRITIQUE-BRIEF-2.md) / [`CRITIQUE-FINDINGS-2.md`](CRITIQUE-FINDINGS-2.md) — round two, against the revision: 48 raised, 26 killed, 22 survived. Those were answered in `06` and `07`.

> **Reading the critiques fairly:** they are deliberately harsh — that was their job — and they are *pre-resolution* documents. Round one's verdict ("§2 and §13 describe two different products") was the input to the round of work recorded in `05`, `06`, and `07`, and ultimately to the four layer packages. Judge the current design by [`harness/`](../harness/), [`engine/`](../engine/), [`app/`](../app/), and [`model/`](../model/) — not by the critique that prompted them.
