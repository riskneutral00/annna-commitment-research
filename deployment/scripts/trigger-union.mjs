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

// ---------------------------------------------------------------------------
// The second checked pair (2026-08-28) — prose⇄prose this time, on the hook the
// header above left: "each gets this treatment when its second copy exists."
//
// The stored-object read member naming the firing log is enumerated twice, in
// two closed enumerations that must swap cleanly: engine/SPEC.md §5 item 7 and
// harness/INTERFACES.md §1.1. A member named `FiringEvent` in one file and
// anything else in the other is a red, not a warning — under the zero-changes
// swap law the harness cannot construct what the engine does not enumerate.
//
// The extraction is anchored on the entry's *prose*, never on the token itself:
// anchoring on the token would turn a rename in one file into "absent", and the
// gate would report the weaker of the two facts. Anchored on prose, a rename
// reports as divergence and a deletion reports as absence.
const MEMBER_ANCHOR = /`([A-Za-z][A-Za-z0-9_]*)`\s*—\s*the firing log's record by firing id/;

export function readMemberToken(md) {
  const m = md.match(MEMBER_ANCHOR);
  return m ? m[1] : null;
}

export function compareMember(engineMd, harnessMd) {
  const e = readMemberToken(engineMd);
  const h = readMemberToken(harnessMd);
  const bad = [];
  if (!e) bad.push("engine/SPEC.md §5 item 7 carries no firing-log read member — the enumeration lost it, or its entry no longer parses");
  if (!h) bad.push("harness/INTERFACES.md §1.1 carries no firing-log read member — the enumeration lost it, or its entry no longer parses");
  if (e && h && e !== h) bad.push(`the firing-log read member is \`${e}\` in engine/SPEC.md and \`${h}\` in harness/INTERFACES.md — one canonical token, or the swap law is a lie`);
  return bad;
}

// ---------------------------------------------------------------------------
// The third checked pair (2026-09-01, LWR-01 — OBS-1's gate): the Event union
// is printed arm-by-arm in harness/INTERFACES.md §3.3 and carried as TS in
// harness/src/seams.ts. The first two checks compare kind NAMES against SPEC
// §4's prose; they cannot see a renamed kind's twin drifting field-by-field
// (`form-return` vs `returned-form` lived exactly there). Compared BOTH
// directions on the arm set and on each arm's required and optional field sets.
export function ifaceArms(md) {
  const sec = md.split("### 3.3")[1]?.split("### 3.4")[0];
  if (!sec) return null;
  const arms = new Map();
  for (const m of sec.matchAll(/\{kind: ([a-z-]+), ([^}]+)\}/g)) {
    const req = new Set(["kind"]);
    const opt = new Set();
    for (const f of m[2].split(",").map((s) => s.trim()).filter(Boolean))
      f.endsWith("?") ? opt.add(f.slice(0, -1)) : req.add(f);
    arms.set(m[1], { req, opt });
  }
  return arms.size ? arms : null;
}
export function codeArms(code) {
  const block = code.match(/export type Event =([\s\S]*?\});\n/);
  if (!block) return null;
  const arms = new Map();
  for (const m of block[1].matchAll(/\{ kind: "([a-z-]+)"([^}]*)\}/g)) {
    const req = new Set(["kind"]);
    const opt = new Set();
    for (const f of m[2].matchAll(/(\w+)(\?)?:/g)) (f[2] ? opt : req).add(f[1]);
    arms.set(m[1], { req, opt });
  }
  return arms.size ? arms : null;
}
export function compareArms(md, code) {
  const a = ifaceArms(md);
  const c = codeArms(code);
  if (!a) return ["harness/INTERFACES.md §3.3's printed Event arms no longer parse — fix this script's contract"];
  if (!c) return ["harness/src/seams.ts's Event union no longer parses — fix this script's contract"];
  const bad = [];
  for (const k of a.keys()) if (!c.has(k)) bad.push(`printed arm "${k}" has no seams.ts Event member`);
  for (const k of c.keys()) if (!a.has(k)) bad.push(`seams.ts Event member "${k}" has no printed §3.3 arm`);
  for (const k of a.keys()) {
    if (!c.has(k)) continue;
    const [ar, cr] = [a.get(k), c.get(k)];
    for (const f of ar.req) if (!cr.req.has(f)) bad.push(`arm "${k}": required field "${f}" is printed in §3.3 but missing from seams.ts`);
    for (const f of cr.req) if (!ar.req.has(f)) bad.push(`arm "${k}": required field "${f}" is in seams.ts but not printed in §3.3`);
    for (const f of ar.opt) if (!cr.opt.has(f)) bad.push(`arm "${k}": optional field "${f}" is printed in §3.3 but not optional in seams.ts`);
    for (const f of cr.opt) if (!ar.opt.has(f)) bad.push(`arm "${k}": optional field "${f}" is optional in seams.ts but not printed as one in §3.3`);
  }
  return bad;
}

const SPEC_FIXTURE = `the loop may fire on a *sale*, a *hold expiry*, a *decline*, a *returned form*, a *clock time*, or a *delivery report* — not only a human turn. **Six sources**, and`;
const CODE_FIXTURE = `export type TriggerEvent = { kind: "sale" | "hold-expiry" | "decline" | "returned-form" | "clock" | "delivery-report"; at: number };`;
const ENGINE_MEMBER_FIXTURE = "the template-bundle projection (§1.7a), and a `FiringEvent` — the firing log's record by firing id, both parts (§1.16).";
const HARNESS_MEMBER_FIXTURE = "the §2.1 relevant-slice assembly, and a `FiringEvent` — the firing log's record by firing id, both parts (`SPEC.md §3.14`).";

const IFACE_ARMS_FIXTURE = `### 3.3 x
{kind: returned-form, at, token, reply}
| {kind: clock, at, registration_ref, registration_kind?}
### 3.4 y`;
const CODE_ARMS_FIXTURE = `export type Event =
  | { kind: "returned-form"; at: number; token: string; reply: unknown }
  | { kind: "clock"; at: number; registration_ref: CommitmentRef; registration_kind?: RegistrationKind };
`;

if (process.argv.includes("--selfcheck")) {
  assert.deepStrictEqual(compare(SPEC_FIXTURE, CODE_FIXTURE), [], "the matched pair passes");
  const five = CODE_FIXTURE.replace(' | "delivery-report"', "");
  assert.ok(compare(SPEC_FIXTURE, five).length > 0, "the historical five-member drift is caught");
  const extra = CODE_FIXTURE.replace('"delivery-report"', '"delivery-report" | "webhook"');
  assert.ok(compare(SPEC_FIXTURE, extra).some((b) => b.includes("webhook")), "an invented seventh member is caught");

  assert.deepStrictEqual(compareMember(ENGINE_MEMBER_FIXTURE, HARNESS_MEMBER_FIXTURE), [], "the matched read-member pair passes");
  const diverged = HARNESS_MEMBER_FIXTURE.replace("`FiringEvent`", "`FiringRecord`");
  assert.ok(
    compareMember(ENGINE_MEMBER_FIXTURE, diverged).some((b) => b.includes("FiringRecord")),
    "a divergent spelling is caught as divergence, not as absence",
  );
  assert.ok(compareMember(ENGINE_MEMBER_FIXTURE, "no such member here").some((b) => b.includes("harness/INTERFACES.md")), "absence in the harness enumeration is caught");
  assert.ok(compareMember("no such member here", HARNESS_MEMBER_FIXTURE).some((b) => b.includes("engine/SPEC.md")), "absence in the engine enumeration is caught");

  assert.deepStrictEqual(compareArms(IFACE_ARMS_FIXTURE, CODE_ARMS_FIXTURE), [], "the matched arm pair passes");
  const renamed = IFACE_ARMS_FIXTURE.replace("returned-form", "form-return");
  assert.ok(compareArms(renamed, CODE_ARMS_FIXTURE).some((b) => b.includes("form-return")) &&
    compareArms(renamed, CODE_ARMS_FIXTURE).some((b) => b.includes("returned-form")), "a renamed kind is caught from both directions");
  const dropped = CODE_ARMS_FIXTURE.replace(" token: string;", "");
  assert.ok(compareArms(IFACE_ARMS_FIXTURE, dropped).some((b) => b.includes('"token"') && b.includes("missing from seams.ts")), "a missing field is caught");
  const invented = CODE_ARMS_FIXTURE.replace("reply: unknown }", "reply: unknown; extra: number }");
  assert.ok(compareArms(IFACE_ARMS_FIXTURE, invented).some((b) => b.includes('"extra"') && b.includes("not printed")), "an invented field is caught");
  const optDrift = CODE_ARMS_FIXTURE.replace("registration_kind?:", "registration_kind:");
  assert.ok(compareArms(IFACE_ARMS_FIXTURE, optDrift).length > 0, "an optionality drift is caught");
  console.log("selfcheck OK");
  process.exit(0);
}

const spec = fs.readFileSync(path.join(ROOT, "harness/SPEC.md"), "utf8");
const code = fs.readFileSync(path.join(ROOT, "harness/src/index.ts"), "utf8");
const engineSpec = fs.readFileSync(path.join(ROOT, "engine/SPEC.md"), "utf8");
const harnessIface = fs.readFileSync(path.join(ROOT, "harness/INTERFACES.md"), "utf8");
const seamsCode = fs.readFileSync(path.join(ROOT, "harness/src/seams.ts"), "utf8");
const bad = [...compare(spec, code), ...compareMember(engineSpec, harnessIface), ...compareArms(harnessIface, seamsCode)];
if (bad.length) {
  console.log(`\nTRIGGER-UNION FAIL:`);
  for (const b of bad) console.log(`  ${b}`);
  process.exit(1);
}
const n = unionMembers(code).length;
console.log(
  `TRIGGER-UNION OK — ${n} trigger sources, spec and union in agreement; ` +
    `the \`${readMemberToken(engineSpec)}\` read member is one canonical token in engine/SPEC.md §5 item 7 and harness/INTERFACES.md §1.1; ` +
    `the §3.3 printed Event arms and seams.ts's union agree on ${ifaceArms(harnessIface).size} arms' kinds and field sets, both directions. ` +
    `NOT CHECKED: other closed enums stated twice — each gets this treatment when its second copy exists.`,
);
