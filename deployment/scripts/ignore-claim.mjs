// IGNORE-CLAIM — a directory the corpus calls gitignored must hold zero tracked
// files. `AGENTS.md` tells every agent that certain paths are working material
// "absent for every reader"; if one of them is actually tracked, the claim is
// false in the most expensive direction — an agent writes something there
// believing it is private, and it ships to everyone who clones.
//
// Why this gate exists: on 2026-08-08 `.specs/` was listed as gitignored while
// three of its five files were tracked AND counted in the tracked-markdown total
// asserted one sentence earlier in the same paragraph. Two claims, one sentence
// apart, contradicting each other, both green.
//
// The claim is PARSED from the prose, and the actual is `git ls-files`. Drift on
// either side fails it: edit the sentence and the check follows; commit a file
// under a claimed-private path and the check refuses.
//
// Scope note: this asserts "nothing tracked under a claimed path". It does NOT
// assert the reverse (that everything gitignored is claimed) — there is no
// prose list of what a working checkout may hold, and inventing one would be a
// claim nobody maintains.
//
// Usage:
//   node deployment/scripts/ignore-claim.mjs             check
//   node deployment/scripts/ignore-claim.mjs --selfcheck assert-based self-test
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SOURCE = "AGENTS.md";

// The sentence, and the backticked paths inside it. Both halves are shared with
// the selfcheck — a selfcheck running a different matcher proves nothing.
//
// The stop character is `;` ALONE. An earlier draft stopped at `.` too and
// therefore matched nothing at all, because the first claimed path is
// `.sisyphus/` — it passed green while checking zero paths. That is why a
// zero-path parse is treated as failure below and not as an empty success.
const SENTENCE = /gitignored material under ([^;]+)/;
const PATHS = /`([^`]+)`/g;

export function claimedPaths(text) {
  const m = text.match(SENTENCE);
  if (!m) return null; // the sentence is gone or reworded — caller decides
  const paths = [...m[1].matchAll(PATHS)].map((p) => p[1]);
  return paths.length ? paths : null; // a claim naming nothing is a broken parse
}

const tracked = (dir) =>
  execFileSync("git", ["ls-files", "-z", "--", dir], { cwd: ROOT, encoding: "utf8" })
    .split("\0")
    .filter(Boolean);

if (process.argv.includes("--selfcheck")) {
  assert.deepStrictEqual(
    claimedPaths("carries gitignored material under `a/`, `b/` and `c/`; it is absent"),
    ["a/", "b/", "c/"],
    "every backticked path in the sentence is claimed",
  );
  assert.deepStrictEqual(
    claimedPaths("carries gitignored material under `only/`; then `later/` elsewhere"),
    ["only/"],
    "the semicolon ends the sentence — a later backtick is not a claim",
  );
  // The bug this gate shipped with for one run: a leading-dot path.
  assert.deepStrictEqual(
    claimedPaths("carries gitignored material under `.sisyphus/`, `docs/agents/` and `patches/`; it is absent"),
    [".sisyphus/", "docs/agents/", "patches/"],
    "a dotted path is not a sentence terminator",
  );
  assert.strictEqual(claimedPaths("no such sentence here"), null, "a missing sentence is not an empty claim");
  assert.strictEqual(
    claimedPaths("carries gitignored material under nothing backticked; it is absent"),
    null,
    "a claim naming zero paths is a broken parse, never an empty success",
  );
  // The negative case that matters: a real tracked file under a claimed path.
  assert.ok(tracked("deployment/scripts").length > 0, "git ls-files finds tracked files where they exist");
  assert.strictEqual(tracked("no/such/dir/anywhere").length, 0, "and finds none where there are none");
  console.log("\nselfcheck OK");
  process.exit(0);
}

const claimed = claimedPaths(fs.readFileSync(path.join(ROOT, SOURCE), "utf8"));
if (claimed === null) {
  console.log(`\nIGNORE-CLAIM FAIL — ${SOURCE} no longer states its gitignored paths in a parseable form.`);
  console.log(`  Either restore the sentence or delete this gate; a check that cannot find its claim`);
  console.log(`  must not pass quietly.`);
  process.exit(1);
}

const broken = claimed.map((p) => [p, tracked(p)]).filter(([, files]) => files.length);
for (const [p, files] of broken) {
  console.log(`\nIGNORE-CLAIM FAIL — ${SOURCE} calls \`${p}\` gitignored, but git tracks ${files.length} file(s) there:`);
  for (const f of files) console.log(`    ${f}`);
  console.log(`  These ship in every clone. Either stop claiming the path is private, or stop tracking them.`);
}
if (broken.length) process.exit(1);

console.log(`\nIGNORE-CLAIM OK — ${claimed.length} claimed-private path(s), 0 tracked files under any of them`);
