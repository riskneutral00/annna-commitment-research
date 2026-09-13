# Shipped skin assets (extracted from the prior build, 2026-08-06)

> **FROZEN 2026-08-08 — the shipped set is complete; the pipeline is not being extended. Nothing here is deleted.**
> **What is frozen:** adding packs, and further work on `make-pack.mjs`. The four shipped packs and Plain are the floor and are already here — they are **not** frozen, and the app consumes them normally.
> **Resume condition:** a pack beyond the shipped four is actually needed — which, since additional skins are `../marketplace/`'s goods, means the marketplace freeze lifts first.
> **What the freeze does not do:** it does not touch the appearance law those packs feed (`../app/DESIGN.md §Appearance`) or the floor those packs occupy — whichever packs ship render unentitled. *(Restated 2026-08-30: this line promised the shipped four specifically would render in every build, which is the every-build wording the ruling quoted below replaced. The floor survives; the composition is not canon.)*
> **The freeze's own exception record** *(2026-08-31, m-32 — four post-freeze edits to this file had landed with no record, which made the freeze's history read as silent breaches)*: documentation corrections to this README are the **one recorded exception class** — they change what the freeze *says*, never what it *freezes* (no pack added, no pipeline work); the four edits of 2026-08-08 → 2026-08-31 are that class, this entry is their record, and a fifth kind of edit still needs its own recorded exception or it is a breach.

The four shipped default skins — **dark, koi, nudi, treestars** — extracted from the
prior build at `~/Desktop/annnä/assets/` — a tree **outside this repo**, on the founder's
machine; the citation is provenance, not required reading, and the assets themselves are
here (founder-approved there 2026-07-17; owner: the founder). Founder ruling carried: the shipped
packs are **fixtures, not canon** — no token, table or constant may name a pack — and **koi is the
default until the founder picks a shipping set** (`../app/DESIGN.md §Appearance`, the home).
**Plain** stays beside them: no photo; boring mode's ground — never a picker row.
Coffee and eagle-ray were reviewed and rejected.

These four are the free, built-in set the user cycles through. Additional skins are the
marketplace's goods, supplied by the admin only — users never upload — and they become
**purchasable** only when the closed-service lane opens, a readiness condition and never a
date, whose home is `../marketplace/SPEC.md §5`; until then an account is entitled to one
by the admin path alone. *(Reworded 2026-09-13, F-539 — this read "Additional skins are
**paid**, sold through the marketplace", a present tense that described an operating
purchase flow the readiness home defers; the admin supply and the free shipped set are
unchanged.)* (Store rails and formats: `../marketplace/`; how skins are chosen and worn:
`../app/DESIGN.md §Appearance`.)

## Contents

- `masters/` — the original photos. Do not serve raw; they exist so packs are
  reconstructable forever.
- `packs/<name>/palette.json` — the **approved** extracted palette + derived
  ambient/accent/tint tokens per skin. These exact values are the approved look — if you
  regenerate, diff before adopting changes. (`packs/index.json` is the pack manifest.)
- `make-pack.mjs` — the admin pipeline (reference copy), and it is **two passes, not one** *(corrected 2026-08-31, F-35 — this bullet read as a single pass producing the whole 13-field palette, a pass the review refused because extraction and derivation are different acts with different approval states)*: the **extraction pass** builds the responsive derivatives (WebP + AVIF, 640/1280/2048 + mobile aliases) and the approved base palette from a master — **and that pass is already where the ambient, accent and tint fields are derived** — while the **`--augment` pass** measures the master's brightest and darkest regions and solves the veil from them, adding or replacing **only** `brightestRegion`, `darkestRegion` and `veil` in an already-approved pack. Derived values are regenerable and diffed against the pinned approved set, never hand-edited.

  **Both passes read a master image, and the two write to different roots** *(corrected
  2026-09-13, F-538 — this bullet handed `--augment` a pack directory, which the pass
  cannot open because it loads its input as a photograph, and it credited the
  ambient/accent/tint tier to the wrong pass; established by comparing the documented
  arguments against the script, with no pipeline run)*. Run both **from the repository
  root**, since the script resolves both roots against the working directory:
  `npm i -D sharp node-vibrant culori` then
  `node assets/make-pack.mjs assets/masters/<photo>.jpg <name>` and
  `node assets/make-pack.mjs --augment assets/masters/<photo>.jpg <name>`.
  Extraction writes a **fresh** pack under `public/assets/packs/<name>/`; augmentation
  reads the **approved, tracked** pack at `assets/packs/<name>/palette.json` and writes
  its three fields back there. **The second command therefore does not consume the
  first's output.** A newly extracted palette is reviewed and diffed against the pinned
  approved values first, and adopted into `packs/<name>/palette.json` only deliberately —
  that adoption is what makes augmentation's input *approved*, and it is a founder act,
  not a step of the pipeline. **Nor do the two commands alone regenerate a complete
  installed pack**: the derivatives stay unvendored build artifacts, the pack index is
  refreshed only under `public/`, and the install door still runs its own floors
  (`../app/DESIGN.md §Appearance`). None of this lifts the freeze — it is the recorded
  documentation-correction exception class above, with no pack added and no pipeline work.

  **Its `public/assets/packs/` output path is for the shipped free skins only** — store
  skins are delivered by the closed marketplace service behind entitlements, never a
  public web-root (`../marketplace/SPEC.md §2/§4`).

The responsive derivatives themselves are **not** vendored here — they are build
artifacts, regenerable from `masters/` via the pipeline; only the approved palettes are
pinned.

Look-and-feel law for how these skins are worn: `../app/DESIGN.md`.
