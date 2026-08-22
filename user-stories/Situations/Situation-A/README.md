# Situation Life — annnä's whole-life probe (Situation A)

*A set of user stories that stress-test **annnä** against the shape the whole lock-in thesis rests on: **one person's entire life on one board.** Sofia is a freelance language teacher who runs her meals, runs, yoga, cycle, and her bookable teaching hours in a single place she talks to — and lets her students book the teaching slice around a life they never see. There is no market here and no other business; the protagonist is her own resource **and** her own operator, and most of her board is her own life, not something anyone books. Read this folder like a **storybook**. By the end, an LLM designing annnä should see, concretely, what the product must do: how a single person sets their whole life down by talking, what the scattered-apps world costs today, and where annnä's availability-blocking, self-service booking, and "I won't act for you without asking" have to show up. **annnä is the name of both the app and the agent inside it.***

---

## How to read this folder

1. **Meet the protagonist.** `story-sofia.md` is Sofia's own **first-person** telling — the one immersive file, because a whole-life workflow is best felt from inside it. It doubles as the **setup story**: in a solo world the resource and the operator are the same person.
2. **Then the customer.** Her students are off-app; they only ever get a link: `customer.md`.
3. **Then the situations** — three runs of the same week (`situation-1.md … situation-3.md`) plus two later additions (`situation-4.md`, the correction run; `situation-5.md`, months later — both scripted, 2026-08-22), each with a stated purpose, in the standard third-person Situation voice.

*(Sofia's board is mostly her own life — meals, runs, yoga, cycle. Only the **teaching slice** faces outward, and that's the only part a "customer" ever touches.)*

---

## The two kinds of stakeholder (collapsed)

In the dive (Situation C) resources and operators are different businesses. Here they **collapse into one person**:

- **Sofia is her own resource** — her time is the thing being supplied. Her life-commitments (meals, runs, yoga, strength, cycle) sit on the board and **block** her availability without ever revealing themselves.
- **Sofia is her own operator** — she publishes her bookable teaching hours and manages the bookings, cancellations, and reshuffles herself, by talking to the agent.
- **The students are the customers** — off-app, form/link only, each reachable through the app they already use.

*There's no agency standard here (no PADI). The "rules" are **Sofia's own** — her lesson's min/max duration, her buffers, which days she teaches, and her price: **NT$1,000 a month base + NT$100 an hour, capped at 10 hours per student per month** — declared by talking, and bounded only by the truth of her own calendar: students are offered **only genuinely free time.***

---

## The cast

- **Sofia**, 34, freelance Spanish/English teacher (`story-sofia.md`) — the protagonist; her own resource and operator.
- **Her life on the board:** breakfast/lunch/dinner (daily-ish), a M/W/F morning run (with a 10-before/15-after buffer), Tue/Thu evening yoga, Saturday strength, and her cycle (imported from **Flow**). These are commitments she keeps with herself; nobody books them, but they carve her availability.
- **The students** (customers, off-app, one unique link each):
  - **Bobby** — English, reachable on **WeChat**; the recurring student (a standing weekly thing).
  - **Millie** — Spanish, reachable on **Messenger**; moves her own lessons herself.
  - **Brownie** — in-person, reachable by **text**.

---

## The commitments she runs (the "courses" analog)

Where the dive center authors three courses, Sofia declares two kinds of commitment — and the interplay between them is the whole point:

| Kind | Examples | Who books it | What it does |
|---|---|---|---|
| **Life-commitments** | meals · run (buffer 10/15) · yoga · strength · cycle | nobody — hers | **block** availability silently; students never see them |
| **Bookable teaching** | "Spanish / English lesson" — min 30 / max 120 min, buffer 5/5, set hours Tue–Thu 2–6pm & Mon/Wed 6–9pm, online or in-person; **NT$1,000/mo base + NT$100/h, max 10 h/student/mo** | students, self-service via link | offers **only** time her life leaves free |

*The teaching template is **generate-once-then-freeze**: she sets it by talking, and every student gets the identical bookable view — a calendar that shows *when she's free*, never *why she isn't*.*

*The money is **tracked, never moved** (the folder-wide rule): each month a student's thread writes its own ledger — the base entry, plus NT$100 × the hours they book — and Sofia marks entries paid when the money reaches her outside the app. The base runs month to month for each **enrolled** student and stops when either side ends the enrollment — ending it retires the student's link, ends any standing series, and closes the ledger with whatever credit is left noted for them to settle outside. The **10-hour monthly allowance** is enforced at the picker like the 30-minute minimum, and it's a shape worth flagging: a **quota over a recurring window, per person** — a general-primitive candidate (the same counting that fills a boat's seats, but scoped to one student and one month), noted here, not designed to.*

---

## The situations (the storybook)

Three runs of the **same week**, each to show one thing — then two scripted extensions (the correction run, and months later).

### Situation 1 — the perfect case → `situation-1.md`
**Everything on one board, and it just runs.** Sofia's life is set down once by talking; her teaching hours publish; Bobby, Millie, and Brownie each book through their own link into time she's genuinely free; the bookings land pre-labelled on her board beside her runs and meals; a race for one slot resolves silently; and each student's monthly ledger (base + hours) writes itself, marked paid when the money reaches her outside the app. **She copies nothing and answers no messages.**
**Purpose:** establish the **ceiling** — one place that holds a whole life and its work, coordinating the outward slice on its own.

### Situation 2 — current reality → `situation-2.md`
The **same week across scattered apps**, the way she lived before annnä: a nutrition app, Flow, a notes file, and a separate student calendar that don't talk to each other. She hand-copies between them, plays message tag to schedule a lesson, double-books herself over a run because the calendar didn't know it was there — and the money (who's paid the base, who's used how many hours) is a fifth truth living only in her head.
**Purpose:** show the **problem annnä exists to solve** — a life spread across tools with no shared truth. The gap between this and Situation 1 is the product.

### Situation 3 — the edges, held honestly → `situation-3.md`
The pointed cases: a life-commitment (the buffered run) **blocks** a booking a student tries to make; the **min-duration** floor refuses a 5-minute grab; a **race** for one slot yields one winner; a student **moves her own** lesson with no approval asked of Sofia; a cancelled lesson **credits** its money and hours back; a **rate change** applies only forward, never to booked lessons; *"cancel Bobby's Wednesday"* makes the agent ask — **this one, or the series?**; a student at the **10-hour cap** can't book an eleventh; a **no-show** becomes Sofia's rule to make — asked once, stored; and Sofia cancels a standing lesson but the agent **won't message a real person on her behalf without asking first** — not about a lesson, and not about an unpaid bill.
**Purpose:** show **the boundaries** — availability told truthfully, the customer's own power over their own time, and annnä's refusal to take an across-the-line action (messaging a person) without consent.

### Situation 4 — the week she got it wrong → `situation-4.md` *(scripted, 2026-08-22)*
The missing half of the gold reference: **what talking to annnä feels like when someone is wrong.** A plausible-but-wrong normalization dies at the read-back (only Sofia could know "half past six" meant morning); a rule edit shows the live bookings it strands *before* applying and still won't message Millie without a yes; a half-built group class abandons into a harmless disabled draft and resumes — or discards — cleanly.
**Purpose:** exercise the **correction path** — the attended read-back as the real check on a valid-but-wrong proposal, downstream impact surfaced before a rule edit, and save/resume/abandon as law.

### Situation 5 — months later → `situation-5.md` *(scripted, 2026-08-22)*
The only run with **time-depth**: the month rolls over (base fees rewrite, allowances reset, last month closes), Bobby's standing Wednesday reaches week twenty and survives a rate change by the recorded law — surfacing one honest open question about a not-yet-materialized instance's terms — and a genuinely dense Tuesday finally tests the peace promise: the board **at rest**, waking only where one true thing just happened, with March still answerable behind it.
**Purpose:** probe **a board with a history** — recurring money and quotas over real months, a long-lived series, and the wake policy against actual density instead of a one-week board.

**How the five relate:** 1 ↔ 2 are the same week with-annnä vs. across-scattered-apps (the axis is *one board vs. many*). 3 stress-tests the seams from the outside (the axis is *honest boundaries*). 4 stress-tests the **conversation itself** (the axis is *correctability*). 5 stretches the same board across **months** (the axis is *time*). Together they bound annnä's job here: hold a whole life in one place, publish only its free edges, let the other party own their own slot, stay correctable out loud, keep its promises across month boundaries, and never act *as* Sofia toward a real person without her say-so.

---

## The files

| File | What it is |
|---|---|
| `story-sofia.md` | Sofia's own first-person telling — setup + life + teaching + managing bookings (immersive; the gold-reference) |
| `customer.md` | the off-app student — Bobby (and Millie, Brownie) |
| `situation-1.md … situation-3.md` | the three original runs (elicited-blind) |
| `situation-4.md` · `situation-5.md` | the correction run and the months-later run (scripted, 2026-08-22 — marked in-file) |

---

## The wider life (context)

*Sofia is the **personal-life** persona the whole lock-in thesis rests on: annnä's ambition is a person's *entire* life — meals, workouts, cycle, work — in one place they talk to, so that leaving means giving up the one board that finally holds all of it. Everything commercial (the dive, the rental) is downstream of this: the same primitives that book a scarce instructor also block a booking behind a morning run. Sofia is drawn as one realistic freelancer; the apps she's replacing (a nutrition tracker, **Flow**, a notes file, a booking calendar) are the real, scattered status quo.*

---

## Stubs (part of the story, deliberately blank)
- **A second whole-life user booking the first** — two annnä users handshaking (the original "Person A" two-user idea, before Sofia absorbed it). Noted as the natural next probe if this graduates toward mutual booking.
- **The cycle doing real work** — a life-commitment (imported from Flow) actively shaping suggestions, not just sitting on the board.
