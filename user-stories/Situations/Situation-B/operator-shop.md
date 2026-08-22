# Operator setup — the rental shop

*How a rental shop sets up on annnä, told through **Ploy Suwan** at **Sunbird Motorbikes**. An operator is a *taker*: it owns resources and puts them in front of customers. But unlike the dive center, Sunbird doesn't assemble a booking by hand — it **publishes an inventory link and lets the customer pull.** Ploy owns the whole fleet, so she adds it through the **same bike form** a standalone unit would fill (`resource-bike.md`). The generic rental template and any legal standards are already there; she tailors them. Third-person, what-happens only. **annnä is the app and the agent both.***

## Who

**Ploy Suwan**, owner of **Sunbird Motorbikes** (Rawai, Mueang Phuket; est. 2021). One shop, one person at the counter, a fleet of about forty — mostly automatic scooters, a few maxi-scooters, and two license-gated CBRs. No staff, no second location.

## Setting up

**Signing up.** Ploy creates her annnä account through the browser — email, password, app language **Thai**; the app runs in that one language throughout.

**Landing.** She lands on the board, all in Thai, empty. In the console she says she wants to set up Sunbird Motorbikes. annnä already has a generic **rental-shop template**, made by the admin — the same one every rental shop starts from — and the page fills with it, console on top.

**What's already there.** The **template** is the generic rental scaffold. The **documents** are separate supporting files: Ploy uploads Sunbird's **terms & conditions** and its **deposit policy**, and annnä loads the **legal license standard** (a valid driving license; motorcycle class for big bikes). From these annnä already knows the shape of a rental — a hold that can expire, a checklist that gates confirmation, a buffer after return — and it holds the T&C as a ready-made signable and the deposit as a represented amount. Everything she tailors sits on the template and is bounded by the documents.

**Hours.** She fills in Sunbird itself: **opening hours** (counter 08:00–19:00) — pickups and returns happen inside these hours.

**The fleet.** Ploy adds every unit through the **bike form** (`resource-bike.md`) — the exact form a standalone unit would fill, the difference being only that the result sits under Sunbird. Per unit she sets the **1-hour hold window**, the **6-hour buffer**, the **four preconditions** (passport, license, signed T&C, deposit), Auto acceptance, and photos. On the two **CBRs** she adds the extra precondition the legal standard supplies — the license must be **motorcycle-class**. The template won't let a pull confirm with the checklist incomplete; that gate comes from the setup, not from Ploy watching the counter.

**Acceptance is Auto — the customer drives it.** Ploy does **not** approve rentals. She sets acceptance to **Auto**, which means a traveller can **pull a bike themselves** off the public link, and a completed checklist inside the hold window confirms the rental with no human in the loop. This is the whole difference from the dive center: Sunbird publishes, the customer assembles.

**Rules and prices.** The 6-hour buffer from actual return; **no double-booking** a unit (a live hold blocks it); daily/weekly prices in the currencies she takes; the deposit amount from her policy; damage handled as a later, consent-gated charge, never automatic. **Money is tracked, never moved:** a confirmed rental writes what the traveller owes at the unit's rate; Ploy marks it paid when the cash crosses the counter, and the deposit sits as a record beside it — annnä counts every baht and touches none of them.

**The customer form.** annnä assembles the self-service page — the bike photos and prices, and the checklist a pull opens: **passport upload, license upload, T&C to sign, deposit to place.** She sets no medical or extra gates beyond the license. annnä builds the no-account customer page and **freezes it**, so every traveller gets the identical thing.

**Publishing.** annnä generates Sunbird's **public inventory link**. Ploy puts it on the shop's sign, its LINE profile, and its listings. From here the counter runs itself: a traveller opens the link, sees the live fleet (units in a hold or a buffer aren't pullable), and pulls one.

**Set up.** Sunbird Motorbikes now has its whole fleet added through the bike form, each unit carrying its hold window, buffer, preconditions, and Auto acceptance; its hours, prices, and deposit rule; the extra motorcycle-class gate on the two CBRs; and a frozen self-service page behind a public link — all tailored from the admin's rental template and Sunbird's own documents plus the legal standard.

## The booking (self-service pull)

There is no walk-in-to-desk assembly here. A traveller opens the public link, browses the live inventory, and **pulls a bike**. That pull is not a rental — it's a **hold**: the unit leaves inventory at once (no one else can pull it) and a **1-hour clock** starts. Inside the clock the traveller works the checklist — uploads passport and license, signs the T&C, places the deposit. When all four clear, the hold **confirms itself** into a rental (Auto). If the clock runs out first, the hold **releases** and the unit returns to inventory as if the pull never happened. When a rented bike comes back, it enters its **6-hour buffer** from the actual return before it can be pulled again. On a busy afternoon several travellers pull off the same link at once and draw on the same fleet — where the hold-blocking and the buffers do real work.

## In the situations

- **Situation 1 (clean):** four travellers pull over an afternoon; every hold clears in time; concurrent pulls each land a free unit; a race for the last scarce NMAX resolves to one; a return re-enters after its buffer.
- **Situation 2 (current reality):** no app — Ploy holds bikes by memory, double-books an NMAX, keeps the buffer in her head, and can't see her own contention.
- **Situation 3 (the edges):** a hold expires and releases; a late document doesn't revive it; a race resolves to one winner; a buffered bike is refused; early and late returns both track the real time (the late fee already authorized by the signed T&C); a rule change touches only future pulls; the two CBRs both out (or a non-motorcycle license) returns **no bike available**; a charge without captured consent is refused; a walk-up guest manages his own rental from his own manage link, Ploy informed, never asked *(scripted, 2026-08-22)*; and a guest who cried spam becomes honestly unreachable — one complaint suppresses the channel, the failed notice reported unsent and composed for Ploy to deliver herself *(scripted, 2026-08-22)*.
