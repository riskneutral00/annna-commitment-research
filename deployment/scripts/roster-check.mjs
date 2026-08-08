// ROSTER-CHECK — every gate script is described where a reader looks for it,
// and every script the roster describes exists. Set equality, both directions.
//
// Why this and not a count: `claim-check.mjs` already asserts that the NUMBER
// in `AGENTS.md` equals the number of scripts on disk, and it was green on
// 2026-08-08 while `b4-verdict-check.mjs` — a real gate — appeared nowhere in
// the roster at all. A count and a roster that are never compared TO EACH OTHER
// can both be internally consistent and still hide a gate nobody documented.
//
// WHAT IS NOT CHECKED: the order. `package.json`'s check chain is the executable
// order and therefore the only copy that cannot go stale; the roster's job is
// WHY each gate exists, not WHEN it runs. The roster used to claim an order and
// the claim was false in two places, so the claim was deleted rather than gated.
// Do not add an order check here — add it to the chain, which already has one.
//
// Usage:
//   node deployment/scripts/roster-check.mjs             check
//   node deployment/scripts/roster-check.mjs --selfcheck assert-based self-test
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";
// Not gates, and deliberately unlisted — declared once, in `not-a-gate.mjs`,
// with a reason per entry. This file used to carry its own copy while
// `claim-check.mjs` carried another; `gate-wiring.mjs` now asserts there is
// only the one.
import { NOT_A_GATE } from "./not-a-gate.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SCRIPTS = "deployment/scripts";
const ROSTER = "deployment/README.md";
const HEADING = "## The one green command";

// The roster section: this heading to the next `## `. Shared with the selfcheck.
export function rosterSection(text) {
  const start = text.indexOf(HEADING);
  if (start === -1) return null;
  const rest = text.slice(start + HEADING.length);
  const end = rest.indexOf("\n## ");
  return end === -1 ? rest : rest.slice(0, end);
}

// Script names the roster presents as living in THIS folder. A name carrying a
// path somewhere else — the roster legitimately describes
// `../engine/scripts/reactive-push-check.mjs`, which runs in the chain but is
// the engine's file — is neither documented-here nor a phantom; it is a
// cross-reference, and this gate has no opinion about it.
const MENTION = /(^|[^a-z0-9_/-])((?:[.a-z0-9_-]+\/)*)([a-z0-9-]+\.mjs)/g;
const OURS = new Set(["", "scripts/", "deployment/scripts/"]);

export const namedIn = (section) =>
  new Set([...section.matchAll(MENTION)].filter((m) => OURS.has(m[2])).map((m) => m[3]));

if (process.argv.includes("--selfcheck")) {
  const doc = [
    "# T", "intro", HEADING,
    "- `scripts/a-one.mjs` — does a thing",
    "- `b_two.mjs` — an underscore name is not one of ours",
    "- `../engine/scripts/elsewhere.mjs` — another folder's gate",
    "## Next",
    "- `c-three.mjs`",
  ].join("\n");
  const section = rosterSection(doc);
  assert.ok(section.includes("a-one.mjs"), "the section starts at its heading");
  assert.ok(!section.includes("c-three.mjs"), "and stops at the next `## `");
  assert.deepStrictEqual([...namedIn(section)].sort(), ["a-one.mjs"],
    "a partial match inside another name, and another folder's script, are both ignored");
  assert.strictEqual(rosterSection("# no such heading"), null, "a missing section is not an empty section");
  // The negative case: a script on disk that the roster never mentions.
  const onDisk = new Set(["a-one.mjs", "undocumented.mjs"]);
  const missing = [...onDisk].filter((f) => !namedIn(section).has(f));
  assert.deepStrictEqual(missing, ["undocumented.mjs"], "an undocumented gate is detected");
  console.log("\nselfcheck OK");
  process.exit(0);
}

const section = rosterSection(fs.readFileSync(path.join(ROOT, ROSTER), "utf8"));
if (section === null) {
  console.log(`\nROSTER FAIL — ${ROSTER} no longer carries a "${HEADING}" section.`);
  console.log(`  Restore it or delete this gate; a check that cannot find its roster must not pass quietly.`);
  process.exit(1);
}

const named = namedIn(section);
const onDisk = fs.readdirSync(path.join(ROOT, SCRIPTS)).filter((f) => f.endsWith(".mjs"));

const undocumented = onDisk.filter((f) => !named.has(f) && !(f in NOT_A_GATE));
const phantom = [...named].filter((f) => !onDisk.includes(f));
const wrongly = onDisk.filter((f) => named.has(f) && f in NOT_A_GATE);

for (const f of undocumented) {
  console.log(`\nROSTER FAIL — ${SCRIPTS}/${f} exists and ${ROSTER} never names it.`);
  console.log(`  A gate nobody documented is a gate nobody knows to keep. Describe it, or declare it`);
  console.log(`  in not-a-gate.mjs with the reason it cannot refuse anything.`);
}
for (const f of phantom) {
  console.log(`\nROSTER FAIL — ${ROSTER} describes \`${f}\`, which does not exist in ${SCRIPTS}/.`);
}
for (const f of wrongly) {
  console.log(`\nROSTER FAIL — \`${f}\` is declared NOT_A_GATE (${NOT_A_GATE[f]}) but the roster lists it as one.`);
}
if (undocumented.length || phantom.length || wrongly.length) process.exit(1);

const gates = onDisk.length - Object.keys(NOT_A_GATE).filter((f) => onDisk.includes(f)).length;
console.log(`\nROSTER OK — ${gates} gate(s) on disk, each described in ${ROSTER}; nothing described that is not there`);
