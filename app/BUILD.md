# annnä App — BUILD (ordered plan)

*Each step is gated by its scenarios (`SCENARIOS.md`) and, for visual steps, the design-law checklist (`DESIGN.md`). Substrates per `INTERFACES.md §2`: TanStack Start (TanStack Router on Vite) · Convex · Clerk · Astryx + glass theme · Resend · Cloudflare Workers. The final gate is the stub-swap — the app is done when the harness never noticed the change.*

## Design-law coverage — every section of `DESIGN.md`, accounted for

*Added 2026-08-09, and gated: `../deployment/scripts/design-law-coverage.mjs` refuses if a `DESIGN.md` section is named nowhere below. Three sections landed in one sitting and gated nothing before this existed, and the remaining UI/UX phases each add another — so the accounting is mechanical rather than remembered. **Being named here is not being reviewed well**; it only means no visual law is silently ungated.*

| section | where it is checked |
|---|---|
| §Canvas & photo · §Appearance · §Spacing · §Shapes · §Colour · §Board rendering | **Step 1** |
| §Typography | **Step 1** (ramp, tabular figures, self-hosted delivery) and **Step 5** (the 16px guest floor) |
| §Glass · §Islands & mobile | **Step 1**, then re-checked wherever a new surface appears |
| §Console · §Proposal cards | **Step 2** |
| §Risers and forms | **Step 3** |
| §Guest pages | **Step 5** |
| §Motion & iconography · §Accessibility baseline · §Standing rejections | **every visual step** — they bound all of them, so no single step owns them |
| §Design-system mechanics | **Step 0** (the pin, the layer order, the postinstall refusal) |
| §Supersessions | **no gate, and deliberately** — it records what this repo reversed in the prior build, not law a build satisfies |
| §Language | **no visual gate** — chrome posture is a scope line (English at v1), checked by `SPEC.md §5`'s guest-language law, not by looking at a surface |

## Step 0 — Scaffold
TanStack Start app + Convex + Clerk wired; Astryx installed **pinned, no postinstall approval** (`DESIGN.md` §Mechanics), CSS layer order and per-scope `color-scheme` set; glass materials file (the closed inventory) created; Cloudflare Workers deploy from day one. Gate: a signed-in owner sees an empty canvas; a token route renders outside auth.

**The substrate check, printed here.** FD-11 ruled TanStack Start + Cloudflare; this step is where that ruling is *checked*, on the Convex precedent (`../engine/BUILD.md` Step 0). Print the table and the result, so a later reader re-derives the decision instead of inheriting it. The five criteria, fixed before either candidate is tried:

| # | Criterion | Passes when |
|---|---|---|
| 1 | **Convex live subscriptions reach the browser** — the board updates on commit without polling | a projection change repaints with no request from the app |
| 2 | **Clerk owner sessions, and guest token routes outside auth, in one codebase** | both render; the guest route never touches a session |
| 3 | **The Astryx pin installs and builds unmodified** — StyleX ≥ peer range, React ≥ 19 | the shipped four skins render; no fork, no patch, no version float |
| 4 | **No token route is served from a build-time snapshot** (`SPEC.md §5`) | the guard is asserted, not inherited from a default |
| 5 | **A per-change preview rung and a protected production rung exist** (`../deployment/SPEC.md §3`, R7, R9) | both stand up; production refuses anonymous access; lower rungs are unindexed |

**If any row fails when it is first built against, FD-11 reopens** — that is the whole point of printing it rather than asserting it. Until this table exists with a result in it, the ruling is a ruling and nothing more; no document may describe the substrate as ratified.

## Step 1 — Canvas + board
The wallpaper canvas, the board on it, blocks from stored payloads (**events and tasks, one component**), date-row navigation, frontier-extension requests, the two-gravity 75/25 split and its asymmetric scroll, the wake policy's four parts, mobile rack + bottom bar; skin packs + palette tokens + **the derived veil** and **the per-skin urgency marks**, boring mode, **both opacity dials**, no-flash landing. **Check `corner-shape` support per engine here** and wire the circular fallback (`DESIGN.md` §Shapes) — it is a support question, not a design one, and it is cheapest to answer at the first surface that draws a corner. Gate: **C1, C6, S1, S2, S4, S7**, design-law checklist (board laws, islands, photo rules, breathing blocks, §Appearance). *(2026-08-09: `+N` overflow and due chips are struck — internal scroll replaced the chip, and tasks are blocks. `DESIGN.md` §Board rendering.)*

## Step 2 — Console
The draggable card / pill, utterance in → seam → narrate out, proposal cards, surface stamping. Gate: **C3, C5, C7, C8** (the pending-decision card: engine-named choices as the action strip, nothing applied client-side), design-law checklist (console laws, card anatomy).

## Step 3 — Risers
The single overlay primitive with sink/rise motion; the commitment form riser first (creation form = detail form), then rules and settings *(the Plan riser is struck — 2026-08-09, tasks are board blocks)*. Gate: **C2, C4**, design-law checklist (overlay + whisper dim + motion restraint + `DESIGN.md` §Risers and forms).

## Step 4 — Catalog + `render_generative`
The manifest (vetted Astryx subset, named list), schema validation against the meta-schema, node→component mapping, rejected-render path. Gate: **U1–U4**.

## Step 5 — Guest pages + tokens
Token routes, month at-a-glance, day drill-in, published form rendering, submission → `on_form_return`, dead-token page, consent capture; token law + vault uploads per `../security/BUILD.md` Steps 3–4. Gate: **G1–G9**, security **T-family + V1** (the public-link gate). G9 is the per-request rendering guard — the same row FD-11's substrate check owes a result (Step 0, criterion 4).

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
