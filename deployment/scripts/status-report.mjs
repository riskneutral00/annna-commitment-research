// Status report — generates the build-status block instead of writing it by hand.
//
// Why this exists: a hand-written status block carried four separate errors
// within a day of being written (wrong step closed, wrong step credited with
// another step's content, a layer called "not started" that had a green suite).
// The markers it reads already exist in a consistent form across every layer,
// so the block is derivable and a derived block cannot drift from the files.
//
// It reads only. It writes nothing, anywhere.
//
// Usage:
//   node deployment/scripts/status-report.mjs             report over the repo
//   node deployment/scripts/status-report.mjs <root>      report over another tree
//   node deployment/scripts/status-report.mjs --selfcheck assert-based self-test
//
// Parsing contract (verified against all seven BUILD.md files 2026-08-08):
//   step heading:  `## Step <n> — <title>`   (em-dash U+2014)
//   step body:     every line up to the next `## ` heading
//   state, in this order — the order matters, "NOT CLOSED" contains "CLOSED":
//     body has `**NOT CLOSED` -> NOT CLOSED · `**CLOSED` -> CLOSED ·
//     `**FROZEN` -> FROZEN · otherwise -> open
//   The `**` is load-bearing: it is how a step's own status marker is written,
//   and it keeps prose that merely mentions a word from being read as a marker.
//
//   A freeze covers a RANGE of steps, and is declared once at file level:
//     `**FROZEN <date> — Steps <n>–<m>`   anywhere outside a step's own body,
//   which is where a freeze is actually written — it is one decision about
//   several steps, and restating it in each step's body would be the same rule
//   in five homes (FR13). A step's own `**FROZEN` marker still works and wins.
//   An explicitly CLOSED or NOT CLOSED step is never overridden by a range: a
//   closed step is finished, not frozen.
//
//   This half was added 2026-08-08 after the first version shipped with the
//   `**FROZEN` branch as dead code — eleven frozen steps reported `open`,
//   because every real freeze in the corpus is written as a range and none was
//   written inside a step body. The lesson is in the selfcheck: the contract is
//   asserted against the form the corpus actually uses, not the form that was
//   convenient to parse.

//   NOTES.md open items — a second, smaller contract, added 2026-08-23:
//     `## Still open — <title>`   (em-dash, same as above)
//   AGENTS.md defines NOTES.md as the corpus's backlog scratchpad ("anything
//   still open"), and this is the form those sections are written in. They are
//   printed because a backlog nobody is pointed at is a backlog nobody reads:
//   two of them sat unmentioned for a fortnight, and the founder-wants queue
//   opened the same day this was added would have inherited exactly that fate.
//   A title beginning `the founder` marks a captured founder want — a feature
//   asked for, deliberately unplanned, waiting on a planning session.

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LAYERS = ["deployment", "harness", "engine", "app", "model", "security", "marketplace"];
const HEADING = /^## Step (\d+) — (.*)$/;
const OPEN_ITEM = /^## Still open — (.*)$/;

// --- the NOTES contract, made refusable 2026-08-29 (L-220) ---
//
// The scar, confirmed on all three counts: this report matched only the exact
// `## Still open — ` em-dash form and existsSync-SKIPPED a missing file, so a
// malformed heading or a deleted NOTES file went silent-green — and a founder
// want sat unmentioned for a fortnight. A report that cannot be wrong out loud
// is not a gate.
//
// The declared set is read from AGENTS.md's own deviations sentence rather than
// hardcoded here. A hardcoded list would red the day a fold lands and force a
// code commit to chase a spec change; reading the declaration means the fold's
// own AGENTS.md edit updates this gate — and a fold that deletes the file
// WITHOUT editing that sentence now reds, which is exactly the survivor class
// AGENTS.md's standing discipline names.
//
// Scope, stated because it is a real bound: PACKAGE directories only — the ones
// carrying a tracked SPEC.md, which is the set the deviations sentence is about.
// `PR/NOTES.md` is not in a package and is not governed by that sentence.
//
// Zero open items stays legal: a declared file with no `## Still open — `
// section passes and reports 0. What is illegal is the file being ABSENT while
// AGENTS.md says it is there.
const DECLARES_NOTES = /((?:`[a-z]+\/`(?:,| and)? ?)+) carry `NOTES\.md`/;

export function declaredNotes(agents) {
  const m = agents.match(DECLARES_NOTES);
  return m && [...m[1].matchAll(/`([a-z]+)\/`/g)].map((x) => x[1]);
}

// A heading line that means to be an open item but is not the contract. Prose
// mentioning "Still open" mid-sentence is not a heading and is not a near-miss.
export function malformedHeadings(text) {
  return text
    .split("\n")
    .filter((l) => l.startsWith("#") && /Still open/.test(l) && !OPEN_ITEM.test(l));
}

function stateOf(body) {
  // A range declaration is a statement about other steps that happens to sit in
  // this one's body — markdown has no way to write it "between" steps. Strip it
  // before reading this step's own marker, or the step that merely *carries*
  // the freeze notice reads as frozen itself.
  const own = body.replace(FREEZE, "");
  if (own.includes("**NOT CLOSED")) return "NOT CLOSED";
  if (own.includes("**CLOSED")) return "CLOSED";
  if (own.includes("**FROZEN")) return "FROZEN";
  return "open";
}

// Every `**FROZEN … Steps n–m` declaration in the file, as inclusive ranges.
// The dash class covers en-dash, em-dash and hyphen, because all three are
// written in this corpus and none of them is the reader's problem.
const FREEZE = /\*\*FROZEN\b[^*\n]*?\bSteps? (\d+)\s*[–—-]\s*(\d+)/g;

function frozenRange(text) {
  const spans = [...text.matchAll(FREEZE)].map((m) => [+m[1], +m[2]]);
  return (n) => spans.some(([lo, hi]) => n >= lo && n <= hi);
}

// A step body may carry a `**Precondition**` marker naming ruling IDs (the
// FD-42 form: "**Precondition** *(date)*: FD-42's drafted class must be
// ratified ... before this step"). Added 2026-08-22: the roadmap's "only
// remaining founder act" claim was false by the corpus's own text — two BUILD
// steps carried a day-two-blocking precondition no status surface showed. The
// resolver reads the marker, verifies each named ruling EXISTS in RULINGS.md
// (a precondition naming a ruling that isn't there is a broken citation and
// fails the run — the one refusal in this otherwise-reporting script), and
// prints the step as BLOCKED on those IDs. Whether the ruling has since been
// ratified is not machine-readable; the marker's amendment or removal is the
// mechanical arrival point, which is exactly what the two markers say.
function preconditions(body) {
  const ids = new Set();
  for (const line of body.split("\n")) {
    const at = line.indexOf("**Precondition**");
    if (at === -1) continue;
    // Only what follows the marker on its line: a long bullet may mention other
    // rulings BEFORE the marker (app/BUILD.md Step 1 does), and those are
    // history, not conditions.
    for (const m of line.slice(at).matchAll(/\bF[DR]-?\d+\b/g)) ids.add(m[0]);
  }
  return [...ids];
}

// Steps in file order, each with the body that runs up to the next `## ` heading.
function steps(text) {
  const lines = text.split("\n");
  const out = [];
  let cur = null;
  for (const line of lines) {
    const m = line.match(HEADING);
    if (m) {
      cur = { n: +m[1], title: m[2].trim(), body: [] };
      out.push(cur);
    } else if (line.startsWith("## ")) {
      cur = null; // a non-step heading ends the previous step's body
    } else if (cur) {
      cur.body.push(line);
    }
  }
  const isFrozen = frozenRange(text);
  return out.map((s) => {
    const body = s.body.join("\n");
    const state = stateOf(body);
    // A range freezes only what has not already declared itself finished.
    return {
      n: s.n,
      title: s.title,
      state: state === "open" && isFrozen(s.n) ? "FROZEN" : state,
      blockedOn: preconditions(body),
    };
  });
}

// A NOTES.md open item, with the founder-want flag the heading itself carries.
function openItems(text) {
  return text
    .split("\n")
    .map((line) => line.match(OPEN_ITEM))
    .filter(Boolean)
    .map((m) => {
      const title = m[1].trim();
      return { title, want: /^the founder\b/i.test(title) };
    });
}

function selfcheck() {
  assert.deepStrictEqual(
    openItems(
      [
        "## Still open — the founder wants a routines page (2026-08-23)",
        "## Still open — perceived latency on the write path (2026-08-08)",
        "### Still open — a deeper heading is not an open item",
        "prose mentioning ## Still open — inline must not match",
      ].join("\n"),
    ),
    [
      { title: "the founder wants a routines page (2026-08-23)", want: true },
      { title: "perceived latency on the write path (2026-08-08)", want: false },
    ],
  );

  // --- the NOTES contract, with its negatives ---
  const sentence = "Deviations: `model/` uses `EVALS.md` · `app/` and `deployment/` carry `NOTES.md` · `deployment/` is a process spec.";
  assert.deepStrictEqual(declaredNotes(sentence), ["app", "deployment"], "the declaration parses out of the deviations sentence");
  assert.deepStrictEqual(declaredNotes("`harness/`, `app/`, `marketplace/` and `deployment/` carry `NOTES.md`"), ["harness", "app", "marketplace", "deployment"], "and it parses a longer list, so a fold shrinking it needs no code change");
  assert.strictEqual(declaredNotes("AGENTS.md with no such sentence"), null, "an unparseable declaration is a failure, never an empty set");

  assert.deepStrictEqual(malformedHeadings("## Still open — a real one (2026-01-01)"), [], "the contract form is not a near-miss");
  assert.deepStrictEqual(malformedHeadings("## Still open"), ["## Still open"], "a BARE heading is a near-miss — the live deployment/NOTES.md case");
  assert.deepStrictEqual(malformedHeadings("## Still open - hyphen"), ["## Still open - hyphen"], "a hyphen is not an em-dash");
  assert.deepStrictEqual(malformedHeadings("## Still open – en-dash"), ["## Still open – en-dash"], "and neither is an en-dash");
  assert.deepStrictEqual(malformedHeadings("### Still open — too deep"), ["### Still open — too deep"], "a deeper heading is skipped by the reader, so it is a near-miss too");
  assert.deepStrictEqual(malformedHeadings("- prose saying Still open: three things"), [], "prose is not a heading and must not red");
  assert.deepStrictEqual(malformedHeadings("## Nothing open at all"), [], "an unrelated heading is not one either");

  const parsed = steps(
    [
      "## Step 0 — The spec/code boundary",
      "**CLOSED 2026-08-08.** it holds",
      "## Step 1 — Landing law",
      "**NOT CLOSED 2026-08-08 —** waiting",
      "## Step 2 — The rung ladder",
      "nothing declared here",
      "## Step 3 — Frozen work",
      "**FROZEN 2026-08-08 —** resumes later",
      "## Guardrails",
      "**CLOSED** — prose after a non-step heading must not reach Step 3",
    ].join("\n"),
  );
  assert.deepStrictEqual(
    parsed,
    [
      { n: 0, title: "The spec/code boundary", state: "CLOSED", blockedOn: [] },
      { n: 1, title: "Landing law", state: "NOT CLOSED", blockedOn: [] },
      { n: 2, title: "The rung ladder", state: "open", blockedOn: [] },
      { n: 3, title: "Frozen work", state: "FROZEN", blockedOn: [] },
    ],
    "number, title and all four states parse",
  );

  // The precondition resolver, against the marker form the corpus writes
  // (harness/BUILD.md Step 2, app/BUILD.md Step 1 — the FD-42 pair).
  const pre = steps(
    [
      "## Step 2 — The tool contract",
      "- **Precondition** *(2026-08-22)*: FD-42's drafted `display.settings` class must be **ratified (verb named) or reversed** before this step's signatures freeze.",
      "- other work",
      "## Step 3 — Unblocked",
      "prose mentioning FD-42 without a marker",
    ].join("\n"),
  );
  assert.deepStrictEqual(pre[0].blockedOn, ["FD-42"], "a Precondition marker's ruling IDs are read");
  assert.deepStrictEqual(pre[1].blockedOn, [], "a bare mention outside a marker is not a precondition");
  // The ordering trap this script exists to avoid.
  assert.strictEqual(stateOf("**NOT CLOSED yet"), "NOT CLOSED", "NOT CLOSED is not read as CLOSED");
  // A marker needs its bold opener; bare prose is not a status claim.
  assert.strictEqual(stateOf("this step is closed in spirit"), "open", "prose is not a marker");

  // The range form, written the way the corpus writes it: once, outside any
  // step body, covering several steps. This is the case the first version
  // missed entirely, so it is asserted against the real shape.
  const ranged = steps(
    [
      "## Step 0 — Done",
      "**CLOSED 2026-08-08.**",
      "## Step 1 — Working",
      "no marker",
      "---",
      "> **FROZEN 2026-08-08 — Steps 2–3 are specified, not being built.**",
      "## Step 2 — Waits",
      "prose only",
      "## Step 3 — Also waits",
      "prose only",
      "## Step 4 — Outside the range",
      "prose only",
    ].join("\n"),
  );
  assert.deepStrictEqual(
    ranged.map((s) => [s.n, s.state]),
    [
      [0, "CLOSED"],
      [1, "open"],
      [2, "FROZEN"],
      [3, "FROZEN"],
      [4, "open"],
    ],
    "a file-level range freezes its steps, and only its steps",
  );

  // A declaration sitting inside Step 1's body still reaches Steps 2–3: the
  // freeze is a fact about the file, not about where the sentence landed.
  assert.strictEqual(ranged[1].state, "open", "the declaring step is not itself frozen by its range");

  // Precedence: a finished step is finished. A range never reopens or refreezes it.
  const closedInsideRange = steps(
    ["> **FROZEN 2026-08-08 — Steps 0–2**", "## Step 0 — Done", "**CLOSED 2026-08-08.**"].join("\n"),
  );
  assert.strictEqual(closedInsideRange[0].state, "CLOSED", "CLOSED outranks a covering freeze");

  // All three dashes are written in this corpus; all three must parse.
  for (const dash of ["–", "—", "-"]) {
    const s = steps([`> **FROZEN 2026-08-08 — Steps 1${dash}2**`, "## Step 1 — x", "prose"].join("\n"));
    assert.strictEqual(s[0].state, "FROZEN", `range parses with U+${dash.codePointAt(0).toString(16)}`);
  }

  console.log("selfcheck OK");
}

if (process.argv.includes("--selfcheck")) {
  selfcheck();
  process.exit(0);
}

const root = process.argv[2] ? path.resolve(process.argv[2]) : REPO;
const width = 58;

const rulingsPath = path.join(root, "RULINGS.md");
const rulings = fs.existsSync(rulingsPath) ? fs.readFileSync(rulingsPath, "utf8") : "";
const rulingExists = (id) => rulings.includes(`**${id}**`);

const blocked = [];
let brokenPrecondition = false;

for (const layer of LAYERS) {
  const file = path.join(root, layer, "BUILD.md");
  if (!fs.existsSync(file)) continue;
  const found = steps(fs.readFileSync(file, "utf8"));
  const tally = { CLOSED: 0, "NOT CLOSED": 0, FROZEN: 0, open: 0 };
  console.log(`\n${layer}`);
  for (const s of found) {
    tally[s.state]++;
    const label = `  Step ${s.n} — ${s.title} `;
    const suffix = s.blockedOn.length ? ` ${s.state} — BLOCKED on ${s.blockedOn.join(", ")}` : ` ${s.state}`;
    console.log(label.padEnd(width, ".") + suffix);
    for (const id of s.blockedOn) {
      if (!rulingExists(id)) {
        console.log(`    PRECONDITION BROKEN — ${id} appears in no RULINGS.md entry`);
        brokenPrecondition = true;
      } else {
        blocked.push(`${layer} Step ${s.n} waits on ${id}`);
      }
    }
  }
  const parts = Object.entries(tally)
    .filter(([, n]) => n)
    .map(([k, n]) => `${n} ${k}`);
  console.log(`  ${layer} — ${parts.join(" · ")} of ${found.length}`);
}

// The NOTES contract — set equality against AGENTS.md's declaration, then the
// heading shape. Both refuse; neither skips.
const agentsPath = path.join(root, "AGENTS.md");
const declared = fs.existsSync(agentsPath) ? declaredNotes(fs.readFileSync(agentsPath, "utf8")) : null;
const notesFaults = [];
if (!declared) {
  notesFaults.push(`AGENTS.md no longer declares which packages carry NOTES.md in a parseable form — the "carry \`NOTES.md\`" sentence`);
} else {
  const present = LAYERS.filter((l) => fs.existsSync(path.join(root, l, "NOTES.md")));
  for (const l of declared) if (!present.includes(l)) notesFaults.push(`AGENTS.md declares ${l}/NOTES.md and no such file exists — a fold that deleted the file without editing the declaration`);
  for (const l of present) if (!declared.includes(l)) notesFaults.push(`${l}/NOTES.md exists and AGENTS.md's deviations sentence does not declare it`);
}

const wants = [];
const notes = [];
for (const layer of declared ?? []) {
  const file = path.join(root, layer, "NOTES.md");
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  for (const l of malformedHeadings(text)) notesFaults.push(`${layer}/NOTES.md has a near-miss heading, silently skipped by the old contract: ${l}`);
  for (const item of openItems(text)) {
    (item.want ? wants : notes).push(`${layer}/NOTES.md — ${item.title}`);
  }
}

if (wants.length) {
  console.log(`\nFOUNDER WANTS — captured, not yet planned into the specs — ${wants.length}:`);
  for (const w of wants) console.log(`  ${w}`);
  console.log(
    `  (Asked for by the founder and deliberately unplanned. A planning session takes these; ` +
      `read the named section before touching the surface it names — some contradict a ruling and need a sitting, not a plan.)`,
  );
}
if (notes.length) {
  console.log(`\nBACKLOG OPEN ITEMS — ${notes.length}:`);
  for (const n of notes) console.log(`  ${n}`);
}

if (blocked.length) {
  console.log(`\nFOUNDER-ACT PRECONDITIONS OPEN — ${blocked.length}:`);
  for (const b of blocked) console.log(`  ${b}`);
  console.log(
    `  (Resolved by the named ruling landing and the step's **Precondition** marker being amended away — ` +
      `the marker is the mechanical arrival point; this report cannot read ratification itself.)`,
  );
}
if (notesFaults.length) {
  console.log(`\nSTATUS FAIL — the NOTES contract:`);
  for (const f of notesFaults) console.log(`  ${f}`);
  console.log(
    `  AGENTS.md's deviations sentence is the declaration this reads; a fold that moves a NOTES.md` +
      `\n  edits that sentence in the same commit, or this reds. The open-item heading is exactly` +
      `\n  \`## Still open — \` with an em-dash — a near-miss is what went silent-green for a fortnight.`,
  );
  process.exit(1);
}
console.log(
  `\nNOTES OK — ${(declared ?? []).length} declared NOTES file(s) (${(declared ?? []).join(", ")}), each present, ` +
    `every open-item heading on contract, ${wants.length} want(s) and ${notes.length} backlog item(s) reported. ` +
    `Scope: package directories only — PR/NOTES.md is not in a package and AGENTS.md's sentence does not govern it.`,
);

if (brokenPrecondition) process.exit(1);
