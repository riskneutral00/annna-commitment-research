# annnä Marketplace — SCENARIOS (deterministic acceptance suite)

*Pass/fail, deterministic, replayable. Run against the service mock (`INTERFACES.md §5`) — never the real service. Derivations map to Situations **A** (Sofia — the "Free Time Available" ancestor) and **C** (Hug Ocean — the dive-bundle ancestor); no marketplace user-story exists yet, so these derive from the Situations as ancestors, not scripts. Every scenario is MUST. (Section letters are local to this file.)*

## F — Formats (the closed grammar)
- **F1 [no programs]** A bundle containing an executable-shaped payload (script string, event-handler, lifecycle hook) is **unrepresentable in the meta-schema** — it fails validation before the install door is ever reached.
- **F2 [off-menu rule refused]** A bundle carrying a rule shape not on the engine's closed menu is refused with the failing entry named — never stored, never a runtime path.
- **F3 [no people]** A bundle attempting to carry a counterparty, booking, history or personal-data record cannot express it: the fields do not exist. Asserted as schema-level unrepresentability, not as a runtime strip.
- **F4 [span floor]** The **"Free Time Available"** seed validates: one shared bookable-availability shape with blanked hours/duration/buffer. *(A: Sofia's outward slice, generalized.)*
- **F5 [span ceiling]** The **dive-center** seed validates: multi-resource shapes (instructor roster slots, boat, pool, gear), course kinds, governed rules with blanked operands. *(C: Hug Ocean's setup, generalized.)* **Unblocked 2026-08-06** — boat min-pax is now the engine's `min-occupancy` menu entry (`../engine/SPEC.md §3`), and the multi-day course shape is `KindTemplate` (`§1.12`). The seed is constructible.

## P — Publish
- **P1 [unpublish is safe]** Given an installed copy, when the upstream is unpublished or re-versioned, the installed copy is **byte-identical** afterward — fork isolation.
- **P2 [admin-only]** No user-reachable publish surface or endpoint exists — tested as absence (no route, no UI affordance), the D5 pattern from the app suite.

## I — Install
- **I1 [snapshot fork]** Installing writes a provenance-stamped local copy (`createdVia: install`, source id + version); no live link, no subscription record exists anywhere.
- **I2 [parameters via propose→confirm]** Installing "Free Time Available", the agent walks each blanked parameter as an ordinary proposal — *their* 30 minutes is their setting — and **nothing writes without confirm**. *(A: Sofia would have installed this instead of authoring from scratch.)*
- **I3 [validated at the door]** A tampered bundle (any F1/F2/F3 violation) is refused **whole**, with the failing entry named — no partial install.
- **I4 [installs compile to normal writes]** The post-install board state is byte-equivalent **in shape** to the same setup authored by hand through the console. *(C: an installed dive bundle equals the hand-built setup behind Hug Ocean's week.)*
- **I5 [uninstall keeps the past]** Uninstalling removes the source document only; every rule and commitment already confirmed stands unchanged.
- **I6 [authoring ≡ hand-authored; provenance gates shipping] `[MUST]`** A template **authored through the owner's agent** (the `SPEC.md §2` authoring path — generative-UI + rule writes + shared/resource shapes) validates as a bundle **byte-equivalent in shape to a hand-authored one** — the authoring twin of I4, mirroring engine `../engine/SCENARIOS.md` W5's agent-authored ≡ hand-authored principle. And a **production catalog default exists only if founder-authored through the app**: assert **no developer-authored bundle can be a shipped default** — provenance, not content, is what qualifies it. *(FR38's prove → save → ship path.)*

## E — Entitlements & degradation
- **E1 [entitled fetch]** An entitled account receives short-lived signed URLs for a store skin's derivatives; an unentitled account receives none — and the **palette-only preview still works** for both.
- **E2 [degrade to shipped]** Service unreachable → everywhere the app offers skins offers exactly the shipped four + Plain, full function. *(Drives `../app/SCENARIOS.md` S6.)*
- **E3 [installed survives outage]** Service unreachable → every installed template remains fully functional — installed is local forked data.
- **E4 [nothing licensed leaks]** No licensed derivative URL is long-lived, reusable by another account, or present in any public artifact (repo, client bundle, cache header that outlives the signature).
- **E5 [withdrawn entitlement deactivates at the next check] `[MUST]`** *Given* an account entitled to a store skin, with that skin **active and in a fave slot** and its pack persisted on-device, *when* the closed service withdraws the entitlement and the next entitlement check occurs (skin activation, or app open), *then* the skin **deactivates**, its **fave slot clears**, and appearance falls back to the shipped four + Plain. Assert the **device copy is not deleted**, and assert **no reason for the withdrawal crosses the seam** — the open half observes entitlement state only (`SPEC.md §5`). *(FR14.)*
- **E6 [offline never revokes] `[MUST]`** *Given* the same withdrawn entitlement, *when* the service is unreachable so no check can complete, *then* the last-known entitlement stands and the skin keeps rendering at full function — no flash, no error wall, no outage-triggered downgrade. Revocation lands on the **next successful check**, never on a failed one. *(FR14 × the degradation law; guards `../app/SCENARIOS.md` S4/S6.)*

- **E7 [no board ledger write]** Exercising the store's entitlement and transaction surface against the service mock produces **zero** writes to any board money record — asserted as absence across the ledger tables, not as a balance check. The store is a different lane from value between users on boards (`SPEC.md §5`; the invariant is indexed in `SPEC.md §8`).

## D — Discovery
- **D1 [category at publish]** Every published item carries exactly one admin category + tags; the browse riser groups by them.
- **D2 [featured is curated]** A featured shelf shows only admin-flagged items; **no computed ranking exists in v1** — asserted as absence.
- **D3 [preview per good]** A skin card renders the owner's own board re-tinted; a template card renders the proposal-card anatomy + the ghost guest page from the owner's **real** availability — both display projections, zero writes, watermarked preview.
- **D4 [popularity reserved]** The catalog document carries the `popularity` field; no v1 surface sorts by it — asserted as format presence + UI absence.

## Z — Integration (the two seeds, end-to-end)
- **Z1 [seed round-trips]** With harness, engine and app real: a Sofia-shaped account installs "Free Time Available" → publishes a link → a booking lands and appears on the board. A Hug-shaped account installs the dive bundle → the setup that Situation C's clean run (`situation-1.md`) begins from exists on the board. *(A + C.)* **Both halves unblocked 2026-08-06** — the dive-bundle half's two blockers (F20 → `min-occupancy`, F7 → `KindTemplate`) are ruled and specified in `../engine/SPEC.md`.

---

**Coverage map (rulings → scenarios):** closed grammar / no programs → F1, I3 · closed rule menu → F2 · people never travel → F3 · format spans the seed catalog → F4–F5 · fork isolation / unpublish-safe → P1, I1 · admin-only supply → P2 · install is authoring (propose→confirm, floor untouched) → I2, I4 · authoring ≡ hand-authored + provenance-gated shipping (FR38) → I6 · rules-never-rewrite-the-past → I5 · licensed IP behind entitlements → E1, E4 · degradation to the shipped floor → E2–E3 · withdrawn entitlement, and never on a failed check → E5–E6 · the store lane never touches board money → E7 · minimal discovery / popularity reserved → D1–D4 · Situations A & C as ancestors → F4/F5, I2/I4, Z1. *The formerly-flagged gap is closed: the install-run probes exist — `../user-stories/Situations/Situation-A-prime/` (solo half: suggestion, ghost preview, blanked-parameter install, uninstall, publish-refusal) and `../user-stories/Situations/Situation-C-prime/` (multi-resource half: empty-account stand-up, tampered-bundle door refusal), authored 2026-08-07 from the wayfinder #6 domain-brief rulings.*
