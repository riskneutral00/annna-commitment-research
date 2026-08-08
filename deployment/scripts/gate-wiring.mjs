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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SCRIPTS = "deployment/scripts";
const HOME = "not-a-gate.mjs";

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

if (fail.length) {
  for (const f of fail) console.log(f);
  process.exit(1);
}

const exempt = onDisk.filter((f) => f in NOT_A_GATE).length;
console.log(
  `\nGATE-WIRING OK — ${onDisk.length - exempt} gate(s) reachable from an npm script, ${exempt} declared not-a-gate,` +
    ` one definition of that set. NOT CHECKED: whether a wired script runs inside \`check\` specifically —` +
    ` two gates report rather than refuse and run under their own scripts by design.`,
);
