# annnä Security — BUILD (ordered plan)

*Security builds **with** the layers, not after them: each step below names its own scenario gate and the foreign BUILD step it rides. The package has no standalone deliverable except Step 8's compliance pack — everything else lands inside a layer's build, gated here.*

## Step 0 — The secrets floor & CI gate
Before any layer's Step 0 closes: the two-file secrets discipline (`SPEC.md §7`) — exactly one secret-bearing file on the local rung, and the vault key loaded from it rather than from the store it encrypts — the CI grep gate, the identifier allowlist. Gate: **X1–X5**.

**NOT CLOSED 2026-08-08 — X1 is built; X2–X5 are not yet constructible.** `../deployment/scripts/x1-secret-grep.mjs` greps every tracked non-markdown file for client-exposed secret identifiers (the `NEXT_PUBLIC_` class), runs in `npm run check`, and is fired by `.githooks/pre-commit`. **Its canary was fired for real**: a planted `NEXT_PUBLIC_API_SECRET` refused the commit — `X1 FAIL — a client-exposed secret is in the tree`. Markdown is out of scope by design, because the corpus names these prefixes in its own prose. The other four wait on things that do not exist yet: X2 needs a built client bundle (app BUILD), X3 and X5 need the local rung's one secret-bearing file and an import graph to assert against (deployment BUILD Step 2), X4 needs the §4 vault (Step 3). **Layer Step 0s therefore proceed on X1 alone, which is less than this step's own preamble promises** — recorded here rather than absorbed, so nobody reads "Step 0" as "the secrets floor is in place".

## Step 1 — The quarantine
With harness BUILD Step 5 (context assembly): source tags at every admitting door, quarantined assembly, the `document` tier. Gate: **Q1–Q4**.

## Step 2 — Tenant scoping
With engine BUILD Step 1 (the object model): `owner_org` on every stored object, tenant-scoped read/write construction, the enumerated legal crossings — one crossing class and no second door, and a share that adds no read power (`SPEC.md §9`). Gate: **N1–N5**.

## Step 3 — The vault
After engine Step 0 (substrate pick); **before app Step 5** — the Situation B/C guest flows cannot be **completed or swapped** without it; they build against the documented mock. The vault substrate, the class table and clocks, encryption + key handling, the attestation/tombstone path, the crypto-shred keys. Gate: **V1–V3, V5**.

## Step 4 — The token law
With app Step 5 (guest pages + tokens). Minting, digest storage, lifetimes, revocation latches, enumeration safety, transport headers, per-IP/per-token limits. **The printed gate: no public link goes live before T1–T6 are green** — the carried adversarial-test contract. This is also where the two credential models first coexist, so the one-model-per-mutation law is proven here (M5). Gate: **T-family, P-family, R1, R3, M5**.

## Step 5 — Consent & signatures
With app Steps 5–6: the evidence bundle at capture, version stamping, guardian variant, audit replay. Gate: **S1–S4**.

## Step 6 — Abuse limits & delivery caps
With app Step 6 (delivery): named limits as declared objects, email volume caps, the bounce/complaint kill-switch. Gate: **R2**.

## Step 7 — Admin hardening, DR drill & takeout
Pre-alpha ops: the third identity + hardware-key MFA, the logged vault path, the one publish path, error-report scrubbing; the restore drill; the takeout export. Gate: **M-family, D1–D2, D5, V6**.

## Step 8 — The compliance pack & THE LEGAL REVIEW GATE
Last, and named: the DPA in the terms of service; the records-of-processing (from `SPEC.md §4`'s table); the deletion-request runbook; the posture README refreshed against what was actually built. Then the **formal legal review — a hard gate, like a red scenario: it cannot be argued past by green suites.** Gate: **V4, D3–D4**, and the review itself.

## Guardrails
- A control that needs a new harness/engine/app seam verb has gone wrong — stop and flag (`INTERFACES.md` preamble).
- A vault artifact appearing in an engine write or seam payload is a defect, not a shortcut (V1).
- Never a write-once storage class for PII (V5).
- The agent never gains a shred tool — the `destruction` class stays unoccupied (`INTERFACES.md §2`).
- The legal gate is not negotiable from inside the repo.
