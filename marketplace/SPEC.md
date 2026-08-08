# annnä Marketplace — SPEC (the open half of the store)

*One marketplace, two goods — **skins** and **templates** — on the same publish/browse/install rails. This file is the law of the goods, the rails, and the entitlement lane. The store's infrastructure is a **closed hosted service** outside this repo; only its seams appear here (`INTERFACES.md §1`). Everything in this file must make complete sense with that service absent. **Transaction terms are the closed service's and are not specified here** (§5).*

---

## §0. What the marketplace is

- **One marketplace, many document types** (carried ruling 2026-07-18). Skins are the shallow end (a pack + palette document); templates are the deep end (a bundle of shapes). Both flow through the same publish → browse → install rails; a new good is a new document type, never a new store.
- **Every payload is closed-grammar data, validated at the install door.** A marketplace document can rename, arrange, parameterize and skin; it can never express executable code, add lifecycle states, or alter engine semantics. **An installed item can never contain a program** — the worst case is a bad bundle, never an attack. Trust reads the format; revenue runs the store.
- **Supply is admin-only.** The founder publishes; users never can. This is structural, not policy: no user-reachable publish endpoint or surface exists anywhere in the product (`SCENARIOS.md` P2). The admin pipeline for skins is `../assets/make-pack.mjs`.

## §1. The goods — two document formats

### §1.1 The skin pack document

The catalog form of a skin (`../app/DESIGN.md §Appearance` is the law of how a skin is *worn*):

| Field | What it is |
|---|---|
| `id` / `name` / `version` | Identity. A re-publish is a new version (§2). |
| `palette` | The approved token set — the shipped packs' `palette.json` shape as it actually is: dominants + semantic roles, accent/accentDeep, ambient gradient pairs, tint alphas, `suggestedMode` (`light` \| `dark`), LQIP. The glass temperature (warm \| dark) **derives** from it per `../app/DESIGN.md §Appearance` — it is not a stored field. |
| `derivatives` | The responsive image set (WebP + AVIF at 640/1280/2048 + mobile aliases). **Licensed IP: delivered only as short-lived signed URLs to entitled accounts** (§4) — never in a public repo or client bundle. |
| `license` | The licensed-IP marker. The asset license is not the code license; MIT covers this repo, not store images. |
| `preview` | **Palette-only** preview material — enough for the gallery to re-tint the owner's board *before* the account is entitled, without touching a licensed image. |
| catalog metadata | Category, tags, featured flag, `popularity` (§6). |

The shipped four (dark · koi · nudi · treestars) + Plain are the **permanent floor** beneath this format: they ship in every build, need no entitlement, and are the guaranteed floor when the store is unreachable — installed store skins additionally survive from their persisted device copies (§3, §4).

### §1.2 The template bundle document (the "blueprint")

A template is a **business-in-a-box** (personal cases included): the transferable *shape* of how someone runs bookable time — never their data. Carried law (prior build CONTRACTS §25), restated in full:

| Field | What it is |
|---|---|
| `id` / `name` / `version` / `provenance` | Identity + who published it (OR-28 governs how identity is vouched — open, §7). |
| `domain` | The vocabulary: commitment-kinds with their typed fields ("dive course", "lesson"), display naming. Bounded by the same meta-schema as all generative UI (`../app/SPEC.md §4`). |
| `rule_shapes` | Entries from the engine's **closed rule menu** — with operands **blanked or marked as the publisher's choices**. "Buffer between dives" is transferable wisdom; *their* 30 minutes is their setting. An off-menu rule shape is refused at the install door, upstream of the engine's own refusal. |
| `shared_shapes` | The outward faces: bookable-availability and booking-form shapes — the authoring side of the engine's Shared projection. |
| `resource_shapes` | Boards to create: instructor roster slots, boat, pool, gear — **shapes only, no people**. |
| catalog metadata | Category, tags, featured flag, `popularity` (§6). |

- **Hard fence — people and data never travel.** No counterparty, booking, history, ledger or personal-data record is *representable* in the format: the fields do not exist (poka-yoke, asserted as schema-level unrepresentability — `SCENARIOS.md` F3).
- **The format spans the seed catalog.** Smallest legal bundle: **"Free Time Available"** — one shared bookable-availability shape with blanked hours/duration/buffer (a teacher's bookings, a date, any meeting). Largest: the **dive-center** bundle — multi-resource shapes, course kinds, governed rules with blanked operands. Both must validate against one grammar (`SCENARIOS.md` F4/F5).
- **Relationship to onboarding starters.** The app's starter templates (`../app/SPEC.md §8` — meals, workouts, share-my-availability) are **app-local stored templates, deliberately a separate system**: same spirit, different artifact, never merged. A future ruling may let a marketplace bundle *ship* starters; none may replace them.
- **Divergence from the prior bundle, recorded** (the supersessions discipline): the prior ruling's bundle was "domain schema + booking templates + rule shapes." `shared_shapes` and `resource_shapes` are **deliberate additions** — this architecture makes the outward faces and the resource boards first-class, so the bundle carries their shapes too.

## §2. Publish (admin-only)

**Author → validate against the format grammar → assign one category + tags (+ optional featured flag) → publish to the catalog.** The **Author** step is not hand-writing a document. A template bundle is *authored through the agent* — the same harness tools that shape any board (generative-UI + rule writes + `CRUD_Shared`/`CRUD_SOP`; `../harness/SPEC.md §5`/`§6`, `../harness/SCENARIOS.md` G6) produce the kinds, rule shapes and shared/resource shapes, and that output is **saved as a §1.2 bundle**. This is the **authoring law's one normative home** (FR13, `../archive/08-founder-rulings-2026-08-06.md`): a bundle is **never hand-written by a developer**, and no template ships except by this path. Skins additionally run the pack pipeline (`../assets/make-pack.mjs`) and register their derivatives behind entitlements — **into the closed service's private delivery, never a public web-root**: the pipeline's `public/assets/packs/` output path serves the shipped free skins only.

- **Authoring is the general capability; publishing is admin-only (FR38).** *A user can author a template through their agent* — bundle-shaped output from the same tools that shape any board — and that is FR38's **first-priority acceptance**. What stays admin-only is **publish** to the catalog (§0): no user-reachable publish surface exists (`SCENARIOS.md` P2, unchanged). The founder-as-administrator's **prove → save → ship** workflow *is* this path — author a domain template *as a user* through the app, save the bundle, publish it — which is why a shipped default is proof any user could have built it, not developer-written content.
- A re-publish is a **new version**; the catalog lists the newest.
- **Unpublish removes the listing only.** Installed copies are never touched — fork isolation (§3) makes this safe by construction: *unpublish → installed copies continue to work* (`SCENARIOS.md` P1).

## §3. Install

Browse → preview → install. **Install = snapshot fork with provenance** (`createdVia: install`, source id + version) — **no live upstream link, no update subscription. The installer owns their copy.**

- **Skins:** install = entitlement grant (granted by the closed service, §5) + pack fetch. The skin joins the owner's gallery and faves like any shipped skin. **The fetched pack persists on the entitled device** — §4's short-lived URLs govern *delivery*, never the device's private copy — which is what lets a store skin satisfy the no-flash and outage laws (`../app/SCENARIOS.md` S4/S6). For skins, the fork-ownership law reads: the entitlement plus the device copy *are* the installer's copy; unpublish removes the listing, never the entitlement or the copy.
- **Templates:** the bundle is **validated whole at the door** — an unknown field, unknown type, or off-menu rule shape refuses the entire install with the failing entry named; there is no partial install (`SCENARIOS.md` I3). Then the installer's **own agent** walks the blanked parameters through the normal **propose → confirm** elicitation — the proposal card **is** the preview, not a separate stage — *their* buffer, *their* prices, *their* hours — so **every write is an ordinary harness-mediated write**. There is no bulk silent import, and the floor is untouched: installing is authoring (`INTERFACES.md §3`).
- **Uninstall keeps the past.** Uninstalling a template removes the source document only; rules and commitments already confirmed stand, under changing-the-rules-never-rewrites-the-past.

## §4. Entitlements & degradation

- **Per-account entitlements**, held by the closed service. Licensed images are served only via **short-lived signed URLs** to entitled accounts; nothing licensed appears in any public repo, client bundle, or long-lived URL (`SCENARIOS.md` E4). The signed-URL/entitlement discipline is an instance of the capability-token law (`../security/SPEC.md §3`); E4 remains its scenario.
- **Degradation law (carried):** service unreachable → the shipped four + Plain always, plus any installed skin whose pack is on-device (§3), at full function; **every installed template keeps working** (installed = local forked data); store shelves show an honest "store unreachable" — never stale store actions, never an error wall (`../app/SCENARIOS.md` S6, `SCENARIOS.md` E2/E3).

- **Revocation (FR14, ruled 2026-08-06).** An entitlement can be **withdrawn by the closed service**. Why it was withdrawn is out of scope (§5) — the open half sees only the state change, and the law is one rule with no special cases:

  **A withdrawn entitlement takes effect at the next entitlement check.** The skin **deactivates**, its **fave slot clears**, and appearance falls back to the shipped floor (§0's four + Plain). Checks occur at **skin activation** and at **app open**.

  *This does not contradict §3's device-copy persistence, and the distinction is the whole point:* §3 says **unpublish** never removes the entitlement or the device copy — unpublish is a *catalog* event. Withdrawal is an *entitlement* event. Under FR14 the device copy still persists on disk; what changes is that **the entitlement no longer authorizes activation**. The pack is not deleted, hunted down, or remotely wiped.

  *Interaction with the degradation law, stated so a builder does not have to guess:* offline, **no check can occur**, so the last-known entitlement stands and the skin keeps rendering. Revocation is therefore never a flash, never an error, and never an outage-triggered downgrade — it lands on the next successful check, which is exactly the behavior S4/S6 require.

## §5. The closed-service lane

- **Store transactions live entirely inside the closed service.** What the store transacts, and on what terms, are properties of that service and are **deliberately not specified in this repo** — no rails, no keys, no math, no stated terms. This repo's readers get the open half; the terms are not part of it.
- **The lane distinction is a safety law, not a commercial one.** The product's money law — *money is tracked, never moved* — governs value **between users on boards**. A store transaction is a **different lane** and never touches a board's ledger records (indexed in §8's invariants ledger below). **Points are never money** — stands regardless of what the store transacts.
- **Entitlement, not transaction, is what this repo models.** The open half sees exactly one fact: whether an account is entitled to an item (§4). How an entitlement was acquired, and how it ends, are the closed service's business — the open half reacts to the entitlement state and nothing else. That boundary is what keeps §4's revocation law free of any transaction detail.

## §6. Discovery (minimal by decision, 2026-08-06)

Supply is admin-only and the early catalog is small; discovery is deliberately minimal, with the growth path reserved in the format rather than built.

- **Categories & tags.** Every published item carries exactly **one admin-assigned category** + freeform tags. Seed categories mirror what the format is known to span (the Situations): *Bookable availability* · *Rentals & holds* · *Courses & multi-resource operations* · *Appointments & visits*. Skins are a good-level tab, not a category. Adding a category is an admin catalog edit, never code.
- **The browse surface** is one riser, shelves stacked: **Featured** (admin-curated — the only merchandising) → **New** (publish date) → one shelf per category. No search machinery in v1; a client-side text filter over name + tags is the only finding aid. The skins pop-out stays the fave four (`../app/DESIGN.md §Appearance`); the riser is where volume lives.
- **Preview per good — your own life, re-dressed.** A skin card renders the owner's own board re-tinted (carried law). A template card shows the owner's board *re-doored*: the proposal-card anatomy reused verbatim — tag chip → title → rule lines in plain language → the blanked parameters listed as "yours to set" — beside a **ghost render of the guest page the owner's own real availability would publish under the bundle's shared shape** (for the dive bundle: the ghosted resource boards it would stand up). Zero writes, engine projections only, watermarked as preview (`SCENARIOS.md` D3).
- **The catalog's own language (founder-ruled 2026-08-07, wayfinder #4).** FR15 rules guest surfaces via the owner's stored language; the store surface has no owner to ask — so it renders in **the viewing owner's stored language setting**, the same setting reused, with **English fallback** where a translation does not yet exist. The generated preview rule-lines render in the viewer's language from day one; category and bundle display names gain translations behind the fallback. No device-locale inference, no second language question.
- **Popularity is reserved, not built.** The catalog document carries a `popularity` field (service-computed install count) from day one; no v1 surface sorts by it. Turning it on later is a data flip — the sort key inside category shelves and an optional "Popular" shelf — with **no format change**. No ratings, no reviews, no recommender, unless ruled.

## §7. Open rulings (carried open, not resolved here)

- **OR-28 — curation & impersonation.** How publisher identity is vouched (the "Official PADI Blueprint" problem). Recommendation on record: fully curated catalog first; private link-share possibly staged earlier. Unruled.
- **OR-29 — template supply terms.** Behind the closed service's own post-alpha ruling; the terms themselves are §5 material and are not stated here. Nothing in the open half depends on the outcome — templates install through the entitlement seam either way.
- **User supply.** The prior build's retrieval-corpus flywheel ("instructor #200 gets a good draft because #1–199 corrected theirs") presumed user publishing — recorded as a future direction, **not specced**, under the admin-only ruling. Note the dependency: the engine's no-export ruling holds *because* a published bundle is **authored as a data-free shape** under §1.2's hard fence (line 43) — no counterparty, booking, or record is representable — which is *authoring*, never *export*; the ruling continues to forbid extracting a **populated** board. Opening user publishing (e.g. OR-28's link-share stage) is what would put export pressure on the engine — re-open both together.

## §8. Invariants ledger

| Invariant | Where constructed |
|---|---|
| An installed item can never contain a program | §0 (closed grammar) + §3 (install-door validation) |
| No personal data is representable in a bundle | §1.2 (the fields do not exist) |
| Unpublish/upstream edit never mutates an installed copy | §2 + §3 (snapshot fork) |
| No user upload path exists | §0 (no endpoint, no surface — tested as absence) |
| The repo is complete without the closed service | §4 (degradation law; shipped floor) |
| A store transaction never touches board money records | §5 (the lane distinction) |
| A withdrawn entitlement deactivates at the next check, without deleting the device copy | §4 (FR14) |
| A template install cannot bypass propose→confirm | §3 (parameters walk ordinary elicitation) |
