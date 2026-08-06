# annnä Marketplace — INTERFACES (the seams)

*Four seams: **downward** to the closed service (the only place infrastructure lives), **upward** to the app (which renders the store), **across** to the harness (which installs cross it as ordinary elicitation), and **down** to the engine (which is not marketplace-aware). The governing constraint everywhere: **zero new seam verbs** — the marketplace rides existing shapes or it has gone wrong.*

---

## §1. To the closed service (downward)

The store's infrastructure — catalog, curation, payments, entitlements, licensed-asset delivery — is a **closed hosted service in a separate private repo**, reached over a **versioned, authenticated API**. Named here by shape only:

- `catalog.list(good, filters) → catalog documents` — browse (good = skin | template; filters = category/tags/featured).
- `catalog.get(id) → document` — one item, full document.
- `entitlements.list(account) → entitlement set` — what this account owns.
- `assets.sign(pack, account) → short-lived URLs` — licensed derivatives, entitled accounts only.
- `transaction.begin / transaction.complete` — **post-alpha**; the only calls whose substance is the closed service's own, and they live entirely behind this seam. The open half never sees their contents — it observes the resulting entitlement state and nothing else (`SPEC.md §5`).

**CI discipline (carried): mocked always.** No closed-service call ever runs in CI. This repo stubs the **whole service**: a canned catalog (the shipped four skins, **one store-skin fixture**, and the two seed templates), an entitlement map that covers the fixture for one account and not another, and a **test signer that mints genuinely expiring URLs** — never a dead stub, because the signed-URL laws (E1/E4) must be *executable* against the mock, not vacuously green. **The mock is the contract test** — the service must honor these shapes, versioned; a shape change is a version, never a silent break.

## §2. To the app (upward)

- The app renders the storefront surfaces — the gallery riser's store shelf, the browse riser, the template preview — **from catalog documents**, as `../app/SPEC.md §7`-class app-only views. It runs the preview projections and nothing else: no purchase logic, no entitlement math, no price rendering beyond what the document states.
- **Zero new harness render verbs.** Storefront surfaces are app-only views; nothing about the store passes through `render(surface, payload)`.
- **What the app stubs when this package is absent: nothing.** The app's shipped-four default *is* the absent state (`../app/SCENARIOS.md` S6) — the marketplace is an addition to a complete app, never a dependency of it.

## §3. To the harness (the install crossing)

- A template install reaches the harness as **ordinary elicitation input**: the bundle's shapes become a sequence of proposals through the existing propose→confirm flow. The harness's B1 scope discipline applies per proposal; B2 ask-once applies to repeated parameters across the walk.
- **Zero new tools, zero new verbs; the floor is untouched.** Installing is *authoring* — nothing outward fires without its own basis, exactly as if the owner had spoken each shape to the console.
- What the harness stubs here: **nothing** — this package builds after the harness is real (`BUILD.md`). The marketplace's own suite scripts the harness where a scenario needs one.

## §4. To the engine

- An installed template writes **only constructs the engine already accepts**: kinds, rules from the closed menu, Shared shapes, boards — with fork provenance recorded in history. An off-menu rule shape was already refused at the install door (`SPEC.md §3`), upstream of the engine's own refusal; the door is a courtesy, the engine is the law.
- **The engine is not marketplace-aware** — deliberately. No marketplace field, flag, or table exists in engine truth. Note recorded in `SPEC.md §7`: the engine's no-export ruling and admin-only supply hold together.

## §5. Stub strategy

- **Service mock** (per §1): canned catalog + entitlement map + dead signer; the same mock serves this package's suite, the app's S6/S7, and CI everywhere.
- **Harness:** scripted transcripts for install walks (the I-family) — real harness once built; scripted seam calls before that.
- **App:** the record-and-return spies of `../app/INTERFACES.md §4`, unchanged.
