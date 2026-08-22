# annnä

Your schedule lives in your head — every promise, every pickup, every "don't forget," carried all day by you. And behind each one sits the coordination it takes to keep it.

**annnä is an agent-first commitment harness.** You talk; it holds what you promised and does the work the promise implies. The aim is peace — a schedule that feels like there is nothing on it, because the coordination leaves, and then your head no longer has to be where the schedule is kept.

> ### 📋 This repository is a design specification, not a working application.
> **127 markdown files** — the research, the architecture, the user stories, the test strategy, the public identity. The build has begun and is early: `engine/` and `harness/` each hold a Step-0 scaffold with its test suite, and small Node scripts run the process gates and the asset pipeline. The point of this package is that it is complete enough to build *from*.

---

## The three words

**Commitment.** The one thing on the board. Not an appointment — something you promised, to someone, under conditions. When a promise needs people and equipment, the commitment carries them too — optional axes, never the definition: a title is the only thing every commitment requires. "Event" and "task" are presets derived from it, and nobody ever picks a type. That result came from four research streams — philosophy, contract law, calendar data models, task data models — run blind to each other, and it is what everything else stands on ([`archive/`](archive/)).

**Agent-first.** Agents are first-class users, alongside people, in two senses at once.

- You state intent and an agent does the work. There is no settings screen to hunt for: connecting a calendar is a conversation, and a template is authored by talking.
- Your own agent can call annnä directly, through the same tools the app calls, under the same permissions. Nothing the app can do is out of reach of software acting for you — with the exclusions the spec itself rules: guest surfaces, appearance, service administration, and the authorization-and-recovery acts that stay console-only, because a credential must never control who may act as the owner ([`PRD.md`](PRD.md) RQ-2). The surface opens when there is a cohort to open it for.

**Harness.** What you put on something powerful so it can be steered, and what a person clips into so they cannot fall. Both are meant.

- **The agent is harnessed.** It can say a number. Nothing correctness-critical will accept one — times, availability and capacity come from deterministic code, and those fields take engine-issued handles only.
- **You are harnessed.** Nothing that reaches another person — a message, a move, a cancellation — happens without your explicit yes. Permission is never inferred.

## What it does

It holds everything you schedule — meetings, meals, workouts, rentals, courses, shifts — as one primitive on one board. That completeness is the bet: it is what lets the system reason correctly about your time.

Three things follow that a calendar cannot do.

**It runs to a standard.** A certifying body's course rules, a shop's own procedures — enforced by deterministic code, not by an AI's judgment.

**It does the multi-party work.** After a sale it assembles what the commitment needs: chasing availability, collecting documents, confirming with everyone. You state intent; it arranges.

**The AI is owner-side only.** The people you transact with — a student booking a lesson, a renter uploading a passport — get ordinary web forms your agent produces. They never see your board, never make an account, never meet a chatbot.

## One week, run twice

The proof is one busy week at a small Phuket dive center, run the way the industry runs it today and the way annnä runs it. Same week, same four customers, same shortages, same suppliers falling through.

**Today:** close to two dozen phone calls, a second boat chartered the morning of, a fifth day booked and re-booked, manifests rewritten three times, a mask chased across town.

**With annnä, once everyone in the week is on it:** the whole week placed in one pass against every instructor, boat, pool, tank and gear set at once — and placed weeks ahead, because the clashes that surfaced at 07:00 on the morning of were visible the day the booking was taken. Not one phone call between any of them.

**What v1 actually does is the middle case**, and it is specified as its own thing: annnä places everything its network can reach, and for every edge it cannot it *prepares the call*, records the answer, and offers an invite. Two dozen calls become a handful of prepared ones. Handing a customer to a business annnä has no relationship with waits longer — that is a legal question before it is an engineering one.

> Read it: [the clean run](user-stories/Situations/Situation-C/situation-1.md) · [current reality](user-stories/Situations/Situation-C/situation-2.md) · [the middle case](user-stories/Situations/Situation-C/situation-5.md)

## The probes

Five end-to-end situations in [`user-stories/`](user-stories/) — plus two marketplace install probes (A′, C′) the folder also holds — are the product's falsification probes: if a story breaks the model, the finding is a missing *general* primitive, and the fix is never to special-case the story. (The requirements register is [`PRD.md`](PRD.md)'s RQ series — FD-35; the probes are what every requirement is tested against.)

| | Who | What it tests |
|---|---|---|
| **A** | Sofia, freelance teacher | A whole life on one board, and one outward slice published to students |
| **B** | Ploy, motorbike rental | Self-serve booking, holds with a clock, gated on passport and deposit |
| **C** | Hug Ocean, dive center | A week fanning out across instructors, boats, pools, gear and air |
| **D** | Debra, physical therapist | A schedule that moves through space, where the gap between two commitments is a drive |
| **E** | An ER scheduler | **Held out.** annnä was deliberately not designed for this, so every claim is a prediction |

## How it's built

| Layer | What it holds | Where it comes from |
|---|---|---|
| **Model** | Language and judgment. Never authors correctness or permission | Imported — models are qualified, not written |
| **Harness** | What the agent may do and how it decides: the loop, the tools, the permission floor | Written from scratch |
| **Engine** | Truth and math: no-double-book, validity, the type system, reconciliation | Written from scratch |
| **App** | What a person sees and touches, plus the forms off-app parties fill in | Written from scratch |

The load-bearing split is Model and Engine. Delete the AI entirely and the Engine remains: the calendar-and-calculator underneath. Everything the model is forbidden to author is answered by the Engine instead. Same store, same query, same answer, always.

**Why the split is drawn there is arithmetic, not tidiness.** Agent success compounds over steps: 95% per step is about 60% over ten and 28% over twenty-five. A placed week is that many steps, so placement in the model is a coin flip and placement in the engine is deterministic (FD-16).

**Build order:** the harness against stubs and the app against its own spies run concurrently from the start; the engine builds to the harness's seams once its suite is green; real models qualify last. [`marketplace/`](marketplace/) builds last of all; [`deployment/`](deployment/) builds alongside. (The dependency order's normative home is [`deployment/SPEC.md`](deployment/SPEC.md) §6's wave table — this line matches it since 2026-08-21; its older strictly-linear phrasing was the one thing that SPEC names as wrong.)

## The locks

A product that asks for your whole life, and holds your customers' passports and medical notes, owes an answer on how it protects them. [`security/`](security/) is written to be handed to an outside reviewer whole.

Your customers' data is legally yours, not annnä's — the business is the controller, annnä the processor, built to GDPR as the ceiling. Passports and doctors' notes live in an encrypted vault with a destruction clock; the permanent record keeps only the harmless receipt. A guest's entire attack surface is one tokenized link. Every string entering the AI carries its source, and stranger text is read first by a model with no tools at all, so raw text never reaches the model that can act. A formal legal review before launch is a hard gate that green tests cannot argue past.

## Status

**Design complete. Implementation begun, and early.**

The founding research, the five situations, all four layer specs with their acceptance suites, the security law, the build discipline and the testing strategy are done. Application code is Step-0 scaffolds in [`engine/`](engine/) and [`harness/`](harness/), the process gates in [`deployment/scripts/`](deployment/scripts/), and the asset pipeline in [`assets/`](assets/).

The design was attacked three times before being called done — structured adversarial reviews by fleets of independent AI reviewers with no stake in it, not external human audits. 93 findings across the first two rounds, 30 killed as unfounded; a third round on the newer material raised 46 raw findings — **30 distinct after dedup** — all 30 killed on first review, and then an audit of the refuters overturned four of those kills and surfaced five fresh gaps *(numbers restated 2026-08-21; the round's working tally had been quoted pre-dedup, which inflated the killed count by sixteen)*. The lesson held all three times: most attacks die, and the survivors are the ones worth having found. A fourth, whole-corpus pass ran 2026-08-21 and its findings are landed throughout, dated in place.

**Next step:** build the harness against stubs, per [`harness/BUILD.md`](harness/BUILD.md).

## The principles

- **Thin agent, rich engine.** The AI never authors a correctness-critical value. It asks the engine and reports the answer.
- **The reversibility floor.** Nothing crosses into the real world without an explicit basis from the owner.
- **Poka-yoke.** Make illegal states impossible to construct, rather than validating against them afterward.
- **Changing the rules never rewrites the past.** Commitments keep the terms they were made under.
- **Design the general capability, not the use case.**
- **Emptiness is worth defending.** Time you win back is yours, not inventory. A freed hour is never re-listed behind your back.

## The map

| | |
|---|---|
| [`AGENTS.md`](AGENTS.md) | **Start here if you are an agent** — authority order, package shape, and the citation conventions that trip automated readers |
| [`INDEX.md`](INDEX.md) | Every tracked file, one line each: its authority tier and what it decides |
| [`PRD.md`](PRD.md) | What agent-first means here, and what it requires |
| [`RULINGS.md`](RULINGS.md) | The founder-ruling registry |
| [`user-stories/`](user-stories/) | The falsification probes — five situations + two marketplace probes (the requirements register is `PRD.md`, FD-35) |
| [`harness/`](harness/) · [`engine/`](engine/) · [`app/`](app/) · [`model/`](model/) | The four layers |
| [`marketplace/`](marketplace/) · [`security/`](security/) · [`deployment/`](deployment/) | The store's open half · the cross-cutting security law · the discipline of the build |
| [`TDD.md`](TDD.md) · [`assets/`](assets/) · [`.specs/`](.specs/) | Test strategy · shipped skins · interview records |
| [`archive/`](archive/) | The original research and full design history — *how we got here*, not what to build |

**Reading suggestion:** this page, then [`user-stories/`](user-stories/) for what it actually does, then [`archive/`](archive/) for why the commitment primitive is shaped the way it is. A security reviewer can start, and mostly stay, at [`security/README.md`](security/README.md).

## License

[MIT](LICENSE) © 2026 Matthew Lee
