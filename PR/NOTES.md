# PR — NOTES (open items)

*Scratchpad per repo convention: never authoritative; the package files are. Items leave this list by being absorbed into a file, relocated to an inward package's NOTES, or done.*

## Open

- **Truth corrections applied to frozen derived copy, 2026-08-21 — recorded so the freeze tension is visible.** The corpus review found four outward-truth defects in `MESSAGING.md`/`VOICE.md` and they were corrected in place under the `BRAND.md` line-71 precedent (*a correction of a restatement is not new outward material, so the freeze is not engaged*): the Situation-1 ceiling stated as the product gained the v1 caveat the README already carried (two sites + VOICE's exemplar row); the cost answer's "sells no data and shows no ads" clause was deleted (VOICE's own commercial-silence rule forbids the partial answer); the "complete, reviewed design" claim gained the build-has-begun correction the round-three remediation had applied to the README and missed here; the investor category line gained BRIEF's across-employers qualifier. **Distinct from the stale-pitches item below, which stays deliberately unfixed** — those await a *rewrite* (new authoring, freeze-covered); these were false-as-written claims, and a freeze is not a license to keep overclaiming. If the founder reads the freeze more strictly, reverting is four small diffs.
- **Alpaca SVG** — not yet drawn. Brief and construction constraints in `BRAND.md §The mark`. Until it exists, surfaces use the dashed-roundel placeholder (see `mock/landing.html`). **Prior art exists**: the previous build shipped a raster alpaca face — see `~/Desktop/annnä/docs/vibe-slice-archive/keep/14-landing-newalpaca.png` (large) and `28-koi-calendar.png` (in-header roundel), **outside this repo, on the founder's machine** — provenance only; nothing here depends on seeing them. Note a tension to resolve when drawing: the prior mark is soft-cute (fluffy, pink topknot); BRAND's brief says "quiet, not cute." Matt's call which spirit the SVG follows — the brief bends to him, not the reverse.
- **Typeface ratification** — `BRAND.md` sets criteria (one humanist sans, clean **ä**, tabular figures) and reserves the choice to the landing mockup; the mockup still uses a system stack (Seravek / Avenir Next fallback chain) as a stand-in. **The product has since chosen a working face — Noto Sans (2026-08-09)** — by measurement against twenty open self-hostable candidates, recorded here per BRAND's own instruction. Full evidence and the trade at `../app/DESIGN.md` §Typography. **RATIFIED 2026-08-22 (FD-44): the face is Nunito Sans** — the founder chose by eye at a 10-face sampler rendering every real product surface ("Typography goes to option number seven"), exercising exactly the mockup-moment reservation this entry recorded. The warm-vs-neutral deviation resolved in warmth's favour, with Nunito Sans rather than the previously named Merriweather Sans; the superfamily cost is accepted (Thai/CJK fall back to Noto Sans siblings — `../app/DESIGN.md` §Typography, the home). This entry stands as the record of the working-choice interval. `BRAND.md` remains unedited (frozen for new outward material; its §Typography direction already says the concrete face is recorded here).
- **Domain** — undecided. The wordmark fallback law (`annna` where **ä** is impossible) lives in BRAND; the domain choice will follow it.
- **Landing State 1 stills** — start capturing dated screenshots the moment the harness renders anything real (LANDING §state 1). Progress stills only ever show things that exist.
- **V1 usage video** — the ruled lead carrier. One continuous take of a real person using annnä; narration follows worry-first (MESSAGING §pitches). Plan the shoot when the app is usable end-to-end; never autoplays.
- **GitHub social preview** — generate per `REPO-FACADE.md` once the alpaca SVG exists.
- **Email capture** — deliberately absent from State 0 (nothing to announce yet). Revisit at State 1.

## Questions test readers asked that copy can't answer (routed to product/spec)

*From the 2026-08-06 adversarial pass — three stranger-persona readers (tutor, dive-shop owner, investor). Each is a real product question; the PR package must not invent answers.*

- **"Reachable" under bad signal** — the README's clean run places "the top free reachable freelancer"; a dive pro asked what reachable means when half his freelancers are on boats for days. Response timeout, fallback order, and escalate-to-owner behavior need a spec answer (harness/engine).
- **Freelancer counter/decline** — can a freelancer ask a question or counter a rate before accepting, or only accept/decline? "No negotiation thread" reads as owner-friendly and freelancer-hostile at once.
- **Medical-flag conversations** — a flagged dive medical should route to a required human conversation, not silent document collection (liability, DAN/insurer expectations). Check against user-stories + security.
- **Tutor-world channels** — a tutor's friction is WhatsApp threads and platform bookings (iTalki/Preply), not phone calls; nothing anywhere speaks to platform coexistence. Copy now adapts the friction noun (MESSAGING), but the product question stands.

## Investor-readiness gaps (raw material only Matt can supply)

*The investor persona's verdict was PASS, for reasons copy can't fix:*

- **One named design partner or pilot commitment** — the concentric-circle strategy (tutors, dive pros, the therapist) doubles as this; getting one "yes, I'll be first" on record converts the whole story.
- **Build timeline + who builds** — the "no app yet" answer needs a milestone plan and team shape beside it before any investor meeting.
- **Competitive one-pager** — Calendly, Acuity, Fresha, Cal.com, Mindbody, Motion et al., and why multi-party coordination is a different category. **Partially answered 2026-08-08** in [`BRIEF.md`](BRIEF.md) §The landscape: the AI-calendar side (Motion, Reclaim, Calendly; Clockwise shut down after the Salesforce acquisition) and the vertical-booking side (Anolla, Aquateks, Roverd, Bookeo, EVE Diving, Anchor) were scanned, and the claim narrowed — multi-resource scheduling is **not** novel and no outward surface may imply it is. Still open: Acuity, Fresha, Cal.com and Mindbody were not covered.

## Also flagged

- **`MESSAGING.md`'s pitches still open from the retired self-description (2026-08-08, deliberately not fixed).** `IDENTITY.md` §What it is now names *"annnä is an agent-first commitment harness"* as the sentence every outward surface opens from. Two pitches predate it and contradict it: the 10s — *"Your calendar is replaced by an agent you talk to"* — and the 30s — *"annnä is a conversational agent that holds it instead."* They are **derived outward copy**, which is exactly what the freeze covers, so they were left alone rather than quietly rewritten. **What is not stale:** the ruled worry-first order in both pitches is correct and unaffected — only the noun is. Rewrite them in the pass that lifts or scopes the freeze, alongside `PRD.md` §11 Q2's third mechanism. **Disposition, 2026-08-30 — ruled *mark, don't rewrite*:** a standing line now sits under `MESSAGING.md` §Elevator pitches saying neither pitch is reusable verbatim until rewritten, and `README.md`'s freeze preamble was widened to admit the status-annotation class it lands under. No outward word was authored or altered. The rewrite is still owed at the pass that lifts the freeze; this bullet records the disposition so a third audit does not rediscover it.

- **State 0 conversion trade-off** — the holding page's only action is a GitHub link, which a non-technical tutor can't act on. Deliberate (nothing to announce yet), but it means State 0 converts no first-users; revisit alongside the email-capture item at State 1.

## Decided (recorded in files)

- Photography is contained, never wallpaper — full-bleed photo backdrops rejected as overwhelming (Matt, 2026-08-06); page grounds are koi-derived ambients; the skins are showcased inside the video/stills → `BRAND.md §Imagery`, `LANDING.md`.

- Lead carrier = the product in use (video; stills until then; vacant holding page now) → `LANDING.md`.
- Pitch order = worry first → `MESSAGING.md §pitches`.
- Brand color = koi-derived, no new hexes → `BRAND.md §Color`.
- Alpaca = the brand mark → `BRAND.md §The mark`.
- Voice = neutral like water; four banned registers → `VOICE.md`.
- The name is never explained → `IDENTITY.md §Personification` (standing rule).
- `assets/masters/dark.jpg` subject check — the fact-checker opened it: a hooded figure on a walkway in a lit tunnel, previously described outwardly as "a night reef" (wrong); README + BRAND now say "a lamplit tunnel." Whether this master is the intended long-term skin was settled 2026-08-22 — the shipped packs are fixtures, not canon, so no master is a long-term commitment → `../app/DESIGN.md §Appearance`.

**`IDENTITY.md`'s "not a marketplace of attention" bullet, re-read against FR-B and FR4 — it stands unchanged (2026-08-06).** The line is *"no notifications designed to bring you back."* FR-B removed the internal console-silent rule and FR4 makes escalation email default-on, so a sweep will keep surfacing this line. It is **not** a contradiction, and the reason is in the wording: the promise is about notifications whose *purpose is re-engagement* — attention-farming. An escalation email says *a booking is stuck and nobody answered*; a surfaced trigger card says *this happened while you were out*. Those exist to **discharge** the user's attention, not to capture it — which is the same claim as *"the goal is for the user to feel like there is nothing on their schedule."* A future sweep should re-derive this rather than strike the line; if annnä ever ships something whose purpose *is* re-engagement, the line is what has to go, not this note.
