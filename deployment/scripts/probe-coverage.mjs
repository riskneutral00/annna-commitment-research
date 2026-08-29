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
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// ---------------------------------------------------------------------------
// The provenance half (2026-08-29). Two scars, one subject: the provenance
// registers guarded known rows and nothing guarded a NEW one.
//
// (1) HELD-OUT CITATION. FR10 holds Situation E out of v1 and FD-59 re-provenanced
//     six harness rows that had quietly derived from E's on-call roster — "which
//     build gates are forbidden to cite". That correction was a one-time sweep:
//     a new row citing E was caught by nothing, and "a new row's register entry
//     is discipline, not a gate."
//
//     Scope, chosen so the check cannot cry wolf: a BUILD-GATING row only —
//     one tagged `[MUST…]` or `[ENGINE…]`, the classes gate-coverage.mjs treats
//     as gates. `[HELD-OUT]` rows are held-out by definition and must be able to
//     name E. Rows carrying neither (`[honest decline]`, `[SHOULD …]`) are not
//     build gates and may cite E illustratively — engine P2 does exactly that,
//     alongside Situation-B, and it is not the defect FD-59 corrected.
//     A gating row may still cite E if it carries the re-provenance marker the
//     ruling established: the `held-out E's` form already in harness/SCENARIOS.md.
//
//     Zero rows violate this today, so the check is ARMED rather than busy —
//     which is the state a regression guard is supposed to be in.
//
// (2) UNKNOWN REGISTER NAME. user-stories/README.md declares four registers and
//     each probe records one in-file as `**Provenance: <name>**`. Set membership
//     against the declared home, the roster-check shape one level over. A fifth
//     register invented in a probe file reads as vocabulary and is caught here.
//
// What neither can check, and it is the honest bound: whether a register tag is
// TRUE. Existence is mechanical, aboutness is a reading job — the same bound the
// RQ half already prints.
const MARKER = "held-out E's";
const GATING = /^(?:MUST|ENGINE)\b/;

export function registerNames(readme) {
  const m = readme.match(/([A-Za-z]+) registers, recorded per probe[^\n]*\n\n((?:- \*\*[^\n]*\n)+)/);
  if (!m) return null;
  return { word: m[1], names: [...m[2].matchAll(/^- \*\*([a-z-]+)\*\*/gm)].map((x) => x[1]) };
}

// A scenario definition row, with its tag: `- **D12 [MUST / the ladder walk]** …`
export function rows(text) {
  const out = [];
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*-\s*\*\*([A-Z]\d+[a-z]?)\s*\[([^\]]*)\]\*\*(.*)$/);
    if (m) out.push({ id: m[1], tag: m[2], body: m[3] });
  }
  return out;
}

export function heldOutViolations(text, file) {
  return rows(text)
    .filter((r) => GATING.test(r.tag) && /Situation[-\s]E\b/.test(r.body) && !r.body.includes(MARKER))
    .map((r) => `${file} ${r.id} [${r.tag.slice(0, 30)}] cites held-out Situation E with no "${MARKER}" re-provenance marker (FR10, FD-59)`);
}

export function registerTags(text) {
  return [...text.matchAll(/\*\*Provenance: ([a-z-]+)\*\*/g)].map((m) => m[1]);
}

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

  // --- the held-out half, with its negatives ---
  const bare = "- **D12 [MUST / the ladder walk]** Given a ranked roster from Situation-E, the walk proceeds.";
  const marked = `- **D12 [MUST / the ladder walk]** Given a ranked roster that derives from **${MARKER}** on-call roster, the walk proceeds.`;
  assert.strictEqual(heldOutViolations(bare, "f").length, 1, "a build-gating row citing E bare is refused");
  assert.strictEqual(heldOutViolations(marked, "f").length, 0, "the same row carrying FD-59's marker passes");
  assert.strictEqual(heldOutViolations("- **E1 [HELD-OUT]** Situation-E predictions.", "f").length, 0, "a HELD-OUT row may name E — that is what it is for");
  assert.strictEqual(heldOutViolations("- **P2 [honest decline]** ...Situation-E's safe park.", "f").length, 0, "a non-gating row is not a build gate, and engine P2 is the live case");
  assert.strictEqual(heldOutViolations("- **D15 [SHOULD / exhaustion parks]** Situation-E roster.", "f").length, 0, "nor is a SHOULD");
  assert.strictEqual(heldOutViolations("prose about Situation-E outside any row", "f").length, 0, "prose is not a definition row");

  // --- the register half, with its negatives ---
  const readme = "Four registers, recorded per probe so nobody has to reconstruct this later:\n\n- **elicited-blind** — a\n- **elicited-to-design** — b\n- **scripted** — c\n- **held-out** — d\n\nprose after";
  const reg = registerNames(readme);
  assert.deepStrictEqual(reg.names, ["elicited-blind", "elicited-to-design", "scripted", "held-out"]);
  assert.strictEqual(reg.word, "Four", "the declared count word is read too, so the list and its number cannot drift apart");
  assert.deepStrictEqual(registerTags("***Provenance: scripted** (added later)*"), ["scripted"], "an in-file tag parses");
  assert.deepStrictEqual(registerTags("no tag here"), [], "a file with no tag declares nothing");
  assert.ok(!reg.names.includes(registerTags("**Provenance: vibes-based**")[0]), "a register nobody declared is not in the set");
  assert.strictEqual(registerNames("no such declaration"), null, "an unparseable register list is a failure, not an empty set");

  console.log("selfcheck OK");
  process.exit(0);
}

const prd = fs.readFileSync(path.join(ROOT, "PRD.md"), "utf8");
const situationExists = (name) => fs.existsSync(path.join(ROOT, "user-stories/Situations", name));
const bad = check(prd, situationExists);

const tracked = execFileSync("git", ["ls-files", "-z", "*.md"], { cwd: ROOT, encoding: "utf8", maxBuffer: 1 << 28 })
  .split("\0")
  .filter(Boolean);
const readOne = (f) => fs.readFileSync(path.join(ROOT, f), "utf8");

// Check 1 — no build-gating row cites held-out E without FD-59's marker.
const suites = tracked.filter((f) => /(?:SCENARIOS|EVALS)\.md$/.test(f));
let gatingRows = 0;
for (const f of suites) {
  const text = readOne(f);
  gatingRows += rows(text).filter((r) => GATING.test(r.tag)).length;
  bad.push(...heldOutViolations(text, f));
}

// Check 2 — every register tag in use is one the declared home enumerates.
const reg = registerNames(readOne("user-stories/README.md"));
let tagCount = 0;
if (!reg) {
  bad.push(`user-stories/README.md no longer declares its register list in a parseable form (the "registers, recorded per probe" sentence and its bullets)`);
} else {
  if (reg.names.length !== ({ Three: 3, Four: 4, Five: 5, Six: 6 }[reg.word] ?? -1))
    bad.push(`user-stories/README.md says ${reg.word} registers and enumerates ${reg.names.length}`);
  for (const f of tracked.filter((f) => f.startsWith("user-stories/"))) {
    for (const tag of registerTags(readOne(f))) {
      tagCount++;
      if (!reg.names.includes(tag)) bad.push(`${f} records provenance "${tag}", which user-stories/README.md does not declare (declared: ${reg.names.join(", ")})`);
    }
  }
}

if (bad.length) {
  console.log(`\nPROBE-COVERAGE FAIL:`);
  for (const b of bad) console.log(`  ${b}`);
  process.exit(1);
}
const rqRows = anchorRows(prd);
const owed = rqRows.filter((r) => r.anchor.startsWith("owed")).length;
console.log(
  `PROBE-COVERAGE OK — ${rqRows.length} requirement(s): ${rqRows.length - owed} anchored to a Situation, ${owed} declared owed (a debt kept visible, not an exemption); ` +
    `${gatingRows} build-gating scenario row(s), none citing held-out E without FD-59's re-provenance marker; ` +
    `${tagCount} recorded provenance tag(s), every one among the ${reg.names.length} user-stories/README.md declares. ` +
    `NOT CHECKED: whether an anchored beat actually exercises its requirement, or whether a register tag is TRUE — existence is mechanical, aboutness is a reading job.`,
);
