# annnä App — DESIGN

*Blank by ruling (FD-110, 2026-09-17), except for the glass and the skins.* The founder is bringing an official design and product scheme — tokens, type, colour, layout, components, motion, identity. It lands in the reserved sections below and at `../BRAND.md`. **Until it does, nothing in this repository decides how the app looks, and a builder does not invent it**: `BUILD.md` Steps 1, 2, 3 and 5 are blocked on FD-110 and build the canvas, the skin mechanism and the glass only. The two sections that carry law are §Appearance and §Glass; §Canvas & photo carries the one rule the glass needs about the photograph.

## Canvas & photo

- The photograph is the canvas. **No glass on the photo, ever** — no scrim, wash, or blur on the photograph itself; only chrome carries glass.
- An empty day is the raw photograph. The canvas is allowed to be beautiful and empty.

## Appearance (the skin model)

*How the canvas gets its photo, and where the **veil** — the tint every glass surface is made of — comes from.*

> **PARTLY FROZEN 2026-08-08. Nothing here is deleted.**
> **Frozen:** everything that reaches the store — entitlement states, paid packs, and any skin beyond the shipped set. Those wait on `../marketplace/`, which is frozen (`../marketplace/README.md`).
> **Not frozen, and load-bearing:** the shipped four + Plain, the veil derivation, boring mode, the no-flash landing, and the **Scope** rule that appearance is display-only, never engine truth, reaches a guest page never, and reaches a seam only through the app-owned `display_settings(diff)` class (**FD-66**). Those are ordinary app law and are built with the app.
> **Resume condition:** the marketplace freeze lifts.
> **The freeze deletes no scenario and weakens no gate** — S1–S8 stand as written and gate-coverage still walks them.

- **Skin = photo pack + palette + derived glass.** A skin is a photo pack (`../assets/packs/<name>/`) whose approved `palette.json` derives the ambient ground gradient, the chrome accent, and the **veil** — the tint every glass surface in §Glass is made of. Canvas-follows-photo *is* this derivation. The photo itself always runs raw (§Canvas & photo).
- **The veil derivation, exact.** **By mode, one law in two directions**: a **dark** pack solves the veil so a plate composited over the photograph's **brightest** region does not exceed `rgb(92)`; a **light** pack solves so the composite over the photograph's **darkest** region does not **fall below** the value at which the pack's ink clears the engaged AA floor; each branch binds its own worst case. Then carry **18% of the pack's `DarkMuted`** so it reads as tinted rather than grey. Each branch reads its own extreme from the stored pair — the dark branch **`brightestRegion`**, the light branch **`darkestRegion`** (`../marketplace/SPEC.md §1.1`'s sixteenth stored field), both measured and written by the admin pipeline (`../assets/make-pack.mjs`) — never a per-name table, and **a darker photograph gets a lighter veil**, because it has less to give. `suggestedMode` selects the skin's ink and which side of §Glass's light/dark density pair applies; it does not select the veil. Any future pack derives the same way (`../marketplace/SPEC.md §1.1` points here), **and the install door runs the floors**: a pack whose derived ink or veil misses the AA floors over its own `brightestRegion` and `darkestRegion` (both stored — a bought skin runs its own install floors) is refused at install, exactly as one missing a schema field is.

  | pack | `luminance` | veil | surviving photo signal | contrast vs ink |
  |---|---|---|---|---|
  | koi | 0.47 | `255,255,255` | — | — |
  | dark | 0.03 | `81,82,85` | 28 | 6.7:1 |
  | nudi | 0.18 | `73,75,78` | 20 | 6.7:1 |
  | treestars | 0.36 | `51,53,56` | 46 | 6.2:1 |

  *(The table records the finding, never values — the four veils were hand-tuned against these masters and are superseded by the formula, which the fixtures re-derive from the stored region pair. A two-value light/dark switch was tried first and was wrong: on dark skins it landed at or below a display's practical black floor, and the variation could not be seen.)*
- **No skin is special — the shipped packs are fixtures, not canon** *(founder-ruled 2026-08-22: "the 4 skins are just random things I'm using for the sake of inspiration; idk if I'll ship them in production")*. **No token, table or constant may name a pack**; every skin-dependent value derives from the pack's stored measurements, so whichever packs ship — and whatever the marketplace later sells — take one mechanism. **Plain** stays: a CSS ground, not a pack (photo-off is boring mode's job). **Koi is the default until the founder picks a shipping set.** New packs enter only through the admin pipeline (`../assets/make-pack.mjs`); there is no user upload path. Additional skins are the marketplace's goods, and they become **purchasable** only when the closed-service lane opens — a readiness condition and never a date, whose home is `../marketplace/SPEC.md §5`; until then an account is entitled to one by the admin path alone, and the shipped set stays the free built-in one (`../assets/README.md`).
- **Boring mode.** Photo off, solid content backing; off again, **the whole display-settings set restores exactly** — the stash persists across sessions. Picking any skin exits boring. The stash is defined by reference: it is whatever `SPEC.md §7` lists as display-only state, in full, and a member added there is stashed automatically.
- **Two opacity dials, kept apart and never merged.** Both are 0–100, step 1, applied as `--fill = sqrt(v/100)`, and both fade **fills only**. **Chrome dial — default 40**: console and pop-out fill. **Board dial — default 80**: day-block fill and ink. One asks how loud the furniture is; the other asks how much of the week the owner is asked to read. Where their controls live is the design scheme's.
- **Previewing a skin shows the owner's own board.** Any skin preview renders the owner's real board, real week, re-tinted per that skin's palette — a display projection: zero model calls, zero computed values. Which skins are offered and how is the design scheme's.
- **No-flash landing.** The last-painted appearance mirrors to local storage and seeds the first paint; a true first visit holds the ambient ground until settings answer. The app never paints a guessed skin and then corrects.
- **Scope.** Appearance is **display state only** — never an engine input, never engine truth, and never applied to guest pages (a guest page is unskinned, S7). Its **one** seam path is the app-owned `display_settings(diff)` class (**FD-66** — the home is `SPEC.md §7`), which carries display state and nothing else.

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

## Tokens

*Reserved. Owed from the design scheme; tokens land at `app/tokens.json`. Nothing here decides it.*

## Typography

*Reserved. Owed from the design scheme. Nothing here decides it.*

## Colour

*Reserved. Owed from the design scheme. Nothing here decides it.*

## Layout & board

*Reserved. Owed from the design scheme. Nothing here decides it.*

## Components

*Reserved. Owed from the design scheme. Nothing here decides it.*

## Motion & iconography

*Reserved. Owed from the design scheme. Nothing here decides it.*

## Identity & brand

*Reserved. Lives at `../BRAND.md`, which is owed the same way. Nothing here decides it.*
