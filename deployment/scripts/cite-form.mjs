// CITE-FORM — no in-repo citation may point at a LINE NUMBER.
//
// A line number is a pointer that rots on every insertion above it, silently,
// and nothing reads it. On 2026-08-08 the FD-11 ruling cited
// `.specs/deep-interview-app.md:28` and was correct when written; two hours
// later the same pass inserted two lines above that quote and the citation was
// wrong. Nothing failed. Nothing could have.
//
// The fix is a DELETION, not a tracking mechanism: cite the file and QUOTE THE
// PHRASE. A sentence does not move when the lines around it change. This is the
// rule the corpus already applies to outside-repo citations (`AGENTS.md`,
// "Citation conventions"); this gate extends it inward, where it actually bites.
//
// WHAT IS EXEMPT, AND WHY
//   - Targets that do not resolve in this repo. Those are the declared
//     outside-repo traceability forms (`research/<name>.md:line`, `DESIGN:line`)
//     pointing into a prior build on the founder's machine. They cannot rot
//     here because they were never here.
//   - Targets under `archive/`. Archive is history: frozen adversarial reviews
//     and dated records that are not edited, so their line numbers are stable
//     by construction. Note this exempts the citation's TARGET, not its author —
//     `archive/08-founder-rulings-2026-08-06.md` is an actively edited registry,
//     and its citations OUT of archive are checked like anyone else's.
//
// Resolution mirrors how the corpus actually writes citations (`AGENTS.md`:
// "Section citations mix relative and repo-root-relative forms") — try relative
// to the citing file, then relative to the repo root. Either hit means in-repo.
//
// Usage:
//   node deployment/scripts/cite-form.mjs             check
//   node deployment/scripts/cite-form.mjs --selfcheck assert-based self-test
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const EXEMPT_TREES = ["archive/"];

// One matcher, shared by the selfcheck and the real pass.
const CITATION = /`([A-Za-z0-9_./-]+\.(?:md|mjs|ts|tsx|json)):(\d+)/g;

export const citationsIn = (text) =>
  [...text.matchAll(CITATION)].map((m) => ({ target: m[1], line: m[2] }));

// Where a citation resolves, as a repo-relative path — or null if nowhere.
export function resolveTarget(target, fromFile, exists) {
  const rel = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), target));
  if (!rel.startsWith("..") && exists(rel)) return rel;
  const fromRoot = path.posix.normalize(target);
  if (!fromRoot.startsWith("..") && exists(fromRoot)) return fromRoot;
  return null;
}

export const isExempt = (resolved) =>
  resolved === null || EXEMPT_TREES.some((t) => resolved.startsWith(t));

if (process.argv.includes("--selfcheck")) {
  assert.deepStrictEqual(
    citationsIn("see `../security/SPEC.md:151` and `app/DESIGN.md:5` here"),
    [{ target: "../security/SPEC.md", line: "151" }, { target: "app/DESIGN.md", line: "5" }],
    "both relative and root-relative forms are found",
  );
  assert.deepStrictEqual(citationsIn("`CRITIQUE-BRIEF-2.md:91–92`")[0].line, "91", "a range still cites a line");
  assert.deepStrictEqual(citationsIn("`deployment/SPEC.md` §8 and §6.5"), [], "a section citation is not a line citation");
  assert.deepStrictEqual(citationsIn("the meeting is at 12:30"), [], "a bare number is not a citation");

  const has = (p) => ["archive/DESIGN.md", "app/DESIGN.md", "security/SPEC.md"].includes(p);
  assert.strictEqual(resolveTarget("DESIGN.md", "archive/CRITIQUE-FINDINGS-2.md", has), "archive/DESIGN.md",
    "relative-to-citer wins first");
  assert.strictEqual(resolveTarget("app/DESIGN.md", "archive/08-rulings.md", has), "app/DESIGN.md",
    "root-relative is the fallback");
  assert.strictEqual(resolveTarget("research/astryx.md", "app/DESIGN.md", has), null,
    "an unresolvable target is outside the repo");

  assert.ok(isExempt(resolveTarget("DESIGN.md", "archive/CRITIQUE-FINDINGS-2.md", has)), "archive→archive is exempt");
  assert.ok(isExempt(null), "outside-repo is exempt");
  // The negative case: archive citing OUT of archive is not exempt.
  assert.ok(!isExempt(resolveTarget("app/DESIGN.md", "archive/08-rulings.md", has)),
    "an archive file citing a live file is checked like anyone else");
  console.log("\nselfcheck OK");
  process.exit(0);
}

const files = execFileSync("git", ["ls-files", "-z", "*.md"], { cwd: ROOT, encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
const exists = (p) => fs.existsSync(path.join(ROOT, p));

const bad = [];
for (const file of files) {
  for (const { target, line } of citationsIn(fs.readFileSync(path.join(ROOT, file), "utf8"))) {
    const resolved = resolveTarget(target, file, exists);
    if (!isExempt(resolved)) bad.push({ file, target, line, resolved });
  }
}

for (const b of bad) {
  console.log(`\nCITE-FORM FAIL — ${b.file} cites \`${b.target}:${b.line}\` (${b.resolved})`);
}
if (bad.length) {
  console.log(`\n  ${bad.length} in-repo line-number citation(s). A line number rots the next time anything`);
  console.log(`  is inserted above it, and nothing notices. Cite the file and QUOTE THE PHRASE instead —`);
  console.log(`  a sentence keeps saying what it says no matter what moves around it.`);
  process.exit(1);
}

console.log(`\nCITE-FORM OK — ${files.length} tracked .md, no in-repo line-number citations`);
