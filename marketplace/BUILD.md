# annnä Marketplace — BUILD (ordered plan)

*The marketplace **builds last** — after all four layers. Gated on: the app stub-swap complete (`../app/SCENARIOS.md` Z2), the harness suite green (specifically the elicitation family B1/B2 and the floor family D, which the install crossing rides), and the engine's rule menu + Shared projection green. The closed service exists in this repo only as the CI mock (`INTERFACES.md §1/§5`).*

> **FROZEN 2026-08-08 — Steps 0–5.** The whole package is specified and is not being built. The freeze's normative home, with its reasoning and resume condition, is [`README.md`](README.md); this line exists so the status report reads the same state a human reads here. Nothing below is deleted, weakened, or made optional, and gate-coverage still walks every scenario.

## Step 0 — Formats + the install door
The two document schemas (skin pack, template bundle) and the install-door validator, including the two seed bundles ("Free Time Available", dive-center) as fixtures. These two seeds are **throwaway test fixtures, not production catalog content** (FR38, `../RULINGS.md`): they exist only to exercise the format's span; any shipped version is founder-built through the app, and no developer authors a bundle. Gate: **F1–F5**.

## Step 1 — The service mock
Canned catalog (the four shipped skins + one store-skin fixture + the two seed templates — the Step 0 **throwaway fixtures**, FR38, never shipped catalog defaults), entitlement map covering the fixture for one account and not another, test signer minting genuinely expiring URLs (`INTERFACES.md §1`) — the same mock CI uses forever. The transaction surface exists here, so the lane separation is proven here too: nothing the store does writes a board money record (E7). Gate: **P1–P2, E1, E4, E7**.

## Step 2 — Skins end-to-end
The store shelf in the gallery riser, entitlement-aware pack fetch, degradation path, and the two entitlement-withdrawal behaviors — deactivate on the next successful check, never on a failed one (`SPEC.md §4`, FR14). Gate: **E2, E5, E6, D3 (skin half)**; re-run app **S5–S6** unchanged.

## Step 3 — Templates end-to-end
The browse riser, the install door wired to the real harness, the propose→confirm parameter walk, uninstall, and the installed copy's independence from the service (an install is a local fork, so an outage cannot reach it — `SPEC.md §3`). Gate: **I1–I6, E3, D3 (template half)**; re-run harness **B1/B2** unchanged — *zero new verbs is the exam*.

## Step 4 — Discovery (minimal)
Categories + tags at publish, featured shelves, the New shelf, the client-side text filter; `popularity` present in the format, unused by any surface. Gate: **D1–D4**.

## Step 5 — Integration
The two seeds end-to-end on real layers. Gate: **Z1**.

## Guardrails
- A new harness tool or seam verb has gone wrong — stop and flag (`INTERFACES.md` preamble).
- Any engine marketplace-awareness (field, flag, table) is a defect (`INTERFACES.md §4`).
- A CI call to the real service is a build error, not a flake (`INTERFACES.md §1`).
- Anything licensed in a public artifact fails E4 — treat as an incident, not a bug.
