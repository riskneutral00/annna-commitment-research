# annnä App — DESIGN (carried design law)

*The visual and interaction law for the surfaces in `SPEC.md`. Distilled from the prior build's design system, which survives as **design law only**; all behavior comes from this repo's four layers. Where the two conflicted, this repo won — see §Supersessions.*

*Provenance note: citations like `DESIGN:line` — and likewise `research/<name>.md:line` — point into the prior build at `~/Desktop/annnä/docs/`, a tree **outside this repo**, on the founder's machine. Both forms are traceability, not required reading: every law is stated in full here, and this file is self-sufficient for building. If a citation can't be resolved, nothing is lost. **No `research/` directory exists in this repo, and none is expected to** — a reader who greps for one has found the disclaimer, not a broken link.*

## Supersessions (deliberate reversals, 2026-08-05)

1. **Multi-route → one canvas.** The prior build was multi-route (Calendar / Plan / Account / Share as separate destinations — `DESIGN:768-769`). Superseded: former routes are **risers or islands** on the one canvas (`SPEC.md §1`). The guest page stays a separate token-URL route — it was never in the owner's nav (`DESIGN:769`, carried).
2. **"Parallel doors never compete" → console ever-present.** The prior build hid the console while the commitment form was open (`DESIGN:757`). Reversed on purpose: the console stays present during risers, so the owner can talk to the agent about the open thing.
3. **Centered modal → canvas riser.** The prior commitment form was a centered dialog (forced by the component library's `position` limitation — `DESIGN:636-638`, adoption plan `:378-387`). The riser keeps the **single overlay primitive** rule but with annnä's sink/rise motion. One overlay system, never three (`research/2026-07-astryx.md:218-221`).
4. **Skins gallery route → gallery riser.** The prior build put the skins gallery at a `/skins` route (`DESIGN:712`). Superseded by the one-canvas law (Supersession 1): the gallery is a **riser**, opened from the skins pop-out's "See all →". Its content law — every card previews the skin on the user's own live board — is carried unchanged (§Appearance).

## Canvas & photo

- The photo/wallpaper is a clipped, rounded **field panel**, not edge-to-edge; the ground beneath is a quiet derived gradient (`DESIGN:267-270, 705`).
- **No glass on the photo, ever** — no scrim, wash, or blur on the field itself; only chrome (blocks, islands, panes) carries glass (`DESIGN:705`).
- Empty day = raw photo. The canvas is allowed to be beautiful and empty (`DESIGN:727-728`).

## Appearance (the skin model)

*How the canvas gets its photo, and where the glass temperature comes from. Prior-build provenance: `DESIGN:701-712` (§2 Appearance model), plus the rulings named inline.*

> **PARTLY FROZEN 2026-08-08. Nothing here is deleted.**
> **Frozen:** everything that reaches the store — the gallery riser's entitlement states, paid packs, and any skin beyond the shipped set. Those wait on `../marketplace/`, which is frozen (`../marketplace/README.md`).
> **Not frozen, and load-bearing:** the shipped four + Plain, the glass-temperature derivation, boring mode, the fave-four pop-out, the no-flash landing, and the **Scope** rule that appearance is display-only and never reaches a seam or a guest page. Those are ordinary app law and are built with the app.
> **Resume condition:** the marketplace freeze lifts.
> **The freeze deletes no scenario and weakens no gate** — S1–S7 stand as written and gate-coverage still walks them.

- **Skin = photo pack + palette + derived glass.** A skin is a photo pack (`../assets/packs/<name>/`) whose approved `palette.json` derives the ambient ground gradient, the chrome accent, and the **glass temperature**. **The temperature derivation, exact:** glass = **warm** when the pack's `suggestedMode` is `light`, **dark** when it is `dark` — a rule computed from the stored field (written by the admin pipeline), never a per-name table; the shipped four are its worked examples (koi `light` → warm glass; dark, nudi and treestars `dark` → dark glass), and any future pack derives the same way (`../marketplace/SPEC.md §1.1` points here). Canvas-follows-photo *is* this derivation. The photo itself always runs raw inside the field panel (§Canvas & photo — no glass on the photo, ever).
- **The shipped set is permanent.** Exactly **dark · koi · nudi · treestars** ship in every build forever, plus **Plain** — a CSS ground, not a pack, and **never a picker row** (photo-off is boring mode's job). **Koi is the default.** New packs enter only through the admin pipeline (`../assets/make-pack.mjs`); there is no user upload path. Additional skins are **paid**, sold through `../marketplace/`.
- **Boring mode.** One press: photo off, solid content backing. Press again: the previous skin **and** opacity restore exactly — the stash persists across sessions. Picking any skin exits boring. The control is the wordless slashed-frame icon on the rail.
- **Island opacity.** 0–100, step 1, default 40; applied as `--fill = sqrt(v/100)`. The dial fades **fills only** — spines, borders and text keep full strength. The control is the droplet: slider plus a typed-exact field.
- **The fave four.** The skins pop-out lists only the owner's starred skins (1–4; no stars yet = the shipped four). Starring a fifth bumps the oldest (FIFO); unstarring the last is a no-op. **The pop-out never scrolls and never empties** — however large the marketplace grows, it stays at most four rows plus "See all →".
- **The gallery riser.** "See all →" rises the gallery: a card grid where **every card previews the skin on the owner's own live board** — real board, real week, re-tinted per that skin's palette (ruled the strongest single delight moment). Cards carry the star, and, for store skins, the entitlement state. Re-tinting is palette-token substitution — a display projection: zero model calls, zero computed values.
- **No-flash landing.** The last-painted appearance mirrors to local storage and seeds the first paint; a true first visit holds the ambient ground until settings answer. The app never paints a guessed skin and then corrects.
- **Scope.** Appearance is **display state only** — never an engine input, never carried on any seam, and never applied to guest pages (guests get the plain pre-AI form, unskinned).

## Glass ("breathing glass")

- **Two states, governed by attention, never by content.** Rest = **absolute glass** (lens warp + specular rim + shadow; no tint, no blur). Engaged = **clear frost** (light blur + saturate over a faint tint), triggered only by hover / focus-within / explicit engagement. Dwell ~100ms in / ~400ms out (`DESIGN:456-467, 491`).
- **Reading-surfaces law:** anything read or typed in takes deep frost; the console specifically uses **solid card backs** instead of deeper frost (`DESIGN:472-490`).
- **Glass-on-glass: never.** Panes float over canvas or photo, never over other glass (`DESIGN:564, 592-596`).
- **Closed material inventory.** The set of glass materials is enumerated; a class carrying `backdrop-filter` outside the named list is a build error (`DESIGN:184-201, 587-597`).
- Modal dim is **a whisper** (faint tint + slight blur), never the library's heavy default (`DESIGN:333-351`).
- Apple-style "always-alive" glass (pointer-chasing specular, gel elasticity) was evaluated and **rejected**: presence follows attention (`DESIGN:451-454`).

## Board rendering

- **The board never scrolls and has no time axis.** Time is block data, never position or size. Blocks stack from the top ("Tetris") (`DESIGN:415, 727-728`).
- **Uniform compact blocks** regardless of duration: title owns the line; start time is a 9px micro-mark top-right; the full range lives in the block's detail (`DESIGN:728`).
- Column overflow scrolls internally with a fading **`+N` chip** — the grid never grows (`DESIGN:729`).
- **The date row is the sole navigation**: click opens a month navigator; today is a pill, never a scroll position (`DESIGN:727, 730`).
- **Tasks are never grid blocks**: deadlines are urgency-colored due chips on the due day; the Plan riser is the task-centric peer surface. Color = urgency, never category (`DESIGN:736, 768`).
- Blocks **breathe**: at rest, structure only (spine + urgency edge + rim); text and fill wake on attention. Default wake policy is `none` (`DESIGN:537-543`).

## Islands & mobile

- **Controls live on floating glass islands, never in top nav bars** (`DESIGN:413-415`). Desktop: independently-anchored edge pills (`DESIGN:619-621, 732`); board-scoped controls may anchor the opposite edge from chrome-scoped ones (`DESIGN:713, 733`).
- **Mobile: one bottom glass bar in the thumb zone** replaces the rails (`DESIGN:734`). One compact breakpoint + one tablet band; any fixed geometry must state its compact behavior or it's a spec gap (`DESIGN:421-442`). **The values:** compact below **768px** viewport width; tablet band **768–1119px**; full from **1120px** — the only two thresholds any surface may branch on, named once here.
- Compact board = horizontal scroll-snap rack of day columns (phone ~3 visible, tablet ~7) (`DESIGN:734`).
- **Touch: first tap wakes, second tap opens.** Hidden controls are inert until revealed. 44px minimum touch targets on phone-reachable controls (`DESIGN:438-440, 734`; product-definition `:461`).

## Console

- A ~320px **draggable floating card** that minimizes to a header pill; solid card backs (reading surface).
- Present in every canvas state (Supersession 2).

## Proposal cards

- Anatomy: **tag chip → title → rule lines → optional meta strip → Confirm / Dismiss**; after confirm it collapses to a ✓ + one-line consequence (`DESIGN:738`).
- Any autonomy change is itself an explicit approve-card — never acquired silently (`DESIGN:739`).
- **Before/after variant**: for a standing-policy proposal the rule-lines slot renders two lines — current, then proposed — visually paired, and the card carries a third, quieter action alongside Confirm / Dismiss: **don't ask me again**. No new anatomy; the slot and the action strip already exist (behaviour: `../app/SPEC.md §3`, `../harness/SPEC.md §6`).
- **Pending-decision variant**: a card raised by an engine `PendingDecision` renders its engine-named choices **as the action strip** — the same strip, one action per choice, labelled with the engine's own words. No new anatomy, and no app-authored label (behaviour: `../app/SPEC.md §3`, `../engine/SPEC.md §1.14`).

## Motion & iconography

- **Restraint only**: short cross-fades for state changes; **no carousels, no parallax, no auto-playing or ambient animation** (`DESIGN:659, 783-785`). The riser's sink/rise is a transition, not an ambient effect.
- **SVG-only iconography**: no emoji glyphs, no vendor default UI (e.g. auth-provider buttons) on designed surfaces (`DESIGN:662`; DESIGN-NOTES `:103-105`).
- No testimonials / social-proof / pricing furniture on any product surface (`DESIGN:660-661`). No native browser date/time widget chrome in forms (`DESIGN:761-762`).

## Guest pages (visual law — added 2026-08-06; behavior: `SPEC.md §5`)

- **Bare substrate defaults, deliberately.** The guest page wears the design system's stock light theme — no skin, no glass, no photo, no custom tokens beyond the wordmark and the owner-chosen accent if the substrate carries one cleanly. The plainness *is* the design: a guest page should read as an ordinary trustworthy web form, not a branded product surface (Scope bullet above: appearance never applies to guests).
- **Mobile-first, one column.** The month view and the form stack single-column at every width; the compact/tablet thresholds above do not apply — there is nothing to re-arrange. Touch targets keep the 44px minimum.
- **The whole page states**: month view (open windows written into day cells) → day drill-in → form → plain confirmation, plus the honest dead end (`SPEC.md §5`). No other guest surface exists to design.

## Accessibility baseline (added 2026-08-06)

- **Target: WCAG 2.1 AA** on both audiences' surfaces — measured, not aspirational: contrast checks run against every shipped palette's derived tokens (the pipeline's accent-on-white check in `../assets/make-pack.mjs` is the seed of this gate), and the glass two-state rule must keep text ≥ AA contrast in *both* states, over the worst-case photo region behind it.
- **Keyboard and screen-reader floor:** every control reachable and operable without a pointer; risers trap and restore focus like the dialogs they are; the board's blocks expose their display projection as accessible text. First-tap-wakes applies to touch only — keyboard focus always wakes.
- **Reduced motion:** `prefers-reduced-motion` swaps sink/rise for a cross-fade — the restraint law above already forbids everything else that setting exists for.

## Language (chrome posture — added 2026-08-06)

The app's **chrome ships in English at v1** — a deliberate, stated scope line, not an omission. The product's *content* is language-plural from day one, under **two separate laws**: **utterances** are bounded by which models qualify (`../model/SPEC.md §6`), and **guest-facing copy** is bounded by the owner's stored language setting (`SPEC.md §5`, FR15) — guest form field copy is authored content, not chrome, and no model is in that loop. Chrome localization is deferred until a post-v1 pass; nothing in the token or catalog design may assume English string lengths.

## Design-system mechanics (must survive re-adoption)

The component substrate is **Astryx** (`INTERFACES.md §2`), adopted strictly per the 2026-07-25 ruling (product-definition `:495-533`): Astryx supplies the vocabulary, annnä supplies the values, and **glass is the one defended non-Astryx element**, applied via the documented `className` escape hatch — Astryx ships no blur/frost tokens.

- **Three-route customization split** (`research/2026-07-astryx.md:175-197`): **Route A** typed theme tokens (compile-error on breakage) · **Route C** own-CSS + `className` for surfaces annnä renders (most durable; where glass lives) · **Route B** the `components` string-map **only** for sub-parts annnä doesn't render, and only with a selector-liveness test (keys are unvalidated strings — silent dead selectors otherwise).
- **Pin the version; never fork or vendor components** (adoption plan `:42-46`). The only annnä-authored material CSS is the glass recipe.
- **Never approve the package's postinstall script** — it injects vendor blocks into root agent-docs files (DESIGN-NOTES `:191-194`).
- Load order: the library's CSS must be declared in an explicit layer **before** the utility framework's layers, or its base outranks utilities (adoption plan `:192-202`). `color-scheme` is set per skin-scope, not on `<html>` (adoption plan `:296-299`).
- **One overlay primitive** (the library's dialog) for every riser/modal; bridge its heavy backdrop to the whisper token (`research:218-221, 298-371`).
- Known churn at the pinned version: doc/class-name skew (docstrings say one class prefix, code emits another), unvalidated `components`-map keys (silent dead selectors), unprefixed global variant classes (collision hazard), preferred-not-hard widths, heavy default backdrop. **Re-measure all of these on any version bump** before merging. (Original measurements: the prior build's research doc, outside this repo — the list above is the complete checklist.)

## Standing rejections (never re-propose)

Apple-style always-alive glass · carousels/parallax/auto-play · testimonials & social-proof furniture · native date-widget chrome · multiple overlay systems · bespoke design system riding Astryx philosophy only ("Option 2") · emoji glyphs / vendor default UI · in-app payment rails (marketplace purchasing lives in the closed service — `../marketplace/SPEC.md §5`) · autonomous rescheduling · calendar sync / write-back UI (**rejected** — `NOTES.md` OR-39, closed 2026-08-06: outbound is banned, so there is no UI to design; import IN is in scope per `SPEC.md §9`) · native app shells (deferred, not rejected) · Astryx postinstall approval.
