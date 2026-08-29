// HEX-SOURCE — every colour in the corpus answers to something. A hex literal in
// tracked markdown must appear in a shipped pack's `palette.json` or in the pipeline
// that builds them (`assets/make-pack.mjs`), or declare itself a derived value.
//
// Why this exists. `app/DESIGN.md` §Colour was written on 2026-08-09 to close a real
// defect: the urgency triad lived only in `make-pack.mjs` and was named in no spec.
// The section that fixed it introduced two hexes of its own — `#a3231b` and `#e0736a` —
// attributed to `PR/BRAND.md`, which does not contain them, and which no palette
// contains either. They had been carried in from a draft outside the repo. **Three
// unsourced-value errors were made in a single sitting, inside the section whose entire
// subject is that values must be sourced.** Prose did not stop it; the sweep found it
// four hours later by hand.
//
// `PR/BRAND.md` already carried the rule — *"No hex may appear in brand material that
// is not in that file"* — and nothing enforced it, so it bound exactly as far as the
// author's memory. This is that rule, made mechanical and widened from brand material
// to the corpus.
//
// ONLY BACKTICKED HEXES ARE READ, and that is a discovered convention rather than an
// imposed one: a survey of every tracked `.md` found every colour written as `` `#rrggbb` ``
// and the one non-colour — `#550453`, a PADI instructor number in a user story — written
// bare. Scanning backticks costs nothing and the false positive disappears with it.
// A colour written bare is invisible to this gate; that is the price of not flagging
// every six-digit number in the corpus, and it is stated rather than hidden.
//
// THE DERIVED ESCAPE, and why it is per-line. A value computed by a stated rule is not
// authored and cannot be in a palette — §Colour's per-skin urgency marks are the worked
// output of its own derivation. Those lines carry `<!--derived-->`. The marker is
// per-line, never per-section, because a section-wide exemption would have covered the
// two invented hexes as readily as the three real ones.
//
// WHAT THIS CANNOT CHECK, deliberately: whether a value marked derived is *correctly*
// derived. That needs the derivation re-run against four photographs, which is
// `make-pack.mjs`'s job and not a static gate's. This proves a value is DECLARED
// derived rather than quietly authored — which is the whole of the defect it was
// written for.
//
// Usage:
//   node deployment/scripts/hex-source.mjs             check every tracked .md
//   node deployment/scripts/hex-source.mjs --selfcheck assert-based self-test
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

const DERIVED = "<!--derived-->";

// The one matcher, exported so the selfcheck cannot drift onto a different engine
// from the real pass — the failure that left `x1-secret-grep.mjs` matching nothing
// while its selfcheck passed, because POSIX ERE has no `\b` and the fixture built a
// JS RegExp from the same string.
export function hexesIn(text) {
  const out = [];
  text.split("\n").forEach((line, i) => {
    if (line.includes(DERIVED)) return;
    for (const m of line.matchAll(/`(#[0-9a-fA-F]{6})`/g)) {
      out.push({ hex: m[1].toLowerCase(), line: i + 1 });
    }
  });
  return out;
}

export function known(palettes, pipelineText) {
  const s = new Set();
  for (const p of palettes) {
    for (const d of p.dominants ?? []) if (d.hex) s.add(d.hex.toLowerCase());
    for (const v of Object.values(p.semantic ?? {})) if (v) s.add(v.toLowerCase());
    for (const k of ["accent", "accentDeep"]) if (p[k]) s.add(p[k].toLowerCase());
    for (const k of ["ambientDark", "ambientLight"]) for (const v of p[k] ?? []) s.add(v.toLowerCase());
  }
  for (const m of (pipelineText ?? "").matchAll(/#[0-9a-fA-F]{6}/g)) s.add(m[0].toLowerCase());
  return s;
}

if (process.argv.includes("--selfcheck")) {
  // the matcher
  assert.deepStrictEqual(hexesIn("the accent is `#c46d00` here").map((h) => h.hex), ["#c46d00"], "backticked hex is read");
  assert.deepStrictEqual(hexesIn("PADI Instructor #550453."), [], "a bare six-digit number is not a colour");
  assert.deepStrictEqual(hexesIn("yields `#789b8e` " + DERIVED).map((h) => h.hex), [], "a derived line is exempt");
  assert.deepStrictEqual(hexesIn("`#AABBCC`").map((h) => h.hex), ["#aabbcc"], "case is normalized");
  assert.deepStrictEqual(hexesIn("a `#112233` and `#445566`").length, 2, "two on one line");
  assert.strictEqual(hexesIn("x\ny\n`#010203`")[0].line, 3, "line number is 1-indexed");

  // the source set
  const pal = [{ dominants: [{ hex: "#E18620" }], semantic: { Vibrant: "#e18620", Muted: null }, accent: "#c46d00", accentDeep: null, ambientDark: ["#002b2c"], ambientLight: [] }];
  const k = known(pal, 'const URGENCY = ["#b5ead7"];');
  assert.ok(k.has("#e18620") && k.has("#c46d00") && k.has("#002b2c"), "palette hexes are sourced");
  assert.ok(k.has("#b5ead7"), "pipeline constants are sourced");
  assert.ok(!k.has("#a3231b"), "the 2026-08-09 invented hex is in no source");

  // the negative that matters: the real defect, end to end.
  const offences = hexesIn("The one exception is `bad` — `#a3231b` on light, already in `PR/BRAND.md`")
    .filter((h) => !k.has(h.hex));
  assert.strictEqual(offences.length, 1, "an invented hex attributed to a file that lacks it is caught");
  assert.strictEqual(offences[0].hex, "#a3231b");

  console.log("\nselfcheck OK");
  process.exit(0);
}

const palettes = fs
  .readdirSync(path.join(ROOT, "assets/packs"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, "assets/packs", d.name, "palette.json")))
  .map((d) => JSON.parse(fs.readFileSync(path.join(ROOT, "assets/packs", d.name, "palette.json"), "utf8")));

const pipeline = path.join(ROOT, "assets/make-pack.mjs");
const sourced = known(palettes, fs.existsSync(pipeline) ? fs.readFileSync(pipeline, "utf8") : "");

const tracked = execFileSync("git", ["ls-files", "-z", "*.md"], { encoding: "utf8", maxBuffer: 1 << 28 })
  .split("\0")
  .filter(Boolean);

const unsourced = [];
let checked = 0;
for (const file of tracked) {
  for (const { hex, line } of hexesIn(fs.readFileSync(path.join(ROOT, file), "utf8"))) {
    checked++;
    if (!sourced.has(hex)) unsourced.push(`${file}:${line} ${hex}`);
  }
}

if (unsourced.length) {
  console.log(`\nHEX-SOURCE FAIL — ${unsourced.length} colour(s) answer to nothing:`);
  for (const u of unsourced) console.log(`    ${u}`);
  console.log(`\n  A colour is legitimate three ways: it is in a shipped pack's palette.json, it is a`);
  console.log(`  constant in assets/make-pack.mjs, or its line carries ${DERIVED} because a stated`);
  console.log(`  rule computes it. A hex that is none of those was authored by hand and attributed`);
  console.log(`  by memory — which is exactly how #a3231b entered a section about sourcing colours.`);
  process.exit(1);
}
console.log(`\nHEX-SOURCE OK — ${checked} backticked hex(es) in ${tracked.length} tracked .md, every one sourced`);
console.log(`  NOT CHECKED: whether a value marked ${DERIVED} is correctly derived, or a colour written`);
console.log(`  without backticks. Both are stated bounds, not oversights — see the header.`);
