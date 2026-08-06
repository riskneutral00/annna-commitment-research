# Resource setup — the room (admission by type, not just count)

> **Held-out.** annnä was not designed to this. The claim below — that a room is expressible as an **admission rule + capacity** on annnä's existing atoms — is a **prediction to verify**, not a met requirement.

*How an ER room sets up on annnä. There are ten rooms, but their setup is told **once through the type**, because unit-to-unit only the admission rule and the count change. Third-person, what-happens only. **annnä is the app and the agent both.***

## The template

Every room sets up over the same admin-made **room template**. It asks for:
- the room's **admission rule** — *which types of occupant may enter* (trauma only; children only; pre-surgical only; infectious only; any stable adult),
- its **capacity** — how many admissible occupants at once,
- its **availability** — when it's in service (most are 24/7; some, like OR-adjacent Prep, track theatre hours),
- its **acceptance mode** — **Auto**: an admissible case simply appears in the room when annnä places it; no human approves the placement.

The load-bearing field is the **admission rule.** In the other situations a resource's ceiling is a *count* — a pool is "cap 15," a boat is "70 seats." Here the ceiling is a **type-match first, then a count**: a room isn't "cap N," it's "**these kinds**, up to N." This is the first held-out primitive — whether annnä's capacity generalizes from a number to a **type-match**.

## Ten rooms, one shape

Charge Nurse Ramirez adds the floor inside the ER's console; ten rooms, each its own resource, but they read the same template:

- **Trauma 1, Trauma 2** — admit **trauma / resuscitation** cases only; capacity **1** each.
- **OR-adjacent Prep** — admits **pre-surgical** cases only; capacity **2**; availability tracks theatre hours.
- **Peds 1, Peds 2** — admit **children** only; capacity **1** each.
- **Isolation** — admits **infectious / airborne-precaution** cases only; capacity **1**.
- **General Bays A–D** — admit **any stable, non-infectious adult**; capacity **up to 4** each.

The only things that vary unit-to-unit are the **admission rule** and the **count**. A room's rule is what makes it reachable for one case and closed to another arriving the same minute: a feverish child is admissible to Peds but **not** to a General Bay or Trauma; an infectious adult is admissible only to Isolation even when four General Bays sit open.

## What the rule decides

The admission rule is a **gate on type, evaluated before capacity.** A General Bay with three of four beds free still **refuses** an infectious case — not because it's full, but because the case's type fails the rule. Capacity only comes into play *among* admissible cases. Where a case matches **no** available room's rule, there is no placement to make — and that dead-end (hold / escalate) is the honest failure the situations test.

## Set up

The floor now exists as ten rooms under the ER — each carrying a **type-based admission rule**, a capacity, availability, and Auto acceptance. Placement reaches a room only when a case's **type** clears its rule *and* it's under capacity. The full room roster (rules, counts) is in the README.

**Prediction to verify:** that "admits type X, up to N" needs **no new room-specific field** — that it's the same qualification-plus-capacity annnä already uses for a rated instructor on a boat seat, only with the rule doing the gating. If it isn't, the missing general primitive is **type-match admission**; do not add an "ER room" feature.
