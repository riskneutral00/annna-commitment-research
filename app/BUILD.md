# annnä App — BUILD (ordered plan)

*Each step is gated by its scenarios (`SCENARIOS.md`) and, for visual steps, the design-law checklist (`DESIGN.md`). Substrates per `INTERFACES.md §2`: Next.js (App Router) · Convex · Clerk · Astryx + glass theme · Resend · Vercel. The final gate is the stub-swap — the app is done when the harness never noticed the change.*

## Step 0 — Scaffold
Next.js app + Convex + Clerk wired; Astryx installed **pinned, no postinstall approval** (`DESIGN.md` §Mechanics), CSS layer order and per-scope `color-scheme` set; glass materials file (the closed inventory) created; Vercel deploy from day one. Gate: a signed-in owner sees an empty canvas; a token route renders outside auth.

## Step 1 — Canvas + board
The wallpaper canvas, the board on it, blocks from stored payloads, date-row navigation, frontier-extension requests, `+N` overflow, due chips, mobile rack + bottom bar; skin packs + palette tokens, boring mode, the opacity dial, no-flash landing. Gate: **C1, C6, S1, S2, S4, S7**, design-law checklist (board laws, islands, photo rules, breathing blocks, §Appearance).

## Step 2 — Console
The draggable card / pill, utterance in → seam → narrate out, proposal cards, surface stamping. Gate: **C3, C5, C7**, design-law checklist (console laws, card anatomy).

## Step 3 — Risers
The single overlay primitive with sink/rise motion; the commitment form riser first (creation form = detail form), then rules, Plan, settings. Gate: **C2, C4**, design-law checklist (overlay + whisper dim + motion restraint).

## Step 4 — Catalog + `render_generative`
The manifest (vetted Astryx subset, named list), schema validation against the meta-schema, node→component mapping, rejected-render path. Gate: **U1–U4**.

## Step 5 — Guest pages + tokens
Token routes, month at-a-glance, day drill-in, published form rendering, submission → `on_form_return`, dead-token page, consent capture; token law + vault uploads per `../security/BUILD.md` Steps 3–4. Gate: **G1–G8**, security **T-family + V1** (the public-link gate).

## Step 6 — Delivery
Resend integration + token links, hand-me-the-link composition, event recording, ask-once channel storage. Gate: **D1–D6**.

## Step 7 — App-only views + starters
SOP library, audit read surface, default-availability UX, version-propagation UI; starter templates + saved locations; the skins pop-out (fave four) + gallery riser, run against the marketplace CI mock and against its absence. Gate: **V1–V2, O2–O3, S3, S5, S6**.

## Step 8 — The stub-swap (final gate)
Point the harness at the real app. Run the **full harness suite including P1**. Green with `git diff harness/` empty, then run **Z1–Z3** (spy parity + the two story walkthroughs). The swap is the exam.

## Guardrails
- A step that needs a new seam verb has gone wrong — stop and flag (`INTERFACES.md §1`).
- A value computed in the app that someone could act on is a defect, not a shortcut (`SPEC.md §2/§10`).
- Any Astryx version bump re-runs the churn re-measure (`DESIGN.md` §Mechanics) before merging.
- Design-law checklist failures block the step like scenario failures — visual law is law.
- Appearance state on a seam payload or in an engine write is a defect (`SPEC.md §10`).
- No public link goes live before security BUILD Step 4 is green (`../security/SPEC.md §3`, the printed gate).
