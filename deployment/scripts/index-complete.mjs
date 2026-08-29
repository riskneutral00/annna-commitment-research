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
// `--write` (2026-08-29, `npm run derive`): rewrites the table in `git ls-files`
// order — the order the file's own header says it is written in — PRESERVING
// each existing row's tier and description BY PATH, dropping rows for files no
// longer tracked, and inserting new rows with tier `SPEC` and the description
// literal `TODO — describe what this file decides`.
//
// THE ANTI-FALSE-GREEN, and it is the load-bearing part of this whole mode: the
// CHECK gains one refusal — a description beginning `TODO` is not a description.
// Without it, `--write` would convert a LOUD missing row into a QUIET
// placeholder, which is a worse defect than the one being fixed, because the
// index would read as complete while saying nothing. Only the bookkeeping is
// derived; the tier and the one-line description stay human work.
//
// Usage:
//   node deployment/scripts/index-complete.mjs             check the index
//   node deployment/scripts/index-complete.mjs --write     derive the table from git ls-files
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
const PLACEHOLDER = "TODO — describe what this file decides";
const isPlaceholder = (what) => /^TODO\b/.test(what);

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

// The derived table: `git ls-files` order, each existing row's tier and
// description carried over by path, everything else placeheld.
export function derive(tracked, existing) {
  const by = new Map(existing.map((r) => [r.file, r]));
  return tracked.map((f) => by.get(f) ?? { file: f, tier: "SPEC", what: PLACEHOLDER });
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

  // --- the --write mode and its anti-false-green ---
  assert.ok(isPlaceholder(PLACEHOLDER), "the literal --write inserts is refused by the check that follows it");
  assert.ok(isPlaceholder("TODO"), "and a bare TODO is refused too");
  assert.ok(!isPlaceholder("What a decides"), "a real description is not a placeholder");
  assert.ok(!isPlaceholder("The TODO list's own home"), "TODO inside a sentence is a description, not a placeholder");

  // Derivation preserves by path, drops the untracked, and inserts placeholders.
  const before = [
    { file: "a/SPEC.md", tier: "SPEC", what: "what a decides" },
    { file: "gone/SPEC.md", tier: "SPEC", what: "deleted since" },
  ];
  const derived = derive(["b/NEW.md", "a/SPEC.md"], before);
  assert.deepStrictEqual(
    derived,
    [
      { file: "b/NEW.md", tier: "SPEC", what: PLACEHOLDER },
      { file: "a/SPEC.md", tier: "SPEC", what: "what a decides" },
    ],
    "git ls-files order, existing tier+description kept by path, untracked row dropped, new row placeheld",
  );
  assert.ok(derived.some((r) => isPlaceholder(r.what)), "and the inserted row REDS the check — a placeholder is not a description");

  console.log("\nselfcheck OK");
}

const tracked = execFileSync("git", ["ls-files", "-z", "*.md"], {
  encoding: "utf8",
  maxBuffer: 1 << 28,
})
  .split("\0")
  .filter(Boolean);

const indexPath = path.join(ROOT, INDEX);
const text = fs.readFileSync(indexPath, "utf8");
const listed = rows(text);

if (process.argv.includes("--write")) {
  const next = derive(tracked, listed);
  const line = (r) => `| ${r.file} | ${r.tier} | ${r.what} |`;
  // Replace the run of existing rows in place, so everything above and below
  // the table — the header, the tier legend, the caveat — is untouched.
  const lines = text.split("\n");
  const at = lines.findIndex((l) => rows(l).length);
  const last = lines.length - 1 - [...lines].reverse().findIndex((l) => rows(l).length);
  if (at === -1) {
    console.log(`\nDERIVE FAIL — ${INDEX} holds no parseable rows; fix the table before deriving`);
    process.exit(1);
  }
  fs.writeFileSync(indexPath, [...lines.slice(0, at), ...next.map(line), ...lines.slice(last + 1)].join("\n"));
  const added = next.filter((r) => isPlaceholder(r.what));
  console.log(
    `\nINDEX DERIVED — ${next.length} row(s) in git ls-files order` +
      (added.length ? `; ${added.length} new row(s) placeheld and NOW RED until described: ${added.map((r) => r.file).join(", ")}` : `; no new files`),
  );
  process.exit(0);
}

const named = new Set(listed.map((r) => r.file));

const missing = tracked.filter((f) => !named.has(f));
const phantom = listed.filter((r) => !tracked.includes(r.file));
const duplicate = listed.filter((r, i) => listed.findIndex((o) => o.file === r.file) !== i);
const badTier = listed.filter((r) => !TIERS.has(r.tier));
const empty = listed.filter((r) => !r.what);
// A placeholder is not a description. This is what keeps `--write` from turning
// a loud missing row into a quiet one.
const todo = listed.filter((r) => isPlaceholder(r.what));

for (const f of missing) console.log(`\nINDEX FAIL — ${f} is tracked but has no row in ${INDEX}`);
for (const r of phantom) console.log(`\nINDEX FAIL — ${INDEX} names ${r.file}, which is not tracked`);
for (const r of duplicate) console.log(`\nINDEX FAIL — ${r.file} has more than one row in ${INDEX}`);
for (const r of badTier) console.log(`\nINDEX FAIL — ${r.file} has tier "${r.tier}"; the vocabulary is ${[...TIERS].join(", ")}`);
for (const r of empty) console.log(`\nINDEX FAIL — ${r.file} has no description`);
for (const r of todo) console.log(`\nINDEX FAIL — ${r.file} carries a placeholder description ("${r.what}"), which is not a description`);

if (missing.length || phantom.length || duplicate.length || badTier.length || empty.length || todo.length) {
  console.log(`\n  The index is only worth reading while it is complete. Add the row; do not delete the file from the list.`);
  if (todo.length) console.log(`  \`npm run derive\` inserts the row and the tier; the one-line description is yours, and until it is written this stays red.`);
  process.exit(1);
}

console.log(`\nINDEX OK — ${listed.length} row(s), one per tracked .md, every tier in vocabulary`);
