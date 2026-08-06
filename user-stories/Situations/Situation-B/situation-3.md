# Situation 3 — the edges, held honestly

*Third-person, what-happens only. The **same fleet and link**, now stress-tested from the outside — one pointed case at a time. Each shows the state machine (`resource-bike.md`) doing its job at a boundary, or the app saying **no** out loud. Split into what **must work** and what **must be refused / handled** — the refusals matter as much as the successes. Who each player is lives in the setup stories and the README cast.*

## Must work

**A hold expires and releases.** A traveller taps a **Click**; the unit drops into a hold, 1-hour clock running. He uploads his passport, then gets distracted and never signs the T&C or places the deposit. At **60 minutes** the hold **expires on its own**: the checklist is incomplete, so the pull confers nothing, and the Click **returns to the link** for anyone to pull. The half-finished uploads don't hold the unit hostage.

**An early return frees from the actual time.** A NMAX due Sunday is dropped back **Saturday 21:00**. Its **6-hour buffer** runs from **Saturday 21:00**, not from the Sunday on the paper; at ~03:00 it re-enters the link. Availability tracks reality, not the schedule.

**A late return is measured from reality too.** The mirror case: a Click due back **Sunday 09:00** rolls in at **19:00**. All day the link simply showed it **unavailable** — availability tracked the bike, not the paper — and its buffer runs from 19:00, when it actually came back. And the extra day doesn't turn into an argument at the counter: the **signed T&C** already names what a late day costs, so annnä **records** the charge against the rental — no fresh consent needed, because the consent *is* the traveller's signature on the document that defines it. (Contrast the scratch below: a damage charge has no pre-signed line, so it stays gated.) The money itself, as always, changes hands outside the app.

**A rule change applies only forward.** Ploy tightens the buffer from **6 hours to 4**. Units already cooling down finish the six they entered with; every return from now on cools for four. The same holds for the hold window and the prices — a live hold keeps its hour, a confirmed rental keeps its rate. Changing the shop's rules re-publishes the link; it never rewrites a rental already made.

**A completed checklist confirms with no human.** A traveller clears passport + license + signed T&C + deposit inside the clock; the hold **confirms itself** (Auto). Ploy approves nothing.

**The big bike, when it's free and the license fits.** A traveller with a **motorcycle-class** IDP taps a **CBR**; the extra license precondition is satisfied, the rest of the checklist clears, and the CBR confirms. Scarcity working *with* the grain when a qualified rider meets a free license-gated unit.

## Must be refused / handled

**A late document must not revive a dead hold.** The distracted traveller from above uploads his deposit **at 65 minutes** — five minutes after his hold expired and, by now, after that Click has been pulled and confirmed by someone else. The late document **does not un-expire** his hold or hand him a bike that's gone. The lapsed hold **stays lapsed**; he's told the unit is no longer his and shown the live fleet to start over.

**A race resolves to exactly one winner.** Two travellers tap the **last free NMAX** within the same second. annnä opens **one** hold on that unit; the second tap does **not** open a second hold on the same bike. The loser isn't left with a phantom half-claim — either a free sibling is offered (a PCX, say), or, if none, an honest "that one's gone."

**A buffered bike can't be pulled.** A Click returned at 21:00 sits in its 6-hour buffer. A traveller who taps it at 23:00 is **refused** — the unit shows unavailable until its buffer is past, and no pull opens a hold on it.

**The big bike, no fallback → honest "no bike available."** Two ways this dead-ends, both returning a plain **no** at submit, not a runaround:
- **Both CBRs are already out** (or in their buffer). They're the only motorcycle-class units, so a rider who needs a big bike has nothing to fall to — told **no bike available** for that class.
- The traveller's license is **car-and-scooter class, not motorcycle-class** (Tom's case). Neither CBR's extra precondition can be met, so both are closed to him regardless of availability; the pull **can't confirm** and he's told plainly — then shown the scooters he *can* take.

**A charge without captured consent is refused.** Tom's returned Click has a **scratch**. Ploy wants to convert part of the deposit to a damage charge. annnä holds no money to seize — the deposit is a record — and it will not even *record* a charge against it on the strength of the represented deposit alone: a charge is an across-the-line act that requires **Tom's own captured consent**. Without a consent artifact tied to this rental, the charge is **refused**; the deposit stays represented, and whatever Ploy and Tom settle happens between them, outside the app.

## The point

The tentative pull is honest at every edge: a hold that expires releases cleanly, a late document can't raise the dead, a race yields exactly one winner, a cooling-down unit stays out of reach, early and late returns alike are measured from when the bike *actually* came back — the late day already priced by the signed T&C — and a rule Ploy changes applies only to pulls made after it. And where the fleet or the rider genuinely can't support the request — both CBRs out, or a license that isn't motorcycle-class — annnä says **no bike available** at submit, immediately, instead of a paper-ledger runaround that ends in the same no. Money is named and tracked but never moved. The app holds the tentative honestly, and it can say no.
