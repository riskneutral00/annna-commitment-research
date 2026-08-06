# BRAND — the visible identity

*The visual half of the facade. Everything here derives from what the product already ships: the koi skin's approved palette and the design law in [`../app/DESIGN.md`](../app/DESIGN.md). No new color system exists; the brand wears the product's own defaults.*

---

## The mark: the alpaca

**The alpaca is annnä's brand mark** — the symbol that sits beside the wordmark and stands for the product wherever a wordmark can't (favicon, app icon, social avatar, store).

**What the mark must convey** *(this is a design target, not a backstory — the brand never explains the alpaca, the same way it never explains the name):*

- **Calm under load.** An animal that carries things and is famously unbothered. Still, soft, faintly amused. Never busy, never rushing.
- **Quiet, not cute.** Warmth without mascot-cartoon energy. It should sit comfortably on the same page as a security-posture document.
- **Present, not performing.** The mark rests; it never winks, points, or celebrates.

**Construction constraints (for the future SVG — not drawn in this session):**

1. Single SVG, drawn once, used everywhere. No raster masters.
2. Legible at 16px (favicon) and dignified at 512px (app icon). Test both before accepting.
3. Two color treatments only: **mono** (single-color ink, works on photo and on paper) and **koi accent** (`#c46d00` on light ground / `#e18620` on dark ground). No gradients, no outlines-plus-fills complexity.
4. Flat and still. The mark is never animated (motion law: no ambient animation, anywhere).
5. Head-and-neck crop preferred over full body — reads better at favicon size and avoids petting-zoo energy.
6. It must survive sitting *on* photograph skins: one mono variant must hold up over busy imagery (consider a glass-token treatment consistent with the app's breathing-glass materials).

## The wordmark

- **annnä** — lowercase always, including sentence-initial. The umlaut is part of the mark: any typeface chosen must render a clean, well-spaced **ä** at every size.
- Fallback law where **ä** is impossible (URLs, ASCII-only systems): **annna**. Never "anna", never "Anna", never "ANNNÄ".
- Pronunciation, when needed, is given as: *say it "Anna."*
- Wordmark and alpaca may appear together (mark left, word right) or alone; the mark alone is preferred at small sizes, the word alone in running text.

## Color — the koi system

Canonical source: [`../assets/packs/koi/palette.json`](../assets/packs/koi/palette.json). Koi is the product's permanent default skin, so the brand's first impression and the product's first impression are the same colors. **No hex may appear in brand material that is not in that file.**

| Role | Value | From palette |
|---|---|---|
| **Brand accent** (links, emphasis, the mark on light) | `#c46d00` | `accent` |
| **Accent deep** (hover/pressed, small text on cream) | `#a34f00` | `accentDeep` |
| **Vibrant** (the mark on dark, large display accents) | `#e18620` | `Vibrant` |
| **Ink** (text) | `#001d1d` | `ambientDark[1]` |
| **Deep ground** (dark surfaces, footer) | `#002b2c` | `ambientDark[0]` |
| **Paper** (light ground) | `#fce9d4` | `ambientLight[0]` |
| **Paper shade** (cards, rules, quiet zones) | `#eedcc7` | `ambientLight[1]` |
| Reserve — teal | `#265656` | `DarkMuted` — quiet secondary; never competes with accent |
| Reserve — highlight | `#efc62d` | `LightVibrant` — rare, small, warm highlight only |

Rules: warm accent on quiet ground, always. Accent is for meaning (a link, the mark, one emphasized line), never for decoration. Large fields are paper, deep ground, or photograph — never orange.

## Typography direction

*(Direction and criteria; the concrete face is chosen in the landing mockup and recorded in NOTES until ratified.)*

- **One humanist sans**, quiet and slightly warm, for everything — display and text. No display/body pairing games; hierarchy comes from size and space, not from font changes.
- Hard criteria: a beautiful **ä** at all sizes; true lowercase-friendly (the brand is a lowercase word); tabular figures (the product shows times); excellent at both 9px micro-marks and hero sizes.
- Generous whitespace is a brand asset, not a layout accident — emptiness is the message (IDENTITY §liberties).

## Imagery law

- **Photography is the brand's imagery** — the same skins the product ships (a koi pond, a lamplit tunnel, a nudibranch, trees under stars): real, quiet subjects. No stock-office photography, no illustrations-of-people-at-desks, no abstract "tech" renders.
- **Photography is always contained, never wallpaper** *(ruled 2026-08-06)*: on outward surfaces the photo appears inside a frame — a screenshot, a still, the video — as the product being shown. Full-bleed photo backdrops are overwhelming and off-promise; page grounds are the koi-derived ambients instead.
- The photo is never washed, scrimmed, or blurred (carried from DESIGN law: no glass on the photo, ever). Content sits on glass *beside* or *over* the image the way the app's blocks do — inside the product, where that law lives.
- Screenshots of the product are preferred over illustrations of the product.

## Inherited hard law (from `app/DESIGN.md` — applies to all outward surfaces)

- SVG-only iconography; no emoji glyphs on designed surfaces.
- Motion restraint: short cross-fades only; **no carousels, no parallax, no auto-playing or ambient animation**.
- **No testimonials, social-proof, or pricing furniture** on any surface.
- Glass follows the product's two-state law (rest = absolute glass; frost only under attention) wherever glass is imitated outside the app.
