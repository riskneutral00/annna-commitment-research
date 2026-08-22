// The probe-coverage gate (2026-08-22 strategy review, F4's gate half).
//
// Why: every scenario "derives from and is refutable against" user-stories/,
// yet the requirements register (PRD.md, RQ-##) and the probe corpus shared
// ZERO referents when this was written — no RQ named a Situation, no Situation
// named an RQ, so the two could drift forever without contradicting each other.
// PRD.md §4.6 is now the tie: every requirement names its Situation anchor or
// declares the probe owed, with what the owed probe must show.
//
// What it checks:
//   1. Every `#### RQ-N:` defined in PRD.md has a §4.6 row, and every row names
//      a defined RQ (no orphans, no phantoms — the gate-coverage shape).
//   2. Every row either declares `owed — <nonempty what>` or names a
//      `Situation-X` whose folder exists under user-stories/Situations/.
// What it cannot check, printed as the honest bound: whether an anchored
// Situation's beat actually exercises the requirement — existence is
// mechanical, aboutness is a reading job (the cross-layer-cite bound, here).
// An `owed` row is a debt this gate keeps visible, not an exemption it grants.
//
// Usage:
//   node deployment/scripts/probe-coverage.mjs             check
//   node deployment/scripts/probe-coverage.mjs --selfcheck assert-based self-test

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

function definedRQs(prd) {
  return [...prd.matchAll(/^#### (RQ-\d+):/gm)].map((m) => m[1]);
}

function anchorRows(prd) {
  // §4.5's "what the specs owe" map also has | RQ-N | rows — only the §4.6
  // probe-anchor section is this gate's domain.
  const section = prd.match(/### 4\.6 Probe anchors[\s\S]*?(?=\n## )/);
  if (!section) return [];
  const rows = [];
  for (const m of section[0].matchAll(/^\| (RQ-\d+) \| ([^|]+) \|$/gm)) rows.push({ rq: m[1], anchor: m[2].trim() });
  return rows;
}

function check(prd, situationExists) {
  const bad = [];
  const defined = definedRQs(prd);
  const rows = anchorRows(prd);
  if (!defined.length) return ["PRD.md defines no #### RQ-N headings — the parsing contract broke, fix this script"];
  if (!rows.length) return ["PRD.md §4.6's anchor table no longer parses — fix this script's contract"];
  const rowFor = new Map(rows.map((r) => [r.rq, r]));
  for (const rq of defined) if (!rowFor.has(rq)) bad.push(`${rq} is defined and has no probe-anchor row (orphan)`);
  for (const r of rows) {
    if (!defined.includes(r.rq)) bad.push(`§4.6 anchors ${r.rq}, which no #### heading defines (phantom)`);
    const owed = r.anchor.match(/^owed — (.+)$/s);
    const situation = r.anchor.match(/Situation-([A-Z0-9]+)/);
    if (owed) {
      if (owed[1].trim().length < 10) bad.push(`${r.rq}'s owed row does not say what the probe must show`);
    } else if (situation) {
      if (!situationExists(`Situation-${situation[1]}`)) bad.push(`${r.rq} anchors Situation-${situation[1]}, which does not exist`);
    } else {
      bad.push(`${r.rq}'s row is neither \`owed — <what>\` nor a Situation anchor: "${r.anchor.slice(0, 60)}"`);
    }
  }
  return bad;
}

if (process.argv.includes("--selfcheck")) {
  const mk = (rows) =>
    `#### RQ-1: a\n#### RQ-2: b\n| RQ-1 | a §4.5-style row outside the section, must be ignored |\n### 4.6 Probe anchors\n${rows}\n## 5. after`;
  const prd = mk("| RQ-1 | owed — a beat where the thing happens |\n| RQ-2 | Situations exercised at Situation-A, the placement beat |");
  const exists = (s) => s === "Situation-A";
  assert.deepStrictEqual(check(prd, exists), [], "a clean register passes, and rows outside §4.6 are ignored");
  assert.ok(check(prd.replace("#### RQ-2: b\n", "#### RQ-2: b\n#### RQ-3: c\n"), exists).some((b) => b.includes("RQ-3")), "an unanchored RQ is an orphan");
  assert.ok(
    check(mk("| RQ-1 | owed — a beat where the thing happens |\n| RQ-2 | Situation-A, the placement beat |\n| RQ-9 | owed — something long enough |"), exists).some((b) => b.includes("phantom")),
    "a phantom row is caught",
  );
  assert.ok(check(prd.replace("Situation-A, the placement beat", "Situation-Z"), exists).some((b) => b.includes("Situation-Z")), "a dead anchor is caught");
  assert.ok(check(prd.replace("owed — a beat where the thing happens", "owed — tbd"), exists).some((b) => b.includes("what the probe must show")), "a contentless owed row is caught");
  console.log("selfcheck OK");
  process.exit(0);
}

const prd = fs.readFileSync(path.join(ROOT, "PRD.md"), "utf8");
const situationExists = (name) => fs.existsSync(path.join(ROOT, "user-stories/Situations", name));
const bad = check(prd, situationExists);
if (bad.length) {
  console.log(`\nPROBE-COVERAGE FAIL — PRD.md §4.6:`);
  for (const b of bad) console.log(`  ${b}`);
  process.exit(1);
}
const rows = anchorRows(prd);
const owed = rows.filter((r) => r.anchor.startsWith("owed")).length;
console.log(
  `PROBE-COVERAGE OK — ${rows.length} requirement(s): ${rows.length - owed} anchored to a Situation, ${owed} declared owed (a debt kept visible, not an exemption). ` +
    `NOT CHECKED: whether an anchored beat actually exercises its requirement — existence is mechanical, aboutness is a reading job.`,
);
