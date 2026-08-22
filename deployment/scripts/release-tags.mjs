// RELEASE-TAGS — FD-50's owed mechanism, mechanized (vocabulary home:
// PRD.md §6.5). Every scenario row in the five SCENARIOS.md suites must
// carry exactly one release tag: [r1] (green required for the first
// release — Situation A + the freelancer half of C) or [r2] (deferred
// with its feature class). An untagged row is a scenario nobody classified
// against the release bar; a double-tagged row is a contradiction.
//
// What it checks: for each suite, every line shaped like a scenario row
// (`- **ID [label]…**`) contains exactly one of " [r1]" / " [r2]" inside
// its leading bold group.
//
// What it cannot check: that a tag is CORRECT. The r1/r2 classification is
// recorded judgment — argued with at the classifying commit, never here.
//
// Usage:
//   node deployment/scripts/release-tags.mjs             check
//   node deployment/scripts/release-tags.mjs --selfcheck assert-based self-test

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const SUITES = [
  "engine/SCENARIOS.md",
  "harness/SCENARIOS.md",
  "app/SCENARIOS.md",
  "marketplace/SCENARIOS.md",
  "security/SCENARIOS.md",
];

const ROW = /^- \*\*([A-Z]+[0-9]+[a-z]?) \[(.+?)\*\*/;

// text: one suite's content. Returns {rows, r1, r2, bad: [{id, tags}]}.
export function check(text) {
  const out = { rows: 0, r1: 0, r2: 0, bad: [] };
  for (const line of text.split("\n")) {
    const m = ROW.exec(line);
    if (!m) continue;
    out.rows++;
    const bold = m[0];
    const tags = (bold.match(/ \[r[12]\]/g) ?? []).map((t) => t.trim());
    if (tags.length !== 1) out.bad.push({ id: m[1], tags });
    else if (tags[0] === "[r1]") out.r1++;
    else out.r2++;
  }
  return out;
}

if (process.argv.includes("--selfcheck")) {
  const good = "- **A1 [MUST] [r1]** — x\n- **B2 [label] [r2]** y\nprose [r1] mentioning tags\n";
  const g = check(good);
  assert.deepStrictEqual([g.rows, g.r1, g.r2, g.bad.length], [2, 1, 1, 0], "tagged rows pass; prose ignored");
  const untagged = check("- **A1 [MUST]** — x\n");
  assert.deepStrictEqual(untagged.bad, [{ id: "A1", tags: [] }], "untagged row refused");
  const doubled = check("- **A1 [MUST] [r1] [r2]** — x\n");
  assert.strictEqual(doubled.bad.length, 1, "double-tagged row refused");
  const engineStyle = check("- **F3b [own terms] [r1]** x\n- **G6b [pin] [r2]** y\n");
  assert.strictEqual(engineStyle.rows, 2, "suffixed ids (F3b, G6b) are rows");
  const tail = check("- **I6 [authoring] `[MUST]` [r1]** x\n");
  assert.deepStrictEqual([tail.rows, tail.bad.length], [1, 0], "tag after a backticked weight counts");
  console.log("RELEASE-TAGS SELFCHECK OK");
  process.exit(0);
}

let rows = 0, r1 = 0, r2 = 0, failed = false;
for (const rel of SUITES) {
  const res = check(fs.readFileSync(path.join(ROOT, rel), "utf8"));
  rows += res.rows; r1 += res.r1; r2 += res.r2;
  for (const b of res.bad) {
    failed = true;
    console.error(`RELEASE-TAGS FAIL — ${rel} ${b.id}: ${b.tags.length ? `carries ${b.tags.join(" + ")}` : "no release tag"} (exactly one of [r1]/[r2] required — PRD.md §6.5)`);
  }
}
if (failed) process.exit(1);
console.log(`RELEASE-TAGS OK — ${rows} scenario rows across ${SUITES.length} suites: ${r1} [r1] (the first-release bar), ${r2} [r2] (deferred with their classes)`);
