# annnä App — DESIGN (the reserved visual law)

*What this file is, since 2026-09-17 (FD-110).* Three things are law here: **the photograph as the canvas, the skin model that dresses it, and the glass the chrome is made of.** They are kept because they are the product's one visual idea — a schedule resting on a picture — and because the skin marketplace is built on them. **Everything else a visual law would say is reserved, not delegated.** The founder is bringing an official design and product scheme — tokens, type, colour, layout, components, motion, identity — and every section below marked *reserved* is where that scheme lands. Until it lands, **nothing here decides those things and a builder must not invent them.** The app's visual build steps carry a precondition on FD-110 for exactly that reason (`BUILD.md` Steps 1–3 and 5): they build the canvas, the skin mechanism and the glass, and stop.

*What was here before is in git history at the commit that made this cut. The rulings it rested on are struck at `../RULINGS.md` (FD-20, FD-22, FD-23, FD-39, FD-40, FD-44, FD-70, FD-81; FD-41 and FD-42 narrowed) and the constraints that were never taste — accessibility, self-hosted fonts, no ambient motion, English chrome at v1 — moved to `SPEC.md §11`, where any scheme must satisfy them.*

## Canvas & photo

- The photo/wallpaper is a clipped, rounded **field panel**, not edge-to-edge; the ground beneath is a quiet derived gradient.
- **No glass on the photo, ever** — no scrim, wash, or blur on the field itself; only chrome (blocks, panels, plates) carries glass.
- Empty day = raw photo. The canvas is allowed to be beautiful and empty.
- **An empty day is not a gap — it is the picture, uninterrupted.** Most scheduling software treats the grid as the product and the week as something to fill; annnä inverts it, and every rule in this file is downstream of that inversion.
- **An unloaded day is not an empty day** *(2026-09-12)*: a date range the app has not loaded renders its unknown, loading or stale state, never the bare photograph that means *nothing is here* (`SPEC.md §1.1`, `SPEC.md §2`). The picture is what an empty week earns; it is never the cover over an unanswered one.

### Text on the photograph

*Where text sits over the field with no panel under it, neither ink alone nor a backing box is available. This is what carries it, and it is a legibility mechanism over the photograph rather than a typographic choice — which is why it stays.*

- **A halo is always the opposite of its own ink**, derived from the text it surrounds and **never from the skin or the mode.** Measured on koi: the ink scores **7.5:1** over the photograph's brightest regions and **1.2:1** over its darkest, so *neither colour survives the whole photograph alone*; the halo carries precisely the region the ink loses — white halo against dark ink is **17.6:1**. It can only do that job while the two oppose. A white halo around white text measures **1.00:1** — no separation at all, which is the defect this rule exists to prevent.
- **A ground treatment changes density, never hue.** An accent-tinted scrim was built and killed: the accent belongs to meaning, not to a backing surface. This does not reopen *no glass on the photo* — a density field sits behind **text on a panel**, never over the field itself.

## Appearance (the skin model)

*How the canvas gets its photo, and where the **veil** — the tint every glass surface is made of — comes from.*

> **PARTLY FROZEN 2026-08-08. Nothing here is deleted.**
> **Frozen:** everything that reaches the store — the gallery's entitlement states, paid packs, and any skin beyond the shipped set. Those wait on `../marketplace/`, which is frozen (`../marketplace/README.md`).
> **Not frozen, and load-bearing:** the shipped four + Plain, the veil derivation, boring mode, the fave-four pop-out, the no-flash landing, and the **Scope** rule that appearance is display-only, never engine truth, reaches a guest page never, and reaches a seam only through the app-owned `display_settings(diff)` class (**FD-66**). Those are ordinary app law and are built with the app.
> **Resume condition:** the marketplace freeze lifts.
> **The freeze deletes no scenario and weakens no gate** — S1–S8 stand as written and gate-coverage still walks them.

- **Skin = photo pack + palette + derived glass.** A skin is a photo pack (`../assets/packs/<name>/`) whose approved `palette.json` derives the ambient ground gradient, the chrome accent, and the **veil** — the tint every glass surface in §Glass is made of. Canvas-follows-photo *is* this derivation. The photo itself always runs raw inside the field panel (§Canvas & photo — no glass on the photo, ever).
- **The veil derivation, exact.** **By mode, one law in two directions**: a **dark** pack solves the veil so a plate composited over the photograph's **brightest** region does not exceed `rgb(92)`; a **light** pack solves so the composite over the photograph's **darkest** region does not **fall below** the value at which the pack's ink clears the engaged AA floor; each branch binds its own worst case. Then carry **18% of the pack's `DarkMuted`** so it reads as tinted rather than grey. Each branch reads its own extreme from the stored pair — the dark branch **`brightestRegion`**, the light branch **`darkestRegion`** (`../marketplace/SPEC.md §1.1`'s sixteenth stored field), both measured and written by the admin pipeline (`../assets/make-pack.mjs`) — never a per-name table, and **a darker photograph gets a lighter veil**, because it has less to give. `suggestedMode` selects the skin's ink and which side of §Glass's light/dark density pair applies; it does not select the veil. Any future pack derives the same way (`../marketplace/SPEC.md §1.1` points here), **and the install door runs the floors**: a pack whose derived ink or veil misses the AA floors over its own `brightestRegion` and `darkestRegion` (both stored — a bought skin runs its own install floors) is refused at install, exactly as one missing a schema field is — the AA promise on installed skins is a gate, not a memo (`SPEC.md §11`).

  | pack | `luminance` | veil | surviving photo signal | contrast vs ink |
  |---|---|---|---|---|
  | koi | 0.47 | `255,255,255` | — | — |
  | dark | 0.03 | `81,82,85` | 28 | 6.7:1 |
  | nudi | 0.18 | `73,75,78` | 20 | 6.7:1 |
  | treestars | 0.36 | `51,53,56` | 46 | 6.2:1 |

  *(The table records the finding, never values — the four veils were hand-tuned against these masters and are superseded by the formula, which the fixtures re-derive from the stored region pair.)*

  **Why a two-value switch was wrong — kept, because it is the obvious thing to re-propose.** A switch put white over light skins and near-black over dark ones. Measured over the real masters, the same amount of photograph survived in every case, but on the dark skins the result landed at or below a display's practical black floor in a lit room. **The variation existed and could not be seen.** `dark` (`luminance 0.03`, `colorfulness 0.13`) stays the weakest case and no veil fixes that — on that skin the material recedes, and that is honest rather than broken.
- **No skin is special — the shipped packs are fixtures, not canon** *(founder-ruled 2026-08-22: "the 4 skins are just random things I'm using for the sake of inspiration; idk if I'll ship them in production")*. **No token, table or constant may name a pack**; every skin-dependent value derives from the pack's stored measurements, so whichever packs ship — and whatever the marketplace later sells — take one mechanism. **Plain** stays: a CSS ground, not a pack, never a picker row (photo-off is boring mode's job). **Koi is the default until the founder picks a shipping set.** New packs enter only through the admin pipeline (`../assets/make-pack.mjs`); there is no user upload path. Additional skins are the marketplace's goods, and they become **purchasable** only when the closed-service lane opens — a readiness condition and never a date, whose home is `../marketplace/SPEC.md §5`; until then an account is entitled to one by the admin path alone, and the shipped set stays the free built-in one (`../assets/README.md`).
- **Boring mode.** One press: photo off, solid content backing. Press again: **the whole display-settings set restores exactly** — the stash persists across sessions. Picking any skin exits boring. Where its control lives is the design scheme's.
  - **The stash is defined by reference, never enumerated here.** It is whatever `SPEC.md §7` lists as display-only state, in full, and **a member added there is stashed automatically**. An inventory restated in two files is two things to forget; FR13's one-normative-home rule applies to inventories exactly as it does to laws.
- **Two opacity dials, kept apart and never merged.** Both are 0–100, step 1, applied as `--fill = sqrt(v/100)`, and both fade **fills only** — spines, borders and any text mark keep full strength. Where their controls live and how they are stepped is the design scheme's.
  - **Chrome dial — default 40.** Console and pop-out fill.
  - **Board dial — default 80.** Day-block fill and ink. *(The attention-and-scope mechanism that once rode this dial retired with the visual law, FD-110. It is a plain opacity setting until the design scheme says otherwise.)*

  One asks how loud the furniture is; the other asks how much of the week the owner is asked to read. A single dial cannot answer both.
- **The fave four.** The skins pop-out lists only the owner's starred skins (1–4; no stars yet = the shipped four). Starring a fifth bumps the oldest (FIFO); unstarring the last is a no-op. **The pop-out never scrolls and never empties** — however large the marketplace grows, it stays at most four rows plus "See all →".
- **The gallery.** "See all →" opens the gallery: a card grid where **every card previews the skin on the owner's own live board** — real board, real week, re-tinted per that skin's palette. Cards carry the star, and, for store skins, the entitlement state. Re-tinting is palette-token substitution — a display projection: zero model calls, zero computed values.
- **No-flash landing.** The last-painted appearance mirrors to local storage and seeds the first paint; a true first visit holds the ambient ground until settings answer. The app never paints a guessed skin and then corrects.
- **Scope.** Appearance is **display state only** — never an engine input, never engine truth, and never applied to guest pages (guests get the plain request form and scoped console, unskinned). Its **one** seam path is the app-owned `display_settings(diff)` class (**FD-66** — the home is `SPEC.md §7`), which carries display state and nothing else.

## Glass — one glass, three densities ("breathing glass")

*Ruled 2026-08-09 (FD-21), and the one visual ruling that stands whole. The material is **one glass**; `panel`, `plate` and `block` are three amounts of it, not three materials. An opaque **paper** for reading surfaces was built and rejected by the founder on sight — an opaque console reads as a dialog box pasted onto the photograph. What replaced it is simply **more of the same glass**, and the veil derivation (§Appearance) is what makes that legible.*

| | density — light skin / dark skin | where | lens |
|---|---|---|---|
| **panel** | `0.12` / `0.24` | the bodies of the console and of any surface that opens over the board | yes |
| **plate** | `0.78` / `0.60` | anything a value is read off, or a control is pressed on | no |
| **block** | `0 → 0.62` / `0 → 0.55`, by the board dial | day blocks | no |

*(The panel and plate values and the blur pair — **4px at rest / 10px engaged** — are the glass half of FD-41, which stands; the shipped pack veils are solved against these plate alphas.)*

**Attention**

- **Findable at rest, readable when engaged.** Two requirements, and only the second is about reading. A container at rest must be legible **as an object** — its body and boundary discoverable without hunting — and it need **not** be readable. Engagement makes it readable, and that is the reaction's entire job. A container with no body at rest is not findable, and the contents then read as a floating island of text with nothing under them.
- **Engaging always makes a surface *more* frosted, never less.** Attention adds material — 4px at rest, 10px engaged. The inverse was built once and read correctly as gratuitous.
- **Dwell is asymmetric: ~100ms in, ~400ms out**, so a drive-by never engages and a deliberate approach does. Triggered by hover / focus-within / explicit engagement, **never by content**.
- **Blocks breathe; containers wake.** A block is small, numerous and glanced at; a console is read. **The material is chosen by task — glance, read, control — never by element type.**
- **A form is never see-through** *(founder-ruled 2026-08-21, FD-38)*. Findable-at-rest is a rule for surfaces that **wait** (the console). A form the owner **summoned** to read and type in opens engaged and stays engaged; there is no resting state to design. Built the other way once and rejected on sight.

**The lens**

- A per-pane SVG `feDisplacementMap` whose map is a runtime canvas: a signed-distance field over the pane's rounded rect, displacement vectors pointing outward inside a **26px** rim band with a `t²` falloff, **scale 130**.
- **Panels only.** Refraction is the identity of the material and also the expensive part. Six panels can each bend the photograph beautifully; fifty blocks each bending a different patch turn the photograph to soup and cost a great deal of GPU for the privilege.
- **Never mix the `url()` reference with function filters in one `backdrop-filter` list** — Chromium renders the mix as smear. The whole chain stays inside the SVG filter, or the states swap whole `backdrop-filter` values.
- **The lens is a Chromium bonus and never a requirement.** Safari and Firefox ignore SVG backdrop filters and get the same material with a plain blur. No second material is designed for them — veil, halo, glow and specular are all filter-independent.

**Laws that bind every glass surface**

- **A container may never be lighter than its contents.** An opaque bubble inside a transparent shell makes the bubble the object and the shell nothing. Contents are the same substance as their container, told apart by **tone and hairline, never by opacity**.
- **A density field has no edges.** Any ground treatment falls off on **all four sides** and bleeds into its neighbours. A gradient that terminates on any axis reintroduces the rectangle, and a rectangle is furniture.
- **Fix the ground or fix the ink — never add furniture.** Bands, bars, chips behind headings and grouped section cards were all built and all rejected.
- **A text treatment never touches an element that already has a body.** A halo, a stroke or a plate on a filled button destroys its letters.
- **Glass-on-glass: never.** Panes float over canvas or photo, never over other glass.
- **Closed material inventory.** The three densities above are the whole set; a class carrying `backdrop-filter` outside the named list is a build error (the automatable half of the design-law checklist — `../TDD.md`).
- Modal dim is **a whisper** (faint tint + slight blur), never a heavy library default.
- **Apple's Liquid Glass is the stated inspiration, and we take the material, not the behaviour.** Kept: refraction, a specular that answers a light source, depth, and a tint that adapts to what is behind it. Refused: **pointer-chasing specular and gel elasticity** — because *the material scales differently at fifty elements than at six*. Apple puts Liquid Glass on a handful of controls; a board holds fifty blocks, and fifty continuously-alive lensing surfaces destroy the photograph they exist to reveal.
- **And there is one thing annnä can do that Apple cannot.** Apple must sample the wallpaper at runtime, because it cannot know what is behind the glass. annnä ships photographs, each with a measured `palette.json`, so **the veil is solved before the frame renders** (§Appearance). That is the reason the material works on a nearly-black photograph at all.

## Tokens (reserved — owed from the design scheme)

*The design scheme supplies the token set: spacing scale, radii and corner rule, the material constants beyond §Glass, and how tokens are authored and derived per skin. Nothing here decides it. When it lands, the tokens file is `app/tokens.json` beside this file, and `../deployment/scripts/hex-source.mjs` reads it as a colour source.*

## Typography (reserved — owed from the design scheme)

*The design scheme supplies the face, the ramp and the figure rules. Nothing here decides it. What any choice must satisfy is `SPEC.md §11`: self-hosted and subset, never a third-party host on a guest page, a 16px floor for guest body text, and every text-bearing size authored so platform zoom scales it.*

## Colour (reserved — owed from the design scheme)

*The design scheme supplies the palette, the urgency marks, the accent and any state colour. Nothing here decides it. Two things it must keep: **every colour derives from or is measured against the active skin** (a constant that ignores the photograph fails on the skin it was not checked on), and **urgency is two channels, never colour alone** (`SPEC.md §11`).*

## Layout & board (reserved — owed from the design scheme)

*The design scheme supplies how the board lays out its blocks, how it scrolls, what it does on a phone, and what a block shows at rest. Nothing here decides it. The behavioural law it must not break is `SPEC.md §2`: every commitment on a displayed day is present, nothing is hidden by a legibility mechanism, time and availability are never computed by the app, and a display filter changes the view and nothing under it.*

## Components (reserved — owed from the design scheme)

*The design scheme supplies the console, the forms that open over the board, the cards, the guest pages and the mobile treatment. Nothing here decides it. What any component must satisfy is `SPEC.md §3` and §5 for behaviour, §Glass for material, and §11 for accessibility.*

## Motion & iconography (reserved — owed from the design scheme)

*The design scheme supplies the motion inventory and the icon set. Nothing here decides it. The constraints stand at `SPEC.md §11`: no ambient or auto-playing motion, motion never carries information alone, and reduced-motion loses nothing.*

## Identity & brand (reserved — owed from the design scheme)

*The wordmark, the mark, the voice and the vision live at `../BRAND.md`, which is reserved the same way. Appearance law reaches none of it.*
