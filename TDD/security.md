# Testing security — a cross-cutting suite, riding every layer's build

*Criteria: [`../security/SCENARIOS.md`](../security/SCENARIOS.md) (every item MUST). Law: [`../security/SPEC.md`](../security/SPEC.md). Build order: [`../security/BUILD.md`](../security/BUILD.md) — security has no standalone deliverable except Step 8's compliance pack; every other step lands inside a layer's build, gated there.*

Security isn't a layer — it's ten families of attack-shaped and guarantee-shaped scenarios, each riding a foreign BUILD step (engine, harness, app) or standing alone (secrets, admin, DR). So its tests aren't one kind; they're whichever kind the family's mechanism calls for, same as every other part of this project.

## Unit tests

Fast, deterministic, no live dependency — mostly build-time or configuration checks:
- **X1–X3** — the secrets floor: a planted client-exposed secret turns CI red (X1), the built client bundle is scanned for key material (X2), the human-logins file is asserted unreachable by any import graph (X3).
- **V5 [no write-once]** — every vault tier's configuration is asserted, not exercised: no tier declares a write-once/compliance-lock class.

## Property tests

Invariants that must hold for *all* inputs, not one example — generate the adversary's whole move space and check none of it breaks the guarantee:
- **T1 [no oracle]** — for any bad, revoked, or never-issued token, the response is indistinguishable and constant-time.
- **T5 [attribution can't cross]** — for any pair of recipients on one Shared artifact, X's token never reads or returns as Y.
- **N1 [unconstructable reference]** — for any attempted cross-tenant write, construction rejects it; there is no read-time filter to test around.
- **R1, R3 [abuse bounds]** — for any burst of hold requests, the per-token limit holds and the fleet stays bookable (R1); for any duplicate guest-and-interval submission, the same hold returns, never a second (R3, carried engine law exercised from the wire).

## Behavioral tests (Given/When/Then, on stubs)

Rides the harness's scripted-stub discipline ([`harness.md`](harness.md)) — a situation, an action, an assertion on what the system did:
- **Q1–Q4** — quarantine tagging at context assembly: a hostile guest note (Q1), an imperative SOP (Q2), imported text (Q3), and a replayed trigger (Q4) all land tagged, never obeyed.
- **N2–N5** — Shop A's rule never evaluates on Shop B's placement (N2); the **engine share seam** (`../engine/SPEC.md §7.1`) moves exactly the goal and the counterparty's exposed availability, by explicit floor-crossed granting acts, and nothing else (N3); no caller-reachable entry point constructs a two-tenant edge — grants are engine-minted only (N4); a share adds no read power beyond the `availability` grant absent a stored higher rung (N5). *(N3 previously named Situation C's referral — referral is deferred and has no seam.)*
- **V3, V4** — every read of a doctor's note logs `{who, basis, when}` (V3); a deletion request walks vault shred + crypto-shred + backup age-out and produces a completion attestation naming all three (V4).
- **M1, M3** — every admin `vault.get` writes an audit entry (M1); an admin+owner mixed-credential mutation is refused (M3, §2's no-mixing law).
- **S1–S4** — the consent evidence bundle: refused incomplete or missing (S1, S2), replayable by version (S3), captured as guardian consent for a minor's flow (S4).
- **R2 [send halt]** — send volume past the per-owner cap, or an owner's bounce rate past the declared threshold, halts that owner's further sends and surfaces the halt. Per owner, about volume; the per-party complaint stop is the harness's (`../harness/SCENARIOS.md` D22–D23).
- **D1 [restore drill]** — backup → clean deployment → the layer suites run green against the restored store.
- **D2, D4** — an owner's takeout contains their board whole and nothing of any other tenant (D2); termination produces takeout then erasure on schedule, attested (D4, V4's path).

## Wire tests (real HTTP / real store & log inspection)

Rides the app's guest-route build (`../app/BUILD.md` Step 5) and reuses its leak-test pattern (app G1) — fetch as the guest, or inspect the store/logs after the fact, and assert on the payload or the artifact, not the pixels:
- **T2, T3, T4, T6** — the honest dead end on a lapsed/revoked token (T2); the store and logs hold digests only, never plaintext (T3); every token page carries `Cache-Control: no-store` and `Referrer-Policy: no-referrer` (T4); a hammered token route trips its limit and shows the plain retry page (T6).
- **V1, V2, V6** — a guest upload streams to the vault and never touches an engine write or seam payload (V1); the retention clock destroys the artifact while the attestation and commitment history stand byte-identical (V2); a crash mid-upload or mid-read produces error reports with zero artifact bytes or PII (V6).
- **P1, P2** — a guest month view's before/after diff around a private commitment shows an availability delta only (P1); no guest response carries another recipient's token, name, or existence, across the whole G-family fixture set (P2).
- **M2 [one publish path]** — tested as absence of any other publish route or endpoint, the marketplace P2 pattern mirrored.
- **D3** — an owner's takeout fails marketplace install validation, tested against the real install door (`../marketplace/BUILD.md` Step 0's validator) — the §8 carve's teeth.

## The printed gate — T-family, a special case

T1–T6 are classified above by mechanism (property, wire), but the family also functions as a single release gate, not just six scenarios among many: **no public link goes live before the T-family suite is green** (`../security/SPEC.md` §3's printed gate; `../security/BUILD.md` Step 4, which rides `../app/BUILD.md` Step 5). Treat it the way `../security/BUILD.md` treats it — as law, not advice: the suite runs to green *before* the guest-facing build step it gates is considered done, not after.

## What is deliberately NOT automated

**The legal review (`../security/BUILD.md` Step 8) is a human gate, not a test suite** — the same shape as the app's design law ([`app.md`](app.md)): green suites can't be argued past it. Everything in Step 8 leading up to it (the DPA, the records-of-processing table, the deletion-request runbook, the refreshed posture README) is ordinary documentation work, not a scenario family — there is nothing there to classify as a test.

## Done when

Every family's suite is green **inside the foreign step it rides** (`../security/BUILD.md` Steps 0–7): secrets (X) at every layer's Step 0, quarantine (Q) with harness Step 5, tenant scoping (N) with engine Step 1, the vault (V) before app Step 5, the token law (T) — the printed gate — with app Step 5, consent (S) with app Steps 5–6, abuse limits (R) with app Step 6, admin hardening and the DR drill (M, D1–D2, V6) pre-alpha. Then Step 8's compliance pack, and last, the legal review itself.
