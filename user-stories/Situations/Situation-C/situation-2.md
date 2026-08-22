# Situation 2 — Current reality

*Third-person, what-happens only. The **same busy week as Situation 1** — four parties on three courses across shared resources — run the way the industry runs today. The dive center and the instructors are on annnä; everyone else the bookings need is not, so when a piece falls out there's nothing to refill it and no shared view to reason over. TingTing does all of it by phone, both sides of every call, and the concurrent load makes it far worse than any single booking would. Who each player is lives in the setup stories (`resource-*.md`, `operator-*.md`) and the README cast. This spells everything out as if it were the only world there is.*

## The week's four bookings

- **Jun Wang** (Mandarin) — **O+A, 4 days**, solo. Medical-flagged.
- **James Thompson + 2 friends** (English) — **Open Water, 3 days**, a **group of three**.
- **Mei-Ling Chen** (Mandarin) — **Advanced, 2 days**, finishing out at Phi Phi.
- **Lukas Weber** (German) — **Advanced, 2 days**, also finishing at Phi Phi.

All four overlap in the same window and want the same instructors, the same pool, and the same single house boat.

## Sign-up

Each customer walks into Hug Ocean and TingTing enters them into annnä and clicks send; each gets a form link, taps it, fills out the forms. James's group and the two Advanced divers clear straight through. **Jun Wang's doesn't** — on the medical questionnaire he marks a past surgery.

## The medical gate

That answer trips a hard block in the app. Jun Wang can't move on to payment until he uploads a doctor's note — annnä says so on the screen and won't let him past it. He goes to a clinic, has the form signed, photographs it, and uploads the photo; annnä stores it in the cold vault — a Glacier-class store (`../../../security/SPEC.md §4`). He still has to bring the physical paper in, so he carries it to Hug Ocean and hands it to TingTing for the file. With the note uploaded, the block lifts and he continues to payment. *(This is the one piece the app handles end-to-end even here — because it's a rule inside Hug's own setup, not something that depends on an outside supplier picking up the phone.)*

## It assembles — then it cancels

On the app the bookings assemble: instructors, a divemaster, pool, gear, air, and boat all confirm green across the four courses. Then, through the day, the confirmations fall out one at a time — a tap on cancel here, an "actually, we can't" there. Each cancellation just leaves a hole, and nothing refills it. With four parties in flight at once, the holes pile up faster than one person can close them. TingTing picks up the phone.

## Instructors (own first, then the phone tree)

- **Jun Wang (Mandarin, O+A).** She starts with her **own** staff: **Wang Fang**, Hug's Mandarin instructor, is free, so she pencils Jun Wang onto her — one name, no calls. Own resource, used first.
- **Mei-Ling (Mandarin, Advanced), same days.** Now she needs a *second* Mandarin instructor for the overlapping dates, and her only own one, Wang Fang, is already on Jun Wang — **own isn't enough**. So she works the freelancer list by phone: **Li Ming**, first choice, rings out — on a boat, no signal. **Wei Chen** is booked and declines. **Matthew Lee** is free and says yes. Three calls to do by hand what the app resolves in a glance (own busy → next free freelancer).
- **James's group (English, Open Water).** English she covers in house: her **own Ploy Srisuk** takes the group — no calls.
- **Lukas (German, Advanced).** Here Hug is stuck. It has **no German instructor**, own or freelance, and it can't borrow another shop's staff — Hug's own are internal, and so is everyone else's. So she can't book him at all; she has to **refer him out**, phoning around German-speaking shops until **Scuba Quest** (which employs a German instructor, Lena) agrees to take him. She hands the booking off — the manual, lossy version of the referral the app makes silently.

Two in-house placements, one freelancer phone tree, one referral out — every search blind to the others.

## Divemaster

- James's three students on the water need a second pair of hands. Her **own divemaster Nok** is already assisting another Hug course that day — **own isn't enough** — so she works the freelance DMs: **Arisa**, first choice, is **booked** those days; she calls **Aroon**, who's free and takes it.

## Pool (Day 1)

- Hug Ocean's own pool is out that morning — the pump service ran long and the water won't be clear in time. She calls the nearest overflow, **Neptune** — capacity **6**, and between the students and instructors in the water it's too tight for the group. She calls **Water Pro**, whose capacity of 25 has the room, and Niran blocks the window off in his own book.

## Gear

- With the 40-strong club trip drawing on the same rental stock, Hug's own gear is short a size. She calls the first-choice shop, **Nicole Dive Center** — they don't have a mask in the diver's size. She calls **Scuba Revolution**. Ta has all the sets, packs them in each diver's sizes, and they'll be at the pool in the morning.

## Air (Day 1 tanks)

- Hug's compressor is tied up filling the club trip's forty tanks, so the pool-day fills have to come from outside. She calls **Chalong Pier** for the pool-day tanks. They're not filling this week. She calls **Scuba Market**. Prawit fills the day's tanks and sends them over.

## Boat — and the contention no phone can see

The morning of the open-water days, the house boat **M.V. Hug Ocean is oversold** — Hug's **40-strong club trip** to Racha filled it, and TingTing realizes only that morning that Jun Wang's O+A and James's group won't all fit aboard. Nothing had told her the seats were gone. She scrambles: she calls **MV Matchanu** (Aloha, 12 seats), which has room, and puts James's Open Water group on it to the same Racha site by hand. The house boat carries the club group and Jun Wang — one trip split across two decks, morning-of.

And she's not done — the Advanced finisher **Mei-Ling** needs **Phi Phi** that *same* day, and both Racha boats are going to Racha. One boat can't be in two places, and there was no shared schedule to have caught it weeks ago, so she finds it in the same scramble: she calls **Kittisak** on the **Mandarin Queen** (running PP that day, has room) to carry Mei-Ling's finish. Three boats stitched together by phone before 08:00 — one for the **overflow seats**, one for the **PP route** — each a call she only made because nothing showed her the clash coming. *(Lukas's finish isn't her problem — he was referred to Scuba Quest, which runs its own boat.)* *(In Situation 1 the app placed this same PP overflow onto the backup boat silently, weeks ahead.)*

## The days

**Day 1 — the pool.** Everything TingTing arranged by phone converges. Prawit's tanks and Ta's bags are at Water Pro by **08:30**, **Wang Fang** (for Jun Wang) and **Ploy** with **Aroon** (for James's three) are there at **09:00**, Niran's pool is held. Confined skills run through the morning, wrap by **~14:00**. **Mei-Ling** starts her Advanced out on the water with **Matthew**. It works — but only because she chased every piece. *(Lukas's German Advanced runs the same days over at Scuba Quest, off Hug's books.)*

**Day 2 — the boats.** Jun Wang rides the house boat (with the club trip) and James's group the Matchanu, both to Racha. Meet **08:00**, depart **08:30**, first open-water dives, back by **17:00**. James's three get through their skills. **Jun Wang can't** — he struggles with mask clearing and equalizing and doesn't complete the required skills. Wang Fang won't sign off on what wasn't done, so Jun Wang needs another day. And that evening **Wang Fang gets an ear infection** — she can't dive the rest of the course, so now even Hug's own placement has fallen out.

## Instructor, again (mid-course)

- With her own Mandarin instructor out, TingTing goes back to the freelancers. She calls **Wei Chen**, next on the list. No answer. She calls **Bear** (who speaks Mandarin). He's free for the remaining days and takes them. There's no shared record of where Jun Wang stands, so **Wang Fang** briefs Bear by phone from home — which skills Jun Wang has done, which dives are logged, and that he's behind.

## Adding the fifth day

Jun Wang's slipped day pushes his schedule back. James's group is still on track to certify on time, but Jun Wang now needs a fifth day to finish Open Water and get through Advanced — none of it booked. TingTing works the phone again:

- She calls **Kittisak** to add a fifth boat day for one diver. He fits Jun Wang onto that day's run.
- She calls **Ta** to hold Jun Wang's rental set one extra day.
- She confirms **Bear** can teach the fifth day too — he can.
- She re-writes the manifests for every remaining day around the change.
- Jun Wang has to sort his own extended stay and push his flight; that's on him, off the app.

## The rest of the days

**Day 3 — the boat.** James's group finishes their last open-water dive at Racha and **certifies Open Water**; TingTing writes the three certs into the paper file, and they leave. Jun Wang, now with Bear, re-runs the skills he missed. Meet **08:00**, back by **17:00**.

**Day 4 — the boat, Bear.** Jun Wang finishes his last Open Water dive and certifies, then starts Advanced the same day.

**Day 5 — the boat, Bear.** Jun Wang finishes the Advanced dives out at PP and certifies. Bear hands his paper logs and signed slates back to TingTing at the desk, and she enters them.

## The point

One week — four bookings, three courses, a five-day tail on one diver, and a boat that couldn't be in two places. And almost **every slot took two or three calls, not one**: the divemaster (own Nok busy → Arisa booked → Aroon), the pool (own full → Neptune too small → Water Pro), the gear (own short → Nicole no masks → Ta), the air (Chalong not filling → Scuba Market), the boats (house boat oversold by the club trip → James's group bumped to Matchanu for seats → Mei-Ling's PP finish to the Mandarin Queen for route), the instructors (Mei-Ling's Mandarin: Li Ming no-signal → Wei Chen declines → Matthew; Jun Wang's own Wang Fang → drops sick → Wei Chen no-answer → Bear). Two of the bookings Hug placed **in house** with its own staff, one it worked a **freelancer phone tree** for, and one — the German course — it had to **refer out** to Scuba Quest because it speaks no German and can't borrow another shop's staff. All told TingTing made **close to two dozen** phone calls, chartered a second boat the morning of, booked and re-booked a fifth day, re-wrote manifests three times, chased a mask across town, and briefed a replacement instructor by phone because nothing was written anywhere both could see. Every piece was patched by hand, one call at a time — and every "first choice" that fell through was a real, set-up supplier that simply couldn't. That's current reality.
