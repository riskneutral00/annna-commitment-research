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
    else if (/\[SHOULD\b/.test(rest)) tag = "SHOULD";
    defs.set(m[1], { tag, engine: /\[ENGINE\]/.test(rest) });
  }
  return defs;
}

// Duplicate scenario IDs (LWR-01, 2026-09-01 — PF-01's code half): `defs` is a
// Map, so a second definition of one ID silently replaced the first — [app]
// printed 62 scenarios over 63 rows while two S7s sat in the suite, and every
// downstream consumer (orphans, phantoms, famRanges, the probe scope) read the
// collapsed set. Collected from the raw text BEFORE the Map exists and
// reported id-by-id — never as a count diff, which the next added row re-hides.
export function duplicateDefs(text) {
  const seen = new Map();
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*-\s*\*\*([A-Z]\d+[a-z]?)\b/);
    if (m) seen.set(m[1], (seen.get(m[1]) || 0) + 1);
  }
  return [...seen].filter(([, n]) => n > 1).map(([id, n]) => ({ id, n }));
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
export const owesHome = (def) => (def.tag !== "DRILL" && def.tag !== "SHOULD") || def.engine;
// [SHOULD] joined the exempt classes 2026-08-31 (Q2-078): the pre-fix parser
// read a [SHOULD / …] row as MUST — a widened obligation the law never made.
// A SHOULD that is also [ENGINE] owes a home exactly as a DRILL-ENGINE does.

// The checkpoint ledger (harness/BUILD.md Step 5, 2026-08-22). Two countable
// halves of the step's own stated laws: (a) "every ID in the Verify set sits in
// exactly one checkpoint"; (b) the printed Depends line's `ID → (n)` pairs — a
// scenario whose Given needs machinery a later subset builds — each match the
// ID's actual placement. D4 in checkpoint (1) went green vacuously through the
// empty-ladder path; a Depends pair makes that misplacement fail the chain.
// NOT CHECKED: that the Depends line is COMPLETE — naming a new
// Given-dependency is a reading job; enforcing a named one is mechanical.
export function checkpointLedger(buildText, defs = new Map(), required = []) {
  const bad = [];
  // Scope to the checkpoint block: from the declaration sentence to the next
  // Verify line — a bold-numbered list anywhere else in the file is not a
  // checkpoint and must not join the membership count.
  const start = buildText.indexOf("Checkpoints (declared");
  if (start < 0) return ["harness/BUILD.md Step 5's checkpoint block no longer parses — fix this script's contract"];
  const endRel = buildText.slice(start).search(/\n-\s*\*\*Verify:/);
  const block = endRel < 0 ? buildText.slice(start) : buildText.slice(start, start + endRel);
  const membership = new Map(); // id -> [subset numbers]
  const SUBSET = /\*\*\((\d+)\)[^*]*\*\*\s*`([^`]+)`/g;
  let m;
  let subsets = 0;
  while ((m = SUBSET.exec(block))) {
    subsets++;
    for (const id of buildIds(m[2], defs)) {
      if (!membership.has(id)) membership.set(id, []);
      membership.get(id).push(m[1]);
    }
  }
  if (!subsets) return ["harness/BUILD.md Step 5's checkpoint list no longer parses — fix this script's contract"];
  for (const [id, subs] of membership) if (subs.length > 1) bad.push(`${id} sits in checkpoints (${subs.join(") and (")}) — the law says exactly one`);
  const dep = block.match(/\*\*Depends \(the Given-needs-machinery edges[^:]*:\s*([^*]+)\*\*/);
  if (!dep) bad.push("the Depends line is missing or no longer parses — it is part of the checkpoint contract");
  else {
    const PAIR = /([A-Z]\d+[a-z]?)\s*→\s*\((\d+)\)/g;
    let p;
    let pairs = 0;
    while ((p = PAIR.exec(dep[1]))) {
      pairs++;
      const placed = membership.get(p[1]);
      if (!placed) bad.push(`Depends names ${p[1]}, which sits in no checkpoint`);
      else if (!placed.includes(p[2])) bad.push(`Depends says ${p[1]} → (${p[2]}) but it sits in (${placed.join(",")})`);
    }
    if (!pairs) bad.push("the Depends line parses but names no ID → (n) pair");
    // The required set (2026-08-31, Q2-077/H2): the four Given-needs-machinery
    // edges the corpus has ruled. A missing one fails — a scenario scheduled
    // ahead of its machinery must be caught at the gate, not the checkpoint.
    const named = new Set([...dep[1].matchAll(PAIR_RE)].map((x) => x[1]));
    for (const need of required) {
      if (!named.has(need)) bad.push(`the Depends line is missing the required pair for ${need} (Q2-077's law: D4, A6, D26 and D5 each carry their Given-needs-machinery edge)`);
    }
  }
  return bad;
}
const PAIR_RE = /([A-Z]\d+[a-z]?)\s*→\s*\((\d+)\)/g;
export const REQUIRED_PAIRS = ["D4", "A6", "D26", "D5"];

// --- the TDD-map span checker (2026-08-31, Q2-072(c); the H3 grammar) ---
// A bold range that OPENS a family's parenthetical in a TDD family map is a
// COMPLETE SPAN CLAIM and must equal that suite family's actual minimum and
// maximum. An `incl.`-prefixed range is an explicitly bounded subset mention —
// not a complete-span claim, and that bound is printed in the OK line rather
// than silently assumed. Section→suite attribution rides the `## ` headings.
const SPAN_CLAIM = /\*\*([A-Z])′?\*\*[^(·]*\((\*\*([A-Z])(\d+)[–-]\3(\d+)\*\*)/g;
export function tddSpanClaims(tddText, famRangesBySuite) {
  const bad = [];
  let sec = null;
  let claims = 0;
  for (const line of tddText.split("\n")) {
    if (line.startsWith("## ")) {
      const low = line.toLowerCase();
      sec = Object.keys(famRangesBySuite).find((k) => low.includes(k)) ?? null;
    }
    if (!sec) continue;
    for (const m of line.matchAll(SPAN_CLAIM)) {
      const fam = m[3];
      const [a, b] = [+m[4], +m[5]];
      const range = famRangesBySuite[sec][fam];
      if (!range) continue;
      claims++;
      if (a !== range[0] || b !== range[1])
        bad.push(`TDD.md's ${sec} map claims the ${fam} span as ${fam}${a}–${fam}${b}; the suite's is ${fam}${range[0]}–${fam}${range[1]}`);
    }
  }
  return { bad, claims };
}

export function famRanges(defs) {
  const out = {};
  for (const id of defs.keys()) {
    const f = id[0];
    const n = parseInt(id.slice(1), 10);
    out[f] = out[f] ? [Math.min(out[f][0], n), Math.max(out[f][1], n)] : [n, n];
  }
  return out;
}

function checkLayer(layer) {
  const scenText = fs.readFileSync(path.join(ROOT, layer.scenarios), "utf8");
  const dups = duplicateDefs(scenText);
  const defs = scenarioDefs(scenText);
  const buildText = fs.readFileSync(path.join(ROOT, layer.build), "utf8");
  const homed = buildIds(buildText, defs); // whole build: J-family etc. are named in step bodies
  const gated = buildIds(gateLines(buildText), defs); // gate lines only: where a phantom would live
  const families = new Set([...defs.keys()].map((id) => id[0]));
  const orphans = [...defs.keys()].filter((id) => owesHome(defs.get(id)) && !homed.has(id));
  const phantoms = [...gated].filter((id) => families.has(id[0]) && !defs.has(id));
  const ledger = layer.name === "harness" ? checkpointLedger(buildText, defs, REQUIRED_PAIRS) : [];
  return { defs, dups, orphans, phantoms, ledger };
}

function selfcheck() {
  const S = `- **X1 [MUST]** — a\n- **X2 [MUST]** — b\n- **X3 [HELD-OUT]** — c\n- **X4 [DRILL]** — d\n- **X5 [ENGINE]** — e\n- **X6 [DRILL] [ENGINE]** — f`;
  const defs = scenarioDefs(S);
  const fam = new Set([...defs.keys()].map((i) => i[0]));
  assert.deepStrictEqual([...defs.keys()], ["X1", "X2", "X3", "X4", "X5", "X6"], "parses six IDs");
  assert.strictEqual(defs.get("X3").tag, "HELD-OUT", "reads HELD-OUT tag");
  assert.ok(defs.get("X5").engine, "reads the ENGINE tag");
  assert.deepStrictEqual(duplicateDefs(S), [], "the unique fixture carries no duplicate IDs");
  assert.deepStrictEqual(
    duplicateDefs("- **S1 [a]** x\n- **S2 [b]** y\n- **S1 [c]** z"),
    [{ id: "S1", n: 2 }],
    "two definitions of one ID fail, and the finding names the ID — never a bare count",
  );

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

  // The checkpoint ledger: exactly-once membership + Depends placement.
  const cp = (list, deps) => `Checkpoints (declared, not advisory): ${list}\n**Depends (the Given-needs-machinery edges, parsed by the gate): ${deps}**\n- **Verify:** X1`;
  assert.deepStrictEqual(checkpointLedger(cp("**(1) a** `X1, X2` · **(2) b** `X3`", "X3 → (2)"), defs), [], "a clean ledger passes");
  assert.ok(checkpointLedger(cp("**(1) a** `X1, X2` · **(2) b** `X3`", "X3 → (1)"), defs).some((b) => b.includes("X3")), "a misplaced Depends pair is caught");
  assert.ok(checkpointLedger(cp("**(1) a** `X1` · **(2) b** `X1`", "X1 → (1)"), defs).some((b) => b.includes("exactly one")), "double membership is caught");
  assert.ok(checkpointLedger("no checkpoint block here").length, "a non-parsing checkpoint block is a failure, not a skip");

  // The required-pairs canary (2026-08-31, Q2-077/H2): a Depends line missing a
  // required Given-needs-machinery edge fails, and the full four-pair line passes.
  const cpq = cp("**(1) a** `X1, X2` · **(2) b** `X3`", "X1 → (1)");
  assert.ok(checkpointLedger(cpq, defs, ["X1", "X3"]).some((b) => b.includes("missing the required pair for X3")), "a missing required pair is caught");
  assert.deepStrictEqual(checkpointLedger(cp("**(1) a** `X1, X2` · **(2) b** `X3`", "X1 → (1) · X3 → (2)"), defs, ["X1", "X3"]), [], "the complete required set passes");

  // The TDD-map span grammar's canaries (2026-08-31, Q2-072(c)/H3): a bold
  // range opening a family's parenthetical is a complete span claim; an
  // `incl.`-prefixed range is a bounded subset mention and never fires.
  const ranges = { harness: { K: [1, 11], D: [1, 29] } };
  const staleMap = "## Harness — behavioral\n**K** check-work (**K1–K10** incl. things)";
  const trueMap = "## Harness — behavioral\n**K** check-work (**K1–K11** incl. things)";
  const inclMap = "## Harness — behavioral\n**D** the floor (incl. **D10–D11** auto-accept)";
  assert.ok(tddSpanClaims(staleMap, ranges).bad.some((b) => b.includes("K1–K10")), "a stale complete span fails");
  assert.deepStrictEqual(tddSpanClaims(trueMap, ranges).bad, [], "a true span passes");
  assert.deepStrictEqual(tddSpanClaims(inclMap, ranges), { bad: [], claims: 0 }, "an incl. subset mention is not a span claim");
  assert.deepStrictEqual(checkpointLedger(`bold list elsewhere **(4) prose** \`X9\`\n${cp("**(1) a** `X1, X2` · **(2) b** `X3`", "X3 → (2)")}`, defs), [], "a bold-numbered list outside the block is ignored");
  console.log("selfcheck OK");
}

if (process.argv.includes("--selfcheck")) {
  selfcheck();
  process.exit(0);
}

let bad = 0;
const rangesBySuite = {};
for (const layer of LAYERS) {
  const { defs, dups, orphans, phantoms, ledger } = checkLayer(layer);
  rangesBySuite[layer.name] = famRanges(defs);
  const status = dups.length || orphans.length || phantoms.length || ledger.length ? "FAIL" : "ok";
  console.log(`\n[${layer.name}] ${defs.size} scenarios — ${status}`);
  if (dups.length) {
    bad++;
    for (const d of dups)
      console.log(`  DUPLICATE ID: [${layer.name}] ${layer.scenarios} defines ${d.id} ${d.n} times — one ID, one scenario`);
  }
  if (orphans.length) {
    bad++;
    const tagged = orphans.map((id) => `${id}(${defs.get(id).tag})`);
    console.log(`  ORPHANS (no BUILD home): ${tagged.join(", ")}`);
  }
  if (phantoms.length) {
    bad++;
    console.log(`  PHANTOMS (gated, undefined): ${phantoms.join(", ")}`);
  }
  if (ledger.length) {
    bad++;
    for (const b of ledger) console.log(`  CHECKPOINT LEDGER: ${b}`);
  }
}
console.log(`\nmodel: N/A — graded EVALS, not a per-item gated suite`);

// The TDD family maps against the suites (Q2-072(c), the H3 span-claim grammar).
const tdd = fs.readFileSync(path.join(ROOT, "TDD.md"), "utf8");
const spans = tddSpanClaims(tdd, rangesBySuite);
if (spans.bad.length) {
  bad++;
  for (const b of spans.bad) console.log(`  TDD MAP: ${b}`);
}
console.log(
  `TDD maps: ${spans.claims} complete span claim(s) checked against the suites' own min–max. ` +
    `NOT A SPAN CLAIM: an \`incl.\`-prefixed range — an explicitly bounded subset mention, unchecked by design.`,
);
console.log(bad ? `\nGATE-COVERAGE FAIL (${bad} issue group(s))` : `\nGATE-COVERAGE OK`);
process.exit(bad ? 1 : 0);
