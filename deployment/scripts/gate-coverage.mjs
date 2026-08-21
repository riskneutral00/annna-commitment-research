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
// ORPHANS are reported for [MUST], [ENGINE] and [HELD-OUT] scenarios — the law
// verbatim (SCENARIOS.md B8: "a change that adds or renames a
// [MUST]/[ENGINE]/[HELD-OUT] scenario without naming it in a BUILD step").
// This script checked [MUST] alone until 2026-08-21 and said so in this comment,
// which is a narrowing admitted rather than fixed (SPEC.md §7a item 4). It was
// latent — no non-MUST orphan existed — and a latent gap is still a gap: the
// day one is added, a narrowed gate says nothing.
//
// [DRILL] is the one tag still exempt, and it is exempt in the law too: B4 is
// the only [DRILL] and its second identity does not exist, so no mechanism can
// gate it (SCENARIOS.md, the coverage map). A [DRILL] that also carries
// [ENGINE] is an orphan candidate like any other — [ENGINE] is named in the law
// and the two tags are read independently.
//
// Parsing contract (verified against all six walked layers 2026-08-07):
//   scenario def line:  `- **<ID> [ ...tag... ] ...`  ID = [A-Z]\d+[a-z]?
//   tag:  [MUST] / [HELD-OUT] / [ENGINE] (harness) · [MUST] / [DRILL] (deployment) ·
//         descriptive-only (engine, app, marketplace, security) — those files
//         state "Every scenario is MUST" in their own header, so an untagged
//         def line is a MUST, not an exemption.
//   BUILD home: any mention of the ID (Verify:/Gate: line or step body), ranges
//         like `D12–D17` and `S1–S3` expanded, and `X-family` expanded to every
//         X ID the layer defines (`security/BUILD.md` gates "T-family, P-family,
//         R1, R3"). PHANTOMs are filtered to families that the layer actually
//         defines, so prose tokens (harness "M2", engine "M3", deployment "X1")
//         are not mistaken for broken scenario refs.

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
  { name: "marketplace", scenarios: "marketplace/SCENARIOS.md", build: "marketplace/BUILD.md" },
  { name: "security", scenarios: "security/SCENARIOS.md", build: "security/BUILD.md" },
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
// is dropped rather than read as its own ID. `defs` is the layer's scenario set:
// `X-family` can only be expanded against it, since the text alone does not say
// which X IDs exist.
function buildIds(text, defs = new Map()) {
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
  const FAMILY = /\b([A-Z])-family\b/g;
  while ((m = FAMILY.exec(text))) {
    for (const id of defs.keys()) if (id[0] === m[1]) ids.add(id);
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

// Which tags owe a BUILD home. Exported so the selfcheck and the real pass
// cannot drift onto two readings of one law.
export const owesHome = (def) => def.tag !== "DRILL" || def.engine;

function checkLayer(layer) {
  const defs = scenarioDefs(fs.readFileSync(path.join(ROOT, layer.scenarios), "utf8"));
  const buildText = fs.readFileSync(path.join(ROOT, layer.build), "utf8");
  const homed = buildIds(buildText, defs); // whole build: J-family etc. are named in step bodies
  const gated = buildIds(gateLines(buildText), defs); // gate lines only: where a phantom would live
  const families = new Set([...defs.keys()].map((id) => id[0]));
  const orphans = [...defs.keys()].filter((id) => owesHome(defs.get(id)) && !homed.has(id));
  const phantoms = [...gated].filter((id) => families.has(id[0]) && !defs.has(id));
  return { defs, orphans, phantoms };
}

function selfcheck() {
  const S = `- **X1 [MUST]** — a\n- **X2 [MUST]** — b\n- **X3 [HELD-OUT]** — c\n- **X4 [DRILL]** — d\n- **X5 [ENGINE]** — e\n- **X6 [DRILL] [ENGINE]** — f`;
  const defs = scenarioDefs(S);
  const fam = new Set([...defs.keys()].map((i) => i[0]));
  assert.deepStrictEqual([...defs.keys()], ["X1", "X2", "X3", "X4", "X5", "X6"], "parses six IDs");
  assert.strictEqual(defs.get("X3").tag, "HELD-OUT", "reads HELD-OUT tag");
  assert.ok(defs.get("X5").engine, "reads the ENGINE tag");

  // The law's tag set, and its one exemption.
  assert.ok(owesHome(defs.get("X1")) && owesHome(defs.get("X3")) && owesHome(defs.get("X5")),
    "MUST, HELD-OUT and ENGINE each owe a BUILD home");
  assert.ok(!owesHome(defs.get("X4")), "a bare DRILL does not — its second identity does not exist");
  assert.ok(owesHome(defs.get("X6")), "but a DRILL that is also ENGINE does");

  // Mirrors checkLayer.
  const orphansOf = (ids) => [...defs.keys()].filter((i) => owesHome(defs.get(i)) && !ids.has(i));

  // Clean case: a range covers X2, X9 is a phantom, non-family M3 is ignored.
  const clean = buildIds("Verify: X1, X3, X5, X6. Also X2–X2. Phantom X9. Prose M3.");
  const phan = [...clean].filter((i) => fam.has(i[0]) && !defs.has(i));
  assert.deepStrictEqual(orphansOf(clean), [], "no orphans when all gated");
  assert.deepStrictEqual(phan, ["X9"], "X9 flagged, M3 ignored (wrong family)");

  // Negative, mixed tags: everything the law names is an orphan when ungated,
  // and only the bare [DRILL] is not. This is the case the narrowed script read
  // wrong — it returned ["X2"] alone while X3, X5 and X6 sat ungated.
  assert.deepStrictEqual(orphansOf(buildIds("Verify: X1.")), ["X2", "X3", "X5", "X6"], "MUST, HELD-OUT and ENGINE orphans");

  // X-family expands against the layer's own defs, and only with them.
  assert.deepStrictEqual(orphansOf(buildIds("Gate: X-family.", defs)), [], "X-family covers X1–X6");
  assert.ok(!buildIds("Gate: X-family.").has("X1"), "no defs -> no family expansion");

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
