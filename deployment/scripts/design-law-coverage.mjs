// DESIGN-LAW-COVERAGE — every section of `app/DESIGN.md` is accounted for by
// `app/BUILD.md`: either a build step is gated on it, or BUILD says in words why
// no step is. A section that appears in neither is law nothing is ever checked against.
//
// Why this exists. `app/DESIGN.md` gates BUILD steps 1–3 by human review, and each of
// those steps names the sections its checklist covers — by hand. On 2026-08-09 three
// normative sections landed in one sitting (§Shapes, §Colour, §Typography) and the
// checklists were never widened, so all three gated nothing. Nobody could see it: every
// gate in this folder compares a document to a **countable fact**, and no gate compared
// one document's sections to another document's coverage of them.
//
// This is a design-system-growth defect and it recurs by construction. The remaining
// UI/UX phases each add a section — motion, iconography, the catalog's node specs — and
// each will land the same way unless something refuses. `TDD.md` is explicit that design
// law is *"a human checklist, not a test suite"*, which is right about the JUDGEMENT and
// says nothing about whether the checklist is complete. Completeness is countable, so
// it is gated; whether a reviewer judged well is not, and is not.
//
// THE MATCH IS `§Name`, and it is deliberately strict. BUILD must name a section the way
// the corpus cites one, so a passing match is a real reference a reader can follow rather
// than an English word colliding by luck — "Console" and "Language" would both match bare
// prose in almost any paragraph.
//
// The heading is normalized to its citable stem: everything before the first ` — ` or
// ` (`. So `## Glass — one glass, three densities ("breathing glass")` is cited `§Glass`,
// and `## Shapes (added 2026-08-09)` is cited `§Shapes`. That mirrors how the corpus
// already cites them and means a section can gain a dated parenthetical without
// reddening a gate.
//
// WHAT THIS CANNOT CHECK: whether the review actually happened, whether the reviewer
// applied the section, or whether BUILD's stated reason for exempting a section is a
// good one. It proves every section is ACCOUNTED FOR — that no design law is silently
// ungated — and the accounting is what went missing.
//
// Usage:
//   node deployment/scripts/design-law-coverage.mjs             check
//   node deployment/scripts/design-law-coverage.mjs --selfcheck assert-based self-test
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const LAW = "app/DESIGN.md";
const BUILD = "app/BUILD.md";

// One matcher for both sides, so the selfcheck cannot pass on an engine the real
// pass does not use.
export function sections(text) {
  const out = [];
  text.split("\n").forEach((line, i) => {
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (!m) return;
    const stem = m[1].split(" — ")[0].split(" (")[0].trim();
    if (stem) out.push({ stem, line: i + 1 });
  });
  return out;
}

export const cited = (buildText, stem) => buildText.includes(`§${stem}`);

if (process.argv.includes("--selfcheck")) {
  assert.deepStrictEqual(sections("## Console").map((s) => s.stem), ["Console"], "plain heading");
  assert.deepStrictEqual(sections("## Shapes (added 2026-08-09)").map((s) => s.stem), ["Shapes"], "parenthetical stripped");
  assert.deepStrictEqual(
    sections('## Glass — one glass, three densities ("breathing glass")').map((s) => s.stem),
    ["Glass"],
    "em-dash subtitle stripped",
  );
  assert.deepStrictEqual(sections("### Two gravities").map((s) => s.stem), [], "h3 is not a section");
  assert.deepStrictEqual(sections("# annnä App — DESIGN").map((s) => s.stem), [], "h1 is not a section");
  assert.strictEqual(sections("x\n## Colour")[0].line, 2, "line number is 1-indexed");

  assert.ok(cited("design-law checklist (§Colour)", "Colour"), "the § form matches");
  assert.ok(!cited("the colour of the board", "Colour"), "bare prose does not match — the point of requiring §");
  assert.ok(!cited("§Colours", "Colour") === false, "§Colours contains §Colour — prefix match is accepted, see header");

  // The negative that matters: the real 2026-08-09 defect.
  const law = sections("## Appearance (the skin model)\n## Shapes (added 2026-08-09)\n## Colour (added 2026-08-09)");
  const buildBefore = "design-law checklist (board laws, islands, photo rules, §Appearance)";
  const missing = law.filter((s) => !cited(buildBefore, s.stem)).map((s) => s.stem);
  assert.deepStrictEqual(missing, ["Shapes", "Colour"], "sections that landed without a checklist are caught");

  console.log("\nselfcheck OK");
  process.exit(0);
}

const lawText = fs.readFileSync(path.join(ROOT, LAW), "utf8");
const buildText = fs.readFileSync(path.join(ROOT, BUILD), "utf8");

const found = sections(lawText);
const ungated = found.filter((s) => !cited(buildText, s.stem));

if (ungated.length) {
  console.log(`\nDESIGN-LAW-COVERAGE FAIL — ${ungated.length} section(s) of ${LAW} that ${BUILD} never names:`);
  for (const s of ungated) console.log(`    ${LAW}:${s.line}  §${s.stem}`);
  console.log(`\n  Every section is either gated by a build step or explicitly exempted in ${BUILD},`);
  console.log(`  cited as §Name. A section named nowhere is visual law no build is ever checked`);
  console.log(`  against — which is how §Shapes, §Colour and §Typography landed unchecked in one day.`);
  process.exit(1);
}
console.log(`\nDESIGN-LAW-COVERAGE OK — ${found.length} section(s) of ${LAW}, every one named by ${BUILD}`);
console.log(`  NOT CHECKED: whether the review happened or was done well. Completeness is countable;`);
console.log(`  judgement is not, and TDD.md keeps it a human checklist deliberately.`);
