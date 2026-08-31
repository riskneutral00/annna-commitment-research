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
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
// Which files in the folder are not gates is declared once, in `not-a-gate.mjs`,
// and imported here. It used to be declared locally here AND in
// `roster-check.mjs` — two copies feeding two counts, agreeing by luck.
// `gate-wiring.mjs` now asserts there is only the one.
import { NOT_A_GATE } from "./not-a-gate.mjs";

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

// Parse the distinct `<name>.mjs` tokens out of a stretch of prose, in order.
const scripts = (s) => [...new Set([...s.matchAll(/`([a-z0-9-]+\.mjs)`/g)].map((m) => m[1]))];

// The parse helpers below are module-level on purpose: the checks and the
// selfcheck run the SAME code over different input. The two older checks each
// re-declare their parse inside --selfcheck, which is a second copy that can
// drift from the one being tested — the exact defect one level down.
const labels = (s) => [...s.matchAll(/OR-\d+/g)].map((m) => m[0]);

// AGENTS.md's open-ruling sentence: "<word> open — <open list> (<closed list> closed)".
const orSets = (src) => {
  const m = src.match(/([A-Za-z-]+) open — ([^—]+?) \(([^)]*?) closed\)/);
  return m && { word: m[1], open: labels(m[2]), closed: labels(m[3]) };
};

// The five filenames AGENTS.md's fenced package-shape block promises.
const shapeNames = (src) => {
  const block = src.match(/```\n<package>\/\n([\s\S]*?)```/);
  return block && [...block[1].matchAll(/^\s+([A-Za-z]+\.md)\s/gm)].map((m) => m[1]);
};

// The set package-shape.mjs actually enforces, read from its source rather than
// restated here — the declaredHosts pattern, one level over.
const requiredNames = (src) => {
  const m = src.match(/const REQUIRED = \[([^\]]*)\]/);
  return m && [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
};

// Set difference both ways. A one-directional compare passes a superset, which
// is how a shape law grows a sixth file nobody promised.
const bothWays = (a, b) => [a.filter((x) => !b.includes(x)), b.filter((x) => !a.includes(x))];

const trackedMd = () =>
  execFileSync("git", ["ls-files", "-z", "*.md"], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 })
    .split("\0")
    .filter(Boolean);

// The Step-0 tracked-artifact-claims contract (2026-08-31, Q2-076/G3):
// harness/BUILD.md prints exactly one machine-readable line
//   `- Tracked-artifact-claims (Step 0): <value>`
// where `none` claims no tracked rig artifact, and otherwise every listed
// repo-relative path must resolve through `git ls-files`. Exported for the
// selfcheck; the canaries are a missing marker and an untracked claimed path.
const CLAIMS_MARKER = /^- Tracked-artifact-claims \(Step 0\): (.+)$/;
export function checkStepZeroClaims(text, lsFiles) {
  const matches = text.match(new RegExp(CLAIMS_MARKER.source, "gm")) ?? [];
  if (matches.length !== 1)
    return { ok: false, label: "harness Step-0 tracked-artifact claims", detail: `expected exactly one marker line, found ${matches.length}` };
  const value = matches[0].match(CLAIMS_MARKER)[1].trim();
  if (value === "none") return { ok: true, label: "harness Step-0 tracked-artifact claims", detail: "none claimed, none owed" };
  for (const p of value.split(",").map((x) => x.trim())) {
    if (!lsFiles.has(p)) return { ok: false, label: "harness Step-0 tracked-artifact claims", detail: `claimed artifact not tracked: ${p}` };
  }
  return { ok: true, label: "harness Step-0 tracked-artifact claims", detail: "every claimed artifact is tracked" };
}
const trackedAll = () =>
  new Set(execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 }).split("\n").filter(Boolean));

// Each check returns { ok, label, detail }.
const CHECKS = [
  function stepZeroClaims() {
    return checkStepZeroClaims(read("harness/BUILD.md"), trackedAll());
  },

  function gateInventory() {
    // AGENTS.md states the count and NOT the roster, deliberately. The division
    // is roster-check.mjs's: `package.json` owns the wiring and the order,
    // because it is executable; `deployment/README.md` owns the roster — WHY
    // each gate exists. A prose copy of either is a copy that goes stale, and
    // one did, twice in one day. Counting the folder is what makes the
    // remaining number honest.
    const m = read("AGENTS.md").match(/([a-z-]+) process gates sit in `deployment\/scripts\/`/);
    if (!m) return { ok: false, label: "AGENTS.md gate count", detail: "no longer states its gate count in a parseable form" };
    const actual = fs
      .readdirSync(path.join(ROOT, "deployment/scripts"))
      .filter((f) => f.endsWith(".mjs") && !(f in NOT_A_GATE)).length;
    return num(m[1]) === actual
      ? { ok: true, label: "AGENTS.md gate count", detail: `${actual} gates, as claimed` }
      : { ok: false, label: "AGENTS.md gate count", detail: `AGENTS.md claims ${num(m[1])}; deployment/scripts/ holds ${actual} (excluding ${Object.keys(NOT_A_GATE).join(", ")})` };
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

  function openRulings() {
    // AGENTS.md declares the open set in one sentence and the corpus defines
    // each label where it is used. Nothing ever compared the two, so three
    // things could drift silently: the count word against the list beside it,
    // a label sitting in the open AND closed lists at once, and a label
    // declared open that no file defines — an open ruling nobody can read.
    const s = orSets(read("AGENTS.md"));
    if (!s) return { ok: false, label: "AGENTS.md open rulings", detail: "AGENTS.md no longer states its open-ruling set in a parseable form" };
    const both = s.open.filter((l) => s.closed.includes(l));
    if (both.length) return { ok: false, label: "AGENTS.md open rulings", detail: `${both.join(", ")} listed as open AND closed in the same sentence` };
    if (num(s.word) !== s.open.length) return { ok: false, label: "AGENTS.md open rulings", detail: `AGENTS.md says ${s.word} open; the list beside it names ${s.open.length} (${s.open.join(", ")})` };
    const corpus = trackedMd().filter((f) => f !== "AGENTS.md");
    const orphan = s.open.filter((l) => !corpus.some((f) => read(f).includes(l)));
    return orphan.length
      ? { ok: false, label: "AGENTS.md open rulings", detail: `${orphan.join(", ")} declared open, but defined in no tracked file — "each fully defined where it is used" is false` }
      : { ok: true, label: "AGENTS.md open rulings", detail: `${s.open.length} open, none also closed, each defined somewhere in the corpus` };
  },

  function situationCount() {
    // README.md's front-door sentence states two numbers over one directory,
    // and the split between them is the whole point: the primes are marketplace
    // install probes, not end-to-end situations. Counting every Situation-*
    // directory would make the correct sentence fail, so the check counts the
    // way the sentence itself divides them.
    const src = read("README.md");
    const core = src.match(/([A-Za-z-]+) end-to-end situations in/);
    const probe = src.match(/plus ([a-z-]+) marketplace install probes/);
    if (!core || !probe) return { ok: false, label: "README situation count", detail: "README.md no longer states its situation counts in a parseable form" };
    const dirs = fs
      .readdirSync(path.join(ROOT, "user-stories/Situations"), { withFileTypes: true })
      .filter((d) => d.isDirectory() && d.name.startsWith("Situation-"))
      .map((d) => d.name);
    const primes = dirs.filter((d) => d.endsWith("-prime"));
    const actual = dirs.length - primes.length;
    if (num(core[1]) !== actual) return { ok: false, label: "README situation count", detail: `README claims ${core[1]} end-to-end situations; user-stories/Situations/ holds ${actual} non-prime director(ies)` };
    return num(probe[1]) === primes.length
      ? { ok: true, label: "README situation count", detail: `${actual} situations and ${primes.length} install probes, as claimed` }
      : { ok: false, label: "README situation count", detail: `README claims ${probe[1]} install probes; ${primes.length} prime director(ies) exist` };
  },

  function shapeFileSet() {
    // AGENTS.md prints the package shape as law and package-shape.mjs enforces
    // it — two copies of one set, never compared. A consolidation that moves
    // the shape moves the script or the prose, rarely both, and whichever one
    // lags stays green on its own terms.
    const claimed = shapeNames(read("AGENTS.md"));
    if (!claimed) return { ok: false, label: "package shape set", detail: "AGENTS.md no longer prints the package-shape block in a parseable form" };
    const required = requiredNames(read("deployment/scripts/package-shape.mjs"));
    if (!required) return { ok: false, label: "package shape set", detail: "package-shape.mjs no longer declares REQUIRED in a parseable form" };
    const [promised, enforced] = bothWays(claimed, required);
    return promised.length || enforced.length
      ? { ok: false, label: "package shape set", detail: `AGENTS.md promises ${promised.join(", ") || "nothing"} that package-shape.mjs does not enforce; package-shape.mjs enforces ${enforced.join(", ") || "nothing"} that AGENTS.md does not promise` }
      : { ok: true, label: "package shape set", detail: `${claimed.length} files, promised and enforced sets equal both ways` };
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

  // --- openRulings, with its three negatives ---
  const live = "Three open — OR-28, OR-29, OR-42 (OR-39, OR-40, OR-41 closed) — each fully defined";
  const s = orSets(live);
  assert.deepStrictEqual(s.open, ["OR-28", "OR-29", "OR-42"], "the open list parses");
  assert.deepStrictEqual(s.closed, ["OR-39", "OR-40", "OR-41"], "and the closed list does not bleed into it");
  assert.strictEqual(num(s.word), s.open.length, "the live sentence agrees with itself");
  // negative: the count word drifts from the list beside it.
  const drifted = orSets("Four open — OR-28, OR-29, OR-42 (OR-39 closed)");
  assert.notStrictEqual(num(drifted.word), drifted.open.length, "a count word ahead of its own list must not read as agreement");
  // negative: one label in both lists at once.
  const overlap = orSets("Three open — OR-28, OR-29, OR-42 (OR-42, OR-40 closed)");
  assert.deepStrictEqual(overlap.open.filter((l) => overlap.closed.includes(l)), ["OR-42"], "a label declared open AND closed is caught");
  assert.strictEqual(orSets("no such sentence here"), null, "an unparseable declaration is a failure, never a silent pass");

  // --- shapeFileSet, with its negative ---
  const shapeBlock = "```\n<package>/\n  README.md      purpose\n  SPEC.md        law\n```";
  assert.deepStrictEqual(shapeNames(shapeBlock), ["README.md", "SPEC.md"]);
  assert.deepStrictEqual(requiredNames('const REQUIRED = ["README.md", "SPEC.md"];'), ["README.md", "SPEC.md"]);
  assert.deepStrictEqual(bothWays(["a", "b"], ["a", "b"]), [[], []], "equal sets differ in neither direction");
  // negative: the sets differ by one file, in each direction separately.
  assert.deepStrictEqual(bothWays(["a", "b"], ["a"]), [["b"], []], "prose promising a file the script does not enforce");
  assert.deepStrictEqual(bothWays(["a"], ["a", "b"]), [[], ["b"]], "and the script enforcing one the prose never promised");
  assert.strictEqual(shapeNames("no fenced block"), null, "an unparseable shape block is a failure, not an empty set");

  // The Step-0 claims canaries (Q2-076/G3): the missing marker and the
  // untracked claimed path must each fail; `none` and a tracked path pass.
  const ls = new Set(["harness/BUILD.md", "tracked/file.md"]);
  assert.ok(!checkStepZeroClaims("no marker here", ls).ok, "a missing marker fails");
  assert.ok(!checkStepZeroClaims("- Tracked-artifact-claims (Step 0): does/not/exist.md", ls).ok, "an untracked claimed path fails");
  assert.ok(checkStepZeroClaims("- Tracked-artifact-claims (Step 0): none", ls).ok, "the explicit none form passes");
  assert.ok(checkStepZeroClaims("- Tracked-artifact-claims (Step 0): tracked/file.md", ls).ok, "a tracked claimed path passes");
  assert.ok(!checkStepZeroClaims("- Tracked-artifact-claims (Step 0): none\n- Tracked-artifact-claims (Step 0): none", ls).ok, "two marker lines fail — exactly one is the contract");

  console.log("\nCLAIM SELFCHECK OK — parse/compare fixtures and the Step-0 marker canaries fire");
  process.exit(0);
}

const results = CHECKS.map((c) => c());
const bad = results.filter((r) => !r.ok);
for (const r of bad) console.log(`\nCLAIM FAIL — ${r.label}: ${r.detail}`);
if (bad.length) {
  console.log(`\n  Recount before rewording. The number is the thing that is wrong more often than the prose.`);
  process.exit(1);
}
console.log(`\nCLAIM OK — ${results.length} stated counts each equal what they count`);
