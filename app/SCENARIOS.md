# annnä App — SCENARIOS (deterministic acceptance suite)

*Pass/fail, deterministic, replayable. These test **structure and behavior** — payloads, mappings, wire contents, state transitions. Visual/design law lives in `DESIGN.md` and gates `BUILD.md` steps as a checklist, not as scenarios. Run against a stubbed harness (scripted seam calls) and, for the G-family, real HTTP against the guest routes. Sources: `../harness/INTERFACES.md §3`, the user-stories corpus, `.specs/deep-interview-app.md` acceptance list. Every scenario is MUST.*

*(Section letters are local to this file.)*

## C — Canvas & surfaces
- **C1 [board home]** `render(board, payload)` produces the board state; a fresh sign-in lands there. Blocks show only display projections from the payload's handles — no app-computed values anywhere in the rendered output.
- **C2 [riser = commitment-page, whole]** `render(commitment-page, payload)` opens that commitment's riser containing **the same form it was created with** pre-filled from stored structure, **and** the commitment's support content — its rules, SOP attachment, stakeholder assembly, availability-sharing — reachable within the same riser. A bare form with the support content elsewhere fails this scenario.
- **C3 [console omnipresent]** In every canvas state — board, any riser open, settings — the console is present and accepts an utterance. *(Supersession 2 pinned: the prior build's hide-during-edit rule must NOT reappear.)*
- **C4 [riser round-trip]** Open a riser, make no change, close it: the board returns identical — no state change, no writes emitted.
- **C5 [surface reported]** An utterance sent with the board risen carries the **view-context** `{surface: board, visible_range, selected_ref?}`; the same utterance with a commitment riser open carries `surface: commitment-page` + that commitment's ref as `selected_ref` (values per `../harness/INTERFACES.md` render/act signatures + `§2.1`). Selecting a board block stamps its ref as `selected_ref`; with nothing selected, `selected_ref` is absent. The app stamps mechanically; no interpretation — resolving a deictic "this" against the stamp is the harness's job (`../harness/SCENARIOS.md L6`).
- **C6 [frontier follows navigation]** Navigating the date row past the materialized frontier: the app requests extension **through the seam** and, until the store holds the new instances, renders the gap empty — it never invents projected copies to fill it. When the store extends, the instances appear.
- **C7 [self-improvement is opted into, and the card shows both readings]** With the owner's self-improvement setting absent, `render` produces **no** standing-policy proposal card under any payload — assert the card is **absent**, not merely empty, and that no setting was silently created. With the setting present and on, a standing-policy proposal renders with **two rule lines — current and proposed** — plus Confirm / Dismiss / don't-ask-again. Turning the setting on renders as an approve-card, never as a bare toggle (`../app/DESIGN.md §Proposal cards`).
- **C8 [pending-decision card]** A trigger card raised by a `PendingDecision` (`../engine/SPEC.md §1.14`) renders its **engine-named choices as the card's actions**, with the cause visible (`SPEC.md §3`). Picking a choice emits it through the seam — assert **no client-side application** and **no app-authored choice text**. A card whose choices the app renamed or reordered fails this scenario.

## U — Generative-UI discipline
- **U1 [compose]** A valid schema of catalog nodes renders the composed view; every node maps to a manifest component.
- **U2 [reject unknown]** A schema containing one unknown node type: structured error returned to the harness, **nothing rendered for that schema** — no partial view, no guessed widget.
- **U3 [generate-once]** The same stored schema rendered twice produces identical output with **zero model calls** (asserted by instrumentation: the render path has no model client to call).
- **U4 [data not code]** A schema attempting executable content (script node, event-handler string) is unrepresentable in the meta-schema — it fails validation before rendering is ever attempted.

## G — Guest flow (end-to-end, on the wire)
- **G1 [board-blind wire]** Fetch a guest month view as the guest: the response payload contains open windows only — no commitment titles, party names, reasons, or addresses of anything blocking, and no blocked-time enumeration. *(Leak test on the wire, not the pixels.)*
- **G2 [at-a-glance]** Month cells carry the day's open windows as ranges ("2–6p"); a day with nothing open is marked closed, indistinguishable from do-not-disturb. *(Sofia's student scanning her rhythm; Debra's link offering the day's place only.)*
- **G3 [pick → form → return]** Slot pick → the published form renders → submission fires `on_form_return` carrying exactly the link's token attribution; the guest sees a plain confirmation. No account was created; no agent appeared.
- **G4 [token attribution]** Two named recipients hold different links to the same Shared artifact; each return attributes to exactly its own recipient. *(Engine S2's app half.)*
- **G5 [dead token honest]** An expired/revoked token: the honest dead-end page — no availability shown, no redirect, no stale bookable view.
- **G6 [consent in form]** A flow requiring signature/payment authorization captures it in the form itself; the return payload carries the consent evidence; without it, submission is refused client- and server-side.
- **G7 [typed shape preserved]** The guest page is a rendering over a typed payload: the payload backing any guest view validates against the published form's schema, and submission is the same typed shape in reverse. *(This keeps the machine-legible door open — asserted as structure now, not as a machine-caller feature.)*
- **G8 [walk-up entry link mints per visitor]** A **public entry link** (Situation B's counter QR — `SPEC.md §5`, law at `../security/SPEC.md §3`) renders a front door that shows **no availability**; beginning a pull mints a **single-visitor token** and only then does the ordinary guest flow appear. Two devices scanning the same link hold **different** tokens and cannot see or affect each other's hold; identity attaches at the checklist, and from that point attribution behaves exactly as G4's named recipient. *(The walk-up half of the guest flow — Situation B's counter.)*

## D — Delivery
- **D1 [email sends]** An outward act with a reachable email recipient: the app sends, embeds the per-recipient token link, records `sent`.
- **D2 [hand-me-the-link]** A recipient on an unreachable channel: the app composes message + link and surfaces it to the owner to forward; records `handed-to-owner`. The seam call is satisfied either way.
- **D3 [failure recorded]** A bounced/failed send records `delivery-failed` as an event for the harness — the app doesn't retry on its own or decide what failure means.
- **D4 [channel asked once]** First outward act to a new recipient surfaces the channel question; the answer is stored; the second act to the same recipient asks nothing.
- **D5 [no origination]** There is no app path that produces an outward message without a floor-gated harness act upstream — tested as absence: no endpoint, no UI affordance.
- **D6 [addressee bound]** The act names party X: the send goes to **X's stored address for X's stored channel**, carrying **X's** token link — asserted on the outbound message, on a fixture where X and Y are both recipients of the same Shared. A recipient with no stored address for their channel routes to D2 (hand-me-the-link); a name resolving to zero or two parties produces **no send at all**. *(The addressing half: T5/G4 prove a token cannot cross once sent — this proves the right human was sent to.)*

## V — App-only views
- **V1 [read-only by construction]** The audit/management view renders append-only history; no write endpoint is reachable from it (asserted as absence of routes, not as a disabled button).
- **V2 [SOP library routes edits]** Opening an SOP from the library and editing routes through the normal authoring seam — the library itself never writes.

## O — Onboarding & starters
- **O2 [starters compile to seam writes]** Tapping a starter template produces ordinary commitment/rule writes through the seam, pre-filled and owner-confirmed — byte-equivalent in shape to what the console path would produce.
- **O3 [saved locations]** "home" typed in any place field resolves to the stored address; editing the stored address updates resolution everywhere; an unknown name is just a literal, not an error.

## S — Appearance (skins, boring, opacity)
- **S1 [skin applies]** Selecting a skin re-tints canvas and chrome from that pack's approved palette tokens; the same stored appearance state renders identically twice, with **zero model calls**.
- **S2 [boring round-trip]** Boring on: photo off, solid content backing. Boring off: the previous skin **and** opacity restore exactly. The stash survives reload.
- **S3 [fave-four FIFO]** Starring a fifth skin drops the oldest fave; unstarring the last is a no-op; the pop-out never exceeds four rows and never renders a scroll container.
- **S4 [no-flash landing]** A return visit paints the stored skin in the first frame; a true first visit paints the ambient ground — never a guessed skin later corrected.
- **S5 [gallery = own board]** Every gallery card renders the owner's own current board re-tinted per that skin — real commitments, display projections only, no app-computed values, zero writes.
- **S6 [degrade to available]** With the marketplace stub unreachable, the store shelf shows an honest absence — never an error wall or stale store actions. The picker still serves the owner's faves from skins **available on-device** (the shipped four always; installed store skins from their persisted device copies); nothing offers a skin whose pack isn't present. The fave-four law (S3) and Plain's never-a-picker-row rule hold unchanged during the outage.
- **S7 [guests unskinned]** A guest page fetched while any skin is active carries **zero skin tokens on the wire** — G1's leak-test pattern, applied to appearance.

## Z — Stub parity (the swap insurance)
- **Z1 [spy parity]** For each harness app-stub behavior (`../harness/INTERFACES.md §5`: payload/reversibility assertions, simulated form returns), the real app reproduces the contract-visible behavior exactly on the harness scenarios' inputs.
- **Z2 [the swap]** The full harness `SCENARIOS.md` suite (including P1, the compaction pass-through, **and P2**, the pending-decision round-trip) runs green with the real app in place of the app stubs — **zero harness changes**. The layer's definition of done.
- **Z3 [story walkthroughs]** Two end-to-end renders on the real canvas: **Sofia's link flow** (generate link → student's month view → booking lands → board updates live) and **Debra's compaction morning** (cancellation event → direction question card → proposal card → confirmations → board re-forms → freed-afternoon question). Every screen along both paths renders from stored structure with zero model calls.

---

**Coverage map (interview acceptance → scenarios):** canvas shape → C1–C6 · catalog discipline → U1–U4 · guest flow end-to-end → G1–G8 (walk-up entry link → G8) · delivery (email + hand-me-the-link) → D1–D6 (addressing → D6) · board-blindness → G1/G2 · app-only views carry no harness logic → V1–V2 · onboarding → O2–O3 · stub parity / swap-readiness → Z1–Z3 · frontier follows navigation → C6 · machine-legible guest shape → G7 · appearance (skins, boring, opacity, gallery, degradation) → S1–S7 · NOTES.md ideas → G2 (at-a-glance), D2/D4 (adaptive delivery), O2 (starters), O3 (saved locations) · standing-policy proposal card + opt-in → C7 · pending-decision card → C8.
