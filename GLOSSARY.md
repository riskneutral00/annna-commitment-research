# GLOSSARY: the words annnä uses, and what each one currently means

*Working vocabulary for stories, specs and conversations with Matt. Dated founder statements record current intent. Existing technical meanings are identified separately; the glossary does not silently change their implementation contracts. Open questions remain open.*

## How to read an entry

Labels distinguish the sources of each meaning. Usage notes and tensions explain where the meanings differ.

| Label | Means |
|---|---|
| **Ordinary meaning** | The everyday sense, paraphrased from a general dictionary and linked. Not a product decision. |
| **Founder** | Something Matt said, with its date. Distinguishes a firm statement from a preference, possibility or unanswered question. |
| **Spec** | Where the term is defined or used normatively today, and how. |
| **Open** | What is undecided. Stated as a question, never answered here. |

Founder statements dated 2026-10-16 come from Matt's re-interview about annnä. Its verbatim record is `~/Desktop/Harness Harness/inbox/annna-interview-2026-10-16.md`. The statements below remain readable without that local record. Conflicting older wording is retained as evidence, not confirmation of Matt's current wishes. Technical rules keep their existing homes under `AGENTS.md` §Two standing constraints.

## Core terms

### annnä
**Spec.** The product, spelled `annnä` and pronounced like "Anna"; the app is personified, so the owner talks to her (`AGENTS.md` §Standing discipline).

### Owner
**Spec.** A principal who owns a board. Actor and customer are distinct roles (`harness/SPEC.md` §3.1). Guest access is governed by `security/SPEC.md` §3.

### Commitment
**Ordinary meaning.** A promise or firm decision to do something, or something you have agreed to do that takes your time ([Cambridge](https://dictionary.cambridge.org/dictionary/english/commitment)).
**Founder, 2026-10-16.** Events, tasks, routines and possibly more are all commitments. "Commitment" is the user-facing umbrella word, especially on the Board. The ordinary definition may need some flexibility for this use; the glossary is where that gets worked out, not by inventing a private definition.
**Spec.** The shared stored object is described in `harness/SPEC.md` §3.4 and `engine/SPEC.md` §1.3. Its temporal type derives from time roles; `title` is its only universally required field. This records the existing representation, not a settled answer to the glossary's event/task question.
**Open.** How far past events, tasks and routines the umbrella reaches ("and possibly more"). Whether a stored thing that promises nothing to anyone (a bare draft, a personal preset) is still called a commitment to the owner.

### Board
**Founder, 2026-10-16.** The landing UI/UX: where the owner sees all their commitments, though not necessarily all at once. Separate, combined, calendar and alternative views are undecided.
**Spec, legacy internal sense.** `harness/SPEC.md` §3.2 names `Board` "the universal availability primitive": a per-person or per-resource capacity record that commitments draw on, stored at `engine/SPEC.md` §1.2. An owner may hold several such boards, and a proxy board stands for a schedule kept elsewhere. The owner-facing view over them is `engine/SPEC.md` §1.7b, the owner board projection.
**Usage.** With Matt, "the Board" is the landing view. In engine and harness text, `Board` keeps its stored meaning until a ruling renames one of them. Write which sense you mean when both could be read.
**Open.** Whether the public word and the internal object should share a name. Which views the landing Board offers. This glossary decides neither and changes no data model.

### Event
**Ordinary meaning.** Anything that happens, especially something important or unusual ([Cambridge](https://dictionary.cambridge.org/dictionary/english/event)).
**Founder, 2026-10-16.** An event can involve just the owner, and it can be online. The exact event/task boundary is expressly open and the glossary work may change the current derivation.
**Spec.** A commitment whose time fields carry an occupying interval; the stored type derives from time roles (`harness/SPEC.md` §3.4). Matt's earlier suggestion that every event requires people, place, start and end remains tentative. Owner-only and online examples clarify it without settling every required field or draft behavior.
**Open.** What, beyond an occupying interval, distinguishes an event from a task to the owner.

### Task
**Ordinary meaning.** A piece of work that needs to be done ([Cambridge](https://dictionary.cambridge.org/dictionary/english/task)).
**Spec.** A commitment with no occupying interval, so it never reserves time or enters conflict; it may carry a deadline, a window and a repeat (`harness/SPEC.md` §3.4; FD-107 (i) in `RULINGS.md`). Done and skipped are facts recorded on each occurrence.
**Open.** See Event. Also see Routine for the gym tension.

### Routine
**Ordinary meaning.** A usual or fixed way of doing things; the things a person habitually does ([Cambridge](https://dictionary.cambridge.org/dictionary/english/routine)). The dictionary describes habit; it prescribes no scheduling engine.
**Founder, 2026-10-16.** One scheduled morning run is not a routine. A thing is a routine only if it recurs at some interval. The interval need not fix a day or time: a flexible weekly equipment check is a routine because it happens every week, even on different days. Matt also raised a menstrual cycle as a terminology example with expected ranges and possible interruption; he left its classification open.
**Spec.** "Routine is the user-facing name for a Pattern and its identified occurrences" (`engine/SPEC.md` §1.4). Each occurrence is an ordinary commitment whose event/task type derives from its own time roles. Confirmation ("Is this a routine?") and scope belong to `harness/SPEC.md` §6. The stored `shape` menu is daily, weekly by days and monthly by date, each with an interval and exceptions.
**Tension, flagged not relabelled.** Story S03a (`user-stories/Situations/Situation-A/story-matt.md`, "The result carries the Task label, not Routine") labels the repeating Gym commitments Task rather than Routine. Matt's flexible weekly example now qualifies as a routine. Whether task and routine are overlapping descriptions or exclusive choices remains open; the current story and type control need review against the glossary before either is revised.
**Open.** How "every week, on no fixed day" is expressed, since the stored shape menu names days or dates. Whether a recurrence that is interrupted, paused or ended is still called a routine, and what the owner calls its record afterwards.

### Recurrence, Pattern, Occurrence
**Spec.** `Pattern` is the stored repeat rule; the engine materializes real commitment rows from it over a horizon, each an occurrence with its own id, latches and history (`engine/SPEC.md` §1.4). "Recurrence" is the generic word for the repeat; "Routine" is the owner-facing word for the pattern plus its occurrences.

### Cycle
**Open terminology.** Matt's natural-cycle example raises the question of recurrence with expected ranges and interruptions. No product definition of cycle is adopted here. It specifies no tracking, prediction or health feature. `harness/SCENARIOS.md` J5 lists a "cycle entry" among personal presets absorbed as ordinary commitments; that existing example does not settle the new question.
**Open.** Whether cycle is a kind of routine, a kind of recurrence shape, or just a description. Whether it is a commitment at all.

## Fields, asks and permission

### Required field, optional field
**Founder, 2026-10-16.** While a commitment is being created, annnä should prompt the user to distinguish required and non-required fields. Matt connected this to confirmation; exactly what is confirmed and when remains open.
**Spec.** `title` is the only universally required field (`harness/SPEC.md` §3.4); a kind's schema declares the rest, and the field/rule lifecycle and gap-driven asks are `harness/SPEC.md` §3.3 and §6 ("Fires only on a gap").
**Usage.** Field requiredness is a question about the owner's own record. It is not the same as a fulfilled precondition, a counterparty's confirmation, or a grant. Keep the three words apart.
**Open.** Whether requiredness is set per commitment, per kind, or both. Nothing here makes an engine rule user-optional or infers anyone's consent.

### Precondition, condition set
**Spec.** A stated requirement a commitment carries, satisfied by recorded evidence; its status is reported in the condition set (`harness/SPEC.md` §3.4, `engine/SPEC.md` §1.3 "preconditions[] carrying evidence").

### Confirmation
**Spec.** Commitment confirmation, accepting a draft proposal and authorizing an action are different uses of the word. The commitment latch is defined in `engine/SPEC.md` §1.3; proposal acceptance in `harness/SPEC.md` §6; live confirmation or a matching standing grant in `harness/SPEC.md` §7. Completing required fields alone is not evidence that another party agreed or permission to act.
**Open.** Which of these meanings Matt intends when describing required fields and confirmation.

### Permission floor
**Spec.** The clarify/permission policy no setting can remove, drawn at the reversibility line (`harness/SPEC.md` §7). Nothing in this glossary moves it.

### Suggestion
**Founder, 2026-10-16, preference.** "I think I like the idea of the user being able to toggle if they want suggestions or not from annnä." Expressed as a preference, not a ruling. No default, frequency, budget or permission change was stated.
**Spec.** The nearest existing machinery is the noticed-pattern offer with explicit opt-in (`harness/SPEC.md` §3.10 and §6; brief at `user-stories/_briefs/noticed-pattern-offer.md`).
**Open.** Whether the toggle is that opt-in, a wider setting, or something new.

### Generative UI
**Founder, 2026-10-16, possible role.** When annnä assembles the people, places, equipment, contacts, forms and records a commitment needs (the missing-cylinders example from the interview), generative UI is where that assembly may surface. A possible role, not a settled design.
**Spec.** The render path today is `render_generative` in `app/SPEC.md` ("The live authoring preview is this same render path").

## Supporting vocabulary

### Kind, template, order, rule, grant
**Spec.** `kind` is the vocabulary layer (`harness/SPEC.md` §3.3). Templates are defined in `marketplace/SPEC.md`. An order groups commitments (`harness/SPEC.md` §3.7). Rules are defined in `harness/SPEC.md` §3.5. A harness authorization `Grant` is defined in `harness/SPEC.md` §7; availability-sharing `ShareGrant` is defined in `engine/SPEC.md` §7.1. Name the particular grant instead of treating these as interchangeable.

### Lesson, deadline
**Usage.** Domain words from Matt's own story. A lesson is a kind in Situation A; a deadline is an `end` with the `deadline` role (`harness/SPEC.md` §3.4). Domain vocabulary belongs to stories and templates, never to engine code (`AGENTS.md` §Corpus language and design discipline).

## Outside software

Matt's 2026-10-16 statements below come from the 17:04 interview answer and the 19:00 direct-session ruling; both are quoted in full at `RULINGS.md` "2026-10-16 outside-software ruling". That ruling settles this vocabulary; do not ask him about it again.

### Outside software, other apps
**Founder, 2026-10-16.** "Annnä should not need to be interacting with any other software in the sense that you're talking about." "Anna's scope is only within the application itself." "We're not accommodating other applications."
**Spec.** annnä makes no change inside another app, takes no booking through a third-party platform (Preply, iTalki) and shapes no export for another app (`PRD.md §5`, "Not an integration with other applications"; `harness/SPEC.md §0`).
**Usage.** Not the same as a **real-world service** around a commitment (an instructor, a boat, a venue), which is a party or resource annnä records. See Service.

### Import
**Founder, 2026-10-16.** "It can intake software from other places. That's something that we have to work on." Calendar examples: iCal and Google Calendar.
**Spec.** Information flows in only: calendar import law at `app/SPEC.md §9`. Legal **takeout** of a user's own data (`security/SPEC.md §8`) is a duty to that user, not an export to another app.
**Open.** Whether, and how, a user's own agent may bring that user's information in ("might possibly look at"). Carried to Matt's dedicated harness session; do not ask piecemeal.

### MCP, external client
**Founder, 2026-10-16.** "Annnä will have an MCP exposed so that other people's agents can use it, including the OpenAI subscription."
**Spec.** MCP is the transport of the external-client surface, the same tool contract under the same floor (`harness/SPEC.md §5.3`; `PRD.md §4.2`).
**Founder, 2026-10-16, ~19:30.** "The AI doesn't do anything that the student can't do." An outside agent may do exactly what the person it represents can do in the app (`PRD.md §1.2`, refusal two superseded in part). What a provider subscription permits is unverified.

### Embed, plugin
**Founder, 2026-10-16.** A business "plug[s] in annnä" to its own website, "just like they have to do web plugins"; a desktop user brings "in a plugin".
**Usage.** In Matt's sense a plugin is annnä brought whole into someone else's website or computer. It is not third-party code inside annnä (a standing rejection, `PRD.md §5`) and not the "plugin" of FD-72's answered mechanism question. Where both readings are possible, say which.

### Harness
**Spec.** annnä's own governing layer: the loop, the tool contract and the permission floor (`harness/SPEC.md`; `PRD.md §1.3`).
**Founder, 2026-10-16.** "You will not use the Harness outside of annnä." There is no separate harness product; FD-83's domain-blind loop core is a code-structure rule, not a product for others.

### Service around a commitment
**Founder, 2026-10-16, 17:04.** "Users can add any service that is around the commitment. But we might need to discuss what this means."
**Usage.** Read as real-world providers a commitment needs (an instructor, a boat, cylinders, a venue), not as software connections, which the 19:00 ruling excludes.
**Open.** What else counts as such a service. Matt offered to explain through better user stories. Carried to his dedicated harness session; do not ask piecemeal.

## Unresolved

1. The event/task boundary beyond "has an occupying interval".
2. Routine as recurrence-at-an-interval versus the stored day/date shape menu, and what interrupted recurrence is called.
3. Whether the repeating gym task in S03a is also a routine under the 2026-10-16 statement.
4. The public Board (landing view) versus the internal `Board` object, and which views the landing Board offers.
5. Whether cycle is a term the product uses.
6. The suggestions toggle and the generative-UI role, both expressed as preference or possibility.
7. Per-commitment versus per-kind field requiredness.
8. What counts as a service around a commitment, beyond real-world providers (carried to Matt's dedicated harness session).

## Blocked On

| Gap | Blocker | Resolver |
|---|---|---|
| Final event/task/routine definitions and the S03a tension | Matt explicitly wants to explore the definitions before settling their boundaries | Matt in the glossary interview |
| Interrupted cycles and the wider commitment meaning | Matt explicitly left the classification unknown | Matt in the glossary interview |
| Required fields and confirmation | The intended confirmation and conditions have not been distinguished | Matt in the glossary interview |
