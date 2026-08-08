// INDEX-COMPLETE — `INDEX.md` names every tracked `.md`, and nothing else.
//
// Why this exists: finding where a rule lives meant grepping the whole corpus
// with `archive/` sorting first — so a naive hit is likely to be superseded
// material. INDEX.md is the cheap read that replaces that sweep: every tracked
// file, its authority tier, and one line on what it decides. That only works
// while it is COMPLETE. An index missing three files is worse than no index,
// because it reads as exhaustive and is trusted as one.
//
// The failure mode this prevents is the ordinary one: someone adds a spec file
// and does not think of the index. `doc-count-check.mjs` would still pass — the
// count in two prose files is corrected as a matter of course — while the index
// silently stopped covering the corpus. A count and a roster that are never
// compared can both be right and still hide a file (`roster-check.mjs` exists
// for the same reason, one level over, about `deployment/scripts/`).
//
// WHAT IS NOT CHECKED, deliberately:
//   - whether a description is TRUE. No script can read a spec and tell you the
//     one-line summary still describes it. If a row and its file disagree, the
//     file wins and the row is the defect. INDEX.md says so in its own header.
//   - the ORDER of rows. `git ls-files` order is what the file is written in and
//     what keeps directories grouped, but nothing depends on it, so nothing
//     enforces it — a check that constrains what does not matter only costs.
//   - the tier ASSIGNMENT. That a file is marked `SPEC` rather than `derived` is
//     a judgement from AGENTS.md's authority order, not a countable fact. The
//     vocabulary is closed and checked; which word applies is not.
//
// Usage:
//   node deployment/scripts/index-complete.mjs             check the index
//   node deployment/scripts/index-complete.mjs --selfcheck assert-based self-test
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const INDEX = "INDEX.md";

// The closed tier vocabulary, from INDEX.md's tier legend, which defines what
// each one means; this is only the spelling.
const TIERS = new Set(["SPEC", "derived", "index", "history", "never"]);

// A row is a table line whose first cell is a path ending `.md`. That test alone
// skips the header, the separator, and the two-column tier legend above the
// table — no line counting, so the file stays free to grow prose at the top.
export function rows(text) {
  return text
    .split("\n")
    .map((l) => l.match(/^\|([^|]+)\|([^|]+)\|(.+)\|\s*$/))
    .filter(Boolean)
    .map((m) => ({ file: m[1].trim(), tier: m[2].trim(), what: m[3].trim() }))
    .filter((r) => r.file.endsWith(".md"));
}

if (process.argv.includes("--selfcheck")) {
  const table = [
    "| File | Tier | What it decides |",
    "|---|---|---|",
    "| a/SPEC.md | SPEC | what a decides |",
    "| b/NOTES.md | never | scratchpad |",
  ].join("\n");
  assert.deepStrictEqual(
    rows(table).map((r) => r.file),
    ["a/SPEC.md", "b/NOTES.md"],
    "the header and separator are not rows",
  );
  assert.strictEqual(rows(table)[0].tier, "SPEC");
  assert.strictEqual(rows(table)[0].what, "what a decides");

  // The legend table sits above the real one and must not read as rows.
  assert.deepStrictEqual(rows("| Tier | Means |\n| `SPEC` | Source of truth. |"), []);
  // Prose that merely mentions a path is not a row.
  assert.deepStrictEqual(rows("See `a/SPEC.md` for the law."), []);
  // A row whose first cell is not a file is not a row.
  assert.deepStrictEqual(rows("| total | 131 | files |"), []);

  console.log("\nselfcheck OK");
}

const tracked = execFileSync("git", ["ls-files", "-z", "*.md"], {
  encoding: "utf8",
  maxBuffer: 1 << 28,
})
  .split("\0")
  .filter(Boolean);

const listed = rows(fs.readFileSync(path.join(ROOT, INDEX), "utf8"));
const named = new Set(listed.map((r) => r.file));

const missing = tracked.filter((f) => !named.has(f));
const phantom = listed.filter((r) => !tracked.includes(r.file));
const duplicate = listed.filter((r, i) => listed.findIndex((o) => o.file === r.file) !== i);
const badTier = listed.filter((r) => !TIERS.has(r.tier));
const empty = listed.filter((r) => !r.what);

for (const f of missing) console.log(`\nINDEX FAIL — ${f} is tracked but has no row in ${INDEX}`);
for (const r of phantom) console.log(`\nINDEX FAIL — ${INDEX} names ${r.file}, which is not tracked`);
for (const r of duplicate) console.log(`\nINDEX FAIL — ${r.file} has more than one row in ${INDEX}`);
for (const r of badTier) console.log(`\nINDEX FAIL — ${r.file} has tier "${r.tier}"; the vocabulary is ${[...TIERS].join(", ")}`);
for (const r of empty) console.log(`\nINDEX FAIL — ${r.file} has no description`);

if (missing.length || phantom.length || duplicate.length || badTier.length || empty.length) {
  console.log(`\n  The index is only worth reading while it is complete. Add the row; do not delete the file from the list.`);
  process.exit(1);
}

console.log(`\nINDEX OK — ${listed.length} row(s), one per tracked .md, every tier in vocabulary`);
