# LANDING — the page and its states

*The public landing page, specified once, deployed in three states as the product becomes real. Copy obeys VOICE; colors and marks obey BRAND; every claim traces to IDENTITY.*

**Ruled (Matt, 2026-08-06):**
- **The lead carrier is the product in use.** The hero is a **video of a real person using annnä** — not a slogan, not a still composition. Until that footage exists, the hero slot shows **still images of real progress** as the build advances. Until *those* exist, the page stays a near-vacant holding page.
- **Worry-first** ordering governs the page's words (see MESSAGING §pitches).

---

## The three states

### State 0 — now (holding page)

**The empty board is the hero** *(ruled 2026-08-06: not blank space — show the schedule with nothing on it)*, on a **quiet ground, not a photograph** *(also ruled 2026-08-06: a full-page photo backdrop is overwhelming, not peaceful — the skins are showcased inside the product, in the video and the stills, never as page wallpaper)*. The ground is the koi-derived ambient gradient: warm paper (`#fce9d4 → #eedcc7`) in light, deep ground (`#002b2c → #001d1d`) in dark, per the viewer's theme. On it:

- The alpaca mark + **annnä** wordmark (top-left, small).
- **The board panel**: the current real week, Sunday through Saturday, date row with today as an accent pill, seven columns — completely empty. Per the board law it carries **no time axis** (time is block data, not position) and the date row is the only navigation furniture shown. The empty grid *is* the claim, made literal.
- Beneath the board, the line:
  > **Nothing on your schedule.**
- Under it, small: `in the making — github.com/<repo>` *(the repo link is the only action; no email capture until there's something to announce).*

Nothing else. No nav, no sections, no footer beyond a MIT/© whisper. An empty week that stays calm is the brand behaving as promised.

### State 1 — progress stills

Same page; the hero slot becomes a **still frame of the real product as it comes alive** — actual screenshots of the board rendering real weeks, replaced as milestones land (first block placed, first proposal card, first skin swap). Each still is captioned with a date and one plain sentence of what became real. No mockups, no staged shots: the page only ever shows things that exist.

### State V1 — the usage video

The hero is **one continuous take of a person using annnä**, *user-initiated*: a poster frame with a play control. It never autoplays — which means it complies with the motion law ("no auto-playing or ambient animation") outright; no exception was needed or made. Narration follows worry-first:

> Your schedule is kept in your head. *(the person, mid-life, phone in hand)*
> annnä holds it instead. *(they speak; a block lands on the photograph)*
> And the work behind each promise — she does that too. *(a proposal card; one tap; done)*

Under the video, the page in full:

1. **Hero** — the video. One line beneath: **Nothing on your schedule.**
2. **The head, put down** — three sentences of worry-first copy (MESSAGING 30s pitch, first half).
3. **One week, run twice** — the dive-shop table, tightened to five rows. Proof section.
4. **What it never does** — four refusals from IDENTITY (§values 1–4), one line each. Trust section.
5. **The board, up close** — stills: buffers ("unavailable 5:50–7:00 — and I don't have to say why"), the Harold exclusion, the won-back afternoon.
6. **Footer** — mark, wordmark, repo link, license. Nothing more.

## Standing law for every state

- **The page wears no photograph.** Photography appears only *contained* — inside the video frame, the progress stills, and screenshots of the board — where it is the product being shown, not the page's own dress. When it does appear it is never washed, blurred, or scrimmed.
- The ground is the koi-derived ambient gradient (both themes), so the brand colors still greet the reader without the sensory load of a full image.
- Copy sits on quiet cards that follow the breathing-glass law's spirit — **at rest the governed-legibility law holds** (rest is *legible under the owner's own dial*, FD-21/FD-22's re-cut; never the pre-FD-21 "near-invisible" absolute) — presence under attention *(restated 2026-08-31, m-34, under the freeze's in-place truth-correction class, FD-101)*.
- No testimonials, social proof, counters, or pricing furniture. No carousels, parallax, or ambient motion. SVG-only icons.
- The page never shows anything that doesn't exist yet. Screenshots over renders, always.
- One page. No nav bar of sections. Scrolling is the only navigation.

## Mockup

[`mock/landing.html`](mock/landing.html) — a self-contained build of **State 0** with the State V1 skeleton stubbed beneath it (video slot as a labeled placeholder), so the holding page can ship now and grow in place. The alpaca appears as a placeholder roundel until the SVG is drawn.
