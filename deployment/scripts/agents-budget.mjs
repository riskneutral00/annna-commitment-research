// AGENTS-BUDGET — AGENTS.md is every session's first read, so its length is a
// cost every reader pays at every session start. This is the ratchet that bounds it.
//
// It lived inside `doc-count-check.mjs` until 2026-08-08. That file is otherwise
// about how many markdown files the corpus claims to have — a different concern,
// and it meant "raise the ceiling on purpose" required editing a script whose
// name says nothing about ceilings. One gate, one concern.
//
// THE CEILING IS A RATCHET, NOT A TARGET. It can only be raised by a deliberate
// one-line diff here, which forces "what did I delete?" to be answered before
// anything is added. That mechanic is deliberately unchanged; what changed is
// what it is measured against.
//
// Why this order of magnitude and not 1500. The old ceiling bounded the whole file, and 45% of the
// whole file was `## The one green command` — a walkthrough of what each gate
// does, needed once while debugging a red gate and paid for on every turn since.
// It moved to `deployment/README.md`, where the gates it describes already live.
// What remains is the per-turn content: authority order, citation conventions
// that cause real misreads, the ruling vocabularies, package shape, the standing
// constraints. A tighter ceiling over a smaller file is a STRONGER forcing
// function, not a looser one — it now bites on the content that actually costs.
//
// The failure mode this is meant to prevent, stated because it is what happened
// under the old number: at the margin a ceiling rewards COMPRESSING rather than
// DELETING. Three times in one session the answer to going over was "shorten the
// newest paragraph", which leaves the substance and removes the readability. If
// you are over, prefer moving a whole section to the file that owns its subject
// over squeezing sentences. That is what the 2026-08-08 split did.
//
// Usage:
//   node deployment/scripts/agents-budget.mjs             check
//   node deployment/scripts/agents-budget.mjs --selfcheck assert-based self-test
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// Ratcheted 950 → 935 on 2026-08-29, to the MEASURED landed count after the
// consolidation wave, per the rule on the line above: spare that is never
// claimed is spare the next session spends on one more sentence. The number is
// what the file actually weighs, not a target with room in it — which is the
// whole difference between a ratchet and a budget.
const CEILING = 935;

export const countWords = (text) => text.split(/\s+/).filter(Boolean).length;

if (process.argv.includes("--selfcheck")) {
  assert.strictEqual(countWords("one two three"), 3);
  assert.strictEqual(countWords("  leading and trailing  \n\n"), 3, "blank runs are not words");
  assert.strictEqual(countWords(""), 0);
  assert.ok(countWords("a ".repeat(CEILING + 1)) > CEILING, "the ceiling is exceedable — a bound nothing can cross is not a bound");
  console.log("\nselfcheck OK");
}

const words = countWords(fs.readFileSync(path.join(ROOT, "AGENTS.md"), "utf8"));
if (words > CEILING) {
  console.log(`\nAGENTS-BUDGET FAIL — AGENTS.md is ${words} words, over the ${CEILING}-word ceiling.`);
  console.log(`  Move a section to the file that owns its subject, or delete. Raising CEILING in`);
  console.log(`  this script is legal and deliberate — but answer "what did I delete?" first.`);
  process.exit(1);
}
console.log(`\nAGENTS-BUDGET OK — AGENTS.md ${words}/${CEILING} words (${CEILING - words} to spare)`);
