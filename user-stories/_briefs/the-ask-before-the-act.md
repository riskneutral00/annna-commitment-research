# Brief — what the agent asks, and what it says instead of acting

**Readiness.** Ready when the founder opens a sitting on the console's asking behaviour.

**The debt this closes.** Three owed beats in `../COVERAGE.md` — **instance versus series** (1) and the **budget ceiling that produces a park** cluster (2). Both are moments where annnä stops short of acting and says something instead.

**Why nothing covers them.** *"Cancel one, or cancel the series?"* — `../../engine/SCENARIOS.md M2` asserts the *mechanics* of cancelling one instance without touching its siblings, and the harness has a general ambiguity-clarification law; neither asserts that the agent **asks this specific question** before acting on a recurring booking. And the 3 a.m. budget park: `../../harness/SCENARIOS.md C9` asserts only that an existing park **cannot self-clear**. Nothing asserts that hitting the declared step-and-spend ceiling **produces** the park, or that the parked card **names the budget** as the reason. `../README.md`'s register entry 6 already records that beat as owed.

## World

Two moments in Sofia's week where the app declines to guess. She says "cancel Bobby's Wednesday lesson" and Bobby has a standing Wednesday lesson — so which one? And at 3 a.m., unattended, a firing runs into its own ceiling and has to stop somewhere that a human can pick up in the morning.

**Protagonist:** Sofia. **Single protagonist**, extending Situation A.

## The question that governs the sitting

**When annnä is unsure, what does it cost the user to be asked — and when is asking worse than guessing?** This is the console's whole character and it belongs to the person using it. Ask Sofia what a good question feels like and what a bad one feels like; the corpus has an ambiguity law and no evidence about the experience of meeting it.

The second question is narrower and sharper: **when it stops at 3 a.m., what does she need to find in the morning?** A parked card that says "something went wrong" and a parked card that says "this hit the budget you set, here is where it got to" are the same mechanism and a different product.

## Actors — to be established

| Actor | Kind | To ask |
|---|---|---|
| Sofia | operator-protagonist | Both moments are hers |
| Bobby | customer, off-app | The cancel ambiguity is about *his* booking; does he learn about the hesitation? |
| Nobody, at 3 a.m. | — | The park's defining condition is that no human is there. Ask what "unattended" means to her — asleep, away, or simply not looking? |

## Rules and their source — to ask

- Who sets the step-and-spend budget, and does she know she set it? A ceiling the user does not remember choosing produces a park they cannot interpret.
- Is the series-versus-instance question always asked, or only when the agent is genuinely unsure? Always-asking is safe and tiring; ask her which she would tolerate.
- What may a park do on its own before the human arrives — nothing, or tidy up? The corpus says a park cannot self-clear; ask whether she expects anything at all to happen.

## The floor (today, without the app)

To ask: today, when somebody asks her to cancel "the Wednesday lesson", who resolves the ambiguity? She does, instantly, because she knows. That is the interesting part — **the app is worse-informed than she is**, and the ask is the app admitting it. Ask whether that admission reads as care or as incompetence.

## Situations to cover — the questions, not the answers

**To elicit as must-work.**
- The ambiguous cancel: what she says, what she is asked, what she answers, what happens.
- The 3 a.m. ceiling: what the firing was doing, where it stopped, and what the card says at 7 a.m.

**To elicit as must-be-refused.**
- Guessing which of the two she meant. Ask what the worst wrong guess would cost — the answer decides whether this is a `[MUST]`.
- A park that clears itself, or that retries into the same ceiling.
- A park's card that describes the failure in the app's vocabulary rather than hers.

## Held-out predictions to flag, never design to

1. Whether "cancel the series" and "cancel this instance" are one intent with a parameter or two intents — a model-side question the N-set would grade, and the model's eval sets are seeded from these stories.
2. Whether a budget ceiling is the same class of stop as `needs_human`, or a fourth termination condition that merely lands in the same place. `../../harness/SPEC.md §4` states it as the fourth; nothing tests that the two are distinguishable to the person reading the card, which is the only place the distinction would matter.

## Hand-off

`/probe-elicit`, then extend `Situations/Situation-A/`. The 3 a.m. beat already appears in `situation-5.md` as a **scripted** run and says so in-file — the sitting's job is to replace guessed content with elicited content, not to add a second telling beside it.
