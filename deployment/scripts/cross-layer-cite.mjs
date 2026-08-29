// CROSS-LAYER-CITE — a citation that NAMES a SCENARIOS.md file and an ID must
// resolve: that file must define that ID.
//
// Why this exists, and why it refuses where `cite-check.mjs` only reports.
// `deployment/SCENARIOS.md` Q3 cited `../harness/SCENARIOS.md Z2` for two days.
// The harness defines no Z family at all — the swap law's Z2 lives in `engine/`,
// and every other site in the corpus says so. It was the citation for the one
// mechanism the four-layer bet is said to rest on, and it resolved to nothing.
//
// Nothing could see it. `gate-coverage.mjs` cross-checks SCENARIOS against BUILD
// *within* a layer and never follows a path out of one. `cite-check.mjs` walks
// prose for bare IDs and deliberately DROPS anything qualified by another layer's
// name — its OWNER filter exists precisely so "harness B2" is not read as a
// deployment ref. That filter is right for bare tokens and is exactly why the
// explicit form fell through: the more precise a citation was written, the less
// any gate looked at it.
//
// So this is a separate script rather than a mode of `cite-check.mjs`, and the
// reason is posture, not tidiness. `cite-check` is ADVISORY because a bare
// `[A-Z]\d+` names at least three registries here and no local heuristic
// separates them. This gate has no heuristic to be wrong about: the citation
// states its own target path. It can therefore REFUSE, and a gate that can refuse
// does not belong behind one that cannot.
//
// The two forms in the corpus, both carried (a survey found both, roughly
// half and half — neither is more correct and normalizing them would be a
// rename with no reader):
//     `../engine/SCENARIOS.md Z2`      the ID inside the backticks
//     `../app/SCENARIOS.md` S6         the ID after them
// Ranges expand: `D22–D23` (en dash) and `Z1-Z3` (hyphen) both check every
// endpoint, since a range whose far end does not exist is the same defect.
//
// WHAT IS NOT CHECKED, deliberately:
//   - whether the cited scenario still SUPPORTS the sentence citing it. Same
//     bound `cite-check.mjs` states: existence is mechanical, aboutness is a
//     reading job. A citation can resolve and still be wrong.
//   - bare IDs with no path. That is `cite-check.mjs`'s job and its noise.
//   - HISTORY. Unlike `cite-check.mjs`, a named-path citation gets no
//     deleted-scenario grace: if you name a file and an ID, the ID must be in
//     that file NOW. Prose recording a deleted scenario names it bare
//     ("the B2 the re-scope deleted"), never through a live path.
//
// Usage:
//   node deployment/scripts/cross-layer-cite.mjs             check every tracked .md
//   node deployment/scripts/cross-layer-cite.mjs --selfcheck assert-based self-test
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

// A definition line: `- **B1 [MUST]** ...`. Same contract `gate-coverage.mjs`
// and `cite-check.mjs` parse — three scripts reading one shape, so a format
// change breaks them together rather than silently sparing one.
export function defined(text) {
  const ids = new Set();
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*-\s*\*\*([A-Z]\d+[a-z]?)\b/);
    if (m) ids.add(m[1]);
  }
  return ids;
}

const ID = String.raw`[A-Z]\d+[a-z]?`;
// `<path>SCENARIOS.md` with the ID inside the backticks or immediately after.
// The path may be empty (a same-directory `SCENARIOS.md`).
const CITE = new RegExp(
  String.raw`\`([^\`\n]*?)SCENARIOS\.md(?:\s+(${ID}(?:[–-]${ID})?))?\`(?:\s+(${ID}(?:[–-]${ID})?))?`,
  "g",
);

// `D22–D23` -> both endpoints. Only the endpoints: the interior of a range is
// not written down anywhere, so asserting it would invent members.
export function endpoints(ref) {
  const parts = ref.split(/[–-]/).filter(Boolean);
  return parts.length === 2 && /^[A-Z]/.test(parts[1]) ? parts : [parts[0]];
}

export function citations(text) {
  const out = [];
  for (const m of text.matchAll(CITE)) {
    const ref = m[2] ?? m[3];
    if (!ref) continue; // a bare file reference names no ID and cannot dangle
    const line = text.slice(0, m.index).split("\n").length;
    for (const id of endpoints(ref)) out.push({ dir: m[1], id, line });
  }
  return out;
}

// ---------------------------------------------------------------------------
// The SPEC-target half (2026-08-29). The corpus's densest citation form is
// `engine/SPEC.md §1.12`, and until now nothing resolved it — a plan claiming
// this gate as proof for SPEC-target citations took a Codex BLOCKER for it.
//
// THE TRAP, and it has claimed three automated checkers already: **`§6.5` means
// item 5 of §6's numbered list, not a subsection.** `engine/SPEC.md` says so in
// its own header, and all three checkers that resolved `§N.M` against headings
// alone filed the same false phantom. So the resolution order is: a heading
// carrying the ref, THEN item M of §N's numbered list, and only a ref that is
// neither is a failure. The positive assertion — a numbered-list item resolving
// — is the selfcheck line that must never be dropped for brevity.
//
// NOT CHECKED here, and stated rather than silently skipped: a NAMED section
// ref (`§Law tiers`, `§Guardrails`). In prose a name has no closing delimiter,
// so any matcher for one guesses where the name ends, and a wrong guess is a
// false red on a correct citation — the exact class this comment opens with.
// The numeric form is the dense one and it is the one resolved.
const SPEC_FILES = String.raw`(?:SPEC|EVALS|INTERFACES|BUILD)`;
const SREF = String.raw`\d+(?:\.\d+)?[a-z]?`;
const SPEC_CITE = new RegExp(
  String.raw`\`([^\`\n]*?)(${SPEC_FILES})\.md(?:\s+§(${SREF}))?\`(?:\s+§(${SREF}))?`,
  "g",
);

// Every section ref a heading declares.
//
// THE SECOND TRAP, found by running this against the corpus before trusting it:
// **the § sigil is not written in headings everywhere.** `engine/` and
// `deployment/` write `## §1.` and `### §1.7a`; `harness/` and `model/` write
// `## 1.` and `### 3.4`, with no sigil at all. Citations use `§` uniformly in
// both directions. A matcher that required the sigil in the heading reported
// 464 dangling citations against a corpus with none — a fourth false phantom,
// caught here only because the first live run was read instead of assumed.
// So the sigil is optional, and the ref is anchored to the START of the heading
// text, where a section number is, rather than found anywhere inside it.
const HEAD_REF = String.raw`^(#{1,6})\s+§?(${SREF})[.\s]`;

export function headingRefs(text) {
  const refs = new Set();
  for (const line of text.split("\n")) {
    const m = line.match(new RegExp(HEAD_REF));
    if (m) refs.add(m[2]);
  }
  return refs;
}

// Item M of §N's numbered list — the form the trap is about. The section runs
// from its own heading to the next heading at the same depth or shallower, so a
// `###` subsection's list does not leak into its parent's item numbering.
export function listItem(text, section, item) {
  const lines = text.split("\n");
  const head = new RegExp(String.raw`^(#{1,6})\s+§?${section.replace(".", "\\.")}[.\s]`);
  let start = -1;
  let depth = 0;
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(head);
    if (m) {
      start = i + 1;
      depth = m[1].length;
      break;
    }
  }
  if (start === -1) return false;
  for (let i = start; i < lines.length; i++) {
    const h = lines[i].match(/^(#{1,6})\s+/);
    if (h && h[1].length <= depth) break;
    if (new RegExp(String.raw`^${item}\.\s`).test(lines[i])) return true;
  }
  return false;
}

export function resolveRef(text, ref) {
  if (headingRefs(text).has(ref)) return true;
  const m = ref.match(/^(\d+)\.(\d+)$/);
  return m ? listItem(text, m[1], m[2]) : false;
}

export function specCitations(text) {
  const out = [];
  for (const m of text.matchAll(SPEC_CITE)) {
    const ref = m[3] ?? m[4];
    if (!ref) continue; // a bare file reference names no section and cannot dangle
    const line = text.slice(0, m.index).split("\n").length;
    out.push({ dir: m[1], file: `${m[2]}.md`, ref, line });
  }
  return out;
}

if (process.argv.includes("--selfcheck")) {
  assert.deepStrictEqual([...defined("- **Z2 [MUST]** x\nprose Z9")], ["Z2"]);

  const ids = (t) => citations(t).map((c) => `${c.dir}|${c.id}`);
  assert.deepStrictEqual(ids("see `../engine/SCENARIOS.md Z2` now"), ["../engine/|Z2"], "ID inside the backticks");
  assert.deepStrictEqual(ids("see `../app/SCENARIOS.md` S6 now"), ["../app/|S6"], "ID after the backticks");
  assert.deepStrictEqual(ids("`SCENARIOS.md` I3"), ["|I3"], "a same-directory path is empty, not absent");
  assert.deepStrictEqual(ids("`../harness/SCENARIOS.md` D22–D23"), ["../harness/|D22", "../harness/|D23"], "en-dash range");
  assert.deepStrictEqual(ids("`../app/SCENARIOS.md` Z1-Z3"), ["../app/|Z1", "../app/|Z3"], "hyphen range");
  assert.deepStrictEqual(ids("the whole of `../security/SCENARIOS.md`"), [], "a bare file ref names no ID");
  assert.deepStrictEqual(ids("`../engine/SPEC.md` §7.1"), [], "only SCENARIOS.md is resolved here");

  // The negative that matters: the real defect this was written for.
  const harness = defined("- **L5 [MUST]** x\n- **D22 [MUST]** y");
  assert.ok(!harness.has("Z2"), "the harness defines no Z2 — the 2026-08-08 phantom");

  // --- the SPEC-target half ---
  const srefs = (t) => specCitations(t).map((c) => `${c.dir}${c.file}|${c.ref}`);
  assert.deepStrictEqual(srefs("see `../engine/SPEC.md §1.12` now"), ["../engine/SPEC.md|1.12"], "§ inside the backticks");
  assert.deepStrictEqual(srefs("see `../app/SPEC.md` §5 now"), ["../app/SPEC.md|5"], "§ after the backticks");
  assert.deepStrictEqual(srefs("`../model/EVALS.md` §3"), ["../model/EVALS.md|3"], "EVALS is a SPEC-family target");
  assert.deepStrictEqual(srefs("`../harness/INTERFACES.md §7.1`"), ["../harness/INTERFACES.md|7.1"], "and so is INTERFACES");
  assert.deepStrictEqual(srefs("the whole of `../security/SPEC.md`"), [], "a bare file ref names no section");
  assert.deepStrictEqual(srefs("`../app/SPEC.md` §Law tiers"), [], "a NAMED section is out of scope, not a failure");

  const doc = [
    "## §0. What this is",
    "### §1.7a A subsection with a letter",
    "## §6. Items",
    "1. **First.** x",
    "2. **Second.** y",
    "3. **Third.** z",
    "4. **Fourth.** w",
    "5. **Fifth.** v",
    "## §7. After",
    "1. **Only one here.** q",
  ].join("\n");
  assert.deepStrictEqual([...headingRefs(doc)].sort(), ["0", "1.7a", "6", "7"], "heading refs, letters included");
  // The sigil is optional in headings and mandatory in citations — the corpus
  // writes `## §1.` in engine/ and deployment/ and `## 1.` in harness/ and
  // model/. Requiring it reported 464 phantoms; this pair is why.
  const unsigiled = "## 3. The object model\n### 3.4 Commitment — the atom\n1. **First.** x\n2. **Second.** y";
  assert.deepStrictEqual([...headingRefs(unsigiled)].sort(), ["3", "3.4"], "a heading with no § sigil still declares its ref");
  assert.ok(resolveRef(unsigiled, "3.4"), "and a citation of it resolves");
  assert.ok(!headingRefs("Prose mentioning 3.4 mid-sentence").size, "a number in prose is not a heading ref");
  assert.ok(resolveRef(doc, "0"), "a plain heading resolves");
  assert.ok(resolveRef(doc, "1.7a"), "a lettered subsection heading resolves");
  // THE ASSERTION THAT MUST NEVER BE DROPPED. Three checkers filed this as a
  // phantom-section bug and were wrong all three times.
  assert.ok(resolveRef(doc, "6.5"), "§6.5 resolves to item 5 of §6's numbered list — NOT a phantom");
  assert.ok(!resolveRef(doc, "6.9"), "but item 9 of a five-item list does not exist");
  assert.ok(!resolveRef(doc, "7.2"), "and §7's list stops at one — an item count is not shared between sections");
  assert.ok(!resolveRef(doc, "9"), "a section no heading carries fails");
  assert.ok(!listItem(doc, "1.7a", "1"), "a section with no numbered list has no items to resolve against");

  console.log("\nselfcheck OK");
  process.exit(0);
}

const tracked = execFileSync("git", ["ls-files", "-z", "*.md"], { encoding: "utf8", maxBuffer: 1 << 28 })
  .split("\0")
  .filter(Boolean);

const cache = new Map();
const idsAt = (rel) => {
  if (!cache.has(rel)) {
    const abs = path.join(ROOT, rel);
    cache.set(rel, fs.existsSync(abs) ? defined(fs.readFileSync(abs, "utf8")) : null);
  }
  return cache.get(rel);
};

// Two resolution bases, because `AGENTS.md` §Citation conventions says the
// corpus mixes them: "Some resolve only from the repo root, not from the citing
// file's directory." `PR/BRIEF.md` writes `harness/SCENARIOS.md` and means the
// repo root; `harness/SPEC.md` writes `../engine/SCENARIOS.md` and means
// relative. Trying relative first and root second resolves both without
// forcing a rename across the corpus — a gate that demanded one form would be
// enforcing a convention nobody ruled.
const resolve = (file, dir) => {
  const rel = path.normalize(path.join(path.dirname(file), dir, "SCENARIOS.md"));
  if (idsAt(rel) !== null) return rel;
  const fromRoot = path.normalize(path.join(dir, "SCENARIOS.md"));
  return idsAt(fromRoot) !== null ? fromRoot : rel;
};

const dangling = [];
let checked = 0;
for (const file of tracked) {
  for (const { dir, id, line } of citations(fs.readFileSync(path.join(ROOT, file), "utf8"))) {
    const target = resolve(file, dir);
    const ids = idsAt(target);
    checked++;
    if (ids === null) dangling.push(`${file}:${line} cites ${target} — no such file`);
    else if (!ids.has(id)) dangling.push(`${file}:${line} cites ${id} in ${target}, which defines no such scenario`);
  }
}

// The SPEC-target pass. Same two resolution bases, for the same reason.
const textCache = new Map();
const textAt = (rel) => {
  if (!textCache.has(rel)) {
    const abs = path.join(ROOT, rel);
    textCache.set(rel, fs.existsSync(abs) ? fs.readFileSync(abs, "utf8") : null);
  }
  return textCache.get(rel);
};
const resolveSpec = (file, dir, name) => {
  const rel = path.normalize(path.join(path.dirname(file), dir, name));
  if (textAt(rel) !== null) return rel;
  const fromRoot = path.normalize(path.join(dir, name));
  return textAt(fromRoot) !== null ? fromRoot : rel;
};

let specChecked = 0;
for (const file of tracked) {
  for (const { dir, file: name, ref, line } of specCitations(fs.readFileSync(path.join(ROOT, file), "utf8"))) {
    const target = resolveSpec(file, dir, name);
    const text = textAt(target);
    specChecked++;
    if (text === null) dangling.push(`${file}:${line} cites ${target} — no such file`);
    else if (!resolveRef(text, ref)) dangling.push(`${file}:${line} cites §${ref} in ${target}, which carries no such section and no such numbered item`);
  }
}

if (dangling.length) {
  console.log(`\nCROSS-LAYER-CITE FAIL — ${dangling.length} citation(s) name something their target does not carry:`);
  for (const d of dangling) console.log(`    ${d}`);
  console.log(`\n  A citation that names its own path has no ambiguity to hide behind. Either the ID`);
  console.log(`  moved and the path is stale, or the path is right and the family lives elsewhere.`);
  console.log(`  For a §ref: remember §N.M is item M of §N's numbered list, not a subsection — this`);
  console.log(`  gate resolves both, so a failure here is a real dangler, not the phantom three`);
  console.log(`  earlier checkers filed.`);
  process.exit(1);
}
console.log(
  `\nCROSS-LAYER-CITE OK — ${checked} path-qualified scenario citation(s) and ${specChecked} SPEC-target §citation(s), every one resolving.` +
    `\n  NOT CHECKED: whether the cited section still SUPPORTS the sentence — existence is mechanical, aboutness is a reading job;` +
    `\n  and NAMED section refs (§Law tiers), which have no closing delimiter in prose and whose matcher would red correct citations.`,
);
