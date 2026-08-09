# annnä App — SPEC (the one-canvas surface)

*The human-facing layer: it renders surfaces, moves data in and out, and delivers outward messages. It contains **zero harness logic, zero engine math, and zero model calls in any render or write path**. Everything it shows was decided elsewhere; everything it collects is handed to the harness untouched. Technology names live in `INTERFACES.md` (downward), `DESIGN.md` (mechanics), and `BUILD.md` — this file is behavior only.*

---

## §0. What the app is

- **Doors and windows, not rooms.** If you deleted the app, the truth (engine) and the behavior (harness) would survive intact; only the ways in and out would be gone. Nothing is decided here.
- **Deterministic rendering.** The render path is generate-once-render-forever: any generative composition happens at authoring time through the harness; rendering stored structure calls no model, ever. The same payload renders the same surface, always.
- **Two audiences, two shapes.** The **owner** gets the one-canvas app (§1) behind sign-in. The **off-app guest** gets traditional token-URL pages (§5) with no account, no agent, no app — a pre-AI web form. There is no third shape.
- **Interfaces are data.** Every surface the app renders — forms, guest pages, generative compositions — is declarative stored structure, never generated code. Amending a surface is a data write through the normal seam.

## §1. The one-canvas model (the owner side)

There are no pages on the owner side. There is **one canvas** — the wallpaper filling the screen — and things that sit, rise, and sink on it:

- **The board** sits on the canvas (~90% of it) and is **home**: opening the app shows your board. Board rendering law: §2.
- **The console** — the agent's mouth and ears — is a movable element that is **always present**: on the board, off the board, and while any riser is open. The owner never "goes to" the agent. *(This deliberately supersedes the prior build's "parallel doors never compete" rule, which hid the console during editing — reversed 2026-08-05 precisely so the owner can talk to the agent about the thing that's open. Recorded in `DESIGN.md` §Supersessions.)*
- **Islands** — small floating controls (settings, view switches) — sit at the canvas edges; on mobile, one bar in the thumb zone. Placement law: `DESIGN.md`.
- **Everything else is a riser.** Tap a commitment block and the board recedes; the commitment's riser rises on the canvas. Edit by hand or by talking to the console; save/exit sinks it and the board returns. Settings, the SOP library, audit views: the same move. *(The Plan view was retired 2026-08-09 with the due chip — tasks are ordinary blocks on the board and have no separate peer surface. `DESIGN.md` §Board rendering.)* The app is flat — board, console, islands, risers. Motion is a sink/rise transition, never a page load.
- **What the commitment riser carries — H2 in full, not a bare form.** Its anchor is **the same form the commitment was created with** — resolved from the commitment's stored `form_ref` (`../harness/SPEC.md §3.4`, FR16), never re-derived from `kind`; a commitment with no `form_ref` is BARE and anchors on its title. And the riser also carries everything that *supports* that commitment: its rules, its SOP attachment, its stakeholder assembly, its availability-sharing. One surface — the harness's per-commitment support surface, whole. A build that renders the creation form alone and scatters the support content elsewhere has mis-read this section.

**Canvas state grounds the harness.** The harness's `render(surface, payload)` seam maps surface → canvas state, not surface → page:

| Harness surface | Canvas state |
|---|---|
| `board` (H1) | the board, risen (home) |
| `commitment-page` (H2) | that commitment's riser open — **the riser IS the per-commitment support surface** |
| `console` | the console element (present in every state) |

Which harness instance grounds an interaction (H1 board vs H2 support) is read off what's risen. The app reports the active canvas state with every console utterance — the **view-context** `{surface, visible_range?, selected_ref?}`: which surface, the visible date range, and the selected card if any — so the harness's standing frame carries the right `surface` **and the referent for a deictic utterance** (`../harness/SPEC.md §8`, `../harness/INTERFACES.md §2.1`). The app doesn't interpret, it reports; resolving "this" against `selected_ref` is the harness's job, not the app's.

### §1.1 Loading, empty, and failure states

The canvas is never blank and never lies about progress. Two new laws, five citations — the rest of this list is already law elsewhere and is only gathered here so a builder finds every degraded state in one place:

- **First load** *(law)* — the canvas (wallpaper) renders immediately; the board's blocks appear when the engine projection arrives. The loading skeleton is the board frame itself — never a spinner-as-a-page.
- **Console call in flight / timed out** *(law)* — an utterance in flight shows as pending in the transcript; at the attended timeout (`../model/INTERFACES.md §2`, `timeout_ms` 10 s) the console says plainly that the agent didn't answer and offers re-send. No partial answer is ever rendered as an answer, and nothing is inferred app-side.
- **Empty board** — honest emptiness: the board renders with no blocks, console present, nothing nagging. Emptiness is a state, not an error; §8's starters are how an empty board is offered content, once.
- **Generative render failure** — the rejected-render poka-yoke (§4): off-catalog schemas fail loudly at parse, never silently.
- **Guest page, bad or expired token** — indistinguishable non-recognition (`../security/SPEC.md §3`): bad, revoked, and never-issued tokens all get the same neutral not-active page.
- **Delivery failure** — a recorded result plus the card in the console (§6); the failure lives on the record, never only in a toast.
- **Marketplace unreachable** — honest absence on the shelf; faves still served from on-device skins (S6; `INTERFACES.md §2`).

## §2. The board

Behavioral law (visual law: `DESIGN.md` §Board):

- The board shows **placed commitments as blocks** and nothing else at rest. Time is block *data*, never block position or size — the board is calm because the truth is layered, not flattened.
- **Tasks are blocks, the same component as events** *(founder-ruled 2026-08-09, FD-23 — this reverses "task deadlines are never grid blocks", the due chip and the Plan riser)*. Events pack to the top of their column, tasks to the bottom of the board, and the board scrolls asymmetrically between the two bands. Visual law and the exact packing rules: `DESIGN.md` §Board rendering. Behaviorally nothing changed — a task was always a commitment with different axes set (`../engine/SPEC.md`), and it was only ever the *rendering* that split them.
- **Which blocks are legible at rest is the owner's setting, in four parts** — value, scope, keep-awake mark, keep-awake toggle (`DESIGN.md` §Board rendering, *The wake policy*; requirement: `../PRD.md` RQ-10/RQ-11). All four are **display state**: the board renders differently, and nothing about the commitment, the placement, or any engine value changes. Engaging a block wakes it fully whatever the rule says.
- Recurring commitments display the engine's **materialized instances** — the app renders what the store holds and asks the harness to extend the frontier when navigation moves past it; it never invents projected copies.
- Everything on a block or chip is a **display projection from an engine handle**. The app never computes a time, a gap, or an availability — not even for preview.

## §3. The console

- Chat with the owner's agent — text and voice are the same console.
- **Agent-initiated speech is UNGOVERNED, pending design (FR-B, 2026-08-06).** The former rule — *"the console never speaks first"* — was **removed by founder ruling**, deliberately and entirely. It is written here rather than left as an absence, because a deleted prohibition and a granted permission look identical in a diff and are opposite things.
  - **Removing the rule did not grant anything.** There is today **no specified circumstance** in which the agent initiates. Nothing in v1 may be built on the assumption that it can.
  - **What still binds, on its own reasoning:** every outward act to a third party remains floor-gated (`../harness/SPEC.md §7`) — that was never derived from this rule. So "ungoverned" means *ungoverned toward the owner, in the owner's own console* — and nowhere else.
  - **Owner: the founder.** This is a product-voice decision (when, if ever, annnä opens its mouth first), not an architecture gap an implementer can close. Until it is ruled, the honest state is this paragraph.
  - **The interim build posture:** build the console as request-response. An initiating console is a design change with its own scenarios, not a flag someone flips.
- **Trigger results surface as cards — an independent law, not a leftover of the removed rule.** When a trigger fires with no human present (a cancellation, a returned form — `../harness/SPEC.md §4`), the result **surfaces as a card with its cause visible**, and the agent's question may ride that card, sitting there until the owner next looks. This holds because *the owner must be able to see what happened while they were away and why* — it would be true under either ruling, and it survives FR-B unchanged. **A card raised by a `PendingDecision`** (`../engine/SPEC.md §1.14` — a run under its minimum is the first instance) renders the **engine's named choices as its actions**: the app names none of its own, renames and reorders none, and applies none locally. Picking one emits it through the seam and nothing else — which is the same law as everywhere else on this surface (`§10`: no app-computed values, no client-side policy), stated here because a choice list looks like copy and is not. A **restore card** is offered when a board comes back short of its last backup watermark — what is missing, when the last good copy was taken, one confirm, nothing written before it. The law is `../security/SPEC.md §8`; this file only says where it appears.
- Renders `narrate` output verbatim and **proposal cards** (anatomy in `DESIGN.md`): a proposal is shown, confirmed or dismissed, and collapses to its consequence. Nothing applies silently.
- **A standing-policy proposal shows the difference.** When the agent offers to record a repeatedly hand-set value as standing policy (`../harness/SPEC.md §6`), the card's rule lines carry **both readings — what is stored now, and what the proposal would store** — so the owner is choosing between two visible states rather than approving a description. Confirm takes the new one; dismiss keeps the old one; a per-card "don't ask me again" declines the pattern permanently (`../harness/SPEC.md §3.10`). This uses the existing proposal-card anatomy (`DESIGN.md`), not a new surface.
- **Turning self-improvement on is itself an approve-card.** The owner is told the mechanism exists and chooses it explicitly; it is never acquired silently and never defaults on. This is the general rule in `DESIGN.md` — any autonomy change arrives as its own approve-card — applied to this case, and it is why the noticed-pattern offer does not need FR-B reopened: an owner who never approved it never sees it.
- **Outward acts surface as cards, never as silent sends.** A floor-gated outward message (`notify_and_await`) appears in the console as a card stating the recipient **and the exact address the send will use** (§6) + content + basis; token confirmations returning from moved parties surface the same way. The console is where the floor is *visible*.
- The console carries utterances to the harness and renders what comes back. It holds no policy: no local shortcuts, no client-side command parsing that bypasses the seam.

## §4. Generative UI and the fixed catalog

```
render_generative(schema) -> view
```

- The harness/model emits a **typed schema** — a tree of nodes from the **fixed component catalog**. The app maps node type → vetted component. **The LLM composes; it never invents a widget.**
- **Unknown node type = rejected render.** The app returns a structured error to the harness and renders nothing for that node — never a guess, never a fallback widget. This is the poka-yoke that makes the catalog *fixed* rather than advisory.
- The schema is **data**: declarative, storable, re-renderable with zero model calls, bounded by a meta-schema. It can rename, arrange, and skin; it can never express executable code, add lifecycle states, or alter engine semantics.
- The **catalog manifest** is a named list — the vetted subset of the design system's components (substrate: `INTERFACES.md §2`). Adding a component to the catalog is a **design act** (a manifest edit, reviewed), never a runtime act.
- The guest form (§5) is the same machinery: the exported form is a stored generative schema rendered on a public page.
- **The live authoring preview is this same render path over the *draft* schema.** While the owner edits Lego-style (`../harness/SPEC.md §5`), the preview renders the in-progress schema through the same `render_generative` — **internal, zero model calls, off-catalog fails loudly at parse**, exactly as a finalized schema does (there is no second preview renderer and no model in the preview loop — U3's "the render path has no model client to call" is universal). Freeze-at-finalization (§5/G6) stops further *editing*; it does not change how the schema renders.

### §4.1 The catalog manifest, v1 *(founder-approved 2026-08-06)*

The closed node-type list. Each maps to exactly one vetted substrate component (binding recorded in the manifest file at build time, `BUILD.md` Step 4). Grouped by role:

**Composition** (the only nodes that may carry `children`):
`group` (labeled vertical section) · `row` (horizontal pairing of small inputs) · `text` (static display copy — never input) · `divider`

**Field nodes** (each captures one typed value; where the value is engine-owned it must validate against the engine's `typed_value` table, `../engine/SPEC.md §2`):
`text-input` · `number` (with unit) · `date` · `time` · `datetime` · `duration` · `recurrence` (bounded by the engine's pattern menu, `../engine/SPEC.md §1.4`) · `buffer` (before/after duration pair) · `select` (closed options, single) · `multi-select` · `toggle` · `threshold` (comparator + typed operand) · `ranked-list` (orderable options) · `scope-selector` (rule target: board / commitment-kind / audience / party) · `party-picker` (a known principal, by reference) · `place` (declared address per the engine's `place` attribute) · `file-slot` (guest artifact → vault stream, `../security/SPEC.md §4`; the schema carries the accept-list, never the file) · `signature` (guest consent capture in-form)

**Action:** `submit` — the single confirm act of a schema (the archive's "executor"); at most one per schema; its firing is the seam event, never a client-side behavior.

**The meta-schema** bounds every node to: `type` (from the list above — unknown = rejected render, per this section) · `id` (stable slot name) · `label` · `bind` (the harness field-path the captured value lands in — data, checked at authoring time) · `props` (per-type, closed per the manifest — unknown prop = rejected render, same poka-yoke as unknown type) · `children` (composition nodes only; field nodes are leaves) · `required?` · `default?`. No node may carry code, event handlers, lifecycle, or free-form styling — appearance comes from the active skin's tokens (`DESIGN.md §Appearance`), never per-node.

This list is sized to what the specified surfaces actually need — the commitment form and riser (§1), rule authoring (`../harness/SPEC.md §3.5`), and the guest form (§5). Growing it is a manifest edit, reviewed, per the bullet above.

## §5. Guest pages (the traditional flow)

- Reached **only by capability link** — a token URL outside sign-in, never in the owner's navigation. Possession of the link is the only credential; each named recipient's link carries a **per-recipient token** so a return attributes to exactly one person. The walk-up variant *(founder-ruled 2026-08-06)*: a **public entry link** — one shareable front-door URL per published offering (Situation B's counter QR) that itself holds nothing and answers nothing; the moment a visitor begins a pull, the system **mints them a single-visitor token** behind it, identity attaches at the checklist, and from then on attribution and the per-token hold caps (`../security/SPEC.md §10`) work exactly as for a named recipient. Token minting, digest storage, lifetimes, revocation, and transport hygiene are law at `../security/SPEC.md §3`.
- **Guest artifact uploads (passports, medical documents, signed waivers) stream to the vault** (`../security/SPEC.md §4`) and never transit an engine write or seam payload — the engine receives only the attestation.
- **Board-blind by construction.** The page is rendered from the `publish` payload — the engine's Shared projection — and the app **never receives** what it must not show. No commitment titles, names, reasons, or addresses of anything blocking; blocked time is simply absent. The leak test is on the wire, not the pixels.
- **Availability at a glance:** the month view writes the open windows into each day cell (e.g. "2–6p") so a guest reads the owner's rhythm before drilling in; a day with nothing open is simply marked closed. Drilling into a day is for picking exact start + duration.
- Pick → form → submit. The form captures whatever consent the flow requires (signature, payment authorization) **in the form itself**; submission fires `on_form_return` into the harness loop carrying the token's attribution. The guest sees a plain confirmation — no agent, no account, any browser.
- **Expired or invalid token → an honest dead end**: a page that says the link no longer works and whom to contact — never a stale bookable view, never a redirect into the app.
- **Never served from a build-time snapshot.** A guest page is rendered **per request, against live token state** — never prerendered, cached, or otherwise served from content produced before the request that asked for it. *Why this is law and not a build setting:* board-blindness bounds **what** a guest page may contain, and it holds by construction because the app never receives the Shared projection's complement. It says nothing about **when** that content is true. A page baked while the token was valid keeps answering after the token is revoked — the same bytes, delivered at a moment when nobody was entitled to them — and the honest dead end above never fires, because there is no request for it to fire on. **The obligation is on the route, not on a default:** any build tool that snapshots routes it judges static must be disabled for every token route explicitly, and *"no token route is served from a snapshot"* is **asserted at the guest-page gate** (`SCENARIOS.md` G-family, alongside the token gates at `../security/SCENARIOS.md` T-family) rather than inherited from a substrate's behaviour. A default that happens to be correct today is not a guarantee; the assertion is.
- Guest pages must not assume the caller is human — the page is a rendered form over a typed payload, so a machine-legible shape is preserved (a future door, not a current feature).
- **Guest-facing language is the owner's setting, asked once (FR15, ruled 2026-08-06).** There is **no product default and no fallback list**, because the right answer differs between one owner and the next — a Rawai dive shop and a Taipei studio do not serve the same guests, and any default annnä picked would be wrong for roughly half of all owners. So the system **asks the owner, at setup, which languages their guest-facing surfaces render in, stores the answer, and never asks again.** The stored set governs the guest page, the published form's field copy, and the outward notifications that carry its links.

  *This is a distinct law from `../model/SPEC.md §6`, and conflating the two is the mistake this ruling closes.* §6 constrains **which models qualify** — a model that cannot clear a required language's eval set may not serve `normalize` in it. That governs what the model can *read and write*. Guest form copy is **authored content**, not a model call: no model is in the loop when a guest reads a form. The two laws happen to range over the same languages today and are answerable independently.

  *Not covered by this ruling, and ruled separately since:* annnä's **own** product surfaces — marketplace category names and bundle `domain` display naming. FR15 does not reach them because they are one global surface with no owner to ask. **FR32 (founder-ruled 2026-08-07) closed them**: the catalog renders in the **viewing owner's stored language setting** — the same setting FR15 stores, reused — with **English fallback** where a translation does not yet exist. Home: `../marketplace/SPEC.md §6`.

## §6. Delivery

- **v1 sends email itself; every other channel is hand-me-the-link.** When the harness emits an outward act, the app either (a) sends it by email with the recipient's token link, or (b) surfaces a **Generate Link** affordance: one tap composes the full message + token link and copies it, and the owner pastes it into any channel the app can't reach (WeChat, LINE, SMS — anything) *(founder-concretized 2026-08-06)*. Both paths satisfy the same seam call; automated SMS / LINE / WhatsApp / WeChat / Messenger sending are later additions behind the same shape.
- **Every attempt is recorded as an event** — sent, delivered-failed, handed-to-owner — so the harness knows what happened without the app deciding what it means. **A fourth event, `complaint`, is not an attempt outcome:** a provider reports it against a send that already succeeded, arriving later and out of band. It is recorded here with the other three because it is a fact about a delivery, and because the layer that decides what it means (`../harness/SPEC.md §3.11`) can only read what this layer stored. Tested at **D3**.
- **Channel choice is stored per recipient, asked once** (the harness's ask-once policy; the app just surfaces the question the first time and reads the stored answer after).
- **The addressee is resolved, never composed.** An outward act names a **party** (`../harness/SPEC.md §3.1`); the app reads that party's stored contact for that party's stored channel (bullet above) and sends there. **The app never accepts an address supplied by the model, typed into a message body, or inferred from a name.** A name resolving to no party, or to more than one, is not the app's to solve — the act comes back unsent and the harness asks (`../harness/SPEC.md §7`). A party with no stored address for their channel takes the hand-me-the-link path, **never a guessed address.** The act's console card shows the exact address the send will use (§3), because the last moment anyone can catch a wrong addressee is before it leaves. *Why this is its own law:* misdirected mail — right content, wrong human — is the most commonly reported real-world breach class, and every guarantee beneath it holds perfectly while the wrong person reads the page: the per-recipient token (`../security/SPEC.md §3`) is minted correctly, T5 still proves it cannot cross, and the leak has already happened. Tested at **D6**.
- **Both delivery stops are tripped by the harness — never by the app.** Abuse limits, email volume caps and the two stops — the per-owner **send halt** and the per-party **channel suppression** (`../security/SPEC.md §10`, "Two stops") — are security law built alongside this layer's delivery step (`../security/BUILD.md` Step 6). The app's part is the part it already has: it **records** every bounce and complaint as a delivery event (bullet above) and decides nothing about what any of them means. **The harness reads those events and trips whichever stop applies**, because tripping one is a decision about what failure means, and §10's invariant holds here exactly as it does everywhere else — the app holds no policy. While the switch is tripped for a recipient, an outward act naming them comes back **unsent**, the same shape as a party with no reachable stored address (hand-me-the-link, above) — the app never silently drops a send, and it never un-trips the switch on its own. *This bullet exists because the control was placed in the app layer with nothing anywhere saying who trips it, which made it the one counterexample to §1's "not one entry is a decision". It is the harness's.* **Normative home: `../harness/SPEC.md §3.11`**, gated at `../harness/SCENARIOS.md` D22–D23. This bullet is the app-side restatement — it says what the app does (record, and take the unsent path), never what the threshold is or when the switch trips.
- **Push notifications do not exist in v1** — stated, not omitted. Native shells are deferred (`DESIGN.md §Standing rejections`), so nothing in v1 has a push channel to need; revisit at native-shell time behind the same delivery seam.
- Delivery is the only place the app touches a third party, and it does so only downstream of a floor-gated harness act. The app can't originate an outward message.

## §7. App-only views (no harness logic)

The four views the harness explicitly disowns (`../harness/INTERFACES.md §3.4`), **plus a fifth this package adds** — all risers/islands on the canvas, all **read/navigation surfaces**:

- **SOP library** — browse and open stored SOPs; editing goes through the normal authoring seam.
- **Management / audit read surface** — the append-only history, rendered; who did what, when, on what basis. Read-only by construction: no write endpoint exists from this view.
- **Default-availability UX** — the surface for viewing and opening the owner's standing availability for editing (the edit itself is an ordinary rule write through the seam).
- **Version-propagation UI** — when a shared artifact updates, the surface showing what changed and where it's used.
- **Skins & appearance** — the skins/boring/opacity islands, the fave-four pop-out, and the gallery riser (behavior law: `DESIGN.md §Appearance`). Appearance preferences are the one app-owned write: display-only state (active skin, boring stash, **both opacity dials**, faves, **the wake policy's scope and its per-commitment `keep-awake` marks**) stored in app settings — never engine truth, never carried on a seam call. *(The wake-policy members joined this set 2026-08-09, FD-22. `keep-awake` is per-commitment and still display-only: it changes what a block looks like, never where it sits — the engine's placement is untouched and cannot read it. FD-19's parity exclusion covers this set as written, for the same reason: an agent acting for the owner has no business setting what the owner's board looks like.)*

"No harness logic" is structural: these views have no write paths of their own — anything that changes state routes through the console or a riser form, into the seam. (The appearance carve-out above writes *display settings*, not state anyone schedules against.)

## §8. Onboarding & starter content

- A new owner lands on an **empty board** — and the *app* offers the way in: starter templates for the common shapes of a life (meals, physical activity, work-availability) and a saved-locations setup, as tappable affordances on the canvas. **Onboarding is app-surface-initiated in v1** — tappable affordances, not an agent walkthrough. This is now a *build posture* under §3's ungoverned state, not a prohibition: an agent-led onboarding is a design change with its own scenarios, not an omission to be filled in.
- A starter tap compiles to **ordinary writes through the normal seam** — the same commitment/rule shapes the console would produce, pre-filled and confirmed by the owner. Starters are data (stored templates), never code, and never a bypass.
- Starters are **not** marketplace templates: the marketplace's business-in-a-box bundles (`../marketplace/SPEC.md §1.2`) are a richer, deliberately separate system — same spirit, different artifact, never merged.
- **Provenance (FR38).** The named starters (meals, physical activity, work-availability) are **domain content**, not platform mechanism: per FR38 (`../RULINGS.md`) they ship as production defaults **only after the founder builds each through the app**, proving any user could; **Claude/developers never author a starter**, and any starter that exists during development is **declared throwaway test scaffold**, rebuilt through the app before ship. Same authorship law the marketplace states for bundles (`../marketplace/SPEC.md §2`) — starters and bundles stay separate artifacts (above), but neither is developer-written.
- **Saved locations**: typed names ("home", "gym") resolve to stored addresses, editable in settings — so a place is typed once. These are ordinary stored facts the harness reads; the app just gives them a surface.

## §9. Non-goals (v1)

- **Calendar data flows in, never out** — founder ruling 2026-08-06. **Inbound is in scope**: the owner connects an outside calendar once, then brings updates in by asking. **annnä never pulls on its own** — no background poll, no watch, no timer. The stored connection credential is a **held credential, not a token class** — filing *this* credential in the token table at `../security/SPEC.md §3` is the specific error §3.1 forbids: annnä *mints* tokens to let others in, but *holds* this one to get into somewhere else, which reverses both the direction of trust and the blast radius. **That is a bar on this credential, never a bar on the table growing** — the table is extended by ruling and was, at FD-17, to admit a genuinely minted fifth class; §3.1's own list is the one that stays closed at two. It is vault-resident, **read scopes only**, revocable both ways, expiry shown and never retried (`../security/SPEC.md §3.1`). **Providers and connect UX — founder-ruled 2026-08-07 (wayfinder #10/#11):** v1 imports from **Google Calendar** (`calendar.readonly` — a Google-"sensitive" scope carrying an app-verification step at build time), **Microsoft Graph** (`Calendars.Read`), **Apple iCloud** (app-specific password over CalDAV — the industry-standard route; the credential is held under the same §3.1 custody), and **ICS/secret-link feeds**. The connect flow is **the console conversation** — the agent asks where the schedule lives and walks the connection; no settings wizard — and its copy stays at the industry-standard minimum, no disclosure beyond what the connection needs. **Outbound is banned**: no two-way sync, no write-back to an external calendar (`NOTES.md` OR-39, closed — carries Decision 2's split-truth argument; the legal export minimum stays `../security/SPEC.md §8` takeout). Outside commitments that are *not* brought in are still handled by **standing rules**, never a background sync.
- No native app shells (deferred, not rejected); no offline-first operation.
- No automated SMS / LINE / WhatsApp / WeChat / Messenger sending (v1 = email + the Generate-Link copy button; the stories' depicted auto-sends over those channels are the post-v1 product — `../user-stories/README.md` scope note).
- No in-app payment **rails** — money between users is tracked in the engine, never moved. Store transactions are a different lane, handled entirely by the closed marketplace service and **not specified in this repo** (`../marketplace/SPEC.md §5`); no transaction code, keys, or math enter here.
- No marketplace storefront logic beyond rendering `../marketplace/` catalog payloads (store surfaces are §7-class app-only views).
- No marketing site (separate artifact).
- No guest-side agent (harness law: there is no Harness 3).

## §10. Invariants ledger

| Invariant | Where constructed |
|---|---|
| No model call in any render or write path | §0 (generate-once); §4 (schema is stored data) |
| An un-vetted widget is unconstructable | §4 (unknown node type = rejected render) |
| A guest page cannot leak the board | §5 (the app never receives the Shared projection's complement) |
| A form return attributes to exactly one recipient | §5 (every way in mints a token bound to one party: **per-recipient** for named delivery, **single-visitor** behind a public entry link — G8) |
| The app cannot originate an outward message | §6 (delivery exists only downstream of a floor-gated harness act) |
| An outward send's addressee is a stored party's stored address — never a model literal, never a guess | §6 (D6) |
| Audit/read views cannot write | §7 (no write endpoints exist from them) |
| Surface identity is reported, not interpreted | §1 (canvas state → standing frame, mechanically) |
| The app never computes a correctness-critical value | §2 (all displayed values are handle projections) |
| Appearance is display-only — no engine input, no seam call carries it | §7 (the carve-out writes app settings only) |
| Guest pages are never skinned | §7 (+ §5 blindness — zero skin tokens on the guest wire) |
