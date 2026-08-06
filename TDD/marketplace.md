# Testing the marketplace — unit + behavioral against the mock, a few reused from the app, one integration run

*Criteria: [`../marketplace/SCENARIOS.md`](../marketplace/SCENARIOS.md) (every item MUST). Build order: [`../marketplace/BUILD.md`](../marketplace/BUILD.md) — the marketplace builds last, after all four layers, against the service mock (`../marketplace/INTERFACES.md §1/§5`), never the real closed service.*

The marketplace is a closed grammar (what a bundle can say) plus a fork (what install copies once, forever independent of the source). So its tests split the same way: schema/mock-service checks for the grammar, behavioral checks for the fork and the propose→confirm walk, and a couple of tiers borrowed wholesale from the app because that's where the picker and the preview card actually render.

## Unit tests (schema & mock-service fixtures)

Deterministic checks against the meta-schema or the canned catalog — no live dependency, the mock **is** the fixture:
- **F1–F3 [the closed grammar]** — a bundle carrying an executable-shaped payload (F1), an off-menu rule (F2), or any people/booking/history field (F3) is unrepresentable in the meta-schema, refused before the install door.
- **F4, F5 [the two seeds]** — the "Free Time Available" seed validates as the span floor (F4); the dive-center seed validates as the span ceiling (F5). **F5 was unblocked 2026-08-06**: the dive-center seed's governed rules now have their `min-occupancy` menu entry (`../engine/SPEC.md §3`, scenarios `../engine/SCENARIOS.md` O1–O4), and the four-day course shape has `KindTemplate` (`§1.12`, W5–W8). The fixture validates end-to-end.
- **D1, D2, D4 [discovery format]** — every published item carries exactly one category + tags (D1); the featured shelf shows only admin-flagged items, no computed ranking exists to test around (D2); the catalog carries `popularity` while no v1 surface sorts by it — format presence, UI absence (D4).
- **E4 [nothing licensed leaks]** — a build-artifact scan (the X2 pattern, applied to licensed derivatives): no long-lived or reusable signed URL in the repo, the client bundle, or a cache header that outlives its signature.

## Behavioral tests (Given/When/Then, against the service mock)

Rides the harness's stub discipline ([`harness.md`](harness.md)) — a situation, an install- or publish-shaped action, an assertion on what got written:
- **I1, I3, I5** — installing writes a provenance-stamped local copy with no live link or subscription record (I1); a tampered bundle carrying any F1/F2/F3 violation is refused whole, with the failing entry named (I3); uninstalling removes only the source document — confirmed rules and commitments stand (I5).
- **I2 [propose→confirm]** — installing "Free Time Available", each blanked parameter walks as an ordinary proposal; nothing writes without the owner's confirm.
- **P1 [unpublish is safe]** — given an installed copy, when the upstream is unpublished or re-versioned, the installed copy is byte-identical afterward — fork isolation.
- **E2, E3 [degradation]** — service unreachable: the picker offers exactly the shipped four + Plain, full function (E2, drives `../app/SCENARIOS.md` S6); every already-installed template stays fully functional, because installed is local forked data (E3).

## Component/state tests (rides the app tier, [`app.md`](app.md))

Render a component or canvas state from a fixed payload — the same discipline as app's O2 (starters compile to seam writes):
- **I4 [installs compile to normal writes]** — the post-install board state is byte-equivalent in shape to the same setup authored by hand through the console.
- **D3 [preview per good]** — a skin card renders the owner's own board re-tinted; a template card renders the proposal-card anatomy plus the ghost guest page from the owner's real availability — both display projections, zero writes, watermarked.

## Wire tests

Real HTTP / absence-of-route assertions, the app G-family and D5 pattern applied to the marketplace's own doors:
- **P2 [admin-only]** — no user-reachable publish surface or endpoint exists, tested as absence (no route, no UI affordance) — the app D5 pattern.
- **E1 [entitled fetch]** — an entitled account receives short-lived signed URLs for a store skin's derivatives; an unentitled account receives none; the palette-only preview still works for both.

## End-to-end: the integration run

- **Z1 [seed round-trips]** — with harness, engine, and app all real: a Sofia-shaped account installs "Free Time Available", publishes a link, a booking lands and appears on the board; a Hug-shaped account installs the dive bundle and the setup Situation C's clean run begins from exists on the board. **Unblocked 2026-08-06**, same root cause as F5: the dive-bundle half is now constructible by install *and* by hand-authoring, given the engine's `min-occupancy` entry and `KindTemplate` (`../engine/SPEC.md §3`, `§1.12`). Both halves run once app Z2 and engine Z1–Z2 are green.

## Done when

All unit and behavioral families green against the mock (`../marketplace/BUILD.md` Steps 0–4), the component/state and wire tiers green re-running app **S5–S6** unchanged, then **Z1** — both halves runnable, the dive-bundle half unblocked by the F20 and F7 rulings of 2026-08-06.
