# Operator setup — the ER institution (authoring annnä's autonomy envelope)

> **Held-out.** The whole premise — that annnä **replaces the human scheduler and runs the board unattended** within an authored envelope — is a **prediction to verify**, not a met requirement.

*How the institution sets up on annnä. Unlike the dive center (a person working the phones) or the rental shop (publishing a link), the ER operator's job is to **author the rules annnä runs inside** and then step back. Told through **Charge Nurse Ramirez** (day-to-day rules) under **Dr. Adeyemi** (medical director, who signs the autonomy policy). Third-person, what-happens only. **annnä is the app and the agent both.***

## Who

**The ER** of a hospital. Today a **full-time human scheduler** controls every in and out — placement, the bid book, live coverage. The institution is standing that scheduler down and setting annnä to do it automatically, with a human on call only for the edges.

## Setting up

**The resources first.** Ramirez adds the floor and the people through the same resource forms a standalone would fill: the ten rooms with their **type-based admission rules** and capacities (`resource-room.md`), and the staff with their **document-defined qualifications**, availability, and place in the **seniority ordering** (`resource-staff.md`). The credentialing documents and staffing minimums are loaded as the standards, the way PADI standards load in the dive — annnä reads qualifications and floor-minimums from them, not from Ramirez's memory.

**The autonomy envelope.** This is the operator's real work here. Dr. Adeyemi and Ramirez author what annnä may do **on its own**:
- **Autonomous placement** — annnä may place a **routine, admissible** case into any room whose admission rule it clears and that's under capacity, with **no human in the loop**. Routine is defined in the envelope (e.g. stable adults, standard peds); anything outside it is flagged for a human.
- **Bid resolution policy** — future time-off bids resolve by **seniority, then quota**; annnä issues wins and **declines-with-reason** automatically each cycle.
- **Live re-solve authority** — on a disruption (a sick call), annnä may **re-optimize the live board**, including moving commitments **already in progress**, within named limits.
- **Escalation / parking rules** — the boundary of annnä's authority: what it must **never** do unattended (any across-the-line action without standing authorization), and what to do when it hits something **unsolvable or unauthorized** — **park and surface to a named human**, never guess.

**Acceptance is autonomous.** annnä doesn't queue placements for approval; inside the envelope it **acts**, and outside it, it **parks**. The human's role inverts from *doing the scheduling* to *being escalated to when the schedule can't be solved safely*.

**Set up.** The ER now has its ten rooms and its staff on annnä, its credentialing and staffing standards loaded, and — the operator's distinctive contribution — an **authored autonomy envelope**: what annnä places on its own, how it resolves bids, how far it may re-solve live, and exactly where it must stop and page a person.

## The board running (unattended)

Cases arrive; annnä places each admissible routine case into a fitting room automatically and builds the floor's state as it goes. Bids submitted a year ago resolve on schedule by seniority. When a nurse calls in sick, annnä re-solves the live board to cover the cascade. Through all of it no human is scheduling — until annnä reaches the edge of its envelope, where it **parks and surfaces** to Ramirez or the on-call director rather than act on a guess.

## In the situations

- **Situation 1 (predicted ceiling):** a shift where placement, a bid resolution, and a live re-solve all happen with no human scheduling.
- **Situation 2 (current reality):** the human scheduler does all three by hand — whiteboard, bid spreadsheet, 3 a.m. phone tree.
- **Situation 3 (mechanisms):** each primitive verified working on its own.
- **Situation 4 (refusals + safe park):** wrong-type placement refused, a bid contest producing one clean decline, and — the key prediction — annnä **parking** when a live re-solve would need an unauthorized across-the-line action with no reachable human.

**Prediction to verify:** that "run unattended within an envelope, park at the edge" is annnä's existing **authorization floor + escalation** applied at institutional scale — not a new "autopilot" feature. If annnä can't run autonomously *and* stop safely at the limit of its authority, the missing general primitives are **autonomous action within an authored envelope** and **park-don't-guess escalation**; do not add an "ER scheduler" mode.
