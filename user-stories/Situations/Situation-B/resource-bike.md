# Resource setup — the motorbike

*How the resource sets up on annnä. There is one resource type here — the motorbike — and its setup is told **once through the fleet**, because unit-to-unit the setup is identical; the only thing that varies is the model and, for one unit, an extra license class. The fleet is owned by Sunbird Motorbikes, so it's added *inside* Ploy's console (`operator-shop.md`) using this same bike form — the way Hug Ocean adds its own boat in the dive. Third-person, what-happens only. **annnä is the app and the agent both.***

## The template

Every unit sets up over the same admin-made **rental-unit template**. It asks for:
- the unit's **model and plate** (Honda Click 125i, plate 1 of 14; and so on),
- its **hold window** — how long a tentative pull lives before it dies (Sunbird: **1 hour**),
- its **buffer** — how long a returned unit is unrentable, measured from the **actual** return (Sunbird: **6 hours**),
- its **preconditions to confirm** — the checklist a hold must complete to become a rental: **passport uploaded, driver's license uploaded, terms & conditions signed, deposit down**,
- its **acceptance mode** — **Auto**: no owner review; the checklist *is* the gate, so a completed hold confirms itself,
- **photos** — the traveller sees the actual unit on the public link.

The hold window, the buffer, and the checklist are **authored on the unit**, not global app behavior — Sunbird picked 1 hour and 6 hours; another shop would pick its own.

## The fleet — one shape, forty units

Ploy adds the fleet inside Sunbird's console; each unit is its own resource, but the forty of them read the same template — only the model, and for the big bikes an extra license class, differ:

- **The automatic scooters (38).** Honda Click 125i ×14 and Honda Click 160 ×6 (the workhorse — there's almost always a free one), Honda ADV 160 ×5, Honda PCX 160 ×3, Honda ADV 350 ×3, Honda Forza 350 ×3, Yamaha NMAX 155 ×2, Honda Scoopy ×2. Same template, same 1-hour hold, same 6-hour buffer, same four preconditions, all on Auto. Because most models have **more than one unit**, a hold or a buffer on one leaves siblings; the fleet is a market of siblings — cancellations cascade *within* a model, then across models. Contention actually bites only on the **scarce** models (NMAX, Scoopy — two each), where the last free unit is a real prize. *(The maxis — ADV 350, Forza 350 — are big and powerful but still **automatic**, so no motorcycle-class gate; just a heavier deposit.)*
- **The CBRs (2) — the license-gated pair.** Honda CBR500R ×2, the only **manual sport bikes** in the fleet. Same template, plus **one extra precondition**: the license upload must be **motorcycle-class** (an IDP with the motorcycle endorsement), which comes not from Sunbird's own documents but from the **legal standard** Ploy loaded. There are only two, and they're the only units most renters *can't* legally take — so this small, gated class is where the honest **"no"** lives: both out, or a license that isn't motorcycle-class, and there's nothing to fall to.

## What the documents decide

Two of the four preconditions come from **Sunbird's own uploaded documents** — the **terms & conditions** the traveller signs, and the **deposit policy** that sets the amount. One comes from **outside law** — a valid license, and the **motorcycle class** on it for the CBRs. The deposit is **represented** as a committed amount on the checklist; annnä never moves money — it tracks it. Even *recording* a damage charge against the deposit later is an across-the-line act gated by the traveller's own captured consent, and the money itself only ever changes hands outside the app.

## The buffer, measured from reality

A returned unit enters its 6-hour buffer from the **moment it actually comes back**, not from the scheduled return. A Click due Sunday morning but dropped back **Saturday night** frees (after 6 hours) from **Saturday night** — the early return is representable, and the freed sibling becomes pullable again on the link.

## Set up

The fleet now exists as forty units under Sunbird — each with a 1-hour hold window, a 6-hour buffer from actual return, a four-item precondition checklist (motorcycle-class license added for the two CBRs), Auto acceptance, and photos. A pull on any unit opens a hold that blocks only that unit; a completed checklist confirms it; a return starts its buffer. The full roster (models, unit counts, first-choice vs. fallback ordering, the license-gated CBRs) is in the README.
