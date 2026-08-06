# Situation Road — annnä's self-service rental probe (Situation B)

*A set of user stories that stress-test **annnä** against a different shape from the dive: a **single operator, a fleet of interchangeable units, and a customer who serves themselves.** A traveller browses a public link, **pulls a bike**, and that pull is not a booking yet — it's a **tentative hold with a clock**, blocking everyone else from that unit while the traveller races to satisfy the preconditions (passport, license, signed terms, deposit). Miss the clock and the hold dies; return a bike and it sits out a **buffer** before it can go again. Read this folder like a **storybook**. By the end, an LLM designing annnä should see, concretely, what the product must do: how the shop sets up, what breaks in today's paper-ledger world, and where annnä's holds, expiries, preconditions, and honest "no" have to show up. **annnä is the name of both the app and the agent inside it.***

---

## How to read this folder

1. **These are the people (and machines).** Meet the players in *The cast* below — who exists in this little economy.
2. **Then read how the resource sets up.** There is one resource type here — the motorbike — told once through the fleet: `resource-bike.md`.
3. **Then the operator** — the taker who owns the fleet and publishes it: `operator-shop.md` (Ploy / Sunbird Motorbikes).
4. **Then the situations** — three runs of the same world (`situation-1.md … situation-3.md`), each with a stated purpose. That's where the machinery becomes visible.

*(The customer is off-app in every version: `customer.md`. Here they don't just fill a form — they drive the booking themselves.)*

**One story per type, many players.** There's one shop and one resource type, but the *fleet* is many units (see the roster) — that plurality is the point: a hold on one unit must not touch another, and a race for the *last* unit of a model must resolve to exactly one winner.

**The rule underneath it all:** *a resource type is a market of at least two units* — so a held or cooling-down bike always leaves a sibling to fall to. The **dead-end** in this fleet is the pair of license-gated **CBRs** — the only units a typical renter can't legally take — deliberately there so the market can run *out* (both booked, or the wrong license) and annnä has to say **no**.

---

## The two kinds of stakeholder

- **Resource stakeholder** — the **motorbike**. Each unit supplies one thing: itself, for a window. The fleet is added on annnä once, tailored on its template, and from then on work just *reaches* a free unit. The atoms.
- **Operator stakeholder** — the **taker**. **Sunbird Motorbikes** (Ploy) owns the fleet and publishes it. Unlike the dive center, Sunbird doesn't assemble the booking by hand — it **publishes an inventory link and lets the customer pull**. Acceptance is **Auto**: the precondition checklist *is* the gate, so no human approves a rental.

*There is no PADI here. The "standards" are **Sunbird's own uploaded documents** — its terms & conditions and deposit policy — plus **one genuinely external rule**: Thai law requires the rider to hold a valid driving license (an International Driving Permit with the right class), and the **motorcycle class** specifically is what gates the big bike. Change the documents and the preconditions change.*

---

## The cast

*One setup story for the fleet (above); here is the roster that actually plays in the situations. The quirks are what make a unit a first choice vs. a fallback — and, for the big bike, a dead end.*

### The fleet — Sunbird Motorbikes (Rawai, Phuket) — 40 units
*Every unit: 1-hour hold window · **6-hour buffer** after return · preconditions = passport + license + signed terms + deposit. Rates/deposits are the going Rawai figures.*

| Model | Units | ~Rate/day | Deposit | Role |
|---|---|---|---|---|
| **Honda Click 125i** | ×14 | 250–280฿ | 2,000฿ | the workhorse — abundant; there's almost always a free one |
| **Honda Click 160** | ×6 | 300฿ | 3,000฿ | the 160 step-up; still plentiful |
| **Honda ADV 160** | ×5 | 400–500฿ | 4,000฿ | adventure-styled auto, popular |
| **Honda PCX 160** | ×3 | 400฿ | 3,000฿ | comfortable mid auto |
| **Honda ADV 350** | ×3 | 900–1,200฿ | 10,000฿ | maxi — big, but **automatic** (no license gate) |
| **Honda Forza 350** | ×3 | 900–1,000฿ | 10,000฿ | maxi tourer — automatic |
| **Yamaha NMAX 155** | ×2 | 350–400฿ | 3,000฿ | scarce comfort auto — **the contended one** |
| **Honda Scoopy** | ×2 | 250฿ | 2,000฿ | cheap small scooter — the other scarce pair |
| **Honda CBR500R** | ×2 | 1,500–2,200฿ | 15,000฿ | **manual sport bikes — motorcycle-class license required** |

*Forty units across nine models: a pull, hold, or buffer on one almost always leaves a sibling, so cancellations cascade within a model then across models. Contention only bites on the **scarce** models (NMAX, Scoopy — two each), where the last free unit is a real prize. The honest dead-end lives on the **two CBRs** — the only units that need a **motorcycle-class** license — so when both are out, or a rider's license isn't motorcycle-class, there's no fallback and annnä must return **"no bike available."***

### Operator & customers
- **Sunbird Motorbikes** (Ploy Suwan, owner; Rawai) — our **operator**; owns the whole fleet, publishes the inventory link, runs Auto acceptance.
- **Customers** (always off-app, self-service): **Tom Becker** (German backpacker — the anchor), plus this week's **Marco Rossi**, **Priya Nair**, and **Anya Petrova**, each pulling a bike off the same public link at overlapping times.

---

## The machinery (what a rental actually is)

A rental here is a small state machine, and every state is annnä's job to hold honestly.

| State | What it means | The rule behind it |
|---|---|---|
| **Available** | in inventory, pullable | — |
| **Held** | a traveller pulled it; a **1-hour clock** runs; no one else can pull it | Sunbird's hold policy |
| **Confirmed** | all four preconditions cleared inside the clock | passport + license + signed T&C + deposit |
| **Out** | the confirmed rental period | — |
| **Buffer** | returned, cooling down for **6 hours** from the **actual** return | Sunbird's buffer policy |

*Two preconditions come from Sunbird's own documents (signed T&C, deposit); one comes from **outside law** (a valid license — motorcycle-class for the CBRs). The buffer counts from **reality**: a bike due Sunday but returned **Saturday** frees (after its 6 hours) from Saturday, not from the paper.*

---

## The situations (the storybook)

Three runs of the **same busy stretch** — four travellers pulling bikes off one link at overlapping times. Each exists to show one thing.

### Situation 1 — the perfect case → `situation-1.md`
**annnä runs the counter.** Four travellers pull bikes over an afternoon; each pull opens a clean hold, each checklist clears in time, concurrent pulls each land a free unit, a race for the last scarce NMAX resolves to one winner silently, and a returned bike re-enters after its buffer — no double-books, no keys handed out twice.
**Purpose:** establish the **ceiling** — what annnä makes *possible* when the fleet is on it and the customer serves themselves. The baseline the others are measured against.

### Situation 2 — current reality → `situation-2.md`
The **same stretch run the way a rental shop runs today**: a paper ledger, a WhatsApp thread, keys on a hook, deposits in an envelope. Ploy "holds" a bike by remembering to; two walk-ins want the same one; she double-books a Click she thought was back; the buffer lives in her head; a passport photo sits in a drawer.
**Purpose:** show the **problem annnä exists to solve** — one person tracking holds, buffers, documents, and deposits by memory. The gap between this and Situation 1 is the product.

### Situation 3 — the edges, held honestly → `situation-3.md`
The pointed cases: a hold that **expires** and releases; a document that lands **after** expiry and must *not* revive it; two travellers **racing** the last unit; a bike still inside its **buffer**; an **early return** freeing from the real time; a **late return** tracked from reality, its fee already authorized by the signed T&C; a **rule change** (a tighter buffer) that touches only pulls made after it; the **CBRs** both out (or a license that isn't motorcycle-class) → **"no bike available"**; and a **charge** attempted with no captured consent.
**Purpose:** show **the machinery and honest failure** — holds/expiries/preconditions doing their job, and the app saying **no** out loud when the market runs out or the rider isn't cleared. The app must be able to say no.

**How the three relate:** 1 ↔ 2 are the same *stretch* in two worlds (with-annnä vs. the paper ledger) — the axis is coordination. 3 is where the state machine is stress-tested from the outside — the axis is honesty. Together they bound annnä's job here: hold the tentative honestly, replace the memory-and-envelope shop, enforce preconditions and buffers, and refuse the impossible out loud.

---

## The files

| File | What it is |
|---|---|
| `resource-bike.md` | how the fleet sets up (holds, buffer, preconditions) — lens: the Sunbird fleet |
| `operator-shop.md` | how the shop sets up and publishes — Ploy / Sunbird Motorbikes |
| `customer.md` | the off-app, self-service customer — Tom Becker |
| `situation-1.md … situation-3.md` | the three runs |

---

## The wider rental market (context)

*Sunbird is one shop drawn from Phuket's real rental scene — hundreds of small operators around Rawai, Chalong, Patong, and Kata renting near-identical scooters. **(inf)** = inferred / representative · **(annnä)** = our protagonist.*

**The fleet is realistic.** Phuket rentals are dominated by automatic scooters — Honda Click and Scoopy, Yamaha NMAX, Honda PCX, plus maxi-scooters (ADV 160/350, Forza 350) — rented daily/weekly, deposit either cash or a held passport (Sunbird takes a cash deposit and a *photo* of the passport, never the physical book — a deliberately safer variant of the local norm). Big/manual bikes (CBR and up) are a small, license-gated slice.

**Sunbird is fictional.** Sunbird Motorbikes and Ploy Suwan are invented — a composite standing in for the friendly single-operator shop that is the common shape around Rawai. No real business is depicted, and the 40-unit fleet below is a **realistic composite** of the Rawai market (real models, invented counts), not any actual shop's inventory. This is deliberate: a falsification probe tests the general primitive, so it must not depend on — or make claims about — a real operator.

**The legal floor is real.** Thailand requires a valid driving license; foreigners ride on an **International Driving Permit** with the matching class. Enforcement is uneven on the road, but it's a genuine external standard Sunbird chooses to enforce at the counter — and *strictly* for the motorcycle-class big bike.

**The pain is real.** Independent shops track everything by hand — a paper book, LINE/WhatsApp messages, keys on a board, deposits in a drawer. Double-bookings, "I'll hold it for you" with no clock, disputes over damage and deposits, and no shared record are the everyday texture Situation 2 draws from.

---

## Stubs (part of the story, deliberately blank)
- **A second shop / pooled inventory** — Ploy representing another owner's bikes under Sunbird, with a kickback. *Considered and cut for now (kept single-shop); noted as the natural next probe if this graduates.*
- **Damage settlement** — converting the deposit to an actual charge after a scratch, end-to-end, with consent captured. *Represented here, not processed.*
