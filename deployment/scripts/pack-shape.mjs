#!/usr/bin/env node
// pack-shape.mjs — every shipped pack carries exactly the fields the spec enumerates.
//
// marketplace/SPEC.md §1.1 enumerates the palette's stored fields — thirteen
// measured/derived fields plus the 2026-08-22 pair (brightestRegion, veil) the
// veil derivation reads at install time. The law had already gone stale against
// the packs once (the pair existed in prose and in no pack), so this gate
// compares the enumeration to the files: a pack missing a field, or carrying
// one the spec does not name, is refused — the install door's discipline
// applied to our own fixtures.
//
// Bounds, printed on every run: this checks field PRESENCE, not derivation
// correctness — whether veil is correctly solved needs the derivation re-run
// against the photograph (app BUILD Step 1's install-door floors own that).

import fs from "node:fs";
import path from "node:path";

const FIELDS = [
  "name", "master", "luminance", "colorfulness", "suggestedMode",
  "dominants", "semantic", "accent", "accentDeep",
  "ambientDark", "ambientLight", "tintDarkAlpha", "tintLightAlpha",
  "brightestRegion", "veil",
];

if (process.argv.includes("--selfcheck")) {
  if (FIELDS.length !== 15) { console.error("selfcheck FAIL: field list is not 15"); process.exit(1); }
  const dupes = FIELDS.filter((f, i) => FIELDS.indexOf(f) !== i);
  if (dupes.length) { console.error(`selfcheck FAIL: duplicate fields ${dupes}`); process.exit(1); }
  console.log("selfcheck OK");
  process.exit(0);
}

const packsDir = "assets/packs";
const packs = fs.readdirSync(packsDir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
if (packs.length === 0) { console.error("PACK-SHAPE FAIL — no packs found under assets/packs"); process.exit(1); }

let bad = 0;
for (const p of packs) {
  const file = path.join(packsDir, p, "palette.json");
  if (!fs.existsSync(file)) { console.error(`PACK-SHAPE FAIL — ${p}: no palette.json`); bad++; continue; }
  const keys = Object.keys(JSON.parse(fs.readFileSync(file, "utf8")));
  const missing = FIELDS.filter((f) => !keys.includes(f));
  const unknown = keys.filter((k) => !FIELDS.includes(k));
  if (missing.length) { console.error(`PACK-SHAPE FAIL — ${p}: missing ${missing.join(", ")}`); bad++; }
  if (unknown.length) { console.error(`PACK-SHAPE FAIL — ${p}: unknown ${unknown.join(", ")} (the spec enumerates; an unlisted field is the door's refusal class)`); bad++; }
}
if (bad) process.exit(1);
console.log(`PACK-SHAPE OK — ${packs.length} pack(s), each carrying exactly the 15 fields marketplace/SPEC.md §1.1 enumerates.
  NOT CHECKED: whether a derived field is correctly derived — the install-door floors at app BUILD Step 1 own that.`);
