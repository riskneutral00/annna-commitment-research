# PROBE METHOD: how the probe skills elicit and build annnä's stories

*Referenced by `probe-elicit` and `probe-situation`. This file holds method only: the elicitation discipline, the stakeholder taxonomy, the setup-story shape, the runs and the packaging. **Corpus law is not restated here** (FR13): `user-stories/README.md` owns what a story is, the folder shape, voice, provenance registers and change rules; `PRD.md` owns requirements (FD-35); `TDD.md` owns test kinds. Where this file and those disagree, they win. Paths are repo-relative to the annnä repository root.*

**Gold references (read before writing anything):**
- Single protagonist: `user-stories/Situations/Situation-A/story-matt.md`, the founder's own telling. It is **scripted** (`user-stories/README.md` §Provenance), so it is the console reference, not an elicited telling to imitate as evidence.
- Single operator, one resource type, off-app customer: `user-stories/Situations/Situation-B/` (the motorbike rental, the whole folder).
- Multi-stakeholder market: `user-stories/Situations/Situation-C/` (the dive, the whole folder).
- Held-out Situation: none exists today (Situation-E retired under FD-108); §1's predictions-to-verify rule still applies to the next one.

---

## 1. The meta-principle

Use cases are falsification probes, never design targets: `user-stories/README.md` (its opening and §The bar a story passes). If a story breaks the model, flag the missing **general** primitive; never patch annnä to the story. A held-out probe's runs are predictions to verify, not requirements annnä already claims.

## 2. What annnä is

Read `PRD.md` and the layer `SPEC.md`s, not a summary here. Two constraints the setup stories must respect: the engine ships empty (content arrives through administrator-authored templates the user tailors over the console), and **owner and guest file uploads are excluded from v1** (`security/SPEC.md`), so no setup may rest on an uploaded document.

## 3. One protagonist or a market

Every use case is a `user-stories/Situations/Situation-<slug>/` folder (`user-stories/README.md` §How to read). A single protagonist's telling is `story-<name>.md` inside its folder, beside its setup stories and runs; a market of many independent stakeholders uses the full taxonomy in §5. Watch for **redundancy** (an existing Situation already exercises the muscle) and for a single-protagonist idea that is really a market.

## 4. Voice

`user-stories/README.md` owns the voice rule; apply it as written there. Characters perceive only what they would actually perceive. Mechanism ideas you think of go to the owning layer spec or the invented-and-justified register (`user-stories/README.md` §Provenance), never into a character's mouth.

## 5. The stakeholder taxonomy (multi-stakeholder only)

- **Resource stakeholders** = one-of-ones / **atoms**: each supplies exactly one thing (instructor, pool, boat, gear, air, divemaster). They land solo, tailor their own template, set availability; work *reaches* them.
- **Operator stakeholders** = **takers / composites**: dive center, agent. They orchestrate bookings and stand on resources; an operator may own its own resources (adds them via the same resource forms); an agent depends on a dive center.
- **Customer** = usually **off-app**, form only.
- **Build order: atoms → composites.** Resources first (an operator composes finished pieces; it shouldn't invent them inline).
- **Every resource type is a market of ≥2**: a first choice that can fail + a fallback that catches, so cancellations cascade. A type with one supplier can't model a cancellation.
- **One setup story per resource TYPE, not per player.** Within a type the setup is near-identical (pool A ≈ pool B), so tell it once through one representative. **Exception:** when setup genuinely differs within a type (boats have different routes), show two or three. The full **roster of players lives in the README**, not in per-player files.

## 6. The setup-story shape (each resource/operator)

Land on an empty board → the administrator-authored **template** fills the page, with the outside standards it encodes → the actor **declares specifics** by working the console, bounded by those standards → sets **availability** and acceptance (Auto vs Review) → **their slice of a booking**. Note real variants where they matter (freelance vs employed; capacity-not-lanes; size grids; gas mixes; route rotations; standard-limited ratings). Credentials and ratings are structured declarations, never uploaded documents (§2).

## 7. The situations (the runs)

Same world, run several ways. **Each situation states its purpose** (what interaction it exists to show, and how it differs from the others) and its provenance register.
- **Floor**: current reality, *as if annnä didn't exist*: the manual mess (phone trees, cascades, nothing written where two people can see it).
- **Ceiling**: everyone on annnä; it coordinates the whole thing silently in one pass; zero calls. The floor's pain, absorbed.
- **Probes**: targeted interactions: a scarce match that **works**, and one the system **honestly refuses** ("no X available" at submit, not a phone tree ending in the same no).
- Always cover **must-work AND must-be-refused**. The refusals matter as much as the successes.

## 8. Packaging (multi-stakeholder)

A **storybook README** so another LLM absorbs the whole scope fast, self-contained (no external file needed): **how to read → the cast/roster → the setup stories → the situations with their purposes → the wider market it's drawn from.** Consolidate: one story per type; the roster in the README.

## 9. Elicitation discipline (getting it out of Matt)

- **One question at a time, with a recommended answer.** No large prose blocks, no batching.
- **Don't ask Matt what his *users* should decide.** If the answer plausibly differs between two of his users, it's not his call; the design answer is "the system explains the situation, asks its user, and stores that answer so it's asked once." Ask him the *policy shape*, not the user's choice.
- Ask until you could act; state sharp assumptions rather than vague ones; don't ask what the standards already determine.
- A question brief in `user-stories/_briefs/` stays questions; the answers become a Situation run, never an edited brief.
