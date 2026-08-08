// B9 — the suite replays byte-identical (deployment/SPEC.md §4, SCENARIOS.md B9):
// the full layer suite runs TWICE and the two transcripts are byte-compared.
// The harness's L2 determinism lifted to a process gate.
//
// A transcript is `.tmp/transcripts/<layer>.txt`, written by the layer's own
// suite (SPEC.md §4). Nothing writes one yet — the harness does, at harness-build
// time — so today this reports "nothing to compare" rather than passing quietly.
// It is wired now and exercised then: the R7 pattern.
//
// Not a dead script in the meantime. It runs every discovered suite twice for
// real, and the moment ONE layer writes a transcript, every layer with a suite
// must write one too — a suite that silently stops producing its transcript is
// the failure this gate would otherwise never notice, because a missing file
// byte-compares equal to another missing file.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const DIR = ".tmp/transcripts";

// The whole gate is this comparison; everything else is running suites and
// hashing files. Kept separate so --selfcheck can exercise it without a suite.
function compare(first, second, suites) {
  const names = [...new Set([...Object.keys(first), ...Object.keys(second)])].sort();
  const findings = [];
  for (const name of names) {
    if (!first[name]) findings.push(`${name} — written on the second run and not the first`);
    else if (!second[name]) findings.push(`${name} — written on the first run and not the second (vanished on replay)`);
    else if (first[name] !== second[name]) findings.push(`${name} — two runs, two different transcripts (${first[name].slice(0, 12)} vs ${second[name].slice(0, 12)})`);
  }
  // Once ANY layer writes a transcript, a suite that writes none is a hole, not
  // a state — that is the "wired now, exercised then" boundary being crossed.
  if (names.length) {
    for (const layer of suites) {
      if (!names.includes(`${layer}.txt`)) findings.push(`${layer} — has a suite and wrote no transcript, while another layer did`);
    }
  }
  return { names, findings };
}

if (process.argv.includes("--selfcheck")) {
  const cases = [
    ["identical replays pass", compare({ "h.txt": "aa" }, { "h.txt": "aa" }, ["h"]).findings.length === 0],
    ["divergent bytes fail", compare({ "h.txt": "aa" }, { "h.txt": "bb" }, ["h"]).findings.length === 1],
    ["a vanished transcript fails", compare({ "h.txt": "aa" }, {}, ["h"]).findings.length === 1],
    ["a silent suite fails once a sibling writes one", compare({ "h.txt": "aa" }, { "h.txt": "aa" }, ["h", "e"]).findings.length === 1],
    ["no transcripts anywhere is not a failure", compare({}, {}, ["h", "e"]).findings.length === 0],
  ];
  const failed = cases.filter(([, ok]) => !ok);
  if (failed.length) {
    console.log(`\nB9 SELFCHECK FAIL — the comparison does not catch what B9 says it catches:`);
    for (const [name] of failed) console.log(`  ${name}`);
    process.exit(1);
  }
  console.log(`selfcheck OK`);
  process.exit(0);
}

// A layer has a suite if its package.json declares a test script. Discovered,
// not listed — a hardcoded layer list is a second registry that rots the day a
// layer gains a suite and nobody edits this file.
const layers = readdirSync(".", { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules")
  .filter((e) => existsSync(join(e.name, "package.json")))
  .filter((e) => JSON.parse(readFileSync(join(e.name, "package.json"), "utf8")).scripts?.test)
  .map((e) => e.name);

if (!layers.length) {
  console.log(`\nB9 SKIPPED — no layer declares a suite. Nothing to run twice.`);
  process.exit(0);
}

// One pass: clear the transcript dir, run every suite, hash whatever landed.
function pass(n) {
  rmSync(DIR, { recursive: true, force: true });
  mkdirSync(DIR, { recursive: true });
  for (const layer of layers) {
    try {
      execFileSync("npm", ["--prefix", layer, "test"], { stdio: "pipe" });
    } catch {
      console.log(`\nB9 FAIL — the ${layer} suite is red on run ${n}. Determinism is not the question yet; fix the suite.`);
      process.exit(1);
    }
  }
  return Object.fromEntries(
    readdirSync(DIR).map((f) => [f, createHash("sha256").update(readFileSync(join(DIR, f))).digest("hex")]),
  );
}

const { names, findings } = compare(pass(1), pass(2), layers);

if (findings.length) {
  console.log(`\nB9 FAIL — the suite does not replay byte-identical:`);
  for (const f of findings) console.log(`  ${f}`);
  process.exit(1);
}

if (!names.length) {
  console.log(`\nB9 NOTHING TO COMPARE — ${layers.length} suite(s) ran twice, none writes ${DIR}/<layer>.txt yet. The byte-compare is exercised at harness-build, when transcripts first exist (SCENARIOS.md B9).`);
  process.exit(0);
}
console.log(`\nB9 OK — ${layers.length} suite(s) run twice, ${names.length} transcript(s) byte-identical`);
