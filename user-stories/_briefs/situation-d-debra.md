# Brief — Situation-D: Debra (mobile physical therapist)

*Elicited 2026-08-05 via `/probe-elicit`. This probe was requested to pressure-test the **engine** (location, travel time, reshuffle-proposals — see `../../.specs/deep-interview-engine.md`), but it remains a falsification probe, not a design target.*

**Slug note:** `Situation-D` is free — former Person D (the motorbike) became Situation-B; `user-stories/README.md` currently says "there is no Situation-D" and must be updated by the builder.

## World

Debra is a **cash-only physical therapist doing home health care**. She treats patients at two on-site locations she works out of on different days — site A and site B, with a possible future site C — and at patients' homes when they ask her to come. She lives at her own home and drives between all of it. She has no insurance billing (deliberately — a feature of the business) and no staff: she alone finds patients, books them, treats them, collects cash, collects reviews, and hunts for more patients. Her personal life (the whole-life board thesis) runs on the same schedule the business does.

**Protagonist:** Debra. **Single protagonist** — patients are off-app customers (form only); sites A/B are her own standing arrangements (locations, not parties); no independent stakeholder to coordinate. Folder shape like Situation-A.

## Actors

| Actor | Kind | What they supply / do |
|---|---|---|
| Debra | operator-protagonist (also the only resource) | The therapy, the driving, all admin |
| Patients | customers, **off-app** | Book/cancel via her link; some declare constraints (mornings-only, will-not-move); pay cash |
| Sites A / B (future C) | locations (attributes, not stakeholders) | Standing arrangements; each has its days ("Mondays at A, Thursdays at B") |
| Patient homes | locations | Home-visit addresses, inside a service area she sets |

## Rules & their source

All **her own choice** — no agency/standards document governs her (cash-only, no insurance). She declares:
- **Site schedule** — which days she's at A vs B; the booking link only offers the day's site.
- **Home-visit limits** — service area and hours for house calls.
- **Session shapes** — durations, prices (cash), her working windows; personal-life blocks alongside.
- **Travel time** — computed **from addresses by default** (every commitment carries a location); she can **override with declared rules** ("that hill always takes longer", "30 min between homes").
- **Per-patient constraints**, told to the agent in passing and stored: *this one only Tuesday mornings; this one will never move; this one prefers end-of-day.* The optimizer must honor these absolutely.

## The floor (today, no app)

Paper book and phone. Patients call/text; she books from memory of where she'll be that day. A mid-day cancellation means she re-plans the route in her head and texts patients one at a time — "any chance we could do 11 instead of 2?" — phone tag, partial answers, a day that stays full of holes she pays for in driving and dead time. Cash collected or forgotten per visit; reviews chased by hand; every mistake is a back-to-back she can't physically reach or a patient double-promised the same slot.

## Situations to cover

**Must work:**
- **Location-aware self-serve booking** — link offers site-A slots on A-days, site-B on B-days, "home visit" as a request carrying the patient's address; cancellations arrive through the same link.
- **The compaction proposal (the engine probe):** a mid-day cancellation fires the agent: *"Want me to pull the day tighter — toward the morning or toward the evening?"* Debra picks a direction; the agent proposes moves that respect travel times and every stored patient constraint; she approves; **moved patients confirm through the link** (moving a promised time is outward — the floor requires their yes). Same machinery when a new booking lands mid-day: placed where the route stays feasible.
- **Cash marked settled** per visit (tracked, never moved).
- **Whole-life board** — personal blocks, site days, home visits, one board.
- **Business admin as commitments:** "collect review from Mrs. Ito," "flyers for site B" are **her own tasks/events on the board** — annnä has **no** review or marketing features; it just holds the work like any other commitment.

**Must be refused (poka-yoke, from the outside):**
- **Unreachable slot never offered** — the link won't show a slot she can't physically reach from the previous location; refused by construction, not apologized for after.
- **Protected patient never moved** — no compaction proposal ever includes a will-not-move patient or breaks a mornings-only constraint; the agent doesn't even suggest it.
- **Home visit outside her limits** — beyond the service area or outside home-visit hours → honest "no" at submit.
- **Last-slot race** — two patients grab the last opening; exactly one wins, the other gets the honest no.

## Held-out predictions (new-primitive pressure — flag, don't design to)

1. **Location as a first-class commitment attribute**, and the gap between two commitments measured in **travel, not just minutes** — needs an external compute source (maps) behind the engine's `calculate`. New seam pressure.
2. **Per-commitment third-party constraints** (a customer's declared immovability/window) as stored objects the solver must honor — tests whether the fixed rule-type menu covers constraints that belong to a *patient*, not to Debra's policy.
3. **Compaction = reshuffle-proposals** — exactly the engine capability deferred to the revisit (`../../.specs/deep-interview-engine.md`, decisions 2/3/6). This story is its justification and its test.
4. **Direction-parameterized optimization** ("toward morning" / "toward evening" / "inside a window") — an optimization *goal* the owner picks per event, not a standing rule.

## Hand-off

Single protagonist → **`/probe-persona situation-d-debra`** (build the `Situations/Situation-D/` folder: README storybook, Debra's telling + customer.md, floor run, ceiling run, the probe runs above; update `user-stories/README.md` table + its "no Situation-D" note).
