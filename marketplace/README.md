# annnä Marketplace — spec package

> **FROZEN 2026-08-08 — specified, not being built. Nothing here is deleted.**
> **What is frozen:** this whole package — `SPEC.md`, `INTERFACES.md`, `SCENARIOS.md`, `BUILD.md`. No step of it is worked, and **no other package's build waits on it** — the dependency runs the other way: this package's own preamble gates it on app Step 8's stub-swap, and no layer's BUILD step gates on anything here. What *does* wait on it is **content**: `../app/DESIGN.md`'s store-facing appearance states and `../assets/`'s pipeline both name this freeze as what they wait for, and neither of them gates an app BUILD step either.
> **Resume condition** *(corrected 2026-08-21 to match `BUILD.md`'s preamble, which this line claimed to restate and did not — one layer's swap had become four, and two conditions had been dropped)*: **the app stub-swap complete (`../app/SCENARIOS.md` Z2), the harness suite green (specifically the elicitation family B1/B2 and the floor family D, which the install crossing rides), and the engine's rule menu + Shared projection green** — this package's own `BUILD.md` preamble gates it on exactly that (as does `../deployment/SPEC.md`'s Wave 3 row), so the freeze changes nothing about *what* unblocks it, only that nobody is working it in the meantime.
> **What the freeze does not do:** it deletes no scenario, weakens no gate, and removes nothing from gate-coverage. A frozen spec is a spec waiting its turn, not a retired one. The app must keep working with this package **absent or unreachable** — the shipped four skins + Plain, and every installed template, keep working regardless (`../app/INTERFACES.md`), and that requirement is *not* frozen.

annnä is four layers — **Model / Harness / Engine / App** (`../README.md`) — and this fifth package sits beside them: **the store**. One marketplace, two goods:

- **Skins.** Photo backdrops that re-dress the board (`../app/DESIGN.md §Appearance`). Store images are licensed IP, delivered only to entitled accounts by the closed service. The four shipped skins + Plain are the permanent floor, present in every build and needing no entitlement.
- **Templates.** Business-in-a-box bundles — the transferable *shape* of how someone runs bookable time: a domain's vocabulary, rule shapes with the numbers blanked, outward booking faces, resource boards to stand up. From a single "Free Time Available" share up to a whole dive center. Never anyone's data.

Both goods ride the **same publish → browse → install rails**. **Templates are owner-publish** (FD-82): any signed-in owner may author, save, and publish a shape. **Skins stay the admin pack pipeline.** Authorization gates (official class, terms) may sit on top later; they are not this sitting.

**The open/closed split is the whole architecture of this package.** The store's infrastructure — catalog, curation, payments, entitlements, licensed-asset delivery — is a **closed hosted service in a separate private repo**, reached over versioned APIs and **mocked in CI, always**. This repo specs only the **open half**: the two document formats, the install law, and the seams. A fork without the service is a complete-but-plain harness — that is the intended freemium boundary. Nothing in this repo may depend on the closed service to make sense.

**This folder's purpose:** the complete design for the open half. Read in order:

1. **`SPEC.md`** — the goods (both document formats), the publish and install law (snapshot forks, the install door), entitlements & degradation, the closed-service lane, minimal discovery, open rulings, invariants.
2. **`INTERFACES.md`** — the four seams: closed service (mocked always), app (renders the store, stubs nothing), harness (installs are ordinary propose→confirm elicitation), engine (not marketplace-aware). Zero new seam verbs on the inward seams; the downward list grows by ruling only.
3. **`SCENARIOS.md`** — the acceptance suite: formats, publish, install, entitlement/degradation, discovery, and the two seed bundles end-to-end.
4. **`BUILD.md`** — the ordered plan. **Builds last**, after all four layers; gated on their suites.

*(No `DESIGN.md` here — storefront surfaces are app surfaces and obey `../app/DESIGN.md`.)*

**Definition of done:** every scenario passes against the CI service mock; the app's degradation scenario (S6) holds; and a template install round-trips through the **real** harness propose→confirm suite with **zero new harness verbs** — installing is authoring.

**Deliberately NOT here:** user **asset** uploads — skins stay the admin pack pipeline; templates are owner-publish (FD-82) · transaction handling of any sort, and the store's terms with it — both live inside the closed service and are not specified in this repo (`SPEC.md §5`) · ratings, reviews, or social machinery · live-subscription installs or upstream auto-update · recommendation engines · points as currency.

Carried rulings and their provenance are cited inline in `SPEC.md`; the open rulings this package inherits (curation/impersonation, template supply terms) are held open in `SPEC.md §7`, not resolved here; user supply closed 2026-08-24 (FD-82, recorded in `SPEC.md §7`).
