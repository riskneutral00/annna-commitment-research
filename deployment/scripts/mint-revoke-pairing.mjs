// The mint-proves-revoke class gate (2026-08-28, the dsh gap-analysis landing).
//
// Why: the per-object revocation laws all existed and every one of them was
// tested. What nothing compared was the *class* level — the kinds of standing
// thing this system mints, against the scenarios that undo them. A mint whose
// undo has no scenario anywhere is a capability with no way back, and it passed
// every gate in the folder. It is claim-check's problem shape a third time: two
// sets that are never compared can both look complete.
//
// It found one on its first pass: channel suppression had no re-enable scenario
// in any layer, which is why harness/SCENARIOS.md D29 exists.
//
// What it checks: deployment/SPEC.md §4's mint-proves-revoke bullet prints the
// closed mint-class list, each class carrying the `mint ↔ revoke` pair that
// discharges it. That bullet is the list's single home — this script parses it
// rather than restating it, because a restatement is the second copy the gate
// exists to prevent. Then, per class:
//   1. the class carries a pair at all (a printed class with no pair fails);
//   2. both scenario IDs resolve — each file named exists and defines that ID.
//
// What it cannot check, printed as the honest bound: whether a paired
// scenario's assertions actually *exercise* the revoke, and whether they cover
// every holder form of the thing minted (the person-held ShareGrant is the open
// case — its class is discharged by the bearer form). Both become checkable as
// the Step 1–5 suites land. The bound is SPEC.md §7a item 15.
//
// Usage:
//   node deployment/scripts/mint-revoke-pairing.mjs             check
//   node deployment/scripts/mint-revoke-pairing.mjs --selfcheck assert-based self-test

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// §4's printed list. One line per class:
//   - **<class>** — `<file>` **<mintId>** ↔ `<file>` **<revokeId>**
// Scoped to the bullet so a pair-shaped line elsewhere in the file cannot join
// the list — the block runs from the mint-class sentence to the next blank-line
// paragraph that is not a list item.
export function mintClasses(specMd) {
  const start = specMd.search(/\*\*Mint proves revoke\.\*\*/);
  if (start < 0) return null;
  const block = specMd.slice(start).split(/\n\s*\n\s*(?![-*])/)[0];
  const out = [];
  const LINE = /^\s*-\s*\*\*(.+?)\*\*(.*?)`([^`]+SCENARIOS\.md)`\s*\*\*([A-Z]\d+[a-z]?)\*\*\s*↔\s*`([^`]+SCENARIOS\.md)`\s*\*\*([A-Z]\d+[a-z]?)\*\*/;
  for (const line of block.split("\n")) {
    const m = line.match(LINE);
    if (m) out.push({ cls: m[1], mintFile: m[3], mintId: m[4], revokeFile: m[5], revokeId: m[6] });
  }
  return out;
}

// A scenario file defines an ID when a list item's first bold token is that ID
// — gate-coverage.mjs's parsing contract, deliberately the same one, so the two
// gates cannot disagree about what "defines" means.
export function definedIds(text) {
  const ids = new Set();
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*-\s*\*\*([A-Z]\d+[a-z]?)\b/);
    if (m) ids.add(m[1]);
  }
  return ids;
}

// `readFile` is injected so the selfcheck runs against fixtures, not the tree.
export function check(specMd, readFile) {
  const classes = mintClasses(specMd);
  if (classes === null) return ["deployment/SPEC.md §4's mint-proves-revoke bullet no longer parses — fix this script's contract"];
  if (!classes.length) return ["deployment/SPEC.md §4's mint-class list is empty — a class list with no classes checks nothing"];
  const bad = [];
  const cache = new Map();
  const idsOf = (file) => {
    if (!cache.has(file)) {
      const text = readFile(file);
      cache.set(file, text === null ? null : definedIds(text));
    }
    return cache.get(file);
  };
  for (const c of classes) {
    for (const [role, file, id] of [
      ["mint", c.mintFile, c.mintId],
      ["revoke", c.revokeFile, c.revokeId],
    ]) {
      const ids = idsOf(file);
      if (ids === null) bad.push(`"${c.cls}" names ${file} for its ${role}, and that file does not exist`);
      else if (!ids.has(id)) bad.push(`"${c.cls}" names ${id} in ${file} for its ${role}, and that file defines no such scenario`);
    }
  }
  return bad;
}

// Paths in the list are written relative to deployment/, as the rest of that
// file's citations are.
const readFromTree = (file) => {
  const p = path.resolve(ROOT, "deployment", file);
  return fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null;
};

const SPEC_FIXTURE = `  - **Mint proves revoke.** Every scenario that mints must have a pair:
    - **Grant mint** — \`../harness/SCENARIOS.md\` **D24** ↔ \`../harness/SCENARIOS.md\` **G3**
    - **Pack install** — \`../marketplace/SCENARIOS.md\` **I1** ↔ \`../marketplace/SCENARIOS.md\` **I5**

    Mechanism: the script.`;
const FIXTURE_FILES = {
  "../harness/SCENARIOS.md": "- **D24 [MUST]** — a\n- **G3 [MUST]** — b\n",
  "../marketplace/SCENARIOS.md": "- **I1 [x]** — c\n- **I5 [x]** — d\n",
};
const readFixture = (f) => (f in FIXTURE_FILES ? FIXTURE_FILES[f] : null);

if (process.argv.includes("--selfcheck")) {
  assert.strictEqual(mintClasses(SPEC_FIXTURE).length, 2, "parses both printed classes");
  assert.deepStrictEqual(check(SPEC_FIXTURE, readFixture), [], "a fully paired list passes");

  const missingId = SPEC_FIXTURE.replace("**G3**", "**G99**");
  assert.ok(check(missingId, readFixture).some((b) => b.includes("G99")), "a revoke ID no scenario defines is caught");

  const missingFile = SPEC_FIXTURE.replace("../marketplace/SCENARIOS.md` **I5**", "../nowhere/SCENARIOS.md` **I5**");
  assert.ok(check(missingFile, readFixture).some((b) => b.includes("does not exist")), "a revoke file that does not exist is caught");

  const unpaired = SPEC_FIXTURE.replace(
    "    - **Pack install** — `../marketplace/SCENARIOS.md` **I1** ↔ `../marketplace/SCENARIOS.md` **I5**\n",
    "    - **Pack install** — `../marketplace/SCENARIOS.md` **I1**, revoke owed\n",
  );
  assert.strictEqual(mintClasses(unpaired).length, 1, "a class printed with no pair drops out of the list rather than passing");

  assert.ok(check("no bullet here", readFixture)[0].includes("no longer parses"), "a missing bullet fails closed");
  assert.ok(check("**Mint proves revoke.** and nothing else", readFixture)[0].includes("empty"), "an empty class list fails closed");
  console.log("selfcheck OK");
  process.exit(0);
}

const spec = fs.readFileSync(path.join(ROOT, "deployment/SPEC.md"), "utf8");
const bad = check(spec, readFromTree);
if (bad.length) {
  console.log(`\nMINT-REVOKE FAIL — deployment/SPEC.md §4's mint-class list vs the scenario files:`);
  for (const b of bad) console.log(`  ${b}`);
  process.exit(1);
}
const classes = mintClasses(spec);
console.log(
  `MINT-REVOKE OK — ${classes.length} mint class(es), each carrying a revoke pair whose two scenario IDs both resolve. ` +
    `NOT CHECKED: whether a paired scenario's assertions exercise the revoke, or cover every holder form of the thing minted — ` +
    `checkable as the Step 1-5 suites land; the bound is SPEC.md §7a item 15.`,
);
