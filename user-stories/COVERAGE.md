# COVERAGE — every Situation beat against the layer that owes it

*`derived` tier. This file **states no law.** Every normative sentence in it cites the home that does (FR13), and where it records a gap or a deferral it names the ruling that made one — it never makes one. Where this file and a `SPEC` disagree, the `SPEC` wins (`../AGENTS.md` §Authority order).*

This is the promotion **FD-80** authorised in its own words — *"the Situation × layer map stays working material until promoted to one tracked coverage index"* (`../RULINGS.md` carries the row; the home is `../PRD.md` §6.5). Until now the map was working material under `docs/agents/`, which is gitignored and therefore **absent from every clone**: no reader outside the founder's own checkout could see which beats were covered, which were owed, and which were deliberately empty. Being tracked also puts every cell's citation in front of `deployment/scripts/cross-layer-cite.mjs`, which refuses a citation naming a `SCENARIOS.md` file and an ID that file does not define. The working map had no such check and carried four defects because of it; they are recorded under "What promotion caught" below.

**What this file is for, plainly.** Sofia's week and Hug Ocean's week are **fixtures**, never ship units (FD-80). Each beat is a test the *general* app must pass. Somebody opening `../engine/` should see "min-occupancy, ranked fallback, share seam" — not "build the dive-center product." If a Situation's column goes empty here because somebody read a release ruling as *"that use case is later"*, this index has failed at the one job it has.

**What this file does not do.** It does not say what *kind* of test a criterion becomes — that home is `../TDD.md`. It does not invent criteria: every cell points at something that already exists, or names the debt honestly.

## How to read a cell

The vocabulary is closed and is defined here.

| Marker | Means |
|---|---|
| **Covered** | An existing scenario or eval carries the beat, named by its ID. |
| **Gap** | An owed scenario beat, or a missing *general* primitive stated in the vocabulary the layer already speaks. |
| **None** | This layer has no obligation on this beat — with the reason, so "examined and empty" never reads the same as "not looked at". |
| **Deferred** | Named out of v1 by an existing ruling, which the cell names. Not a build hole. |

A family-form citation (`X-family`, the `N`/`A`/`R`/`Z` sets) claims coverage at the family's grain — the family's own rows carry the assertion — and is never shorthand for one specific row; a beat that needs a single row's assertion cites that row's ID *(qualified 2026-08-31)*.
| **Unruled** | The fixture asks the question and no ruling answers it yet. A missing ruling, never a missing scenario. |
| **Held-out** | Situation E only. Recorded, never gated on (`README.md` §Principles that apply here). |
| **Setup-only** | A stakeholder type with a setup file and no run of its own. See "Setup-only, no run" below. |

**A citation is `Covered` evidence only if the scenario asserts the beat's own claim.** The standing caveat is `deployment/scripts/probe-coverage.mjs`'s, printed by the gate itself: *"existence is mechanical, aboutness is a reading job."* A cell can resolve and still be wrong, and no gate here catches that.

**Two standing notes carried from the working map.**

- **Current-reality runs are `None` for every product layer.** `situation-2.md` in Situations A, B, C, D and E is the world *without* the app — the phones, paper, memory and message tag `README.md` describes. They are not omitted from this index by oversight; they have no product obligation to record, and they are excluded from the per-beat audit below for the same reason.
- **Scripted runs stay on this index.** By `README.md`'s provenance vocabulary a scripted run "cannot refute" the list it was written from, so it is never coverage *evidence* — but it can still test a layer, and dropping it here would hide a real test.

**The model column is not machine-checked.** `../model/` is graded through `../model/EVALS.md` and carries no `SCENARIOS.md`, so its cells name eval **sets** (`N-set`, `A-set`, `R-set`, `J-set`, `Q-set`, `S-set`, `Z-set`, `P-set` — enumerated in that file) rather than scenario IDs. `cross-layer-cite.mjs` resolves only `SCENARIOS.md` citations, so a model cell is prose a reader checks, not a citation a gate checks.

---

## Situation A — Sofia (elicited-blind; runs 4–5 scripted)

Beats collapsed from the setup files and runs 1, 3, 4, 5.

| Beat | Mode | harness | engine | app | model | marketplace | security | deployment |
|---|---|---|---|---|---|---|---|---|
| Set down once: life + teaching kind + pasteable link | elicited-blind | Covered — `../harness/SCENARIOS.md A1–A3`, `../harness/SCENARIOS.md B1–B2`, `../harness/SCENARIOS.md B4` (the console gold-reference), `../harness/SCENARIOS.md J5` (the personal preset stays personal — `[MUST]` since 2026-08-30) | Covered — `../engine/SCENARIOS.md T4` buffer, `../engine/SCENARIOS.md P6` duration, `../engine/SCENARIOS.md Q1` quota, `../engine/SCENARIOS.md M1` pattern if standing | Covered — `../app/SCENARIOS.md C1–C3` console/board; `../app/SCENARIOS.md D2` Generate Link | Covered — the N/A/R/Z sets seeded from this week's language (`../model/EVALS.md`) | None — authoring here runs through the agent, not an install. A′ is the install twin | Covered — an ordinary owner session (the T-family token walk) | None — no new door |
| Import cycle (Flow) | elicited-blind | Covered as *calendar* pull — `../harness/SCENARIOS.md B10` `import_fetch` | None — import is attended harness, not engine math | Covered — the I-family, calendar only | Covered — Q/S sets on imported free text | None | Covered — `../security/SCENARIOS.md T8` held calendar credential; `../security/SCENARIOS.md Q3` import is guest-class | Deferred if a calendar-provider egress row is forced (the existing FR36/FD-37 set) |
| **Non-calendar import (Flow, spreadsheets)** | elicited-blind | **Deferred** — `README.md` named gap 4 | None | **Deferred** — gap 4 | None | None | None | None |
| Buffer (run / teaching) | elicited-blind | Covered — `../harness/SCENARIOS.md B1`, `../harness/SCENARIOS.md B2` | Covered — `../engine/SCENARIOS.md T4`; `../engine/SCENARIOS.md A2` atomic with its neighbour | Covered — the board shows unavailability, never "run": `../app/SCENARIOS.md G1`, `../app/SCENARIOS.md G2` | Covered — N-set buffer utterances | None | None — no secret | None |
| Quota 10 h / month | elicited-blind | Covered — `../harness/SCENARIOS.md B5` | Covered — `../engine/SCENARIOS.md Q1`; `../engine/SCENARIOS.md Q4` cancel restores | Covered — `../app/SCENARIOS.md G10` manage-state quota standing, own marks only | Covered — N-set cap language | None | None | None |
| Duration floor / ceiling | elicited-blind | Covered — `../harness/SCENARIOS.md B9` | Covered — `../engine/SCENARIOS.md P6` | Covered — `../app/SCENARIOS.md G2`, the picker offers only legal ends | Covered — N-set "5-minute grab" | None | None | None |
| Delivery: Generate Link and paste | elicited-blind | Covered — `../harness/SCENARIOS.md D1` ask, `../harness/SCENARIOS.md D2` grant-or-confirm, and the floor on `send` | None — delivery is not math | Covered — `../app/SCENARIOS.md D1` email, `../app/SCENARIOS.md D7` LINE and `../app/SCENARIOS.md D8` WhatsApp door sends (FD-61/74), `../app/SCENARIOS.md D2` hand-me-the-link beside them; the auto-send investigation stays open at `README.md` gap 1 | Covered — R-set: outward is `narrate(structure)` | None | Covered — `../security/SCENARIOS.md T3`, `../security/SCENARIOS.md T4` token hygiene; `../security/SCENARIOS.md R2` send halt | Covered — a native-send provider lands as a named egress row under `../deployment/SCENARIOS.md S3`'s allowlist; the paste path forces none |
| Guest book (Bobby, Brownie) | elicited-blind | Covered — `../harness/SCENARIOS.md D5` guest form; `../harness/SCENARIOS.md D10` auto-accept Grant | Covered — `../engine/SCENARIOS.md P1` place; `../engine/SCENARIOS.md S1` board-blind; `../engine/SCENARIOS.md S2` attribution | Covered — `../app/SCENARIOS.md G3` pick→form→return, `../app/SCENARIOS.md G4` attribution, `../app/SCENARIOS.md G12` guest language | Covered — S-set on guest notes | None | Covered — `../security/SCENARIOS.md T1–T6` tokens; `../security/SCENARIOS.md Q1` hostile note; `../security/SCENARIOS.md P1`, `../security/SCENARIOS.md P2` leak | None |
| Race for the last slot | elicited-blind | Covered — `../harness/SCENARIOS.md A4` surfaces `conflict` | Covered — `../engine/SCENARIOS.md A1`, one winner | Covered — the guest sees "just taken" (the G-family page) | None — no language to invent | None | Covered — `../security/SCENARIOS.md R3` idempotent double-tap | None |
| Guest privacy (her life never leaks) | elicited-blind | None — projection is engine; the wire is app and security | Covered — `../engine/SCENARIOS.md S1` board-blind, and the money fence | Covered — `../app/SCENARIOS.md G1` wire leak test | None | None | Covered — `../security/SCENARIOS.md P1` diff leak; `../security/SCENARIOS.md P2` no cross-recipient | None |
| Student self-move | elicited-blind | Covered — guest manage is token-attributed; the owner is informed, never asked (`../harness/SCENARIOS.md H6`) | Covered — a move is an ordinary commit onto free space (the A-family commit checks) | Covered — `../app/SCENARIOS.md G10` cancel/move on the guest's own token | None | None | Covered — `../security/SCENARIOS.md T5`, attribution cannot cross | None |
| Cancel, consent, rebook, series | elicited-blind | Covered — `../harness/SCENARIOS.md D1` send gated; `../harness/SCENARIOS.md C1` cancel latch | Covered — `../engine/SCENARIOS.md B2` latch wins; `../engine/SCENARIOS.md M2` one instance; `../engine/SCENARIOS.md M1`, `../engine/SCENARIOS.md M3` series; `../engine/SCENARIOS.md K1` credit | Covered — `../app/SCENARIOS.md G11` standing series; `../app/SCENARIOS.md D5` no origination | Covered — R-set cancel copy | None | Covered — `../security/SCENARIOS.md S1–S3` consent evidence where a form gates it | None |
| Forward-only rate, mid-series ask | scripted | Covered — surfaces a `PendingDecision` (`../harness/SCENARIOS.md P2`) | Covered — `../engine/SCENARIOS.md P9` (FD-75); `../engine/SCENARIOS.md M3` forward-only | Covered — `../app/SCENARIOS.md C8` pending-decision card | None | None | None | None |
| No-show ask | elicited-blind | Covered — the owner's act; the engine never declares one (the N-family mark discipline) | Covered — `../engine/SCENARIOS.md K3`, `../engine/SCENARIOS.md K4` | Covered — the console card (the C-family console cards) | Covered — J-set, no invented charge | None | None | None |
| Ledger, mark settled | elicited-blind | Covered — `../harness/SCENARIOS.md N1` marks internal; `../harness/SCENARIOS.md N2` no value-transfer tool | Covered — `../engine/SCENARIOS.md K1`, `../engine/SCENARIOS.md K2` | Covered — `../app/SCENARIOS.md G10` own money on the manage token | None | None | None — records, never rails (`README.md` §Principles) | None |
| Read-back catch | scripted | Covered — `../harness/SCENARIOS.md K1` bounded attended verify | None — verify is harness | Covered — `../app/SCENARIOS.md C3` console present | Covered — A-set ambiguity; N-set "6:30 morning" | None | None | None |
| Rule-edit blast radius | scripted | Covered — proposes scope; `../harness/SCENARIOS.md D1` if it messages | Covered — `../engine/SCENARIOS.md G1`, `../engine/SCENARIOS.md G2` clash; no silent rewrite of the past | Covered — the proposal card (the C-family cards) | Covered — J-set, no silent apply | None | None | None |
| Draft a second kind (group class) | scripted | Covered — a reversible draft, `../harness/SCENARIOS.md B4` | Covered — `../engine/SCENARIOS.md B5` no-delete; a withdrawn draft stays in history | Covered — `../app/SCENARIOS.md C2` riser; a disabled draft publishes nowhere | None | Covered **as authoring** — `../marketplace/SCENARIOS.md I6` if saved as a bundle; **not** a catalog event | None | None |
| Wake / rest | scripted | None — display law | None — no time is invented | Covered — `../app/SCENARIOS.md C9`, `../app/SCENARIOS.md C10` (RQ-10/11 landed) | None — `../app/SCENARIOS.md U3` asserts zero model calls on render | **Gap (owed)** — RQ-12, a skin failing the rest-state measurement; `README.md` invented-and-justified register entry 4 | None | None |
| 3 a.m. budget park | scripted | Covered — `../harness/SCENARIOS.md K11` the ceiling park says budget (landed 2026-08-31, closing register entry 6's beat); `../harness/SCENARIOS.md C9` a park cannot self-clear | Covered — `needs_human` clears only by a human (`../engine/SCENARIOS.md B4`) | Covered — the parked card, attended finish (`../app/SCENARIOS.md C17`) | Covered — the unattended path is app-supplied (`../model/SPEC.md`; the P-set reliability floor) | None | None | None — the model key is vault material when live |
| History query ("what March made") | scripted | Covered — `calculate` / read, no new verb (the A-family tool-contract reads) | Covered — history rows persist, `../engine/SCENARIOS.md B5` | Covered — console read-back (the C-family console) | Covered — N-set history intents, no invented totals | None | None | None |

**A does not force:** min-occupancy · the share seam · the travel envelope · seats · `held` money · a marketplace install.

---

## Situation B — Sunbird rental (elicited-blind; some edges scripted)

| Beat | Mode | harness | engine | app | model | marketplace | security | deployment |
|---|---|---|---|---|---|---|---|---|
| Hold, checklist, auto-confirm | elicited-blind | Covered — `../harness/SCENARIOS.md C3` confirm; `../harness/SCENARIOS.md D5` form consent | Covered — hold plus preconditions, `../engine/SCENARIOS.md P1` | Covered — `../app/SCENARIOS.md G6` consent in the form; `../app/SCENARIOS.md G8` entry link → offering | Covered — N-set pull language | None — a fleet is live inventory, not a template | Covered — `../security/SCENARIOS.md S1–S3` consent; `../security/SCENARIOS.md R1` hold-spam; `../security/SCENARIOS.md V1` passport vault | None |
| Hold expires; a late document does not revive it | elicited-blind | Covered — `../harness/SCENARIOS.md C2` un-expire refused | Covered — `../engine/SCENARIOS.md B1` no un-expire | Covered — `../app/SCENARIOS.md G5` dead token | None | None | Covered — `../security/SCENARIOS.md T2` expired reuse | None |
| Race for the last unit, sibling alternative | elicited-blind | Covered — `../harness/SCENARIOS.md A4` | Covered — `../engine/SCENARIOS.md A1`; `../engine/SCENARIOS.md P2` honest decline with alternatives | Covered — "that one's gone", then the sibling offer (the G-family page) | Covered — R-set decline voice | None | Covered — `../security/SCENARIOS.md R3` | None |
| Early return → buffer from the actual end | elicited-blind | Covered — `../harness/SCENARIOS.md C6` `actual_end` | Covered — `../engine/SCENARIOS.md T4` buffer; `../engine/SCENARIOS.md A5` re-widening cannot double-book | Covered — the unit re-enters when the buffer ends (the C-family board) | None | None | None | None |
| License-class / attribute gate | elicited-blind | Covered — `../harness/SCENARIOS.md D5` preconditions | Covered — `../engine/SCENARIOS.md P4` domain/attribute; `../engine/SCENARIOS.md P2` no bike | Covered — `../app/SCENARIOS.md G3` form refusal | Covered — R-set honest no | None | None | None |
| Manage link (the walk-up) | scripted | Covered — guest manage; the owner is informed (the H-family guest flow) | Covered — an ordinary edit (the A-family commit checks) | Covered — `../app/SCENARIOS.md G10` | None | None | Covered — `../security/SCENARIOS.md T5`; `../security/SCENARIOS.md T7` an entry link is not a capability | None |
| Channel suppression | scripted | Covered — `../harness/SPEC.md §3.11`; `../harness/SCENARIOS.md D22–D23` (register entry 5 landed) | None — suppression is harness | Covered — `../app/SCENARIOS.md D3` complaint recorded | None | None | Covered — `../security/SCENARIOS.md R2` volume halt is the other wall | None |
| A named T&C late fee versus unnamed damage | elicited-blind | Covered — `../harness/SCENARIOS.md D8` document-derived basis | Covered — the K-family records only | Covered — `../app/SCENARIOS.md G6` | Covered — J-set, no invented charge | None | Covered — `../security/SCENARIOS.md S3` version of the document | None |
| **Deposit `held` mark** | elicited-blind | Covered — surfaces the refusal or the ask (the N-family mark discipline, `../harness/SCENARIOS.md N1`) | **Unruled** — every `held` write is refused until the deposit sitting rules it. The home that carries it open is `../PRD.md` §6.5, which lists *"unruled `held` deposit"* among what stays postponed at its own home. A missing ruling, never a missing scenario | None until it is ruled | Covered — the intent table refuses `held` (the N-set intent table) | None | None — no payment rails exist (`README.md` §Principles) | None |
| Walk-up public entry | elicited-blind | None extra | None extra | Covered — `../app/SCENARIOS.md G8` | None | None | Covered — `../security/SCENARIOS.md T7` | None |

**Late return** *(FDR-08, selected (A) 2026-08-30 — capacity consumed until `actual_end`)*: a completable commitment past its `end` with no recorded `actual_end` keeps drawing its capacity — `../harness/SCENARIOS.md C5` spares completables from automatic completion and `../engine/SCENARIOS.md A10` keeps availability and commit in agreement (FD-98). The early-return row above is the same member's other direction and is untouched by this note.

**B does not force:** the share seam · a multi-day KindTemplate · seats · the wake policy.

---

## Situation C — the Hug Ocean week (elicited-blind; `situation-6.md` scripted)

| Beat | Mode | harness | engine | app | model | marketplace | security | deployment |
|---|---|---|---|---|---|---|---|---|
| Multi-resource placement (instructors, pool, boat, gear, air) | elicited-blind | Covered — the loop plus the structured decline (the R-family routed dispatch); the week's employed-staff writes ride the owner session — a second seat would be OR-42's question, unruled, never covered here | Covered — `../engine/SCENARIOS.md P1`, `../engine/SCENARIOS.md P7` ranked fallback, `../engine/SCENARIOS.md P8` contention, `../engine/SCENARIOS.md P11` (a `party_size` predicated entry engages per the declared size — FD-55), `../engine/SCENARIOS.md W1–W4` per-day course, `../engine/SCENARIOS.md W9` spanning gear | Covered — `../app/SCENARIOS.md C2` assembly in the riser; `../app/SCENARIOS.md C11` expired certs | Covered — N-set place and decline | Covered as *shape* through `../marketplace/SCENARIOS.md F5` and `../marketplace/SCENARIOS.md Z2` — not this week's people | Covered — `../security/SCENARIOS.md N1`, `../security/SCENARIOS.md N2` tenancy | None |
| Min-occupancy / boat minimum party | elicited-blind | Covered — surfaces the `PendingDecision` (`../harness/SCENARIOS.md P2`) | Covered — `../engine/SCENARIOS.md O1–O4` | Covered — `../app/SCENARIOS.md C8` choices | None | Covered — `../marketplace/SCENARIOS.md F5` seed carries blanked minimums | None | None |
| Day-count ceiling | elicited-blind | Covered — surfaces the decline (the B-family picker refusals) | Covered — `../engine/SCENARIOS.md Q5` | Covered — surfaces it (the C-family console cards) | None | None | None | None |
| KindTemplate course expansion | elicited-blind | None extra | Covered — `../engine/SCENARIOS.md W5–W8` | None — expansion is engine | None | Covered — `../marketplace/SCENARIOS.md F5`, `../marketplace/SCENARIOS.md I4` | None | None |
| Share seam (the on-app freelancer) | elicited-blind | Covered — the I-family; clocked offer `../harness/SCENARIOS.md C8` | Covered — `../engine/SCENARIOS.md I1–I9` | Covered — surfaces the offer and the acceptance (the C-family trigger cards) | Covered — R-set offer copy | None | Covered — `../security/SCENARIOS.md N3–N5` the legal crossing (a share, never a referral) | None |
| Clocked offer cascade (Matthew → Bear) | elicited-blind | Covered — `../harness/SCENARIOS.md C8`; `../harness/SCENARIOS.md O5` off-app silence | Covered — `../engine/SCENARIOS.md I5`, `../engine/SCENARIOS.md I6` hold | Covered — surfaces the lapse (the C-family trigger cards) | None | None | None | None |
| **Referral to a stranger shop** | elicited-blind | **Deferred** — no seam exists. Do not record it as covered by the share seam | **Deferred** — `../engine/SPEC.md §7.1` is on-app only | **Deferred** | None | None | **Deferred** — the same legal question as other people's agents (FR1) | None |
| Prepared / assisted off-app call | elicited-blind | Covered — `../harness/SCENARIOS.md O1–O4` | None — preparation is harness | Covered — the call card (the C-family cards; the O-family's app half) | Covered — R-set: preparation is `narrate(structure)` | None | None — the owner places the call | None |
| Honest decline (no instructor) | elicited-blind | Covered — the loop narrates the structured decline (the R-family routed dispatch; decline detail at `../engine/SCENARIOS.md P2`) | Covered — `../engine/SCENARIOS.md P2` | Covered — surfaces it (the C-family console cards) | Covered — R-set names the constraint | None | None | None |
| Medical note, park for the owner | scripted | Covered — `../harness/SCENARIOS.md D4` park; the L-family quarantine | Covered — the park latch (`../engine/SCENARIOS.md B4`) | Covered — surfaces the park (`../app/SCENARIOS.md C17`) | Covered — S-set summarize; J-set no act | None | Covered — `../security/SCENARIOS.md V3` medical key and audit | None |
| Conversion / invite a prospect | elicited-blind | Covered — `../harness/SCENARIOS.md O3` invite, floor-gated | None extra | Covered — surfaces it (the C-family cards) | None | None | Covered — `../security/SCENARIOS.md N6` conversion adds no read power | None |
| **Second seat, evening desk, a narrower seat** | scripted | **Unruled** — OR-42. The sitting's recorded proposal (boards and grants, never job titles) sits in the ruling's own entry at `../security/SPEC.md §2`, as a proposal that sitting may keep, amend or replace; the employed-staff writes the elicited-blind `situation-1.md` and `situation-5.md` runs show are the same unruled question — they wait on OR-42, never on missing machinery | **Unruled** — no seat object exists today | **Unruled** | None | None | **Unruled** — OR-42's home is `../security/SPEC.md §2` | None |
| Omniscient one-pass week | elicited-blind | **Deferred** — `README.md` gap 5 (FD-60). What ships is per-goal placement with honest declines | **Deferred** as a *global* pass; `../engine/SCENARIOS.md W1` is the shipped mechanism | None | None | None | None | None |

**The failure mode this table exists to prevent:** if a release ruling is read as *"do not build C's primitives"*, these cells go empty and the index has failed — `../engine/SCENARIOS.md P7`, the O-family, the W-family, the I-family, `../engine/SCENARIOS.md Q5`, `../marketplace/SCENARIOS.md F5`, `../marketplace/SCENARIOS.md Z2`, `../security/SCENARIOS.md N3`. FD-80 settles the reading: what ships is the application, and a Situation is never a ship unit.

---

## Situation D — Debra (elicited-to-design)

| Beat | Mode | harness | engine | app | model | marketplace | security | deployment |
|---|---|---|---|---|---|---|---|---|
| An address on every commitment, and the travel gap | elicited-to-design | Covered — surfaces travel-unknown as a structured decline (the K-family read-back; detail at `../engine/SCENARIOS.md V4`) | Covered — `../engine/SCENARIOS.md T1–T3`, `../engine/SCENARIOS.md V1–V5` envelope | Covered — the guest picker hides unreachable, `../app/SCENARIOS.md G2` | Covered — N-set place language | None | Covered — addresses never reach the guest wire: `../app/SCENARIOS.md G1` is the wire test, `../security/SCENARIOS.md P1` the diff-leak wall | Covered — a travel provider lands as a named egress row (`../deployment/SCENARIOS.md S3`) |
| Site-day window (Eastside / Riverside) | elicited-to-design | None extra | Covered — `../engine/SCENARIOS.md P3` | Covered — `../app/SCENARIOS.md G2`, the day's place only | None | None | None | None |
| Compaction, direction asked each time | elicited-to-design | Covered — proposes; `../harness/SCENARIOS.md D1` for the outreach | Covered — `../engine/SCENARIOS.md X1–X7` | Covered — the proposal card and its confirm (the C-family cards) | Covered — A-set asks the direction | None | None | None |
| Pinned / will-never-move | elicited-to-design | None extra | Covered — `../engine/SCENARIOS.md X2` | Covered — the proposal card omits pinned placements (the C-family proposal cards) | None | None | None | None |
| A freed afternoon stays blocked | elicited-to-design | None extra | Covered — `../engine/SCENARIOS.md X5` | Covered — surfaces keep-blocked (the C-family cards) | None | None | None | None |
| Out-of-area refused at submit | elicited-to-design | Covered — surfaces the refusal (the B-family intake refusals) | Covered — `../engine/SCENARIOS.md P4` | Covered — the form refuses at submit (the G-family guest form) | Covered — R-set | None | None | None |
| Front door versus a named link | elicited-to-design | None extra | Covered — `../engine/SCENARIOS.md S2`, `../engine/SCENARIOS.md S5` | Covered — `../app/SCENARIOS.md G8` versus `../app/SCENARIOS.md G4` | None | None | Covered — `../security/SCENARIOS.md T5`, the Nathan beat | None |
| Cash marked settled | elicited-to-design | Covered — `../harness/SCENARIOS.md N1` | Covered — `../engine/SCENARIOS.md K1`, `../engine/SCENARIOS.md K2` | Covered — the console mark (the C-family console) | None | None | None | None |
| Race for the last Friday slot | elicited-to-design | Covered — `../harness/SCENARIOS.md A4` | Covered — `../engine/SCENARIOS.md A1` | Covered — the guest sees "just taken" (the G-family page) | None | None | Covered — `../security/SCENARIOS.md R3` | None |
| Patient privacy | elicited-to-design | None | Covered — `../engine/SCENARIOS.md S1` | Covered — `../app/SCENARIOS.md G1` | None | None | Covered — `../security/SCENARIOS.md P1`, `../security/SCENARIOS.md P2` | None |

**D does not force:** the marketplace · seats · min-occupancy · `held`.

---

## Situation A′ — the marketplace probe, solo half (scripted)

| Beat | Mode | harness | engine | app | model | marketplace | security | deployment |
|---|---|---|---|---|---|---|---|---|
| Need → suggestion (never a cold browse) | scripted | Covered — a proposal on a console turn only (the B-family elicitation, `../harness/SCENARIOS.md B6`) | None | Covered — the store suggestion arrives as a proposal (`../marketplace/SCENARIOS.md D5`; suite corrected 2026-08-31, F-31) | Covered — N-set need language | Covered — `../marketplace/SCENARIOS.md D5` | None | None |
| Ghost preview | scripted | None | Covered — `../engine/SCENARIOS.md S6` ghost fence (FD-34) | Covered — `../marketplace/SCENARIOS.md D3` preview *(suite corrected 2026-08-31, F-31)* | None — `../app/SCENARIOS.md U3` asserts zero model calls on render | Covered — `../marketplace/SCENARIOS.md D3` | None | None |
| Blanked-parameter install | scripted | Covered — propose, then confirm (the B-family walk) | Covered — writes are ordinary objects (the A-family applied-results) | Covered — the walk renders as cards (the C-family cards) | None | Covered — `../marketplace/SCENARIOS.md I1`, `../marketplace/SCENARIOS.md I2`, `../marketplace/SCENARIOS.md F4` | None | None |
| Uninstall keeps the bookings | scripted | None extra | Covered — commitments stand (the B-family latches) | Covered — surfaces it (the C-family cards) | None | Covered — `../marketplace/SCENARIOS.md I5` | None | None |
| **"Publish so other teachers can use it"** | scripted | None extra | None extra | Covered — the authoring path's own surface (the U-family catalog rendering) | None | Covered — `../marketplace/SCENARIOS.md P2` owner-publish (FD-82) | Covered — `../security/SCENARIOS.md M2` two paths, one per good: templates through the owner's own session, skins through the admin pack pipeline | None |
| Noticed-pattern offer | scripted | Covered as *mechanism* — `../harness/SCENARIOS.md B6–B8`. **Beat owed** when A′ is next extended | Covered — an ordinary Rule (the A-family diff commits) | Covered — `../app/SCENARIOS.md C7` | None | None | None | None |
| Purchasable skin / RQ-12 | scripted | None | None | Covered — the S-family appearance surface | None | Deferred with its machinery (FD-50 — history; the live home is `../PRD.md §6.5`); **Gap (owed)** — RQ-12's rest-state refusal | Covered — the E-family entitlements (`../marketplace/SCENARIOS.md E4`) | None |

---

## Situation C′ — the dive-bundle install (scripted)

| Beat | Mode | harness | engine | app | model | marketplace | security | deployment |
|---|---|---|---|---|---|---|---|---|
| Install the dive seed into an empty account | scripted | Covered — propose, then confirm, at scale (the B-family walk) | Covered — `../marketplace/SCENARIOS.md I4` compile ≡ hand; `../engine/SCENARIOS.md W5–W8`; the O-family operands | Covered — the walk renders as cards (the C-family cards) | None | Covered — `../marketplace/SCENARIOS.md F5`, `../marketplace/SCENARIOS.md I4`, `../marketplace/SCENARIOS.md I8` session at scale, `../marketplace/SCENARIOS.md Z2` | None | None |
| A tampered bundle refused whole | scripted | None extra | Covered — off-menu is unstorable (`../engine/SCENARIOS.md G8`); a tampered entry refuses whole at the door | Covered — nothing is rendered (the U-family rejected-render path) | None | Covered — `../marketplace/SCENARIOS.md F1–F3`, `../marketplace/SCENARIOS.md I3` | None | None |

---

## Situation E — the ER (held-out)

**Every beat is `Held-out`: record, never gate.** The harness J-family carries the probes when its build step exists. `../engine/SCENARIOS.md P2`'s safe park may *record* a cousin of E's park; type-match admission, competitive bids and live re-solve of an active commitment are never promoted into acceptance. The reason is `README.md`'s, in its own words: *"a target you build toward can only ever confirm you built toward it."*

| Beat | Status |
|---|---|
| Type-match before capacity | Held-out. A named limit if it fails, under `README.md`'s failed-probe rule |
| A competitive losing bid | Held-out |
| Re-solving an already-active commitment | Held-out |
| A safe park with no basis and no human | Held-out — a cousin of `../harness/SCENARIOS.md D4` and `../harness/SCENARIOS.md K2` *(suite corrected 2026-08-31 — the unattended-park K2 is the harness's; engine K2 is marks-latched)*; E is never retconned into v1 |
| Ordering over principals — who the re-solve asks first when the queue moves | Held-out *(row restored 2026-08-31, Q1-16 — the shape E exercises and this table had dropped)* |

---

## Setup-only, no run

Six stakeholder types in Situation C, and one in Situation B, have a setup file and no run told from their own board. This column records the shape honestly rather than minting a rule that says every board-holding type gets one — that rule would be **structurally unsatisfiable while FD-68 stands**, and a rule the corpus is required to violate is worse than a named exception, because the violation stops being visible. `README.md`'s provenance table already carries FD-68 as the standing exception, in the ruling's own row.

| Stakeholder type | Setup file | Run of its own |
|---|---|---|
| Freelance instructor | `Situations/Situation-C/resource-instructor.md` | **None, and permanently so.** FD-68 holds the founder's own freelance life out as the product's first live test and forbids both eliciting it and drafting a fictional stand-in. The offer-collision, structured-decline and receivables run has no probe until that live test *is* the probe. FD-63's dogfood run is where it lands |
| Divemaster | `Situations/Situation-C/resource-divemaster.md` | None — its board behaviour is the freelancer shape above |
| Boat | `Situations/Situation-C/resource-boat.md` | None — exercised through the C week's placements |
| Pool | `Situations/Situation-C/resource-pool.md` | None — same |
| Gear | `Situations/Situation-C/resource-gear.md` | None — same; the spanning consumption is `../engine/SCENARIOS.md W9` |
| Air | `Situations/Situation-C/resource-air.md` | None — same |
| Agent | `Situations/Situation-C/operator-agent.md` | None — the agent's acts run through the C week's runs |
| Bike | `Situations/Situation-B/resource-bike.md` | None — exercised through B's runs |

---

## RQ-1 to RQ-9 — reachable without our glass

These nine requirements are **not** missing *product* beats on Situations A through D, and they are not to be recorded as such. `../PRD.md` §2.4 states the fact they rest on: *"Every Situation in the corpus has a human at a console; none has an agent as the caller."* The harness X-family and `../security/SCENARIOS.md T9` specify the tool contract and the credential; they prove the *foundation* another party's agent would need. They do not prove that owners live inside somebody else's client, and they do not admit a second legal person (FR1).

`../PRD.md` §4.6 records all nine as `owed — ` with what each owed probe must show. That is the authoritative register; this index does not restate the rows.

## Deployment forces almost nothing

A beat forces `../deployment/` only when it opens a **door**: an egress allowlist entry (a calendar provider, a travel provider, a chosen messenger, the model router), a vault or runtime secret, or a rung. Paste-the-link, engine math and console cards force **none**. Model-router keys are a provisioning chore, not a Situation beat.

## Open items this index must not lose

Each names the home that carries it. None of them is created here.

1. **Unruled — the `held` deposit** (Situation B). `../PRD.md` §6.5 lists it among what stays postponed at its own home. Sofia's teaching does not need it.
2. **Unruled — the second seat, OR-42** (Situation C `situation-6.md`). Home `../security/SPEC.md §2`. The teaching week needs no second seat, and C's row here must not go empty because of that.
3. **Unruled — the monthly-base start** (Situation A, the enrolled/monthly question). FDR-07's selection (2026-08-30) is the recorded deferral: what act starts a monthly base — and whether it needs a series — is an open ruling, and no start act is invented meanwhile. Home: the founder register's FDR-07 row.
4. **Deferred — referral to a stranger shop (FR1)**, and other people's agents. The same legal family.
5. **Deferred — native send.** The floor stays Generate Link and paste; the investigation is open at `../app/NOTES.md`.
6. **Deferred — non-calendar import.** `README.md` gap 4.
7. **Deferred — the omniscient week** (FD-60, `README.md` gap 5). `../engine/SCENARIOS.md W1` is the shipped mechanism, never a defect.
8. **Owed — RQ-12**, a skin failing the rest-state measurement. `README.md` register entry 4.
9. **Owed — the noticed-pattern beat** on Situation A′. `README.md` register entry 1.
10. **Owed — the escalation ladder beat.** `README.md` register entry 2: it is owed when a v1 Situation earns a ranked list, which no current protagonist has. Writing it first would be designing to the mechanism.
11. **Investigation, not a Situation — how to application-test the owner's own agent** without our glass. RQ-1 to RQ-9 above.

## Every bolded beat, audited

The tables above map a Situation's *major* beats. This section is the exhaustive pass beneath them: **every bolded phrase in every story file, classified and disposed.**

**The extraction set is 39 files** — every tracked file under `Situations/` except the seven folder `README.md` storybooks (they summarise the runs, so their beats are duplicates by construction) and four of the five `situation-2.md` current-reality runs (the world without the app, `None` for every product layer by this file's own standing note) — **Situation C's `situation-2.md` is the named exception** *(2026-08-31, Q1-09: it depicts partial adoption, not an app-free world; its beats are read, and they dispose to the assisted off-app machinery the O-family already asserts — the exclusion note was over-broad, the disposal is now recorded)*. Those 39 hold **1,104 bolded phrases** *(recount 2026-08-31 — the prior 1,107 over-counted by three)*, every file carrying at least six. *(Counting rule, stated so the number reproduces: a bolded span on a single line, at least four characters. A looser rule that lets a span run across a line break, and counts two- and three-character emphasis, gives a larger number.)*

**The whole body of each file is read, not a heading section.** Only three files — `Situation-A/situation-3.md`, `Situation-B/situation-3.md`, `Situation-D/situation-3.md` — carry the explicit `## Must work` / `## Must be refused / handled` pair; they hold 120 of the 1,107 phrases. The other thirty-six state their beats inline in narrative prose. Anything reading this corpus must handle both forms: a heading-gated pass sees 11% of the surface and then reports perfect coverage over it, which is a false green, not a result.

**The result.**

| | Count |
|---|---|
| Files in the extraction set | 39 |
| Bolded phrases classified | 1,104 *(recount 2026-08-31)* |
| **Beats** — a claim about what the system must do, refuse, show, or never do | **422** |
| **Emphasis** — weight on a name, price, place, time, quantity or story-colour noun | **685** |
| Beats disposed to an existing scenario | 351 |
| **Beats recorded as owed** | **70** *(recount 2026-08-31: −2 budget-ceiling closed by K11, +1 erasure originator)* |

**A stated bound on this audit** *(the bounded-sentences arm, 2026-08-31 — Q1-17's licensed outcome)*: every count in this section is the audit's own reading tally — corrected where the recount differed, bounding the classification rather than re-deriving it; a checker can hold the cell vocabulary and the citations, never these sums. Beat-versus-emphasis is a reading judgement, and the boundary is genuinely fuzzy at the margin: a bolded configuration value (*"6-hour buffer"*) names a quantity and also implies the rule that applies it. The convention taken is that bolded names, prices, times, quantities and configuration values are emphasis, and only a claim about system behaviour is a beat. Marginal cases were called toward emphasis. What this audit establishes is that 422 beats are individually disposed and 71 debts are visible — not that the boundary is exact. The deeper bound is `probe-coverage.mjs`'s and it applies to every `Covered` cell above too: existence is mechanical, aboutness is a reading job.

**Situation E is disposed `held-out` throughout**, per `README.md`'s principle and this file's E table. Five of its beats name a genuine v1 cousin — all of them the *park-don't-guess* floor, `../harness/SCENARIOS.md D4` — and each is written as *"held-out — cousin of …"* rather than as a citation, because a bare citation would read as E having been promoted into acceptance. The four shapes E was deliberately not designed to are cited to nothing at all.

### The 71 owed beats, by what each one is — 70 on the 2026-08-31 recount *(−2 budget-ceiling closed by K11, +1 erasure originator; the genuine-gap note below carries the same correction)*

**44 are genuine coverage gaps** — a beat no scenario asserts *(recount 2026-08-31: the budget-ceiling pair closed by `../harness/SCENARIOS.md` K11, the erasure originator beat added)*. They cluster into fifteen elicitation subjects; the cluster, not the individual beat, is what a brief is written against.

| Subject | Owed beats | What the missing scenarios must assert |
|---|---|---|
| **Qualification and language matching** | 12 | That `resolve` places a customer only with a resource whose declared teaching language and specialty rating actually cover the request — and that spoken and written language are separate axes, so a resource who speaks Mandarin but does not type it still matches on the spoken axis. Also that a rating checked against loaded agency standards opens some roles and closes others: a Divemaster-rated resource guides and assists but is refused a certifying role, as a limit derived from a loaded document rather than a hardcoded app rule. The coverage basis exists — §3's `admission` comparator (`../engine/SPEC.md §3`) is the menu entry these beats would exercise, and `../engine/SCENARIOS.md P4`'s attribute refusal shows the refusal shape, exemplified only by address — but no definition row exercises `admission` with a language or a rating, and that unexercised entry is exactly this debt *(narrowed 2026-08-31 — the prior "nothing in any suite" overstated: the comparator and the refusal shape are both in the suites; the assertion is what is missing)* |
| **Cross-tenant routing through an agent** | 6 | That an agent tenant holding no resources of its own resolves against a *ranked list of other tenants*, falls to the next when the first cannot take it, and returns an honest decline once the list is exhausted. `../engine/SCENARIOS.md P7`'s ranked fallback is single-owner and board-internal; the share seam handles one counterparty, never a ranked list of them |
| **Resource-form equivalence across operator kinds** | 4 | That a dive center's owned boat, pool or gear, filled through the identical form, produces a structurally identical stored object to a standalone operator's — the claim that makes "one general primitive" true rather than asserted |
| **The guest's pre-commitment view** | 4 | That the guest's *booking* page shows the price terms and their own running month before they commit, and that the confirmation never reveals which unit or which person was assigned, that somebody lost a race for it, or what happens after return. `../app/SCENARIOS.md G10` asserts the money and quota render on the post-booking manage page only |
| **Declared capability as a placement limit** | 3 | That a resource is placeable only for a capability it has explicitly configured — the limit is §2's declared-attribute machinery (`attribute-domain` comparison over the resource's own declared attributes, `../engine/SPEC.md §2`–`§3`), never a hardcoded noun list *(restated to the atom 2026-08-31)* — exemplified by a gas mix it declared, a gear pack complete in every required type and size, a boat whose own compressor satisfies the air requirement without a separate air resource |
| **Employment exclusivity** | 2 | That an employed instructor or divemaster is reachable only through their employing center's bookings and never surfaces in the open freelance market's ranked matching |
| **Certification written on course completion** | 2 | That completing a course's required dives yields the certification **as a status derivation** — derived from the stored record of completed commitments, the way `completed` and `owed` derive, never a side-effect write at the wrong evaluation point *(restated 2026-08-31)*. The debt is the missing assertion, not a missing concept: the precondition and attribute machinery can already read such a fact once it exists *(narrowed 2026-08-31 — the prior "no layer names it anywhere" overstated)*. Whether the certification atom is a stored fact, a derived state, or an outside record is **deferred to the `what-the-record-carries` sitting** (FDR-14) — this row asks, it does not presume |
| **A cascade inherits the record** | 2 | That when a job cascades to a replacement after an offer lapses, the new assignee's context carries the commitment's full stored history with no separate human handover. `../engine/SCENARIOS.md I1` and `../harness/SCENARIOS.md C8` assert the offer-and-accept step only |
| **The budget ceiling that produces a park** | 0 | That a firing hitting its declared step-and-spend ceiling parks rather than erroring or running on, and that the parked card names the budget as the reason — **both beats closed 2026-08-31 by `../harness/SCENARIOS.md K11`** (this row survives as the closed-debt record; the prior text rested on a C9 cite that asserts only the no-self-clear half) |
| **Precondition provenance** | 2 | Which preconditions derive their gating basis from the operator's own uploaded documents versus from an outside legal standard, and that the two gate differently; and that a document-type precondition blocks intake until it is satisfied |
| **The decline that offers the next opening** | 1 | That a structured decline caused by a scarce qualification — one instructor holds the rating and is busy — offers the next date that person is actually free. `../engine/SCENARIOS.md P2` asserts the honest decline itself and `../engine/SCENARIOS.md A1` offers alternatives only for a capacity race; neither asserts this |
| **The owner's own ledger surface** | 1 | That the owner's board renders the aggregate — *"who owes me what, this month, right now"*. The guest-side money render and the engine's derived `owed` are both asserted, and the live board projection already reaches the owner — only the aggregate render itself is unasserted *(narrowed 2026-08-31: the missing piece is one surface, not a missing money model)* |
| **The guest's erasure request** | 1 | That a guest-originated deletion request has an originator and a surface: `../security/SPEC.md §12` already writes the path (guest → operator → annnä ops, manual-with-tooling during alpha) and `../security/SCENARIOS.md V4` walks the shred — the owed beat is the story that probes it end to end from the guest's side *(row added 2026-08-31 with the routed-out finding's correction below)* |
| **Instance versus series** | 1 | That the agent asks whether cancelling a recurring booking means this one or the whole series, before acting. Distinct from the general ambiguity law and from the latch mechanics |
| **Windows, edits and rollovers** | 3 | That a monthly quota stands full again when the month turns (cap enforcement and cancel-restoration *within* a window are asserted; the boundary reset is not) · that per-language guest copy is hand-authored and never model-translated (FD-56) · that a rule authored by one named admin binds identically to a booking taken by a second |

**15 are `UNRULED` — open ruling OR-42, the second seat.** Every one is a question `Situation-C/situation-6.md` and `operator-dive-center-second-seat.md` deliberately ask and no ruling answers: whether a second seat reads the identical board object · what act class *adding a seat* is · whether standing authorizations are board-scoped or person-scoped · what makes a non-founding admin's confirmation satisfy the singular-written floor · whether a narrower seat is a platform type or configuration on the same primitive. These are **missing rulings, never missing scenarios**, and no scenario should be written for them. The home is `../security/SPEC.md §2`, which carries the sitting's recorded proposal. The employed-staff writes shown by the elicited-blind `situation-1.md` and `situation-5.md` runs wait on the same ruling — attributed here so those two runs read as evidence for OR-42's questions, never as covered staff machinery.

**11 are `DEFERRED` — FR1, referral to a stranger shop.** Situation C's German and Drysuit hand-offs through the agent, and the commission that would ride them. No seam exists and none is owed: `README.md` gap 2 defers the referral flow, and `../engine/SPEC.md §7.1` is on-app only. The share seam is **not** coverage for these — it reaches suppliers already on annnä, across account lines, and that is a different act.

**Zero beats contradicted a `SPEC` invariant.** Every disposition that could have become a finding resolved to existing law instead.

**FD-68's carried limit produced no rows, and that is worth saying.** The freelance supplier's own board — an offer colliding with their own life, two centers reaching them at once, receivables across counterparties — is the corpus's largest permanent gap, and the ruling forbids both eliciting it and drafting a stand-in. It produced no owed row because `Situation-C/resource-instructor.md` is a setup file: its bolded phrases are template, rating, language and acceptance-mode content, and the beats FD-68 forbids never appear in it to be extracted. The gap is real and is recorded in the "Setup-only, no run" table above, where it belongs; the audit simply does not reach it. **Nothing about this is an invitation to close it.**

### One finding routed out of this folder

**A guest's erasure request has no originator, no surface and no story.** Guests are the corpus's most numerous data subjects and are never users. `../security/SCENARIOS.md V4` walks a deletion request end to end — vault shred, per-subject key destruction, backup age-out, a completion attestation naming all three — but names **nobody who asks**. And `../security/SPEC.md §12` already writes the path — a guest asks their operator, the operator relays it to annnä ops, and ops walks the erasure to V4's completion attestation, manual-with-tooling during alpha, stated honestly. Confirmed open at this audit, restated truly *(2026-08-31 — the prior sentence claimed §12 named no originator, which was wrong and would have sent the security owners to author law already written)*: the residue is two halves — no story under `user-stories/` probes the path from the guest's side, and no owner-facing surface exists, deliberately, while §12 keeps it manual. The beat is recorded owed in the table above.

This is recorded as a **finding for the security pillar's owners**, not fixed here. The missing piece is a surface and an originator, which is a `SPEC` question this folder does not own — and until it has one, the story that would probe it cannot be written either, because there would be nothing for the guest to do.

## What promotion caught

Five defects the working map carried, invisible while it sat gitignored outside every gate's reach. Each is recorded rather than quietly fixed, because the same class will recur.

1. **`U3` was filed under the model column.** `U3` is `../app/SCENARIOS.md` U3 — *"the same stored schema rendered twice produces identical output with zero model calls"*. The cell's *meaning* was right (the model does nothing on render) and its attribution was wrong; `../model/` carries no `SCENARIOS.md` at all.
2. **`C6` was filed under the engine column** for Situation B's early return. `C6` is `../harness/SCENARIOS.md` C6, the `actual_end` write. The engine's coverage of that beat is `../engine/SCENARIOS.md A5`, which the same cell already named.
3. **`G1` was filed under the security column** for Situation D's addresses. `G1` is `../app/SCENARIOS.md` G1, the board-blind wire test. Security's own wall on that beat is `../security/SCENARIOS.md P1`.
4. **A closed collision was still recorded as open.** The map held *"publish so other teachers can use it"* as a collision between a marketplace admin-only publish law and an ordinary-user publish. **FD-82 closed it** — anybody can publish a template — and both cited scenarios were rewritten to match: `../marketplace/SCENARIOS.md P2` is now owner-publish and `../security/SCENARIOS.md M2` states the two paths, one per good. The map's own `Collision` marker has no live instance left, which is why it is absent from this file's vocabulary.

5. **A `Covered` cell carrying no citation at all.** The 2026-08-31 census pass found **24** ID-less `Covered` cells (and 32 cells opening off the closed vocabulary) — the wrong-column class in its ID-less form, invisible to every citation checker because there is nothing to resolve. All were re-cut with family or ID cites, and the census programs preserved in the audit record (the A-1 cell grammar, the A-2 Mode register) are now the guard: a checker that asserts what a cell must be *about* catches the absent citation a resolver cannot see.

The first three are one class: a bare scenario ID written in the wrong column. Nothing could catch them because the file was gitignored, and `cite-check.mjs` drops path-qualified references by design while `cross-layer-cite.mjs` never saw an untracked file. Writing every cell in the path-qualified form is what makes this index defend itself.
