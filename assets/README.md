# Shipped skin assets (extracted from the prior build, 2026-08-06)

> **FROZEN 2026-08-08 — the shipped set is complete; the pipeline is not being extended. Nothing here is deleted.**
> **What is frozen:** adding packs, and further work on `make-pack.mjs`. The four shipped packs and Plain are the permanent floor and are already here — they are **not** frozen, and the app consumes them normally.
> **Resume condition:** a pack beyond the shipped four is actually needed — which, since additional skins are `../marketplace/`'s goods, means the marketplace freeze lifts first.
> **What the freeze does not do:** it does not touch the appearance law those packs feed (`../app/DESIGN.md §Appearance`) or the requirement that the shipped four render in every build.

The four shipped default skins — **dark, koi, nudi, treestars** — extracted from the
prior build at `~/Desktop/annnä/assets/` — a tree **outside this repo**, on the founder's
machine; the citation is provenance, not required reading, and the assets themselves are
here (founder-approved there 2026-07-17; owner: the founder). Founder ruling carried: the shipped
packs are **fixtures, not canon** — no token, table or constant may name a pack — and **koi is the
default until the founder picks a shipping set** (`../app/DESIGN.md §Appearance`, the home).
**Plain** stays beside them: no photo; boring mode's ground — never a picker row.
Coffee and eagle-ray were reviewed and rejected.

These four are the free, built-in set the user cycles through. Additional skins are
**paid**, sold through the marketplace, and supplied by the admin only — users never
upload. (Store rails and formats: `../marketplace/`; how skins are chosen and worn:
`../app/DESIGN.md §Appearance`.)

## Contents

- `masters/` — the original photos. Do not serve raw; they exist so packs are
  reconstructable forever.
- `packs/<name>/palette.json` — the **approved** extracted palette + derived
  ambient/accent/tint tokens per skin. These exact values are the approved look — if you
  regenerate, diff before adopting changes. (`packs/index.json` is the pack manifest.)
- `make-pack.mjs` — the admin pipeline (reference copy): builds a pack's responsive
  derivatives (WebP + AVIF, 640/1280/2048 + mobile aliases) and `palette.json` from a
  master. `npm i -D sharp node-vibrant culori && node make-pack.mjs masters/<photo>.jpg <name>`
  **Its `public/assets/packs/` output path is for the shipped free skins only** — store
  skins are delivered by the closed marketplace service behind entitlements, never a
  public web-root (`../marketplace/SPEC.md §2/§4`).

The responsive derivatives themselves are **not** vendored here — they are build
artifacts, regenerable from `masters/` via the pipeline; only the approved palettes are
pinned.

Look-and-feel law for how these skins are worn: `../app/DESIGN.md`.
