# Founder rulings — 2026-08-06 (the FR series registry)

> ⚠️ **This is an index, not law.** Unlike its neighbours in this folder it is *current*, not historical — but it is still **not the normative home** of anything. Per FR13 each rule has exactly one home; this file only says which. Reading a ruling's consequences means opening the file in the *Landed at* column. Where this index and a package `SPEC.md` disagree, **the package spec governs** and this file is the thing that is stale.

*The rulings made on 2026-08-06, and where each one landed in the corpus. This file exists because six packages cite `FR#` labels whose registry lived only outside the repo — a citation that resolves to nothing is worse than no citation, because it reads as verified.*

---

## The numbering, stated plainly (it has a history, and the history bites)

Two series were in play the same day and they were briefly both called `R#`:

- **`R#` = review findings** — from `annnä-commitment-review-2026-08-06.md`, external to this repo. Commit `d07e571` uses this sense. So do `deployment/SCENARIOS.md` (R1–R10) and `security/SPEC.md` (R1–R3), whose R-labels are **scenario IDs and unrelated to any ruling**.
- **`FR#` = founder rulings** — this file. Renamed from `R#` to `FR#` precisely to end that collision.

**`FR-A` / `FR-B` / `FR-C` are lettered, and that is not a typo.** They were made *after* FR1–FR13, to close decisions those had left open. They are kept lettered rather than renumbered because the corpus already cites them by letter and silently renumbering a live citation is the failure mode this whole file exists to prevent.

**`FR-B` and `FR9` are the same ruling.** FR9 was the first statement (*"the rule is removed; I don't know when or how yet"*); FR-B is the final one, with the execution consequences attached. **The corpus cites `FR-B`.** `FR9` appears nowhere in the repo and should not be introduced.

---

## FR1–FR13

| # | Ruling | Landed at |
|---|---|---|
| **FR1** | v1 solves the Situations, with the **cross-tenant referral beat deferred** | `README.md` (v1 caveat) · `security/SPEC.md §9` |
| **FR2** | **Documentation states readiness, never schedule.** A checklist of conditions is allowed; "start after Phase 3" is not | corpus-wide discipline; no single home |
| **FR3** | Import is **owner-requested and repeatable**; the app prompts exactly once, first session | `app/NOTES.md` — **amended by FR12** |
| **FR4** | Escalation: **in-app always + email default-on**, per-user setting to disable email | `harness/SPEC.md §3.9` |
| **FR5** | **BYO API keys: yes.** The model package wins; the app's ban is struck | `model/SPEC.md §7` · custody at `security/SPEC.md §3.1` (member 2) |
| **FR6** | Auto-accept is legal when the owner set it up; recorded as a **Grant** | `harness/SPEC.md §7` |
| **FR7** | **Convex is ratified** as the serving substrate — after being checked against the criteria, not over them | `engine/BUILD.md` Step 0 |
| **FR8** | **Atomic read-check-write** transactions are a hard engine Step-0 criterion | `engine/INTERFACES.md §2.2` (row 1) |
| **FR9** | *See **FR-B*** — same ruling, final form | — |
| **FR10** | **v1 = Situations A, B, C, D. E stays held-out** | `user-stories/README.md` |
| **FR11** | **The engine handshake is v1 work.** Freelancers stay standalone accounts | `engine/SPEC.md §7.1` |
| **FR12** | **Import: connect the account once, then user-triggered "Sync now."** Never a background poll | `app/SPEC.md §9` · credential at `security/SPEC.md §3.1` (member 1) |
| **FR13** | **Propagation discipline:** one normative home per rule; every restatement cites it | this file's operating rule |

**Also ruled 2026-08-06, and easy to lose because it has no number:** *reactive push to subscribers* is a hard engine Step-0 criterion alongside FR8's atomicity — a non-reactive store must not be pickable by accident. It is row 5 of `engine/INTERFACES.md §2.2`. It travelled with FR8 and landed a step later than it should have; recorded here so the pair stays a pair.

## FR-A / FR-B / FR-C

| # | Ruling | Landed at |
|---|---|---|
| **FR-A** | **Preview is not a step.** The proposal card *is* the preview. The elicitation law stays **propose → accept-or-narrow** | `harness/SPEC.md` (unchanged — it never had the step) · `marketplace/SPEC.md §5`, `marketplace/NOTES.md` |
| **FR-B** | **The console-silent rule is removed. Entirely.** Not narrowed, not rewritten | `app/SPEC.md §3` |
| **FR-C** | **The ChatGPT-subscription slot is v1** | `model/SPEC.md §7` · `model/BUILD.md` Step 5 |

**FR-B's residue, recorded because absences are invisible.** Removing a prohibition is not granting a permission. `app/SPEC.md §3` therefore states that agent-initiated speech is **ungoverned pending design**, rather than leaving a hole where a rule used to be — a deleted prohibition and a granted permission look identical in a diff and are opposite things. Scenario **O1 was deleted** from `app/SCENARIOS.md` and struck from `app/BUILD.md` Step 2's gate list; the app O-family therefore starts at O2, and **O1 must not be recycled for a new scenario** — a future reader comparing against an older revision would silently get the wrong test.

**FR-C's accepted risk:** the slot is contingent on OpenAI's program terms at build time, so v1 contains one requirement a third party can revoke. `model/BUILD.md`'s degrade-to-app-supplied verification is what keeps that survivable. Recorded deliberately, not overlooked.

## FR14–FR18 — the second sitting, 2026-08-06

Ruled after a combined audit pass. Numbered continuing FR1–FR13; the lettered series is closed and not extended.

| # | Ruling | Landed at |
|---|---|---|
| **FR14** | **Entitlement revocation:** a withdrawn entitlement takes effect at the **next entitlement check** (activation, app open) — skin deactivates, fave slot clears, appearance falls back to the shipped floor. One rule, no special cases; the device copy is never deleted | `marketplace/SPEC.md §4` · scenarios `marketplace/SCENARIOS.md` E5–E6 |
| **FR15** | **Guest-facing language is the owner's setting, asked once at setup and stored.** No product default and no fallback list | `app/SPEC.md §5` |
| **FR16** | **`form_ref` is stored on the Commitment**, pinned at creation — the riser's anchor is resolved, never re-derived | `harness/SPEC.md §3.4` |
| **FR17** | **Publication posture:** private and personal material is removed from the tracked tree and the published history rewritten — **amended by FR21**, which bounds "rewritten" to what a force-push can actually achieve | this repo's `.gitignore` + the redactions of 2026-08-06 |
| **FR18** | **Commercial silence is repo-wide, not file-scoped.** Store terms live inside the closed service and are specified nowhere here | `marketplace/SPEC.md §5` |

**Why FR15 has no default, recorded because a future reader will want to add one.** The question "what language does a guest form render in?" has a right answer that differs between one owner and the next. Any default annnä shipped would be wrong for roughly half of all owners, so the design answer is that **the system asks its user once and stores the answer** — not that the founder picks. This is the general rule the corpus follows wherever a policy fork is really a user's fork, and FR15 is its clearest instance. *What FR15 does not reach:* annnä's own catalog surfaces (marketplace category names, bundle `domain` naming) have no owner to ask; they stay open.

**FR14's non-collision, stated because it looks like one.** `marketplace/SPEC.md §3` says unpublish "removes the listing, never the entitlement or the copy." That is a *catalog* event. FR14 governs an *entitlement* event. Under FR14 the device copy still persists; the entitlement stops authorizing activation. Offline, no check can complete, so the last-known entitlement stands and nothing is yanked — which is what keeps the outage laws (`app/SCENARIOS.md` S4/S6) true.

**FR18's cost, accepted.** A builder eventually needs the store's terms and will not find them here. That is the intended state: this repo is the open half, and the terms belong to the closed service.

---

## FR19–FR22 — the third sitting, 2026-08-07

Ruled against a third audit of the corpus. Same series, continuing FR18.

| # | Ruling | Landed at |
|---|---|---|
| **FR19** | **The off-repo citations stay, and no `research/` directory is ever created.** Citations of the form `research/<name>.md:line` point into a tree on the founder's machine. They are honest provenance, every law they reach is stated in full in-repo, and a reader who greps for `research/` finds the disclaimer rather than a broken link. Do not delete the citations and do not satisfy them by creating the directory | disclaimer at `app/DESIGN.md:5`; citations at `:11`, `:94` |
| **FR20** | **Real Phuket operator names stay as written.** They are public businesses named as market-landscape context, never as actors, under the fiction notice that already governs the folder. Anonymizing them would destroy the finding — that the market's fragmentation *by tourist-language* is real, specific, and checkable | fiction notice at `user-stories/Situations/Situation-C/README.md:3` |
| **FR21** | **The published repo is never deleted or recreated.** The pre-redaction commit `26445df` is unreachable but remains addressable by SHA until GitHub garbage-collects it; that residue is accepted rather than chased. No `filter-repo`, no orphan-branch rebuild, no recreation — none of them reach a commit the host already holds, and the question is closed regardless of method | this file; **amends FR17** |
| **FR22** | **A defect is scoped to what verification supports, not to what an audit asserts.** Every remediation item carries a `file:line` checked in the working tree at the time of writing. Three of the third audit's tasks shrank on inspection, one was inverted, and five were dead on arrival | method; no single home |

**FR21 amends FR17, and the amendment is the interesting half.** FR17 committed to *"the published history rewritten."* It was — the tracked tree was redacted and force-pushed — but a force-push does not unpublish what a host has already stored. FR21 draws the line at what is actually achievable: **the tree is clean, the history is one commit, and the orphaned old commit is left alone.** The lesson generalizes past this repo: *the moment to keep private material out of a public repo is before the first push, because nothing after it is fully reversible.*

**Why FR19 reads as a non-answer and isn't.** Deleting the citations would make the corpus look self-contained while removing the reader's only means of checking where a law came from. Creating the directory would mean inventing files to satisfy a pointer. Keeping both the pointer and the disclaimer is the only option that stays true — it says plainly *this came from somewhere you can't see, and you don't need to.*

---

## FR23–FR25 — the fourth sitting, 2026-08-07

Ruled against the DR/addressing gap review. Same series, continuing FR22.

| # | Ruling | Landed at |
|---|---|---|
| **FR23** | **Restore is the owner's act.** The console detects a shortfall against the backup watermark, offers **one card** naming what is missing and when the last good copy was taken, and **writes nothing before the owner confirms**. Not an agent tool — no harness tool gains a restore verb, the same posture as *"the agent never shreds"* — and not a support ticket: annnä does not decide for an owner when their own board should be rolled forward. A restore is an appended, attributed write; it never rewinds, never un-latches, and never crosses a tenant | `security/SPEC.md §8` (the owner-scoped restore bullet); gated at **D5**; restated as a card in `app/SPEC.md §3` |
| **FR24** | **The backup cadence and the loss/recovery bounds are internal.** They are engineering targets, not a published promise: `README.md`, `security/README.md` and `PR/*` state no recovery commitment, and the numbers live in exactly one place. An unmet public RPO/RTO is a broken promise; an unmet internal target is a bug — the difference is worth keeping | `security/SPEC.md §8` (the cadence bullet, which says so in its own text) |
| **FR25** | **Backup retention `N ∈ [14, 90]`, default 30.** The floor exists because N is the **restore depth**, not only the erasure horizon — shortening N shortens recovery by exactly as much, and a build that sets N = 7 satisfies every other word of §8 while quietly making recovery worse. Carried to the Step 8 legal review as a **confirm item, not a blocker**: if the reviewer wants a shorter erasure horizon, the floor moves and nothing else does | `security/SPEC.md §8` (the erasure bullet, which now states both bounds) |

**Why FR23 overturns the obvious answer.** Ops-triggered restore was the safer-looking default and it was wrong: the owner is the only party who knows whether the missing data *should* be there. What makes handing them the button safe is not a permission check but a structural one — **a restore never un-latches.** Latched acts are forward-only, so a restore can return structure that was lost but can never contradict a promise a guest already holds. If any future edit weakens the un-latch prohibition, this ruling has to go back to ops.

**What the watermark does not do, recorded so it is not assumed.** It sees **absence, not wrongness**. Same-volume corruption passes it silently, and so does loss below the threshold. The agent itself never detects loss and never could — nothing in annnä deletes, so it never observes a deletion; a lossy store simply returns less. Detection is a property of the backup, not of the conversation. A declared partial detector is worth more than an over-trusted one.

---

## FR26–FR36 — the fifth sitting, 2026-08-07 (the wayfinder map)

Ruled through the wayfinder decision map (GitHub issues #1–#12 on this repo; each ruling's full record is its ticket's resolution comment). Same series, continuing FR25.

| # | Ruling | Where it lives |
|---|---|---|
| **FR26** | **One commitment, always — the bind handshake redrawn, not ratified.** There is exactly one commitment object regardless of how many people are involved; **whoever creates it owns it, and ownership does not transfer** (at this time). It reaches other boards and eyes only through engine-minted **grants**. The drafted paired-commitments pair-write is dead; Google Calendar's one-event-with-guests is the stated precedent, the incumbent two-records-reconciled shape explicitly rejected | `engine/SPEC.md §7.1` (issue #2) |
| **FR27** | **The hold is the creator's setting.** The share form carries a hold-duration field: **default 5 minutes, range 0–24 hours**, 0 = no reservation. While offered, the targeted window is held for that duration, then freed | `engine/SPEC.md §7.1` (issue #2) |
| **FR28** | **Three accept modes, user-chosen:** auto-accept what fits the schedule · auto-accept per person · always manual. The first two are ordinary stored Grants; silence never books anyone | `engine/SPEC.md §7.1`, `harness/SPEC.md §7` (issue #2) |
| **FR29** | **One machine.** The same code path serves own-board and cross-owner bookings — a cross-owner booking is an ordinary booking needing one more yes; no dedicated cross-tenant entry point | `engine/SPEC.md §7.1` (issue #2) |
| **FR30** | **The grant vocabulary:** three rungs (availability — the default exposure · details · edit); a grant attaches to one commitment or one board and is held by a person or a link token; no group grants, no manage-sharing rung; edit is per-grant direct-or-approval, defaulted direct | `engine/SPEC.md §7.1` (issue #12) |
| **FR31** | **BYO attended-only, ratified.** The 2026-08-06 drafted confinement stands as written | `model/SPEC.md §7` (issue #3) |
| **FR32** | **The catalog surface renders in the viewing owner's stored language**, English fallback where untranslated | `marketplace/SPEC.md §6` (issue #4) |
| **FR33** | **No-show is always a human mark;** the policy is a creator-set per-commitment field binding at booking under §1.5 | `engine/SPEC.md §1.9` (issue #5) |
| **FR34** | **Reachable = responded within the offer's hold window;** ranked walk one candidate at a time; exhaustion parks to the owner. A decline always carries a structured reason; the re-offer is the only counter | `harness/SPEC.md §3.4` clocked-offer law, `engine/SPEC.md §7.1` (issues #7, #8) |
| **FR35** | **A precondition may require a recorded human conversation; its violation parks as a human decision** — documents alone never satisfy it. Wiring a domain flag (e.g. dive medical) to it is template configuration, not platform law | `engine/SPEC.md §3` precondition row (issue #9) |
| **FR36** | **Calendar import v1:** Google, Microsoft, iCloud (app-specific password), ICS links; the connect flow is the console conversation; copy at the industry minimum, no extra disclosure | `app/SPEC.md §9` (issues #10, #11) |

**Also answered in the same sitting, recorded on their tickets rather than numbered:** the store-probe domain brief (issue #6 — agent-suggests discovery, Sofia templates-only, empty-account install) — story inputs, not spec law.

## FR37–FR38 — same day, after the map

| # | Ruling | Where it lives |
|---|---|---|
| **FR37** | **Domain content is user-built proof, not founder-ruled spec.** User stories and their domain designs — F7's courses and F20's boat minimum among them — are validated by the founder building them *as a user* inside the app, proving any user could build them; no founder ruling is owed on them, ever. The platform owes only the enabling mechanisms (template expansion `engine/SPEC.md §1.12`, clock-triggered rules `engine/SPEC.md §3`) | `engine/SPEC.md §1.12` and `§3` stamps |
| **FR38** | **We build the tools, never the templates — the law is authorship, not shipping.** The product is the application — engine, harness, app, marketplace. **First-priority acceptance: a user can author a template through their agent** and share it to the marketplace. Every template named in the user stories and READMEs **may ship as a production default for all users** — but only after the founder, as administrator, has built it *through the application*, because each one is the proof that any user could. Claude/developers never author a domain template; the founder's prove → save → ship path is the existing admin-only supply law (`marketplace/SPEC.md §0`/`§2`) worn as a workflow. Development carve-out: domain content may exist during development **only as declared throwaway** — named as scaffold before it is built, stripped before ship, rebuilt through the application as the proof. Undeclared domain scaffold is a violation | this registry entry; binds `marketplace/SPEC.md §2` (Publish/authoring) + §0 (admin-only supply), `engine/SCENARIOS.md` W5 (expansion-equivalence) → `marketplace/SCENARIOS.md` I6 (authoring-equivalence), user-stories/README framing |

## Provenance — which decisions were the founder's, and which were drafted

*Added 2026-08-06. This section exists because a ruling label carries authority, and a reader cannot otherwise tell an answered question from a drafted one. Recording it is cheaper than reconstructing it later, and impossible to reconstruct once the working sessions are gone.*

**Founder-originated.** FR1–FR13, FR-A/FR-B/FR-C, FR14–FR18, FR19–FR22, FR23–FR25 and FR26–FR38 above are all **answers the founder gave**. Each closed a question that was put to him directly. The registry entries above record the answers, not proposals.

**Drafted on the founder's behalf, and not separately ratified.** A repair pass on 2026-08-06 authored **thirteen design decisions** directly into spec text, because the instruction was to complete the plan rather than stop midway. They are real architecture calls, not wording fixes, and they carry no ruling label of their own. The four with the largest blast radius are named here; the rest are diffused through the same pass:

| Decision | Where it lives |
|---|---|
| **The cross-owner bind handshake** — the corpus's largest hole, drafted as paired commitments with an engine-minted `BindProposal`. **Superseded 2026-08-07: FR26–FR29 redrew this seam** (one commitment, grants, creator-set holds); the no-seam-verb stance survived into the ruling, the pair-write did not | `engine/SPEC.md §7.1` (now founder-ruled) |
| **F7 → `KindTemplate`** — a saved course is authoring-time vocabulary that *expands into* `order` + `depends_on`, so §1.8's "no third mechanism" survives. **Scoped 2026-08-07 (FR37): no ratification owed** — the mechanism stands; the course content is user-built proof | `engine/SPEC.md §1.12` |
| **F20 → `min-occupancy`** — the menu's only rule evaluated at a clock trigger, whose violation is an owner decision rather than a refusal. **Scoped 2026-08-07 (FR37): no ratification owed** — the mechanism stands; the boat is user-built proof | `engine/SPEC.md §3` |
| **BYO confinement to attended-only** — the load-bearing reason is *qualification*, not session mechanics: a user's own model is an ungraded path to the same seam. **Ratified as written 2026-08-07 (FR31)** | `model/SPEC.md §7` (now founder-ruled) |

**Also applied without prior ratification:** the **`FR#` rename** itself. The plan reserved it for the founder; the repair pass applied it because the collision had become concrete — `R7` meant "Convex ratified" here and "production refuses anonymous access" in `deployment/SCENARIOS.md`. Only founder-ruling citation sites were renamed; scenario IDs are file-local and were untouched. One word reverses it.

**How to read a drafted decision.** Treat its *reasoning* as a proposal and its *presence in the spec* as provisional. Where a drafted decision and a founder ruling disagree, the ruling wins. Where a drafted decision is simply wrong, it can be changed without overturning anything — that is the point of recording this.

---

## Provenance — the working documents beneath this index

Superseded working documents, all **external to this repo** and not published: three reviews → two plans → three comparisons → two combinations → a final plan of record, which is the source this index was built from. Those files are working material and deliberately stayed out; **this file plus the package specs are the corpus's record.** Nothing here depends on reading them.
