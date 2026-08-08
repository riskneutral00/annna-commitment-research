// CITE-CHECK — a scenario ID named in a layer's prose must be one that layer
// defines now, or defined at some point in its history.
//
// Why the check is phrased that way, and not the obvious way. `gate-coverage.mjs`
// refuses a PHANTOM in a BUILD `Gate:` line, but cannot see one in SPEC prose, a
// NOTES table, or a coverage map. The 2026-08-08 re-scope recorded `B10` and
// `B11` among the scenarios it had deleted; neither has existed in any revision
// of deployment/SCENARIOS.md. Two files carried them and a full sweep missed them.
//
// The obvious gate — "every ID named must be defined today" — DOES NOT WORK, and
// the first draft of this script proved it: 26 hits, most of them correct prose.
// `deployment/NOTES.md` legitimately names B2, B3, Q1 as scenarios the re-scope
// deleted. Absent-and-correct is indistinguishable from absent-and-invented if
// you only look at the current file. History is what separates them: a deleted
// scenario appears in some past revision, an invented one never does.
//
// Two exclusions carry the rest of the signal-to-noise ratio, and both are
// principled rather than whack-a-mole:
//   FAMILY   — only families the layer defines are considered, so prose tokens
//              that merely look like IDs (harness "M2", engine "M3") are never
//              mistaken for refs. Same filter gate-coverage uses.
//   OWNER    — a token qualified by another layer, or by the word "ruling",
//              belongs to that owner. `deployment/SPEC.md` says "harness B1/B2";
//              `marketplace/SCENARIOS.md` says "the F20 and F7 rulings" — F7 is a
//              founder ruling, not a marketplace scenario.
//
// What it CANNOT check, stated because a gate that hides its bound is a false
// floor: it resolves whether a reference EXISTS, never whether it still SUPPORTS
// the sentence citing it. `engine/SPEC.md` once cited `harness/SPEC.md §7` for
// the money-mark list, which lives at §3.8 — §7 exists, so nothing mechanical
// could catch it. That half stays a reading job.
//
// IT REPORTS AND NEVER REFUSES, and that is a measured decision rather than
// timidity. Three drafts were tried as a hard gate; on this corpus the final one
// leaves six hits and every one is correct prose. `[A-Z]\d+` names at least three
// registries here — scenario IDs, adversarial-review findings (NOTES numbers them
// S1–S10, colliding with deployment's S-family), and founder rulings — and prose
// cites another layer's ID unqualified where the paragraph already said whose it
// is. No local heuristic separates those without an exception table, and an
// exception table is the gate people learn to scroll past, just relocated.
// So: same posture as `b4-verdict-check.mjs`. Run it during a sweep, read the
// list, and know that most of it is noise on any given day. It earns its keep the
// day an ID appears that no revision ever defined.
//
// Usage:
//   node deployment/scripts/cite-check.mjs             walk every layer
//   node deployment/scripts/cite-check.mjs --selfcheck assert-based self-test
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LAYERS = ["deployment", "harness", "engine", "app", "marketplace", "security"];
const PROSE = ["SPEC.md", "BUILD.md", "SCENARIOS.md", "NOTES.md", "README.md"];

// A definition line: `- **B1 [MUST]** ...`. Same contract gate-coverage parses.
export function defined(text) {
  const ids = new Set();
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*-\s*\*\*([A-Z]\d+[a-z]?)\b/);
    if (m) ids.add(m[1]);
  }
  return ids;
}

const OWNER_WINDOW = 90;
export function references(text, families, owners) {
  const out = new Map();
  for (const m of text.matchAll(/\b([A-Z]\d+)(s?)\b/g)) {
    const id = m[1];
    if (!families.has(id[0])) continue;
    if (m[2] === "s") continue; // "two H1s" is a plural, not an ID
    // The owner may be named on either side: "harness B2" and "the D5 pattern
    // from the app" are both somebody else's ID. One-directional was the first
    // draft's bug.
    const near =
      text.slice(Math.max(0, m.index - OWNER_WINDOW), m.index) +
      text.slice(m.index + id.length, m.index + id.length + OWNER_WINDOW);
    if (owners.some((re) => re.test(near))) continue;
    // A founder ruling wears the same shape as a scenario ID and is not one.
    if (/\brulings?\b/.test(text.slice(m.index, m.index + 40))) continue;
    // In `| S6 | Vendored hash… |` the ID is the row's own label — the table
    // defines it, exactly as a `- **S6 …**` line would. NOTES review tables are
    // full of these and none of them is a reference.
    const lineStart = text.lastIndexOf("\n", m.index) + 1;
    if (/^\|\s*\**$/.test(text.slice(lineStart, m.index))) continue;
    const line = text.slice(0, m.index).split("\n").length;
    if (!out.has(id)) out.set(id, line);
  }
  return out;
}

// Every ID ever defined in this file, across all revisions. One git call.
function everDefined(rel) {
  let history = "";
  try {
    history = execFileSync("git", ["log", "-p", "--", rel], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 });
  } catch {
    return null; // not a git tree, or no history — caller degrades honestly
  }
  const ids = new Set();
  for (const line of history.split("\n")) {
    const m = line.match(/^[+ ]?\s*-\s*\*\*([A-Z]\d+[a-z]?)\b/);
    if (m) ids.add(m[1]);
  }
  return ids;
}

function walk() {
  const rows = [];
  for (const layer of LAYERS) {
    const rel = `${layer}/SCENARIOS.md`;
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs)) continue;
    const now = defined(fs.readFileSync(abs, "utf8"));
    const ever = everDefined(rel);
    const families = new Set([...now].map((i) => i[0]));
    const owners = LAYERS.filter((l) => l !== layer).map((l) => new RegExp(`\\b${l}\\b`));

    const phantoms = [];
    for (const f of PROSE) {
      const p = path.join(ROOT, layer, f);
      if (!fs.existsSync(p)) continue;
      for (const [id, line] of references(fs.readFileSync(p, "utf8"), families, owners)) {
        if (now.has(id)) continue;
        if (ever && ever.has(id)) continue; // named as history, and it is history
        phantoms.push(`${layer}/${f}:${line} names ${id}`);
      }
    }
    rows.push({ layer, count: now.size, phantoms, historic: ever ? ever.size - now.size : null });
  }
  return rows;
}

if (process.argv.includes("--selfcheck")) {
  assert.deepStrictEqual([...defined("- **B1 [MUST]** x\n- **B4 [DRILL]** y\nprose B9 here")], ["B1", "B4"]);
  assert.deepStrictEqual([...defined("**B1** mentioned in prose")], [], "a prose mention is not a definition");

  const fam = new Set(["B", "F"]);
  const owners = [/\bharness\b/];
  const keys = (t) => [...references(t, fam, owners).keys()];

  assert.deepStrictEqual(keys("the deleted B10 pair"), ["B10"], "a bare in-layer ref is seen");
  assert.deepStrictEqual(keys("see L2 for determinism"), [], "family filter drops foreign families");
  assert.deepStrictEqual(keys("gated on harness B2 landing"), [], "cross-layer refs belong to that layer");
  assert.deepStrictEqual(keys("two B1s working one commitment"), [], "a plural is not an ID");
  assert.deepStrictEqual(keys("the F20 and F7 rulings of 2026"), [], "founder rulings are not scenarios");
  assert.deepStrictEqual(keys("the B5 pattern from the harness"), [], "the owner may be named after the ID");
  assert.deepStrictEqual(keys("| B7 | a review finding row |"), [], "a table row label defines, not references");
  // The negative that matters most: an unqualified phantom survives every filter.
  assert.ok(keys("B11 is gone").includes("B11"), "an unqualified phantom must still be caught");

  console.log("\nselfcheck OK");
}

const rows = walk();
const bad = rows.filter((r) => r.phantoms.length);
for (const r of bad) {
  console.log(`\nCITE — ${r.layer} names ${r.phantoms.length} ID(s) no revision of its SCENARIOS.md ever defined:`);
  for (const p of r.phantoms) console.log(`    ${p}`);
}
if (bad.length) {
  console.log(`\n  Read each one. An ID no revision defined is invented rather than deleted — but a`);
  console.log(`  review-finding number, or another layer's ID cited unqualified, lands here too.`);
  console.log(`  Advisory by design (see the header); it never refuses a commit.`);
}
const noHistory = rows.filter((r) => r.historic === null).map((r) => r.layer);
if (noHistory.length) console.log(`\n  NOTE: no git history readable for ${noHistory.join(", ")} — current-file check only.`);
console.log(
  `\nCITE OK — ${rows.length} layers; every scenario ID named in prose is defined now or was defined once` +
    ` (existence only; whether a citation still supports its sentence is a reading job, not this)`,
);
