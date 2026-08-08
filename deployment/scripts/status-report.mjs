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

import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LAYERS = ["deployment", "harness", "engine", "app", "model", "security", "marketplace"];
const HEADING = /^## Step (\d+) — (.*)$/;

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
    const state = stateOf(s.body.join("\n"));
    // A range freezes only what has not already declared itself finished.
    return { n: s.n, title: s.title, state: state === "open" && isFrozen(s.n) ? "FROZEN" : state };
  });
}

function selfcheck() {
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
      { n: 0, title: "The spec/code boundary", state: "CLOSED" },
      { n: 1, title: "Landing law", state: "NOT CLOSED" },
      { n: 2, title: "The rung ladder", state: "open" },
      { n: 3, title: "Frozen work", state: "FROZEN" },
    ],
    "number, title and all four states parse",
  );
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

for (const layer of LAYERS) {
  const file = path.join(root, layer, "BUILD.md");
  if (!fs.existsSync(file)) continue;
  const found = steps(fs.readFileSync(file, "utf8"));
  const tally = { CLOSED: 0, "NOT CLOSED": 0, FROZEN: 0, open: 0 };
  console.log(`\n${layer}`);
  for (const s of found) {
    tally[s.state]++;
    const label = `  Step ${s.n} — ${s.title} `;
    console.log(label.padEnd(width, ".") + ` ${s.state}`);
  }
  const parts = Object.entries(tally)
    .filter(([, n]) => n)
    .map(([k, n]) => `${n} ${k}`);
  console.log(`  ${layer} — ${parts.join(" · ")} of ${found.length}`);
}
