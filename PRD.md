---
title: annnä
status: final
created: 2026-08-08
updated: 2026-08-24
---

# PRD: annnä

## 0. Document Purpose

This PRD is for the people and agents who build annnä: the layer owners working from `harness/`, `engine/`, `app/`, `model/`, `marketplace/` and `security/`, and the downstream workflows that turn requirements into epics, stories and tests. It exists because the corpus answers *what annnä is* exhaustively and *what it is agent-first for* almost not at all — a gap that surfaced when two technical research passes landed material the specs did not produce.

It is deliberately thin on restatement. Under FR13 every rule has exactly one normative home, and almost every rule this document touches already has one: requirements live **here**, as the `RQ-##` series (FD-35, ruled 2026-08-21 — this file is the requirements register), with `user-stories/` as the falsification-probe corpus every scenario derives from and is refutable against; acceptance criteria live in each layer's `SCENARIOS.md`, architecture in `SPEC.md` and `INTERFACES.md`, build order in `BUILD.md`, success criteria and the risk register in `PR/BRIEF.md`, and every founder ruling in `RULINGS.md`. Where this PRD names one of those, it points and does not copy.

**What this PRD is the normative home of:** the agent-first goal and its two definitions, the capability-parity requirement, and the peace requirement. Nothing else in the corpus holds any of the three. Everything else here is a pointer with a sentence of context.

Assumptions are tagged `[ASSUMPTION]` inline and indexed in §12. Items owed to a named future session are tagged `[NOTE FOR PM]`.

### 0.1 Where this document lives

**`PRD.md` at the repository root, INDEX tier `SPEC`.** Root is where corpus-wide documents that are not layers already live — `AGENTS.md`, `INDEX.md`, `RULINGS.md`, `README.md` — and `AGENTS.md` is already tiered `SPEC` there, so both the location and the tier have precedent. `SPEC` rather than `derived` because §0 declares this the normative home of three things nothing else holds; a `derived` tier would misdescribe the parity requirement. `PR/` is frozen, and while that freeze reaches new outward material rather than every edit inside the package (`PR/README.md` §FROZEN), its one *authoring* exception was ruled *"this file and no other"* — so a new document does not land there.

Four obligations before it lands: the `INDEX.md` row goes **between `PR/VOICE.md` and `README.md`** (`git ls-files` sorts `/` before `D`, so the whole `PR/` folder precedes `PRD.md`) or `index-complete` fails; the tracked doc count moved with it in both `README.md` and `AGENTS.md` (the count has since changed again; those two files are its home); `AGENTS.md` §Rulings gains a line naming the **`RQ-##`** series, because that section exists so an agent meeting a label knows where to resolve it and a citable series absent from it is the broken-citation problem `RULINGS.md` was built to end; and `npm run check` is green before the landing.

### 0.2 Provenance of the decisions in this document

*`RULINGS.md` keeps this distinction because a reader cannot otherwise tell an answered question from a drafted one. The same distinction is kept here.*

**Founder-originated.** The agent-first reframe and peace as the product's purpose; that both definitions are claimed and both carry a 9/10 goal; statelessness chosen over agent-held state; the owner's own agents only in v1; console-first until a beta cohort exists; the removal of any position on agent-initiated speech; the first-user cohort; and that this PRD lands in the tracked corpus.

**Adopted on recommendation, and marked `[ADOPTED]` where they appear.** Two answers were put to the founder as recommendations and taken: the credential is a fifth capability-token class (RQ-1), and the external surface stamps `import` while quarantining free text but not structured parameters (RQ-8). Treat their *reasoning* as a proposal and their presence here as provisional, in the sense `RULINGS.md` §Provenance defines.

**Drafted.** Every `RQ-##` is drafted by the author of this document from the rulings above. None carries a founder ruling of its own.

## 1. Vision

**annnä is an agent-first commitment harness. Its purpose is peace of mind.**

A schedule is two burdens carried at once. The first is coordination — the calls, the chasing, the confirming, the rewriting of a manifest for the third time. The second is the load of holding all of it in your head, because nowhere else can be trusted to hold it. annnä takes the first so the second can leave. `PR/IDENTITY.md` states the order and it is honest: *"first the labor leaves, then the load."*

The primitive underneath is the **Commitment** — one object with orthogonal axes, where "event" and "task" are derived presets nobody ever picks. That result came from four blind research streams and is the foundation everything else stands on (`archive/`, and the model of record at `engine/SPEC.md`). A calendar holds *when*. A commitment holds what was promised, to whom, and under what conditions — and, when the promise needs people and resources, it carries those as optional axes (`title` is the only universally required field, `engine/SPEC.md §1.3`) — which is why annnä can assemble what a promise needs, and a calendar cannot.

### 1.1 What "agent-first" means here, and why the phrase needs teaching

The term carries two live meanings in the industry, and annnä claims both. Stating only one has caused this project to misdescribe itself already, so the PRD defines both and takes a position on each.

**Agent as interface.** The human states intent; an agent plans, calls tools, chains actions, and either returns a result or asks a clarifying question. The agent is the orchestration layer and the UI is one surface among several. annnä is built this way today: *"the human only has to state intent"*, configuration is conversation rather than a settings wizard (FR36), and a user authors a marketplace template through their agent (FR38).

**Agent as consumer.** Other agents call the application directly. The tool contract is the product surface; structured outputs are guaranteed; actions carry explicit parameters; session affinity is a defect. annnä is built *for* this and does not yet exercise it — the harness is a tool contract with a permission floor rather than a set of routes, and it is built and tested before any UI exists; the external surface is specified (`harness/SPEC.md §5.3`) and nothing outside the app calls it yet (§2.3).

**The goal is 9 out of 10 against both.** The scorecard and its targets are §10; the requirements that move the numbers are §4.

### 1.2 The two refusals, stated because absences are invisible

Read literally, the two definitions contradict each other on exactly one point. Agent-as-interface asks that *state live in the agent's context and memory*. Agent-as-consumer asks that the system be *stateless by default*. annnä's most load-bearing architectural decision sits on that seam, and it is a single decision that scores badly against one definition and well against the other.

**Refusal one: annnä does not hold state in the agent's context.** Truth lives in the engine, event-sourced and projected; the model authors no correctness-critical value. The argument is FD-16's, and it is arithmetic rather than taste: agent success compounds over steps, so 95% per step is roughly 60% over ten steps and 28% over twenty-five, and any job the size of a placed week is that many steps. What annnä has instead is durable, inspectable, revocable memory held as engine records — standing rules, Grants, and ask-once-apply-forever elicitation — which survives a restart, can be shown to the owner, and can be withdrawn. This refusal is written down so that a future contributor meeting a small case where the agent "could just remember it" finds an argument in the way.

**Refusal two: v1 admits the owner's own agents only.** A different person's agent transacting against an owner's board is the cross-tenant referral problem in machine form, and its human equivalent is already deferred behind FR1's formal legal review. It is v2, and the legal review is named as its blocker rather than left implicit.

### 1.3 Why "harness" is the right noun

A harness is what you put on something powerful so it can be steered, and what a person clips into so they cannot fall. Both readings are load-bearing here, and both are already built. The agent is harnessed: it can emit a number, and nothing correctness-critical will accept one, because those fields take engine-issued handles only. The owner is harnessed: nothing that crosses into the real world happens without an explicit basis from them, and permission is never inferred (`harness/SPEC.md`).

When agents become first-class callers, that envelope stops being an internal layer and becomes the product's public surface. What annnä offers an agent is not access — it is *governed* access. That is the thing being sold, and it is why the noun is `harness` and not `platform`.

### 1.4 The third mechanism of peace

`PR/IDENTITY.md` engineers peace in three steps — it takes the work, it takes the worry, and it quiets the looking *(the third stated here first, 2026-08-08, and landed in §Mission 2026-08-22 once FD-22 gave the claim its mechanism)*. The first two are automation; the third is a requirement on the surface itself: **what the owner looks at must not itself be a burden.** A board holding a complete life is, by construction, a board holding a great deal, and the completeness bet and the peace promise pull against each other in exactly that moment. The mechanism is the block **wake policy** (§3, §4), and it is the answer to a tension the corpus otherwise leaves open.

`[NOTE FOR PM]` `PR/IDENTITY.md` §Mission now names three steps — the third landed 2026-08-22 (Q2 closed; see §11).

### 1.5 The end-state (founder-ruled 2026-08-22, FD-71 — internal direction; no outward surface carries it until its scenarios exist)

**annnä's ambition is category replacement.** The commitment-shaped functions of the software a small operator runs beside their calendar today — the accounting ledger's who-owes-what, the CRM's who-promised-what-to-whom, the contract tool's what-was-agreed — eventually live in annnä, because each is a view over commitments and annnä holds the Commitment as its primitive. The stored money marks, party history, the signed-terms basis, and the template marketplace are that trajectory's seeds, already specced. **Nothing about v1 changes:** FR10's bar, FD-80 (what ships is the application), and every §5 non-goal stand as written — the end-state is direction, not scope, and the path is the rulings cadence: a capability enters when its scenarios and its ruling exist, never before. `user-stories/README.md`'s gap 4 (non-calendar bulk import) is the first post-release rulings program on this path — the migration door.

## 2. Target User

### 2.1 Jobs To Be Done

The first cohort is a working freelancer who sells bookable time and also has a life. Their jobs:

- **Put the whole thing down.** Keep every commitment — personal and professional, the run and the lesson — in one place trustworthy enough that my head stops being the backup.
- **Let people book me without seeing me.** Publish the time I am genuinely free without exposing why the rest is blocked.
- **Stop paying for coordination I could describe in a sentence.** Say what I sold; do not make me assemble it.
- **Be told the truth, not a guess.** Times, availability and capacity that are computed, not inferred — the same answer every time I ask.
- **Reach it from wherever I already work.** Use my own agent against my own schedule, with the same permissions I have myself.
- **Look at a full week without dread.** A complete board that does not read as a wall.
- **Prove it by building it.** *(Founder-specific, and load-bearing: FR38 makes "the founder built it through the application, as a user" the corpus's validation method for every domain template.)*

### 2.2 Non-Users (v1)

- **Guests are never users.** A student, a renter, a diver or a patient gets one tokenized link and one form — and, once a booking completes, a booking-bound manage link for that booking alone (FD-43). No account, no password, no chatbot. This is a security guarantee (`security/SPEC.md`), not a scope cut.
- **Other people's agents.** v2, behind FR1's legal review — see §1.2.
- **Institutions running an autonomy envelope.** Situation E is held out by FR10 and stays a set of predictions to verify, not a target.
- **Not a non-user, and worth separating:** dive centers and rental operators are in v1 product scope (FR10 puts Situations A, B, C and D in v1). They are simply not in the first two rings of adoption — see §2.3.

### 2.3 The rings

`PR/IDENTITY.md` describes the audience as *"the mirror, not the market"* that *"grows in circles"* The first two circles are now nameable, and naming them supplies the cohort the pilot item needed — that item is closed (OR-40 → FD-77, 2026-08-23): `PR/BRIEF.md` records the founder's own English students as the named pilot.

1. **The founder.** A working dive instructor and language teacher, using annnä directly at its own console.
2. **Dive and English instructors he knows.** Same shape: freelance, bookable, multi-language, life and work on one board.
3. **Onward** — a traveling physical therapist, then anyone who reads a page like `README.md` and recognizes their own week.

**Consequence for scope, carried into §6:** rings one and two are Situation A shaped. `README.md` opens with the Situation C week because it is the strongest demonstration, and that is the right choice for a front page — but the cohort is an **onboarding order**, not a feature cut — FR10 stands and v1 is not narrowed to the cohort (§6.1). **On cold start, honestly** *(re-written 2026-08-22 — the prior sentence said cold start "barely bites this cohort", which conflated* works with one user *with* worth switching to*)*: Situation A is mechanically single-player, but a solo owner is not retained by mechanics — they are retained by reaching, alone, in one session, a state they would not give up. That is a requirement, not a hope, and it is registered:

#### RQ-14: First value is single-player

**Description:** An owner reaches a state they would not give up **in one session, alone, with one link** — their real week on the board, a published offering, and a live entry link they can paste — with no second user, no import completed, and no template bought.

**Consequences (testable):**
- The onboarding path to that state is a single sitting; nothing on it waits for another party's action.
- The state survives the session: returning the next day, the board and link are as left, and the first real booking through the link requires nothing new of the owner.
- No step on the path assumes ring-two or ring-three adoption (centers, suppliers, other agents).

**Notes:** Drafted 2026-08-22 (the fork sitting, FD-50's companion). The cohort's willingness to switch is the bet `PR/BRIEF.md` prices; this requirement is what makes "single-player value" falsifiable instead of reassuring. Cold start still bites the cross-employer half — a freelance instructor accepting *jobs* needs a center on annnä, and centers are ring three; that half is a Situation-C probe of the share seam (FD-80: not a ship cut).

`[ASSUMPTION]` The founder uses annnä at its own console and admits no external agent until a beta cohort exists. The external surface is v1 specification, not v1 exercise.

### 2.4 Key User Journeys

*These mirror the Situations, which are the falsification-probe corpus the requirements are tested against (`user-stories/README.md`, FD-35). They are identified by their Situation letter rather than a fresh numeric series, deliberately: the corpus has twice been bitten by two numbering schemes for one thing, and a `UJ-1` that does not equal `Situation-1` is that failure waiting to happen. FRs in §4 reference these IDs inline.*

| ID | The journey | Source |
|---|---|---|
| **UJ-A** | Sofia, freelance language teacher — her whole life on one board, and one outward slice published to students who never see the rest | `user-stories/Situations/Situation-A/` |
| **UJ-A′** | Sofia again, installing a template from the store into an empty account — she also publishes a shape she authored; extracting her populated board is refused | `user-stories/Situations/Situation-A-prime/` |
| **UJ-B** | Ploy, motorbike rental — a traveller who pulls rather than books, against a hold with a clock and a gated checklist | `user-stories/Situations/Situation-B/` |
| **UJ-C** | Hug Ocean, dive center — a whole week placed in one pass across instructors, boats, pools, gear and air; and the minimal-adoption run where annnä prepares the calls it cannot make | `user-stories/Situations/Situation-C/` |
| **UJ-C′** | TingTing standing Hug Ocean up from a bundle, into an account that starts empty | `user-stories/Situations/Situation-C-prime/` |
| **UJ-D** | Debra, mobile physical therapist — a schedule that moves through space, where the gap between commitments is a drive | `user-stories/Situations/Situation-D/` |
| **UJ-E** | *Held out.* The ER — annnä was deliberately not designed for it, so every claim is a prediction (FR10) | `user-stories/Situations/Situation-E/` |

Two journeys were new with this document and had no story. One still doesn't (UJ-AGENT); UJ-CALM's probe landed 2026-08-22 — `Situations/Situation-A/situation-5.md`, honestly marked **scripted** in the probe corpus's provenance register, which is why the anchor names its register rather than claiming blind elicitation.

**UJ-AGENT — the founder's own agent, written as predictions.** `[ASSUMPTION]` Its protagonist is the founder, because §2.3 names him the first and for some time only person who will exercise it; every prediction below is stated about him. Every Situation in the corpus has a human at a console; none has an agent as the caller. Because the surface is designed for and not yet exercised, this journey is written in Situation E's form — *predictions to verify*, where a failure names which general primitive is missing — rather than as a narrated run. The predictions:

- The owner's agent, holding a credential the owner issued, can reach every capability the owner can reach through the app, and no more. *(Capability parity — §3, §4.)*
- It calls the same verbs the console calls. No verb exists that only an agent may use, and no verb exists that only the console may use.
- It receives structured results with explicit parameters; nothing requires scraping a rendered surface.
- It carries no session. Two identical calls in different orders, with the same store, return the same answers.
- **The refusal, and it is the beat that matters:** an outward act — messaging a third party, moving value, destroying something — is refused for the owner's own agent exactly as it is refused for the owner's own console, and the owner learns of the refusal in the console rather than only in the caller's response. Permission is never inferred from the fact that the caller is trusted.

**UJ-CALM — Sofia's full board does not read as a wall.** Sofia, months in, opens a genuinely busy day; commitments near now are legible and the rest recede, without anything being hidden or any judgment being applied. *(Formerly `[ASSUMPTION]`, discharged 2026-08-22 — the mechanism is ruled and specified in tracked law (`app/DESIGN.md` §Board rendering, FD-22; asserted at `app/SCENARIOS.md` C9), so the assumption's reason — that narrating would fix an unmade design — no longer holds; see §12.)*

## 3. Glossary

*Downstream workflows and readers use these terms exactly. Where a term already has a normative home in the corpus, the home is named and this entry is a pointer, not a second definition (FR13).*

**Terms this PRD introduces** — no other file in the corpus defines these, and getting them wrong is how downstream specs drift:

- **Agent-first** — the property of admitting agents as first-class users alongside humans, in both senses defined in §1.1: *agent as interface* and *agent as consumer*. Not "has a chat interface", and not "only agents may use it."
- **Agent as interface** — the sense in which a human states intent and an agent orchestrates tools to satisfy it.
- **Agent as consumer** — the sense in which software agents call annnä directly as a client, with the tool contract as the product surface.
- **Commitment harness** — annnä itself, named for the governed envelope around the agent: what it may do, what it may not, and on whose explicit basis. The envelope is the product surface once agents are callers. Distinct from — and named after — the `harness/` layer, which is where the envelope is specified.
- **External client** — any caller of the harness tool contract that is not the app. In v1 this is the owner's own agent and nothing else (§1.2).
- **Capability parity** — the property that for every capability the app exposes to an owner, a tool exists reaching the same capability, under the same permission floor, callable by an external client. The testable form of *agent as consumer*.
- **Wake policy** *(owner-facing name: **presence** — one mechanism, two registers; the alias is declared at the mechanism's home)* — the rule governing which blocks render at full legibility at rest. **Ruled 2026-08-09 (FD-22), closing §11 Q1.** It is a mechanism in four parts, all four the owner's: a **value** (0–100, default **80**, fading fill and ink only — spine, urgency edge, border and micro-mark keep full strength), a **scope** (one entry from a closed four-shape menu, evaluated over a block's own stored data, deciding who rests lit — FD-70 cut the original open predicate to this menu 2026-08-22; it may return as a strict superset), a per-commitment **keep-awake** mark, and a **keep-awake toggle**. Attention is senior to all four. Home: `app/DESIGN.md` §Board rendering, *The wake policy*. *(The former `[ASSUMPTION]` on this entry is discharged: the slot is not parameterized as a single value, and the document it depended on has been released as law.)*
- **Peace** — the product's purpose (`PR/IDENTITY.md` §Purpose). In this PRD it is a requirement with three mechanisms: annnä takes the coordination work, holds the record so the owner's head need not, and governs what the owner is asked to look at.

**Terms with homes elsewhere** — used verbatim, defined once, cited here:

- **Commitment** — the single primitive; one object with orthogonal axes, where event and task are derived presets. Home: `engine/SPEC.md`.
- **Owner** — the principal a board belongs to; the only party whose explicit basis can authorize an outward act. Home: `harness/SPEC.md`.
- **Guest** — a non-owner party reached by tokenized links and forms — entry, and after a completed booking the booking-bound manage link (FD-43) — never an account holder. Home: `security/SPEC.md`.
- **ShareGrant** — the engine-minted object by which a commitment or board reaches another person or link token; `{holder, rung, scope, edit_mode}`, three rungs, availability by default (FR30). Home: `engine/SPEC.md §7.1`.
- **Grant** *(the authorization Grant — a different object, same bare word)* — a standing authorization from the owner that satisfies the permission floor without a fresh confirmation; `{action_class, scope, expiry, revocable}`, and what an auto-accept is recorded as (FR6, FR28). Minting or widening one is an `authorization`-class act, console-only (FD-24), with FD-32's `ShareGrant` carve on the stored-accept path. Home: `harness/SPEC.md §7`; stored shape at `engine/SPEC.md §1.6`. **The two are deliberately separate and must not be merged** — a ShareGrant governs *who may see or edit*, an authorization Grant governs *which action class the floor permits*; `engine/SPEC.md §7.1` exists in part to keep them apart.
- **Permission floor** *(also: the reversibility floor)* — the rule that nothing crossing into the real world happens without an explicit basis from the owner. Home: `harness/SPEC.md`.
- **Board** — the owner's surface; **default mode: no time axis** (a second mode is a traditional hour-grid, FD-81 — `app/DESIGN.md` §Board rendering), two gravities (events pack to the top, tasks flush to the bottom edge), time is block data. Home: `app/SPEC.md`, visual law `app/DESIGN.md`.
- **Console** — the conversational surface where the owner talks to their agent and confirms proposals. Home: `app/SPEC.md`.
- **Situation** — an end-to-end falsification probe in `user-stories/`, never a design target. Home: `user-stories/README.md`.
- **Template** — the transferable shape of how someone runs bookable time; never anyone's data. Home: `marketplace/SPEC.md`.

## 4. Features

*Requirements are numbered **`RQ-##`**, globally and stably. They are not `FR-##`: in this corpus `FR#` means **founder ruling** (`RULINGS.md`), and a second series under the same label is the collision that forced the `R#` → `FR#` rename. `RQ-`, `REQ-`, `AF-` and `CP-` were all checked against the tree and are unused.*

*This section carries requirements this PRD introduces. It does not re-specify the product — §4.1 names the feature families that already have normative homes and points at them, and adds no requirements to them (FR13).*

### 4.1 What is already specified, and where

| Feature family | Home |
|---|---|
| The Commitment primitive, latches, the rule menu, availability, travel, placement | `engine/SPEC.md` |
| The board, the console, proposal cards, the fixed render catalog | `app/SPEC.md`; visual law `app/DESIGN.md` |
| The agent loop, the tool contract, elicitation, the clarify and permission floor | `harness/SPEC.md` |
| Cross-owner reach — grants, creator-set holds, the three accept modes | `engine/SPEC.md` (FR26–FR30) |
| The assisted off-app path — the prepared call, the recorded answer, the invite | `harness/SPEC.md`, gated `harness/SCENARIOS.md` |
| Guest surfaces — one tokenized link, one form, no account | `app/SPEC.md`, `security/SPEC.md` |
| Calendar import — connect once, owner-triggered sync, inbound only | `app/SPEC.md` (FR12, FR36 as amended by FD-37) |
| Skins, templates, install law | `marketplace/SPEC.md` |
| Threat model, token law, PII vault, injection quarantine, compliance posture | `security/SPEC.md` |
| What any candidate model must satisfy, and the exam that grades it | `model/SPEC.md`, `model/EVALS.md` |

### 4.2 The external client

**Description:** annnä admits the owner's own agents as callers of the same tool contract the app calls, under the same permission floor, with no capability reachable by one and not the other. Realizes **UJ-AGENT**. In v1 the only external client is an agent acting for the owner themselves; a different person's agent is out of scope and gated (§1.2). The surface is specified in v1 and exercised when a beta cohort exists (§2.3).

#### RQ-1: Owner-issued client credential

An owner can authorize an external client to act as them against their own board, and can withdraw that authorization.

**`[ADOPTED]` The credential is a fifth class in `security/SPEC.md` §3's capability-token table**, added by the mechanism that table names for its own extension — *"extended only by ruling, the rule-menu discipline applied to credentials"* The ruling is **FD-17** (`RULINGS.md`), cast 2026-08-08 because a requirement is not a ruling and the table's own text admits only the latter. It is emphatically **not** a §3.1 held credential: annnä mints it to admit a caller, rather than storing a secret of the owner's held at a third party, and §3.1 exists to keep those two animals apart.

**Consequences (testable):**
- A credential is issued by the owner through the console. No agent request mints one, and no credential is created as a side effect of any other action.
- Withdrawal takes effect at the next authorization check; a withdrawn credential authorizes nothing thereafter, and revocation is a latch — the honest dead end, never a stale view.
- A declared rate or spend trip **suspends** rather than revokes: suspension blocks use while set, is not a latch, and is cleared only by an owner console act (FD-33, `security/SPEC.md §3`). Revocation remains the latch.
- Every custody rule in §3 binds it unchanged: ≥128-bit random minting never derived from anything guessable; the SHA-256 digest stored and the plaintext stored nowhere, including logs; constant-time lookup on miss with no existence oracle; per-token and per-IP rate limits; the adversarial suite `security/SCENARIOS.md` T9 green before it goes live.
- **It is the only class in the table that attributes to a principal on the inside rather than to a counterparty.** An act performed through it is recorded as an act of **the principal who issued the credential**, with the client identified alongside. It introduces no new actor model: `harness/SPEC.md` §3.1 already distinguishes the **owner** of a board from the **actor** on a turn, and a credential is issued by, and attributes to, whoever holds the role that could have performed the act by hand.
- It authorizes nothing the owner has not authorized. Attribution is not permission (RQ-7).

#### RQ-2: Capability parity

For every capability annnä exposes to an owner through the app, a tool exists that reaches the same capability under the same permission floor, callable by an external client.

**Consequences (testable):**
- An enumeration of owner capabilities and their tools exists, and a mechanical check fails the build when a capability has no tool — the same discipline as the existing roster and gate-coverage checks.
- No verb is reachable only from the console.
- No verb is reachable only by an external client.

**Out of Scope:**
- Capabilities exposed to guests. A guest surface is one link and one form and has no owner behind it.
- Administrator capabilities in the closed marketplace service, which is outside this repo.
- **Authorization and recovery** (**FD-26**, founder-ruled 2026-08-21) — capabilities that create or withdraw a caller's own permission: issuing and revoking the external-client credential (RQ-1: *"No agent request mints one"*), **clearing a credential's suspension** (FD-33's clearer is always human — FD-26's principle applied, else a second credential re-arms a rate-limited first), minting or widening a Grant (FD-24), confirming a restore (`security/SPEC.md §8`: *"not an agent tool"*), and re-enabling a suppressed party (`harness/SPEC.md §3.11`). These are console-only by design, and the principle is stated so the exclusion cannot creep: **a credential must never control who may act as the owner.** Without this class the RQ-2 gate was red forever — or a stolen credential could mint credentials.
- **Appearance** — the active skin, the boring stash, the opacity dial, the fave-four (**FD-19**, founder-ruled 2026-08-08). `app/SPEC.md §7` makes appearance the one app-owned write and §10 makes it invariant that **no seam call carries it**; without this exclusion the mechanical check above could only ever go red, and a gate that cannot go green is worse than none. The exclusion is narrow and principled rather than convenient: appearance is display-only state that never becomes engine truth, so it is not a capability anything schedules against — nothing an agent acting for the owner needs, and the one place where reaching *less* costs the owner nothing. *(Amended 2026-08-22: FD-42 rules that the owner's **own** agent does set appearance, conversationally, as ordinary display-only settings. The exclusion stays **whole for the parity gate** — the gate ranges over the harness tool contract, and the display-only set is not a parity member in either direction, so X1/X6's excluded-class lists stand as written and the gate stays green. FD-42's ruled behaviour reaches appearance by a dedicated path **outside the enumeration**: the `display.settings` write class at `app/SPEC.md §7`, whose seam verb is now named — `display_settings`, FD-66 (2026-08-22), landed per RQ-3's own process (a capability requiring a new verb is a spec change with its own ruling, and FD-66 is that ruling). FD-19's old rationale sentence is superseded; the gate-shaped outcome stands.)*

#### RQ-3: The surface adds no seam verbs

The external client calls the verbs the harness already defines and introduces none.

**Consequences (testable):**
- The seam verb roster is identical before and after the surface exists.
- A capability that would require a new verb is a spec change with its own ruling, not an implementation detail.

#### RQ-4: Results are structured, and nothing requires a rendered surface

**Consequences (testable):**
- Every tool result validates against a declared schema; an off-schema result fails loudly at parse rather than degrading — the poka-yoke the render catalog already uses.
- A client that renders nothing can reach every capability in RQ-2's parity set *(net of the excluded classes — after FD-26, authorization-and-recovery is reachable only through a rendered console by design)*.
- No capability's only complete answer is obtainable by reading a rendered page.

#### RQ-5: No capability depends on session affinity

**Consequences (testable):**
- Two identical calls against the same store return the same result, whichever client makes them and in whatever order relative to unrelated calls.
- Where an interaction spans more than one call, its continuation is addressable by an explicit handle the client holds — never by an implicit server-side session.
- Durable context the agent relies on — standing rules, Grants, ask-once-apply-forever answers — is held as engine records and is readable and revocable by the owner.

#### RQ-6: An interrupted turn resumes or abandons explicitly

**Consequences (testable):**
- After an interruption a client can query the turn's state and either resume it or discard it.
- An abandoned turn leaves no half-applied domain effect: the store holds either the turn's verified complete effect or none of it *(the wording is `harness/SCENARIOS.md` X4's — "no effect at all" was literally unsatisfiable, since attribution records and the turn record survive by law)*.
- Neither path requires the client that started the turn to be the client that ends it.

**Notes:** Raised by the harness research pass; folded into `harness/SPEC.md §5.3` on 2026-08-21, out of the harness backlog that was itself **folded** away 2026-08-29. Optional with one human at one console; load-bearing the moment a stateless caller exists.

#### RQ-7: The permission floor binds every client identically

An outward act — messaging a third party, moving value, destroying something — is refused for an external client on exactly the terms it is refused for the console. Realizes **UJ-AGENT**.

**Consequences (testable):**
- Possession of a valid credential authorizes nothing beyond what the owner has authorized. Permission is never inferred from the identity of the caller.
- A refusal is recorded and surfaces in the owner's console, not only in the calling client's response.
- The agent structurally cannot author a correctness-critical value through this surface any more than through any other (FD-16).

#### RQ-8: The injection posture covers callers, not only text

`security/SPEC.md` §5 requires that a source tag is *"Tagging happens at the door that admitted the string (form return, import, upload) — **never claimed by the client**, never inferred later."* An external client is a client. A credential proves *whose agent is calling*; it proves nothing about *where the words came from* — the caller may be innocently carrying a stranger's sentence into a trusted channel, which launders the provenance the tag exists to preserve.

**`[ADOPTED]` The external surface is a door and it stamps.** Content arriving through it is tagged **`import`** — the existing tier for data brought in from a connected system, already positioned in the ordering `owner > import > document > guest` and already inheriting correctly through derivation, so no new tier and no re-argued ordering. And **quarantine follows prose, not calls**: a structured parameter cannot carry an instruction, so FD-2's tool-less read applies to free-text fields arriving through the surface and not to enums, handles, IDs or dates.

**Consequences (testable):**
- No call may set its own source tag. A client-asserted tag is ignored, not honored.
- Free text arriving through an external client reaches the privileged model only as a structured summary from the tool-less read, and fails closed when no summary can be produced.
- Structured parameters pass without the layer-two read, and a capability whose parameters are structured incurs no quarantine cost at all.
- Layer-one spotlighting applies to everything from the surface regardless.

**Notes:** The cost, named rather than discovered: the noticed-pattern counter in `harness/SPEC.md` runs over `owner`-tagged material only — deliberately, so a stranger cannot manufacture a rule proposal on the owner's board. Under this answer, patterns the owner establishes *through their agent* do not generate standing-policy offers. That is judged correct rather than a regression, since a proposal derived from agent-mediated text is what that rule was written to exclude. **This does not solve injection and may not be written up as doing so** — `security/SPEC.md` §5's honesty rule binds any restatement, including this one; what bounds the residue is the floor (RQ-7), not the quarantine.

#### RQ-9: Inbound calls have an enumeration of record

**Consequences (testable):**
- A document enumerates every capability reachable from outside the app; one that is reachable and unlisted is a defect wherever it appears.

**Notes:** The mirror of `deployment/egress-allowlist.md`, which exists because a call not listed may not be made. The same discipline is owed inbound.

### 4.3 What the owner is asked to look at

**Description:** The board holds a complete life, and completeness is the product's central bet. The same completeness is what makes a board heavy to look at. This feature is the third mechanism of peace (§1.4): governing legibility, without hiding anything and without applying judgment. Realizes **UJ-CALM**.

*The UI/UX session named in §11 Q1 **ran on 2026-08-09** and ruled the mechanism (FD-22); the run resumed and closed 2026-08-21/22 (FD-38–FD-43), and §4.3 is stated against that close. §4.3 survived it: the requirement was right and only its first consequence was a placeholder. The `[ASSUMPTION]` that this subsection was written to be cut is discharged — it was written to be **satisfied**, and it was. Mechanism home: `app/DESIGN.md` §Board rendering, *The wake policy*.*

#### RQ-10: Legibility at rest is governed, and nothing is hidden

**Consequences (testable):**
- The wake policy exists in all four parts — a value, a scope, a per-commitment `keep-awake` mark, and a toggle over the holding — and the value defaults to **80**, not to a state where nothing rests legible.
- **Exactly one scope is active at a time**, carrying exactly one value; setting a new one replaces the old, and no precedence rule is reachable.
- Every commitment on a displayed day is present on the board; none is removed, collapsed away, or withheld. **The value fades fill and ink only** — a block's spine, urgency edge, border and micro-mark are at full strength at every setting, including 0.
- No agent judgment selects what is legible. The rule is mechanical and its inputs are the block's own stored data.
- **Every part is display state.** Setting any of the four writes app settings and never becomes engine truth; no engine value, placement or handle changes, and no part of it is engine-readable. *(The former "emits no seam call" absolute is amended: FD-42's `display.settings` write class rides the ordinary seam into the app-owned store — `app/SPEC.md §7`; **the mechanism half is ratified as `display_settings(diff)` — FD-66, 2026-08-22** — recorded here 2026-08-31 so this restatement stops calling ratified law drafted.)*

**Notes:** *the placeholder is gone.* The first consequence formerly read *"the wake policy takes a value other than `none`"* and passed with any value including a bad one; it was named as a placeholder when written and is replaced now that §11 Q1 is closed. What still has **no** test is the requirement itself — that a full board does not read as a wall. That is a judgment, it belongs on the design-law checklist (`../TDD.md`), and no green check above should be read as satisfying it.

#### RQ-11: Attention is senior to the rule

**Consequences (testable):**
- Engaging any block — hover, focus, or explicit engagement — wakes it, whatever the scope says about it. **Out of scope rests at the floor and reveals on attention to `max(value, floor)`** — the floor being the named `presence-floor` token (a11y A3), so `0` is a fill stop, never a legibility stop; in scope rests at the value. Attention never produces a *third* appearance.
- Engagement remains governed by attention alone; this requirement changes what a block looks like at rest, never what triggers a reaction (`app/DESIGN.md` §Glass).
- **Engaging adds material, never removes it.** A surface is more frosted engaged than at rest, at every setting.
- **A `keep-awake` block ignores the scope but not attention** — it rests at the value and still reacts.

#### RQ-12: The muted state is measured, not eyeballed

**Consequences (testable):**
- Text meets WCAG 2.1 AA contrast **in the engaged state**, over the worst-case region of every installed skin's photograph *(a11y A14 ranges the proof over installed, not shipped — no skin is special)*.
- **Anything that must be read without engagement is measured at rest** — the date row, a settings-pane label, a block's micro-mark — to the same threshold, over the same worst-case region.
- Every surface is engageable by keyboard as well as pointer, so the readable state is reachable without a mouse.
- A skin failing any of the three does not ship — **and a marketplace skin failing either of the first two does not install** *(the third is a property of the app, not of a pack — no door can test it)*: the install door runs the same derived-token floors it runs for schema fields (`app/DESIGN.md §Appearance`; a11y A12), because a bought skin arrives after any build and *ship* alone is unenforceable on it *(clause added 2026-08-22)*.

**Notes:** Already law in `app/DESIGN.md` §Accessibility baseline; restated here because it is the ceiling on how faint the muted end can be, and the aesthetic will otherwise be specified past it. **Amended 2026-08-09:** this formerly required AA in *both* states. That could not hold once the wake policy's value was the owner's — a block at rest sits at the floor with fill and ink faded by the owner's own dial, so "AA at rest" requires either a floor high enough to erase the thesis or a line no build could satisfy. The three consequences above are the honest closure; the ceiling they impose is the same one.

### 4.4 Agent as interface

**Description:** annnä already satisfies this sense of agent-first: intent in, orchestration behind it, clarification rather than a form tree, and configuration as conversation rather than a settings wizard (FR36, FR38). It is specified across `harness/SPEC.md` and `app/SPEC.md` and this PRD adds no requirement to it. What §4.2 adds is that the same properties hold when the caller is the owner's own agent rather than the owner's own hands.

### 4.5 What the specs owe

*The pathway from these requirements to a buildable corpus, as a map of edits to files that already exist. **No new specification file is created by any row** *(re-read 2026-08-29 — RQ-13's was the one exception: `harness/INTERFACES.md §6` had it land as its own spec-class markdown on the `deployment/egress-allowlist.md` precedent, carrying its own INDEX row and count bump, and that file was **folded** back into `harness/INTERFACES.md §7` when the harness package returned to its ruled five files; the row's law is unchanged and its home is now a section)*; the only new artifact is RQ-2's gate script. `engine/` is untouched throughout, which is the clearest evidence that this PRD adds a door rather than an authority.*

*Landed: RQ-1's security rows on 2026-08-08 (FD-17, FD-18); the harness rows — RQ-2 through RQ-9 and RQ-13 — on 2026-08-21, at `harness/SPEC.md §5.3`, `harness/INTERFACES.md §6`, `harness/SCENARIOS.md` X1–X7 (X7 is RQ-13's gate), `harness/BUILD.md` Step 8, and `security/SPEC.md §5`'s door list. RQ-2's mechanical gate lands with the enumeration at that Step 8, per the printed-gate posture.*

| Requirement | What changes, and where |
|---|---|
| RQ-1 | `security/SPEC.md` §3 — the fifth row, by the mechanism that table names for its own extension. `app/SPEC.md` §9 — its "forbidden fifth row" caution is scoped so it reads as about §3.1 held credentials, which is what it always meant |
| RQ-2, RQ-9 | `harness/INTERFACES.md` — **one enumeration serves both**: the list of owner capabilities and the tool reaching each is the same list as what is reachable inbound. `harness/SCENARIOS.md` gains the parity check; `deployment/scripts/` gains the gate that fails the build on a capability with no tool, in the shape `roster-check` already uses |
| RQ-3 | `harness/INTERFACES.md` — the seam, asserting the verb roster is unchanged by its existence |
| RQ-4 | `harness/INTERFACES.md` — declared schemas on the surface |
| RQ-5 | `harness/SPEC.md` — no capability depends on session affinity; continuation by explicit handle |
| RQ-6 | `harness/SPEC.md` + `harness/SCENARIOS.md` — resume-or-abandon. Closes the harness backlog's open item rather than adding one |
| RQ-7 | `harness/SPEC.md` — the floor binds every client identically; `harness/SCENARIOS.md` gains the refusal |
| RQ-8 | `security/SPEC.md` §5 — the surface is a door that stamps `import`, and a client-asserted tag is ignored. `harness/INTERFACES.md` — the quarantine applies to free text, not structured parameters |
| RQ-10–12 | `app/DESIGN.md`, `app/SPEC.md` §2, `app/SCENARIOS.md` — **landed**: the mechanism ruled 2026-08-09 (FD-22, §Board rendering), the wake scenarios `app/SCENARIOS.md` C9/C10 added 2026-08-21 (C10 re-cut 2026-08-22 twice — to the settings pane after FD-39, then to the closed scope menu at FD-70; C9's fixture re-cut with it), and RQ-12's install-door clause landed 2026-08-22 |
| RQ-13 | `harness/INTERFACES.md` — the compatibility policy, since it is a property of the seam |
| The claim itself | `README.md` — annnä is an agent-first commitment harness, and the founder's *"APIs before dashboards"* is already true of the build order with no file saying so. `AGENTS.md` — the `RQ-##` series line and the doc count. `INDEX.md` — this document's row. `PR/IDENTITY.md` — §What it is, **landed 2026-08-08**; its §Mission third mechanism **landed 2026-08-22** (§11 Q2, closed). `PR/REPO-FACADE.md` — the About line, landed the same day under its own standing rule that the line is rewritten when it stops being true |

### 4.6 Probe anchors — the register's tie to the falsification corpus

*(2026-08-22 — every scenario in this corpus "derives from and is refutable against" `user-stories/` (§0), yet at this table's authoring the register and the probe corpus shared **zero** referents: no `RQ-##` appeared in any Situation and no Situation beat was cited by any requirement, so the two could drift without ever contradicting each other. This table is the tie. Every requirement names the Situation folder whose beat exercises it, or honestly declares the probe **owed** — with what the owed probe must show — and `deployment/scripts/probe-coverage.mjs` refuses a requirement that does neither. An `owed` row is a debt, not an exemption: it closes only by a probe landing in `user-stories/` and the row naming it.)*

| Requirement | Probe anchor |
|---|---|
| RQ-1 | owed — a beat where the owner mints a credential for their own agent at the console, and an agent request cannot |
| RQ-2 | owed — one act performed by console and by client with the identical result |
| RQ-3 | owed — a wanted capability refused because it would need a new verb, resolved as a ruling (FD-49 is the process run once, on the corpus itself, not yet in a story) |
| RQ-4 | owed — a renderless client obtaining a complete answer no page was read for |
| RQ-5 | owed — a continuation picked up by handle from a second client |
| RQ-6 | owed — an interrupted turn queried, then resumed or discarded, with no partial write |
| RQ-7 | owed — an external client's across-the-line attempt refused on the console's exact terms, the refusal surfacing in the owner's console |
| RQ-8 | owed — instruction-shaped text arriving through a credentialed call, quarantined, with structured parameters passing |
| RQ-9 | owed — the enumeration of record read as the answer to "what can my agent reach" |
| RQ-10 | Situation-A, situation-5's months-in Tuesday — a genuinely dense board read at rest under her own dial, nothing hidden (probe landed 2026-08-22; scripted register, marked in-file) |
| RQ-11 | Situation-A, situation-5 — Brownie's booking lands as a changed block at rest inside the set wake scope, woken by the owner's own tap, never on its own (same scripted probe; reworded 2026-08-22 to FD-70's owner-initiated menu — the prior "arrives to attention" asserted a system-initiated wake no mechanism provides) |
| RQ-12 | owed — a skin that fails the rest-state measurement refused at the door |
| RQ-13 | owed — a breaking change held at the policy while a credential is outstanding |
| RQ-14 | Situation-A — set down once, by talking: empty account to a kept board and a pasteable live link in one sitting, no second party (`story-sofia.md` + situation-1). **Net of the Generate Link paste path and the import pull** *(2026-08-31)*: the one-sitting state uses neither, so their named gaps subtract nothing from this claim |

## 5. Non-Goals (Explicit)

What annnä is not, and will not become. These prevent the "let me also add this nearby thing" failure at every downstream level.

- **Not a calendar with a chatbot on it.** The primitive is the Commitment, not the appointment. Adding conversational sugar to a grid is the thing this design exists instead of.
- **Not an autonomous scheduler.** Autonomous rescheduling is a standing rejection in `app/DESIGN.md`. Nothing moves a promised time without the owner's explicit basis, and a person whose slot may change is asked, never informed.
- **Not an agent that holds the truth.** §1.2, refusal one.
- **Not open to other people's agents in v1.** §1.2, refusal two.
- **Not agent-only.** Agents are first-class *alongside* humans, never instead of them. A capability reachable only by an agent violates RQ-2 exactly as one reachable only by the console does.
- **Not a two-way calendar.** Inbound import is in scope; outbound sync and write-back are banned and the UI for them is a standing rejection.
- **Not a guest-facing product.** Guests get links and forms, never an account — no password, no sign-in, no agent. A booking-bound manage token (FD-43) gives a guest cancel/move over **their own booking only**; that is the ceiling, and nothing is built past it.
- **Not a dive product.** The Situations are falsification probes; a fix that special-cases a story is the wrong fix. The held-out domain exists to keep that honest.
- **Not a claim to have invented multi-resource scheduling.** `PR/BRIEF.md` establishes that vertical booking software already schedules people and equipment together, and that no outward surface may imply otherwise. The claim is the unoccupied combination, and it is a narrowing.

**Sorted, since FD-71 named an end-state (2026-08-22) — two kinds of row, and the difference matters when the end-state pulls.** **Identity, never changing:** not a calendar with a chatbot, not an autonomous scheduler, not an agent that holds the truth, not agent-only, not guest-facing, not a dive product — and not a two-way calendar, because the end-state absorbs a category by **replacement, never by sync** (the outbound ban is identity, not a v1 economy). **Scope with a trajectory:** the accounting-class, CRM-class and e-sign-class absences FD-71 names enter only by the rulings cadence, scenario-first; the money posture ("possible future, not a premise") already conforms. **Dated scope:** not-open-to-other-people's-agents is v2 behind FR1's legal review (§1.2 refusal two), not identity.

## 6. Scope

### 6.1 v1 is FR10's v1, and this PRD does not redefine it

**FR10 rules that v1 solves Situations A, B, C and D, with E held out.** FR1 defers the cross-tenant referral beat behind a legal review. That is the scope of record and this document does not narrow it. Introducing a third scope word — "v1", "MVP", and something between them — is the failure this corpus has repeatedly paid for, and it is not worth a section heading.

**Confirmed 2026-08-08: FR10 stands and v1 is not narrowed to the cohort.** §2.3 establishes that the first two adoption rings are Situation A shaped; that is an **onboarding order**, not a feature cut. Narrowing was considered and refused for three reasons: all four Situations are already specified, so narrowing would reorder the build rather than reduce the spec, and build order is already held per layer in `BUILD.md`; the cohort straddles A and C rather than sitting inside A, because a freelance instructor receiving and accepting a job is Situation C's other half (`user-stories/Situations/Situation-C/resource-instructor.md`); and the four Situations are the instrument that makes *"design the general capability, not the use case"* checkable — build to one and you build **to** one, and the held-out domain means nothing if the others were never exercised.

**And the thesis deliberately changes no scope.** A new product identity arrives in §1 and nothing about what gets built next moves — which is the intended outcome, not an oversight. The scope was ruled (FR10), the four Situations are the instrument that keeps the primitives general, and a document written to add a door has no business reopening what the building is. What this PRD adds is reachability, not features.

### 6.2 What this PRD adds to v1

- **The external client surface** — RQ-1 through RQ-9, plus RQ-13. Specified in v1; exercised when a beta cohort exists.
- **Governed legibility** — RQ-10 through RQ-12, ruled (FD-22) and landed; the judgment half stays on the design-law checklist per RQ-10's note.
- **The agent-first claim itself**, which **landed 2026-08-08** on `README.md`, `PR/IDENTITY.md` §What it is, and `PR/REPO-FACADE.md`'s About line. It ships as *specification*, not as exercise: each surface says the external client is specified and opens when a cohort exists, and all three sit under the repo's design-specification-not-an-app banner. **SM-C4 binds everything said past that line** — no surface may describe the surface as working until RQ-1 through RQ-9 have green scenarios.

### 6.3 Out of scope

- **Other people's agents as callers.** Blocked by FR1's legal review, which is named as the blocker rather than left implicit. **The cross-principal surface is not specified ahead of that review, and does not get a review of its own.** The human referral and the machine caller are the same legal question — may annnä transmit a person's details to a business the owner has no agreement with, and who controls that transmission — and the corpus already puts the human case concretely in front of the reviewer. What is owed is one sentence in the brief the reviewer receives: *the same transfer may be initiated by the owner's software agent rather than by the owner.* Designing the surface before knowing what is permissible risks building what the answer forbids. `[NOTE FOR PM]` An agent-initiated transfer may raise automated-processing questions a human-initiated one does not; the floor means no act with legal effect occurs without the owner's explicit basis, which likely settles it — that sentence belongs to the reviewer, not to this document.
- **Situation E.** Held out by FR10; every claim in it stays a prediction.
- **Anything the closed marketplace service owns.** FR18 keeps store terms out of this repo entirely.

### 6.4 Adoption order

Stated as readiness conditions, never as schedule (FR2):

- The founder uses annnä at its own console. No external client is admitted while he is the only user.
- The external surface is exercised **when a beta cohort exists** and RQ-1 through RQ-9 have their scenarios green. **(2026-08-24 skip, G1-6:** the leftover agent-first restatement in the retired `CLARIFY.md` §9.8 was skipped, not landed. Do not implement an owner-API consumer or mint the external-client credential this prompt. Do not rewrite §1.1 from that leftover. This section already says when the surface is exercised.)
- Ring two — instructors he knows — is reached **when** the Situation A path runs end to end on real weeks, not simulated ones.
- Centers, and with them the two-sided job-acceptance seam, are reached **when** ring two is producing the freelancer half of that seam.

### 6.5 What ships (FD-80, 2026-08-24)

**This section is the one home of what ships (FR13).** §6.1 stands: FR10's specification scope is Situations A, B, C, D; E is held out; narrowing to one Situation was considered and refused. FD-50 invented “first release” as a second scope word and set it equal to use cases; FD-78 narrowed that to Situation A alone. **Both misread FR10.** A Situation is never a ship unit.

- **What ships is the application** — the commitment harness and the template builder. One product. General primitives. A Situation is a person saying “this is my situation; I want to build the template that lets me do this work.” TDD is that the app can do all the situations. Developers do not ship “Sofia’s teaching” or “Hug Ocean” as verticals (FR38).
- **Proof order, not a feature cut.** After the application exists, the founder enters his real teaching (FD-68 / FD-77). Students are guest-token parties, never accounts. If that week does not fit, the app is not done. §6.4’s adoption rings stay readiness conditions (FR2).
- **One list.** `[r1]` / `[r2]` as a ship-slice are retired. A row is not “later” because it belongs to Situation C. Share seam, min-occupancy, KindTemplate stay with the app. What remains postponed stays postponed **at its own home**: FR1 referral; recorded provider hard points; held-out E; closed-service money (OR-29); unruled `held` deposit (and OR-42, its guest-payment sibling, **scoped out of v1 at its own home** — `security/SPEC.md §2` records the disposition); skins-as-purchasable as already deferred; the external-client credential as §6.4 already said. The stamps on scenario rows and `deployment/scripts/release-tags.mjs` were leftover machinery — kept only so a landing that did not move code stayed green (S2); not law. **Removed 2026-08-26** by the follow-on commit.
- **Suite-parity** (`engine/SCENARIOS.md` Z2, `app/SCENARIOS.md` Z2) is the full harness `[MUST]` suite, including P1 and P2 — not a tagged subset.

History of the cut: `RULINGS.md` FD-50 and FD-78, annotated from this ruling. RQ-14 (§2.3) is the falsifiable first-value bar for *onboarding*, not a ship slice.

## 7. The public surface and its contract

*Adapted in because a tool contract that external clients hold credentials against is a public surface, and this PRD creates one.*

The corpus has strong versioning discipline in two places: kind schemas are pinned at creation as `{schema_id, version}` so a later revision never reopens an existing commitment under a form the owner never saw (FR16), and governing standards are forward-only, so a completed course keeps its version-of-record stamp when the standard is revised (`harness/SCENARIOS.md` §F). Both are about *the past not being rewritten*.

**Neither covers a caller.** Nothing in the corpus states what happens to an external client when a verb changes, because the tool contract has never been external — the app and the harness ship together, so a breaking change was previously a refactor.

#### RQ-13: The tool contract has a stated compatibility policy

**Consequences (testable):**
- A published policy states what constitutes a breaking change to a verb, what notice a holder of a credential gets, and how long a superseded shape remains callable.
- A change that breaks a caller cannot land without satisfying that policy.
- The policy is forward-only in the same sense the rest of the corpus is: a change never alters what an existing call already meant.

**Notes:** Scoped to the owner's own agents in v1, which makes the blast radius small and the policy cheap to establish. It stops being cheap once other people's agents hold credentials, which is the argument for writing it before then rather than after.

**Why the v2 scope matters more than it looks, recorded here because it is the strategic case for RQ-13 and for §6.3.** `PR/BRIEF.md` lists cold start as a live risk: value rises with how many people in a given week are on annnä, and at the start that number is small. The minimal-adoption path (`user-stories/Situations/Situation-C/situation-5.md`) exists because a supplier who is not on annnä has to be phoned. **A supplier who is not on annnä but has an agent does not.** Once other people's agents can transact, the network stops requiring anyone to install anything — which turns the prepared-call path from a concession into a wedge. That case is why the v2 scope is deferred rather than abandoned, and why the contract it will be held to is worth writing while there is one holder.

## 8. Cross-cutting concerns

*Every item here has a normative home and this section is pointers plus what the external client changes. `security/README.md` is written to be handed to an outside reviewer whole; nothing in this PRD may make it untrue.*

| Concern | Home | What the external client changes |
|---|---|---|
| Threat model, tokens, PII vault, injection quarantine | `security/SPEC.md` | A second non-owner-shaped surface; the token table's closure (RQ-1, FD-17) and the quarantine's reach (RQ-8) |
| Compliance posture — GDPR as ceiling, PDPA named, processor not controller | `security/SPEC.md` | Nothing directly. An external client acts *as* the owner, so no new controller relationship is created in v1 |
| The legal gate | FR1; `security/README.md` | Unchanged for v1's own-agent scope. It is the blocker on the v2 scope, and the reason v1 stops where it does |
| Determinism and the model's confinement | FD-16; `engine/SPEC.md`, `model/SPEC.md` | Nothing. The external client is another caller of the same floor, not a new authority |
| Reliability of the model layer | `model/EVALS.md` | The exam grades capability and — since the P-set landed 2026-08-21 — reliability under repetition (`pass^k` over engine state); the P-set first becomes runnable at built-harness Step 3, a build condition rather than an open question |
| Build discipline, environments, what may land on main | `deployment/SPEC.md` | The inbound-enumeration law landed (RQ-9, `harness/INTERFACES.md §6`); the concrete list is produced at harness BUILD Step 8, mirroring the outbound allowlist |
| Accessibility — WCAG 2.1 AA on both audiences | `app/DESIGN.md` | RQ-12 makes it the measured ceiling on §4.3's aesthetic |

**Monetization is deliberately absent.** FR18 makes commercial silence repo-wide, and `PR/BRIEF.md` was ruled to stay on the product and the problem.

## 9. Risks this PRD adds

*The risk register's normative home is `PR/BRIEF.md`. These five are new with this document (the fifth added at Finalize, 2026-08-22) and **survive review — carried to that register, no longer merely owed** (the FDR-13 selection, 2026-08-31; the register's rows at their own home). The register's live count is the register's, not this preamble's.*

- **A public surface is a permanent surface.** Once a credential is issued and something is built against it, the contract's shape is expensive to change in a way an internal contract never was. RQ-13 is the mitigation, now gated at issuance (`harness/SCENARIOS.md` X7: no policy on record, no credential); the surviving residue is X7's own — no scenario can assert that a future breaking change actually honors the policy.
- **An admitted caller spends annnä's money.** Every inbound call can burn annnä-paid `normalize`/`summarize`, so a looping or runaway owner agent converts the model budget into someone else's retry loop — the adversary `security/SPEC.md §1` names as the stolen or looping external client. Mitigations: §10's per-credential rate and spend caps on annnä's own spend, and FD-33's suspension as the trip's consequence.
- **The quarantine was designed against prose, and callers are not prose.** FD-2 is the control the whole injection posture rests on. RQ-8 extends the tagging door rather than the control itself, which is the cheaper half; the expensive half is unchanged and unsolved by design — `security/SPEC.md` §5 states that this pattern mitigates roughly two-thirds of benchmarked attacks, and that the floor, not the quarantine, bounds the rest.
- **A parity requirement can be satisfied downward.** RQ-2 is true if the app is made poorer. SM-C1 exists to catch that, and it is a real failure mode rather than a theoretical one.
- **The agent-first claim can outrun its scenarios.** `PR/IDENTITY.md` requires every outward claim to be grounded in it, and `PR/BRIEF.md` established the precedent by *narrowing* a claim rather than widening it. Saying annnä works with an outside agent, before one has, is that same shape.

## 10. Success Metrics

### 10.1 Product success — pointer only

The success criteria are ruled and their only home is `PR/BRIEF.md`: how many people use it, whether they are still using it month after month, and what they say directly — with feedback as the primary instrument, and two admitted-hard secondary signals. **No numeric target is set there and none may be introduced by derivation.** This PRD introduces none, and §2.3 naming the first cohort supplies what the pilot item needed — closed as OR-40 → FD-77 (2026-08-23) at its home, `PR/BRIEF.md`.

### 10.2 Agent-first conformance — this PRD's own metric

*A design-conformance target, not a user-outcome target. It measures whether annnä is the thing it says it is; it says nothing about whether anyone wants it. Keeping the two apart is what keeps §10.1's ruling intact.*

**How these are scored, said plainly because integers look measured and these are not.** Each row is a **judgment** against the definitions in §1.1, made when this document was written and recorded so that it can be argued with. No instrument produces them. What makes them useful is that the rows are fixed and the reasons are written, so a later re-score has to name what changed. **SM-3 is the only row with a mechanical check behind it.**

**SM-1 — Agent as interface.** Target **9/10**, scored over the rows annnä accepts.

| Row | Now | Target |
|---|---|---|
| Intent in, agent orchestrates, clarifies rather than forms | 9 | 10 — reached when it is equally true from every client (RQ-2, RQ-4) |
| Agent owns the workflow rather than hardcoded routes | 7 | 8 — capped by FD-16, and the cap is accepted |
| State lives in the agent's context | 3 | **Refused.** §1.2, refusal one. Excluded from the target and argued in writing |
| Multiple surfaces collapse into one agent layer | 4 → **6** *(re-scored 2026-08-22 per this section's protocol; what changed: FD-39 retired the islands into the console's settings pane and FD-42 made appearance and text size settable by saying them — the console absorbed every control)* | 10 — RQ-1 through RQ-5 |
| Tools are first-class citizens | 9 | 10 — RQ-2, RQ-3 |

**SM-2 — Agent as consumer.** Target **9/10**.

| Row | Now | Target |
|---|---|---|
| APIs before dashboards | 9 in build order, 0 in exposure | 9 — RQ-1, RQ-2 |
| Structured outputs guaranteed | 9 | 10 — RQ-4 |
| Tool-call ready | 9 | 10 — RQ-3 |
| Stateless by default | 6 → **7** *(re-scored 2026-08-22; what changed: the caller-supplied write id and the resume-or-abandon pair landed as spec — `harness/INTERFACES.md §1.2`, `harness/SCENARIOS.md` X3/X4)* | 9 — RQ-5, RQ-6 |

**SM-3 — Parity coverage.** The proportion of enumerated owner capabilities reachable by an external client under the same floor. Validates RQ-2. Target: complete, and mechanically checked rather than asserted.

### 10.3 Counter-metrics (do not optimize)

- **SM-C1 — Capability removed from the app.** Parity rises when the app loses a capability. Counterbalances SM-3 and RQ-2: parity must be reached by adding tools, never by subtracting surface.
- **SM-C2 — Floor exceptions granted to clients.** Every score in SM-2 rises if the permission floor is relaxed for callers. Counterbalances SM-2 entirely. A floor exception is a design failure recorded as one, never a conformance win.
- **SM-C3 — Confirm-everything flows shortened.** "Surfaces collapse into one agent layer" can be reached by thinning the console until nothing is confirmed. Counterbalances SM-1's fourth row. Nothing applies silently, and that is not a latency problem to be optimized away.
- **SM-C4 — Outward claims ahead of green scenarios.** Counterbalances the whole of §10.2: the score is for building the thing, not for saying it.

## 11. Open Questions

*Five of the questions this document opened were answered on 2026-08-08 and now appear as decisions where they belong: v1's scope (§6.1), what the legal review reviews (§6.3), where this document lives (§0.1), and the two adopted answers behind RQ-1 and RQ-8. **Q1 closed on 2026-08-09**, **Q3 on 2026-08-21**, and **Q2 on 2026-08-22**; all are kept below rather than deleted, because a reader who finds only the answer will re-ask the question. **This document has no open questions.***

1. ~~**Q1 — The wake policy's shape.**~~ **CLOSED 2026-08-09 (FD-22), by the dedicated UI/UX session this question named.** The answer was **not a policy value** — the question's own framing (*a fixed window, a count of blocks, or duration-aware*) was the wrong shape, and choosing among those three would have been the corpus asking the founder a question that belongs to its users. What was ruled is a **mechanism in four parts** — value (default 80), scope, `keep-awake`, keep-awake toggle — with the value and the scope both **the owner's**. Home: `app/DESIGN.md` §Board rendering, *The wake policy*. **Two things this question assumed and the ruling reversed:** proximity-to-now is not the mechanism (the scope as ruled was an open predicate over the block's own data, which can express proximity but is not limited to it — *FD-70 later cut the predicate to a closed four-shape menu, 2026-08-22; the reversal recorded here is unchanged by that, since `today`/`this-week` express proximity without being it*), and *"whether task due chips ramp alongside blocks"* is moot — **the due chip no longer exists** and tasks are ordinary blocks (FD-23). The one thing it got right survives: whether the tier is user-configurable was never a founder question, and the ruling made value and scope settings for exactly that reason.
2. ~~**Q2 — `PR/IDENTITY.md`'s third mechanism.**~~ **CLOSED 2026-08-22, by the outward-copy pass this question named.** §Mission now runs three steps — the third, *"It quiets the looking,"* names the rest-and-wake mechanism in the brand's own voice (authored against `PR/VOICE.md`, not derived), and the mission's closing line carries it: *"first the labor leaves, then the load, and what stays in view learns to be quiet."* The freeze was no obstacle by its own text — `IDENTITY.md` is the **source** outward surfaces derive from, explicitly outside the freeze's scope. Kept rather than deleted for the Q1 reason: a reader who finds only the answer will re-ask the question. *(The original deferral reasoning, preserved: the edit waited because a mechanism sentence must not ship before its mechanism — FD-22 ruled it 2026-08-09, C9 asserts it, and only then did the claim have ground.)*
3. ~~**Q3 — Reliability grading in the model layer.**~~ **CLOSED 2026-08-21.** The gap this question recorded — `model/EVALS.md` grading capability and nothing grading repetition — is filled: the **P-set** (`pass^k` over engine state, ten triples per item, item passes at ≥ 9) landed in `model/EVALS.md`, with the explicit relation that P is the stricter bar and P governs. What remains is a build condition, not an open question: the P-set first becomes runnable at built-harness Step 3, stated in its own section. Kept rather than deleted for the same reason as Q1 — a reader who finds only the answer would re-ask the question this PRD itself raised.

*Agent-initiated speech is deliberately absent from this document. It is unruled, this PRD takes no position on it in either direction, and nothing here is built on the assumption that annnä does or does not speak first.*

## 12. Assumptions Index

*Every `[ASSUMPTION]` in this document, surfaced for explicit confirmation.*

- **§2.3** — The founder uses annnä at its own console and admits no external client until a beta cohort exists; the external surface is v1 specification, not v1 exercise.
- ~~**§3, wake policy**~~ — **DISCHARGED 2026-08-09 (FD-22).** The assumption was that `app/DESIGN.md`'s *"Default wake policy is `none`"* named a parameterized slot that could take a proximity value, and it warned that if the reading was wrong, §1.4, §4.3 and UJ-CALM would need a **different mechanism rather than a different value**. **The reading was wrong, and the warning was right.** The mechanism is four parts rather than a slot, the prior-build document it depended on has since been released as law, and §3, §4.3 and RQ-10–RQ-12 were rewritten to the ruled mechanism rather than re-defaulted. **UJ-CALM stands** — it asked that a full board not read as a wall, and that requirement never depended on which mechanism satisfied it.
- ~~**§2.4, UJ-CALM**~~ — **DISCHARGED 2026-08-22.** The design has now been made and lives in tracked law (`app/DESIGN.md` §Board rendering, FD-22; `app/SCENARIOS.md` C9); the assumption's reason — narrating would fix an unmade design — no longer holds.
- ~~**§4.3, whole subsection**~~ — **DISCHARGED 2026-08-09.** RQ-10 through RQ-12 were drafted ahead of the UI/UX session and written to be cut by it. The session ran; **none of the three was cut.** RQ-10's placeholder consequence was replaced with the ruled mechanism's, RQ-11 gained the scope/floor distinction, and RQ-12's *"AA in both states"* became AA on the engaged state plus a measured-at-rest clause. The requirement each states was correct as drafted.
- **§2.4, UJ-AGENT** — its protagonist is the founder, because §2.3 names him the first and for some time only person who will exercise it. Written as predictions in Situation E's form; every one carries a question mark until a client exercises it.
