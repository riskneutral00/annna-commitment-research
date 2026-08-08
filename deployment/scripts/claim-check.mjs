// CLAIM-CHECK — a number stated in prose must equal the thing it counts.
//
// Why this exists: across this corpus's sweeps, the dominant finding class is
// not a design contradiction but the corpus miscounting itself. On 2026-08-08 a
// sweep found fifteen contradictions; nine were self-description, six of those
// were counts. A re-scope recorded "36→20" over a file holding 33. AGENTS.md
// said fifteen gates where sixteen sat. BUILD.md said eight declared hosts
// where the array held seven. Every one was written by someone who had just
// done the work and described it from memory, and every one read perfectly.
//
// `doc-count-check.mjs` mechanized exactly two of these numbers and has never
// gone stale since. This does the same for the rest.
//
// Scope, and what it deliberately does NOT do: it checks numbers that name a
// countable thing in this repo. It cannot check a historical number (SPEC.md's
// "fourteen scenarios were deleted" counts a set that no longer exists) and it
// does not try — a check that cannot fail is worse than no check. Build-state
// claims ("closed", "not wired") belong to status-report.mjs, not here.
//
// Usage:
//   node deployment/scripts/claim-check.mjs             check every claim
//   node deployment/scripts/claim-check.mjs --selfcheck assert-based self-test
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// The FR/FD registry. It sat at `archive/08-founder-rulings-2026-08-06.md` until
// 2026-08-08 and moved to the root because it is a live index and `../../AGENTS.md`
// declares archive/ non-authoritative — resolving a citation meant first reasoning
// about whether the hit counted.
const REGISTRY = "RULINGS.md";

// Claims are written as words, not digits, in this corpus's prose.
// Compound words are COMPUTED, not enumerated. An earlier version listed them
// one at a time and stopped at "twenty-two"; the gate count reached twenty-three
// and the check failed with `claims undefined` — a hardcoded list of words is
// itself a self-description that goes stale, which is the exact defect this
// script exists to catch, one level down.
const ONES = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
  nineteen: 19,
};
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };

export const num = (t) => {
  if (/^\d+$/.test(t)) return Number(t);
  const [a, b] = t.toLowerCase().split("-");
  if (b === undefined) return ONES[a] ?? TENS[a];
  return TENS[a] !== undefined && ONES[b] !== undefined && ONES[b] < 10 ? TENS[a] + ONES[b] : undefined;
};

// `transcript-reporter.mjs` is a reporter a suite imports, not a gate that can
// refuse anything. It is the only non-gate in the folder; anything else new is
// a gate and must be enumerated.
const NOT_A_GATE = new Set(["transcript-reporter.mjs"]);

// Parse the distinct `<name>.mjs` tokens out of a stretch of prose, in order.
const scripts = (s) => [...new Set([...s.matchAll(/`([a-z0-9-]+\.mjs)`/g)].map((m) => m[1]))];

// Each check returns { ok, label, detail }.
const CHECKS = [
  function gateInventory() {
    // AGENTS.md states the count and NOT the roster, deliberately: the roster's
    // normative home is package.json's check chain, which is executable. A prose
    // copy of an executable list is a copy that goes stale, and it did — twice in
    // one day. Counting the folder is what makes the remaining number honest.
    const m = read("AGENTS.md").match(/([a-z-]+) process gates sit in `deployment\/scripts\/`/);
    if (!m) return { ok: false, label: "AGENTS.md gate count", detail: "no longer states its gate count in a parseable form" };
    const actual = fs
      .readdirSync(path.join(ROOT, "deployment/scripts"))
      .filter((f) => f.endsWith(".mjs") && !NOT_A_GATE.has(f)).length;
    return num(m[1]) === actual
      ? { ok: true, label: "AGENTS.md gate count", detail: `${actual} gates, as claimed` }
      : { ok: false, label: "AGENTS.md gate count", detail: `AGENTS.md claims ${num(m[1])}; deployment/scripts/ holds ${actual} (excluding ${[...NOT_A_GATE].join(", ")})` };
  },

  function declaredHosts() {
    const claim = read("deployment/BUILD.md").match(/any URL outside ([a-z-]+) declared hosts/);
    if (!claim) return { ok: false, label: "R2 declared hosts", detail: "deployment/BUILD.md no longer states the host count in a parseable form" };
    const body = read("deployment/scripts/r2-closed-service.mjs").match(/const DECLARED_HOSTS = \[([\s\S]*?)\n\]/);
    if (!body) return { ok: false, label: "R2 declared hosts", detail: "r2-closed-service.mjs no longer declares DECLARED_HOSTS in a parseable form" };
    const actual = [...body[1].matchAll(/"[^"]+"/g)].length;
    return num(claim[1]) === actual
      ? { ok: true, label: "R2 declared hosts", detail: `${actual}, as claimed` }
      : { ok: false, label: "R2 declared hosts", detail: `deployment/BUILD.md claims ${num(claim[1])}; the array holds ${actual}` };
  },

  function deploymentScenarioCount() {
    // FD-4's headline. Only the right-hand number is checkable — the left counts
    // a file revision that no longer exists.
    const claim = read(REGISTRY).match(/re-scoped (\d+)→(\d+) scenarios/);
    if (!claim) return { ok: false, label: "FD-4 scenario count", detail: `${REGISTRY} no longer states the re-scope in a parseable form` };
    const actual = read("deployment/SCENARIOS.md").split("\n").filter((l) => /^\s*-\s*\*\*[A-Z]\d+\b/.test(l)).length;
    return Number(claim[2]) === actual
      ? { ok: true, label: "FD-4 scenario count", detail: `deployment holds ${actual}, as claimed` }
      : { ok: false, label: "FD-4 scenario count", detail: `FD-4 claims ${claim[2]} surviving scenarios; deployment/SCENARIOS.md defines ${actual}` };
  },
];

if (process.argv.includes("--selfcheck")) {
  // The parse and compare logic, over inline fixtures — including the negatives,
  // because a checker proven only on passing input proves nothing.
  assert.strictEqual(num("sixteen"), 16);
  assert.strictEqual(num("7"), 7);
  assert.strictEqual(num("nonsense"), undefined, "an unparseable word must not read as a number");
  // Compounds are computed, so the case that broke this gate cannot recur.
  assert.strictEqual(num("twenty-three"), 23, "the count that made an enumerated list fail");
  assert.strictEqual(num("ninety-nine"), 99, "and every compound above it, without another edit");
  assert.strictEqual(num("twenty"), 20, "a bare ten still parses");
  assert.strictEqual(num("twenty-twenty"), undefined, "a malformed compound is not a number");
  assert.strictEqual(num("three-four"), undefined, "the first half must be a tens word");

  assert.deepStrictEqual(scripts("`a.mjs`, `b.mjs` and `a.mjs`"), ["a.mjs", "b.mjs"], "names dedupe");
  assert.deepStrictEqual(scripts("no scripts here"), []);

  const hosts = (src) => [...src.match(/const DECLARED_HOSTS = \[([\s\S]*?)\n\]/)[1].matchAll(/"[^"]+"/g)].length;
  assert.strictEqual(hosts('const DECLARED_HOSTS = [\n  "a.io", // c\n  "b.dev",\n];'.replace("];", "]\n];")), 2);

  const defs = (src) => src.split("\n").filter((l) => /^\s*-\s*\*\*[A-Z]\d+\b/.test(l)).length;
  assert.strictEqual(defs("- **R1 [x]** y\n- **R2 [x]** y\nprose\n- not a def"), 2);
  assert.strictEqual(defs("**R1** in prose, not a list item"), 0, "prose mentions are not definitions");

  console.log("\nselfcheck OK");
}

const results = CHECKS.map((c) => c());
const bad = results.filter((r) => !r.ok);
for (const r of bad) console.log(`\nCLAIM FAIL — ${r.label}: ${r.detail}`);
if (bad.length) {
  console.log(`\n  Recount before rewording. The number is the thing that is wrong more often than the prose.`);
  process.exit(1);
}
console.log(`\nCLAIM OK — ${results.length} stated counts each equal what they count`);
