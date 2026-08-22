// The spec-enumeration ⇄ TS-union gate (2026-08-22 strategy review, build M4).
//
// Why: harness/SPEC.md §4 enumerates the trigger sources ("Six sources...") and
// harness/src/index.ts carries the same set as a TS union — and the two had
// already drifted when this gate was written: the delivery report joined the
// spec 2026-08-21 while the union sat at five, inside a BUILD step marked
// CLOSED. A closed enum stated twice is claim-check's problem shape one level
// down: two copies that are never compared can both look right.
//
// What it checks: the count the spec states ("Six sources") equals the union's
// member count, and the two sets correspond — each union member, hyphens read
// as spaces, appears in the spec's italicized source list, and each italicized
// source contains some union member. Set equality up to naming, not a mapping
// table (a mapping table would be a third copy).
//
// Usage:
//   node deployment/scripts/trigger-union.mjs             check
//   node deployment/scripts/trigger-union.mjs --selfcheck assert-based self-test

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10 };

// Spec side: the §4 sentence "the loop may fire on a *sale*, a *hold expiry*,
// ... — not only a human turn" plus the "<Word> sources" count that follows.
function specSources(spec) {
  const sentence = spec.match(/the loop may fire on ([^\n]*?) — not only a human turn/);
  if (!sentence) return null;
  const sources = [...sentence[1].matchAll(/\*([^*]+)\*/g)].map((m) => m[1].toLowerCase());
  const count = spec.match(/\*\*(\w+) sources/i);
  return { sources, declared: count ? WORDS[count[1].toLowerCase()] : undefined };
}

// Code side: the TriggerEvent kind union.
function unionMembers(code) {
  const m = code.match(/TriggerEvent = \{ kind: ([^;]+); at: number \}/);
  if (!m) return null;
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]);
}

function compare(spec, code) {
  const s = specSources(spec);
  const u = unionMembers(code);
  const bad = [];
  if (!s) return ["harness/SPEC.md §4's source sentence no longer parses — fix this script's contract"];
  if (!u) return ["harness/src/index.ts's TriggerEvent union no longer parses — fix this script's contract"];
  if (s.declared !== undefined && s.declared !== s.sources.length)
    bad.push(`SPEC declares ${s.declared} sources but italicizes ${s.sources.length}`);
  if (s.sources.length !== u.length) bad.push(`SPEC enumerates ${s.sources.length} source(s), the union carries ${u.length}`);
  for (const m of u) {
    const spaced = m.replace(/-/g, " ");
    if (!s.sources.some((src) => src.includes(spaced) || spaced.includes(src.split(" ")[0])))
      bad.push(`union member "${m}" matches no SPEC source`);
  }
  for (const src of s.sources) {
    if (!u.some((m) => src.includes(m.replace(/-/g, " ")) || m.replace(/-/g, " ").includes(src.split(" ")[0])))
      bad.push(`SPEC source "${src}" matches no union member`);
  }
  return bad;
}

const SPEC_FIXTURE = `the loop may fire on a *sale*, a *hold expiry*, a *decline*, a *returned form*, a *clock time*, or a *delivery report* — not only a human turn. **Six sources**, and`;
const CODE_FIXTURE = `export type TriggerEvent = { kind: "sale" | "hold-expiry" | "decline" | "returned-form" | "clock" | "delivery-report"; at: number };`;

if (process.argv.includes("--selfcheck")) {
  assert.deepStrictEqual(compare(SPEC_FIXTURE, CODE_FIXTURE), [], "the matched pair passes");
  const five = CODE_FIXTURE.replace(' | "delivery-report"', "");
  assert.ok(compare(SPEC_FIXTURE, five).length > 0, "the historical five-member drift is caught");
  const extra = CODE_FIXTURE.replace('"delivery-report"', '"delivery-report" | "webhook"');
  assert.ok(compare(SPEC_FIXTURE, extra).some((b) => b.includes("webhook")), "an invented seventh member is caught");
  console.log("selfcheck OK");
  process.exit(0);
}

const spec = fs.readFileSync(path.join(ROOT, "harness/SPEC.md"), "utf8");
const code = fs.readFileSync(path.join(ROOT, "harness/src/index.ts"), "utf8");
const bad = compare(spec, code);
if (bad.length) {
  console.log(`\nTRIGGER-UNION FAIL — harness/SPEC.md §4 vs harness/src/index.ts:`);
  for (const b of bad) console.log(`  ${b}`);
  process.exit(1);
}
const n = unionMembers(code).length;
console.log(
  `TRIGGER-UNION OK — ${n} trigger sources, spec and union in agreement. ` +
    `NOT CHECKED: other closed enums stated in both prose and types — each gets this treatment when its second copy exists.`,
);
