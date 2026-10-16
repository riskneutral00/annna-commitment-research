# PROBE METHOD: shared invariants for building annnä's user stories

*Referenced by `probe-elicit` and `probe-situation`. This is the reusable knowledge behind all three. annnä-specific by design.*

**Gold references (read before writing anything):**
- Immersive telling (single protagonist, first-person): none is current. Sofia's `story-sofia.md`, Situation A's first telling, retired 2026-09-15 under FD-106. Situation A's telling is now Matt's scripted `~/Projects/annna/annnä-commitment-research/user-stories/Situations/Situation-A/story-matt.md`, the console reference, not an elicited immersive telling (corpus `user-stories/README.md`).
- Held-out Situation (predictions-to-verify framing): none exists. Situation-E (the ER) retired whole 2026-09-17 under FD-108 (corpus commit 7d1c9bd); the predictions-to-verify discipline in §1 and the README's failed-probe rule still apply to the next one.
- Single-operator Situation (self-service, one resource type, off-app customer): `~/Projects/annna/annnä-commitment-research/user-stories/Situations/Situation-B/` (the motorbike rental, the whole folder)
- Multi-stakeholder Situation: `~/Projects/annna/annnä-commitment-research/user-stories/Situations/Situation-C/` (the dive, the whole folder)

*Note: **annnä's user stories are now entirely Situation folders, there are no flat `person-*.md` files.** Every use case (even a single protagonist, Situation-A) is a folder: `README.md` storybook + setup stories (`resource-*` / `operator-*` / a protagonist's own telling + `customer.md`) + numbered situation runs. The old flat terse-spec persona form is retired for annnä; the ER's `Situation-E/` retired under FD-108.*
- The frame these live in: `~/Projects/annna/annnä-commitment-research/user-stories/README.md`
- annnä's product requirements: `~/Projects/annna/annnä-commitment-research/PRD.md`

---

## 1. The meta-principle (never violate)

**Use cases are falsification probes, never design targets.** We write these stories to *test* whether annnä's general primitives already absorb a domain, not to shape annnä around any one domain.

- If a story is clean, it confirms the primitives.
- **If a story breaks the model, that reveals a missing _general_ primitive.** Flag it as such ("this needs a general primitive X"). **Do NOT patch annnä to the story.** Never write "so annnä should add a dive-specific / ER-specific feature."
- Some probes are deliberately **held-out stress tests** (e.g. the ER scheduler): annnä was *not* designed to them. Treat their situations as **predictions to verify**, not requirements annnä already claims to meet.

The output folder (`user-stories/`) is annnä's **requirements source-of-truth**; a separate `TDD/` test hierarchy (per-layer scenarios) **derives from it** later. It is narrative, **not tests, not decomposed** into harness/engine/app scenarios.

## 2. What annnä is (the substrate every story assumes)

- **annnä = the app AND the agent inside it** (say so once per story).
- The **engine ships empty**, no domain content baked in. What ships is: **admin-authored templates** (a generic scaffold per domain, an instructor template, a dive-center template) plus **uploaded agency/standards documents** (PADI/SSI/CMAS standards, medical forms). A user **tailors the template, bounded by the standards**, by talking to the agent over a console. Particulars are never seeded.
- **Permissions come from the uploaded documents, not from hardcoding.** (A Divemaster rating can't certify because the *agency doc* says so, change the agency and the permissions change.)
- **Generate-once-then-freeze** forms; a customer-facing **guest view** needs no account.
- The user can't do anything the agent can't; the harness is the physics of the app.

## 3. Single persona vs. multi-stakeholder Situation

Decide by **how many independent parties the story needs**:
- **Single / dual actor** → one `person-<slug>.md` file. (Sofia + her students; a rental owner + walk-ins.) Build it as a Situation folder with `probe-situation`.
- **A market of many independent stakeholders** who must be coordinated → a `Situations/Situation-<slug>/` folder. Use `probe-situation`.

Watch for two moves that actually happened:
- **Redundancy**: a planned persona gets **removed** because an existing one already absorbed it (Person B folded into Sofia, who is already a teacher). Don't write a persona whose muscle another already exercises.
- **Graduation**: a persona turns out to be a whole world and **graduates** from `person-X.md` into `Situations/Situation-X/` (Person C → the dive).

## 4. Voice & POV

- **Persona (single), immersive:** strict **first-person**, the character's POV (Sofia: "I set up an account…"). The character can **only perceive what they'd actually perceive**, never harness internals, never events they can't see. Mechanism ideas you think of go to a **NOTES** aside, never into the character's mouth.
- **Persona (terse spec):** third-person **who → story → situations to cover**. Use when the point is the mechanism, not the lived experience. *(Retired for annnä's user stories: both terse-spec examples graduated to folders, the motorbike → `Situation-B`, the ER → `Situation-E`, since retired under FD-108. For annnä, default to a **Situation folder** even for a single protagonist; this form survives only for other/quick uses outside the user-stories set.)*
- **Situation (multi):** **third-person, what-happens-only.** Named actors, real UI acts, concrete times. **No backstory, no filler, no adjectives-for-flavor.** Every sentence is an action or a state change.

## 5. The stakeholder taxonomy (multi-stakeholder only)

- **Resource stakeholders** = one-of-ones / **atoms**: each supplies exactly one thing (instructor, pool, boat, gear, air, divemaster). They land solo, tailor their own template, set availability; work *reaches* them.
- **Operator stakeholders** = **takers / composites**: dive center, agent. They orchestrate bookings and stand on resources; an operator may own its own resources (adds them via the same resource forms); an agent depends on a dive center.
- **Customer** = usually **off-app**, form only.
- **Build order: atoms → composites.** Resources first (an operator composes finished pieces; it shouldn't invent them inline).
- **Every resource type is a market of ≥2**: a first choice that can fail + a fallback that catches, so cancellations cascade. A type with one supplier can't model a cancellation.
- **One setup story per resource TYPE, not per player.** Within a type the setup is near-identical (pool A ≈ pool B), so tell it once through one representative. **Exception:** when setup genuinely differs within a type (boats have different routes), show two or three. The full **roster of players lives in the README**, not in per-player files.

## 6. The setup-story shape (each resource/operator)

Land on an empty board → the admin **template** fills the page (+ the **agency docs** already loaded) → the actor **declares specifics** by working the console (bounded by the docs) → sets **availability** and acceptance (Auto vs Review) → **their slice of a booking**. Note real variants where they matter (freelance vs employed; capacity-not-lanes; size grids; gas mixes; route rotations; agency-doc-limited ratings).

## 7. The situations (the runs)

Same world, run several ways. **Each situation states its purpose** (what interaction it exists to show, and how it differs from the others).
- **Floor**: current reality, *as if annnä didn't exist*: the manual mess (phone trees, cascades, nothing written where two people can see it). This is "even if the app didn't exist, what does it look like."
- **Ceiling**: everyone on annnä; it coordinates the whole thing silently in one pass; zero calls. The floor's pain, absorbed.
- **Probes**: targeted interactions: a scarce match that **works**, and one the system **honestly refuses** ("no X available" at submit, not a phone tree ending in the same no).
- Always cover **must-work AND must-be-refused** (poka-yoke tested from the outside). The refusals matter as much as the successes.

## 8. Packaging (multi-stakeholder)

A **storybook README** so another LLM absorbs the whole scope fast, self-contained (no external file needed): **how to read → the cast/roster → the setup stories → the situations with their purposes → the wider market it's drawn from.** Consolidate: one story per type; the roster in the README.

## 9. Elicitation discipline (getting it out of Matt)

- **One question at a time, with a recommended answer.** No large prose blocks, no batching.
- **Don't ask Matt what his *users* should decide.** If the answer plausibly differs between two of his users, it's not his call, the design answer is "the system explains the situation, asks its user, and stores that answer so it's asked once." Ask him the *policy shape*, not the user's choice.
- Ask until you could act; state sharp assumptions rather than vague ones; don't ask what the docs/standards already determine.
