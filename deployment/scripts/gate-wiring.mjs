// GATE-WIRING — a gate script that no `npm` script names is a gate that never
// runs, and the set of files exempt from that rule has exactly one definition.
//
// Why this exists: `AGENTS.md` claims every gate in `deployment/scripts/` is
// wired to an `npm` script in `package.json`. Nothing checked it. A new script
// dropped in this folder would be counted by `claim-check.mjs`, described by
// `roster-check.mjs`, and never executed by anything — three green gates over
// a script that has never once run. Counting a gate and running it are
// different facts, and only one of them was mechanized.
//
// The second assertion is the older defect. The not-a-gate set was declared
// twice, in `claim-check.mjs` and `roster-check.mjs`, agreeing by luck and
// feeding two separate counts, with neither file citing the other. That is the
// shape of every miscount this corpus keeps finding: two copies of one fact,
// no gate between them. The set now lives in one data-only module and this
// asserts that it stays that way — a second `const NOT_A_GATE =` anywhere in
// the folder is the divergence starting again, caught on the day it lands
// rather than the day the counts drift apart.
//
// The third assertion is the same defect one level up, and it is the one this
// gate was blind to: `package.json` can name every script and the CI job can
// still not run them. Nothing read `.github/workflows/check.yml`'s CONTENT —
// its install steps were a hardcoded registry no check compared to the layers
// that actually carry a suite, and a `continue-on-error:` or a gutted `run:`
// would have been green everywhere (SPEC.md §7a item 3). The suite-carrying
// layer set is imported from `b9-twice-run.mjs`, which discovers it; restating
// it here would be the second registry this file exists to refuse.
//
// WHAT IS NOT CHECKED: whether a wired script runs inside `check` specifically.
// `b4-verdict-check.mjs` (`npm run verdicts`) and `cite-check.mjs`
// (`npm run cites`) report rather than refuse and live under their own scripts
// by design, so "named in some script value" is the honest bound. Tightening it
// to the `check` chain would either redden those two or need an exemption list,
// which is the second copy this gate exists to prevent.
//
// CANARIES — both fired 2026-08-08, in the working tree, before either commit.
// The printed refusals, verbatim:
//
//   1. An unwired script (empty `deployment/scripts/zz-canary.mjs` planted):
//
//      WIRING FAIL — deployment/scripts/zz-canary.mjs is named by no npm script in package.json.
//        A gate nothing runs is not a gate. Wire it into a script (and, if it must refuse before a
//        commit, into the `check` chain), or declare it in not-a-gate.mjs with the reason it cannot
//        refuse anything.
//
//   2. A second definition (`const NOT_A_GATE = ...` pasted into claim-check.mjs):
//
//      WIRING FAIL — deployment/scripts/claim-check.mjs declares its own `const NOT_A_GATE`.
//        The set has exactly one home, not-a-gate.mjs. Two copies agreed by luck once already and
//        fed two different counts; delete this one and import the shared declaration instead.
//
// Usage:
//   node deployment/scripts/gate-wiring.mjs             check
//   node deployment/scripts/gate-wiring.mjs --selfcheck assert-based self-test
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";
import { NOT_A_GATE } from "./not-a-gate.mjs";
import { suiteLayers } from "./b9-twice-run.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SCRIPTS = "deployment/scripts";
const HOME = "not-a-gate.mjs";
const WORKFLOWS = ".github/workflows";
const CI = "check.yml";

// Script names a package.json value invokes FROM THIS FOLDER. The literal
// `deployment/scripts/` prefix is what makes `engine/scripts/…` — a real chain
// entry that is the engine's file, not ours — correctly invisible here.
export const WIRED = /deployment\/scripts\/([a-z0-9-]+\.mjs)/g;

// A declaration of the set, as opposed to a use of it. Anchored to line start
// so that this file's own mention of the pattern is not a declaration.
export const DECLARES = /^\s*(?:export\s+)?const\s+NOT_A_GATE\s*=/m;

// A use of the set that cites its home rather than restating it.
export const IMPORTS = /import\s*\{[^}]*\bNOT_A_GATE\b[^}]*\}\s*from\s*["']\.\/not-a-gate\.mjs["']/;

export const wiredIn = (pkgJson) => new Set([...pkgJson.matchAll(WIRED)].map((m) => m[1]));

// Assertion C's matcher. `layers` is what carries a suite on disk; the workflow
// must install each of them, because `npm run check` runs each of them and a
// missing install reads as a red gate rather than as a missing install.
export function workflowFaults(yaml, layers) {
  // Comment lines are dropped first, and that is not tidiness. This workflow's
  // own prose explains why it installs each layer, in the words `npm run check`
  // — so the first version of this gate was satisfied by a sentence describing
  // the step rather than by the step, and stayed green with the real `run:`
  // line gutted. Found by planting the negative, which is the only way that
  // class of error is ever found.
  const steps = yaml.split("\n").filter((l) => !/^\s*#/.test(l)).join("\n");
  const faults = [];
  if (/^\s*continue-on-error\s*:/m.test(steps))
    faults.push("carries `continue-on-error:` — a step allowed to fail is a job that reports success over a red gate");
  if (!/\bnpm run check\b/.test(steps))
    faults.push("never runs the aggregator `npm run check` — the repo's one green command (SPEC.md §4)");
  for (const layer of layers) {
    if (!new RegExp(`npm ci\\b[^\\n]*--prefix ${layer}\\b`).test(steps))
      faults.push(`never installs the \`${layer}\` layer (\`npm ci --prefix ${layer}\`), whose suite \`npm run check\` runs`);
  }
  return faults;
}

if (process.argv.includes("--selfcheck")) {
  // Both assertions over inline fixtures, each with its negative — a checker
  // proven only on passing input proves nothing.
  const pkg = '{"scripts":{"check:a":"node deployment/scripts/a-one.mjs --selfcheck && node deployment/scripts/a-one.mjs","check:b":"node deployment/scripts/b-two.mjs"}}';
  assert.deepStrictEqual([...wiredIn(pkg)].sort(), ["a-one.mjs", "b-two.mjs"], "a name repeated in one value counts once");
  assert.ok(!wiredIn('{"scripts":{"r":"node engine/scripts/reactive-push-check.mjs"}}').has("reactive-push-check.mjs"),
    "another folder's script is not wiring for ours");
  // Negative A: a script on disk that no npm script names.
  assert.deepStrictEqual(["a-one.mjs", "unwired.mjs"].filter((f) => !wiredIn(pkg).has(f)), ["unwired.mjs"],
    "an unwired script is detected");

  assert.ok(DECLARES.test('const NOT_A_GATE = {\n  "x.mjs": "r",\n};'), "a bare declaration is one");
  assert.ok(DECLARES.test('export const NOT_A_GATE = {};'), "and so is an exported one");
  // Negative B, and the reason DECLARES is line-anchored: this file names the
  // identifier all over its own prose and matchers without declaring it.
  assert.ok(!DECLARES.test('if (f in NOT_A_GATE) return;'), "a use is not a declaration");
  assert.ok(!DECLARES.test('// every consumer imports NOT_A_GATE from one place'), "nor is a mention in prose");
  assert.ok(!DECLARES.test(fs.readFileSync(fileURLToPath(import.meta.url), "utf8")), "nor is this gate's own source");

  assert.ok(IMPORTS.test('import { NOT_A_GATE } from "./not-a-gate.mjs";'), "an import cites the home");
  // Negative: naming the identifier with neither a declaration nor an import.
  assert.ok(!IMPORTS.test('const gates = files.filter((f) => !(f in NOT_A_GATE));'), "a use without an import is not one");

  // Assertion C, over an inline workflow and each of its three negatives.
  const good = "jobs:\n  check:\n    steps:\n      - run: npm ci --prefix engine\n      - run: npm ci --prefix harness\n      - run: npm run check\n";
  assert.deepStrictEqual(workflowFaults(good, ["engine", "harness"]), [], "a workflow installing every suite and running the aggregator is clean");
  assert.strictEqual(workflowFaults(good.replace("- run: npm run check", "- run: echo skipped"), ["engine"]).length, 1,
    "a workflow that never runs the aggregator is caught");
  assert.strictEqual(workflowFaults(good, ["engine", "harness", "app"]).length, 1,
    "a layer that gains a suite the workflow does not install is caught");
  assert.strictEqual(workflowFaults(`${good}        continue-on-error: true\n`, ["engine", "harness"]).length, 1,
    "continue-on-error is caught wherever it sits");
  assert.ok(workflowFaults("continue-on-error: true\nnpm run check\n", []).length === 1, "and at column zero");
  assert.deepStrictEqual(workflowFaults("# continue-on-error is what this comment mentions\n- run: npm run check", []), [],
    "a mention that is not a key is not one");
  // The negative that this gate first failed: prose about a step is not a step.
  assert.strictEqual(workflowFaults("# Every layer, because `npm run check` runs them all\n- run: echo nope\n", []).length, 1,
    "a comment naming the aggregator does not stand in for running it");
  assert.strictEqual(workflowFaults("# npm ci --prefix engine happens somewhere\n- run: npm run check\n", ["engine"]).length, 1,
    "nor for installing a layer");
  assert.ok(suiteLayers(ROOT).length > 0, "the suite-carrying layer set is discovered, not empty");

  console.log("\nselfcheck OK");
  process.exit(0);
}

const pkgJson = fs.readFileSync(path.join(ROOT, "package.json"), "utf8");
const wired = wiredIn(pkgJson);
const onDisk = fs.readdirSync(path.join(ROOT, SCRIPTS)).filter((f) => f.endsWith(".mjs")).sort();
const src = new Map(onDisk.map((f) => [f, fs.readFileSync(path.join(ROOT, SCRIPTS, f), "utf8")]));

const fail = [];

// Assertion A — wiring.
for (const f of onDisk) {
  if (wired.has(f) || f in NOT_A_GATE) continue;
  fail.push(
    `\nWIRING FAIL — ${SCRIPTS}/${f} is named by no npm script in package.json.` +
      `\n  A gate nothing runs is not a gate. Wire it into a script (and, if it must refuse before a` +
      `\n  commit, into the \`check\` chain), or declare it in ${HOME} with the reason it cannot` +
      `\n  refuse anything.`,
  );
}

// Assertion B — one definition, and every other mention cites it.
for (const f of onDisk) {
  const text = src.get(f);
  if (DECLARES.test(text)) {
    if (f !== HOME)
      fail.push(
        `\nWIRING FAIL — ${SCRIPTS}/${f} declares its own \`const NOT_A_GATE\`.` +
          `\n  The set has exactly one home, ${HOME}. Two copies agreed by luck once already and` +
          `\n  fed two different counts; delete this one and import the shared declaration instead.`,
      );
    continue;
  }
  if (f !== HOME && text.includes("NOT_A_GATE") && !IMPORTS.test(text))
    fail.push(
      `\nWIRING FAIL — ${SCRIPTS}/${f} names NOT_A_GATE but neither declares nor imports it.` +
        `\n  Import it from ./${HOME}; a mention that resolves to nothing is how the second copy starts.`,
    );
}
if (!DECLARES.test(src.get(HOME) ?? "")) {
  fail.push(
    `\nWIRING FAIL — ${SCRIPTS}/${HOME} no longer declares \`const NOT_A_GATE\`.` +
      `\n  The one definition must live there. A check that cannot find its home must not pass quietly.`,
  );
}

// Assertion C — the CI job actually runs the chain it is the second reader for.
const ciPath = path.join(ROOT, WORKFLOWS, CI);
const layers = suiteLayers(ROOT);
if (!fs.existsSync(ciPath)) {
  fail.push(
    `\nWIRING FAIL — ${WORKFLOWS}/${CI} does not exist.` +
      `\n  The hook can be skipped with --no-verify and is absent from a fresh clone; CI is the reader that` +
      `\n  is neither. A check that cannot find its workflow must not pass quietly.`,
  );
} else {
  for (const f of workflowFaults(fs.readFileSync(ciPath, "utf8"), layers)) {
    fail.push(
      `\nWIRING FAIL — ${WORKFLOWS}/${CI} ${f}.` +
        `\n  A workflow nobody reads is a green tick over an unrun gate.`,
    );
  }
}

if (fail.length) {
  for (const f of fail) console.log(f);
  process.exit(1);
}

const exempt = onDisk.filter((f) => f in NOT_A_GATE).length;
console.log(
  `\nGATE-WIRING OK — ${onDisk.length - exempt} gate(s) reachable from an npm script, ${exempt} declared not-a-gate,` +
    ` one definition of that set; ${WORKFLOWS}/${CI} runs the aggregator, installs all ${layers.length} suite-carrying` +
    ` layer(s) (${layers.join(", ")}), and allows no step to fail. NOT CHECKED: whether a wired script runs inside` +
    ` \`check\` specifically — two gates report rather than refuse and run under their own scripts by design.`,
);
