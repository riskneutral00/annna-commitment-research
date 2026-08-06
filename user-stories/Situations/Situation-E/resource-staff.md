# Resource setup — the staff (qualification, seniority, advance bids)

> **Held-out.** Two of the four held-out primitives live here — **an ordering over principals (seniority)** and **a competitive request that can lose (the bid).** Everything below is a **prediction to verify.**

*How ER staff set up on annnä. One setup story for the type, with the qualification and seniority variation noted. Staff — unlike the dive's customers — are **on annnä**: they mark availability and submit bids. Third-person, what-happens only. **annnä is the app and the agent both.***

## The template

Every staff member sets up over the same admin-made **staff template**. It asks for:
- their **role / qualification** — what they're rated to do (an **Attending** can supervise and be placed independently; a **Resident** is rated for a narrower set; **RN** and **Tech** carry their own scopes), loaded from the institution's credentialing documents, not typed freehand,
- their **availability** — the shifts they can work,
- and it exposes the **time-off bid** surface — the way they ask for scarce future days.

Qualification here is the same shape as an instructor's specialty rating in the dive: a **document-defined scope** that gates what work reaches them. A Resident can't be placed on work their rating excludes, exactly as a Divemaster can't certify — the **credentialing documents** decide it, not a hardcode.

## Seniority — an ordering over people

The institution sets **seniority** as an **explicit ordering over all staff** (by hire date / rank / a policy the director authors). It isn't a property of any one shift or room — it's a **ranking of the principals themselves**, and it exists to break ties. This is the third held-out primitive: whether annnä can carry an **ordering over people** without baking it into the ER domain.

## The bid — a request that can lose

Staff request scarce future time off by **bidding 1–2 years ahead.** A bid is deliberately unlike a booking:
- it **consumes nothing yet** — no room, no shift is held when it's placed,
- it is **competitive** — several staff may bid the same holiday week, which is more demand than the floor's minimum staffing can grant,
- it is **resolved by policy** — seniority first, then quota (no one wins every year),
- and it **can lose** — the normal, expected outcome for a losing bid is a **system-issued decline with a reason** ("granted to a more senior bidder; you're first in line next cycle"), not an error.

A staff member submits a bid the way a customer elsewhere submits a request — but the object's whole life is different: **pending → won (becomes time off) or lost (a recorded decline).** This is the second held-out primitive.

## Set up

Staff now exist on annnä as boards carrying a **document-defined qualification**, an **availability**, a place in the institution's **seniority ordering**, and an open **bid** surface for future time off. Work reaches a staff member only within their qualification; ties among them resolve by seniority; and a future-time-off bid is a request that competes and may be declined.

**Predictions to verify:**
- **Ordering over principals** — that seniority is expressible as annnä's existing ordering primitive applied to *people*, not a new "seniority" feature. If not, that's the missing general primitive.
- **Competitive losing request** — that a bid is a request whose resolution can be a **decline-with-reason**, using annnä's existing request/decline machinery. If a request can only ever succeed or be manually cancelled — never *lose a contest* — the missing primitive is the **competitive request**; do not add an "ER bidding" feature.
