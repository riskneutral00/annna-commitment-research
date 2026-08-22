# annnä Security — BUILD (ordered plan)

*Security builds **with** the layers, not after them: each step below names its own scenario gate and the foreign BUILD step it rides. The package has no standalone deliverable except Step 8's compliance pack — everything else lands inside a layer's build, gated here.*

## Step 0 — The secrets floor & CI gate
Before any layer's Step 0 closes: the two-file secrets discipline (`SPEC.md §7`) — exactly one secret-bearing file on the local rung, and the vault key loaded from it rather than from the store it encrypts — the CI grep gate, the identifier allowlist. Gate: **X1–X5**.

**NOT CLOSED 2026-08-08 — X1 is built; X2–X5 are not yet constructible.** `../deployment/scripts/x1-secret-grep.mjs` greps every tracked non-markdown file for client-exposed secret identifiers (the `NEXT_PUBLIC_` class), runs in `npm run check`, and is fired by `.githooks/pre-commit`. **Its canary was fired for real**: a planted `NEXT_PUBLIC_API_SECRET` refused the commit — `X1 FAIL — a client-exposed secret is in the tree`. Markdown is out of scope by design, because the corpus names these prefixes in its own prose. The other four wait on things that do not exist yet: X2 needs a built client bundle (app BUILD), X3 and X5 need the local rung's one secret-bearing file and an import graph to assert against (deployment BUILD Step 2), X4 needs the §4 vault (Step 3). **Layer Step 0s therefore proceed on X1 alone, which is less than this step's own preamble promises** — recorded here rather than absorbed, so nobody reads "Step 0" as "the secrets floor is in place".

## Step 1 — The quarantine
With harness BUILD Step 5 (context assembly): source tags at every admitting door, quarantined assembly, the `document` tier. Gate: **Q1–Q4**.

## Step 2 — Tenant scoping
With engine BUILD Step 1 (the object model): `owner_org` on every stored object, tenant-scoped read/write construction, the enumerated legal crossings — one crossing class and no second door, and a share that adds no read power (`SPEC.md §9`). Gate: **N1–N2, N4** *(N3 and N5 re-homed 2026-08-22 to Step 6b — both test the §7.1 share seam engine Step 8 builds, not the object model this step rides; a gate here was hostage to machinery the step never names)*.

## Step 3 — The vault
After engine Step 0 (substrate pick); **before app Step 5** — the Situation B/C guest flows cannot be **completed or swapped** without it; they build against the documented mock. The vault substrate, the class table and clocks, encryption + key handling, the attestation/tombstone path, the crypto-shred keys. Gate: **V1–V3, V5**.

---

> **FROZEN 2026-08-08 — Steps 4–8 are specified, not being built. Nothing below is deleted, weakened, or made optional.**
> **Why they can freeze:** every one of them rides an app step (`SPEC.md`'s riding pattern) — Step 4 rides app Step 5, Step 5 rides app 5–6, Step 6 rides app Step 6, Steps 7–8 are pre-alpha ops and compliance. **The app has not started.** These steps have nothing to ride yet, so freezing them names a state that already existed rather than creating one.
> **Resume condition: each step unfreezes when the app step it rides begins.** Step 4 the moment app Step 5 is worked, and so on. No step here may be skipped because it was frozen.
> **The two hard gates survive the freeze completely, and this is the point of writing "frozen" instead of "deferred":**
> — **Step 4's printed gate stands: no public link goes live before T1–T6 are green.** A frozen step is not a green step. If a link would go live while Step 4 is frozen, Step 4 unfreezes; it does not get waived.
> — **Step 8's formal legal review stands, unchanged and non-negotiable** — a hard gate, like a red scenario, that cannot be argued past by green suites and is not negotiable from inside the repo. Freezing the step it sits in changes nothing about it.
> **Gate-coverage still walks every scenario below.** Frozen is a statement about what is being worked, never about what must hold.

## Step 4 — The token law
With app Step 5 (guest pages + tokens). Minting, digest storage, lifetimes, revocation latches, enumeration safety, transport headers, per-IP/per-token limits. **The printed gate: no public link goes live before T1–T6 are green** — the carried adversarial-test contract, **mechanized 2026-08-22** (`../deployment/scripts/t-six-before-link.mjs`: a token route under `app/` without a recorded T1–T6 green marker fails the chain; armed and passing while no route exists). This is also where the owner-session and guest-token credential models first coexist, so the one-model-per-mutation law is first proven here (M5; the third model joins at Step 4b). Gate: **T-family except T8 and T9, P-family, R1, R3, M5, N6 (the conversion claim — FD-46: account creation and token attribution first coexist here)** *(T8 re-homed 2026-08-22 to Step 5b — its held-credential subjects are bound by the import connect, not by guest pages)*.

## Step 4b — The fifth token class *(added 2026-08-21 — the class previously had no owning step: its custody was handed to "security's build" by `../harness/BUILD.md` Step 8 while every candidate step here rode an app step, so a credential could be built and issued while its suite sat frozen)*
**Rides `../harness/BUILD.md` Step 8, on the harness's clock — not the app's**, and unfreezes when that step begins, independent of the freeze block above (whose resume conditions are app steps). The `external-client` credential's minting, digest custody, suspension state (FD-33), withdrawal latch, and the §10 per-credential rate and spend caps. **T9 is its gate, green before any credential is issued** — the `SPEC.md §3` printed-gate posture, now with a step that owns it. M5 re-runs here against all three models (its own text always said so). Gate: **T9, M5 (three-model form)**.

## Step 5 — Consent & signatures
With app Steps 5–6: the evidence bundle at capture, version stamping, guardian variant, audit replay. Gate: **S1–S4**.

## Step 5b — Held import credentials *(added 2026-08-22 — the Step 4b pattern again: T8's subjects had no step that builds them)*
**Rides `../app/BUILD.md` Step 6a (calendar import) and the model layer's BYO binding when made**: vault residency for every `SPEC.md §3.1` member — the calendar refresh token, a bound BYO provider key, the ICS secret-feed URL (FD-37's posture) — no-payload/no-log custody, read-only-by-construction, and the no-background-retry discipline T8 asserts. Gate: **T8**.

## Step 6 — Abuse limits & delivery caps
With app Step 6 (delivery): named limits as declared objects, email volume caps, and **both stops** — the per-owner send halt (bounce rate) and the per-party channel suppression (one complaint), which are separate walls with separate thresholds (`SPEC.md §10`, "Two stops"). **This step owns the thresholds, not the decision** — reading them is the harness's (`../harness/SPEC.md §3.11`). Gate: **R2, R4, R4b**.

*The per-party stop is asserted in the harness's own suite, not here — its scenarios are that layer's and are gated by that layer's BUILD. The per-recipient cap's defer-never-drop behavior is this layer's: R4 joins this step's gate, and R4b — the rung-at-cap quiet-hours reading, split from R4 2026-08-22 — closes here too, once the harness ladder its Given needs exists.*

## Step 6b — The share seam's crossing *(added 2026-08-22 — N3/N5's home; their Given needs the seam itself)*
**Rides `../engine/BUILD.md` Step 8 (the §7.1 cross-owner share), on the engine's clock**: the one legal crossing exercised for real — exactly the goal and exposed availability cross, and no read power is added. Gate: **N3, N5**.

## Step 7 — Admin hardening, DR drill & takeout
Pre-alpha ops: the third identity + hardware-key MFA, the logged vault path, the one publish path, error-report scrubbing; the restore drill; the takeout export. Gate: **M-family, D1–D2, D5, V6**.

**The backup substrate check, printed so it can be run rather than trusted** *(added 2026-08-22 — `SPEC.md §8`'s hourly/one-hour-loss/eight-hour-restore bounds were the one substrate commitment that never got the FR7/FD-11 printed-table treatment; the bounds are promises against Convex capabilities nobody has checked)*. Run at this step, **UNRUN today**, five criteria in the FR7 shape:

| # | Criterion | The check (re-runnable) |
|---|---|---|
| 1 | Programmatic export exists on the bound plan tier at ≥ hourly cadence | provider docs + one scheduled `npx convex export` (or streaming-export equivalent) observed firing twice, an hour apart |
| 2 | The export covers every table incl. file storage, at a granularity a restore can consume | inspect one export archive; enumerate tables against the schema of record |
| 3 | A restore from the latest export stands a runnable deployment inside the 8-hour bound | the Step-7 restore drill, timed and recorded here |
| 4 | The export job itself alarms on failure ("a backup that silently stops is worse than no backup") | kill the job once; assert the alarm fired |
| 5 | The export path fits the per-transaction ceilings recorded at `../engine/BUILD.md` Step 0 (32k docs scanned · 16 MiB read), or uses a provider path those ceilings don't govern | provider docs + the observed export of a Situation-C-scale fixture |

**Reopening clause (FR7's):** if any row fails when first run, `SPEC.md §8`'s bounds reopen as a ruling — the bounds move to what the substrate supports, or the substrate question reopens; the table is updated with the measured result either way, never silently.

## Step 8 — The compliance pack & THE LEGAL REVIEW GATE
Last, and named: the DPA in the terms of service; the records-of-processing (from `SPEC.md §4`'s table); the deletion-request runbook; the posture README refreshed against what was actually built. Then the **formal legal review — a hard gate, like a red scenario: it cannot be argued past by green suites.** Gate: **V4, D3–D4**, and the review itself.

## Guardrails
- A control that needs a new harness/engine/app seam verb has gone wrong — stop and flag (`INTERFACES.md` preamble).
- A vault artifact appearing in an engine write or seam payload is a defect, not a shortcut (V1).
- Never a write-once storage class for PII (V5).
- The agent never gains a shred tool — the `destruction` class stays unoccupied (`INTERFACES.md §2`).
- The legal gate is not negotiable from inside the repo.
