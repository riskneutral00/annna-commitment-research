// S1 of the 2026-08-22 strategy review — the async seam law's gate
// (harness/INTERFACES.md §1, "Every seam call is asynchronous").
//
// Why a gate and not just the fix: the seam interfaces were written
// value-returning against neighbours that are all async in practice, and the
// swap law (Q3, zero harness changes at the swap) forbids correcting the
// calling convention at the exact moment the first real adapter needs it. The
// fix was cheap the day it landed; this script keeps a later edit — a helper
// method added sync, a new seam verb pasted from old code — from silently
// reintroducing the shape the swap cannot absorb.
//
// What it checks, mechanically: in harness/src/seams.ts, every method of every
// exported `interface *Seam` returns `Promise<...>`, and the Clock interface
// carries the promise twin `sleepUntil(...): Promise<void>` while `now`/`step`
// stay synchronous (stepped time is the suite's determinism; a Promise-returning
// `step` would be an invitation to await wall time).
//
// What it cannot check: that the LOOP actually awaits in the order the three
// ordering laws require (fire-time re-verify, the ladder walk, check-work) —
// that is the suite's job, over behaviour. This bound is printed on every run.
//
// Usage:
//   node deployment/scripts/seam-async.mjs             check
//   node deployment/scripts/seam-async.mjs --selfcheck assert-based self-test

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SEAMS = "harness/src/seams.ts";

// Pull each `export interface Name { ... }` block and its method lines.
function interfaces(src) {
  const out = {};
  const re = /export interface (\w+)\s*\{([\s\S]*?)\n\}/g;
  for (const m of src.matchAll(re)) {
    const methods = [];
    // A method line: `name(args): ReturnType;` — possibly wrapped; strip comments first.
    const body = m[2].replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/[^\n]*/g, "");
    const mre = /(\w+)\s*\(([^)]*)\)\s*:\s*([^;]+);/g;
    for (const mm of body.matchAll(mre)) {
      methods.push({ name: mm[1], returns: mm[3].trim() });
    }
    out[m[1]] = methods;
  }
  return out;
}

function violations(src) {
  const ifaces = interfaces(src);
  const bad = [];
  for (const [name, methods] of Object.entries(ifaces)) {
    if (!methods.length) bad.push(`${name}: no parseable methods — the parsing contract broke, fix this script`);
    for (const m of methods) {
      if (name.endsWith("Seam")) {
        if (!/^Promise</.test(m.returns)) bad.push(`${name}.${m.name} returns ${m.returns} — every seam call is asynchronous`);
      } else if (name === "Clock") {
        if (m.name === "sleepUntil" && !/^Promise<void>/.test(m.returns)) bad.push(`Clock.sleepUntil returns ${m.returns} — the twin must be Promise<void>`);
        if ((m.name === "now" || m.name === "step") && /^Promise</.test(m.returns))
          bad.push(`Clock.${m.name} returns ${m.returns} — stepped time stays synchronous`);
      }
    }
  }
  const clock = ifaces.Clock ?? [];
  if (!clock.some((m) => m.name === "sleepUntil")) bad.push(`Clock has no sleepUntil — the async law's promise twin is missing`);
  return bad;
}

if (process.argv.includes("--selfcheck")) {
  const good = `export interface AsSeam {\n  a(x: unknown): Promise<void>;\n}\nexport interface Clock {\n  now(): number;\n  step(ms: number): void;\n  sleepUntil(t: number): Promise<void>;\n}`;
  assert.deepStrictEqual(violations(good), [], "a compliant file has no violations");
  const sync = good.replace("Promise<void>;\n}\nexport interface Clock", "void;\n}\nexport interface Clock");
  assert.ok(violations(sync).some((v) => v.includes("every seam call is asynchronous")), "a sync seam method is caught");
  const noTwin = good.replace("  sleepUntil(t: number): Promise<void>;\n", "");
  assert.ok(violations(noTwin).some((v) => v.includes("no sleepUntil")), "a missing twin is caught");
  const asyncStep = good.replace("step(ms: number): void", "step(ms: number): Promise<void>");
  assert.ok(violations(asyncStep).some((v) => v.includes("stays synchronous")), "an async step is caught");
  console.log("selfcheck OK");
  process.exit(0);
}

const src = fs.readFileSync(path.join(ROOT, SEAMS), "utf8");
const bad = violations(src);
if (bad.length) {
  console.log(`\nSEAM-ASYNC FAIL — ${SEAMS}:`);
  for (const b of bad) console.log(`  ${b}`);
  process.exit(1);
}
const count = Object.entries(interfaces(src))
  .filter(([n]) => n.endsWith("Seam"))
  .reduce((n, [, ms]) => n + ms.length, 0);
console.log(
  `SEAM-ASYNC OK — ${count} seam method(s) Promise-returning; Clock carries sleepUntil and keeps now/step synchronous. ` +
    `NOT CHECKED: that the loop awaits in the order the three ordering laws require — that is the suite's job, over behaviour.`,
);
