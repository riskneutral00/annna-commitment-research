# annnä Marketplace — SPEC (the open half of the store)

*One marketplace, two goods — **skins** and **templates** — on the same publish/browse/install rails. This file is the law of the goods, the rails, and the entitlement lane. The store's infrastructure is a **closed hosted service** outside this repo; only its seams appear here (`INTERFACES.md §1`). Everything in this file must make complete sense with that service absent. **Transaction terms are the closed service's and are not specified here** (§5).*

---

## §0. What the marketplace is

- **One marketplace, many document types** (carried ruling 2026-07-18). Skins are the shallow end (a pack + palette document); templates are the deep end (a bundle of shapes). Both flow through the same publish → browse → install rails; a new good is a new document type, never a new store.
- **Every payload is closed-grammar data, validated at the install door.** A marketplace document can rename, arrange, parameterize and skin; it can never express executable code, add lifecycle states, or alter engine semantics. **An installed item can never contain a program** — the worst case is a bad bundle, never an attack. Trust reads the format; revenue runs the store.
- **Template supply is owner-publish (FD-82).** Any signed-in owner may author a template through the console, save it for themselves, iterate, and publish it so others can install it. **Skins stay the admin pack pipeline.** This is capability, not gatekeeping: authorization gates (who may claim “Official PADI”, terms) may sit on top later (OR-28 / OR-29). They are not this sitting. `SCENARIOS.md` P2/P3. The admin pipeline for skins is `../assets/make-pack.mjs`.

## §1. The goods — two document formats

### §1.1 The skin pack document

The catalog form of a skin (`../app/DESIGN.md §Appearance` is the law of how a skin is *worn*):

| Field | What it is |
|---|---|
| `id` / `name` / `version` | Identity. A re-publish is a new version (§2). |
| `palette` | The approved token set — the shipped packs' `palette.json` shape **as it actually is: sixteen fields**, in the enumeration order the gate itself carries: `name` · `master` · `luminance` · `colorfulness` · `suggestedMode` · `dominants` · `semantic` · `accent` · `accentDeep` · `ambientDark` · `ambientLight` · `tintDarkAlpha` · `tintLightAlpha` · `brightestRegion` · `darkestRegion` · `veil`. **Every sub-shape is printed below the table.** *(Enumerated in full 2026-08-21 — the old cell named eight-ish and omitted `name`, `master`, and the two load-bearing measurements, so a schema built from it could not compute the veil and would refuse every real pack at §3's unknown-field door. Restated as **sixteen** 2026-08-29: the cell read "all thirteen fields" while naming more than thirteen, and the shipped packs and the gate both carry sixteen — the number was false the moment it was read as a count.)* **`luminance` and `colorfulness`** are the measured values the veil derivation and the pack-acceptance floor read. The **veil** — the tint every glass surface is made of — **derives** per `../app/DESIGN.md §Appearance`, by mode from the pack's stored **`brightestRegion`** *(stored alongside `veil` itself, added 2026-08-22 — the V1 fix: the spike proved the old "continuous function of `luminance`" claim described a mechanism the packs could not feed, and a pack the build never saw needs the measurement stored to derive at install time)* plus 18% of its `DarkMuted`. **The install door also runs the derived AA floors** (`../app/DESIGN.md §Appearance`; a11y A12) — a pack that derives cleanly but fails contrast over its own regions refuses exactly as one missing a field does. **`darkestRegion` is stored beside that pair** *(added 2026-08-22, the same argument one field over: `../app/DESIGN.md`'s A1 urgency walk and A12 install floors solve against the pack's `brightestRegion` **and its darkest counterpart**, and a pack the build never saw needs both measurements stored to derive at install time — measured and written by the admin pipeline exactly as `brightestRegion` is, never a per-name table)*. *(2026-08-09: this was a two-value warm\|dark "glass temperature" switched on `suggestedMode`, and that rule is gone — `suggestedMode` still selects ink and density pair, never the veil.)* **The LQIP is not in this half (FD-31, ruled 2026-08-21):** a 24px inlined rendition of the licensed photograph is a rendition of the licensed photograph, so it lives in `derivatives` — **landed 2026-08-22**: the pipeline change shipped (`c49c1d2`) and all four packs' `palette.json` no longer carry it; the compliance note that stood here is discharged. |
| `derivatives` | The responsive image set (WebP + AVIF at 640/1280/2048 + mobile aliases) **and, since FD-31, the LQIP**. **Printed below**, filenames and all. **Licensed IP: delivered only to entitled accounts** (§4) — never in a public repo, client bundle, or unentitled-reachable document, **as a URL or as inlined data** (E4's content-based restatement). |
| `license` | The licensed-IP marker. **Printed below.** The asset license is not the code license; MIT covers this repo, not store images. |
| `preview` | **Palette-only** preview material — the gallery re-tints the owner's board from **swatches alone** *before* the account is entitled, without touching a licensed image or any rendition of one (FD-31). **Printed below.** |
| catalog metadata | Category, tags, featured flag, `popularity` (§6). |

**The pack document, printed** *(2026-08-29 — the fields were named and their shapes were not, so a schema built from this section alone could not accept a real pack; the derivatives grammar existed nowhere but `../assets/make-pack.mjs`)*. `#rrggbb` stands for a hex colour throughout; no example colour is written here on purpose:

```
pack : {
  id, name, version,       // `name` is the PACK's name — what the install door's unknown-field
                           // check reads, and what palette.json and derivatives.json each carry.
                           // The listing's display title is publish-assigned catalog metadata
                           // (§6) and is never what the door validates against.
  palette, derivatives, license, preview,
  category, tags, featured, popularity          // catalog metadata (§6)
}

palette : {
  name            : string,               // the pack name again — palette.json is its own document
  master          : string,               // the master image filename
  luminance       : number,               // measured
  colorfulness    : number,               // measured
  suggestedMode   : "light" | "dark",     // selects ink and the density pair, never the veil
  dominants       : [ { hex: "#rrggbb", share: 0..1 } ],
  semantic        : { Vibrant, Muted, DarkVibrant, DarkMuted, LightVibrant, LightMuted },
                                          // six fixed keys, each a "#rrggbb" string
  accent          : "#rrggbb",
  accentDeep      : "#rrggbb",
  ambientDark     : [ "#rrggbb", "#rrggbb" ],     // gradient pair
  ambientLight    : [ "#rrggbb", "#rrggbb" ],     // gradient pair
  tintDarkAlpha   : number,
  tintLightAlpha  : number,
  brightestRegion : "#rrggbb",
  darkestRegion   : "#rrggbb",
  veil            : "#rrggbb"
}

derivatives : {
  name : string,                          // the pack name; this is the pack's derivatives.json
  lqip : "data:image/webp;base64,..."     // a 24px-wide WebP of the master, inlined (FD-31)
}
// The renditions that sit beside it, by filename: photo-640, photo-1280 and photo-2048, each
// as .webp AND .avif; plus the aliases photo@1x, photo@2x and photo@3x (.webp only), bound to
// 640, 1280 and 2048 respectively. Every one of them — the LQIP included — is a rendition of
// the licensed photograph: entitled accounts only, by short-lived signed URL (§4), never in a
// public repo, a client bundle, or an unentitled-reachable document, as a URL or as inlined
// data (E4).

license : { holder, terms }
// The licensed-IP marker: who holds the photograph's rights, and under what licence. The
// licence text itself is not carried in this repo. The asset licence is not the code licence.

preview : { swatches : [ "#rrggbb", ... ] }
// Palette-only by construction: the gallery re-tints the owner's own board from swatches
// alone, before the account is entitled. No rendition of the licensed photograph appears
// here in any form, the LQIP included (FD-31, E4).
```

The shipped four (dark · koi · nudi · treestars) + Plain are the **permanent floor** beneath this format: they ship in every build, need no entitlement, and are the guaranteed floor when the store is unreachable — installed store skins additionally survive from their persisted device copies (§3, §4).

### §1.2 The template bundle document (the "blueprint")

A template is a **business-in-a-box** (personal cases included): the transferable *shape* of how someone runs bookable time — never their data. Carried law (prior build CONTRACTS §25), restated in full:

| Field | What it is |
|---|---|
| `id` / `name` / `version` / `manifest_version` | Identity and the authoring envelope. **`version` is content-addressed**: it increments when the document's content changes, never once per save call — which is what keeps `../engine/SPEC.md §1.7a`'s determinism guarantee ("the same session projects an **identical bundle** every time") true of the whole document and not only of its projected core. **`manifest_version` is the manifest-version stamp** *(field added 2026-08-29 — §3 has said since 2026-08-22 that the install door compares the catalog-manifest version a bundle was authored against, and the format carried no field for it to compare, so the door's rule was undecidable in fact)*: the app catalog-manifest version (`../app/SPEC.md §4.1`) the bundle was authored under, written by the save step **around** the projected set, so the projection itself stays the pure read §1.7a specifies. A re-publish is a new version (§2). |
| `domain` | The vocabulary: commitment-kinds with their typed fields ("dive course", "lesson"), display naming. Bounded by the same meta-schema as all generative UI (`../app/SPEC.md §4.1` — typed nodes from the closed list, a per-language `label` map, closed per-type prop lists). |
| `rule_shapes` | Entries from the engine's **closed rule menu** (`../engine/SPEC.md §3`) — with operands **blanked (the sentinel below) or set as the publisher's choices**. "Buffer between dives" is transferable wisdom; *their* 30 minutes is their setting. An off-menu rule shape is refused at the install door, upstream of the engine's own refusal. |
| `shared_shapes` | The outward faces: bookable-availability and booking-form shapes — the authoring side of the engine's Shared projection. **Printed below.** |
| `resource_shapes` | Boards to create: instructor roster slots, boat, pool, gear — **shapes only, no people**. **Printed below**, with its strips. |
| `kind_templates` | *(Field added 2026-08-21 — `KindTemplate` unblocked F5/Z1 in the engine while this table had no field for it to travel in, so the dive course was projectable in prose and refused at §3's unknown-field door in fact.)* Multi-day course shapes (`../engine/SPEC.md §1.12`), carried **role-only**: `{kind, sessions[{label, offset, duration, consumes[{board_role, quantity}], requires}], anchor_policy}`. **The hard fence binds this field with two named exclusions**: a session's `consumes` may carry **`board_role` only, never `board_ref`** (a concrete board on the publisher's account is their data), and the object travels **without `owner_org`** — both are stripped by the fence's selectable-set construction (`../engine/SPEC.md §1.7a`), not filtered after. |
| catalog metadata | Category, tags, featured flag, `popularity` (§6). |

**The wire grammar, printed** *(2026-08-29 — two fields were named with no shape a builder could implement and the blanking convention had no printed form, so the F4 and F5 seeds were writable only by guessing)*. Field names and their types; nothing here adds semantics the corpus has not ruled:

```
shared_shapes: [ {
    id, label,
    face     : "bookable-availability" | "booking-form",

    // bookable-availability — the three operands the "Free Time Available" seed blanks
    hours    : recurring-window | "blanked",
    duration : duration-range   | "blanked",
    buffer   : duration         | "blanked",

    // booking-form — a generative-UI schema, bounded by the app's meta-schema: typed
    // nodes from the closed list, per-language label map, closed per-type prop lists,
    // no code, no event handlers, no lifecycle
    form     : schema
} ]

resource_shapes: [ {
    role       : string,                 // "instructor", "boat", "pool", "gear" — a role, never a board
    kind       : string,                 // the board kind to stand up
    capacity   : unit-number | "blanked",
    attributes : [ { name, type } ]      // declared shape only, never a value about a person
} ]
// STRIPPED, by construction: `owner`. A concrete owner is the publisher's data. The strip is
// the projection's selectable-set construction, never a filter run afterwards — exactly as the
// kind_templates fence strips board_ref and owner_org.
```

**The blanked-operand sentinel, one printed form.** A blanked operand travels as a **required-present key carrying the reserved value `"blanked"`** — never as an absent key. **Omission is malformed**, refused whole at the door with the failing entry named; only the sentinel means "the publisher left this one to the installer". That is what makes F2's and I3's refusal decidable at the door rather than a judgement about what a missing key was supposed to mean, and it is the printed form of `../engine/SPEC.md §1.7a`'s "operands are blanked either way".

**Bounding schema, field by field** (so F1's and F3's unrepresentability is checkable one field at a time): `domain` → the meta-schema at `../app/SPEC.md §4.1` · `rule_shapes` → the closed menu at `../engine/SPEC.md §3`, plus the sentinel above · `kind_templates` → `../engine/SPEC.md §1.12` · `shared_shapes` / `resource_shapes` → the structs printed above.

**Authored vs publish-assigned, split** *(2026-08-21 — the flat table made G8 and I6 undecidable: if catalog metadata were required at authoring, no projected bundle could ever validate)*: the **authored set** is *what the engine projection emits, plus the save step's stamped envelope* — `domain`, `rule_shapes`, `shared_shapes`, `resource_shapes`, `kind_templates` from the projection (`../engine/SPEC.md §1.7a`), wrapped in `id`/`name`/`version`/`manifest_version` by the save step — and it is what G8/I6 validate against. The **publish-assigned set** — **`provenance`**, category, tags, featured, `popularity`, listing copy — is attached at §2's publish step by the **publishing owner**, with two members that are never the publisher's to set: **featured** is an admin merchandising flag and **`popularity`** is service-computed (§6). The publish-assigned set is **absent from an authored/saved bundle by definition**; the install door's unknown-field refusal checks against the full grammar, in which the publish-assigned fields are optional-at-authoring and present-at-catalog. The two that had no printed shape:

```
provenance : { publisher, published_at }   // who listed it, and when. HOW that publisher identity
                                           // is vouched is OR-28 — open, §7
listing    : { title, summary, detail }    // §2's "detailed information on what it is and what it
                                           // does"; rendered in the viewing owner's language with
                                           // English fallback (§6, the home of that rule)
```

**Three version species, never conflated:** the **seam API version** — the closed service's versioned API (`INTERFACES.md §1`); the **bundle document version** — `version` above, content-addressed; and the **catalog-manifest version** — the manifest-version stamp `manifest_version` carries and §3's door compares.

- **Hard fence — people and data never travel.** No counterparty, booking, history, ledger or personal-data record is *representable* in the format: the fields do not exist (poka-yoke, asserted as schema-level unrepresentability — `SCENARIOS.md` F3).
- **The format spans the seed catalog.** Smallest legal bundle: **"Free Time Available"** — one shared bookable-availability shape with blanked hours/duration/buffer (a teacher's bookings, a date, any meeting). Largest: the **dive-center** bundle — multi-resource shapes, course kinds, governed rules with blanked operands. Both must validate against one grammar (`SCENARIOS.md` F4/F5).
- **Relationship to onboarding starters.** The app's starter templates are **app-local stored templates, deliberately a separate system** — same spirit, different artifact, never merged, and never replaceable by a marketplace bundle; their home, including which starters exist, is `../app/SPEC.md §8` (FR13, and the second list that used to stand here had already drifted from it).
- **Divergence from the prior bundle, recorded** (the supersessions discipline): the prior ruling's bundle was "domain schema + booking templates + rule shapes." `shared_shapes` and `resource_shapes` are **deliberate additions** — this architecture makes the outward faces and the resource boards first-class, so the bundle carries their shapes too.

## §2. Publish (owner-publish for templates, FD-82)

**Author through the console → save for the owner → iterate → publish to the catalog.** The **Author** step is not hand-writing a document. A signed-in owner tells the agent what the template must be able to do; the same harness tools that shape any board (generative-UI + rule writes + `CRUD_Shared`/`CRUD_SOP`; `../harness/SPEC.md` §5/§6, `../harness/SCENARIOS.md` G6) produce the kinds, rule shapes and shared/resource shapes. That output is **saved as a §1.2 bundle** for the owner — private, iterable, **not a catalog listing**. **Publish** is a later owner act: the saved bundle is listed so others can install it, carrying detailed information on what it is and what it does (the publish-assigned set: provenance, category, tags, listing copy). This is the **authoring-and-publish law's one normative home** (FR13): a bundle is **never hand-written by a developer**; developers never author domain templates (FR38 authorship, unchanged). Skins additionally run the pack pipeline (`../assets/make-pack.mjs`) and remain **admin-only**.

- **Save is not publish.** A saved bundle lives on the owner's account. Catalog listing happens only when they press publish (`SCENARIOS.md` P3).
- **The save law — and §2 is its one normative home (FR13)** *(2026-08-29: the projection's side and the authoring side each described a save, and neither said what the save validates or where the document lands)*. The ratified sentence, in full:

  > Save skips the door's F1/F2/F3 checks — deliberately: the §1.7a projection is fenced by construction and its source rules are closed-menu-constrained at write time (an off-menu type is unstorable), so the checks are a structural no-op on a save; install re-runs them because it crosses a trust/time boundary the save never crosses. The PROJECTION, not the door, guarantees the §1.2 sentinel on every emitted operand — a mid-authoring draft's unset operand included ("operands blanked" means the sentinel on the wire).

  The projection named there is `../engine/SPEC.md §1.7a`. The projected document **lands in §3's app-owned document store, through the same write path an install's fork lands through**, provenance **`createdVia: save`**. **No new seam verb, and no second store path** — a saved bundle and an installed fork are the same class of document in the same store, told apart by their provenance and nothing else. `../harness/SPEC.md §6` and `../engine/SPEC.md §1.7a` specify the projection; the save itself is law here.
- **Publish re-runs the authored-set validation the install door runs — as a courtesy, never as the law.** The door stays where validity is decided (§3), and running the same checks at publish means nothing invalid is ever listed in the first place, so the refusal an installer would have met arrives at the publisher instead.
- **A saved bundle is deletable by its owner, and deleting it never orphans an existing listing.** A listing is the catalog's own document; removing the owner's saved original leaves everything already published, and everything already installed, exactly as it was. Gated at P6.
- **Any owner may publish a template they authored** (FD-82). No authorization gate on *who* in this sitting. Future gates may sit on top (OR-28 vouched “official” class; OR-29 terms). Do not invent those gates here.
- A re-publish is a **new version**; the catalog lists the newest.
- **Unpublish removes the listing only.** Installed copies are never touched — fork isolation (§3) makes this safe by construction: *unpublish → installed copies continue to work* (`SCENARIOS.md` P1).
- **No extract-from-board.** Publish lists an authored, data-free §1.2 shape. Extracting a populated board is still refused (engine no-export; `../engine/SPEC.md` §1.7a). Field names remain the publisher's; there is no mechanical fence on “John's medication list” now that review is not admin-only (FD-1 residual, annotated).

## §3. Install

Browse → preview → install. **Install = snapshot fork with provenance** (`createdVia: install`, source id + version) — **no live upstream link, no update subscription. The installer owns their copy.**

- **Skins:** install = entitlement grant (through the seam's `entitlements.grant`, granted by the closed service, §5 — `INTERFACES.md §1`) + pack fetch. The skin joins the owner's gallery and faves like any shipped skin. **The fetched pack persists on the entitled device, in an app-managed store outside the HTTP cache** *(named 2026-08-21 — E4 forbids a cache header outliving the signature, so a builder using the HTTP cache as the "device copy" would satisfy E4 and break S4/S6 on the first eviction; the persistent copy is the app's own storage, written after fetch, and E4 governs only the delivery response)* — §4's short-lived URLs govern *delivery*, never the device's private copy — which is what lets a store skin satisfy the no-flash and outage laws (`../app/SCENARIOS.md` S4/S6). For skins, the fork-ownership law reads: the entitlement plus the device copy *are* the installer's copy; unpublish removes the listing, never the entitlement or the copy. **Owner-initiated removal** *(2026-08-29 — install had an inverse for templates (uninstall) and none for skins, so an owner who wanted a skin off their device had no specified act)*: the owner may remove an installed skin — it **deactivates**, its **fave slot clears**, and the **device copy is deleted**. **The entitlement survives**, so a re-fetch re-installs it with no new grant. This is the exact **inverse of FR14's split** (§4): there the entitlement ends and the copy stays; here the copy goes and the entitlement stays.
- **Templates:** the install reads the full document through **`catalog.get`** (`INTERFACES.md §1`), and the bundle is **validated whole at the door** — an unknown field, unknown type, or off-menu rule shape refuses the entire install with the failing entry named; there is no partial install (`SCENARIOS.md` I3). **A bundle records the catalog-manifest version it was authored against, and the door compares** *(2026-08-22 — `../app/SPEC.md §4.1`'s manifest now carries one; a bundle authored under a newer manifest than the client's refuses with the versions named, the same honest refusal as an unknown field)*. **Validate, then grant — in that order** *(2026-08-29 — this narrative named no grant at all for templates while `INTERFACES.md §1` calls `entitlements.grant` "the install's grant" for both goods; with the order unstated a builder could grant on the install request and then refuse the document, leaving an entitlement to nothing)*: **`entitlements.grant`** runs only once the door has passed the bundle, so **a refused install never brings an entitlement into existence** and there is never one to withdraw afterwards. **The validated fork lands in an app-owned document store — the sibling of the skins' app-managed store above — owned by the installer** *(named 2026-08-22, the mirror of the skins' named home: every other candidate is explicitly closed — no marketplace table exists in engine truth (`INTERFACES.md §4`) and the app's starter store is deliberately a separate system (§1.2) — so this store is what serves the fork's visibility and resumability below and what I5's uninstall removes)*. Then the installer's **own agent** walks the blanked parameters through the normal **propose → confirm** elicitation — the proposal card **is** the preview, not a separate stage — *their* buffer, *their* prices, *their* hours — so **every write is an ordinary harness-mediated write**. There is no bulk silent import, and the floor is untouched: installing is authoring (`INTERFACES.md §3`). **The walk is a session under the authoring twin's law** *(2026-08-21 — the T2 session law, harness G5; the walk had no session state, and §3's order of operations lands the fork first, so an abandoned dive-center walk otherwise stranded a forked source plus half-confirmed rules in a state no scenario described)*: save/resume/abandon; partially-confirmed parameters persist as `draft` (disabled) rules; an abandoned walk leaves the fork plus its drafts — visible, resumable, and removable by ordinary uninstall (I5's path covers the partial case). Bundle-carried free text (naming, provenance prose) enters the installer's context tagged `document` and takes the quarantined read (`../security/SPEC.md §5`, the install door's stamp).
- **Uninstall keeps the past.** Uninstalling a template removes the source document **and any `draft` (disabled) rules the walk left behind** *(corrected 2026-08-29 — "the source document only" contradicted the partial-walk cleanup this same section specifies and I8 asserts, which has drafts to remove; I5 cites this sentence, so the contradiction was load-bearing)*; rules and commitments **already confirmed** stand, under changing-the-rules-never-rewrites-the-past.

## §4. Entitlements & degradation

**An installed pack the grammar has moved past** *(2026-08-22, the mirror of `../engine/SPEC.md §1.10`'s evolution rule — the palette grammar has already grown stored fields once, and install is a fork with no upstream link)*: when the app's pack grammar gains fields an already-installed pack lacks, the pack **degrades to the shipped floor by this section's existing mechanism** until it is re-derived (where the new fields are derivable from what it stores) or re-installed; it is never silently broken and never silently un-installed.

- **Per-account entitlements**, held by the closed service. Licensed images are served only via **short-lived signed URLs** to entitled accounts; **nothing licensed — as a URL or as inlined data — appears in any public repo, client bundle, long-lived URL, or unentitled-reachable document** (`SCENARIOS.md` E4, content-based since FD-31). The signed-URL discipline is an **analogue of** the capability-token law, governed separately *(reworded 2026-08-21 — the old "an instance of" filed it into `../security/SPEC.md §3`'s closed table, which has no row for it and whose binding rules it fails on every axis: stateless, no stored digest, no revocation latch, and minted by the closed service rather than annnä — the reversal §3.1 exists to stop)*; E4 remains its scenario.
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

Supply for **templates** is owner-publish (FD-82); **skins** stay admin. Discovery is deliberately minimal, with the growth path reserved in the format rather than built.

- **Categories & tags.** Every published item carries exactly **one category from the closed set** + freeform tags, assigned at publish by the owner. Seed categories mirror what the format is known to span (the Situations): *Bookable availability* · *Rentals & holds* · *Courses & multi-resource operations* · *Appointments & visits*. Skins are a good-level tab, not a category. Adding a category is an admin catalog edit, never code.
- **The browse surface** is one riser, shelves stacked: **Featured** (admin-curated — the only merchandising) → **New** (publish date) → one shelf per category. No search machinery in v1; a client-side text filter over name + tags is the only finding aid. The skins pop-out stays the fave four (`../app/DESIGN.md §Appearance`); the riser is where volume lives.
- **Preview per good — your own life, re-dressed.** A skin card renders the owner's own board re-tinted **from palette swatches** (carried law; FD-31 — no licensed rendition before entitlement). A template card shows the owner's board *re-doored*: the proposal-card anatomy reused verbatim — tag chip → title → rule lines in plain language → the blanked parameters listed as "yours to set" — beside a **ghost render of the guest page the owner's own real availability would publish under the bundle's shared shape** (for the dive bundle: the ghosted resource boards it would stand up). **The ghost is the engine's fourth display projection — the candidate-shape ghost (FD-34, ruled 2026-08-21)**: it takes the *uninstalled* candidate shape plus the owner's real availability, is fenced by construction like its four siblings *(count re-read 2026-08-28 — the effective-policy projection joined as the fifth, `../engine/SPEC.md §1.7c`; the ghost is still the fourth by landing order)*, and mints nothing — no Shared row, no token digests; before the ruling no projection could take an uninstalled shape and producing a real Shared would have minted digests, so D3's template half was unbuildable. Zero writes, engine projections only, watermarked as preview (`SCENARIOS.md` D3).
- **The agent's suggestion is the entry; browsing is never the opening move** *(2026-08-21 — `Situation-A-prime/situation-1.md`'s opening beat, the one D-family beat with no scenario)*: a template that would serve a need the owner just expressed arrives as an **ordinary proposal card inside the owner's own turn** (FR-A: the proposal card is the preview; the harness's inline-offer discipline governs — nothing unprompted, nothing on a trigger firing), linking onward to the D3 preview. The browse riser stays reachable from the store shelf and never self-opens. Gated at D5.
- **The catalog's own language (founder-ruled 2026-08-07, wayfinder #4).** FR15 rules guest surfaces via the owner's stored language; the store surface has no owner to ask — so it renders in **the viewing owner's stored language setting**, the same setting reused, with **English fallback** where a translation does not yet exist. **Which member of the stored set, defined** *(drafted 2026-08-21 — FR15 stores a *set* of guest languages and FR32 reused it as if it were one value, leaving a {th, en, ru} shop's store surface undefined; **ruled FD-79, 2026-08-23 — ratified in place, not struck**. FD-79 made this one conditional on an FR15 check: strike if it conflicts with FR15's home, ratify if it governs a distinct object. **It governs a distinct object and the check found no conflict** — FR15's home now itself states the ask as *"ranked, their own working language first"* and names this section as what the ranking exists to serve (`../app/SPEC.md §5`, FR15's bullet), so the premise this drafted text supplied has since been adopted at the home rather than contradicted by it; and the object here is FR32's ownerless catalog surface, which FR15 explicitly does not reach)*: FR15's setup question elicits the set **ranked, the owner's own working language first** — a one-word cost at the same ask — and the catalog renders in the **top-ranked member**, English fallback behind it. No device-locale inference, no second language question. The generated preview rule-lines render in that language from day one; category and bundle display names gain translations behind the fallback.
- **Popularity is reserved, not built.** The catalog document carries a `popularity` field (service-computed install count) from day one; no v1 surface sorts by it. Turning it on later is a data flip — the sort key inside category shelves and an optional "Popular" shelf — with **no format change**. No ratings, no reviews, no recommender, unless ruled.

## §7. Open rulings (carried open, not resolved here)

- **OR-28 — curation & impersonation.** How publisher identity is vouched (the "Official PADI Blueprint" problem). **Unruled; a future gate on top of owner-publish (FD-82).** FD-82 does not close this. Admin-only supply no longer makes impersonation structurally impossible.
- **OR-29 — template supply terms.** Behind the closed service's own post-alpha ruling; the terms themselves are §5 material and are not stated here. Nothing in the open half depends on the outcome — templates install through the entitlement seam either way. *(Direction note, FD-72 2026-08-22: supply terms are the publisher-terms half of the same ecosystem question OR-28's note names.)*
- **~~User supply.~~ Closed 2026-08-24 (FD-82).** Owner-publish is specced at §2. The engine's no-export ruling still holds: a published bundle is **authored as a data-free shape** under §1.2's hard fence — no counterparty, booking, or record is representable — which is *authoring*, never *export*. Extracting a **populated** board stays refused.

## §8. Invariants ledger

| Invariant | Where constructed |
|---|---|
| An installed item can never contain a program | §0 (closed grammar) + §3 (install-door validation) |
| No personal data is representable in a bundle | §1.2 (the fields do not exist) |
| Unpublish/upstream edit never mutates an installed copy | §2 + §3 (snapshot fork) |
| No extract-from-board publish path exists | §2 (owner publishes an authored bundle; populated boards are unrepresentable) |
| The repo is complete without the closed service | §4 (degradation law; shipped floor) |
| A store transaction never touches board money records | §5 (the lane distinction) |
| A withdrawn entitlement deactivates at the next check, without deleting the device copy | §4 (FR14) |
| A template install cannot bypass propose→confirm | §3 (parameters walk ordinary elicitation) |
