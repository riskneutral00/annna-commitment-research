// LABEL-REGISTRY — two registries declared in a document, compared for set
// equality against what the corpus actually uses (2026-08-29, L-135 + L-130).
//
// One script and two named checks rather than two scripts, following
// `claim-check.mjs`'s CHECKS array: both are the same act — a declared set
// against a used set — and one script costs one roster bullet, one npm entry
// and one gate-count move instead of two of each.
//
// CHECK 1 — the drafted-marker registry (L-135). The canonical literal is
// "drafted, not founder-ratified", and the scar is that WORDING VARIANTS are
// invisible to it. A sweep of this tree found EIGHT distinct marker phrases
// where the canonical literal alone sees three files. A marker is how a reader
// tells a proposal from law, so a marker nobody can find is a proposal reading
// as law. The registry lives under RULINGS.md's existing Provenance section —
// the file that already answers "which decisions were the founder's, and which
// were drafted" — and this asserts it both ways: a marker phrase in the tree
// that the registry does not enumerate, and a registry row whose phrase no file
// carries any more (a SPENT marker, the class C2 struck by hand on 2026-08-29).
//
// The detector is NEGATION-AWARE on purpose. A first pass keyed on "drafted"
// near "ratified" pulled in seventeen phrases, and half were RESOLUTIONS
// ("drafted mechanism is ratified", "drafted 2026-08-09; ratified") — the exact
// opposite of a live marker. A registry padded with non-markers is a
// bureaucracy, not a guard, so only a negated ratification counts.
//
// CHECK 2 — the series-label registry (L-130). "Nothing mechanical prevents a
// future series colliding" — and the corpus has already paid for one: `R#`
// meant "review finding" and "founder ruling" on the same day and had to be
// renamed to `FR#` to end it. AGENTS.md's Rulings section is the declared home
// of the active prefixes. This refuses a prefix claimed twice there, and a
// prefix used to define rows in a registry file that AGENTS.md never claims.
//
// WHAT IT CANNOT CHECK: whether a drafted marker SHOULD still be live. That is
// the founder's ratification queue (L-228, RE-AFFIRM) and this gate keeps it
// visible rather than deciding it. A registry of eight live markers is a
// worklist, and shortening it is his act, not this script's.
//
// Usage:
//   node deployment/scripts/label-registry.mjs             check
//   node deployment/scripts/label-registry.mjs --selfcheck assert-based self-test
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// A drafted marker is a phrase asserting something is NOT ratified. The three
// alternatives are the negated form, the convention's own generic name, and
// FR37's exempt class (no ruling is owed, which is a decision rather than a gap).
export const MARKER = /(?:drafted|PROPOSED)[^.\n]{0,60}?\bnot (?:yet )?(?:founder-)?ratified|drafted-not-ratified|no founder ruling is owed/gi;

// Case and whitespace are noise; the phrase is the thing.
export const normalize = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();

export function markersIn(text) {
  return [...text.matchAll(MARKER)].map((m) => normalize(m[0]));
}

// The registry table: | `phrase` | canonical site | status |
export const STATUSES = new Set(["live", "exempt-class"]);

const SECTION = /### The drafted-marker registry[\s\S]*?(?=\n## |\n### |$)/;

export function registryRows(rulings) {
  const section = rulings.match(SECTION);
  if (!section) return null;
  return [...section[0].matchAll(/^\| `([^`]+)` \| `([^`]+)` \| ([a-z-]+) \|/gm)].map((m) => ({
    phrase: normalize(m[1]),
    site: m[2],
    status: m[3],
  }));
}

// RULINGS.md carries live markers of its own (the PROPOSED FD sections), so it
// is scanned like any other file — but the registry SECTION is the declaration,
// not a use, and quotes every phrase by construction. Strip the section, keep
// the file.
export const withoutRegistry = (text) => text.replace(SECTION, "");

// AGENTS.md's Rulings section: `- **\`FR#\` = founder rulings.**`
export function claimedPrefixes(agents) {
  const section = agents.match(/## Rulings[\s\S]*?(?=\n## )/);
  if (!section) return null;
  return [...section[0].matchAll(/^- \*\*`([A-Z]{2,3})[-#]/gm)].map((m) => m[1]);
}

// A prefix used to DEFINE a row, in the files that are registries. A row is a
// table cell `| **FD-89 …** |` or a `#### RQ-1:` heading — the two definition
// shapes the corpus actually uses.
export function definedPrefixes(text) {
  const out = new Set();
  for (const m of text.matchAll(/^\| \*\*([A-Z]{2,3})-?\d+/gm)) out.add(m[1]);
  for (const m of text.matchAll(/^#### ([A-Z]{2,3})-\d+/gm)) out.add(m[1]);
  return [...out];
}

if (process.argv.includes("--selfcheck")) {
  // --- check 1, with its negatives ---
  assert.deepStrictEqual(markersIn("the rule is drafted, not founder-ratified today"), ["drafted, not founder-ratified"]);
  assert.deepStrictEqual(markersIn("it wears the drafted-not-ratified marker"), ["drafted-not-ratified"]);
  assert.deepStrictEqual(markersIn("per FR37 no founder ruling is owed"), ["no founder ruling is owed"]);
  assert.deepStrictEqual(markersIn("PROPOSED, not ratified"), ["proposed, not ratified"]);
  assert.deepStrictEqual(markersIn("Drafted,  Not Founder-Ratified"), ["drafted, not founder-ratified"], "case and spacing are noise");
  // The negatives that keep the registry a guard rather than a bureaucracy: a
  // RESOLUTION is not a marker, and seventeen phrases collapsed to eight on
  // exactly this distinction.
  assert.deepStrictEqual(markersIn("FD-42's drafted mechanism is ratified"), [], "a resolution is not a live marker");
  assert.deepStrictEqual(markersIn("drafted 2026-08-09; ratified the same day"), [], "nor is a drafted-then-ratified note");
  assert.deepStrictEqual(markersIn("drafted on the founder's behalf, was ratified"), [], "nor is a behalf-then-ratified note");
  assert.deepStrictEqual(markersIn("nothing here at all"), []);

  const reg = "### The drafted-marker registry\n\n| marker phrase | canonical site | status |\n|---|---|---|\n| `drafted, not founder-ratified` | `app/SPEC.md` | live |\n| `no founder ruling is owed` | `RULINGS.md` | exempt-class |\n";
  const rows = registryRows(reg);
  assert.deepStrictEqual(rows.map((r) => r.phrase), ["drafted, not founder-ratified", "no founder ruling is owed"]);
  assert.strictEqual(rows[1].status, "exempt-class");
  assert.ok(rows.every((r) => STATUSES.has(r.status)), "the status vocabulary is closed");
  assert.strictEqual(registryRows("no such section"), null, "a missing registry is a failure, not an empty set");
  // The registry section quotes every phrase, so scanning it would make the
  // registry its own justification. Strip the section; keep the file's own
  // markers, which are real (the PROPOSED FD sections carry them).
  assert.deepStrictEqual(markersIn(withoutRegistry(reg + "\n## Next\nthe row is PROPOSED, not ratified")), ["proposed, not ratified"], "the section is stripped and the file's own markers survive");
  // A phrase in the tree with no row, and a row with no phrase in the tree —
  // the two directions, each caught.
  const declared = new Set(rows.map((r) => r.phrase));
  assert.ok(!declared.has("proposed, not ratified"), "an unregistered variant is caught");
  assert.ok(!markersIn("some file with no markers").includes("drafted, not founder-ratified"), "a spent row is caught by the reverse direction");

  // --- check 2, with its negatives ---
  const agents = "## Rulings\n\n- **`FR#` = founder rulings.** Registry: `RULINGS.md`.\n- **`FD#` = founder decisions.** same registry.\n- **`OR-##` = open rulings.** Three open.\n- **`RQ-##` = product requirements.** Home: `PRD.md`.\n\n## Where to start\n";
  assert.deepStrictEqual(claimedPrefixes(agents), ["FR", "FD", "OR", "RQ"]);
  assert.strictEqual(claimedPrefixes("no Rulings section"), null, "an unparseable claim list is a failure");
  const dup = claimedPrefixes(agents.replace("- **`RQ-##`", "- **`FD-##`"));
  assert.ok(dup.length !== new Set(dup).size, "a prefix claimed twice is a collision — the R# defect, one level up");
  assert.deepStrictEqual(definedPrefixes("| **FD-89 (PROPOSED)** | body |\n| **FR1** | body |"), ["FD", "FR"]);
  assert.deepStrictEqual(definedPrefixes("#### RQ-1: a requirement"), ["RQ"]);
  assert.deepStrictEqual(definedPrefixes("prose mentioning FD-89 and RQ-1"), [], "a mention is not a definition");
  assert.ok(!claimedPrefixes(agents).includes(definedPrefixes("| **XX-1** | a new series |")[0]), "a series AGENTS.md never claimed is caught");

  console.log("\nselfcheck OK");
  process.exit(0);
}

const tracked = execFileSync("git", ["ls-files", "-z", "*.md"], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 })
  .split("\0")
  .filter(Boolean);

const bad = [];

// --- check 1 ---
const rows = registryRows(read("RULINGS.md"));
let markerHits = 0;
if (!rows) {
  bad.push("RULINGS.md carries no `### The drafted-marker registry` section — the registry is the declared home and this gate reads it there");
} else {
  const declared = new Map(rows.map((r) => [r.phrase, r]));
  for (const r of rows) if (!STATUSES.has(r.status)) bad.push(`the registry row for "${r.phrase}" has status "${r.status}"; the vocabulary is ${[...STATUSES].join(", ")}`);
  const seen = new Set();
  for (const f of tracked) {
    const text = f === "RULINGS.md" ? withoutRegistry(read(f)) : read(f);
    for (const p of markersIn(text)) {
      markerHits++;
      seen.add(p);
      if (!declared.has(p)) bad.push(`${f} carries the drafted marker "${p}", which RULINGS.md's drafted-marker registry does not enumerate`);
    }
  }
  for (const r of rows) {
    if (!seen.has(r.phrase)) bad.push(`the registry enumerates "${r.phrase}", which no tracked file carries any more — a spent marker; strike the row`);
    else if (!read(r.site).toLowerCase().includes(r.phrase)) bad.push(`the registry names \`${r.site}\` as the canonical site of "${r.phrase}", and that file does not carry it`);
  }
}

// --- check 2 ---
const claimed = claimedPrefixes(read("AGENTS.md"));
if (!claimed) {
  bad.push("AGENTS.md's `## Rulings` section no longer declares its series prefixes in a parseable form");
} else {
  const dupes = claimed.filter((p, i) => claimed.indexOf(p) !== i);
  for (const d of new Set(dupes)) bad.push(`AGENTS.md claims the prefix \`${d}\` more than once — two registries claiming one prefix is the \`R#\` collision the corpus renamed its way out of`);
  for (const f of ["RULINGS.md", "PRD.md"]) {
    for (const p of definedPrefixes(read(f))) {
      if (!claimed.includes(p)) bad.push(`${f} defines rows under the series prefix \`${p}\`, which AGENTS.md's Rulings section never claims`);
    }
  }
}

if (bad.length) {
  console.log(`\nLABEL-REGISTRY FAIL:`);
  for (const b of bad) console.log(`  ${b}`);
  console.log(
    `\n  A marker variant nobody registered is a proposal that reads as law; a series prefix nobody` +
      `\n  claimed is the next \`R#\` collision. Both registries are declared, not inferred — add the row.`,
  );
  process.exit(1);
}
console.log(
  `\nLABEL-REGISTRY OK — ${rows.length} drafted marker(s) registered and each still carried (${markerHits} use(s) across the tree), ` +
    `${claimed.length} series prefix(es) claimed once each and every defined series among them.` +
    `\n  NOT CHECKED: whether a drafted marker SHOULD still be live — that is the founder's ratification queue (L-228), kept visible here rather than decided.`,
);
