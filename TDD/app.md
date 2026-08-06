# Testing the app — component/wire tests, plus a few e2e

*Criteria: [`../app/SCENARIOS.md`](../app/SCENARIOS.md) (every item MUST). Visual law: [`../app/DESIGN.md`](../app/DESIGN.md). Build order: [`../app/BUILD.md`](../app/BUILD.md).*

The app renders and transports; it decides nothing. So its tests check **structure and wiring** — what was rendered from a payload, what went over the wire, what fired into the seam — and only a handful drive a real browser.

## The three tiers

1. **Component & state tests** (C, U, V, O, S families) — render a component or canvas state from a fixed payload, assert the output. Riser completeness and the no-op round-trip (C2, C4), console present in every state (C3), surface stamping (C5), catalog rendering and the rejected-render path (U1–U4), read-only views as *absence of write routes* (V1), starters compiling to seam writes (O2), appearance rendering from stored state with zero model calls (S1), the boring/opacity stash round-trip (S2), the fave-four FIFO (S3), no-flash landing (S4), gallery cards as display projections only (S5). Fast, run on every change — except **S6**, the one behavioral exception in this tier: Given the marketplace stub unreachable, When the store shelf and picker render, Then the shelf shows honest absence and the picker still serves the owner's faves from on-device skins, the fave-four law and Plain's never-a-picker-row rule unchanged.
2. **Wire tests** (G, D, S families) — real HTTP against the guest routes and the delivery path. The critical one is **G1, the leak test on the wire**: fetch a guest view as the guest and assert the *response payload* contains no commitment titles, names, reasons, or addresses — pixels can lie, payloads can't. Token attribution (G4), dead tokens (G5), consent refusal server-side (G6), delivery recording (D1–D3), no-origination as absence of any endpoint (D5), and **S7** — G1's pattern applied to appearance: a guest page fetched while any skin is active carries zero skin tokens on the wire.
3. **End-to-end browser tests** (Z3) — Playwright driving the real canvas, exactly **two**: Sofia's link flow and Debra's compaction morning. Slow and precious; they exist to prove the whole surface holds together, not to re-test details the lower tiers already cover. Don't add more without a reason of that size.

## What is deliberately NOT automated

**Design law is a human checklist, not a test suite.** `app/DESIGN.md` gates BUILD steps 1–3 by review — breathing glass, board laws, island placement, motion restraint are *judged*, because pixel-diff tests rot and pass/fail can't grade "calm." Two narrow exceptions worth automating because DESIGN.md states them structurally: the **closed material inventory** (any class carrying `backdrop-filter` outside the named list = build error) and the **Route B selector-liveness check** (a components-map key that matches nothing = failure).

Zero-model-call is asserted by **instrumentation, not review** (U3): the render path has no model client to call.

## Done when

All families green (component + wire), then the **swap** ([`integration.md`](integration.md)): the real app replaces the harness's app spies (Z1), the full harness suite including P1 runs green with `git diff harness/` empty (Z2), and both Z3 walkthroughs pass in the browser.
