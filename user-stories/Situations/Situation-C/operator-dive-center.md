# Operator setup — the dive center

*How a dive center sets up on annnä, told through **TingTing** at **Hug Ocean**. An operator is a *taker*: it orchestrates bookings and stands on resources, and where it owns its own resources it adds them through the **same resource forms** a one-of-one fills (`resource-boat.md`, `resource-pool.md`, `resource-gear.md`). Third-person, what-happens only. The generic dive-center template and the agency standards are already there — TingTing uploads neither; she tailors them. **annnä is the app and the agent both.***

## Who

**TingTing**, front desk at **Hug Ocean** (24 Soi Kepsub, Rawai — PADI 5-star). Hug is multi-role: its own boat, pool, and gear, plus its own staff instructors and divemasters.

## Setting up

**Signing up.** TingTing creates her annnä account through the browser — email, password, app language **Thai**; the app runs in that one language throughout.

**Landing.** She lands on the board, all in Thai, empty. In the console she says she wants to add Hug Ocean's business. annnä already has a generic **dive-center template**, made by the admin — the same one every dive center starts from — and the page fills with it, console on top. First it asks to connect what Hug already has; she uploads its booking calendar, spreadsheets, and contacts, and the existing bookings appear as cards.

**What's already there.** The **template** is the generic dive-center scaffold. The **agency standards** are separate supporting documents: Hug runs PADI, so PADI's standards and medical form are loaded (another center might run SSI, or CMAS, or several). From the standards annnä already knows Open Water and Advanced, the dive order and its locks, the hard cap — no more than three training dives a day — and it holds the medical questionnaire as a ready-made form. Everything she tailors sits on the template and is bounded by the standards.

**Hours and size.** She fills in Hug Ocean itself: **opening hours** (desk 08:00–18:00) and **capacity** — how many students the center runs in a single day before it's full. A day at capacity can't take another course, whatever resources are free.

**Designing the courses.** Hug has nothing written down, so she shapes the template rather than authoring from nothing; annnä fills the course in front of her as she talks so she can watch and correct it. She builds **three distinct courses**:
- **Open Water — 3 days.** Day 1 confined in the pool; **Days 2–3 open water at Racha.** Certifies end of Day 3.
- **Advanced — 2 days.** Day 1 Adventure dives at Racha; **last day out at Phi Phi (PP).** Certifies end of Day 2.
- **O+A — 4 days.** Day 1 pool; **Days 2–3 open water at Racha**; Day 4 Advanced finish **at PP.** Certifies twice.

She sets the **routing as a preference, not a rule**: Racha for training, PP for the Advanced finish — honored whenever a boat runs those sites those days, quietly falling to a route-compatible alternative when one doesn't. When she tries to put a **fourth training dive** on any day, the template won't take it — that cap comes from the PADI standards. She confirms each; the three courses are saved and reused unchanged. If she later reshapes one — price, days, routing — the change applies to bookings made from then on; courses already sold **run to completion on the shape they were sold**. Changing the template never rewrites a live booking.

**Adding specialties.** She switches on the **specialties** Hug sells — Deep, Nitrox, Sidemount, Drysuit — each standing on a **specialty-rated instructor** rather than a day-shape. She doesn't assign instructors; she declares which she offers, and annnä matches a rated, available, language-fit instructor at booking time (and reports back honestly when there's no one — Situation 4).

**The resources Hug owns.** Hug owns its own boat, pool, and gear, and annnä adds each with the **exact same form a standalone operator fills** — the difference is only that the result sits under Hug Ocean, first in its own list. The **boat form** (`resource-boat.md`): route, times, capacity, min-pax, on-board air. The **pool form** (`resource-pool.md`): capacity — divers at once, not lanes — and hours. The **gear form** (`resource-gear.md`): inventory by type and size, including mask sizes.

**Its own staff.** Hug also **employs its own instructors and divemasters** — added *under* the center the same way (`resource-instructor.md`), exclusive to Hug, reachable only through its bookings. These cover Hug's own language market (Thai / Chinese / English).

**The resources Hug doesn't own — ranked preferences.** For everything it doesn't own, Hug declares **ranked preference lists** over the market: freelance instructors (ranked by language — for a Mandarin course, its trusted Mandarin fits in order), a backup boat behind its own, a backup gear shop, an air station and its backup. Each fallback is the next name down its list.

**Who the customers are.** She sets Hug's **primary customer languages** — Simplified Chinese, Traditional Chinese, Thai, English — which is what annnä matches an instructor's teaching language against, and which the intake form is offered in. *(A customer outside this set is a candidate to refer out — see `operator-agent.md`.)*

**Rules and prices.** Buffer after each dive before gear frees up, no double-booking, boat min-pax, the medical block; prices in the currencies she takes; expired certs show red. **Money is tracked, never moved:** annnä records what a customer owes and paid, and what Hug owes each freelancer, boat, and supplier — entries on both parties' boards, marked settled when the money changes hands outside the app.

**Adding the rest of the team.** As an administrator she can bring others in under Hug Ocean — another front-desk admin, a boat leader, eventually the owner — each with their own access. *(Left light on purpose.)*

**The customer form.** annnä assembles the intake — contact, passport, the languages they speak, emergency contact, medical questionnaire, waiver, gear sizes, safety info — one form, saved once and reused. She sets the medical rule: any "yes" is a hard stop, no payment until a doctor's note is uploaded and handed in. annnä builds the no-account customer page and freezes it, so every customer gets the identical thing.

**Set up.** Hug Ocean now has its three courses plus specialties, its own boat/pool/gear/staff added through the resource forms, its ranked preference lists for everything else, its hours and capacity, its customer languages, its rules and prices, and a frozen customer form with the medical gate — all tailored from the admin's dive-center template and the PADI standards.

## The booking (walk-in → link sent)

A customer walks in and names a course. TingTing picks it and enters their contact. The saved course, the inventory, and the ranked lists fill the whole assembly at once — instructor matched on the customer's language, boat routed to Racha (and PP for an Advanced finish), pool for a confined day, gear in sizes, air only where a boat can't supply it. The sale is a promise now, provisional underneath until the pieces confirm. annnä generates the intake link, she sends it, it lands in the customer's messages. On a busy day several run at once and draw on the same instructors, boat, and pool — where capacity and the ranked lists do real work.

## In the situations

- **Situation 1 (clean):** several customers, different courses, one week; every first choice available; each assembles and confirms.
- **Situation 2 (current reality):** first choices fall through, so with no coordination layer the desk works a phone tree.
- **Situation 3 (specialty):** annnä matches a rated, language-fit, free instructor and it lands.
- **Situation 4 (specialty, no match):** the one rated instructor is booked; the form returns **no instructor available** — Hug never promises what the market can't supply.
- **Situation 5 (the realistic middle):** only Hug and a few freelancers are on annnä; the app places what it can reach, **prepares and records** the calls to everyone off-app, and turns each call into an invite.
