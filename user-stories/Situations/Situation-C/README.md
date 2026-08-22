# Situation Sea — annnä's dive-economy probe (Situation C)

> ⚠️ **Fiction notice.** Every person, booking, transaction, staffing arrangement, and price in this folder is **invented**. Some dive centers and suppliers are named because they are real businesses, included only as public market-landscape context — Phuket's fragmentation by tourist-language market is the thing being modelled. **No real operator employs the people named here, and no described booking, referral, failure, or business practice depicts any actual company's conduct.** Hug Ocean and its staff are entirely fictional.

*A set of user stories that stress-test **annnä** against the hardest real-world coordination problem in reach: Phuket's fragmented dive market. One customer's booking fans out into a multi-party, multi-day course across instructors, pools, boats, gear, and air — most of whom don't work for the same business. Read this folder like a **storybook**. By the end, an LLM designing annnä should see, concretely, what the product must do: how each kind of actor sets up with annnä, what breaks in today's world, and where annnä's coordination, language/specialty matching, and honest "no" have to show up. **annnä is the name of both the app and the agent inside it.***

---

## How to read this folder

1. **These are the people.** Meet the players in *The cast* below — who exists in this little economy.
2. **Then read how each kind of resource sets up.** The one-of-ones each supply one thing. Their setup is near-identical within a type, so it's told **once per type**, through one representative:
   - `resource-instructor.md` · `resource-divemaster.md` · `resource-pool.md` · `resource-boat.md` · `resource-gear.md` · `resource-air.md`
3. **Then the operators** — the takers who orchestrate bookings and stand on resources: `operator-dive-center.md`, `operator-agent.md`.
4. **Then the situations** — five runs of the same world (`situation-1.md … situation-5.md`), each with a stated purpose. That's where the stories collide and annnä's job becomes visible.

*(The customer is off-app in every version: `customer.md`.)*

**One story per type, many players.** Each `resource-*.md` tells the setup once; the *number of players* is larger (10 instructors, 5 divemasters, several pools/boats/gear/air) — they'd all read the same, so only the roster below lists them. **Boats are the exception:** routes differ boat-to-boat, so `resource-boat.md` walks three (Hug Ocean's own + Mandarin Queen 5 & 7).

**The rule underneath it all:** *every resource type is a market of at least two suppliers* — a first choice and a fallback — so a cancellation always has somewhere to go.

---

## The two kinds of stakeholder

- **Resource stakeholders** — one-of-ones. Each supplies a single thing. Each lands solo on annnä, tailors its **own admin-made template**, sets availability, and from then on work just *reaches* it. The atoms.
- **Operator stakeholders** — the takers. A **dive center** or an **agent**: they orchestrate bookings and depend on resources. An operator that owns its own boat/pool/gear adds them through the *same resource forms* a one-of-one fills; an agent depends on a dive center in turn.

**Instructors and divemasters can be _freelance or employed_.** Freelance = a standalone account any center can reach on the open market. Employed = exclusive to one dive center, added *under* it, reachable *only* through that center's bookings. This is why the market fragments by language: a center reaches its own staff + freelancers, and a customer whose language its staff can't teach gets **referred out** to a center whose employed instructor can. (**A divemaster is just an instructor with a narrower rating** — the loaded agency documentation is what forbids it from certifying and limits it to fun dives + assisting.)

> **v1-scope note *(founder-ruled 2026-08-06)*.** The **referral out through the agent** these situations lean on — handing a customer to a center annnä holds **no prior relationship with** — is a **post-v1 beat**. In v1, annnä reaches every supplier *already on annnä* (a center's own staff and freelancers alike), **across account lines**, through the **share seam** (one creator-owned commitment reaching boards annnä already holds an availability grant from — `../../../engine/SPEC.md §7.1`); only the reach to *strangers* by referral is deferred. The stories below stay true as written — see the corpus scope note in [`../../README.md`](../../README.md).

---

## The cast

*One setup story per type (above); here is the full roster that actually plays in the situations. Failure quirks noted — they're what make a supplier a first choice vs. a fallback.*

### Instructors — 10 (freelance + employed)
| Instructor | Mode | Employer | Read/write · speech | Specialties |
|---|---|---|---|---|
| **Matthew Lee** (annnä) | freelance | — | en, zh-Hant · *cmn* | Deep, Nitrox |
| **Bear** (annnä) | freelance | — | zh-Hant · *cmn, ja, fr* | Nitrox, Deep, **Sidemount**, +Wreck/Night/Nav/Buoyancy/Photo |
| Li Ming | freelance | — | zh-Hans, en · *ko* | Deep |
| Wei Chen | freelance | — | zh-Hant, zh-Hans, en · *cmn, th* | Deep, Nitrox, Wreck, Nav, Night |
| Ploy Srisuk | **employed** | Hug Ocean | th, en | Nitrox |
| Wang Fang | **employed** | Hug Ocean | zh-Hans, en · *cmn* | Deep |
| Kenji Tanaka | **employed** | Hobo-ya (JP) | ja, en | Deep, Photo, **Drysuit** *(only one)* |
| Lena Fischer | **employed** | Scuba Quest (DE) | de, en | Nitrox, Nav, **Sidemount** |
| Dmitry Volkov | **employed** | DivingAsia.ru (RU) | ru, en | Deep, Nitrox |
| Min-jun Kim | **employed** | Bubble Bubble Dive (KR) | ko, en | Deep |

*Freelancers (Matthew, Bear, Li Ming, Wei Chen) + Hug's own staff (Ploy, Wang Fang) are what Hug Ocean can reach — all zh/th/en. The employed non-Hug-language instructors serve **their** centers' customers, which is exactly who gets referred to them.*

### Divemasters — 5 (instructors with a Divemaster rating: no certifying, fun dives + assist only)
| Divemaster | Mode | Employer | Read/write · speech |
|---|---|---|---|
| Arisa Kanchanaburi | freelance | — | th, en |
| **Aroon Saetang** (annnä) | freelance | — | th, en · *cmn* |
| Petch Chai | freelance | — | th, en |
| Nok Wattana | **employed** | Hug Ocean | th, en |
| Hana Sato | **employed** | Hobo-ya (JP) | ja, en |

### Pools *(capacity = a count, not lanes)*
Hug Ocean *(owned; Somchai, 3 m, **cap 15**)* · **Neptune** *(Wei Lin, 2.5 m, **cap 6** — too small for a group)* · **Water Pro** *(Niran, 2.5 m, **cap 25** — the big fallback)* · Shark Bites *(Kittisak Wongsawat, 2.5 m, cap 8)*.

### Boats *(each a different weekly route — see `resource-boat.md`)*
M.V. Hug Ocean *(owned; ≈45, Racha route)* · MV Mandarin Queen 5 *(Kittisak Charoen, 70)* · MV Mandarin Queen 7 *(Kittisak Charoen, 90)* · MV Matchanu *(Aloha, **12 — boutique, fills early**)*. *(Wider bench in the market notes below.)*

### Gear *(inventory by type × size — a bag needs every size)*
Hug Ocean *(owned, full stock)* · **Scuba Revolution** *(Ta, full size grid)* · **Nicole Dive Center** *(Nicole Huang, **no mask sizes**)*.

### Air *(gas mixes must be configured to be placeable)*
**Scuba Market** *(Prawit, air + nitrox 32)* · **Chalong Pier** *(Sombat, **no gas mix set**)*.

### Operators & customers
- **Hug Ocean** (TingTing, front desk; Rawai, PADI 5-star) — our **dive center**; owns its boat, pool, gear, and staff; serves zh/th/en.
- **Phuket Travel** (Alex Walker) — our **agent**; refers to Hug Ocean; routes out-of-market customers to language-matched centers.
- **Customers** (always off-app, form only): **Jun Wang** (Mandarin, medical-flagged — the anchor), plus this week's **Mei-Ling Chen** (Traditional Chinese, Advanced), **James Thompson + 2 friends** (English, group Open Water), **Lukas Weber** (German, Advanced), **Yuki Sato** (Japanese, Drysuit), **Camille Laurent** (French, Sidemount).

> **How Hug places a job (the rule the situations follow):** **own resources first, then the open market, then a referral.** Hug uses its **own** instructors (Ploy Srisuk, Wang Fang), **own** divemaster (Nok), **own** boat, pool, and gear before anything else — and its own staff are **internal**, so no other center or the agent can pull them onto a different booking. When Hug's own can't cover — not enough of them, or the wrong language — it reaches a **freelancer** on the open market (Matthew, Bear, Li Ming, Wei Chen; DMs Arisa/Aroon/Petch). And when a customer needs a language or rating Hug can't reach at all — **German** (Lena @ Scuba Quest), **Japanese Drysuit** (Kenji @ Hobo-ya) — annnä **refers them out through the agent** to the center that employs the right instructor, because employed staff are reachable only through their own center. The house boat is used until it's **full or committed** to another route, then the backup boat catches the overflow. (Situations 1–4 are written to this rule.)

---

## The three courses (each a distinct thing)

| Course | Days | Shape | Routing (Hug Ocean's authored preference) |
|---|---|---|---|
| **Open Water** | 3 | Day 1 confined (pool); Days 2–3 open water | **Racha both open-water days** |
| **Advanced** | 2 | Day 1 Adventure dives; Day 2 finish + certify | Day 1 Racha; **last day Phi Phi (PP)** |
| **O+A** | 4 | Day 1 pool; Days 2–3 open water; Day 4 Advanced finish | Days 2–3 **Racha**; Day 4 **PP** |

*Bounded by the agency standard the admin pre-loaded — **no more than 3 training dives in a day** — which the course-design surface won't let anyone exceed.*

**Specialties** (rating-matched, deliberately scarce): **Deep** & **Nitrox** common; **Sidemount** has two (Bear, Lena); **Drysuit** has exactly one (**Kenji**) — a single point of failure, and (now) reachable only through the center that employs him.

---

## The situations (the storybook)

Five runs of the **same busy week** — four parties on three courses sharing an instructor bench, the boats, and a pool — plus a sixth, scripted later, that puts a second human on the board. Each exists to show one thing.

### Situation 1 — the perfect case → `situation-1.md`
**Everyone is on annnä and nothing goes wrong.** annnä sees the whole week's inventory and routes and places all of it in one pass; ranked lists resolve silently (a busy first choice → next fit), languages match, a divemaster appears for the group, and two boat backups are engaged silently — one because the house boat **ran out of seats** (capacity overflow), one because it **couldn't reach a second site** (route clash). **Zero phone calls.**
**Purpose:** establish the **ceiling** — what annnä makes *possible* when the whole market is on it. The baseline the others are measured against.

### Situation 2 — current reality → `situation-2.md`
The **same week run the way the industry runs today**: only the center and instructors are on annnä, so nothing refills a hole and nothing is written where two people can see it. TingTing works the phones — almost every slot takes two or three calls, the boat can't be in two places, an instructor drops mid-course, a fifth day gets bolted on.
**Purpose:** show the **problem annnä exists to solve** — a dive center coordinating *every* resource by hand. The gap between this and Situation 1 is the product.

### Situation 3 — specialties, the match works → `situation-3.md`
**Specialty** bookings (Drysuit, Sidemount, Nitrox) stand on a **specific rating**, not a day-shape. annnä filters the bench by rating → language → availability and lands each on the right instructor.
**Purpose:** show the **matching engine** — a customer's request against a *scarce, rating-gated* bench. Scarcity working *with* the grain when the qualified person is free.

### Situation 4 — specialty, no match → `situation-4.md`
The same **Drysuit** booking, on dates the one rated instructor is booked. No fallback. At submit, the form returns **"no instructor available."**
**Purpose:** show **honest failure** — scarcity vs. truth-telling. When inventory genuinely can't fulfill, annnä says so immediately. The app must be able to say no.

### Situation 5 — the realistic middle → `situation-5.md`
The **same week with only a minimal network on annnä** — Hug plus its own staff/boat/pool/gear and three freelancers; everyone else off-app. The boat clash surfaces **weeks early** instead of morning-of; a sick instructor is replaced through a **clocked offer** that lapses past a silent freelancer; the replacement is briefed **from the record**, not by phone; the four unavoidable calls are **prepared and recorded**; money is tracked, never moved; and each call becomes an **invite** — the conversion engine.
**Purpose:** show the **launch reality** — annnä coordinating what it can reach, assisting what it can't, and growing the network through exactly the pain the phone causes.

### Situation 6 — the second seat → `situation-6.md` *(scripted, 2026-08-22)*
**TingTing goes home, and the desk keeps working.** Fon (the evening admin) sells a course at 7 p.m. on the same board, the intake links fire on grants TingTing authored, and Gop (the boat leader) works a narrower seat from the pier. The first run anywhere with **two humans on one board** — it surfaces, as beats, the four questions the specs answer only for a singular owner (what satisfies the floor when admins are plural; what act class *adding a seat* is; whether grants are board-scoped; what a narrower seat's shape is) and deliberately invents no mechanism for them.
**Purpose:** probe the **plural-admin reality** every real centre lives in — the stub `operator-dive-center.md` left light, now told (`operator-dive-center-second-seat.md`).

**How the five relate:** 1 ↔ 2 are the same *week* in two worlds (with-annnä vs. without) — the axis is coordination. **5 sits between them** — the minimal-adoption world the product actually launches into, where annnä solves the on-app part and assists the phone part. 3 ↔ 4 are the same *booking* in two worlds (available vs. booked-out) — the axis is honest matching. Together they bound annnä's job: place the possible silently, replace today's phone tree, match scarce qualifications, refuse the impossible out loud — and convert the off-app world one call at a time.

---

## The files

| File | What it is |
|---|---|
| `resource-instructor.md` | how an instructor sets up (freelance vs. employed) — lens: Matthew |
| `resource-divemaster.md` | how a divemaster sets up (instructor rating narrowed by agency docs) — lens: Aroon |
| `resource-pool.md` | how a pool sets up (capacity, not lanes) — lens: Niran / Water Pro |
| `resource-boat.md` | how boats set up (route rotations) — Hug Ocean + Mandarin Queen 5 & 7 |
| `resource-gear.md` | how a gear shop sets up (size grid) — lens: Ta / Scuba Revolution |
| `resource-air.md` | how a fill station sets up (gas mixes) — lens: Prawit / Scuba Market |
| `operator-dive-center.md` | how a dive center sets up — TingTing / Hug Ocean (owns its resources + staff) |
| `operator-dive-center-second-seat.md` | the second seat — Fon and Gop under Hug Ocean (scripted, 2026-08-22) |
| `operator-agent.md` | how a referral agent sets up — Alex Walker / Phuket Travel |
| `customer.md` | the off-app customer — Jun Wang |
| `situation-1.md … situation-5.md` | the five runs |
| `situation-6.md` | the second-seat run (scripted, 2026-08-22 — marked in-file) |

---

## The wider Phuket market (context)

*The cast is drawn from a loaded, real-world stakeholder set, built to simulate Phuket's genuine fragmentation. **(seed)** = canonical data from a prior production system · **(web)** = **names of real Phuket operators, used as market context only** · **(inf)** = inferred · **(annnä)** = our protagonist personas.*

> **On the `(web)` names:** these businesses exist; everything attributed to them here does not. Staff, availability, capacity, referrals, and failures are invented to populate a realistic market. Read "Scuba Quest *(German — employs Lena)*" as "*a German-market shop, which Scuba Quest really is; Lena is fictional.*"

**Language model.** Two Chinese codes by script: `zh-Hans` (Simplified), `zh-Hant` (Traditional) — script, not country. English = one code. **Written is the matching axis** (the app is text-first); a **[speech]** flag marks a language someone can speak but not type (e.g. an instructor who teaches in spoken Mandarin but writes only Traditional). *Precedent: a prior production system stores country-coded `zh-CN`/`zh-TW` and normalizes toward the script codes at the boundary — the same fold this section adopts.*

**Dive centers (~30, cluster by language market).** *(Real operator names; every staff member, capacity, referral and failure attached to them below is invented — see the note above.)* Hug Ocean *(Rawai, our center, zh/th/en)* · Nicole Dive Center · All4Diving · Aussie Divers · Sea Fun Divers *(multi)* · Scuba Quest *(German — employs Lena)* · JK Dive Center *(Mandarin)* · DivingAsia.ru / Diver Stars / DiveSaint / Sea Devils *(Russian — DivingAsia.ru employs Dmitry)* · Sea Bees *(German)* · Nautilus / Blue Marine *(Thai)* · Nice Dive · **Hobo-ya** *(largest JP operator — employs Kenji & Hana)* · Bubble Bubble Dive *(Korean — employs Min-jun)* · …and more, each serving a tourist-language market. *Fragmentation is real: shops cluster by the market they serve — which is what makes referral (the agent) matter.*

**Other agents (5):** Phuket Travel *(ours)* · Dive The World Thailand · Sunrise Divers · Similan Diving Tours · Liveaboard.com.

**Boat routes.** *Racha day* → Racha Yai + Racha Noi (3 dives) · *King Cruiser day* → wreck + Shark Point + Anemone Reef (3) · *Phi Phi day* → Bida Nok + Bida Nai + Shark Point/Koh Doc Mai (2–3). Wider bench beyond the four in the cast: MV Kepsub *(Aussie, ~35)*, MV Sirolo *(~67)*, MV Excalibur II *(Sea Bees)*, MV Mermaid *(~60)*, MV All4 Explorer *(~40)*, MV Discovery — rotations are realistic composites, shift seasonally.

**Dive sites.** Racha Yai *(beginner/training)* · Racha Noi *(advanced, mantas)* · King Cruiser Wreck *(advanced)* · Shark Point · Anemone Reef · Koh Doc Mai *("3rd-dive" site)* · Bida Nok / Bida Nai *(Phi Phi)* · Loh Samah *(night)* · Kata / Kata Noi *(shore training)*.

**On file, not yet used.** *Liveaboards* (~13, ex-Phuket/Khao Lak → Similan/Surin/Richelieu, Oct–May): Giamani, Bavaria, Pawara, The Junk, Manta Queen fleet, DiveRACE Class X, Thailand Aggressor… · *Dive resorts*: effectively a **Khao Lak** category (Phuket proper isn't one) · *"Dive hostels"*: no true ones — the pattern is **dive-shop-with-rooms** (Bubble Bubble Dive · Neptune Scuba · Seafarer Divers).

**Provenance.** Only Matthew, Bear, Aroon *(annnä personas)* and the seeded players are "fixed"; the rest span Phuket's real market segments as representative fills. Boat rotations are plausible-not-gospel.

---

## Stubs (part of the story, deliberately blank)
- ~~**Adding the rest of the team**~~ — told 2026-08-22: `operator-dive-center-second-seat.md` + `situation-6.md` (Fon, Gop; the owner himself stays light).
- **Dive hostel** — the diver's lodging ("dive shop with rooms").
- **Liveaboard** — a trip portion of the open-water days.
