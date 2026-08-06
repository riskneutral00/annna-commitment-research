# The customer — the case

> **Held-out.** A prediction to verify, not a met requirement.

*Off-app in every version of this story — the most off-app customer in the whole user-stories set. A patient doesn't book, doesn't hold a link, doesn't have an account: they **arrive**, and they are **placed.** Told through a handful of arriving cases. Third-person, what-happens only.*

## Who

**The patients** of the ER — cases that arrive by ambulance or walk-in. What matters about each, for annnä, is its **type**, because the type is what a room's admission rule matches against:

- a **child with a high fever** — a *pediatric* case,
- a **trauma from a road accident** — a *trauma / resuscitation* case,
- an **adult with an infectious respiratory illness** — an *infectious* case,
- a **stable adult with chest pain, ruled non-cardiac** — a *general* case,
- a **patient booked for surgery** — a *pre-surgical* case.

## What happens to them (they do nothing)

The patient takes **no action in the app.** They present; a triage assessment assigns a **type**; annnä **places** the case into a room whose admission rule the type clears and that's under capacity — the child to Peds, the trauma to Trauma 1, the infectious case to Isolation, the stable adult to a General Bay. The placement happens *to* them, autonomously, with no human scheduler and no booking step. If the case type matches **no** available room, there is no placement to invent — the case is **held / escalated**, honestly, rather than forced into a room whose rule it fails.

## Their thread

A case arrives, is typed, and appears in an admissible room; if their condition changes (a "stable adult" that turns infectious), their **type changes**, and annnä must re-place them under the new rule. They never see the board, the seniority ordering, a staff bid, or a re-solve triggered by a sick call — only that they are in a room appropriate to their condition, staffed by someone rated to treat them.

**What must never happen:** a case placed into a room whose admission rule its type fails (a child into Trauma, an infectious adult into a General Bay) — the poka-yoke the situations test from the outside. **What must always happen:** an admissible placement, or an honest hold/escalation when none exists — never a forced fit.

*Predictions, not guarantees — this is the held-out ER. Whether "a case is placed by type, never booking anything" falls out of annnä's existing placement primitives is exactly what Situations 3 and 4 are here to check.*
