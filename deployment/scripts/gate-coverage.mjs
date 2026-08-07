// A1 — gate-coverage checker (deployment process law; SPEC §0/§3, SCENARIOS S4).
// Mechanizes the standing rule "every [MUST] scenario names its gating step":
// for each deterministic layer, cross-check SCENARIOS.md against BUILD.md and
// report ORPHANS (a scenario with no BUILD home) and PHANTOMS (a BUILD-named
// scenario ID that no scenario defines). Exit non-zero if any layer has either.
//
// Model layer is deliberately EXCLUDED: model/EVALS.md is graded/statistical and
// gated on set-thresholds, not per-item BUILD homes — a per-item cross-check does
// not apply to it (EVALS.md §1/§3). It is reported as N/A, not walked.
//
// Usage:
//   node deployment/scripts/gate-coverage.mjs            full run over all layers
//   node deployment/scripts/gate-coverage.mjs --selfcheck  assert-based self-test
//
// Parsing contract (verified against all four layers 2026-08-07):
//   scenario def line:  `- **<ID> [ ...tag... ] ...`  ID = [A-Z]\d+[a-z]?
//   tag:  [MUST] / [HELD-OUT] / [ENGINE] (harness) · [MUST] / [DRILL] (deployment) ·
//         descriptive-only, all-MUST (engine, app)
//   BUILD home: any mention of the ID (Verify:/Gate: line or step body), ranges
//         like `D12–D17` and `S1–S3` expanded. PHANTOMs are filtered to families
//         that the layer actually defines, so prose tokens (harness "M2", engine
//         "M3", deployment "X1") are not mistaken for broken scenario refs.

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const LAYERS = [
  { name: "deployment", scenarios: "deployment/SCENARIOS.md", build: "deployment/BUILD.md" },
  { name: "harness", scenarios: "harness/SCENARIOS.md", build: "harness/BUILD.md" },
  { name: "engine", scenarios: "engine/SCENARIOS.md", build: "engine/BUILD.md" },
  { name: "app", scenarios: "app/SCENARIOS.md", build: "app/BUILD.md" },
];

// Scenario definitions: id -> { tag, engine }. A def line starts a list item
// whose first bold token is the scenario ID.
function scenarioDefs(text) {
  const defs = new Map();
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*-\s*\*\*([A-Z]\d+[a-z]?)\b(.*)$/);
    if (!m) continue;
    const rest = m[2];
    let tag = "MUST";
    if (/\[HELD-OUT\]/.test(rest)) tag = "HELD-OUT";
    else if (/\[DRILL\]/.test(rest)) tag = "DRILL";
    defs.set(m[1], { tag, engine: /\[ENGINE\]/.test(rest) });
  }
  return defs;
}

// Every scenario ID a BUILD text names, with ranges expanded. A lone trailing
// "s" is a plural ("two H1s"), never a real suffix (real suffixes are a/b), so it
// is dropped rather than read as its own ID.
function buildIds(text) {
  const ids = new Set();
  const TOKEN = /\b([A-Z])(\d+)([a-z]?)\b/g;
  let m;
  while ((m = TOKEN.exec(text))) {
    const suf = m[3] === "s" ? "" : m[3] || "";
    ids.add(m[1] + m[2] + suf);
  }
  const RANGE = /\b([A-Z])(\d+)[a-z]?\s*[-–—]\s*([A-Z]?)(\d+)[a-z]?/g;
  while ((m = RANGE.exec(text))) {
    const fam = m[1];
    const fam2 = m[3] || fam;
    const n1 = +m[2];
    const n2 = +m[4];
    if (fam2 !== fam || n2 < n1 || n2 - n1 > 50) continue;
    for (let n = n1; n <= n2; n++) ids.add(fam + n);
  }
  return ids;
}

// Lines that declare a gate. Phantoms are only meaningful here (a broken ref in
// a Verify:/Gate: list); step-body prose carries cross-layer references
// ("app scenario Z3") that are not this layer's phantoms.
function gateLines(text) {
  return text
    .split("\n")
    .filter((l) => /\bVerify:|\bGate:/.test(l))
    .join("\n");
}

function checkLayer(layer) {
  const defs = scenarioDefs(fs.readFileSync(path.join(ROOT, layer.scenarios), "utf8"));
  const buildText = fs.readFileSync(path.join(ROOT, layer.build), "utf8");
  const homed = buildIds(buildText); // whole build: J-family etc. are named in step bodies
  const gated = buildIds(gateLines(buildText)); // gate lines only: where a phantom would live
  const families = new Set([...defs.keys()].map((id) => id[0]));
  const orphans = [...defs.keys()].filter((id) => !homed.has(id));
  const phantoms = [...gated].filter((id) => families.has(id[0]) && !defs.has(id));
  return { defs, orphans, phantoms };
}

function selfcheck() {
  const S = `- **X1 [MUST]** — a\n- **X2 [MUST]** — b\n- **X3 [HELD-OUT]** — c`;
  const defs = scenarioDefs(S);
  const fam = new Set([...defs.keys()].map((i) => i[0]));
  assert.deepStrictEqual([...defs.keys()], ["X1", "X2", "X3"], "parses three IDs");
  assert.strictEqual(defs.get("X3").tag, "HELD-OUT", "reads HELD-OUT tag");

  // Clean case: a range covers X2, X9 is a phantom, non-family M3 is ignored.
  const clean = buildIds("Verify: X1, X3. Also X2–X2. Phantom X9. Prose M3.");
  const orph = [...defs.keys()].filter((i) => !clean.has(i));
  const phan = [...clean].filter((i) => fam.has(i[0]) && !defs.has(i));
  assert.deepStrictEqual(orph, [], "no orphans when all gated");
  assert.deepStrictEqual(phan, ["X9"], "X9 flagged, M3 ignored (wrong family)");

  // Negative: drop X2's gate -> X2 is an orphan.
  const gap = buildIds("Verify: X1, X3.");
  assert.ok([...defs.keys()].filter((i) => !gap.has(i)).includes("X2"), "missing gate -> orphan");

  // Range expansion across a real family span.
  assert.ok(buildIds("D12–D17").has("D15"), "expands D12–D17");
  // Plural is not a phantom; cross-ref in prose is excluded from the gate scan.
  assert.ok(buildIds("two X1s working").has("X1") && !buildIds("two X1s").has("X1s"), "plural 's' dropped");
  assert.strictEqual(gateLines("prose Z9 here\n- **Verify:** X1, X2\nGate: X3"), "- **Verify:** X1, X2\nGate: X3", "keeps only gate lines");
  console.log("selfcheck OK");
}

if (process.argv.includes("--selfcheck")) {
  selfcheck();
  process.exit(0);
}

let bad = 0;
for (const layer of LAYERS) {
  const { defs, orphans, phantoms } = checkLayer(layer);
  const status = orphans.length || phantoms.length ? "FAIL" : "ok";
  console.log(`\n[${layer.name}] ${defs.size} scenarios — ${status}`);
  if (orphans.length) {
    bad++;
    const tagged = orphans.map((id) => `${id}(${defs.get(id).tag})`);
    console.log(`  ORPHANS (no BUILD home): ${tagged.join(", ")}`);
  }
  if (phantoms.length) {
    bad++;
    console.log(`  PHANTOMS (gated, undefined): ${phantoms.join(", ")}`);
  }
}
console.log(`\nmodel: N/A — graded EVALS, not a per-item gated suite`);
console.log(bad ? `\nGATE-COVERAGE FAIL (${bad} issue group(s))` : `\nGATE-COVERAGE OK`);
process.exit(bad ? 1 : 0);
