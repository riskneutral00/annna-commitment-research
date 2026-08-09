// CROSS-LAYER-CITE — a citation that NAMES a SCENARIOS.md file and an ID must
// resolve: that file must define that ID.
//
// Why this exists, and why it refuses where `cite-check.mjs` only reports.
// `deployment/SCENARIOS.md` Q3 cited `../harness/SCENARIOS.md Z2` for two days.
// The harness defines no Z family at all — the swap law's Z2 lives in `engine/`,
// and every other site in the corpus says so. It was the citation for the one
// mechanism the four-layer bet is said to rest on, and it resolved to nothing.
//
// Nothing could see it. `gate-coverage.mjs` cross-checks SCENARIOS against BUILD
// *within* a layer and never follows a path out of one. `cite-check.mjs` walks
// prose for bare IDs and deliberately DROPS anything qualified by another layer's
// name — its OWNER filter exists precisely so "harness B2" is not read as a
// deployment ref. That filter is right for bare tokens and is exactly why the
// explicit form fell through: the more precise a citation was written, the less
// any gate looked at it.
//
// So this is a separate script rather than a mode of `cite-check.mjs`, and the
// reason is posture, not tidiness. `cite-check` is ADVISORY because a bare
// `[A-Z]\d+` names at least three registries here and no local heuristic
// separates them. This gate has no heuristic to be wrong about: the citation
// states its own target path. It can therefore REFUSE, and a gate that can refuse
// does not belong behind one that cannot.
//
// The two forms in the corpus, both carried (a survey found both, roughly
// half and half — neither is more correct and normalizing them would be a
// rename with no reader):
//     `../engine/SCENARIOS.md Z2`      the ID inside the backticks
//     `../app/SCENARIOS.md` S6         the ID after them
// Ranges expand: `D22–D23` (en dash) and `Z1-Z3` (hyphen) both check every
// endpoint, since a range whose far end does not exist is the same defect.
//
// WHAT IS NOT CHECKED, deliberately:
//   - whether the cited scenario still SUPPORTS the sentence citing it. Same
//     bound `cite-check.mjs` states: existence is mechanical, aboutness is a
//     reading job. A citation can resolve and still be wrong.
//   - bare IDs with no path. That is `cite-check.mjs`'s job and its noise.
//   - HISTORY. Unlike `cite-check.mjs`, a named-path citation gets no
//     deleted-scenario grace: if you name a file and an ID, the ID must be in
//     that file NOW. Prose recording a deleted scenario names it bare
//     ("the B2 the re-scope deleted"), never through a live path.
//
// Usage:
//   node deployment/scripts/cross-layer-cite.mjs             check every tracked .md
//   node deployment/scripts/cross-layer-cite.mjs --selfcheck assert-based self-test
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// A definition line: `- **B1 [MUST]** ...`. Same contract `gate-coverage.mjs`
// and `cite-check.mjs` parse — three scripts reading one shape, so a format
// change breaks them together rather than silently sparing one.
export function defined(text) {
  const ids = new Set();
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*-\s*\*\*([A-Z]\d+[a-z]?)\b/);
    if (m) ids.add(m[1]);
  }
  return ids;
}

const ID = String.raw`[A-Z]\d+[a-z]?`;
// `<path>SCENARIOS.md` with the ID inside the backticks or immediately after.
// The path may be empty (a same-directory `SCENARIOS.md`).
const CITE = new RegExp(
  String.raw`\`([^\`\n]*?)SCENARIOS\.md(?:\s+(${ID}(?:[–-]${ID})?))?\`(?:\s+(${ID}(?:[–-]${ID})?))?`,
  "g",
);

// `D22–D23` -> both endpoints. Only the endpoints: the interior of a range is
// not written down anywhere, so asserting it would invent members.
export function endpoints(ref) {
  const parts = ref.split(/[–-]/).filter(Boolean);
  return parts.length === 2 && /^[A-Z]/.test(parts[1]) ? parts : [parts[0]];
}

export function citations(text) {
  const out = [];
  for (const m of text.matchAll(CITE)) {
    const ref = m[2] ?? m[3];
    if (!ref) continue; // a bare file reference names no ID and cannot dangle
    const line = text.slice(0, m.index).split("\n").length;
    for (const id of endpoints(ref)) out.push({ dir: m[1], id, line });
  }
  return out;
}

if (process.argv.includes("--selfcheck")) {
  assert.deepStrictEqual([...defined("- **Z2 [MUST]** x\nprose Z9")], ["Z2"]);

  const ids = (t) => citations(t).map((c) => `${c.dir}|${c.id}`);
  assert.deepStrictEqual(ids("see `../engine/SCENARIOS.md Z2` now"), ["../engine/|Z2"], "ID inside the backticks");
  assert.deepStrictEqual(ids("see `../app/SCENARIOS.md` S6 now"), ["../app/|S6"], "ID after the backticks");
  assert.deepStrictEqual(ids("`SCENARIOS.md` I3"), ["|I3"], "a same-directory path is empty, not absent");
  assert.deepStrictEqual(ids("`../harness/SCENARIOS.md` D22–D23"), ["../harness/|D22", "../harness/|D23"], "en-dash range");
  assert.deepStrictEqual(ids("`../app/SCENARIOS.md` Z1-Z3"), ["../app/|Z1", "../app/|Z3"], "hyphen range");
  assert.deepStrictEqual(ids("the whole of `../security/SCENARIOS.md`"), [], "a bare file ref names no ID");
  assert.deepStrictEqual(ids("`../engine/SPEC.md` §7.1"), [], "only SCENARIOS.md is resolved here");

  // The negative that matters: the real defect this was written for.
  const harness = defined("- **L5 [MUST]** x\n- **D22 [MUST]** y");
  assert.ok(!harness.has("Z2"), "the harness defines no Z2 — the 2026-08-08 phantom");

  console.log("\nselfcheck OK");
  process.exit(0);
}

const tracked = execFileSync("git", ["ls-files", "-z", "*.md"], { encoding: "utf8", maxBuffer: 1 << 28 })
  .split("\0")
  .filter(Boolean);

const cache = new Map();
const idsAt = (rel) => {
  if (!cache.has(rel)) {
    const abs = path.join(ROOT, rel);
    cache.set(rel, fs.existsSync(abs) ? defined(fs.readFileSync(abs, "utf8")) : null);
  }
  return cache.get(rel);
};

// Two resolution bases, because `AGENTS.md` §Citation conventions says the
// corpus mixes them: "Some resolve only from the repo root, not from the citing
// file's directory." `PR/BRIEF.md` writes `harness/SCENARIOS.md` and means the
// repo root; `harness/SPEC.md` writes `../engine/SCENARIOS.md` and means
// relative. Trying relative first and root second resolves both without
// forcing a rename across the corpus — a gate that demanded one form would be
// enforcing a convention nobody ruled.
const resolve = (file, dir) => {
  const rel = path.normalize(path.join(path.dirname(file), dir, "SCENARIOS.md"));
  if (idsAt(rel) !== null) return rel;
  const fromRoot = path.normalize(path.join(dir, "SCENARIOS.md"));
  return idsAt(fromRoot) !== null ? fromRoot : rel;
};

const dangling = [];
let checked = 0;
for (const file of tracked) {
  for (const { dir, id, line } of citations(fs.readFileSync(path.join(ROOT, file), "utf8"))) {
    const target = resolve(file, dir);
    const ids = idsAt(target);
    checked++;
    if (ids === null) dangling.push(`${file}:${line} cites ${target} — no such file`);
    else if (!ids.has(id)) dangling.push(`${file}:${line} cites ${id} in ${target}, which defines no such scenario`);
  }
}

if (dangling.length) {
  console.log(`\nCROSS-LAYER-CITE FAIL — ${dangling.length} citation(s) name a scenario their target does not define:`);
  for (const d of dangling) console.log(`    ${d}`);
  console.log(`\n  A citation that names its own path has no ambiguity to hide behind. Either the ID`);
  console.log(`  moved and the path is stale, or the path is right and the family lives elsewhere.`);
  process.exit(1);
}
console.log(`\nCROSS-LAYER-CITE OK — ${checked} path-qualified scenario citation(s), every one resolving`);
