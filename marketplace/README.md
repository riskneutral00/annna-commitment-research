# annnä Marketplace — spec package

annnä is four layers — **Model / Harness / Engine / App** (`../README.md`) — and this fifth package sits beside them: **the store**. One marketplace, two goods:

- **Skins.** Photo backdrops that re-dress the board (`../app/DESIGN.md §Appearance`). Store images are licensed IP, delivered only to entitled accounts by the closed service. The four shipped skins + Plain are the permanent floor, present in every build and needing no entitlement.
- **Templates.** Business-in-a-box bundles — the transferable *shape* of how someone runs bookable time: a domain's vocabulary, rule shapes with the numbers blanked, outward booking faces, resource boards to stand up. From a single "Free Time Available" share up to a whole dive center. Never anyone's data.

Both goods ride the **same publish → browse → install rails**. Supply is **admin-only** — the founder publishes; users never can.

**The open/closed split is the whole architecture of this package.** The store's infrastructure — catalog, curation, payments, entitlements, licensed-asset delivery — is a **closed hosted service in a separate private repo**, reached over versioned APIs and **mocked in CI, always**. This repo specs only the **open half**: the two document formats, the install law, and the seams. A fork without the service is a complete-but-plain harness — that is the intended freemium boundary. Nothing in this repo may depend on the closed service to make sense.

**This folder's purpose:** the complete design for the open half. Read in order:

1. **`SPEC.md`** — the goods (both document formats), the publish and install law (snapshot forks, the install door), entitlements & degradation, the money lane, minimal discovery, open rulings, invariants.
2. **`INTERFACES.md`** — the four seams: closed service (mocked always), app (renders the store, stubs nothing), harness (installs are ordinary propose→confirm elicitation), engine (not marketplace-aware). Zero new seam verbs anywhere.
3. **`SCENARIOS.md`** — the acceptance suite: formats, publish, install, entitlement/degradation, discovery, and the two seed bundles end-to-end.
4. **`BUILD.md`** — the ordered plan. **Builds last**, after all four layers; gated on their suites.

*(No `DESIGN.md` here — storefront surfaces are app surfaces and obey `../app/DESIGN.md`.)*

**Definition of done:** every scenario passes against the CI service mock; the app's degradation scenario (S6) holds; and a template install round-trips through the **real** harness propose→confirm suite with **zero new harness verbs** — installing is authoring.

**Deliberately NOT here:** user supply or uploads of any kind · transaction handling of any sort, and the store's terms with it — both live inside the closed service and are not specified in this repo (`SPEC.md §5`) · ratings, reviews, or social machinery · live-subscription installs or upstream auto-update · recommendation engines · points as currency.

Carried rulings and their provenance are cited inline in `SPEC.md`; the open rulings this package inherits (curation/impersonation, template supply terms, user supply) are held open in `SPEC.md §7`, not resolved here.
