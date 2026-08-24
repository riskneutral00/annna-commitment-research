# annnä — TDD (the testing strategy)

*If you are an agent handed this file: this is **how annnä is tested** — which kind of test each part gets, why, and in what order. The test **criteria** already exist (each layer's `SCENARIOS.md` / `EVALS.md`); this file never invents new criteria. It classifies and sequences what those files already state, so a builder knows exactly what kind of tests to write.*

*This was eight files under `TDD/` until 2026-08-08. It is one file because it is entered whole — by someone asking "how is this tested?" — and never per-layer: no layer's `BUILD.md` ever pointed a builder at its own page. Section citations of the form `TDD.md §The swap sequence` resolve here unchanged.*

---

## The kinds of testing, in plain words

There are many named testing styles; annnä uses five. One line each:

- **Unit test** — feed one small function an input, check the output. Fast, thousands of them. *(Engine: "given these bookings, is 3pm free?")*
- **Property test** — instead of one example, state a rule that must hold for **all** inputs, and let the test tool generate hundreds of random cases trying to break it. *(Engine: "no write, ever, can clear a latch.")*
- **Behavioral test** — set up a situation, perform an action, check what the *system did* — Given / When / Then. Tests a whole loop of behavior, not one function. *(Harness: "given a stored buffer rule, when the owner books again, then the agent does not re-ask.")*
- **End-to-end (e2e) test** — drive the real app in a real browser like a user would, click by click. Slow and few — reserved for the stories that matter most. *(App: Sofia's link flow.)*
- **Eval** — for the model only. Not pass/fail: a set of graded items with a **threshold** ("≥95% of utterances normalized correctly"). Models are statistical, so their tests are too.

**Is TDD the right way?** Yes — but TDD is the **method**, not a kind of test. TDD means: write the failing test *first*, then write code until it passes. Any of the five kinds above can be written TDD-style. annnä uses TDD as the method everywhere, with a different kind of test per layer (next section).

## The strategy, per part

| Part | Kind of test | Details |
|---|---|---|
| **Engine** | Unit + property tests | §Engine |
| **Harness** | Behavioral tests on stubs | §Harness |
| **App** | Component/wire tests + a few e2e | §App |
| **Model** | Evals (graded, thresholds) | §Model |
| **All together** | Swap tests + two story walkthroughs | §Integration |
| **Security** | Unit + property + behavioral + wire tests, riding each layer's build | §Security |
| **Marketplace** | Unit + behavioral tests against the mock, reusing app's component/wire tiers, one integration run | §Marketplace |
| **Deployment** | Process gates: `[MUST]` = a named mechanized check, `[DRILL]` = a rehearsal run once and recorded | §Deployment |

## The hierarchy (what derives from what)

```
user-stories/          real life — the falsification probes every scenario answers to
                       (the requirements register is PRD.md's RQ series — FD-35)
   ↓
<layer>/SCENARIOS.md   each layer's pass/fail criteria  (model: EVALS.md, graded)
   ↓
TDD.md                 this file — what KIND of test each criterion becomes
   ↓
executable tests       written during each layer's build, living with that layer's code
```

The tests are not written yet — they are written **during each build**, and this is by design (the law below). This file also owns the naming convention: every executable test carries its scenario ID (e.g. `harness C2`, `engine B1`, `app G1`) so any red test traces straight back to the criterion it enforces.

## The pyramid (how many of each)

Many fast engine unit/property tests at the bottom · the full harness behavioral suite in the middle (deterministic, because every neighbor is a scripted stub) · a **few** app e2e browser tests at the top (slow, so only the canonical stories) · model evals **off to the side** — graded and statistical, never mixed into the pass/fail suites.

## The law

1. **Tests first.** Every layer's `BUILD.md` step already names its gating scenarios. The build discipline is: turn that step's scenarios into failing executable tests, **then** implement until green. Never the reverse; never delete a red test to pass a step.
2. **The swap is the exam.** A layer is done only when the real thing replaces its stub and every suite that ran against the stub runs green **unchanged** (§Integration).
3. **HELD-OUT stays held out.** Scenarios marked `[HELD-OUT]` (harness J-family) are run and their results **recorded** — the design is never patched to make them pass. They measure generality, they don't gate it.
4. **Visual law is a checklist, not a test.** The app's design law (`app/DESIGN.md`) gates build steps by human review — pixels are judged, not asserted (§App).

## Read order

This page → the section for the layer you're building → that layer's `SCENARIOS.md`/`EVALS.md` → its `BUILD.md`. Before any stub-swap: §Integration.

---

## Engine — classic TDD: unit + property tests

*Criteria: [`engine/SCENARIOS.md`](engine/SCENARIOS.md) (every item MUST). Build order: [`engine/BUILD.md`](engine/BUILD.md).*

The engine is deterministic math over a store — the same inputs always give the same outputs. That makes it the perfect target for the classic red-green loop: write the failing test, implement, green, next.

### The engine's three tiers

1. **Unit tests** — the bulk. Each scenario becomes one or more direct tests: set up store state, call the operation, assert the result. No mocks of the engine's own parts — the engine is tested whole, against its own real store logic.
2. **Property tests** — the invariants that must hold for *all* inputs, not just the scenario's example. Generate hundreds of random cases against each *(two restated 2026-08-21 — as first written, one was false against the spec and one was not a property test at all)*:
   - **Latches never clear** (B3): no sequence of writes leaves a set latch nulled.
   - **Commit is atomic** (A2): after any failed commit, the store is byte-identical to before it **except the write-id ledger entry** (`engine/SPEC.md §6.6` records failed commits so their replay is deterministic) — and the property is true only because commit never fetches (`§6.1`, so no cache fact is written mid-transaction); cite both when the test is written.
   - **No mutable balance (K1) — re-filed as a structural check, not a property test**: "no write path stores a running balance" is a claim about the store's schema and entry-point set, with no input to generate and no per-case oracle — it is the D9/N2 absence-asserted-structurally pattern (a schema walk), and calling it a property test handed the builder an unexecutable instruction. The *derivability* half (every owed figure recomputes from the record) stays testable per scenario.
   - **Exactly one winner** (A1): N racing commits for one unit → exactly one success, N−1 structured conflicts.
3. **The scenario suite** — every `SCENARIOS.md` item (families **A** races · **B** latches · **Q** quota · **T** travel/buffers · **M** recurrence · **P** resolve/projections · **X** reshuffle · **K** money · **S** shared projection · **G** consistency · **I** the cross-owner share · **W** multi-day decomposition + course templates · **V** the travel envelope · **O** minimum occupancy · **Y** typed values (§2 — instant resolution, Y1–Y2; *the family this map omitted entirely until 2026-08-21*) · **Z** swap) as a named executable test, ID in the test name. *(`W`, not `D`, for multi-day — the harness's D-family is the floor, and two D-series across the two suites would be unreadable.)*

### Determinism harness

- **Virtual clock** — no test ever sleeps or reads real time; expiry (B1), quota windows (Q3), and horizon math (M4) run on an injected clock.
- **Scripted travel provider** (T1–T3) — the stub from `engine/INTERFACES.md §4`; the `unavailable` case (T3, fail-closed) is a first-class test, not an afterthought.
- **Replayability** — any failing case must be re-runnable from its recorded inputs alone.

**Done when.** All scenario tests + property suites green, then the **swap** (§Integration): the real engine replaces the harness's engine stubs and the full harness suite — including P1, the compaction pass-through, **and P2, the pending-decision round-trip** — runs green with zero harness changes (engine Z1–Z2).

---

## Harness — behavioral tests on stubs

*Criteria: [`harness/SCENARIOS.md`](harness/SCENARIOS.md). Stubs: [`harness/INTERFACES.md`](harness/INTERFACES.md). Build order: [`harness/BUILD.md`](harness/BUILD.md).*

The harness is a loop of behavior — utterance in, decisions, tool calls, verification — not a pile of functions. So its tests are **behavioral**: Given a situation / When something happens / Then the harness did the right thing. The scenarios are already written in exactly this form; the build turns each into an executable test, one to one.

### Why it's deterministic anyway

Behavioral tests are usually flaky because of live dependencies. Here every neighbor is a **scripted stub**:

- **Model stub** — returns pre-written `normalize`/`narrate` outputs per test, **and `summarize`** (the quarantine read, [`harness/INTERFACES.md §2.4`](harness/INTERFACES.md)): a scripted `{summary, labels[]}` per quarantined input, **plus a failure fixture** — a scenario key that fails on every attempt including the fallback, so **L7**'s fail-closed path is reachable rather than vacuously green. Four scripted calls, not three; the stub's normative shape is [`harness/INTERFACES.md §5`](harness/INTERFACES.md) and [`harness/BUILD.md`](harness/BUILD.md) Step 0. No real model, no randomness, no cost. (The real model is tested separately, by evals — §Model.)
- **Engine stubs** — canned handles, scripted verdicts (the capacity check, the latch check), and canned `resolve` proposals: a placement, a compaction Proposal, an **offered share**, or a decline, all through the one signature.
- **A steppable virtual clock** — the fourth stub, and the one the determinism claim below actually rests on. Hold and offer expiry (C8), parks, and the escalation ladder's rung timeouts (D12–D17) all advance because a test **steps** the clock. Nothing sleeps; no test waits on wall time.
- **App stubs** — record-and-return **spies**: they capture every call (what was rendered, what was sent, to whom, on what basis) so tests assert on the recording.

Same inputs → same run, every time. L2 pins this as a criterion: the same trigger fired twice assembles an identical context.

### What the assertions look like

- **Writes, not words** (A, B, G families): the test inspects what was *written* through the seam — a Rule with the right shape, an edit not a duplicate — never the chat text.
- **The floor as a spy assertion** (D family): the outward-act spy proves `send` fired only with a basis, every act carrying `{who, basis, when}` (D6), and never at all in the no-grant cases (D1, D3, D4).
- **Refusals surfaced, not swallowed** (A4, B5, E family): the stub's `conflict`/`refuse` verdict must reach the surface.
- **Absence asserted structurally** (D9, N2): no tool in the contract declares the `destruction` or `value-transfer` class — a walk of the contract, not a runtime check.
- **Composition pinned** (P1, P2): the compaction pass-through and the pending-decision round-trip each assert at the end that no tool beyond the §5 contract was called and the harness needed no change.
- **The floor as a property** (D20): the D-family spies prove the floor case by case; **one property-based test** raises them to an invariant — *no outward act ever occurs without a matching basis, under any tool-call sequence*. The library is **`fast-check`** — the TypeScript-native property-based framework, added as the harness's one non-scaffolding dependency at [`harness/BUILD.md`](harness/BUILD.md) Step 3; it records a reproducible seed for any counterexample, which is what makes a failure of this invariant re-runnable rather than anecdotal. Generate arbitrary interleavings of tool calls (across-the-line and reversible), confirmations, and grants; assert every across-the-line effect the spies recorded carries `{who, basis, when}` whose basis actually matches — a **content-bound** live confirmation (D18) or a **scope-matched** grant (D11). This is the harness's crown-jewel invariant, the analogue of the engine's property-tested latch/quota invariants; its one normative home is [`harness/SPEC.md §7`](harness/SPEC.md) and it adds no new law. Written at build time like every scenario test.

### Family map

**A** board authoring (incl. **A7** return-leg validation) · **B** rules/elicitation (incl. **B9** the duration floor) · **C** status latches · **D** the floor (incl. **D10–D11** auto-accept-as-Grant, **D18–D20** content-bound confirmation / fail-closed / the floor property, **D22–D23** channel suppression, **D24–D26** the authorization class, **D27** no-signed-term-no-debt) · **D′** the escalation ladder (**D12–D17, D21** — the ladder-walk set re-provenanced `[SHOULD]` under FD-59, D15 the family's `[MUST]`) · **E** M2 gate · **F** conflict/versioning (incl. **F6** in-flight operands) · **G** elicitation store · **H** orders/groups/guest (incl. **H9** the counterparty's move) · **I** the cross-owner share (**I1–I4**) · **K** check-work · **L** context assembly · **N** money · **O** the assisted off-app path (**O1–O5**) · **P** engine-originated round-trips (**P1–P2**) · **X** the external surface (**X1–X7**) — `[MUST]` throughout save the FD-59 re-provenance above, all behavioral, all on stubs.

**J family is different.** `[HELD-OUT]` probes run against the *finished* harness and their results are **recorded, pass or fail** — a failure means "which general primitive is missing," never "patch the atom." Do not design or fix toward J.

`[ENGINE]`-tagged parts (e.g. A4's enforcement) assert only the harness's half — the stub's verdict is surfaced; real enforcement is proven later at the swap.

**Done when.** All MUST scenarios green on stubs, J results recorded. The harness suite then becomes the **reference exam** every other layer must pass at its swap (§Integration).

---

## App — component/wire tests, plus a few e2e

*Criteria: [`app/SCENARIOS.md`](app/SCENARIOS.md) (every item MUST). Visual law: [`app/DESIGN.md`](app/DESIGN.md). Build order: [`app/BUILD.md`](app/BUILD.md).*

The app renders and transports; it decides nothing. So its tests check **structure and wiring** — what was rendered from a payload, what went over the wire, what fired into the seam — and only a handful drive a real browser.

### The app's three tiers

1. **Component & state tests** (C, U, V, O, S families) — render a component or canvas state from a fixed payload, assert the output. Riser completeness and the no-op round-trip (C2, C4), console present in every state (C3), surface stamping (C5), catalog rendering and the rejected-render path (U1–U4), read-only views as *absence of write routes* (V1), starters compiling to seam writes (O2), appearance rendering from stored state with zero model calls (S1), the boring/opacity stash round-trip (S2), the fave-four FIFO (S3), no-flash landing (S4), gallery cards as display projections only (S5). Fast, run on every change — except **S6**, the one behavioral exception in this tier: Given the marketplace stub unreachable, When the store shelf and picker render, Then the shelf shows honest absence and the picker still serves the owner's faves from on-device skins, the fave-four law and Plain's never-a-picker-row rule unchanged.
2. **Wire tests** (G, D, S families) — real HTTP against the guest routes and the delivery path. The critical one is **G1, the leak test on the wire**: fetch a guest view as the guest and assert the *response payload* contains no commitment titles, names, reasons, or addresses — pixels can lie, payloads can't. Token attribution (G4), dead tokens (G5), consent refusal server-side (G6), delivery recording (D1–D3), no-origination as absence of any endpoint (D5), and **S7** — G1's pattern applied to appearance: a guest page fetched while any skin is active carries zero skin tokens on the wire.
3. **End-to-end browser tests** (Z3) — Playwright driving the real canvas, exactly **two**: Sofia's link flow and Debra's compaction morning. Slow and precious; they exist to prove the whole surface holds together, not to re-test details the lower tiers already cover. Don't add more without a reason of that size.

### What is deliberately NOT automated in the app

**Design law is a human checklist, not a test suite.** `app/DESIGN.md` gates the app's visual BUILD steps by review — Step 0's mechanics, Steps 1–3's surfaces, Step 5's guest page and Step 7's views, per `app/BUILD.md`'s design-law coverage table, whose assignment governs *(widened 2026-08-21 — this sentence said "steps 1–3" while the table it defers to assigns sections to Steps 0, 5 and 7 as well)* — breathing glass, board laws, island placement, motion restraint are *judged*, because pixel-diff tests rot and pass/fail can't grade "calm." Two narrow exceptions worth automating because DESIGN.md states them structurally: the **closed material inventory** (any class carrying `backdrop-filter` outside the named list = build error) and the **Route B selector-liveness check** (a components-map key that matches nothing = failure).

Zero-model-call is asserted by **instrumentation, not review** (U3): the render path has no model client to call.

**Done when.** All families green (component + wire), then the **swap** (§Integration): the real app replaces the harness's app spies (Z1), the full harness suite including P1 **and P2** runs green with `git diff harness/` empty (Z2), and both Z3 walkthroughs pass in the browser.

---

## Model — evals, not tests

*Criteria: [`model/EVALS.md`](model/EVALS.md) — the sets, seed items, thresholds, and grading rules all live there. This section only states why the model is the one part that isn't pass/fail, and where the hard floors are.*

### Why evals

A model is statistical: the same prompt can produce different phrasings, and one wrong answer out of a hundred may be acceptable. So the model passes **sets at thresholds** ("N-set ≥ 95% intent accuracy"), not every item always. Determinism was deliberately kept *out* of the model — everything correctness-critical lives in the harness and engine, which is why they get pass/fail suites and the model gets an exam.

### The sets (defined in `model/EVALS.md §1`)

**N** normalize · **A** ambiguity calibration (ask / don't-ask pairs) · **R** narrate fidelity · **J** judgment boundaries · **Q** injection resistance · **S** `summarize`, the quarantine read · **Z** per-language mirrors. Seeded from the user-stories corpus; grown from real traffic — every production check-work mismatch becomes a new eval item.

### The three 100% floors

Three things are graded like pass/fail even inside the exam, because they're safety properties, not pleasantness:

- **Invention = 0** (R-set): any invented fact in narrated output fails the whole set — this is the harness's D7 floor measured at the model.
- **Forbidden attempts = 0** (J-set): any attempt to author a correctness-critical value or cross a boundary fails the whole set.
- **Carry-through = 0** (S-set): any imperative in `raw_text` surviving into `summary` as an imperative fails the whole set.

A model that aces everything else and misses a floor is **not qualified**.

### When this runs

Last. Model qualification wants the *built* harness (real prompts, real tool contract, real traffic shapes) — `model/BUILD.md`. Until then, every harness test uses the scripted model stub (§Harness), which is exactly why nothing else in the project waits on a model.

---

## Marketplace — unit + behavioral against the mock, a few reused from the app, one integration run

*Criteria: [`marketplace/SCENARIOS.md`](marketplace/SCENARIOS.md) (every item MUST). Build order: [`marketplace/BUILD.md`](marketplace/BUILD.md) — the marketplace builds last, after all four layers, against the service mock (`marketplace/INTERFACES.md §1/§5`), never the real closed service.*

The marketplace is a closed grammar (what a bundle can say) plus a fork (what install copies once, forever independent of the source). So its tests split the same way: schema/mock-service checks for the grammar, behavioral checks for the fork and the propose→confirm walk, and a couple of tiers borrowed wholesale from the app because that's where the picker and the preview card actually render.

### Marketplace unit tests (schema & mock-service fixtures)

Deterministic checks against the meta-schema or the canned catalog — no live dependency, the mock **is** the fixture:
- **F1–F3 [the closed grammar]** — a bundle carrying an executable-shaped payload (F1), an off-menu rule (F2), or any people/booking/history field (F3) is unrepresentable in the meta-schema, refused before the install door.
- **F4, F5 [the two seeds]** — the "Free Time Available" seed validates as the span floor (F4); the dive-center seed validates as the span ceiling (F5). **F5 was unblocked 2026-08-06**: the dive-center seed's governed rules now have their `min-occupancy` menu entry (`engine/SPEC.md §3`, scenarios `engine/SCENARIOS.md` O1–O4), and the four-day course shape has `KindTemplate` (`§1.12`, W5–W8). The fixture validates end-to-end. Both seeds are **throwaway test fixtures** (FR38, [`RULINGS.md`](RULINGS.md)), never production catalog content — any shipped version is founder-built through the app.
- **D1, D2, D4 [discovery format]** — every published item carries exactly one category + tags (D1); the featured shelf shows only admin-flagged items, no computed ranking exists to test around (D2); the catalog carries `popularity` while no v1 surface sorts by it — format presence, UI absence (D4).
- **E4 [nothing licensed leaks]** — a build-artifact scan (the X2 pattern, applied to licensed derivatives): no long-lived or reusable signed URL in the repo, the client bundle, or a cache header that outlives its signature.

### Marketplace behavioral tests (Given/When/Then, against the service mock)

Rides the harness's stub discipline (§Harness) — a situation, an install- or publish-shaped action, an assertion on what got written:
- **I1, I3, I5** — installing writes a provenance-stamped local copy with no live link or subscription record (I1); a tampered bundle carrying any F1/F2/F3 violation is refused whole, with the failing entry named (I3); uninstalling removes only the source document — confirmed rules and commitments stand (I5).
- **I2 [propose→confirm]** — installing "Free Time Available", each blanked parameter walks as an ordinary proposal; nothing writes without the owner's confirm.
- **P1 [unpublish is safe]** — given an installed copy, when the upstream is unpublished or re-versioned, the installed copy is byte-identical afterward — fork isolation.
- **E2, E3 [degradation]** — service unreachable: the picker offers exactly the shipped four + Plain, full function (E2, drives `app/SCENARIOS.md` S6); every already-installed template stays fully functional, because installed is local forked data (E3).

### Marketplace component/state tests (rides the app tier, §App)

Render a component or canvas state from a fixed payload — the same discipline as app's O2 (starters compile to seam writes):
- **I4 [installs compile to normal writes]** — the post-install board state is byte-equivalent in shape to the same setup authored by hand through the console.
- **D3 [preview per good]** — a skin card renders the owner's own board re-tinted; a template card renders the proposal-card anatomy plus the ghost guest page from the owner's real availability — both display projections, zero writes, watermarked.

### Marketplace wire tests

Real HTTP / absence-of-route assertions, the app G-family and D5 pattern applied to the marketplace's own doors:
- **P2 [owner-publish]** — a signed-in owner publishes a saved bundle; the listing is public with required description; another account can install it. Unsigned is refused. *(FD-82; was an absence test.)*
- **P3 [save is not publish]** — saving a bundle does not list it.
- **P4 [no extract]** — publishing a populated board is refused.
- **E1 [entitled fetch]** — an entitled account receives short-lived signed URLs for a store skin's derivatives; an unentitled account receives none; the palette-only preview still works for both.

### End-to-end: the integration run

- **Z1 [seed round-trips]** — with harness, engine, and app all real: a Sofia-shaped account installs "Free Time Available", publishes a link, a booking lands and appears on the board; a Hug-shaped account installs the dive bundle and the setup Situation C's clean run begins from exists on the board. **Unblocked 2026-08-06**, same root cause as F5: the dive-bundle half is now constructible by install *and* by hand-authoring, given the engine's `min-occupancy` entry and `KindTemplate` (`engine/SPEC.md §3`, `§1.12`). Both halves run once app Z2 and engine Z1–Z2 are green.

**Done when.** All unit and behavioral families green against the mock (`marketplace/BUILD.md` Steps 0–4), the component/state and wire tiers green re-running app **S5–S6** unchanged, then **Z1** — both halves runnable, the dive-bundle half unblocked by the F20 and F7 rulings of 2026-08-06.

---

## Security — a cross-cutting suite, riding every layer's build

*Criteria: [`security/SCENARIOS.md`](security/SCENARIOS.md) (every item MUST). Law: [`security/SPEC.md`](security/SPEC.md). Build order: [`security/BUILD.md`](security/BUILD.md) — security has no standalone deliverable except Step 8's compliance pack; every other step lands inside a layer's build, gated there.*

Security isn't a layer — it's ten families of attack-shaped and guarantee-shaped scenarios, each riding a foreign BUILD step (engine, harness, app) or standing alone (secrets, admin, DR). So its tests aren't one kind; they're whichever kind the family's mechanism calls for, same as every other part of this project.

### Security unit tests

Fast, deterministic, no live dependency — mostly build-time or configuration checks:
- **X1–X3** — the secrets floor: a planted client-exposed secret turns CI red (X1), the built client bundle is scanned for key material (X2), the human-logins file is asserted unreachable by any import graph (X3).
- **V5 [no write-once]** — every vault tier's configuration is asserted, not exercised: no tier declares a write-once/compliance-lock class.

### Security property tests

Invariants that must hold for *all* inputs, not one example — generate the adversary's whole move space and check none of it breaks the guarantee:
- **T1 [no oracle]** — for any bad, revoked, or never-issued token, the response is indistinguishable and constant-time.
- **T5 [attribution can't cross]** — for any pair of recipients on one Shared artifact, X's token never reads or returns as Y.
- **N1 [unconstructable reference]** — for any attempted cross-tenant write, construction rejects it; there is no read-time filter to test around.
- **R1, R3 [abuse bounds]** — for any burst of hold requests, the per-token limit holds and the fleet stays bookable (R1); for any duplicate guest-and-interval submission, the same hold returns, never a second (R3, carried engine law exercised from the wire).

### Security behavioral tests (Given/When/Then, on stubs)

Rides the harness's scripted-stub discipline (§Harness) — a situation, an action, an assertion on what the system did:
- **Q1–Q4** — quarantine tagging at context assembly: a hostile guest note (Q1), an imperative SOP (Q2), imported text (Q3), and a replayed trigger (Q4) all land tagged, never obeyed.
- **N2–N5** — Shop A's rule never evaluates on Shop B's placement (N2); the **engine share seam** (`engine/SPEC.md §7.1`) moves exactly the goal and the counterparty's exposed availability, by explicit floor-crossed granting acts, and nothing else (N3); no caller-reachable entry point constructs a two-tenant edge — grants are engine-minted only (N4); a share adds no read power beyond the `availability` grant absent a stored higher rung (N5). *(N3 previously named Situation C's referral — referral is deferred and has no seam.)*
- **V3, V4** — every read of a doctor's note logs `{who, basis, when}` (V3); a deletion request walks vault shred + crypto-shred + backup age-out and produces a completion attestation naming all three (V4).
- **M1, M3** — every admin `vault.get` writes an audit entry (M1); an admin+owner mixed-credential mutation is refused (M3, §2's no-mixing law).
- **S1–S4** — the consent evidence bundle: refused incomplete or missing (S1, S2), replayable by version (S3), captured as guardian consent for a minor's flow (S4).
- **R2 [send halt]** — send volume past the per-owner cap, or an owner's bounce rate past the declared threshold, halts that owner's further sends and surfaces the halt. Per owner, about volume; the per-party complaint stop is the harness's (`harness/SCENARIOS.md` D22–D23).
- **D1 [restore drill]** — backup → clean deployment → the layer suites run green against the restored store.
- **D2, D4** — an owner's takeout contains their board whole and nothing of any other tenant (D2); termination produces takeout then erasure on schedule, attested (D4, V4's path).

### Security wire tests (real HTTP / real store & log inspection)

Rides the app's guest-route build (`app/BUILD.md` Step 5) and reuses its leak-test pattern (app G1) — fetch as the guest, or inspect the store/logs after the fact, and assert on the payload or the artifact, not the pixels:
- **T2, T3, T4, T6** — the honest dead end on a lapsed/revoked token (T2); the store and logs hold digests only, never plaintext (T3); every token page carries `Cache-Control: no-store` and `Referrer-Policy: no-referrer` (T4); a hammered token route trips its limit and shows the plain retry page (T6).
- **V1, V2, V6** — a guest upload streams to the vault and never touches an engine write or seam payload (V1); the retention clock destroys the artifact while the attestation and commitment history stand byte-identical (V2); a crash mid-upload or mid-read produces error reports with zero artifact bytes or PII (V6).
- **P1, P2** — a guest month view's before/after diff around a private commitment shows an availability delta only (P1); no guest response carries another recipient's token, name, or existence, across the whole G-family fixture set (P2).
- **M2 [two paths, one per good]** — template publish is the owner's session through the authoring path; skin publish is the admin pack pipeline; absence of any third path — marketplace P2/P4 mirrored.
- **D3** — an owner's takeout fails marketplace install validation, tested against the real install door (`marketplace/BUILD.md` Step 0's validator) — the §8 carve's teeth.

### The printed gate — T-family, a special case

T1–T6 are classified above by mechanism (property, wire), but the family also functions as a single release gate, not just six scenarios among many: **no public link goes live before the T-family suite is green** (`security/SPEC.md §3`'s printed gate; `security/BUILD.md` Step 4, which rides `app/BUILD.md` Step 5). Treat it the way `security/BUILD.md` treats it — as law, not advice: the suite runs to green *before* the guest-facing build step it gates is considered done, not after.

### What is deliberately NOT automated in security

**The legal review (`security/BUILD.md` Step 8) is a human gate, not a test suite** — the same shape as the app's design law (§App): green suites can't be argued past it. Everything in Step 8 leading up to it (the DPA, the records-of-processing table, the deletion-request runbook, the refreshed posture README) is ordinary documentation work, not a scenario family — there is nothing there to classify as a test.

**Done when.** Every family's suite is green **inside the foreign step it rides** (`security/BUILD.md` Steps 0–7): secrets (X) at every layer's Step 0, quarantine (Q) with harness Step 5, tenant scoping (N) with engine Step 1, the vault (V) before app Step 5, the token law (T) — the printed gate — with app Step 5, consent (S) with app Steps 5–6, abuse limits (R) with app Step 6, admin hardening and the DR drill (M, D1–D2, V6) pre-alpha. Then Step 8's compliance pack, and last, the legal review itself.

---

## Deployment — process gates, not layer tests

*Criteria: [`deployment/SCENARIOS.md`](deployment/SCENARIOS.md) (twenty scenarios). Law: [`deployment/SPEC.md`](deployment/SPEC.md). Added 2026-08-21 — the sixth suite was the one this file classified nowhere, and "deployment is not a layer" did not survive the strategy table's own contents (security is not a layer either).*

Deployment tests the **process**, not the product, so its two kinds are its own: **`[MUST]`** — a named mechanized check (a script in `deployment/scripts/`, run by `npm run check` and the pre-commit hook), verified by attempting the forbidden act and observing refusal, or by static assertion where the forbidden thing is an absence; **`[DRILL]`** — what only a runtime or a human can enforce, executed deliberately at least once and recorded (B4's verdict, the ladder walk, the rotation). The suite is self-classifying — every scenario carries its tag in-file — which is why no builder was ever stranded by the missing section; this section exists so the classification claim ("every criterion classified here") is true rather than nearly true. Mechanism gaps between a `[MUST]`'s law and its current script are ledgered at `deployment/SPEC.md §7a`, not papered over.

---

## Integration — swap tests and the two walkthroughs

*The all-together strategy. There is no separate "integration test suite" to write — integration is proven by **re-running suites that already exist** with real parts in place of stubs.*

### The idea

The harness is built first, against stubs of everything else, and its behavioral suite passes on those stubs. Each stub is a **promise** of how the real layer will behave. Integration testing = cashing the promises: replace one stub with the real thing and re-run the same suite. If the stub was honest, everything stays green with **zero changes to the harness or its tests**.

### The swap sequence

1. **Engine swap** (engine Z1–Z2) — the real engine replaces the engine stubs. Parity first (Z1: each stub behavior reproduced exactly on the harness scenarios' inputs), then the full harness suite **including P1 and P2** — the compaction pass-through and the pending-decision round-trip — so both engine-originated paths are exercised end-to-end and Z2 can't pass vacuously on either *(P2 added to this sentence and its three siblings 2026-08-21 — both Z2 definitions always named the pair; this file said P1 alone in all four places)*.
2. **App swap** (app Z1–Z3) — the real app replaces the app spies. Spy parity (Z1), full harness suite green with `git diff harness/` empty (Z2), then the two browser walkthroughs (Z3).
3. **Model qualification** (model EVALS) — last, against the built harness. Not a swap-suite rerun: the model is graded, and by design nothing deterministic depends on it.

`[ENGINE]`-tagged harness scenarios (enforcement halves the stubs only promised) become fully proven at step 1.

### The two canonical walkthroughs (app Z3)

The only end-to-end browser tests in the project, both straight from `user-stories/`:

- **Sofia's link flow** — generate link → student's board-blind month view → booking lands → the owner's board updates live.
- **Debra's compaction morning** — cancellation event → direction question → proposal card → move confirmations → the board re-forms → the freed-afternoon question.

Every screen along both paths renders from stored structure with zero model calls.

### When a swap turns red

A test that was green on the stub and is red on the real layer means **the stub lied** — the stub's contract and the real layer disagree. The fix is a design decision, not a test edit:

1. Decide which side is right (usually the layer's SPEC).
2. Fix the wrong side **and its contract** (`INTERFACES.md` stub description) so the stub and reality can't drift apart again.
3. Re-run the full suite from the top of the swap.

Never weaken the test, and never patch the harness to absorb a layer's deviation — `git diff harness/` empty is the gate precisely so this can't happen silently.
