# Situation Triage — annnä's held-out ER probe (Situation E)

> **HELD-OUT — read this first.** Unlike Situations A, B, and C, annnä was **deliberately not designed to this domain.** This folder exists to test whether annnä's *general* primitives absorb a domain they never saw. **Every "must work" here is a _prediction to verify_, not a requirement annnä already claims to meet.** If a primitive absorbs the ER unchanged, its generality is proven out-of-sample. If it can't, the finding is *which general primitive is missing* — **never** "patch annnä for the ER." That is the meta-principle working as intended.

*A hospital **emergency room** where today a full-time human **scheduler** controls every in and out. The ambition under test: **annnä replaces that scheduler and runs the board autonomously.** Cases arrive and must be placed into rooms that admit only certain *types* of occupant; staff bid for time off a year or two ahead in competitions that can be lost; and when someone calls in sick *now*, the whole board must re-solve in real time. Read this folder like a **storybook** — but read it as a set of bets on annnä's generality. **annnä is the name of both the app and the agent inside it.***

---

## How to read this folder

1. **Meet the players.** *The cast* below — rooms, staff, the scheduler being replaced, and the patients (off-app cases).
2. **Then how each resource sets up** — told once per type: `resource-room.md` (rooms that admit by *type*, not just count) · `resource-staff.md` (qualification, seniority, and advance time-off bids).
3. **Then the operator** — the institution that sets annnä's **autonomy envelope** and lets it run the board: `operator-er.md`.
4. **Then the situations** — four runs (`situation-1.md … situation-4.md`), each with a stated purpose. *(The patient is off-app in every version: `customer.md` — a case that is **placed**, never a booker.)*

**The inversion vs. the other situations:** here the **staff are on annnä** (they mark availability and submit bids) and the **customer is off-app** (a case that arrives and is placed). And the "operator" isn't a person working a phone — it's **annnä itself, running unattended** inside an authored envelope, parking to a human only when it must.

---

## The four held-out primitives (what's actually on trial)

Everything below is a bet that these four shapes fall out of annnä's existing atoms with **no ER-specific feature added**:

1. **Type-match admission** — a room accepts an occupant only if the occupant's **type matches the room's admission rule.** This asks whether annnä's *capacity* generalizes from a **count** to a **type-match** (a room isn't "cap N," it's "these kinds, up to N").
2. **A competitive, losing request** — a **time-off bid** submitted 1–2 years ahead is a request that **consumes nothing yet and can lose.** This asks whether annnä can represent a request whose normal outcome may be a **system-issued decline with a reason.**
3. **Ordering over principals** — **seniority** resolves bid competitions. This asks whether annnä can express an **ordering over people**, not baked into one domain.
4. **Re-solving an already-active commitment** — a sick call forces a **live re-solve** that may move commitments **already in progress**, escalating to a human **only when unsolvable.** This asks whether annnä can re-optimize live, and — critically — **park and surface** rather than guess when it hits the edge of its authority.

---

## The two kinds of stakeholder

- **Resource stakeholders** — the atoms. **Rooms** (each supplies a placeable slot bounded by an *admission rule* + capacity) and **staff** (each supplies rated labor, bounded by *qualification*, with availability and advance *bids*). Both are boards on annnä.
- **Operator stakeholder** — the **ER institution**. It doesn't work the board by hand; it **authors the envelope** annnä runs inside (what may be placed autonomously, the bid-resolution policy, the escalation rules) and then lets annnä schedule unattended.
- **Customer** — the **patient / case**, always off-app: it arrives with a **type**, is **placed** into an admissible room, and never touches the app.

---

## The cast

### Rooms — 10 (each admits by type, not just count) — see `resource-room.md`
| Room | Admits (type rule) | Capacity |
|---|---|---|
| **Trauma 1–2** | trauma / resuscitation cases only | 1 each |
| **OR-adjacent Prep** | pre-surgical cases only | 2 |
| **Peds 1–2** | children only | 1 each |
| **Isolation** | infectious / airborne-precaution cases only | 1 |
| **General Bays A–D** | any stable, non-infectious adult | up to 4 each |

*A room is **not** "capacity N" — it's "these kinds, up to N." Placing a child in Trauma 1 or an infectious case in a General Bay fails the admission rule, not the count.*

### Staff (qualification + a seniority ordering + advance bids) — see `resource-staff.md`
- **Attendings** (can supervise/place independently) · **Residents** (rated for a narrower set) · **Nurses (RN)** · **Techs.** Each is on annnä with availability.
- **Seniority is an explicit ordering** over all staff — the tiebreaker when two bids collide.
- **Time-off bids** are submitted **1–2 years ahead**: competitive, consuming nothing yet, resolved by seniority/quota, and they **can lose**.

### Operator & customers
- **The ER institution** (charge role: **Dr. Adeyemi**, medical director; **Charge Nurse Ramirez**, who authors day-to-day rules) — sets annnä's autonomy envelope and escalation policy (`operator-er.md`).
- **Patients / cases** (always off-app, `customer.md`): arrive by type — a **child with a fever**, a **trauma from a road accident**, an **infectious respiratory case**, a **stable adult** — and are **placed**, never booking anything.

---

## The situations (the storybook — read as predictions)

Four runs of the same ER, each a bet on one thing.

### Situation 1 — the predicted ceiling → `situation-1.md`
**annnä runs the whole board, unattended.** Cases arrive and are placed into admissible rooms automatically; a year-ahead bid competition resolves by seniority; a nurse calls in sick and the board re-solves live to cover — and a human is never paged for routine work.
**Purpose:** the **predicted ceiling** — what annnä *would* make possible if the four primitives are truly general. A bet, not a claim.

### Situation 2 — current reality → `situation-2.md`
The **same ER run the way it runs today**: a human scheduler with a magnetic whiteboard, each room's SOP in their head, an annual bids spreadsheet resolved in a seniority meeting, and a 3 a.m. phone tree when someone calls in sick.
**Purpose:** the **problem** — one person holding admission rules, seniority, and live coverage by hand. The gap between this and Situation 1 is what annnä is being bet to close.

### Situation 3 — the mechanisms, predicted to work → `situation-3.md`
Each primitive on its own: **type-match admission** places a case only where its type fits; a **bid competition** resolves to the senior bidder with the loser recorded; a **sick-call re-solve** moves even already-active commitments to cover.
**Purpose:** verify the **must-works** one mechanism at a time — the four primitives doing their predicted jobs.

### Situation 4 — the refusals and the safe park → `situation-4.md`
The boundaries: a case whose type **fails** a room's admission rule is **refused** that room; two bids for one scarce slot resolve to **one winner, one clean decline**; and an unattended re-solve that would need an **across-the-line action with no standing authorization and no reachable human** must **park and surface — never act on a guess.**
**Purpose:** verify the **must-refuses** — and the single most important prediction, that annnä **stops and escalates** at the edge of its authority instead of improvising.

**How the four relate:** 1 ↔ 2 are the same ER with annnä vs. with a human scheduler (the axis is *autonomy*). 3 ↔ 4 are the primitives doing their job vs. hitting their limits (the axis is *honesty under autonomy*). Together they ask: can annnä's general atoms run the hardest coordination problem in reach — and refuse safely when they can't?

---

## The files

| File | What it is |
|---|---|
| `resource-room.md` | how a room sets up — admission by **type**, not just count |
| `resource-staff.md` | how staff set up — qualification, **seniority ordering**, advance **bids** that can lose |
| `operator-er.md` | how the institution authors annnä's **autonomy envelope** and escalation |
| `customer.md` | the off-app **case** — placed, never a booker |
| `situation-1.md … situation-4.md` | the four runs (predictions to verify) |

---

## Deliberately absent: money

*There is **no money** in this probe — patients don't pay in its scope, and staff payroll is not modeled. That's a decision, not an omission: E exists to test exactly four primitives, and billing would muddy the trial. (The folder-wide money rule — tracked, never moved — applies everywhere money appears; here it simply doesn't.)*

## Why this is held out

The four shapes — **type-match admission, a losing/competitive request, re-solving an already-active commitment, and an ordering over principals** — were named but deliberately **not designed to.** If annnä absorbs them with no change to its atoms, its generality is proven out-of-sample. If it can't, the finding is *which general primitive is missing* — not "patch the model for the ER." Read every "must work" in this folder as a hypothesis with a question mark.
