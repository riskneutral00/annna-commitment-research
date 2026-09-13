# IDENTITY — who annnä is

*Status (2026-08-31, F-33 — this sentence sits outside the PR freeze by the freeze's own derived-copy carve): written present-tense by craft for the founding **cohort**, ahead of any public surface — the three surfaces §6.2 qualifies do not exist yet, and this file's present tense is voice, not a claim that they do.*

*The source document. Every outward statement — landing page, repo, pitch, store copy — derives from this file. If a claim isn't grounded here, it doesn't ship.*

---

## Purpose (why it exists)

**annnä exists to bring peace.**

Not productivity. Not scale. Not output. The product succeeds when its owner's life gets quieter — when the coordination that used to eat their day is gone, and the schedule that used to crowd their head is held somewhere trustworthy instead.

## What it is (the sentence every outward surface opens from)

> **annnä is an agent-first commitment harness.**

*Grounded here 2026-08-08 so the claim can ship; the full definition and its requirements are `../PRD.md`.* **Agent-first** in two senses at once: a person states intent and an agent does the work, and the person's own agent can call annnä directly through the same tools the app uses, under the same permissions. **Harness** in both of its ordinary senses: what you put on something powerful so it can be steered, and what a person clips into so they cannot fall. The agent is harnessed — it can say a number, and nothing correctness-critical will accept one. The owner is harnessed — nothing reaches another person without their explicit yes.

## The promise (what we say it does)

> **The goal is for your schedule to feel like there is nothing on it.**

A full life that feels like almost nothing. An empty day is a photograph. Five commitments are five small pieces of glass resting on it — not a wall of blocks from midnight to midnight.

## Mission (how it delivers, honestly)

The peace is engineered, in three steps:

1. **It takes the work.** You tell annnä what you sold, what you promised, what you need. It does the coordination a person would otherwise do by hand — assembling the people and resources, checking the numbers, collecting the documents, confirming with everyone. The same problem stops costing you time.
2. **It takes the worry.** Because every commitment lives on one governed board — personal and professional, yours and your family's — your head no longer has to be the place where the schedule is kept. What the mind can put down, it puts down.
3. **It quiets the looking.** A board that holds a whole life holds a lot, and peace would die at the glance if the whole of it shouted at once. So the board rests. Everything is there — nothing hidden, nothing ranked for you — and the day reads at the level you set. When something true happens, it is on the board when you next look — the one thing changed, the rest still at rest. Nothing wakes on its own: a block wakes to your own attention, and the board settles around it. *(This became outward copy only when the mechanism existed to back it — 2026-08-22, on the standing rule that a claim ships grounded or not at all; the self-waking reading was corrected in place 2026-09-13 to what `../PRD.md` RQ-11 already requires — "Engagement remains governed by attention alone" — in this source document, which `PR/README.md` identifies as outside the PR freeze, remediation audit R-05, unit U59.)*

The order matters and is honest: first the labor leaves, then the load, and what stays in view learns to be quiet. The blank feeling is a quiet mind, not an empty life.

## Vision (where this goes)

A few years in, the relationship inverts. You stop placing commitments; you state them. Because annnä holds the whole picture — how you use your time, your habits, your standing promises, your goals — a new commitment arrives as a proposal already shaped to your life: *here is where it fits.* You accept it because it matches so well. Stating intent and saying yes becomes the entire job of running a schedule.

## The thread underneath (liberties)

In Go, the oldest game in the world, the empty points beside a stone are called *liberties* — in the East Asian terms, its *breaths*. A stone with no liberties is dead. It is not a metaphor we decorated the product with afterward; it is the shape of the thing. Blank space on a schedule is not absence — it is what keeps you alive. annnä's job is to maximize your liberties: the room to move, the breath between commitments, the freedom to walk through the world carrying almost nothing.

This is why the product's own glass is called *breathing glass*, and why an empty day is rendered as something beautiful instead of something to fill.

## Values (public, and each one is backed by architecture)

Every value below is a requirement on the product's construction, not a policy laid over it — each one is specified to be enforced by how the thing is built, and the build owes that enforcement rather than a promise (`../PRD.md`, "unbuilt enforcement"). That is the family trait: **we don't promise behavior, we build so the wrong thing is impossible.**

1. **A promised time is a promise to a real person.** Nothing that touches another human — a message, a move, a cancellation — happens without an explicit yes from the owner. A person whose slot might change is asked, never informed.
2. **Your life is not content.** Private commitments block availability without ever being visible. Your students, renters, and customers see that you aren't free — never why. The people you transact with fill ordinary forms; they never make accounts and never see your board. Where a guest surface answers at all it is template-bound — the published template's fields, scoped questions about bookability, and operations on their own booking — never a general assistant and never a way into your board (`../PRD.md` §5, "Not a guest-facing product").
3. **The math is never a guess.** Times, availability, capacity — every correctness-critical value comes from deterministic code, never from an AI's judgment. She can say a number; nothing correctness-critical accepts one (`../PRD.md` §1.2, Refusal one). The agent talks; the engine answers. Same question, same answer, always.
4. **Changing the rules never rewrites the past.** Commitments keep the terms they were made under. New rules apply forward only.
5. **Emptiness is worth defending.** Time you win back is yours, not inventory. The system never re-lists a freed hour behind your back.

*(Reconciled 2026-09-13 in this source document, outside the PR freeze: the required-construction preamble and the approved scoped guest console in item 2, together with the correctness-critical constraints in item 3 and the second refusal, are the source-document reconciliation class for unit U59, audit R-05. The guest ceiling is `../PRD.md` §5's approved template-bound guest console; the correctness-critical constraint is `../PRD.md` §1.2. No FD-101 exception is claimed for these identity-source edits.)*

## Who it's for (the mirror, not the market)

annnä is not aimed at a demographic. It was built by one person to solve his own problems — a founder who is also a working dive instructor and teacher — and it grows in circles: people in exactly that situation (tutors, dive professionals), then people he knows (a traveling physical therapist), then anyone who reads a page like this and recognizes their own week in it. The outward material's job is to be a mirror: the reader should see their own coordination load and their own crowded head, and want both gone.

## Personification and the name

- The application is personified. You talk to **her** — annnä is a *who* in conversation, an *it* in technical writing.
- The name is always lowercase — **annnä** — even at the start of a sentence. Pronounced like *"Anna."*
- The wordmark never takes an apostrophe, capitals, or a dropped umlaut. If a system cannot render **ä**, write **annna**, never "anna" or "Anna."
- The origin of the name is not part of the brand story and is never told. There is nothing to explain: the name is the name. *(Standing rule — applies to all material, internal and public, permanently.)*

## What annnä is not (refusals that define us)

- Not a productivity system. It will never ask you to optimize yourself.
- Not a calendar with a chatbot stapled on. The AI authors no correctness-critical value — a time, an availability, a permission is the engine's to issue, and those fields take engine-issued handles only — by construction (`../PRD.md` §1.2).
- Not a marketplace of attention. No feeds, no engagement mechanics, no notifications designed to bring you back.
- Not a data business. Customers' documents live in a vault with a shredder; what's kept forever is the harmless receipt.
