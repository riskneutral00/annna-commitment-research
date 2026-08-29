# The job

This phase **prepares the repository so the next act is building the application.**

What ships is **the application** — commitment harness and template builder. Situations are emulated-user fixtures, not products (FD-80, home `PRD.md` §6.5). The folder already holds the building blocks: each layer’s `SPEC`, seams, scenarios, and ordered `BUILD.md`. The work now is to make that obvious and internally consistent, then start code only when he says to.

This file is the tracked session job. It is an index of the moment, not a home of product law.

## What you are doing

1. Read `AGENTS.md` with the Read tool before touching anything.
2. Make the live SPECs agree. A leftover fork an agent will invent (send API, hour-grid, seats, Stripe, a Situation-as-product) is a defect. Land it as an FD or as one sentence in the rule’s home. One home per rule (FR13).
3. Make the front door match the moment. A clone that reads a start-the-harness Status while the go-word is still his will start the wrong work.
4. Stop at the go-word. He says the corpus matches and to start `harness/BUILD.md` Step 1. That is G0-2. Layers in order, harness first, against stubs. Spec and code never one commit (S2). `npm run check` on every landing.

## Done

- Live SPECs do not still name a Situation as a product to ship.
- The leftover forks from the retired `CLARIFY.md` §§8–9 landed as law at their homes (FD-80 / FD-81 / FD-82, the harness ratifications, `model/SPEC.md` §7) or as named research at their homes (`app/NOTES.md`, `security/SPEC.md` §2); the file itself is deleted.
- The README Status line matches that moment.
- He has given the go-word.

Until then this is still a prepare-to-build sitting, not a code sitting.

## Where the rest lives

- Leftover research (not build gates), each at its live home — the source file, the retired `CLARIFY.md`, is deleted: messaging investigation → `app/SPEC.md` §6 + `app/NOTES.md` · hour-grid residue → `app/NOTES.md` + the FD-81 row · OR-42 proposal → `security/SPEC.md` §2 · Situation × layer map → working material under `docs/agents/`
- Later acts, not this phase: Cloudflare, OpenRouter keys, `privacy@annna.dev`
- A working checkout may also carry a living gate list under `docs/agents/` (absent from a clone). This file is what a clone has.
- Do not add to `AGENTS.md` (950-word ceiling, 0 spare)

## When this file retires

This file retires on readiness, never on a date: when the go-word has been given and
`harness/BUILD.md` Step 1 has opened, it describes a moment that has passed.

One thing here is law, and it moves rather than dies — **G0-2**, the go-word gate. Its
normative home becomes `harness/BUILD.md`, the only file that cites it and where its
Readiness line already names it. Nothing else in this file is law.

Retirement is the founder's act, in one commit: delete this file, remove its `INDEX.md`
row, and re-point or remove the two `README.md` references to it — the Status paragraph’s
session-job sentence and the map row — setting the tracked-markdown count in `AGENTS.md`
and `README.md` to the then-current tracked count, never to a number written here.

*Drafted, not founder-ratified.* **PROPOSED FD-88**, registered in `RULINGS.md`.

## Hard guardrails

- Start harness Step 1 only after the go-word.
- Build the specified application. Write neither a teacher-scheduling app nor a dive-center app.
- Do not invent a personal-account send API, the hour-grid, a seat primitive, `held` / Stripe, OR-28 vetting, or an owner-API consumer.
- Push is his act.
