# Deep Interview — App layer (2026-08-05)

Interview to pin the open design decisions for `app/` before authoring its spec package. Final ambiguity ~13%.

## Goal

Produce the **full app spec package** — `app/README.md · SPEC.md · INTERFACES.md · SCENARIOS.md · BUILD.md`, same shape and rigor as `harness/`, `model/`, and `engine/`. The app = the human-facing layer: the one-canvas owner surface (board + console + rising forms), the guest link pages, delivery channels, and the app-only views. Built, not imported.

## Decisions made (this interview)

1. **Deliverable** — full spec package now.
2. **Platform** — **mobile-first web app**; one app serves owner and guest. (The guest link is a web page regardless.)
3. **Framework** — **Next.js**. Static-first site frameworks were researched and rejected: annnä's owner surface is a live, authenticated, real-time app, not a mostly-static site — in a static-first framework it would become one giant React island. Next.js *is* React.
4. **Backend** — **Convex** (real-time store + server functions; live board updates for free; matches a prior production system and the prior build; satisfies the engine's substrate needs — transactions, append-only writes).
5. **Auth** — **Clerk** for owners. Guests never have accounts: tokenized URLs outside auth, matching the engine's per-recipient token design.
6. **UI kit** — **Astryx + glass theme** (Meta's agent-ready design system). This carries forward the prior build's ruling (2026-07-25, Option 1 strict adoption; glass rides as a theme without forking). Astryx is the substrate of the FIXED component catalog: an agent-readable, documented set of vetted components — exactly the harness's "LLM composes, never invents widgets" rule. Honest cost: beta churn, Meta dependency.
7. **Delivery channels (v1)** — **email (Resend) + hand-me-the-link**: the app sends email itself; for every other channel (LINE, WhatsApp, SMS, anything) it gives the owner the link/message to forward. SMS and other automated channels are later additions, not v1.
8. **App shape — the one-canvas app.** There are no pages on the owner side:
   - One wallpaper **canvas** fills the screen. The **board** sits on it (~90%). That's home.
   - The **console** is a movable glass element, *always present* — on the board, off the board, during editing. The agent is not a place you go.
   - **Islands** (floating glass controls) hold settings and small actions; bottom of screen on mobile. Never top nav bars.
   - Tapping a commitment block: the board recedes; the commitment's own form — the same form it was created with — rises on the canvas. Edit by hand or via console. Save/exit → board returns. Animated sink/rise, no page loads.
   - Rules, settings, everything else: the same move. The app is flat — board, console, and things that rise and sink.
   - The harness's three render surfaces (console / board / commitment-page) are one canvas with risers, not three screens. The guest link is the separate, traditional, pre-AI page.
   - This matches the prior build's design language (`~/Desktop/annnä/docs/DESIGN.md` — **outside this repo**, on the founder's machine; traceability, not required reading: ambient canvas, floating glass islands, glass panes — carried forward as design substrate, and stated in full in `../app/DESIGN.md`).
9. **Done test** — every app SCENARIO passes **and** the real app replaces the harness's app stubs (render / publish / notify_and_await spies) with **zero harness changes**, harness suite green; plus one walkthrough per user story (Sofia's and Debra's app moments each renderable on the canvas).

**Assumed (BUILD-only, flagged not asked):** hosting on Vercel — the default pairing for Next.js + Convex.

## Constraints (pre-existing, not re-asked)

- The app's obligations are pinned by `../harness/INTERFACES.md §3`: `render(surface, payload)` for board (H1) / commitment-page (H2) / console; `render_generative(schema)` from the fixed catalog; `publish` (board-blind exported form, per-recipient tokens); `notify_and_await` (outward, crosses the floor); `on_form_return` (trigger source, carries token attribution); app-only views (SOP library, management/audit read surface, default-availability UX, version-propagation UI) with **no harness logic**.
- The off-app guest flow is deliberately **traditional / pre-AI** — no agent on the guest side. Consent (signature/payment) is captured by the form itself.
- The model seam stays per-call selectable (no one-model assumption leaks into the app).
- Non-negotiables (parent README): thin agent / rich engine · reversibility floor · poka-yoke · general capability, stories as falsification probes.
- Requirements source: `user-stories/` (Situations A–E), `app/NOTES.md` (onboarding, starter templates, saved locations, availability-at-a-glance guest calendar, adaptive link delivery), harness SPEC §2 (H1/H2).

## Non-goals (v1 spec)

- Native mobile apps (wrapper possible later).
- Automated SMS / LINE / WhatsApp sending (v1 = email + forwarded links).
- The `annna.dev` marketing site (separate artifact).
- Multi-model UI or BYO-key surfaces (supply is app-provided; see memory/model docs). **Superseded by founder ruling FR5** — the BYO-key ban is reversed; BYO API keys are in scope (positive spec home: `../model/SPEC.md`).
- Offline-first operation.

## Acceptance criteria

- App package passes the fresh-LLM test (README alone orients a stranger).
- Every `harness/INTERFACES.md §3` obligation appears exactly once in app SPEC/INTERFACES.
- SCENARIOS cover: canvas shape (board home, console omnipresent, riser open/close), generative-UI catalog discipline (schema → vetted components only; invented widget = rejected), guest flow end-to-end (link → availability-at-a-glance → pick → form → token-attributed return), email + hand-me-the-link delivery, board-blindness of published pages, app-only views carrying no harness logic, stub-parity items proving swap-readiness.
- BUILD ends at the stub-swap: real app in, harness untouched, harness suite green.

## Interview transcript (condensed)

| R | Q | A |
|---|---|---|
| 1 | Deliverable? | Full app spec package |
| 2 | Platform? | Mobile-first web app; asked for full stack interview |
| 3 | Framework? | Next.js (static-first frameworks researched — wrong tool for a live app) |
| 4 | Backend? | Convex |
| 5 | Auth? | Clerk; guests = tokenized URLs, no accounts |
| 6 | UI kit? | Astryx + glass theme (Meta, agent-ready; prior ruling carried forward) |
| 7 | Channels v1? | Email (Resend) + hand-me-the-link |
| 8 | Home surface? (contrarian) | The one-canvas app: board home, console everywhere, risers not pages |
| 9 | Done test? | Scenarios + stub-swap + per-story walkthroughs |

## Clarity breakdown (final)

| Dimension | Score |
|---|---|
| Goal | 0.85 |
| Constraints | 0.85 |
| Success criteria | 0.85 |
| Context (brownfield) | 0.95 |
| **Ambiguity** | **~13%** |
