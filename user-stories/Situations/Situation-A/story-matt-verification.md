# Matt English — verification companion

Scripted, end-state, derived. This companion preserves the obligations behind [Matt’s story](story-matt.md), not evidence of a working product or legal clearance. The story follows the corpus’s SPEC-tier narrative convention; this file states no new layer law. The approved exception is narrow at [FD-68](../../../RULINGS.md#fd-68-matt-english). The earlier Situation A tellings retired under [FD-106](../../../RULINGS.md) — every beat is re-told here or moved to Situation D.

Read [layer debt](#layer-debt) before treating a depicted capability as implemented; use [cases](#cases), [CRUD](#crud), [harness cues](#harness-cues), [LEGAL-01](#legal-01) and the [October and November ledger](#october-ledger) to check a specific claim. *(The review-disposition, draft-lineage and source-transfer sections retired 2026-09-17, FD-109; git history keeps them.)*

<a id="layer-debt"></a>

## Layer debt — what this publication does not close

Every row below is Gap / owed for the exact Matt flow. Existing primitives are relevant homes, not passing assertions about the new composition. No row creates a v1 deferral, grants app readiness, or changes an existing layer SPEC. Story instructions that outrun current contracts need explicit propagation and tests at those homes before implementation. A scripted demonstration cannot independently falsify the mechanism it was written from; publication closes source-transfer debt only. The table is also the key to every **Trace** in this file: each scene, case, CRUD family and cue lists the layer rows whose own text cites its ID, each with the `BUILD.md` step whose Verify or Gate line names that row (any step naming it where none does); an `EVALS.md` qualification paragraph counts each item it names for every ID it names, and a model row closes at Step 3. The layer link leads here to that layer's rule home, seam and owning verify condition. A layer this table names for the ID but no row yet cites is listed as owed; where neither names one, the owed layers are read from the case's own trigger and outcome. A trace is found by ID search, so it is a pointer and never a passed result: a citing row may still assert less than the ID requires, and a layer not listed may still owe work ([the traceability rule](../../README.md#the-bar-a-story-passes), item 5).

| Layer / existing home | Story obligation and cues | Current limit and owed work | Owning BUILD verify condition |
|---|---|---|---|
| <a id="trace-harness"></a> [Harness SPEC](../../../harness/SPEC.md), [interfaces](../../../harness/INTERFACES.md), [scenarios](../../../harness/SCENARIOS.md) | [HR-01](#hr-01)–06, [HR-08](#hr-08)–22, [HR-24](#hr-24)–42: typed Routine/Task/Event capture, synchronized form/console, conditional questions, private author/save/use, blocker resumption, own-booking guest actions, reminders, written-not-sent messages, a no-show rule asked once, the read-back catch, the budget park and truthful refusals. | “There is no Harness 3” remains the current contract. The new restricted guest console needs its own operation allowlist, credential-derived context and routing, including direct forbidden-call refusal. The shared-request and delegated-coordinator law whose scenes FD-106 retired stays story-owed: its basis/grant mapping and per-participant quota effects are specified at their homes, never inferred consent. Map every new user-facing type and custom restriction onto supported storage/rules; preserve unsupported cases as limitations. The actual-conflict blocker needs a complete compatibility check and resumable proposal identity; merely surfacing affected bookings is insufficient. | [BUILD](../../../harness/BUILD.md) Definition of done: every `[MUST]` scenario green against stubs, and every traced row closing at its named step. A traced row closes at the step named beside it, never at a story reference. |
| <a id="trace-engine"></a> [Engine SPEC](../../../engine/SPEC.md), [interfaces](../../../engine/INTERFACES.md), [scenarios](../../../engine/SCENARIOS.md) | [HR-01](#hr-01)–05, [HR-10](#hr-10), [HR-12](#hr-12)–13, [HR-17](#hr-17)–22, [HR-26](#hr-26)–35, [HR-37](#hr-37), [HR-39](#hr-39), [HR-41](#hr-41)–42: occurrence identity, travel estimates, duration/pricing/quota, standing series and package terms, saved templates and removal dependencies. | Atomicity and “Binding time, stated here once for every type” are existing homes. Owed: per-participant count/time admission across the confirmed scope and holds, two races/retry identity, the contact/group/request/booking relationships, no duplicate teacher reservation, and a validated version/replacement contract for an explicitly agreed change to already-bound price/shape. No scene licenses overwriting the stored quote; a rate change (the scene formerly at S18, parked 2026-09-15) is forward-only. Also owed: the standing-slot series, attendance-independent package bills, the month rollover, and a Task carrying a window and a repeat — the open questions are recorded at [HR-35](#hr-35), [HR-41](#hr-41) and [HR-42](#hr-42); the fifth-lesson-day rule and the per-lesson no-show rule are parked (`parked-beats.md`). Latches cannot be cleared; recovery is an ordinary field edit in S08a. Routines, saved-place references and dependent withdrawal need exact stored shapes/lifecycle checks. | [BUILD](../../../engine/BUILD.md) Step 9, the stub-swap: Z1–Z2 (the whole harness suite green with `harness/` unchanged), Z3 fault recovery, and LED-01–40 against real engine state; each traced row's own step closes its arm first. |
| <a id="trace-app"></a> [App SPEC](../../../app/SPEC.md), [design](../../../app/DESIGN.md), [interfaces](../../../app/INTERFACES.md), [scenarios](../../../app/SCENARIOS.md) | [HR-02](#hr-02)–03, [HR-06](#hr-06)–09, [HR-18](#hr-18), [HR-20](#hr-20), [HR-23](#hr-23)–25, [HR-29](#hr-29)–42: invite onboarding, pre-account draft, editable tutorial, form readback, catalog, filters, Contacts, token and rebook pages, per-student package tabs, copyable written messages, reminder navigation, Tokyo readback and the board at rest. | Current guest pages explicitly say “no agent appears”; the new console is owed, not established by FD-43/54. Onboarding-before-account, tutorial speech, tabs/in-message controls and role styling need reconciliation with the current UI law. Owed: accessible flashing-cue alternative, readable packed board/timezone/hidden-state display, saved/unsaved/unknown-save states, safe deep links, correct actual delivery states, verified account linking and explicit sharing audience/detail. No current provider capability is newly asserted here. | [BUILD](../../../app/BUILD.md) Step 8, the stub-swap: the full harness suite including P1 and P2 green with `harness/` unchanged, then Z1–Z3; no earlier integration reorder. |
| <a id="trace-model"></a> [Model SPEC](../../../model/SPEC.md), [evals](../../../model/EVALS.md), [interfaces](../../../model/INTERFACES.md) | [HR-01](#hr-01)–04, [HR-08](#hr-08)–19, [HR-21](#hr-21), [HR-27](#hr-27), [HR-29](#hr-29)–42: source-span interpretation, recurrence counterexamples, scoped guest input, report attribution, written messages, the read-back and capability answers. | Owed eval items for the cues and their counterexamples, ambiguous dates/names/scope, reuse of settled answers, quarantined guest text, allowed-field extraction and rule/capability/privacy refusals. Runtime enforcement stays outside model wording; model memory cannot establish current release availability or calculate authoritative placements. These scripted cases do not qualify a model. | [BUILD](../../../model/BUILD.md) Step 3: qualification on a candidate binding under [EVALS](../../../model/EVALS.md) §3's thresholds, recorded. A written item qualifies nothing. |
| <a id="trace-security"></a> [Security SPEC](../../../security/SPEC.md), [interfaces](../../../security/INTERFACES.md), [scenarios](../../../security/SCENARIOS.md) | [HR-16](#hr-16), [HR-18](#hr-18), [HR-24](#hr-24)–25, [HR-27](#hr-27), [HR-29](#hr-29)–33; LEGAL-01; [MT-13](#mt-13)/17/79/80/83/90. | Owed: guest-console budgets/rate limits and quarantine, per-recipient/coordinator rights and forwarding/expiry/revocation tests, verified contact-to-account linking, sharing revocation, pre-account and guest notices. “The vault is THE place deletion exists” and “request-driven erasure is an ops runbook act” already locate selective erasure; broader owner/guest-request scope, affected keys/records and retention results remain unresolved. No harness destruction tool follows. | [BUILD](../../../security/BUILD.md): the step whose Gate names the traced row; no public link goes live before Step 4's printed T1–T7 gate, and Step 8's legal review stays a hard gate. |
| <a id="trace-marketplace"></a> [Marketplace SPEC](../../../marketplace/SPEC.md), [interfaces](../../../marketplace/INTERFACES.md), [scenarios](../../../marketplace/SCENARIOS.md) | [HR-08](#hr-08), [HR-14](#hr-14)–15, [HR-20](#hr-20), [HR-27](#hr-27)–28; [MT-08](#mt-08)/09/15/41/48/72/73. | Owed: truthful catalog empty/failure distinction and private definition save/reload/use/copy/retire with dependent uses and links. Existing owner-publish law distinguishes a reusable authored shape from a populated board. Saving a private template does not publish it; automatic student capture does not authorize public reuse of personal data. | [BUILD](../../../marketplace/BUILD.md) Steps 3–5 against the service mock, Z1–Z3 at Step 5; Step 5's real-catalog receipt is separate, and no green mock run produces it. |
| <a id="trace-deployment"></a> [Deployment SPEC](../../../deployment/SPEC.md), [scenarios](../../../deployment/SCENARIOS.md), [egress inventory](../../../deployment/egress-allowlist.md) | Offline documentary gates and future source/provider readiness. | This is a spec-only candidate. Owed runtime evidence belongs to the applicable layer build gates; any eventual new provider/model route needs its actual declared seam, egress and credential controls. The paid spike, live reactive probe and app operation are not documentary verification. No build step or release state advances here. | None for a story ID: the offline documentary gates close no scene, case, CRUD family or cue. |

The exact final calendar arithmetic lives in [the ledger](#october-ledger). The fixed route estimate is an illustrative 30-minute replacement, not a measured drive; production route support/freshness/failure are owed. The handoffs in [S10](story-matt.md#s10), [S15](story-matt.md#s15), [S16](story-matt.md#s16) and [S21](story-matt.md#s21) are Matt’s manual copy/paste of links or of text annnä wrote, not an automated student notification. Every remaining ⟦bracketed⟧ value in the story is a founder detail to fill, never inferred; the per-lesson no-show answer and the future-month terms were parked with their beats 2026-09-15 (`parked-beats.md`). Optional student-reminder expansion remains unselected, with no new contacts, grants or provider claims. Newly different quota, no-show, notification, sharing and coordinator choices belong to the relevant product user and must be stored; this worked example does not set universal defaults.

<a id="scene-trace"></a>

**Scene trace.** Each of the 33 scenes of [Matt's story](story-matt.md), traced the same way as the cases, CRUD families and cues below. Scene IDs stay as the story defines them; the six group scenes FD-106 retired are no longer defined and carry no trace.

| Scene | Trace |
|---|---|
| [S01](story-matt.md#s01) | no layer row cites S01 yet — acceptance owed at [app](#trace-app), [security](#trace-security). |
| [S01a](story-matt.md#s01a) | no layer row cites S01a yet — acceptance owed at [harness](#trace-harness), [app](#trace-app). |
| [S02](story-matt.md#s02) | no layer row cites S02 yet — acceptance owed at [app](#trace-app), [security](#trace-security). |
| [S03](story-matt.md#s03) | [harness](#trace-harness) B1 → Step 4 · [engine](#trace-engine) M1 → Step 6 · [app](#trace-app) C2 → Step 3. |
| [S03a](story-matt.md#s03a) | no layer row cites S03a yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model). |
| [S04](story-matt.md#s04) | [harness](#trace-harness) L6 → Step 5 · [engine](#trace-engine) M8 → Step 6 · [app](#trace-app) C2, C6 → Steps 1, 3. |
| [S05](story-matt.md#s05) | [harness](#trace-harness) B1 → Step 4 · [engine](#trace-engine) T4, M8 → Steps 4, 6 · [app](#trace-app) C2 → Step 3. |
| [S05a](story-matt.md#s05a) | [harness](#trace-harness) B1 → Step 4 · [engine](#trace-engine) M2, M3 → Step 6 · [app](#trace-app) C2 → Step 3. |
| [S06](story-matt.md#s06) | [marketplace](#trace-marketplace) Z3 → Step 5. |
| [S07](story-matt.md#s07) | [harness](#trace-harness) B5, B9, D28 → Steps 4, 5 · [engine](#trace-engine) Q1 → Steps 3, 4, 5 · P6, Y1 → Steps 2, 4, 5, 8 · [app](#trace-app) G7 → Step 5 · [model](#trace-model) N-09, N-10, R-05 → Step 3. |
| [S08](story-matt.md#s08) | [harness](#trace-harness) B2 → Step 4 · [app](#trace-app) V1 → Step 7 · [marketplace](#trace-marketplace) Z3 → Step 5. |
| [S08a](story-matt.md#s08a) | [harness](#trace-harness) B9 → Step 4 · [engine](#trace-engine) P6 → Steps 4, 5 · [app](#trace-app) G7 → Step 5. |
| [S09](story-matt.md#s09) | [harness](#trace-harness) B2 → Step 4 · [app](#trace-app) V1 → Step 7. |
| [S10](story-matt.md#s10) | [harness](#trace-harness) A6, B2, H6 → Steps 2, 3, 4 · [app](#trace-app) V1 → Step 7 · [security](#trace-security) T5 → Step 4. |
| [S11](story-matt.md#s11) | [harness](#trace-harness) B9, H9 → Steps 4, 5 · [engine](#trace-engine) P6 → Steps 4, 5 · [app](#trace-app) G7 → Step 5 · [model](#trace-model) J-04, N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3 · [security](#trace-security) T5 → Step 4. |
| [S12](story-matt.md#s12) | no layer row cites S12 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app). |
| [S12a](story-matt.md#s12a) | no layer row cites S12a yet — acceptance owed at [app](#trace-app). |
| [S13](story-matt.md#s13) | [harness](#trace-harness) D28 → Step 5. |
| [S13a](story-matt.md#s13a) | [app](#trace-app) G10 → Step 5. |
| [S13b](story-matt.md#s13b) | [harness](#trace-harness) C5 → Step 1 · [app](#trace-app) C2, V2 → Steps 3, 7 · [marketplace](#trace-marketplace) P6 → Step 3. |
| [S13f](story-matt.md#s13f) | [harness](#trace-harness) C3, C5 → Steps 1, 5 · [model](#trace-model) N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3. |
| [S13g](story-matt.md#s13g) | no layer row cites S13g yet — acceptance owed at [engine](#trace-engine), [app](#trace-app). |
| [S14](story-matt.md#s14) | [harness](#trace-harness) D28 → Step 5. |
| [S14a](story-matt.md#s14a) | [harness](#trace-harness) D28 → Step 5 · [app](#trace-app) D1 → Step 6 · [model](#trace-model) N-19 → Step 3. |
| [S14b](story-matt.md#s14b) | [harness](#trace-harness) B5, D28, H6, H8, H9 → Steps 2, 4, 5 · [engine](#trace-engine) Q1 → Steps 3, 4, 5 · [app](#trace-app) G10 → Step 5 · [model](#trace-model) N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3 · [security](#trace-security) T5 → Step 4. |
| [S14e](story-matt.md#s14e) | [harness](#trace-harness) D18, H6 → Steps 2, 3 · [app](#trace-app) G10 → Step 5 · [model](#trace-model) J-07 → Step 3. |
| [S15](story-matt.md#s15) | no layer row cites S15 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model). |
| [S16](story-matt.md#s16) | no layer row cites S16 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model), [security](#trace-security). |
| [S17](story-matt.md#s17) | no layer row cites S17 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model). |
| [S19](story-matt.md#s19) | no layer row cites S19 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app), [model](#trace-model). |
| [S20](story-matt.md#s20) | no layer row cites S20 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model). |
| [S21](story-matt.md#s21) | no layer row cites S21 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model). |

<a id="cases"></a>

## Bounded cases — 109 obligations, 12 of them retired

Each row is scripted and unexecuted. A required outcome is a target to falsify, not a check reported as passing. The full-run quota fixture is corrected here; [MT-52](#mt-52) retains its independent count-exhaustion and five-hour-exhaustion variants.

**FD-106.** MT-82, MT-83 and MT-84 were carried only by the group scenes FD-106 retired; they stay defined as retired rows so the series runs contiguously, are never reused, and their law stays story-owed at the layer rows their traces name. MT-85 and MT-88 are recast to Matt's own race and ledger records. MT-91–MT-109 append the obligations of the scenes FD-106 added. **Money reduction (2026-09-15).** MT-38, MT-89, MT-95, MT-96, MT-97, MT-101, MT-102, MT-103 and MT-106 were carried only by money beats Matt's story parked; they stay defined as retired rows in the same style, never reused, with their law held at `parked-beats.md`.

| ID | Trigger | Required observable outcome | Why this test belongs |
|---|---|---|---|
| MT-01 | <a id="mt-01"></a> Trial invitation is invalid, expired or already used. | Appropriate invitation state is shown; account creation follows the actual invitation policy. | Tests the selected invite-only entry, not every possible signup condition. Exact reuse policy is to be specified. ([S01](story-matt.md#s01)) **Trace:** no layer row cites MT-01 yet — acceptance owed at [app](#trace-app), [security](#trace-security). |
| MT-02 | <a id="mt-02"></a> User reads terms, changes an optional privacy choice, then continues; test a separate refusal to accept required service terms. | Accepted document versions and actual choices persist; required acceptance and independent choices behave according to the legally reviewed design. | A generic checkbox cannot prove either legal adequacy or correct storage. ([S02](story-matt.md#s02)) **Trace:** no layer row cites MT-02 yet — acceptance owed at [app](#trace-app), [security](#trace-security). |
| MT-03 | <a id="mt-03"></a> Initial page renders, then Matt edits the prefilled run text before pressing Send. | Rendering creates zero commitments; the submitted edited text is the instruction acted on. | Protects the difference between a live example and automatic insertion of personal data. ([S03](story-matt.md#s03)) **Trace:** no layer row cites MT-03 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app). |
| MT-04 | <a id="mt-04"></a> Send is pressed twice or the response to the first submission is lost. | The same intended series is recovered without duplicate runs. | The first tutorial also exercises real write/retry behavior. **Trace:** [harness](#trace-harness) B2 → Step 4 · [engine](#trace-engine) M1 → Step 6. |
| MT-05 | <a id="mt-05"></a> Matt replaces Wednesday in the original Monday/Wednesday/Friday example with Tuesday/Thursday/Saturday, then adds a Wednesday lesson. | The submitted series covers Monday/Tuesday/Thursday/Friday/Saturday. Those days have top-packed runs; Wednesday's lesson becomes Wednesday's first event. Clock labels retain actual times. | Checks edited input and all downstream placement, rather than replaying the unedited example. **Trace:** [engine](#trace-engine) M1 → Step 6 · [app](#trace-app) C6 → Step 1. |
| MT-06 | <a id="mt-06"></a> Matt clicks the empty Location field, pans/zooms and saves a pin, then changes From Home to Sarah's house. | The map updates the same form draft the console sees. Park/Driving can become usual settings; Sarah's origin and 30-minute buffer apply only to the selected Monday after confirmation and final Save. Home and other occurrences retain their usual values. | Tests two scopes in one coherent edit without losing existing facts or changing the recurring default accidentally. ([S05](story-matt.md#s05)) **Trace:** [engine](#trace-engine) M8 → Step 6. |
| MT-07 | <a id="mt-07"></a> The route estimate for Sarah's house changes to 30 minutes for arrival at 06:00 while the draft buffer is 10 minutes. | Console proposes a 30-minute buffer for the one chosen occurrence, shows departure from Sarah's house at 05:30, and applies it only after the proposal’s OK and final Save. No extra 30-minute travel block is double-counted. Unknown/stale routes have an explicit alternative result. | Tests the actual recommendation and date/time/mode inputs; 30 minutes is a fixture estimate, not a measured real-world trip. ([S05](story-matt.md#s05)) **Trace:** [harness](#trace-harness) B1 → Step 4. |
| MT-08 | <a id="mt-08"></a> Catalog returns zero matches; separately, its request fails. | Empty and unavailable have distinct messages; both permit the appropriate retry or user-selected authoring route. | Prevents manufactured catalog evidence. ([S06](story-matt.md#s06)) **Trace:** no layer row cites MT-08 yet — acceptance owed at [marketplace](#trace-marketplace). |
| MT-09 | <a id="mt-09"></a> Saved template is reopened in the same workspace, edited and abandoned; separately test loss of save acknowledgement. | The app distinguishes persisted revision, pending save and unsaved edit; recovery does not duplicate templates. | Tests the intended persistent template contract rather than only its label. **Trace:** no layer row cites MT-09 yet — acceptance owed at [marketplace](#trace-marketplace). |
| MT-10 | <a id="mt-10"></a> Matt records an already-agreed lesson for an existing student. | Correct student, time and author/source are stored; this action does not forge a guest response or imply an unperformed notification. | Owner scheduling is a core goal newly emphasized by Matt. ([S09](story-matt.md#s09), [S12](story-matt.md#s12)) **Trace:** [harness](#trace-harness) B2 → Step 4. |
| MT-11 | <a id="mt-11"></a> Same student is reached through two messaging apps; another student has a similar display name. | The deliberate student selection/link determines attribution. Similar names alone do not merge identities. | Addresses cross-app conversation confusion without assuming an inbox integration. ([S10](story-matt.md#s10)) **Trace:** [harness](#trace-harness) A6, H6 → Steps 2, 3 · [app](#trace-app) V1 → Step 7. |
| MT-12 | <a id="mt-12"></a> Two students submit the last compatible lesson slot. | One booking succeeds; the other gets a useful refusal and refreshed choices. | Directly tests the self-booking outcome. ([S13g](story-matt.md#s13g)) **Trace:** no layer row cites MT-12 yet — acceptance owed at [engine](#trace-engine), [app](#trace-app). |
| MT-13 | <a id="mt-13"></a> A guest manipulates a link or requests another student's information. | Access remains within the token's lawful scope, with a generic failure for invalid/revoked access. | A concrete privacy boundary, rather than a list of unrelated invisible features. **Trace:** [harness](#trace-harness) H6 → Step 2 · [model](#trace-model) N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3 · [security](#trace-security) T5 → Step 4. |
| MT-14 | <a id="mt-14"></a> Template availability changes after existing lessons are booked. | Future choices reflect the applied revision; existing lessons retain their recorded terms unless changed through the appropriate explicit act. | Distinguishes editing a template from rewriting commitments. **Trace:** no layer row cites MT-14 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| MT-15 | <a id="mt-15"></a> Owner removes an active setup or deletes a saved original. | The effect is explained; committed lessons and their history survive under their own lifecycle. | Tests a real destructive boundary of template reuse. **Trace:** no layer row cites MT-15 yet — acceptance owed at [marketplace](#trace-marketplace). |
| MT-16 | <a id="mt-16"></a> The initial editable example is shown with the arrow-shaped send control; repeat under reduced motion and keyboard navigation. | The send arrow supplies the requested flashing cue without visible “Press Send” copy. Edited text remains ready to submit, and the ordinary icon state returns after Send. Existing flash safety/accessibility requirements and a non-flashing accessible equivalent are checked. | Tests the founder's specific tutorial interaction, not an invented gentle/brief text prompt. ([S03](story-matt.md#s03)) **Trace:** no layer row cites MT-16 yet — acceptance owed at [app](#trace-app). |
| MT-17 | <a id="mt-17"></a> Privacy or monetization preference is withdrawn or changed; a guest is a minor or another jurisdiction applies. | Follow the legal investigation's validated decision matrix; fail any unsupported universal-consent assumption. | This is an owed legal/product gate, not a completed result or a new policy chosen by this draft. **Trace:** no layer row cites MT-17 yet — acceptance owed at [security](#trace-security). |
| MT-18 | <a id="mt-18"></a> Profile, app language, timezone, optional Home and skin are completed before Create account. | The review summary matches the draft selections, and verified account creation associates exactly those choices with the correct new account. Pre-account collection/retention obeys LEGAL-01. | Detects premature workspace creation, lost preferences and cross-account draft binding. ([S02](story-matt.md#s02)) **Trace:** no layer row cites MT-18 yet — acceptance owed at [app](#trace-app), [security](#trace-security). |
| MT-19 | <a id="mt-19"></a> Individual and Freelancer are both selected, then a business/team profile is exercised separately. | Multiple intended-use descriptions can coexist. A descriptive selection does not itself grant admin access, create other users or settle OR-42. | Separates onboarding personalization from authority and organization structure. ([S02](story-matt.md#s02)) **Trace:** no layer row cites MT-19 yet — acceptance owed at [app](#trace-app), [security](#trace-security). |
| MT-20 | <a id="mt-20"></a> A skin is previewed before an account exists, then the account is created. | The selected skin appears on the new EMPTY board. Example commitments and templates from a preview are not written as user data. | Keeps appearance selection distinct from template installation. ([S02](story-matt.md#s02)) **Trace:** no layer row cites MT-20 yet — acceptance owed at [app](#trace-app). |
| MT-21 | <a id="mt-21"></a> Optional Home is supplied; in another fixture it is skipped. | Supplied Home is available as the editable travel origin. Skipping Home leaves the origin to be supplied when a route needs it; no actual location is inferred. | Tests the optional onboarding field and its later use. ([S02](story-matt.md#s02)) **Trace:** [harness](#trace-harness) G2 → Step 4. |
| MT-22 | <a id="mt-22"></a> Changing the origin causes a console question; the user answers one-time and accepts a new buffer, then edits again or cancels before Save. | Form and console stay synchronized to one draft. Accepted scope is reused, estimates bind to the latest inputs, and cancelling does not apply pending occurrence changes; a separately accepted saved-place action is reported independently. | Prevents stale recommendations, repeated questions and partial edits. ([S05](story-matt.md#s05)) **Trace:** [harness](#trace-harness) B1 → Step 4. |
| MT-23 | <a id="mt-23"></a> The selected Monday occurrence is saved as an exception. | Its origin and buffer differ on that exact date; another Monday and the other weekdays retain Home/10 minutes. Saved Home is unchanged and Sarah's house has its own address label. | The dated label must identify one occurrence, not all Mondays or a global Home edit; the visible label need not say “only”. **Trace:** [engine](#trace-engine) M8 → Step 6. |
| MT-24 | <a id="mt-24"></a> New submitted run contains “every” plus the stated weekdays. | Console asks whether it is a Routine; OK confirms the type once and creates the intended dated occurrences through normal validation. The unsent example creates nothing. | Tests the named cue and owner confirmation, not a blanket every-word regex. ([S03](story-matt.md#s03)) **Trace:** [harness](#trace-harness) B1 → Step 4 · [engine](#trace-engine) M1 → Step 6. |
| MT-25 | <a id="mt-25"></a> “Every” appears in an unrelated, negated, quoted or past-tense sentence, or an edit to an existing Routine. | The handler uses context and preserves meaning; it does not manufacture another Routine or repeatedly ask a settled type question. | Prevents a keyword heuristic from becoming silent authority. **Trace:** [harness](#trace-harness) B2 → Step 4. |
| MT-26 | <a id="mt-26"></a> A request names Monday15October2026; a control names Monday12October2026. | The mismatched2026 request asks for clarification; the matching12October2026 request resolves the correct occurrence. Persist a full identity/date and show sufficient year context. | Detects calendar contradictions and accidental next-Monday edits. ([S04](story-matt.md#s04)) **Trace:** [harness](#trace-harness) L6 → Step 5 · [engine](#trace-engine) M8 → Step 6. |
| MT-27 | <a id="mt-27"></a> From a September Week view, the owner requests the future dated occurrence; Day/Month are other visible view choices. | The board shows the requested October span/occurrence with correct labels; view changes do not alter schedule or treat unloaded content as verified emptiness. | Tests date navigation separately from time-axis layout. ([S04](story-matt.md#s04)) **Trace:** [harness](#trace-harness) L6 → Step 5 · [app](#trace-app) C6 → Step 1. |
| MT-28 | <a id="mt-28"></a> Owner adjusts Board commitments opacity in the console Appearance tab. | Glass/text presentation changes legibly while Koi remains clear around cards; commitment dates, types, scope and permissions do not change. Console opacity remains a separate control. | Tests the requested aesthetic and its display-only boundary. ([S04](story-matt.md#s04)) **Trace:** no layer row cites MT-28 yet — acceptance owed at [app](#trace-app). |
| MT-29 | <a id="mt-29"></a> Text is submitted through Send; a proposal is accepted or edited inside the conversation. | Send transmits the text; OK/Edit refer to the exact current proposal and its values. An old OK cannot accept a changed origin/date or another proposal. | Gives the control labels distinct, testable meanings. **Trace:** no layer row cites MT-29 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app). |
| MT-30 | <a id="mt-30"></a> Sarah's route estimates30minutes for06:00arrival with an existing10-minute before-buffer. | Departure05:30 and the30-minute replacement buffer are proposed in the console before acceptance. OK updates the run draft; final Save applies the dated occurrence. | A passive field value is not evidence of owner approval; travel and buffer are not doubled. ([S05](story-matt.md#s05)) **Trace:** [harness](#trace-harness) B1 → Step 4. |
| MT-31 | <a id="mt-31"></a> A one-occurrence origin is named Sarah's house; test accepting and declining the separate saved-location prompt. | The saved-place decision is independent of Routine/occurrence scope. Acceptance creates the reusable place without changing Home; refusal does not silently persist it for reuse. | Tests the explicitly requested permanent-save question and its actual boundary. ([S05](story-matt.md#s05)) **Trace:** [harness](#trace-harness) G2 → Step 4. |
| MT-32 | <a id="mt-32"></a> Each proposed scheduling row is shown; the owner answers a console example, selects Edit, or deletes a row. | Only submitted answers update the draft. Edit targets the current value; Delete has its stated draft effect without deleting bookings or bypassing validation. | Tests console-first authoring and the form's readback/actions. ([S07](story-matt.md#s07)) **Trace:** no layer row cites MT-32 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app). |
| MT-33 | <a id="mt-33"></a> Owner enters “30 minutes to2hours”; another fixture uses “Tuesday/Thursday every other week”. | Duration keeps both endpoints; alternating recurrence retains its interval and asks for a missing anchor. | Tests meaningful natural language beyond a fixed widget's choices. ([S07](story-matt.md#s07)) **Trace:** [harness](#trace-harness) B1 → Step 4 · [engine](#trace-engine) M1, P6, Y1 → Steps 2, 4, 5, 6, 8 · [app](#trace-app) G7 → Step 5. |
| MT-34 | <a id="mt-34"></a> Teaching window excludes23:00–09:00; an existing personal event occupies15:00–16:00. | Available starts use daily09:00–23:00, occupation and both buffers. Personal06:00runs remain lawful; the teaching restriction is not made global. | Tests overnight exclusion, scope and actual availability. **Trace:** [engine](#trace-engine) P6 → Steps 4, 5 · [app](#trace-app) G7 → Step 5. |
| MT-35 | <a id="mt-35"></a> Owner clicks Online in a console option row. | One click submits one typed choice, and the form reads Online without a second Send. | Prevents double dispatch or a misleading unsubmitted selection. ([S07](story-matt.md#s07)) **Trace:** no layer row cites MT-35 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app). |
| MT-36 | <a id="mt-36"></a> Owner chooses Leave blank for the meeting link. | Template and initial guest/owner views retain the blank. A later explicit booking-specific link follows [HR-25](#hr-25) and [MT-61](#mt-61); no example URL or generated meeting is substituted. | Tests the explicit answer and avoids fabricated meeting information. ([S07](story-matt.md#s07)) **Trace:** no layer row cites MT-36 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app). |
| MT-37 | <a id="mt-37"></a> Matt names the two packages with Taiwan context; test explicit alternate currency and unanswered basis. | Currency and per-month basis are explicitly proposed/confirmed before a package price is treated as settled; the current combined proposal can confirm both. The same numeric input may have another explicit basis/currency. | Separates contextual suggestions from owner authorization. ([S07](story-matt.md#s07)) **Trace:** [engine](#trace-engine) A4 → Step 5 · [model](#trace-model) J-06 → Step 3. |
| MT-38 | <a id="mt-38"></a> **Retired 2026-09-15 — beat parked, `parked-beats.md`.** Confirm a per-hour rate with durations30,45,60,120minutes and derived totals. | Matt's story no longer prices by the lesson; per-lesson duration arithmetic is not exercised there. | Kept defined so the MT series runs contiguously; never reused. ([S07](story-matt.md#s07)) **Trace:** [model](#trace-model) J-06 → Step 3. |
| MT-39 | <a id="mt-39"></a> Owner accepts or edits the suggested guest-page language. | English is an editable suggestion from context, not proof of literacy or a forced default. The submitted choice is the stored guest-language setting. | Tests the intended inference and the owner's control. ([S07](story-matt.md#s07)) **Trace:** no layer row cites MT-39 yet — acceptance owed at [harness](#trace-harness), [model](#trace-model). |
| MT-40 | <a id="mt-40"></a> After Save opens the reusable template ready to use, Matt returns to his board and creates the detailed personal event. | Known date/time fields are prefilled, missing relevant details are elicited, and Home/zero personal buffers/notes/category are saved on a separate Event. The owner sees the English5-minute separation explained on his own board. | Tests the detailed personal-event flow without an owner student-page preview. ([S08a](story-matt.md#s08a)) **Trace:** [engine](#trace-engine) P6 → Steps 4, 5 · [app](#trace-app) G7 → Step 5. |
| MT-41 | <a id="mt-41"></a> Reusable one-on-one template is used for Mark with a Messenger contact, then for Georgina, Kai and Jasmine. | Definition Student/contact remain blank by default; no baseline reuse question. Per-use data and tokens stay isolated, and saving/opening a use does not itself book/send. | Tests direct use and prevents cross-student carryover. ([S08](story-matt.md#s08), [S09](story-matt.md#s09), [S10](story-matt.md#s10)) **Trace:** [harness](#trace-harness) B2, H6 → Steps 2, 4; owed at [marketplace](#trace-marketplace). |
| MT-42 | <a id="mt-42"></a> Owner supplies a unique student name/handle in definition-edit context, then clarifies or insists. | Console asks about reuse only on that trigger or a genuine scope ambiguity; an explicit private-template value is allowed after its scope is resolved. Owner identity/ordinary per-use data do not trigger the question. | Implements the conditional follow-up rather than a universal questionnaire. **Trace:** no layer row cites MT-42 yet — acceptance owed at [harness](#trace-harness), [model](#trace-model), [marketplace](#trace-marketplace). |
| MT-43 | <a id="mt-43"></a> Owner adds a personal event after template Save; availability changes after a guest opens the current calendar. | Current guest availability and final admission respect the event/buffers. A stale conflicting request receives the relevant refusal and waits for another allowed input. | Tests the current-state/confirmation gap without an owner preview surface. ([S11](story-matt.md#s11)) **Trace:** [harness](#trace-harness) H9 → Step 5 · [engine](#trace-engine) P6 → Steps 4, 5 · [app](#trace-app) G7 → Step 5 · [model](#trace-model) N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3. |
| MT-44 | <a id="mt-44"></a> Guest sees the rate, then supplies16:30and45minutes through the restricted console. | Rate is1500/hour before selection; valid selection produces17:15and1125 before confirmation. Invalid duration/rule changes are refused. | Tests guest-console price timing and arithmetic. ([S11](story-matt.md#s11)) **Trace:** [harness](#trace-harness) H9 → Step 5 · [engine](#trace-engine) P6 → Steps 4, 5 · [app](#trace-app) G7 → Step 5 · [model](#trace-model) J-06, N-17, N-18, A-13, R-13, Q-04, S-05, S-06 → Step 3. |
| MT-45 | <a id="mt-45"></a> Creator explicitly says one-on-one; another request proposes a four-student lesson. | Attendance comes from supplied intent or a needed count question. Reuse defaults across people. Four participant rows require coherent shared-lesson/capacity/pricing semantics, not silent duplicated teacher bookings. | Separates count from reuse and avoids redundant questions. **Trace:** [harness](#trace-harness) H6 → Step 2 · [engine](#trace-engine) A1 → Step 5. |
| MT-46 | <a id="mt-46"></a> Contact is a Messenger link, an explicitly qualified Instagram handle, or an unqualified handle. | Correct typed contact is associated with the selected student; ambiguous platform is elicited; no verification, inbox access or delivery is invented. | Covers the new contact field's actual semantics. ([S08](story-matt.md#s08)) **Trace:** [harness](#trace-harness) A6, H6 → Steps 2, 3 · [app](#trace-app) V1 → Step 7. |
| MT-47 | <a id="mt-47"></a> Ordinary reusable template is authored; unique student value is later introduced in the definition. | No reuse question on the ordinary path; follow-up appears for the unique value when scope needs resolution. Already explicit answers are reused. | Tests questions driven by conditions rather than defaults. **Trace:** no layer row cites MT-47 yet — acceptance owed at [harness](#trace-harness), [model](#trace-model). |
| MT-48 | <a id="mt-48"></a> New template is saved; a persistent definition is later edited from use. | Save opens use directly. Definition edit asks Replace existing/Save as new; per-use Student/date entry does not. Save as new preserves the old identity/links and avoids copying incidental per-use data. | Tests the requested lifecycle and correct change target. ([S08](story-matt.md#s08)) **Trace:** no layer row cites MT-48 yet — acceptance owed at [marketplace](#trace-marketplace). |
| MT-49 | <a id="mt-49"></a> Personal event occupies15:00–16:00with0own buffers; English lessons have5minutes before/after. | English lesson may end at14:55 or startat16:05; intervals inside that separation refuse. Other commitment kinds retain their own rules. | Tests exact buffer boundaries and rule scope. ([S08a](story-matt.md#s08a)) **Trace:** [engine](#trace-engine) P6 → Steps 4, 5 · [app](#trace-app) G7 → Step 5. |
| MT-50 | <a id="mt-50"></a> Guest submits3hours,20minutes,72minutes,45minutes, an owner-rule edit and an unrelated/private-data query; also invoke forbidden operations directly. | Relevant duration refusals guide correction;45minutes can validate; owner/config/private operations refuse at the executor regardless of model output. Guest context excludes hidden owner data. | Tests the limited console as a capability boundary, not just a system prompt. ([S11](story-matt.md#s11)) **Trace:** [harness](#trace-harness) H9 → Step 5 · [engine](#trace-engine) P6 → Steps 4, 5 · [app](#trace-app) G7 → Step 5 · [model](#trace-model) N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3. |
| MT-51 | <a id="mt-51"></a> Bounds30–120withstep15; another fixture usesstep5 or incompatible bounds. | Main allowed set is30/45/60/75/90/105/120;72refuses under either5or15. Start-time granularity is not silently changed. Incompatible definitions are clarified, not rounded invisibly. | Tests creator-selected increments and correct units. ([S07](story-matt.md#s07)) **Trace:** [engine](#trace-engine) P6, Y1 → Steps 2, 4, 5, 8 · [app](#trace-app) G7 → Step 5. |
| MT-52 | <a id="mt-52"></a> Count reaches4through four30-minute lessons; separately total time reaches4hours through2+1+1hours. | Extra booking refuses under the exhausted constraint even if the other has room. Concurrent admissions cannot overshoot; rescheduling does not count one lesson twice. | Tests independent monthly count/time caps. ([S07](story-matt.md#s07)) **Trace:** [harness](#trace-harness) B5 → Step 4 · [engine](#trace-engine) Q1 → Steps 3, 4, 5. |
| MT-53 | <a id="mt-53"></a> Monday's proposed15:00start conflicts with Jasmine's13:00booking; her move fails, succeeds, or a new blocker arrives before apply. | Candidate remains blocked until authorized resolution and a fresh complete compatibility check pass. Current template remains effective meanwhile; no silent cancellation/move/grandfathering passes as resolution. | Tests blockers as actual preconditions to applying a rule. ([S13](story-matt.md#s13)) **Trace:** no layer row cites MT-53 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| MT-54 | <a id="mt-54"></a> Owner gives English a role border, hides Routines, then restores them. | Visual grouping and filtered packing change; hidden commitments still occupy time and affect rules. Styling/group labels cannot bypass quotas, pricing or permissions, and urgency remains legible. | Tests presentation versus business state. ([S12a](story-matt.md#s12a), [S14](story-matt.md#s14)) **Trace:** no layer row cites MT-54 yet — acceptance owed at [engine](#trace-engine), [app](#trace-app). |
| MT-55 | <a id="mt-55"></a> Same known student uses different contact channels/links; requests cross a month boundary or a new template use. | Counters follow the confirmed student/scope/lesson-month identity and do not reset per link/use. Unknown unlinked aliases are an explicit identity limitation, not silently merged or claimed covered. | Tests the meaning and limits of per-student quotas. **Trace:** [harness](#trace-harness) B5 → Step 4 · [engine](#trace-engine) Q1 → Steps 3, 4, 5 · [app](#trace-app) V1 → Step 7. |
| MT-56 | <a id="mt-56"></a> Kai selects16:05–16:50; Matt extends the appointment to16:15 before confirmation; Kai then selects16:30. | First confirmation fails with no booking/count increment, permitted answers persist, private reasons stay hidden, and the second confirmation validates16:30–17:15/1125 against current records. | Makes the stale-calendar story concrete and exercises its recovery, not just the refusal. ([S11](story-matt.md#s11)) **Trace:** [harness](#trace-harness) H9 → Step 5 · [engine](#trace-engine) P6 → Steps 4, 5 · [app](#trace-app) G7 → Step 5 · [model](#trace-model) N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3. |
| MT-57 | <a id="mt-57"></a> The replacement booking commits but its success response is lost; guest retries/reconnects. | Recover the same booking and its exact terms once. Do not create a second lesson or increment quota again. Offer a fresh attempt only when prior outcome is resolved and no commit occurred. | Distinguishes an unknown outcome from a failed request. **Trace:** no layer row cites MT-57 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| MT-58 | <a id="mt-58"></a> Matt submits and accepts the15-minute email reminder; separately declines, changes channel/destination or abandons unsaved setup. | Only the confirmed eligible scope/destination activates; no unsent example, implicit student reminder, active abandoned draft or fabricated supported channel. | Tests a reminder as permission and configuration, not a decorative field. ([S07](story-matt.md#s07)) **Trace:** [harness](#trace-harness) D28 → Step 5. |
| MT-59 | <a id="mt-59"></a> Jasmine's lesson moves13:00→15:30, including failed/stale moves and a late old clock firing. | Successful move makes pending reminder15:15; old12:45 firing cannot send an obsolete reminder. Failed move retains original timing; retries cannot duplicate sends. | Checks a consequential dependency of the requested blocker-resolution path. ([S13](story-matt.md#s13)) **Trace:** no layer row cites MT-59 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| MT-60 | <a id="mt-60"></a> Reminder is due after cancellation, grant revocation, contact change or a provider failure. | Recheck active authorization/state; record accurate send/failure/suppression outcomes. No delivery/read guarantee or unauthorized fallback channel; success fixture can show actual received content. | Closes the missed-session gap honestly without treating a scheduled email as proof of delivery. **Trace:** no layer row cites MT-60 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app). |
| MT-61 | <a id="mt-61"></a> Owner edits Kai's booking Meeting link through the console; inspect Jasmine's booking, Mark's and Georgina's Messenger meeting links, the template and a later new use. | Only the selected booking receives the supplied URL after approval. Template remains blank; no replace/new question for this per-booking change, no copied provider example. | Tests booking details versus reusable defaults. ([S13a](story-matt.md#s13a)) **Trace:** no layer row cites MT-61 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app). |
| MT-62 | <a id="mt-62"></a> Kai reopens his valid lesson link after the joining URL is saved; wrong/revoked guest and owner-email deep links are also tried. | Authorized reader sees only the intended current booking details; invalid access does not leak them. Owner link authenticates to its permitted booking instead of becoming a general bearer of private board data. | Makes both joining and reminder navigation a bounded access test. ([S13a](story-matt.md#s13a)) **Trace:** [app](#trace-app) G10 → Step 5 · [security](#trace-security) T5 → Step 4. |
| MT-63 | <a id="mt-63"></a> Select Georgina's existing record, add a confirmed contact on her second messaging app; separately use a similar-name stranger or an unverified alias. | Explicit association preserves student identity/bookings/counters. Similar names alone do not merge parties or grant access. | Tests cross-app continuity with the evidence the user actually supplied. ([S10](story-matt.md#s10)) **Trace:** [harness](#trace-harness) A6 → Step 3 · [app](#trace-app) V1 → Step 7. |
| MT-64 | <a id="mt-64"></a> Matt waits for Jasmine's reply, opens another item, then resumes Continue Monday change; candidate or bookings changed meanwhile. | Pending change/known replace choice are retained; saved rule is still old while blocked. Revalidate current candidate and full blocker set before final apply; do not repeat settled questions or accept a stale OK. | Tests usable resumption and actual state, not an isolated blocker message. ([S13](story-matt.md#s13)) **Trace:** no layer row cites MT-64 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| MT-65 | <a id="mt-65"></a> Matt reports actual end17:15 for Kai, then separately exercise no report, a different date, duplicate submission or an early end. | Bind the confirmed report to the correct booking/source once. Preserve scheduled terms/history; no inferred attendance/no-show/payment. Full-story fixture keeps count2/time105 (Thursday plus Friday); other commercial outcomes need the configured rule. | Closes the story with recorded facts while exposing remaining lifecycle policy work. ([S14a](story-matt.md#s14a)) **Trace:** no layer row cites MT-65 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| MT-66 | <a id="mt-66"></a> Add Preparation note to the authoring draft, edit its text, delete the row, then save/open a use. | Removed field/value do not appear or generate stale prompts; other rows persist. Clearing a value instead leaves its field available. | Distinguishes field-definition CRUD from value CRUD. ([S07](story-matt.md#s07)) **Trace:** no layer row cites MT-66 yet — acceptance owed at [harness](#trace-harness), [marketplace](#trace-marketplace). |
| MT-67 | <a id="mt-67"></a> Remove a saved optional rule or a field referenced by pricing/validation; a live use changes during approval. | Show actual dependencies and affected scope; permit independent optional removal, require a chosen valid resolution for dependents, and recheck at commit. Existing booked terms are not silently rewritten. | Tests the hard case behind an apparently simple Delete control. **Trace:** no layer row cites MT-67 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| MT-68 | <a id="mt-68"></a> Edit/reopen/clear the personal Notes value; separately replace then clear Kai's joining URL. | Each change targets the named field/object only; empty is visible on reopened details. Meeting removal explains the missing joining detail without erasing template/other booking values. | Tests saved value CRUD rather than only draft editing. ([S08a](story-matt.md#s08a)) **Trace:** no layer row cites MT-68 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app). |
| MT-69 | <a id="mt-69"></a> CancelSaturday17October's Run, clear a display filter, then materialize the next horizon. | That dated occurrence stays cancelled;05:50–07:00is released; other weekdays/Mondays and Sarah's exception survive. Show routines does not undo cancellation, and materialization does not recreate the skip. | Tests one-occurrence removal and its persistence. ([S05a](story-matt.md#s05a)) **Trace:** [engine](#trace-engine) M2 → Step 6. |
| MT-70 | <a id="mt-70"></a> Stop a Routine from an explicit date with ordinary instances, exceptions and state-carrying commitments on both sides. | Show the concrete affected set, preserve legitimate past/history, obtain user decisions for dependent future commitments, and stop only the validated scope. | Covers whole-series removal, which [S05a](story-matt.md#s05a) offers but does not perform. **Trace:** [harness](#trace-harness) B1 → Step 4 · [engine](#trace-engine) M3 → Step 6. |
| MT-71 | <a id="mt-71"></a> Create/read/rename/remove the due-date camera Task. | Correct temporal type/due time and selected identity persist through edit; removal changes active tasks without changing lesson, reminder or other commitments. Completion is tested separately. | Gives Task its own CRUD check instead of assuming Event behavior. ([S13b](story-matt.md#s13b)) **Trace:** [harness](#trace-harness) C5 → Step 1. |
| MT-72 | <a id="mt-72"></a> Edit duration then Save as new to a45-minute copy; delete that unused copy with an empty use. | New identity preserves original range/rules/links/bookings; per-use people/credentials/grants do not copy. Deleting the unused copy removes its active listing and disclosed empty use only. | Tests the separate-template branch and uncomplicated removal. ([S13b](story-matt.md#s13b)) **Trace:** no layer row cites MT-72 yet — acceptance owed at [marketplace](#trace-marketplace). |
| MT-73 | <a id="mt-73"></a> Delete a template with live links, populated drafts or booked lessons; a new reference arrives during approval. | Show actual references and effects, obtain needed choices, preserve existing booked history/terms and revalidate. No hidden link break, booking cascade or empty-template assumption. | Tests dependencies the spare-copy story deliberately does not exercise. **Trace:** no layer row cites MT-73 yet — acceptance owed at [marketplace](#trace-marketplace). |
| MT-74 | <a id="mt-74"></a> Rename/move/remove a saved place, edit/remove a contact, or remove an active student with bookings. | Separate nickname from address; one contact from student identity; reusable bookmark from historical data. Identify and resolve affected routes/delivery/links/bookings under the actor's authority. No silent student merge, quota reset or inherited recipient permission. | Extends CRUD to referenced personal data with precise scope. **Trace:** [harness](#trace-harness) A6, H6 → Steps 2, 3 · [app](#trace-app) V1 → Step 7. |
| MT-75 | <a id="mt-75"></a> Edit/reset skin/opacity, app language/timezone, role label/color or display filters. | Show resulting effective values before accepting a consequential change. Distinguish presentation from scheduled instants and role-rule scope; no null/default timezone, hidden reschedule or quota evasion. | Covers configuration CRUD without inventing meaningless deletion of required values. **Trace:** [harness](#trace-harness) B9 → Step 4 · [app](#trace-app) G7 → Step 5. |
| MT-76 | <a id="mt-76"></a> Jasmine’s Saturday request is booked at 10:00–10:45 and moved to 10:15–11:00; a separate Sunday request succeeds, a separate Wednesday request refuses COUNT, Saturday is kept then cancelled before start, and Wednesday is retried. | Count/minutes 2/120 → 3/165 → 3/165 → 4/225; attempted 5/285 refuses COUNT and remains 4/225; Keep remains 4/225; Saturday cancellation gives 3/180; fresh Wednesday confirmation gives 4/240 under the confirmed Release allowance choice. owner sees attributed move/cancellation;10:10–11:05releases and reminder10:00stops. Other guest/booking access refuses. | Tests scoped guest CRUD and concrete consequences. ([S14b](story-matt.md#s14b)) **Trace:** [harness](#trace-harness) H8 → Step 5 · [engine](#trace-engine) Q1 → Steps 3, 4, 5 · [model](#trace-model) N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3. |
| MT-77 | <a id="mt-77"></a> Discard an unconfirmed use, pending rule proposal or edited reply; repeat with an in-flight unknown write outcome. | Resolve commit outcome before discarding; distinguish unsent text from saved effects. Current rule survives discarded proposal; independent accepted booking moves are not undone. | Prevents a generic Delete/Undo from hiding a committed action. **Trace:** no layer row cites MT-77 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| MT-78 | <a id="mt-78"></a> Owner cancels a personal Event or lesson, removes a reminder policy, or tries to remove a governing rule. | Apply each actor-authorized operation with current dependencies/terms; stop affected pending reminders and derive counters under stored policy. Governing constraints refuse unauthorized removal. | Covers owner cancellation and policy removal independently of the guest demonstration. **Trace:** [harness](#trace-harness) D28 → Step 5. |
| MT-79 | <a id="mt-79"></a> Revoke/reissue one booking/request link; correct a student's contact or copy another token URL. | Credential authority is never edited through text or contact changes. Revocation takes effect for that access; booking fate and replacement access are explicitly shown, not silently coupled. | Gives access links a lifecycle with tested actor boundaries. **Trace:** [harness](#trace-harness) A6, H6 → Steps 2, 3 · [app](#trace-app) G10, V1 → Steps 5, 7 · [security](#trace-security) T5 → Step 4. |
| MT-80 | <a id="mt-80"></a> Correct/withdraw a reported actual end, remove conversation display, withdraw optional consent, or request account closure/permanent erasure. | Route each through its explicit history/permission/retention contract. These cases remain blocked from a passing assertion until the missing contracts and pending erasure scope are resolved; no silent history rewrite or fictitious erasure. | Names the limits of blanket CRUD and keeps unresolved destructive semantics visible. **Trace:** no layer row cites MT-80 yet — acceptance owed at [security](#trace-security). |
| MT-81 | <a id="mt-81"></a> Matt saves Mark, Georgina, Kai and Jasmine as Student contacts across four uses, selects Kai's and Jasmine's existing entries for later requests, and retries a lost response. | Four unique reusable Student contacts; no save question or mandatory directory navigation; later requests reuse the selected identity; correct update/provenance and no duplicate on retry. | Verifies the founder's exact selection and automatic-save direction. **Trace:** [harness](#trace-harness) B2, K4 → Steps 4, 5 · [app](#trace-app) C5, V1 → Steps 2, 7. |
| MT-82 | <a id="mt-82"></a> **Retired (FD-106).** Save, discard or edit a reusable group roster, and remove a member versus a contact or one lesson participant. | No Matt scene carries it since FD-106 retired the group scenes; the shared-lesson law it tests stands at its homes and is story-owed. | Kept defined so the MT series runs contiguously; never reused. **Trace:** [harness](#trace-harness) H6, K4 → Steps 2, 5 · [engine](#trace-engine) A4 → Step 5 · [app](#trace-app) V1 → Step 7. |
| MT-83 | <a id="mt-83"></a> **Retired (FD-106).** Several recipient links open one shared request; a coordinator reports offline agreement and confirms while readers attempt the same action. | No Matt scene carries it since FD-106 retired the group scenes; the shared-lesson law it tests stands at its homes and is story-owed. | Kept defined so the MT series runs contiguously; never reused. **Trace:** [harness](#trace-harness) D18, D24, H4, H6 → Steps 2, 3, 5 · [engine](#trace-engine) A1, A4 → Step 5 · [app](#trace-app) G4, G10 → Step 5 · [model](#trace-model) N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3 · [security](#trace-security) T5 → Step 4. |
| MT-84 | <a id="mt-84"></a> **Retired (FD-106).** A group price tier for two to four students booked, and membership changes after booking. | No Matt scene carries it since FD-106 retired the group scenes; the shared-lesson law it tests stands at its homes and is story-owed. | Kept defined so the MT series runs contiguously; never reused. **Trace:** [harness](#trace-harness) D18 → Step 3 · [engine](#trace-engine) A1, A4 → Step 5 · [model](#trace-model) J-06 → Step 3. |
| MT-85 | <a id="mt-85"></a> Kai's and Jasmine's separate one-on-one requests race forFri16October14:00; repeat with reverse winner and unknown/lost acknowledgement. | One winning teacher interval; the loser draws no quota and no partial write; a fresh 16:00 alternative and replay recover exactly one result; neither page names the other student. | Separates concurrency from a merely refreshed calendar ([S13g](story-matt.md#s13g)). **Trace:** [engine](#trace-engine) A1, A4 → Step 5. |
| MT-86 | <a id="mt-86"></a> Owner asks taxi/payment action, guest edits owner price, or external information is unavailable. | Correct reason, authority check and allowed fallback; no outside action or invented success. Preserve the useful existing draft. | Tests capability, permission, rule and temporary-information boundaries. ([S13f](story-matt.md#s13f)) **Trace:** [model](#trace-model) J-08, N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3. |
| MT-87 | <a id="mt-87"></a> Ask which release adds payments with absent, stale, future-target or applicable released capability information. | Reply accurately reflects a permitted current source; no invented2.35promise or assumed account entitlement. Missing information remains explicit. | Tests release-awareness without relying on model memory. ([S13f](story-matt.md#s13f)) **Trace:** [model](#trace-model) J-08 → Step 3. |
| MT-88 | <a id="mt-88"></a> Run the October and November sequence of link-student bookings recorded in [the ledger note](#october-ledger): the lost race, moves, the COUNT refusal and retry, and the package months. | Check every link student's count/minutes after each accepted act, the teacher interval once, bound totals, reminders and history. October final: Jasmine 4/240; Kai 2/105. November at S21's end: Kai 3/180, Jasmine 4/240. Package months carry no count or minute limit; their bill is the package. | Tests accumulated state across the actual full story. **Trace:** [harness](#trace-harness) D18 → Step 3 · [engine](#trace-engine) A1, Q1 → Steps 3, 4, 5 · [app](#trace-app) G10 → Step 5. |
| MT-89 | <a id="mt-89"></a> **Retired 2026-09-15 — beat parked, `parked-beats.md`.** Record a payment from Matt's report — a package month and per-lesson lessons; repeat with no human report and with a guest attempting to mark another person's payment. | Matt's story no longer records a reported payment; the recorded-facts-versus-external-events law it tested stays story-owed at the layer rows its trace names. | Kept defined so the MT series runs contiguously; never reused. **Trace:** no layer row cites MT-89 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| MT-90 | <a id="mt-90"></a> Future members link accounts and selectively share/unshare availability; one calendar is unknown. | Correct identity continuity, explicit sharing audience/detail, unknown stays unknown, shared proposals require authorized consensus and final validation. | Tests the explicitly future path without pretending today's guests share calendars. ([S14e](story-matt.md#s14e)) **Trace:** [harness](#trace-harness) D18, H6 → Steps 2, 3 · [app](#trace-app) G10 → Step 5 · [model](#trace-model) J-07 → Step 3; owed at [security](#trace-security). |
| MT-91 | <a id="mt-91"></a> The three unrecorded facts of the week before annnä — a standing Thursday agreed only in Messenger, a lesson forgotten until the student asks, and a payment Matt cannot place — are re-checked against the scenes that answer them. | The standing lesson is entered once and repeats ([S08](story-matt.md#s08)); the forgotten lesson is met by Matt's own reminder ([S07](story-matt.md#s07), [S14a](story-matt.md#s14a)); two students asking for one afternoon resolve to one winner ([S13g](story-matt.md#s13g)); who has paid is not tracked by the story — that beat is parked, `parked-beats.md`. The details still bracketed in the scene are founder facts to fill, never inferred. | [S01a](story-matt.md#s01a) states the world without annnä and carries no product obligation of its own; this row keeps its problems from being answered only by assertion. **Trace:** no layer row cites MT-91 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app). |
| MT-92 | <a id="mt-92"></a> Matt submits “gym twice on Monday, Wednesday and Friday — once before noon and once in the afternoon, no set time”; he taps Done and Skip across the week; a lesson is later booked across a gym window. | One repeating Task with two windowed instances per named day, labelled Task, not Routine; no clock time and no reserved interval; each instance takes Done or Skip in one tap with no reason asked; the record counts 2 done · 4 skipped; a lesson books over a window with nothing to get past ([S13g](story-matt.md#s13g), [S14b](story-matt.md#s14b)). | Tests a Task carrying a window and a repeat — the shape [HR-42](#hr-42) records as an open engine question — without letting it hold time ([S03a](story-matt.md#s03a)). **Trace:** no layer row cites MT-92 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model). |
| MT-93 | <a id="mt-93"></a> “I ate at 2 am” and “I'm fasting until Thursday evening” are submitted; separately a past meal time is ambiguous. | The meal is logged at the stated past time and takes no place in the day's column; no routine question follows; the fast is a note that blocks nothing and proposes no meal times; an ambiguous time is asked, never guessed. | Tests logging after the fact against the routine cue of [HR-01](#hr-01) — annnä forces no pattern on eating ([S03a](story-matt.md#s03a)). **Trace:** no layer row cites MT-93 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app), [model](#trace-model). |
| MT-94 | <a id="mt-94"></a> Matt switches the standing-slot option on, then enters Mark's weekly Thursday 09:00–11:00 and Georgina's Monday-and-Thursday 19:00–20:00 on package terms, with Messenger as contact and meeting link; separately a series with no package, and the option switched off afterwards. | Each week's lesson becomes its own booking as its date comes, carrying the package and the meeting link; the same address stored as contact and meeting link stays two fields; switching the option off leaves series already entered untouched. | Tests the standing-slot series and its terms at entry ([HR-34](#hr-34); [S07](story-matt.md#s07), [S08](story-matt.md#s08), [S09](story-matt.md#s09)). **Trace:** no layer row cites MT-94 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [marketplace](#trace-marketplace). |
| MT-95 | <a id="mt-95"></a> **Retired 2026-09-15 — beat parked, `parked-beats.md`.** On 21 October Matt asks “Who owes me what for October?”; repeat with a payment missing and after a cancelled lesson. | Matt's story no longer tells this ledger beat; COVERAGE's owed “who owes me what, this month, right now” stays story-owed at the layer rows this row's trace names. | Kept defined so the MT series runs contiguously; never reused. **Trace:** no layer row cites MT-95 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model). |
| MT-96 | <a id="mt-96"></a> **Retired 2026-09-15 — beat parked, `parked-beats.md`.** Mark asks for the fifth Thursday, 29 October; Georgina does not; repeat with the request arriving after the day has passed. | Matt's story no longer tells a fifth-lesson-day rule; the stored fifth-lesson-day rule and its per-student scope stay story-owed at [HR-35](#hr-35). | Kept defined so the MT series runs contiguously; never reused. **Trace:** no layer row cites MT-96 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app). |
| MT-97 | <a id="mt-97"></a> **Retired 2026-09-15 — beat parked, `parked-beats.md`.** Matt reports Mark's transfer; later asks whether Georgina has paid after the due date, accepts a written reminder and pastes it, then reports her transfer. | Matt's story no longer records a reported transfer or a payment reminder; money recorded, never moved, and the reminder written, not sent, stay story-owed at the layer rows this row's trace names. | Kept defined so the MT series runs contiguously; never reused. **Trace:** no layer row cites MT-97 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [security](#trace-security). |
| MT-98 | <a id="mt-98"></a> Matt cancels Georgina's Monday, 19 October; test This occurrence, The series, and a stale selection. | annnä asks occurrence or series before acting; this occurrence releases 18:55–20:05 and the 18:45 reminder, reads “19 October cancelled by Matt” on the series, leaves the October package unchanged and creates no credit; the rebook link offers one in-package lesson this month, and Georgina's own choice, Tuesday 20 October 19:00–20:00, is attributed to the link. | Tests owner cancellation of one package-series occurrence and the in-package rebook ([S16](story-matt.md#s16)); the rebook allowance's stored shape is an open question at [HR-35](#hr-35). **Trace:** no layer row cites MT-98 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [security](#trace-security). |
| MT-99 | <a id="mt-99"></a> annnä offers to write a confirmation, a cancellation, a payment reminder and an offer; Matt accepts, declines, or edits the text before copying. | The text names only that student's own lesson and link; Copy message is the only act; no send grant is used and no delivery, read or failure state is shown; declining writes nothing; a pasted message is never recorded as delivered. | Tests written-not-sent messages ([HR-36](#hr-36); [S15](story-matt.md#s15), [S16](story-matt.md#s16), [S21](story-matt.md#s21)). **Trace:** no layer row cites MT-99 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app), [model](#trace-model), [security](#trace-security). |
| MT-100 | <a id="mt-100"></a> Mark misses his package lesson on 22 October and Matt reports it; repeat with the report made before the lesson starts. | The lesson reads “No-show · Reported by Matt” with the interval it held; the package bill is unchanged by the stored attendance rule; no question is asked; a report before the start is clarified or refused, never recorded as a no-show. | Tests attendance independence on a package ([S17](story-matt.md#s17)). **Trace:** no layer row cites MT-100 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app). |
| MT-101 | <a id="mt-101"></a> **Retired 2026-09-15 — beat parked, `parked-beats.md`.** Kai misses a per-lesson lesson on 22 October with no no-show rule stored; Matt answers; Kai misses again on 29 October. | Matt's story no longer tells a per-lesson no-show; the stored-rule-asked-once law it tested stays story-owed at [HR-37](#hr-37). | Kept defined so the MT series runs contiguously; never reused. **Trace:** no layer row cites MT-101 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model). |
| MT-102 | <a id="mt-102"></a> **Retired 2026-09-15 — beat parked, `parked-beats.md`.** On 30 October Matt raises the per-lesson rate with Replace existing while Kai holds a booked November lesson at the old rate. | Matt's story no longer tells a rate raise; the forward-only rule-change law it tested (the scene formerly at S18, now parked) stays story-owed at the layer rows this row's trace names. | Kept defined so the MT series runs contiguously; never reused. **Trace:** no layer row cites MT-102 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app). |
| MT-103 | <a id="mt-103"></a> **Retired 2026-09-15 — beat parked, `parked-beats.md`.** Matt changes the package price list while Mark's and Georgina's series renew monthly and November's lessons are not yet made. | Matt's story no longer tells a price-list change; the mid-series ask and its stored answer (the scene formerly at S18, now parked) stay story-owed at the layer rows this row's trace names. | Kept defined so the MT series runs contiguously; never reused. **Trace:** no layer row cites MT-103 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model). |
| MT-104 | <a id="mt-104"></a> “Move tomorrow's run to half past six” is read back as 18:30–19:15; Matt corrects it to 06:30; separately he clicks OK on the wrong reading. | Nothing is written before OK; the 18:30 proposal holds no time, moves no card and changes no guest page; the corrected 06:30–07:15, held 06:20–07:30, applies to Saturday 31 October only; the usual routine stays at 06:00. An OK on the wrong reading writes exactly what was read back. | Tests the read-back as the only check on a valid wrong hearing ([HR-38](#hr-38); [S19](story-matt.md#s19)). **Trace:** no layer row cites MT-104 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app), [model](#trace-model). |
| MT-105 | <a id="mt-105"></a> The month turns to 1 November with no act from Matt. | October closes with its entries as recorded; Kai's and Jasmine's limits stand full, and Kai's pre-booked 5 November lesson counts 1 of 4; Mark's and Georgina's packages renew on the same terms. | Tests the month boundary and renewal ([HR-39](#hr-39); [S20](story-matt.md#s20)). **Trace:** no layer row cites MT-105 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app). |
| MT-106 | <a id="mt-106"></a> **Retired 2026-09-15 — beat parked, `parked-beats.md`.** A history query asked in November about October's money; then an edit to an October entry is attempted from the answer. | Matt's story no longer tells this history-query beat; nothing invented and nothing editable from a read-only answer stays story-owed at the layer rows this row's trace names. | Kept defined so the MT series runs contiguously; never reused. **Trace:** no layer row cites MT-106 yet — acceptance owed at [engine](#trace-engine), [app](#trace-app), [model](#trace-model). |
| MT-107 | <a id="mt-107"></a> annnä notices that logged meals cluster and offers a routine; Matt clicks Keep logging; repeat with Make a routine. | The offer is opt-in and names what it saw; Keep logging adds nothing to the board and the next meal is just a log; Make a routine goes through the ordinary routine proposal, never a silent create. | Tests the noticed-pattern offer's beat, `user-stories/README.md` register entry 1 ([S20](story-matt.md#s20)). **Trace:** no layer row cites MT-107 yet — acceptance owed at [harness](#trace-harness), [model](#trace-model). |
| MT-108 | <a id="mt-108"></a> Matt opens a full Thursday, 19 November; Kai books 26 November while he looks. | The board is at rest — nothing flashes, counts down or asks to be sorted; the booking writes its ordinary note and sits inside Matt's wake scope until tapped; Kai's summary reads 3 of 4 · 180 of 240; nothing wakes on its own. | Tests the rest state and the wake ([HR-40](#hr-40); [S21](story-matt.md#s21)). **Trace:** no layer row cites MT-108 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app). |
| MT-109 | <a id="mt-109"></a> At 02:40 a request from Jasmine's link asks to move Friday 27 November to Monday 30 November 13:00 while she is at 4 of 4; the unattended run reaches its step-and-spend ceiling. | The run parks rather than failing or running on; nothing is sent or half-moved; the card names the budget as the reason and the request's two edges; only a human clears it; after Matt's OK the written offer is pasted and Jasmine moves her own lesson to Monday 30 November 15:30–16:30, still 4/240. | Tests the per-firing budget park ([HR-41](#hr-41); [S21](story-matt.md#s21)); an owner-approved offer from a parked card is an open question there. **Trace:** no layer row cites MT-109 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model). |

## Separate future stories

- The iPhone native-app entry route and cross-device continuity.
- Returning-account entry and recovery of saved work.
- Finding, inspecting and customizing an existing catalog template.
- The additional freelance dive-instructor layer of Matt's same combined Story 1, when he supplies it.

These are future authored paths, not conditional branches inserted into every paragraph of the first web session. E/ER remains a separate held-out probe.

<a id="crud"></a>

## CRUD coverage — 26 managed object families, two of them retired

Matt's direction: make create, read, edit and delete/removal possible and visible across the things the user manages. The current story has 32 scenes and includes standing package series, link-package bookings and capability refusals; CRUD-25 and CRUD-26 belonged to the group scenes FD-106 retired and stand as retired rows. The story demonstrates consequential operations; this inventory prevents quieter objects and fields from falling through the gaps.

This is a specification checklist, not proof of implemented CRUD. **Shown** means the action is actually performed in the named scene. **Required** means it is specified below or in an unexecuted case and still needs a narrated example or implementation proof. An available button is not evidence its action was performed.

## The meaning of removal is part of the interaction

For each action, show the selected object, actor, scope, saved value, proposed change, affected dependencies, confirmation when consequential, and a reopened result. Distinguish clearing a field value, removing a field definition, discarding a draft, cancelling a commitment, stopping future recurrence, retiring a template, revoking a link and permanent data erasure. Hiding is a display filter.

The current [harness/SPEC.md](../../../harness/SPEC.md) says **“no tool deletes a record”** and **“the sole record is never destroyed”**. Its cancellation/withdrawal/diff operations can support removal from active use. This pass does not quietly reinterpret them as physical erasure. Selective erasure already has its technical home in [security/INTERFACES.md](../../../security/INTERFACES.md). The unanswered scope is broader product-facing account/record erasure and its retention effects; resolve it through that home and LEGAL-01, not a new harness destruction operation. Do not promise infinite retention either.

User decisions belong in annnä's conversation with its user. If deleting a referenced item affects real commitments, show the concrete choices/consequences and obtain that user's decision; the author of this story does not choose a universal cascade policy.

## Object inventory

| ID | Object and actor | Create / read | Edit | Delete or removal, and evidence gap |
|---|---|---|---|---|
| CRUD-01 | <a id="crud-01"></a> Account and optional profile data — owner | Shown [S02](story-matt.md#s02): create verified account and inspect summary. | Required: reopen own profile, change optional name/work description and read saved result. | Required companion account-closure journey; show dependencies and applicable retention/erasure result. Do not close Matt's account in the middle of this first-use story. [MT-80](#mt-80); erasure question pending. **Trace:** no layer row cites CRUD-01 yet — acceptance owed at [app](#trace-app), [security](#trace-security). |
| CRUD-02 | <a id="crud-02"></a> App language, timezone and time format — owner | Shown [S02](story-matt.md#s02): choose and review. | Required: reopen settings; change a value; explain whether it changes presentation or an authored schedule's timezone before saving. | A required timezone cannot become an unexplained null/default. Removal of an override must show the resulting effective value or ask for a replacement. MT-75. **Trace:** no layer row cites CRUD-02 yet — acceptance owed at [engine](#trace-engine), [app](#trace-app). |
| CRUD-03 | <a id="crud-03"></a> Skin and glass settings — owner | Shown [S02](story-matt.md#s02)/S04: select/read Koi and opacity. | Shown [S04](story-matt.md#s04): board opacity80→90, separately from console. | Required: clear an override with its resulting appearance shown; removing a skin selection must provide a visible replacement. No commitment data is deleted. MT-75. **Trace:** no layer row cites CRUD-03 yet — acceptance owed at [app](#trace-app). |
| CRUD-04 | <a id="crud-04"></a> Role/category labels and styling — owner | Shown [S02](story-matt.md#s02)/S08a/S12a: profile role, Personal, English outline. | Shown [S12a](story-matt.md#s12a): set chosen styling; label-edit path required. | Required: removing a style leaves classification; removing a classification explains affected associations/rules. Never silently release time or reset quotas. MT-75. **Trace:** [harness](#trace-harness) B9 → Step 4 · [app](#trace-app) G7 → Step 5. |
| CRUD-05 | <a id="crud-05"></a> Saved places — owner | Shown [S02](story-matt.md#s02)/S05: Home/Sarah, inspect saved entries. | Required: edit a saved nickname separately from the address/pin; disclose any effect on referenced commitments. | Required: remove from reusable locations; resolve future references explicitly and preserve explained historical facts under their contract. Removing a bookmark and erasing personal address data are different scopes. MT-74. **Trace:** no layer row cites CRUD-05 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app), [security](#trace-security). |
| CRUD-06 | <a id="crud-06"></a> Run routine definition — owner | Shown [S03](story-matt.md#s03)/S04: create/read the repeating schedule. | Shown [S05](story-matt.md#s05): usual destination/travel settings versus a dated exception. | [S05a](story-matt.md#s05a) offers stopping from a date, but chooses one occurrence. Whole-routine stop is Required: name effective date, affected future instances and exceptions; read the result. MT-70. **Trace:** [engine](#trace-engine) M3 → Step 6. |
| CRUD-07 | <a id="crud-07"></a> One routine occurrence — owner | Shown [S04](story-matt.md#s04)/S05: find/read dated occurrence. | Shown [S05](story-matt.md#s05): origin/departure/buffer exception. | Shown [S05a](story-matt.md#s05a): cancel17October, release05:50–07:00, inspect skipped date and preserved other occurrences. MT-69. **Trace:** [engine](#trace-engine) M2 → Step 6. |
| CRUD-08 | <a id="crud-08"></a> Personal Event and its field values — owner | Shown [S08a](story-matt.md#s08a): create/read appointment. | Shown [S08a](story-matt.md#s08a): note edit, clear and attributed field-value restoration; [S11](story-matt.md#s11): end16:00→16:15. | Shown [S08a](story-matt.md#s08a): clear note value while field/event remain. Cancelling the whole personal Event is Required under the same explicit dated-commitment path. [MT-68](#mt-68)/78. **Trace:** no layer row cites CRUD-08 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| CRUD-09 | <a id="crud-09"></a> Preparation Task — owner | Shown [S13b](story-matt.md#s13b): create due-date task and open card. | Shown [S13b](story-matt.md#s13b): rename camera→camera and microphone. | Shown [S13b](story-matt.md#s13b): remove selected future task from active tasks, retaining lesson/reminder. Completion/undo-completion are separate state changes requiring their own cases. MT-71. **Trace:** [harness](#trace-harness) C5 → Step 1. |
| CRUD-10 | <a id="crud-10"></a> Reusable template — owner | Shown [S06](story-matt.md#s06)–[S08](story-matt.md#s08) and [S13b](story-matt.md#s13b): create/read original and separate saved copy. | Shown [S13](story-matt.md#s13): Replace existing after blocker resolution; [S13b](story-matt.md#s13b): Save as new. | Shown [S13b](story-matt.md#s13b): remove unused copy, discard its empty use, inspect original. Referenced-template removal is Required: show links, pending uses and bookings; resolve their actual effects. [MT-72](#mt-72)/73. **Trace:** no layer row cites CRUD-10 yet — acceptance owed at [harness](#trace-harness), [marketplace](#trace-marketplace). |
| CRUD-11 | <a id="crud-11"></a> Optional template field definition — owner | Shown [S07](story-matt.md#s07): add Preparation note, view its value. | Shown [S07](story-matt.md#s07): edit its content in console and see row change. | Shown [S07](story-matt.md#s07): delete the draft row and its draft value. Required: saved-field removal and label/type changes with existing uses/dependencies explained. [MT-66](#mt-66)/67. **Trace:** no layer row cites CRUD-11 yet — acceptance owed at [harness](#trace-harness), [marketplace](#trace-marketplace). |
| CRUD-12 | <a id="crud-12"></a> Scheduling rules and calculated values — owner | Shown [S07](story-matt.md#s07): duration/step, windows, buffers, format, language, the two packages with their attendance rule, standing slot, count/time caps and readback. | Shown [S13](story-matt.md#s13): effective-window change blocked by a booking. Owed — parked (`parked-beats.md`): a package price-list change and a per-lesson no-show rule stored once. Other editable rule families use the same review/validation path. | Required: remove optional rule; if another rule/calculation requires it, show the dependency and wait for an explicit resolution. Derived price total is changed through duration/rate/basis, not arbitrary overwriting. Governing constraints remain outside ordinary owner authority. [MT-67](#mt-67)/78. **Trace:** no layer row cites CRUD-12 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| CRUD-13 | <a id="crud-13"></a> Student record — owner | Shown [S08](story-matt.md#s08)/S09/S10: Mark, Georgina, Kai and Jasmine automatically saved as Student contacts through the console; [S13g](story-matt.md#s13g) and [S14b](story-matt.md#s14b) reuse Kai's and Jasmine's entries. | Shown [S10](story-matt.md#s10): explicit channel association to existing Georgina. Student-name edit required. | Required: remove student from active list with future lessons/links identified; explain retention of attributed history and identity for quotas. No delete/recreate limit reset. [MT-74](#mt-74)/78. **Trace:** [harness](#trace-harness) A6 → Step 3 · [app](#trace-app) V1 → Step 7. |
| CRUD-14 | <a id="crud-14"></a> Individual student contact value — owner | Shown [S08](story-matt.md#s08)/S10: Messenger, LINE, Instagram and Georgina's second messaging app, each on its selected student. | Required: correct one contact value through the console and inspect the readback; since FD-106 no Matt scene shows a correction. | Required: remove one contact, identify affected delivery/link use, retain other contacts and student history. Permission is not transferred to a newly typed recipient. MT-74. **Trace:** [harness](#trace-harness) A6 → Step 3 · [app](#trace-app) V1 → Step 7. |
| CRUD-15 | <a id="crud-15"></a> Template use / unconfirmed draft — owner or scoped guest | Shown [S08](story-matt.md#s08)/S10/S11: create and revisit Kai's use. | Shown [S11](story-matt.md#s11): preserve/correct fields through invalid and stale choices. | Shown [S13b](story-matt.md#s13b) for an empty owner's use discarded with unused template. Populated draft discard is Required: resolve pending commit outcome first; committed bookings take their cancellation path. It stays Required here: Debra's `Situation-D/situation-5.md` tells a half-built draft abandoned (scripted, FD-106), which closes nothing. MT-77. **Trace:** no layer row cites CRUD-15 yet — acceptance owed at [harness](#trace-harness), [marketplace](#trace-marketplace). |
| CRUD-16 | <a id="crud-16"></a> Owner-entered booking — owner | Shown [S08](story-matt.md#s08)/S09/S12: create/read Mark's and Georgina's agreed standing series. | Required: parked (`parked-beats.md`) — future-month terms recorded on both standing series after a price-list change. | Shown [S16](story-matt.md#s16): Matt cancels one occurrence of Georgina's series with its release, the unchanged package and a rebook link, distinct from forging a guest act; guest version is shown S14b. Stopping a whole series remains Required. [MT-98](#mt-98)/78. **Trace:** no layer row cites CRUD-16 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| CRUD-17 | <a id="crud-17"></a> Guest's own booking — scoped guest | Shown [S11](story-matt.md#s11)/S14b: create/read Kai's and Jasmine's bookings. | Shown [S14b](story-matt.md#s14b): move Saturday10:00→10:15, preserving one booking/count; [S21](story-matt.md#s21): Jasmine moves 27 November to 30 November 15:30. | Shown [S14b](story-matt.md#s14b): Keep booking leaves it live, then confirmed cancellation releases reservation/count/time under the explicitly chosen setting. Current template rules and other people's bookings remain outside guest CRUD authority. MT-76. **Trace:** [harness](#trace-harness) H8 → Step 5 · [model](#trace-model) N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3. |
| CRUD-18 | <a id="crud-18"></a> Booking/request access link — owner; guest reads permitted page | Shown [S10](story-matt.md#s10)/S11/S14b: issue, copy, open separately scoped links; [S16](story-matt.md#s16): a rebook link inside Georgina's package. | Required: changing a link's purpose/recipient must use the authorized credential path; never edit token bytes or move authority by renaming a contact. | Required: revoke the selected link, explain whether/how authorized access is replaced; do not cancel a lesson as an undocumented side effect. MT-79. **Trace:** [app](#trace-app) G10 → Step 5 · [security](#trace-security) T5 → Step 4. |
| CRUD-19 | <a id="crud-19"></a> Per-booking joining URL — owner edits; permitted guest reads | Shown [S13a](story-matt.md#s13a)/S14a: supply/open URL. | Required: replace supplied URL for the selected booking and inspect new readback. | Required: clear URL, explain now-missing joining details; neither template nor other booking changes. MT-68. **Trace:** [app](#trace-app) G10 → Step 5. |
| CRUD-20 | <a id="crud-20"></a> Personal reminder configuration — owner | Shown [S07](story-matt.md#s07): choose/authorize/read email15minutes. | Shown [S13](story-matt.md#s13)/S14b: schedule follows accepted booking move. Explicit timing/channel edit required. | Shown [S14b](story-matt.md#s14b): cancellation removes that pending reminder. Required: remove own reminder configuration/authorization and verify no stale firing sends; distinguish removing one booking reminder from all-English scope. [MT-58](#mt-58)–60/78. **Trace:** [harness](#trace-harness) D28 → Step 5. |
| CRUD-21 | <a id="crud-21"></a> Temporary board filter — owner | Shown [S12a](story-matt.md#s12a): hide Routines, inspect active indicator. | Required: change which authorized categories are displayed. | Shown [S14](story-matt.md#s14): Show routines removes filter. [S05a](story-matt.md#s05a)'s cancelled occurrence remains cancelled when the display filter clears. [MT-54](#mt-54)/69. **Trace:** no layer row cites CRUD-21 yet — acceptance owed at [app](#trace-app). |
| CRUD-22 | <a id="crud-22"></a> Pending rule proposal — owner | Shown [S13](story-matt.md#s13): create/read Blocked with old/new values. | Shown [S13](story-matt.md#s13): resume with prior answers retained; Edit proposal offered but not performed. | Required: discard pending change; current rule remains effective, and already accepted independent booking moves are not silently undone. MT-77. **Trace:** no layer row cites CRUD-22 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| CRUD-23 | <a id="crud-23"></a> Reported actual end — attributed owner | Shown [S14a](story-matt.md#s14a): Kai's reported end with Matt as source; [S17](story-matt.md#s17): no-shows reported by Matt. Owed — parked (`parked-beats.md`): payments reported separately. | Required: explicit correction with correct booking/date and retained attribution. | Required: withdraw a mistaken report through an explained corrective action; recompute dependent state using its contract. This is not authority to rewrite/delete the history of who said what. Permanent erasure remains pending. MT-80. **Trace:** no layer row cites CRUD-23 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine). |
| CRUD-24 | <a id="crud-24"></a> Console text, submitted commands, notices and grants — authorized actor | Shown [S02](story-matt.md#s02)/S03/S07: submitted choice versus unsent example and visible accepted settings. | Shown [S03](story-matt.md#s03): edit unsent text. Changing a saved outcome uses the selected object's action; notice/grant changes require their own authority. | Clearing an unsent box is distinct from discarding an unconfirmed draft, removing conversation display, withdrawing a grant, or reversing a committed action. Required explicit paths and retention contracts for each; erasure pending. [MT-77](#mt-77)/80. **Trace:** no layer row cites CRUD-24 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app), [security](#trace-security). |
| CRUD-25 | <a id="crud-25"></a> **Retired (FD-106)** — named group and its reusable roster — owner | Required: story-owed since FD-106 retired the group roster scene S08b; no Matt scene shows it. | Required: story-owed; a persistent group-roster edit remains an obligation at its layer homes. | Required: story-owed; retiring a group with dependent requests stays an obligation of the law FD-106 kept. MT-82. **Trace:** [harness](#trace-harness) A6, H6 → Steps 2, 3 · [engine](#trace-engine) A4 → Step 5 · [app](#trace-app) V1 → Step 7. |
| CRUD-26 | <a id="crud-26"></a> **Retired (FD-106)** — shared request, participant set and coordination rights — authorized actors | Required: story-owed since FD-106 retired the shared-request scene S13d; no Matt scene shows it. | Required: story-owed since FD-106 retired the participant-change scene S14c. | Required: story-owed; shared-booking cancellation, coordinator revocation and expired agreement stay obligations of the law FD-106 kept. [MT-83](#mt-83)/84. **Trace:** [harness](#trace-harness) D24, H4, H6 → Steps 2, 3, 5 · [engine](#trace-engine) A4 → Step 5 · [app](#trace-app) G10 → Step 5. |

## What this pass demonstrates and still owes

The main story shows actual removal outcomes for a dated routine occurrence, optional field definition, saved field value, temporary template/use, Task and scoped guest booking. It also demonstrates the previously offered Save as new branch, guest move/cancel including a user backing out of cancellation, and an owner cancelling one occurrence of a package series ([S16](story-matt.md#s16)).

The Required cells are not closed by their similarity to a shown action. They are explicit acceptance targets: a further story can exercise them where natural, and implementation must verify them. No generic Delete button or prompt instruction proves all26 families work. One owner CRUD pass cannot prove the narrower guest permissions.

Derived cue detail: [HR-27](#hr-27)–33. The layer-debt map identifies the existing normative homes and propagation still owed. This checklist does not amend them or prove implementation.

<a id="harness-cues"></a>

<a id="hr-01"></a>

## HR-01 — “every” can prompt routine confirmation

**Trace:** [harness](#trace-harness) B1 → Step 4 · [model](#trace-model) N-08, A-14, R-14, J-01, J-08, Q-05, S-07, N-11, N-12, A-01, N-13, J-04 → Step 3; owed at [engine](#trace-engine).

**Founder direction:** Event, Task and Routine are user-facing commitment choices. After the edited run instruction, annnä asks, “Is this a routine?” Matt confirms through the proposal's in-console OK action.

**Cue to record:** `every` attached to an explicit repeating schedule in an owner-submitted creation request. Positive example: “I go for a run every Monday, Tuesday, Thursday, Friday and Saturday”.

**Reason:** the utterance describes a repeated activity, so Routine is a candidate interpretation. The cue supplies a reason to ask; it is not sufficient authority to classify and create a routine without the requested confirmation.

**Proposed decision flow:**

1. Receive the submitted owner utterance and the current view/draft context. A prefilled text box that has not been sent is not an owner instruction.
2. Preserve the cue's exact source span and the recurrence interpretation. Match a repeating-time expression, not a bare substring anywhere in the text.
3. On new commitment capture with that candidate interpretation, ask **Is this a routine?** The in-console OK/Edit controls belong to this specific proposal.
4. On OK, validate and persist the confirmed Routine and its requested schedule through the normal permitted write path. Record that the type came from the user's confirmation.
5. On Edit or a disagreeing typed reply, keep the instruction available for correction. Do not silently drop the requested recurrence, create both an Event and a Routine, or reinterpret disagreement as agreement.
6. A later edit to a known Routine reuses its confirmed type. “Usually I leave from Home, but on this date…” is scope information for that edit, not a new routine-creation request.

**Counterexamples to preserve:** “I answered every email”; a quoted tutorial rather than submitted intent; “I don't run every Monday”; a past-tense account of last month's runs; editing one occurrence of an already-confirmed Routine. The full meaning and task context determine whether a confirmation is appropriate. “Every other Monday” must preserve the interval rather than becoming every Monday.

**Modeling obligation:** the founder has named the user-facing choices, but their storage and lifecycle mapping still needs a coherent specification. Define how a Routine owns or generates dated occurrences and relates to timed events or untimed tasks. This story exercises a timed Run routine. It does not silently settle every routine/task combination or add an unrelated rule type to the engine's closed rule menu.

**Propagation homes:** model intent/field extraction and evaluation; harness elicitation and typed confirmation; engine/stored occurrence identity; app type display and story-derived scenarios. Keep deterministic date/time/placement computation in its existing authority layer.

<a id="hr-02"></a>

## HR-02 — bind a dated edit to an exact occurrence

**Trace:** [harness](#trace-harness) B1, L6 → Steps 4, 5 · [engine](#trace-engine) M8 → Step 6 · [model](#trace-model) N-13, A-09 → Step 3; owed at [app](#trace-app).

Resolve the requested weekday, day, month and year against the calendar and the selected Routine. The founder resolved the date question: keep2026 and choose a Monday in October other than the15th. The worked story uses September2026 and Monday12October2026. The original Monday15October2026 combination is invalid because15October2026 is a Thursday.

If a supplied weekday and numeric date disagree, ask which is intended; do not quietly change the weekday, date or year in a real user operation. If multiple commitments match, resolve the target before writing. Store an actual occurrence identity/date, not the display string “Monday”.

The visible scope label is **Monday, 12 October**, with **October2026** in the surrounding board context. It need not append “only”. The data and confirmation scope, rather than that extra word, restrict the change. Another Monday retains the Routine's normal settings.

Day/Week/Month controls change the visible date span. They are not the packed/hour-grid layout switch. Moving from a September week to an October week loads the relevant occurrences and does not reschedule them. An unloaded or unavailable span must not be mistaken for a verified empty board.

<a id="hr-03"></a>

## HR-03 — share the form draft with the console

**Trace:** [model](#trace-model) N-15 → Step 3; owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app).

A resolved field edit supplies the selected occurrence, changed field, proposed value and current pending scope to the console's ordinary owner-interaction path. The console's follow-up refers to that same draft. It does not inspect an unrelated saved version or infer an address from invisible conversation memory.

Once Matt answers that the origin change is for the named occurrence, subsequent departure/buffer proposals reuse that scope. A changed origin, date, arrival time or mode invalidates a stale route proposal. A user's accepted date/scope is not repeatedly elicited as if it were unknown.

<a id="hr-04"></a>

## HR-04 — proposed departure is accepted inside the console

**Trace:** [harness](#trace-harness) B1 → Step 4 · [engine](#trace-engine) T4 → Step 4 · [model](#trace-model) R-09, A-11 → Step 3.

Inputs for the worked proposal: Sarah's house → Park; Driving; the selected dated occurrence; arrival06:00; estimated travel30minutes; current before-buffer10minutes.

The console presents the proposal explicitly: **leave Sarah's house at05:30**, arrive06:00, and replace the before-buffer10 with30 for **Monday,12October**. Matt chooses **OK** or **Edit inside that message**. Only the accepted proposal updates the corresponding run draft; final form Save applies the reviewed occurrence edit.

The origin and departure must remain paired:05:30 is departure from Sarah's house, not an instruction to leave Home. Thirty minutes replaces the before-buffer; it is not added a second time as another thirty-minute travel reservation. The run remains06:00–06:45 and the after-buffer remains15minutes, yielding05:30–07:00 for the affected occurrence.

Route duration is a sourced estimate for a place pair, mode and time—not a model-invented number or a guarantee of physical arrival. Provider/date/arrival-time support, freshness and failure behavior remain explicit implementation obligations. The story's numbers are fixtures, not live route measurements.

<a id="hr-05"></a>

## HR-05 — saved-place persistence is a separate consented action

**Trace:** [harness](#trace-harness) G2 → Step 4; owed at [engine](#trace-engine).

Map-picker Save puts the chosen address/name into the run draft. The console then asks whether **Sarah's house** should be kept in saved locations for future use. This is separate from whether one occurrence or the usual Routine uses it.

In this story Matt clicks OK and gains a reusable named place. The original Home entry stays Home. “Save permanently” means persistence for reuse under the applicable user/deletion/retention rules; it does not mean legally unerasable storage forever.

A typed refusal must still permit the appropriate one-occurrence address use without silently creating a reusable saved-place entry. If saved-place persistence was already separately accepted, cancelling the subsequent run edit must not misreport that the accepted saved-place action never happened.

<a id="hr-06"></a>

## HR-06 — Send and proposal actions are different controls

**Trace:** no layer row cites HR-06 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app).

- **Send** is the text-submission action at the edge of the console input area.
- **OK / Edit** are actions on annnä's particular proposal inside the conversation.
- Map-picker Save, template Save and final form Save remain distinct save operations in this draft; the founder's instruction renames an outer conversation OK to Send, not every save control in the product.
- OK binds to the exact proposal's date, values and scope. A changed draft or expired proposal cannot be approved accidentally by a stale OK click.

<a id="hr-07"></a>

## HR-07 — appearance changes preserve the underlying commitments

**Trace:** no layer row cites HR-07 yet — acceptance owed at [app](#trace-app).

The owner can open the console's Appearance tab and adjust Board commitments separately from Console and panels. Increasing board-glass density improves the chosen presentation of the Run cards. It does not change Routine type, dates, permissions, recipients, durations or buffers.

Keep the existing distinction between clear photographic field and glass on cards/panels. Preserve meaningful outlines/time labels and accessibility behavior. Tabs and in-message OK/Edit are current founder-requested interaction changes; the old hamburger-only/inline-control prohibitions need coordinated propagation rather than silently remaining contradictory.

### The opening problem and the reminder

Matt added that he sometimes forgets a session until a student asks whether he is ready. Recording and self-booking alone do not prove that reminder/attention behavior solves this problem. [HR-24](#hr-24) and [S07](story-matt.md#s07)/S14a now propose a concrete owner-selected reminder journey for review. The example is not a global reminder default or evidence of delivery; implementation and delivery tests remain owed.


<a id="hr-08"></a>

## HR-08 — console-led template authoring with structured readback

**Trace:** [model](#trace-model) N-08, A-14, R-14, J-01, J-08, Q-05, S-07, N-11, N-12, A-01, N-13, J-04 → Step 3; owed at [harness](#trace-harness), [app](#trace-app), [marketplace](#trace-marketplace).

The console is the primary interaction for constructing and amending scheduling rules. The adjacent form shows the structured draft. Proposed rows have Edit/Delete affordances from their first appearance; the user can keep or remove them.

For each free-text field, the console asks for that detail and supplies an editable example in the actual reply box. The user may keep or replace it, then Send. Examples are not accepted values until submitted. The normalized, validated answer updates the corresponding form row. Edit targets that row and returns its CURRENT value to the console; it does not restore the original example and discard the user's work. New rows can originate from a natural-language request such as “Standing lessons are 4,000 a month”.

Delete removes the proposed row/constraint from the draft, with the appropriate visible impact if dependencies exist. It does not delete existing bookings or bypass required validation. An essential unresolved input must be surfaced before the relevant template/booking can claim readiness; do not silently recreate a deleted row or invent a replacement value.

Representability still matters: “Tuesday/Thursday every other week” must retain its alternating-week meaning and ask for an anchor when necessary. Do not silently flatten it to every week because a rigid widget cannot express it. This direction favors the console as the general authoring path while retaining bounded controls such as map selection and explicit options already requested by the founder.

<a id="hr-09"></a>

## HR-09 — finite options submit directly; a blank can be intentional

**Trace:** [model](#trace-model) N-15, N-16 → Step 3; owed at [harness](#trace-harness), [app](#trace-app).

For a finite supported choice such as Online/In person, an in-console option click is the submitted answer. It must not require a second Send or dispatch twice. The form reflects the selected value.

Meeting link is intentionally left blank in the template and initial booking in this story. The console's Leave blank action records that intention; the row remains editable/deletable. Do not substitute an example URL, create a provider meeting or imply that joining details were supplied. [S13a](story-matt.md#s13a) and [HR-25](#hr-25) now propose supplying a real owner-provided link to one confirmed booking later. The template stays blank; the new scene is an acceptance target, not proof obtained here.

<a id="hr-10"></a>

## HR-10 — teaching availability from an overnight exclusion

**Trace:** [engine](#trace-engine) P6 → Steps 4, 5 · [model](#trace-model) N-10, R-05 → Step 3; owed at [harness](#trace-harness).

The submitted teaching-window instruction is “All available times outside of11pm to9am”. Its readable rule is every day09:00–23:00, intersected with the owner's available time and the lesson-buffer requirements. The excluded interval crosses midnight.

Scope this to the English scheduling template. It does not ban Matt's06:00 personal Run routine or turn all fourteen daily hours into availability when another commitment occupies some of them. Duration is a range30–120minutes. Five-minute buffers are before AND after, not a single five-minute combined allowance. Engine-owned placement validates the whole required interval and any applicable boundaries; neither the model nor a displayed field computes a different answer.

<a id="hr-11"></a>

## HR-11 — contextual suggestions remain hypotheses until answered

**Trace:** [model](#trace-model) A-14, N-08, R-14, J-01, J-08, Q-05, S-07, N-11, N-12, A-01, N-13, J-04 → Step 3; owed at [harness](#trace-harness).

An English class supplies a reason to SUGGEST English for the guest page. In the story it is placed in the editable reply box and Matt submits it. This does not establish that every student can read English, nor replace a different owner choice. The app-language setting and guest-page language remain distinct.

The onboarding region Taiwan supplies a reason to ask whether a bare number in a package price means NT$. It is not proof of billing currency. The owner confirms the currency. Preserve an explicit different currency and do not perform a currency conversion merely because the region is Taiwan.

<a id="hr-12"></a>

## HR-12 — price basis is a required clarification before calculation

**Trace:** [model](#trace-model) A-14, J-06, N-08, R-14, J-01, J-08, Q-05, S-07, N-11, N-12, A-01, N-13, J-04 → Step 3; owed at [harness](#trace-harness), [engine](#trace-engine).

Founder requires explicit confirmation of currency and basis when a bare number names a package price. [S07](story-matt.md#s07) preserves the pattern with the story's own wording: **"NT$4,000 a month per standing slot?"**, answered with OK. This confirms both dimensions in one proposal; separate questions remain useful when either dimension is unresolved. Do not repeat an already explicit answer.

Store the confirmed amount, currency and basis (per month, per package) separately. A bare number or region does not determine the basis. Until the answer exists, do not present a package price as settled.

This clarification belongs in the user's console journey, not in a founder-wide policy question. The creator chooses their own price basis; the application must be able to ask and retain it. Matt's story no longer prices by the lesson, so a per-lesson duration calculation is not exercised here (parked 2026-09-15, `parked-beats.md`).

<a id="hr-13"></a>

## HR-13 — a personal appointment has its own contextual fields

**Trace:** [engine](#trace-engine) P6 → Steps 4, 5 · [model](#trace-model) R-07 → Step 3; owed at [harness](#trace-harness).

After Save opens the template ready for use, [S08a](story-matt.md#s08a) returns Matt to the owner board and creates a separate Personal appointment on Thursday15October2026,15:00–16:00. Prefill supplied title/type/date/times; elicit missing relevant details, not information already in the utterance. The worked event has Home as location, zero personal before/after buffers, a note and the Personal category; optional travel fields remain available when relevant.

This is an ordinary Event, not a template field. On save, the owner sees it on his own board and the console explains its effect on English availability. English's5-minute buffers mean a prior lesson must END by14:55 or the next START at16:05 or later. The private appointment's own buffers remain0. In [S11](story-matt.md#s11) the proposed race extends its end to16:15 after Kai selects16:05 but before his first confirmation. This moves the earliest English start to16:20; his newly selected16:30 remains valid. Earlier16:05 statements describe the pre-edit state, not the final appointment. Do not confuse allowed start times with the shaded occupied interval or apply English restrictions to all personal events.

The owner does not open a student-page preview. Current blocked time is derived for the actual guest surface when it is accessed. The owner trusts a real enforcement obligation, not a cosmetic blocked stripe.

<a id="hr-14"></a>

## HR-14 — reuse is the default; ask only when identifying content changes the premise

**Trace:** [harness](#trace-harness) H6 → Step 2 · [model](#trace-model) N-08, A-14, R-14, J-01, J-08, Q-05, S-07, N-11, N-12, A-01, N-13, J-04 → Step 3; owed at [marketplace](#trace-marketplace).

A template serves different students over time by default. Keep Student/name/contact as per-use blanks without an upfront reuse questionnaire. Reuse across people and attendance in one lesson are different dimensions: Matt's explicit one-on-one request supplies attendance1; ask for group count only when it is genuinely missing or the requested group shape needs clarification.

The reuse follow-up is triggered when the owner puts a unique student name, social handle, contact address or comparable person-specific value INTO THE DEFINITION. It is not triggered by ordinary rule settings, a field label, the teacher's own known identity, or Kai's information supplied while filling one use.

Ask the relevant question: **Will this template be serving different students?** Explain the proposed value's definition/default scope and preserve the answer. If the owner already explicitly supplied that scope, do not ask the same question again. A later unique value with a new unresolved scope can justify a new question.

This is the general elicitation pattern: a concrete ambiguity, changed condition or conflict earns the follow-up. Do not turn every default into a repeated interview.

<a id="hr-15"></a>

## HR-15 — handle an intentional named definition after the triggered question

**Trace:** [model](#trace-model) A-14, N-08, R-14, J-01, J-08, Q-05, S-07, N-11, N-12, A-01, N-13, J-04 → Step 3; owed at [harness](#trace-harness), [marketplace](#trace-marketplace).

On a unique student value submitted in definition-edit context, ask **Will this template be serving different students?** If it will, explain that the value would prefill uses and distinguish putting it into this use from keeping it in the saved definition. If the owner insists on the named private-template value, allow the explicit choice and make its scope visible. Do not impose an absolute name ban or silently erase it.

If the owner explicitly wants a particular-student template, that intent resolves the scope; record it rather than repeatedly asking a settled question. A confirmed name is still not verified identity, guest authorization or permission to publish personal data. Public-catalog/privacy rules remain a separate decision from this private authoring action.

<a id="hr-16"></a>

## HR-16 — contact is a typed per-student value

**Trace:** [harness](#trace-harness) B2 → Step 4 · [app](#trace-app) V1 → Step 7; owed at [model](#trace-model), [security](#trace-security).

The reusable Student contact field is blank. Mark's use receives an owner-supplied Facebook Messenger link in the main story, and by Matt's explicit answer the same address becomes his lessons' meeting link — two fields holding one value. An explicitly supplied Instagram handle is another possible contact value, with its channel recorded; an unqualified handle may require a channel question.

Store the supplied contact's type/platform, value and source against the right student/use. A contact URL or handle is not proof the account was verified, not an API credential and not permission to read private messages or send through an unsupported channel. Link creation and manual copy/paste stay distinct from automated delivery. [S10](story-matt.md#s10) now shows Matt selecting the existing Georgina record and confirming a contact on her second messaging app beside her Messenger contact. The owner assertion supplies the association; neither name matching nor cross-app inbox access supplies it. Preserve the student identity and its lesson/count history. Reusing the template for Kai must not inherit Mark's contact or token accidentally.

<a id="hr-17"></a>

## HR-17 — individual and shared lessons with one through four students (retired)

**Trace:** [harness](#trace-harness) H6 → Step 2 · [engine](#trace-engine) A1 → Step 5 · [model](#trace-model) J-06 → Step 3.

**Retired (FD-106).** This cue was carried only by the retired group scenes S13c, S13d, S13e and S14c. Matt's story is one-on-one throughout. The shared-lesson law it pointed at — one teacher interval per shared lesson, one total price, per-participant usage, and a validated quote-version/replacement contract before an agreed change alters a bound price — stands at its layer homes and is story-owed under FD-106. The ID stays defined so the HR series runs contiguously, and is never reused.

<a id="hr-18"></a>

## HR-18 — limited student console and current guest calendar

**Trace:** [model](#trace-model) J-04, N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3; owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [security](#trace-security).

The approved story direction introduces a NARROW template-bound console. Current [harness/SPEC.md](../../../harness/SPEC.md) and [app/SPEC.md](../../../app/SPEC.md) still prohibit a guest agent; resolving that conflict in their normative homes is owed implementation-contract work, not a change accomplished here. The guest web surface has an availability calendar and a console for filling the authorized template use, asking bookability questions and receiving the relevant rule explanations. It is not the owner's general assistant. The owner has no student-page preview step.

Enforce the guest allowlist at the actual operation boundary, independently of model wording. Derive guest authority from the validated guest credential/use/booking context, not a caller-supplied role. Context contains the permitted template fields/rules, that guest's allowed data and the scoped availability result. Do not provide private owner context and rely on a prompt to hide it.

Permitted guest requests include supplying/requesting a date, start, duration and other guest-writable fields; checking whether a specified lesson interval is bookable; and confirming the validated request. The proposed CRUD extension [S14b](story-matt.md#s14b) also exercises read/move/cancel of that guest's own existing booking through its booking-bound credential. Repository [app/SPEC.md](../../../app/SPEC.md) already names “own booking state with cancel and move actions”; bring those operations into the new restricted-console contract explicitly, without widening it to other records or owner configuration. Owner-defined price, max duration, increments, windows, quotas and other students' identities are not guest-writable configuration merely because their labels appear in a form. The console can explain the relevant constraint but cannot answer unrelated requests, inspect private appointments, change Matt's rules or act on other users' bookings.

Invalid3hours is refused against the30–120minute rule, and a20-minute request against its thirty-minute minimum. Invalid72minutes is refused against the chosen15-minute step. Each refusal states the rule and waits for new input; it does not spin autonomously until a valid booking appears. A45-minute selection gives17:15 from16:30 andNT$1,125 at1500/hour.

Availability answers are about a valid English request under the template, including duration, buffers and applicable guest limits. A time with no physical occupation can still be unbookable under the template. Ask for a missing duration when needed rather than guessing an interval. Give a bounded yes/no and relevant rule explanation, without disclosing private reasons for occupied time.

The calendar reads current state when opened/refreshed; unavailable periods are blocked. At confirmation, atomically revalidate interval, buffers/capacity, guest scope, quota and quoted terms. Honor existing legitimate hold semantics; page viewing is not a new reservation rule. Stale/out-of-order data cannot reopen a closed slot. If a selection conflicts, keep allowed entered fields, explain the rule and request another choice rather than silently moving the booking or accepting a changed price.

[S11](story-matt.md#s11) now scripts the stale-selection result: initially available16:05–16:50 becomes invalid when the personal appointment ends16:15. The failed confirmation creates no lesson or quota usage. Retain the guest's allowed answers, offer a currently valid16:30 choice, show16:30–17:15/NT1125, and require renewed confirmation. This fixture exercises a selection without a live hold; it does not revoke a legitimately granted hold. A concurrent read can be stale; final admission remains authoritative. Do not leak the private appointment or its edit in the guest refusal.

Implementation propagation is required across guest auth/context, app and harness interfaces, model routing, engine validation, public-door budgets/rate limits, privacy notices and adversarial tests. This story does not prove a guest runtime exists.

<a id="hr-19"></a>

## HR-19 — duration increments are an owner rule

**Trace:** [engine](#trace-engine) P6, Y1 → Steps 2, 4, 5, 8 · [model](#trace-model) J-04, N-09, A-07, R-06 → Step 3; owed at [harness](#trace-harness).

After the owner supplies a range, elicit its increment if not already given. The worked choice is15minutes;5minutes is another offered option. With bounds30–120 and step15, the allowed set is30,45,60,75,90,105,120minutes.72 is arithmetically priceable but disallowed by the selected scheduling rule. Do not claim that currency arithmetic requires a universal increment.

Keep duration increments distinct from permitted start-time granularity. For incompatible endpoints/step or ambiguous anchoring, clarify the intended rule rather than silently rounding it. Enforce the same rule in console interpretation, readback, availability and commit.

<a id="hr-20"></a>

## HR-20 — Save opens use; definition edits ask replace or additional template

**Trace:** [marketplace](#trace-marketplace) Z3 → Step 5; owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app).

A new template Save validates/saves the definition and opens it ready to use, with its blank per-use fields. No owner student-page-preview gate or extra preview→use ceremony is required. Save does not itself fill every future student, create a real lesson or publish to the public catalog.

When persistent DEFINITION/RULES are edited from use, ask whether to **Replace existing** or **Save as new**. Filling Mark's ordinary per-use name/contact is not a definition edit and should not trigger this question. A new definition has a separate identity; the old template and its linked uses are not silently overwritten. Do not copy per-use identity/contact into the new definition unless deliberately requested and confirmed.

The main story chooses Replace existing in [S13](story-matt.md#s13); a price-list change (parked 2026-09-15, `parked-beats.md`) would use the same choice. Candidate changes remain a draft until compatibility checks and any blockers are resolved. Any accepted change preserves the correct provenance, old terms/history and scope of affected uses.

<a id="hr-21"></a>

## HR-21 — rule conflicts block application until resolved

**Trace:** [model](#trace-model) R-08 → Step 3; owed at [harness](#trace-harness), [engine](#trace-engine).

Check every proposed rule against its declared scope/effective period and the relevant active/future commitments. Block actual incompatibilities; do not turn every historical value difference into an invented blocker. The current founder direction requires an explicit compatibility gate, even where the old implementation might otherwise quietly grandfather a future conflicting booking.

For Monday09→15, Jasmine's Monday12October13:00–14:00 booking is named as a blocker; Georgina's standing Monday 19:00 lessons fit the proposed window. Keep the current template effective and show the affected record, violated proposed rule and permitted resolution actions. Do not apply the candidate, silently cancel/move Jasmine, or call unchanged old data a resolution.

Matt obtains Jasmine's agreement in Instagram, outside the app, and records the agreed move to15:30–16:30. Validate that move under current rules and the pending candidate; preserve attribution and the original one-hour price. Recheck the entire blocker set immediately before applying the replacement. A newly arrived conflict must be caught, and an unresolved or failed move leaves the template blocked. No fixed number of retries substitutes for a clear condition. [S13](story-matt.md#s13) makes the pending proposal resumable with Continue Monday change. Restore the selected template, candidate values and already answered Replace existing choice; the resumed check uses current records, not the earlier clearance. Waiting for an outside reply is not authorization to move a booking. The same one-hour Jasmine booking remains one quota entry after the move; its reminder follows its current start under HR-24.

Changing caps or other rules uses the same process when it creates a real conflict. A proposal's “why blocked” must come from validated constraints and actual records, not an LLM's invented reason. Completed historical records are not rewritten to make a new prospective rule true. A rate change (the scene formerly at S18, parked 2026-09-15, `parked-beats.md`) ran the same check and found no booking outside the new rules: the check fails one change and passes another (ST1-R02).

<a id="hr-22"></a>

## HR-22 — monthly count and time are distinct constraints

**Trace:** [harness](#trace-harness) B5 → Step 4 · [engine](#trace-engine) Q1 → Steps 3, 4, 5 · [app](#trace-app) G10 → Step 5.

The user asks for Monthly occurrences1–4 and Maximum time4hours. annnä confirms the per-student/calendar-month scope; the main story keeps both optional configured limits. The count is interpreted as a maximum4, not an obligation that a student must book at least once each month. The time is up to240minutes of booked English LESSON duration, not buffers, across the confirmed scope.

The period in this example is the month the lessons take place on the owner's calendar/timezone, not merely the month when a link was opened or a request created. Runtime must clarify a different intended period/scope when needed. Count the same known student consistently across relevant template uses/links/contact channels; changing a handle or starting another use must not reset that identity's limit. Unknown, unlinked aliases are an explicit identity-assurance limitation; do not claim per-human protection beyond the identity evidence or invent automatic merges.

The constraints are independent: four30-minute bookings use only2hours but exhaust count; two2-hour bookings reach4hours before count4. Admission checks both atomically, including concurrent requests and existing legitimate holds according to their contract. Rescheduling one lesson does not count it twice. The proposed [S07](story-matt.md#s07) extension now explicitly elicits whether pre-start cancellation releases count/time; the worked owner selects Release allowance. For Jasmine, [S14b](story-matt.md#s14b) goes 2 lessons/120 minutes → 3/165 on Saturday booking and remains 3/165 on its move. A separate Sunday booking gives 4/225; a Wednesday request would be 5/285 and refuses COUNT, remaining 4/225. Keep is unchanged; Saturday cancellation gives 3/180; a fresh Wednesday retry gives 4/240. Monday's and Friday's lessons are already included. The limits bind link students; standing-package students hold no count or time limit instead ([HR-35](#hr-35)). This is a user-selected example, not a universal cancellation rule. [S20](story-matt.md#s20) turns the month ([HR-39](#hr-39)); the rule contracts behind it, other cancellation states and scope-change handling are still owed before claiming complete enforcement.

Every proposed custom field that is meant as a restriction must map to a supported validated rule. A visible “Maximum time” row with no enforcement is not completion. An unrepresentable rule earns a precise limitation/clarification, not silently simplified behavior.

<a id="hr-23"></a>

## HR-23 — adjustable role/type presentation and temporary hiding

**Trace:** no layer row cites HR-23 yet — acceptance owed at [app](#trace-app).

Type(Routine/Event/Task), owner role(English teaching/Personal) and urgency are separate meanings. The founder now permits adjustable category/role styling, illustrated by a blue English-teaching outline plus a text label. The story direction differs from the older blanket category-color restriction and needs propagation at [app/DESIGN.md](../../../app/DESIGN.md); it does not erase urgency information or make one visual cue carry two contradictory meanings.

Offer the attended contextual hint that the owner can say “Temporarily hide my routines.” Apply a reversible display filter and show its active state/restore action. Hidden routines still occupy time and participate in every relevant rule; hiding is not deleting, cancelling, changing type or granting new availability. Show routines restores their view.

Role colors, border choices and display labels must not be a way to evade quotas, pricing, authority or scheduling rules. Define the underlying role/scope association independently of its styling. The main story restores the display filter in [S14](story-matt.md#s14); the cancelled17October occurrence remains cancelled. Later lesson-management scenes continue the same journey.

<a id="hr-24"></a>

## HR-24 — an owner-selected reminder addresses forgetting a lesson

**Trace:** [harness](#trace-harness) D28 → Step 5; owed at [app](#trace-app), [security](#trace-security).

**Scripted acceptance target:** [S07](story-matt.md#s07) elicits Matt's personal English reminder, with email fifteen minutes before as an editable example. Matt submits it and confirms recipient, verified destination, timing and scope. This is a worked owner choice, not a universal default. [S14a](story-matt.md#s14a) scripts successful receipt at16:15 for Kai's16:30 start.

Use the existing reminder home in [harness/SPEC.md](../../../harness/SPEC.md), “A kind may declare reminders”, and its reminder-notify Grant and clock-trigger/send path. App/SPEC.md's delivery outcome contract distinguishes “sent, delivered-failed, handed-to-owner”. There is no new native push or Messenger send integration in this scene. Record exactly the authorized recipient/scope; an owner reminder grants no student reminder permission. Template Save and explicit grant acceptance must have visible states and consistent activation; abandoning an unsaved setup must not leave a silently active reminder.

A reminder follows the saved booking's current start. Jasmine's accepted13:00→15:30 move changes her pending reminder12:45→15:15. A failed/unaccepted move leaves the old schedule. Cancellation, changed authorization and suppression must be checked before a due send; retry must not multiply sends. Existing grants and counters remain subject to their actual contracts.

The received-email sentence is a scripted successful fixture. Delivery is not guaranteed and provider acceptance is not evidence Matt read it. Separate tests exercise failure, revocation and stale clock firings. A general-purpose commercial notification is outside this reminder authorization. Choosing personal reminder settings and notification channel belongs to the app's user.

<a id="hr-25"></a>

## HR-25 — fill a booking's joining link without changing its template

**Trace:** [app](#trace-app) G10 → Step 5; owed at [harness](#trace-harness), [security](#trace-security).

**Scripted acceptance target:** [S13a](story-matt.md#s13a) fills Kai's confirmed lesson's Meeting link through its row's Edit action and console. Matt supplies an existing URL; the assistant does not manufacture a working meeting, call a provider or populate an example URL as real data. The selected booking/date and field scope appear in the proposal before OK.

A per-booking field edit is not a definition edit. It must not trigger Replace existing/Save as new, propagate Kai's link to Jasmine, or populate future template uses. The guest's valid booking-bound access may read that booking's intended joining link. Matt manually shares the existing lesson-page link through LINE after saving; the application must distinguish saved data from a delivered message. Expired/revoked/wrong-booking links still follow the applicable access policy.

Keep the reusable Meeting link blank as deliberately chosen in HR-09. A blank joining link is a missing operational detail; it is not automatically a failed booking. Required prerequisites and the user's preferred process need their own explicit configuration where applicable. This scene supplies the detail for Kai, without inventing a universal meeting-provider integration. Mark's and Georgina's lessons carry their Messenger link from entry ([S08](story-matt.md#s08), [S09](story-matt.md#s09)) — a per-use value Matt gave, not a template default.

<a id="hr-26"></a>

## HR-26 — record a reported end with its source

**Trace:** no layer row cites HR-26 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine).

**Scripted acceptance target:** [S14a](story-matt.md#s14a) continues the same authored journey to the scheduled lesson. Matt reports Kai's end at17:15 and confirms the named booking and date. Store the reported actual end with Matt's attribution using the existing commitment time/provenance contract, and derive any lifecycle display from that contract. The user-facing phrase Recorded end / Reported by Matt distinguishes the stored human report from the booked interval.

Neither opening Join lesson, time passing nor an email send proves attendance or actual teaching. Do not infer a no-show, payment, changed charge or fulfilled external promise from those signals. The worked end equals the scheduled end, so the existing45-minute duration stands unchanged. Different actual duration and commercial effects require the user's applicable terms, not a new global fee policy.

In [S14a](story-matt.md#s14a), Kai's October usage after reporting Thursday's end is two lessons/105minutes because Friday's lesson is already booked. [S17](story-matt.md#s17) is where a no-show is reported, as a human fact ([HR-37](#hr-37)). Reporting the end adds no third booking or extra minutes. It does not grant another slot by deleting the completed history. [HR-22](#hr-22) remains the home for the owed cancellation/no-show/month-boundary and aggregation-state contract. A user story can specify this one journey without claiming every lifecycle combination has been settled.

<a id="hr-27"></a>

## HR-27 — CRUD is a requirement for each managed object, with explicit effects

**Trace:** [model](#trace-model) N-14, R-12 → Step 3; owed at [harness](#trace-harness), [engine](#trace-engine), [security](#trace-security), [marketplace](#trace-marketplace).

**Founder direction:** Matt intentionally looks for create, read, edit and delete across everything the user can manage, and asks for a pass making this visible. The CRUD inventory in this companion inventories 26 object families and distinguishes actions actually performed in the story from required cases. This is not implemented coverage.

Resolve the actual target and actor before acting: optional value, field definition, unsaved draft, saved template, particular occurrence, series, contact, link, reminder or booking. Reuse the known scope rather than asking again. When “delete” is ambiguous, ask the user which object/scope they mean. The selected context and exact effect appear in the proposal. A cancelled confirmation/Keep action leaves the pre-action state; an accepted act must have a readable saved result and current dependent state.

Clearing a value leaves the field definition. Removing a field definition can affect future uses and dependent calculations. Neither automatically erases previously booked terms or person history. Derived values are read and changed through their supported inputs, not overwritten with arbitrary outputs. Optional custom rules may be removed; genuinely required inputs or governing constraints need an explicit valid resolution, not a universal owner bypass.

Check references and effects before removal. Name affected commitments, links, uses, pending reminders, formulas or counters that the actor may see. A user-specific cascade/replacement decision belongs to the app's user, not the founder or an unstated default. Revalidate at the write boundary; a stale dependency count must not authorize an unsafe action. Never claim a generic Delete button proves that every type or actor works.

**Product erasure scope remains unresolved:** [harness/SPEC.md](../../../harness/SPEC.md) retains “no tool deletes a record” and “the sole record is never destroyed”. [security/INTERFACES.md](../../../security/INTERFACES.md) already specifies selective vault erasure/crypto-shredding and the ops-runbook pathway; engine history is reconciled with that existing home. What remains owed is which broader owner/guest requests are exposed, affected keys/records, retention, and their user-visible consequences. No reply to the broader question or new record-destruction operation is inferred from this publication. See LEGAL-01 and the layer-debt map.

Cancellation is distinct from undo. Engine/SPEC.md's “rejects any write that clears a set latch” remains current. Recovering from a cancellation must use an explicitly specified allowed path, such as a newly validated replacement where supported; do not promise a generic Undo that silently clears an immutable cancellation. Permanent erasure, account closure and withdrawal of a reported fact need their own contracts.

<a id="hr-28"></a>

## HR-28 — concrete removal examples and their dependent state

**Trace:** [harness](#trace-harness) B1 → Step 4 · [engine](#trace-engine) M2 → Step 6; owed at [marketplace](#trace-marketplace).

**Scripted worked examples applying [HR-27](#hr-27):**

- [S05a](story-matt.md#s05a) cancels only Run onSaturday17October2026. Reserve05:50–07:00 is released for that occurrence; future materialization must not resurrect it. The rest of the Routine, includingMonday12October's Sarah exception, survives. The story offers but does not execute a future-series stop; its CRUD matrix cell remains Required.
- [S07](story-matt.md#s07) creates/edits/removes a Preparation note definition while authoring. It also asks the owner how pre-start cancellation affects the two configured monthly limits; [HR-22](#hr-22) owns the chosen meaning. Removing an optional row in an uncommitted draft does not require a new saved-template replacement decision.
- [S08a](story-matt.md#s08a) edits/reopens then clears a saved appointment's Notes value. The Notes field and its enclosing appointment survive, with date/time/place intact. Matt then restores “Have my documents ready” through a new attributed field edit; clearing history remains, and no cancellation latch is touched. Row definition and field value removal are separate operations.
- [S13b](story-matt.md#s13b) creates a separate saved45-minute template through Save as new, reads original and copy, then removes the unused copy and its empty use. The copy has no booked lessons/issued links. Do not silently copy party identity, live credentials or reminder Grants into a new template identity. Removing a referenced original has different required cases; the spare-copy example proves nothing about those dependencies.
- [S13b](story-matt.md#s13b) also creates/reads/renames/removes an owner Task with dueThu15October16:20. A due/deadline field is not a newly invented fixed-duration reservation. Removing this selected preparation task must not affect Kai's independent lesson or reminder. Completion remains a distinct operation, not a synonym for deletion.
- [S16](story-matt.md#s16) cancels one occurrence of Georgina's standing series; the series, its later lessons and the package survive, and no credit is created.
- [S14b](story-matt.md#s14b) creates further Jasmine requests/uses and new scoped links after her Friday lesson. Saturday17October10:00–10:45 is booked, moved to10:15–11:00 at the same45minutes/1125, and cancelled before start. Scope is that credential's own booking; owner is informed through the existing booking-management contract rather than impersonated as the cancelling actor. Atomic move preserves one record/count; cancelled old interval10:10–11:05 is released and pending reminder10:00 is stopped. Her earlier lessons stay recorded. The Keep booking action cancels the proposal, not the lesson.

Link retirement, contact/student deletion, full Routine stop, permission withdrawal and account erasure are independently listed in the coverage map. Their mere mention is not a completed narrative or runtime test. No third-party send, account change, deletion or calendar write occurred while authoring this document.

<a id="hr-29"></a>

## HR-29 — console-led Contacts filtering and automatic student persistence

**Trace:** [harness](#trace-harness) B2, H6 → Steps 2, 4 · [app](#trace-app) C5, V1 → Steps 2, 7; owed at [engine](#trace-engine), [model](#trace-model), [security](#trace-security).

[S08](story-matt.md#s08) saves Mark as a Student contact during his use; [S09](story-matt.md#s09) and [S10](story-matt.md#s10) do the same for Georgina, Kai and Jasmine, and later requests in [S13g](story-matt.md#s13g) and [S14b](story-matt.md#s14b) select the existing entry through the console. Each successful add automatically persists a reusable Student contact and reports that saved state. No additional save-contact permission question. Four students yield exactly four distinct identities.

The Students filter is a view of Contacts based on the declared relationship, not a separate duplicate database. Ambiguous matches earn an in-console selection; unique resolved records are reused. Correcting a handle changes that contact, not the student's identity or allowance. A retry must recover the prior successful add; partially missing details or failed persistence cannot be reported as Saved.

Ordinary direct browsing remains an option, but the main story keeps person selection in the console. Names/contact values in the template's reusable definition remain blank unless explicitly requested at that scope. The group-draft half of this cue belonged to a scene FD-106 retired and is story-owed.

<a id="hr-30"></a>

## HR-30 — reusable group, scoped shared request and offline agreement (retired)

**Trace:** [harness](#trace-harness) D18, H6 → Steps 2, 3 · [engine](#trace-engine) A1 → Step 5 · [app](#trace-app) G4 → Step 5 · [model](#trace-model) N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3 · [security](#trace-security) R4 → Step 6.

**Retired (FD-106).** Carried only by the retired group scenes S13d and S14c. The reusable-group, scoped shared-request and reported-offline-agreement law stands at its homes — `engine/SPEC.md` §§1.7/6, `harness/SPEC.md` §3.6, engine A1's shared-request arms and harness D18/D24/H4 — and is story-owed. The ID stays defined so the HR series runs contiguously, and is never reused.

<a id="hr-31"></a>

## HR-31 — same-slot race and unsupported acts

**Trace:** [model](#trace-model) J-08, N-08, A-14, R-14, J-01, Q-05, S-07, N-11, N-12, A-01, N-13, J-04, N-17, N-18, A-13, R-13, J-06, Q-04, S-05, S-06 → Step 3; owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [security](#trace-security).

[S13g](story-matt.md#s13g) races Kai's and Jasmine's separate one-on-one online requests for Friday16October14:00–15:00, the same teacher interval. Jasmine confirms first; Kai's commit refuses without usage or partial writes, and his newly selected16:00–17:00 is separately revalidated/confirmed. Teacher reservations13:55–15:05and15:55–17:05are disjoint, and neither page names the other student. Friday's gym task holds no time and blocks neither booking. A student's taxi journey is not a teacher travel reservation or proof of the student's presence.

[S13f](story-matt.md#s13f) refuses taxi dispatch and payment collection as unavailable capabilities; a Task for Matt to arrange transport and attributed money records are supported alternatives. No outside dispatch, charge, bank confirmation or private pickup-data collection is implied. A guest pricing-rule edit is a different refusal based on actor authority; duration72minutes is a different refusal based on the owner's configured rule. Temporary unavailable information must be described as such, never reported as verified free time or permanent impossibility.

A release/version answer must come from an authoritative current product-information source actually available to the assistant. No payment release version is supplied; the current story says it has no confirmed version. The example2.35 is not a commitment. Preserve repository AGENTS.md's readiness/no-schedule-promises rule and [harness/SPEC.md](../../../harness/SPEC.md)'s Money—records,never moved contract. Source freshness and actual account capability require tests before a future release-aware response is claimed reliable.

<a id="hr-32"></a>

## HR-32 — group edits, attribution and the October fixture (retired)

**Trace:** [harness](#trace-harness) D18 → Step 3 · [engine](#trace-engine) A1, A4 → Step 5 · [model](#trace-model) N-19, J-06 → Step 3; owed at [app](#trace-app), [security](#trace-security).

**Retired (FD-106).** Carried only by the retired group scenes S14c and S14d and the group October fixture. The rebuilt [ledger](#october-ledger) holds the story's accumulated state; participant-change, attribution and one-shared-payment law stands at its homes and is story-owed. The ID stays defined so the HR series runs contiguously, and is never reused.

<a id="hr-33"></a>

## HR-33 — future member accounts and shared availability

**Trace:** [harness](#trace-harness) D18, H6 → Steps 2, 3 · [app](#trace-app) G10 → Step 5 · [model](#trace-model) J-07 → Step 3; owed at [engine](#trace-engine), [security](#trace-security).

[S14e](story-matt.md#s14e) is explicitly the later capability path. Each student links to the correct existing contact identity through verification, preserving bookings and quotas. Students choose availability sharing and its audience/detail; account creation alone grants none. Use only permitted availability to propose a teacher/student opening; one student's shared availability plays no part in another's proposal. Unknown/unshared information remains unknown. A proposal still needs that student's agreement and final availability validation.

The future account-sharing path is not automatic third-party calendar import, an implemented integration, or a dated release promise. The current guest path still runs on what students tell Matt and choose on their own pages. Calendar details, credentials and wider personal history remain outside a mere shared free/busy view.

<a id="hr-34"></a>

## HR-34 — a standing slot is an owner-enabled option that makes a series

**Trace:** no layer row cites HR-34 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [marketplace](#trace-marketplace).

[S07](story-matt.md#s07) asks whether a lesson may repeat on a standing weekly slot, and Matt switches it on. [S08](story-matt.md#s08) and [S09](story-matt.md#s09) then enter Mark's Thursday and Georgina's Monday-and-Thursday series. Each week's lesson is its own booking as its date comes, carrying the series' terms; a skipped date stays listed as skipped, never deleted; one occurrence can be cancelled without ending the series ([S16](story-matt.md#s16), [HR-28](#hr-28)). The option is template configuration, not a global default, and switching it off does not rewrite series already entered.

Map the series onto the existing recurring-commitment home — a Routine's dated occurrences, [HR-01](#hr-01) — rather than a lesson-only mechanism. The stored shape of a booking series, its materialization horizon and how a renewal takes forward terms ([S20](story-matt.md#s20)) are owed at the engine home.

<a id="hr-35"></a>

## HR-35 — a monthly package: attendance, and the fifth lesson day (parked)

**Trace:** no layer row cites HR-35 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model).

Matt's price list offers two packages — **Standing lessons**, NT$4,000 a month for a weekly standing slot, and **Link students**, NT$2,000 a month for up to 4 lessons and 4 hours. [S07](story-matt.md#s07) elicits and stores the one rule a package has to settle: attendance never changes a package bill. [S17](story-matt.md#s17) applies it to Mark's no-show, and [S16](story-matt.md#s16) cancels an occurrence with the package unchanged.

A package student is outside the count and time limits of [HR-22](#hr-22); a link student's package hours are its own terms.

**Retired 2026-09-15 — parked (`parked-beats.md`).** The fifth-lesson-day rule (skip by default, add on request at the package rate), the owner's own who-owes-me-what ledger, recording a reported bank transfer and its payment reminder, and an in-package rebook's stored shape were carried only by beats Matt's story no longer tells. Their law stays story-owed at the layer rows this row names. The open engine questions previously recorded here — FD-107 (i) and (ii) — are parked with the beats they answered.

<a id="hr-36"></a>

## HR-36 — annnä writes the message; the owner pastes it

**Trace:** no layer row cites HR-36 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app), [model](#trace-model), [security](#trace-security).

Messages to students in this story — Georgina's cancellation with its rebook link ([S16](story-matt.md#s16)) and Jasmine's offer ([S21](story-matt.md#s21)) — are written by annnä and copied by Matt into Messenger or Instagram himself. The proposal names what it will write; Copy message is the only act. No send grant, delivery state, read receipt or suppression is used or shown, because nothing was delivered (`user-stories/README.md` named gap 1 keeps the depicted-send distinction).

Written text carries only that student's own lesson and link, never another student's data or a private reason. A pasted message is not evidence the student read it, and declining the offer writes nothing.

<a id="hr-37"></a>

## HR-37 — a no-show rule the user has not set is asked once, then kept (retired 2026-09-15 — parked)

**Trace:** no layer row cites HR-37 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model).

A no-show is a human report, never inferred from a missed join or time passing ([HR-26](#hr-26)). For a package, the stored attendance rule answers it without a question ([S17](story-matt.md#s17), Mark).

**Retired 2026-09-15 — parked (`parked-beats.md`).** This cue existed only for the per-lesson no-show rule; Matt's story no longer tells a per-lesson no-show beat — his only students without a package pay the link package, and a link student's no-show carries no separate stored rule. The law this cue named stays story-owed at the layer rows above; the ID is kept so the HR series runs contiguously and is never reused.

<a id="hr-38"></a>

## HR-38 — the read-back is the check on a valid wrong hearing

**Trace:** no layer row cites HR-38 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app), [model](#trace-model).

“Move tomorrow's run to half past six” has two readings whose stored effects differ. Neither breaks a rule and Saturday evening is free, so no validation can catch the wrong one. [S19](story-matt.md#s19) reads back 18:30–19:15 with its held interval before writing anything. Matt's Edit and “No — morning. 06:30” produce a fresh proposal; only the accepted 06:30–07:15 is written, to that one occurrence. The rejected reading moved no card, held no time and changed no guest page.

annnä may propose a defensible reading, but the read-back shows the resolved clock time, date and scope, never the ambiguous phrase alone, and an old OK cannot accept the corrected proposal ([HR-06](#hr-06)).

<a id="hr-39"></a>

## HR-39 — the month turns on its own

**Trace:** no layer row cites HR-39 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app).

On the first of the month [S20](story-matt.md#s20) shows no act by the owner. October closes with its entries as recorded. The link-student count and time limits stand full for November, counted by lesson month, and a lesson booked earlier for November counts from the start: Kai's 5 November is his 1 of 4. Jasmine's October refusal told her to choose another month, and an ordinary November booking honours it. Package series continue on the terms the owner chose ([HR-35](#hr-35)), and history stays readable and uneditable; the owner's own history query is parked (`parked-beats.md`).

The boundary is Matt's Asia/Taipei calendar. The reset is derived from lesson months, not a scheduled rewrite of October.

<a id="hr-40"></a>

## HR-40 — the board at rest, and what wakes it

**Trace:** no layer row cites HR-40 yet — acceptance owed at [harness](#trace-harness), [app](#trace-app).

[S21](story-matt.md#s21)'s full Thursday is shown at rest at the level of detail Matt set: nothing flashes, counts down or asks to be sorted. A booking that arrives while he looks writes its ordinary note and sits inside the wake scope he set until his tap opens it; nothing wakes on its own. This is the rest state `PRD.md` RQ-10–11 and `app/DESIGN.md` specify; RQ-12's skin measurement stays owed (`user-stories/README.md` register entry 4). Rendering the rest state makes no model call.

<a id="hr-41"></a>

## HR-41 — an overnight run parks at its budget and says so

**Trace:** no layer row cites HR-41 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model).

The unattended run on Jasmine's 02:40 request reaches the step-and-spend ceiling every unattended firing carries before it has an answer. It parks: no message, no half-move, and her Friday lesson stands. The parked card names the budget as the reason and lays out the request's two edges — 4 of 4 lessons, and Monday lessons start at 15:00. Only a human clears the park. The per-firing budget is `harness/SPEC.md` §4's fourth termination condition (`user-stories/README.md` register entry 6).

**Open question, recorded (FD-106; answer proposed at FD-107 (iv), 2026-09-15):** the card proposes an owner offer, “Offer her Monday, 30 November, 15:30–16:30?”. An owner-approved offer from a parked card, with the guest still moving her own lesson, is a composition no home specifies yet.

<a id="hr-42"></a>

## HR-42 — a Task with a window and a repeat

**Trace:** no layer row cites HR-42 yet — acceptance owed at [harness](#trace-harness), [engine](#trace-engine), [app](#trace-app), [model](#trace-model).

[S03a](story-matt.md#s03a)'s gym is a repeating Task: two instances on every Monday, Wednesday and Friday, with the windows “before noon” and “in the afternoon”, no clock time, each marked Done or Skip, and a record that counts both. It holds no time — lessons book over it ([S13g](story-matt.md#s13g), [S14b](story-matt.md#s14b)) and availability ignores it. Meals are logged after the fact and a fast is a note ([MT-93](#mt-93)); neither is a Task or a Routine. “No set time, and I skip it a lot” earns a Task proposal, not the routine question of [HR-01](#hr-01).

**Open engine question, recorded and not solved (FD-106):** the engine's Task carries a due time ([S13b](story-matt.md#s13b)'s camera task). A Task carrying a window and a repeat, with done/skip state per instance, has no stored shape yet.

<a id="legal-01"></a>

## LEGAL-01 — Trial terms, privacy notices and lawful commercial data use

**Status:** needs-research. Preserved investigation ticket; needs-research, not legal clearance. Its dated bibliography below is transferred source material, not freshly verified legal guidance.

**Requested outcome:** Specify the broadest lawful, clearly disclosed data collection and monetization model for annnä's invite-only trial, and the actual notices, choices and controls required before account creation and subsequent collection. Produce a jurisdiction-aware implementation and legal-review package, not a generic “we comply with all laws” statement.

**Owner:** research/planning agent prepares the evidence and design; qualified legal reviewers validate applicable jurisdictions and launch terms before use. The founder chooses the lawful business options and tradeoffs. No policy is approved merely by closing a research document.

### Founder direction

The founder wants the least restrictive lawful terms for the business, maximum lawful collection/use for profit, and direct disclosure where required. He expressly asks about worldwide minimums, Taiwan, Thailand, the United States, and whether location changes the terms shown. This is a request to determine the legal boundary, not to evade it.

Story reference: [story-matt.md](story-matt.md) [S01](story-matt.md#s01)–[S02](story-matt.md#s02) and S11. The trial is invite-only. Its access price is not described. Signing a contract, receiving a privacy notice, and giving a purpose-specific consent must be investigated as distinct acts.

### Preliminary source check — 2026-09-08

This is a starting bibliography and bounded issue identification. No worldwide, Thai or full US legal survey has been completed.

- **Taiwan:** the official English PDPA text identifies rights that cannot be waived in advance by contract (Article3), ties collection/use to necessary scope and specified purposes (Article5), and lists notice requirements (Article8). Articles19/20 address bases and purposes for private-sector handling. These provisions rule out assuming that a broadly worded acceptance alone supplies unlimited rights. The page includes November2025 amendments with a commencement note; the research must verify effective provisions and regulations at the trial date. [Official PDPA text](https://law.pdpc.gov.tw/EngLawContent.aspx?id=5&lan=E).
- **United States, California example only:** the Attorney General explains notice-at-collection and sale/sharing opt-out duties for covered businesses, sensitive-information rights, and applicability thresholds. Determine coverage before applying those duties to this trial; California is not a complete US analysis. [California Attorney General — CCPA](https://oag.ca.gov/privacy/ccpa).
- **Thailand:** an official MDES English-translation page was located, but retrieval failed in this pass. Obtain the actual operative Thai PDPA, regulations and guidance before drawing a Thai conclusion. Investigate territorial scope, consent, necessity/purpose, notices, special categories and cross-border rules. [MDES translation page to retrieve](https://www.mdes.go.th/law/detail/3577-Personal-Data-Protection-Act-B-E--2562--2019-).
- **Curated context checked first:** no matching annnä-vault legal notes were found in the bounded search. NotebookLM's Risk Neutral — Strategy notebook, Business Model.md source7a8a4575-c217-430c-bd2f-2ae8d12cc05e, describes aggregated/anonymized insight licensing. That older commercial strategy is background, not legal advice, and the founder's new request is broader.

### Work to perform

1. **Determine applicability before drafting clauses.** Establish the operating legal entity, establishment, countries/states where services are offered, owners' and guests' relevant residence/location, data-subject categories and any monitoring activities. Explain which facts matter under each law. Test a Taiwan resident travelling in Thailand, a Thai user of a foreign operator, and relevant US-state residents. Do not treat IP address, citizenship, UI language or a governing-law clause as a universal substitute for this analysis.
2. **Define the data operations precisely.** Inventory account identifiers, invite/security logs, console instructions and model context, commitments, student contacts, locations/travel, booking and payment records, support, analytics, cookies/device identifiers, backups and derived profiles. Identify controller/processor roles and who supplies data about another person. Include when collection begins on the landing page, before the signup checkbox exists.
3. **Specify monetization alternatives.** Evaluate separately operational analytics, advertising, targeted advertising, model training, aggregated/deidentified licensing and identifiable-data sale or licensing. The founder has not individually authorized all these operations. For each proposed operation identify its data, purpose, recipients, retention, legal basis, permitted jurisdiction, required controls and residual restriction. Distinguish personal data, pseudonymous data and data that meets a jurisdiction's actual anonymization standard.
4. **Investigate rights that terms cannot remove.** Address consent validity, optional versus necessary processing, withdrawal, objections/opt-outs, correction/deletion/access, sensitive data, purpose/necessity limits, cross-border transfers, security and breach obligations. Identify any purpose that is prohibited or commercially impractical despite transparency. Avoid treating “profit” as a sufficiently specific purpose by itself.
5. **Cover owners AND students/guests.** Matt's signup is not automatically consent from his students. Determine obligations when an owner enters a student's information, when the student opens a link, and when a minor uses the service. Research applicable child/privacy and sector-specific obligations without assuming the audience is adult. Preserve the accountless guest journey where lawful.
6. **Separate the documents and controls.** Terms of service, trial conditions, privacy policy, just-in-time collection notices, cookie/tracking choices, purpose-specific consent and data-processing terms can have different jobs. Recommend a common core plus jurisdiction-specific additions only if supported, with evidence for differences. Explain what is legally mandatory, a platform requirement or a business choice.
7. **Translate the result into observable signup and runtime behavior.** Show notice placement before relevant collection; plain-purpose wording; consent/control presentation; decline/withdrawal consequences; versioned receipts; account/guest rights tools; and enforcement across downstream recipients, model providers, logs and backups. Reading text and scrolling to the bottom do not prove comprehension or valid consent by themselves.
8. **Map compatibility with the present corpus.** Identify every existing privacy, retention, erasure, provider-custody and marketing statement that would need an authorized change. Maintain protections until their lawful replacements are approved and implemented. A new notice cannot make contradictory actual behavior truthful.

### Required outputs and acceptance

- A dated applicability matrix for Taiwan, Thailand and the United States, plus a clearly bounded “other markets” policy. List which countries remain unresearched rather than claiming worldwide clearance.
- Primary sources, operative dates, translations/status, relevant clauses and confidence/limitations for every material conclusion.
- A purpose-by-data-by-recipient matrix classifying each proposed commercial operation as allowed with named conditions, requires a decision, prohibited, or unresolved.
- Proposed terms/privacy/consent materials and the matching interface/data-enforcement requirements. Drafts must state their review status.
- Tests for changed jurisdiction, invitation-only entry, optional-purpose refusal, withdrawal, changed notice versions, guest data supplied by an owner, minors/sensitive data, and downstream compliance with changed choices.
- A founder decision list limited to real business/legal tradeoffs, with recommendations and consequences; no checklist that asks the founder to perform source research.
- A legal-review/launch checklist naming the remaining professional sign-offs and operational evidence. Research completion alone does not mark the story's compliance condition passed.

**Completion test:** a reviewer can tell exactly what data operation is proposed, under which applicable law/basis, what the person sees and chooses, what the system enforces, and what evidence permits it to go live. No unrestricted-collection assumption is hidden in a catch-all clause.

### Scope boundary

This ticket commissions investigation and a reviewable design. It does not publish terms, collect new production data, integrate advertising/tracking SDKs, sell data, change the repository's security law or enroll real users in a trial.


### Current onboarding scope to include

Preferences and optional Home are now entered BEFORE account creation. Investigate notice/consent, temporary draft storage, abandonment/expiry, geocoding/map-provider disclosures and final binding of preferences/acceptance receipts to the verified account. Include nicknamed third-party locations such as Sarah's house and route queries; a country/timezone/language preference does not by itself decide the applicable law. Skin previews and use-profile selections may also generate pre-account analytics if proposed; their collection must be explicitly inventoried rather than assumed outside privacy law.


### Additional current guest-surface scope

The founder now requests a template-bound student console on the guest website. Inventory guest utterances, model/provider processing, logging/retention and the notices/choices required before that input is used. Determine operator/owner/processor roles and handling of students/minors without assuming the owner's account acceptance covers every guest. This is a newly proposed data/input surface, not completed legal clearance.

<a id="additional-cases"></a>

## Additional bounded reconciliation cases

| ID | Trigger | Required observable outcome | Limit / reason |
|---|---|---|---|
| XR-01 | <a id="xr-01"></a> After [S11](story-matt.md#s11) confirmation, select Tokyo display, reload, then return to Taipei; separately change an owner schedule zone. | Thursday 15 October 16:30–17:15 Taipei = 17:30–18:15 Tokyo at the same instant, duration and quote. Matt’s reminder stays 16:15 Taipei. Return affects subsequent display, not stored instants. | [MT-75](#mt-75) covers general settings; this adds the exact guest readback and prevents interpreting prior typed times in another zone. Persistence/default policy is user-visible, not inferred from a device. |
| XR-02 | <a id="xr-02"></a> Clear the appointment note, then submit its old text as a new edit; repeat with stale selection and lost acknowledgement. | Proposal names exact appointment/Notes and empty-to-text change. Authorized save restores that field only, with attribution and no duplicate edit on retry; conflict or unknown outcome is resolved before claiming success. | Earlier clearing stays recorded under its history contract. [MT-68](#mt-68) supplies value CRUD; this does not clear a cancellation latch or promise general Undo. |
| XR-03 | <a id="xr-03"></a> **Retired (FD-106).** A group participant disagrees outside the app with a coordinator's reported time — carried only by the retired group scenes. | No Matt scene carries it; objection intake, coordinator revocation and post-confirmation dispute stay owed contracts of the law FD-106 kept. | No longer a supplemental obligation (`user-stories/README.md` item 5); the ID is never reused. |
| XR-04 | <a id="xr-04"></a> Open a forwarded Kai link, a bare entry link without booking, a per-recipient request, a confirmed manage link, then expired/revoked/cancelled variants. | Bound scopes expose only permitted request/own-booking data and operations. Invalid/expired/revoked credentials fail generically without side effects. Cancellation retains a record; what valid access can still read follows its contract. A new request needs its own authority. | Bearer possession alone cannot prove the opener is Kai. Test actual binding and reauthentication requirements at the security home; do not promise that all forwarding is rejected or all cancelled links expire. |

The review also considered no-show handling, owner cancellation, account closure, erasure, task-band visibility and amounts owed. No-show is now scripted at [S17](story-matt.md#s17) and owner cancellation at [S16](story-matt.md#s16); their rule and record contracts stay owed under [HR-22](#hr-22)/26/37, [MT-65](#mt-65)/80/89/98/100/101 and [CRUD-16](#crud-16)/MT-78; erasure under LEGAL-01/security debt; task-band rendering under app debt/MT-71. The owed-money record is now scripted at [S15](story-matt.md#s15) and [S16](story-matt.md#s16) and still needs its tests. None is declared complete by mentioning it here.

<a id="october-ledger"></a>

## October and November ledger

**Parked 2026-09-15.** LED-01–40 tracked money — per-lesson quotes, package totals and reported transfers — that Matt's story no longer tells; they stay defined as retired rows, never reused, with their law held at `parked-beats.md`. The count/time arithmetic that remains is stated inline where it happens: each link student's running count and minutes at [S14b](story-matt.md#s14b), and the full-story totals at [S20](story-matt.md#s20) and [S21](story-matt.md#s21) — 4 of 4 lessons, 240 of 240 minutes per link student. Package months carry no count or minute limit; their bill is the package ([S15](story-matt.md#s15)).

<a id="quote-matrix"></a>

## Quote matrix — one price for the lesson

**FD-106.** The two-to-four-student tier in QUOTE-05–16 was carried by the retired group scenes; `engine/BUILD.md` keeps QUOTE-01–16 unchanged as calculation controls, so the rows stand, story-owed. Matt's story no longer quotes a per-lesson rate — his students pay one of two monthly packages (`parked-beats.md`) — so no story-specific row is added here. One student uses TWD 1500/hour; two, three or four students booked use TWD 2000/hour total. Multiply the hourly rate by duration/60, never by the participant count. The booked roster selects the quote tier. Actual attendance is a separate attributed fact and does not overwrite the agreed quote. Explicitly agreed commercial changes still need the bound-quote version/replacement contract named in layer debt.

| ID | Student count | Duration minutes | Hourly rate TWD | Total TWD |
|---|---|---|---|---|
| QUOTE-01 | 1 | 30 | 1500 | 750 |
| QUOTE-02 | 1 | 45 | 1500 | 1125 |
| QUOTE-03 | 1 | 60 | 1500 | 1500 |
| QUOTE-04 | 1 | 120 | 1500 | 3000 |
| QUOTE-05 | 2 | 30 | 2000 | 1000 |
| QUOTE-06 | 2 | 45 | 2000 | 1500 |
| QUOTE-07 | 2 | 60 | 2000 | 2000 |
| QUOTE-08 | 2 | 120 | 2000 | 4000 |
| QUOTE-09 | 3 | 30 | 2000 | 1000 |
| QUOTE-10 | 3 | 45 | 2000 | 1500 |
| QUOTE-11 | 3 | 60 | 2000 | 2000 |
| QUOTE-12 | 3 | 120 | 2000 | 4000 |
| QUOTE-13 | 4 | 30 | 2000 | 1000 |
| QUOTE-14 | 4 | 45 | 2000 | 1500 |
| QUOTE-15 | 4 | 60 | 2000 | 2000 |
| QUOTE-16 | 4 | 120 | 2000 | 4000 |
