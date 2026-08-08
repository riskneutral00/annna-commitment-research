# annnä

**A conversational agent that replaces the calendar.** A schedule today is a load you carry in your head and a grid you maintain by hand. With annnä you talk — *"book an open-water course for these three days," "leave 5 minutes between lessons"* — and the agent creates, governs, and reconciles your commitments for you. The aim, stated plainly: **a schedule that feels like there is nothing on it** — because the coordination work leaves, and then the head no longer has to be where the schedule is kept.

> ### 📋 This repository is a design specification, not a working application.
> Almost all of it is specification — **130 markdown files** covering the research, the architecture, the user stories, the test strategy, and the public-facing identity. The build has begun and is early: `engine/` and `harness/` each hold a Step-0 TypeScript scaffold with its test suite, and small Node scripts run the process gates (`deployment/scripts/`) and the admin asset pipeline (`assets/make-pack.mjs`). The point of this package is that it's complete enough to build *from*.

---

## Start here: one week, run twice

The fastest way to see what annnä is for is to watch one busy week at a small Phuket dive center — first the way the industry runs it today, then the way annnä runs it. Same week, same four customers, same shortages, same suppliers falling through. This is [Situation C](user-stories/Situations/Situation-C/), the hardest of the five.

**Hug Ocean. One week, four bookings, three different courses.** A Mandarin Open Water + Advanced. An English Open Water for a group of three friends. A Mandarin Advanced finishing at Phi Phi. A German Advanced. They all want the same instructors, the same pool, the same rental gear and the same single house boat — which is already carrying a 40-person dive club that week.

TingTing works the front desk. Here is her week, both ways:

| What the week needs | What happens today | What annnä does instead |
|---|---|---|
| **A second Mandarin instructor** (the shop's only one is already teaching) | Works the freelancer list by phone: first choice is on a boat with no signal, second is booked and declines, third says yes. **Three calls.** | Checks the shop's own staff first, sees the clash, places the top free reachable freelancer. He opens his board, sees the whole job, taps accept. |
| **An English instructor + a divemaster** for the group of three | Own instructor is free — no calls. Own divemaster is on another course; first freelance DM is booked, second takes it. **Two calls.** | Both placed together in the same pass — own instructor, own divemaster. |
| **A German course the shop cannot teach at all** | Phones around German-speaking shops until one agrees to take the customer off her hands. | Routes the customer silently through the agent to a center that actually employs a German instructor. The customer never sees the hand-off. |
| **A pool for day one** | Own pool is down — pump service ran long. First overflow pool holds 6, too tight. Second holds 25. **Two calls.** | Own pool is free and its capacity is checked against the four divers who'll be in the water. Held automatically. |
| **Gear in each diver's sizes** | Own stock is short a size because the club trip drew it down. First shop has no mask that size. Second does. **Two calls.** | Each set is packed from the sizes the diver typed into their own form, tagged once, and held for the whole course. |
| **Tanks for the pool day** | Own compressor is tied up filling the club's forty tanks. First supplier isn't filling this week. Second is. **Two calls.** | The house boat carries its own compressor, so only the pool day needs an outside fill — and that's placed with everything else. |
| **Boat seats** — the house boat is oversold | She finds out **the morning of**. Nothing had told her the seats were gone. She charters a second boat by phone before 08:00. | The seat cap is visible weeks out. The three divers who don't fit are placed on a route-compatible backup, silently. |
| **A second dive site** — one boat can't be at Racha *and* Phi Phi | Same morning scramble: a third boat, found by phone, to carry one diver's Advanced finish. | A boat already running Phi Phi that day is engaged automatically. Two boats reached past for two *different* reasons — no seats, and no route. |
| **A diver falls behind; his instructor gets sick** | The old instructor briefs her replacement **by phone, from home** — which skills were done, which dives are logged — because nothing was written anywhere both could see. A fifth day is then re-booked across boat, gear and instructor, and the manifests are rewritten three times. | Every skill ticked and every dive logged as it happened, on a board both instructors can open. The record *is* the handover. |

**Today: close to two dozen phone calls**, a second boat chartered the morning of, a fifth day booked and re-booked, manifests rewritten three times, a mask chased across town.

**With annnä: not one phone call between any of them.** The whole week is placed in a single pass against every instructor, boat, pool, tank and gear set at once — and placed *weeks ahead*, because the clashes that surface at 07:00 on the morning of were visible the day the booking was taken.

> **One row waits.** Handing a customer to a shop annnä has no relationship with — the German course — is a **referral**, and referrals come after the first version. Everything else here is in it, including reaching people at *other* businesses: anyone already on annnä is reachable, which is what makes "no phone calls" true for the instructors, the boats, the pool and the gear. What waits is the reach to **strangers**, because passing someone's details to a business nobody has an agreement with is a legal question before it is an engineering one.

### What that looks like for each person in the week

| | What they do |
|---|---|
| **The customer** | Taps one link, fills a form in their own language, uploads a doctor's note if the medical questionnaire flags one — and never touches the app again until the course is over. Their logbook is already filled in when they make an account. |
| **The front desk** | States intent. Picks the course the walk-in asks for, enters a contact. That's the job. |
| **The freelance instructor / divemaster** | Sees one job on their board — course, days, times, diver, boat, gear — and taps accept. No negotiation thread. |
| **The boat, the pool, the gear shop, the fill station** | Get a real booking with the numbers already checked against their own capacity, instead of a phone call asking whether they *might* have room. |
| **The shop that can't serve the customer** | Refers out silently, keeps the relationship, and doesn't lose the morning to it. *(Post-v1 — see the note above.)* |

The important part is the *rule*, not the outcome: annnä used Hug's **own** resources first every time, and only reached past them when its own genuinely couldn't cover — and no other shop can pull Hug's staff away, because own staff are internal by construction. That priority isn't a special case written for dive shops. It's the general primitive the whole system is built on.

> Read the two runs in full: **[the clean run](user-stories/Situations/Situation-C/situation-1.md)** and **[current reality](user-stories/Situations/Situation-C/situation-2.md)**. Neither was written to flatter the product — see [falsification probes](#what-it-looks-like-in-use) below.

---

## Where this started

This repo began as a research question, not a product idea:

> **What is a "commitment," really?** From contracts to promises to love to betrayal to calendar events and to-do tasks. What defines an event vs. a task? Is that split even adequate?

Four research streams — philosophy, contract law, calendar data models, task data models — ran **blind to each other**, and converged on the same answer:

**A commitment is not the thing itself. It is a normative wrapper around future-directed content.** "Event" and "task" describe only *one field* of that wrapper. The event/task split is inadequate as a taxonomy — but the fix isn't more types, it's fewer:

**One `Commitment` object with orthogonal axes, where "event" and "task" are derived presets.** Nobody ever picks a type. The agent captures the axes from plain speech; the classification falls out.

That result is the foundation everything else in this repo is built on. The full research is in [`archive/`](archive/).

The same instrument was then turned on the corpus itself, and it is the one method here that would hold for anyone building anything:

- **Building the same corpus twice, independently, and diffing the two.** Where two
  isolated attempts converge, the design was forced by the problem; where they diverge,
  someone made a choice and didn't notice they were making it. That diff is a sharper
  instrument than any review, because it needs no reviewer to be right about anything.

---

## What the product does

annnä aims to be the **single home for everything a person or business schedules** — not just meetings, but meals, workouts, cycles, rentals, courses, shifts — all as **one primitive, the commitment, on one board.**

It assumes it eventually holds your *complete* schedule. That completeness is the whole bet: it's what lets the system reason correctly about your time, and it's what makes it hard to leave.

### Three things make it more than a chat-driven calendar

**1. It's rule-governed.**
It can enforce a real standard — a certifying body's course rules, a shop's SOPs — so a business runs *to standard*, not merely on time. The rules are enforced by deterministic code, not by an AI's judgment.

**2. It does the tedious multi-party work.**
After a sale, it assembles the people and resources the commitment needs — chasing availability, collecting documents, confirming with everyone — so the human only has to state intent.

**3. The AI is owner-side only.**
You talk to an agent. The people you transact with — a student booking a lesson, a renter uploading a passport — get **ordinary web forms** your agent produces. They never see your board, never make an account, never meet a chatbot. Privacy-first by construction.

---

## What it looks like in use

### First, how you talk to it

Sofia is a freelance language teacher ([`Situation-A`](user-stories/Situations/Situation-A/)). She builds her board by saying things:

> **Sofia:** I eat breakfast at 8:00.

A form comes up **already partly filled** — title, start time. She sets the end, clicks a **Daily** box, unticks Saturday. Confirms. Breakfast is on the board.

> **Sofia:** I run Monday, Wednesday and Friday at 6 in the morning, about 45 minutes.

Because she said 45 minutes, the end time is already 6:45. This time she uses the **buffer** field — 10 minutes before, 15 after:

> *"So although my run is 6:00–6:45, I'm actually unavailable 5:50–7:00 — and I don't have to say why."*

That last clause is the whole design. Her students get a link showing her bookable teaching hours. They never see the run, the yoga, the cycle she imported — only that she isn't free. **Her private life silently blocks availability without ever being visible.**

### Then, what it does that a calendar can't

Debra is a mobile physical therapist working two office sites plus Thursday home visits ([`Situation-D`](user-stories/Situations/Situation-D/)). Months earlier she told the agent three things in passing, the way you'd tell a receptionist:

> **Debra:** Mrs. Ito can only come Tuesday mornings — her daughter drives her.
> **Debra:** Harold never moves. Once his appointment is made, that's it — don't ever ask him.
> **Debra:** Priya will take anything, she reschedules herself constantly.

Thursday, 7:40 a.m. A patient cancels the 11:00. Debra's day is now Harold at 9:00, a dead middle, and Tom at 2:30 — a wasted drive south for one appointment. *"The old me would eat that hole."*

The agent asks **one question**:

> **annnä:** Your Thursday just opened up in the middle. Want me to pull the day tighter — toward the morning, or toward the evening?
>
> **Debra:** Morning. Give me my afternoon.
>
> **annnä:** I can move Tom from 2:30 to 10:30 — you'd leave Harold's at 10:00 and the drive is about 25 minutes. Tom has no constraints against it. Want me to ask him?

Look at what already happened before that sentence was spoken. It computed the **drive between two real addresses**. It checked her working hours. It checked who *can* be moved — and **Harold is never mentioned.** Not "asked politely," not offered as an option she has to decline. He was excluded before the proposal existed.

And it doesn't touch Tom without her yes, *"because a promised time is a promise to a real person."* Tom gets two buttons — keep 2:30, or take 10:30. Nothing is done to him; his slot is his until he answers.

Then the question almost every scheduling product gets wrong:

> **annnä:** Your Thursday afternoon is clear now. Keep it blocked for you, or open it for booking?
>
> **Debra:** Mine.

> *"Because what would be the point of pulling my day tighter if the empty half just filled up again behind my back? The time I won back is won, not re-listed."*

A calendar can delete an 11:00. It cannot ask which direction to pull your day, compute the drives, silently exclude the patient who must never be asked, turn the move into a question the patient owns, and then protect the time it just won back.

All five situations pressure-test the same primitives from different angles:

| | Who | What it tests |
|---|---|---|
| **A** | **Sofia** — freelance teacher | Whole-life board + publishing one outward slice |
| **B** | **Ploy** — Phuket motorbike rental | Self-serve booking, holds with expiry, gated on passport/license/deposit |
| **C** | **Hug Ocean** — Phuket dive center *(the week [above](#start-here-one-week-run-twice))* | A whole week of sales fanning out across instructors, divemasters, pools, boats, gear and air — suppliers who mostly don't share an employer |
| **D** | **Debra** — physical therapist | Two office sites + home visits; every commitment carries an address, drives computed between them |
| **E** | **An ER scheduler** | **Held-out stress test** — annnä was deliberately *not* designed for this. It exists to check whether the general primitives absorb a domain they never saw. |

These are **falsification probes, not design targets**. If a story breaks the model, it reveals a missing *general* primitive — the fix is never to special-case the story.

---

## The skin: what it looks like, and the store

Everything above is the bones. The board itself is deliberately beautiful: it sits on a **photograph** — an empty day is just the photo — and the controls are **"breathing glass"**: clear glass at rest, frosting only under your attention, so the picture stays the product and the chrome gets out of the way. Four photo **skins** ship built in (a koi pond, a lamplit tunnel, a nudibranch, trees under stars), each deriving its own palette and glass; one press of "boring mode" turns the photo off entirely. The full visual law lives in [`app/DESIGN.md`](app/DESIGN.md).

Beside the app there is **one store with two goods** ([`marketplace/`](marketplace/)):

- **More skins.** Photo backdrops beyond the four built in, delivered to your account from the store's gallery.
- **Templates.** A template is a **business-in-a-box**: the transferable *shape* of how someone runs bookable time — the vocabulary, the rules with the numbers blanked, the booking pages, the resource boards — never anyone's data. The smallest is "Free Time Available" (share a bookable slice of your week: lessons, meetings, dates); the largest is a whole dive center. Installing one means your own agent walks you through the blanks — *your* numbers, *your* buffers — through the same confirm-everything flow as ever, and the copy you install is yours: nothing upstream can change it or take it away.

Both goods are supplied by the maintainers only — there is no user upload — and every store item is **data, never code**, checked at the door, so the worst a bad template can be is unhelpful. The store's hosted machinery (catalog, image delivery) is a closed service outside this repo; this repo carries the open half — the formats, the install law, and the guarantee that the app is complete without the store.

---

## How it's built: four layers

*(All four are **specified**. Code has begun and is early — the engine's Step-0 scaffold and the process scripts, nothing else. See [Status](#status) below.)*

| Layer | What it's for | Where it comes from |
|---|---|---|
| **Model** | The **language and judgment** — understands speech, normalizes it, narrates back. *Never* authors correctness or permission. | **Imported** — models are selected and qualified, not written |
| **Harness** | **What the agent is allowed to do and how it decides** — the loop, the tool contract, the permission floor. The behavioral spine. | Written from scratch |
| **Engine** | **Truth and math** — storage plus deterministic compute: no-double-book, validity, the type system, reconciliation. Correctness lives here. | Written from scratch |
| **App** | **What the human sees and touches** — the board, the per-commitment page, the console, and the forms off-app parties fill in. | Written from scratch |

The load-bearing idea is the split between **Model** and **Engine**. If you deleted the AI entirely, the Engine is what would remain: the calendar-and-calculator underneath. Everything the model is *forbidden* to do — state a number, a time, an availability — is answered by the Engine instead, deterministically. Same store, same query, same answer, always.

**Build order:** Harness first (against stubs, no real model needed) → Engine to satisfy the harness's seams → App to render the surfaces → **qualify real models last**, because good prompts need a real harness to test against.

A fifth package, [`marketplace/`](marketplace/) — the store's open half (skins, business-in-a-box templates) — sits beside the layers and **builds last**: it consumes all four and adds no new seam verbs. Its bookend is [`deployment/`](deployment/) — the discipline of the build itself (environments, what may land on main, concurrent builder sessions) — which governs the build in this repo and **builds first**, before harness Step 0.

---

## The locks: security, privacy, and the law

A product that asks for your whole life — and holds your customers' passports and medical notes — owes you an answer on how it protects them. The answer is a package of its own, [`security/`](security/), and in plain words it says:

- **Your customers' data is legally yours, not annnä's.** The business using annnä is the controller of what its customers submit; annnä is the *processor*, handling it on your instructions and giving you the tools to meet your duties — consent capture, retention control, a real way to answer "delete my data." Built to **GDPR as the ceiling**, with Thailand's PDPA named alongside it.
- **Dangerous documents live in a vault with a shredder, not in the permanent record.** A passport photo or a doctor's note goes into an encrypted vault with a destruction clock — a passport image is shredded about a month after the rental closes; a dive medical is kept the seven years the law and insurers expect, then shredded. What the permanent record keeps forever is only the harmless receipt: *"passport verified, this date."*
- **A guest's entire attack surface is one link.** No guest accounts, no guest passwords, no guest chatbot — one tokenized page and one form, and the token law behind it (how links are minted, stored, rate-limited, and killed) must pass an adversarial suite before any public link goes live.
- **Nobody can talk the agent into anything.** Every string entering the AI carries its source, and non-owner text — a guest's note, an uploaded manual — is data the agent reads, never instructions it obeys. And even if something got through, the agent structurally cannot author times or availability, act outward on its own, or delete records.
- **A lawyer gets the last word.** The package is engineering preparation, and it says so: a formal legal review before launch is a hard build gate that green tests cannot argue past.

[`security/README.md`](security/README.md) is written to be handed to an outside reviewer whole — every claim above maps to the section that constructs it and the tests that patrol it.

---

## Repo map

| Folder | What's in it |
|---|---|
| [`harness/`](harness/) | The behavioral spine — the loop, tools, elicitation, permission floor |
| [`engine/`](engine/) | The store and the math of record |
| [`app/`](app/) | The one-canvas surface, plus the guest pages |
| [`model/`](model/) | The contract any LLM must satisfy, and the exam that proves it |
| [`marketplace/`](marketplace/) | The open half of the store — skin-pack and template-bundle formats, the install law, and the seams to the closed marketplace service |
| [`security/`](security/) | The cross-cutting security law — threat model, tokens, the PII vault, injection quarantine, compliance posture; its README doubles as the external security-posture doc |
| [`deployment/`](deployment/) | The discipline of the build — environments, what may land on main, the spec/code boundary; governs the build in this repo, and **builds first** |
| [`PR/`](PR/) | The outward identity package — who annnä is and how it speaks; every public surface derives from it. Adds no product behavior; where it overlaps design, it inherits from `app/DESIGN.md`, never the reverse |
| [`assets/`](assets/) | The four shipped skin masters + approved palettes, and the admin pack pipeline |
| [`user-stories/`](user-stories/) | **The requirements source-of-truth** — five end-to-end situations |
| [`TDD/`](TDD/) | The testing strategy over all four acceptance suites |
| [`archive/`](archive/) | The original research and full design history — *how we got here*, not what to build |
| [`.specs/`](.specs/) | Interview records locking design decisions across packages |
| [`AGENTS.md`](AGENTS.md) | **Start here if you are an agent** — authority order, package shape, and the citation conventions that otherwise trip automated readers |

**Reading suggestion for a human:** this page, then [`user-stories/`](user-stories/) for what it actually does, then [`archive/`](archive/) if you want to know why the commitment primitive is shaped the way it is. A security reviewer can start — and mostly stay — at [`security/README.md`](security/README.md).

---

## The principles it holds to

Some of these use in-house shorthand. Plainly:

- **Thin agent / rich engine.** The AI never authors a correctness-critical value — no times, no availability. It asks the engine and reports the answer. This is structural, not a guideline — though the precise claim matters: the model **can** emit a time or a number (that is what a language model does, and the exam grades it for trying), but **nothing correctness-critical accepts one.** Those fields take engine-issued handles only, so a model-authored literal has nowhere to land.
- **The reversibility floor.** Nothing that crosses the line into the real world — messaging a third party, moving value, destroying something — happens without an explicit basis from the owner. Permission is never *inferred*.
- **Poka-yoke** *(a manufacturing term: designing a part so it physically can't be installed wrong).* Make illegal states impossible to construct in the first place, rather than validating against them after the fact.
- **Changing the rules never rewrites the past.** An operator can reshape hours, buffers, or rules, but commitments already made keep the terms they were made under. Changes apply forward only.
- **Design the general capability, not the use case.** The five situations are probes that reveal missing primitives — never targets to build toward.

---

## Status

**Design complete. Implementation begun, and early.**

| | State |
|---|---|
| Founding research | ✅ Done — four blind streams, converged |
| User stories | ✅ Five situations written (A–E), including one held-out |
| Harness / Engine / App / Model specs | ✅ All four packages complete, with acceptance suites |
| Skin/appearance model + marketplace spec | ✅ Specced — appearance law in `app/DESIGN.md`, store in `marketplace/` |
| Security law + compliance posture | ✅ Specced — `security/`, gating the layers' builds; legal review is a named gate |
| Build discipline | ✅ Specced — `deployment/`, governing the build in this repo; builds first |
| Testing strategy | ✅ Written across all four suites |
| **Application code** | 🚧 **Begun** — Step-0 scaffolds and test suites in [`engine/`](engine/) and [`harness/`](harness/), plus the process gates in [`deployment/scripts/`](deployment/scripts/) and the admin asset pipeline in [`assets/`](assets/) |

The design was deliberately attacked twice before being called done — structured adversarial reviews run by fleets of independent AI reviewers with no stake in the design (not external human audits; the kill lists are in [`archive/`](archive/)) — 93 findings raised across two rounds, 30 killed as unfounded, the rest worked through into the current packages. That history is in [`archive/`](archive/). The newer marketplace/appearance material took a third round of its own (2026-08-06): 46 findings raised, every one refuted — and then an audit of the refuters overturned four kills and surfaced five fresh gaps, all worked into the spec or recorded as open rulings in [`marketplace/NOTES.md`](marketplace/NOTES.md). The lesson stands both times: most attacks die, and the ones that survive are the ones worth having found.

**Next step:** build the harness against stubs, per [`harness/BUILD.md`](harness/BUILD.md).

**And now it happens here.** The first build — including the runner that executes the
`SCENARIOS.md` suites as real tests — happens in **this** repo, governed by
[`deployment/`](deployment/) from its first commit. The specification stays the source of
truth; the code grows alongside it.

---

## Two more results that stand on their own

Most of this repo only makes sense as one design. Two further things in it don't — they'd
hold for anyone building anything, and are noted here so they aren't lost inside a
dive-shop scheduling spec. (The third, the dual-build convergence diff, is above.)

- **Holding a domain out.** Four of the five [Situations](user-stories/Situations/) were
  designed toward. The fifth was deliberately not — so it is the only honest test of
  whether the commitment primitive generalizes, rather than of how well it was fitted.
  A held-out domain is to a design what a held-out set is to a model.
- **The template idea, separated from annnä.** A working business's whole operating
  shape — its kinds, rules, roles and forms — captured once and handed to the next
  operator to run from. That is a general answer to "how does someone start knowing what
  took you ten years," and it is not specific to scheduling, or to diving, or to this app.

---

## For AI agents working in this repo

Everything above is the orientation. The operational instructions:

**Every layer package uses the same five-file shape** (as do `marketplace/` and `security/`, with no deviations). Read them in order:

```
<layer>/
  README.md      purpose, role, read order
  SPEC.md        what the layer is — source of truth
  INTERFACES.md  the seams to other layers — what it calls, what it must stub
  SCENARIOS.md   the pass/fail acceptance suite (derived from user-stories/)
  BUILD.md       the ordered implementation plan, each step naming its gating scenarios
```

Deliberate deviations from that shape: the **model** package's acceptance file is `EVALS.md` (graded evals, because models are qualified rather than built); the **app** package adds `DESIGN.md` (carried design law); and `harness/`, `app/`, `marketplace/`, and `deployment/` each carry a `NOTES.md` — a backlog scratchpad of items already absorbed into the spec, plus anything still open. The **deployment** package is a process spec, not a layer: it governs the build in this repo (which keeps direct-to-main), builds first of all, and its scenarios use `[MUST]` (mechanically enforced) and `[DRILL]` (executed once, recorded) in place of `[HELD-OUT]`. Cross-cutting security laws live in `security/SPEC.md`; layer SPECs point to them, never copy. `NOTES.md` is never authoritative; build from `SPEC.md`.

- **To build a layer:** open its folder and follow that read order. Start with [`harness/BUILD.md`](harness/BUILD.md) — the harness is built and tested first, in isolation, against stubs including a scripted model stub.
- **To write or extend tests:** start in [`user-stories/`](user-stories/). Those are the top of the hierarchy; per-layer `SCENARIOS.md` files derive from them, and [`TDD/`](TDD/) says what kind of executable test each criterion becomes.
- **To question or trace a decision:** [`archive/`](archive/) holds the full history, including two adversarial critiques. It's there to *justify*, not to build from — where archive and a layer `SPEC.md` disagree, the SPEC wins.

**The two harness instances** (`harness/SPEC.md §2`): **H1** is the board — create a commitment, see it placed. **H2** is the per-commitment support page — author the rules, stakeholders, and sharing behind a single commitment.

---

## License

[MIT](LICENSE) © 2026 Matthew Lee
