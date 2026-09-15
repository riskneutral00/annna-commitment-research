# Brief — what the agent asks, and what it says instead of acting

**Readiness.** Ready when the founder opens a sitting on the console's asking behaviour.

**The debt this closes.** Three owed beats in `../COVERAGE.md` — **instance versus series** (1) and the **budget ceiling that produces a park** cluster (2). Both are moments where annnä stops short of acting and says something instead.

**Why nothing covers them.** *"Cancel one, or cancel the series?"* — `../../engine/SCENARIOS.md M2` asserts the *mechanics* of cancelling one instance without touching its siblings, and the harness has a general ambiguity-clarification law; neither asserts that the agent **asks this specific question** before acting on a recurring booking. And the 3 a.m. budget park: `../../harness/SCENARIOS.md C9` asserts only that an existing park **cannot self-clear**. Nothing asserts that hitting the declared step-and-spend ceiling **produces** the park, or that the parked card **names the budget** as the reason. `../README.md`'s register entry 6 records that beat, landed scripted at Matt's S21 under FD-106.

## World

Two moments in Matt's weeks where the app declines to guess. He says "Cancel Georgina's Monday lesson" and Georgina has standing Monday lessons — so which one? And at 3 a.m., unattended, a firing runs into its own ceiling and has to stop somewhere that a human can pick up in the morning.

**Protagonist:** Matt. **Single protagonist**, extending Situation A.

## The question that governs the sitting

**When annnä is unsure, what does it cost the user to be asked — and when is asking worse than guessing?** This is the console's whole character and it belongs to the person using it. Ask Matt what a good question feels like and what a bad one feels like; the corpus has an ambiguity law and no evidence about the experience of meeting it.

The second question is narrower and sharper: **when it stops at 3 a.m., what does he need to find in the morning?** A parked card that says "something went wrong" and a parked card that says "this hit the budget you set, here is where it got to" are the same mechanism and a different product.

## Actors — to be established

| Actor | Kind | To ask |
|---|---|---|
| Matt | operator-protagonist | Both moments are his |
| Georgina | customer, off-app | The cancel ambiguity is about *her* booking; does she learn about the hesitation? |
| Nobody, at 3 a.m. | — | The park's defining condition is that no human is there. Ask what "unattended" means to him — asleep, away, or simply not looking? |

## Rules and their source — to ask

- Who sets the step-and-spend budget, and does he know he set it? A ceiling the user does not remember choosing produces a park they cannot interpret.
- Is the series-versus-instance question always asked, or only when the agent is genuinely unsure? Always-asking is safe and tiring; ask him which he would tolerate.
- What may a park do on its own before the human arrives — nothing, or tidy up? The corpus says a park cannot self-clear; ask whether he expects anything at all to happen.

## The floor (today, without the app)

To ask: today, when somebody asks him to cancel "the Monday lesson", who resolves the ambiguity? He does, instantly, because he knows. That is the interesting part — **the app is worse-informed than he is**, and the ask is the app admitting it. Ask whether that admission reads as care or as incompetence.

## Situations to cover — the questions, not the answers

**To elicit as must-work.**
- The ambiguous cancel: what he says, what he is asked, what he answers, what happens.
- The 3 a.m. ceiling: what the firing was doing, where it stopped, and what the card says at 7 a.m.

**To elicit as must-be-refused.**
- Guessing which of the two he meant. Ask what the worst wrong guess would cost — the answer decides whether this is a `[MUST]`.
- A park that clears itself, or that retries into the same ceiling.
- A park's card that describes the failure in the app's vocabulary rather than his.

## Held-out predictions to flag, never design to

1. Whether "cancel the series" and "cancel this instance" are one intent with a parameter or two intents — a model-side question the N-set would grade, and the model's eval sets are seeded from these stories.
2. Whether a budget ceiling is the same class of stop as `needs_human`, or a fourth termination condition that merely lands in the same place. `../../harness/SPEC.md §4` states it as the fourth; nothing tests that the two are distinguishable to the person reading the card, which is the only place the distinction would matter.

## Hand-off

`/probe-elicit`, then extend `Situations/Situation-A/`. Both beats already appear in `story-matt.md` as **scripted** scenes and say so in-file (S16's this-occurrence-or-series ask, S21's overnight park) — the sitting's job is to replace guessed content with elicited content, not to add a second telling beside it.
