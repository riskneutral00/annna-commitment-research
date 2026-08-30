# annnä App — DESIGN (the visual and interaction law)

*The visual and interaction law for the surfaces in `SPEC.md`. All behavior comes from this repo's four layers. Where this file and the repo's behavioral law once conflicted, the repo won — see §Supersessions.*

> **The prior build was released as law, 2026-08-09 (FD-20).** `~/Desktop/annnä` is **inspiration, not authority.** Its class names, its material inventory, its two-state glass rule and its board laws bind nothing here. What survives from it survives because it was **re-ruled in the 2026-08-09 UI/UX sitting**, or because it was always this repo's own — the guest-page visual law, the accessibility baseline, the chrome-language posture, the appearance model and the shipped skins, and the design-system mechanics. **Where a `DESIGN:line` citation sits beside a rule below, read it as where the idea came from, never as why the rule holds.** Sections re-ruled that day carry no such citation, deliberately.
>
> Working record of the sitting, **outside this repo and holding no authority**: `_bmad-output/planning-artifacts/ux-designs/ux-annna-2026-08-08/` (its `.memlog.md` is the transcript, its `DESIGN.md`/`EXPERIENCE.md` the drafts). Every rule below is stated in full here; nothing is lost if that path does not resolve.

*Provenance note: citations like `DESIGN:line` — and likewise `research/<name>.md:line` — point into the prior build at `~/Desktop/annnä/docs/`, a tree **outside this repo**, on the founder's machine. Both forms are traceability, not required reading: every law is stated in full here, and this file is self-sufficient for building. If a citation can't be resolved, nothing is lost. **No `research/` directory exists in this repo, and none is expected to** — a reader who greps for one has found the disclaimer, not a broken link. **The a11y `A-series` ids (A1–A19) scattered through this file take the same status** *(declared 2026-08-29)*: they label findings from the accessibility sitting whose record lives outside this repo, there is **no in-repo A-series registry**, and none is expected. Each rule they annotate is stated in full where it sits, so an unresolved `A#` costs a reader nothing — it is provenance, exactly as `DESIGN:line` is.*

## Supersessions (deliberate reversals, 2026-08-05)

1. **Multi-route → one canvas.** The prior build was multi-route (Calendar / Plan / Account / Share as separate destinations — `DESIGN:768-769`). Superseded: former routes are **risers or islands** on the one canvas (`SPEC.md §1`) — except **Plan**, which is neither: it was retired outright on 2026-08-09 when tasks became ordinary board blocks (FD-23, §Board rendering). The guest page stays a separate token-URL route — it was never in the owner's nav (`DESIGN:769`, carried).
2. **"Parallel doors never compete" → console ever-present.** The prior build hid the console while the commitment form was open (`DESIGN:757`). Reversed on purpose: the console stays present during risers, so the owner can talk to the agent about the open thing.
3. **Centered modal → canvas riser.** The prior commitment form was a centered dialog (forced by the component library's `position` limitation — `DESIGN:636-638`, adoption plan `:378-387`). The riser keeps the **single overlay primitive** rule but with annnä's sink/rise motion. One overlay system, never three (`research/2026-07-astryx.md:218-221`).
4. **Skins gallery route → gallery riser.** The prior build put the skins gallery at a `/skins` route (`DESIGN:712`). Superseded by the one-canvas law (Supersession 1): the gallery is a **riser**, opened from the skins pop-out's "See all →". Its content law — every card previews the skin on the user's own live board — is carried unchanged (§Appearance).

## Canvas & photo

- The photo/wallpaper is a clipped, rounded **field panel**, not edge-to-edge; the ground beneath is a quiet derived gradient (`DESIGN:267-270, 705`).
- **No glass on the photo, ever** — no scrim, wash, or blur on the field itself; only chrome (blocks, islands, panes) carries glass (`DESIGN:705`).
- Empty day = raw photo. The canvas is allowed to be beautiful and empty (`DESIGN:727-728`).
- **An empty day is not a gap — it is the picture, uninterrupted.** Most scheduling software treats the grid as the product and the week as something to fill; annnä inverts it, and every rule in this file is downstream of that inversion.

### Text on the photograph (added 2026-08-09)

*Where text sits over the field with no panel under it — the date row, the collapsed console pill, a block's micro-mark — neither ink alone nor a backing box is available. This is what carries it.*

- **A halo is always the opposite of its own ink**, derived from the text it surrounds and **never from the skin or the mode.** Measured on koi: the ink scores **7.5:1** over the photograph's brightest regions and **1.2:1** over its darkest, so *neither colour survives the whole photograph alone*; the halo carries precisely the region the ink loses — white halo against dark ink is **17.6:1**. It can only do that job while the two oppose. A white halo around white text measures **1.00:1** — no separation at all, which is the defect this rule exists to prevent and which the sitting shipped once before catching it.
- **Weight is load-bearing, not stylistic.** Headings run heavy because thick strokes survive low contrast over a photograph — the same finding as the halo, applied to the glyph instead of around it.
- **A ground treatment changes density, never hue.** An accent-tinted scrim was built and killed: the accent belongs to meaning, not to a backing surface. This does not reopen *no glass on the photo* — a density field sits behind **text on a panel**, never over the field itself.

## Appearance (the skin model)

*How the canvas gets its photo, and where the **veil** — the tint every glass surface is made of — comes from. Prior-build provenance: `DESIGN:701-712` (§2 Appearance model), plus the rulings named inline. The veil derivation below is **not** carried from it; it replaced the prior build's two-value glass-temperature switch on 2026-08-09.*

> **PARTLY FROZEN 2026-08-08. Nothing here is deleted.**
> **Frozen:** everything that reaches the store — the gallery riser's entitlement states, paid packs, and any skin beyond the shipped set. Those wait on `../marketplace/`, which is frozen (`../marketplace/README.md`).
> **Not frozen, and load-bearing:** the shipped four + Plain, the glass-temperature derivation, boring mode, the fave-four pop-out, the no-flash landing, and the **Scope** rule that appearance is display-only, never engine truth, reaches a guest page never, and reaches a seam only through the app-owned `display_settings(diff)` class (**FD-66**). Those are ordinary app law and are built with the app.
> **Resume condition:** the marketplace freeze lifts.
> **The freeze deletes no scenario and weakens no gate** — S1–S7 stand as written and gate-coverage still walks them.

- **Skin = photo pack + palette + derived glass.** A skin is a photo pack (`../assets/packs/<name>/`) whose approved `palette.json` derives the ambient ground gradient, the chrome accent, and the **veil** — the tint every glass surface in §Glass is made of. Canvas-follows-photo *is* this derivation. The photo itself always runs raw inside the field panel (§Canvas & photo — no glass on the photo, ever).
- **The veil derivation, exact** *(2026-08-09; amended 2026-08-22 — the substrate spike proved the shipped values were hand-tuned and fit no function of the stored fields, and the a11y pass proved the one-direction solve inverts on light packs)*. **By mode, one law in two directions** *(a11y A2)*: a **dark** pack solves the veil so a plate composited over the photograph's **brightest** region does not exceed `rgb(92)`; a **light** pack solves so the composite over the photograph's **darkest** region does not **fall below** the value at which the pack's ink clears the engaged AA floor *(branch re-cut 2026-08-22: it previously solved over the brightest region — the loosest extreme of its own constraint, so every darker region composited below the solved floor and A12's two-extreme door refused the derivation's own output, koi included; each branch now binds its own worst case)*. Then carry **18% of the pack's `DarkMuted`** so it reads as tinted rather than grey. Each branch reads its own extreme from the stored pair — the dark branch **`brightestRegion`**, the light branch **`darkestRegion`** (`../marketplace/SPEC.md §1.1`'s sixteenth stored field), both measured and written by the admin pipeline *(the V1 fix; its code half landed in `../assets/make-pack.mjs`)* — never a per-name table, and **a darker photograph gets a lighter veil**, because it has less to give. `suggestedMode` still selects the skin's ink and which side of §Glass's light/dark density pair applies; it no longer selects the veil. Any future pack derives the same way (`../marketplace/SPEC.md §1.1` points here), **and the install door runs the floors** *(a11y A12)*: a pack whose derived ink, veil or urgency triad misses the AA floors over its own `brightestRegion` and `darkestRegion` (both stored — a bought skin runs its own install floors) is refused at install, exactly as one missing a schema field is — the AA promise on installed skins is a gate, not a memo.

  | pack | `luminance` | veil | surviving photo signal | contrast vs ink |
  |---|---|---|---|---|
  | koi | 0.47 | `255,255,255` | — | — |
  | dark | 0.03 | `81,82,85` | 28 | 6.7:1 |
  | nudi | 0.18 | `73,75,78` | 20 | 6.7:1 |
  | treestars | 0.36 | `51,53,56` | 46 | 6.2:1 |

  *(The table above records the finding, never values — the four veils were hand-tuned against these masters and are superseded by the formula, which the fixtures re-derive from the stored region pair — the once-owed storage debt was discharged 2026-08-22.)*

  **Why the old rule was wrong — kept, because it is the obvious thing to re-propose.** A two-value switch put white over light skins and near-black over dark ones. Measured over the real masters, the same amount of photograph survived in every case — 17 units on koi, 17 on dark, 29 on treestars — but on the dark skins the result landed between `rgb(11)` and `rgb(45)`, at or below a display's practical black floor in a lit room. **The variation existed and could not be seen.** The veil had flipped direction between modes: on light skins the plate *lifted* off the photograph, on dark skins it *sank into* it. `dark` (`luminance 0.03`, `colorfulness 0.13`) stays the weakest case and no veil fixes that — on that skin the material recedes, and that is honest rather than broken.
- **No skin is special — the shipped packs are fixtures, not canon** *(founder-ruled 2026-08-22, replacing "the shipped set is permanent": "the 4 skins are just random things I'm using for the sake of inspiration; idk if I'll ship them in production")*. **No token, table or constant may name a pack**; every skin-dependent value derives from the pack's stored measurements, so whichever packs ship — and whatever the marketplace later sells — take one mechanism. **Plain** stays: a CSS ground, not a pack, never a picker row (photo-off is boring mode's job). **Koi is the default until the founder picks a shipping set.** New packs enter only through the admin pipeline (`../assets/make-pack.mjs`); there is no user upload path. Additional skins are **paid**, sold through `../marketplace/`.
- **Boring mode.** One press: photo off, solid content backing. Press again: **the whole display-settings set restores exactly** — the stash persists across sessions. Picking any skin exits boring. The control is a row in the console settings pane *(FD-39 — the rail icon retired with the islands)*.
  - **The stash is defined by reference, never enumerated here** *(2026-08-09)*. It is whatever `SPEC.md §7` lists as display-only state, in full, and **a member added there is stashed automatically**. The enumerated form had already gone stale twice in one day: the opacity dial became two, and `keep-awake` joined the set, and this bullet said neither. An inventory restated in three files is three things to forget; FR13's one-normative-home rule applies to inventories exactly as it does to laws.
- **Two opacity dials, kept apart and never merged** *(2026-08-09; the single "island opacity" dial was one of them all along)*. Both are 0–100, step 1, applied as `--fill = sqrt(v/100)`, and both fade **fills only** — spines and borders keep full strength *("and text" dropped 2026-08-22: the board dial's ink behavior belongs to its own home, the wake-policy table at §Board rendering, which fades fill and ink; this preamble states what the dials share)*.
  - **Chrome dial — default 40.** Console and pop-out fill. Its control is a **stepped row in the console settings pane** *(FD-39; the droplet slider is dead — free sliders are a standing rejection)*.
  - **Board dial — default 80.** Day-block fill and ink, and it carries the scope. Full mechanism: §Board rendering, *The wake policy*. Same pane, same stops.

  One asks how loud the furniture is; the other asks how much of the week the owner is asked to read. A single dial cannot answer both.
- **The fave four.** The skins pop-out lists only the owner's starred skins (1–4; no stars yet = the shipped four). Starring a fifth bumps the oldest (FIFO); unstarring the last is a no-op. **The pop-out never scrolls and never empties** — however large the marketplace grows, it stays at most four rows plus "See all →".
- **The gallery riser.** "See all →" rises the gallery: a card grid where **every card previews the skin on the owner's own live board** — real board, real week, re-tinted per that skin's palette (ruled the strongest single delight moment). Cards carry the star, and, for store skins, the entitlement state. Re-tinting is palette-token substitution — a display projection: zero model calls, zero computed values.
- **No-flash landing.** The last-painted appearance mirrors to local storage and seeds the first paint; a true first visit holds the ambient ground until settings answer. The app never paints a guessed skin and then corrects.
- **Scope.** Appearance is **display state only** — never an engine input, never engine truth, and never applied to guest pages (guests get the plain pre-AI form, unskinned). Its **one** seam path is the app-owned `display_settings(diff)` class (**FD-66** — the home is `SPEC.md §7`), which carries display state and nothing else. *(Restated 2026-08-30: this bullet denied appearance any seam at all, a half `SPEC.md §7` had already amended when FD-66 ratified the display class. The surviving rule is the one above — the seam exists, and it is display-only.)*

## Glass — one glass, three densities ("breathing glass")

*Re-ruled 2026-08-09 (FD-21), replacing the prior build's two-material inventory and its rest-is-absolute-glass rule. The material is **one glass**; `panel`, `plate` and `block` are three amounts of it, not three materials. An opaque **paper** for reading surfaces was built and rejected by the founder on sight — an opaque console reads as a dialog box pasted onto the photograph. What replaced it is simply **more of the same glass**, and the veil derivation (§Appearance) is what makes that legible.*

| | density — light skin / dark skin | where | lens |
|---|---|---|---|
| **panel** | `0.12` / `0.24` | riser and console bodies | yes |
| **plate** | `0.78` / `0.60` | anything a value is read off, or a control is pressed on | no |
| **block** | `0 → 0.62` / `0 → 0.55`, by the board dial | day blocks | no |

*(Panel and plate re-landed 2026-08-22: FD-41's founder-eye-picked quiet-glass values — panel `.12`/`.24`, plate `.78`/`.60`, blur **4px at rest / 10px engaged** — replaced the 2026-08-09 pre-sitting values (`.16`/`.30`, `.86`/`.68`) this table still carried; the shipped pack veils were already solved against the FD-41 plate alphas, so law, ruling and code now agree.)*

**Attention**

- **Findable at rest, readable when engaged.** Two requirements, and only the second is about reading. A container at rest must be legible **as an object** — its body and boundary discoverable without hunting — and it need **not** be readable. Engagement makes it readable, and that is the reaction's entire job. *(This replaces "rest = absolute glass": a container with no body at rest is not findable, and the contents then read as a floating island of text with nothing under them.)*
- **Engaging always makes a surface *more* frosted, never less.** Attention adds material — the pair is **4px at rest, 10px engaged** (FD-41). The inverse was built once — `blur(7px)` at rest, `blur(2.5px)` engaged — and read correctly as gratuitous.
- **Dwell is asymmetric: ~100ms in, ~400ms out**, so a drive-by never engages and a deliberate approach does. Triggered by hover / focus-within / explicit engagement, **never by content**.
- **Blocks breathe; containers wake.** A block is small, numerous and glanced at; a console is read. **The material is chosen by task — glance, read, control — never by element type.**
- **A form is never see-through** *(founder-ruled 2026-08-21, FD-38)*. Findable-at-rest is a rule for surfaces that **wait** (the console). A riser and its form were **summoned** to be read and typed in — they open engaged and stay engaged; there is no resting state to design. Built the other way once and rejected on sight.

**The lens**

- A per-pane SVG `feDisplacementMap` whose map is a runtime canvas: a signed-distance field over the pane's rounded rect, displacement vectors pointing outward inside a **26px** rim band with a `t²` falloff, **scale 130**.
- **Panels only.** Refraction is the identity of the material and also the expensive part. Six panels can each bend the photograph beautifully; fifty blocks each bending a different patch turn the photograph to soup and cost a great deal of GPU for the privilege.
- **Never mix the `url()` reference with function filters in one `backdrop-filter` list** — Chromium renders the mix as smear. The whole chain stays inside the SVG filter, or the states swap whole `backdrop-filter` values.
- **The lens is a Chromium bonus and never a requirement.** Safari and Firefox ignore SVG backdrop filters and get the same material with a plain blur. No second material is designed for them — veil, halo, glow and specular are all filter-independent. *(Drafted 2026-08-09; ratified under the blanket delegation — the FD-38–43 sitting's record, marker updated 2026-08-22.)*

**Laws that bind every surface**

- **A container may never be lighter than its contents.** An opaque bubble inside a transparent shell makes the bubble the object and the shell nothing. Contents are the same substance as their container, told apart by **tone and hairline, never by opacity**.
- **A density field has no edges.** Any ground treatment falls off on **all four sides** and bleeds into its neighbours. A gradient that terminates on any axis reintroduces the rectangle, and a rectangle is furniture.
- **Fix the ground or fix the ink — never add furniture.** Bands, bars, chips behind headings and grouped section cards were all built and all rejected.
- **A text treatment never touches an element that already has a body.** A halo, a stroke or a plate on a filled button destroys its letters.
- **Glass-on-glass: never.** Panes float over canvas or photo, never over other glass (`DESIGN:564, 592-596`).
- **Closed material inventory.** The three densities above are the whole set; a class carrying `backdrop-filter` outside the named list is a build error (the automatable half of the design-law checklist — `../TDD.md`).
- Modal dim is **a whisper** (faint tint + slight blur), never the library's heavy default (`DESIGN:333-351`).
- **Apple's Liquid Glass is the stated inspiration, and we take the material, not the behaviour.** Kept: refraction, a specular that answers a light source, depth, and a tint that adapts to what is behind it. Refused: **pointer-chasing specular and gel elasticity** — not because a prior ruling said so, but because *the material scales differently at fifty elements than at six*. Apple puts Liquid Glass on a handful of controls; a board holds fifty blocks, and fifty continuously-alive lensing surfaces destroy the photograph they exist to reveal.
- **And there is one thing annnä can do that Apple cannot.** Apple must sample the wallpaper at runtime, because it cannot know what is behind the glass. annnä ships four photographs, each with a measured `palette.json`, so **the veil is solved before the frame renders** (§Appearance). That is not a boast; it is the reason the material works on a nearly-black photograph at all.

## Spacing (added 2026-08-09)

*Landed because §Shapes needs it. The prior radius rule was size-proportional and self-contained; adopting Apple's concentricity made **the container's padding the input to every corner**, and the padding was stated nowhere — leaving every radius in this file underivable and therefore uncheckable.*

**The scale: `4 · 8 · 12 · 16 · 24 · 32 · 48`.** A 4px base, and nothing between steps. Vertical space is precious on a board that holds a week; a scale with more rungs is a scale people split the difference on.

| inset | value | what it is |
|---|---|---|
| **board inset** | **8px** | a day block inside the field panel — the input to the block's corner |
| **form inset** | **12px** | a plate inside a riser or console panel — the input to the plate's corner |
| **island edge** | 8px | an island's distance from the canvas edge — **retired chrome** (FD-39) |
| **island moat** | 8px | clear space around an island; nothing renders inside it — **retired chrome** (FD-39) |

**The two insets are load-bearing, not illustrative.** §Shapes derives from **board inset** and **form inset** by name, so changing either moves a corner — which is the point of concentricity and the reason they live in one place rather than inline. **The two island rows are retired chrome and are kept, not deleted** *(annotated 2026-08-29 in FD-39's relocate-never-delete style — the islands went into the console's settings pane and nothing lives at the canvas edge at any width, so the two values govern no live surface; the record stays so a reader meeting "island" elsewhere finds what it meant, and the "four" this sentence used to claim is now two)*.

## Shapes (added 2026-08-09)

**We follow Apple's shape rules, which are two rules and a scale — not a table of numbers** *(founder-directed 2026-08-09; this replaced a ratio of mine, which Apple does not do)*.

**1. Concentricity. A nested corner shares its parent's centre: `inner = outer − inset`, floored at 4px.** This is the rule Apple gives its own designers and the one it shipped as an API (`ConcentricRectangle` / `.containerConcentric`). It is why an Apple control inside an Apple panel never looks pasted on: the two curves stay parallel instead of racing each other. Consequence for us — **radii are not authored per element.** One outer surface is seeded and everything inside is derived from it and its padding, so changing a panel's inset moves its contents' corners automatically and correctly.

**2. Controls are capsules; surfaces are rounded rectangles.** Fully-round is not a size choice, it is a statement that the thing is pressed rather than read. Islands are capsules already — **retired chrome, annotated not deleted** *(2026-08-29, FD-39's relocate-never-delete: the islands are gone from the canvas edge, and **the capsule rule lives on for pills and every control**, which is the part of this sentence that still binds)*. A surface never is, at any size.

**3. Curvature is continuous, not circular.** The single most identifiably-Apple property of an Apple shape is that its corner is G2-continuous — a squircle — rather than the quarter-circle arc `border-radius` draws. At 16px the difference is subtle; at 40px it is the whole difference between "Apple" and "rounded box".

**The seed and what falls out of it.** The **field panel** is the outermost surface at **16px**; everything else derives.

| element | derivation | radius |
|---|---|---|
| field panel | seeded (outermost) | **16px** |
| console card · riser | seeded peers of the field panel | 16px |
| day block | `16 − board inset` (§Spacing) | **8px** |
| plate | `16 − form inset` (§Spacing) → 4 | **4px** (floor) |
| island · pill · any control | capsule | fully round |

**This reverses two numbers a ratio had given** — a block moves 6px → **8px** and a plate 7px → **4px** — and the direction is the tell that the rule is doing real work: Apple's inner corners are *tighter* relative to their containers than a size-proportional rule would ever produce, and that tightness is a large part of why nested Apple surfaces read as one object.

**The 4-vs-14 question dissolves rather than resolving.** 14px was never available: a block is inset 8px inside a 16px panel, so its corner is 8px by construction, and any other value breaks concentricity with the surface it sits on. What was being argued was a preference over something the container had already decided.

> **Build constraint, and it is the second time this design has landed here.** CSS `border-radius` draws circular arcs only. Continuous corners need the newer `corner-shape` property, which landed in Chromium first — **verify Safari and Firefox support at build time rather than assuming it** (`BUILD.md` Step 1). Where it is absent, fall back to circular `border-radius` at the same values: the shape degrades, the concentricity does not, and concentricity is the part that carries the look. Same posture as the lens (§Glass) — **Chromium gets the finish, everyone gets the design.**

## Colour (added 2026-08-09)

*The corpus said "colour = urgency, never category" nine times and never said which colours. The triad below existed only in `../assets/make-pack.mjs`, where it is real and executable and gates every pack build — but a constant in a build script is not a normative home. This section is that home.*

### Urgency — three marks, one scale

Three meanings, and only three: **calm** · **attention** · **alarm**. Hue carries the meaning and is fixed — mint, amber, coral. They separate from each other by ΔE2000 **26.1 / 46.9 / 26.9**, comfortably past the ΔE 12 the pipeline already treats as a collision.

**But lightness is derived per skin, exactly as the veil is** *(this is the fix, and the shipped constants are the bug)*. Measured against each skin's veil at the non-text contrast floor (WCAG 1.4.11, **3.0:1** — a spine is a UI component, not text):

| | koi | dark | nudi | treestars |
|---|---|---|---|---|
| calm | **1.34** ✗ | 5.85 | 6.55 | 9.21 |
| attention | **1.31** ✗ | 5.97 | 6.69 | 9.40 |
| alarm | **2.30** ✗ | 3.40 | 3.81 | 5.36 |

**All three fail on koi, and koi is the default skin** — so on the surface every new owner sees first, the urgency spine is very nearly invisible. This is the same defect the veil had and the same shape of mistake: **a value fixed globally when it should have been solved against the thing next to it.** Three dark skins passed, one light skin failed, and a constant chosen against dark grounds looked correct everywhere anyone happened to check.

**The ground is the worst-case composite the spine actually sits on — never an opaque veil, which renders nowhere** *(corrected 2026-08-22, a11y A1: solved against the veil at full alpha, all three marks failed their own floor at every dial stop on koi, including the default)*: the walk solves against the veil at `block-max × sqrt(lowest non-zero stop)` composited over the pack's `brightestRegion` **and** its darkest counterpart. No single mark clears both, which is exactly the finding the halo answers — **the spine takes the halo law** (its third use, after ink and icons: an opposing hairline rides it). **And urgency is two channels, never colour alone** *(a11y A5 — WCAG 1.4.1, the one Level A criterion in play)*: the three marks also separate by **spine weight** (thin / the default / thick), so a colourblind owner reads urgency before any remap; the remap (below) is an accommodation on top, never the conformance answer.

**The rule: hold hue and saturation, walk lightness until the mark clears its own ground at ≥3.0:1.** On the three dark skins the walk terminates immediately and the shipped values stand unchanged. On koi it yields `#789b8e` / `#a8916f` / `#de7866`, which still separate pairwise at **22.4 / 39.8 / 21.2**, still clear koi's accent at **18.3 / 20.2 / 36.5**, and still hold ~5.8:1 against koi's ink. <!--derived--> **One law, two applications** — the veil solves a surface against its photograph, this solves a mark against its surface.

### The accent, and what happens when a photograph has none

The accent is **derived, never authored**: the pack's `Vibrant` swatch, normalised for UI duty (L 0.62, chroma capped at 0.15), then walked darker until white text clears **3:1**, then **rejected outright** if it lands within ΔE2000 12 of any urgency mark. Home of the implementation: `../assets/make-pack.mjs`.

**The fallback is the brand constant `#c46d00`, and a pack with no derivable accent takes it** *(re-expressed 2026-08-22 — the old sentence named koi, and no constant may name a pack)*. The dependency runs **brand → fixture, never the reverse**: `PR/BRAND.md`'s accent is the constant, and the koi fixture *happens to equal it* because the brand was derived from that photograph. Stated here because the pipeline reaches for a *"theme default"* that no file defined.

**Two of the four shipped packs take that fallback, and the corpus never said so.** Both fail the same gate clause, and it is **rarity, not greyness**: the pipeline requires the Vibrant swatch to hold `> 0.02` of the photograph, and `dark`'s holds **0.000** while `nudi`'s holds **0.013**. So both carry `accent: null`. That is correct and it stays: on `nudi` a warm accent against an olive-green photograph is complementary, and on `dark` (`colorfulness 0.13`) it is the only colour on screen and reads as deliberate. **What was wrong was that it was silent.** A pack with a null accent is a normal pack, not a broken one, and nothing downstream may treat the fallback as a defect.

### There is no semantic colour set — and the rule for adding one

There is **no `error` / `success` / `warning` / `info` palette**, and the set is **empty rather than small**. An earlier draft of this section kept one failure colour and was wrong on its own terms: it killed a four-colour set for colliding with urgency, then kept a member that collided with urgency.

- **`alarm` already is the colour for *something is wrong*.** A separate failure colour is the second scale this section rejects, wearing one hex instead of four. Two scales in one hue territory put two meanings on one colour on one screen, and *"colour is meaning, not taxonomy"* forbids exactly that.
- **Nothing in this corpus renders a failure in colour.** Every failure surface is specified in **words**: the honest dead end, the rejected render, the unsent act, the honest absence, and the delivery failure that *"lives on the record, never only in a toast"*. `SCENARIOS.md` **S6** goes further and forbids the alternative outright — *"never an error wall"*.
- **Success is not a colour either.** A confirmed proposal collapses to *a ✓ and one line of consequence* (§Proposal cards). It needs no palette entry and gets none.

**The rule for when one is genuinely needed** — so this is a policy and not merely an absence:

> A state colour is added only when a **built surface** requires it, never in advance. When one is added it **derives from the active pack** like every other colour in this file, and it must clear **ΔE2000 ≥ 12 from all three urgency marks on every shipped skin** — the same threshold `../assets/make-pack.mjs` already applies to the accent. A state colour that cannot clear that bar is a signal the surface should carry words instead.

**A surface that seems to need a state colour has usually grown a taxonomy.** Check that first.

### The owner's overrides *(founder-ruled 2026-08-21, FD-42)*

**The urgency palette is a default, not a constant.** Owners customize appearance **through the agent** as ordinary settings: a colorblind owner remaps the three urgency colours; another renders urgency as the **whole border** instead of the spine (the *urgency-presentation* variant). Bounds that keep it lawful: colour still **means** urgency only — customization re-renders the meaning, never repurposes colour for category; the render catalog stays closed — these are **parameters on catalog nodes**, never new components; and the whole set stays display-only (`SPEC.md §7`), never an engine input. **Text size is the user's the same way** *(FD-42, from the founder's own eyesight question)*: every text-bearing size is authored in `rem` so platform zoom and the OS text preference genuinely scale the app *(this is the WCAG 1.4.4/200% answer, a11y A17)*; an owner **text-scale** stop (`[1 · 1.1 · 1.25 · 1.5]` — never below 1: an accommodation carries no shrink stop, a11y A16) multiplies on top, set in the pane or by saying it; the floors survive scaling — the `ä` gate and the 16px guest floor are never scaled below themselves. **Density is the default; readable-for-you is the setting.**

## Typography (added 2026-08-09)

**One face for everything** — display and text, no pairing games; hierarchy is **size, space and weight**, never a second family (`../PR/BRAND.md`, the home). Weight is load-bearing rather than stylistic — see §Canvas & photo, *Text on the photograph*.

### The face: Nunito Sans (FD-44)

**Ratified by eye, 2026-08-22** — the founder chose at a 10-face sampler rendering every real surface (blocks with 9px micro-marks and urgency spines over the photograph, the task band, a riser form with an error state, console chat and settings pane, the wordmark at every size): *"Typography goes to option number seven."* **Nunito Sans, for everything** — the one-face law stands. This is the landing-mockup ratification `../PR/BRAND.md` reserved; it supersedes the measured working choice below and **reverses the superfamily criterion** (criterion 1 — which was itself delegated, never founder-originated): warmth won. Two consequences taken with the ruling, stated so the build cannot lose them: **Thai and CJK owner content resolves through Noto Sans siblings as fallback**, metric mismatch accepted; and **the ä gate and the tabular-figures requirement are verified against Nunito Sans at app BUILD Step 1**. **The tabular half of that fact-check came back the same day** *(2026-08-22, upstream variable TTFs parsed)*: Nunito Sans carries **no `tnum` feature** — `font-variant-numeric: tabular-nums` is a no-op against it — but its default digits are **uniform-width by measurement** (600/1000 em, uniform at every `wght`/`wdth`/`opsz` extreme), so columns align. The fact went to the founder per this ruling's own condition and the disposition he approved is **the gate, not a reversal**: app BUILD Step 1 carries a digit-width assertion over the shipped binary (equal advances at each axis extreme, build-failing), which is the guarantee the missing feature was standing in for. The `tabular-nums` declaration stays whole-product — as the working guarantee for **fallback faces**, which do carry it.

*The section below stands as the record of the superseded working choice and of the measurements any future re-decision starts from.*

**Chosen 2026-08-09 by measurement, not by eye** — the founder declined the visual round and delegated it (*"I have no eye to appreciate these things, just pick one"*), so it was decided against the criteria below and the working set is kept at `.working/type.html` and `.working/fonts/` in the session workspace (external, no authority). Ratification stayed reserved to the landing-mockup moment per `../PR/BRAND.md`, which is the moment FD-44 exercised.

Twenty open, self-hostable candidates were measured. **The superfamily criterion below cut them to two — Noto Sans and IBM Plex Sans — and Noto Sans wins on all four remaining measurements:**

| | Noto Sans | IBM Plex Sans | why it matters |
|---|---|---|---|
| Thai + CJK siblings, one design | ✅ | ✅ | criterion 1 |
| x-height / em | **0.536** | 0.516 | the 9px micro-mark is the floor on every legibility decision here — ~4% more letter at the size that decides it |
| default figures | tabular | tabular | a column of start times aligns without configuration |
| `tnum` feature present | **✅** | ✗ | the whole-product tabular rule is a *request* Plex cannot answer; it happens to be right by default, which is not the same as guaranteed *(2026-08-22: FD-44's Nunito Sans sits in Plex's column on this row — the "right by default ≠ guaranteed" objection is answered for it by the Step-1 digit-width gate, measured not assumed; the row stands as the record of the reasoning it once carried)* |
| weight axis | **100–900** | 100–700 | weight is load-bearing over a photograph — 900 is available where 700 is the ceiling |

**What this costs, said plainly.** `../PR/BRAND.md` asks for a humanist sans *"quiet and slightly warm"*. **Noto Sans is quiet and is not warm** — it is deliberately neutral, designed to render everything and disappear. That is a real deviation from a stated criterion and it is taken on purpose: *this product's typographic job is to recede.* The photograph is the loudest thing by law, and a face with personality competes with it. **Warmth arrives from the photograph, the accent and the spacing — not from the letterforms.** Of the twenty, Noto Sans is the only one whose design brief was itself "disappear and render everything."

**If warmth is ever wanted back, this is the trade and it is a single decision.** The **superfamily criterion is mine, drafted, not founder-ratified** — and it alone eliminated eighteen of the twenty. Reversing it opens the field, and the best-measuring warm humanist behind it is **Merriweather Sans**: the highest x-height of all twenty (**0.557**), `tnum` present, a 300–800 axis. The cost of taking it is exactly what criterion 1 describes — owner-authored Thai and Chinese titles on the board resolve through an unmatched fallback. *(Resolved 2026-08-22: FD-44 took exactly this trade — warmth won by eye, with Nunito Sans rather than Merriweather Sans, and the fallback cost above is the accepted consequence.)*

### The criteria the choice was made against

Two of these are additions to `../PR/BRAND.md`'s list, both derived rather than chosen *(moved under this heading 2026-08-21 — the heading sat empty while its content lived two subsections down, and the design-law-coverage gate checks section naming, not section truth)*:

1. *(Reversed by FD-44, 2026-08-22 — the criterion stands as the record of what the reversal costs; the fallback consequence is stated at the ruling.)* **The face must be a superfamily, not a face — because of the owner's *content*, not the chrome.** *"One humanist sans"* is unbuildable as written. **Chrome shipping in English does not make the product Latin-only**: the board renders **owner-authored content** — commitment titles, party names, place names — and the owner is a Rawai dive shop or a Taipei studio as readily as an English speaker (`SPEC.md §5`, FR15's own examples). Those strings land in the face, at 13px and at the 9px micro-mark, on the densest surface in the product. A Latin-only face resolves them through an unmatched system fallback: different weight, different vertical metrics, and a block whose text no longer sits where the block was measured for. What is required is a face with **metric-matched Thai and CJK siblings** (the Source Sans / Source Han and Noto families are the *shape* of the answer, not the answer). *This does not change the "one face" law — a superfamily is one design.*
2. **The `ä` is a gate, at both ends of the ramp.** The umlaut is part of the wordmark (`../PR/BRAND.md`), so: at **9px** the two dots must remain two dots and must not merge with the bowl; at heading and hero sizes they must not clip against a tight line-height. **Test both before accepting a face** — a face that fails either is disqualified regardless of how it reads in a specimen.

### The ramp

| role | size | where |
|---|---|---|
| **micro** | 9px | a block's start-time mark — **the smallest type in the product, and the floor on every legibility decision in this file** |
| **label** | 9px, uppercase, `+0.09em` | the caption above a value inside a plate |
| **body** | **12px** *(founder-picked 2026-08-22, the sampler round — the dense set; the owner text-scale stop multiplies it, §Colour, The owner's overrides)* | owner chrome: console and riser fields |
| **input** | 13.5px | a value being typed |
| **heading** | weight-led, size follows | riser and section headings (§Risers and forms) |
| **guest body** | **16px minimum** | *anything a guest reads on a phone* |

**Why the guest floor is different and is not a contradiction.** The owner's chrome is dense on purpose and sits behind sign-in on a surface its owner uses daily. A guest page is read once, by a stranger, on a phone they are holding in a shop doorway — it is mobile-first by law (§Guest pages) and it is the one read-heavy surface in the product. **The dense chrome ramp (body 12px, FD-41) is a choice the owner is opted into; 16px is the floor for everyone else.**

### Numerals are tabular, always

Every figure the product renders is `tabular-nums` — no exceptions and no per-site opt-in. The board shows a column of start times, and proportional figures make a vertical run of times visibly ragged at exactly the size (9px) where raggedness is indistinguishable from misalignment. **This is a whole-product setting, not a component one**, so that no future surface has to remember. **What actually guarantees alignment under FD-44** *(2026-08-22)*: the shipped face's digits are uniform-width by **measurement, gated at app BUILD Step 1** (Nunito Sans carries no `tnum` to answer the declaration); the declaration stays because every fallback face in the stack does carry it.

### Delivery — self-hosted, and never a third-party font host

**Self-hosted and subset, always.** Not a preference and not a performance argument:

- **Guest pages make annnä a processor** (`../security/SPEC.md §12`), and they are served to third parties who never agreed to anything. A font fetched from an outside host transmits **each guest's IP address to that host** on every page load, from a page annnä serves on its owner's behalf. GDPR is this corpus's stated ceiling; that request is not defensible under it and there is nothing to gain by making it.
- **The same discipline the appearance model already states:** *the app never paints a guessed skin and then corrects*. Type is the same failure — a flash of fallback text is a guess, corrected in front of the reader.

**How that resolves, and the two surfaces differ deliberately:**
- **The app** takes `font-display: optional` with the subset preloaded. Behind sign-in, on a repeat-visit surface, the cache is warm essentially always — and on the one cold load, holding the fallback for that page is exactly what *never correct in front of the reader* requires.
- **Outward surfaces beyond the guest page — none of which exist at v1** *(scoped 2026-08-21: the guest page is the app's only outward surface and §Guest pages rules it onto a system stack — the surface that cannot predict its own script should not ship a webfont subset — so this bullet previously mandated a webfont treatment for a surface its own sibling law forbade one on; the marketing site is a separate artifact)* — would take `swap` with a **metric-matched fallback** (`size-adjust`, `ascent-override`, `descent-override`), because a first impression that never arrives is worse than one that arrives late — and matched metrics mean the swap moves nothing. Recorded as the rule for a surface that does not yet exist, applying to none today.

## Board rendering

*Re-ruled 2026-08-09 (FD-22, FD-23). Amended 2026-08-24 (FD-81): “no time axis” is the **default mode**, not the only mode. Three prior-build laws are gone: the board that never scrolls, the single upward gravity, and tasks as a separate due-chip species with their own Plan riser.*

- **Default mode: no time axis.** Time is block *data*, never position or size. This is why a board can be calm while holding a complete life (`DESIGN:415`). Packed default stays conversation-first. **A second mode is a traditional hour-grid** (FD-81): Y-axis is the clock; in that mode only, position and height mean time. Same wallpaper, same skin, same glass — a board style, not a second product. Toggle is display-only state (`SPEC.md` §7 `board_mode`: `packed` default · `hour-grid`). **Hour-grid allows drag-to-move.** Packed mode does not — correction there is still console or riser. **Do not build the grid or the gesture until this file’s hour-grid residue is ruled:** where undated, deadline-only, and all-day work sit on a clock is still open. *(2026-08-24, G1-1b **landed as law:** the shipping board is packed. Hour-grid stays specified (FD-81) and is not built until a sitting names that placement. That sitting is not a gate on the application build.)*
- **One block for events and tasks alike.** The due chip is retired and the Plan riser with it (`SPEC.md §2`). Uniform and compact regardless of duration: the title owns the line, the start time is a 9px micro-mark, the full range lives in the block's detail. At rest a block shows spine, urgency edge and rim; fill and ink arrive per the board dial.
- **The spine is urgency, never category.** Colour is meaning, not taxonomy — a board that colour-codes what a commitment is *about* has learned a domain, and this product must not. Sentiment, mood and category coding are all rejected (`DESIGN:736`). The three marks and their per-skin derivation: §Colour.

### Two gravities

```
        Mon   Tue   Wed   Thu   Fri   Sat   Sun
      ┌─────┬─────┬─────┬─────┬─────┬─────┬─────┐
      │ ███ │ ███ │ ███ │     │ ███ │     │     │
      │ ███ │     │ ███ │     │     │     │     │   events · 75%
      │     │     │ ███ │     │     │     │     │   scrolls PER COLUMN
      │     │     │     │     │     │     │     │
      │ · · · · · · · · · · · · · · · · · · · · │ ← one division, all columns
      │ ▒▒▒ │ ▒▒▒ │ ▒▒▒ │ ▒▒▒ │ ▒▒▒ │ ▒▒▒ │ ▒▒▒ │   tasks · 25%
      │ ▒▒▒ │ ▒▒▒ │     │     │     │     │     │   scrolls AS ONE BAND
      └─────┴─────┴─────┴─────┴─────┴─────┴─────┘
```

- **Events pack to the top** of their own column in start order, ignoring clock position — Monday 08:00 and Tuesday 11:00 sit in the same row.
- **Tasks pack to the bottom**, filling a line **across the whole board** before opening a second, so a week of scattered tasks reads as one horizontal band. **The band is flush to the bottom edge** *(founder-ruled 2026-08-21, FD-40)*: the first-filled line sits at the very bottom and later lines grow **upward** — bottom gravity is an anchor, never a top-aligned stack inside a bottom area with dead space beneath it. **Undated tasks flow into whatever cells remain** — dated ones claim their column first. *Accepted cost: an undated task sits under a date it has no relationship to, and moves as dated ones arrive.* Its accessible text **never inherits the borrowed cell's date** — an undated task states that it is undated (§Accessibility baseline).
- **75 / 25 by default, owner-adjustable** — the event band takes 75% of board height, tasks the remainder. **One horizontal division across all seven columns**: a per-column split would put the line at a different height in every column and the band would stop reading as a band. *(Drafted 2026-08-09; ratified under the blanket delegation — the FD-38–43 sitting's record, marker updated 2026-08-22; reversible as every delegated call is.)*
- **The board scrolls, asymmetrically, and the scroll follows the fill law.** The event band scrolls **per column**; the task band is **one board-wide scroller** moving whole lines together, because tasks pack in lines and so should move in lines. *Accepted cost: a column with one task and a column with nine scroll together.* **The grid itself never grows** — that law survives; internal scroll is how it is kept, and it replaces the prior build's `+N` overflow chip.
- **The date row is the sole navigation**: click opens a month navigator; today is a pill, never a scroll position (`DESIGN:727, 730`).
- **Completing a task is not an event.** The block leaves on a short cross-fade and the band re-packs. The Tetris analogy governs **packing order only**, never removal — there is no line-clear animation.

### The wake policy — the owner's, in four parts *(owner-facing name: **presence** — the console row and token set use it; one mechanism, two registers, declared here at the single normative home)*

*Founder-ruled 2026-08-09 (FD-22); the scope's open predicate cut to a closed menu 2026-08-22 (FD-70, the fork brief's third deferral cut — FD-22 is annotated, never rewritten). This is the mechanism `../PRD.md` §11 Q1 deferred to a dedicated UI/UX session, and it is **not a value**. Normative home: here. `../PRD.md` §3, §4.3 and RQ-10/11 restate it.*

| part | what it does | default |
|---|---|---|
| **value** | 0–100, fades **fill and ink only** — spine, urgency edge, border and the micro-mark keep full strength | **80** |
| **scope** | which blocks rest lit: **one entry from the closed scope menu** (below), evaluated over a block's own stored data | everything |
| **keep-awake** | holds **one** block awake over any scope | — |
| **keep-awake toggle** | silences the *holding*; it never sets or clears a mark | on |

- **Exactly one scope is active**, carrying exactly one value; setting a new one replaces the old. No precedence law is needed and none is written.
- **In scope rests at the value. Out of scope rests at the floor and reveals on attention to `max(value, floor)`** — and **the floor is a named token, not a vibe** *(2026-08-22, a11y A3: `presence-floor`, sized so outline + micro-mark clear the urgency floor against the worst-case composite)*. Attention — hover, keyboard focus, tap, or the reduced-transparency pin — always reveals at least the floor, so **`0` is a fill stop, never a legibility stop**: no setting makes a title unreadable to every modality at once. Attention is senior to the rule, always.
- **The scope is a closed menu** *(cut 2026-08-22, FD-70 — the first release restores the closed-menu discipline FD-22 deliberately departed from; the open predicate may return later as a strict superset, and every stored menu entry would survive that return unchanged)*. **Four shapes, operands the owner's where a shape takes one:** **`everything`** (the default — every block rests at the value) · **`today`** (blocks whose occupying interval or deadline falls on the current day, in the board's zone) · **`this-week`** (the same at week grain) · **`kinds`** (blocks of an owner-picked kind set — the one parameterized shape, its operand elicited like any rule operand). Evaluation is mechanical over the block's own stored data; membership only, exactly as before. An off-menu scope ask gets the honest engine-discipline answer — "I can't express that yet," the nearest menu shape offered, the ask recorded as a design request — never a silent approximation. **What the cut buys back:** the scenario suite over scopes is finite again (four shapes × membership), the cost FD-22's own text conceded; the AA proof was finite either way *(a11y A14)* and is unchanged.
- **Keep-awake is what makes a coarse scope survivable.** Any single thing can be held out of whatever the menu entry says.
- **The mark is called `keep-awake`, and the name is load-bearing.** Not *pinned* — the prior build's display flag was `pinned` and collided with its engine's immovable `Placement.kind`, the same collision class that forced the `R#` → `FR#` rename. Not *held* — that is already this corpus's fifth latched mark (`../engine/SPEC.md`, D-B). The mark is **display state only**: never an engine input, never engine truth, stored with the other display-only settings (`SPEC.md §7` — whose `display.settings` class is the one seam path that may carry it; **FD-66** ratified that class, so it is no longer a proposal).
- **The default is 80 — present and legible — and that is not a retreat from the thesis.** The photograph reads on empty days, empty columns and between blocks, and *that* is where the promise lives. `PR/IDENTITY.md`'s *"five commitments are five small pieces of glass resting on it — not a wall of blocks"* is about **emptiness**, not transparency. A quiet default made a sparse week and a packed week look equally hazy; a present default makes the difference legible.
- **Value and scope are the owner's, not the founder's.** Any value whose right answer plausibly differs between two owners is a setting. What is ruled here is the mechanism and its default, never the number an owner ends up on.

## Islands & mobile

- **The islands are retired as chrome; nothing lives at the canvas edge, at any width** *(2026-08-21/22 — FD-39's relocate-never-delete, edge ruled empty under the blanket delegation, reversible)*. Their jobs — both dials, the scope presets, skin switching, boring mode — moved **intact** into the console's settings pane (§Console). The edge belongs to the photograph. Top nav bars remain forbidden, now trivially: there is no edge chrome of any kind.
- **Mobile: the console docks as one bottom glass bar in the thumb zone — and it is the phone's entire chrome.** Collapsed: the stage line plus the input; tap expands to a full-height sheet with `☰` in its header exactly as on desktop. **The values:** compact below **768px**; tablet band **768–1119px**; full from **1120px** — the only two **width** thresholds any surface may branch on, named once here; **`(pointer: coarse)` is the one further permitted branch**, and it carries the two touch laws below *(a11y A7)*.
- Compact board = one horizontal scroll-snap rack snapping per day (phone ~3 visible, tablet ~7), **both bands riding together** — event columns above, task cells under their own day; the split, the flush-bottom anchor and both scroll laws are unchanged inside the rack. The riser opens as a full-screen sheet, its two equal-column actions at the bottom in reach.
- **The two touch laws key on `(pointer: coarse)`, never on width** *(a11y A7 — a 10" tablet in the desktop band is a pure-touch device)*: (1) **touch beats density** — every target takes the 44px minimum, and a block grows to a 44px minimum height where the dense default is smaller (heights are **minimum** heights, never fixed — text-spacing overrides grow them, a11y A9); (2) **keep-awake lives inside the commitment riser, never on the block** — no hover exists, and an invisible control under a thumb is the paid-for bug this rule makes impossible by construction.
- **Touch: first tap wakes, second tap opens.** Hidden controls are inert until revealed (`pointer-events: none`); **Esc dismisses a reveal** without moving the pointer *(a11y A15)*.

## Console

- A ~320px **draggable floating card** that minimizes to a header pill.
- **Glass, not paper** *(2026-08-09, FD-21 — this reverses the prior build's solid-card-backs rule)*. The console body is a **panel**; everything inside it is the same substance as its shell, told apart by tone and hairline. Findable at rest, readable when engaged.
- Present in every canvas state (Supersession 2).
- **Chat is the console's face; settings live behind a hamburger** *(founder-ruled 2026-08-21, FD-39 — inline controls in the chat body were built and rejected on sight: "the user isn't doing adjustments as their major purpose of the application")*. `☰` in the header swaps chat for the **settings pane** for as long as it is open; it never shrinks the chat. Pane rows: **presence · the chrome dial · rest-lit scope · keep-awake toggle · split · board mode · skins · boring mode · text-scale** — every control **stepped stops, never a free slider** (a slider cannot be returned to the value it was on); the scope row's stops are the closed menu's entries (FD-70), and a `kinds` entry reads back as its plain-language sentence — the picked kinds named in words. Talking remains the primary path; the pane is its direct-manipulation twin, same mechanism, never a second authority.
- **Its default position is in the body of the photograph, never resting over the task band** *(founder-ruled 2026-08-21, FD-40 — the task/console intersection reads as noise)*. Whether a drag may take it over the band is unruled; the founder leans unconcerned at expected task counts.

## Risers and forms (added 2026-08-09)

*Supersession 3 introduced the riser and nothing said what one looks like. This is that, founder-settled by building the intermediates and eliminating them one at a time.*

- **The heading treatment is four parts, all four load-bearing:** headings carry real weight and size · a **soft halo** on every heading, subtitle and description (free on three skins, load-bearing on koi) · a **hairline rule** under each heading that **fades to nothing at both ends** rather than terminating · a **glow** behind each heading that falls off on all four sides and bleeds into the fields above and below.
- **A title is never a plate. A control always is.** A plate says *input here*; dressing a heading as one lies about what it does.
- **Every control has a body**, including the secondary action — a control with no body is not findable at rest.
- **Two actions of equal weight are equal columns**, never right-aligned. Right-alignment is a desktop-dialog convention that exists because dialogs are wide; a riser is narrow, and the convention is not inherited.
- These hold for **any** form the fixed catalog composes (`SPEC.md §4.1`) — long forms with many sections, and the four-field kind alike. Nothing here reads a domain.

## Proposal cards

- Anatomy: **tag chip → title → rule lines → optional meta strip → Confirm / Dismiss**; after confirm it collapses to a ✓ + one-line consequence (`DESIGN:738`).
- Any autonomy change is itself an explicit approve-card — never acquired silently (`DESIGN:739`).
- **Before/after variant**: for a standing-policy proposal the rule-lines slot renders two lines — current, then proposed — visually paired, and the card carries a third, quieter action alongside Confirm / Dismiss: **don't ask me again**. No new anatomy; the slot and the action strip already exist (behaviour: `../app/SPEC.md §3`, `../harness/SPEC.md §6`).
- **Pending-decision variant**: a card raised by an engine `PendingDecision` renders its engine-named choices **as the action strip** — the same strip, one action per choice, labelled with the engine's own words. No new anatomy, and no app-authored label (behaviour: `../app/SPEC.md §3`, `../engine/SPEC.md §1.14`).

**This section covers every console card class, not only proposals** *(2026-08-29 — `SPEC.md §3` names five more card classes and each had behaviour with no anatomy, which is a builder inventing a surface)*. Each is a variant of the anatomy above, declared the same way the two variants above are — and where a class needs something the base lacks, the slot is named rather than assumed. *(drafted, not founder-ratified — the FD-38-sitting's delegated pattern, reversible by one counter-look.)*

- **`trigger-result`** — a card raised by a firing with no human present. **No new anatomy**: the **cause occupies the meta strip**, always rendered and never collapsed, because a result the owner did not watch happen is unreadable without why it happened; the agent's question, when one rides along, takes the rule-lines slot (behaviour: `../app/SPEC.md §3`).
- **`outward-act`** — the last catch before a message crosses the line, and the one class that names a slot. Its rule-lines slot carries four lines in fixed order — **recipient · the exact address the send will use · content · basis** — and that exact address is **its own line, never folded into the recipient's**, because a right-name/wrong-address send is the failure this surface exists to catch (behaviour: `../app/SPEC.md §3`/`§6`, gated at D6).
- **`restore`** — offered when a board comes back short of its last backup watermark. **No new anatomy**: the rule-lines slot carries what is missing and when the last good copy was taken; one Confirm, and nothing is written before it (behaviour: `../app/SPEC.md §3`; law: `../security/SPEC.md §8`).
- **`parked-turn`** — a firing that parked. **No new anatomy**: the cause takes the meta strip exactly as the trigger-result card's does, and the action strip carries whatever the park lawfully offers — **re-send** where no commit point was reached, **resume or abandon** where one was, never both (behaviour: `../app/SPEC.md §1.1`/`§3`, gated at C17).
- **`Generate-Link`** — the hand-me-the-link path's affordance. **No new anatomy**: it is the action strip's single action on an outward-act card whose channel the app cannot reach; copying is the whole act, and the card collapses to its ✓ and one-line consequence exactly as a confirm does (behaviour: `../app/SPEC.md §6`).

## Motion & iconography

*(Both lists closed 2026-08-22, the visual sitting — the two restraint bullets became inventories, because a closed list is checkable and "restraint" is not.)*

**Motion — the register is water: things sink, rise, and settle.** Four laws: motion fires only on a **caused state change** (no ambient animation, ever); **one motion at a time** — the task band re-packs as one wave, never seven; animate **transform and opacity** (blur animates only on the engage transition, already bounded by dwell); **motion never carries information alone**, so reduced motion loses nothing. Focus is instant, never animated. **The closed inventory** — adding a row is a design act: engage/disengage (dwell 100ms in / 400ms out) · riser opens, **rises** (280ms) · riser closes, **sinks** (220ms) · block completes/cancels, crossfade (160ms) · band re-packs, one settle wave (240ms) · skin switch, photograph + every derived token crossfade together (400ms) · console ⇄ header pill (200ms) · console chat ⇄ settings (160ms) · stage-line text replacement (120ms) · dial moves, fills glide (400ms). **`prefers-reduced-motion` collapses every duration to ~1ms except the skin switch, which keeps a short cross-fade** *(a11y A19 — an instant full-viewport photograph swap is the one case the old swap-for-cross-fade rule was better at; this amends the baseline's wording, marked, not silent)*.

**Iconography — stroke icons on a 24 grid**: 1.75px stroke, round caps, `currentColor`. **An icon is ink** and takes ink's rules — halo over the photograph, text-scale, full strength at every dial value. No emoji glyphs, no vendor default UI; no filled glyphs — the held keep-awake's accent fill is the one exception, and it is state, not decoration. Destructive actions are **never icon-only**; every icon-bearing control carries an accessible name. **The named set, v1** (one icon per job; growing it is a design act): `menu` · `minimize` · `send` · `close` · `pin` (the keep-awake glyph) · `add` · `remove` · `drag-handle` · `chevron` · `calendar` · `clock` · `attach` · `pen` · `check` · `alert` · `link-out` · `copy`. **The alpaca mark is brand-only and is deliberately not in this set** (`../PR/BRAND.md` owns it); guest pages use the substrate's stock affordances, not this vocabulary.

- No testimonials / social-proof / pricing furniture on any product surface (`DESIGN:660-661`). No native browser date/time widget chrome in forms (`DESIGN:761-762`) — date/time fields render a plate trigger that opens the platform picker.

## Guest pages (visual law — added 2026-08-06; behavior: `SPEC.md §5`)

- **Bare substrate defaults, deliberately.** The guest page wears the design system's stock light theme — no skin, no glass, no photo, no custom tokens beyond the wordmark *(the "owner-chosen accent" clause struck 2026-08-22 — no such choice exists anywhere: §Colour rules the accent derived, never authored, and S7 asserts the bare default)*. The plainness *is* the design: a guest page should read as an ordinary trustworthy web form, not a branded product surface (Scope bullet above: appearance never applies to guests).
- **Mobile-first, one column.** The month view and the form stack single-column at every width; the compact/tablet thresholds above do not apply — there is nothing to re-arrange. Touch targets keep the 44px minimum. **Body type takes the 16px guest floor** (§Typography) — this is the one read-heavy surface in the product and its reader is a stranger on a phone.
- **The stock stack is a *system* font stack, and that is load-bearing** *(added 2026-08-09)*. "Bare substrate defaults" already means the guest page does not wear annnä's face; making the stack a system one also makes it the **only** text in the product whose script resolution is the operating system's job. Guest-facing copy renders in the owner's chosen languages, which have **no product default and no fallback list** (FR15) — so the surface that cannot predict its own script is exactly the surface that should not be shipping a webfont subset. **No third-party font host on this page under any circumstance** (§Typography: annnä is a processor here, and the guest never agreed to anything).
- **The whole page states**: month view (open windows written into day cells) → day drill-in → form → plain confirmation, plus the honest dead end — and the **manage state**: the guest's own booking with its cancel and move actions (`SPEC.md §5`; harness H8–H9) *(added 2026-08-21; **every booking yields it since FD-43**, 2026-08-22 — a bare-entry-link booking mints its booking-bound manage token at confirmation, so the state is no longer per-recipient-only)*. **And the published offering surface is a whole-page state of its own** *(added 2026-08-29 — FD-45 moved the mint to open-time and gave the guest a browsable surface before any pull; the state list closed without it, so the one page a walk-up visitor meets first had no visual law)*: on a **single-visitor token minted by a public entry link**, the live fleet renders with its photos, prices and open windows **before the visitor commits to pulling anything** — units in a hold or a buffer simply absent, since unpullable. It wears the same bare substrate defaults as every other guest state; the photographs are the offering's, never a skin's (behavior: `SPEC.md §5`, gated at G8). **The page declares the language it renders in** *(a11y A11 — WCAG 3.1.1: a page whose language is the owner's stored choice is exactly the page that must say so programmatically)*. No other guest surface exists to design.

## Accessibility baseline (added 2026-08-06)

- **Target: WCAG 2.1 AA** on both audiences' surfaces — measured, not aspirational: contrast checks run against every shipped palette's derived tokens (the pipeline's accent-on-white check in `../assets/make-pack.mjs` is the seed of this gate).
- **AA is measured on the *engaged* state, and the closure is three-part or it is a loophole** *(2026-08-09, replacing "≥ AA in both states")*:
  1. **Every surface is engageable by keyboard as well as pointer**, so the readable state is reachable without a mouse. Keyboard focus always wakes (below).
  2. **Anything that must be read without engagement is measured at rest** — the date row, the collapsed console pill, a block's micro-mark — over the worst-case region of every installed photograph *(installed, not shipped — a11y A14; the islands themselves are gone, FD-39)*. §Canvas & photo's halo law is how those pass.
  3. **`prefers-reduced-transparency` and `prefers-contrast: more` pin every surface to its engaged state**, rather than flattening it to opaque. Engaged is already designed and already contrast-verified, so the photograph survives and only the guessing goes. *(Ratified under the blanket delegation 2026-08-21.)* **Support fact, read 2026-08-22:** `prefers-reduced-transparency` is Chromium-only (not Baseline; Firefox's implementation sits behind a config flag) while `prefers-contrast: more` is broadly supported — both stay in the one conditional, and **the contrast query is the load-bearing half** until the other reaches Baseline; the users who lose the accommodation are those setting reduce-transparency alone on a non-Chromium browser, a known gap rather than a surprise. No JS fallback — the candidate API is newer and no better supported.

  **Why the old rule could not hold:** a block at rest sits at the floor, with fill and ink faded by the owner's own dial (§Board rendering). Requiring AA *there* requires either a floor high enough to erase the thesis, or a line in this file that no build could satisfy.
- **Keyboard and screen-reader floor:** every control reachable and operable without a pointer; risers trap and restore focus like the dialogs they are; the board's blocks expose their display projection as accessible text — **and that text never inherits a borrowed cell's date** (an undated task states that it is undated; a11y A6). First-tap-wakes applies to touch only — keyboard focus always wakes. **Every focusable surface takes one focus indicator** *(a11y A10)*: 2px accent outline at 2px offset — and a focus ring over the photograph takes a halo, exactly as ink does. **The console sits first in focus order and takes a skip target** *(a11y A18)* — it is the entire control surface, and a switch user does not tab a full week to reach it.
- **What changes is announced — the live-region law** *(2026-08-22, a11y A4 — WCAG 4.1.3; an agent product's primary interaction is "say something and watch the canvas change", and every one of those is a status message)*. Three rules close the class: the **stage line is a polite live region**, one node whose text each stage replaces; an **arriving card moves focus to itself only when it demands an action**, and announces politely when it does not; **a park, a refusal, and a failed or unknown delivery are assertive** — the refusal-reaches-the-console guarantee includes the owner who cannot see it. **Every catalog field node carries a machine-readable purpose and a programmatically-associated error** *(a11y A11 — WCAG 1.3.5/3.3.1)*: nodes whose purpose is a WCAG-named user-data purpose emit it (the guest form's name/email/phone by construction), and the alarm-hairline error is announced as the field's error, never only rendered near it.
- **Reflow, claimed rather than implied** *(a11y A13 — WCAG 1.4.10)*: the board takes the criterion's two-dimensional exception — its meaning **is** the two gravities and the day columns — and the claim is bounded: everything **outside** the board (console, sheets, risers, cards, all guest pages) reflows to one column at 320px with no horizontal scroll.
- **Reduced motion:** see §Motion & iconography — every duration to ~1ms, except the skin switch keeps a short cross-fade *(this amends the old swap-for-cross-fade sentence; marked 2026-08-22)*.

## Language (chrome posture — added 2026-08-06)

The app's **chrome ships in English at v1** — a deliberate, stated scope line, not an omission. The product's *content* is language-plural from day one, under **two separate laws**: **utterances** are bounded by which models qualify (`../model/SPEC.md §6`), and **guest-facing copy** is bounded by the owner's stored language setting (`SPEC.md §5`, FR15) — guest form field copy is authored content, not chrome, and no model is in that loop. Chrome localization is deferred until a post-v1 pass; nothing in the token or catalog design may assume English string lengths.

## Design-system mechanics (must survive re-adoption)

The component substrate is **Astryx** (`INTERFACES.md §2`), adopted strictly per the 2026-07-25 ruling (product-definition `:495-533`): Astryx supplies the vocabulary, annnä supplies the values, and **glass is the one defended non-Astryx element**, applied via the documented `className` escape hatch — Astryx ships no blur/frost tokens.

- **Three-route customization split** (`research/2026-07-astryx.md:175-197`): **Route A** typed theme tokens (compile-error on breakage) · **Route C** own-CSS + `className` for surfaces annnä renders (most durable; where glass lives) · **Route B** the `components` string-map **only** for sub-parts annnä doesn't render, and only with a selector-liveness test (keys are unvalidated strings — silent dead selectors otherwise).
- **Pin the version; never fork or vendor components** (adoption plan `:42-46`). The only annnä-authored material CSS is the glass recipe.
- **Never approve the package's postinstall script** — it injects vendor blocks into root agent-docs files (DESIGN-NOTES `:191-194`).
- **The styling engine is StyleX** *(settled 2026-08-22 by the substrate spike, on both Vite and the ruled TanStack Start; Astryx stays the component vocabulary — StyleX is its peer dependency)*. **Three token classes and deliberately no fourth**: **static** (`defineConsts` — inlined, no custom property emitted, so spacing/radii/type/motion are skin-untouchable *by construction*) · **per-skin derived** (`defineVars` + one generated `createTheme` per pack; a runtime-installed pack writes the *same* custom properties inline — shipped and bought skins are **one mechanism**, proven: installing a never-built pack added zero CSS bytes) · **runtime** (dynamic style functions for the dials and owner overrides). Three authoring rules, gate-worthy: no hand-written hex/alpha/curve in any human-edited token file; `defineConsts` for anything a skin must never touch; the derivation lives in **one pure module** imported by both the build script and the browser, so every derived token is producible by `deriveSkin(pack)` alone. Two dev-tooling seams and a path hazard are recorded at `BUILD.md` Step 0.
- Load order: the library's CSS must be declared in an explicit layer **before** the utility framework's layers, or its base outranks utilities (adoption plan `:192-202`) — **re-derive this bullet against StyleX at Step 0**: the plugin appends into an app-owned CSS asset, which is the modern form of the same requirement. `color-scheme` is set per skin-scope, not on `<html>` (adoption plan `:296-299`).
- **One overlay primitive** (the library's dialog) for every riser/modal; bridge its heavy backdrop to the whisper token (`research:218-221, 298-371`).
- Known churn at the pinned version: doc/class-name skew (docstrings say one class prefix, code emits another), unvalidated `components`-map keys (silent dead selectors), unprefixed global variant classes (collision hazard), preferred-not-hard widths, heavy default backdrop. **Re-measure all of these on any version bump** before merging. (Original measurements: the prior build's research doc, outside this repo — the list above is the complete checklist.)

## Standing rejections (never re-propose)

Apple's Liquid Glass **behaviour** — pointer-chasing specular, gel elasticity — *(the **material** is adopted; §Glass carries the distinction, and collapsing the two is how this entry gets mis-read)* · carousels/parallax/auto-play · testimonials & social-proof furniture · native date-widget chrome · multiple overlay systems · bespoke design system riding Astryx philosophy only ("Option 2") · emoji glyphs / vendor default UI · in-app payment rails (marketplace purchasing lives in the closed service — `../marketplace/SPEC.md §5`) · autonomous rescheduling · calendar sync / write-back UI (**rejected** — `NOTES.md` OR-39, closed 2026-08-06: outbound is banned, so there is no UI to design; import IN is in scope per `SPEC.md §9`) · native app shells (deferred, not rejected) · Astryx postinstall approval.

**Added 2026-08-09, each built and rejected on sight rather than argued down** — an opaque *paper* console · hue-shifting scrims and any accent-tinted backing surface · a plate, band, bar or chip under a heading · right-aligned dialog actions · a Tetris **line-clear** animation on task completion · colour-coding a block by category, sentiment or mood · fading a block's spine, border or micro-mark to nothing · a text treatment on a filled control · making attention reveal *less* material.

**Added 2026-08-21/22, the visual sitting, same rule** — controls inline in the chat body · free sliders for owner settings · a per-name table for any skin-dependent value · deleting a control instead of relocating it · a resting-dim form.
