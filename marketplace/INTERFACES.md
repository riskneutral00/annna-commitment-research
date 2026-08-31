# annnä Marketplace — INTERFACES (the seams)

*Four seams: **downward** to the closed service (the only place infrastructure lives), **upward** to the app (which renders the store), **across** to the harness (which installs cross it as ordinary elicitation), and **down** to the engine (which is not marketplace-aware). The governing constraint, **scoped** *(2026-08-29 — read as absolute it was already false, and visibly so: the downward list below has grown three verbs since this line was written)*: **zero new seam verbs on the inward seams** — app, harness, engine — where the marketplace rides existing shapes or it has gone wrong. The **downward** seam to the closed service has a **ruled growth path** instead: its verb list grows by ruling and only by ruling, each addition recorded with the section that needed it — `entitlements.grant` and `catalog.publish`/`catalog.unpublish` each arrived exactly that way.*

---

## §1. To the closed service (downward)

The store's infrastructure — catalog, curation, payments, entitlements, licensed-asset delivery — is a **closed hosted service in a separate private repo**, reached over a **versioned, authenticated API**. Named here by shape only:

- `catalog.list(good, filters) → catalog documents` — browse (good = skin | template; filters = category/tags/featured).
- `catalog.get(id) → document` — one item, full document.
- `entitlements.list(account) → entitlement set` — what this account owns.
- `entitlements.grant(account, item) → entitlement` — **the install's grant** *(verb added 2026-08-21 — `SPEC.md §3` said "install = entitlement grant" while this list held nothing that grants one, so BUILD Step 2's end-to-end gate could only run against a pre-seeded map)*. Alpha: granted directly (templates are free listings until the transaction surface exists; skins stay admin-curated); post-alpha: `transaction.complete` is what causes the service to grant, and this verb is the shape the grant arrives through either way.
- `assets.sign(pack, account) → short-lived URLs` — licensed derivatives, entitled accounts only.
- `catalog.publish(document) / catalog.unpublish(id)` — **templates: credentialed to the publishing owner's session** (FD-82); **skins: admin identity through the pack pipeline**. **`catalog.unpublish` is bound to the listing's own publisher** *(2026-08-29 — the pair was credentialed for *publish* and said nothing about who may unpublish, so any signed-in owner credential read as sufficient to take down anyone's listing)*: only the account that published a listing may unpublish it, and any other caller is refused; the skin path stays admin identity. *(Verbs added 2026-08-21 — §2 ends "publish to the catalog" and FR38 requires an app-authored bundle to reach it, while no listed call could put anything in or take anything out; `../security/SPEC.md §11`'s two-paths-per-good and marketplace P2/P4 govern who can reach these and what may travel.)*
- `transaction.begin / transaction.complete` — **post-alpha**; the only calls whose substance is the closed service's own, and they live entirely behind this seam. The open half never sees their contents — it observes the resulting entitlement state and nothing else (`SPEC.md §5`).

**CI discipline (carried): mocked always.** No closed-service call ever runs in CI. This repo stubs the **whole service**: a canned catalog (the shipped four skins, **one store-skin fixture**, and the two seed templates — **throwaway fixtures**, FR38: mock content, never a shipped default), an entitlement map that covers the fixture for one account and not another, and a **test signer that mints genuinely expiring URLs** — never a dead stub, because the signed-URL laws (E1/E4) must be *executable* against the mock, not vacuously green. **The transaction stubs are INERT** *(2026-08-29 — `transaction.begin`/`transaction.complete` are marked post-alpha here while `BUILD.md` Step 1 gates E7 on exercising "the store's entitlement and transaction surface"; with nothing standing behind the verbs, E7 was unbuildable at the step that owns it)*: the mock stubs both verbs **inert** — each accepts the call and records that it was made, and **causes nothing**: no entitlement, no ledger record, no state change anywhere. That is precisely what makes E7 executable, and what makes its assertion an absence rather than a balance. **The mock is the contract test** — the service must honor these shapes, versioned; a shape change is a version, never a silent break.

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
- **The engine is not marketplace-aware** — deliberately. No marketplace field, flag, or table exists in engine truth — the one ruled exception is a projection, not a field: the **candidate-shape ghost**, the engine's fourth display projection (FD-34, `../RULINGS.md` — the deliberate exception to the zero-new-seam-shapes posture), display-only and minting nothing, consumed by `SPEC.md §6`/D3. Note recorded in `SPEC.md §7`: the no-export ruling holds because a bundle is **authored as a data-free §1.2 shape, not extracted from a populated board** (FD-82 closed user supply; P4 is the extract refusal).

## §5. Stub strategy

- **Service mock** (per §1): canned catalog + entitlement map + a **real test signer minting genuinely expiring URLs** — with **caller-identity control** *(2026-08-31, F-29)*: the mock accepts a test-selected account identity per call, so the entitled/unentitled/second-account walks (P2a/P5a/P8's shapes) drive both sides of every entitlement assertion — never a dead stub, because E1 and E4 must be *executable* against the mock rather than vacuously green (§1 carries the reasoning). The same mock serves this package's suite, the app's S6/S7, and CI everywhere.
- **The entitlement-withdrawal control** *(named 2026-08-29 — E5, E6 and E9 each need a withdrawal to happen partway through a run, and no control existed for a suite to cause one)*: the mock's **entitlement map is suite-mutable** — a test grants and withdraws an entitlement between calls, and the withdrawal carries no reason across the seam, because there is no field for one (`SPEC.md §5`). That mutability is the whole mechanism those three assert against.
- **The store-skin fixture, pinned** *(2026-08-29 — §1 requires "one store-skin fixture" and never said what it is made of; a fixture cut from a licensed master would put licensed IP in a public repo, which E4 treats as an incident rather than a bug)*: it is an `../assets/make-pack.mjs` run over a **non-licensed test master** — a throwaway fixture under FR38, mock content and never a shipped default.
- **Harness:** scripted transcripts for install walks (the I-family) — real harness once built; scripted seam calls before that.
- **App:** the record-and-return spies of `../app/INTERFACES.md §4`, unchanged.
