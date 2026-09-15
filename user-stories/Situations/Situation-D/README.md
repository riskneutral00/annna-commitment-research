# Situation Rounds — annnä's location probe (Situation D)

*A set of user stories that stress-test **annnä** against a schedule that moves through space, not just time: **Debra**, a cash-only physical therapist who treats patients at two office locations she works out of on different days, and at patients' homes when they ask her to come. Every commitment on her board carries an **address**, the gap between two commitments is a **drive**, and the thing she wants most from a cancellation is not sympathy but a tighter day — *"pull everyone closer together so the afternoon is mine."* There is no market here: like Sofia, Debra is her own resource **and** her own operator, and her patients are off-app customers who only ever get a link. Read this folder like a **storybook**. By the end, an LLM designing annnä should see, concretely, what location does to the product: slots that are only real if she can physically reach them, reshuffles that are **proposals** patients confirm, and constraints that belong to a *patient* ("he will never move") that the optimizer must honor absolutely. **annnä is the name of both the app and the agent inside it.***

***Why this probe exists:** it was added (2026-08) specifically to pressure-test the **engine** — location as a commitment attribute, computed travel time, and reshuffle-as-proposal (see `../../../.specs/deep-interview-engine.md`). It remains a falsification probe, never a design target: if a run below breaks annnä's primitives, that reveals a missing **general** primitive, and it is flagged as such in the NOTES of `story-debra.md` — nothing here licenses a "physical-therapy feature." **Runs 4–5 are scripted re-homes (FD-106, `../../../RULINGS.md`), not elicited:** four beats moved here from the retired Situation A files and A′ — calendar import, the store install, a prepaid credit, an abandoned draft — and each says so in-file, so the elicited-to-design register stays honest.*

---

## How to read this folder

1. **Meet the protagonist.** `story-debra.md` is Debra's own **first-person** telling — the immersive file, doubling as the setup story: in a solo world the resource and the operator are the same person.
2. **Then the customer.** Her patients are off-app; they only ever get a link: `customer.md`.
3. **Then the situations** — three runs of the same week (`situation-1.md … situation-3.md`), each with a stated purpose, in the standard third-person Situation voice. Two scripted runs follow them (`situation-4.md`, `situation-5.md`, FD-106).

---

## The two kinds of stakeholder (collapsed)

- **Debra is her own resource** — her hands and her hours are the thing supplied, and so is her **position**: where she physically is at 10 a.m. decides what 10:30 can hold.
- **Debra is her own operator** — she publishes her bookable treatment hours, manages bookings, cancellations, and the day's route herself, by talking to the agent.
- **The patients are the customers** — off-app, link only. Some of them carry **their own constraints**, told to Debra once and stored: *mornings only; will never move; prefers end-of-day.*

*There's no agency standard here (no insurer, no PADI): Debra is **cash-only by design** — it's a feature of her business. The rules are all **her own** — her session shapes, her prices, which days she's at which office, how far she'll drive for a house call — bounded only by the truth of her calendar and her map.*

---

## The cast

- **Debra**, 52, physical therapist (`story-debra.md`) — the protagonist; her own resource and operator.
- **Her places:**
  - **The Eastside room (site A)** — a treatment room she rents on a standing arrangement; her **Monday / Wednesday** days.
  - **The Riverside studio (site B)** — same arrangement across town; her **Tuesday / Friday** days. *(A possible site C is in her future; nothing is designed to it.)*
  - **Home** — where she lives and starts every day; **Thursday** is her home-visit round.
- **Her life on the board:** a M/W/F 6:30 swim, lunch, Wednesday-evening book club, Sunday with her mother — commitments nobody books that carve her availability silently.
- **The patients** (customers, off-app, one unique link each):
  - **Mrs. Ito** — 81, hip; office patient at Riverside; **Tuesday mornings only** (her daughter drives her).
  - **Harold** — 67, knee replacement; home-visit patient; **will never move** an appointment once made.
  - **Mrs. Gable** — 76, post-stroke; home-visit patient; flexible, her son handles the link.
  - **Tom** — 44, shoulder; home-visit patient; easy-going, says yes to almost any time.
  - **Priya** — 35, runner's ankle; office patient; books and moves her own sessions constantly.
  - **Nathan** — 58, back; the **new** patient, handed the link by Priya.

---

## The commitments she runs

| Kind | Examples | Who books it | What it does |
|---|---|---|---|
| **Life-commitments** | swim (M/W/F 6:30) · lunch · book club · Sunday with her mother | nobody — hers | **block** availability silently; patients never see them |
| **Office sessions** | "Treatment session" — 45 min, buffer 10, **$90 cash**; offered at **site A on Mon/Wed**, **site B on Tue/Fri** | patients, self-service via link | the link offers **only the day's site**, only genuinely free time |
| **Home visits** | "Home visit" — 60 min, **$140 cash**; **Thursdays**, inside her service area | patients, as a **request** carrying their address | the drive **between** two homes is real time on the board — computed from the addresses, never guessed |
| **Business admin as commitments** | "ask Mrs. Gable's son for a review" · "flyers for the Riverside noticeboard" · "order resistance bands" | nobody — hers | annnä has **no** review or marketing features; finding patients and collecting reviews are simply **her own tasks and events on the board**, held like anything else |

*The money is **tracked, never moved**: every visit writes its $90 or $140 to that patient's thread, and Debra marks it **settled** when the cash is in her hand. No card rails, no insurance — that's the business.*

*Travel is **computed by default, declarable on top**: the agent works out drives from the stored addresses, and Debra's own rules win where she's made one — "the bridge at rush hour is twenty minutes, whatever the map says."*

---

## The situations (the storybook)

Three runs of the **same week**, each to show one thing.

### Situation 1 — the perfect case → `situation-1.md`
**A schedule that knows where she is.** The week books itself through location-aware links — office days offer the right office, Thursday holds a feasible route of home visits — and when Mrs. Gable cancels the middle of Thursday, the agent asks one question: *"pull the day tighter — toward the morning, or toward the evening?"* Debra says morning; the agent proposes a move it has already checked against every drive and every stored patient constraint; Tom confirms through his link; her afternoon comes back to her — and **stays** hers, because whether the freed time re-opens for booking is her call, asked, not assumed. Later, a rebook request lands only on times the route can actually hold. Cash marks settled visit by visit.
**Purpose:** establish the **ceiling** — the board holds places as well as times, and a cancellation becomes reclaimed life instead of a hole.

### Situation 2 — current reality → `situation-2.md`
The **same week by paper book and phone**: booking by memory of where she'll be, a back-to-back she physically can't reach because the book doesn't know about the drive, a cancellation that triggers an afternoon of one-at-a-time "any chance we could do earlier?" texts, and cash collection tracked nowhere but her head.
**Purpose:** show the **problem annnä exists to solve** — a mobile practice run out of a paper book that has no idea the town has distances. The gap between this and Situation 1 is the product.

### Situation 3 — the edges, held honestly → `situation-3.md`
The pointed cases: a slot she **can't physically reach is never offered**; a compaction proposal **never touches Harold** (will-never-move) or breaks Mrs. Ito's Tuesday-mornings-only rule — the agent doesn't even suggest it; a home-visit request from **outside her service area** gets an honest no at submit; a **race** for the last Friday slot yields one winner; a moved appointment is only ever a **proposal until the patient says yes**; and the agent won't message a patient — about a move, a cancellation, or overdue cash — **without Debra's yes**.
**Purpose:** show **the boundaries** — feasibility enforced at the point of booking, patient-owned constraints honored absolutely, and every outward act gated on consent.

### Situation 4 — the fresh start → `situation-4.md` *(scripted, FD-106)*
**Where the board comes from.** On the empty account, the agent offers to bring in what she already keeps; she connects the phone calendar she kept for office days (her paper book stays paper) and her existing sessions land as real commitments — nothing non-calendar comes in. Then, on need, the agent suggests a store template; its ghost preview renders from her real availability and writes nothing; install walks session length, buffer, price and site-days as confirmed proposals; a first booking lands; months later the uninstall leaves every booked session standing; she publishes a shape of her own for other therapists, and "publish my setup" meaning her populated board is refused with the authored-bundle path named. `../../../marketplace/SPEC.md §1.2`'s closed grammar governs any bundle the prose sketches.
**Purpose:** show the **way in** — a fresh account that starts from her own weeks, and the store's whole open-half contract (suggest, preview, install, uninstall, publish, refuse extract) exercised by one practitioner.

### Situation 5 — the paid-ahead visit and the half-built session → `situation-5.md` *(scripted, FD-106)*
A patient who paid for a block of visits ahead cancels one: the amount stays on his thread as a credit in his favour and rides onto the next visit he books, with no refund because no money moved through the app. And a second session type Debra starts authoring and walks away from stays a disabled draft — on no link, holding no slot — until she resumes it, decides against it, and discards it without a trace.
**Purpose:** show **quiet correction** — the record fixes itself around a cancelled prepaid visit, and a half-made thought never becomes a live surprise.

**How the five relate:** 1 ↔ 2 are the same week with-annnä vs. by-hand (the axis is *a board that knows the map vs. a book that doesn't*). 3 stress-tests the seams from the outside (the axis is *honest boundaries*). 4 is the way in before that week (the axis is *starting from what she already has*), and 5 is the board weeks on, correcting itself (the axis is *nothing half-done or already-paid goes wrong quietly*); both are scripted, so they illustrate rather than falsify. Together they bound annnä's job here: hold a schedule that moves through space, offer only what's physically true, optimize only by proposal, and never overstep — toward a patient or past a constraint — on Debra's behalf.

---

## The files

| File | What it is |
|---|---|
| `story-debra.md` | Debra's own first-person telling — setup + sites + home visits + the compaction (immersive) |
| `customer.md` | the off-app patient — Tom (and Mrs. Ito, Harold, Mrs. Gable, Priya, Nathan) |
| `situation-1.md … situation-3.md` | the three runs |
| `situation-4.md` | the fresh start — calendar import and the store install run (scripted, FD-106) |
| `situation-5.md` | the paid-ahead visit's credit and the abandoned draft (scripted, FD-106) |

---

## The wider practice (context)

*Debra is the **mobility** probe: annnä's whole-life thesis (Sofia) plus one new fact — commitments happen **somewhere**, and the somewhere has consequences. Everything a solo mobile professional does — find the patient, book them, treat them, collect the cash, ask for the review, find the next one — runs through one board; the app supplies no marketing and no payments, just the truth of a day that has both a clock and a map. She is drawn as one realistic practitioner; the paper book and phone tag she's replacing are the real status quo of cash-only home-health work.*

---

## Stubs (part of the story, deliberately blank)
- **Site C** — the third location her future may hold. When it arrives, the site-day pattern reconfigures **forward only**: commitments already made keep the place and terms they were made under. Noted as the natural next run.
- **The route beyond one day** — optimization across a *week* (batching one neighborhood's patients onto one Thursday), not just compacting within a day. A bigger ask of the same machinery; deliberately not shown.
- **A second annnä professional** — Debra handshaking with another whole-life user (the mutual-booking probe Situation-A also stubs).
