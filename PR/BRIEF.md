# BRIEF — the product brief

> **Landed under an explicit exception to this package's freeze** (`README.md` §FROZEN, ruled 2026-08-08, exception ruled the same day). The freeze stands for everything else in the package; this file is the one thing authored after it.

*The investor- and grant-facing compression of the corpus. It is deliberately mostly pointers: `README.md` is already the outward compression of what annnä is, and restating it here would put a second copy of the product story in the tree — the thing FR13 exists to prevent.*

**What this file is the normative home of:** the success criteria and the risk register. Nothing else in the corpus holds either. Everything above those two sections points at a home and does not restate it.

---

## Where each question is answered

A reader coming to this corpus cold asks roughly eight things. Seven of them are already answered, and this table is the whole compression:

| The question | Where it is answered |
|---|---|
| What is it? | `README.md` — the opening claim, and "One week, run twice" for what it is *for* |
| What problem, whose? | `user-stories/` — five end-to-end situations; Situation C is the coordination load, Situation A the memory load |
| Why does it work? | `AGENTS.md` §Package shape, then the four layer `SPEC.md` files. The load-bearing idea is the model/engine split, stated in `README.md` §How it's built |
| Why is the AI safe to trust with a whole life? | `harness/SPEC.md` (permission floor) and `security/SPEC.md` (injection quarantine). The short form: the model can emit a number, and nothing correctness-critical accepts one |
| Who is it for? | `IDENTITY.md` §Who it's for — concentric circles, a mirror rather than a market |
| What does the first version actually do? | `README.md` — the minimal-adoption caveat under "One week, run twice"; law at `harness/SPEC.md §2`, gated by `harness/SCENARIOS.md` O1–O5 |
| How was it validated? | `README.md` §Status, and the kill lists in `archive/` |
| What could go wrong, and what counts as working? | **Below. Nowhere else.** |

## The landscape

*Scanned 2026-08-08. This section answers, in part, the "Competitive one-pager" item in `NOTES.md` §Investor-readiness gaps — partially, because the scan covered the two adjacent categories and not every name that item lists.*

Two categories sit either side of annnä, and neither is a straw man.

**AI calendar assistants** — Motion, Reclaim (owned by Dropbox), Calendly. They optimize a grid the owner still maintains, for knowledge workers inside one company. The category has consolidated: Clockwise was acquired by Salesforce and shut down in March 2026, with Reclaim publishing a migration path. None of them coordinate resources across separate employers, and all of them keep the calendar.

**Vertical booking software** — Anolla (centers, sites, instructors, divemasters, boats and divers; boat-slot management, multi-instructor calendars, group-size limits, equipment stock), Aquateks (certification tracking, instructor scheduling, gear rental for PADI-affiliated shops), Roverd (instructors, equipment and boat schedules with resource limits against overbooking), Bookeo, EVE Diving, Anchor. These already schedule people and equipment together — inside one shop, for one industry.

**What follows for the claim, and it is a narrowing.** Multi-resource scheduling is not novel and no outward surface may imply it is. What is unoccupied is the combination: coordination across employers rather than inside one; a general primitive rather than a vertical one, held honest by a held-out domain; a conversational surface with the model structurally barred from authoring a correctness-critical value; and the owner's whole life on the same board as the business.

**The advantage is architecture and the completeness bargain, not defensible technology.** Anyone can put a chat interface on a calendar. What is hard to copy quickly is a system where the model *cannot* author a correctness-critical value; what is hard to leave is a board holding everything. Any outward material that claims more than this is ungrounded and does not ship.

## Success criteria

*Ruled 2026-08-08. Deliberately light, and the lightness is the ruling, not an omission.*

The signals that count, in order:

1. **How many people use it.**
2. **Whether they are still using it month after month.**
3. **What they say about it directly.** User feedback is the primary instrument, not a supplement to the first two.

Two secondary signals, recorded because they are the ones that would show the promise landing, and admitted as hard to measure cleanly:

- Time spent looking at their own commitments goes down.
- Time spent in scheduling tools goes down against whatever they used before.

**No numeric target is set, and none may be introduced by derivation.** Choosing a benchmark before one person has used the product would be inventing it rather than picking it. A target becomes settable when the first pilots run.

## Risks and the central bet

*The register. Each entry is a live risk, not a resolved one.*

- **The bet is completeness.** A partial schedule cannot protect an owner — buffers work only if the system sees everything they guard. But a whole life is a large thing to ask for, and nothing has tested whether people will hand it over. This is a claim to be falsified by pilots and is never stated outwardly as an achieved advantage.
- **No user has used it.** All validation is internal: five falsification probes and three rounds of structured adversarial review by AI reviewers, not external human audits. That catches design errors. It does not catch wanting.
- **Cold start.** Value rises with how many people in a given week are on it, and at the start that number is small. This is why the minimal-adoption path is specified as first-class rather than as a degraded mode.
- **Legal.** Holding customers' passports and medical notes, and eventually routing customers between businesses, are legal questions before engineering ones. A formal legal review is a hard build gate that green tests cannot argue past — the referral beat is deferred behind it (FR1).
- **Model risk.** The language layer is imported, not written, and models age quickly. They are qualified last against a graded exam, so the system can swap them rather than depend on one.

## What this file does not hold

- **Anything commercial.** Commercial silence governs this package (`VOICE.md` §Commercial silence), and the brief was ruled to stay on the product and the problem.
- **A schedule or a milestone plan.** FR2: documentation states readiness, never schedule. The related investor-readiness gap is open in `NOTES.md`.
- **A named pilot.** Also open in `NOTES.md`, and the success criteria above cannot be exercised until one exists.
